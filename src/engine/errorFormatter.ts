/**
 * Error formatting for the code playground
 * Transforms raw parser/interpreter errors into friendly, actionable messages
 */

import type { ExecutionError } from '@/types'
import { detectLanguage, getLanguageDisplayName, type DetectionResult } from './languageDetector'

export type ErrorCategory =
  | 'syntax'           // JavaScript syntax error
  | 'language'         // Non-JavaScript code detected
  | 'runtime'          // Error during execution
  | 'unsupported'      // Valid JS but unsupported feature
  | 'limit'            // Execution limit reached

export interface FormattedError {
  category: ErrorCategory
  title: string
  message: string
  suggestion?: string
  line?: number
  column?: number
  highlights?: { line: number; message: string }[]
  originalError?: string
}

interface SyntaxErrorPattern {
  pattern: RegExp
  title: string
  getMessage: (match: RegExpMatchArray, line?: number, column?: number) => string
  suggestion: string | ((match: RegExpMatchArray) => string)
}

const syntaxErrorPatterns: SyntaxErrorPattern[] = [
  {
    pattern: /Unexpected token '?([^']*)'?/i,
    title: 'Unexpected Character',
    getMessage: (match, line) => {
      const token = match[1] || 'character'
      return `Found an unexpected "${token}"${line ? ` on line ${line}` : ''}`
    },
    suggestion: 'Check for missing brackets, parentheses, or semicolons before this point',
  },
  {
    pattern: /Unexpected end of input/i,
    title: 'Incomplete Code',
    getMessage: () => 'The code ends unexpectedly',
    suggestion: 'You may be missing a closing bracket }, parenthesis ), or quote mark',
  },
  {
    pattern: /Unterminated string/i,
    title: 'Unclosed String',
    getMessage: (_, line) => `String is missing a closing quote${line ? ` (starting around line ${line})` : ''}`,
    suggestion: 'Make sure all strings have matching opening and closing quotes',
  },
  {
    pattern: /Identifier '(\w+)' has already been declared/i,
    title: 'Duplicate Declaration',
    getMessage: (match) => `Variable "${match[1]}" is declared more than once`,
    suggestion: 'Use a different variable name or remove the duplicate declaration',
  },
  {
    pattern: /Invalid left-hand side/i,
    title: 'Invalid Assignment',
    getMessage: () => 'Trying to assign a value to something that cannot be assigned',
    suggestion: 'Make sure you\'re assigning to a variable, not a value (e.g., x = 5, not 5 = x)',
  },
  {
    pattern: /Missing initializer in const/i,
    title: 'Missing Value',
    getMessage: () => 'A const variable must be assigned a value when declared',
    suggestion: 'Add = value after the variable name, e.g., const x = 10',
  },
  {
    pattern: /Unexpected identifier/i,
    title: 'Unexpected Word',
    getMessage: (_, line) => `Found an unexpected word${line ? ` on line ${line}` : ''}`,
    suggestion: 'Check for missing operators, commas, or misplaced keywords',
  },
  {
    pattern: /Unexpected number/i,
    title: 'Unexpected Number',
    getMessage: (_, line) => `Found a number in an unexpected place${line ? ` on line ${line}` : ''}`,
    suggestion: 'Check for missing operators or variable names',
  },
  {
    pattern: /'(\w+)' is not defined/i,
    title: 'Undefined Variable',
    getMessage: (match) => `Variable "${match[1]}" hasn't been declared`,
    suggestion: 'Declare the variable with let, const, or var before using it',
  },
  {
    pattern: /Illegal (return|break|continue)/i,
    title: 'Misplaced Statement',
    getMessage: (match) => `"${match[1]}" statement is in the wrong place`,
    suggestion: match => match[1] === 'return'
      ? '"return" can only be used inside a function'
      : `"${match[1]}" can only be used inside a loop`,
  },
]

/**
 * Format a parse error into a friendly message
 */
export function formatParseError(
  error: ExecutionError,
  code: string
): FormattedError {
  const originalMessage = error.message || 'Unknown syntax error'

  // First, check if this might be a different language
  const detection = detectLanguage(code)
  if (!detection.isLikelyJavaScript && detection.detectedLanguage) {
    return formatLanguageMismatchError(detection, code)
  }

  // Try to match against known patterns
  for (const pattern of syntaxErrorPatterns) {
    const match = originalMessage.match(pattern.pattern)
    if (match) {
      const suggestion = typeof pattern.suggestion === 'function'
        ? (pattern.suggestion as (match: RegExpMatchArray) => string)(match)
        : pattern.suggestion

      return {
        category: 'syntax',
        title: pattern.title,
        message: pattern.getMessage(match, error.line, error.column),
        suggestion,
        line: error.line,
        column: error.column,
        originalError: originalMessage,
      }
    }
  }

  // Fallback for unrecognized errors
  return {
    category: 'syntax',
    title: 'Syntax Error',
    message: `There's a problem with the code${error.line ? ` around line ${error.line}` : ''}`,
    suggestion: 'Check for typos, missing brackets, or incorrect punctuation',
    line: error.line,
    column: error.column,
    originalError: originalMessage,
  }
}

/**
 * Format a language mismatch error
 */
function formatLanguageMismatchError(
  detection: DetectionResult,
  _code: string
): FormattedError {
  const langName = detection.detectedLanguage
    ? getLanguageDisplayName(detection.detectedLanguage)
    : 'another language'

  const hints = detection.hints
    .map(h => `Line ${h.line}: "${h.pattern}" - ${h.description}`)
    .join('\n')

  return {
    category: 'language',
    title: `This looks like ${langName}`,
    message: `The playground only supports JavaScript, but this code appears to be ${langName}`,
    suggestion: detection.suggestion,
    highlights: detection.hints.map(h => ({
      line: h.line || 1,
      message: h.description,
    })),
    originalError: hints,
  }
}

/**
 * Format a runtime error
 */
export function formatRuntimeError(
  error: string | Error,
  line?: number
): FormattedError {
  const message = error instanceof Error ? error.message : error

  // Check for common runtime error patterns
  if (message.includes('Maximum step limit')) {
    return {
      category: 'limit',
      title: 'Execution Limit Reached',
      message: 'The code ran for too many steps',
      suggestion: 'This usually means there\'s an infinite loop. Check your loop conditions.',
      line,
    }
  }

  if (message.includes('Maximum call depth')) {
    return {
      category: 'limit',
      title: 'Too Many Function Calls',
      message: 'Functions are calling each other too deeply (possible infinite recursion)',
      suggestion: 'Make sure recursive functions have a proper base case that stops the recursion.',
      line,
    }
  }

  if (message.includes('is not a function')) {
    const match = message.match(/(\w+) is not a function/)
    return {
      category: 'runtime',
      title: 'Not a Function',
      message: match ? `"${match[1]}" is not a function and cannot be called` : message,
      suggestion: 'Make sure you\'re calling something that\'s actually a function',
      line,
    }
  }

  if (message.includes('Cannot read') || message.includes('undefined')) {
    return {
      category: 'runtime',
      title: 'Undefined Value',
      message: 'Trying to access a property of undefined',
      suggestion: 'Check that variables are defined and have values before accessing their properties',
      line,
    }
  }

  // Generic runtime error
  return {
    category: 'runtime',
    title: 'Runtime Error',
    message: message,
    line,
  }
}

/**
 * Format an unsupported feature error
 */
export function formatUnsupportedError(feature: string): FormattedError {
  const suggestions: Record<string, string> = {
    'setTimeout': 'Event loop visualization will show how setTimeout works conceptually',
    'Promise': 'Event loop visualization will show how Promises are scheduled',
    'async/await': 'Event loop visualization will show how async functions work',
    'fetch': 'Network requests cannot be executed in the visualizer',
    'import': 'ES6 imports are not supported - define functions directly in the code',
    'require': 'CommonJS require is not supported - define functions directly in the code',
  }

  return {
    category: 'unsupported',
    title: 'Feature Not Fully Supported',
    message: `The "${feature}" feature has limited support in the visualizer`,
    suggestion: suggestions[feature] || 'This feature may not work as expected in the playground',
  }
}

/**
 * Get error severity for UI styling
 */
export function getErrorSeverity(category: ErrorCategory): 'error' | 'warning' | 'info' {
  switch (category) {
    case 'syntax':
    case 'runtime':
      return 'error'
    case 'language':
    case 'unsupported':
      return 'warning'
    case 'limit':
      return 'info'
    default:
      return 'error'
  }
}
