'use client'

import { useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Editor, { OnMount, Monaco } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'
import { Lightbulb } from 'lucide-react'
import { useExecutionStore, useCurrentStep } from '@/store'

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
            className: 'monaco-breakpoint-line',
            glyphMarginClassName: 'monaco-breakpoint-glyph',
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
          className: 'monaco-current-line',
          glyphMarginClassName: 'monaco-current-line-glyph',
        },
      })
    }

    // Parse error
    if (parseError && parseError.line) {
      decorations.push({
        range: new monaco.Range(parseError.line, 1, parseError.line, 1),
        options: {
          isWholeLine: true,
          className: 'monaco-error-line',
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
    <div className={`flex flex-col h-full bg-bg-secondary border border-border-primary rounded-lg overflow-hidden ${className ?? ''}`}>
      <div className="flex items-center justify-between py-2 px-3 bg-bg-tertiary border-b border-border-primary">
        <span className="text-sm font-semibold uppercase tracking-tight text-text-secondary">
          Code Editor
        </span>
        <div className="flex items-center gap-1">
          {conceptLink && (
            <Link
              href={conceptLink}
              className="flex items-center justify-center w-6 h-6 rounded-sm bg-amber-30 text-accent-yellow transition-all duration-150 hover:bg-amber-40 hover:scale-105"
              title="Learn the concept"
            >
              <Lightbulb size={14} />
            </Link>
          )}
          <div className="text-xs font-medium py-0.5 px-2 rounded-sm bg-bg-elevated text-text-secondary">
            {status === 'idle' && 'Ready'}
            {status === 'running' && 'Running'}
            {status === 'paused' && 'Paused'}
            {status === 'stepping' && 'Stepping'}
            {status === 'completed' && 'Completed'}
            {status === 'error' && 'Error'}
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0">
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
            <div className="flex items-center justify-center h-full text-text-muted text-base">
              Loading editor...
            </div>
          }
        />
      </div>

      {parseError && (
        <div className="flex items-center gap-2 py-2 px-3 bg-red-15 border-t border-red-15 text-accent-red text-base">
          <span className="flex items-center justify-center w-[18px] h-[18px] bg-accent-red text-bg-primary rounded-full text-sm font-bold">
            !
          </span>
          <span>
            {parseError.line && `Line ${parseError.line}: `}
            {parseError.message}
          </span>
        </div>
      )}
    </div>
  )
}
