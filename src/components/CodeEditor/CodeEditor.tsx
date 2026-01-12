import { useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import Editor, { OnMount, Monaco } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'
import { Lightbulb } from 'lucide-react'
import { useExecutionStore, useCurrentStep } from '@/store'
import styles from './CodeEditor.module.css'

interface CodeEditorProps {
  className?: string
  readOnly?: boolean
  conceptLink?: string
}

export function CodeEditor({ className, readOnly = false, conceptLink }: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const monacoRef = useRef<Monaco | null>(null)
  const decorationsRef = useRef<string[]>([])

  const code = useExecutionStore(state => state.code)
  const setCode = useExecutionStore(state => state.setCode)
  const breakpoints = useExecutionStore(state => state.breakpoints)
  const toggleBreakpoint = useExecutionStore(state => state.toggleBreakpoint)
  const parseError = useExecutionStore(state => state.parseError)
  const status = useExecutionStore(state => state.status)
  const currentStep = useCurrentStep()

  const handleEditorMount: OnMount = useCallback((editor, monaco) => {
    editorRef.current = editor
    monacoRef.current = monaco

    // Configure editor theme
    monaco.editor.defineTheme('dsa-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6a737d', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'ff7b72' },
        { token: 'string', foreground: 'a5d6ff' },
        { token: 'number', foreground: '79c0ff' },
        { token: 'identifier', foreground: 'c9d1d9' },
        { token: 'type', foreground: 'ffa657' },
        { token: 'function', foreground: 'd2a8ff' },
      ],
      colors: {
        'editor.background': '#0f1419',
        'editor.foreground': '#e6edf3',
        'editor.lineHighlightBackground': '#1a1f2600',
        'editorLineNumber.foreground': '#6e7681',
        'editorLineNumber.activeForeground': '#e6edf3',
        'editor.selectionBackground': '#264f78',
        'editorCursor.foreground': '#58a6ff',
        'editorGutter.background': '#0f1419',
      },
    })

    monaco.editor.setTheme('dsa-dark')

    // Handle breakpoint clicks in gutter
    editor.onMouseDown((e) => {
      if (e.target.type === monaco.editor.MouseTargetType.GUTTER_LINE_NUMBERS) {
        const lineNumber = e.target.position?.lineNumber
        if (lineNumber) {
          toggleBreakpoint(lineNumber)
        }
      }
    })
  }, [toggleBreakpoint])

  // Update decorations when step or breakpoints change
  useEffect(() => {
    const editor = editorRef.current
    const monaco = monacoRef.current

    if (!editor || !monaco) return

    const decorations: editor.IModelDeltaDecoration[] = []

    // Breakpoint decorations
    for (const bp of breakpoints) {
      if (bp.enabled) {
        decorations.push({
          range: new monaco.Range(bp.line, 1, bp.line, 1),
          options: {
            isWholeLine: true,
            className: styles.breakpointLine,
            glyphMarginClassName: styles.breakpointGlyph,
          },
        })
      }
    }

    // Current execution line
    if (currentStep && status !== 'idle') {
      const line = currentStep.location.line

      decorations.push({
        range: new monaco.Range(line, 1, line, 1),
        options: {
          isWholeLine: true,
          className: styles.currentLine,
          glyphMarginClassName: styles.currentLineGlyph,
        },
      })
    }

    // Parse error
    if (parseError && parseError.line) {
      decorations.push({
        range: new monaco.Range(parseError.line, 1, parseError.line, 1),
        options: {
          isWholeLine: true,
          className: styles.errorLine,
        },
      })
    }

    decorationsRef.current = editor.deltaDecorations(
      decorationsRef.current,
      decorations
    )
  }, [currentStep, breakpoints, parseError, status])

  // Scroll to current line during execution
  useEffect(() => {
    const editor = editorRef.current

    if (!editor || !currentStep || status === 'idle') return

    const line = currentStep.location.line
    editor.revealLineInCenter(line)
  }, [currentStep, status])

  const isReadOnly = readOnly || status !== 'idle'

  return (
    <div className={`${styles.container} ${className ?? ''}`}>
      <div className={styles.header}>
        <span className={styles.title}>Code Editor</span>
        <div className={styles.headerRight}>
          {conceptLink && (
            <Link to={conceptLink} className={styles.conceptBtn} title="Learn the concept">
              <Lightbulb size={14} />
            </Link>
          )}
          <div className={styles.statusBadge}>
            {status === 'idle' && 'Ready'}
            {status === 'running' && 'Running'}
            {status === 'paused' && 'Paused'}
            {status === 'stepping' && 'Stepping'}
            {status === 'completed' && 'Completed'}
            {status === 'error' && 'Error'}
          </div>
        </div>
      </div>

      <div className={styles.editorWrapper}>
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={code}
          onChange={(value) => setCode(value ?? '')}
          options={{
            readOnly: isReadOnly,
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: 'var(--font-mono)',
            lineNumbers: 'on',
            glyphMargin: true,
            folding: true,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            padding: { top: 12, bottom: 12 },
            cursorBlinking: 'smooth',
            smoothScrolling: true,
            renderLineHighlight: 'none',
          }}
          onMount={handleEditorMount}
          loading={
            <div className={styles.loading}>Loading editor...</div>
          }
        />
      </div>

      {parseError && (
        <div className={styles.errorPanel}>
          <span className={styles.errorIcon}>!</span>
          <span>
            {parseError.line && `Line ${parseError.line}: `}
            {parseError.message}
          </span>
        </div>
      )}
    </div>
  )
}
