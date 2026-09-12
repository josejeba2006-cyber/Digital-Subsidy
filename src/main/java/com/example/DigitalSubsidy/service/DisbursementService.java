package com.example.DigitalSubsidy.service;

import com.example.DigitalSubsidy.entity.*;
import com.example.DigitalSubsidy.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DisbursementService {

    @Autowired
    DisbursementRepo repository;
    @Autowired
    ApplicationRepo applicationrepo;
    @Autowired
    BankDetailsRepo bankDetailsRepo;
    @Autowired
    EmailService emailService;
    @Autowired
    RegionalAllocationRepo regionalAllocationRepo;
    @Autowired
    InstallmentPlanRepo installmentPlanRepo;


    public List<Disbursement> getAllDisbursements() {
        return repository.findAll();
    }

    public Disbursement getDisbursementById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public void deleteDisbursement(Long id) {
        repository.deleteById(id);
    }
    public Disbursement createDisbursement(
            Disbursement disbursement) {

        Long applicationId =
                disbursement.getApplication().getId();


        // ================= APPLICATION =================

        Application application =
                applicationrepo.findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found"
                                ));


        // Application must be approved

        if (!"APPROVED".equals(application.getStatus())) {

            throw new RuntimeException(
                    "Disbursement allowed only for approved applications"
            );
        }


        // ================= BANK DETAILS =================

        BankDetails bankDetails =
                bankDetailsRepo
                        .findByApplicationId(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Bank details not submitted"
                                )
                        );


        // Bank details must be verified

        if (!"VERIFIED".equals(
                bankDetails.getVerificationStatus())) {

            throw new RuntimeException(
                    "Bank details are not verified"
            );
        }


        // ================= INSTALLMENT VALIDATION =================

        if (disbursement.getInstallmentNumber() == null) {

            throw new RuntimeException(
                    "Installment number is required"
            );
        }


        // Find installment plan

        InstallmentPlan plan =
                installmentPlanRepo
                        .findByApplicationIdAndInstallmentNumber(
                                applicationId,
                                disbursement.getInstallmentNumber()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Installment plan not found"
                                )
                        );


        // Installment must be AVAILABLE

        if (!"AVAILABLE".equals(plan.getStatus())) {

            throw new RuntimeException(
                    "Installment is not available for disbursement"
            );
        }


        // Use installment plan amount

        Double installmentAmount =
                plan.getAmount();


        if (installmentAmount == null
                || installmentAmount <= 0) {

            throw new RuntimeException(
                    "Invalid installment amount"
            );
        }


        // Set the actual installment amount

        disbursement.setAmount(
                installmentAmount
        );


        // ================= DUPLICATE CHECK =================

        boolean installmentAlreadyPaid =
                repository
                        .findByApplicationId(applicationId)
                        .stream()
                        .anyMatch(d ->
                                disbursement
                                        .getInstallmentNumber()
                                        .equals(
                                                d.getInstallmentNumber()
                                        )
                        );


        if (installmentAlreadyPaid) {

            throw new RuntimeException(
                    "This installment has already been disbursed"
            );
        }


        // ================= REGIONAL BUDGET =================

        String region =
                application.getUser().getLocation();


        RegionalAllocation allocation =
                regionalAllocationRepo
                        .findBySchemeId(
                                application.getScheme().getId()
                        )
                        .stream()
                        .filter(a ->
                                a.getRegion()
                                        .equalsIgnoreCase(region)
                        )
                        .findFirst()
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Regional allocation not found"
                                )
                        );


        Double remainingBudget =
                allocation.getAllocatedBudget()
                        - allocation.getUsedBudget();


        if (installmentAmount
                > remainingBudget) {

            throw new RuntimeException(
                    "Insufficient regional budget"
            );
        }


        // ================= SET PAYMENT DETAILS =================

        disbursement.setApplication(
                application
        );


        disbursement.setPaymentStatus(
                "PAID"
        );


        disbursement.setDisbursementDate(
                java.time.LocalDate.now()
        );


        disbursement.setTransactionReference(
                "TXN" + System.currentTimeMillis()
        );


        // ================= SAVE PAYMENT =================

        Disbursement savedDisbursement =
                repository.save(disbursement);


        // ================= UPDATE REGIONAL BUDGET =================

        allocation.setUsedBudget(
                allocation.getUsedBudget()
                        + installmentAmount
        );


        regionalAllocationRepo.save(
                allocation
        );


        // ================= UPDATE INSTALLMENT =================

        // Current installment → PAID

        plan.setStatus(
                "PAID"
        );

        installmentPlanRepo.save(
                plan
        );
        // If final installment is paid,
// application is fully disbursed

        if (Integer.valueOf(3).equals(
                plan.getInstallmentNumber())) {

            application.setStatus("DISBURSED");
        }

        applicationrepo.save(application);


        // ================= UNLOCK NEXT INSTALLMENT =================

        Integer nextInstallmentNumber =
                plan.getInstallmentNumber() + 1;


        installmentPlanRepo
                .findByApplicationIdAndInstallmentNumber(
                        applicationId,
                        nextInstallmentNumber
                )
                .ifPresent(nextPlan -> {

                    nextPlan.setStatus(
                            "AVAILABLE"
                    );

                    installmentPlanRepo.save(
                            nextPlan
                    );
                });



        // ================= EMAIL =================

        emailService.sendPaymentDisbursedEmail(

                application.getUser().getEmailId(),

                application.getUser().getFirstName(),

                application.getScheme().getSchemeName(),
                savedDisbursement.getInstallmentNumber(),

                savedDisbursement.getAmount()
        );


        return savedDisbursement;
    }
}