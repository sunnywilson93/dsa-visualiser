'use client'

import { useRef, useEffect, useCallback } from 'react'
import Editor, { OnMount, Monaco } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'
import { Zap } from 'lucide-react'
import styles from './PlaygroundEditor.module.css'

interface PlaygroundEditorProps {
  code: string
  onChange: (code: string) => void
  onAnalyze: () => void
  currentLine?: number
  error?: string | null
}

export function PlaygroundEditor({
  code,
  onChange,
  onAnalyze,
  currentLine,
  error,
}: PlaygroundEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const monacoRef = useRef<Monaco | null>(null)
  const decorationsRef = useRef<string[]>([])

  const handleEditorMount: OnMount = useCallback((editor, monaco) => {
    editorRef.current = editor
    monacoRef.current = monaco

    monaco.editor.defineTheme('playground-dark', {
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
        'editor.background': '#0d1117',
        'editor.foreground': '#e6edf3',
        'editor.lineHighlightBackground': '#1a1f2600',
        'editorLineNumber.foreground': '#6e7681',
        'editorLineNumber.activeForeground': '#e6edf3',
        'editor.selectionBackground': '#264f78',
        'editorCursor.foreground': '#58a6ff',
        'editorGutter.background': '#0d1117',
      },
    })

    monaco.editor.setTheme('playground-dark')

    // Add keyboard shortcut for analyze
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onAnalyze()
    })
  }, [onAnalyze])

  // Update decorations when current line changes
  useEffect(() => {
    const editor = editorRef.current
    const monaco = monacoRef.current

    if (!editor || !monaco) return

    const decorations: editor.IModelDeltaDecoration[] = []

    // Current execution line highlight
    if (currentLine !== undefined && currentLine >= 0) {
      const line = currentLine + 1 // Convert from 0-indexed to 1-indexed
      decorations.push({
        range: new monaco.Range(line, 1, line, 1),
        options: {
          isWholeLine: true,
          className: styles.currentLine,
          glyphMarginClassName: styles.currentLineGlyph,
        },
      })

      // Scroll to current line
      editor.revealLineInCenter(line)
    }

    decorationsRef.current = editor.deltaDecorations(
      decorationsRef.current,
      decorations
    )
  }, [currentLine])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>Code</span>
        <button
          className={styles.analyzeBtn}
          onClick={onAnalyze}
          title="Analyze (Ctrl+Enter)"
        >
          <Zap size={14} />
          Analyze
        </button>
      </div>

      <div className={styles.editorWrapper}>
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={code}
          onChange={(value) => onChange(value ?? '')}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
            lineNumbers: 'on',
            glyphMargin: true,
            folding: false,
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

      {error && (
        <div className={styles.errorPanel}>
          <span className={styles.errorIcon}>!</span>
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
