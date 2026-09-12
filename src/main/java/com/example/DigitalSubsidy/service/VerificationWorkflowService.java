package com.example.DigitalSubsidy.service;

import com.example.DigitalSubsidy.entity.Application;
import com.example.DigitalSubsidy.repository.ApplicationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class VerificationWorkflowService {

    @Autowired
    private ApplicationRepo applicationRepo;
    @Autowired
    private ApplicationService applicationService;
    @Autowired
    private EmailService emailService;
    public Application fieldVerification(Long applicationId,
                                         String decision,
                                         String remarks) {

        Application application =
                applicationRepo.findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException("Application not found"));

        if (!"SUBMITTED".equalsIgnoreCase(application.getStatus())) {
            throw new RuntimeException(
                    "Application is not ready for field verification");
        }

        if ("APPROVED".equalsIgnoreCase(decision)) {

            application.setStatus("FIELD_VERIFIED");
            application.setRemarks(remarks);
            application.setStatusUpdatedDate(LocalDateTime.now());

            return applicationRepo.save(application);
        }

        if ("REJECTED".equalsIgnoreCase(decision)) {

            return applicationService.rejectApplication(
                    applicationId,
                    remarks
            );
        }

        throw new RuntimeException("Invalid decision");
    }


    public Application districtReview(
            Long applicationId,
            String decision,
            String remarks) {

        Application application = getApplication(applicationId);

        if (!"FIELD_VERIFIED".equalsIgnoreCase(application.getStatus())) {
            throw new RuntimeException(
                    "Application is not ready for district review"
            );
        }

        if ("APPROVED".equalsIgnoreCase(decision)) {

            application.setStatus("DISTRICT_APPROVED");

            emailService.sendDistrictApprovedEmail(
                    application.getUser().getEmailId(),
                    application.getUser().getFirstName(),
                    application.getScheme().getSchemeName()
            );

        } else if ("REJECTED".equalsIgnoreCase(decision)) {

            application.setStatus("REJECTED");
            application.setRejectionReason(remarks);

        } else if ("REVERIFICATION".equalsIgnoreCase(decision)) {

            application.setStatus("REVERIFICATION_REQUESTED");

        } else {
            throw new RuntimeException("Invalid decision");
        }

        application.setRemarks(remarks);
        application.setStatusUpdatedDate(LocalDateTime.now());

        return applicationRepo.save(application);
    }


    public Application financeApproval(
            Long applicationId,
            String decision,
            String remarks) {

        Application application = getApplication(applicationId);

        if (!"DISTRICT_APPROVED".equalsIgnoreCase(application.getStatus())) {
            throw new RuntimeException(
                    "Application is not ready for finance approval"
            );
        }

        if ("APPROVED".equalsIgnoreCase(decision)) {

            application.setStatus("APPROVED");

        } else if ("REJECTED".equalsIgnoreCase(decision)) {

            application.setStatus("REJECTED");
            application.setRejectionReason(remarks);

        } else if ("REVERIFICATION".equalsIgnoreCase(decision)) {

            application.setStatus("REVERIFICATION_REQUESTED");

        } else {
            throw new RuntimeException("Invalid decision");
        }

        application.setRemarks(remarks);
        application.setStatusUpdatedDate(LocalDateTime.now());

        return applicationRepo.save(application);
    }


    private Application getApplication(Long applicationId) {

        return applicationRepo.findById(applicationId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Application not found: " + applicationId
                        )
                );
    }
}