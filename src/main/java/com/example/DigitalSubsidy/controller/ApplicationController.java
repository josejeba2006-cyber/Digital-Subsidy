package com.example.DigitalSubsidy.controller;

import com.example.DigitalSubsidy.entity.Application;
import com.example.DigitalSubsidy.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/applications")
public class ApplicationController {

    @Autowired
    ApplicationService service;

    @PostMapping
    public Application createApplication(@RequestBody Application application) {
        System.out.println("scheme applied");
        return service.createApplication(application);

    }

    @GetMapping
    public List<Application> getAllApplications() {
        return service.getAllApplications();
    }

    @GetMapping("/{id}")
    public Application getApplicationById(@PathVariable Long id) {
        return service.getApplicationById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteApplication(@PathVariable Long id) {
        service.deleteApplication(id);
        return "Application deleted successfully";
    }
    @PutMapping("/{id}/approve")
    public Application approveApplication(@PathVariable Long id) {
        return service.approveApplication(id);
    }

    @PutMapping("/{id}/reject")
    public Application rejectApplication(
            @PathVariable Long id,
            @RequestParam String remarks) {

        return service.rejectApplication(id, remarks);
    }
    @PutMapping("/{id}/withdraw")
    public Application withdrawApplication(@PathVariable Long id) {
        return service.withdrawApplication(id);
    }

    @PostMapping("/{id}/documents-submitted")
    public String documentsSubmitted(
            @PathVariable Long id) {

        service.sendDocumentsSubmittedEmail(id);
        System.out.println("================================");
        System.out.println("DOCUMENT EMAIL ENDPOINT CALLED");
        System.out.println("APPLICATION ID: " + id);
        System.out.println("================================");

        return "Document submission email sent";
    }
    @GetMapping("/history")
    public List<Application> getOlderRecords() {

        return service.getOlderRecords();
    }
}