package com.example.DigitalSubsidy.service;

import com.example.DigitalSubsidy.entity.Application;
import com.example.DigitalSubsidy.entity.BankDetails;
import com.example.DigitalSubsidy.entity.InstallmentPlan;
import com.example.DigitalSubsidy.repository.ApplicationRepo;
import com.example.DigitalSubsidy.repository.BankDetailsRepo;

import com.example.DigitalSubsidy.repository.GrantSlabRepo;
import com.example.DigitalSubsidy.repository.InstallmentPlanRepo;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BankDetailsService {

    @Autowired
    BankDetailsRepo bankDetailsRepo;

    @Autowired
    ApplicationRepo applicationRepo;

    @Autowired
    EmailService emailService;

    @Autowired
    ComplianceMilestoneService complianceMilestoneService;
    @Autowired
    InstallmentPlanRepo installmentPlanRepo;
    @Autowired
    InstallmentPlanService installmentPlanService;
    @Autowired
    GrantSlabRepo grantSlabRepo;

    // User submits bank details
    public BankDetails createBankDetails(
            BankDetails bankDetails) {

        Long applicationId =
                bankDetails.getApplication().getId();


        Application application =
                applicationRepo.findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found"
                                )
                        );


        // Only approved application can submit bank details
        if (!"DISTRICT_APPROVED".equals(application.getStatus())) {
            throw new RuntimeException(
                    "Bank details can be submitted only after district approval"
            );
        }


        BankDetails existingBankDetails =
                bankDetailsRepo
                        .findByApplicationId(applicationId)
                        .orElse(null);


        // Bank details already exist
        if (existingBankDetails != null) {

            // Allow resubmission only after rejection
            if (!"REJECTED".equals(
                    existingBankDetails.getVerificationStatus())) {

                throw new RuntimeException(
                        "Bank details already submitted"
                );
            }


            // Update rejected bank details

            existingBankDetails.setAccountHolderName(
                    bankDetails.getAccountHolderName()
            );

            existingBankDetails.setBankName(
                    bankDetails.getBankName()
            );

            existingBankDetails.setAccountNumber(
                    bankDetails.getAccountNumber()
            );

            existingBankDetails.setIfscCode(
                    bankDetails.getIfscCode()
            );

            existingBankDetails.setBranchName(
                    bankDetails.getBranchName()
            );


            // Send again for officer verification

            existingBankDetails.setVerificationStatus(
                    "PENDING"
            );


            return bankDetailsRepo.save(
                    existingBankDetails
            );
        }


        // First time submission

        bankDetails.setApplication(application);

        bankDetails.setVerificationStatus(
                "PENDING"
        );


        return bankDetailsRepo.save(
                bankDetails
        );
    }
    public List<BankDetails> getAllBankDetails() {

        return bankDetailsRepo.findAll();
    }


    public BankDetails getBankDetailsById(Long id) {

        return bankDetailsRepo.findById(id)
                .orElse(null);
    }
    @Transactional
    public BankDetails verifyBankDetails(Long id) {

        System.out.println("VERIFY BANK CALLED FOR ID = " + id);

        BankDetails bankDetails =
                bankDetailsRepo.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Bank details not found"
                                )
                        );

        // =========================================
        // VERIFY BANK DETAILS
        // =========================================

        bankDetails.setVerificationStatus("VERIFIED");

        BankDetails savedBankDetails =
                bankDetailsRepo.save(bankDetails);


        // =========================================
        // GET APPLICATION
        // =========================================

        Application application =
                bankDetails.getApplication();

        System.out.println(
                "APPLICATION ID = "
                        + application.getId()
                        + " OLD STATUS = "
                        + application.getStatus()
        );


        // =========================================
        // APPROVE APPLICATION
        // =========================================

        application.setStatus("APPROVED");

        application.setStatusUpdatedDate(
                java.time.LocalDateTime.now()
        );

        Application savedApplication =
                applicationRepo.saveAndFlush(application);


        System.out.println(
                "APPLICATION STATUS = "
                        + savedApplication.getStatus()
        );


        // =========================================
        // FIND GRANT AMOUNT
        // =========================================

        Double grantAmount =
                grantSlabRepo
                        .findBySchemeIdAndMinimumIncomeLessThanEqualAndMaximumIncomeGreaterThanEqual(
                                savedApplication.getScheme().getId(),
                                savedApplication.getUser().getAnnualIncome(),
                                savedApplication.getUser().getAnnualIncome()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Grant slab not found"
                                )
                        )
                        .getGrantAmount();


        System.out.println(
                "GRANT AMOUNT = " + grantAmount
        );


        // =========================================
        // CREATE INSTALLMENT PLAN
        // =========================================

        installmentPlanService.createInstallmentPlan(
                savedApplication,
                grantAmount
        );


        System.out.println(
                "INSTALLMENT PLAN CREATED FOR APPLICATION = "
                        + savedApplication.getId()
        );


        // =========================================
        // CREATE COMPLIANCE MILESTONES
        // =========================================

        complianceMilestoneService
                .createDefaultMilestones(
                        savedApplication
                );


        // =========================================
        // SEND EMAIL
        // =========================================

        emailService.sendBankDetailsVerifiedEmail(
                savedApplication.getUser().getEmailId(),
                savedApplication.getUser().getFirstName(),
                savedApplication.getScheme().getSchemeName()
        );


        return savedBankDetails;
    }




    // Officer verifies bank details
    // Officer verifies bank details

    // Officer rejects bank details
    public BankDetails rejectBankDetails(
            Long id,
            String reason
    ) {

        BankDetails bankDetails =
                bankDetailsRepo.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Bank details not found"
                                )
                        );

        bankDetails.setVerificationStatus(
                "REJECTED"
        );

        BankDetails savedBankDetails =
                bankDetailsRepo.save(bankDetails);


        Application application =
                bankDetails.getApplication();


        // SEND REJECTION EMAIL
        emailService.sendBankDetailsRejectedEmail(
                application.getUser().getEmailId(),
                application.getUser().getFirstName(),
                reason
        );


        return savedBankDetails;
    }
    public BankDetails getByApplicationId(
            Long applicationId) {

        return bankDetailsRepo
                .findByApplicationId(applicationId)
                .orElse(null);
    }
    }

