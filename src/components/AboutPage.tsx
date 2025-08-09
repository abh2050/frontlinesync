import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Globe, Mail, Shield, Sparkle } from '@phosphor-icons/react'
import APP_CONFIG from '@/config/app'
import companyLogo from '@/assets/images/WhatsApp_Image_2025-08-08_at_06.28.26.jpeg'

export default function AboutPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-32 h-32 bg-white rounded-3xl flex items-center justify-center shadow-lg overflow-hidden">
          <img 
            src={companyLogo} 
            alt="FrontLine Sync Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">{APP_CONFIG.appName}</h1>
          <p className="text-xl text-muted-foreground">{APP_CONFIG.tagline}</p>
          <p className="text-lg text-primary mt-2">{APP_CONFIG.description}</p>
        </div>
      </div>

      {/* Domain and Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="w-6 h-6 text-primary" />
            <span>Visit Our Website</span>
          </CardTitle>
          <CardDescription>
            Access more information and resources online
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <Button 
              asChild 
              size="lg" 
              className="w-full max-w-sm"
            >
              <a 
                href={APP_CONFIG.domain} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2"
              >
                <Globe className="w-5 h-5" />
                <span>frontlinesync.com</span>
              </a>
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="text-center p-4 bg-secondary/50 rounded-lg">
              <Mail className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Contact Support</h3>
              <p className="text-sm text-muted-foreground">{APP_CONFIG.supportEmail}</p>
            </div>
            
            <div className="text-center p-4 bg-secondary/50 rounded-lg">
              <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Enterprise Security</h3>
              <p className="text-sm text-muted-foreground">SOC 2 Type II Compliant</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkle className="w-6 h-6 text-primary" />
            <span>Platform Features</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Sparkle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">AI-Powered Assistance</h3>
              <p className="text-sm text-muted-foreground">Instant help with work tasks, procedures, and questions</p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Compliance Tracking</h3>
              <p className="text-sm text-muted-foreground">Automated monitoring and certification management</p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Smart Scheduling</h3>
              <p className="text-sm text-muted-foreground">Optimized shift management and availability tracking</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center pt-6 border-t">
        <p className="text-sm text-muted-foreground">
          © 2025 {APP_CONFIG.companyName} • Version {APP_CONFIG.version}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Empowering frontline workers worldwide
        </p>
      </div>
    </div>
  )
}