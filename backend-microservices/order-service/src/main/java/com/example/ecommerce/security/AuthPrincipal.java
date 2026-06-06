package com.example.ecommerce.security;

import java.util.Set;

public record AuthPrincipal(String userId, String email, Set<String> roles) {

    public boolean hasRole(String role) {
        return roles.contains(role.toUpperCase());
    }

    public boolean isAdmin() {
        return hasRole("ADMIN");
    }
}
