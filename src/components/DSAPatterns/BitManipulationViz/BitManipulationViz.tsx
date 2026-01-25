import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CodePanel, StepProgress, StepControls } from '@/components/SharedViz'
import styles from './BitManipulationViz.module.css'

type Level = 'beginner' | 'intermediate' | 'advanced'
type Variant = 'xor-tricks' | 'bit-masks' | 'shift-operations'
type Phase = 'read-value' | 'show-binary' | 'apply-operation' | 'show-result' | 'done'

interface BitStep {
  id: number
  codeLine: number
  description: string
  phase: Phase
  numbers: BinaryNumber[]
  operator?: '&' | '|' | '^' | '<<' | '>>' | '~'
  result?: number
  activeBits?: number[]
  bitWidth: 4 | 8 | 16 | 32
  decision?: {
    condition: string
    conditionMet: boolean
    action: string
  }
  output?: string[]
}

interface BinaryNumber {
  label: string
  value: number
}

interface BitExample {
  id: string
  title: string
  variant: Variant
  code: string[]
  steps: BitStep[]
  insight: string
}

const levelInfo: Record<Level, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: '#10b981' },
  intermediate: { label: 'Intermediate', color: '#f59e0b' },
  advanced: { label: 'Advanced', color: '#ef4444' }
}

const variantInfo: Record<Variant, { label: string; description: string }> = {
  'xor-tricks': {
    label: 'XOR Tricks',
    description: 'Use XOR properties to find unique elements'
  },
  'bit-masks': {
    label: 'Bit Masks',
    description: 'Check, set, or clear specific bits'
  },
  'shift-operations': {
    label: 'Shift Operations',
    description: 'Multiply/divide by powers of 2'
  }
}

function toBinary(num: number, bits: number): string {
  if (num < 0) {
    return (num >>> 0).toString(2).slice(-bits).padStart(bits, '1')
  }
  return num.toString(2).padStart(bits, '0')
}

function getOperatorSymbol(op: string): string {
  const ops: Record<string, string> = {
    '&': 'AND',
    '|': 'OR',
    '^': 'XOR',
    '<<': 'LEFT SHIFT',
    '>>': 'RIGHT SHIFT',
    '~': 'NOT'
  }
  return ops[op] || op
}

const examples: Record<Variant, Record<Level, BitExample[]>> = {
  'xor-tricks': {
    beginner: [],
    intermediate: [],
    advanced: []
  },
  'bit-masks': {
    beginner: [],
    intermediate: [],
    advanced: []
  },
  'shift-operations': {
    beginner: [],
    intermediate: [],
    advanced: []
  }
}

export function BitManipulationViz() {
  const [variant, setVariant] = useState<Variant>('xor-tricks')
  const [level, setLevel] = useState<Level>('beginner')
  const [exampleIndex, setExampleIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)

  const currentExamples = examples[variant][level]
  const hasExamples = currentExamples.length > 0
  const currentExample = hasExamples ? currentExamples[exampleIndex] : null
  const currentStep = currentExample ? currentExample.steps[stepIndex] : null

  const handleVariantChange = (newVariant: Variant) => {
    setVariant(newVariant)
    setLevel('beginner')
    setExampleIndex(0)
    setStepIndex(0)
  }

  const handleLevelChange = (newLevel: Level) => {
    setLevel(newLevel)
    setExampleIndex(0)
    setStepIndex(0)
  }

  const handleExampleChange = (index: number) => {
    setExampleIndex(index)
    setStepIndex(0)
  }

  const renderBitRow = (
    label: string,
    value: number,
    bitWidth: 4 | 8 | 16 | 32,
    activeBits: number[] = [],
    isResult: boolean = false
  ) => {
    const binaryStr = toBinary(value, bitWidth)

    return (
      <div className={`${styles.bitRow} ${isResult ? styles.resultRow : ''}`}>
        <div className={styles.rowLabel}>{label}</div>
        <div className={styles.decimal}>{value}</div>
        <span className={styles.equals}>=</span>
        <div className={styles.bits}>
          {binaryStr.split('').map((bit, i) => {
            const bitPosition = bitWidth - 1 - i
            const isActive = activeBits.includes(bitPosition)
            const isOne = bit === '1'

            return (
              <motion.div
                key={i}
                className={`${styles.bit} ${isOne ? styles.one : styles.zero} ${isActive ? styles.active : ''} ${styles[`width${bitWidth}`]}`}
                initial={isResult ? { scale: 0.8, opacity: 0 } : false}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: isResult ? i * 0.05 : 0 }}
              >
                {bit}
              </motion.div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderBitPositions = (bitWidth: 4 | 8 | 16 | 32, activeBits: number[] = []) => (
    <div className={styles.bitPositions}>
      <div className={styles.bitPositionsSpacer} />
      <div className={styles.bitPositionsRow}>
        {Array.from({ length: bitWidth }, (_, i) => bitWidth - 1 - i).map((pos) => (
          <span
            key={pos}
            className={`${styles.bitPosition} ${activeBits.includes(pos) ? styles.activeBitPos : ''} ${styles[`width${bitWidth}`]}`}
          >
            {pos}
          </span>
        ))}
      </div>
    </div>
  )

  return (
    <div className={styles.container}>
      <div className={styles.variantSelector}>
        {(Object.keys(variantInfo) as Variant[]).map(v => (
          <button
            key={v}
            className={`${styles.variantBtn} ${variant === v ? styles.activeVariant : ''}`}
            onClick={() => handleVariantChange(v)}
            title={variantInfo[v].description}
          >
            {variantInfo[v].label}
          </button>
        ))}
      </div>

      <div className={styles.levelSelector}>
        {(Object.keys(levelInfo) as Level[]).map(lvl => (
          <button
            key={lvl}
            className={`${styles.levelBtn} ${level === lvl ? styles.activeLevel : ''}`}
            onClick={() => handleLevelChange(lvl)}
            disabled={examples[variant][lvl].length === 0}
            style={{
              borderColor: level === lvl ? levelInfo[lvl].color : 'transparent',
              background: level === lvl ? `${levelInfo[lvl].color}15` : 'transparent'
            }}
          >
            <span className={styles.levelDot} style={{ background: levelInfo[lvl].color }} />
            {levelInfo[lvl].label}
          </button>
        ))}
      </div>

      {hasExamples && currentExamples.length > 1 && (
        <div className={styles.exampleTabs}>
          {currentExamples.map((ex, i) => (
            <button
              key={ex.id}
              className={`${styles.exampleTab} ${exampleIndex === i ? styles.activeTab : ''}`}
              onClick={() => handleExampleChange(i)}
            >
              {ex.title}
            </button>
          ))}
        </div>
      )}

      {!hasExamples ? (
        <div className={styles.emptyState}>
          <p>Examples coming soon for {variantInfo[variant].label} - {levelInfo[level].label}.</p>
        </div>
      ) : currentExample && currentStep && (
        <>
          <div className={styles.mainGrid}>
            <CodePanel
              code={currentExample.code}
              highlightedLine={currentStep.codeLine}
              title="Code"
            />

            <div className={styles.vizPanel}>
              <AnimatePresence mode="wait">
                {currentStep.decision && (
                  <motion.div
                    key={`decision-${currentStep.id}`}
                    className={styles.decisionPanel}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className={styles.decisionQuestion}>{currentStep.decision.condition}</span>
                    <span className={`${styles.decisionAnswer} ${currentStep.decision.conditionMet ? styles.conditionTrue : styles.conditionFalse}`}>
                      {currentStep.decision.conditionMet ? 'Yes' : 'No'} {'\u2192'} {currentStep.decision.action}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {currentStep.operator && (
                  <motion.div
                    key={`operator-${currentStep.id}`}
                    className={styles.operatorBadge}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    {getOperatorSymbol(currentStep.operator)}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className={styles.bitGrid}>
                <div className={styles.bitWidthBadge}>{currentStep.bitWidth}-bit</div>

                {currentStep.numbers.map((num, i) => (
                  <div key={i}>
                    {renderBitRow(num.label, num.value, currentStep.bitWidth, currentStep.activeBits)}
                    {i < currentStep.numbers.length - 1 && currentStep.operator && (
                      <div className={styles.operatorRow}>
                        <span className={styles.operatorSymbol}>{currentStep.operator}</span>
                      </div>
                    )}
                  </div>
                ))}

                {currentStep.result !== undefined && (
                  <>
                    <div className={styles.divider} />
                    {renderBitRow('result', currentStep.result, currentStep.bitWidth, currentStep.activeBits, true)}
                  </>
                )}

                {renderBitPositions(currentStep.bitWidth, currentStep.activeBits)}
              </div>

              {currentStep.output && currentStep.output.length > 0 && (
                <div className={styles.outputBox}>
                  <div className={styles.outputHeader}>Output</div>
                  <div className={styles.outputContent}>
                    {currentStep.output.map((line, i) => (
                      <motion.div
                        key={i}
                        className={styles.outputLine}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        {line}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <StepProgress
            current={stepIndex}
            total={currentExample.steps.length}
            description={currentStep.description}
          />

          <StepControls
            onPrev={() => setStepIndex(s => s - 1)}
            onNext={() => setStepIndex(s => s + 1)}
            onReset={() => setStepIndex(0)}
            canPrev={stepIndex > 0}
            canNext={stepIndex < currentExample.steps.length - 1}
          />

          <div className={styles.insightBox}>
            <span className={styles.insightLabel}>Key Insight:</span>
            {currentExample.insight}
          </div>
        </>
      )}
    </div>
  )
}
