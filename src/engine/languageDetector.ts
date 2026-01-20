/**
 * Language detection for the code playground
 * Uses heuristic pattern matching to identify non-JavaScript code
 * and provide helpful error messages
 */

export interface DetectionResult {
  isLikelyJavaScript: boolean
  detectedLanguage: DetectedLanguage | null
  confidence: number // 0-1
  hints: LanguageHint[]
  suggestion?: string // Helpful conversion tip
}

export type DetectedLanguage = 'python' | 'java' | 'c-cpp' | 'go' | 'ruby' | 'plain-text'

export interface LanguageHint {
  pattern: string
  language: DetectedLanguage
  description: string
  line?: number
}

interface LanguagePattern {
  regex: RegExp
  language: DetectedLanguage
  description: string
  weight: number // How strongly this indicates the language (0-1)
}

const languagePatterns: LanguagePattern[] = [
  // Python patterns
  { regex: /\bdef\s+\w+\s*\([^)]*\)\s*:/m, language: 'python', description: 'Python function definition (def ...():)', weight: 0.9 },
  { regex: /\bprint\s*\([^)]*\)\s*$/m, language: 'python', description: 'Python print() without semicolon', weight: 0.6 },
  { regex: /\b(True|False|None)\b/, language: 'python', description: 'Python keywords (True/False/None)', weight: 0.7 },
  { regex: /\belif\b/, language: 'python', description: 'Python elif keyword', weight: 0.95 },
  { regex: /\bself\.\w+/, language: 'python', description: 'Python self reference', weight: 0.8 },
  { regex: /^\s*class\s+\w+\s*:/m, language: 'python', description: 'Python class definition', weight: 0.9 },
  { regex: /\bimport\s+\w+\s*$/m, language: 'python', description: 'Python import (no from)', weight: 0.7 },
  { regex: /\bfrom\s+\w+\s+import\b/, language: 'python', description: 'Python from...import', weight: 0.9 },
  { regex: /^\s*#[^!].*$/m, language: 'python', description: 'Python-style comment', weight: 0.3 },
  { regex: /\brange\s*\(\s*\d+\s*\)/, language: 'python', description: 'Python range()', weight: 0.7 },
  { regex: /\bfor\s+\w+\s+in\s+/, language: 'python', description: 'Python for...in loop', weight: 0.6 },
  { regex: /"""|'''/, language: 'python', description: 'Python triple quotes', weight: 0.95 },
  { regex: /\blen\s*\([^)]+\)/, language: 'python', description: 'Python len()', weight: 0.5 },
  { regex: /\s*:\s*$/m, language: 'python', description: 'Line ending with colon (Python block)', weight: 0.4 },

  // Java patterns
  { regex: /\bpublic\s+(static\s+)?void\s+main\s*\(/, language: 'java', description: 'Java main method', weight: 0.95 },
  { regex: /\bpublic\s+class\s+\w+/, language: 'java', description: 'Java public class', weight: 0.9 },
  { regex: /\bSystem\.out\.print(ln)?\s*\(/, language: 'java', description: 'Java System.out.print', weight: 0.95 },
  { regex: /\b(private|protected|public)\s+(static\s+)?\w+\s+\w+\s*[;=]/, language: 'java', description: 'Java access modifier', weight: 0.8 },
  { regex: /\bnew\s+\w+\s*\[\s*\d+\s*\]/, language: 'java', description: 'Java array instantiation', weight: 0.7 },
  { regex: /\bString\[\]\s+\w+/, language: 'java', description: 'Java String[] type', weight: 0.85 },
  { regex: /\bimport\s+java\./, language: 'java', description: 'Java import statement', weight: 0.95 },
  { regex: /\bextends\s+\w+\s*\{/, language: 'java', description: 'Java extends keyword', weight: 0.8 },
  { regex: /\bimplements\s+\w+/, language: 'java', description: 'Java implements keyword', weight: 0.85 },
  { regex: /@Override/, language: 'java', description: 'Java @Override annotation', weight: 0.9 },

  // C/C++ patterns
  { regex: /#include\s*<[^>]+>/, language: 'c-cpp', description: 'C/C++ #include directive', weight: 0.95 },
  { regex: /\bint\s+main\s*\(\s*(void|int argc)/, language: 'c-cpp', description: 'C/C++ main function', weight: 0.9 },
  { regex: /\bprintf\s*\(/, language: 'c-cpp', description: 'C printf function', weight: 0.8 },
  { regex: /\bcout\s*<</, language: 'c-cpp', description: 'C++ cout stream', weight: 0.9 },
  { regex: /\bstd::/, language: 'c-cpp', description: 'C++ std namespace', weight: 0.95 },
  { regex: /\bscanf\s*\(/, language: 'c-cpp', description: 'C scanf function', weight: 0.8 },
  { regex: /\b(malloc|free|sizeof)\s*\(/, language: 'c-cpp', description: 'C memory functions', weight: 0.85 },
  { regex: /->/, language: 'c-cpp', description: 'C/C++ pointer arrow operator', weight: 0.5 },

  // Go patterns
  { regex: /\bfunc\s+\w+\s*\([^)]*\)\s*\{/, language: 'go', description: 'Go function definition', weight: 0.9 },
  { regex: /\bpackage\s+main\b/, language: 'go', description: 'Go package main', weight: 0.95 },
  { regex: /\bfmt\.Print(ln)?\s*\(/, language: 'go', description: 'Go fmt.Print', weight: 0.95 },
  { regex: /:=/, language: 'go', description: 'Go short variable declaration', weight: 0.7 },
  { regex: /\bfunc\s+\(\w+\s+\*?\w+\)\s+\w+/, language: 'go', description: 'Go method receiver', weight: 0.9 },

  // Ruby patterns
  { regex: /\bputs\s+/, language: 'ruby', description: 'Ruby puts statement', weight: 0.8 },
  { regex: /\bdef\s+\w+[^:]*\n/, language: 'ruby', description: 'Ruby def without colon', weight: 0.6 },
  { regex: /\bend\s*$/m, language: 'ruby', description: 'Ruby end keyword', weight: 0.5 },
  { regex: /\battr_(reader|writer|accessor)\b/, language: 'ruby', description: 'Ruby attr methods', weight: 0.95 },
  { regex: /\|\w+\|/, language: 'ruby', description: 'Ruby block parameter', weight: 0.6 },

  // Plain text patterns (strong non-code indicators)
  { regex: /^[A-Z][^{};=()]*[.!?]\s*$/m, language: 'plain-text', description: 'Sentence ending with punctuation', weight: 0.4 },
  { regex: /^(Dear|Hello|Hi|Hey|Please|Thanks|Thank you)\b/im, language: 'plain-text', description: 'Common greeting/letter start', weight: 0.8 },
  { regex: /^[^{};=()[\]]*$/m, language: 'plain-text', description: 'Line without code characters', weight: 0.2 },
]

// JavaScript patterns that confirm it IS JavaScript (reduces false positives)
const javaScriptConfirmers: RegExp[] = [
  /\bconst\s+\w+\s*=/, // const declaration
  /\blet\s+\w+\s*=/, // let declaration
  /\bvar\s+\w+\s*=/, // var declaration
  /\bfunction\s+\w+\s*\(/, // function declaration
  /=>\s*[{(]?/, // arrow function
  /\bconsole\.(log|error|warn)\s*\(/, // console methods
  /\bdocument\.\w+/, // DOM access
  /\bwindow\.\w+/, // window access
  /\.forEach\s*\(/, // Array methods
  /\.map\s*\(/, // Array methods
  /\.filter\s*\(/, // Array methods
  /\.reduce\s*\(/, // Array methods
  /\bnew\s+Promise\s*\(/, // Promise
  /\basync\s+function\b/, // async function
  /\bawait\s+/, // await keyword
  /===|!==/, // strict equality (JS-specific)
  /`[^`]*\$\{/, // template literals
]

/**
 * Detect if code is likely JavaScript or another language
 */
export function detectLanguage(code: string): DetectionResult {
  const trimmedCode = code.trim()

  // Empty or whitespace-only
  if (!trimmedCode) {
    return {
      isLikelyJavaScript: true,
      detectedLanguage: null,
      confidence: 1,
      hints: [],
    }
  }

  // First, check for JavaScript confirmers
  const jsConfirmerMatches = javaScriptConfirmers.filter((pattern) => pattern.test(code))
  const jsConfidence = Math.min(jsConfirmerMatches.length * 0.2, 0.8)

  // Collect all matching patterns
  const matchedHints: LanguageHint[] = []
  const languageScores: Record<DetectedLanguage, number> = {
    'python': 0,
    'java': 0,
    'c-cpp': 0,
    'go': 0,
    'ruby': 0,
    'plain-text': 0,
  }

  for (const pattern of languagePatterns) {
    const match = pattern.regex.exec(code)
    if (match) {
      languageScores[pattern.language] += pattern.weight

      // Find line number of match
      const beforeMatch = code.substring(0, match.index)
      const lineNumber = (beforeMatch.match(/\n/g) || []).length + 1

      matchedHints.push({
        pattern: match[0].substring(0, 50) + (match[0].length > 50 ? '...' : ''),
        language: pattern.language,
        description: pattern.description,
        line: lineNumber,
      })
    }
  }

  // Find the most likely non-JS language
  let maxScore = 0
  let detectedLanguage: DetectedLanguage | null = null

  for (const [lang, score] of Object.entries(languageScores)) {
    if (score > maxScore) {
      maxScore = score
      detectedLanguage = lang as DetectedLanguage
    }
  }

  // Calculate final confidence
  // If JS confirmers are strong and non-JS patterns are weak, it's likely JS
  const nonJsConfidence = Math.min(maxScore / 2, 1) // Normalize to 0-1
  const isLikelyJavaScript = jsConfidence > nonJsConfidence || maxScore < 0.5

  // Filter hints to only show the detected language
  const relevantHints = detectedLanguage
    ? matchedHints.filter((h) => h.language === detectedLanguage)
    : matchedHints

  return {
    isLikelyJavaScript,
    detectedLanguage: isLikelyJavaScript ? null : detectedLanguage,
    confidence: isLikelyJavaScript ? jsConfidence : nonJsConfidence,
    hints: relevantHints.slice(0, 3), // Limit to top 3 hints
    suggestion: isLikelyJavaScript ? undefined : getSuggestion(detectedLanguage),
  }
}

/**
 * Get a helpful suggestion for converting to JavaScript
 */
function getSuggestion(language: DetectedLanguage | null): string | undefined {
  switch (language) {
    case 'python':
      return 'In JavaScript, use "function name() { }" instead of "def name():", and "console.log()" instead of "print()"'
    case 'java':
      return 'In JavaScript, you don\'t need class wrappers or type declarations. Use "console.log()" instead of "System.out.println()"'
    case 'c-cpp':
      return 'In JavaScript, use "console.log()" for output and you don\'t need #include directives'
    case 'go':
      return 'In JavaScript, use "function" instead of "func" and "console.log()" instead of "fmt.Println()"'
    case 'ruby':
      return 'In JavaScript, use "console.log()" instead of "puts" and curly braces instead of "end"'
    case 'plain-text':
      return 'This looks like plain text. The playground expects JavaScript code to visualize'
    default:
      return undefined
  }
}

/**
 * Get a friendly language name for display
 */
export function getLanguageDisplayName(language: DetectedLanguage): string {
  switch (language) {
    case 'python':
      return 'Python'
    case 'java':
      return 'Java'
    case 'c-cpp':
      return 'C/C++'
    case 'go':
      return 'Go'
    case 'ruby':
      return 'Ruby'
    case 'plain-text':
      return 'plain text'
    default:
      return language
  }
}
