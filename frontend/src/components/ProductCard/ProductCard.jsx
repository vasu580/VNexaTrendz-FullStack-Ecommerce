import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import './ProductCard.css'
import WishlistButton from '../WishlistButton/WishlistButton'

function StarRating({ rating }) {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          className={`star ${
            s <= Math.round(rating) ? 'filled' : ''
          }`}
        >
          ★
        </span>
      ))}
      <span className="rating-num">
        {rating?.toFixed(1)}
      </span>
    </div>
  )
}

export default function ProductCard({ product }) {
  const { addToCart, loading } = useCart()

  return (
    <div className="product-card fade-in">
      <Link
        to={`/products/${product.id}`}
        className="card-image-wrap"
      >
        <img
          src={product.imageUrl}
          alt={product.title}
          className="card-image"
          loading="lazy"
        />

        {product.discountPercent > 0 && (
          <span className="discount-badge">
            Save {product.discountPercent}%
          </span>
        )}
        <div className="card-wish-btn">
          <WishlistButton productId={product.id} />
        </div>
      </Link>

      <div className="card-body">
        <div className="card-brand">
          {product.brand}
        </div>

        <Link to={`/products/${product.id}`}>
          <h3 className="card-title">
            {product.title}
          </h3>
        </Link>

        <StarRating rating={product.rating} />

        <div className="card-pricing">
          <span className="card-price">
            ₹{product.price?.toLocaleString('en-IN')}
          </span>

          {product.originalPrice &&
            product.originalPrice > product.price && (
              <span className="card-original">
                ₹{product.originalPrice?.toLocaleString('en-IN')}
              </span>
            )}
        </div>

        <div className="card-category">
          {product.category}
        </div>

        <button
          className="btn btn-primary card-btn"
          onClick={() => addToCart(product.id)}
          disabled={loading}
        >
          <svg
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>

          {loading ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}