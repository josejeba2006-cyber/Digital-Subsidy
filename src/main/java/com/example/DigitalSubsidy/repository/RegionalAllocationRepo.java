package com.example.DigitalSubsidy.repository;

import com.example.DigitalSubsidy.entity.RegionalAllocation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RegionalAllocationRepo
        extends JpaRepository<RegionalAllocation, Long> {

    List<RegionalAllocation> findBySchemeId(Long schemeId);
}