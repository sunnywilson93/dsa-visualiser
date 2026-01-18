'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './WebWorkersViz.module.css'

type Level = 'beginner' | 'intermediate' | 'advanced'

interface Message {
  id: string
  from: 'main' | 'worker'
  to: 'main' | 'worker'
  data: string
  status: 'pending' | 'sent' | 'received'
}

interface ThreadState {
  name: string
  status: 'idle' | 'busy' | 'blocked' | 'waiting'
  currentTask?: string
  progress?: number
}

interface Step {
  activeLine: number
  mainThread: ThreadState
  workerThread?: ThreadState
  messages: Message[]
  sharedBuffer?: number[]
  output: string[]
  description: string
}

interface Example {
  id: string
  name: string
  code: string
  steps: Step[]
}

interface LevelData {
  examples: Example[]
  insight: string
}

const levels: Record<Level, LevelData> = {
  beginner: {
    insight: "Web Workers run JavaScript in background threads, keeping the main thread responsive for UI updates.",
    examples: [
      {
        id: 'basic-worker',
        name: 'Creating a Worker',
        code: `// main.js
const worker = new Worker('worker.js');

worker.postMessage('Hello!');

worker.onmessage = (e) => {
  console.log('Reply:', e.data);
};

// worker.js
onmessage = (e) => {
  postMessage('Got: ' + e.data);
};`,
        steps: [
          {
            activeLine: 2,
            mainThread: { name: 'Main Thread', status: 'busy', currentTask: 'Creating worker' },
            messages: [],
            output: [],
            description: "Creating a new Web Worker spawns a separate JavaScript thread"
          },
          {
            activeLine: 4,
            mainThread: { name: 'Main Thread', status: 'idle' },
            workerThread: { name: 'Worker', status: 'waiting' },
            messages: [{ id: '1', from: 'main', to: 'worker', data: '"Hello!"', status: 'sent' }],
            output: [],
            description: "postMessage() sends data to the worker - data is copied, not shared"
          },
          {
            activeLine: 11,
            mainThread: { name: 'Main Thread', status: 'idle' },
            workerThread: { name: 'Worker', status: 'busy', currentTask: 'Processing message' },
            messages: [{ id: '1', from: 'main', to: 'worker', data: '"Hello!"', status: 'received' }],
            output: [],
            description: "Worker receives the message via its onmessage handler"
          },
          {
            activeLine: 12,
            mainThread: { name: 'Main Thread', status: 'waiting' },
            workerThread: { name: 'Worker', status: 'idle' },
            messages: [
              { id: '1', from: 'main', to: 'worker', data: '"Hello!"', status: 'received' },
              { id: '2', from: 'worker', to: 'main', data: '"Got: Hello!"', status: 'sent' }
            ],
            output: [],
            description: "Worker sends response back to main thread"
          },
          {
            activeLine: 7,
            mainThread: { name: 'Main Thread', status: 'busy', currentTask: 'Handling reply' },
            workerThread: { name: 'Worker', status: 'idle' },
            messages: [
              { id: '1', from: 'main', to: 'worker', data: '"Hello!"', status: 'received' },
              { id: '2', from: 'worker', to: 'main', data: '"Got: Hello!"', status: 'received' }
            ],
            output: ['Reply: Got: Hello!'],
            description: "Main thread receives worker's reply via onmessage"
          }
        ]
      },
      {
        id: 'heavy-computation',
        name: 'Offloading Work',
        code: `// Without worker - UI freezes!
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n-1) + fibonacci(n-2);
}
const result = fibonacci(45); // Blocks!

// With worker - UI stays responsive
worker.postMessage({ calc: 'fib', n: 45 });
worker.onmessage = (e) => {
  console.log('Result:', e.data);
};`,
        steps: [
          {
            activeLine: 6,
            mainThread: { name: 'Main Thread', status: 'blocked', currentTask: 'fibonacci(45)', progress: 30 },
            messages: [],
            output: [],
            description: "Without worker: heavy computation BLOCKS the main thread - no UI updates!"
          },
          {
            activeLine: 6,
            mainThread: { name: 'Main Thread', status: 'blocked', currentTask: 'fibonacci(45)', progress: 60 },
            messages: [],
            output: [],
            description: "User clicks, scrolls, types... nothing happens! The page is frozen"
          },
          {
            activeLine: 6,
            mainThread: { name: 'Main Thread', status: 'blocked', currentTask: 'fibonacci(45)', progress: 90 },
            messages: [],
            output: [],
            description: "Still computing... users see 'Page Unresponsive' warnings"
          },
          {
            activeLine: 9,
            mainThread: { name: 'Main Thread', status: 'idle' },
            workerThread: { name: 'Worker', status: 'busy', currentTask: 'fibonacci(45)', progress: 30 },
            messages: [{ id: '1', from: 'main', to: 'worker', data: '{calc:"fib",n:45}', status: 'received' }],
            output: [],
            description: "With worker: main thread is FREE while worker computes"
          },
          {
            activeLine: 9,
            mainThread: { name: 'Main Thread', status: 'idle' },
            workerThread: { name: 'Worker', status: 'busy', currentTask: 'fibonacci(45)', progress: 70 },
            messages: [{ id: '1', from: 'main', to: 'worker', data: '{calc:"fib",n:45}', status: 'received' }],
            output: [],
            description: "UI remains responsive - users can scroll, click, interact!"
          },
          {
            activeLine: 11,
            mainThread: { name: 'Main Thread', status: 'idle' },
            workerThread: { name: 'Worker', status: 'idle' },
            messages: [
              { id: '1', from: 'main', to: 'worker', data: '{calc:"fib",n:45}', status: 'received' },
              { id: '2', from: 'worker', to: 'main', data: '1134903170', status: 'received' }
            ],
            output: ['Result: 1134903170'],
            description: "Worker finishes and sends result back - best of both worlds!"
          }
        ]
      }
    ]
  },
  intermediate: {
    insight: "Workers have their own global scope, can't access DOM, and communicate via structured cloning (copying) or transferable objects.",
    examples: [
      {
        id: 'transferable',
        name: 'Transferable Objects',
        code: `// Large data - copying is slow!
const hugeArray = new Float32Array(1000000);

// Transfer ownership instead of copy
worker.postMessage(hugeArray, [hugeArray.buffer]);

console.log(hugeArray.length); // 0! - transferred

// Worker now owns the buffer
onmessage = (e) => {
  const data = e.data; // Full array here
  // Process and transfer back
};`,
        steps: [
          {
            activeLine: 2,
            mainThread: { name: 'Main Thread', status: 'busy', currentTask: 'Creating array' },
            messages: [],
            output: [],
            description: "Creating a large TypedArray (4MB of Float32 data)"
          },
          {
            activeLine: 5,
            mainThread: { name: 'Main Thread', status: 'busy', currentTask: 'Transferring...' },
            workerThread: { name: 'Worker', status: 'waiting' },
            messages: [{ id: '1', from: 'main', to: 'worker', data: 'Float32Array(1M)', status: 'sent' }],
            output: [],
            description: "Transfer list [hugeArray.buffer] - moves data instead of copying"
          },
          {
            activeLine: 7,
            mainThread: { name: 'Main Thread', status: 'idle' },
            workerThread: { name: 'Worker', status: 'busy', currentTask: 'Receiving data' },
            messages: [{ id: '1', from: 'main', to: 'worker', data: 'Float32Array(1M)', status: 'received' }],
            output: ['hugeArray.length: 0'],
            description: "After transfer, main thread's array is DETACHED (length 0)"
          },
          {
            activeLine: 11,
            mainThread: { name: 'Main Thread', status: 'idle' },
            workerThread: { name: 'Worker', status: 'busy', currentTask: 'Processing 1M items' },
            messages: [{ id: '1', from: 'main', to: 'worker', data: 'Float32Array(1M)', status: 'received' }],
            output: ['hugeArray.length: 0'],
            description: "Worker has full ownership - can read/write the entire buffer"
          }
        ]
      },
      {
        id: 'error-handling',
        name: 'Worker Errors',
        code: `const worker = new Worker('worker.js');

worker.onerror = (error) => {
  console.log('Error:', error.message);
  console.log('File:', error.filename);
  console.log('Line:', error.lineno);
};

// worker.js
const x = undefinedVar; // ReferenceError!`,
        steps: [
          {
            activeLine: 1,
            mainThread: { name: 'Main Thread', status: 'busy', currentTask: 'Creating worker' },
            messages: [],
            output: [],
            description: "Creating worker and setting up error handler"
          },
          {
            activeLine: 10,
            mainThread: { name: 'Main Thread', status: 'idle' },
            workerThread: { name: 'Worker', status: 'busy', currentTask: 'Executing code' },
            messages: [],
            output: [],
            description: "Worker starts executing and hits an error"
          },
          {
            activeLine: 4,
            mainThread: { name: 'Main Thread', status: 'busy', currentTask: 'Handling error' },
            workerThread: { name: 'Worker', status: 'idle' },
            messages: [{ id: '1', from: 'worker', to: 'main', data: 'ErrorEvent', status: 'received' }],
            output: ['Error: undefinedVar is not defined', 'File: worker.js', 'Line: 2'],
            description: "Worker errors bubble up to main thread's onerror handler"
          }
        ]
      },
      {
        id: 'worker-pool',
        name: 'Worker Pool Pattern',
        code: `// Create pool of workers
const pool = [
  new Worker('worker.js'),
  new Worker('worker.js'),
  new Worker('worker.js'),
];

// Distribute tasks across workers
tasks.forEach((task, i) => {
  pool[i % pool.length].postMessage(task);
});`,
        steps: [
          {
            activeLine: 2,
            mainThread: { name: 'Main Thread', status: 'busy', currentTask: 'Creating pool' },
            messages: [],
            output: [],
            description: "Creating multiple workers for parallel processing"
          },
          {
            activeLine: 9,
            mainThread: { name: 'Main Thread', status: 'idle' },
            workerThread: { name: 'Worker Pool (3)', status: 'busy', currentTask: 'Processing tasks' },
            messages: [
              { id: '1', from: 'main', to: 'worker', data: 'task[0]', status: 'sent' },
              { id: '2', from: 'main', to: 'worker', data: 'task[1]', status: 'sent' },
              { id: '3', from: 'main', to: 'worker', data: 'task[2]', status: 'sent' }
            ],
            output: [],
            description: "Round-robin distribution: task 0→worker 0, task 1→worker 1, etc."
          },
          {
            activeLine: 9,
            mainThread: { name: 'Main Thread', status: 'idle' },
            workerThread: { name: 'Worker Pool (3)', status: 'busy', currentTask: 'All workers busy' },
            messages: [
              { id: '1', from: 'main', to: 'worker', data: 'task[0]', status: 'received' },
              { id: '2', from: 'main', to: 'worker', data: 'task[1]', status: 'received' },
              { id: '3', from: 'main', to: 'worker', data: 'task[2]', status: 'received' }
            ],
            output: [],
            description: "3 workers process 3 tasks in parallel - 3x faster than single thread!"
          }
        ]
      }
    ]
  },
  advanced: {
    insight: "SharedArrayBuffer enables true shared memory between threads, requiring Atomics for synchronization to prevent race conditions.",
    examples: [
      {
        id: 'shared-buffer',
        name: 'SharedArrayBuffer',
        code: `// Shared memory between threads
const shared = new SharedArrayBuffer(4);
const view = new Int32Array(shared);

// Both threads see same memory!
worker.postMessage(shared);

// Worker increments
Atomics.add(view, 0, 1);

// Main reads
console.log(Atomics.load(view, 0));`,
        steps: [
          {
            activeLine: 2,
            mainThread: { name: 'Main Thread', status: 'busy', currentTask: 'Creating SharedArrayBuffer' },
            sharedBuffer: [0],
            messages: [],
            output: [],
            description: "SharedArrayBuffer allocates memory that can be shared (not copied)"
          },
          {
            activeLine: 6,
            mainThread: { name: 'Main Thread', status: 'idle' },
            workerThread: { name: 'Worker', status: 'busy', currentTask: 'Receiving buffer' },
            sharedBuffer: [0],
            messages: [{ id: '1', from: 'main', to: 'worker', data: 'SharedArrayBuffer', status: 'received' }],
            output: [],
            description: "Both threads now point to the SAME memory location"
          },
          {
            activeLine: 9,
            mainThread: { name: 'Main Thread', status: 'idle' },
            workerThread: { name: 'Worker', status: 'busy', currentTask: 'Atomics.add' },
            sharedBuffer: [1],
            messages: [{ id: '1', from: 'main', to: 'worker', data: 'SharedArrayBuffer', status: 'received' }],
            output: [],
            description: "Worker uses Atomics.add for thread-safe increment"
          },
          {
            activeLine: 12,
            mainThread: { name: 'Main Thread', status: 'busy', currentTask: 'Atomics.load' },
            workerThread: { name: 'Worker', status: 'idle' },
            sharedBuffer: [1],
            messages: [{ id: '1', from: 'main', to: 'worker', data: 'SharedArrayBuffer', status: 'received' }],
            output: ['Atomics.load(view, 0): 1'],
            description: "Main thread immediately sees worker's change - true shared memory!"
          }
        ]
      },
      {
        id: 'atomics-wait',
        name: 'Atomics.wait/notify',
        code: `// Worker waits for signal
Atomics.wait(view, 0, 0); // Block until != 0

// Main thread signals
Atomics.store(view, 0, 1);
Atomics.notify(view, 0, 1); // Wake 1 waiter

// Worker continues after being woken`,
        steps: [
          {
            activeLine: 2,
            mainThread: { name: 'Main Thread', status: 'idle' },
            workerThread: { name: 'Worker', status: 'blocked', currentTask: 'Atomics.wait' },
            sharedBuffer: [0],
            messages: [],
            output: [],
            description: "Worker blocks waiting for view[0] to change from 0"
          },
          {
            activeLine: 5,
            mainThread: { name: 'Main Thread', status: 'busy', currentTask: 'Atomics.store' },
            workerThread: { name: 'Worker', status: 'blocked', currentTask: 'Atomics.wait' },
            sharedBuffer: [1],
            messages: [],
            output: [],
            description: "Main thread stores new value (1) in shared memory"
          },
          {
            activeLine: 6,
            mainThread: { name: 'Main Thread', status: 'busy', currentTask: 'Atomics.notify' },
            workerThread: { name: 'Worker', status: 'blocked', currentTask: 'Atomics.wait' },
            sharedBuffer: [1],
            messages: [],
            output: [],
            description: "notify() wakes up workers waiting on this memory location"
          },
          {
            activeLine: 8,
            mainThread: { name: 'Main Thread', status: 'idle' },
            workerThread: { name: 'Worker', status: 'busy', currentTask: 'Resuming work' },
            sharedBuffer: [1],
            messages: [],
            output: [],
            description: "Worker wakes up and continues execution - true thread synchronization!"
          }
        ]
      },
      {
        id: 'race-condition',
        name: 'Race Conditions',
        code: `// DANGER: Race condition without Atomics!
// Both threads do: value = value + 1

// Thread 1 reads: 0
// Thread 2 reads: 0
// Thread 1 writes: 1
// Thread 2 writes: 1  // Lost update!

// SAFE: Use Atomics
Atomics.add(view, 0, 1); // Atomic RMW`,
        steps: [
          {
            activeLine: 4,
            mainThread: { name: 'Main Thread', status: 'busy', currentTask: 'Read value (0)' },
            workerThread: { name: 'Worker', status: 'idle' },
            sharedBuffer: [0],
            messages: [],
            output: [],
            description: "Thread 1 reads current value: 0"
          },
          {
            activeLine: 5,
            mainThread: { name: 'Main Thread', status: 'busy', currentTask: 'Computing +1' },
            workerThread: { name: 'Worker', status: 'busy', currentTask: 'Read value (0)' },
            sharedBuffer: [0],
            messages: [],
            output: [],
            description: "Thread 2 ALSO reads 0 before Thread 1 writes - race condition!"
          },
          {
            activeLine: 6,
            mainThread: { name: 'Main Thread', status: 'busy', currentTask: 'Write value (1)' },
            workerThread: { name: 'Worker', status: 'busy', currentTask: 'Computing +1' },
            sharedBuffer: [1],
            messages: [],
            output: [],
            description: "Thread 1 writes 1 to memory"
          },
          {
            activeLine: 7,
            mainThread: { name: 'Main Thread', status: 'idle' },
            workerThread: { name: 'Worker', status: 'busy', currentTask: 'Write value (1)' },
            sharedBuffer: [1],
            messages: [],
            output: ['Expected: 2, Got: 1 - LOST UPDATE!'],
            description: "Thread 2 writes 1 (based on stale read) - increment lost!"
          },
          {
            activeLine: 10,
            mainThread: { name: 'Main Thread', status: 'idle' },
            workerThread: { name: 'Worker', status: 'idle' },
            sharedBuffer: [2],
            messages: [],
            output: ['Atomics.add: 2 - Correct!'],
            description: "Atomics.add is atomic read-modify-write - no race condition"
          }
        ]
      }
    ]
  }
}

export function WebWorkersViz() {
  const [level, setLevel] = useState<Level>('beginner')
  const [exampleIdx, setExampleIdx] = useState(0)
  const [step, setStep] = useState(0)

  const data = levels[level]
  const example = data.examples[exampleIdx]
  const currentStep = example.steps[step]
  const codeLines = example.code.split('\n')

  const handleLevelChange = (newLevel: Level) => {
    setLevel(newLevel)
    setExampleIdx(0)
    setStep(0)
  }

  const handleExampleChange = (idx: number) => {
    setExampleIdx(idx)
    setStep(0)
  }

  const getStatusColor = (status: ThreadState['status']) => {
    switch (status) {
      case 'idle': return '#10b981'
      case 'busy': return '#3b82f6'
      case 'blocked': return '#ef4444'
      case 'waiting': return '#f59e0b'
      default: return '#888'
    }
  }

  return (
    <div className={styles.container}>
      {/* Level Selector */}
      <div className={styles.levelSelector}>
        {(['beginner', 'intermediate', 'advanced'] as Level[]).map((l) => (
          <button
            key={l}
            onClick={() => handleLevelChange(l)}
            className={`${styles.levelBtn} ${level === l ? styles.activeLevel : ''}`}
          >
            <span
              className={styles.levelDot}
              style={{
                background: l === 'beginner' ? '#10b981' : l === 'intermediate' ? '#f59e0b' : '#ef4444'
              }}
            />
            {l.charAt(0).toUpperCase() + l.slice(1)}
          </button>
        ))}
      </div>

      {/* Example Selector */}
      <div className={styles.exampleSelector}>
        {data.examples.map((ex, idx) => (
          <button
            key={ex.id}
            onClick={() => handleExampleChange(idx)}
            className={`${styles.exampleBtn} ${exampleIdx === idx ? styles.active : ''}`}
          >
            {ex.name}
          </button>
        ))}
      </div>

      {/* Code Panel */}
      <div className={styles.codePanel}>
        <div className={styles.panelHeader}>
          <span>Code</span>
        </div>
        <pre className={styles.code}>
          {codeLines.map((line, idx) => (
            <div
              key={idx}
              className={`${styles.codeLine} ${idx + 1 === currentStep.activeLine ? styles.activeLine : ''}`}
            >
              <span className={styles.lineNum}>{idx + 1}</span>
              <span className={styles.lineCode}>{line}</span>
            </div>
          ))}
        </pre>
      </div>

      {/* Thread Visualization - Neon Box */}
      <div className={`${styles.neonBox} ${styles.threadsBox}`}>
        <div className={styles.neonBoxHeader}>Threads</div>
        <div className={styles.neonBoxInner}>
          <div className={styles.threadsContainer}>
            {/* Main Thread */}
            <div className={styles.thread}>
              <div className={styles.threadHeader}>
                <span>{currentStep.mainThread.name}</span>
                <span
                  className={styles.statusBadge}
                  style={{ background: getStatusColor(currentStep.mainThread.status) }}
                >
                  {currentStep.mainThread.status}
                </span>
              </div>
              <div className={styles.threadContent}>
                <AnimatePresence mode="wait">
                  {currentStep.mainThread.currentTask && (
                    <motion.div
                      key={currentStep.mainThread.currentTask}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={styles.task}
                    >
                      {currentStep.mainThread.currentTask}
                      {currentStep.mainThread.progress !== undefined && (
                        <div className={styles.progressBar}>
                          <motion.div
                            className={styles.progressFill}
                            initial={{ width: 0 }}
                            animate={{ width: `${currentStep.mainThread.progress}%` }}
                          />
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Message Arrows */}
            {currentStep.messages.length > 0 && (
              <div className={styles.messagesChannel}>
                <AnimatePresence>
                  {currentStep.messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, x: msg.from === 'main' ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`${styles.message} ${styles[msg.from]}`}
                    >
                      <span className={styles.messageArrow}>
                        {msg.from === 'main' ? '→' : '←'}
                      </span>
                      <span className={styles.messageData}>{msg.data}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Worker Thread */}
            {currentStep.workerThread && (
              <div className={styles.thread}>
                <div className={styles.threadHeader}>
                  <span>{currentStep.workerThread.name}</span>
                  <span
                    className={styles.statusBadge}
                    style={{ background: getStatusColor(currentStep.workerThread.status) }}
                  >
                    {currentStep.workerThread.status}
                  </span>
                </div>
                <div className={styles.threadContent}>
                  <AnimatePresence mode="wait">
                    {currentStep.workerThread.currentTask && (
                      <motion.div
                        key={currentStep.workerThread.currentTask}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={styles.task}
                      >
                        {currentStep.workerThread.currentTask}
                        {currentStep.workerThread.progress !== undefined && (
                          <div className={styles.progressBar}>
                            <motion.div
                              className={styles.progressFill}
                              initial={{ width: 0 }}
                              animate={{ width: `${currentStep.workerThread.progress}%` }}
                            />
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Shared Buffer - Neon Box (for advanced examples) */}
      {currentStep.sharedBuffer && (
        <div className={`${styles.neonBox} ${styles.sharedBufferBox}`}>
          <div className={styles.neonBoxHeader}>SharedArrayBuffer</div>
          <div className={styles.neonBoxInner}>
            <div className={styles.bufferContent}>
              {currentStep.sharedBuffer.map((val, idx) => (
                <motion.div
                  key={idx}
                  className={styles.bufferCell}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.3 }}
                >
                  <span className={styles.cellIndex}>[{idx}]</span>
                  <span className={styles.cellValue}>{val}</span>
                </motion.div>
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
            <motion.div
              className={styles.output}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span className={styles.outputLabel}>Console:</span>
              {currentStep.output.map((item, idx) => (
                <span key={idx} className={styles.outputItem}>{item}</span>
              ))}
            </motion.div>
          </div>
        </div>
      )}

      {/* Description */}
      <motion.div
        key={step}
        className={styles.description}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className={styles.stepBadge}>Step {step + 1}/{example.steps.length}</span>
        {currentStep.description}
      </motion.div>

      {/* Controls */}
      <div className={styles.controls}>
        <button
          className={styles.btnSecondary}
          onClick={() => setStep(0)}
          disabled={step === 0}
        >
          Reset
        </button>
        <button
          className={styles.btnSecondary}
          onClick={() => setStep(s => s - 1)}
          disabled={step === 0}
        >
          Prev
        </button>
        <button
          className={styles.btnPrimary}
          onClick={() => setStep(s => s + 1)}
          disabled={step >= example.steps.length - 1}
        >
          Next Step
        </button>
      </div>

      {/* Insight */}
      <div className={styles.insight}>
        <strong>💡 Key Insight:</strong> {data.insight}
      </div>
    </div>
  )
}
