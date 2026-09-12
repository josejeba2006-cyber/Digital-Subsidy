package com.example.DigitalSubsidy.repository;

import com.example.DigitalSubsidy.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface userRepo extends JpaRepository<User, Long> {
}
