import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '@/hooks/use-auth'
import { useKV } from '@/hooks/use-kv'
import { 
  Clock, 
  MapPin, 
  Chat, 
  MagnifyingGlass, 
  CalendarBlank,
  TrendUp,
  ShieldCheck,
  Users,
  CaretRight
} from '@phosphor-icons/react'
import { Shift, ChatMessage, Credential } from '@/types'

interface EmployeeDashboardProps {
  onViewChange: (view: string) => void
}

export default function EmployeeDashboard({ onViewChange }: EmployeeDashboardProps) {
  const { user } = useAuth()
  const upcomingShiftsKV = useKV<Shift[]>('upcoming_shifts', [])
  const recentChatsKV = useKV<ChatMessage[]>('recent_chats', [])
  const credentialsKV = useKV<Credential[]>('user_credentials', [])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [dataInitialized, setDataInitialized] = useState(false)

  // Initialize with sample data if empty
  useEffect(() => {
    const initializeData = async () => {
      console.log('=== EMPLOYEE DASHBOARD DATA INITIALIZATION ===')
      console.log('Checking data initialization...')
      console.log('Current upcomingShifts:', upcomingShiftsKV.value)
      console.log('Current credentials:', credentialsKV.value)
      console.log('Data initialized flag:', dataInitialized)
      
      // Force initialization (temporary for debugging)
      const forceInit = !dataInitialized || upcomingShiftsKV.value.length === 0
      console.log('Force initialization:', forceInit)
      
      if (forceInit) {
        console.log('Initializing sample shifts...')
        const sampleShifts: Shift[] = [
          {
            id: '1',
            userId: user?.id || '1',
            date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            startTime: '08:00',
            endTime: '16:00',
            location: 'Main Kitchen',
            department: 'Kitchen',
            status: 'scheduled',
            description: 'Morning Shift - Kitchen'
          },
          {
            id: '2',
            userId: user?.id || '1', 
            date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            startTime: '16:00',
            endTime: '22:00',
            location: 'Dining Room',
            department: 'Front of House',
            status: 'scheduled',
            description: 'Evening Shift - Front of House'
          },
          {
            id: '3',
            userId: user?.id || '1',
            date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            startTime: '06:00',
            endTime: '14:00',
            location: 'Entire Facility',
            department: 'Cleaning',
            status: 'available',
            description: 'Weekend Shift - Cleaning'
          }
        ]
        upcomingShiftsKV.set(sampleShifts)
        console.log('Sample shifts set:', sampleShifts)
      }

      if (forceInit || recentChatsKV.value.length === 0) {
        console.log('Initializing sample chats...')
        const sampleChats: ChatMessage[] = [
          {
            id: '1',
            content: 'What are the food safety procedures for handling raw chicken?',
            role: 'user',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '2',
            content: 'For raw chicken handling: 1) Use separate cutting boards, 2) Wash hands for 20 seconds, 3) Cook to 165°F internal temp, 4) Store below 40°F. Always follow HACCP guidelines.',
            role: 'assistant',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 30000).toISOString()
          },
          {
            id: '3',
            content: 'How do I report a workplace injury?',
            role: 'user',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
          }
        ]
        recentChatsKV.set(sampleChats)
      }

      if (forceInit || credentialsKV.value.length === 0) {
        console.log('Initializing sample credentials...')
        const sampleCredentials: Credential[] = [
          {
            id: '1',
            userId: user?.id || '1',
            name: 'Food Safety Certification',
            issuer: 'ServSafe',
            dateEarned: '2024-01-15',
            expirationDate: '2026-01-15',
            status: 'active'
          },
          {
            id: '2',
            userId: user?.id || '1',
            name: 'First Aid/CPR',
            issuer: 'American Red Cross',
            dateEarned: '2024-03-10',
            expirationDate: '2025-03-10',
            status: 'active'
          },
          {
            id: '3',
            userId: user?.id || '1',
            name: 'Allergen Awareness',
            issuer: 'AllerTrain',
            dateEarned: '2024-06-01',
            expirationDate: '2025-06-01',
            status: 'active'
          },
          {
            id: '4',
            userId: user?.id || '1',
            name: 'Chemical Safety',
            issuer: 'OSHA Training',
            dateEarned: '2023-12-01',
            expirationDate: '2024-12-01',
            status: 'expired'
          }
        ]
        credentialsKV.set(sampleCredentials)
      }
      
      setDataInitialized(true)
      console.log('=== DATA INITIALIZATION COMPLETE ===')
    }
    
    // Run initialization
    initializeData()
  }, [user?.id, upcomingShiftsKV.value, recentChatsKV.value, credentialsKV.value])

  // Timer for current time updates
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const upcomingShifts = upcomingShiftsKV.value
  const recentChats = recentChatsKV.value  
  const credentials = credentialsKV.value

  console.log('Current data in render:', {
    shiftsCount: upcomingShifts.length,
    chatsCount: recentChats.length,
    credentialsCount: credentials.length,
    dataInitialized,
    upcomingShifts: upcomingShifts
  })

  // Sort shifts by date and time to get the next upcoming shift
  const sortedShifts = [...upcomingShifts].sort((a, b) => {
    const dateTimeA = new Date(`${a.date}T${a.startTime}`)
    const dateTimeB = new Date(`${b.date}T${b.startTime}`)
    return dateTimeA.getTime() - dateTimeB.getTime()
  })

  const nextShift = sortedShifts[0]
  console.log('Next shift:', nextShift)
  const activeCredentials = credentials.filter(c => c.status === 'active')
  const expiringCredentials = credentials.filter(c => {
    if (!c.expirationDate) return false
    const expDate = new Date(c.expirationDate)
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    return expDate <= thirtyDaysFromNow
  })

  const quickActions = [
    {
      title: "Ask AI Assistant",
      description: "Get instant help with procedures",
      icon: Chat,
      action: () => onViewChange('chat'),
      color: "bg-primary"
    },
    {
      title: "Search SOPs",
      description: "Find step-by-step guides",
      icon: MagnifyingGlass,
      action: () => onViewChange('sops'),
      color: "bg-accent"
    },
    {
      title: "View Schedule",
      description: "Check and manage shifts",
      icon: CalendarBlank,
      action: () => onViewChange('schedule'),
      color: "bg-muted"
    }
  ]

  const formatTime = (dateString: string, timeString: string) => {
    const date = new Date(`${dateString}T${timeString}`)
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const getShiftStatus = (shift: Shift) => {
    const shiftDate = new Date(`${shift.date}T${shift.startTime}`)
    const now = new Date()
    const timeDiff = shiftDate.getTime() - now.getTime()
    const hoursDiff = timeDiff / (1000 * 60 * 60)

    if (hoursDiff < 1 && hoursDiff > -8) {
      return { status: 'active', label: 'Active Now', color: 'bg-green-500' }
    } else if (hoursDiff < 24) {
      return { status: 'soon', label: 'Starting Soon', color: 'bg-yellow-500' }
    } else {
      return { status: 'upcoming', label: 'Upcoming', color: 'bg-blue-500' }
    }
  }

  return (
    <div className="p-4 space-y-6 md:p-6 md:pl-72">
      {/* Debug Info (temporary) */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <p className="text-sm font-mono">
            Debug: Shifts={upcomingShifts.length}, Chats={recentChats.length}, Credentials={credentials.length}, Initialized={dataInitialized.toString()}
          </p>
          <p className="text-sm font-mono">
            Next Shift: {nextShift ? `${nextShift.date} ${nextShift.startTime}` : 'None'}
          </p>
        </CardContent>
      </Card>

      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">
          Good {currentTime.getHours() < 12 ? 'morning' : currentTime.getHours() < 18 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-muted-foreground">
          {currentTime.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon
          return (
            <Card 
              key={index} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={action.action}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${action.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                  <CaretRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Next Shift */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Next Shift</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {nextShift ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Badge className={getShiftStatus(nextShift).color}>
                      {getShiftStatus(nextShift).label}
                    </Badge>
                    <span className="font-semibold">
                      {formatTime(nextShift.date, nextShift.startTime)} - {formatTime(nextShift.date, nextShift.endTime)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{nextShift.location}</span>
                  </div>
                  {nextShift.description && (
                    <p className="text-sm text-muted-foreground">{nextShift.description}</p>
                  )}
                </div>
                <Button onClick={() => onViewChange('schedule')}>
                  View Details
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No upcoming shifts scheduled</p>
              <Button onClick={() => onViewChange('schedule')}>
                View Schedule
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent AI Conversations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Chat className="w-5 h-5" />
              <span>Recent AI Conversations</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onViewChange('chat')}>
              View All
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentChats.length > 0 ? (
            <div className="space-y-3">
              {recentChats.slice(0, 3).map((chat, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border">
                  <Chat className="w-5 h-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm">{chat.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(chat.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Chat className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No recent conversations</p>
              <Button onClick={() => onViewChange('chat')}>
                Start Chatting with AI
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Credentials Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5" />
              <span>Active Credentials</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{activeCredentials.length}</p>
                <p className="text-sm text-muted-foreground">Certifications</p>
              </div>
              <TrendUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Expiring Soon</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-yellow-600">{expiringCredentials.length}</p>
                <p className="text-sm text-muted-foreground">Need Renewal</p>
              </div>
              {expiringCredentials.length > 0 && (
                <Button variant="outline" size="sm" onClick={() => onViewChange('profile')}>
                  Review
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Updates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Team Updates</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-sm">New safety protocol added to AI knowledge base</p>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <p className="text-sm">Weekend shift opportunities available</p>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <p className="text-sm">Quarterly training deadline: Dec 31st</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}