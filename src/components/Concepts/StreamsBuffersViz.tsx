import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './StreamsBuffersViz.module.css'

interface StreamState {
  name: string
  type: 'readable' | 'transform' | 'writable'
  chunks: string[]
  flowing: boolean
  paused?: boolean
}

interface Step {
  description: string
  codeLine: number
  streams: StreamState[]
  buffer: string[]
  bufferMax: number
  backpressure: boolean
  output: string[]
}

interface Example {
  id: string
  title: string
  code: string[]
  steps: Step[]
  insight: string
}

type Level = 'beginner' | 'intermediate' | 'advanced'

const levelInfo: Record<Level, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: '#10b981' },
  intermediate: { label: 'Intermediate', color: '#f59e0b' },
  advanced: { label: 'Advanced', color: '#ef4444' }
}

const examples: Record<Level, Example[]> = {
  beginner: [
    {
      id: 'read-stream',
      title: 'Reading a File Stream',
      code: [
        "const fs = require('fs');",
        "",
        "const stream = fs.createReadStream('file.txt');",
        "",
        "stream.on('data', (chunk) => {",
        "  console.log('Chunk:', chunk.length);",
        "});",
        "",
        "stream.on('end', () => {",
        "  console.log('Done!');",
        "});",
      ],
      steps: [
        {
          description: 'File stream created but not yet flowing',
          codeLine: 2,
          streams: [
            { name: 'file.txt', type: 'readable', chunks: ['chunk1', 'chunk2', 'chunk3'], flowing: false },
          ],
          buffer: [],
          bufferMax: 64,
          backpressure: false,
          output: [],
        },
        {
          description: "Adding 'data' event listener starts the flow",
          codeLine: 4,
          streams: [
            { name: 'file.txt', type: 'readable', chunks: ['chunk1', 'chunk2', 'chunk3'], flowing: true },
          ],
          buffer: ['chunk1'],
          bufferMax: 64,
          backpressure: false,
          output: [],
        },
        {
          description: 'First chunk (16KB) arrives',
          codeLine: 5,
          streams: [
            { name: 'file.txt', type: 'readable', chunks: ['chunk2', 'chunk3'], flowing: true },
          ],
          buffer: [],
          bufferMax: 64,
          backpressure: false,
          output: ['Chunk: 16384'],
        },
        {
          description: 'Second chunk arrives',
          codeLine: 5,
          streams: [
            { name: 'file.txt', type: 'readable', chunks: ['chunk3'], flowing: true },
          ],
          buffer: [],
          bufferMax: 64,
          backpressure: false,
          output: ['Chunk: 16384', 'Chunk: 16384'],
        },
        {
          description: 'Last chunk arrives',
          codeLine: 5,
          streams: [
            { name: 'file.txt', type: 'readable', chunks: [], flowing: true },
          ],
          buffer: [],
          bufferMax: 64,
          backpressure: false,
          output: ['Chunk: 16384', 'Chunk: 16384', 'Chunk: 8192'],
        },
        {
          description: "'end' event fires - stream exhausted",
          codeLine: 9,
          streams: [
            { name: 'file.txt', type: 'readable', chunks: [], flowing: false },
          ],
          buffer: [],
          bufferMax: 64,
          backpressure: false,
          output: ['Chunk: 16384', 'Chunk: 16384', 'Chunk: 8192', 'Done!'],
        },
      ],
      insight: 'Streams process data in chunks (default 16KB). Memory efficient - never loads entire file!'
    },
    {
      id: 'buffer-basics',
      title: 'Buffer Basics',
      code: [
        "// Buffer = fixed-size binary data",
        "",
        "const buf = Buffer.from('Hello');",
        "console.log(buf);",
        "// <Buffer 48 65 6c 6c 6f>",
        "",
        "buf.toString();  // 'Hello'",
        "buf[0];          // 72 (ASCII 'H')",
        "buf.length;      // 5 bytes",
      ],
      steps: [
        {
          description: "Buffer.from('Hello') creates binary representation",
          codeLine: 2,
          streams: [],
          buffer: ['48', '65', '6c', '6c', '6f'],
          bufferMax: 5,
          backpressure: false,
          output: [],
        },
        {
          description: 'Each byte is the ASCII code for the character',
          codeLine: 3,
          streams: [],
          buffer: ['H=48', 'e=65', 'l=6c', 'l=6c', 'o=6f'],
          bufferMax: 5,
          backpressure: false,
          output: ['<Buffer 48 65 6c 6c 6f>'],
        },
        {
          description: '.toString() converts back to string',
          codeLine: 6,
          streams: [],
          buffer: ['H', 'e', 'l', 'l', 'o'],
          bufferMax: 5,
          backpressure: false,
          output: ['<Buffer 48 65 6c 6c 6f>', "'Hello'"],
        },
        {
          description: 'Buffers are array-like - access by index',
          codeLine: 7,
          streams: [],
          buffer: ['[0]=72', 'e', 'l', 'l', 'o'],
          bufferMax: 5,
          backpressure: false,
          output: ['<Buffer 48 65 6c 6c 6f>', "'Hello'", '72'],
        },
      ],
      insight: 'Buffers hold raw binary data. Essential for files, network, and non-text data!'
    },
  ],
  intermediate: [
    {
      id: 'pipe-streams',
      title: 'Piping Streams',
      code: [
        "const fs = require('fs');",
        "const zlib = require('zlib');",
        "",
        "fs.createReadStream('input.txt')",
        "  .pipe(zlib.createGzip())",
        "  .pipe(fs.createWriteStream('output.gz'));",
        "",
        "// Automatic backpressure handling!",
      ],
      steps: [
        {
          description: 'Three streams connected via pipe()',
          codeLine: 3,
          streams: [
            { name: 'input.txt', type: 'readable', chunks: ['data...'], flowing: false },
            { name: 'gzip', type: 'transform', chunks: [], flowing: false },
            { name: 'output.gz', type: 'writable', chunks: [], flowing: false },
          ],
          buffer: [],
          bufferMax: 64,
          backpressure: false,
          output: [],
        },
        {
          description: 'Data flows: Readable → Transform → Writable',
          codeLine: 4,
          streams: [
            { name: 'input.txt', type: 'readable', chunks: [], flowing: true },
            { name: 'gzip', type: 'transform', chunks: ['compressed'], flowing: true },
            { name: 'output.gz', type: 'writable', chunks: [], flowing: true },
          ],
          buffer: ['raw data'],
          bufferMax: 64,
          backpressure: false,
          output: [],
        },
        {
          description: 'Transform compresses, Writable writes to disk',
          codeLine: 5,
          streams: [
            { name: 'input.txt', type: 'readable', chunks: [], flowing: true },
            { name: 'gzip', type: 'transform', chunks: [], flowing: true },
            { name: 'output.gz', type: 'writable', chunks: ['compressed'], flowing: true },
          ],
          buffer: [],
          bufferMax: 64,
          backpressure: false,
          output: ['Writing compressed data...'],
        },
        {
          description: 'pipe() handles backpressure automatically!',
          codeLine: 7,
          streams: [
            { name: 'input.txt', type: 'readable', chunks: [], flowing: true },
            { name: 'gzip', type: 'transform', chunks: [], flowing: true },
            { name: 'output.gz', type: 'writable', chunks: [], flowing: true },
          ],
          buffer: [],
          bufferMax: 64,
          backpressure: false,
          output: ['Writing compressed data...', 'Done!'],
        },
      ],
      insight: 'pipe() chains streams and handles backpressure. Use it instead of manual data events!'
    },
    {
      id: 'transform-stream',
      title: 'Transform Streams',
      code: [
        "const { Transform } = require('stream');",
        "",
        "const upper = new Transform({",
        "  transform(chunk, enc, callback) {",
        "    const str = chunk.toString().toUpperCase();",
        "    callback(null, str);",
        "  }",
        "});",
        "",
        "process.stdin.pipe(upper).pipe(process.stdout);",
      ],
      steps: [
        {
          description: 'Transform stream modifies data as it flows through',
          codeLine: 2,
          streams: [
            { name: 'stdin', type: 'readable', chunks: ['hello'], flowing: false },
            { name: 'Transform', type: 'transform', chunks: [], flowing: false },
            { name: 'stdout', type: 'writable', chunks: [], flowing: false },
          ],
          buffer: [],
          bufferMax: 16,
          backpressure: false,
          output: [],
        },
        {
          description: "Input 'hello' enters transform",
          codeLine: 4,
          streams: [
            { name: 'stdin', type: 'readable', chunks: [], flowing: true },
            { name: 'Transform', type: 'transform', chunks: ['hello'], flowing: true },
            { name: 'stdout', type: 'writable', chunks: [], flowing: false },
          ],
          buffer: ['hello'],
          bufferMax: 16,
          backpressure: false,
          output: [],
        },
        {
          description: 'transform() converts to uppercase',
          codeLine: 5,
          streams: [
            { name: 'stdin', type: 'readable', chunks: [], flowing: true },
            { name: 'Transform', type: 'transform', chunks: [], flowing: true },
            { name: 'stdout', type: 'writable', chunks: ['HELLO'], flowing: true },
          ],
          buffer: [],
          bufferMax: 16,
          backpressure: false,
          output: ['HELLO'],
        },
      ],
      insight: 'Transform streams are both readable AND writable. Perfect for data processing pipelines!'
    },
  ],
  advanced: [
    {
      id: 'backpressure',
      title: 'Backpressure',
      code: [
        "readable.on('data', (chunk) => {",
        "  const ok = writable.write(chunk);",
        "",
        "  if (!ok) {",
        "    // Buffer full! Pause reading",
        "    readable.pause();",
        "    writable.once('drain', () => {",
        "      readable.resume();",
        "    });",
        "  }",
        "});",
      ],
      steps: [
        {
          description: 'Readable produces data faster than writable can consume',
          codeLine: 0,
          streams: [
            { name: 'readable', type: 'readable', chunks: ['1', '2', '3', '4', '5'], flowing: true },
            { name: 'writable', type: 'writable', chunks: [], flowing: true },
          ],
          buffer: ['1', '2'],
          bufferMax: 4,
          backpressure: false,
          output: [],
        },
        {
          description: 'write() returns false - internal buffer is full!',
          codeLine: 1,
          streams: [
            { name: 'readable', type: 'readable', chunks: ['3', '4', '5'], flowing: true },
            { name: 'writable', type: 'writable', chunks: [], flowing: true },
          ],
          buffer: ['1', '2', '3', '4'],
          bufferMax: 4,
          backpressure: true,
          output: ['write() returned false'],
        },
        {
          description: 'BACKPRESSURE! Pause reading to prevent memory overflow',
          codeLine: 5,
          streams: [
            { name: 'readable', type: 'readable', chunks: ['3', '4', '5'], flowing: false, paused: true },
            { name: 'writable', type: 'writable', chunks: [], flowing: true },
          ],
          buffer: ['1', '2', '3', '4'],
          bufferMax: 4,
          backpressure: true,
          output: ['write() returned false', 'PAUSED!'],
        },
        {
          description: "'drain' event: buffer drained, resume reading",
          codeLine: 7,
          streams: [
            { name: 'readable', type: 'readable', chunks: ['3', '4', '5'], flowing: true },
            { name: 'writable', type: 'writable', chunks: [], flowing: true },
          ],
          buffer: [],
          bufferMax: 4,
          backpressure: false,
          output: ['write() returned false', 'PAUSED!', 'drain → RESUMED!'],
        },
      ],
      insight: 'Backpressure prevents memory explosion when producer is faster than consumer. pipe() handles this for you!'
    },
    {
      id: 'highwatermark',
      title: 'highWaterMark',
      code: [
        "const readable = fs.createReadStream('file.txt', {",
        "  highWaterMark: 16 * 1024  // 16KB (default)",
        "});",
        "",
        "const writable = fs.createWriteStream('out.txt', {",
        "  highWaterMark: 16 * 1024",
        "});",
        "",
        "// highWaterMark = buffer threshold",
        "// When reached, backpressure kicks in",
      ],
      steps: [
        {
          description: 'highWaterMark sets internal buffer size (default 16KB)',
          codeLine: 1,
          streams: [
            { name: 'readable', type: 'readable', chunks: ['...'], flowing: false },
          ],
          buffer: [],
          bufferMax: 16,
          backpressure: false,
          output: [],
        },
        {
          description: 'Data fills buffer up to highWaterMark',
          codeLine: 5,
          streams: [
            { name: 'readable', type: 'readable', chunks: [], flowing: true },
            { name: 'writable', type: 'writable', chunks: [], flowing: true },
          ],
          buffer: ['4KB', '4KB', '4KB', '4KB'],
          bufferMax: 16,
          backpressure: false,
          output: ['Buffer: 16KB / 16KB'],
        },
        {
          description: 'At highWaterMark: write() returns false',
          codeLine: 8,
          streams: [
            { name: 'readable', type: 'readable', chunks: ['more...'], flowing: false, paused: true },
            { name: 'writable', type: 'writable', chunks: [], flowing: true },
          ],
          buffer: ['4KB', '4KB', '4KB', '4KB'],
          bufferMax: 16,
          backpressure: true,
          output: ['Buffer: 16KB / 16KB', 'BACKPRESSURE!'],
        },
        {
          description: 'Larger highWaterMark = more memory, fewer pauses',
          codeLine: 9,
          streams: [],
          buffer: [],
          bufferMax: 64,
          backpressure: false,
          output: ['Tune based on use case!'],
        },
      ],
      insight: 'highWaterMark is the buffer size before backpressure. Larger = more throughput but more memory.'
    },
  ],
}

export function StreamsBuffersViz() {
  const [level, setLevel] = useState<Level>('beginner')
  const [exampleIndex, setExampleIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const lineRefs = useRef<(HTMLDivElement | null)[]>([])

  const currentExamples = examples[level]
  const currentExample = currentExamples[exampleIndex]
  const currentStep = currentExample.steps[stepIndex]

  useEffect(() => {
    const highlightedLine = currentStep.codeLine
    if (highlightedLine >= 0 && lineRefs.current[highlightedLine]) {
      lineRefs.current[highlightedLine]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }, [stepIndex, currentStep.codeLine])

  const handleLevelChange = (newLevel: Level) => {
    setLevel(newLevel)
    setExampleIndex(0)
    setStepIndex(0)
  }

  const handleExampleChange = (index: number) => {
    setExampleIndex(index)
    setStepIndex(0)
  }

  const handleNext = () => {
    if (stepIndex < currentExample.steps.length - 1) setStepIndex(s => s + 1)
  }

  const handlePrev = () => {
    if (stepIndex > 0) setStepIndex(s => s - 1)
  }

  const handleReset = () => setStepIndex(0)

  return (
    <div className={styles.container}>
      {/* Level selector */}
      <div className={styles.levelSelector}>
        {(Object.keys(levelInfo) as Level[]).map(lvl => (
          <button
            key={lvl}
            className={`${styles.levelBtn} ${level === lvl ? styles.activeLevel : ''}`}
            onClick={() => handleLevelChange(lvl)}
            style={{
              borderColor: level === lvl ? levelInfo[lvl].color : 'transparent',
              background: level === lvl ? `${levelInfo[lvl].color}15` : 'transparent'
            }}
          >
            <span className={styles.levelDot} style={{ background: levelInfo[lvl].color }}></span>
            {levelInfo[lvl].label}
          </button>
        ))}
      </div>

      {/* Example selector */}
      <div className={styles.exampleSelector}>
        {currentExamples.map((ex, i) => (
          <button
            key={ex.id}
            className={`${styles.exampleBtn} ${exampleIndex === i ? styles.active : ''}`}
            onClick={() => handleExampleChange(i)}
          >
            {ex.title}
          </button>
        ))}
      </div>

      {/* Code panel */}
      <div className={styles.codePanel}>
        <div className={styles.panelHeader}>
          <span>Code</span>
          {currentStep.backpressure && (
            <span className={styles.backpressureBadge}>BACKPRESSURE!</span>
          )}
        </div>
        <pre className={styles.code}>
          {currentExample.code.map((line, i) => (
            <div
              key={i}
              ref={el => { lineRefs.current[i] = el }}
              className={`${styles.codeLine} ${currentStep.codeLine === i ? styles.activeLine : ''}`}
            >
              <span className={styles.lineNum}>{i + 1}</span>
              <span className={styles.lineCode}>{line || ' '}</span>
            </div>
          ))}
        </pre>
      </div>

      {/* Streams visualization - Neon Box */}
      {currentStep.streams.length > 0 && (
        <div className={`${styles.neonBox} ${styles.streamsBox}`}>
          <div className={styles.neonBoxHeader}>Stream Pipeline</div>
          <div className={styles.neonBoxInner}>
            <div className={styles.streamsContainer}>
              {currentStep.streams.map((stream) => (
                <motion.div
                  key={stream.name}
                  className={`${styles.stream} ${styles[stream.type]} ${stream.flowing ? styles.flowing : ''} ${stream.paused ? styles.paused : ''}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className={styles.streamHeader}>
                    {stream.name}
                    <span className={styles.streamType}>{stream.type}</span>
                  </div>
                  <div className={styles.streamContent}>
                    <AnimatePresence mode="popLayout">
                      {stream.chunks.map((chunk, j) => (
                        <motion.div
                          key={chunk + j}
                          className={styles.chunk}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8, x: 20 }}
                        >
                          {chunk}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  {stream.flowing && <div className={styles.flowIndicator}>▶</div>}
                  {stream.paused && <div className={styles.pausedIndicator}>⏸</div>}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Buffer visualization - Neon Box */}
      {currentStep.buffer.length > 0 && (
        <div className={`${styles.neonBox} ${styles.bufferBox}`}>
          <div className={styles.neonBoxHeader}>Internal Buffer</div>
          <div className={styles.neonBoxInner}>
            <div className={styles.bufferHeader}>
              ({currentStep.buffer.length}/{currentStep.bufferMax}KB)
            </div>
            <div className={styles.bufferBar}>
              <div
                className={`${styles.bufferFill} ${currentStep.backpressure ? styles.full : ''}`}
                style={{ width: `${(currentStep.buffer.length / currentStep.bufferMax) * 100}%` }}
              />
            </div>
            <div className={styles.bufferContent}>
              {currentStep.buffer.map((item, i) => (
                <span key={i} className={styles.bufferItem}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Output - Neon Box */}
      {currentStep.output.length > 0 && (
        <div className={`${styles.neonBox} ${styles.outputBox}`}>
          <div className={styles.neonBoxHeader}>Console Output</div>
          <div className={styles.neonBoxInner}>
            <div className={styles.output}>
              <span className={styles.outputLabel}>Output:</span>
              {currentStep.output.map((item, i) => (
                <span key={i} className={styles.outputItem}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step description */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${level}-${exampleIndex}-${stepIndex}`}
          className={styles.description}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
        >
          <span className={styles.stepBadge}>Step {stepIndex + 1}/{currentExample.steps.length}</span>
          {currentStep.description}
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className={styles.controls}>
        <button className={styles.btnSecondary} onClick={handlePrev} disabled={stepIndex === 0}>
          Prev
        </button>
        <motion.button
          className={styles.btnPrimary}
          onClick={handleNext}
          disabled={stepIndex >= currentExample.steps.length - 1}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {stepIndex >= currentExample.steps.length - 1 ? 'Done' : 'Next'}
        </motion.button>
        <button className={styles.btnSecondary} onClick={handleReset}>
          Reset
        </button>
      </div>

      {/* Key insight */}
      <div className={styles.insight}>
        <strong>Key Insight:</strong> {currentExample.insight}
      </div>
    </div>
  )
}
