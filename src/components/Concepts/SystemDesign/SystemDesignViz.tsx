'use client'

import { useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { getSystemDesignConceptById } from '@/data/systemDesignConcepts'

interface DiagramBox {
  label: string
  color: string
  children?: string[]
}

interface DataFlowStep {
  from: string
  to: string
  label: string
}

interface TradeOff {
  approach: string
  pros: string[]
  cons: string[]
}

interface ConceptDiagram {
  architecture: DiagramBox[]
  dataFlow: DataFlowStep[]
  tradeOffs: TradeOff[]
}

const conceptDiagrams: Record<string, ConceptDiagram> = {
  'sd-radio-framework': {
    architecture: [
      { label: 'Requirements', color: 'var(--color-accent-blue)', children: ['Functional', 'Non-Functional', 'Scale'] },
      { label: 'Architecture', color: 'var(--color-accent-green)', children: ['Component Tree', 'Module Boundaries', 'Layers'] },
      { label: 'Data Model', color: 'var(--color-accent-yellow)', children: ['State Shape', 'Server State', 'URL State'] },
      { label: 'Interface', color: 'var(--color-accent-purple)', children: ['Prop Contracts', 'API Layer', 'Events'] },
      { label: 'Optimizations', color: 'var(--color-accent-orange)', children: ['Performance', 'Accessibility', 'Edge Cases'] },
    ],
    dataFlow: [
      { from: 'Requirements', to: 'Architecture', label: 'Scope drives structure' },
      { from: 'Architecture', to: 'Data Model', label: 'Components need state' },
      { from: 'Data Model', to: 'Interface', label: 'State shapes APIs' },
      { from: 'Interface', to: 'Optimizations', label: 'APIs reveal bottlenecks' },
    ],
    tradeOffs: [
      { approach: 'Top-down (RADIO)', pros: ['Covers breadth', 'Structured narrative', 'Time-boxed sections'], cons: ['May feel rigid', 'Less time for deep dives'] },
      { approach: 'Bottom-up (Code-first)', pros: ['Shows coding skill', 'Concrete examples'], cons: ['Misses architecture', 'Easy to get lost in details'] },
    ],
  },
  'sd-component-architecture': {
    architecture: [
      { label: 'App Shell', color: 'var(--color-accent-blue)', children: ['Layout', 'Navigation', 'Error Boundary'] },
      { label: 'Feature Modules', color: 'var(--color-accent-green)', children: ['Container', 'Presentational', 'Hooks'] },
      { label: 'Shared UI', color: 'var(--color-accent-yellow)', children: ['Design System', 'Primitives', 'Compound'] },
      { label: 'Data Layer', color: 'var(--color-accent-purple)', children: ['API Client', 'Cache', 'Stores'] },
    ],
    dataFlow: [
      { from: 'App Shell', to: 'Feature Modules', label: 'Route rendering' },
      { from: 'Feature Modules', to: 'Shared UI', label: 'Composition' },
      { from: 'Feature Modules', to: 'Data Layer', label: 'Fetching & mutations' },
      { from: 'Data Layer', to: 'Feature Modules', label: 'Reactive state updates' },
    ],
    tradeOffs: [
      { approach: 'Container/Presentational', pros: ['Clear separation', 'Testable', 'Reusable views'], cons: ['Extra abstraction layer', 'Can over-split'] },
      { approach: 'Compound Components', pros: ['Flexible composition', 'Declarative API'], cons: ['Context overhead', 'Steeper learning curve'] },
    ],
  },
  'sd-data-fetching': {
    architecture: [
      { label: 'UI Components', color: 'var(--color-accent-blue)', children: ['Loading', 'Error', 'Data'] },
      { label: 'Query Layer', color: 'var(--color-accent-green)', children: ['Cache', 'Deduplication', 'Retry'] },
      { label: 'Transport', color: 'var(--color-accent-yellow)', children: ['REST', 'GraphQL', 'WebSocket'] },
      { label: 'Server', color: 'var(--color-accent-purple)', children: ['API Gateway', 'Database', 'CDN'] },
    ],
    dataFlow: [
      { from: 'UI Components', to: 'Query Layer', label: 'useQuery / fetch' },
      { from: 'Query Layer', to: 'Transport', label: 'Cache miss' },
      { from: 'Transport', to: 'Server', label: 'Network request' },
      { from: 'Query Layer', to: 'UI Components', label: 'Cache hit (instant)' },
    ],
    tradeOffs: [
      { approach: 'SWR / React Query', pros: ['Built-in caching', 'Background revalidation', 'Deduplication'], cons: ['Library dependency', 'Cache invalidation complexity'] },
      { approach: 'Manual fetch + state', pros: ['No dependencies', 'Full control'], cons: ['Reinventing caching', 'Race conditions', 'More boilerplate'] },
    ],
  },
  'sd-state-management': {
    architecture: [
      { label: 'Server State', color: 'var(--color-accent-blue)', children: ['React Query', 'SWR', 'Apollo'] },
      { label: 'Client State', color: 'var(--color-accent-green)', children: ['Zustand', 'Jotai', 'useState'] },
      { label: 'URL State', color: 'var(--color-accent-yellow)', children: ['Search Params', 'Route Params', 'Hash'] },
      { label: 'Form State', color: 'var(--color-accent-purple)', children: ['React Hook Form', 'Validation', 'Dirty Tracking'] },
    ],
    dataFlow: [
      { from: 'Server State', to: 'Client State', label: 'Derived / cached' },
      { from: 'URL State', to: 'Server State', label: 'Triggers fetch' },
      { from: 'Client State', to: 'URL State', label: 'Sync on change' },
      { from: 'Form State', to: 'Server State', label: 'Mutation on submit' },
    ],
    tradeOffs: [
      { approach: 'Single global store (Redux)', pros: ['Predictable', 'DevTools', 'Middleware'], cons: ['Boilerplate', 'Over-subscription', 'Server state mixing'] },
      { approach: 'Categorized stores', pros: ['Right tool per job', 'Less coupling', 'Better performance'], cons: ['Multiple libraries', 'Inconsistent patterns'] },
    ],
  },
  'sd-real-time': {
    architecture: [
      { label: 'WebSocket Client', color: 'var(--color-accent-blue)', children: ['Connect', 'Reconnect', 'Heartbeat'] },
      { label: 'Message Router', color: 'var(--color-accent-green)', children: ['Event Bus', 'Subscriptions', 'Handlers'] },
      { label: 'State Sync', color: 'var(--color-accent-yellow)', children: ['Optimistic UI', 'Conflict Resolution', 'Ordering'] },
      { label: 'Fallback', color: 'var(--color-accent-purple)', children: ['Long Polling', 'SSE', 'Periodic Fetch'] },
    ],
    dataFlow: [
      { from: 'WebSocket Client', to: 'Message Router', label: 'Incoming events' },
      { from: 'Message Router', to: 'State Sync', label: 'Update state' },
      { from: 'State Sync', to: 'WebSocket Client', label: 'Outgoing messages' },
      { from: 'Fallback', to: 'Message Router', label: 'Polled data' },
    ],
    tradeOffs: [
      { approach: 'WebSocket', pros: ['Full-duplex', 'Low latency', 'Binary support'], cons: ['Connection management', 'Proxy issues', 'Scaling cost'] },
      { approach: 'Server-Sent Events', pros: ['Simple', 'Auto-reconnect', 'HTTP/2 compatible'], cons: ['One-way only', 'Limited browser connections', 'Text only'] },
    ],
  },
  'sd-rendering-strategies': {
    architecture: [
      { label: 'CSR', color: 'var(--color-accent-blue)', children: ['SPA', 'Client Hydration', 'Dynamic'] },
      { label: 'SSR', color: 'var(--color-accent-green)', children: ['Per-Request', 'Streaming', 'Personalized'] },
      { label: 'SSG', color: 'var(--color-accent-yellow)', children: ['Build-Time', 'CDN Cached', 'Static'] },
      { label: 'ISR', color: 'var(--color-accent-purple)', children: ['Revalidate', 'On-Demand', 'Hybrid'] },
    ],
    dataFlow: [
      { from: 'SSG', to: 'CSR', label: 'Hydration on load' },
      { from: 'SSR', to: 'CSR', label: 'Hydration after stream' },
      { from: 'ISR', to: 'SSG', label: 'Background rebuild' },
      { from: 'CSR', to: 'SSR', label: 'Fallback on error' },
    ],
    tradeOffs: [
      { approach: 'SSR everywhere', pros: ['SEO friendly', 'Fast FCP', 'Personalized'], cons: ['Server cost', 'TTFB varies', 'Hydration overhead'] },
      { approach: 'SSG + CSR hybrid', pros: ['Fastest TTFB', 'CDN cacheable', 'Low server cost'], cons: ['Stale content risk', 'Build time grows', 'No personalization'] },
    ],
  },
  'sd-performance-budget': {
    architecture: [
      { label: 'Bundle Budget', color: 'var(--color-accent-blue)', children: ['< 200KB JS', 'Code Splitting', 'Tree Shaking'] },
      { label: 'Core Web Vitals', color: 'var(--color-accent-green)', children: ['LCP < 2.5s', 'INP < 200ms', 'CLS < 0.1'] },
      { label: 'Asset Pipeline', color: 'var(--color-accent-yellow)', children: ['Images', 'Fonts', 'CSS'] },
      { label: 'Monitoring', color: 'var(--color-accent-purple)', children: ['Lighthouse CI', 'RUM', 'Alerts'] },
    ],
    dataFlow: [
      { from: 'Bundle Budget', to: 'Core Web Vitals', label: 'Smaller JS = faster TTI' },
      { from: 'Asset Pipeline', to: 'Core Web Vitals', label: 'Optimized media = faster LCP' },
      { from: 'Core Web Vitals', to: 'Monitoring', label: 'Track regressions' },
      { from: 'Monitoring', to: 'Bundle Budget', label: 'Enforce limits in CI' },
    ],
    tradeOffs: [
      { approach: 'Aggressive splitting', pros: ['Small initial load', 'Parallel downloads'], cons: ['Request waterfall', 'More round trips'] },
      { approach: 'Fewer, larger chunks', pros: ['Fewer requests', 'Better compression'], cons: ['Larger initial load', 'Wasted bytes on unused code'] },
    ],
  },
  'sd-accessibility': {
    architecture: [
      { label: 'Semantic HTML', color: 'var(--color-accent-blue)', children: ['Landmarks', 'Headings', 'Forms'] },
      { label: 'ARIA', color: 'var(--color-accent-green)', children: ['Roles', 'Properties', 'States'] },
      { label: 'Focus Management', color: 'var(--color-accent-yellow)', children: ['Tab Order', 'Focus Trap', 'Roving Index'] },
      { label: 'Announcements', color: 'var(--color-accent-purple)', children: ['Live Regions', 'Status', 'Alerts'] },
    ],
    dataFlow: [
      { from: 'Semantic HTML', to: 'ARIA', label: 'ARIA augments semantics' },
      { from: 'Focus Management', to: 'ARIA', label: 'activedescendant' },
      { from: 'Announcements', to: 'ARIA', label: 'aria-live updates' },
      { from: 'Semantic HTML', to: 'Focus Management', label: 'Native tab order' },
    ],
    tradeOffs: [
      { approach: 'Native HTML elements', pros: ['Free accessibility', 'Keyboard support built-in', 'Screen reader compatible'], cons: ['Limited styling', 'Browser inconsistencies'] },
      { approach: 'Custom ARIA widgets', pros: ['Full design control', 'Custom behavior'], cons: ['Must implement keyboard nav', 'Testing burden', 'Easy to break'] },
    ],
  },
  'sd-design-feed': {
    architecture: [
      { label: 'Feed Shell', color: 'var(--color-accent-blue)', children: ['Header', 'New Posts Banner', 'Compose'] },
      { label: 'Virtual List', color: 'var(--color-accent-green)', children: ['Viewport Calc', 'Height Cache', 'Overscan'] },
      { label: 'Feed Item', color: 'var(--color-accent-yellow)', children: ['Author', 'Content', 'Media', 'Engagement'] },
      { label: 'Data Layer', color: 'var(--color-accent-purple)', children: ['Normalized Store', 'Cursor Pagination', 'WebSocket'] },
    ],
    dataFlow: [
      { from: 'Data Layer', to: 'Virtual List', label: 'Item IDs + entities' },
      { from: 'Virtual List', to: 'Feed Item', label: 'Visible items only' },
      { from: 'Feed Item', to: 'Data Layer', label: 'Optimistic updates' },
      { from: 'Data Layer', to: 'Feed Shell', label: 'Pending count' },
    ],
    tradeOffs: [
      { approach: 'Full DOM rendering', pros: ['Simple implementation', 'Native scroll', 'SEO friendly'], cons: ['DOM bloat at 1K+ items', 'Jank on scroll', 'High memory'] },
      { approach: 'Virtual scrolling', pros: ['Constant DOM nodes', 'Smooth at 10K+ items'], cons: ['Complex height management', 'Dynamic height challenges', 'Accessibility concerns'] },
    ],
  },
  'sd-design-autocomplete': {
    architecture: [
      { label: 'Input Layer', color: 'var(--color-accent-blue)', children: ['Debounce', 'Min Chars', 'Clear'] },
      { label: 'Search Engine', color: 'var(--color-accent-green)', children: ['AbortController', 'Cache (LRU)', 'Dedup'] },
      { label: 'Results Panel', color: 'var(--color-accent-yellow)', children: ['Highlight Match', 'Keyboard Nav', 'Groups'] },
      { label: 'A11y Layer', color: 'var(--color-accent-purple)', children: ['Combobox Role', 'Live Region', 'Focus Mgmt'] },
    ],
    dataFlow: [
      { from: 'Input Layer', to: 'Search Engine', label: 'Debounced query' },
      { from: 'Search Engine', to: 'Results Panel', label: 'Filtered results' },
      { from: 'Results Panel', to: 'Input Layer', label: 'Selection' },
      { from: 'A11y Layer', to: 'Results Panel', label: 'Screen reader state' },
    ],
    tradeOffs: [
      { approach: 'Client-side filtering', pros: ['Instant results', 'Offline-capable', 'No API cost'], cons: ['Memory for large datasets', 'Initial load cost'] },
      { approach: 'Server-side search', pros: ['Scales to millions', 'Fuzzy matching', 'Ranking'], cons: ['Network latency', 'Race conditions', 'API rate limits'] },
    ],
  },
}

type TabId = 'architecture' | 'data-flow' | 'trade-offs'

const tabs: { id: TabId; label: string }[] = [
  { id: 'architecture', label: 'Architecture' },
  { id: 'data-flow', label: 'Data Flow' },
  { id: 'trade-offs', label: 'Trade-offs' },
]

function ArchitectureView({ boxes }: { boxes: DiagramBox[] }): JSX.Element {
  return (
    <div className="grid grid-cols-2 gap-[var(--spacing-lg)] max-md:grid-cols-1">
      {boxes.map((box, i) => (
        <motion.div
          key={box.label}
          className="rounded-[var(--radius-lg)] border-[var(--border-width-2)] p-[var(--spacing-lg)]"
          style={{ borderColor: box.color, borderStyle: 'solid' }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
        >
          <div
            className="text-[length:var(--text-base)] font-[var(--font-weight-bold)] mb-[var(--spacing-sm)]"
            style={{ color: box.color }}
          >
            {box.label}
          </div>
          {box.children && (
            <div className="flex flex-wrap gap-[var(--spacing-xs)]">
              {box.children.map((child) => (
                <span
                  key={child}
                  className="rounded-[var(--radius-sm)] px-[var(--spacing-sm)] py-[var(--spacing-0.5)] text-[length:var(--text-sm)] text-text-secondary"
                  style={{ backgroundColor: `color-mix(in srgb, ${box.color} 15%, transparent)` }}
                >
                  {child}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}

function DataFlowView({ steps }: { steps: DataFlowStep[] }): JSX.Element {
  return (
    <div className="flex flex-col gap-[var(--spacing-md)]">
      {steps.map((step, i) => (
        <motion.div
          key={i}
          className="flex items-center gap-[var(--spacing-md)] rounded-[var(--radius-lg)] border border-[var(--color-border-card)] bg-[var(--color-surface-card)] p-[var(--spacing-md)]"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.15 }}
        >
          <div className="shrink-0 rounded-[var(--radius-sm)] bg-[var(--color-brand-primary-15)] px-[var(--spacing-md)] py-[var(--spacing-xs)] text-[length:var(--text-sm)] font-[var(--font-weight-semibold)] text-[color:var(--color-brand-primary)]">
            {step.from}
          </div>
          <div className="flex flex-1 flex-col items-center gap-[var(--spacing-0.5)]">
            <div className="h-[var(--spacing-0.5)] w-full bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] rounded-full" />
            <span className="text-[length:var(--text-xs)] text-text-muted text-center">{step.label}</span>
          </div>
          <div className="shrink-0 rounded-[var(--radius-sm)] bg-[var(--color-accent-green-15)] px-[var(--spacing-md)] py-[var(--spacing-xs)] text-[length:var(--text-sm)] font-[var(--font-weight-semibold)] text-[color:var(--color-accent-green)]">
            {step.to}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function TradeOffsView({ tradeOffs }: { tradeOffs: TradeOff[] }): JSX.Element {
  return (
    <div className="flex flex-col gap-[var(--spacing-xl)]">
      {tradeOffs.map((tradeOff, i) => (
        <motion.div
          key={tradeOff.approach}
          className="rounded-[var(--radius-lg)] border border-[var(--color-border-card)] bg-[var(--color-surface-card)] overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15 }}
        >
          <div className="border-b border-[var(--color-border-card)] bg-[var(--color-brand-primary-15)] px-[var(--spacing-lg)] py-[var(--spacing-md)]">
            <h4 className="m-0 text-[length:var(--text-base)] font-[var(--font-weight-semibold)] text-text-bright">
              {tradeOff.approach}
            </h4>
          </div>
          <div className="grid grid-cols-2 gap-0 max-md:grid-cols-1">
            <div className="border-r border-[var(--color-border-card)] p-[var(--spacing-md)] max-md:border-r-0 max-md:border-b max-md:border-b-[var(--color-border-card)]">
              <div className="text-[length:var(--text-sm)] font-[var(--font-weight-semibold)] text-[color:var(--color-accent-green)] mb-[var(--spacing-sm)]">
                Pros
              </div>
              <ul className="m-0 list-none p-0 flex flex-col gap-[var(--spacing-xs)]">
                {tradeOff.pros.map((pro) => (
                  <li key={pro} className="text-[length:var(--text-sm)] text-text-secondary pl-[var(--spacing-md)] relative before:absolute before:left-0 before:content-['+'] before:text-[color:var(--color-accent-green)] before:font-[var(--font-weight-bold)]">
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-[var(--spacing-md)]">
              <div className="text-[length:var(--text-sm)] font-[var(--font-weight-semibold)] text-[color:var(--color-accent-red)] mb-[var(--spacing-sm)]">
                Cons
              </div>
              <ul className="m-0 list-none p-0 flex flex-col gap-[var(--spacing-xs)]">
                {tradeOff.cons.map((con) => (
                  <li key={con} className="text-[length:var(--text-sm)] text-text-secondary pl-[var(--spacing-md)] relative before:absolute before:left-0 before:content-['-'] before:text-[color:var(--color-accent-red)] before:font-[var(--font-weight-bold)]">
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export function SystemDesignViz(): JSX.Element {
  const params = useParams()
  const conceptId = params.conceptId as string
  const [activeTab, setActiveTab] = useState<TabId>('architecture')

  const concept = useMemo(() => getSystemDesignConceptById(conceptId), [conceptId])
  const diagram = conceptDiagrams[conceptId]

  if (!diagram || !concept) {
    return (
      <div className="flex h-[250px] items-center justify-center text-text-muted">
        Visualization coming soon
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-[var(--spacing-lg)]">
      <div className="text-center">
        <h3 className="m-0 text-[length:var(--text-md)] font-[var(--font-weight-semibold)] text-text-bright mb-[var(--spacing-xs)]">
          {concept.title}
        </h3>
        <p className="m-0 text-[length:var(--text-sm)] text-text-muted">
          Explore the architecture, data flow, and trade-offs
        </p>
      </div>

      <div className="flex justify-center gap-[var(--spacing-xs)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-[var(--spacing-lg)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] text-[length:var(--text-sm)] font-[var(--font-weight-medium)] transition-colors cursor-pointer border-none ${
              activeTab === tab.id
                ? 'bg-[var(--color-brand-primary)] text-white'
                : 'bg-[var(--color-white-5)] text-text-muted hover:bg-[var(--color-white-10)] hover:text-text-bright'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'architecture' && <ArchitectureView boxes={diagram.architecture} />}
          {activeTab === 'data-flow' && <DataFlowView steps={diagram.dataFlow} />}
          {activeTab === 'trade-offs' && <TradeOffsView tradeOffs={diagram.tradeOffs} />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
