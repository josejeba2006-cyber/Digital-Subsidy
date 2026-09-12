package com.example.DigitalSubsidy.repository;

import com.example.DigitalSubsidy.entity.GrantSlab;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GrantSlabRepo extends JpaRepository<GrantSlab, Long> {

    Optional<GrantSlab> findBySchemeIdAndMinimumIncomeLessThanEqualAndMaximumIncomeGreaterThanEqual(
            Long schemeId,
            Double income1,
            Double income2
    );
    List<GrantSlab> findBySchemeId(Long schemeId);
}