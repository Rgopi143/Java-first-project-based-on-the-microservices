package com.example.ecommerce.security;

import java.util.Set;

/**
 * The authenticated user as derived from a Supabase-issued JWT.
 */
public record AuthPrincipal(String userId, String email, Set<String> roles) {

    public boolean hasRole(String role) {
        return roles.contains(role.toUpperCase());
    }

    public boolean isAdmin() {
        return hasRole("ADMIN");
    }
}
