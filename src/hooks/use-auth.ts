import { useKV } from '@github/spark/hooks'
import { User } from '@/types'

export function useAuth() {
  const [currentUser, setCurrentUser] = useKV<User | null>('auth_user', null)
  const [isLoading, setIsLoading] = useKV('auth_loading', false)

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
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
      
      setCurrentUser(mockUser)
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Invalid credentials' }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setCurrentUser(null)
  }

  return {
    user: currentUser,
    isLoading,
    login,
    logout,
    isAuthenticated: !!currentUser
  }
}