package com.example.DigitalSubsidy.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "bank_details")
public class BankDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Bank details belong to one application
    @OneToOne
    private Application application;

    private String accountHolderName;

    private String bankName;

    private String accountNumber;

    private String ifscCode;

    private String branchName;

    // PENDING / VERIFIED / REJECTED
    private String verificationStatus = "PENDING";


    public Long getId() {
        return id;
    }


    public Application getApplication() {
        return application;
    }

    public void setApplication(Application application) {
        this.application = application;
    }


    public String getAccountHolderName() {
        return accountHolderName;
    }

    public void setAccountHolderName(
            String accountHolderName) {

        this.accountHolderName =
                accountHolderName;
    }


    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }


    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(
            String accountNumber) {

        this.accountNumber =
                accountNumber;
    }


    public String getIfscCode() {
        return ifscCode;
    }

    public void setIfscCode(String ifscCode) {
        this.ifscCode = ifscCode;
    }


    public String getBranchName() {
        return branchName;
    }

    public void setBranchName(
            String branchName) {

        this.branchName =
                branchName;
    }


    public String getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(
            String verificationStatus) {

        this.verificationStatus =
                verificationStatus;
    }
}