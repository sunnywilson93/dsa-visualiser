import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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
    <div className="flex flex-col gap-6">
      {/* Level selector */}
      <div className="flex gap-2 justify-center mb-1 p-1.5 bg-black/30 border border-white/[0.08] rounded-full">
        {(Object.keys(levelInfo) as Level[]).map(lvl => (
          <button
            key={lvl}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-full cursor-pointer transition-all duration-200 ${
              level === lvl
                ? 'text-white'
                : 'bg-white/[0.04] border border-white/[0.08] text-gray-500 hover:bg-white/[0.08] hover:text-gray-300'
            }`}
            onClick={() => handleLevelChange(lvl)}
            style={{
              borderColor: level === lvl ? levelInfo[lvl].color : undefined,
              background: level === lvl ? `${levelInfo[lvl].color}15` : undefined
            }}
          >
            <span className="w-4 h-4 rounded-full" style={{ background: levelInfo[lvl].color }} />
            {levelInfo[lvl].label}
          </button>
        ))}
      </div>

      {/* Example selector */}
      <div className="flex gap-2 flex-wrap justify-center p-1.5 bg-black/30 border border-white/[0.08] rounded-full">
        {currentExamples.map((ex, i) => (
          <button
            key={ex.id}
            className={`px-4 py-1.5 font-mono text-sm rounded-full cursor-pointer transition-all duration-200 ${
              exampleIndex === i
                ? 'text-white'
                : 'bg-white/[0.04] border border-white/[0.08] text-gray-500 hover:bg-white/[0.08] hover:text-gray-300'
            }`}
            onClick={() => handleExampleChange(i)}
            style={{
              borderColor: exampleIndex === i ? 'rgba(59, 130, 246, 0.7)' : undefined,
              background: exampleIndex === i ? 'rgba(59, 130, 246, 0.18)' : undefined,
              boxShadow: exampleIndex === i ? '0 0 20px rgba(59, 130, 246, 0.25)' : undefined
            }}
          >
            {ex.title}
          </button>
        ))}
      </div>

      {/* Code panel */}
      <div className="rounded-xl overflow-hidden border border-white/[0.08] bg-black/40">
        <div className="flex justify-between items-center px-4 py-2 text-xs font-semibold text-gray-500 bg-white/5">
          <span>Code</span>
          {currentStep.backpressure && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold text-white bg-red-500 animate-pulse">
              BACKPRESSURE!
            </span>
          )}
        </div>
        <pre className="m-0 py-2 px-0 max-h-[160px] overflow-y-auto font-mono">
          {currentExample.code.map((line, i) => (
            <div
              key={i}
              ref={el => { lineRefs.current[i] = el }}
              className={`flex px-3 py-0.5 transition-colors duration-200 ${
                currentStep.codeLine === i ? 'bg-blue-500/20' : ''
              }`}
            >
              <span className="w-6 text-gray-600 font-mono text-[10px] select-none">{i + 1}</span>
              <span className={`font-mono text-[10px] ${currentStep.codeLine === i ? 'text-blue-300' : 'text-gray-300'}`}>
                {line || ' '}
              </span>
            </div>
          ))}
        </pre>
      </div>

      {/* Streams visualization - Neon Box */}
      {currentStep.streams.length > 0 && (
        <div className="relative rounded-xl p-[3px]" style={{ background: 'var(--gradient-neon-blue)' }}>
          <div className="absolute -top-px left-1/2 -translate-x-1/2 px-6 py-1 bg-gray-800 rounded-b-lg text-sm font-semibold text-white whitespace-nowrap z-10">
            Stream Pipeline
          </div>
          <div className="bg-[var(--color-bg-page-secondary,#0f172a)] rounded-lg min-h-[60px] p-4 pt-6">
            <div className="flex gap-2 items-center flex-wrap justify-center">
              {currentStep.streams.map((stream) => (
                <motion.div
                  key={stream.name}
                  className={`flex-1 min-w-[100px] max-w-[150px] rounded-lg overflow-hidden border-2 relative ${
                    stream.type === 'readable' ? 'border-blue-500/50 bg-blue-500/[0.08]' :
                    stream.type === 'transform' ? 'border-blue-400/50 bg-blue-400/[0.08]' :
                    'border-emerald-500/50 bg-emerald-500/[0.08]'
                  } ${stream.flowing ? 'shadow-[0_0_12px_rgba(59,130,246,0.3)]' : ''} ${stream.paused ? 'opacity-60 border-red-500/50' : ''}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex justify-between px-2 py-1 text-[10px] font-semibold text-gray-300 bg-white/5">
                    {stream.name}
                    <span className="text-[10px] text-gray-500 font-normal">{stream.type}</span>
                  </div>
                  <div className="p-1.5 min-h-[50px] flex flex-wrap gap-1">
                    <AnimatePresence mode="popLayout">
                      {stream.chunks.map((chunk, j) => (
                        <motion.div
                          key={chunk + j}
                          className="px-1.5 py-0.5 bg-blue-500/20 rounded text-[10px] font-mono text-blue-300"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8, x: 20 }}
                        >
                          {chunk}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  {stream.flowing && <div className="absolute right-1 bottom-1 text-xs text-emerald-500">▶</div>}
                  {stream.paused && <div className="absolute right-1 bottom-1 text-xs text-red-500">⏸</div>}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Buffer visualization - Neon Box */}
      {currentStep.buffer.length > 0 && (
        <div className="relative rounded-xl p-[3px]" style={{ background: 'var(--gradient-neon-orange)' }}>
          <div className="absolute -top-px left-1/2 -translate-x-1/2 px-6 py-1 bg-gray-800 rounded-b-lg text-sm font-semibold text-white whitespace-nowrap z-10">
            Internal Buffer
          </div>
          <div className="bg-[var(--color-bg-page-secondary,#0f172a)] rounded-lg min-h-[60px] p-4 pt-6">
            <div className="text-[10px] text-gray-500 mb-1 text-center">
              ({currentStep.buffer.length}/{currentStep.bufferMax}KB)
            </div>
            <div className="h-4 bg-white/10 rounded overflow-hidden mb-1">
              <div
                className={`h-full transition-all duration-300 ${
                  currentStep.backpressure 
                    ? 'bg-gradient-to-r from-red-500 to-orange-500' 
                    : 'bg-gradient-to-r from-blue-500 to-cyan-400'
                }`}
                style={{ width: `${(currentStep.buffer.length / currentStep.bufferMax) * 100}%` }}
              />
            </div>
            <div className="flex gap-1 flex-wrap">
              {currentStep.buffer.map((item, i) => (
                <span key={i} className="px-1 py-0.5 bg-blue-500/20 rounded text-[10px] font-mono text-blue-300">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Output - Neon Box */}
      {currentStep.output.length > 0 && (
        <div className="relative rounded-xl p-[3px]" style={{ background: 'var(--gradient-neon-emerald)' }}>
          <div className="absolute -top-px left-1/2 -translate-x-1/2 px-6 py-1 bg-gray-800 rounded-b-lg text-sm font-semibold text-white whitespace-nowrap z-10">
            Console Output
          </div>
          <div className="bg-[var(--color-bg-page-secondary,#0f172a)] rounded-lg min-h-[50px] p-4 pt-6 flex items-center gap-3">
            <div className="flex gap-3 items-center flex-wrap">
              <span className="text-[10px] text-gray-500">Output:</span>
              {currentStep.output.map((item, i) => (
                <span key={i} className="font-mono text-xs text-emerald-500">{item}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step description */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${level}-${exampleIndex}-${stepIndex}`}
          className="px-4 py-2.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-base text-gray-300 text-center"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
        >
          <span className="inline-block px-1.5 py-0.5 bg-blue-500/30 rounded text-[10px] font-semibold text-blue-300 mr-2">
            Step {stepIndex + 1}/{currentExample.steps.length}
          </span>
          {currentStep.description}
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="flex gap-2 justify-center">
        <button 
          className="px-4 py-2 text-xs bg-white/5 border border-white/10 rounded-md text-gray-400 cursor-pointer transition-all duration-200 hover:bg-white/10 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={handlePrev} 
          disabled={stepIndex === 0}
        >
          Prev
        </button>
        <motion.button
          className="px-6 py-2 text-base font-medium bg-gradient-to-r from-blue-500 to-cyan-500 border-0 rounded-md text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleNext}
          disabled={stepIndex >= currentExample.steps.length - 1}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {stepIndex >= currentExample.steps.length - 1 ? 'Done' : 'Next'}
        </motion.button>
        <button 
          className="px-4 py-2 text-xs bg-white/5 border border-white/10 rounded-md text-gray-400 cursor-pointer transition-all duration-200 hover:bg-white/10 hover:text-white"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>

      {/* Key insight */}
      <div className="px-4 py-2 bg-blue-500/[0.08] border border-blue-500/20 rounded-lg text-xs text-gray-500 text-center">
        <strong className="text-blue-500">Key Insight:</strong> {currentExample.insight}
      </div>
    </div>
  )
}
