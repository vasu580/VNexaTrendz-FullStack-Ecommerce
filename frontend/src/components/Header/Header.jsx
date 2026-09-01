import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import './Header.css'

export default function Header() {
  const { user, logout, isLoggedIn } = useAuth()
  const { cart } = useCart()
  const { wishlistCount } = useWishlist()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="header-logo">
          <span className="logo-icon">🛍️</span>
          <span className="logo-text">VNexaTrendz</span>
        </Link>

        {isLoggedIn && (
          <nav className="header-nav">
            <Link
              to="/products"
              className={`nav-link ${
                location.pathname === '/products' ? 'active' : ''
              }`}
            >
              Products
            </Link>
            
            <Link to="/wishlist" className={`nav-link ${location.pathname === '/wishlist' ? 'active' : ''}`}>
  ❤️ Wishlist
  {wishlistCount > 0 && <span className="cart-badge">{wishlistCount}</span>}
</Link>

            <Link
              to="/cart"
              className={`nav-link cart-link ${
                location.pathname === '/cart' ? 'active' : ''
              }`}
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>

              Cart

              {cart.totalItems > 0 && (
                <span className="cart-badge">
                  {cart.totalItems}
                </span>
              )}
            </Link>
          </nav>
        )}

        {isLoggedIn && (
          <div className="header-user">
            <span className="user-greeting">
              Welcome, {user?.username}
            </span>

            <button
              className="btn btn-outline btn-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  )
}