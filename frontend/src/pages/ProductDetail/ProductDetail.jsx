import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../api/axiosConfig'
import { useCart } from '../../context/CartContext'
import './ProductDetail.css'

function StarRating({ rating, count }) {
  return (
    <div className="detail-rating">
      <div className="stars">
        {[1,2,3,4,5].map(s => (
          <span key={s} className={`star ${s <= Math.round(rating) ? 'filled' : ''}`}>★</span>
        ))}
      </div>
      <span className="rating-text">{rating?.toFixed(1)} ({count?.toLocaleString()} reviews)</span>
    </div>
  )
}

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const { addToCart, loading: cartLoading } = useCart()

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="detail-page">
      <div className="container">
        <div className="detail-skeleton">
          <div className="skeleton" style={{ aspectRatio: '1', borderRadius: '12px' }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px 0' }}>
            {[80, 100, 60, 40, 120, 200].map((w, i) => (
              <div key={i} className="skeleton" style={{ height: i === 5 ? '80px' : '20px', width: `${w}%`, maxWidth: '100%' }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  if (!product) return null

  return (
    <div className="detail-page fade-in">
      <div className="container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back to Products
        </button>

        <div className="detail-grid">
          {/* Image */}
          <div className="detail-image-section">
            <div className="detail-image-wrap">
              <img src={product.imageUrl} alt={product.title} />
              {product.discountPercent > 0 && (
                <span className="detail-badge">-{product.discountPercent}% OFF</span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="detail-info">
            <span className="detail-category">{product.category}</span>
            <span className="detail-brand">{product.brand}</span>
            <h1 className="detail-title">{product.title}</h1>

            <StarRating rating={product.rating} count={product.ratingCount} />

            <div className="detail-pricing">
              <span className="detail-price">₹{product.price?.toLocaleString('en-IN')}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="detail-original">₹{product.originalPrice?.toLocaleString('en-IN')}</span>
                  <span className="detail-saving">
                    Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                  </span>
                </>
              )}
            </div>

            <p className="detail-description">{product.description}</p>

            <div className="detail-stock">
              {product.stock > 10 ? (
                <span className="in-stock">✓ In Stock ({product.stock} available)</span>
              ) : product.stock > 0 ? (
                <span className="low-stock">⚠ Only {product.stock} left!</span>
              ) : (
                <span className="out-stock">✕ Out of Stock</span>
              )}
            </div>

            {/* Quantity + Cart */}
            <div className="detail-actions">
              <div className="qty-control">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
              </div>

              <button
                className="btn btn-primary detail-cart-btn"
                onClick={() => addToCart(product.id, qty)}
                disabled={cartLoading || product.stock === 0}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
                Add {qty > 1 ? `${qty} items` : ''} to Cart
              </button>
            </div>

            <div className="detail-perks">
              <div className="perk"><span>🚚</span> Free delivery on orders above ₹500</div>
              <div className="perk"><span>↩</span> Easy 30-day returns</div>
              <div className="perk"><span>🔒</span> Secure payment</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
