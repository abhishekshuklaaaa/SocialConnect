'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { setAuthToken } from '@/lib/api'
import { showToast } from './Toast'

interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  avatar?: string
  avatar_url?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (token: string, user: User) => void
  logout: () => void
  refreshUser: (updatedUser: User) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadAuth = () => {
      try {
        const savedToken = localStorage.getItem('token')
        const savedUser = localStorage.getItem('user')
        
        if (savedToken && savedUser) {
          setToken(savedToken)
          setUser(JSON.parse(savedUser))
          setAuthToken(savedToken)
        }
      } catch (error) {
        console.error('Error loading auth data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadAuth()
  }, [])

  const login = (newToken: string, newUser: User) => {
    setToken(newToken)
    setUser(newUser)
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(newUser))
    }
    setAuthToken(newToken)
    
    showToast(`Welcome back, ${newUser.first_name || newUser.username}! 🎉`, 'success')
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
    setAuthToken('')
    showToast('Logged out successfully! 👋', 'info')
  }

  const refreshUser = (updatedUser: User) => {
    setUser(updatedUser)
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, refreshUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}