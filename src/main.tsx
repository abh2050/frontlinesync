import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary";

import App from './App.tsx'
import { AuthProvider } from '@/hooks/use-auth'
import { ErrorFallback } from './ErrorFallback.tsx'

// Initialize our mock spark KV
import '@/hooks/use-kv'

import "./main.css"
import "./styles/theme.css"
import "./index.css"

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ErrorBoundary>
)
