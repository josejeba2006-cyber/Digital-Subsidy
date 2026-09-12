package com.example.DigitalSubsidy.controller;

import com.example.DigitalSubsidy.entity.GrantSlab;
import com.example.DigitalSubsidy.service.GrantSlabService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/grant-slabs")
public class GrantSlabController {

    @Autowired
    private GrantSlabService grantSlabService;

    @PostMapping
    public GrantSlab createSlab(
            @RequestBody GrantSlab slab) {

        return grantSlabService.createSlab(slab);
    }

    @GetMapping("/scheme/{schemeId}")
    public List<GrantSlab> getSlabsByScheme(
            @PathVariable Long schemeId) {

        return grantSlabService.getSlabsByScheme(schemeId);
    }

    @GetMapping("/{id}")
    public GrantSlab getSlabById(
            @PathVariable Long id) {

        return grantSlabService.getSlabById(id);
    }

    @PutMapping("/{id}")
    public GrantSlab updateSlab(
            @PathVariable Long id,
            @RequestBody GrantSlab slab) {

        return grantSlabService.updateSlab(id, slab);
    }

    @DeleteMapping("/{id}")
    public String deleteSlab(
            @PathVariable Long id) {

        grantSlabService.deleteSlab(id);

        return "Grant slab deleted successfully";
    }
}