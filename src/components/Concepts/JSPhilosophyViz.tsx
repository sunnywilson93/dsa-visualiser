import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TimelineEvent {
  year: string
  title: string
  description: string
  color: string
}

interface Paradigm {
  id: string
  name: string
  color: string
  description: string
  code: string
}

interface Principle {
  id: string
  title: string
  description: string
  example: string
  color: string
}

const timeline: TimelineEvent[] = [
  { year: '1995', title: 'Birth of JavaScript', description: 'Brendan Eich creates JavaScript in 10 days at Netscape', color: '#f59e0b' },
  { year: '1997', title: 'ECMAScript 1', description: 'JavaScript becomes standardized as ECMAScript', color: '#10b981' },
  { year: '2009', title: 'ES5', description: 'Strict mode, JSON support, array methods', color: '#3b82f6' },
  { year: '2015', title: 'ES6/ES2015', description: 'let/const, arrow functions, classes, promises', color: '#a855f7' },
  { year: '2020+', title: 'Modern JS', description: 'Optional chaining, nullish coalescing, and more', color: '#ec4899' },
]

const paradigms: Paradigm[] = [
  {
    id: 'procedural',
    name: 'Procedural',
    color: '#f59e0b',
    description: 'Step-by-step instructions',
    code: `let sum = 0;
for (let i = 1; i <= 5; i++) {
  sum += i;
}
console.log(sum); // 15`,
  },
  {
    id: 'functional',
    name: 'Functional',
    color: '#10b981',
    description: 'Functions as first-class values',
    code: `const nums = [1, 2, 3, 4, 5];
const sum = nums.reduce(
  (acc, n) => acc + n, 0
);
console.log(sum); // 15`,
  },
  {
    id: 'oop',
    name: 'Object-Oriented',
    color: '#a855f7',
    description: 'Objects with methods',
    code: `class Counter {
  constructor() { this.sum = 0; }
  add(n) { this.sum += n; }
}
const c = new Counter();
[1,2,3,4,5].forEach(n => c.add(n));`,
  },
]

const principles: Principle[] = [
  {
    id: 'dynamic',
    title: 'Dynamic Typing',
    description: 'Types are checked at runtime, not compile time',
    example: 'let x = 42; x = "hello"; // No error!',
    color: '#f59e0b',
  },
  {
    id: 'firstclass',
    title: 'First-Class Functions',
    description: 'Functions are values you can pass around',
    example: 'const fn = x => x * 2; [1,2].map(fn);',
    color: '#10b981',
  },
  {
    id: 'prototype',
    title: 'Prototype-Based',
    description: 'Objects inherit directly from other objects',
    example: 'const child = Object.create(parent);',
    color: '#3b82f6',
  },
  {
    id: 'fail',
    title: 'Fail Silently',
    description: 'Returns undefined instead of throwing errors',
    example: 'const obj = {}; obj.missing; // undefined',
    color: '#a855f7',
  },
]

type Tab = 'timeline' | 'paradigms' | 'principles'

export function JSPhilosophyViz() {
  const [activeTab, setActiveTab] = useState<Tab>('timeline')
  const [activeParadigm, setActiveParadigm] = useState(0)
  const [activePrinciple, setActivePrinciple] = useState(0)

  return (
    <div className="flex flex-col gap-[var(--spacing-lg)]">
      {/* Tab selector */}
      <div className="flex gap-[var(--spacing-sm)] justify-center bg-[var(--color-black-30)] border border-[var(--color-white-8)] rounded-full p-[0.35rem] max-sm:flex-wrap">
        <button
          className={`px-[var(--spacing-lg)] py-[var(--spacing-sm)] text-sm font-medium rounded-full transition-all duration-150 cursor-pointer
            ${activeTab === 'timeline' 
              ? 'bg-[var(--color-neon-viz-18)] border border-[var(--color-neon-viz-70)] text-[var(--color-text-bright)] shadow-[var(--glow-xl)_var(--color-neon-viz-25)]' 
              : 'bg-[var(--color-white-4)] border border-[var(--color-white-8)] text-[var(--color-gray-500)] hover:bg-[var(--color-white-8)] hover:text-[var(--color-gray-300)]'
            }`}
          onClick={() => setActiveTab('timeline')}
        >
          History
        </button>
        <button
          className={`px-[var(--spacing-lg)] py-[var(--spacing-sm)] text-sm font-medium rounded-full transition-all duration-150 cursor-pointer
            ${activeTab === 'paradigms' 
              ? 'bg-[var(--color-neon-viz-18)] border border-[var(--color-neon-viz-70)] text-[var(--color-text-bright)] shadow-[var(--glow-xl)_var(--color-neon-viz-25)]' 
              : 'bg-[var(--color-white-4)] border border-[var(--color-white-8)] text-[var(--color-gray-500)] hover:bg-[var(--color-white-8)] hover:text-[var(--color-gray-300)]'
            }`}
          onClick={() => setActiveTab('paradigms')}
        >
          Multi-Paradigm
        </button>
        <button
          className={`px-[var(--spacing-lg)] py-[var(--spacing-sm)] text-sm font-medium rounded-full transition-all duration-150 cursor-pointer
            ${activeTab === 'principles' 
              ? 'bg-[var(--color-neon-viz-18)] border border-[var(--color-neon-viz-70)] text-[var(--color-text-bright)] shadow-[var(--glow-xl)_var(--color-neon-viz-25)]' 
              : 'bg-[var(--color-white-4)] border border-[var(--color-white-8)] text-[var(--color-gray-500)] hover:bg-[var(--color-white-8)] hover:text-[var(--color-gray-300)]'
            }`}
          onClick={() => setActiveTab('principles')}
        >
          Design Principles
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'timeline' && (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-[var(--spacing-lg)]"
          >
            <div className="relative pl-8">
              <div className="absolute left-2 top-2 bottom-2 w-0.5 rounded-sm" style={{ background: 'linear-gradient(to bottom, var(--color-amber-500), var(--color-emerald-500), var(--color-blue-500), var(--color-brand-primary), var(--color-brand-secondary))' }} />
              {timeline.map((event, i) => (
                <motion.div
                  key={event.year}
                  className="relative py-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="absolute -left-[1.65rem] top-4 w-[var(--spacing-md)] h-[var(--spacing-md)] rounded-full shadow-[0_0_8px_currentColor]" style={{ background: event.color }} />
                  <div className="bg-[var(--color-black-30)] border border-[var(--color-white-8)] rounded-lg px-[var(--spacing-lg)] py-[var(--spacing-md)]">
                    <span className="font-mono text-base font-semibold" style={{ color: event.color }}>
                      {event.year}
                    </span>
                    <h3 className="text-base font-semibold text-white m-1">{event.title}</h3>
                    <p className="text-sm text-[var(--color-gray-500)] m-0">{event.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex items-start gap-[var(--spacing-sm)] px-[var(--spacing-lg)] py-[var(--spacing-md)] rounded-lg bg-[var(--color-amber-10)] border border-[var(--color-amber-30)] text-sm text-[var(--difficulty-2)]">
              <span className="text-base">&#x1F4A1;</span>
              JavaScript was created in just 10 days, which explains some of its quirks.
              But its flexibility made it the language of the web!
            </div>
          </motion.div>
        )}

        {activeTab === 'paradigms' && (
          <motion.div
            key="paradigms"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-[var(--spacing-lg)]"
          >
            <div className="flex gap-[var(--spacing-sm)] justify-center flex-wrap">
              {paradigms.map((p, i) => (
                <button
                  key={p.id}
                  className={`flex items-center gap-1.5 px-[var(--spacing-lg)] py-[var(--spacing-sm)] text-sm font-medium rounded-lg transition-all duration-150 cursor-pointer
                    ${activeParadigm === i 
                      ? 'text-white' 
                      : 'bg-[var(--color-white-4)] border-2 border-transparent text-[var(--color-gray-500)] hover:bg-[var(--color-white-8)] hover:text-[var(--color-gray-300)]'
                    }`}
                  style={{
                    borderColor: activeParadigm === i ? p.color : 'transparent',
                    background: activeParadigm === i ? `${p.color}15` : activeParadigm === i ? undefined : 'var(--color-white-4)'
                  }}
                  onClick={() => setActiveParadigm(i)}
                >
                  <span className="w-[var(--spacing-sm)] h-[var(--spacing-sm)] rounded-full" style={{ background: p.color }} />
                  {p.name}
                </button>
              ))}
            </div>

            <div className="flex justify-center">
              <div 
                className="bg-[var(--color-black-40)] border-2 rounded-xl p-[var(--spacing-lg)] max-w-[400px] w-full"
                style={{ borderColor: paradigms[activeParadigm].color }}
              >
                <h3 className="text-base font-semibold m-0 mb-1" style={{ color: paradigms[activeParadigm].color }}>
                  {paradigms[activeParadigm].name}
                </h3>
                <p className="text-sm text-[var(--color-gray-500)] m-0 mb-3">{paradigms[activeParadigm].description}</p>
                <pre className="bg-[var(--color-black-40)] rounded-lg p-[var(--spacing-md)] m-0 overflow-x-auto">
                  <code className="font-mono text-xs text-[var(--color-gray-300)] whitespace-pre">{paradigms[activeParadigm].code}</code>
                </pre>
              </div>
            </div>

            <div className="flex items-start gap-[var(--spacing-sm)] px-[var(--spacing-lg)] py-[var(--spacing-md)] rounded-lg bg-[var(--color-amber-10)] border border-[var(--color-amber-30)] text-sm text-[var(--difficulty-2)]">
              <span className="text-base">&#x1F4A1;</span>
              JS doesn&apos;t force you into one style - mix and match paradigms as needed!
            </div>
          </motion.div>
        )}

        {activeTab === 'principles' && (
          <motion.div
            key="principles"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-[var(--spacing-lg)]"
          >
            <div className="grid grid-cols-4 gap-[var(--spacing-sm)] max-sm:grid-cols-2">
              {principles.map((p, i) => (
                <motion.button
                  key={p.id}
                  className={`flex flex-col items-center gap-[var(--spacing-sm)] p-[var(--spacing-md)] bg-[var(--color-black-30)] border-2 rounded-lg cursor-pointer transition-all duration-150
                    ${activePrinciple === i 
                      ? 'bg-[var(--color-white-8)]' 
                      : 'border-[var(--color-white-10)] hover:bg-[var(--color-white-5)]'
                    }`}
                  style={{ borderColor: activePrinciple === i ? p.color : 'rgba(255,255,255,0.1)' }}
                  onClick={() => setActivePrinciple(i)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                  <span className="text-xs font-medium text-[var(--color-gray-300)] text-center">{p.title}</span>
                </motion.button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activePrinciple}
                className="bg-[var(--color-black-40)] border-2 rounded-xl p-[var(--spacing-lg)] text-center"
                style={{ borderColor: principles[activePrinciple].color }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <h3 className="text-base font-semibold m-0 mb-2" style={{ color: principles[activePrinciple].color }}>
                  {principles[activePrinciple].title}
                </h3>
                <p className="text-base text-[var(--color-gray-400)] m-0 mb-3">{principles[activePrinciple].description}</p>
                <code className="block font-mono text-sm text-[var(--difficulty-1)] bg-[var(--color-black-40)] px-[var(--spacing-lg)] py-[var(--spacing-sm)] rounded-md">
                  {principles[activePrinciple].example}
                </code>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-start gap-[var(--spacing-sm)] px-[var(--spacing-lg)] py-[var(--spacing-md)] rounded-lg bg-[var(--color-amber-10)] border border-[var(--color-amber-30)] text-sm text-[var(--difficulty-2)]">
              <span className="text-base">&#x1F4A1;</span>
              These design choices prioritize flexibility and &quot;just works&quot; behavior for the web.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
