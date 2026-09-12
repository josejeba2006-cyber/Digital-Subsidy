package com.example.DigitalSubsidy.repository;

import com.example.DigitalSubsidy.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StaffRepo extends JpaRepository<Staff, Long> {

    Optional<Staff> findByEmail(String email);
}