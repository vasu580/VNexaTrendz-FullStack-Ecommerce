package com.nxttrendz.service;

import com.nxttrendz.dto.ProductDto;
import com.nxttrendz.model.Product;
import com.nxttrendz.model.User;
import com.nxttrendz.model.Wishlist;
import com.nxttrendz.repository.ProductRepository;
import com.nxttrendz.repository.UserRepository;
import com.nxttrendz.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    // Get all wishlist items for a user
    public List<ProductDto> getWishlist(String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        List<Wishlist> wishlists = wishlistRepository.findByUser(user);
        return wishlists.stream()
                .map(w -> toDto(w.getProduct()))
                .collect(Collectors.toList());
    }

    // Add product to wishlist
    @Transactional
    public Map<String, Object> addToWishlist(String username, Long productId) {
        User user = userRepository.findByUsername(username).orElseThrow();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Check if already in wishlist
        if (wishlistRepository.existsByUserAndProductId(user, productId)) {
            return Map.of("message", "Already in wishlist", "wishlisted", true);
        }

        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        wishlist.setProduct(product);
        wishlistRepository.save(wishlist);

        return Map.of("message", "Added to wishlist", "wishlisted", true);
    }

    // Remove product from wishlist
    @Transactional
    public Map<String, Object> removeFromWishlist(String username, Long productId) {
        User user = userRepository.findByUsername(username).orElseThrow();
        wishlistRepository.deleteByUserAndProductId(user, productId);
        return Map.of("message", "Removed from wishlist", "wishlisted", false);
    }

    // Toggle wishlist - add if not present, remove if present
    @Transactional
    public Map<String, Object> toggleWishlist(String username, Long productId) {
        User user = userRepository.findByUsername(username).orElseThrow();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (wishlistRepository.existsByUserAndProductId(user, productId)) {
            wishlistRepository.deleteByUserAndProductId(user, productId);
            return Map.of("message", "Removed from wishlist", "wishlisted", false);
        } else {
            Wishlist wishlist = new Wishlist();
            wishlist.setUser(user);
            wishlist.setProduct(product);
            wishlistRepository.save(wishlist);
            return Map.of("message", "Added to wishlist", "wishlisted", true);
        }
    }

    // Check if product is in wishlist
    public Map<String, Object> isWishlisted(String username, Long productId) {
        User user = userRepository.findByUsername(username).orElseThrow();
        boolean wishlisted = wishlistRepository.existsByUserAndProductId(user, productId);
        return Map.of("wishlisted", wishlisted);
    }

    // Get wishlist product IDs only (for frontend to highlight heart icons)
    public List<Long> getWishlistIds(String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        return wishlistRepository.findByUser(user)
                .stream()
                .map(w -> w.getProduct().getId())
                .collect(Collectors.toList());
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
