'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepControls } from '@/components/SharedViz'
import { CodeBlock } from '@/components/ui'

interface Step {
  title: string
  code: string
  explanation: string
  output?: string[]
}

interface Tab {
  id: string
  label: string
  steps: Step[]
}

const tabs: Tab[] = [
  {
    id: 'react-lazy',
    label: 'React.lazy',
    steps: [
      {
        title: 'Static Import Loads Everything Upfront',
        code: `import { HeavyEditor } from './HeavyEditor'
import { Dashboard } from './Dashboard'
import { Settings } from './Settings'

function App() {
  const [page, setPage] = useState('dashboard')
  return page === 'editor'
    ? <HeavyEditor />
    : <Dashboard />
}`,
        explanation: 'With static imports, every component is included in the main bundle. The user downloads HeavyEditor, Dashboard, and Settings JavaScript even if they only ever visit the Dashboard. This increases initial load time.',
        output: ['main.js: 450KB (all components bundled together)'],
      },
      {
        title: 'Lazy Loading with React.lazy',
        code: `import { lazy, Suspense } from 'react'

const HeavyEditor = lazy(() => import('./HeavyEditor'))
const Settings = lazy(() => import('./Settings'))

function App() {
  const [page, setPage] = useState('dashboard')

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {page === 'editor' && <HeavyEditor />}
      {page === 'settings' && <Settings />}
    </Suspense>
  )
}`,
        explanation: 'React.lazy wraps a dynamic import() and returns a component that loads its code on demand. The component is only fetched when it is first rendered. Suspense displays a fallback while the chunk is downloading.',
        output: ['main.js: 120KB (Dashboard only)', 'HeavyEditor.chunk.js: 280KB (loaded on demand)'],
      },
      {
        title: 'Named Exports with React.lazy',
        code: `// React.lazy expects a default export.
// For named exports, re-export in the import:

const Chart = lazy(() =>
  import('./analytics').then(module => ({
    default: module.Chart,
  }))
)

// Or create a barrel file:
// analytics/ChartLazy.ts
// export { Chart as default } from './Chart'`,
        explanation: 'React.lazy requires the dynamic import to resolve to a module with a default export. If your component uses a named export, you can transform it in the .then() callback or create a small wrapper module that re-exports it as default.',
      },
    ],
  },
  {
    id: 'route-splitting',
    label: 'Route Splitting',
    steps: [
      {
        title: 'Every Route Gets Its Own Chunk',
        code: `import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

const Home = lazy(() => import('./pages/Home'))
const Profile = lazy(() => import('./pages/Profile'))
const Settings = lazy(() => import('./pages/Settings'))

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}`,
        explanation: 'Route-based splitting is the highest-impact strategy. Users only download the JavaScript for the page they are visiting. Navigation to a new route triggers the chunk download, and Suspense shows a skeleton while it loads.',
        output: ['/ -> home.chunk.js (30KB)', '/profile -> profile.chunk.js (45KB)', '/settings -> settings.chunk.js (25KB)'],
      },
      {
        title: 'Next.js Does This Automatically',
        code: `// Next.js App Router: each page is auto-split
// app/page.tsx      -> / (own chunk)
// app/about/page.tsx -> /about (own chunk)
// app/blog/page.tsx  -> /blog (own chunk)

// Next.js also prefetches visible <Link> routes:
import Link from 'next/link'

function Nav() {
  return (
    <nav>
      <Link href="/about">About</Link>
      <Link href="/blog">Blog</Link>
    </nav>
  )
}`,
        explanation: 'Next.js automatically code-splits every page in the app/ directory. Each route gets its own JavaScript chunk. The Link component also prefetches the target route chunk when it becomes visible in the viewport, making navigation feel instant.',
        output: ['Automatic per-page chunks', 'Link prefetching on viewport visibility'],
      },
    ],
  },
  {
    id: 'dynamic-import',
    label: 'Dynamic Import',
    steps: [
      {
        title: 'Conditional Feature Loading',
        code: `async function handleExport() {
  const { exportToPDF } = await import('./exportUtils')
  await exportToPDF(document)
}

function Toolbar() {
  return (
    <button onClick={handleExport}>
      Export to PDF
    </button>
  )
}`,
        explanation: 'Dynamic import() is not limited to React components. You can lazily load any JavaScript module. Here, the heavy PDF export library is only downloaded when the user clicks the export button, keeping the initial bundle small.',
        output: ['Button click -> fetch exportUtils.chunk.js', 'Then run exportToPDF()'],
      },
      {
        title: 'Feature Flags and A/B Tests',
        code: `async function loadEditor(variant: 'simple' | 'advanced') {
  if (variant === 'advanced') {
    const { AdvancedEditor } = await import('./AdvancedEditor')
    return AdvancedEditor
  }
  const { SimpleEditor } = await import('./SimpleEditor')
  return SimpleEditor
}

function App({ featureFlags }: { featureFlags: Flags }) {
  const [Editor, setEditor] = useState<ComponentType | null>(null)

  useEffect(() => {
    loadEditor(featureFlags.editor).then(setEditor)
  }, [featureFlags.editor])

  return Editor ? <Editor /> : <Loading />
}`,
        explanation: 'Dynamic imports enable loading different implementations based on runtime conditions. Users in the A/B test "simple" group never download the AdvancedEditor code, and vice versa. This reduces wasted bandwidth.',
      },
      {
        title: 'Preloading on Hover',
        code: `const importEditor = () => import('./HeavyEditor')

function Sidebar() {
  const handleMouseEnter = () => {
    importEditor() // start downloading
  }

  const handleClick = async () => {
    const { HeavyEditor } = await importEditor()
    // already cached from hover, instant
    renderEditor(HeavyEditor)
  }

  return (
    <button
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
    >
      Open Editor
    </button>
  )
}`,
        explanation: 'You can trigger a dynamic import without waiting for the result, preloading the chunk in the background. When the user hovers over a button, the browser starts downloading. By the time they click, the module is already cached.',
        output: ['Hover: fetch starts in background', 'Click: module already cached, instant'],
      },
    ],
  },
  {
    id: 'bundle-analysis',
    label: 'Bundle Analysis',
    steps: [
      {
        title: 'Visualizing Your Bundle',
        code: `// Install the analyzer:
// npm install @next/bundle-analyzer

// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // your Next.js config
})

// Run analysis:
// ANALYZE=true npm run build`,
        explanation: 'Bundle analyzers generate a visual treemap of your JavaScript output. Each rectangle represents a module, sized by its byte count. This reveals which dependencies are largest and where splitting would have the most impact.',
        output: ['ANALYZE=true npm run build', 'Opens interactive treemap in browser'],
      },
      {
        title: 'Common Bundle Bloat Patterns',
        code: `// BAD: imports entire library
import { format } from 'date-fns'
// Bundles ALL of date-fns (70KB)

// GOOD: import specific function
import format from 'date-fns/format'
// Bundles only format (2KB)

// BAD: barrel file imports everything
import { Button } from './components'
// If index.ts re-exports 50 components, all are bundled

// GOOD: direct import
import { Button } from './components/Button'`,
        explanation: 'Barrel files (index.ts that re-exports everything) and non-tree-shakeable imports are the most common causes of bundle bloat. Direct imports and modular package imports let the bundler eliminate unused code.',
        output: ['date-fns (full): 70KB', 'date-fns/format (direct): 2KB'],
      },
      {
        title: 'Setting a Performance Budget',
        code: `// package.json - bundlesize check
{
  "bundlesize": [
    {
      "path": ".next/static/chunks/main-*.js",
      "maxSize": "100KB"
    },
    {
      "path": ".next/static/chunks/pages/**/*.js",
      "maxSize": "50KB"
    }
  ]
}

// CI will fail if any chunk exceeds the budget`,
        explanation: 'Performance budgets set maximum sizes for your JavaScript chunks. Running these checks in CI prevents regressions. If a new dependency pushes a chunk over the limit, the build fails and the team investigates before shipping.',
        output: ['main.js: 95KB (under 100KB budget)', 'pages/editor.js: 52KB (over 50KB budget!) FAIL'],
      },
    ],
  },
]

export function CodeSplittingViz(): JSX.Element {
  const [activeTab, setActiveTab] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)

  const currentTab = tabs[activeTab]
  const currentStep = currentTab.steps[stepIndex]

  const handleTabChange = (index: number): void => {
    setActiveTab(index)
    setStepIndex(0)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2 flex-wrap justify-center">
        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(i)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeTab === i
                ? 'bg-blue-500/20 border border-blue-500/50 text-blue-300'
                : 'bg-white-5 border border-white-10 text-text-muted hover:bg-white-10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.h3
          key={`${activeTab}-${stepIndex}`}
          className="text-center text-lg font-semibold text-white"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          {currentStep.title}
        </motion.h3>
      </AnimatePresence>

      <div className="rounded-xl border border-white-10 overflow-hidden">
        <CodeBlock code={currentStep.code} />
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={`exp-${activeTab}-${stepIndex}`}
          className="text-base leading-relaxed text-text-muted bg-black-30 border border-white-10 rounded-lg px-4 py-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {currentStep.explanation}
        </motion.p>
      </AnimatePresence>

      {currentStep.output && currentStep.output.length > 0 && (
        <div className="bg-black-40 border border-emerald-30 rounded-lg px-4 py-3">
          <div className="text-xs font-semibold text-emerald-500 mb-1">Output</div>
          <div className="font-mono text-sm text-emerald-400">
            {currentStep.output.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        </div>
      )}

      <StepControls
        onPrev={() => setStepIndex(s => s - 1)}
        onNext={() => setStepIndex(s => s + 1)}
        onReset={() => setStepIndex(0)}
        canPrev={stepIndex > 0}
        canNext={stepIndex < currentTab.steps.length - 1}
        stepInfo={{ current: stepIndex + 1, total: currentTab.steps.length }}
      />
    </div>
  )
}
