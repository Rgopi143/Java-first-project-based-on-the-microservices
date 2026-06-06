package com.example.ecommerce.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public record OrderResponse(
        String id,
        String userId,
        String customerName,
        String status,
        @NotNull @DecimalMin("0.0") Double total,
        String paymentMethod,
        String paymentStatus,
        Instant createdAt
) {}
