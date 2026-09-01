package com.nxttrendz.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDto {
    private Long id;
    private String title;
    private String brand;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private Double rating;
    private Integer ratingCount;
    private String category;
    private Long categoryId;
    private String imageUrl;
    private String description;
    private Integer stock;
    private Integer discountPercent;
}
