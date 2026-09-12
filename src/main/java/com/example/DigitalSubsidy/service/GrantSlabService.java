package com.example.DigitalSubsidy.service;

import com.example.DigitalSubsidy.entity.GrantSlab;
import com.example.DigitalSubsidy.repository.GrantSlabRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GrantSlabService {

    @Autowired
    private GrantSlabRepo grantSlabRepo;

    public GrantSlab createSlab(GrantSlab slab) {
        return grantSlabRepo.save(slab);
    }

    public List<GrantSlab> getSlabsByScheme(Long schemeId) {
        return grantSlabRepo.findBySchemeId(schemeId);
    }

    public GrantSlab getSlabById(Long id) {
        return grantSlabRepo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Grant slab not found"));
    }

    public GrantSlab updateSlab(
            Long id,
            GrantSlab updatedSlab) {

        GrantSlab slab =
                grantSlabRepo.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Grant slab not found"
                                ));

        slab.setMinimumIncome(
                updatedSlab.getMinimumIncome());

        slab.setMaximumIncome(
                updatedSlab.getMaximumIncome());

        slab.setGrantAmount(
                updatedSlab.getGrantAmount());

        return grantSlabRepo.save(slab);
    }

    public void deleteSlab(Long id) {
        grantSlabRepo.deleteById(id);
    }
}