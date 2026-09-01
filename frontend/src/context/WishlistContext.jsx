import { createContext, useContext, useState, useCallback } from 'react'
import api from '../api/axiosConfig'
import toast from 'react-hot-toast'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const [wishlistIds, setWishlistIds] = useState([])
  const [wishlistItems, setWishlistItems] = useState([])
  const [loading, setLoading] = useState(false)

  // Fetch all wishlisted product IDs (for heart icon highlighting)
  const fetchWishlistIds = useCallback(async () => {
    try {
      const res = await api.get('/wishlist/ids')
      setWishlistIds(res.data)
    } catch (e) {}
  }, [])

  // Fetch full wishlist items (for wishlist page)
  const fetchWishlist = useCallback(async () => {
    try {
      const res = await api.get('/wishlist')
      setWishlistItems(res.data)
    } catch (e) {}
  }, [])

  // Toggle wishlist - heart button click
  const toggleWishlist = useCallback(async (productId) => {
    setLoading(true)
    try {
      const res = await api.post(`/wishlist/toggle/${productId}`)
      const { wishlisted, message } = res.data

      // Update wishlist IDs
      if (wishlisted) {
        setWishlistIds(prev => [...prev, productId])
        toast.success('Added to Wishlist ❤️')
      } else {
        setWishlistIds(prev => prev.filter(id => id !== productId))
        setWishlistItems(prev => prev.filter(item => item.id !== productId))
        toast.success('Removed from Wishlist')
      }
    } catch (e) {
      toast.error('Failed to update wishlist')
    } finally {
      setLoading(false)
    }
  }, [])

  // Check if product is in wishlist
  const isWishlisted = useCallback((productId) => {
    return wishlistIds.includes(productId)
  }, [wishlistIds])

  return (
    <WishlistContext.Provider value={{
      wishlistIds,
      wishlistItems,
      loading,
      fetchWishlistIds,
      fetchWishlist,
      toggleWishlist,
      isWishlisted,
      wishlistCount: wishlistIds.length
    }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)
