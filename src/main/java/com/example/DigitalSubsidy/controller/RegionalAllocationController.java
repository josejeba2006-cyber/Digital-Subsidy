package com.example.DigitalSubsidy.controller;

import com.example.DigitalSubsidy.entity.RegionalAllocation;
import com.example.DigitalSubsidy.service.RegionalAllocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/regional-allocations")
public class RegionalAllocationController {

    @Autowired
    private RegionalAllocationService service;


    @PostMapping("/scheme/{schemeId}")
    public RegionalAllocation createAllocation(
            @PathVariable Long schemeId,
            @RequestBody RegionalAllocation allocation) {

        return service.createAllocation(
                schemeId,
                allocation
        );
    }


    @GetMapping
    public List<RegionalAllocation> getAllAllocations() {

        return service.getAllAllocations();
    }


    @GetMapping("/scheme/{schemeId}")
    public List<RegionalAllocation> getByScheme(
            @PathVariable Long schemeId) {

        return service.getAllocationsByScheme(
                schemeId
        );
    }


    @PutMapping("/{id}")
    public RegionalAllocation updateAllocation(
            @PathVariable Long id,
            @RequestBody RegionalAllocation allocation) {

        return service.updateAllocation(
                id,
                allocation
        );
    }


    @DeleteMapping("/{id}")
    public String deleteAllocation(
            @PathVariable Long id) {

        service.deleteAllocation(id);

        return "Regional allocation deleted successfully";
    }
}