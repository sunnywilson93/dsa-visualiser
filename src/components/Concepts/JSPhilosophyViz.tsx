import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './JSPhilosophyViz.module.css'

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
    <div className={styles.container}>
      {/* Tab selector */}
      <div className={styles.tabSelector}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'timeline' ? styles.active : ''}`}
          onClick={() => setActiveTab('timeline')}
        >
          History
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'paradigms' ? styles.active : ''}`}
          onClick={() => setActiveTab('paradigms')}
        >
          Multi-Paradigm
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'principles' ? styles.active : ''}`}
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
            className={styles.timelineContainer}
          >
            <div className={styles.timeline}>
              {timeline.map((event, i) => (
                <motion.div
                  key={event.year}
                  className={styles.timelineEvent}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className={styles.timelineDot} style={{ background: event.color }} />
                  <div className={styles.timelineContent}>
                    <span className={styles.timelineYear} style={{ color: event.color }}>
                      {event.year}
                    </span>
                    <h3 className={styles.timelineTitle}>{event.title}</h3>
                    <p className={styles.timelineDesc}>{event.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className={styles.insight}>
              <span className={styles.insightIcon}>&#x1F4A1;</span>
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
            className={styles.paradigmsContainer}
          >
            <div className={styles.paradigmSelector}>
              {paradigms.map((p, i) => (
                <button
                  key={p.id}
                  className={`${styles.paradigmBtn} ${activeParadigm === i ? styles.active : ''}`}
                  style={{
                    borderColor: activeParadigm === i ? p.color : 'transparent',
                    background: activeParadigm === i ? `${p.color}15` : 'transparent'
                  }}
                  onClick={() => setActiveParadigm(i)}
                >
                  <span className={styles.paradigmDot} style={{ background: p.color }} />
                  {p.name}
                </button>
              ))}
            </div>

            <div className={styles.paradigmContent}>
              <div
                className={styles.paradigmCard}
                style={{ borderColor: paradigms[activeParadigm].color }}
              >
                <h3 style={{ color: paradigms[activeParadigm].color }}>
                  {paradigms[activeParadigm].name}
                </h3>
                <p>{paradigms[activeParadigm].description}</p>
                <pre className={styles.paradigmCode}>
                  <code>{paradigms[activeParadigm].code}</code>
                </pre>
              </div>
            </div>

            <div className={styles.insight}>
              <span className={styles.insightIcon}>&#x1F4A1;</span>
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
            className={styles.principlesContainer}
          >
            <div className={styles.principleGrid}>
              {principles.map((p, i) => (
                <motion.button
                  key={p.id}
                  className={`${styles.principleCard} ${activePrinciple === i ? styles.active : ''}`}
                  style={{
                    borderColor: activePrinciple === i ? p.color : 'rgba(255,255,255,0.1)',
                  }}
                  onClick={() => setActivePrinciple(i)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className={styles.principleIcon} style={{ background: p.color }} />
                  <span className={styles.principleTitle}>{p.title}</span>
                </motion.button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activePrinciple}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={styles.principleDetail}
                style={{ borderColor: principles[activePrinciple].color }}
              >
                <h3 style={{ color: principles[activePrinciple].color }}>
                  {principles[activePrinciple].title}
                </h3>
                <p>{principles[activePrinciple].description}</p>
                <code className={styles.principleExample}>
                  {principles[activePrinciple].example}
                </code>
              </motion.div>
            </AnimatePresence>

            <div className={styles.insight}>
              <span className={styles.insightIcon}>&#x1F4A1;</span>
              These design choices prioritize flexibility and &quot;just works&quot; behavior for the web.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
