package com.example.ecommerce.controller;

import com.example.ecommerce.entity.Profile;
import com.example.ecommerce.repository.ProfileRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final ProfileRepository profileRepository;

    public AuthController(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<Profile> register(@RequestBody Profile profile) {
        if (profile.getId() == null || profile.getId().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        Profile saved = profileRepository.save(profile);
        return ResponseEntity.ok(saved);
    }
}
