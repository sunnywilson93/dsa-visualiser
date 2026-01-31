'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { clsx, type ClassValue } from 'clsx'

// Utility for cleaner tailwind class merging
function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

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
    color: 'var(--color-action-success)',
    calculate: () => 1,
    example: 'Array access by index'
  },
  {
    id: 'ologn',
    name: 'O(log n)',
    label: 'Logarithmic',
    color: 'var(--color-action-access)',
    calculate: (n) => Math.log2(n) || 1,
    example: 'Binary search'
  },
  {
    id: 'on',
    name: 'O(n)',
    label: 'Linear',
    color: 'var(--color-action-search)',
    calculate: (n) => n,
    example: 'Loop through array'
  },
  {
    id: 'onlogn',
    name: 'O(n log n)',
    label: 'Linearithmic',
    color: 'var(--color-action-compare)',
    calculate: (n) => n * Math.log2(n) || n,
    example: 'Merge sort, Quick sort'
  },
  {
    id: 'on2',
    name: 'O(n²)',
    label: 'Quadratic',
    color: 'var(--color-action-error)',
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
    <div className="flex flex-col gap-5">
      {/* Scale toggle */}
      <div className="flex items-center justify-center gap-2">
        <span className="text-xs text-gray-500 uppercase tracking-wider">Y-Axis Scale:</span>
        <button
          className={cn(
            'px-3 py-1.5 text-sm font-semibold bg-white/5 border border-white/10 rounded-md text-gray-500 transition-all duration-200 hover:bg-white/10 hover:text-gray-300',
            useLogScale && 'bg-[var(--color-brand-primary-20)] border-[var(--color-brand-primary-50)] text-cyan-200 shadow-[0_0_8px_var(--color-brand-primary-20)]'
          )}
          onClick={() => setUseLogScale(true)}
        >
          Log
        </button>
        <button
          className={cn(
            'px-3 py-1.5 text-sm font-semibold bg-white/5 border border-white/10 rounded-md text-gray-500 transition-all duration-200 hover:bg-white/10 hover:text-gray-300',
            !useLogScale && 'bg-[var(--color-brand-primary-20)] border-[var(--color-brand-primary-50)] text-cyan-200 shadow-[0_0_8px_var(--color-brand-primary-20)]'
          )}
          onClick={() => setUseLogScale(false)}
        >
          Linear
        </button>
      </div>

      {/* Complexity toggles */}
      <div className="flex flex-wrap gap-2">
        {complexities.map(c => (
          <button
            key={c.id}
            className={cn(
              'flex items-center gap-2 px-4 py-2 bg-white/5 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-white/8',
              activeComplexities.has(c.id) ? '' : 'border-transparent'
            )}
            onClick={() => toggleComplexity(c.id)}
            style={{
              borderColor: activeComplexities.has(c.id) ? c.color : 'transparent',
              background: activeComplexities.has(c.id) ? `${c.color}15` : 'rgba(255,255,255,0.05)'
            }}
          >
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
            <span className="font-mono text-base font-semibold text-white">{c.name}</span>
            <span className="text-xs text-gray-500">{c.label}</span>
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="relative bg-black/30 rounded-lg p-4">
        <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 origin-left text-xs text-gray-700 uppercase tracking-wider">
          <span>Operations {useLogScale && '(log scale)'}</span>
        </div>
        <svg className="w-full h-[200px] bg-black/20 rounded-lg" viewBox={`0 0 ${CHART_WIDTH} ${MAX_HEIGHT}`}>
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
        <div className="text-center mt-2 text-xs text-gray-700 uppercase tracking-wider">
          <span>Input Size (n)</span>
        </div>
      </div>

      {/* Input size slider */}
      <div className="flex flex-col items-center gap-4 p-4 bg-black/20 rounded-lg">
        <div className="flex items-center gap-1">
          <span className="text-base text-gray-500">Input Size: n = </span>
          <motion.span
            key={inputSize}
            className="font-mono text-2xl font-bold text-[var(--color-brand-primary)] min-w-12"
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
          className="w-full max-w-[400px] h-1.5 appearance-none bg-white/10 rounded outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-[var(--color-brand-primary)] [&::-webkit-slider-thumb]:to-[var(--color-brand-secondary)] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_2px_10px_var(--color-brand-primary-40)]"
          disabled={isAnimating}
        />
        <button
          className="px-6 py-2.5 text-base font-medium bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] border-none rounded-md text-white cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_15px_var(--color-brand-primary-40)] disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={handleAnimate}
          disabled={isAnimating}
        >
          {isAnimating ? 'Animating...' : '▶ Animate Growth'}
        </button>
      </div>

      {/* Operations table */}
      <div className="bg-black/30 rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider bg-[var(--color-brand-primary-10)] border-b border-white/5">Complexity</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider bg-[var(--color-brand-primary-10)] border-b border-white/5">Operations (n={inputSize})</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider bg-[var(--color-brand-primary-10)] border-b border-white/5">Example</th>
            </tr>
          </thead>
          <tbody>
            {complexities.filter(c => activeComplexities.has(c.id)).map(c => {
              const ops = Math.round(c.calculate(inputSize))
              return (
                <tr key={c.id} className="border-b border-white/5 last:border-b-0 hover:bg-white/5">
                  <td className="p-4">
                    <span className="font-mono text-base font-semibold" style={{ color: c.color }}>
                      {c.name}
                    </span>
                  </td>
                  <td className="p-4">
                    <motion.span
                      key={`${c.id}-${inputSize}`}
                      className="font-mono text-base font-semibold"
                      initial={{ scale: 1.1, color: 'var(--color-action-search)' }}
                      animate={{ scale: 1, color: '#fff' }}
                    >
                      {ops.toLocaleString()}
                    </motion.span>
                  </td>
                  <td className="p-4 text-base text-gray-500 hidden sm:table-cell">{c.example}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Insight */}
      <div className="p-4 bg-[var(--color-brand-primary-10)] border border-[var(--color-brand-primary-20)] rounded-lg text-base text-gray-300 leading-normal">
        <strong className="text-cyan-200">Key Insight:</strong> As n grows, the difference between complexities becomes dramatic.
        At n=50: O(1)=1, O(n)=50, but O(n²)=2,500 operations!
        {useLogScale && <span className="text-base text-gray-500 italic"> (Switch to Linear scale to see the true magnitude difference)</span>}
      </div>
    </div>
  )
}
