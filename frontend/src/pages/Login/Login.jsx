import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import toast from 'react-hot-toast'
import './Login.css'

export default function Login() {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const { login, register } = useAuth()
  const { fetchCart } = useCart()
  const { fetchWishlistIds } = useWishlist()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/products'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username.trim() || !form.password.trim()) {
      toast.error('Please fill in all fields')
      return
    }
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(form.username, form.password)
        await fetchCart()
        await fetchWishlistIds()
        toast.success(`Welcome back, ${form.username}!`)
        navigate(from, { replace: true })
      } else {
        await register(form.username, form.password)
        toast.success('Account created! Please log in.')
        setMode('login')
        setForm(prev => ({ ...prev, password: '' }))
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="login-blob blob1"></div>
        <div className="login-blob blob2"></div>
      </div>

      <div className="login-card">
        <div className="login-brand">
          <span className="login-icon">🛍</span>
          <h1>VNexaTrendz</h1>
          <p>Your premium shopping destination</p>
        </div>

        <div className="login-tabs">
          <button
            className={`tab-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => setMode('login')}
          >Sign In</button>
          <button
            className={`tab-btn ${mode === 'register' ? 'active' : ''}`}
            onClick={() => setMode('register')}
          >Create Account</button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter username"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="pass-wrap">
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Enter password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
              <button type="button" className="pass-toggle" onClick={() => setShowPass(v => !v)}>
                {showPass ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? <span className="spinner-sm"></span> : null}
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {mode === 'login' && (
          <div className="login-hint">
            <p>Demo credentials: <strong>rahul</strong> / <strong>password123</strong></p>
          </div>
        )}
      </div>
    </div>
  )
}
