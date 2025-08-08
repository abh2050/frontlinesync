import { GoogleGenerativeAI } from '@google/generative-ai'

/**
 * Gemini AI service for workforce management assistance
 * Provides context-aware responses for frontline workers
 */

// Initialize Gemini with API key from environment or KV storage
let genAI: GoogleGenerativeAI | null = null

const initializeGemini = async () => {
  if (genAI) return genAI

  // Try to get API key from KV storage first
  let apiKey = ''
  
  try {
    const storedKey = await spark.kv.get<string>('gemini_api_key')
    if (storedKey) {
      apiKey = storedKey
      console.log('Found stored Gemini API key')
    }
  } catch (error) {
    console.log('No stored Gemini API key found:', error)
  }

  if (!apiKey) {
    console.warn('No Gemini API key configured - using fallback responses')
    return null
  }

  try {
    genAI = new GoogleGenerativeAI(apiKey)
    console.log('Gemini AI initialized successfully')
    return genAI
  } catch (error) {
    console.error('Failed to initialize Gemini:', error)
    return null
  }
}

/**
 * Generate AI response using Gemini for workforce queries
 */
export const generateGeminiResponse = async (
  message: string,
  userRole: 'employee' | 'manager' = 'employee',
  context?: {
    department?: string
    location?: string
    previousMessages?: Array<{ role: string; content: string }>
  }
): Promise<string> => {
  const ai = await initializeGemini()
  
  if (!ai) {
    return getFallbackResponse(message, userRole)
  }

  try {
    const model = ai.getGenerativeModel({ model: 'gemini-pro' })

    // Build context-aware prompt
    const systemPrompt = buildSystemPrompt(userRole, context)
    const fullPrompt = `${systemPrompt}\n\nUser Question: ${message}`

    const result = await model.generateContent(fullPrompt)
    const response = await result.response
    const text = response.text()

    return text || getFallbackResponse(message, userRole)
  } catch (error) {
    console.error('Gemini API error:', error)
    return getFallbackResponse(message, userRole)
  }
}

/**
 * Build system prompt based on user role and context
 */
const buildSystemPrompt = (
  userRole: 'employee' | 'manager',
  context?: {
    department?: string
    location?: string
    previousMessages?: Array<{ role: string; content: string }>
  }
) => {
  const basePrompt = `You are an AI assistant for a workforce management platform helping frontline workers in retail, hospitality, healthcare, and manufacturing.

Role: You're assisting a ${userRole}.
Context: ${context?.department ? `Department: ${context.department}` : ''} ${context?.location ? `Location: ${context.location}` : ''}

Guidelines:
- Provide clear, actionable answers for workplace procedures
- Use bullet points and step-by-step instructions when helpful
- Include safety reminders for equipment or procedures
- Be concise but thorough
- Use professional but friendly tone
- If unsure, ask clarifying questions
- Include relevant emoji for visual clarity (sparingly)

Focus areas:
- Safety procedures and protocols
- Equipment operation and maintenance
- Customer service best practices
- Company policies and procedures
- Troubleshooting common issues
- Compliance and regulatory requirements`

  if (userRole === 'manager') {
    return `${basePrompt}

Additional manager capabilities:
- Team scheduling and coverage analysis
- Performance metrics interpretation
- Compliance monitoring guidance
- Staff training recommendations
- Incident reporting procedures`
  }

  return basePrompt
}

/**
 * Fallback responses when Gemini is unavailable
 */
const getFallbackResponse = (message: string, userRole: 'employee' | 'manager'): string => {
  const messageLower = message.toLowerCase()
  
  // Safety-related queries
  if (messageLower.includes('safety') || messageLower.includes('emergency') || messageLower.includes('accident')) {
    return `**Safety First! 🚨**

For immediate emergencies, call 911 or your facility's emergency number.

Common safety procedures:
• Always follow lockout/tagout procedures
• Wear required PPE for your area
• Report hazards immediately to your supervisor
• Know the location of first aid stations and fire exits
• When in doubt, stop and ask for help

Need specific safety information? Please describe the situation or equipment you're asking about.`
  }

  // Equipment-related
  if (messageLower.includes('equipment') || messageLower.includes('machine') || messageLower.includes('clean')) {
    return `**Equipment & Maintenance 🔧**

General equipment guidelines:
• Always power down before cleaning or maintenance
• Follow manufacturer's cleaning instructions
• Use only approved cleaning solutions
• Document any issues or unusual sounds
• Never bypass safety features

For specific equipment procedures, please specify:
- Equipment model/type
- What you need help with (cleaning, operation, troubleshooting)
- Any error messages or symptoms

I can provide detailed step-by-step guidance once I know more details.`
  }

  // Customer service
  if (messageLower.includes('customer') || messageLower.includes('return') || messageLower.includes('complaint')) {
    return `**Customer Service Excellence 😊**

Key principles:
• Listen actively and empathize
• Apologize for inconvenience, even if not your fault
• Focus on solutions, not problems
• Know when to escalate to a supervisor
• Document interactions when required

Common situations:
• Returns: Check receipt, condition, and store policy
• Complaints: Listen, acknowledge, resolve or escalate
• Difficult customers: Stay calm, be professional, get help if needed

What specific customer situation are you dealing with? I can provide more targeted guidance.`
  }

  // Manager-specific fallback
  if (userRole === 'manager') {
    return `**Management Support 📊**

I'm here to help with:
• Staff scheduling and coverage planning
• Performance tracking and metrics
• Policy implementation and compliance
• Team communication strategies
• Incident documentation and reporting

For specific guidance, please describe:
- The situation or challenge you're facing
- What outcome you're trying to achieve
- Any constraints or requirements to consider

What management task can I assist you with today?`
  }

  // General employee fallback
  return `**I'm Here to Help! 💡**

I can assist with:
• Safety procedures and protocols
• Equipment operation and cleaning
• Customer service situations
• Company policies and procedures
• Shift scheduling questions
• General workplace guidance

To give you the most helpful answer, could you provide more details about:
- What specific procedure or policy you need help with
- What equipment or situation you're dealing with
- What you're trying to accomplish

The more context you provide, the better I can assist you!`
}

/**
 * Check if Gemini is properly configured
 */
export const isGeminiConfigured = async (): Promise<boolean> => {
  const ai = await initializeGemini()
  return ai !== null
}

/**
 * Set Gemini API key (for admin configuration)
 */
export const setGeminiApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    await spark.kv.set('gemini_api_key', apiKey)
    genAI = null // Reset to force reinitialization
    const ai = await initializeGemini()
    return ai !== null
  } catch (error) {
    console.error('Failed to set Gemini API key:', error)
    return false
  }
}

/**
 * Generate contextual quick suggestions based on user role
 */
export const generateQuickSuggestions = (
  userRole: 'employee' | 'manager',
  department?: string
): string[] => {
  const baseSuggestions = [
    "How do I handle a customer complaint?",
    "What are the emergency procedures?",
    "Show me safety guidelines",
    "How to clean equipment properly?"
  ]

  const employeeSuggestions = [
    "What's the break policy?",
    "How do I request time off?",
    "Return policy quick reference",
    "Who do I contact for maintenance?"
  ]

  const managerSuggestions = [
    "How to handle understaffing?",
    "Performance review guidelines",
    "Incident reporting procedure",
    "Schedule optimization tips"
  ]

  const suggestions = [...baseSuggestions]
  
  if (userRole === 'manager') {
    suggestions.push(...managerSuggestions)
  } else {
    suggestions.push(...employeeSuggestions)
  }

  // Add department-specific suggestions
  if (department) {
    switch (department.toLowerCase()) {
      case 'kitchen':
      case 'food service':
        suggestions.push("Food safety temperature guidelines", "Kitchen equipment cleaning")
        break
      case 'retail':
      case 'sales':
        suggestions.push("POS system troubleshooting", "Inventory management tips")
        break
      case 'maintenance':
        suggestions.push("Equipment maintenance schedules", "Work order procedures")
        break
    }
  }

  return suggestions.slice(0, 6) // Return top 6 suggestions
}