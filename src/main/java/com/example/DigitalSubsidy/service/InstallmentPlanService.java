package com.example.DigitalSubsidy.service;

import com.example.DigitalSubsidy.entity.Application;
import com.example.DigitalSubsidy.entity.InstallmentPlan;
import com.example.DigitalSubsidy.repository.InstallmentPlanRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InstallmentPlanService {

    @Autowired
    private InstallmentPlanRepo installmentPlanRepo;


    public List<InstallmentPlan> getInstallmentsByApplication(
            Long applicationId) {

        return installmentPlanRepo
                .findByApplicationId(applicationId);
    }


    public void createInstallmentPlan(
            Application application,
            Double totalGrant) {

        // Prevent duplicate plan

        if (!installmentPlanRepo
                .findByApplicationId(application.getId())
                .isEmpty()) {

            return;
        }


        // ================= INSTALLMENT 1 =================

        InstallmentPlan installment1 =
                new InstallmentPlan();

        installment1.setApplication(application);
        installment1.setInstallmentNumber(1);
        installment1.setPercentage(40.0);
        installment1.setAmount(totalGrant * 0.40);
        installment1.setStatus("AVAILABLE");

        installmentPlanRepo.save(installment1);


        // ================= INSTALLMENT 2 =================

        InstallmentPlan installment2 =
                new InstallmentPlan();

        installment2.setApplication(application);
        installment2.setInstallmentNumber(2);
        installment2.setPercentage(30.0);
        installment2.setAmount(totalGrant * 0.30);
        installment2.setStatus("LOCKED");

        installmentPlanRepo.save(installment2);


        // ================= INSTALLMENT 3 =================

        InstallmentPlan installment3 =
                new InstallmentPlan();

        installment3.setApplication(application);
        installment3.setInstallmentNumber(3);
        installment3.setPercentage(30.0);
        installment3.setAmount(totalGrant * 0.30);
        installment3.setStatus("LOCKED");

        installmentPlanRepo.save(installment3);
    }
}