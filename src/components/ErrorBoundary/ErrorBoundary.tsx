'use client'

import { Component, ErrorInfo, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp } from 'lucide-react'
import styles from './ErrorBoundary.module.css'

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
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <AlertTriangle className={styles.icon} size={40} />
        </div>

        <h2 className={styles.title}>Something went wrong</h2>
        <p className={styles.message}>
          This visualization encountered an unexpected error.
        </p>

        <div className={styles.actions}>
          <button className={styles.btnPrimary} onClick={onRetry}>
            <RefreshCw size={16} />
            Try Again
          </button>
          <button className={styles.btnSecondary} onClick={handleGoHome}>
            <Home size={16} />
            Go Home
          </button>
        </div>

        <button className={styles.detailsToggle} onClick={onToggleDetails}>
          {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          <span>Error Details</span>
        </button>

        {showDetails && (
          <div className={styles.errorDetails}>
            <div className={styles.errorName}>{error?.name}: {error?.message}</div>
            {errorInfo?.componentStack && (
              <pre className={styles.stackTrace}>
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
