import type { Node, Program } from 'acorn'
import type {
  ExecutionStep,
  StackFrame,
  RuntimeValue,
  Scope,
  ScopeChain,
  StepType,
} from '@/types'
import { getNodeLocation } from './parser'
import {
  createPrimitive,
  createArray,
  createObject,
  createFunction,
  createNull,
  createUndefined,
  cloneValue,
  isTruthy,
  formatValue,
} from './runtime'

const MAX_STEPS = 10000
const MAX_CALL_DEPTH = 100

interface InterpreterState {
  steps: ExecutionStep[]
  callStack: StackFrame[]
  scopes: ScopeChain
  globalScope: Scope
  stepId: number
  frameId: number
  consoleOutput: string[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ASTNode = Node & Record<string, any>

/**
 * Convert an AST node back to readable source code representation
 */
function nodeToSource(node: ASTNode): string {
  switch (node.type) {
    case 'Identifier':
      return node.name || ''

    case 'Literal':
      if (typeof node.value === 'string') return `"${node.value}"`
      return String(node.value)

    case 'MemberExpression': {
      const obj = nodeToSource(node.object)
      const prop = nodeToSource(node.property)
      return node.computed ? `${obj}[${prop}]` : `${obj}.${prop}`
    }

    case 'BinaryExpression':
    case 'LogicalExpression':
      return `${nodeToSource(node.left)} ${node.operator} ${nodeToSource(node.right)}`

    case 'UnaryExpression':
      return `${node.operator}${nodeToSource(node.argument)}`

    case 'UpdateExpression':
      return node.prefix
        ? `${node.operator}${nodeToSource(node.argument)}`
        : `${nodeToSource(node.argument)}${node.operator}`

    case 'CallExpression': {
      const callee = nodeToSource(node.callee)
      const args = (node.arguments || []).map((a: ASTNode) => nodeToSource(a)).join(', ')
      return `${callee}(${args})`
    }

    case 'AssignmentExpression':
      return `${nodeToSource(node.left)} ${node.operator} ${nodeToSource(node.right)}`

    case 'ArrayExpression': {
      const elements = (node.elements || []).map((e: ASTNode | null) => e ? nodeToSource(e) : '').join(', ')
      return `[${elements}]`
    }

    case 'ConditionalExpression':
      return `${nodeToSource(node.test)} ? ${nodeToSource(node.consequent)} : ${nodeToSource(node.alternate)}`

    default:
      return node.type
  }
}

export class Interpreter {
  private state: InterpreterState
  private builtins: Map<string, (...args: RuntimeValue[]) => RuntimeValue>

  constructor() {
    this.state = this.createInitialState()
    this.builtins = this.createBuiltins()
  }

  private createInitialState(): InterpreterState {
    const globalScope: Scope = {
      id: 'global',
      type: 'global',
      name: 'Global',
      variables: {},
    }

    return {
      steps: [],
      callStack: [],
      scopes: [globalScope],
      globalScope,
      stepId: 0,
      frameId: 0,
      consoleOutput: [],
    }
  }

  private createBuiltins(): Map<string, (...args: RuntimeValue[]) => RuntimeValue> {
    const builtins = new Map<string, (...args: RuntimeValue[]) => RuntimeValue>()

    // console.log - we'll capture this specially
    builtins.set('console.log', (...args) => {
      const output = args.map(a => formatValue(a)).join(' ')
      this.state.consoleOutput.push(output)
      return createUndefined()
    })

    // Array methods
    builtins.set('Array.isArray', (arg) => {
      return createPrimitive(arg.type === 'array')
    })

    // Math functions
    builtins.set('Math.floor', (arg) => {
      if (arg.type === 'primitive' && arg.dataType === 'number') {
        return createPrimitive(Math.floor(arg.value as number))
      }
      return createPrimitive(NaN)
    })

    builtins.set('Math.ceil', (arg) => {
      if (arg.type === 'primitive' && arg.dataType === 'number') {
        return createPrimitive(Math.ceil(arg.value as number))
      }
      return createPrimitive(NaN)
    })

    builtins.set('Math.abs', (arg) => {
      if (arg.type === 'primitive' && arg.dataType === 'number') {
        return createPrimitive(Math.abs(arg.value as number))
      }
      return createPrimitive(NaN)
    })

    builtins.set('Math.min', (...args) => {
      const nums = args
        .filter(a => a.type === 'primitive' && a.dataType === 'number')
        .map(a => (a as { value: number }).value)
      return createPrimitive(Math.min(...nums))
    })

    builtins.set('Math.max', (...args) => {
      const nums = args
        .filter(a => a.type === 'primitive' && a.dataType === 'number')
        .map(a => (a as { value: number }).value)
      return createPrimitive(Math.max(...nums))
    })

    return builtins
  }

  /**
   * Execute the entire program and collect all steps
   */
  execute(ast: Program): ExecutionStep[] {
    this.state = this.createInitialState()

    try {
      // First pass: collect function declarations
      for (const node of ast.body) {
        if (node.type === 'FunctionDeclaration') {
          this.declareFunctionHoisted(node as ASTNode)
        }
      }

      // Second pass: execute statements
      for (const node of ast.body) {
        if (this.state.steps.length >= MAX_STEPS) {
          throw new Error(`Maximum step limit (${MAX_STEPS}) exceeded`)
        }
        this.executeNode(node as ASTNode)
      }
    } catch (error) {
      // Record the error as a final step
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      this.recordStep(ast as ASTNode, 'expression', `Error: ${errorMessage}`)
    }

    return this.state.steps
  }

  private declareFunctionHoisted(node: ASTNode): void {
    if (!node.id?.name) return

    const func = createFunction(
      node.id.name,
      (node.params || []).map((p: { name: string }) => p.name),
      node.body!,
      [...this.state.scopes]
    )

    this.setVariable(node.id.name, func)
  }

  private executeNode(node: ASTNode): RuntimeValue {
    switch (node.type) {
      case 'Program':
        return this.executeProgram(node)
      case 'VariableDeclaration':
        return this.executeVariableDeclaration(node)
      case 'FunctionDeclaration':
        return this.executeFunctionDeclaration(node)
      case 'ExpressionStatement':
        return this.executeExpressionStatement(node)
      case 'ReturnStatement':
        return this.executeReturnStatement(node)
      case 'IfStatement':
        return this.executeIfStatement(node)
      case 'ForStatement':
        return this.executeForStatement(node)
      case 'WhileStatement':
        return this.executeWhileStatement(node)
      case 'BlockStatement':
        return this.executeBlockStatement(node)
      case 'CallExpression':
        return this.executeCallExpression(node)
      case 'AssignmentExpression':
        return this.executeAssignmentExpression(node)
      case 'BinaryExpression':
        return this.executeBinaryExpression(node)
      case 'LogicalExpression':
        return this.executeLogicalExpression(node)
      case 'UnaryExpression':
        return this.executeUnaryExpression(node)
      case 'UpdateExpression':
        return this.executeUpdateExpression(node)
      case 'MemberExpression':
        return this.executeMemberExpression(node)
      case 'ArrayExpression':
        return this.executeArrayExpression(node)
      case 'ObjectExpression':
        return this.executeObjectExpression(node)
      case 'Identifier':
        return this.executeIdentifier(node)
      case 'Literal':
        return this.executeLiteral(node)
      case 'ConditionalExpression':
        return this.executeConditionalExpression(node)
      default:
        return createUndefined()
    }
  }

  private executeProgram(node: ASTNode): RuntimeValue {
    const body = node.body as ASTNode[]
    let result: RuntimeValue = createUndefined()

    for (const statement of body) {
      result = this.executeNode(statement)
    }

    return result
  }

  private executeVariableDeclaration(node: ASTNode): RuntimeValue {
    for (const decl of node.declarations || []) {
      const name = decl.id.name
      const value = decl.init ? this.executeNode(decl.init as ASTNode) : createUndefined()

      this.setVariable(name, value)
      this.recordStep(node, 'declaration', `Declare ${node.kind} ${name} = ${formatValue(value)}`)
    }

    return createUndefined()
  }

  private executeFunctionDeclaration(node: ASTNode): RuntimeValue {
    // Already hoisted, just record the step
    if (node.id?.name) {
      this.recordStep(node, 'declaration', `Function ${node.id.name} declared`)
    }
    return createUndefined()
  }

  private executeExpressionStatement(node: ASTNode): RuntimeValue {
    return this.executeNode(node.expression as ASTNode)
  }

  private executeReturnStatement(node: ASTNode): RuntimeValue {
    const value = node.argument ? this.executeNode(node.argument as ASTNode) : createUndefined()

    this.recordStep(node, 'return', `Return ${formatValue(value)}`)

    // Set return value on current stack frame
    if (this.state.callStack.length > 0) {
      this.state.callStack[this.state.callStack.length - 1].returnValue = value
    }

    return value
  }

  private executeIfStatement(node: ASTNode): RuntimeValue {
    const testValue = this.executeNode(node.test as ASTNode)
    const condition = isTruthy(testValue)

    this.recordStep(
      node,
      'branch',
      `If condition: ${formatValue(testValue)} → ${condition ? 'true branch' : 'false branch'}`
    )

    if (condition) {
      return this.executeNode(node.consequent as ASTNode)
    } else if (node.alternate) {
      return this.executeNode(node.alternate as ASTNode)
    }

    return createUndefined()
  }

  private executeForStatement(node: ASTNode): RuntimeValue {
    // Create block scope for loop
    this.pushScope('block', 'for-loop')

    // Initialize
    if (node.init) {
      this.executeNode(node.init as ASTNode)
    }

    this.recordStep(node, 'loop-start', 'For loop started')

    let iterations = 0
    const maxIterations = 1000

    while (iterations < maxIterations) {
      // Test condition
      if (node.test) {
        const testValue = this.executeNode(node.test as ASTNode)
        if (!isTruthy(testValue)) {
          this.recordStep(node, 'loop-end', 'For loop condition false, exiting')
          break
        }
      }

      this.recordStep(node, 'loop-iteration', `For loop iteration ${iterations + 1}`)

      // Execute body
      const body = node.body as ASTNode
      if (body.type === 'BlockStatement') {
        const statements = body.body as ASTNode[]
        for (const stmt of statements) {
          this.executeNode(stmt)
        }
      } else {
        this.executeNode(body)
      }

      // Update
      if (node.update) {
        this.executeNode(node.update as ASTNode)
      }

      iterations++
    }

    this.popScope()

    if (iterations >= maxIterations) {
      throw new Error('Maximum loop iterations exceeded')
    }

    return createUndefined()
  }

  private executeWhileStatement(node: ASTNode): RuntimeValue {
    this.recordStep(node, 'loop-start', 'While loop started')

    let iterations = 0
    const maxIterations = 1000

    while (iterations < maxIterations) {
      const testValue = this.executeNode(node.test as ASTNode)
      if (!isTruthy(testValue)) {
        this.recordStep(node, 'loop-end', 'While loop condition false, exiting')
        break
      }

      this.recordStep(node, 'loop-iteration', `While loop iteration ${iterations + 1}`)

      this.executeNode(node.body as ASTNode)
      iterations++
    }

    if (iterations >= maxIterations) {
      throw new Error('Maximum loop iterations exceeded')
    }

    return createUndefined()
  }

  private executeBlockStatement(node: ASTNode): RuntimeValue {
    this.pushScope('block', 'block')

    let result: RuntimeValue = createUndefined()
    const statements = node.body as ASTNode[]

    for (const stmt of statements) {
      result = this.executeNode(stmt)
    }

    this.popScope()
    return result
  }

  private executeCallExpression(node: ASTNode): RuntimeValue {
    const callee = node.callee as ASTNode

    // Check for console.log
    if (
      callee.type === 'MemberExpression' &&
      (callee.object as ASTNode).type === 'Identifier' &&
      ((callee.object as ASTNode).name === 'console') &&
      (callee.property as ASTNode).name === 'log'
    ) {
      const args = (node.arguments || []).map((arg: ASTNode) => this.executeNode(arg))
      const output = args.map((a: RuntimeValue) => formatValue(a)).join(' ')
      this.state.consoleOutput.push(output)
      this.recordStep(node, 'call', `console.log(${output})`)
      return createUndefined()
    }

    // Check for Math methods
    if (
      callee.type === 'MemberExpression' &&
      (callee.object as ASTNode).type === 'Identifier' &&
      ((callee.object as ASTNode).name === 'Math')
    ) {
      const methodName = (callee.property as ASTNode).name
      const builtin = this.builtins.get(`Math.${methodName}`)
      if (builtin) {
        const args = (node.arguments || []).map((arg: ASTNode) => this.executeNode(arg))
        return builtin(...args)
      }
    }

    // Regular function call
    const func = this.executeNode(callee)

    if (func.type !== 'function') {
      throw new Error(`${formatValue(func)} is not a function`)
    }

    const args = (node.arguments || []).map((arg: ASTNode) => this.executeNode(arg))

    // Check call depth
    if (this.state.callStack.length >= MAX_CALL_DEPTH) {
      throw new Error('Maximum call stack size exceeded')
    }

    // Create stack frame
    const frame: StackFrame = {
      id: `frame_${++this.state.frameId}`,
      name: func.name,
      params: {},
      locals: {},
      callSite: getNodeLocation(node),
      startLine: getNodeLocation(func.body).line,
      depth: this.state.callStack.length,
    }

    // Bind parameters
    for (let i = 0; i < func.params.length; i++) {
      frame.params[func.params[i]] = args[i] ?? createUndefined()
    }

    this.state.callStack.push(frame)
    this.recordStep(
      node,
      'call',
      `Call ${func.name}(${args.map((a: RuntimeValue) => formatValue(a)).join(', ')})`
    )

    // Create function scope with parameters
    this.pushScope('function', func.name)
    for (const [name, value] of Object.entries(frame.params)) {
      this.setVariable(name, value)
    }

    // Execute function body
    let result: RuntimeValue = createUndefined()
    const body = func.body as ASTNode

    if (body.type === 'BlockStatement') {
      const statements = body.body as ASTNode[]
      for (const stmt of statements) {
        result = this.executeNode(stmt)
        // Check if we hit a return
        if (frame.returnValue !== undefined) {
          result = frame.returnValue
          break
        }
      }
    } else {
      result = this.executeNode(body)
    }

    // Pop function scope
    this.popScope()

    // Pop stack frame
    this.state.callStack.pop()
    this.recordStep(node, 'return', `Return from ${func.name}: ${formatValue(result)}`)

    return result
  }

  private executeAssignmentExpression(node: ASTNode): RuntimeValue {
    const right = this.executeNode(node.right as ASTNode)
    const left = node.left as ASTNode

    // Get the source representation of the left-hand side
    const leftSource = nodeToSource(left)

    if (left.type === 'Identifier') {
      const name = left.name!
      let value = right

      if (node.operator !== '=') {
        const current = this.getVariable(name)
        value = this.applyCompoundOperator(current, right, node.operator!)
      }

      this.setVariable(name, value)
      this.recordStep(node, 'assignment', `${name} ${node.operator} ${formatValue(value)}`)
      return value
    }

    if (left.type === 'MemberExpression') {
      const obj = this.executeNode(left.object as ASTNode)
      const prop = left.computed
        ? this.executeNode(left.property as ASTNode)
        : createPrimitive((left.property as ASTNode).name!)

      if (obj.type === 'array' && prop.type === 'primitive' && prop.dataType === 'number') {
        const index = prop.value as number
        let value = right

        if (node.operator !== '=') {
          const current = obj.elements[index] ?? createUndefined()
          value = this.applyCompoundOperator(current, right, node.operator!)
        }

        obj.elements[index] = value
        this.recordStep(node, 'array-modify', `${leftSource} = ${formatValue(value)}`)
        return value
      }

      if (obj.type === 'object' && prop.type === 'primitive') {
        const key = String(prop.value)
        let value = right

        if (node.operator !== '=') {
          const current = obj.properties[key] ?? createUndefined()
          value = this.applyCompoundOperator(current, right, node.operator!)
        }

        obj.properties[key] = value
        this.recordStep(node, 'object-modify', `${leftSource} = ${formatValue(value)}`)
        return value
      }
    }

    return right
  }

  private applyCompoundOperator(left: RuntimeValue, right: RuntimeValue, op: string): RuntimeValue {
    if (left.type !== 'primitive' || right.type !== 'primitive') {
      return createUndefined()
    }

    const l = left.value as number
    const r = right.value as number

    switch (op) {
      case '+=': return createPrimitive(l + r)
      case '-=': return createPrimitive(l - r)
      case '*=': return createPrimitive(l * r)
      case '/=': return createPrimitive(l / r)
      case '%=': return createPrimitive(l % r)
      case '**=': return createPrimitive(Math.pow(l, r))
      case '^=': return createPrimitive(l ^ r)
      case '&=': return createPrimitive(l & r)
      case '|=': return createPrimitive(l | r)
      case '<<=': return createPrimitive(l << r)
      case '>>=': return createPrimitive(l >> r)
      case '>>>=': return createPrimitive(l >>> r)
      default: return right
    }
  }

  private executeBinaryExpression(node: ASTNode): RuntimeValue {
    const left = this.executeNode(node.left as ASTNode)
    const right = this.executeNode(node.right as ASTNode)

    const result = this.applyBinaryOperator(left, right, node.operator!)

    // Build descriptive message with variable names
    const sourceExpr = nodeToSource(node)
    const valueExpr = `${formatValue(left)} ${node.operator} ${formatValue(right)}`
    const description = sourceExpr !== valueExpr
      ? `${sourceExpr}: ${valueExpr} → ${formatValue(result)}`
      : `${valueExpr} → ${formatValue(result)}`

    this.recordStep(node, 'comparison', description)

    return result
  }

  private applyBinaryOperator(left: RuntimeValue, right: RuntimeValue, op: string): RuntimeValue {
    // Handle string concatenation
    if (
      op === '+' &&
      left.type === 'primitive' &&
      right.type === 'primitive' &&
      (left.dataType === 'string' || right.dataType === 'string')
    ) {
      return createPrimitive(String(left.value) + String(right.value))
    }

    // Numeric operations
    if (left.type === 'primitive' && right.type === 'primitive') {
      const l = left.value
      const r = right.value

      switch (op) {
        // Arithmetic
        case '+': return createPrimitive((l as number) + (r as number))
        case '-': return createPrimitive((l as number) - (r as number))
        case '*': return createPrimitive((l as number) * (r as number))
        case '/': return createPrimitive((l as number) / (r as number))
        case '%': return createPrimitive((l as number) % (r as number))
        case '**': return createPrimitive(Math.pow(l as number, r as number))
        // Comparison
        case '<': return createPrimitive(l < r)
        case '>': return createPrimitive(l > r)
        case '<=': return createPrimitive(l <= r)
        case '>=': return createPrimitive(l >= r)
        case '==': return createPrimitive(l == r)
        case '===': return createPrimitive(l === r)
        case '!=': return createPrimitive(l != r)
        case '!==': return createPrimitive(l !== r)
        // Bitwise
        case '^': return createPrimitive((l as number) ^ (r as number))
        case '&': return createPrimitive((l as number) & (r as number))
        case '|': return createPrimitive((l as number) | (r as number))
        case '<<': return createPrimitive((l as number) << (r as number))
        case '>>': return createPrimitive((l as number) >> (r as number))
        case '>>>': return createPrimitive((l as number) >>> (r as number))
      }
    }

    return createUndefined()
  }

  private executeLogicalExpression(node: ASTNode): RuntimeValue {
    const left = this.executeNode(node.left as ASTNode)

    if (node.operator === '&&') {
      if (!isTruthy(left)) return left
      return this.executeNode(node.right as ASTNode)
    }

    if (node.operator === '||') {
      if (isTruthy(left)) return left
      return this.executeNode(node.right as ASTNode)
    }

    return createUndefined()
  }

  private executeUnaryExpression(node: ASTNode): RuntimeValue {
    const arg = this.executeNode(node.argument as ASTNode)

    switch (node.operator) {
      case '!':
        return createPrimitive(!isTruthy(arg))
      case '-':
        if (arg.type === 'primitive' && arg.dataType === 'number') {
          return createPrimitive(-(arg.value as number))
        }
        return createPrimitive(NaN)
      case '+':
        if (arg.type === 'primitive' && arg.dataType === 'number') {
          return arg
        }
        return createPrimitive(NaN)
      case '~':
        // Bitwise NOT
        if (arg.type === 'primitive' && arg.dataType === 'number') {
          return createPrimitive(~(arg.value as number))
        }
        return createPrimitive(~0)
      case 'typeof':
        switch (arg.type) {
          case 'primitive': return createPrimitive(arg.dataType)
          case 'null': return createPrimitive('object')
          case 'undefined': return createPrimitive('undefined')
          case 'array': return createPrimitive('object')
          case 'object': return createPrimitive('object')
          case 'function': return createPrimitive('function')
        }
    }

    return createUndefined()
  }

  private executeUpdateExpression(node: ASTNode): RuntimeValue {
    const arg = node.argument as ASTNode

    if (arg.type !== 'Identifier') {
      throw new Error('Invalid update expression')
    }

    const name = arg.name!
    const current = this.getVariable(name)

    if (current.type !== 'primitive' || current.dataType !== 'number') {
      return createPrimitive(NaN)
    }

    const oldValue = current.value as number
    const newValue = node.operator === '++' ? oldValue + 1 : oldValue - 1

    this.setVariable(name, createPrimitive(newValue))

    this.recordStep(
      node,
      'assignment',
      `${name}${node.operator} → ${name} = ${newValue}`
    )

    return createPrimitive(node.prefix ? newValue : oldValue)
  }

  private executeMemberExpression(node: ASTNode): RuntimeValue {
    const obj = this.executeNode(node.object as ASTNode)
    const prop = node.computed
      ? this.executeNode(node.property as ASTNode)
      : createPrimitive((node.property as ASTNode).name!)

    // Array access
    // Get source representation for better descriptions
    const sourceExpr = nodeToSource(node)

    if (obj.type === 'array' && prop.type === 'primitive') {
      if (prop.dataType === 'number') {
        const index = prop.value as number
        const value = obj.elements[index] ?? createUndefined()
        this.recordStep(node, 'array-access', `${sourceExpr} → ${formatValue(value)}`)
        return value
      }
      // Array.length
      if (prop.value === 'length') {
        return createPrimitive(obj.elements.length)
      }
    }

    // Object access
    if (obj.type === 'object' && prop.type === 'primitive') {
      const key = String(prop.value)
      const value = obj.properties[key] ?? createUndefined()
      this.recordStep(node, 'object-access', `${sourceExpr} → ${formatValue(value)}`)
      return value
    }

    return createUndefined()
  }

  private executeArrayExpression(node: ASTNode): RuntimeValue {
    const elements = (node.elements || []).map((el: ASTNode | null) =>
      el ? this.executeNode(el) : createUndefined()
    )

    const arr = createArray(elements)
    this.recordStep(node, 'expression', `Create array: ${formatValue(arr)}`)
    return arr
  }

  private executeObjectExpression(node: ASTNode): RuntimeValue {
    const properties: Record<string, RuntimeValue> = {}

    for (const prop of node.properties || []) {
      const key = prop.key as ASTNode
      const keyName = key.type === 'Identifier' ? key.name! : String((key as ASTNode).value)
      properties[keyName] = this.executeNode(prop.value as ASTNode)
    }

    const obj = createObject(properties)
    this.recordStep(node, 'expression', `Create object: ${formatValue(obj)}`)
    return obj
  }

  private executeIdentifier(node: ASTNode): RuntimeValue {
    return this.getVariable(node.name!)
  }

  private executeLiteral(node: ASTNode): RuntimeValue {
    const value = node.value

    if (value === null) return createNull()
    if (typeof value === 'number') return createPrimitive(value)
    if (typeof value === 'string') return createPrimitive(value)
    if (typeof value === 'boolean') return createPrimitive(value)

    return createUndefined()
  }

  private executeConditionalExpression(node: ASTNode): RuntimeValue {
    const test = this.executeNode(node.test as ASTNode)

    if (isTruthy(test)) {
      return this.executeNode(node.consequent as ASTNode)
    } else {
      return this.executeNode(node.alternate as ASTNode)
    }
  }

  // Scope management
  private pushScope(type: 'function' | 'block', name: string): void {
    const scope: Scope = {
      id: `scope_${this.state.scopes.length}`,
      type,
      name,
      variables: {},
      parent: this.state.scopes[this.state.scopes.length - 1]?.id,
    }
    this.state.scopes.push(scope)
  }

  private popScope(): void {
    if (this.state.scopes.length > 1) {
      this.state.scopes.pop()
    }
  }

  private getVariable(name: string): RuntimeValue {
    // Search from innermost to outermost scope
    for (let i = this.state.scopes.length - 1; i >= 0; i--) {
      const scope = this.state.scopes[i]
      if (name in scope.variables) {
        return scope.variables[name]
      }
    }

    // Check for built-in undefined behavior
    return createUndefined()
  }

  private setVariable(name: string, value: RuntimeValue): void {
    // Check existing scopes first
    for (let i = this.state.scopes.length - 1; i >= 0; i--) {
      if (name in this.state.scopes[i].variables) {
        this.state.scopes[i].variables[name] = value
        return
      }
    }

    // Create in current scope
    const currentScope = this.state.scopes[this.state.scopes.length - 1]
    currentScope.variables[name] = value

    // Also update stack frame locals if in a function
    if (this.state.callStack.length > 0) {
      const frame = this.state.callStack[this.state.callStack.length - 1]
      if (!(name in frame.params)) {
        frame.locals[name] = value
      }
    }
  }

  private recordStep(node: ASTNode, type: StepType, description: string): void {
    if (this.state.steps.length >= MAX_STEPS) {
      return
    }

    const step: ExecutionStep = {
      id: ++this.state.stepId,
      type,
      node,
      location: getNodeLocation(node),
      callStack: this.cloneCallStack(),
      scopes: this.cloneScopes(),
      description,
      consoleOutput: this.state.consoleOutput.length > 0
        ? this.state.consoleOutput[this.state.consoleOutput.length - 1]
        : undefined,
      consoleOutputCount: this.state.consoleOutput.length,
    }

    this.state.steps.push(step)
  }

  private cloneCallStack(): StackFrame[] {
    return this.state.callStack.map(frame => ({
      ...frame,
      params: this.cloneVariables(frame.params),
      locals: this.cloneVariables(frame.locals),
      returnValue: frame.returnValue ? cloneValue(frame.returnValue) : undefined,
    }))
  }

  private cloneScopes(): ScopeChain {
    return this.state.scopes.map(scope => ({
      ...scope,
      variables: this.cloneVariables(scope.variables),
    }))
  }

  private cloneVariables(vars: Record<string, RuntimeValue>): Record<string, RuntimeValue> {
    const cloned: Record<string, RuntimeValue> = {}
    for (const [key, value] of Object.entries(vars)) {
      cloned[key] = cloneValue(value)
    }
    return cloned
  }

  getConsoleOutput(): string[] {
    return [...this.state.consoleOutput]
  }
}

export function createInterpreter(): Interpreter {
  return new Interpreter()
}
