import * as acorn from 'acorn'
import type { Node, Program } from 'acorn'
import type { ExecutionError, SourceLocation } from '@/types'

export interface ParseResult {
  success: boolean
  ast?: Program
  error?: ExecutionError
}

/**
 * Parse JavaScript code into an AST using Acorn
 */
export function parseCode(code: string): ParseResult {
  try {
    const ast = acorn.parse(code, {
      ecmaVersion: 2022,
      sourceType: 'script',
      locations: true,
      ranges: true,
    })

    return { success: true, ast }
  } catch (err) {
    const error = err as Error & { loc?: { line: number; column: number } }

    return {
      success: false,
      error: {
        message: error.message || 'Syntax error',
        line: error.loc?.line,
        column: error.loc?.column,
      },
    }
  }
}

/**
 * Extract source location from an AST node
 */
export function getNodeLocation(node: Node): SourceLocation {
  return {
    line: node.loc?.start.line ?? 1,
    column: node.loc?.start.column ?? 0,
    start: node.start,
    end: node.end,
  }
}

/**
 * Check if code contains potentially dangerous or unsupported constructs
 */
export function validateCode(code: string): { valid: boolean; warnings: string[] } {
  const warnings: string[] = []

  // Check for infinite loop patterns (basic heuristic)
  if (/while\s*\(\s*true\s*\)/.test(code) && !/break/.test(code)) {
    warnings.push('Potential infinite loop detected: while(true) without break')
  }

  // Check for restricted APIs
  const restrictedPatterns = [
    { pattern: /\bfetch\s*\(/, message: 'Network requests (fetch) cannot be visualized' },
    { pattern: /\brequire\s*\(/, message: 'Module imports (require) are not supported' },
    { pattern: /\bimport\s+/, message: 'ES6 imports are not supported in this visualizer' },
  ]

  for (const { pattern, message } of restrictedPatterns) {
    if (pattern.test(code)) {
      warnings.push(message)
    }
  }

  return {
    valid: warnings.length === 0,
    warnings,
  }
}

/**
 * Get a description of what an AST node represents
 */
export function describeNode(node: Node): string {
  switch (node.type) {
    case 'VariableDeclaration':
      return 'Variable declaration'
    case 'FunctionDeclaration':
      return 'Function declaration'
    case 'ExpressionStatement':
      return 'Expression'
    case 'CallExpression':
      return 'Function call'
    case 'ReturnStatement':
      return 'Return statement'
    case 'IfStatement':
      return 'If condition'
    case 'ForStatement':
      return 'For loop'
    case 'WhileStatement':
      return 'While loop'
    case 'AssignmentExpression':
      return 'Assignment'
    case 'BinaryExpression':
      return 'Binary operation'
    case 'ArrayExpression':
      return 'Array creation'
    case 'ObjectExpression':
      return 'Object creation'
    case 'MemberExpression':
      return 'Property access'
    case 'UpdateExpression':
      return 'Update expression'
    default:
      return node.type
  }
}
