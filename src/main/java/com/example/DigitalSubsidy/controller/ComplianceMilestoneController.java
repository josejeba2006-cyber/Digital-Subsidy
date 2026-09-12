package com.example.DigitalSubsidy.controller;

import com.example.DigitalSubsidy.entity.ComplianceMilestone;
import com.example.DigitalSubsidy.service.ComplianceMilestoneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/compliance-milestones")
public class ComplianceMilestoneController {

    @Autowired
    ComplianceMilestoneService service;


    @GetMapping("/application/{applicationId}")
    public List<ComplianceMilestone> getMilestones(
            @PathVariable Long applicationId) {

        return service.getMilestonesByApplication(
                applicationId
        );
    }
    @GetMapping
    public List<ComplianceMilestone> getAllMilestones() {
        return service.getAllMilestones();
    }


    @GetMapping("/{id}")
    public ComplianceMilestone getMilestone(
            @PathVariable Long id) {

        return service.getMilestoneById(id);
    }


    @PostMapping("/application/{applicationId}")
    public ComplianceMilestone createMilestone(
            @PathVariable Long applicationId,
            @RequestBody ComplianceMilestone milestone) {

        return service.createMilestone(
                applicationId,
                milestone
        );
    }


    @PutMapping("/{id}/complete")
    public ComplianceMilestone completeMilestone(
            @PathVariable Long id,
            @RequestParam String utilizationProof) {

        return service.completeMilestone(
                id,
                utilizationProof
        );
    }
}