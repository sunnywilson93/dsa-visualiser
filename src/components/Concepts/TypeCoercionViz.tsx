import { useMemo, useState } from 'react'
import styles from './TypeCoercionViz.module.css'

type Primitive = string | number | boolean | null | undefined
type Operator = '+' | '-' | '==' | '===' | '||' | '&&'

interface ValueOption {
  id: string
  label: string
  value: Primitive
}

interface OperatorOption {
  id: Operator
  label: string
  description: string
}

interface Evaluation {
  value: Primitive
  display: string
  typeLabel: string
  explanation: string[]
  leftType: string
  rightType: string
  leftTruthy: boolean
  rightTruthy: boolean
}

const valueOptions: ValueOption[] = [
  { id: 'num-7', label: '7', value: 7 },
  { id: 'str-7', label: '"7"', value: '7' },
  { id: 'num-0', label: '0', value: 0 },
  { id: 'str-empty', label: '""', value: '' },
  { id: 'bool-true', label: 'true', value: true },
  { id: 'bool-false', label: 'false', value: false },
  { id: 'null', label: 'null', value: null },
  { id: 'undefined', label: 'undefined', value: undefined },
]

const operatorOptions: OperatorOption[] = [
  { id: '+', label: '+', description: 'concat or add' },
  { id: '-', label: '-', description: 'numeric only' },
  { id: '==', label: '==', description: 'loose equality' },
  { id: '===', label: '===', description: 'strict equality' },
  { id: '||', label: '||', description: 'first truthy' },
  { id: '&&', label: '&&', description: 'first falsy' },
]

const getTypeLabel = (value: Primitive): string => {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  return typeof value
}

const formatValue = (value: Primitive): string => {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  if (typeof value === 'string') return `"${value}"`
  if (typeof value === 'number' && Number.isNaN(value)) return 'NaN'
  return String(value)
}

const toNumber = (value: Primitive): number => Number(value)

const isTruthy = (value: Primitive): boolean => Boolean(value)

const evaluate = (left: Primitive, operator: Operator, right: Primitive): Evaluation => {
  const leftType = getTypeLabel(left)
  const rightType = getTypeLabel(right)
  const leftTruthy = isTruthy(left)
  const rightTruthy = isTruthy(right)
  const explanation: string[] = []
  let value: Primitive = undefined

  switch (operator) {
    case '+': {
      const isConcat = typeof left === 'string' || typeof right === 'string'
      if (isConcat) {
        value = String(left) + String(right)
        explanation.push('String concatenation: at least one operand is a string')
        explanation.push(`Left -> ${formatValue(String(left))}, right -> ${formatValue(String(right))}`)
      } else {
        const leftNumber = toNumber(left)
        const rightNumber = toNumber(right)
        value = leftNumber + rightNumber
        explanation.push('Numeric addition: both operands converted to numbers')
        explanation.push(`Number(left) = ${formatValue(leftNumber)}, Number(right) = ${formatValue(rightNumber)}`)
      }
      break
    }
    case '-': {
      const leftNumber = toNumber(left)
      const rightNumber = toNumber(right)
      value = leftNumber - rightNumber
      explanation.push('Numeric operator: operands converted to numbers')
      explanation.push(`Number(left) = ${formatValue(leftNumber)}, Number(right) = ${formatValue(rightNumber)}`)
      break
    }
    case '==': {
      value = left == right
      if (leftType === rightType) {
        explanation.push('Same type: values compared directly')
      } else if ((left === null && right === undefined) || (left === undefined && right === null)) {
        explanation.push('Special case: null and undefined are loosely equal to each other')
        explanation.push('They are not equal to any other type with ==')
      } else if (left === null || left === undefined || right === null || right === undefined) {
        explanation.push(`null/undefined only equals null or undefined with ==`)
        explanation.push(`Comparing to ${leftType === 'null' || leftType === 'undefined' ? rightType : leftType} returns false`)
      } else if (leftType === 'number' && rightType === 'string') {
        explanation.push('Number == String: string is coerced to number')
        explanation.push(`"${right}" → Number("${right}") = ${Number(right)}`)
        explanation.push(`Then ${left} == ${Number(right)} is compared`)
      } else if (leftType === 'string' && rightType === 'number') {
        explanation.push('String == Number: string is coerced to number')
        explanation.push(`"${left}" → Number("${left}") = ${Number(left)}`)
        explanation.push(`Then ${Number(left)} == ${right} is compared`)
      } else if (leftType === 'boolean') {
        explanation.push('Boolean == other: boolean is coerced to number first')
        explanation.push(`${left} → Number(${left}) = ${Number(left)}`)
        if (rightType === 'string') {
          explanation.push(`Then ${Number(left)} == "${right}" triggers string→number: ${Number(right)}`)
        } else {
          explanation.push(`Then ${Number(left)} == ${formatValue(right)} is compared`)
        }
      } else if (rightType === 'boolean') {
        explanation.push('Other == Boolean: boolean is coerced to number first')
        explanation.push(`${right} → Number(${right}) = ${Number(right)}`)
        if (leftType === 'string') {
          explanation.push(`Then "${left}" == ${Number(right)} triggers string→number: ${Number(left)}`)
        } else {
          explanation.push(`Then ${formatValue(left)} == ${Number(right)} is compared`)
        }
      } else {
        explanation.push('Loose equality: types are coerced before comparison')
      }
      break
    }
    case '===': {
      value = left === right
      explanation.push('Strict equality: no type coercion')
      explanation.push(leftType === rightType ? 'Same type: compare values' : 'Different types: always false')
      break
    }
    case '||': {
      value = left || right
      explanation.push('Logical OR uses truthiness and returns the first truthy operand')
      explanation.push(leftTruthy ? 'Left is truthy, so result is left' : 'Left is falsy, so result is right')
      break
    }
    case '&&': {
      value = left && right
      explanation.push('Logical AND uses truthiness and returns the first falsy operand')
      explanation.push(leftTruthy ? 'Left is truthy, so result is right' : 'Left is falsy, so result is left')
      break
    }
    default: {
      break
    }
  }

  return {
    value,
    display: formatValue(value),
    typeLabel: getTypeLabel(value),
    explanation,
    leftType,
    rightType,
    leftTruthy,
    rightTruthy,
  }
}

const getOptionById = (id: string): ValueOption => {
  return valueOptions.find((option) => option.id === id) ?? valueOptions[0]
}

export function TypeCoercionViz(): JSX.Element {
  const [leftId, setLeftId] = useState<string>(valueOptions[0].id)
  const [rightId, setRightId] = useState<string>(valueOptions[1].id)
  const [operator, setOperator] = useState<Operator>('==')

  const leftOption: ValueOption = getOptionById(leftId)
  const rightOption: ValueOption = getOptionById(rightId)

  const evaluation: Evaluation = useMemo(
    () => evaluate(leftOption.value, operator, rightOption.value),
    [leftOption.value, operator, rightOption.value]
  )

  const showTruthiness: boolean = operator === '||' || operator === '&&'

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Type Coercion Lab</h3>
        <p className={styles.subtitle}>
          Pick values and operators to see how JavaScript converts types.
        </p>
      </div>

      <div className={styles.controls}>
        <div className={styles.controlGroup}>
          <div className={styles.groupTitle}>Left value</div>
          <div className={styles.optionsGrid}>
            {valueOptions.map((option: ValueOption) => (
              <button
                key={option.id}
                className={`${styles.optionBtn} ${leftId === option.id ? styles.optionBtnActive : ''}`}
                onClick={() => setLeftId(option.id)}
                type="button"
              >
                <span className={styles.optionLabel}>{option.label}</span>
                <span className={styles.optionType}>{getTypeLabel(option.value)}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.controlGroup}>
          <div className={styles.groupTitle}>Operator</div>
          <div className={styles.operatorGrid}>
            {operatorOptions.map((option: OperatorOption) => (
              <button
                key={option.id}
                className={`${styles.optionBtn} ${operator === option.id ? styles.optionBtnActive : ''}`}
                onClick={() => setOperator(option.id)}
                type="button"
              >
                <span className={styles.optionLabel}>{option.label}</span>
                <span className={styles.optionType}>{option.description}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.controlGroup}>
          <div className={styles.groupTitle}>Right value</div>
          <div className={styles.optionsGrid}>
            {valueOptions.map((option: ValueOption) => (
              <button
                key={option.id}
                className={`${styles.optionBtn} ${rightId === option.id ? styles.optionBtnActive : ''}`}
                onClick={() => setRightId(option.id)}
                type="button"
              >
                <span className={styles.optionLabel}>{option.label}</span>
                <span className={styles.optionType}>{getTypeLabel(option.value)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.resultGrid}>
        {/* Result - Neon Box */}
        <div className={`${styles.neonBox} ${styles.equationBox}`}>
          <div className={styles.neonBoxHeader}>Result</div>
          <div className={styles.neonBoxInner}>
            <div className={styles.equationLine}>
              <span className={styles.valueChip}>{leftOption.label}</span>
              <span className={styles.operatorChip}>{operator}</span>
              <span className={styles.valueChip}>{rightOption.label}</span>
              <span className={styles.equals}>=</span>
              <span className={styles.resultValue}>{evaluation.display}</span>
            </div>
            <div className={styles.typeRow}>
              <span className={styles.typeBadge}>{evaluation.leftType}</span>
              <span className={styles.typeBadge}>{evaluation.rightType}</span>
              <span className={styles.typeBadgeAccent}>{evaluation.typeLabel}</span>
            </div>
            {showTruthiness && (
              <div className={styles.truthinessRow}>
                <span>Left is {evaluation.leftTruthy ? 'truthy' : 'falsy'}</span>
                <span>Right is {evaluation.rightTruthy ? 'truthy' : 'falsy'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Explanation - Neon Box */}
        <div className={`${styles.neonBox} ${styles.explainBox}`}>
          <div className={styles.neonBoxHeader}>What JS Does</div>
          <div className={styles.neonBoxInner}>
            <ul className={styles.explainList}>
              {evaluation.explanation.map((note: string, index: number) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
