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

// Control flow signals
class BreakSignal extends Error {
  constructor() {
    super('break')
    this.name = 'BreakSignal'
  }
}

class ContinueSignal extends Error {
  constructor() {
    super('continue')
    this.name = 'ContinueSignal'
  }
}

interface InterpreterState {
  steps: ExecutionStep[]
  callStack: StackFrame[]
  scopes: ScopeChain
  globalScope: Scope
  stepId: number
  frameId: number
  consoleOutput: string[]
  // Prototype storage for custom prototype methods
  prototypes: {
    Array: Record<string, RuntimeValue>
    Object: Record<string, RuntimeValue>
    String: Record<string, RuntimeValue>
  }
}

// Using any here because Acorn's AST types are complex
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

    // Initialize prototype storage
    const prototypes = {
      Array: {} as Record<string, RuntimeValue>,
      Object: {} as Record<string, RuntimeValue>,
      String: {} as Record<string, RuntimeValue>,
    }

    return {
      steps: [],
      callStack: [],
      scopes: [globalScope],
      globalScope,
      stepId: 0,
      frameId: 0,
      consoleOutput: [],
      prototypes,
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

    const rawParams = node.params || []
    const func = createFunction(
      node.id.name,
      rawParams.map((p: ASTNode) => {
        if (p.type === 'Identifier') return p.name!
        if (p.type === 'AssignmentPattern' && p.left?.name) return p.left.name
        if (p.type === 'RestElement' && p.argument?.name) return p.argument.name
        return ''
      }).filter(Boolean),
      node.body!,
      [...this.state.scopes],
      rawParams.map((p: ASTNode) => p.type === 'AssignmentPattern' ? p.right : null)
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
      case 'FunctionExpression':
      case 'ArrowFunctionExpression':
        return this.executeFunctionExpression(node)
      case 'ExpressionStatement':
        return this.executeExpressionStatement(node)
      case 'ReturnStatement':
        return this.executeReturnStatement(node)
      case 'IfStatement':
        return this.executeIfStatement(node)
      case 'ForStatement':
        return this.executeForStatement(node)
      case 'ForOfStatement':
        return this.executeForOfStatement(node)
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
      case 'BreakStatement':
        return this.executeBreakStatement(node)
      case 'ContinueStatement':
        return this.executeContinueStatement(node)
      case 'ThisExpression':
        return this.executeThisExpression()
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

  private executeFunctionExpression(node: ASTNode): RuntimeValue {
    // Create a function value for function expressions and arrow functions
    const name = node.id?.name || '<anonymous>'
    const rawParams = node.params || []
    const params = rawParams.map((p: ASTNode) => {
      // Handle different parameter types
      if (p.type === 'Identifier') return p.name!
      if (p.type === 'AssignmentPattern' && p.left?.name) return p.left.name
      if (p.type === 'RestElement' && p.argument?.name) return p.argument.name
      return ''
    }).filter(Boolean)
    const defaultValues = rawParams.map((p: ASTNode) => p.type === 'AssignmentPattern' ? p.right : null)

    // For arrow functions with expression body, wrap in a return statement
    let body = node.body as ASTNode
    if (node.type === 'ArrowFunctionExpression' && body.type !== 'BlockStatement') {
      // Expression body - we'll handle it during execution
      body = {
        type: 'BlockStatement',
        body: [{
          type: 'ReturnStatement',
          argument: body,
          start: body.start,
          end: body.end,
        }],
        start: body.start,
        end: body.end,
      } as ASTNode
    }

    return createFunction(name, params, body, [...this.state.scopes], defaultValues)
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

  private executeBreakStatement(node: ASTNode): RuntimeValue {
    this.recordStep(node, 'branch', 'Break statement')
    throw new BreakSignal()
  }

  private executeContinueStatement(node: ASTNode): RuntimeValue {
    this.recordStep(node, 'branch', 'Continue statement')
    throw new ContinueSignal()
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
    let shouldBreak = false

    while (iterations < maxIterations && !shouldBreak) {
      // Test condition
      if (node.test) {
        const testValue = this.executeNode(node.test as ASTNode)
        if (!isTruthy(testValue)) {
          this.recordStep(node, 'loop-end', 'For loop condition false, exiting')
          break
        }
      }

      this.recordStep(node, 'loop-iteration', `For loop iteration ${iterations + 1}`)

      // Execute body with break/continue handling
      try {
        const body = node.body as ASTNode
        if (body.type === 'BlockStatement') {
          const statements = body.body as ASTNode[]
          for (const stmt of statements) {
            this.executeNode(stmt)
          }
        } else {
          this.executeNode(body)
        }
      } catch (e) {
        if (e instanceof BreakSignal) {
          this.recordStep(node, 'loop-end', 'For loop exited via break')
          shouldBreak = true
          continue
        }
        if (e instanceof ContinueSignal) {
          // Continue to update and next iteration
        } else {
          throw e
        }
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

  private executeForOfStatement(node: ASTNode): RuntimeValue {
    // Create block scope for loop
    this.pushScope('block', 'for-of-loop')

    // Get the iterable
    const iterable = this.executeNode(node.right as ASTNode)

    // Get elements to iterate over
    let elements: RuntimeValue[] = []
    if (iterable.type === 'array') {
      elements = iterable.elements
    } else if (iterable.type === 'primitive' && typeof iterable.value === 'string') {
      // String iteration
      elements = (iterable.value as string).split('').map(char => createPrimitive(char))
    }

    this.recordStep(node, 'loop-start', `For-of loop started over ${elements.length} elements`)

    let iterations = 0
    const maxIterations = 1000
    let shouldBreak = false

    for (let i = 0; i < elements.length && iterations < maxIterations && !shouldBreak; i++) {
      const element = elements[i]

      // Declare the loop variable
      const left = node.left as ASTNode
      if (left.type === 'VariableDeclaration') {
        const declarations = left.declarations as ASTNode[]
        const decl = declarations[0]
        const varName = (decl.id as ASTNode).name as string
        this.setVariable(varName, cloneValue(element))
      }

      this.recordStep(node, 'loop-iteration', `For-of loop iteration ${iterations + 1}`)

      // Execute body with break/continue handling
      try {
        const body = node.body as ASTNode
        if (body.type === 'BlockStatement') {
          const statements = body.body as ASTNode[]
          for (const stmt of statements) {
            this.executeNode(stmt)
          }
        } else {
          this.executeNode(body)
        }
      } catch (e) {
        if (e instanceof BreakSignal) {
          this.recordStep(node, 'loop-end', 'For-of loop exited via break')
          shouldBreak = true
          continue
        }
        if (e instanceof ContinueSignal) {
          // Continue to next iteration
        } else {
          throw e
        }
      }

      iterations++
    }

    if (!shouldBreak) {
      this.recordStep(node, 'loop-end', 'For-of loop completed')
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
    let shouldBreak = false

    while (iterations < maxIterations && !shouldBreak) {
      const testValue = this.executeNode(node.test as ASTNode)
      if (!isTruthy(testValue)) {
        this.recordStep(node, 'loop-end', 'While loop condition false, exiting')
        break
      }

      this.recordStep(node, 'loop-iteration', `While loop iteration ${iterations + 1}`)

      try {
        this.executeNode(node.body as ASTNode)
      } catch (e) {
        if (e instanceof BreakSignal) {
          this.recordStep(node, 'loop-end', 'While loop exited via break')
          shouldBreak = true
          continue
        }
        if (e instanceof ContinueSignal) {
          // Continue to next iteration
          iterations++
          continue
        }
        throw e
      }
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

    // Check for Array static methods (e.g., Array.isArray)
    if (
      callee.type === 'MemberExpression' &&
      (callee.object as ASTNode).type === 'Identifier' &&
      ((callee.object as ASTNode).name === 'Array')
    ) {
      const methodName = (callee.property as ASTNode).name
      const builtin = this.builtins.get(`Array.${methodName}`)
      if (builtin) {
        const args = (node.arguments || []).map((arg: ASTNode) => this.executeNode(arg))
        const result = builtin(...args)
        this.recordStep(node, 'expression', `Array.${methodName}() → ${formatValue(result)}`)
        return result
      }
    }

    // Check for array methods
    if (callee.type === 'MemberExpression') {
      const obj = this.executeNode(callee.object as ASTNode)
      const methodName = (callee.property as ASTNode).name

      if (obj.type === 'array') {
        const args = (node.arguments || []).map((arg: ASTNode) => this.executeNode(arg))
        // First check built-in methods
        const result = this.executeArrayMethod(obj, methodName, args, node)
        if (result !== null) {
          return result
        }
        // Then check custom prototype methods
        const protoMethod = this.state.prototypes.Array[methodName]
        if (protoMethod && protoMethod.type === 'function') {
          return this.executePrototypeMethod(protoMethod, obj, args, node, methodName)
        }
      }

      if (obj.type === 'primitive' && obj.dataType === 'string') {
        const strValue = obj.value as string
        const args = (node.arguments || []).map((arg: ASTNode) => this.executeNode(arg))
        const result = this.executeStringMethod(strValue, methodName, args, node)
        if (result !== null) {
          return result
        }
        // Check custom String prototype methods
        const protoMethod = this.state.prototypes.String[methodName]
        if (protoMethod && protoMethod.type === 'function') {
          // Create a temporary array-like wrapper for string
          const strWrapper = createObject({ length: createPrimitive(strValue.length) })
          for (let i = 0; i < strValue.length; i++) {
            strWrapper.properties[i] = createPrimitive(strValue[i])
          }
          return this.executePrototypeMethod(protoMethod, strWrapper, args, node, methodName)
        }
      }

      // Check for object method calls (obj.method())
      if (obj.type === 'object') {
        const method = obj.properties[methodName]
        if (method && method.type === 'function') {
          const args = (node.arguments || []).map((arg: ASTNode) => this.executeNode(arg))
          return this.executePrototypeMethod(method, obj, args, node, methodName)
        }
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

    // Bind parameters (with default value support)
    for (let i = 0; i < func.params.length; i++) {
      let value = args[i]
      // If no argument provided and there's a default value, evaluate it
      if (value === undefined && func.defaultValues?.[i]) {
        value = this.executeNode(func.defaultValues[i] as ASTNode)
      }
      frame.params[func.params[i]] = value ?? createUndefined()
    }

    this.state.callStack.push(frame)
    this.recordStep(
      node,
      'call',
      `Call ${func.name}(${args.map((a: RuntimeValue) => formatValue(a)).join(', ')})`
    )

    // Save current scopes and restore closure scopes
    const savedScopes = this.state.scopes
    this.state.scopes = [...func.closure]

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
      // First pass: hoist function declarations
      for (const stmt of statements) {
        if (stmt.type === 'FunctionDeclaration') {
          this.declareFunctionHoisted(stmt)
        }
      }
      // Second pass: execute statements
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

    // Pop function scope and restore original scopes
    this.popScope()
    this.state.scopes = savedScopes

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
      // Check for prototype assignment pattern: Array.prototype.xxx = value
      const protoAssignment = this.parsePrototypeAssignment(left)
      if (protoAssignment) {
        const { constructor, methodName } = protoAssignment
        this.state.prototypes[constructor][methodName] = right
        this.recordStep(node, 'assignment', `${constructor}.prototype.${methodName} = ${formatValue(right)}`)
        return right
      }

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

  // Parse pattern like Array.prototype.methodName to extract constructor and method name
  private parsePrototypeAssignment(node: ASTNode): { constructor: 'Array' | 'Object' | 'String'; methodName: string } | null {
    // Pattern: MemberExpression { object: MemberExpression { object: Identifier, property: "prototype" }, property: methodName }
    if (node.type !== 'MemberExpression') return null

    const methodName = node.property?.name
    if (!methodName) return null

    const protoAccess = node.object
    if (protoAccess?.type !== 'MemberExpression') return null
    if (protoAccess.property?.name !== 'prototype') return null

    const constructorNode = protoAccess.object
    if (constructorNode?.type !== 'Identifier') return null

    const constructorName = constructorNode.name
    if (constructorName === 'Array' || constructorName === 'Object' || constructorName === 'String') {
      return { constructor: constructorName, methodName }
    }

    return null
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

  private executeThisExpression(): RuntimeValue {
    return this.getVariable('this')
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

  // Helper to invoke a callback function with arguments
  private invokeCallback(
    callback: RuntimeValue,
    callbackArgs: RuntimeValue[],
    node: ASTNode
  ): RuntimeValue {
    if (callback.type !== 'function') {
      throw new Error(`${formatValue(callback)} is not a function`)
    }

    const func = callback

    // Create stack frame
    const frame: StackFrame = {
      id: `frame_${++this.state.frameId}`,
      name: func.name || '(callback)',
      params: {},
      locals: {},
      callSite: getNodeLocation(node),
      startLine: getNodeLocation(func.body).line,
      depth: this.state.callStack.length,
    }

    // Bind parameters (with default value support)
    for (let i = 0; i < func.params.length; i++) {
      let value = callbackArgs[i]
      if (value === undefined && func.defaultValues?.[i]) {
        value = this.executeNode(func.defaultValues[i] as ASTNode)
      }
      frame.params[func.params[i]] = value ?? createUndefined()
    }

    this.state.callStack.push(frame)

    // Save current scopes and restore closure scopes
    const savedScopes = this.state.scopes
    this.state.scopes = [...func.closure]

    // Create function scope with parameters
    this.pushScope('function', func.name || '(callback)')
    for (const [name, value] of Object.entries(frame.params)) {
      this.setVariable(name, value)
    }

    // Execute function body
    let result: RuntimeValue = createUndefined()
    const body = func.body as ASTNode

    if (body.type === 'BlockStatement') {
      const statements = body.body as ASTNode[]
      // First pass: hoist function declarations
      for (const stmt of statements) {
        if (stmt.type === 'FunctionDeclaration') {
          this.declareFunctionHoisted(stmt)
        }
      }
      // Second pass: execute statements
      for (const stmt of statements) {
        result = this.executeNode(stmt)
        if (frame.returnValue !== undefined) {
          result = frame.returnValue
          break
        }
      }
    } else {
      result = this.executeNode(body)
    }

    // Pop function scope and restore original scopes
    this.popScope()
    this.state.scopes = savedScopes

    // Pop stack frame
    this.state.callStack.pop()

    return result
  }

  // Execute a prototype method with proper 'this' binding
  private executePrototypeMethod(
    method: RuntimeValue,
    thisValue: RuntimeValue,
    args: RuntimeValue[],
    node: ASTNode,
    methodName: string
  ): RuntimeValue {
    if (method.type !== 'function') {
      throw new Error(`${methodName} is not a function`)
    }

    const func = method

    // Create stack frame
    const frame: StackFrame = {
      id: `frame_${++this.state.frameId}`,
      name: func.name || methodName,
      params: {},
      locals: {},
      callSite: getNodeLocation(node),
      startLine: getNodeLocation(func.body).line,
      depth: this.state.callStack.length,
    }

    // Bind parameters (with default value support)
    for (let i = 0; i < func.params.length; i++) {
      let value = args[i]
      if (value === undefined && func.defaultValues?.[i]) {
        value = this.executeNode(func.defaultValues[i] as ASTNode)
      }
      frame.params[func.params[i]] = value ?? createUndefined()
    }

    this.state.callStack.push(frame)
    this.recordStep(
      node,
      'call',
      `Call ${methodName}(${args.map((a: RuntimeValue) => formatValue(a)).join(', ')})`
    )

    // Save current scopes and restore closure scopes
    const savedScopes = this.state.scopes
    this.state.scopes = [...func.closure]

    // Create function scope with parameters and 'this'
    this.pushScope('function', func.name || methodName)
    for (const [name, value] of Object.entries(frame.params)) {
      this.setVariable(name, value)
    }
    // Bind 'this' to the target object (array/object)
    this.setVariable('this', thisValue)

    // Execute function body
    let result: RuntimeValue = createUndefined()
    const body = func.body as ASTNode

    if (body.type === 'BlockStatement') {
      const statements = body.body as ASTNode[]
      // First pass: hoist function declarations
      for (const stmt of statements) {
        if (stmt.type === 'FunctionDeclaration') {
          this.declareFunctionHoisted(stmt)
        }
      }
      // Second pass: execute statements
      for (const stmt of statements) {
        result = this.executeNode(stmt)
        if (frame.returnValue !== undefined) {
          result = frame.returnValue
          break
        }
      }
    } else {
      result = this.executeNode(body)
    }

    // Pop function scope and restore original scopes
    this.popScope()
    this.state.scopes = savedScopes

    // Pop stack frame
    this.state.callStack.pop()
    this.recordStep(node, 'return', `Return from ${methodName}: ${formatValue(result)}`)

    return result
  }

  // Array methods
  private executeArrayMethod(
    arr: RuntimeValue & { type: 'array'; elements: RuntimeValue[] },
    method: string,
    args: RuntimeValue[],
    node: ASTNode
  ): RuntimeValue | null {
    switch (method) {
      case 'push': {
        for (const arg of args) {
          arr.elements.push(cloneValue(arg))
        }
        const newLength = arr.elements.length
        this.recordStep(node, 'array-modify', `Array.push(${args.map(a => formatValue(a)).join(', ')}) → length ${newLength}`)
        return createPrimitive(newLength)
      }

      case 'pop': {
        const popped = arr.elements.pop()
        const result = popped ?? createUndefined()
        this.recordStep(node, 'array-modify', `Array.pop() → ${formatValue(result)}`)
        return result
      }

      case 'shift': {
        const shifted = arr.elements.shift()
        const result = shifted ?? createUndefined()
        this.recordStep(node, 'array-modify', `Array.shift() → ${formatValue(result)}`)
        return result
      }

      case 'unshift': {
        for (let i = args.length - 1; i >= 0; i--) {
          arr.elements.unshift(cloneValue(args[i]))
        }
        const newLength = arr.elements.length
        this.recordStep(node, 'array-modify', `Array.unshift(${args.map(a => formatValue(a)).join(', ')}) → length ${newLength}`)
        return createPrimitive(newLength)
      }

      case 'indexOf': {
        const searchValue = args[0]
        const fromIndex = args[1]?.type === 'primitive' ? (args[1].value as number) : 0
        let result = -1
        for (let i = fromIndex; i < arr.elements.length; i++) {
          const el = arr.elements[i]
          if (el.type === 'primitive' && searchValue.type === 'primitive' && el.value === searchValue.value) {
            result = i
            break
          }
        }
        this.recordStep(node, 'array-access', `Array.indexOf(${formatValue(searchValue)}) → ${result}`)
        return createPrimitive(result)
      }

      case 'includes': {
        const searchValue = args[0]
        let found = false
        for (const el of arr.elements) {
          if (el.type === 'primitive' && searchValue.type === 'primitive' && el.value === searchValue.value) {
            found = true
            break
          }
        }
        this.recordStep(node, 'array-access', `Array.includes(${formatValue(searchValue)}) → ${found}`)
        return createPrimitive(found)
      }

      case 'slice': {
        const start = args[0]?.type === 'primitive' ? (args[0].value as number) : 0
        const end = args[1]?.type === 'primitive' ? (args[1].value as number) : arr.elements.length
        const sliced = arr.elements.slice(start, end).map(el => cloneValue(el))
        const result = createArray(sliced)
        this.recordStep(node, 'array-access', `Array.slice(${start}, ${end}) → ${formatValue(result)}`)
        return result
      }

      case 'splice': {
        const start = args[0]?.type === 'primitive' ? (args[0].value as number) : 0
        const deleteCount = args[1]?.type === 'primitive' ? (args[1].value as number) : arr.elements.length - start
        const insertItems = args.slice(2).map(a => cloneValue(a))
        const removed = arr.elements.splice(start, deleteCount, ...insertItems)
        const result = createArray(removed)
        this.recordStep(node, 'array-modify', `Array.splice(${start}, ${deleteCount}) → ${formatValue(result)}`)
        return result
      }

      case 'join': {
        const separator = args[0]?.type === 'primitive' ? String(args[0].value) : ','
        const joined = arr.elements.map(el => {
          if (el.type === 'primitive') return String(el.value)
          if (el.type === 'null') return 'null'
          if (el.type === 'undefined') return ''
          return formatValue(el)
        }).join(separator)
        this.recordStep(node, 'expression', `Array.join("${separator}") → "${joined}"`)
        return createPrimitive(joined)
      }

      case 'reverse': {
        arr.elements.reverse()
        this.recordStep(node, 'array-modify', `Array.reverse() → ${formatValue(arr)}`)
        return arr
      }

      case 'concat': {
        const newElements = [...arr.elements.map(el => cloneValue(el))]
        for (const arg of args) {
          if (arg.type === 'array') {
            for (const el of arg.elements) {
              newElements.push(cloneValue(el))
            }
          } else {
            newElements.push(cloneValue(arg))
          }
        }
        const result = createArray(newElements)
        this.recordStep(node, 'expression', `Array.concat() → ${formatValue(result)}`)
        return result
      }

      case 'fill': {
        const fillValue = args[0] ?? createUndefined()
        const start = args[1]?.type === 'primitive' ? (args[1].value as number) : 0
        const end = args[2]?.type === 'primitive' ? (args[2].value as number) : arr.elements.length
        for (let i = start; i < end && i < arr.elements.length; i++) {
          arr.elements[i] = cloneValue(fillValue)
        }
        this.recordStep(node, 'array-modify', `Array.fill(${formatValue(fillValue)}) → ${formatValue(arr)}`)
        return arr
      }

      // Callback-based array methods
      case 'forEach': {
        const callback = args[0]
        if (!callback || callback.type !== 'function') {
          throw new Error('forEach requires a callback function')
        }
        this.recordStep(node, 'expression', `Array.forEach() - iterating ${arr.elements.length} elements`)
        for (let i = 0; i < arr.elements.length; i++) {
          this.invokeCallback(callback, [arr.elements[i], createPrimitive(i), arr], node)
        }
        return createUndefined()
      }

      case 'map': {
        const callback = args[0]
        if (!callback || callback.type !== 'function') {
          throw new Error('map requires a callback function')
        }
        const results: RuntimeValue[] = []
        this.recordStep(node, 'expression', `Array.map() - transforming ${arr.elements.length} elements`)
        for (let i = 0; i < arr.elements.length; i++) {
          const result = this.invokeCallback(callback, [arr.elements[i], createPrimitive(i), arr], node)
          results.push(cloneValue(result))
        }
        const resultArr = createArray(results)
        this.recordStep(node, 'expression', `Array.map() → ${formatValue(resultArr)}`)
        return resultArr
      }

      case 'filter': {
        const callback = args[0]
        if (!callback || callback.type !== 'function') {
          throw new Error('filter requires a callback function')
        }
        const results: RuntimeValue[] = []
        this.recordStep(node, 'expression', `Array.filter() - filtering ${arr.elements.length} elements`)
        for (let i = 0; i < arr.elements.length; i++) {
          const result = this.invokeCallback(callback, [arr.elements[i], createPrimitive(i), arr], node)
          if (isTruthy(result)) {
            results.push(cloneValue(arr.elements[i]))
          }
        }
        const resultArr = createArray(results)
        this.recordStep(node, 'expression', `Array.filter() → ${formatValue(resultArr)}`)
        return resultArr
      }

      case 'reduce': {
        const callback = args[0]
        if (!callback || callback.type !== 'function') {
          throw new Error('reduce requires a callback function')
        }
        let accumulator: RuntimeValue
        let startIndex = 0
        if (args.length > 1) {
          accumulator = args[1]
        } else {
          if (arr.elements.length === 0) {
            throw new Error('Reduce of empty array with no initial value')
          }
          accumulator = arr.elements[0]
          startIndex = 1
        }
        this.recordStep(node, 'expression', `Array.reduce() - reducing ${arr.elements.length} elements`)
        for (let i = startIndex; i < arr.elements.length; i++) {
          accumulator = this.invokeCallback(
            callback,
            [accumulator, arr.elements[i], createPrimitive(i), arr],
            node
          )
        }
        this.recordStep(node, 'expression', `Array.reduce() → ${formatValue(accumulator)}`)
        return accumulator
      }

      case 'find': {
        const callback = args[0]
        if (!callback || callback.type !== 'function') {
          throw new Error('find requires a callback function')
        }
        this.recordStep(node, 'expression', `Array.find() - searching ${arr.elements.length} elements`)
        for (let i = 0; i < arr.elements.length; i++) {
          const result = this.invokeCallback(callback, [arr.elements[i], createPrimitive(i), arr], node)
          if (isTruthy(result)) {
            this.recordStep(node, 'expression', `Array.find() → ${formatValue(arr.elements[i])}`)
            return arr.elements[i]
          }
        }
        this.recordStep(node, 'expression', `Array.find() → undefined`)
        return createUndefined()
      }

      case 'findIndex': {
        const callback = args[0]
        if (!callback || callback.type !== 'function') {
          throw new Error('findIndex requires a callback function')
        }
        this.recordStep(node, 'expression', `Array.findIndex() - searching ${arr.elements.length} elements`)
        for (let i = 0; i < arr.elements.length; i++) {
          const result = this.invokeCallback(callback, [arr.elements[i], createPrimitive(i), arr], node)
          if (isTruthy(result)) {
            this.recordStep(node, 'expression', `Array.findIndex() → ${i}`)
            return createPrimitive(i)
          }
        }
        this.recordStep(node, 'expression', `Array.findIndex() → -1`)
        return createPrimitive(-1)
      }

      case 'some': {
        const callback = args[0]
        if (!callback || callback.type !== 'function') {
          throw new Error('some requires a callback function')
        }
        this.recordStep(node, 'expression', `Array.some() - testing ${arr.elements.length} elements`)
        for (let i = 0; i < arr.elements.length; i++) {
          const result = this.invokeCallback(callback, [arr.elements[i], createPrimitive(i), arr], node)
          if (isTruthy(result)) {
            this.recordStep(node, 'expression', `Array.some() → true`)
            return createPrimitive(true)
          }
        }
        this.recordStep(node, 'expression', `Array.some() → false`)
        return createPrimitive(false)
      }

      case 'every': {
        const callback = args[0]
        if (!callback || callback.type !== 'function') {
          throw new Error('every requires a callback function')
        }
        this.recordStep(node, 'expression', `Array.every() - testing ${arr.elements.length} elements`)
        for (let i = 0; i < arr.elements.length; i++) {
          const result = this.invokeCallback(callback, [arr.elements[i], createPrimitive(i), arr], node)
          if (!isTruthy(result)) {
            this.recordStep(node, 'expression', `Array.every() → false`)
            return createPrimitive(false)
          }
        }
        this.recordStep(node, 'expression', `Array.every() → true`)
        return createPrimitive(true)
      }

      default:
        return null
    }
  }

  // String methods
  private executeStringMethod(
    s: string,
    method: string,
    args: RuntimeValue[],
    node: ASTNode
  ): RuntimeValue | null {

    switch (method) {
      case 'charAt': {
        const index = args[0]?.type === 'primitive' ? (args[0].value as number) : 0
        const result = s.charAt(index)
        this.recordStep(node, 'expression', `"${s}".charAt(${index}) → "${result}"`)
        return createPrimitive(result)
      }

      case 'charCodeAt': {
        const index = args[0]?.type === 'primitive' ? (args[0].value as number) : 0
        const result = s.charCodeAt(index)
        this.recordStep(node, 'expression', `"${s}".charCodeAt(${index}) → ${result}`)
        return createPrimitive(result)
      }

      case 'substring': {
        const start = args[0]?.type === 'primitive' ? (args[0].value as number) : 0
        const end = args[1]?.type === 'primitive' ? (args[1].value as number) : s.length
        const result = s.substring(start, end)
        this.recordStep(node, 'expression', `"${s}".substring(${start}, ${end}) → "${result}"`)
        return createPrimitive(result)
      }

      case 'slice': {
        const start = args[0]?.type === 'primitive' ? (args[0].value as number) : 0
        const end = args[1]?.type === 'primitive' ? (args[1].value as number) : s.length
        const result = s.slice(start, end)
        this.recordStep(node, 'expression', `"${s}".slice(${start}, ${end}) → "${result}"`)
        return createPrimitive(result)
      }

      case 'split': {
        const separator = args[0]?.type === 'primitive' ? String(args[0].value) : ''
        const parts = s.split(separator)
        const elements = parts.map(p => createPrimitive(p))
        const result = createArray(elements)
        this.recordStep(node, 'expression', `"${s}".split("${separator}") → ${formatValue(result)}`)
        return result
      }

      case 'indexOf': {
        const searchStr = args[0]?.type === 'primitive' ? String(args[0].value) : ''
        const fromIndex = args[1]?.type === 'primitive' ? (args[1].value as number) : 0
        const result = s.indexOf(searchStr, fromIndex)
        this.recordStep(node, 'expression', `"${s}".indexOf("${searchStr}") → ${result}`)
        return createPrimitive(result)
      }

      case 'lastIndexOf': {
        const searchStr = args[0]?.type === 'primitive' ? String(args[0].value) : ''
        const result = s.lastIndexOf(searchStr)
        this.recordStep(node, 'expression', `"${s}".lastIndexOf("${searchStr}") → ${result}`)
        return createPrimitive(result)
      }

      case 'includes': {
        const searchStr = args[0]?.type === 'primitive' ? String(args[0].value) : ''
        const result = s.includes(searchStr)
        this.recordStep(node, 'expression', `"${s}".includes("${searchStr}") → ${result}`)
        return createPrimitive(result)
      }

      case 'startsWith': {
        const searchStr = args[0]?.type === 'primitive' ? String(args[0].value) : ''
        const result = s.startsWith(searchStr)
        this.recordStep(node, 'expression', `"${s}".startsWith("${searchStr}") → ${result}`)
        return createPrimitive(result)
      }

      case 'endsWith': {
        const searchStr = args[0]?.type === 'primitive' ? String(args[0].value) : ''
        const result = s.endsWith(searchStr)
        this.recordStep(node, 'expression', `"${s}".endsWith("${searchStr}") → ${result}`)
        return createPrimitive(result)
      }

      case 'toUpperCase': {
        const result = s.toUpperCase()
        this.recordStep(node, 'expression', `"${s}".toUpperCase() → "${result}"`)
        return createPrimitive(result)
      }

      case 'toLowerCase': {
        const result = s.toLowerCase()
        this.recordStep(node, 'expression', `"${s}".toLowerCase() → "${result}"`)
        return createPrimitive(result)
      }

      case 'trim': {
        const result = s.trim()
        this.recordStep(node, 'expression', `"${s}".trim() → "${result}"`)
        return createPrimitive(result)
      }

      case 'repeat': {
        const count = args[0]?.type === 'primitive' ? (args[0].value as number) : 0
        const result = s.repeat(count)
        this.recordStep(node, 'expression', `"${s}".repeat(${count}) → "${result}"`)
        return createPrimitive(result)
      }

      case 'padStart': {
        const targetLength = args[0]?.type === 'primitive' ? (args[0].value as number) : 0
        const padStr = args[1]?.type === 'primitive' ? String(args[1].value) : ' '
        const result = s.padStart(targetLength, padStr)
        this.recordStep(node, 'expression', `"${s}".padStart(${targetLength}) → "${result}"`)
        return createPrimitive(result)
      }

      case 'padEnd': {
        const targetLength = args[0]?.type === 'primitive' ? (args[0].value as number) : 0
        const padStr = args[1]?.type === 'primitive' ? String(args[1].value) : ' '
        const result = s.padEnd(targetLength, padStr)
        this.recordStep(node, 'expression', `"${s}".padEnd(${targetLength}) → "${result}"`)
        return createPrimitive(result)
      }

      case 'replace': {
        const searchStr = args[0]?.type === 'primitive' ? String(args[0].value) : ''
        const replaceStr = args[1]?.type === 'primitive' ? String(args[1].value) : ''
        const result = s.replace(searchStr, replaceStr)
        this.recordStep(node, 'expression', `"${s}".replace("${searchStr}", "${replaceStr}") → "${result}"`)
        return createPrimitive(result)
      }

      default:
        return null
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
