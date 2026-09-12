package com.example.DigitalSubsidy.controller;

import com.example.DigitalSubsidy.entity.BankDetails;
import com.example.DigitalSubsidy.service.BankDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bank-details")
public class BankDetailsController {

    @Autowired
    BankDetailsService service;


    // User submits bank details
    @PostMapping
    public BankDetails createBankDetails(
            @RequestBody BankDetails bankDetails) {

        return service.createBankDetails(bankDetails);
    }


    // Officer/Admin gets all bank details
    @GetMapping
    public List<BankDetails> getAllBankDetails() {

        return service.getAllBankDetails();
    }


    // Get bank details by ID
    @GetMapping("/{id}")
    public BankDetails getBankDetailsById(
            @PathVariable Long id) {

        return service.getBankDetailsById(id);
    }


    // Officer verifies bank details
    @PutMapping("/{id}/verify")
    public BankDetails verifyBankDetails(
            @PathVariable Long id) {

        return service.verifyBankDetails(id);
    }
    @GetMapping("/application/{applicationId}")
    public BankDetails getByApplicationId(
            @PathVariable Long applicationId) {

        return service.getByApplicationId(applicationId);
    }


    // Officer rejects bank details
    @PutMapping("/{id}/reject")
    public BankDetails rejectBankDetails(
            @PathVariable Long id,@RequestParam String reason) {

        return service.rejectBankDetails(id,reason);
    }
}