package com.example.DigitalSubsidy.service;

import com.example.DigitalSubsidy.entity.AuthUser;
import com.example.DigitalSubsidy.repository.AuthUserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    AuthUserRepo authUserRepo;

    @Autowired
    PasswordEncoder passwordEncoder;

    public AuthUser register(AuthUser user) {

        user.setPassword(
                passwordEncoder.encode(user.getPassword())
        );

        return authUserRepo.save(user);
    }

    public AuthUser getUserByEmail(String email) {

        return authUserRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}