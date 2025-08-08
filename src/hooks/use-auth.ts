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
      
      // Simulate API call - in real app this would be actual authentication
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock user data based on email
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name: email.includes('manager') ? 'Sarah Johnson' : 'Alex Rivera',
        role: email.includes('manager') ? 'manager' : 'employee',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        department: 'Kitchen',
        skills: email.includes('manager') ? ['Leadership', 'Operations'] : ['Food Safety', 'Customer Service']
      }
      
      console.log('Login successful, setting user:', mockUser)
      setCurrentUser(mockUser)
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Invalid credentials' }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      console.log('Logging out user:', currentUser?.email)
      
      // Clear user data
      setCurrentUser(null)
      
      // Clear any other auth-related data stored in KV
      await spark.kv.delete('auth_user')
      await spark.kv.delete('auth_loading')
      
      // Clear any session-related data
      await spark.kv.delete('profile_data')
      
      toast.success('Successfully signed out')
      console.log('User logged out successfully')
    } catch (error) {
      console.error('Error during logout:', error)
      // Still clear the current user even if cleanup fails
      setCurrentUser(null)
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