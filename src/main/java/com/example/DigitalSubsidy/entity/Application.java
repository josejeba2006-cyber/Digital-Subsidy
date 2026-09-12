package com.example.DigitalSubsidy.entity;
import com.example.DigitalSubsidy.entity.Scheme;
import com.example.DigitalSubsidy.entity.User;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;
    @ManyToOne
    private Scheme scheme;
    private LocalDate applicationDate;
    private String status;
    private String remarks;
    private String rejectionReason;
    private LocalDateTime statusUpdatedDate;
    private Integer eligibilityScore;
    private String routingStatus;

    @OneToMany(mappedBy = "application")
    private List<Disbursement> disbursements;
    @OneToMany(mappedBy = "application")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<InstallmentPlan> installmentPlans;
    public List<InstallmentPlan> getInstallmentPlans() {
        return installmentPlans;
    }

    public String getRoutingStatus() {
        return routingStatus;
    }

    public void setRoutingStatus(String routingStatus) {
        this.routingStatus = routingStatus;
    }

    public Integer getEligibilityScore() {
        return eligibilityScore;
    }

    public void setEligibilityScore(Integer eligibilityScore) {
        this.eligibilityScore = eligibilityScore;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Scheme getScheme() {
        return scheme;
    }

    public void setScheme(Scheme scheme) {
        this.scheme = scheme;
    }

    public LocalDate getApplicationDate() {
        return applicationDate;
    }

    public void setApplicationDate(LocalDate applicationDate) {
        this.applicationDate = applicationDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
    public LocalDateTime getStatusUpdatedDate() {
        return statusUpdatedDate;
    }

    public void setStatusUpdatedDate(
            LocalDateTime statusUpdatedDate) {

        this.statusUpdatedDate = statusUpdatedDate;
    }

    public Long getId() {
        return id;
    }
}