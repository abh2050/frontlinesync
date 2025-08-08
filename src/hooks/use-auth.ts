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
      
      // Simulate API call - in real app this would be actual authentication
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock user data based on email
      const mockUser: User = {
        id: Date.now().toString(),
        email: email.toLowerCase().trim(),
        name: email.includes('manager') ? 'Sarah Johnson' : 'Alex Rivera',
        role: email.includes('manager') ? 'manager' : 'employee',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        department: email.includes('manager') ? 'Operations' : 'Kitchen',
        skills: email.includes('manager') ? ['Leadership', 'Operations'] : ['Food Safety', 'Customer Service']
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
      
      // Clear KV data first, then update state
      try {
        await spark.kv.delete('auth_user')
        await spark.kv.delete('auth_loading')
        await spark.kv.delete('profile_data') 
        await spark.kv.delete('chat_messages')
        console.log('KV data cleared successfully')
      } catch (kvError) {
        console.warn('Some KV cleanup failed:', kvError)
      }
      
      // Clear user data after KV cleanup
      setCurrentUser(null)
      setIsLoading(false)
      
      toast.success('Successfully signed out')
      console.log('User logged out successfully')
    } catch (error) {
      console.error('Error during logout:', error)
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