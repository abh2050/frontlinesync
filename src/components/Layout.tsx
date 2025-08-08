import { ReactNode } from 'react'
import { House, MessageCircle, Calendar, User, ChartBar, Users, ClipboardText, Shield } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface LayoutProps {
  children: ReactNode
  currentView: string
  onViewChange: (view: string) => void
}

export default function Layout({ children, currentView, onViewChange }: LayoutProps) {
  const { user, logout } = useAuth()
  
  const employeeNavItems = [
    { id: 'dashboard', label: 'Home', icon: House },
    { id: 'chat', label: 'AI Chat', icon: MessageCircle },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'profile', label: 'Profile', icon: User },
  ]

  const managerNavItems = [
    { id: 'analytics', label: 'Analytics', icon: ChartBar },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'compliance', label: 'Compliance', icon: Shield },
    { id: 'sops', label: 'SOPs', icon: ClipboardText },
  ]

  const navItems = user?.role === 'manager' ? managerNavItems : employeeNavItems

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-lg">WorkForce AI</h1>
            <p className="text-sm text-muted-foreground">{user?.department}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>
              {user?.name?.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={logout}
            className="text-muted-foreground"
          >
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="bg-card border-t border-border md:hidden">
        <div className="grid grid-cols-4 md:grid-cols-5">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={cn(
                  "flex flex-col items-center py-3 px-2 text-xs font-medium transition-colors",
                  isActive 
                    ? "text-primary bg-primary/5" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn("w-6 h-6 mb-1", isActive && "text-primary")} />
                <span className="truncate">{item.label}</span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* Sidebar Navigation (Desktop) */}
      <nav className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-card border-r border-border">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-8">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center mr-3">
              <Users className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">WorkForce AI</h1>
              <p className="text-sm text-muted-foreground">
                {user?.role === 'manager' ? 'Manager Portal' : 'Employee Portal'}
              </p>
            </div>
          </div>

          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = currentView === item.id
              
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="mr-3 h-6 w-6" />
                  {item.label}
                </button>
              )
            })}
          </nav>

          <div className="flex-shrink-0 flex border-t border-border p-4">
            <div className="flex items-center">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>
                  {user?.name?.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}