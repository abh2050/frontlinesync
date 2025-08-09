// Environment and deployment configuration
export const ENV_CONFIG = {
  // Current environment
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  
  // Build info
  buildTime: import.meta.env.VITE_BUILD_TIME || new Date().toISOString(),
  
  // Domain configuration
  currentDomain: typeof window !== 'undefined' ? window.location.origin : 'https://frontlinesync.com',
  expectedDomain: 'https://frontlinesync.com',
  
  // Check if we're running on the correct domain
  isCorrectDomain() {
    if (typeof window === 'undefined') return true // SSR
    return window.location.hostname === 'frontlinesync.com' || 
           window.location.hostname === 'localhost' || 
           window.location.hostname.includes('127.0.0.1') ||
           window.location.hostname.includes('gitpod') ||
           window.location.hostname.includes('codespace')
  }
} as const

export default ENV_CONFIG