import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import toast from 'react-hot-toast'
import './Cart.css'

export default function Cart() {
  const { cart, fetchCart, updateQuantity, removeFromCart, clearCart } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const handleCheckout = async () => {
    await clearCart()
    toast.success('Order placed successfully! 🎉')
    navigate('/products')
  }

  if (cart.items?.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-empty">
            <span className="cart-empty-icon">🛒</span>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything yet.</p>
            <Link to="/products" className="btn btn-primary">Browse Products</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page fade-in">
      <div className="container">
        <h1 className="cart-title">
          Shopping Cart
          <span className="cart-item-count">{cart.totalItems} items</span>
        </h1>

        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            {cart.items?.map(item => (
              <div key={item.id} className="cart-item">
                <Link to={`/products/${item.productId}`} className="cart-item-image">
                  <img src={item.imageUrl} alt={item.title} />
                </Link>

                <div className="cart-item-info">
                  <div className="cart-item-brand">{item.brand}</div>
                  <Link to={`/products/${item.productId}`}>
                    <h3 className="cart-item-title">{item.title}</h3>
                  </Link>
                  <div className="cart-item-price">₹{item.price?.toLocaleString('en-IN')}</div>
                </div>

                <div className="cart-item-actions">
                  <div className="qty-control">
                    <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
                  </div>
                  <div className="cart-item-subtotal">
                    ₹{item.subtotal?.toLocaleString('en-IN')}
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.productId)}
                    title="Remove"
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                      <path d="M10 11v6M14 11v6"/>
                      <path d="M9 6V4h6v2"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <h3 className="summary-title">Order Summary</h3>

            <div className="summary-rows">
              <div className="summary-row">
                <span>Subtotal ({cart.totalItems} items)</span>
                <span>₹{cart.totalAmount?.toLocaleString('en-IN')}</span>
              </div>
              <div className="summary-row">
                <span>Delivery</span>
                <span className="free-text">FREE</span>
              </div>
              <div className="summary-row summary-total">
                <span>Total</span>
                <span>₹{cart.totalAmount?.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button className="btn btn-primary checkout-btn" onClick={handleCheckout}>
              Place Order →
            </button>

            <Link to="/products" className="continue-link">← Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
