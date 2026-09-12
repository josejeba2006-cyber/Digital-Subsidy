package com.example.DigitalSubsidy.service;

import com.example.DigitalSubsidy.entity.Application;
import com.example.DigitalSubsidy.entity.Disbursement;
import com.example.DigitalSubsidy.entity.Document;
import com.example.DigitalSubsidy.entity.User;
import com.example.DigitalSubsidy.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class userService {

    @Autowired
    userRepo userrepo;
    @Autowired
    ApplicationRepo applicationRepo;
    @Autowired
    DisbursementRepo disbursementRepo;
    @Autowired
    DocumentRepo documentRepo;
    @Autowired
    BankDetailsRepo bankDetailsRepo;
    @Autowired
    AuthUserRepo authUserRepo;

    @Autowired
    ComplianceMilestoneRepo complianceMilestoneRepo;

    @Autowired
    InstallmentPlanRepo installmentPlanRepo;

    public List<User> getallusers() {
       return  userrepo.findAll();
    }

    public String addnewUsers(User user) {

        userrepo.save(user);
        return "new User added";
    }

    public User finduserid(long id) {

        return userrepo.findById(id).orElse(null);
    }
    @Transactional
    public String DeleteIdByUser(long id) {

        // Find user first
        User user = userrepo.findById(id).orElse(null);

        if (user == null) {
            return "User not found";
        }

        // Store email before deleting user
        String email = user.getEmailId();

        List<Application> applications =
                applicationRepo.findByUserId(id);

        for (Application application : applications) {

            Long applicationId = application.getId();

            // Delete Documents
            List<Document> documents =
                    documentRepo.findByApplicationId(applicationId);

            documentRepo.deleteAll(documents);

            // Delete Disbursements
            List<Disbursement> disbursements =
                    disbursementRepo.findByApplicationId(applicationId);

            disbursementRepo.deleteAll(disbursements);

            // Delete Bank Details
            bankDetailsRepo.deleteByApplicationId(applicationId);

            // Delete Compliance Milestones
            complianceMilestoneRepo.deleteByApplicationId(applicationId);

            // Delete Installment Plans
            installmentPlanRepo.deleteByApplicationId(applicationId);
        }

        // Delete Applications
        applicationRepo.deleteAll(applications);

        // Delete User profile
        userrepo.deleteById(id);

        // Delete login account
        if (email != null) {
            authUserRepo.deleteByEmail(email);
        }

        return "User Data Deleted";
    }
    public User updateUser(Long id, User updatedUser) {

        User user = userrepo.findById(id).orElse(null);

        if (user != null) {
            user.setFirstName(updatedUser.getFirstName());
            user.setLastName(updatedUser.getLastName());
            user.setPhone(updatedUser.getPhone());
            user.setEmailId(updatedUser.getEmailId());
            user.setDateofbirth(updatedUser.getDateofbirth());
            user.setAnnualIncome(updatedUser.getAnnualIncome());
            user.setOccupation(updatedUser.getOccupation());
            user.setLocation(updatedUser.getLocation());
            user.setGender(updatedUser.getGender());
            user.setBeneficiaryCategory(
                    updatedUser.getBeneficiaryCategory()
            );
            user.setGender(updatedUser.getGender());

            user.setBeneficiaryCategory(
                    updatedUser.getBeneficiaryCategory()
            );
            return userrepo.save(user);
        }
                return null;
    }
}
