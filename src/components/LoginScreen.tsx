import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'
import { Chat, CalendarBlank, ShieldCheck } from '@phosphor-icons/react'
import { toast } from 'sonner'
import companyLogo from '@/assets/images/WhatsApp_Image_2025-08-08_at_06.28.26.jpeg'
import APP_CONFIG from '@/config/app'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showDemoAccounts, setShowDemoAccounts] = useState(false)
  const { login, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(email, password)
  }

  const demoLogin = async (role: 'employee' | 'manager') => {
    const demoEmail = role === 'manager' ? 'manager@workforce.com' : 'employee@workforce.com'
    console.log(`Attempting demo login for ${role} with email: ${demoEmail}`)
    
    // Set form fields for visual feedback
    setEmail(demoEmail)
    setPassword('demo123')
    
    // Automatically login with demo credentials
    try {
      const result = await login(demoEmail, 'demo123')
      console.log('Demo login result:', result)
      if (!result.success) {
        toast.error(`Demo login failed: ${result.error || 'Unknown error'}`)
      } else {
        console.log(`✅ Successfully logged in as ${role}`)
      }
    } catch (error) {
      console.error('Demo login error:', error)
      toast.error('Demo login failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-24 h-24 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-lg overflow-hidden">
            <img 
              src={companyLogo} 
              alt="Company Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-foreground">{APP_CONFIG.appName}</h1>
          <p className="text-muted-foreground">{APP_CONFIG.tagline}</p>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-2">
            <Chat className="w-8 h-8 text-accent mx-auto" />
            <p className="text-sm text-muted-foreground">AI Chat</p>
          </div>
          <div className="space-y-2">
            <CalendarBlank className="w-8 h-8 text-accent mx-auto" />
            <p className="text-sm text-muted-foreground">Smart Scheduling</p>
          </div>
          <div className="space-y-2">
            <ShieldCheck className="w-8 h-8 text-accent mx-auto" />
            <p className="text-sm text-muted-foreground">Compliance Tracking</p>
          </div>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Access your personalized dashboard and AI assistant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Demo Accounts */}
            <div className="mt-6 pt-6 border-t">
              <Button
                variant="outline"
                className="w-full mb-3"
                onClick={() => setShowDemoAccounts(!showDemoAccounts)}
              >
                Try Demo Accounts
              </Button>
              
              {showDemoAccounts && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground text-center">
                    Quick access demo accounts for testing
                  </p>
                  <Button
                    variant="secondary"
                    className="w-full text-sm"
                    onClick={() => demoLogin('employee')}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Logging in...' : '👤 Demo Employee Account'}
                  </Button>
                  <Button
                    variant="secondary"
                    className="w-full text-sm"
                    onClick={() => demoLogin('manager')}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Logging in...' : '👨‍💼 Demo Manager Account'}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Or use any email containing "manager" for manager access
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Secure authentication powered by enterprise-grade security
          <br />
          <span className="text-xs">Visit us at <a href={APP_CONFIG.domain} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">frontlinesync.com</a></span>
        </p>
      </div>
    </div>
  )
}