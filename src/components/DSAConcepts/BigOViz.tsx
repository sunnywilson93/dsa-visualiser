'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import styles from './BigOViz.module.css'

interface Complexity {
  id: string
  name: string
  label: string
  color: string
  calculate: (n: number) => number
  example: string
}

const complexities: Complexity[] = [
  {
    id: 'o1',
    name: 'O(1)',
    label: 'Constant',
    color: '#10b981',
    calculate: () => 1,
    example: 'Array access by index'
  },
  {
    id: 'ologn',
    name: 'O(log n)',
    label: 'Logarithmic',
    color: '#60a5fa',
    calculate: (n) => Math.log2(n) || 1,
    example: 'Binary search'
  },
  {
    id: 'on',
    name: 'O(n)',
    label: 'Linear',
    color: '#f59e0b',
    calculate: (n) => n,
    example: 'Loop through array'
  },
  {
    id: 'onlogn',
    name: 'O(n log n)',
    label: 'Linearithmic',
    color: '#8b5cf6',
    calculate: (n) => n * Math.log2(n) || n,
    example: 'Merge sort, Quick sort'
  },
  {
    id: 'on2',
    name: 'O(n²)',
    label: 'Quadratic',
    color: '#ef4444',
    calculate: (n) => n * n,
    example: 'Nested loops'
  },
]

const MAX_HEIGHT = 200
const CHART_WIDTH = 400

export function BigOViz() {
  const [inputSize, setInputSize] = useState(10)
  const [activeComplexities, setActiveComplexities] = useState<Set<string>>(
    new Set(['o1', 'ologn', 'on', 'onlogn', 'on2'])
  )
  const [isAnimating, setIsAnimating] = useState(false)
  const [useLogScale, setUseLogScale] = useState(true)

  const toggleComplexity = (id: string) => {
    setActiveComplexities(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const handleAnimate = () => {
    setIsAnimating(true)
    setInputSize(1)
    let n = 1
    const interval = setInterval(() => {
      n += 1
      setInputSize(n)
      if (n >= 50) {
        clearInterval(interval)
        setIsAnimating(false)
      }
    }, 80)
  }

  // Generate points for each complexity
  const generatePoints = (complexity: Complexity) => {
    const points: string[] = []
    const numPoints = 50

    // Get all values at n=50 for the active complexities to determine scale
    const activeValues = complexities
      .filter(c => activeComplexities.has(c.id))
      .map(c => c.calculate(50))

    const maxValue = Math.max(...activeValues)
    const minValue = Math.min(...activeValues.filter(v => v > 0))

    for (let i = 1; i <= Math.min(inputSize, numPoints); i++) {
      const x = (i / numPoints) * CHART_WIDTH
      const value = complexity.calculate(i)

      let y: number
      if (useLogScale) {
        // Log scale: map log(value) to chart height
        // This spreads out the curves so all are visible
        const logMax = Math.log(maxValue + 1)
        const logMin = Math.log(minValue > 0 ? minValue : 1)
        const logValue = Math.log(value + 1)
        const normalizedLog = (logValue - logMin) / (logMax - logMin || 1)
        y = MAX_HEIGHT - (normalizedLog * MAX_HEIGHT * 0.9) - 10 // Leave some padding
      } else {
        // Linear scale: direct mapping
        const scaleFactor = MAX_HEIGHT / (maxValue || 1)
        y = MAX_HEIGHT - (value * scaleFactor)
      }

      points.push(`${x},${Math.max(5, Math.min(MAX_HEIGHT - 5, y))}`)
    }
    return points.join(' ')
  }

  return (
    <div className={styles.container}>
      {/* Scale toggle */}
      <div className={styles.scaleToggle}>
        <span className={styles.scaleLabel}>Y-Axis Scale:</span>
        <button
          className={`${styles.scaleBtn} ${useLogScale ? styles.active : ''}`}
          onClick={() => setUseLogScale(true)}
        >
          Log
        </button>
        <button
          className={`${styles.scaleBtn} ${!useLogScale ? styles.active : ''}`}
          onClick={() => setUseLogScale(false)}
        >
          Linear
        </button>
      </div>

      {/* Complexity toggles */}
      <div className={styles.toggles}>
        {complexities.map(c => (
          <button
            key={c.id}
            className={`${styles.toggle} ${activeComplexities.has(c.id) ? styles.active : ''}`}
            onClick={() => toggleComplexity(c.id)}
            style={{
              borderColor: activeComplexities.has(c.id) ? c.color : 'transparent',
              background: activeComplexities.has(c.id) ? `${c.color}15` : 'rgba(255,255,255,0.05)'
            }}
          >
            <span className={styles.toggleDot} style={{ background: c.color }} />
            <span className={styles.toggleName}>{c.name}</span>
            <span className={styles.toggleLabel}>{c.label}</span>
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className={styles.chartContainer}>
        <div className={styles.chartLabels}>
          <span>Operations {useLogScale && '(log scale)'}</span>
        </div>
        <svg className={styles.chart} viewBox={`0 0 ${CHART_WIDTH} ${MAX_HEIGHT}`}>
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Complexity curves */}
          {complexities.filter(c => activeComplexities.has(c.id)).map(c => (
            <motion.polyline
              key={`${c.id}-${useLogScale}`}
              points={generatePoints(c)}
              fill="none"
              stroke={c.color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5 }}
            />
          ))}
        </svg>
        <div className={styles.chartXLabel}>
          <span>Input Size (n)</span>
        </div>
      </div>

      {/* Input size slider */}
      <div className={styles.sliderSection}>
        <div className={styles.sliderHeader}>
          <span className={styles.sliderLabel}>Input Size: n = </span>
          <motion.span
            key={inputSize}
            className={styles.sliderValue}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
          >
            {inputSize}
          </motion.span>
        </div>
        <input
          type="range"
          min="1"
          max="50"
          value={inputSize}
          onChange={(e) => setInputSize(Number(e.target.value))}
          className={styles.slider}
          disabled={isAnimating}
        />
        <button
          className={styles.animateBtn}
          onClick={handleAnimate}
          disabled={isAnimating}
        >
          {isAnimating ? 'Animating...' : '▶ Animate Growth'}
        </button>
      </div>

      {/* Operations table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Complexity</th>
              <th>Operations (n={inputSize})</th>
              <th>Example</th>
            </tr>
          </thead>
          <tbody>
            {complexities.filter(c => activeComplexities.has(c.id)).map(c => {
              const ops = Math.round(c.calculate(inputSize))
              return (
                <tr key={c.id}>
                  <td>
                    <span className={styles.complexityName} style={{ color: c.color }}>
                      {c.name}
                    </span>
                  </td>
                  <td>
                    <motion.span
                      key={`${c.id}-${inputSize}`}
                      className={styles.opsValue}
                      initial={{ scale: 1.1, color: '#f59e0b' }}
                      animate={{ scale: 1, color: '#fff' }}
                    >
                      {ops.toLocaleString()}
                    </motion.span>
                  </td>
                  <td className={styles.exampleCell}>{c.example}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Insight */}
      <div className={styles.insight}>
        <strong>Key Insight:</strong> As n grows, the difference between complexities becomes dramatic.
        At n=50: O(1)=1, O(n)=50, but O(n²)=2,500 operations!
        {useLogScale && <span className={styles.insightNote}> (Switch to Linear scale to see the true magnitude difference)</span>}
      </div>
    </div>
  )
}
