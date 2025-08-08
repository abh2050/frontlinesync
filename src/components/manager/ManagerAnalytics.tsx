import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useKV } from '@github/spark/hooks'
import { 
  TrendUp, 
  TrendDown, 
  Users, 
  Clock, 
  Shield, 
  MessageCircle,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Target
} from '@phosphor-icons/react'

interface MetricCardProps {
  title: string
  value: string | number
  change: number
  changeType: 'positive' | 'negative' | 'neutral'
  icon: React.ElementType
  description?: string
}

function MetricCard({ title, value, change, changeType, icon: Icon, description }: MetricCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive': return 'text-green-600'
      case 'negative': return 'text-red-600'
      default: return 'text-muted-foreground'
    }
  }

  const getTrendIcon = () => {
    return changeType === 'positive' ? TrendUp : changeType === 'negative' ? TrendDown : Clock
  }

  const TrendIcon = getTrendIcon()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center space-x-2 text-xs">
          <TrendIcon className={`h-3 w-3 ${getChangeColor()}`} />
          <span className={getChangeColor()}>
            {change > 0 ? '+' : ''}{change}%
          </span>
          <span className="text-muted-foreground">from last week</span>
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

export default function ManagerAnalytics() {
  const [teamMetrics] = useKV('team_metrics', {
    shiftCoverage: 94,
    teamSize: 28,
    complianceRate: 96,
    aiEngagement: 87,
    avgResponseTime: 45,
    scheduleEfficiency: 91
  })

  const [alerts] = useKV('manager_alerts', [
    { id: 1, type: 'warning', message: 'Weekend shift coverage below target', priority: 'high' },
    { id: 2, type: 'info', message: '3 certifications expiring this month', priority: 'medium' },
    { id: 3, type: 'success', message: 'Team AI engagement up 15%', priority: 'low' }
  ])

  const [teamPerformance] = useKV('team_performance', [
    { name: 'Alex Rivera', department: 'Kitchen', compliance: 98, shifts: 22, aiUsage: 95 },
    { name: 'Maria Santos', department: 'Front of House', compliance: 94, shifts: 20, aiUsage: 88 },
    { name: 'James Chen', department: 'Kitchen', compliance: 92, shifts: 25, aiUsage: 76 },
    { name: 'Sarah Kim', department: 'Cleaning', compliance: 100, shifts: 18, aiUsage: 92 }
  ])

  const [weeklyShifts] = useKV('weekly_shifts', [
    { day: 'Mon', scheduled: 24, filled: 24, available: 0 },
    { day: 'Tue', scheduled: 26, filled: 25, available: 1 },
    { day: 'Wed', scheduled: 28, filled: 26, available: 2 },
    { day: 'Thu', scheduled: 30, filled: 28, available: 2 },
    { day: 'Fri', scheduled: 32, filled: 28, available: 4 },
    { day: 'Sat', scheduled: 35, filled: 30, available: 5 },
    { day: 'Sun', scheduled: 30, filled: 28, available: 2 }
  ])

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return AlertTriangle
      case 'success': return CheckCircle
      default: return MessageCircle
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning': return 'border-yellow-200 bg-yellow-50'
      case 'success': return 'border-green-200 bg-green-50'
      default: return 'border-blue-200 bg-blue-50'
    }
  }

  return (
    <div className="p-4 space-y-6 md:p-6 md:pl-72">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time insights into your team's performance and operations
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Shift Coverage"
          value={`${teamMetrics.shiftCoverage}%`}
          change={2.1}
          changeType="positive"
          icon={Calendar}
          description="Target: 95%"
        />
        <MetricCard
          title="Team Size"
          value={teamMetrics.teamSize}
          change={5.2}
          changeType="positive"
          icon={Users}
          description="Active employees"
        />
        <MetricCard
          title="Compliance Rate"
          value={`${teamMetrics.complianceRate}%`}
          change={1.8}
          changeType="positive"
          icon={Shield}
          description="Certifications up to date"
        />
        <MetricCard
          title="AI Engagement"
          value={`${teamMetrics.aiEngagement}%`}
          change={12.3}
          changeType="positive"
          icon={MessageCircle}
          description="Daily active users"
        />
      </div>

      {/* Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <span>Priority Alerts</span>
          </CardTitle>
          <CardDescription>
            Issues requiring your attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map(alert => {
              const AlertIcon = getAlertIcon(alert.type)
              return (
                <div 
                  key={alert.id} 
                  className={`flex items-center justify-between p-3 rounded-lg border ${getAlertColor(alert.type)}`}
                >
                  <div className="flex items-center space-x-3">
                    <AlertIcon className="w-5 h-5" />
                    <span className="font-medium">{alert.message}</span>
                    <Badge variant={alert.priority === 'high' ? 'destructive' : alert.priority === 'medium' ? 'default' : 'secondary'}>
                      {alert.priority}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm">
                    Review
                  </Button>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Shift Coverage Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Shift Coverage</CardTitle>
          <CardDescription>
            Shift fill rates and availability across the week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weeklyShifts.map(day => {
              const fillRate = (day.filled / day.scheduled) * 100
              return (
                <div key={day.day} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{day.day}</span>
                    <div className="flex items-center space-x-4 text-sm">
                      <span>{day.filled}/{day.scheduled} filled</span>
                      <Badge variant={fillRate >= 90 ? 'default' : fillRate >= 80 ? 'secondary' : 'destructive'}>
                        {Math.round(fillRate)}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={fillRate} className="h-2" />
                  {day.available > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {day.available} shifts still need coverage
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Team Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Team Performance</CardTitle>
          <CardDescription>
            Individual performance metrics and engagement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamPerformance.map((member, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.department}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-sm font-medium">{member.shifts}</p>
                    <p className="text-xs text-muted-foreground">Shifts</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">{member.compliance}%</p>
                    <p className="text-xs text-muted-foreground">Compliance</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">{member.aiUsage}%</p>
                    <p className="text-xs text-muted-foreground">AI Usage</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Assistant Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>AI Assistant Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Daily Active Users</span>
                <span>87%</span>
              </div>
              <Progress value={87} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Avg Response Rating</span>
                <span>4.6/5</span>
              </div>
              <Progress value={92} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Questions Resolved</span>
                <span>94%</span>
              </div>
              <Progress value={94} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Schedule Optimization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Efficiency Score</span>
                <span>91%</span>
              </div>
              <Progress value={91} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Auto-filled Shifts</span>
                <span>76%</span>
              </div>
              <Progress value={76} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Conflict Reduction</span>
                <span>85%</span>
              </div>
              <Progress value={85} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}