import { createContext, useContext, useState, useCallback } from 'react'
import api from '../api/axiosConfig'
import toast from 'react-hot-toast'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], totalItems: 0, totalAmount: 0 })
  const [loading, setLoading] = useState(false)

  const fetchCart = useCallback(async () => {
    try {
      const res = await api.get('/cart')
      setCart(res.data)
    } catch (e) {
      // silently fail if not logged in
    }
  }, [])

  const addToCart = useCallback(async (productId, quantity = 1) => {
    setLoading(true)
    try {
      const res = await api.post('/cart/add', { productId, quantity })
      setCart(res.data)
      toast.success('Added to cart!')
    } catch (e) {
      toast.error('Failed to add to cart')
    } finally {
      setLoading(false)
    }
  }, [])

  const updateQuantity = useCallback(async (productId, quantity) => {
    try {
      const res = await api.put(`/cart/update/${productId}?quantity=${quantity}`)
      setCart(res.data)
    } catch (e) {
      toast.error('Failed to update cart')
    }
  }, [])

  const removeFromCart = useCallback(async (productId) => {
    try {
      const res = await api.delete(`/cart/remove/${productId}`)
      setCart(res.data)
      toast.success('Removed from cart')
    } catch (e) {
      toast.error('Failed to remove item')
    }
  }, [])

  const clearCart = useCallback(async () => {
    try {
      await api.delete('/cart/clear')
      setCart({ items: [], totalItems: 0, totalAmount: 0 })
    } catch (e) {}
  }, [])

  return (
    <CartContext.Provider value={{ cart, loading, fetchCart, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
