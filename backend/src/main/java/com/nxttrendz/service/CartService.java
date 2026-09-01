package com.nxttrendz.service;

import com.nxttrendz.dto.CartDtos;
import com.nxttrendz.model.CartItem;
import com.nxttrendz.model.Product;
import com.nxttrendz.model.User;
import com.nxttrendz.repository.CartItemRepository;
import com.nxttrendz.repository.ProductRepository;
import com.nxttrendz.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    public CartDtos.CartResponse getCart(String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        List<CartItem> items = cartItemRepository.findByUser(user);
        return buildCartResponse(items);
    }

    @Transactional
    public CartDtos.CartResponse addToCart(String username, Long productId, int quantity) {
        User user = userRepository.findByUsername(username).orElseThrow();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem item = cartItemRepository.findByUserAndProductId(user, productId)
                .orElse(new CartItem(null, user, product, 0));

        item.setQuantity(item.getQuantity() + quantity);
        cartItemRepository.save(item);

        return getCart(username);
    }

    @Transactional
    public CartDtos.CartResponse updateQuantity(String username, Long productId, int quantity) {
        User user = userRepository.findByUsername(username).orElseThrow();
        CartItem item = cartItemRepository.findByUserAndProductId(user, productId)
                .orElseThrow(() -> new RuntimeException("Item not in cart"));

        if (quantity <= 0) {
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }

        return getCart(username);
    }

    @Transactional
    public CartDtos.CartResponse removeFromCart(String username, Long productId) {
        User user = userRepository.findByUsername(username).orElseThrow();
        cartItemRepository.findByUserAndProductId(user, productId)
                .ifPresent(cartItemRepository::delete);
        return getCart(username);
    }

    @Transactional
    public void clearCart(String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        cartItemRepository.deleteByUser(user);
    }

    private CartDtos.CartResponse buildCartResponse(List<CartItem> items) {
        List<CartDtos.CartItemDto> dtos = items.stream().map(item -> {
            Product p = item.getProduct();
            BigDecimal subtotal = p.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            return new CartDtos.CartItemDto(
                    item.getId(), p.getId(), p.getTitle(), p.getBrand(),
                    p.getPrice(), p.getImageUrl(), item.getQuantity(), subtotal
            );
        }).collect(Collectors.toList());

        int totalItems = dtos.stream().mapToInt(CartDtos.CartItemDto::getQuantity).sum();
        BigDecimal totalAmount = dtos.stream()
                .map(CartDtos.CartItemDto::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new CartDtos.CartResponse(dtos, totalItems, totalAmount);
    }
}
