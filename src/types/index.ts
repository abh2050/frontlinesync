export interface User {
  id: string
  email: string
  name: string
  role: 'employee' | 'manager'
  avatar?: string
  department?: string
  skills?: string[]
}

export interface Shift {
  id: string
  userId: string
  date: string
  startTime: string
  endTime: string
  location: string
  department: string
  status: 'scheduled' | 'available' | 'completed' | 'cancelled'
  description?: string
}

export interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: string
  type?: 'text' | 'sop' | 'image' | 'video'
  metadata?: {
    sopId?: string
    attachments?: string[]
  }
}

export interface SOP {
  id: string
  title: string
  category: string
  steps: SOPStep[]
  tags: string[]
  lastUpdated: string
  department: string
}

export interface SOPStep {
  id: string
  title: string
  description: string
  image?: string
  video?: string
  duration?: number
}

export interface Credential {
  id: string
  userId: string
  name: string
  issuer: string
  dateEarned: string
  expirationDate?: string
  status: 'active' | 'expired' | 'pending'
  documentUrl?: string
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'shift' | 'credential' | 'system' | 'ai'
  timestamp: string
  read: boolean
  actionUrl?: string
}