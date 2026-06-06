package com.example.ecommerce.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RefundRequest(
        @DecimalMin("0.01") Double amount,

        @NotNull
        @Size(min = 1, max = 500, message = "must be between 1 and 500 characters")
        String reason
) {}
