import { Globe, Warning } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import ENV_CONFIG from '@/config/env'
import APP_CONFIG from '@/config/app'

export default function DomainIndicator() {
  // Don't show in production on correct domain
  if (ENV_CONFIG.isProduction && ENV_CONFIG.isCorrectDomain()) {
    return null
  }

  const isCorrectDomain = ENV_CONFIG.isCorrectDomain()
  const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'unknown'

  return (
    <div className="flex items-center space-x-2 text-xs">
      {isCorrectDomain ? (
        <Badge variant="secondary" className="flex items-center space-x-1">
          <Globe className="w-3 h-3" />
          <span>Development</span>
        </Badge>
      ) : (
        <Badge variant="destructive" className="flex items-center space-x-1">
          <Warning className="w-3 h-3" />
          <span>Wrong Domain</span>
        </Badge>
      )}
      
      {ENV_CONFIG.isDevelopment && (
        <span className="text-muted-foreground">
          Production: {APP_CONFIG.domain.replace('https://', '')}
        </span>
      )}
    </div>
  )
}