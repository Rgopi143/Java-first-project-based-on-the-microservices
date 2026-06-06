package com.example.ecommerce.dto;

public record ProfileDto(
        String id,
        String email,
        String fullName,
        String phoneNumber,
        String role
) {}
