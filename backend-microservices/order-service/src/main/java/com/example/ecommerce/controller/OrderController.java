package com.example.ecommerce.controller;

import com.example.ecommerce.entity.OrderEntity;
import com.example.ecommerce.repository.OrderRepository;
import com.example.ecommerce.security.AuthPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderRepository orderRepository;

    public OrderController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.userId")
    public List<OrderEntity> getOrdersByUser(@PathVariable String userId,
                                             @AuthenticationPrincipal AuthPrincipal principal) {
        return orderRepository.findByUserId(userId);
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public OrderEntity createOrder(@RequestBody OrderEntity order,
                                   @AuthenticationPrincipal AuthPrincipal principal) {
        order.setUserId(principal.userId());
        return orderRepository.save(order);
    }

    @PostMapping("/{orderId}/cancel")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OrderEntity> cancelOrder(@PathVariable String orderId,
                                                   @AuthenticationPrincipal AuthPrincipal principal) {
        return orderRepository.findById(orderId)
                .map(order -> {
                    if (!principal.isAdmin() && !order.getUserId().equals(principal.userId())) {
                        throw new AccessDeniedException("Cannot cancel another user's order");
                    }
                    order.setStatus("cancelled");
                    return ResponseEntity.ok(orderRepository.save(order));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
