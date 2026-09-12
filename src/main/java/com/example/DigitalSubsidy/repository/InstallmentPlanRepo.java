package com.example.DigitalSubsidy.repository;

import com.example.DigitalSubsidy.entity.InstallmentPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InstallmentPlanRepo
        extends JpaRepository<InstallmentPlan, Long> {

    List<InstallmentPlan>
    findByApplicationId(Long applicationId);

    Optional<InstallmentPlan>
    findByApplicationIdAndInstallmentNumber(
            Long applicationId,
            Integer installmentNumber
    );
    List<InstallmentPlan>
    findByApplicationIdOrderByInstallmentNumberAsc(Long applicationId);
    void deleteByApplicationId(Long applicationId);
}