package com.example.ecommerce.controller;

import com.example.ecommerce.dto.OrderResponse;
import com.example.ecommerce.dto.RefundRequest;
import com.example.ecommerce.dto.UpdateStatusRequest;
import com.example.ecommerce.service.AdminOrderService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/orders")
@PreAuthorize("hasRole('ADMIN')")
public class AdminOrderController {

    private final AdminOrderService adminOrderService;

    public AdminOrderController(AdminOrderService adminOrderService) {
        this.adminOrderService = adminOrderService;
    }

    @GetMapping
    public Page<OrderResponse> listOrders(
            @RequestParam(required = false) String status,
            Pageable pageable
    ) {
        return adminOrderService.listOrders(status, pageable);
    }

    @PatchMapping("/{id}/status")
    public OrderResponse updateStatus(@PathVariable String id, @Valid @RequestBody UpdateStatusRequest request) {
        return adminOrderService.updateStatus(id, request);
    }

    @PostMapping("/{id}/refund")
    public ResponseEntity<OrderResponse> refund(@PathVariable String id, @Valid @RequestBody RefundRequest request) {
        return ResponseEntity.ok(adminOrderService.refund(id, request));
    }
}
