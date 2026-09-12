package com.example.DigitalSubsidy.repository;

import com.example.DigitalSubsidy.entity.BankDetails;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BankDetailsRepo
        extends JpaRepository<BankDetails, Long> {

    Optional<BankDetails>
    findByApplicationId(Long applicationId);
    void deleteByApplicationId(Long applicationId);


}