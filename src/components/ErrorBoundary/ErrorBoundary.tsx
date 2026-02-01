'use client'

import { Component, ErrorInfo, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/Button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  showDetails: boolean
}

// Functional wrapper to use Next.js router with class component
function ErrorFallbackWithRouter({
  error,
  errorInfo,
  showDetails,
  onRetry,
  onToggleDetails,
}: {
  error: Error | null
  errorInfo: ErrorInfo | null
  showDetails: boolean
  onRetry: () => void
  onToggleDetails: () => void
}) {
  const router = useRouter()

  const handleGoHome = () => {
    router.push('/')
  }

  return (
    <div className="relative p-[3px] rounded-2xl bg-gradient-to-br from-accent-red to-orange-500 animate-[redBorderPulse_2s_ease-in-out_infinite]">
      <div className="bg-bg-page-secondary rounded-xl p-8 flex flex-col items-center gap-4 text-center max-sm:p-6 max-sm:px-4">
        <div className="w-16 h-16 flex items-center justify-center bg-accent-red-30 rounded-full animate-[iconPulse_1.5s_ease-in-out_infinite]">
          <AlertTriangle className="text-accent-red" size={40} />
        </div>

        <h2 className="m-0 text-xl font-semibold text-text-bright">Something went wrong</h2>
        <p className="m-0 text-base text-gray-500 max-w-[300px]">
          This visualization encountered an unexpected error.
        </p>

        <div className="flex gap-3 flex-wrap justify-center mt-2 max-sm:flex-col max-sm:w-full">
          <Button
            variant="primary"
            size="lg"
            className="max-sm:w-full max-sm:justify-center"
            onClick={onRetry}
          >
            <RefreshCw size={16} />
            Try Again
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="max-sm:w-full max-sm:justify-center"
            onClick={handleGoHome}
          >
            <Home size={16} />
            Go Home
          </Button>
        </div>

        <button 
          className="flex items-center gap-[3px] py-1 px-3 text-xs bg-transparent border-none text-gray-700 cursor-pointer transition-colors duration-150 hover:text-gray-500" 
          onClick={onToggleDetails}
        >
          {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          <span>Error Details</span>
        </button>

        {showDetails && (
          <div className="w-full max-w-[400px] mt-2 p-3 bg-black-40 border border-accent-red-30 rounded-lg text-left">
            <div className="text-sm font-semibold text-accent-red mb-2 break-words">{error?.name}: {error?.message}</div>
            {errorInfo?.componentStack && (
              <pre className="m-0 p-2 bg-black-30 rounded-sm font-mono text-2xs text-gray-700 max-h-[150px] overflow-y-auto whitespace-pre-wrap break-words [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-black-30 [&::-webkit-scrollbar-thumb]:bg-accent-red-30 [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-thumb:hover]:bg-accent-red">
                {errorInfo.componentStack}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo })
    // Log to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    })
  }

  handleToggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }))
  }

  render() {
    const { hasError, error, errorInfo, showDetails } = this.state
    const { children, fallback } = this.props

    if (hasError) {
      if (fallback) {
        return fallback
      }

      return (
        <ErrorFallbackWithRouter
          error={error}
          errorInfo={errorInfo}
          showDetails={showDetails}
          onRetry={this.handleRetry}
          onToggleDetails={this.handleToggleDetails}
        />
      )
    }

    return children
  }
}

export default ErrorBoundary
