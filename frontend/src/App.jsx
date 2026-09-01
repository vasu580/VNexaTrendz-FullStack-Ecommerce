import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'

import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import Header from './components/Header/Header'

import Login from './pages/Login/Login'
import Products from './pages/Products/Products'
import ProductDetail from './pages/ProductDetail/ProductDetail'
import Cart from './pages/Cart/Cart'
import Wishlist from './pages/Wishlist/Wishlist'
import NotFound from './pages/NotFound/NotFound'

function Layout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>

            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#FFFFFF',
                  color: '#111827',
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  fontSize: '14px',
                  boxShadow: '0 8px 24px rgba(124,58,237,0.12)',
                },
                success: {
                  iconTheme: {
                    primary: '#7C3AED',
                    secondary: '#FFFFFF',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#EC4899',
                    secondary: '#FFFFFF',
                  },
                },
              }}
            />

            <Routes>

              {/* Home */}
              <Route path="/" element={<Navigate to="/products" replace />} />

              {/* Login */}
              <Route path="/login" element={<Login />} />

              {/* Products */}
              <Route
                path="/products"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Products />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* Product Details */}
              <Route
                path="/products/:id"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <ProductDetail />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* Cart */}
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Cart />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* Wishlist */}
              <Route
                path="/wishlist"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Wishlist />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* 404 */}
              <Route
                path="*"
                element={
                  <Layout>
                    <NotFound />
                  </Layout>
                }
              />

            </Routes>

          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}