import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Analytics } from '@/components/Analytics'
import { SiteFooter } from '@/components/SiteFooter'
import '@/index.css'

export const metadata: Metadata = {
  verification: {
    google: 'VrYpJpsVJz7IC1u0x6Cwe02I9vd2zk8-k5qgqudMOBw',
  },
  title: 'JS Interview Prep - Master JavaScript with Interactive Code Visualization',
  description: 'Free interactive JavaScript interview preparation. Visualize closures, hoisting, event loop, prototypes, promises, and 100+ coding challenges with step-by-step execution. Ace your frontend interview at FAANG and top tech companies.',
  keywords: 'javascript interview questions, js interview prep, frontend interview, coding interview, javascript visualizer, learn javascript, closures explained, event loop visualization, promise polyfill, array methods, hoisting, this keyword, prototype chain, async await, FAANG interview, web developer interview, javascript tutorial, interactive coding, DSA javascript, algorithm visualization',
  authors: [{ name: 'JS Interview Prep' }],
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  openGraph: {
    type: 'website',
    url: 'https://jsinterview.dev/',
    title: 'JS Interview Prep - Interactive JavaScript Visualization',
    description: 'Master JavaScript interviews with interactive code visualization. Learn closures, event loop, promises, and 100+ coding challenges. Free and open source.',
    images: [
      {
        url: 'https://jsinterview.dev/og-image.png',
        width: 1200,
        height: 630,
        alt: 'JS Interview Prep - Interactive JavaScript Code Visualization',
      },
    ],
    siteName: 'JS Interview Prep',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JS Interview Prep - Interactive JavaScript Visualization',
    description: 'Master JavaScript interviews with interactive code visualization. Learn closures, event loop, promises, and 100+ coding challenges.',
    images: ['https://jsinterview.dev/og-image.png'],
  },
  metadataBase: new URL('https://jsinterview.dev'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  manifest: '/manifest.json',
  other: {
    'theme-color': '#a855f7',
    'msapplication-TileColor': '#a855f7',
  },
}

// Static JSON-LD structured data for SEO
const jsonLd = {
  website: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "JS Interview Prep",
    "alternateName": ["JavaScript Interview Preparation", "JS Interview"],
    "url": "https://jsinterview.dev",
    "description": "Interactive JavaScript interview preparation with code visualization",
  },
  education: {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "JS Interview Prep",
    "url": "https://jsinterview.dev",
    "description": "Free interactive platform to master JavaScript concepts for technical interviews",
    "areaServed": "Worldwide",
  },
  app: {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "JS Interview Prep",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "Web Browser",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.website) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.education) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.app) }}
        />
      </head>
      <body>
        {children}
        <SiteFooter />
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
