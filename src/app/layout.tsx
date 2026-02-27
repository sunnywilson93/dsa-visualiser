import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Analytics } from '@/components/Analytics'
import { SiteFooter } from '@/components/SiteFooter'
import { ShortcutOverlay } from '@/components/ShortcutOverlay'
import '@/styles/globals.css'

export const metadata: Metadata = {
  verification: {
    google: 'VrYpJpsVJz7IC1u0x6Cwe02I9vd2zk8-k5qgqudMOBw',
  },
  title: 'JS Interview Prep - Master JavaScript with Interactive Code Visualization',
  description: 'Master JavaScript through interactive visualization. Step through closures, event loop, prototypes, and 100+ coding challenges with real-time execution. Free learning platform for frontend interviews and JavaScript mastery.',
  keywords: 'javascript interview questions, js interview prep, frontend interview, coding interview, javascript visualizer, learn javascript, closures explained, event loop visualization, promise polyfill, array methods, hoisting, this keyword, prototype chain, async await, FAANG interview, web developer interview, javascript tutorial, interactive coding, DSA javascript, algorithm visualization',
  authors: [{ name: 'JS Interview Prep' }],
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  openGraph: {
    type: 'website',
    url: 'https://jsinterview.dev/',
    title: 'JS Interview Prep - Interactive JavaScript Visualization',
    description: 'Master JavaScript through interactive visualization. Step through closures, event loop, prototypes, and 100+ coding challenges with real-time execution. Free learning platform.',
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
    description: 'Master JavaScript through interactive visualization. Step through closures, event loop, prototypes, and 100+ coding challenges with real-time execution.',
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

// Static JSON-LD structured data for SEO — consolidated as @graph
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "name": "JS Interview Prep",
      "alternateName": ["JavaScript Interview Preparation", "JS Interview"],
      "url": "https://jsinterview.dev",
      "description": "Master JavaScript through interactive visualization and real-time code execution",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://jsinterview.dev/?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "EducationalOrganization",
      "name": "JS Interview Prep",
      "url": "https://jsinterview.dev",
      "description": "Free interactive platform to master JavaScript through visualization for learning and technical interviews",
      "areaServed": "Worldwide",
      "logo": "https://jsinterview.dev/favicon.svg",
      "sameAs": [
        "https://github.com/sunnywilson93/dsa-visualiser",
      ],
    },
    {
      "@type": "SoftwareApplication",
      "name": "JS Interview Prep",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "Web Browser",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <SiteFooter />
        <ShortcutOverlay />
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
