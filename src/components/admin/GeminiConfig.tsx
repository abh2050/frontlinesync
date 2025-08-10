import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { useKV } from '@/hooks/use-kv'
import { useAuth } from '@/hooks/use-auth'
import { 
  Key, 
  Sparkle, 
  CheckCircle, 
  XCircle, 
  Info,
  ArrowSquareOut 
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { setGeminiApiKey, isGeminiConfigured } from '@/lib/gemini'

/**
 * Gemini API Configuration Component
 * Allows administrators to configure the Gemini API key
 */
export default function GeminiConfig() {
  const { user } = useAuth()
  const [apiKey, setApiKey] = useState('')
  const [isConfigured, setIsConfigured] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showKey, setShowKey] = useState(false)

  // Check current configuration status
  useEffect(() => {
    const checkConfig = async () => {
      try {
        const configured = await isGeminiConfigured()
        setIsConfigured(configured)
      } catch (error) {
        console.error('Error checking Gemini configuration:', error)
      }
    }
    checkConfig()
  }, [])

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter a valid API key')
      return
    }

    if (!apiKey.startsWith('AIzaSy')) {
      toast.error('Invalid Gemini API key format. Keys should start with "AIzaSy"')
      return
    }

    setIsLoading(true)
    try {
      const success = await setGeminiApiKey(apiKey.trim())
      
      if (success) {
        setIsConfigured(true)
        setApiKey('')
        toast.success('Gemini API configured successfully!')
      } else {
        toast.error('Failed to configure Gemini API. Please check your key.')
      }
    } catch (error) {
      console.error('Error setting API key:', error)
      toast.error('Error configuring Gemini API')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveKey = async () => {
    setIsLoading(true)
    try {
      await spark.kv.delete('gemini_api_key')
      setIsConfigured(false)
      toast.success('Gemini API key removed')
    } catch (error) {
      console.error('Error removing API key:', error)
      toast.error('Error removing API key')
    } finally {
      setIsLoading(false)
    }
  }

  // Only show to managers/admins
  if (user?.role !== 'manager') {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6 text-center">
          <XCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Access denied. Only managers can configure AI settings.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkle className="w-5 h-5" />
            <span>Gemini AI Integration</span>
            <Badge variant={isConfigured ? "default" : "secondary"}>
              {isConfigured ? "Configured" : "Not Configured"}
            </Badge>
          </CardTitle>
          <CardDescription>
            Enhance AI responses with Google's Gemini AI for more intelligent and context-aware assistance.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            {isConfigured ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
            <span className="text-sm">
              {isConfigured 
                ? "Gemini AI is active and enhancing chat responses"
                : "Using fallback AI responses - configure Gemini for enhanced capabilities"
              }
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="w-5 h-5" />
            <span>API Configuration</span>
          </CardTitle>
          <CardDescription>
            Configure your Google AI Studio API key to enable Gemini integration.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isConfigured ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="api-key">Gemini API Key</Label>
                <Input
                  id="api-key"
                  type={showKey ? "text" : "password"}
                  placeholder="Enter your Gemini API key (AIzaSy...)"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="font-mono"
                />
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowKey(!showKey)}
                  >
                    {showKey ? "Hide" : "Show"} Key
                  </Button>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button 
                  onClick={handleSaveApiKey}
                  disabled={isLoading || !apiKey.trim()}
                  className="flex-1"
                >
                  {isLoading ? "Configuring..." : "Save API Key"}
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-green-800">
                    Gemini API is configured and active
                  </span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  All AI chat responses are now enhanced with Gemini's advanced capabilities.
                </p>
              </div>

              <Button 
                variant="destructive" 
                onClick={handleRemoveKey}
                disabled={isLoading}
                size="sm"
              >
                {isLoading ? "Removing..." : "Remove API Key"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="w-5 h-5" />
            <span>Setup Instructions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm space-y-3">
            <div>
              <p className="font-medium mb-1">1. Get your API key</p>
              <p className="text-muted-foreground">
                Visit Google AI Studio to create a free API key for Gemini.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => window.open('https://makersuite.google.com/app/apikey', '_blank')}
              >
                <ArrowSquareOut className="w-4 h-4 mr-2" />
                Get API Key
              </Button>
            </div>

            <div>
              <p className="font-medium mb-1">2. Configure the key</p>
              <p className="text-muted-foreground">
                Enter your API key above and save it. The key is stored securely and only accessible to managers.
              </p>
            </div>

            <div>
              <p className="font-medium mb-1">3. Enhanced AI features</p>
              <p className="text-muted-foreground">
                Once configured, all chat responses will be powered by Gemini for more intelligent, context-aware assistance.
              </p>
            </div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Security Note:</strong> API keys are encrypted and stored securely. 
              Only managers can view or modify AI configuration settings.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}