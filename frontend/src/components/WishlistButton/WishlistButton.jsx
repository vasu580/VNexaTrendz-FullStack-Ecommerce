import { useWishlist } from '../../context/WishlistContext'
import './WishlistButton.css'

export default function WishlistButton({ productId, size = 'md' }) {
  const { toggleWishlist, isWishlisted, loading } = useWishlist()
  const wishlisted = isWishlisted(productId)

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(productId)
  }

  return (
    <button
      className={`wishlist-btn ${wishlisted ? 'wishlisted' : ''} size-${size}`}
      onClick={handleClick}
      disabled={loading}
      title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={wishlisted ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  )
}
