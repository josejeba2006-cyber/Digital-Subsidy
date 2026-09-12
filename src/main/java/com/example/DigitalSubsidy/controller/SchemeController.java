package com.example.DigitalSubsidy.controller;

import com.example.DigitalSubsidy.dto.EligibleSchemeDTO;
import com.example.DigitalSubsidy.entity.Scheme;
import com.example.DigitalSubsidy.service.SchemeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/schemes")
public class SchemeController {

    @Autowired
    SchemeService service;

    @PostMapping
    public Scheme createScheme(@RequestBody Scheme scheme) {
        return service.createScheme(scheme);
    }

    @GetMapping
    public List<Scheme> getAllSchemes() {
        return service.getAllSchemes();
    }

    @GetMapping("/{id}")
    public Scheme getSchemeById(@PathVariable Long id) {
        return service.getSchemeById(id);
    }

    @GetMapping("/eligible/{userId}")
    public List<EligibleSchemeDTO> getEligibleSchemes(
            @PathVariable Long userId) {

        return service.getEligibleSchemes(userId);
    }

    @DeleteMapping("/{id}")
    public String deleteScheme(@PathVariable Long id) {
        service.deleteScheme(id);
        return "Scheme deleted successfully";
    }
    @PutMapping("/{id}")
    public Scheme updateScheme(
            @PathVariable Long id,
            @RequestBody Scheme scheme) {

        return service.updateScheme(id, scheme);
    }
}