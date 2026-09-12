package com.example.DigitalSubsidy.controller;

import com.example.DigitalSubsidy.entity.InstallmentPlan;
import com.example.DigitalSubsidy.service.InstallmentPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/installment-plans")
@CrossOrigin
public class InstallmentPlanController {

    @Autowired
    private InstallmentPlanService installmentPlanService;


    @GetMapping("/application/{applicationId}")
    public List<InstallmentPlan> getInstallmentsByApplication(
            @PathVariable Long applicationId) {

        return installmentPlanService
                .getInstallmentsByApplication(applicationId);
    }
}