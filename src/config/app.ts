// App Configuration
export const APP_CONFIG = {
  // Domain and branding
  domain: 'https://frontlinesync.com',
  appName: 'FrontLine Sync',
  companyName: 'FrontLine Sync',
  tagline: 'Empowering frontline workers with AI assistance',
  
  // Contact and support
  supportEmail: 'support@frontlinesync.com',
  contactEmail: 'contact@frontlinesync.com',
  
  // Features
  description: 'AI-powered workforce management platform for frontline workers',
  
  // Social and external links
  privacyPolicyUrl: 'https://frontlinesync.com/privacy',
  termsOfServiceUrl: 'https://frontlinesync.com/terms',
  helpCenterUrl: 'https://frontlinesync.com/help',
  
  // API endpoints (if needed for external integrations)
  apiBaseUrl: 'https://api.frontlinesync.com',
  
  // Version info
  version: '1.0.0',
  buildDate: new Date().toISOString(),
} as const

export default APP_CONFIG