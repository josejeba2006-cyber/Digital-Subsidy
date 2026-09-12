package com.example.DigitalSubsidy.repository;

import com.example.DigitalSubsidy.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepo extends JpaRepository<Application,Long> {
    boolean existsByUserIdAndSchemeIdAndStatusNotIn(
            Long userId,
            Long schemeId,
            List<String> statuses
    );
    List<Application> findByUserId(Long userId);
}
