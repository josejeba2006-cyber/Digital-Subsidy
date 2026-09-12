package com.example.DigitalSubsidy.entity;

import jakarta.persistence.*;

@Entity
public class GrantSlab {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double minimumIncome;
    private Double maximumIncome;
    private Double grantAmount;

    @ManyToOne
    private Scheme scheme;

    public Long getId() {
        return id;
    }

    public Double getMinimumIncome() {
        return minimumIncome;
    }

    public void setMinimumIncome(Double minimumIncome) {
        this.minimumIncome = minimumIncome;
    }

    public Double getMaximumIncome() {
        return maximumIncome;
    }

    public void setMaximumIncome(Double maximumIncome) {
        this.maximumIncome = maximumIncome;
    }

    public Double getGrantAmount() {
        return grantAmount;
    }

    public void setGrantAmount(Double grantAmount) {
        this.grantAmount = grantAmount;
    }

    public Scheme getScheme() {
        return scheme;
    }

    public void setScheme(Scheme scheme) {
        this.scheme = scheme;
    }
}