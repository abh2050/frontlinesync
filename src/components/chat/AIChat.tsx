import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useKV } from '@github/spark/hooks'
import { useAuth } from '@/hooks/use-auth'
import { 
  PaperPlaneRight, 
  Microphone, 
  Robot, 
  User, 
  Bookmark,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  Clock,
  Sparkle
} from '@phosphor-icons/react'
import { ChatMessage } from '@/types'
import { cn } from '@/lib/utils'
import { generateGeminiResponse, generateQuickSuggestions, isGeminiConfigured } from '@/lib/gemini'
import { toast } from 'sonner'

export default function AIChat() {
  const { user } = useAuth()
  const [messages, setMessages] = useKV<ChatMessage[]>('chat_messages', [])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [geminiEnabled, setGeminiEnabled] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Generate dynamic quick suggestions based on user role
  const quickSuggestions = generateQuickSuggestions(
    user?.role || 'employee',
    user?.department
  )

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Check if Gemini is configured on component mount
  useEffect(() => {
    const checkGeminiConfig = async () => {
      try {
        const configured = await isGeminiConfigured()
        setGeminiEnabled(configured)
        if (!configured) {
          console.log('Gemini API not configured, using fallback responses')
        }
      } catch (error) {
        console.error('Error checking Gemini configuration:', error)
        setGeminiEnabled(false)
      }
    }
    checkGeminiConfig()
  }, [])

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // Build context from recent messages for better continuity
      const recentMessages = messages.slice(-5).map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      // Generate response using Gemini API or fallback
      const aiResponse = await generateGeminiResponse(
        content,
        user?.role || 'employee',
        {
          department: user?.department,
          location: user?.location,
          previousMessages: recentMessages
        }
      )

      const responseMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date().toISOString(),
        type: 'text'
      }
      
      setMessages(prev => [...prev, responseMessage])
      
      // Show success toast if using Gemini
      if (geminiEnabled) {
        toast.success('Response powered by Gemini AI', { duration: 2000 })
      }
      
    } catch (error) {
      console.error('Error generating AI response:', error)
      
      // Fallback error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble processing your request right now. Please try again or contact your supervisor for immediate assistance.",
        role: 'assistant',
        timestamp: new Date().toISOString(),
        type: 'text'
      }
      
      setMessages(prev => [...prev, errorMessage])
      toast.error('AI response failed, please try again')
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickSuggestion = (suggestion: string) => {
    sendMessage(suggestion)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(inputValue)
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <div className="flex flex-col h-full bg-background md:pl-64">
      {/* Header */}
      <div className="bg-card border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            {geminiEnabled ? (
              <Sparkle className="w-6 h-6 text-primary-foreground" />
            ) : (
              <Robot className="w-6 h-6 text-primary-foreground" />
            )}
          </div>
          <div>
            <h2 className="font-semibold">AI Assistant</h2>
            <p className="text-sm text-muted-foreground">
              {geminiEnabled ? 'Powered by Gemini AI' : 'Intelligent assistance'} • Always here to help
            </p>
          </div>
        </div>
        
        {geminiEnabled && (
          <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            Gemini AI
          </Badge>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            {geminiEnabled ? (
              <Sparkle className="w-16 h-16 text-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-4" />
            ) : (
              <Robot className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            )}
            <h3 className="text-lg font-semibold mb-2">
              Welcome to AI Assistant!
              {geminiEnabled && <span className="text-sm text-muted-foreground block">Enhanced with Gemini AI</span>}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              I'm here to help you with procedures, policies, and any work-related questions. 
              Ask me anything or try one of the suggestions below.
            </p>
            
            {/* Quick Suggestions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
              {quickSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="text-left h-auto p-4 justify-start hover:bg-accent/50 transition-colors"
                  onClick={() => handleQuickSuggestion(suggestion)}
                >
                  <Lightbulb className="w-4 h-4 mr-2 text-accent" />
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] md:max-w-[60%] rounded-2xl p-4 space-y-2",
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground ml-auto'
                    : 'bg-card border'
                )}
              >
                <div className="flex items-start space-x-2">
                  {message.role === 'assistant' && (
                    <div className="w-5 h-5 mt-0.5">
                      {geminiEnabled ? (
                        <Sparkle className="w-5 h-5 text-gradient-to-r from-blue-500 to-purple-500" />
                      ) : (
                        <Robot className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  )}
                  <div className="flex-1">
                    <div 
                      className={cn(
                        "prose prose-sm max-w-none",
                        message.role === 'user' ? 'prose-invert' : ''
                      )}
                      dangerouslySetInnerHTML={{
                        __html: message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\n/g, '<br>')
                          .replace(/•/g, '&bull;')
                      }}
                    />
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-1 text-xs opacity-70">
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(message.timestamp)}</span>
                      </div>
                      {message.role === 'assistant' && (
                        <div className="flex items-center space-x-1">
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                            <ThumbsUp className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                            <ThumbsDown className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                            <Bookmark className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-card border rounded-2xl p-4 max-w-[80%] md:max-w-[60%]">
              <div className="flex items-center space-x-2">
                {geminiEnabled ? (
                  <Sparkle className="w-5 h-5 text-gradient-to-r from-blue-500 to-purple-500" />
                ) : (
                  <Robot className="w-5 h-5 text-primary" />
                )}
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                {geminiEnabled && (
                  <span className="text-xs text-muted-foreground">Generating with Gemini...</span>
                )}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-4 bg-card">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <Input
              placeholder="Ask me anything about work procedures, policies, or safety..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="resize-none min-h-[44px] rounded-xl"
            />
          </div>
          
          <Button
            size="sm"
            variant={isRecording ? "destructive" : "outline"}
            className="w-11 h-11 rounded-full p-0"
            onClick={() => setIsRecording(!isRecording)}
          >
            <Microphone className="w-5 h-5" />
          </Button>
          
          <Button
            size="sm"
            className="w-11 h-11 rounded-full p-0"
            onClick={() => sendMessage(inputValue)}
            disabled={!inputValue.trim() || isLoading}
          >
            <PaperPlaneRight className="w-5 h-5" />
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground mt-2 text-center">
          {geminiEnabled 
            ? 'AI responses powered by Google Gemini • Based on your company policies'
            : 'AI responses are based on your company\'s latest procedures and policies'
          }
        </p>
      </div>
    </div>
  )
}