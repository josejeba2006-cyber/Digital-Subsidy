package com.example.DigitalSubsidy.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "installment_plans")
public class InstallmentPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer installmentNumber;

    private Double percentage;

    private Double amount;

    private String status;
    @ManyToOne
    @JoinColumn(name = "application_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Application application;


    public Long getId() {
        return id;
    }

    public Integer getInstallmentNumber() {
        return installmentNumber;
    }

    public void setInstallmentNumber(Integer installmentNumber) {
        this.installmentNumber = installmentNumber;
    }

    public Double getPercentage() {
        return percentage;
    }

    public void setPercentage(Double percentage) {
        this.percentage = percentage;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Application getApplication() {
        return application;
    }

    public void setApplication(Application application) {
        this.application = application;
    }
}