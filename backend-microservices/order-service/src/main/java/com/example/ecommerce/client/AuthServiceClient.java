package com.example.ecommerce.client;

import com.example.ecommerce.dto.ProfileDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "auth-service", path = "/api/profiles")
public interface AuthServiceClient {

    @GetMapping("/{id}")
    ProfileDto getProfile(@PathVariable("id") String id);
}
