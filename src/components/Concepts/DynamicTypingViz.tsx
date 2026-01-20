import { useState } from 'react'
import styles from './DynamicTypingViz.module.css'

type ValueType = 'number' | 'string' | 'boolean' | 'object' | 'array' | 'null' | 'undefined' | 'function'

interface ValueOption {
  id: string
  label: string
  value: string
  type: ValueType
  actualValue: unknown
}

const valueOptions: ValueOption[] = [
  { id: 'num-42', label: '42', value: '42', type: 'number', actualValue: 42 },
  { id: 'num-3.14', label: '3.14', value: '3.14', type: 'number', actualValue: 3.14 },
  { id: 'str-hello', label: '"hello"', value: '"hello"', type: 'string', actualValue: 'hello' },
  { id: 'str-empty', label: '""', value: '""', type: 'string', actualValue: '' },
  { id: 'bool-true', label: 'true', value: 'true', type: 'boolean', actualValue: true },
  { id: 'bool-false', label: 'false', value: 'false', type: 'boolean', actualValue: false },
  { id: 'obj', label: '{ x: 1 }', value: '{ x: 1 }', type: 'object', actualValue: { x: 1 } },
  { id: 'arr', label: '[1, 2, 3]', value: '[1, 2, 3]', type: 'array', actualValue: [1, 2, 3] },
  { id: 'null', label: 'null', value: 'null', type: 'null', actualValue: null },
  { id: 'undefined', label: 'undefined', value: 'undefined', type: 'undefined', actualValue: undefined },
  { id: 'func', label: '() => {}', value: '() => {}', type: 'function', actualValue: () => {} },
]

const typeColors: Record<ValueType, string> = {
  number: '#f59e0b',
  string: '#10b981',
  boolean: '#8b5cf6',
  object: '#3b82f6',
  array: '#06b6d4',
  null: '#6b7280',
  undefined: '#6b7280',
  function: '#ec4899',
}

const typeDescriptions: Record<ValueType, string> = {
  number: 'Numeric value (integers, floats, NaN, Infinity)',
  string: 'Text enclosed in quotes',
  boolean: 'Logical true or false',
  object: 'Key-value pairs enclosed in braces',
  array: 'Ordered list of values',
  null: 'Intentional absence of value',
  undefined: 'Variable declared but not assigned',
  function: 'Callable code block',
}

interface HistoryEntry {
  step: number
  value: string
  type: ValueType
}

export function DynamicTypingViz(): JSX.Element {
  const [history, setHistory] = useState<HistoryEntry[]>([
    { step: 1, value: '42', type: 'number' },
  ])
  const [selectedId, setSelectedId] = useState<string>('num-42')

  const currentEntry = history[history.length - 1]
  const selectedOption = valueOptions.find((v) => v.id === selectedId) ?? valueOptions[0]

  const handleAssign = () => {
    if (selectedOption.value === currentEntry.value) return

    setHistory([
      ...history,
      {
        step: history.length + 1,
        value: selectedOption.value,
        type: selectedOption.type,
      },
    ])
  }

  const handleReset = () => {
    setHistory([{ step: 1, value: '42', type: 'number' }])
    setSelectedId('num-42')
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Dynamic Typing Playground</h3>
        <p className={styles.subtitle}>
          Watch how a single variable can hold any type in JavaScript
        </p>
      </div>

      <div className={styles.mainGrid}>
        {/* Variable Display */}
        <div className={`${styles.neonBox} ${styles.variableBox}`}>
          <div className={styles.neonBoxHeader}>Current Variable</div>
          <div className={styles.neonBoxInner}>
            <div className={styles.variableDisplay}>
              <span className={styles.varKeyword}>let</span>
              <span className={styles.varName}>myVar</span>
              <span className={styles.varEquals}>=</span>
              <span
                className={styles.varValue}
                style={{ color: typeColors[currentEntry.type] }}
              >
                {currentEntry.value}
              </span>
            </div>
            <div className={styles.typeInfo}>
              <span
                className={styles.typeBadge}
                style={{ backgroundColor: `${typeColors[currentEntry.type]}22`, color: typeColors[currentEntry.type] }}
              >
                typeof myVar === "{currentEntry.type === 'array' ? 'object' : currentEntry.type === 'null' ? 'object' : currentEntry.type}"
              </span>
              <span className={styles.typeDesc}>{typeDescriptions[currentEntry.type]}</span>
            </div>
          </div>
        </div>

        {/* Assignment Panel */}
        <div className={`${styles.neonBox} ${styles.assignBox}`}>
          <div className={styles.neonBoxHeader}>Reassign Variable</div>
          <div className={styles.neonBoxInner}>
            <div className={styles.valueGrid}>
              {valueOptions.map((option) => (
                <button
                  key={option.id}
                  className={`${styles.valueBtn} ${selectedId === option.id ? styles.valueBtnActive : ''}`}
                  style={{
                    '--type-color': typeColors[option.type],
                  } as React.CSSProperties}
                  onClick={() => setSelectedId(option.id)}
                  type="button"
                >
                  <span className={styles.valueLabel}>{option.label}</span>
                  <span className={styles.valueType}>{option.type}</span>
                </button>
              ))}
            </div>
            <div className={styles.actions}>
              <button
                className={styles.assignBtn}
                onClick={handleAssign}
                disabled={selectedOption.value === currentEntry.value}
                type="button"
              >
                myVar = {selectedOption.value}
              </button>
              <button
                className={styles.resetBtn}
                onClick={handleReset}
                type="button"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Type History Timeline */}
      <div className={`${styles.neonBox} ${styles.historyBox}`}>
        <div className={styles.neonBoxHeader}>Type History</div>
        <div className={styles.neonBoxInner}>
          <div className={styles.timeline}>
            {history.map((entry, index) => (
              <div key={index} className={styles.timelineItem}>
                <div
                  className={styles.timelineDot}
                  style={{ backgroundColor: typeColors[entry.type] }}
                />
                <div className={styles.timelineContent}>
                  <span className={styles.timelineStep}>Step {entry.step}</span>
                  <span
                    className={styles.timelineValue}
                    style={{ color: typeColors[entry.type] }}
                  >
                    {entry.value}
                  </span>
                  <span className={styles.timelineType}>{entry.type}</span>
                </div>
                {index < history.length - 1 && <div className={styles.timelineLine} />}
              </div>
            ))}
          </div>
          {history.length > 1 && (
            <div className={styles.insight}>
              <span className={styles.insightIcon}>*</span>
              <span>
                Same variable, {history.length} different types! In static languages like Java or C++, this would be a compile error.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Comparison Panel */}
      <div className={styles.comparisonGrid}>
        <div className={`${styles.neonBox} ${styles.dynamicBox}`}>
          <div className={styles.neonBoxHeader}>JavaScript (Dynamic)</div>
          <div className={styles.neonBoxInner}>
            <pre className={styles.codeBlock}>
{`let value = 42;     // OK
value = "hello";    // OK
value = [1, 2, 3];  // OK
// Types determined at runtime`}
            </pre>
          </div>
        </div>
        <div className={`${styles.neonBox} ${styles.staticBox}`}>
          <div className={styles.neonBoxHeader}>Java/C++ (Static)</div>
          <div className={styles.neonBoxInner}>
            <pre className={styles.codeBlock}>
{`int value = 42;     // OK
value = "hello";    // ERROR!
value = [1, 2, 3];  // ERROR!
// Types checked at compile time`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
