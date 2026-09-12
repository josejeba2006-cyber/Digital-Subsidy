package com.example.DigitalSubsidy.repository;

import com.example.DigitalSubsidy.entity.Disbursement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DisbursementRepo extends JpaRepository<Disbursement,Long> {

    List<Disbursement> findByApplicationId(Long applicationId);
    void deleteByApplicationId(Long applicationId);
}
