import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useKV } from '@/hooks/use-kv'
import { useAuth } from '@/hooks/use-auth'
import { 
  CalendarBlank,
  Clock,
  MapPin,
  Plus,
  ArrowsClockwise,
  Star,
  Users,
  CaretLeft,
  CaretRight
} from '@phosphor-icons/react'
import { Shift } from '@/types'
import { cn } from '@/lib/utils'

export default function ShiftManagement() {
  const { user } = useAuth()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null)
  const myShiftsKV = useKV<Shift[]>('my_shifts', [])
  const myShifts = myShiftsKV.value
  const setMyShifts = myShiftsKV.set
  const availableShiftsKV = useKV<Shift[]>('available_shifts', [])
  const availableShifts = availableShiftsKV.value
  const setAvailableShifts = availableShiftsKV.set

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  const today = new Date()

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const getShiftsForDate = (day: number) => {
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return myShifts.filter(shift => shift.date === dateString)
  }

  const getAvailableShiftsForDate = (day: number) => {
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return availableShifts.filter(shift => shift.date === dateString)
  }

  const isToday = (day: number) => {
    return today.getDate() === day && 
           today.getMonth() === currentDate.getMonth() && 
           today.getFullYear() === currentDate.getFullYear()
  }

  const bookShift = (shift: Shift) => {
    const newShift = { ...shift, userId: user?.id || '', status: 'scheduled' as const }
    setMyShifts([...myShifts, newShift])
    setAvailableShifts(availableShifts.filter(s => s.id !== shift.id))
    setSelectedShift(null)
  }

  const formatTime = (timeString: string) => {
    const time = new Date(`2000-01-01T${timeString}`)
    return time.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const getShiftTypeColor = (description?: string) => {
    if (!description) return 'bg-primary'
    if (description.toLowerCase().includes('opening')) return 'bg-green-500'
    if (description.toLowerCase().includes('closing')) return 'bg-red-500'
    if (description.toLowerCase().includes('weekend')) return 'bg-accent'
    return 'bg-primary'
  }

  const aiSuggestions = [
    {
      shift: availableShifts[0],
      reason: "Matches your preferred morning hours",
      priority: "high"
    },
    {
      shift: availableShifts[1], 
      reason: "Same department as your experience",
      priority: "medium"
    }
  ]

  return (
    <div className="p-4 space-y-6 md:p-6 md:pl-72">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Schedule</h1>
          <p className="text-muted-foreground">Manage your shifts and view opportunities</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Request Time Off
        </Button>
      </div>

      {/* AI Suggestions */}
      {aiSuggestions.some(s => s.shift) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-accent" />
              <span>AI Recommendations</span>
            </CardTitle>
            <CardDescription>
              Shifts that match your preferences and experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {aiSuggestions.filter(s => s.shift).map((suggestion, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge variant={suggestion.priority === 'high' ? 'default' : 'secondary'}>
                        {suggestion.priority} match
                      </Badge>
                      <span className="font-medium">
                        {formatTime(suggestion.shift.startTime)} - {formatTime(suggestion.shift.endTime)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{suggestion.reason}</p>
                  </div>
                  <Button size="sm" onClick={() => bookShift(suggestion.shift)}>
                    Book Shift
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* CalendarBlank */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <CalendarBlank className="w-5 h-5" />
              <span>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={previousMonth}>
                <CaretLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={nextMonth}>
                <CaretRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* CalendarBlank Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
            
            {/* Empty cells for days before month starts */}
            {Array.from({ length: firstDayOfMonth }).map((_, index) => (
              <div key={`empty-${index}`} className="p-2"></div>
            ))}
            
            {/* CalendarBlank days */}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1
              const shifts = getShiftsForDate(day)
              const availableShiftsForDay = getAvailableShiftsForDate(day)
              
              return (
                <div
                  key={day}
                  className={cn(
                    "p-2 min-h-[80px] border rounded-lg space-y-1",
                    isToday(day) && "bg-primary/10 border-primary"
                  )}
                >
                  <div className={cn(
                    "text-sm font-medium",
                    isToday(day) && "text-primary"
                  )}>
                    {day}
                  </div>
                  
                  {/* My Shifts */}
                  {shifts.map(shift => (
                    <div
                      key={shift.id}
                      className={cn(
                        "text-xs p-1 rounded text-white cursor-pointer",
                        getShiftTypeColor(shift.description)
                      )}
                      onClick={() => setSelectedShift(shift)}
                    >
                      {formatTime(shift.startTime)}
                    </div>
                  ))}
                  
                  {/* Available Shifts */}
                  {availableShiftsForDay.slice(0, 2).map(shift => (
                    <div
                      key={shift.id}
                      className="text-xs p-1 rounded border border-dashed border-accent text-accent cursor-pointer"
                      onClick={() => setSelectedShift(shift)}
                    >
                      Available
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Shifts */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Shifts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {myShifts.slice(0, 5).map(shift => (
              <div key={shift.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={cn(
                    "w-3 h-3 rounded-full",
                    getShiftTypeColor(shift.description)
                  )}></div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">
                        {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                      </span>
                      <Badge variant="outline">{shift.date}</Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{shift.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <ArrowsClockwise className="w-4 h-4 mr-1" />
                    Swap
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedShift(shift)}>
                    Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Shift Details Dialog */}
      {selectedShift && (
        <Dialog open={!!selectedShift} onOpenChange={() => setSelectedShift(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Shift Details</DialogTitle>
              <DialogDescription>
                {selectedShift.date} • {selectedShift.location}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Start Time</label>
                  <p className="text-lg">{formatTime(selectedShift.startTime)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">End Time</label>
                  <p className="text-lg">{formatTime(selectedShift.endTime)}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Location</label>
                <div className="flex items-center space-x-2 mt-1">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedShift.location}</span>
                </div>
              </div>
              
              {selectedShift.description && (
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedShift.description}</p>
                </div>
              )}
              
              <div className="flex items-center space-x-2 pt-4">
                {selectedShift.status === 'available' ? (
                  <Button onClick={() => bookShift(selectedShift)} className="flex-1">
                    Book This Shift
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" className="flex-1">
                      <ArrowsClockwise className="w-4 h-4 mr-2" />
                      Request Swap
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Cancel Shift
                    </Button>
                  </>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}