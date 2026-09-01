package com.nxttrendz.service;

import com.nxttrendz.dto.ProductDto;
import com.nxttrendz.model.Product;
import com.nxttrendz.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public Page<ProductDto> getProducts(String search, String category, Double minRating,
                                         String sortBy, int page, int size) {
        Sort sort = switch (sortBy != null ? sortBy : "") {
            case "price_low" -> Sort.by("price").ascending();
            case "price_high" -> Sort.by("price").descending();
            case "rating" -> Sort.by("rating").descending();
            default -> Sort.by("id").ascending();
        };

        Pageable pageable = PageRequest.of(page, size, sort);

        String searchParam = (search != null && !search.isBlank()) ? search : null;
        String categoryParam = (category != null && !category.isBlank()) ? category : null;

        Page<Product> products = productRepository.findWithFilters(
                searchParam, categoryParam, minRating, pageable);

        return products.map(this::toDto);
    }

    public Optional<ProductDto> getProductById(Long id) {
        return productRepository.findById(id).map(this::toDto);
    }

    private ProductDto toDto(Product p) {
        ProductDto dto = new ProductDto();
        dto.setId(p.getId());
        dto.setTitle(p.getTitle());
        dto.setBrand(p.getBrand());
        dto.setPrice(p.getPrice());
        dto.setOriginalPrice(p.getOriginalPrice());
        dto.setRating(p.getRating());
        dto.setRatingCount(p.getRatingCount());
        dto.setImageUrl(p.getImageUrl());
        dto.setDescription(p.getDescription());
        dto.setStock(p.getStock());
        if (p.getCategory() != null) {
            dto.setCategory(p.getCategory().getName());
            dto.setCategoryId(p.getCategory().getId());
        }
        if (p.getOriginalPrice() != null && p.getOriginalPrice().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal discount = p.getOriginalPrice().subtract(p.getPrice())
                    .divide(p.getOriginalPrice(), 2, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
            dto.setDiscountPercent(discount.intValue());
        }
        return dto;
    }
}
