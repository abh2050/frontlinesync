import { useKV } from '@github/spark/hooks'
import { User } from '@/types'
import { toast } from 'sonner'

export function useAuth() {
  const [currentUser, setCurrentUser] = useKV<User | null>('auth_user', null)
  const [isLoading, setIsLoading] = useKV('auth_loading', false)

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      console.log('Attempting login for:', email)
      
      // Validate credentials (basic check for demo)
      if (!email || !password) {
        throw new Error('Email and password are required')
      }
      
      const normalizedEmail = email.toLowerCase().trim()
      
      // Simulate API call - in real app this would be actual authentication
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Define user roles and data
      let mockUser: User
      
      // Determine user role based on email patterns
      const isManager = normalizedEmail.includes('manager') || 
                       normalizedEmail.includes('admin') || 
                       normalizedEmail.includes('supervisor') ||
                       normalizedEmail === 'sarah@workforce.com' ||
                       normalizedEmail === 'manager@workforce.com'
      
      if (isManager) {
        mockUser = {
          id: `mgr_${Date.now()}`,
          email: normalizedEmail,
          name: 'Sarah Johnson',
          role: 'manager',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
          department: 'Operations',
          skills: ['Leadership', 'Operations', 'Analytics', 'Team Management']
        }
      } else {
        mockUser = {
          id: `emp_${Date.now()}`,
          email: normalizedEmail,
          name: 'Alex Rivera',
          role: 'employee',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
          department: 'Kitchen',
          skills: ['Food Safety', 'Customer Service', 'Equipment Operation']
        }
      }
      
      console.log('Login successful, setting user:', mockUser)
      setCurrentUser(mockUser)
      setIsLoading(false)
      toast.success(`Welcome back, ${mockUser.name}!`)
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Invalid credentials'
      setIsLoading(false)
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  const logout = async () => {
    try {
      console.log('Logging out user:', currentUser?.email)
      
      // Set loading state to provide immediate feedback
      setIsLoading(true)
      
      // Small delay to ensure UI feedback is visible
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Clear KV data first, then update state
      try {
        await spark.kv.delete('auth_user')
        await spark.kv.delete('auth_loading') 
        await spark.kv.delete('profile_data') 
        await spark.kv.delete('chat_messages')
        console.log('✅ KV data cleared successfully')
      } catch (kvError) {
        console.warn('⚠️ Some KV cleanup failed:', kvError)
      }
      
      // Clear user data after KV cleanup
      setCurrentUser(null)
      setIsLoading(false)
      
      toast.success('Successfully signed out')
      console.log('✅ User logged out successfully')
    } catch (error) {
      console.error('❌ Error during logout:', error)
      // Still clear the current user even if cleanup fails
      setCurrentUser(null)
      setIsLoading(false)
      toast.success('Signed out')
    }
  }

  return {
    user: currentUser,
    isLoading,
    login,
    logout,
    isAuthenticated: !!currentUser
  }
}