import { describe, it, expect } from 'vitest'
import { detectLanguage, getLanguageDisplayName } from './languageDetector'

describe('languageDetector', () => {
  describe('detectLanguage', () => {
    describe('JavaScript code', () => {
      it('detects valid JavaScript with const/let', () => {
        const result = detectLanguage('const x = 5; let y = 10;')
        expect(result.isLikelyJavaScript).toBe(true)
        expect(result.detectedLanguage).toBeNull()
      })

      it('detects valid JavaScript with arrow functions', () => {
        const result = detectLanguage('const fn = (x) => x * 2')
        expect(result.isLikelyJavaScript).toBe(true)
      })

      it('detects valid JavaScript with console.log', () => {
        const result = detectLanguage('console.log("hello")')
        expect(result.isLikelyJavaScript).toBe(true)
      })

      it('detects valid JavaScript with array methods', () => {
        const result = detectLanguage('[1,2,3].map(x => x * 2).filter(x => x > 2)')
        expect(result.isLikelyJavaScript).toBe(true)
      })

      it('allows snake_case variables (no false Python positive)', () => {
        const result = detectLanguage('const my_variable = 5; console.log(my_variable)')
        expect(result.isLikelyJavaScript).toBe(true)
      })

      it('handles empty code', () => {
        const result = detectLanguage('')
        expect(result.isLikelyJavaScript).toBe(true)
        expect(result.detectedLanguage).toBeNull()
      })

      it('handles whitespace-only code', () => {
        const result = detectLanguage('   \n   ')
        expect(result.isLikelyJavaScript).toBe(true)
      })
    })

    describe('Python code', () => {
      it('detects Python function definition', () => {
        const result = detectLanguage('def hello():\n  print("hi")')
        expect(result.isLikelyJavaScript).toBe(false)
        expect(result.detectedLanguage).toBe('python')
      })

      it('detects Python True/False/None', () => {
        const result = detectLanguage('x = True\ny = False\nz = None')
        expect(result.isLikelyJavaScript).toBe(false)
        expect(result.detectedLanguage).toBe('python')
      })

      it('detects Python elif', () => {
        const result = detectLanguage('if x > 5:\n  pass\nelif x > 0:\n  pass')
        expect(result.isLikelyJavaScript).toBe(false)
        expect(result.detectedLanguage).toBe('python')
      })

      it('detects Python import', () => {
        const result = detectLanguage('import os\nfrom sys import path')
        expect(result.isLikelyJavaScript).toBe(false)
        expect(result.detectedLanguage).toBe('python')
      })

      it('detects Python class definition', () => {
        const result = detectLanguage('class MyClass:\n  def __init__(self):\n    pass')
        expect(result.isLikelyJavaScript).toBe(false)
        expect(result.detectedLanguage).toBe('python')
      })

      it('provides helpful suggestion for Python', () => {
        const result = detectLanguage('def hello():\n  print("hi")')
        expect(result.suggestion).toContain('function')
        expect(result.suggestion).toContain('console.log')
      })
    })

    describe('Java code', () => {
      it('detects Java main method', () => {
        const result = detectLanguage('public static void main(String[] args) {}')
        expect(result.isLikelyJavaScript).toBe(false)
        expect(result.detectedLanguage).toBe('java')
      })

      it('detects Java System.out.println', () => {
        const result = detectLanguage('System.out.println("Hello");')
        expect(result.isLikelyJavaScript).toBe(false)
        expect(result.detectedLanguage).toBe('java')
      })

      it('detects Java public class', () => {
        const result = detectLanguage('public class Main {\n  public static void main(String[] args) {}\n}')
        expect(result.isLikelyJavaScript).toBe(false)
        expect(result.detectedLanguage).toBe('java')
      })

      it('provides helpful suggestion for Java', () => {
        const result = detectLanguage('System.out.println("Hello");')
        expect(result.suggestion).toContain('console.log')
      })
    })

    describe('C/C++ code', () => {
      it('detects C #include directive', () => {
        const result = detectLanguage('#include <stdio.h>\nint main() { return 0; }')
        expect(result.isLikelyJavaScript).toBe(false)
        expect(result.detectedLanguage).toBe('c-cpp')
      })

      it('detects C printf', () => {
        const result = detectLanguage('printf("Hello %s", name);')
        expect(result.isLikelyJavaScript).toBe(false)
        expect(result.detectedLanguage).toBe('c-cpp')
      })

      it('detects C++ cout', () => {
        const result = detectLanguage('std::cout << "Hello" << std::endl;')
        expect(result.isLikelyJavaScript).toBe(false)
        expect(result.detectedLanguage).toBe('c-cpp')
      })
    })

    describe('Go code', () => {
      it('detects Go package main', () => {
        const result = detectLanguage('package main\n\nfunc main() {\n  fmt.Println("hello")\n}')
        expect(result.isLikelyJavaScript).toBe(false)
        expect(result.detectedLanguage).toBe('go')
      })

      it('detects Go short variable declaration', () => {
        const result = detectLanguage('func main() {\n  x := 5\n  fmt.Println(x)\n}')
        expect(result.isLikelyJavaScript).toBe(false)
        expect(result.detectedLanguage).toBe('go')
      })
    })

    describe('Plain text', () => {
      it('detects plain English text', () => {
        const result = detectLanguage('Hello, how are you today? I hope you are doing well.')
        expect(result.isLikelyJavaScript).toBe(false)
        expect(result.detectedLanguage).toBe('plain-text')
      })

      it('detects greeting text', () => {
        const result = detectLanguage('Dear John, thank you for your message.')
        expect(result.isLikelyJavaScript).toBe(false)
        expect(result.detectedLanguage).toBe('plain-text')
      })
    })

    describe('hints', () => {
      it('provides line numbers in hints', () => {
        const result = detectLanguage('def hello():\n  pass\n\ndef world():\n  pass')
        expect(result.hints.length).toBeGreaterThan(0)
        expect(result.hints[0].line).toBeDefined()
      })

      it('limits hints to top 3', () => {
        const pythonCode = `
def a(): pass
def b(): pass
def c(): pass
def d(): pass
def e(): pass
`
        const result = detectLanguage(pythonCode)
        expect(result.hints.length).toBeLessThanOrEqual(3)
      })
    })
  })

  describe('getLanguageDisplayName', () => {
    it('returns Python', () => {
      expect(getLanguageDisplayName('python')).toBe('Python')
    })

    it('returns Java', () => {
      expect(getLanguageDisplayName('java')).toBe('Java')
    })

    it('returns C/C++', () => {
      expect(getLanguageDisplayName('c-cpp')).toBe('C/C++')
    })

    it('returns Go', () => {
      expect(getLanguageDisplayName('go')).toBe('Go')
    })

    it('returns plain text', () => {
      expect(getLanguageDisplayName('plain-text')).toBe('plain text')
    })
  })
})
