package com.example.DigitalSubsidy.controller;

import com.example.DigitalSubsidy.entity.Staff;
import com.example.DigitalSubsidy.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/staff")
public class StaffController {

    @Autowired
    private StaffService staffService;

    @PostMapping("/login")
    public Staff login(@RequestBody StaffLoginRequest request) {

        return staffService.login(
                request.getEmail(),
                request.getPassword()
        );
    }

    public static class StaffLoginRequest {

        private String email;
        private String password;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}