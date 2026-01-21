import type { Metadata } from 'next'
import EventLoopPlaygroundClient from './EventLoopPlaygroundClient'
import { StructuredData } from '@/components/StructuredData'

export const metadata: Metadata = {
  title: 'Event Loop Playground - Visualize JavaScript Async Execution | JS Interview Prep',
  description: 'Interactive JavaScript event loop visualizer. Write code and watch how setTimeout, Promises, and async/await execute through the call stack, microtask queue, and macrotask queue.',
  keywords: 'event loop, javascript event loop, microtask, macrotask, promise, setTimeout, async await, javascript visualizer',
  openGraph: {
    title: 'Event Loop Playground - JavaScript Visualizer',
    description: 'Write code and visualize how the JavaScript event loop processes async operations',
    url: 'https://jsinterview.dev/playground/event-loop',
  },
  alternates: {
    canonical: '/playground/event-loop',
  },
}

function generateBreadcrumbSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://jsinterview.dev',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Playground',
        item: 'https://jsinterview.dev/playground',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Event Loop',
        item: 'https://jsinterview.dev/playground/event-loop',
      },
    ],
  }
}

function generateSoftwareAppSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Event Loop Playground',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web Browser',
    description: 'Interactive tool to visualize JavaScript event loop execution',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  }
}

export default function EventLoopPlaygroundPage() {
  const breadcrumbSchema = generateBreadcrumbSchema()
  const softwareAppSchema = generateSoftwareAppSchema()

  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      <StructuredData data={softwareAppSchema} />
      <EventLoopPlaygroundClient />
    </>
  )
}
