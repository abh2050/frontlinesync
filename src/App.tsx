import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import LoginScreen from '@/components/LoginScreen'
import Layout from '@/components/Layout'
import EmployeeDashboard from '@/components/employee/EmployeeDashboard'
import AIChat from '@/components/chat/AIChat'
import ShiftManagement from '@/components/schedule/ShiftManagement'
import UserProfile from '@/components/profile/UserProfile'
import ManagerAnalytics from '@/components/manager/ManagerAnalytics'
import { Toaster } from '@/components/ui/sonner'

function App() {
  const { isAuthenticated, user } = useAuth()
  const [currentView, setCurrentView] = useState('dashboard')

  // Reset view when user changes or logs out
  useEffect(() => {
    if (user?.role === 'manager') {
      setCurrentView('analytics')
    } else if (user?.role === 'employee') {
      setCurrentView('dashboard')
    } else {
      setCurrentView('dashboard')
    }
  }, [user?.role, isAuthenticated])

  const renderView = () => {
    if (user?.role === 'manager') {
      switch (currentView) {
        case 'analytics':
          return <ManagerAnalytics />
        case 'team':
          return <div className="p-6 md:pl-72">Team Management - Coming Soon</div>
        case 'schedule':
          return <ShiftManagement />
        case 'compliance':
          return <div className="p-6 md:pl-72">Compliance Dashboard - Coming Soon</div>
        case 'sops':
          return <div className="p-6 md:pl-72">SOP Management - Coming Soon</div>
        default:
          return <ManagerAnalytics />
      }
    } else {
      switch (currentView) {
        case 'dashboard':
          return <EmployeeDashboard onViewChange={setCurrentView} />
        case 'chat':
          return <AIChat />
        case 'schedule':
          return <ShiftManagement />
        case 'profile':
          return <UserProfile />
        default:
          return <EmployeeDashboard onViewChange={setCurrentView} />
      }
    }
  }

  if (!isAuthenticated) {
    return <LoginScreen />
  }

  return (
    <>
      <Layout currentView={currentView} onViewChange={setCurrentView}>
        {renderView()}
      </Layout>
      <Toaster />
    </>
  )
}

export default App