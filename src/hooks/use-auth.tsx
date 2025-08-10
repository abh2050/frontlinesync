import { createContext, useContext, ReactNode } from 'react'
import { useKV } from './use-kv'
import { User } from '../types'
import { toast } from 'sonner'

type AuthContextValue = {
  user: User | null | undefined
  isLoading: boolean | undefined
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: true } | { success: false; error: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const currentUserKV = useKV<User | null>('auth_user', null)
  const isLoadingKV = useKV<boolean>('auth_loading', false)
  
  const currentUser = currentUserKV.value
  const setCurrentUser = currentUserKV.set
  const isLoading = isLoadingKV.value
  const setIsLoading = isLoadingKV.set

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      if (!email || !password) throw new Error('Email and password are required')
      const normalizedEmail = email.toLowerCase().trim()

      // Simulate minimal latency for demo
      await new Promise((resolve) => setTimeout(resolve, 250))

      const isManager =
        normalizedEmail.includes('manager') ||
        normalizedEmail.includes('admin') ||
        normalizedEmail.includes('supervisor') ||
        normalizedEmail === 'sarah@workforce.com' ||
        normalizedEmail === 'manager@workforce.com'

      const mockUser: User = isManager
        ? {
            id: `mgr_${Date.now()}`,
            email: normalizedEmail,
            name: 'Sarah Johnson',
            role: 'manager',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
            department: 'Operations',
            skills: ['Leadership', 'Operations', 'Analytics', 'Team Management'],
          }
        : {
            id: `emp_${Date.now()}`,
            email: normalizedEmail,
            name: 'Alex Rivera',
            role: 'employee',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
            department: 'Kitchen',
            skills: ['Food Safety', 'Customer Service', 'Equipment Operation'],
          }

      setCurrentUser(mockUser)
      setIsLoading(false)
      toast.success(`Welcome back, ${mockUser.name}!`)
      return { success: true as const }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid credentials'
      setIsLoading(false)
      toast.error(errorMessage)
      return { success: false as const, error: errorMessage }
    }
  }

  const logout = async () => {
    try {
      // Immediate UI update
      setCurrentUser(null)
      setIsLoading(false)

      // Best-effort KV cleanup (non-blocking for UI responsiveness)
      try {
        await spark.kv.delete('auth_user')
        await spark.kv.delete('auth_loading')
        await spark.kv.delete('profile_data')
        await spark.kv.delete('chat_messages')
      } catch {}

      toast.success('Successfully signed out')
    } catch {
      // Still ensure UI reflects sign out
      setCurrentUser(null)
      setIsLoading(false)
      toast.success('Signed out')
    }
  }

  const value: AuthContextValue = {
    user: currentUser,
    isLoading,
    isAuthenticated: !!currentUser,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
