import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '@/hooks/use-auth'
import { useKV } from '@github/spark/hooks'
import { 
  Clock, 
  MapPin, 
  MessageCircle, 
  Search, 
  Calendar,
  TrendUp,
  Shield,
  Users,
  ChevronRight
} from '@phosphor-icons/react'
import { Shift, ChatMessage, Credential } from '@/types'

interface EmployeeDashboardProps {
  onViewChange: (view: string) => void
}

export default function EmployeeDashboard({ onViewChange }: EmployeeDashboardProps) {
  const { user } = useAuth()
  const [upcomingShifts] = useKV<Shift[]>('upcoming_shifts', [])
  const [recentChats] = useKV<ChatMessage[]>('recent_chats', [])
  const [credentials] = useKV<Credential[]>('user_credentials', [])
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const nextShift = upcomingShifts[0]
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
      icon: MessageCircle,
      action: () => onViewChange('chat'),
      color: "bg-primary"
    },
    {
      title: "Search SOPs",
      description: "Find step-by-step guides",
      icon: Search,
      action: () => onViewChange('sops'),
      color: "bg-accent"
    },
    {
      title: "View Schedule",
      description: "Check and manage shifts",
      icon: Calendar,
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
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Next Shift */}
      {nextShift && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Next Shift</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      )}

      {/* Recent AI Conversations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5" />
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
                  <MessageCircle className="w-5 h-5 text-primary mt-0.5" />
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
              <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
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
              <Shield className="w-5 h-5" />
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