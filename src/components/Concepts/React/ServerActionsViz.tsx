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
    id: 'basics',
    label: 'Server Actions',
    steps: [
      {
        title: 'What Are Server Actions?',
        code: `// Server Actions are async functions that run on the server
// Marked with 'use server' directive

// actions.ts
'use server'

export async function createPost(formData: FormData): Promise<void> {
  const title = formData.get('title') as string
  const content = formData.get('content') as string

  // This runs on the SERVER — direct DB access!
  await db.posts.create({
    data: { title, content, authorId: getCurrentUser().id },
  })

  // Revalidate the posts page cache
  revalidatePath('/posts')
}

// No API route needed. No fetch() call.
// The function executes on the server
// and the framework handles serialization.`,
        explanation: 'Server Actions are async functions marked with "use server" that execute exclusively on the server. They can be passed to client components and called like regular functions, but the framework serializes the call, sends it to the server, executes it, and returns the result. No API route boilerplate needed.',
        output: ['"use server": marks function as server-only', 'Direct DB access: no API layer', 'Auto-serialization: framework handles transport'],
      },
      {
        title: 'Using Server Actions in Forms',
        code: `// actions.ts
'use server'

export async function createPost(formData: FormData): Promise<void> {
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  await db.posts.create({ data: { title, content } })
  revalidatePath('/posts')
}

// CreatePost.tsx (can be a Server Component!)
import { createPost } from './actions'

function CreatePostForm() {
  return (
    <form action={createPost}>
      <input name="title" placeholder="Title" required />
      <textarea name="content" placeholder="Content" required />
      <button type="submit">Publish</button>
    </form>
  )
}

// The <form action={serverAction}> pattern:
// 1. Collects FormData from form fields
// 2. Serializes and sends to server
// 3. Server executes the action
// 4. Page revalidates with fresh data`,
        explanation: 'Pass a Server Action directly to the form action prop. When submitted, the browser collects FormData from the form fields and the framework sends it to the server. This works as a standard HTML form submission before JavaScript loads, then upgrades to fetch-based submission after hydration.',
        output: ['<form action={serverAction}>', 'FormData auto-collected from inputs', 'Works before JS loads (progressive enhancement)'],
      },
      {
        title: 'Inline Server Actions',
        code: `// Server Actions can be defined inline in Server Components

async function PostList() {
  const posts = await db.posts.findMany()

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>
          {post.title}
          <form
            action={async () => {
              'use server'
              await db.posts.delete({ where: { id: post.id } })
              revalidatePath('/posts')
            }}
          >
            <button type="submit">Delete</button>
          </form>
        </li>
      ))}
    </ul>
  )
}

// The 'use server' directive inside the function body
// marks it as a Server Action. It captures the post.id
// from the closure and serializes it as a bound argument.`,
        explanation: 'You can define Server Actions inline within Server Components using "use server" inside the function body. The action captures values from the enclosing scope (like post.id) which are serialized as encrypted bound arguments. This is convenient for actions tied to specific data.',
      },
    ],
  },
  {
    id: 'vs-api-routes',
    label: 'vs API Routes',
    steps: [
      {
        title: 'Traditional API Route Pattern',
        code: `// OLD: API Route + Client fetch

// app/api/posts/route.ts
export async function POST(request: Request) {
  const body = await request.json()
  const { title, content } = body

  // Validate
  if (!title || !content) {
    return Response.json(
      { error: 'Title and content required' },
      { status: 400 }
    )
  }

  // Create
  const post = await db.posts.create({
    data: { title, content },
  })

  return Response.json(post, { status: 201 })
}

// Client Component
'use client'
function CreatePostForm() {
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    })
    if (!res.ok) setError('Failed to create post')
    setPending(false)
  }

  return <form onSubmit={handleSubmit}>...</form>
}`,
        explanation: 'The traditional pattern requires: an API route file with request parsing, validation, and response formatting; a client component with useState for error/pending states; manual fetch with JSON serialization; and error handling on both sides. This is substantial boilerplate for a form submission.',
        output: ['Files: 2 (API route + client component)', 'Lines of boilerplate: ~40', 'Manual: JSON serialization, error handling, pending state'],
      },
      {
        title: 'Server Action Equivalent',
        code: `// NEW: Server Action — one file, half the code

// actions.ts
'use server'

interface PostState {
  error: string | null
  success: boolean
}

export async function createPost(
  prevState: PostState,
  formData: FormData
): Promise<PostState> {
  const title = formData.get('title') as string
  const content = formData.get('content') as string

  if (!title || !content) {
    return { error: 'Title and content required', success: false }
  }

  try {
    await db.posts.create({ data: { title, content } })
    revalidatePath('/posts')
    return { error: null, success: true }
  } catch {
    return { error: 'Failed to create post', success: false }
  }
}

// CreatePost.tsx
'use client'
import { useActionState } from 'react'
import { createPost } from './actions'

function CreatePostForm() {
  const [state, action, pending] = useActionState(
    createPost,
    { error: null, success: false }
  )

  return (
    <form action={action}>
      <input name="title" required />
      <textarea name="content" required />
      {state.error && <p>{state.error}</p>}
      <button disabled={pending}>
        {pending ? 'Publishing...' : 'Publish'}
      </button>
    </form>
  )
}`,
        explanation: 'The Server Action version eliminates the API route entirely. Validation and DB access live in the action. useActionState manages pending and error state automatically. The result is less code, fewer files, type-safe end-to-end, and progressive enhancement for free.',
        output: ['Files: 1 action + 1 component (no API route)', 'Auto: pending state, FormData handling', 'Bonus: works without JavaScript'],
      },
      {
        title: 'When to Use Which',
        code: `// USE SERVER ACTIONS when:
// - Form submissions (CRUD operations)
// - Data mutations triggered by user interaction
// - You want progressive enhancement
// - Simple request/response patterns

// action={createPost}    -> form submission
// action={deleteItem}    -> delete button
// action={toggleLike}    -> like button

// USE API ROUTES when:
// - External clients need the endpoint (mobile apps, webhooks)
// - Streaming responses (SSE, WebSockets)
// - File uploads with progress tracking
// - Complex authentication flows (OAuth callbacks)
// - Third-party integrations that POST to your URL

// GET /api/products      -> external API consumers
// POST /api/webhooks     -> third-party callbacks
// GET /api/stream        -> server-sent events

// RULE OF THUMB:
// Internal mutation -> Server Action
// External API      -> API Route`,
        explanation: 'Server Actions are best for internal data mutations triggered by user interactions (form submissions, button clicks). API Routes are still needed when external systems need to call your endpoints, for streaming, or for complex flows. Most internal forms and mutations should use Server Actions.',
      },
    ],
  },
  {
    id: 'progressive-enhancement',
    label: 'Progressive Enhancement',
    steps: [
      {
        title: 'Forms Work Before JavaScript Loads',
        code: `// This form works even if JavaScript fails to load!

// actions.ts
'use server'

async function subscribe(formData: FormData): Promise<void> {
  const email = formData.get('email') as string
  await db.subscribers.create({ data: { email } })
  redirect('/thank-you')
}

// NewsletterForm.tsx
import { subscribe } from './actions'

function NewsletterForm() {
  return (
    <form action={subscribe}>
      <input
        name="email"
        type="email"
        placeholder="your@email.com"
        required
      />
      <button type="submit">Subscribe</button>
    </form>
  )
}

// Without JS:  standard HTML form POST -> server processes -> redirect
// With JS:     fetch-based submit -> no page reload -> smoother UX`,
        explanation: 'Server Actions attached via the form action prop work as native HTML form submissions before JavaScript loads. The browser sends a POST request, the server processes it, and redirects. After hydration, the same form upgrades to use fetch for a seamless SPA experience. This is progressive enhancement.',
        output: ['No JS: HTML form POST -> full page redirect', 'With JS: fetch() -> in-place update + redirect'],
      },
      {
        title: 'Enhanced UX After Hydration',
        code: `'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { subscribe } from './actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button disabled={pending} type="submit">
      {pending ? 'Subscribing...' : 'Subscribe'}
    </button>
  )
}

function NewsletterForm() {
  const [state, action] = useActionState(subscribe, {
    error: null,
    subscribed: false,
  })

  if (state.subscribed) {
    return <p>Thanks for subscribing!</p>
  }

  return (
    <form action={action}>
      <input name="email" type="email" required />
      {state.error && <p>{state.error}</p>}
      <SubmitButton />
    </form>
  )
}

// Before JS: form submits, full page reload, server redirect
// After JS:  form submits via fetch, pending state shown,
//            inline success/error message, no page reload`,
        explanation: 'After JavaScript loads, the form enhances with pending indicators via useFormStatus, inline error messages via useActionState, and in-place success states. The same form progressively enhances from basic HTML to rich SPA behavior without changing the markup.',
        output: ['Layer 1: HTML form (always works)', 'Layer 2: pending state (useFormStatus)', 'Layer 3: optimistic UI (useOptimistic)', 'Layer 4: inline validation + success states'],
      },
      {
        title: 'Server Actions with Validation',
        code: `'use server'

import { z } from 'zod'

const PostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  content: z.string().min(10, 'Content must be at least 10 chars'),
  tags: z.string().transform(s => s.split(',').map(t => t.trim())),
})

interface PostState {
  errors: Record<string, string[]>
  success: boolean
}

export async function createPost(
  prevState: PostState,
  formData: FormData
): Promise<PostState> {
  const result = PostSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
    tags: formData.get('tags'),
  })

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors as Record<string, string[]>,
      success: false,
    }
  }

  await db.posts.create({ data: result.data })
  revalidatePath('/posts')
  return { errors: {}, success: true }
}

// Usage:
// const [state, action] = useActionState(createPost, {
//   errors: {},
//   success: false,
// })
// state.errors.title?.[0]  -> "Title is required"
// state.errors.content?.[0] -> "Content must be at least 10 chars"`,
        explanation: 'Server Actions pair naturally with schema validation libraries like Zod. Validate on the server (the only trustworthy environment), return field-level errors in the state, and display them next to the relevant form fields. The action function signature (prevState, formData) -> nextState makes this pattern clean.',
        output: ['Server-side validation: always trustworthy', 'Field-level errors: returned in state', 'Type-safe: Zod schema ensures data integrity'],
      },
    ],
  },
]

export function ServerActionsViz(): JSX.Element {
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
