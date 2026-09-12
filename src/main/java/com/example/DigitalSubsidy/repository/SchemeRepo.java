package com.example.DigitalSubsidy.repository;

import com.example.DigitalSubsidy.entity.Scheme;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SchemeRepo extends JpaRepository<Scheme,Long> {
}
