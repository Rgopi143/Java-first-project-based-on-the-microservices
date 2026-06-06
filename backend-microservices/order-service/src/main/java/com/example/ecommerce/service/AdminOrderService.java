package com.example.ecommerce.service;

import com.example.ecommerce.client.AuthServiceClient;
import com.example.ecommerce.dto.OrderResponse;
import com.example.ecommerce.dto.ProfileDto;
import com.example.ecommerce.dto.RefundRequest;
import com.example.ecommerce.dto.UpdateStatusRequest;
import com.example.ecommerce.entity.OrderEntity;
import com.example.ecommerce.exception.EntityNotFoundException;
import com.example.ecommerce.repository.OrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminOrderService {

    private static final Logger log = LoggerFactory.getLogger(AdminOrderService.class);

    private final OrderRepository orderRepository;
    private final AuthServiceClient authServiceClient;

    public AdminOrderService(OrderRepository orderRepository, AuthServiceClient authServiceClient) {
        this.orderRepository = orderRepository;
        this.authServiceClient = authServiceClient;
    }

    @Transactional(readOnly = true)
    public Page<OrderResponse> listOrders(String statusFilter, Pageable pageable) {
        List<OrderEntity> all = orderRepository.findAll();
        List<OrderEntity> filtered = (statusFilter == null || statusFilter.isBlank())
                ? all
                : all.stream().filter(o -> statusFilter.equalsIgnoreCase(o.getStatus())).toList();

        List<OrderEntity> sorted = filtered.stream()
                .sorted((a, b) -> b.getId().compareTo(a.getId()))
                .toList();

        int total = sorted.size();
        int from = Math.min((int) pageable.getOffset(), total);
        int to = Math.min(from + pageable.getPageSize(), total);
        List<OrderEntity> pageContent = sorted.subList(from, to);

        Map<String, String> nameById = new HashMap<>();
        for (OrderEntity o : pageContent) {
            String userId = o.getUserId();
            if (userId != null && !nameById.containsKey(userId)) {
                try {
                    ProfileDto profile = authServiceClient.getProfile(userId);
                    nameById.put(userId, profile != null ? profile.fullName() : "(unknown)");
                } catch (Exception ex) {
                    log.warn("Failed to fetch profile for userId {}: {}", userId, ex.getMessage());
                    nameById.put(userId, "(error fetching name)");
                }
            }
        }

        List<OrderResponse> mapped = pageContent.stream()
                .map(o -> new OrderResponse(
                        o.getId(),
                        o.getUserId(),
                        nameById.getOrDefault(o.getUserId(), "(unknown)"),
                        o.getStatus(),
                        o.getTotal(),
                        o.getPaymentMethod(),
                        o.getPaymentStatus(),
                        o.getCreatedAt()
                ))
                .toList();

        return new PageImpl<>(mapped, pageable, total);
    }

    @Transactional
    public OrderResponse updateStatus(String orderId, UpdateStatusRequest request) {
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> EntityNotFoundException.forEntity("Order", orderId));
        order.setStatus(request.status());
        OrderEntity saved = orderRepository.save(order);
        log.info("Order {} status changed to {} (note: {})", orderId, request.status(), request.note());
        
        String customerName = "(unknown)";
        try {
            ProfileDto profile = authServiceClient.getProfile(saved.getUserId());
            if (profile != null) customerName = profile.fullName();
        } catch (Exception ex) {
            log.warn("Failed to fetch profile for userId {}: {}", saved.getUserId(), ex.getMessage());
        }

        return toResponse(saved, customerName);
    }

    @Transactional
    public OrderResponse refund(String orderId, RefundRequest request) {
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> EntityNotFoundException.forEntity("Order", orderId));
        double amount = request.amount() == null ? order.getTotal() : request.amount();
        if (amount <= 0 || amount > order.getTotal()) {
            throw new IllegalArgumentException("Refund amount must be between 0 and " + order.getTotal());
        }
        log.info("Refunding order {} amount={} reason='{}'", orderId, amount, request.reason());
        order.setPaymentStatus("refunded");
        OrderEntity saved = orderRepository.save(order);
        
        String customerName = "(unknown)";
        try {
            ProfileDto profile = authServiceClient.getProfile(saved.getUserId());
            if (profile != null) customerName = profile.fullName();
        } catch (Exception ex) {
            log.warn("Failed to fetch profile for userId {}: {}", saved.getUserId(), ex.getMessage());
        }

        return toResponse(saved, customerName);
    }

    private OrderResponse toResponse(OrderEntity o, String customerName) {
        return new OrderResponse(
                o.getId(),
                o.getUserId(),
                customerName,
                o.getStatus(),
                o.getTotal(),
                o.getPaymentMethod(),
                o.getPaymentStatus(),
                o.getCreatedAt()
        );
    }
}
