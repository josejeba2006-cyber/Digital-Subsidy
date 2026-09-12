package com.example.DigitalSubsidy.repository;

import com.example.DigitalSubsidy.entity.ComplianceMilestone;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ComplianceMilestoneRepo
        extends JpaRepository<ComplianceMilestone, Long> {
    Optional<ComplianceMilestone>
    findByApplicationIdAndInstallmentNumber(
            Long applicationId,
            Integer installmentNumber
    );
    List<ComplianceMilestone> findByApplicationId(Long applicationId);
    void deleteByApplicationId(Long applicationId);
}