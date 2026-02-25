'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Script from 'next/script'

const GA_MEASUREMENT_ID = 'G-W2VCY1D7Y7'
const PRODUCTION_HOSTNAMES = ['jsinterview.dev', 'www.jsinterview.dev']

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!PRODUCTION_HOSTNAMES.includes(window.location.hostname)) return
    if (typeof window.gtag !== 'function') return

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    })
  }, [pathname, searchParams])

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          if (['jsinterview.dev', 'www.jsinterview.dev'].includes(window.location.hostname)) {
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          } else {
            window.gtag = function() {};
          }
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
