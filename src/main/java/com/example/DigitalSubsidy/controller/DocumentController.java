package com.example.DigitalSubsidy.controller;

import com.example.DigitalSubsidy.entity.Document;
import com.example.DigitalSubsidy.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/documents")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @PostMapping("/upload")
    public Document uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("documentType") String documentType,
            @RequestParam("applicationId") Long applicationId)
            throws IOException {

        return documentService.uploadDocument(
                file,
                documentType,
                applicationId
        );
    }

    @GetMapping
    public List<Document> getAllDocuments() {
        return documentService.getAllDocuments();
    }

    @GetMapping("/{id}")
    public Document getDocumentById(@PathVariable Long id) {
        return documentService.getDocumentById(id);
    }
    @PutMapping("/{id}/verify")
    public Document verifyDocument(@PathVariable Long id) {
        return documentService.verifyDocument(id);
    }

    @PutMapping("/{id}/reject")
    public Document rejectDocument(
            @PathVariable Long id,
            @RequestParam String reason) {

        if (reason == null || reason.trim().isEmpty()) {
            throw new RuntimeException(
                    "Rejection reason is required"
            );
        }

        return documentService.rejectDocument(
                id,
                reason.trim()
        );
    }
    @GetMapping("/application/{applicationId}")
    public List<Document> getDocumentsByApplication(
            @PathVariable Long applicationId) {

        return documentService.getDocumentsByApplication(applicationId);
    }


    @GetMapping("/{id}/file")
    public ResponseEntity<Resource> getDocumentFile(
            @PathVariable Long id) throws IOException {

        Document document =
                documentService.getDocumentById(id);

        Path path =
                Paths.get(document.getDocumentPath());

        Resource resource =
                new UrlResource(path.toUri());

        if (!resource.exists()) {
            throw new RuntimeException("File not found");
        }

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" +
                                document.getDocumentName() +
                                "\""
                )
                .contentType(MediaType.APPLICATION_PDF)
                .body(resource);
    }

    @PostMapping("/utilization-proof/{milestoneId}")
    public Document uploadUtilizationProof(
            @RequestParam("file") MultipartFile file,
            @PathVariable Long milestoneId)
            throws IOException {

        return documentService.uploadUtilizationProof(
                file,
                milestoneId
        );
    }
}