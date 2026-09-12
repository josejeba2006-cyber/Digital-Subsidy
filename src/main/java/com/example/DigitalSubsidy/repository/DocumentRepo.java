package com.example.DigitalSubsidy.repository;

import com.example.DigitalSubsidy.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
public interface DocumentRepo extends JpaRepository<Document,Long> {
    List<Document> findByApplicationId(Long applicationId);
    void deleteByApplicationId(Long applicationId);


}
