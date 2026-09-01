package com.nxttrendz.repository;

import com.nxttrendz.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT p FROM Product p WHERE " +
           "(:search IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(p.brand) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:category IS NULL OR p.category.name = :category) AND " +
           "(:minRating IS NULL OR p.rating >= :minRating)")
    Page<Product> findWithFilters(
            @Param("search") String search,
            @Param("category") String category,
            @Param("minRating") Double minRating,
            Pageable pageable
    );
}
