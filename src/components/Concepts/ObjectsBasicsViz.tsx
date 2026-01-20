import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './ObjectsBasicsViz.module.css'

type Tab = 'access' | 'methods' | 'destructure'

interface Property {
  key: string
  value: string
}

const person: Property[] = [
  { key: 'name', value: '"Alice"' },
  { key: 'age', value: '25' },
  { key: 'city', value: '"NYC"' },
]

export function ObjectsBasicsViz() {
  const [activeTab, setActiveTab] = useState<Tab>('access')
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [accessType, setAccessType] = useState<'dot' | 'bracket'>('dot')

  return (
    <div className={styles.container}>
      {/* Tab selector */}
      <div className={styles.tabSelector}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'access' ? styles.active : ''}`}
          onClick={() => { setActiveTab('access'); setSelectedKey(null) }}
        >
          Accessing
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'methods' ? styles.active : ''}`}
          onClick={() => setActiveTab('methods')}
        >
          Object Methods
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'destructure' ? styles.active : ''}`}
          onClick={() => setActiveTab('destructure')}
        >
          Destructuring
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'access' && (
          <motion.div
            key="access"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={styles.content}
          >
            {/* Object visualization */}
            <div className={styles.objectViz}>
              <div className={styles.objectLabel}>const person = &#123;</div>
              <div className={styles.propertiesGrid}>
                {person.map(prop => (
                  <motion.button
                    key={prop.key}
                    className={`${styles.property} ${selectedKey === prop.key ? styles.active : ''}`}
                    onClick={() => setSelectedKey(prop.key)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className={styles.propKey}>{prop.key}:</span>
                    <span className={styles.propValue}>{prop.value}</span>
                  </motion.button>
                ))}
              </div>
              <div className={styles.objectLabel}>&#125;</div>
            </div>

            {/* Access type toggle */}
            <div className={styles.accessToggle}>
              <button
                className={`${styles.toggleBtn} ${accessType === 'dot' ? styles.active : ''}`}
                onClick={() => setAccessType('dot')}
              >
                Dot Notation
              </button>
              <button
                className={`${styles.toggleBtn} ${accessType === 'bracket' ? styles.active : ''}`}
                onClick={() => setAccessType('bracket')}
              >
                Bracket Notation
              </button>
            </div>

            {selectedKey && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={styles.accessResult}
              >
                <code className={styles.accessCode}>
                  {accessType === 'dot' ? `person.${selectedKey}` : `person["${selectedKey}"]`}
                </code>
                <span className={styles.accessArrow}>→</span>
                <code className={styles.accessValue}>
                  {person.find(p => p.key === selectedKey)?.value}
                </code>
              </motion.div>
            )}

            <div className={styles.tip}>
              {accessType === 'dot'
                ? 'Dot notation is preferred when you know the property name.'
                : 'Bracket notation works with variables and special characters.'}
            </div>
          </motion.div>
        )}

        {activeTab === 'methods' && (
          <motion.div
            key="methods"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={styles.content}
          >
            <div className={styles.methodsGrid}>
              <div className={styles.methodCard}>
                <h4 className={styles.methodTitle}>Object.keys()</h4>
                <code className={styles.methodCode}>Object.keys(person)</code>
                <div className={styles.methodResult}>
                  <span className={styles.resultLabel}>Returns:</span>
                  <code className={styles.resultValue}>[&quot;name&quot;, &quot;age&quot;, &quot;city&quot;]</code>
                </div>
              </div>

              <div className={styles.methodCard}>
                <h4 className={styles.methodTitle}>Object.values()</h4>
                <code className={styles.methodCode}>Object.values(person)</code>
                <div className={styles.methodResult}>
                  <span className={styles.resultLabel}>Returns:</span>
                  <code className={styles.resultValue}>[&quot;Alice&quot;, 25, &quot;NYC&quot;]</code>
                </div>
              </div>

              <div className={styles.methodCard}>
                <h4 className={styles.methodTitle}>Object.entries()</h4>
                <code className={styles.methodCode}>Object.entries(person)</code>
                <div className={styles.methodResult}>
                  <span className={styles.resultLabel}>Returns:</span>
                  <code className={styles.resultValue}>[[&quot;name&quot;, &quot;Alice&quot;], ...]</code>
                </div>
              </div>

              <div className={styles.methodCard}>
                <h4 className={styles.methodTitle}>&quot;key&quot; in obj</h4>
                <code className={styles.methodCode}>&quot;name&quot; in person</code>
                <div className={styles.methodResult}>
                  <span className={styles.resultLabel}>Returns:</span>
                  <code className={styles.resultValue}>true</code>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'destructure' && (
          <motion.div
            key="destructure"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={styles.content}
          >
            <div className={styles.destructureExamples}>
              <div className={styles.destructureCard}>
                <h4>Basic Destructuring</h4>
                <pre className={styles.destructureCode}>
{`const { name, age } = person;
// name = "Alice"
// age = 25`}
                </pre>
              </div>

              <div className={styles.destructureCard}>
                <h4>Rename Variables</h4>
                <pre className={styles.destructureCode}>
{`const { name: userName } = person;
// userName = "Alice"`}
                </pre>
              </div>

              <div className={styles.destructureCard}>
                <h4>Default Values</h4>
                <pre className={styles.destructureCode}>
{`const { job = "Unknown" } = person;
// job = "Unknown" (doesn't exist)`}
                </pre>
              </div>

              <div className={styles.destructureCard}>
                <h4>Rest Operator</h4>
                <pre className={styles.destructureCode}>
{`const { name, ...rest } = person;
// rest = { age: 25, city: "NYC" }`}
                </pre>
              </div>
            </div>

            <div className={styles.tip}>
              Destructuring extracts properties into variables in one line!
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
