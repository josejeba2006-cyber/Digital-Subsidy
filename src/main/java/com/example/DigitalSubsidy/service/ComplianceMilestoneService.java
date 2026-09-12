package com.example.DigitalSubsidy.service;

import com.example.DigitalSubsidy.entity.Application;
import com.example.DigitalSubsidy.entity.ComplianceMilestone;
import com.example.DigitalSubsidy.entity.InstallmentPlan;
import com.example.DigitalSubsidy.entity.User;
import com.example.DigitalSubsidy.repository.ApplicationRepo;
import com.example.DigitalSubsidy.repository.ComplianceMilestoneRepo;
import com.example.DigitalSubsidy.repository.InstallmentPlanRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ComplianceMilestoneService {

    @Autowired
    ComplianceMilestoneRepo repository;

    @Autowired
    ApplicationRepo applicationRepo;
    @Autowired
    InstallmentPlanRepo installmentPlanRepo;
    @Autowired
    EmailService emailService;


    public List<ComplianceMilestone> getMilestonesByApplication(
            Long applicationId) {

        return repository.findByApplicationId(applicationId);
    }


    public ComplianceMilestone getMilestoneById(Long id) {

        return repository.findById(id)
                .orElse(null);
    }


    public ComplianceMilestone createMilestone(
            Long applicationId,
            ComplianceMilestone milestone) {

        Application application =
                applicationRepo.findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found"
                                )
                        );

        milestone.setApplication(application);

        if (milestone.getStatus() == null) {
            milestone.setStatus("PENDING");
        }

        return repository.save(milestone);
    }
    public void createDefaultMilestones(Application application) {

        if (!repository.findByApplicationId(application.getId()).isEmpty()) {
            return;
        }

        // ==========================================
        // UTILIZATION PROOF 1
        // ==========================================

        ComplianceMilestone milestone1 =
                new ComplianceMilestone();

        milestone1.setApplication(application);
        milestone1.setInstallmentNumber(1);
        milestone1.setMilestoneName("Utilization Proof 1");

        milestone1.setDescription(
                "Submit utilization proof for Installment 1"
        );

        milestone1.setDueDate(
                LocalDate.now().plusDays(30)
        );

        milestone1.setStatus("PENDING");

        repository.save(milestone1);


        // ==========================================
        // UTILIZATION PROOF 2
        // ==========================================

        ComplianceMilestone milestone2 =
                new ComplianceMilestone();

        milestone2.setApplication(application);
        milestone2.setInstallmentNumber(2);
        milestone2.setMilestoneName("Utilization Proof 2");

        milestone2.setDescription(
                "Submit utilization proof for Installment 2"
        );

        milestone2.setDueDate(
                LocalDate.now().plusDays(60)
        );

        milestone2.setStatus("PENDING");

        repository.save(milestone2);


        System.out.println(
                "===== CREATE DEFAULT MILESTONES ====="
        );

        System.out.println(
                "Application ID: " + application.getId()
        );

        System.out.println(
                "Utilization Proof 1 and 2 created"
        );
    }


    public ComplianceMilestone completeMilestone(
            Long id,
            String utilizationProof) {

        ComplianceMilestone milestone =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Milestone not found"
                                )
                        );


        // Utilization proof is required

        if (utilizationProof == null ||
                utilizationProof.isBlank()) {

            throw new RuntimeException(
                    "Utilization proof is required"
            );
        }


        // Complete current milestone

        milestone.setUtilizationProof(
                utilizationProof
        );

        milestone.setStatus("COMPLETED");

        milestone.setCompletedDate(
                LocalDate.now()
        );


        ComplianceMilestone savedMilestone =
                repository.save(milestone);


        // ================= UNLOCK NEXT INSTALLMENT =================

        Integer currentInstallment =
                milestone.getInstallmentNumber();


        if (currentInstallment != null) {

            Integer nextInstallment =
                    currentInstallment + 1;


            InstallmentPlan nextPlan =
                    installmentPlanRepo
                            .findByApplicationIdAndInstallmentNumber(
                                    milestone.getApplication().getId(),
                                    nextInstallment
                            )
                            .orElse(null);


            if (nextPlan != null &&
                    "LOCKED".equals(nextPlan.getStatus())) {

                nextPlan.setStatus("AVAILABLE");

                installmentPlanRepo.save(nextPlan);
            }
        }


        return savedMilestone;
    }


    public void checkOverdueMilestones() {

        List<ComplianceMilestone> milestones =
                repository.findAll();

        LocalDate today = LocalDate.now();

        for (ComplianceMilestone milestone : milestones) {

            if ("PENDING".equals(milestone.getStatus())
                    && milestone.getDueDate() != null
                    && milestone.getDueDate().isBefore(today)) {

                milestone.setStatus("OVERDUE");

                repository.save(milestone);
                emailService.sendOverdueMilestoneEmail(
                        milestone.getApplication().getUser().getEmailId(),
                        milestone
                );
            }
        }
    }
    @Scheduled(cron = "0 0 9 * * *")
    public void sendUtilizationProofReminders() {

        List<ComplianceMilestone> milestones =
                repository.findAll();

        LocalDate today = LocalDate.now();

        for (ComplianceMilestone milestone : milestones) {

            if (milestone.getDueDate() == null) {
                continue;
            }

            // Application details
            Application application =
                    milestone.getApplication();

            // Application already disbursed
            if ("DISBURSED".equals(application.getStatus())) {
                continue;
            }

            // Only pending milestones need reminders
            if (!"PENDING".equals(milestone.getStatus())) {
                continue;
            }

            LocalDate dueDate =
                    milestone.getDueDate();

            long daysRemaining =
                    java.time.temporal.ChronoUnit.DAYS
                            .between(today, dueDate);

            // Reminder on 5th, 3rd and 1st day
            if (daysRemaining == 5 ||
                    daysRemaining == 3 ||
                    daysRemaining == 1) {

                User user =
                        application.getUser();

                String userName =
                        user.getFirstName() + " " +
                                user.getLastName();

                emailService.sendUtilizationProofReminderEmail(

                        user.getEmailId(),

                        userName,

                        application.getScheme()
                                .getSchemeName(),

                        milestone.getInstallmentNumber(),

                        dueDate,

                        daysRemaining
                );
            }
        }
    }
    public List<ComplianceMilestone> getAllMilestones() {
        return repository.findAll();
    }
}