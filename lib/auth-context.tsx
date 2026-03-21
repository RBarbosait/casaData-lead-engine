'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, mockUsers } from './data'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('casadata_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Mock validation - in production this would be a real API call
    const existingUser = mockUsers.find(u => u.email === email)
    
    if (existingUser || email.includes('@')) {
      const loggedInUser: User = existingUser || {
        id: crypto.randomUUID(),
        email,
        name: email.split('@')[0],
        createdAt: new Date().toISOString()
      }
      setUser(loggedInUser)
      localStorage.setItem('casadata_user', JSON.stringify(loggedInUser))
      return true
    }
    
    return false
  }

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      name,
      createdAt: new Date().toISOString()
    }
    
    setUser(newUser)
    localStorage.setItem('casadata_user', JSON.stringify(newUser))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('casadata_user')
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
