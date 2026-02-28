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
    id: 'the-pattern',
    label: 'The Pattern',
    steps: [
      {
        title: 'What Are Compound Components?',
        code: `<Select>
  <Select.Option value="a">Apple</Select.Option>
  <Select.Option value="b">Banana</Select.Option>
  <Select.Option value="c">Cherry</Select.Option>
</Select>`,
        explanation: 'Compound components are a set of components that work together to form a complete UI pattern. The parent manages shared state while children render the pieces. The consumer gets a flexible, declarative API.',
      },
      {
        title: 'Without Compound Components',
        code: `<Select
  options={[
    { value: 'a', label: 'Apple' },
    { value: 'b', label: 'Banana' },
    { value: 'c', label: 'Cherry' },
  ]}
  onChange={handleChange}
  renderOption={(opt) => <span>{opt.label}</span>}
/>`,
        explanation: 'Without compound components you end up with a monolithic API. All configuration is passed as props to one component. Adding features means adding more props, leading to a bloated interface.',
      },
      {
        title: 'The Compound Advantage',
        code: `<Select onChange={handleChange}>
  <Select.Label>Pick a fruit</Select.Label>
  <Select.Option value="a">Apple</Select.Option>
  <Select.Option value="b">Banana</Select.Option>
  <Select.Divider />
  <Select.Option value="c" disabled>
    Cherry (sold out)
  </Select.Option>
</Select>`,
        explanation: 'The compound pattern makes composition natural. Need a divider? Add Select.Divider. Need a label? Add Select.Label. Each sub-component is its own piece with its own props, and the parent orchestrates state.',
      },
    ],
  },
  {
    id: 'shared-state',
    label: 'Shared State',
    steps: [
      {
        title: 'Creating the Context',
        code: `interface SelectContextValue {
  selected: string
  onSelect: (value: string) => void
}

const SelectContext = createContext<
  SelectContextValue | null
>(null)`,
        explanation: 'The parent creates a Context to share state with all descendants. This lets children access selected value and the selection handler without prop drilling through every level.',
      },
      {
        title: 'Provider in the Parent',
        code: `function Select({ children, onChange }) {
  const [selected, setSelected] = useState('')

  const handleSelect = (value: string) => {
    setSelected(value)
    onChange?.(value)
  }

  return (
    <SelectContext.Provider
      value={{ selected, onSelect: handleSelect }}
    >
      <div className="select-wrapper">
        {children}
      </div>
    </SelectContext.Provider>
  )
}`,
        explanation: 'The parent component wraps children in a Provider. It owns the state and passes both the current value and the updater function through context. Children never need to receive state as props.',
      },
      {
        title: 'Consuming in the Child',
        code: `function Option({ value, children }) {
  const ctx = useContext(SelectContext)
  if (!ctx) throw new Error(
    'Option must be used within Select'
  )

  const isSelected = ctx.selected === value

  return (
    <div
      onClick={() => ctx.onSelect(value)}
      className={isSelected ? 'active' : ''}
    >
      {children}
    </div>
  )
}

Select.Option = Option`,
        explanation: 'Each child reads from context to determine its own state. Option knows if it is selected and calls onSelect when clicked. The error check ensures Option is always used inside a Select parent.',
      },
    ],
  },
  {
    id: 'flexible-api',
    label: 'Flexible API',
    steps: [
      {
        title: 'Reorder Without Code Changes',
        code: `<Select>
  <Select.Option value="c">Cherry</Select.Option>
  <Select.Option value="a">Apple</Select.Option>
  <Select.Option value="b">Banana</Select.Option>
</Select>`,
        explanation: 'Since children are regular JSX elements, consumers can reorder them freely. The internal state management is decoupled from the rendering order. No index props or configuration arrays needed.',
      },
      {
        title: 'Add Custom Content Between',
        code: `<Select>
  <p className="category">Fruits</p>
  <Select.Option value="a">Apple</Select.Option>
  <Select.Option value="b">Banana</Select.Option>
  <p className="category">Vegetables</p>
  <Select.Option value="c">Carrot</Select.Option>
</Select>`,
        explanation: 'Consumers can insert arbitrary elements between compound children. Static text, dividers, or even other components can be mixed in without breaking the pattern. Only compound children read from context.',
      },
      {
        title: 'Conditionally Render Children',
        code: `<Select>
  <Select.Option value="a">Apple</Select.Option>
  {isPremium && (
    <Select.Option value="gold">
      Golden Apple
    </Select.Option>
  )}
  <Select.Option value="b">Banana</Select.Option>
</Select>`,
        explanation: 'Standard conditional rendering works naturally. You can show or hide options based on application state. This is much harder with a config-object API where you would need to filter arrays.',
      },
    ],
  },
  {
    id: 'real-example',
    label: 'Real Example',
    steps: [
      {
        title: 'Accordion Context',
        code: `interface AccordionContextValue {
  openItems: Set<string>
  toggle: (id: string) => void
}

const AccordionCtx = createContext<
  AccordionContextValue | null
>(null)`,
        explanation: 'An Accordion tracks which items are open in a Set. The toggle function adds or removes item IDs. This context is the backbone that connects the Accordion parent to its Item children.',
      },
      {
        title: 'Accordion Parent',
        code: `function Accordion({ children }) {
  const [openItems, setOpenItems] = useState(
    new Set<string>()
  )

  const toggle = (id: string) => {
    setOpenItems(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <AccordionCtx.Provider value={{ openItems, toggle }}>
      <div>{children}</div>
    </AccordionCtx.Provider>
  )
}`,
        explanation: 'The Accordion parent manages which items are expanded. Using a Set allows multiple items to be open simultaneously. Toggle creates a new Set each time for immutable state updates.',
      },
      {
        title: 'Accordion Item',
        code: `function Item({ id, title, children }) {
  const ctx = useContext(AccordionCtx)
  if (!ctx) throw new Error('Use within Accordion')
  const isOpen = ctx.openItems.has(id)

  return (
    <div>
      <button onClick={() => ctx.toggle(id)}>
        {title} {isOpen ? '\u25B2' : '\u25BC'}
      </button>
      {isOpen && <div>{children}</div>}
    </div>
  )
}

Accordion.Item = Item`,
        explanation: 'Each Item reads context to check if it is open. Clicking the header calls toggle with its unique id. The content renders conditionally. This is the compound components pattern applied to a real use case.',
        output: ['<Accordion>', '  <Accordion.Item id="1" title="FAQ 1">', '    Answer to FAQ 1', '  </Accordion.Item>', '</Accordion>'],
      },
    ],
  },
]

export function CompoundComponentsViz(): JSX.Element {
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
