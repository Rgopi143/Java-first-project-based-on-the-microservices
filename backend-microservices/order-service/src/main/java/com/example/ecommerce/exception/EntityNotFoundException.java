package com.example.ecommerce.exception;

public class EntityNotFoundException extends RuntimeException {
    public EntityNotFoundException(String message) {
        super(message);
    }

    public static EntityNotFoundException forEntity(String entity, String id) {
        return new EntityNotFoundException(entity + " not found: " + id);
    }
}
