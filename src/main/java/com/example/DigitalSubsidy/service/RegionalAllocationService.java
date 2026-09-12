package com.example.DigitalSubsidy.service;

import com.example.DigitalSubsidy.entity.RegionalAllocation;
import com.example.DigitalSubsidy.entity.Scheme;
import com.example.DigitalSubsidy.repository.RegionalAllocationRepo;
import com.example.DigitalSubsidy.repository.SchemeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RegionalAllocationService {

    @Autowired
    private RegionalAllocationRepo allocationRepo;

    @Autowired
    private SchemeRepo schemeRepo;


    public RegionalAllocation createAllocation(
            Long schemeId,
            RegionalAllocation allocation) {

        Scheme scheme =
                schemeRepo.findById(schemeId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Scheme not found"
                                ));

        allocation.setScheme(scheme);

        if (allocation.getUsedBudget() == null) {
            allocation.setUsedBudget(0.0);
        }

        return allocationRepo.save(allocation);
    }


    public List<RegionalAllocation> getAllAllocations() {
        return allocationRepo.findAll();
    }


    public List<RegionalAllocation> getAllocationsByScheme(
            Long schemeId) {

        return allocationRepo.findBySchemeId(schemeId);
    }


    public RegionalAllocation updateAllocation(
            Long id,
            RegionalAllocation updatedAllocation) {

        RegionalAllocation allocation =
                allocationRepo.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Regional allocation not found"
                                ));

        allocation.setRegion(
                updatedAllocation.getRegion()
        );

        allocation.setAllocatedBudget(
                updatedAllocation.getAllocatedBudget()
        );

        allocation.setUsedBudget(
                updatedAllocation.getUsedBudget()
        );

        return allocationRepo.save(allocation);
    }


    public void deleteAllocation(Long id) {

        allocationRepo.deleteById(id);
    }
}