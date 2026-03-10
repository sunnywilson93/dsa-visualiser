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
    id: 'use-action-state',
    label: 'useActionState',
    steps: [
      {
        title: 'What useActionState Replaces',
        code: `// BEFORE: manual state for form submissions
function AddToCart({ itemId }: { itemId: string }) {
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  async function handleSubmit() {
    setIsPending(true)
    setError(null)
    try {
      await addToCart(itemId)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p>{error}</p>}
      <button disabled={isPending}>Add to Cart</button>
    </form>
  )
}`,
        explanation: 'Before React 19, form submissions required manual state management for pending status, error handling, and optimistic UI. Every form needed the same boilerplate pattern of isPending + error state + try/catch.',
        output: ['3 useState calls', '1 try/catch block', '1 finally block'],
      },
      {
        title: 'useActionState Simplifies Everything',
        code: `import { useActionState } from 'react'

async function addToCartAction(
  prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  try {
    const itemId = formData.get('itemId') as string
    await addToCart(itemId)
    return { error: null }
  } catch (e) {
    return { error: (e as Error).message }
  }
}

function AddToCart({ itemId }: { itemId: string }) {
  const [state, action, isPending] = useActionState(
    addToCartAction,
    { error: null }
  )

  return (
    <form action={action}>
      <input type="hidden" name="itemId" value={itemId} />
      {state.error && <p>{state.error}</p>}
      <button disabled={isPending}>Add to Cart</button>
    </form>
  )
}`,
        explanation: 'useActionState takes an async action function and initial state, returning [currentState, formAction, isPending]. The action receives previous state and FormData, returns next state. React manages the pending flag automatically.',
        output: ['state: { error: null }', 'action: bound form action', 'isPending: boolean (auto-managed)'],
      },
      {
        title: 'Progressive Enhancement',
        code: `// useActionState works WITHOUT JavaScript!
// The form action can be a Server Action:

// actions.ts
'use server'

async function addToCartAction(
  prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const itemId = formData.get('itemId') as string
  await db.cart.add(itemId)
  return { error: null }
}

// Component — works before JS loads
function AddToCart({ itemId }: { itemId: string }) {
  const [state, action, isPending] = useActionState(
    addToCartAction,
    { error: null }
  )

  return (
    <form action={action}>
      <input type="hidden" name="itemId" value={itemId} />
      <button disabled={isPending}>Add</button>
    </form>
  )
}`,
        explanation: 'When paired with Server Actions, useActionState enables progressive enhancement. The form works as a standard HTML form submission before JavaScript loads, then upgrades to an async experience with pending states once hydrated.',
        output: ['No JS: standard form POST to server', 'With JS: async submit + isPending UI'],
      },
    ],
  },
  {
    id: 'use-form-status',
    label: 'useFormStatus',
    steps: [
      {
        title: 'The Problem: Knowing If a Form Is Submitting',
        code: `// Before React 19: prop drilling isPending
function SubmitButton({ isPending }: { isPending: boolean }) {
  return (
    <button disabled={isPending}>
      {isPending ? 'Submitting...' : 'Submit'}
    </button>
  )
}

function Form() {
  const [isPending, setIsPending] = useState(false)

  return (
    <form>
      {/* Must pass isPending down to every button */}
      <SubmitButton isPending={isPending} />
    </form>
  )
}`,
        explanation: 'Previously, submit buttons needed the parent form to pass down loading state as a prop. This created tight coupling between the form and its submit UI.',
      },
      {
        title: 'useFormStatus Reads Parent Form State',
        code: `import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending, data, method, action } = useFormStatus()

  return (
    <button disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  )
}

// The button reads form state automatically!
function SignupForm() {
  async function signup(formData: FormData) {
    await createAccount(formData)
  }

  return (
    <form action={signup}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <SubmitButton />
    </form>
  )
}`,
        explanation: 'useFormStatus returns the status of the parent <form>. The pending flag is true while the form action is executing. The component must be a child of a <form> element. No prop drilling needed.',
        output: ['pending: true during submission', 'data: FormData being submitted', 'method: "get" or "post"', 'action: the form action function'],
      },
      {
        title: 'Reusable Across All Forms',
        code: `function SubmitButton({ label = 'Submit' }: { label?: string }) {
  const { pending } = useFormStatus()

  return (
    <button
      disabled={pending}
      className={pending ? 'opacity-50' : ''}
    >
      {pending ? 'Processing...' : label}
    </button>
  )
}

// Reuse in ANY form — no props needed
<form action={loginAction}>
  <SubmitButton label="Log In" />
</form>

<form action={signupAction}>
  <SubmitButton label="Sign Up" />
</form>

<form action={deleteAction}>
  <SubmitButton label="Delete Account" />
</form>`,
        explanation: 'Because useFormStatus reads from the nearest parent <form>, the same SubmitButton component works in every form without any props for loading state. This is a major composability win.',
      },
    ],
  },
  {
    id: 'use-optimistic',
    label: 'useOptimistic',
    steps: [
      {
        title: 'Optimistic UI: Show Result Before Server Confirms',
        code: `// The pattern: update UI immediately, revert on error
// Example: a like button

// Without optimistic UI:
// 1. User clicks Like
// 2. Wait 200-500ms for server response
// 3. Update UI with confirmed result
// -> Feels sluggish

// With optimistic UI:
// 1. User clicks Like
// 2. Immediately show liked state
// 3. Server confirms in background
// 4. If error, revert to previous state
// -> Feels instant`,
        explanation: 'Optimistic UI updates the interface immediately when the user takes an action, assuming the server will succeed. If the server request fails, the UI reverts. This makes applications feel much faster because users see instant feedback.',
      },
      {
        title: 'useOptimistic Hook',
        code: `import { useOptimistic } from 'react'
import { useActionState } from 'react'

interface Message {
  id: string
  text: string
  sending?: boolean
}

function Chat({ messages }: { messages: Message[] }) {
  const [optimisticMessages, addOptimistic] = useOptimistic(
    messages,
    (state: Message[], newMessage: string) => [
      ...state,
      { id: 'temp', text: newMessage, sending: true },
    ]
  )

  async function sendAction(
    prev: { error: string | null },
    formData: FormData
  ): Promise<{ error: string | null }> {
    const text = formData.get('message') as string
    addOptimistic(text)
    try {
      await sendMessage(text)
      return { error: null }
    } catch (e) {
      return { error: (e as Error).message }
    }
  }

  const [state, action] = useActionState(sendAction, { error: null })

  return (
    <div>
      {optimisticMessages.map((msg) => (
        <div key={msg.id} style={{ opacity: msg.sending ? 0.6 : 1 }}>
          {msg.text}
        </div>
      ))}
      <form action={action}>
        <input name="message" />
        <button>Send</button>
      </form>
    </div>
  )
}`,
        explanation: 'useOptimistic takes the current state and an update function. When addOptimistic is called, the UI immediately reflects the new message with a sending flag. When the action completes (success or failure), React reconciles with the actual server state.',
        output: ['Instant: message appears with opacity 0.6', 'On success: message becomes fully opaque', 'On failure: message is removed (reverts to server state)'],
      },
      {
        title: 'How Reversion Works',
        code: `// useOptimistic automatically reverts when the action completes

const [optimisticLikes, addOptimisticLike] = useOptimistic(
  likes,  // source of truth from server
  (current: number, change: number) => current + change
)

// Timeline:
// 1. likes = 10 (server state)
// 2. addOptimisticLike(1) -> optimisticLikes = 11
// 3. Server action runs...
//
// If success: likes prop updates to 11
//   -> optimisticLikes syncs to 11
//
// If failure: likes prop stays at 10
//   -> optimisticLikes reverts to 10
//
// The reversion is AUTOMATIC — no try/catch needed!`,
        explanation: 'useOptimistic tracks the source prop (likes). The optimistic value is a temporary overlay. When the async action finishes and React re-renders with the real server state, the optimistic overlay is discarded and the display syncs to the true value.',
      },
    ],
  },
  {
    id: 'use-hook',
    label: 'use()',
    steps: [
      {
        title: 'use() Reads Resources in Render',
        code: `import { use } from 'react'

// use() can read a Promise during render
function UserProfile({ userPromise }: { userPromise: Promise<User> }) {
  const user = use(userPromise)
  //    ^ suspends until the promise resolves

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  )
}

// Parent creates the promise and wraps in Suspense
function Page({ userId }: { userId: string }) {
  const userPromise = fetchUser(userId)

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserProfile userPromise={userPromise} />
    </Suspense>
  )
}`,
        explanation: 'The use() hook reads a Promise value during render, suspending the component until the Promise resolves. Unlike useEffect + useState, it integrates with Suspense for loading states and error boundaries for errors. The Promise must be created outside the component or memoized.',
        output: ['Suspends: shows fallback while loading', 'Resolves: renders user data', 'Rejects: caught by error boundary'],
      },
      {
        title: 'use() Can Read Context Conditionally',
        code: `import { use, createContext } from 'react'

const ThemeContext = createContext<'light' | 'dark'>('light')

function Greeting({ isLoggedIn }: { isLoggedIn: boolean }) {
  // use() can be called conditionally!
  // (unlike useContext which follows Rules of Hooks)
  if (isLoggedIn) {
    const theme = use(ThemeContext)
    return <h1 className={theme}>Welcome back!</h1>
  }

  return <h1>Please log in</h1>
}

// Compare with useContext — this is NOT allowed:
function BadExample({ isLoggedIn }: { isLoggedIn: boolean }) {
  if (isLoggedIn) {
    const theme = useContext(ThemeContext) // HOOK RULE VIOLATION
    return <h1 className={theme}>Welcome</h1>
  }
  return <h1>Please log in</h1>
}`,
        explanation: 'use() is NOT bound by the Rules of Hooks. It can be called inside conditions, loops, and after early returns. This makes it fundamentally different from useContext — you can conditionally read context values without restructuring your component.',
        output: ['use(Context): can be conditional', 'useContext(Context): must be top-level'],
      },
      {
        title: 'When to Use use() vs useEffect',
        code: `// use() for Suspense-integrated data loading:
function Comments({ postId }: { postId: string }) {
  const commentsPromise = fetchComments(postId)
  const comments = use(commentsPromise)
  // Suspends -> fallback shown -> renders when ready
  return <CommentList comments={comments} />
}

// useEffect for side effects and subscriptions:
function Comments({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchComments(postId)
      .then(setComments)
      .finally(() => setLoading(false))
  }, [postId])

  if (loading) return <div>Loading...</div>
  return <CommentList comments={comments} />
}

// use()      -> declarative, Suspense-based
// useEffect  -> imperative, manual loading state`,
        explanation: 'use() is for reading async resources declaratively with Suspense integration. useEffect is for side effects, subscriptions, and imperative async work. Prefer use() when the data is needed for the render output and you want Suspense boundaries to handle loading states.',
      },
    ],
  },
]

export function React19HooksViz(): JSX.Element {
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
