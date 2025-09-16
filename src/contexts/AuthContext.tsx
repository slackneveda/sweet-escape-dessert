import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { User } from '@/types'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Check for saved user in localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Failed to parse saved user:', error)
        localStorage.removeItem('user')
      }
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Check admin credentials first
    if (email === 'admin@sweetdelights.com' && password === 'admin123') {
      const adminUser: User = {
        id: '1',
        name: 'Admin User',
        email: 'admin@sweetdelights.com',
        isAdmin: true
      }
      setUser(adminUser)
      localStorage.setItem('user', JSON.stringify(adminUser))
      setIsLoading(false)
      return true
    }
    
    // Check registered users
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
    const foundUser = registeredUsers.find((u: any) => u.email === email)
    
    if (foundUser && password && password.length >= 6) {
      setUser(foundUser)
      localStorage.setItem('user', JSON.stringify(foundUser))
      setIsLoading(false)
      return true
    }
    
    setIsLoading(false)
    return false
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
    if (existingUsers.find((u: any) => u.email === email)) {
      setIsLoading(false)
      return false // User already exists
    }
    
    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      isAdmin: false
    }
    
    // Save to registered users
    existingUsers.push(newUser)
    localStorage.setItem('registeredUsers', JSON.stringify(existingUsers))
    
    // Log in the user
    setUser(newUser)
    localStorage.setItem('user', JSON.stringify(newUser))
    setIsLoading(false)
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}