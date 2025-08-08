import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'
import { Users, MessageCircle, Calendar, Shield } from '@phosphor-icons/react'
import { toast } from 'sonner'

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
    
    setEmail(demoEmail)
    setPassword('demo123')
    
    // Automatically login with demo credentials
    try {
      const result = await login(demoEmail, 'demo123')
      console.log('Demo login result:', result)
      if (!result.success) {
        toast.error(`Demo login failed: ${result.error}`)
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
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">WorkForce AI</h1>
          <p className="text-muted-foreground">Empowering frontline workers with AI assistance</p>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-2">
            <MessageCircle className="w-8 h-8 text-accent mx-auto" />
            <p className="text-sm text-muted-foreground">AI Chat</p>
          </div>
          <div className="space-y-2">
            <Calendar className="w-8 h-8 text-accent mx-auto" />
            <p className="text-sm text-muted-foreground">Smart Scheduling</p>
          </div>
          <div className="space-y-2">
            <Shield className="w-8 h-8 text-accent mx-auto" />
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
                <div className="space-y-2">
                  <Button
                    variant="secondary"
                    className="w-full text-sm"
                    onClick={() => demoLogin('employee')}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Logging in...' : 'Demo Employee Account'}
                  </Button>
                  <Button
                    variant="secondary"
                    className="w-full text-sm"
                    onClick={() => demoLogin('manager')}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Logging in...' : 'Demo Manager Account'}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Secure authentication powered by enterprise-grade security
        </p>
      </div>
    </div>
  )
}