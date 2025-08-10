import { Globe } from '@phosphor-icons/react'
import APP_CONFIG from '@/config/app'

interface FooterProps {
  className?: string
  showDomain?: boolean
}

export default function Footer({ className = '', showDomain = true }: FooterProps) {
  return (
    <footer className={`text-center text-xs text-muted-foreground ${className}`}>
      <div className="flex flex-col items-center justify-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <span>© 2025 {APP_CONFIG.companyName}</span>
          {showDomain && (
            <>
              <span>•</span>
              <a 
                href={APP_CONFIG.domain} 
                className="inline-flex items-center space-x-1 text-primary hover:underline" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Globe className="w-3 h-3" />
                <span>frontlinesync.com</span>
              </a>
            </>
          )}
        </div>
        <div className="flex items-center space-x-4 text-xs">
          <a href="/privacy.html" className="text-muted-foreground hover:text-primary hover:underline">
            Privacy Policy
          </a>
          <span>•</span>
          <a href="/terms.html" className="text-muted-foreground hover:text-primary hover:underline">
            Terms of Service
          </a>
          <span>•</span>
          <a href="/contact.html" className="text-muted-foreground hover:text-primary hover:underline">
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}