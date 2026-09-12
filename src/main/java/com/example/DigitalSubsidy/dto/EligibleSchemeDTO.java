package com.example.DigitalSubsidy.dto;

import com.example.DigitalSubsidy.entity.GrantSlab;
import com.example.DigitalSubsidy.entity.Scheme;

public class EligibleSchemeDTO {

    private Scheme scheme;
    private GrantSlab grantSlab;
    private Integer eligibilityScore;

    public Integer getEligibilityScore() {
        return eligibilityScore;

    }

    public void setEligibilityScore(Integer eligibilityScore) {
        this.eligibilityScore = eligibilityScore;
    }
    public EligibleSchemeDTO(
            Scheme scheme,
            GrantSlab grantSlab,
            Integer eligibilityScore) {

        this.scheme = scheme;
        this.grantSlab = grantSlab;
        this.eligibilityScore = eligibilityScore;
    }

    public Scheme getScheme() {
        return scheme;
    }

    public GrantSlab getGrantSlab() {
        return grantSlab;
    }
}