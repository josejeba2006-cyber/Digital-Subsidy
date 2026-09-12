package com.example.DigitalSubsidy.service;

import com.example.DigitalSubsidy.entity.*;
import com.example.DigitalSubsidy.repository.ApplicationRepo;
import com.example.DigitalSubsidy.repository.ComplianceMilestoneRepo;
import com.example.DigitalSubsidy.repository.DocumentRepo;
import com.example.DigitalSubsidy.repository.InstallmentPlanRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepo documentRepo;

    @Autowired
    private ApplicationRepo applicationRepo;

    @Autowired
    private EmailService emailService;

    @Autowired
    private ComplianceMilestoneRepo complianceMilestoneRepo;

    @Autowired
    private InstallmentPlanRepo installmentPlanRepo;

    private final String uploadDir = "uploads/documents/";


    // ============================================================
    // NORMAL DOCUMENT UPLOAD
    // ============================================================

    public Document uploadDocument(
            MultipartFile file,
            String documentType,
            Long applicationId) throws IOException {

        Application application =
                applicationRepo.findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found"
                                )
                        );

        Path directory =
                Paths.get(uploadDir);

        if (!Files.exists(directory)) {
            Files.createDirectories(directory);
        }

        String fileName =
                file.getOriginalFilename();

        Path filePath =
                directory.resolve(fileName);

        Files.write(
                filePath,
                file.getBytes()
        );

        Document document =
                new Document();

        document.setDocumentType(documentType);
        document.setDocumentName(fileName);
        document.setDocumentPath(filePath.toString());
        document.setVerificationStatus("PENDING");
        document.setUploadedAt(LocalDateTime.now());
        document.setApplication(application);

        return documentRepo.save(document);
    }


    // ============================================================
    // GET ALL DOCUMENTS
    // ============================================================

    public List<Document> getAllDocuments() {

        return documentRepo.findAll();
    }


    // ============================================================
    // GET DOCUMENT BY ID
    // ============================================================

    public Document getDocumentById(Long id) {

        return documentRepo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Document not found"
                        )
                );
    }


    // ============================================================
    // VERIFY DOCUMENT
    // ============================================================

    public Document verifyDocument(Long id) {

        Document document =
                documentRepo.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Document not found"
                                )
                        );


        document.setVerificationStatus("VERIFIED");

        Document savedDocument =
                documentRepo.save(document);


        // Only utilization proofs affect installment flow

        if (document.getDocumentType()
                .startsWith("UTILIZATION_PROOF_")) {

            String type =
                    document.getDocumentType();

            Integer installmentNumber =
                    Integer.parseInt(
                            type.replace(
                                    "UTILIZATION_PROOF_",
                                    ""
                            )
                    );


            // ============================================
            // COMPLETE MILESTONE
            // ============================================

            ComplianceMilestone milestone =
                    complianceMilestoneRepo
                            .findByApplicationIdAndInstallmentNumber(
                                    document.getApplication().getId(),
                                    installmentNumber
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Milestone not found"
                                    )
                            );

            milestone.setUtilizationProof(
                    savedDocument.getDocumentPath()
            );

            milestone.setStatus("SUBMITTED");

            complianceMilestoneRepo.save(milestone);


            // ============================================
            // MARK CURRENT INSTALLMENT PAID
            // ============================================

            InstallmentPlan installment =
                    installmentPlanRepo
                            .findByApplicationIdAndInstallmentNumber(
                                    document.getApplication().getId(),
                                    installmentNumber
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Installment plan not found"
                                    )
                            );

            installment.setStatus("PAID");

            installmentPlanRepo.save(
                    installment
            );


            // ============================================
            // UNLOCK NEXT INSTALLMENT
            // ============================================

            if (installmentNumber < 3) {

                Integer nextInstallment =
                        installmentNumber + 1;

                InstallmentPlan nextPlan =
                        installmentPlanRepo
                                .findByApplicationIdAndInstallmentNumber(
                                        document.getApplication().getId(),
                                        nextInstallment
                                )
                                .orElse(null);

                if (nextPlan != null) {

                    nextPlan.setStatus(
                            "AVAILABLE"
                    );

                    installmentPlanRepo.save(
                            nextPlan
                    );
                }
            }
        }


        return savedDocument;
    }


    // ============================================================
    // REJECT DOCUMENT
    // ============================================================
    public Document rejectDocument(Long id, String reason) {

        Document document =
                documentRepo.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Document not found")
                        );

        // Document rejected
        document.setVerificationStatus("REJECTED");
        document.setRejectionReason(reason);

        Document savedDocument =
                documentRepo.save(document);


        // Only utilization proof affects milestone
        if (document.getDocumentType()
                .startsWith("UTILIZATION_PROOF_")) {

            String type =
                    document.getDocumentType();

            Integer installmentNumber =
                    Integer.parseInt(
                            type.replace(
                                    "UTILIZATION_PROOF_",
                                    ""
                            )
                    );


            ComplianceMilestone milestone =
                    complianceMilestoneRepo
                            .findByApplicationIdAndInstallmentNumber(
                                    document.getApplication().getId(),
                                    installmentNumber
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Milestone not found"
                                    )
                            );


            // Allow user to resubmit
            milestone.setStatus("REJECTED");

            complianceMilestoneRepo.save(milestone);


            // Send rejection email
            Application application =
                    document.getApplication();

            User user =
                    application.getUser();

            String userName =
                    user.getFirstName() + " " +
                            user.getLastName();

            emailService.sendUtilizationProofRejectedEmail(
                    user.getEmailId(),
                    userName,
                    reason
            );
        }

        return savedDocument;
    }
    // ============================================================
    // GET DOCUMENTS BY APPLICATION
    // ============================================================

    public List<Document> getDocumentsByApplication(
            Long applicationId) {

        return documentRepo.findByApplicationId(
                applicationId
        );
    }


    // ============================================================
    // UPLOAD UTILIZATION PROOF
    // ============================================================

    public Document uploadUtilizationProof(
            MultipartFile file,
            Long milestoneId) throws IOException {


        // ========================================================
        // FIND MILESTONE
        // ========================================================

        ComplianceMilestone milestone =
                complianceMilestoneRepo.findById(milestoneId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Compliance milestone not found"
                                )
                        );


        // ========================================================
        // CHECK FILE
        // ========================================================

        if (file == null || file.isEmpty()) {

            throw new RuntimeException(
                    "Utilization proof file is required"
            );
        }


        // ========================================================
        // ALLOW ONLY PENDING / REJECTED
        // ========================================================

        if (!"PENDING".equals(milestone.getStatus())
                && !"REJECTED".equals(milestone.getStatus())
                && !"OVERDUE".equals(milestone.getStatus())) {

            throw new RuntimeException(
                    "Utilization proof cannot be uploaded for this milestone"
            );
        }


        // ========================================================
        // APPLICATION
        // ========================================================

        Application application =
                milestone.getApplication();


        // ========================================================
        // CREATE DIRECTORY
        // ========================================================

        Path directory =
                Paths.get(uploadDir);

        if (!Files.exists(directory)) {

            Files.createDirectories(directory);
        }


        // ========================================================
        // FILE NAME
        // ========================================================

        String fileName =
                file.getOriginalFilename();


        String savedFileName =
                System.currentTimeMillis()
                        + "_"
                        + fileName;


        Path filePath =
                directory.resolve(savedFileName);


        Files.write(
                filePath,
                file.getBytes()
        );


        // ========================================================
        // CREATE DOCUMENT
        // ========================================================

        Document document =
                new Document();


        document.setDocumentType(
                "UTILIZATION_PROOF_"
                        + milestone.getInstallmentNumber()
        );


        document.setDocumentName(
                fileName
        );


        document.setDocumentPath(
                filePath.toString()
        );


        // IMPORTANT:
        // Proof waits for admin verification

        document.setVerificationStatus(
                "PENDING"
        );


        document.setUploadedAt(
                LocalDateTime.now()
        );


        document.setApplication(
                application
        );


        Document savedDocument =
                documentRepo.save(document);


        // ========================================================
        // UPDATE MILESTONE
        // ========================================================

        milestone.setUtilizationProof(
                savedDocument.getDocumentPath()
        );


        // IMPORTANT:
        // DO NOT COMPLETE HERE

        milestone.setStatus(
                "PENDING"
        );


        milestone.setCompletedDate(
                null
        );


        complianceMilestoneRepo.save(
                milestone
        );


        // ========================================================
        // IMPORTANT
        // DO NOT:
        //
        // installment.setStatus("PAID");
        //
        // DO NOT UNLOCK NEXT INSTALLMENT HERE.
        //
        // Those happen only after ADMIN VERIFIES the proof.
        // ========================================================


        return savedDocument;
    }
}