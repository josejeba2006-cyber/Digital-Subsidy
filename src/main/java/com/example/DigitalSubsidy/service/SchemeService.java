package com.example.DigitalSubsidy.service;

import com.example.DigitalSubsidy.dto.EligibleSchemeDTO;
import com.example.DigitalSubsidy.entity.GrantSlab;
import com.example.DigitalSubsidy.entity.Scheme;
import com.example.DigitalSubsidy.entity.User;
import com.example.DigitalSubsidy.repository.GrantSlabRepo;
import com.example.DigitalSubsidy.repository.SchemeRepo;
import com.example.DigitalSubsidy.repository.userRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;

@Service
public class SchemeService {

    @Autowired
    SchemeRepo schemerepo;

    @Autowired
    userRepo userrepo;

    @Autowired
    GrantSlabRepo grantslabrepo;


    public Scheme createScheme(Scheme scheme) {
        return schemerepo.save(scheme);
    }


    public List<Scheme> getAllSchemes() {
        return schemerepo.findAll();
    }


    public Scheme getSchemeById(Long id) {
        return schemerepo.findById(id).orElse(null);
    }


    public void deleteScheme(Long id) {
        schemerepo.deleteById(id);
    }

    public List<EligibleSchemeDTO> getEligibleSchemes(Long userId) {

        User user = userrepo.findById(userId).orElse(null);

        if (user == null) {
            return List.of();
        }

        // ================= AGE =================

        LocalDate dob = user.getDateofbirth();

        int age = Period.between(
                dob,
                LocalDate.now()
        ).getYears();

        // ================= USER DETAILS =================

        String userOccupation =
                user.getOccupation() == null
                        ? ""
                        : user.getOccupation().trim();

        String userGender =
                user.getGender() == null
                        ? ""
                        : user.getGender().trim();

        String userCategory =
                user.getBeneficiaryCategory() == null
                        ? ""
                        : user.getBeneficiaryCategory().trim();

        String userLocation =
                user.getLocation() == null
                        ? ""
                        : user.getLocation().trim();

        // ================= GET ALL SCHEMES =================

        List<Scheme> schemes = schemerepo.findAll();

        return schemes.stream()

                // ================= STATUS =================
                .filter(scheme ->
                        scheme.getStatus() != null
                                && scheme.getStatus()
                                .equalsIgnoreCase("ACTIVE")
                )

                // ================= AGE =================
                .filter(scheme ->
                        scheme.getMinimumAge() != null
                                && scheme.getMaximumAge() != null
                                && age >= scheme.getMinimumAge()
                                && age <= scheme.getMaximumAge()
                )

                // ================= OCCUPATION =================
                .filter(scheme -> {

                    String schemeOccupation =
                            scheme.getEligibleOccupation();

                    if (schemeOccupation == null
                            || schemeOccupation.trim().isEmpty()
                            || schemeOccupation.equalsIgnoreCase("ALL")
                            || schemeOccupation.equalsIgnoreCase("ANY")) {

                        return true;
                    }

                    return schemeOccupation
                            .trim()
                            .equalsIgnoreCase(userOccupation);
                })

                // ================= LOCATION =================
                .filter(scheme -> {

                    String schemeLocation =
                            scheme.getEligibleLocation();

                    if (schemeLocation == null
                            || schemeLocation.trim().isEmpty()
                            || schemeLocation.equalsIgnoreCase("ALL")
                            || schemeLocation.equalsIgnoreCase("ANY")) {

                        return true;
                    }

                    return schemeLocation
                            .trim()
                            .equalsIgnoreCase(userLocation);
                })

                // ================= GENDER =================
                .filter(scheme -> {

                    String schemeGender =
                            scheme.getEligibleGender();

                    if (schemeGender == null
                            || schemeGender.trim().isEmpty()
                            || schemeGender.equalsIgnoreCase("ALL")
                            || schemeGender.equalsIgnoreCase("ANY")) {

                        return true;
                    }

                    return schemeGender
                            .trim()
                            .equalsIgnoreCase(userGender);
                })

                // ================= BENEFICIARY CATEGORY =================
                .filter(scheme -> {

                    String schemeCategory =
                            scheme.getEligibleBeneficiaryCategory();

                    if (schemeCategory == null
                            || schemeCategory.trim().isEmpty()
                            || schemeCategory.equalsIgnoreCase("ALL")
                            || schemeCategory.equalsIgnoreCase("ANY")) {

                        return true;
                    }

                    return schemeCategory
                            .trim()
                            .equalsIgnoreCase(userCategory);
                })

                // ================= INCOME =================
                .filter(scheme -> {

                    // If no income is entered,
                    // don't reject the scheme here.
                    if (user.getAnnualIncome() == null) {
                        return true;
                    }

                    // Check whether this scheme has an income slab
                    return grantslabrepo
                            .findBySchemeIdAndMinimumIncomeLessThanEqualAndMaximumIncomeGreaterThanEqual(
                                    scheme.getId(),
                                    user.getAnnualIncome(),
                                    user.getAnnualIncome()
                            )
                            .isPresent();
                })

                // ================= DTO =================
                .map(scheme -> {

                    GrantSlab slab = null;

                    if (user.getAnnualIncome() != null) {

                        slab = grantslabrepo
                                .findBySchemeIdAndMinimumIncomeLessThanEqualAndMaximumIncomeGreaterThanEqual(
                                        scheme.getId(),
                                        user.getAnnualIncome(),
                                        user.getAnnualIncome()
                                )
                                .orElse(null);
                    }

                    // ================= SCORE =================

                    int score = 0;

                    // Age
                    score += 20;

                    // Income
                    if (slab != null) {
                        score += 30;
                    }

                    // Occupation
                    score += 20;

                    // Gender
                    score += 10;

                    // Category
                    score += 20;

                    return new EligibleSchemeDTO(
                            scheme,
                            slab,
                            score
                    );
                })

                .toList();
    }


    public Scheme updateScheme(
            Long id,
            Scheme updatedScheme) {

        Scheme scheme =
                schemerepo.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Scheme not found"
                                )
                        );


        scheme.setSchemeName(
                updatedScheme.getSchemeName()
        );

        scheme.setDescription(
                updatedScheme.getDescription()
        );

        scheme.setMinimumAge(
                updatedScheme.getMinimumAge()
        );

        scheme.setMaximumAge(
                updatedScheme.getMaximumAge()
        );

        scheme.setEligibleOccupation(
                updatedScheme.getEligibleOccupation()
        );

        scheme.setEligibleLocation(
                updatedScheme.getEligibleLocation()
        );

        scheme.setRequiredDocuments(
                updatedScheme.getRequiredDocuments()
        );

        scheme.setStartDate(
                updatedScheme.getStartDate()
        );

        scheme.setEndDate(
                updatedScheme.getEndDate()
        );

        scheme.setStatus(
                updatedScheme.getStatus()
        );

        scheme.setEligibleGender(
                updatedScheme.getEligibleGender()
        );

        scheme.setEligibleBeneficiaryCategory(
                updatedScheme.getEligibleBeneficiaryCategory()
        );


        return schemerepo.save(scheme);
    }

}