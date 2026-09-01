package com.nxttrendz.controller;

import com.nxttrendz.dto.CartDtos;
import com.nxttrendz.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public ResponseEntity<CartDtos.CartResponse> getCart(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(cartService.getCart(user.getUsername()));
    }

    @PostMapping("/add")
    public ResponseEntity<CartDtos.CartResponse> addToCart(
            @AuthenticationPrincipal UserDetails user,
            @RequestBody CartDtos.AddToCartRequest request) {
        return ResponseEntity.ok(cartService.addToCart(
                user.getUsername(), request.getProductId(),
                request.getQuantity() != null ? request.getQuantity() : 1));
    }

    @PutMapping("/update/{productId}")
    public ResponseEntity<CartDtos.CartResponse> updateQuantity(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Long productId,
            @RequestParam int quantity) {
        return ResponseEntity.ok(cartService.updateQuantity(user.getUsername(), productId, quantity));
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<CartDtos.CartResponse> removeItem(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Long productId) {
        return ResponseEntity.ok(cartService.removeFromCart(user.getUsername(), productId));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(@AuthenticationPrincipal UserDetails user) {
        cartService.clearCart(user.getUsername());
        return ResponseEntity.noContent().build();
    }
}
