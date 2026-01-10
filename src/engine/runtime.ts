import type {
  RuntimeValue,
  PrimitiveValue,
  ArrayValue,
  ObjectValue,
  FunctionValue,
  NullValue,
  UndefinedValue,
} from '@/types'

let heapIdCounter = 0

/**
 * Create a primitive runtime value
 */
export function createPrimitive(value: number | string | boolean): PrimitiveValue {
  let dataType: 'number' | 'string' | 'boolean'

  if (typeof value === 'number') dataType = 'number'
  else if (typeof value === 'string') dataType = 'string'
  else dataType = 'boolean'

  return { type: 'primitive', dataType, value }
}

/**
 * Create an array runtime value
 */
export function createArray(elements: RuntimeValue[]): ArrayValue {
  const id = `arr_${++heapIdCounter}`
  return {
    type: 'array',
    id,
    elements: [...elements],
    heapAddress: `0x${heapIdCounter.toString(16).padStart(4, '0')}`,
  }
}

/**
 * Create an object runtime value
 */
export function createObject(properties: Record<string, RuntimeValue>): ObjectValue {
  const id = `obj_${++heapIdCounter}`
  return {
    type: 'object',
    id,
    properties: { ...properties },
    heapAddress: `0x${heapIdCounter.toString(16).padStart(4, '0')}`,
  }
}

/**
 * Create a function runtime value
 */
export function createFunction(
  name: string,
  params: string[],
  body: unknown,
  closure: unknown[]
): FunctionValue {
  return {
    type: 'function',
    name,
    params,
    body: body as FunctionValue['body'],
    closure: closure as FunctionValue['closure'],
  }
}

/**
 * Create null value
 */
export function createNull(): NullValue {
  return { type: 'null' }
}

/**
 * Create undefined value
 */
export function createUndefined(): UndefinedValue {
  return { type: 'undefined' }
}

/**
 * Deep clone a runtime value for state capture
 */
export function cloneValue(value: RuntimeValue): RuntimeValue {
  switch (value.type) {
    case 'primitive':
    case 'null':
    case 'undefined':
      return { ...value }

    case 'array':
      return {
        ...value,
        elements: value.elements.map(cloneValue),
      }

    case 'object':
      const clonedProps: Record<string, RuntimeValue> = {}
      for (const [key, val] of Object.entries(value.properties)) {
        clonedProps[key] = cloneValue(val)
      }
      return { ...value, properties: clonedProps }

    case 'function':
      return { ...value }

    default:
      return value
  }
}

/**
 * Convert a JavaScript value to a RuntimeValue
 */
export function toRuntimeValue(jsValue: unknown): RuntimeValue {
  if (jsValue === null) return createNull()
  if (jsValue === undefined) return createUndefined()

  if (typeof jsValue === 'number' || typeof jsValue === 'string' || typeof jsValue === 'boolean') {
    return createPrimitive(jsValue)
  }

  if (Array.isArray(jsValue)) {
    return createArray(jsValue.map(toRuntimeValue))
  }

  if (typeof jsValue === 'object') {
    const props: Record<string, RuntimeValue> = {}
    for (const [key, val] of Object.entries(jsValue)) {
      props[key] = toRuntimeValue(val)
    }
    return createObject(props)
  }

  return createUndefined()
}

/**
 * Convert a RuntimeValue to a JavaScript value for display
 */
export function toJSValue(runtimeValue: RuntimeValue): unknown {
  switch (runtimeValue.type) {
    case 'primitive':
      return runtimeValue.value
    case 'null':
      return null
    case 'undefined':
      return undefined
    case 'array':
      return runtimeValue.elements.map(toJSValue)
    case 'object':
      const result: Record<string, unknown> = {}
      for (const [key, val] of Object.entries(runtimeValue.properties)) {
        result[key] = toJSValue(val)
      }
      return result
    case 'function':
      return `[Function: ${runtimeValue.name}]`
    default:
      return undefined
  }
}

/**
 * Format a runtime value for display
 */
export function formatValue(value: RuntimeValue, compact = false): string {
  switch (value.type) {
    case 'primitive':
      if (value.dataType === 'string') {
        return compact ? `"${value.value}"` : `"${value.value}"`
      }
      return String(value.value)

    case 'null':
      return 'null'

    case 'undefined':
      return 'undefined'

    case 'array':
      if (compact && value.elements.length > 3) {
        const preview = value.elements.slice(0, 3).map(e => formatValue(e, true)).join(', ')
        return `[${preview}, ...]`
      }
      return `[${value.elements.map(e => formatValue(e, true)).join(', ')}]`

    case 'object':
      const entries = Object.entries(value.properties)
      if (compact && entries.length > 2) {
        const preview = entries.slice(0, 2).map(([k, v]) => `${k}: ${formatValue(v, true)}`).join(', ')
        return `{${preview}, ...}`
      }
      return `{${entries.map(([k, v]) => `${k}: ${formatValue(v, true)}`).join(', ')}}`

    case 'function':
      return `ƒ ${value.name}()`

    default:
      return 'unknown'
  }
}

/**
 * Check if two runtime values are equal
 */
export function valuesEqual(a: RuntimeValue, b: RuntimeValue): boolean {
  if (a.type !== b.type) return false

  switch (a.type) {
    case 'primitive':
      return a.value === (b as PrimitiveValue).value

    case 'null':
    case 'undefined':
      return true

    case 'array':
      return a.id === (b as ArrayValue).id

    case 'object':
      return a.id === (b as ObjectValue).id

    case 'function':
      return a.name === (b as FunctionValue).name

    default:
      return false
  }
}

/**
 * Get the truthiness of a runtime value
 */
export function isTruthy(value: RuntimeValue): boolean {
  switch (value.type) {
    case 'primitive':
      return Boolean(value.value)
    case 'null':
    case 'undefined':
      return false
    case 'array':
    case 'object':
    case 'function':
      return true
    default:
      return false
  }
}

/**
 * Reset heap ID counter (for testing)
 */
export function resetHeapCounter(): void {
  heapIdCounter = 0
}
