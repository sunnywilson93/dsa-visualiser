import type { Metadata } from 'next'
import AsyncVisualizerClient from './AsyncVisualizerClient'
import { StructuredData } from '@/components/StructuredData'

export const metadata: Metadata = {
  title: 'Promise & Async Visualizer - Step Through Async Execution | JS Interview Prep',
  description: 'Interactive async execution visualizer. Step through Promise chains, async/await, setTimeout, and microtask/macrotask ordering with animated call stack, queues, and Web API panels.',
  keywords: 'promise visualizer, async await, microtask queue, macrotask queue, call stack, event loop, javascript async, promise chain, interview prep',
  openGraph: {
    title: 'Promise & Async Visualizer - JavaScript Async Execution',
    description: 'Step through async execution with animated call stack, microtask queue, macrotask queue, and Web API panels',
    url: 'https://jsinterview.dev/playground/async-visualizer',
  },
  alternates: {
    canonical: '/playground/async-visualizer',
  },
}

function generateBreadcrumbSchema(): object {
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
        name: 'Async Visualizer',
        item: 'https://jsinterview.dev/playground/async-visualizer',
      },
    ],
  }
}

function generateSoftwareAppSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Promise & Async Visualizer',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web Browser',
    description: 'Interactive tool to visualize JavaScript async execution with call stack, microtask queue, macrotask queue, and Web API panels',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  }
}

export default function AsyncVisualizerPage() {
  const breadcrumbSchema = generateBreadcrumbSchema()
  const softwareAppSchema = generateSoftwareAppSchema()

  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      <StructuredData data={softwareAppSchema} />
      <AsyncVisualizerClient />
    </>
  )
}
