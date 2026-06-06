package com.example.ecommerce.repository;

import com.example.ecommerce.entity.ProductReview;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductReviewRepository extends JpaRepository<ProductReview, String> {
    List<ProductReview> findByProductId(String productId);
}
