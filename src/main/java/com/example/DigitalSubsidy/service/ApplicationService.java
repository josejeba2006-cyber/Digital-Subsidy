package com.example.DigitalSubsidy.service;

import com.example.DigitalSubsidy.entity.*;
import com.example.DigitalSubsidy.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ApplicationService {
    @Autowired
    userRepo userrepo;
    @Autowired
    SchemeRepo schemerepo;
    @Autowired
    ApplicationRepo applicationRepo;
    @Autowired
    DocumentRepo documentRepo;
    @Autowired
    EmailService emailService;
    @Autowired
    GrantSlabRepo grantSlabRepo;
    @Autowired
    InstallmentPlanService installmentPlanService;
    @Autowired
    BankDetailsRepo bankDetailsRepo;
    @Autowired
    ComplianceMilestoneRepo complianceMilestoneRepo;
    @Autowired
    DisbursementRepo disbursementRepo;
    @Autowired
    InstallmentPlanRepo installmentPlanRepo;

    public Application createApplication(Application application) {

        long userid = application.getUser().getId();
        long schemeid = application.getScheme().getId();

        User user = userrepo.findById(userid)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Scheme scheme = schemerepo.findById(schemeid)
                .orElseThrow(() -> new RuntimeException("Scheme not found"));
        boolean alreadyApplied =
                applicationRepo
                        .existsByUserIdAndSchemeIdAndStatusNotIn(
                                userid,
                                schemeid,List.of(
                                "WITHDRAWN","REJECTED")
                        );

        if (alreadyApplied) {

            throw new RuntimeException(
                    "You have already applied for this scheme"
            );
        }

        // 1. Scheme must be ACTIVE
        if (!"ACTIVE".equals(scheme.getStatus())) {
            throw new RuntimeException("Scheme is not active");
        }
        // 2. Check scheme date
        java.time.LocalDate today =
                java.time.LocalDate.now();

        if (today.isBefore(scheme.getStartDate()) ||
                today.isAfter(scheme.getEndDate())) {

            throw new RuntimeException(
                    "Application is outside the scheme period"
            );
        }
        // 3. Calculate user age
        int age = java.time.Period.between(
                user.getDateofbirth(),
                today
        ).getYears();
        // 4. Check age
        if (age < scheme.getMinimumAge() ||
                age > scheme.getMaximumAge()) {

            throw new RuntimeException(
                    "User is not eligible based on age"
            );
        }
        // 5. Check income
        // 5. Check income slab
        boolean incomeEligible =
                grantSlabRepo
                        .findBySchemeIdAndMinimumIncomeLessThanEqualAndMaximumIncomeGreaterThanEqual(
                                scheme.getId(),
                                user.getAnnualIncome(),
                                user.getAnnualIncome()
                        )
                        .isPresent();

        if (!incomeEligible) {

            throw new RuntimeException(
                    "User is not eligible based on income"
            );
        }
        // 6. Check occupation
        if (!scheme.getEligibleOccupation()
                .equalsIgnoreCase(user.getOccupation())) {

            throw new RuntimeException(
                    "User is not eligible based on occupation"
            );
        }
        String schemeGender =
                scheme.getEligibleGender();

        if (schemeGender != null &&
                !schemeGender.isBlank() &&
                !schemeGender.equalsIgnoreCase("ALL")) {

            if (user.getGender() == null ||
                    !schemeGender.equalsIgnoreCase(
                            user.getGender()
                    )) {

                throw new RuntimeException(
                        "User is not eligible based on gender"
                );
            }
        }
        // 7. Check beneficiary category
        String schemeCategory =
                scheme.getEligibleBeneficiaryCategory();

        if (schemeCategory != null &&
                !schemeCategory.isBlank() &&
                !schemeCategory.equalsIgnoreCase("ALL")) {

            if (user.getBeneficiaryCategory() == null ||
                    !schemeCategory.equalsIgnoreCase(
                            user.getBeneficiaryCategory()
                    )) {

                throw new RuntimeException(
                        "User is not eligible based on beneficiary category"
                );
            }
        }
        // ================= ELIGIBILITY SCORE =================

        int eligibilityScore = 0;

// Age criterion
        if (age >= scheme.getMinimumAge()
                && age <= scheme.getMaximumAge()) {

            eligibilityScore += 20;
        }

// Income criterion
        if (incomeEligible) {

            eligibilityScore += 30;
        }

// Occupation criterion
        if (scheme.getEligibleOccupation()
                .equalsIgnoreCase(user.getOccupation())) {

            eligibilityScore += 20;
        }

// Gender criterion
        if (schemeGender == null
                || schemeGender.isBlank()
                || schemeGender.equalsIgnoreCase("ALL")
                || schemeGender.equalsIgnoreCase(user.getGender())) {

            eligibilityScore += 10;
        }

// Beneficiary category criterion
        if (schemeCategory == null
                || schemeCategory.isBlank()
                || schemeCategory.equalsIgnoreCase("ALL")
                || schemeCategory.equalsIgnoreCase(
                user.getBeneficiaryCategory())) {

            eligibilityScore += 20;
        }

        application.setEligibilityScore(
                eligibilityScore
        );
        // ================= APPLICATION ROUTING =================

        if (eligibilityScore >= 90) {

            application.setRoutingStatus("FAST_TRACK");

        } else if (eligibilityScore >= 70) {

            application.setRoutingStatus("NORMAL");

        } else {

            application.setRoutingStatus("ESCALATED");
        }

        // Everything is valid
        application.setUser(user);
        application.setScheme(scheme);
        application.setApplicationDate(LocalDate.now());
        application.setStatus("SUBMITTED");
        application.setStatusUpdatedDate(LocalDateTime.now());

        return applicationRepo.save(application);
    }

    public List<Application> getAllApplications() {

        return applicationRepo.findAll();
    }
    public List<Application> getOlderRecords() {

        return applicationRepo.findAll();

    }
    public Application getApplicationById(Long id) {

        return applicationRepo.findById(id).orElse(null);
    }

    public void deleteApplication(Long id) {

        applicationRepo.deleteById(id);
    }

    public Application approveApplication(Long id) {

        Application application =
                applicationRepo.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Application not found"));


        List<Document> documents =
                documentRepo.findByApplicationId(id);


        if (documents.isEmpty()) {

            throw new RuntimeException(
                    "No documents uploaded"
            );
        }


        application.setStatus("APPROVED");


        Application savedApplication =
                applicationRepo.save(application);


        // ================= INSTALLMENT PLAN =================

        Double grantAmount =
                grantSlabRepo
                        .findBySchemeIdAndMinimumIncomeLessThanEqualAndMaximumIncomeGreaterThanEqual(
                                application.getScheme().getId(),
                                application.getUser().getAnnualIncome(),
                                application.getUser().getAnnualIncome()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Grant slab not found"
                                )
                        )
                        .getGrantAmount();


        installmentPlanService.createInstallmentPlan(
                savedApplication,
                grantAmount
        );


        // ================= APPROVAL EMAIL =================

        System.out.println("=================================");
        System.out.println("APPROVAL EMAIL STARTING");
        System.out.println("USER EMAIL: " +
                application.getUser().getEmailId());
        System.out.println("=================================");


        emailService.sendBankDetailsRequiredEmail(
                application.getUser().getEmailId(),
                application.getUser().getFirstName(),
                application.getScheme().getSchemeName()
        );


        System.out.println(
                "APPROVAL EMAIL SENT SUCCESSFULLY"
        );


        return savedApplication;
    }

    @Transactional
    public Application rejectApplication(Long id, String reason) {

        Application application =
                applicationRepo.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Application not found"));

        // Send rejection email before deleting application
        emailService.sendApplicationRejectedEmail(

                application.getUser().getEmailId(),

                application.getUser().getFirstName(),

                application.getScheme().getSchemeName(),

                reason
        );

        // Delete related records first

        documentRepo.deleteByApplicationId(id);

        bankDetailsRepo.deleteByApplicationId(id);

        complianceMilestoneRepo.deleteByApplicationId(id);

        disbursementRepo.deleteByApplicationId(id);

        installmentPlanRepo.deleteByApplicationId(id);

        // Finally delete application

        applicationRepo.delete(application);

        return application;
    }
    public Application withdrawApplication(Long id) {

        Application application =
                applicationRepo.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Application not found"));

        // Only submitted/pending applications can be withdrawn
        if ("APPROVED".equals(application.getStatus())) {
            throw new RuntimeException(
                    "Approved application cannot be withdrawn");
        }

        if ("DISBURSED".equals(application.getStatus())) {
            throw new RuntimeException(
                    "Disbursed application cannot be withdrawn");
        }

        if ("REJECTED".equals(application.getStatus())) {
            throw new RuntimeException(
                    "Rejected application cannot be withdrawn");
        }

        application.setStatus("WITHDRAWN");

        Application savedApplication =
                applicationRepo.save(application);

        emailService.sendApplicationWithdrawnEmail(

                application.getUser().getEmailId(),

                application.getUser().getFirstName(),

                application.getScheme().getSchemeName()
        );
        return savedApplication;
    }
    public void sendDocumentsSubmittedEmail(Long applicationId) {

        System.out.println("================================");
        System.out.println("DOCUMENT EMAIL SERVICE STARTED");
        System.out.println("================================");

        Application application =
                applicationRepo.findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found"
                                )
                        );

        System.out.println(
                "USER EMAIL: " +
                        application.getUser().getEmailId()
        );

        System.out.println(
                "SCHEME: " +
                        application.getScheme().getSchemeName()
        );

        emailService.sendDocumentSubmittedEmail(

                application.getUser().getEmailId(),

                application.getUser().getFirstName(),

                application.getScheme().getSchemeName(),

                "All required documents"
        );

        System.out.println(
                "DOCUMENT EMAIL METHOD FINISHED"
        );
    }
}
