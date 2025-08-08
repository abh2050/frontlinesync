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
  Clock
} from '@phosphor-icons/react'
import { ChatMessage } from '@/types'
import { cn } from '@/lib/utils'

export default function AIChat() {
  const { user } = useAuth()
  const [messages, setMessages] = useKV<ChatMessage[]>('chat_messages', [])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const quickSuggestions = [
    "How do I clean the fryer?",
    "What's the return policy?",
    "Show me safety procedures",
    "How to handle customer complaints?",
    "Break room cleaning checklist",
    "Emergency contact numbers"
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(content),
        role: 'assistant',
        timestamp: new Date().toISOString(),
        type: 'text'
      }
      
      setMessages(prev => [...prev, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  const getAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()
    
    if (message.includes('fryer') || message.includes('clean')) {
      return `**Fryer Cleaning Procedure** 🍟

1. **Safety First**: Turn off fryer and let oil cool to 170°F
2. **Drain Oil**: Use proper disposal container
3. **Clean Vat**: Use degreasing solution and non-abrasive scrubber
4. **Rinse & Dry**: Thoroughly rinse with hot water and dry completely
5. **Filter Check**: Clean or replace oil filter
6. **Refill**: Add fresh oil to fill line

⚠️ **Safety Reminder**: Always wear heat-resistant gloves and follow lockout procedures.

Need the full video guide? I can show you the step-by-step visual walkthrough!`
    }
    
    if (message.includes('return') || message.includes('policy')) {
      return `**Return Policy Quick Reference** 📋

**With Receipt:**
• 30 days for full refund
• Items must be unused/unopened
• Original packaging required

**Without Receipt:**
• Store credit only
• Manager approval needed
• Valid ID required

**Exceptions:**
• Food items: No returns
• Electronics: 14 days only
• Sale items: Final sale

**Process:**
1. Check item condition
2. Verify purchase date
3. Process in POS system
4. Provide customer receipt

Need help with a specific return situation?`
    }
    
    if (message.includes('safety') || message.includes('emergency')) {
      return `**Safety Procedures** 🚨

**In Case of Emergency:**
• Fire: Pull alarm, evacuate, call 911
• Injury: Secure area, first aid, report immediately
• Spill: Block area, clean up, report

**Daily Safety Checks:**
✅ Fire exits clear
✅ First aid kit stocked
✅ Safety equipment accessible
✅ Spill stations ready

**Emergency Contacts:**
• 911 - Emergency
• Manager: (555) 0123
• Corporate Safety: (555) 0456

**Remember**: When in doubt, prioritize safety over speed. You're empowered to stop unsafe work!`
    }
    
    return `I understand you're asking about "${userMessage}". Let me help you with that!

As your AI assistant, I have access to all company procedures, policies, and best practices. I can provide:

• Step-by-step instructions
• Safety guidelines
• Policy clarifications
• Troubleshooting help
• Quick reference guides

Could you provide a bit more detail about what specific information you need? This helps me give you the most accurate and helpful response.

You can also try asking:
• "Show me the procedure for..."
• "What's the policy on..."
• "How do I handle..."
• "Safety requirements for..."`
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
      <div className="bg-card border-b border-border p-4 flex items-center space-x-3">
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
          <Robot className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h2 className="font-semibold">AI Assistant</h2>
          <p className="text-sm text-muted-foreground">
            Always here to help • Responds in seconds
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <Robot className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Welcome to AI Assistant!</h3>
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
                  className="text-left h-auto p-4 justify-start"
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
                    <Robot className="w-5 h-5 text-primary mt-0.5" />
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
                <Robot className="w-5 h-5 text-primary" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
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
          AI responses are based on your company's latest procedures and policies
        </p>
      </div>
    </div>
  )
}