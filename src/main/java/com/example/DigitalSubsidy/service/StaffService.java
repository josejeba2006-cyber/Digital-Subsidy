package com.example.DigitalSubsidy.service;

import com.example.DigitalSubsidy.entity.Staff;
import com.example.DigitalSubsidy.repository.StaffRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StaffService {

    @Autowired
    private StaffRepo staffRepo;

    public Staff login(String email, String password) {

        Staff staff = staffRepo.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password"));

        if (!staff.getPassword().equals(password)) {

            throw new RuntimeException(
                    "Invalid email or password"
            );
        }

        return staff;
    }
}