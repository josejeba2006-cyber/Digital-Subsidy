package com.example.DigitalSubsidy.controller;

import com.example.DigitalSubsidy.entity.Application;
import com.example.DigitalSubsidy.service.VerificationWorkflowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/verifications")
public class VerificationController {

    @Autowired
    private VerificationWorkflowService service;

    @PutMapping("/field/{applicationId}")
    public Application fieldVerification(
            @PathVariable Long applicationId,
            @RequestParam String decision,
            @RequestParam(required = false) String remarks) {

        return service.fieldVerification(
                applicationId,
                decision,
                remarks
        );
    }

    @PutMapping("/district/{applicationId}")
    public Application districtReview(
            @PathVariable Long applicationId,
            @RequestParam String decision,
            @RequestParam(required = false) String remarks) {

        return service.districtReview(
                applicationId,
                decision,
                remarks
        );
    }

    @PutMapping("/finance/{applicationId}")
    public Application financeApproval(
            @PathVariable Long applicationId,
            @RequestParam String decision,
            @RequestParam(required = false) String remarks) {

        return service.financeApproval(
                applicationId,
                decision,
                remarks
        );
    }
}