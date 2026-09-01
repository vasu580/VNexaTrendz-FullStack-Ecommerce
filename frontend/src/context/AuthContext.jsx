import { createContext, useContext, useState, useCallback } from 'react'
import api from '../api/axiosConfig'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('jwtToken')
    const username = localStorage.getItem('username')

    return token && username
      ? {
          token,
          username,
        }
      : null
  })

  const login = useCallback(async (username, password) => {
    const res = await api.post('/auth/login', {
      username,
      password,
    })

    // Supports both "token" and "jwtToken"
    const token = res.data.token || res.data.jwtToken

    if (!token) {
      throw new Error('JWT token not received from server')
    }

    localStorage.setItem('jwtToken', token)
    localStorage.setItem('username', username)

    setUser({
      token,
      username,
    })

    return res.data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('jwtToken')
    localStorage.removeItem('username')
    setUser(null)
  }, [])

  const register = useCallback(async (username, password) => {
    const res = await api.post('/auth/register', {
      username,
      password,
    })

    return res.data
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        isLoggedIn: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)

  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return ctx
}