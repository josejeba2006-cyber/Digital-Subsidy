package com.example.DigitalSubsidy.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "regional_allocations")
public class RegionalAllocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String region;

    private Double allocatedBudget;

    private Double usedBudget;

    @ManyToOne
    @JoinColumn(name = "scheme_id")
    private Scheme scheme;


    public Long getId() {
        return id;
    }


    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }


    public Double getAllocatedBudget() {
        return allocatedBudget;
    }

    public void setAllocatedBudget(Double allocatedBudget) {
        this.allocatedBudget = allocatedBudget;
    }


    public Double getUsedBudget() {
        return usedBudget;
    }

    public void setUsedBudget(Double usedBudget) {
        this.usedBudget = usedBudget;
    }


    public Scheme getScheme() {
        return scheme;
    }

    public void setScheme(Scheme scheme) {
        this.scheme = scheme;
    }
}