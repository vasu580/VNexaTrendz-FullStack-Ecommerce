package com.nxttrendz.repository;

import com.nxttrendz.model.Wishlist;
import com.nxttrendz.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

    // Get all wishlist items for a user
    List<Wishlist> findByUser(User user);

    // Find specific wishlist item by user and product
    Optional<Wishlist> findByUserAndProductId(User user, Long productId);

    // Check if product is already in wishlist
    boolean existsByUserAndProductId(User user, Long productId);

    // Delete specific item from wishlist
    void deleteByUserAndProductId(User user, Long productId);
}