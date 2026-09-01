import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useWishlist } from '../../context/WishlistContext'
import { useCart } from '../../context/CartContext'
import WishlistButton from '../../components/WishlistButton/WishlistButton'
import './Wishlist.css'

export default function Wishlist() {
  const { wishlistItems, fetchWishlist } = useWishlist()
  const { addToCart } = useCart()

  useEffect(() => {
    fetchWishlist()
  }, [fetchWishlist])

  if (wishlistItems.length === 0) {
    return (
      <div className="wishlist-page">
        <div className="container">
          <div className="wishlist-empty">
            <span className="wishlist-empty-icon">🤍</span>
            <h2>Your Wishlist is Empty</h2>
            <p>Save your favourite items here and shop them anytime.</p>
            <Link to="/products" className="btn btn-primary">Browse Products</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="wishlist-page fade-in">
      <div className="container">
        <div className="wishlist-header">
          <h1 className="wishlist-title">
            My Wishlist
            <span className="wishlist-count">{wishlistItems.length} items</span>
          </h1>
        </div>

        <div className="wishlist-grid">
          {wishlistItems.map(product => (
            <div key={product.id} className="wishlist-card">
              {/* Heart button */}
              <div className="wishlist-heart">
                <WishlistButton productId={product.id} />
              </div>

              {/* Image */}
              <Link to={`/products/${product.id}`} className="wishlist-image-wrap">
                <img src={product.imageUrl} alt={product.title} />
                {product.discountPercent > 0 && (
                  <span className="wishlist-discount">-{product.discountPercent}%</span>
                )}
              </Link>

              {/* Info */}
              <div className="wishlist-info">
                <span className="wishlist-brand">{product.brand}</span>
                <Link to={`/products/${product.id}`}>
                  <h3 className="wishlist-product-title">{product.title}</h3>
                </Link>

                <div className="wishlist-pricing">
                  <span className="wishlist-price">
                    ₹{product.price?.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="wishlist-original">
                      ₹{product.originalPrice?.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                {/* Rating */}
                <div className="wishlist-rating">
                  <span className="star-filled">★</span>
                  <span>{product.rating?.toFixed(1)}</span>
                </div>

                {/* Actions */}
                <div className="wishlist-actions">
                  <button
                    className="btn btn-primary wishlist-cart-btn"
                    onClick={() => addToCart(product.id)}
                  >
                    🛒 Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
