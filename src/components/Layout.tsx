import { ReactNode, useState } from 'react'
import { House, MessageCircle, Calendar, User, ChartBar, Users, ClipboardText, Shield, Sparkle } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import companyLogo from '@/assets/images/WhatsApp_Image_2025-08-08_at_06.28.26.jpeg'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface LayoutProps {
  children: ReactNode
  currentView: string
  onViewChange: (view: string) => void
}

export default function Layout({ children, currentView, onViewChange }: LayoutProps) {
  const { user, logout } = useAuth()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  
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
    { id: 'ai-config', label: 'AI Settings', icon: Sparkle },
  ]

  const navItems = user?.role === 'manager' ? managerNavItems : employeeNavItems

  const handleLogout = async () => {
    console.log('Layout: Logout initiated')
    setShowLogoutDialog(false)
    await logout()
    console.log('Layout: Logout completed')
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center overflow-hidden shadow-sm">
            <img 
              src={companyLogo} 
              alt="Company Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="font-semibold text-lg">FrontLine Sync</h1>
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
          <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                Sign Out
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Sign Out</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to sign out? You'll need to log in again to access your account.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout} className="bg-destructive hover:bg-destructive/90">
                  Sign Out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="bg-card border-t border-border md:hidden">
        <div className={cn(
          "grid gap-0",
          user?.role === 'manager' ? "grid-cols-6 overflow-x-auto" : "grid-cols-4"
        )}>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={cn(
                  "flex flex-col items-center py-3 px-2 text-xs font-medium transition-colors min-w-0",
                  isActive 
                    ? "text-primary bg-primary/5" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn("w-5 h-5 mb-1", isActive && "text-primary")} />
                <span className="truncate text-[11px]">{item.label}</span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* Sidebar Navigation (Desktop) */}
      <nav className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-card border-r border-border">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-8">
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mr-3 shadow-sm overflow-hidden">
              <img 
                src={companyLogo} 
                alt="Company Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold">FrontLine Sync</h1>
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