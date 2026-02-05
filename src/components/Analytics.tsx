'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Script from 'next/script'

const GA_MEASUREMENT_ID = 'G-W2VCY1D7Y7'
const PRODUCTION_HOSTNAME = 'jsinterview.dev'

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isProduction, setIsProduction] = useState(false)

  useEffect(() => {
    setIsProduction(window.location.hostname === PRODUCTION_HOSTNAME)
  }, [])

  useEffect(() => {
    if (!isProduction || typeof window.gtag !== 'function') return

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    })
  }, [pathname, searchParams, isProduction])

  if (!isProduction) {
    return null
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  )
}

declare global {
  interface Window {
    gtag: (command: string, ...args: unknown[]) => void
  }
}
