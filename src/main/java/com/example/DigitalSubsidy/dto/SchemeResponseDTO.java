package com.example.DigitalSubsidy.dto;

import java.util.List;

public class SchemeResponseDTO {

    private Long id;
    private String schemeName;
    private String description;
    private Integer minimumAge;
    private Integer maximumAge;
    private String eligibleOccupation;
    private String eligibleLocation;
    private String eligibleGender;
    private String eligibleBeneficiaryCategory;
    private List<GrantSlabDTO> grantSlabs;

    // getters and setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSchemeName() {
        return schemeName;
    }

    public void setSchemeName(String schemeName) {
        this.schemeName = schemeName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getMinimumAge() {
        return minimumAge;
    }

    public void setMinimumAge(Integer minimumAge) {
        this.minimumAge = minimumAge;
    }

    public Integer getMaximumAge() {
        return maximumAge;
    }

    public void setMaximumAge(Integer maximumAge) {
        this.maximumAge = maximumAge;
    }

    public String getEligibleOccupation() {
        return eligibleOccupation;
    }

    public void setEligibleOccupation(String eligibleOccupation) {
        this.eligibleOccupation = eligibleOccupation;
    }

    public String getEligibleLocation() {
        return eligibleLocation;
    }

    public void setEligibleLocation(String eligibleLocation) {
        this.eligibleLocation = eligibleLocation;
    }

    public String getEligibleGender() {
        return eligibleGender;
    }

    public void setEligibleGender(String eligibleGender) {
        this.eligibleGender = eligibleGender;
    }

    public String getEligibleBeneficiaryCategory() {
        return eligibleBeneficiaryCategory;
    }

    public void setEligibleBeneficiaryCategory(String eligibleBeneficiaryCategory) {
        this.eligibleBeneficiaryCategory = eligibleBeneficiaryCategory;
    }

    public List<GrantSlabDTO> getGrantSlabs() {
        return grantSlabs;
    }

    public void setGrantSlabs(List<GrantSlabDTO> grantSlabs) {
        this.grantSlabs = grantSlabs;
    }
}