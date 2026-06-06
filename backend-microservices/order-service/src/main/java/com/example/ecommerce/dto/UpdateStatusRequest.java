package com.example.ecommerce.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record UpdateStatusRequest(
        @NotBlank
        @Pattern(
            regexp = "pending|confirmed|processing|shipped|delivered|cancelled",
            message = "must be one of: pending, confirmed, processing, shipped, delivered, cancelled"
        )
        String status,

        String note
) {}
