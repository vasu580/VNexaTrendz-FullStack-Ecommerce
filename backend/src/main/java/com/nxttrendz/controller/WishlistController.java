package com.nxttrendz.controller;

import com.nxttrendz.dto.ProductDto;
import com.nxttrendz.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    // GET /api/wishlist - Get all wishlist items
    @GetMapping
    public ResponseEntity<List<ProductDto>> getWishlist(
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(wishlistService.getWishlist(user.getUsername()));
    }

    // GET /api/wishlist/ids - Get all wishlisted product IDs
    @GetMapping("/ids")
    public ResponseEntity<List<Long>> getWishlistIds(
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(wishlistService.getWishlistIds(user.getUsername()));
    }

    // POST /api/wishlist/toggle/{productId} - Toggle wishlist
    @PostMapping("/toggle/{productId}")
    public ResponseEntity<Map<String, Object>> toggleWishlist(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Long productId) {
        return ResponseEntity.ok(
                wishlistService.toggleWishlist(user.getUsername(), productId));
    }

    // POST /api/wishlist/add/{productId} - Add to wishlist
    @PostMapping("/add/{productId}")
    public ResponseEntity<Map<String, Object>> addToWishlist(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Long productId) {
        return ResponseEntity.ok(
                wishlistService.addToWishlist(user.getUsername(), productId));
    }

    // DELETE /api/wishlist/remove/{productId} - Remove from wishlist
    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<Map<String, Object>> removeFromWishlist(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Long productId) {
        return ResponseEntity.ok(
                wishlistService.removeFromWishlist(user.getUsername(), productId));
    }

    // GET /api/wishlist/check/{productId} - Check if product is wishlisted
    @GetMapping("/check/{productId}")
    public ResponseEntity<Map<String, Object>> isWishlisted(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Long productId) {
        return ResponseEntity.ok(
                wishlistService.isWishlisted(user.getUsername(), productId));
    }
}
