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
    id: 'server-vs-client',
    label: 'Server vs Client',
    steps: [
      {
        title: 'Server Components Are the Default',
        code: `// app/page.tsx (Server Component by default)
export default function HomePage() {
  return (
    <div>
      <h1>Welcome</h1>
      <p>This renders on the server only.</p>
    </div>
  )
}

// No JavaScript is sent to the browser for this component.
// The HTML is generated on the server and streamed to the client.`,
        explanation: 'In the Next.js App Router, every component is a Server Component by default. Server Components run exclusively on the server. Their code never appears in the client-side JavaScript bundle, and they cannot use hooks or browser APIs.',
      },
      {
        title: 'Opting Into Client Components',
        code: `// app/Counter.tsx
'use client'

import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  )
}`,
        explanation: 'Adding "use client" at the top of a file marks it as a Client Component. Client Components are rendered on the server for the initial HTML, then hydrated on the client with JavaScript for interactivity. Use them when you need state, effects, or event handlers.',
        output: ['Server Component: no "use client" directive', 'Client Component: "use client" at top of file'],
      },
      {
        title: 'The Decision Boundary',
        code: `// Server Component: use when
// - Fetching data
// - Accessing backend resources
// - Rendering static content
// - Keeping secrets (API keys, tokens)

// Client Component: use when
// - useState, useEffect, useReducer
// - onClick, onChange, onSubmit
// - Browser APIs (localStorage, window)
// - Third-party libs that use hooks

// Rule: start with Server Components,
// add 'use client' only where needed`,
        explanation: 'The guiding principle is to keep components on the server by default and only opt into the client when interactivity is required. This minimizes the JavaScript sent to the browser while maintaining full interactivity where needed.',
        output: ['Default: Server Component (zero JS)', 'Opt-in: Client Component (JS for interactivity)'],
      },
    ],
  },
  {
    id: 'zero-bundle',
    label: 'Zero Bundle Cost',
    steps: [
      {
        title: 'Server Component Dependencies Stay on the Server',
        code: `// app/BlogPost.tsx (Server Component)
import { marked } from 'marked'        // 35KB
import { sanitize } from 'dompurify'   // 15KB
import { highlight } from 'prismjs'     // 25KB

export async function BlogPost({ slug }: { slug: string }) {
  const markdown = await getPost(slug)
  const html = sanitize(marked(markdown))

  return <article>{html}</article>
}`,
        explanation: 'marked, dompurify, and prismjs are never sent to the browser. They run on the server to produce HTML, then only the resulting HTML is sent to the client. This removes 75KB of JavaScript from the client bundle at zero cost to functionality.',
        output: ['Client bundle impact: 0KB', 'Saved: 75KB (marked + dompurify + prismjs)'],
      },
      {
        title: 'Before vs After Server Components',
        code: `// BEFORE (Client Components only):
// main.js
//   react: 40KB
//   marked: 35KB
//   dompurify: 15KB
//   prismjs: 25KB
//   app code: 20KB
//   TOTAL: 135KB sent to browser

// AFTER (Server Components):
// main.js
//   react: 40KB
//   app code (client parts): 8KB
//   TOTAL: 48KB sent to browser
//
// Server-only deps: 0KB to browser`,
        explanation: 'Server Components fundamentally change the bundle equation. Heavy libraries for data processing, markdown rendering, date formatting, and syntax highlighting can be used freely on the server without any impact on the client-side bundle size.',
        output: ['Before: 135KB total client JS', 'After: 48KB total client JS', 'Reduction: 64% smaller bundle'],
      },
      {
        title: 'Large Dependency Audit',
        code: `// Check which deps are client-only:
// npm run analyze (bundle analyzer)

// Common heavy deps that can move to server:
// - marked / remark (markdown):   35-50KB
// - date-fns (full):              70KB
// - lodash (full):                70KB
// - syntax highlighters:          25-100KB
// - validation schemas (zod):     15KB

// These stay on client:
// - framer-motion (animations):   needs DOM
// - react-hook-form:              needs state
// - chart libraries:              needs canvas/SVG`,
        explanation: 'Audit your dependencies and move everything possible to Server Components. Data transformation, validation, formatting, and content processing libraries are prime candidates. Only libraries that need browser APIs or React state must stay on the client.',
      },
    ],
  },
  {
    id: 'data-fetching',
    label: 'Data Fetching',
    steps: [
      {
        title: 'Direct Async Data Fetching',
        code: `// app/users/page.tsx (Server Component)
async function UsersPage() {
  const users = await db.user.findMany()

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name} - {user.email}</li>
      ))}
    </ul>
  )
}

export default UsersPage`,
        explanation: 'Server Components can be async functions. You can directly await database queries, API calls, or file system reads. There is no need for useEffect, useState, or loading state management. The data is fetched before the HTML is generated.',
        output: ['No useEffect, no useState, no loading spinner', 'Data fetched at render time on the server'],
      },
      {
        title: 'No Client-Server Waterfalls',
        code: `// BAD: Client Component waterfall
function UserProfile() {
  const [user, setUser] = useState(null)
  useEffect(() => {
    fetch('/api/user/1').then(r => r.json()).then(setUser)
  }, [])
  // 1. Download JS -> 2. Hydrate -> 3. Fetch -> 4. Render
}

// GOOD: Server Component
async function UserProfile() {
  const user = await db.user.findUnique({ where: { id: 1 } })
  return <div>{user.name}</div>
  // 1. Fetch + Render on server -> 2. Stream HTML
}`,
        explanation: 'Client Components create a waterfall: the browser downloads JavaScript, hydrates the component, then fires off a fetch. Server Components eliminate this by fetching data during server rendering. The HTML arrives with the data already embedded.',
        output: ['Client: JS download -> hydrate -> fetch -> render (4 steps)', 'Server: fetch + render -> stream HTML (1 step)'],
      },
      {
        title: 'Parallel Data Fetching',
        code: `async function Dashboard() {
  // These run in parallel on the server
  const [user, posts, analytics] = await Promise.all([
    db.user.findUnique({ where: { id: 1 } }),
    db.post.findMany({ where: { authorId: 1 } }),
    fetchAnalytics(1),
  ])

  return (
    <div>
      <UserHeader user={user} />
      <PostList posts={posts} />
      <AnalyticsChart data={analytics} />
    </div>
  )
}`,
        explanation: 'Server Components can fetch multiple data sources in parallel using Promise.all(). All three queries execute simultaneously on the server, and the total wait time equals the slowest query rather than the sum of all three.',
        output: ['Sequential: 100ms + 200ms + 150ms = 450ms', 'Parallel: max(100, 200, 150) = 200ms'],
      },
    ],
  },
  {
    id: 'interleaving',
    label: 'Interleaving',
    steps: [
      {
        title: 'Client Components Inside Server Components',
        code: `// app/page.tsx (Server Component)
import { LikeButton } from './LikeButton'

async function BlogPost({ id }: { id: string }) {
  const post = await db.post.findUnique({ where: { id } })

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <LikeButton postId={id} />
    </article>
  )
}

// LikeButton.tsx (Client Component)
'use client'
export function LikeButton({ postId }: { postId: string }) {
  const [liked, setLiked] = useState(false)
  return <button onClick={() => setLiked(!liked)}>Like</button>
}`,
        explanation: 'You can import and render Client Components inside Server Components. The article content stays on the server (zero JS), while only the interactive LikeButton ships JavaScript to the browser. This is the most common composition pattern.',
        output: ['article, h1, p: rendered on server (0KB JS)', 'LikeButton: hydrated on client (small JS)'],
      },
      {
        title: 'Server Components as Children of Client Components',
        code: `// ClientLayout.tsx
'use client'
export function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [theme, setTheme] = useState('dark')
  return (
    <div className={theme}>
      <ThemeToggle onToggle={() => setTheme(t =>
        t === 'dark' ? 'light' : 'dark'
      )} />
      {children}
    </div>
  )
}

// app/page.tsx (Server Component)
import { ClientLayout } from './ClientLayout'

export default async function Page() {
  const data = await fetchData()
  return (
    <ClientLayout>
      <ServerContent data={data} />
    </ClientLayout>
  )
}`,
        explanation: 'Server Components can be passed as children to Client Components via the children prop. The Server Component is rendered on the server and its output is passed as a "slot" into the Client Component. The children prop is the key to this pattern.',
        output: ['ClientLayout: client JS for theme toggle', 'ServerContent: rendered on server, passed as children'],
      },
      {
        title: 'The Import Boundary Rule',
        code: `// Server Component CAN import Client Components
// app/page.tsx (Server)
import { Counter } from './Counter' // 'use client' file

// Client Component CANNOT import Server Components
// Counter.tsx ('use client')
import { ServerData } from './ServerData' // ERROR!

// Instead, pass Server Components as props:
// app/page.tsx (Server)
import { ClientWrapper } from './ClientWrapper'
import { ServerData } from './ServerData'

export default function Page() {
  return (
    <ClientWrapper>
      <ServerData />  {/* passed as children */}
    </ClientWrapper>
  )
}`,
        explanation: 'The "use client" directive creates a boundary. Everything imported by a Client Component also becomes a Client Component. To nest Server Components inside Client Components, pass them through props (children) from a Server Component parent.',
        output: ['Server -> imports Client: allowed', 'Client -> imports Server: NOT allowed', 'Server -> passes Server as children to Client: allowed'],
      },
    ],
  },
]

export function ServerComponentsViz(): JSX.Element {
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
