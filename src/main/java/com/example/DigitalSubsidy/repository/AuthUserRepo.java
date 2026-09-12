package com.example.DigitalSubsidy.repository;

import com.example.DigitalSubsidy.entity.AuthUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AuthUserRepo extends JpaRepository<AuthUser,Long> {
    Optional<AuthUser> findByEmail( String email);
    void deleteByEmail(String email);
}
