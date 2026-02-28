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
    id: 'controlled',
    label: 'Controlled Input',
    steps: [
      {
        title: 'React Owns the Value',
        code: `function ControlledInput() {
  const [value, setValue] = useState('')

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}`,
        explanation: 'In a controlled component, React state is the single source of truth. The input displays whatever is in state, and every keystroke flows through onChange -> setState -> re-render -> updated input.',
      },
      {
        title: 'The Data Flow Cycle',
        code: `// User types "A":
// 1. DOM fires onChange event
// 2. Handler calls setValue("A")
// 3. React re-renders component
// 4. Input receives value="A"
// 5. Input displays "A"`,
        explanation: 'The value always round-trips through React. If you remove the onChange handler, the input becomes read-only because React keeps resetting it to the current state value on every render.',
        output: [
          'Keystroke -> onChange -> setState -> render -> DOM',
          'React is in full control of the value',
        ],
      },
      {
        title: 'Transforming Input on the Fly',
        code: `function UppercaseInput() {
  const [value, setValue] = useState('')

  const handleChange = (e) => {
    setValue(e.target.value.toUpperCase())
  }

  return <input value={value} onChange={handleChange} />
}`,
        explanation: 'Because React controls the value, you can transform, validate, or reject input before it reaches state. Here, every character is uppercased. The user literally cannot type lowercase letters.',
        output: ['Type "hello" -> displays "HELLO"'],
      },
      {
        title: 'Controlled Select and Textarea',
        code: `function Form() {
  const [color, setColor] = useState('red')
  const [bio, setBio] = useState('')

  return (
    <>
      <select value={color}
        onChange={(e) => setColor(e.target.value)}>
        <option value="red">Red</option>
        <option value="blue">Blue</option>
      </select>
      <textarea value={bio}
        onChange={(e) => setBio(e.target.value)} />
    </>
  )
}`,
        explanation: 'The controlled pattern works identically for select, textarea, and checkbox elements. Each uses value (or checked for checkboxes) plus an onChange handler to keep React state as the source of truth.',
      },
    ],
  },
  {
    id: 'uncontrolled',
    label: 'Uncontrolled Input',
    steps: [
      {
        title: 'The DOM Owns the Value',
        code: `function UncontrolledInput() {
  const inputRef = useRef(null)

  const handleSubmit = () => {
    console.log(inputRef.current.value)
  }

  return (
    <input ref={inputRef} defaultValue="" />
  )
}`,
        explanation: 'In an uncontrolled component, the DOM itself stores the input value. React does not track it in state. You read the value imperatively through a ref when you need it (usually on submit).',
      },
      {
        title: 'defaultValue vs value',
        code: `// Uncontrolled: sets initial value only
<input defaultValue="initial" />
// DOM manages subsequent changes

// Controlled: React manages value continuously
<input value={state} onChange={handler} />
// React resets to state on every render`,
        explanation: 'defaultValue sets the initial DOM value and then steps away. The input behaves like a normal HTML input. With value (no onChange), React fights the DOM, resetting the input on every render.',
      },
      {
        title: 'File Inputs Are Always Uncontrolled',
        code: `function FileUpload() {
  const fileRef = useRef(null)

  const handleUpload = () => {
    const file = fileRef.current.files[0]
    uploadToServer(file)
  }

  return (
    <input type="file" ref={fileRef} />
  )
}`,
        explanation: 'File inputs cannot be controlled because their value is read-only for security reasons. JavaScript cannot programmatically set what file is selected. Refs are the only way to access the selected file.',
        output: ['<input type="file"> is always uncontrolled'],
      },
      {
        title: 'When Uncontrolled is Simpler',
        code: `// Simple form with no live validation:
function SearchForm() {
  const handleSubmit = (e) => {
    e.preventDefault()
    const data = new FormData(e.target)
    search(data.get('query'))
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="query" defaultValue="" />
      <button type="submit">Search</button>
    </form>
  )
}`,
        explanation: 'For simple forms where you only need values on submit, uncontrolled inputs with FormData eliminate the boilerplate of state + onChange for every field. The DOM handles all intermediate state naturally.',
      },
    ],
  },
  {
    id: 'form-patterns',
    label: 'Form Patterns',
    steps: [
      {
        title: 'Multi-Field Controlled Form',
        code: `function SignupForm() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  return (
    <form>
      <input name="email" value={form.email}
        onChange={handleChange} />
      <input name="password" value={form.password}
        onChange={handleChange} />
    </form>
  )
}`,
        explanation: 'A single state object and one generic handler scales to any number of fields. The computed property name [name] maps each input to its state key. This avoids separate useState calls per field.',
      },
      {
        title: 'Live Validation',
        code: `function ValidatedInput() {
  const [email, setEmail] = useState('')
  const isValid = email.includes('@')

  return (
    <div>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={isValid ? 'valid' : 'invalid'}
      />
      {!isValid && email.length > 0 && (
        <span className="error">Invalid email</span>
      )}
    </div>
  )
}`,
        explanation: 'Controlled inputs enable real-time validation because the value is always in state. You can derive validation status on every render and show errors immediately as the user types.',
        output: [
          'Type "test"  -> className="invalid"',
          'Type "test@" -> className="valid"',
        ],
      },
      {
        title: 'Debounced Input',
        code: `function SearchInput() {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] =
    useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    if (debouncedQuery) fetchResults(debouncedQuery)
  }, [debouncedQuery])

  return <input value={query}
    onChange={e => setQuery(e.target.value)} />
}`,
        explanation: 'Controlled inputs let you split display state from API-triggering state. The input updates immediately on every keystroke for responsiveness, while the API call is debounced to avoid excessive requests.',
      },
      {
        title: 'Form Libraries Use Uncontrolled Under the Hood',
        code: `// React Hook Form registers inputs via ref
const { register, handleSubmit } = useForm()

<form onSubmit={handleSubmit(onSubmit)}>
  <input {...register('email')} />
  <input {...register('password')} />
  <button type="submit">Submit</button>
</form>`,
        explanation: 'Libraries like React Hook Form use uncontrolled inputs internally to minimize re-renders. Instead of re-rendering on every keystroke, they read DOM values via refs and only re-render when validation state changes.',
        output: [
          'Controlled form: re-render per keystroke',
          'React Hook Form: re-render only on submit/error',
        ],
      },
    ],
  },
  {
    id: 'when-to-use',
    label: 'When to Use Which',
    steps: [
      {
        title: 'Use Controlled When You Need...',
        code: `// Live validation
<input value={v} onChange={validate} />

// Input formatting (phone, currency)
<input value={formatted} onChange={parse} />

// Conditional disabling of submit
<button disabled={!isValid}>Submit</button>

// Dynamic form fields that depend on each other
// e.g., country -> state -> city dropdowns`,
        explanation: 'Choose controlled inputs when you need to react to every change: live validation, input masking, character limits, interdependent fields, or anywhere the UI must reflect the current input value in real time.',
      },
      {
        title: 'Use Uncontrolled When You Need...',
        code: `// Simple forms (value only needed on submit)
<form onSubmit={handleSubmit}>
  <input name="search" defaultValue="" />
</form>

// File uploads (must be uncontrolled)
<input type="file" ref={fileRef} />

// Integration with non-React DOM libraries
// e.g., jQuery plugins, D3 visualizations`,
        explanation: 'Choose uncontrolled inputs for simple cases where you only need the value at submission time, for file inputs (which are always uncontrolled), or when integrating with third-party DOM libraries that manage their own state.',
      },
      {
        title: 'Performance Comparison',
        code: `// Controlled: re-renders on every keystroke
// Typing "hello" = 5 re-renders
// Fine for most cases, React is fast

// Uncontrolled: zero re-renders while typing
// Only reads value on submit
// Better for large forms (50+ fields)

// Hybrid: useTransition for expensive updates
const [isPending, startTransition] = useTransition()
const handleChange = (e) => {
  setInputValue(e.target.value)
  startTransition(() => setFilteredList(filter(e.target.value)))
}`,
        explanation: 'For most forms, the performance difference is negligible. Controlled re-renders are cheap. For very large forms or expensive derived computations, uncontrolled or the hybrid approach with useTransition avoids jank.',
      },
      {
        title: 'Decision Flowchart',
        code: `// Need value on every change?
//   YES -> Controlled
//   NO  -> Do you need it only on submit?
//     YES -> Uncontrolled (simpler)
//     NO  -> Controlled (more flexible)
//
// File input?
//   -> Always uncontrolled
//
// Non-React library managing DOM?
//   -> Uncontrolled with ref
//
// Default recommendation:
//   -> Start controlled, optimize later`,
        explanation: 'When in doubt, start with controlled inputs. They give you maximum flexibility and are the standard React approach. Switch to uncontrolled only when you have a specific reason: simpler code for submit-only forms, file inputs, or third-party library integration.',
        output: ['Default: controlled. Optimize if needed.'],
      },
    ],
  },
]

export function ControlledUncontrolledViz(): JSX.Element {
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
                : 'bg-[var(--color-white-5)] border border-[var(--color-white-10)] text-[var(--color-text-muted)] hover:bg-[var(--color-white-10)]'
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

      <div className="rounded-xl border border-[var(--color-white-10)] overflow-hidden">
        <CodeBlock code={currentStep.code} />
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={`exp-${activeTab}-${stepIndex}`}
          className="text-base leading-relaxed text-[var(--color-text-muted)] bg-[var(--color-black-30)] border border-[var(--color-white-10)] rounded-lg px-4 py-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {currentStep.explanation}
        </motion.p>
      </AnimatePresence>

      {currentStep.output && currentStep.output.length > 0 && (
        <div className="bg-[var(--color-black-40)] border border-[var(--color-emerald-500)]/30 rounded-lg px-4 py-3">
          <div className="text-xs font-semibold text-[var(--color-emerald-500)] mb-1">Output</div>
          <div className="font-mono text-sm text-[var(--color-emerald-400)]">
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
