'use client'

import { useState, useCallback } from 'react'
import { Timer } from 'lucide-react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import { fadeUp, entranceTransition } from '@/lib/motion'
import { NavBar } from '@/components/NavBar'
import { StepControls } from '@/components/SharedViz'
import { useAutoPlay } from '@/components/SharedViz'
import styles from './AsyncVisualizerClient.module.css'

interface WebApiEntry {
  label: string
  timer?: number
}

interface ExecutionStep {
  callStack: string[]
  microtaskQueue: string[]
  macrotaskQueue: string[]
  webApis: WebApiEntry[]
  output: string[]
  highlight: 'callStack' | 'microtask' | 'macrotask' | 'webApi' | 'output' | 'none'
  explanation: string
}

interface AsyncExample {
  id: string
  title: string
  code: string
  expectedOutput: string[]
  explanation: string
  steps: ExecutionStep[]
}

const examples: AsyncExample[] = [
  {
    id: 'microtask-vs-macrotask',
    title: 'Microtask vs Macrotask Ordering',
    code: `console.log('start')

setTimeout(() => {
  console.log('timeout')
}, 0)

Promise.resolve()
  .then(() => console.log('promise 1'))
  .then(() => console.log('promise 2'))

console.log('end')`,
    expectedOutput: ['start', 'end', 'promise 1', 'promise 2', 'timeout'],
    explanation: 'Microtasks (Promises) always run before macrotasks (setTimeout), even with a 0ms delay. After synchronous code finishes, the engine drains the entire microtask queue before picking up the next macrotask.',
    steps: [
      {
        callStack: ['<script>'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: [],
        highlight: 'callStack',
        explanation: 'Script starts executing. The global script frame is pushed onto the call stack.',
      },
      {
        callStack: ['<script>', 'console.log("start")'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: [],
        highlight: 'callStack',
        explanation: 'console.log("start") is called and pushed onto the call stack.',
      },
      {
        callStack: ['<script>'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['start'],
        highlight: 'output',
        explanation: '"start" is printed to the console. console.log pops off the stack.',
      },
      {
        callStack: ['<script>', 'setTimeout(cb, 0)'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['start'],
        highlight: 'callStack',
        explanation: 'setTimeout is called with 0ms delay. It delegates to the Web API environment.',
      },
      {
        callStack: ['<script>'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [{ label: 'setTimeout(cb)', timer: 0 }],
        output: ['start'],
        highlight: 'webApi',
        explanation: 'The timer is registered in the Web APIs. With 0ms delay, the callback is immediately ready.',
      },
      {
        callStack: ['<script>'],
        microtaskQueue: [],
        macrotaskQueue: ['setTimeout cb'],
        webApis: [],
        output: ['start'],
        highlight: 'macrotask',
        explanation: 'Timer expires immediately. The callback moves to the macrotask queue, waiting for the call stack to be empty.',
      },
      {
        callStack: ['<script>', 'Promise.resolve().then(cb1)'],
        microtaskQueue: [],
        macrotaskQueue: ['setTimeout cb'],
        webApis: [],
        output: ['start'],
        highlight: 'callStack',
        explanation: 'Promise.resolve() creates an already-resolved Promise. .then(cb1) schedules cb1 as a microtask.',
      },
      {
        callStack: ['<script>'],
        microtaskQueue: ['then cb1'],
        macrotaskQueue: ['setTimeout cb'],
        webApis: [],
        output: ['start'],
        highlight: 'microtask',
        explanation: 'The first .then callback is added to the microtask queue. The .then(cb2) will be chained after cb1 runs.',
      },
      {
        callStack: ['<script>', 'console.log("end")'],
        microtaskQueue: ['then cb1'],
        macrotaskQueue: ['setTimeout cb'],
        webApis: [],
        output: ['start'],
        highlight: 'callStack',
        explanation: 'console.log("end") is called synchronously.',
      },
      {
        callStack: ['<script>'],
        microtaskQueue: ['then cb1'],
        macrotaskQueue: ['setTimeout cb'],
        webApis: [],
        output: ['start', 'end'],
        highlight: 'output',
        explanation: '"end" is printed. All synchronous code in the script is done.',
      },
      {
        callStack: [],
        microtaskQueue: ['then cb1'],
        macrotaskQueue: ['setTimeout cb'],
        webApis: [],
        output: ['start', 'end'],
        highlight: 'callStack',
        explanation: 'The script frame pops off. Call stack is empty. The engine now drains the microtask queue before any macrotask.',
      },
      {
        callStack: ['then cb1'],
        microtaskQueue: [],
        macrotaskQueue: ['setTimeout cb'],
        webApis: [],
        output: ['start', 'end'],
        highlight: 'callStack',
        explanation: 'Microtask cb1 is dequeued and pushed onto the call stack. This runs console.log("promise 1").',
      },
      {
        callStack: ['then cb1', 'console.log("promise 1")'],
        microtaskQueue: [],
        macrotaskQueue: ['setTimeout cb'],
        webApis: [],
        output: ['start', 'end'],
        highlight: 'callStack',
        explanation: 'console.log("promise 1") executes inside the microtask callback.',
      },
      {
        callStack: ['then cb1'],
        microtaskQueue: [],
        macrotaskQueue: ['setTimeout cb'],
        webApis: [],
        output: ['start', 'end', 'promise 1'],
        highlight: 'output',
        explanation: '"promise 1" is printed. The .then() chain resolves, scheduling cb2 as the next microtask.',
      },
      {
        callStack: [],
        microtaskQueue: ['then cb2'],
        macrotaskQueue: ['setTimeout cb'],
        webApis: [],
        output: ['start', 'end', 'promise 1'],
        highlight: 'microtask',
        explanation: 'cb1 completes and pops off. Its return value resolves the chained promise, so cb2 enters the microtask queue.',
      },
      {
        callStack: ['then cb2'],
        microtaskQueue: [],
        macrotaskQueue: ['setTimeout cb'],
        webApis: [],
        output: ['start', 'end', 'promise 1'],
        highlight: 'callStack',
        explanation: 'The microtask queue is not empty yet, so cb2 runs next (before the macrotask!).',
      },
      {
        callStack: ['then cb2', 'console.log("promise 2")'],
        microtaskQueue: [],
        macrotaskQueue: ['setTimeout cb'],
        webApis: [],
        output: ['start', 'end', 'promise 1'],
        highlight: 'callStack',
        explanation: 'console.log("promise 2") executes inside cb2.',
      },
      {
        callStack: [],
        microtaskQueue: [],
        macrotaskQueue: ['setTimeout cb'],
        webApis: [],
        output: ['start', 'end', 'promise 1', 'promise 2'],
        highlight: 'output',
        explanation: '"promise 2" is printed. The microtask queue is now empty. The engine can pick up a macrotask.',
      },
      {
        callStack: ['setTimeout cb'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['start', 'end', 'promise 1', 'promise 2'],
        highlight: 'callStack',
        explanation: 'The setTimeout callback is dequeued from the macrotask queue and pushed onto the call stack.',
      },
      {
        callStack: ['setTimeout cb', 'console.log("timeout")'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['start', 'end', 'promise 1', 'promise 2'],
        highlight: 'callStack',
        explanation: 'console.log("timeout") executes inside the setTimeout callback.',
      },
      {
        callStack: [],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['start', 'end', 'promise 1', 'promise 2', 'timeout'],
        highlight: 'output',
        explanation: '"timeout" is printed last. Execution complete. Microtasks always run before macrotasks.',
      },
    ],
  },
  {
    id: 'async-await-try-catch',
    title: 'async/await with try-catch',
    code: `async function fetchData() {
  console.log('fetching')
  try {
    const data = await Promise.reject('error!')
    console.log(data)
  } catch (e) {
    console.log('caught:', e)
  }
  console.log('done')
}

console.log('before')
fetchData()
console.log('after')`,
    expectedOutput: ['before', 'fetching', 'after', 'caught: error!', 'done'],
    explanation: 'await pauses the async function and yields control back to the caller. The rest of the async function resumes as a microtask. When the awaited promise rejects, execution jumps to the catch block.',
    steps: [
      {
        callStack: ['<script>'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: [],
        highlight: 'callStack',
        explanation: 'Script begins executing. fetchData is defined (hoisted) but not yet called.',
      },
      {
        callStack: ['<script>', 'console.log("before")'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: [],
        highlight: 'callStack',
        explanation: 'console.log("before") is called synchronously.',
      },
      {
        callStack: ['<script>'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['before'],
        highlight: 'output',
        explanation: '"before" is printed to the console.',
      },
      {
        callStack: ['<script>', 'fetchData()'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['before'],
        highlight: 'callStack',
        explanation: 'fetchData() is called. async functions run synchronously until the first await.',
      },
      {
        callStack: ['<script>', 'fetchData()', 'console.log("fetching")'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['before'],
        highlight: 'callStack',
        explanation: 'Inside fetchData, console.log("fetching") runs synchronously (before the await).',
      },
      {
        callStack: ['<script>', 'fetchData()'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['before', 'fetching'],
        highlight: 'output',
        explanation: '"fetching" is printed. Next line hits await Promise.reject("error!").',
      },
      {
        callStack: ['<script>', 'fetchData()', 'await Promise.reject("error!")'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['before', 'fetching'],
        highlight: 'callStack',
        explanation: 'await is encountered. Promise.reject creates an already-rejected promise. The async function will be suspended.',
      },
      {
        callStack: ['<script>'],
        microtaskQueue: ['resume fetchData (rejected)'],
        macrotaskQueue: [],
        webApis: [],
        output: ['before', 'fetching'],
        highlight: 'microtask',
        explanation: 'fetchData is suspended at await. Control returns to the caller. Resuming fetchData with the rejection is scheduled as a microtask.',
      },
      {
        callStack: ['<script>', 'console.log("after")'],
        microtaskQueue: ['resume fetchData (rejected)'],
        macrotaskQueue: [],
        webApis: [],
        output: ['before', 'fetching'],
        highlight: 'callStack',
        explanation: 'Back in the script, console.log("after") runs synchronously.',
      },
      {
        callStack: ['<script>'],
        microtaskQueue: ['resume fetchData (rejected)'],
        macrotaskQueue: [],
        webApis: [],
        output: ['before', 'fetching', 'after'],
        highlight: 'output',
        explanation: '"after" is printed. The script frame is about to complete.',
      },
      {
        callStack: [],
        microtaskQueue: ['resume fetchData (rejected)'],
        macrotaskQueue: [],
        webApis: [],
        output: ['before', 'fetching', 'after'],
        highlight: 'callStack',
        explanation: 'Script frame pops off. Call stack empty. Engine drains the microtask queue.',
      },
      {
        callStack: ['fetchData (catch block)'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['before', 'fetching', 'after'],
        highlight: 'callStack',
        explanation: 'fetchData resumes. The awaited promise was rejected, so execution jumps to the catch block with e = "error!".',
      },
      {
        callStack: ['fetchData (catch block)', 'console.log("caught:", e)'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['before', 'fetching', 'after'],
        highlight: 'callStack',
        explanation: 'Inside the catch block, console.log("caught:", e) runs.',
      },
      {
        callStack: ['fetchData (catch block)'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['before', 'fetching', 'after', 'caught: error!'],
        highlight: 'output',
        explanation: '"caught: error!" is printed. The catch block finishes, execution continues after try-catch.',
      },
      {
        callStack: ['fetchData', 'console.log("done")'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['before', 'fetching', 'after', 'caught: error!'],
        highlight: 'callStack',
        explanation: 'After the try-catch, console.log("done") runs.',
      },
      {
        callStack: [],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['before', 'fetching', 'after', 'caught: error!', 'done'],
        highlight: 'output',
        explanation: '"done" is printed. fetchData completes. await suspends at the keyword, and try-catch handles rejections seamlessly.',
      },
    ],
  },
  {
    id: 'promise-all-vs-allsettled',
    title: 'Promise.all vs Promise.allSettled',
    code: `const p1 = Promise.resolve('A')
const p2 = Promise.reject('fail')
const p3 = Promise.resolve('C')

Promise.all([p1, p2, p3])
  .then(vals => console.log('all:', vals))
  .catch(e => console.log('all err:', e))

Promise.allSettled([p1, p2, p3])
  .then(results => {
    results.forEach(r =>
      console.log(r.status, r.value ?? r.reason)
    )
  })`,
    expectedOutput: ['all err: fail', 'fulfilled A', 'rejected fail', 'fulfilled C'],
    explanation: 'Promise.all short-circuits on the first rejection, while Promise.allSettled waits for all promises and reports each result with its status. Both schedule their callbacks as microtasks.',
    steps: [
      {
        callStack: ['<script>'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: [],
        highlight: 'callStack',
        explanation: 'Script starts. Three promises are created: p1 (resolved "A"), p2 (rejected "fail"), p3 (resolved "C").',
      },
      {
        callStack: ['<script>', 'Promise.all([p1, p2, p3])'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: [],
        highlight: 'callStack',
        explanation: 'Promise.all is called. It iterates the promises. Since p2 is already rejected, the returned promise rejects immediately.',
      },
      {
        callStack: ['<script>'],
        microtaskQueue: ['all .catch(cb)'],
        macrotaskQueue: [],
        webApis: [],
        output: [],
        highlight: 'microtask',
        explanation: 'Promise.all rejects due to p2. The .catch callback is scheduled as a microtask. The .then is skipped.',
      },
      {
        callStack: ['<script>', 'Promise.allSettled([p1, p2, p3])'],
        microtaskQueue: ['all .catch(cb)'],
        macrotaskQueue: [],
        webApis: [],
        output: [],
        highlight: 'callStack',
        explanation: 'Promise.allSettled is called. It waits for ALL promises regardless of rejection.',
      },
      {
        callStack: ['<script>'],
        microtaskQueue: ['all .catch(cb)', 'allSettled .then(cb)'],
        macrotaskQueue: [],
        webApis: [],
        output: [],
        highlight: 'microtask',
        explanation: 'All three promises are already settled, so allSettled resolves immediately. Its .then callback is scheduled as a microtask.',
      },
      {
        callStack: [],
        microtaskQueue: ['all .catch(cb)', 'allSettled .then(cb)'],
        macrotaskQueue: [],
        webApis: [],
        output: [],
        highlight: 'callStack',
        explanation: 'Script finishes. Call stack empty. Engine starts draining microtask queue (FIFO order).',
      },
      {
        callStack: ['all .catch(cb)'],
        microtaskQueue: ['allSettled .then(cb)'],
        macrotaskQueue: [],
        webApis: [],
        output: [],
        highlight: 'callStack',
        explanation: 'The .catch callback from Promise.all runs first. e = "fail".',
      },
      {
        callStack: ['all .catch(cb)', 'console.log("all err:", e)'],
        microtaskQueue: ['allSettled .then(cb)'],
        macrotaskQueue: [],
        webApis: [],
        output: [],
        highlight: 'callStack',
        explanation: 'console.log("all err:", e) executes inside the catch handler.',
      },
      {
        callStack: [],
        microtaskQueue: ['allSettled .then(cb)'],
        macrotaskQueue: [],
        webApis: [],
        output: ['all err: fail'],
        highlight: 'output',
        explanation: '"all err: fail" is printed. Promise.all short-circuited on the first rejection.',
      },
      {
        callStack: ['allSettled .then(cb)'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['all err: fail'],
        highlight: 'callStack',
        explanation: 'The .then callback from Promise.allSettled runs. results is an array of {status, value/reason} objects.',
      },
      {
        callStack: ['allSettled .then(cb)', 'forEach iteration 1'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['all err: fail'],
        highlight: 'callStack',
        explanation: 'forEach iterates. First result: {status: "fulfilled", value: "A"}.',
      },
      {
        callStack: ['allSettled .then(cb)', 'forEach iteration 2'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['all err: fail', 'fulfilled A'],
        highlight: 'output',
        explanation: '"fulfilled A" is printed. Next result: {status: "rejected", reason: "fail"}.',
      },
      {
        callStack: ['allSettled .then(cb)', 'forEach iteration 3'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['all err: fail', 'fulfilled A', 'rejected fail'],
        highlight: 'output',
        explanation: '"rejected fail" is printed. Next result: {status: "fulfilled", value: "C"}.',
      },
      {
        callStack: [],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['all err: fail', 'fulfilled A', 'rejected fail', 'fulfilled C'],
        highlight: 'output',
        explanation: '"fulfilled C" is printed. Promise.allSettled reported all results. Unlike Promise.all, it never short-circuits.',
      },
    ],
  },
  {
    id: 'promise-race-timeout',
    title: 'Promise.race Timeout Pattern',
    code: `function timeout(ms) {
  return new Promise((_, reject) =>
    setTimeout(() => reject('timeout!'), ms)
  )
}

function fetchData() {
  return new Promise(resolve =>
    setTimeout(() => resolve('data'), 500)
  )
}

Promise.race([fetchData(), timeout(100)])
  .then(v => console.log('got:', v))
  .catch(e => console.log('err:', e))

console.log('race started')`,
    expectedOutput: ['race started', 'err: timeout!'],
    explanation: 'Promise.race resolves or rejects as soon as the first promise settles. Here the timeout (100ms) fires before the data fetch (500ms), so the race rejects with "timeout!". This is a common pattern for adding timeouts to async operations.',
    steps: [
      {
        callStack: ['<script>'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: [],
        highlight: 'callStack',
        explanation: 'Script starts. timeout() and fetchData() functions are defined.',
      },
      {
        callStack: ['<script>', 'fetchData()'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: [],
        highlight: 'callStack',
        explanation: 'fetchData() is called. It creates a new Promise with a 500ms setTimeout inside the executor.',
      },
      {
        callStack: ['<script>'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [{ label: 'setTimeout(resolve, 500)', timer: 500 }],
        output: [],
        highlight: 'webApi',
        explanation: 'The 500ms timer for fetchData is registered in the Web APIs. fetchData returns its pending promise.',
      },
      {
        callStack: ['<script>', 'timeout(100)'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [{ label: 'setTimeout(resolve, 500)', timer: 500 }],
        output: [],
        highlight: 'callStack',
        explanation: 'timeout(100) is called. It creates a new Promise with a 100ms setTimeout that rejects.',
      },
      {
        callStack: ['<script>'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [
          { label: 'setTimeout(resolve, 500)', timer: 500 },
          { label: 'setTimeout(reject, 100)', timer: 100 },
        ],
        output: [],
        highlight: 'webApi',
        explanation: 'The 100ms timer is registered. Both timers are running concurrently in the Web API environment.',
      },
      {
        callStack: ['<script>', 'Promise.race([...])'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [
          { label: 'setTimeout(resolve, 500)', timer: 500 },
          { label: 'setTimeout(reject, 100)', timer: 100 },
        ],
        output: [],
        highlight: 'callStack',
        explanation: 'Promise.race is called with both promises. It will settle as soon as either promise settles first.',
      },
      {
        callStack: ['<script>', 'console.log("race started")'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [
          { label: 'setTimeout(resolve, 500)', timer: 500 },
          { label: 'setTimeout(reject, 100)', timer: 100 },
        ],
        output: [],
        highlight: 'callStack',
        explanation: 'console.log("race started") runs synchronously.',
      },
      {
        callStack: [],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [
          { label: 'setTimeout(resolve, 500)', timer: 500 },
          { label: 'setTimeout(reject, 100)', timer: 100 },
        ],
        output: ['race started'],
        highlight: 'output',
        explanation: '"race started" is printed. Script finishes. Now we wait for the timers.',
      },
      {
        callStack: [],
        microtaskQueue: [],
        macrotaskQueue: ['timeout reject cb'],
        webApis: [{ label: 'setTimeout(resolve, 500)', timer: 500 }],
        output: ['race started'],
        highlight: 'macrotask',
        explanation: '100ms passes. The timeout timer fires first! Its reject callback enters the macrotask queue.',
      },
      {
        callStack: ['timeout reject cb'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [{ label: 'setTimeout(resolve, 500)', timer: 500 }],
        output: ['race started'],
        highlight: 'callStack',
        explanation: 'The timeout callback runs, calling reject("timeout!"). This settles the race promise as rejected.',
      },
      {
        callStack: [],
        microtaskQueue: ['race .catch(cb)'],
        macrotaskQueue: [],
        webApis: [{ label: 'setTimeout(resolve, 500)', timer: 500 }],
        output: ['race started'],
        highlight: 'microtask',
        explanation: 'The race promise rejects. The .catch callback is scheduled as a microtask.',
      },
      {
        callStack: ['race .catch(cb)', 'console.log("err:", e)'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [{ label: 'setTimeout(resolve, 500)', timer: 500 }],
        output: ['race started'],
        highlight: 'callStack',
        explanation: 'The .catch callback runs with e = "timeout!". console.log("err:", e) executes.',
      },
      {
        callStack: [],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['race started', 'err: timeout!'],
        highlight: 'output',
        explanation: '"err: timeout!" is printed. The 500ms timer still fires later but its resolve has no effect — the race promise is already settled. Promise.race is decided by the first settler.',
      },
    ],
  },
  {
    id: 'sequential-vs-parallel',
    title: 'Sequential vs Parallel async',
    code: `async function sequential() {
  const a = await fetch1() // 200ms
  const b = await fetch2() // 200ms
  console.log('seq:', a, b)
  // Total: ~400ms
}

async function parallel() {
  const [a, b] = await Promise.all([
    fetch1(), // 200ms
    fetch2(), // 200ms
  ])
  console.log('par:', a, b)
  // Total: ~200ms
}

sequential()
parallel()
console.log('started')`,
    expectedOutput: ['started', 'par: A B', 'seq: A B'],
    explanation: 'Sequential awaits wait for each promise one at a time. Parallel uses Promise.all to start both at once. The parallel version finishes in ~200ms while sequential takes ~400ms. Starting promises before awaiting them is key to parallelism.',
    steps: [
      {
        callStack: ['<script>'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: [],
        highlight: 'callStack',
        explanation: 'Script starts. sequential() and parallel() are defined as async functions.',
      },
      {
        callStack: ['<script>', 'sequential()'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: [],
        highlight: 'callStack',
        explanation: 'sequential() is called. It runs synchronously until the first await.',
      },
      {
        callStack: ['<script>', 'sequential()', 'await fetch1()'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: [],
        highlight: 'callStack',
        explanation: 'fetch1() is called, returning a promise that resolves in ~200ms. await suspends sequential().',
      },
      {
        callStack: ['<script>'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [{ label: 'fetch1() (sequential)', timer: 200 }],
        output: [],
        highlight: 'webApi',
        explanation: 'sequential() is suspended at await. fetch1 runs in the Web API. Control returns to the caller.',
      },
      {
        callStack: ['<script>', 'parallel()'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [{ label: 'fetch1() (sequential)', timer: 200 }],
        output: [],
        highlight: 'callStack',
        explanation: 'parallel() is called. It runs synchronously until its await.',
      },
      {
        callStack: ['<script>', 'parallel()', 'Promise.all([fetch1(), fetch2()])'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [{ label: 'fetch1() (sequential)', timer: 200 }],
        output: [],
        highlight: 'callStack',
        explanation: 'Inside parallel(), both fetch1() and fetch2() are called BEFORE await. Both start concurrently.',
      },
      {
        callStack: ['<script>'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [
          { label: 'fetch1() (sequential)', timer: 200 },
          { label: 'fetch1() (parallel)', timer: 200 },
          { label: 'fetch2() (parallel)', timer: 200 },
        ],
        output: [],
        highlight: 'webApi',
        explanation: 'parallel() is suspended at await Promise.all. Both parallel fetches run concurrently in Web APIs.',
      },
      {
        callStack: ['<script>', 'console.log("started")'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [
          { label: 'fetch1() (sequential)', timer: 200 },
          { label: 'fetch1() (parallel)', timer: 200 },
          { label: 'fetch2() (parallel)', timer: 200 },
        ],
        output: [],
        highlight: 'callStack',
        explanation: 'console.log("started") runs synchronously while all three fetches run in parallel.',
      },
      {
        callStack: [],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [
          { label: 'fetch1() (sequential)', timer: 200 },
          { label: 'fetch1() (parallel)', timer: 200 },
          { label: 'fetch2() (parallel)', timer: 200 },
        ],
        output: ['started'],
        highlight: 'output',
        explanation: '"started" is printed. Script finishes. Now we wait for the async operations.',
      },
      {
        callStack: [],
        microtaskQueue: ['resume parallel (all settled)'],
        macrotaskQueue: [],
        webApis: [{ label: 'fetch1() (sequential)', timer: 200 }],
        output: ['started'],
        highlight: 'microtask',
        explanation: '~200ms passes. Both parallel fetches complete simultaneously. Promise.all resolves. parallel() resumes as a microtask. sequential\'s fetch1 also completes.',
      },
      {
        callStack: ['parallel (resumed)'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['started'],
        highlight: 'callStack',
        explanation: 'parallel() resumes. [a, b] = ["A", "B"] from the destructured Promise.all result.',
      },
      {
        callStack: ['parallel (resumed)', 'console.log("par:", a, b)'],
        microtaskQueue: ['resume sequential (fetch1 done)'],
        macrotaskQueue: [],
        webApis: [],
        output: ['started'],
        highlight: 'callStack',
        explanation: 'console.log("par:", a, b) runs inside parallel(). sequential\'s fetch1 result is queued.',
      },
      {
        callStack: [],
        microtaskQueue: ['resume sequential (fetch1 done)'],
        macrotaskQueue: [],
        webApis: [],
        output: ['started', 'par: A B'],
        highlight: 'output',
        explanation: '"par: A B" is printed. parallel() completes in ~200ms total (both fetches ran concurrently).',
      },
      {
        callStack: ['sequential (resumed)', 'await fetch2()'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['started', 'par: A B'],
        highlight: 'callStack',
        explanation: 'sequential() resumes with a = "A". Now it hits await fetch2(). fetch2 starts only AFTER fetch1 finished.',
      },
      {
        callStack: [],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [{ label: 'fetch2() (sequential)', timer: 200 }],
        output: ['started', 'par: A B'],
        highlight: 'webApi',
        explanation: 'sequential() is suspended again at the second await. fetch2 runs in Web API. Another ~200ms wait.',
      },
      {
        callStack: [],
        microtaskQueue: ['resume sequential (fetch2 done)'],
        macrotaskQueue: [],
        webApis: [],
        output: ['started', 'par: A B'],
        highlight: 'microtask',
        explanation: '~200ms more passes. fetch2 completes. sequential() resumes as a microtask.',
      },
      {
        callStack: ['sequential (resumed)', 'console.log("seq:", a, b)'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['started', 'par: A B'],
        highlight: 'callStack',
        explanation: 'sequential() resumes with b = "B". console.log("seq:", a, b) runs.',
      },
      {
        callStack: [],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['started', 'par: A B', 'seq: A B'],
        highlight: 'output',
        explanation: '"seq: A B" is printed. sequential() took ~400ms total (200 + 200, in series) while parallel() took ~200ms. Always start promises before awaiting when operations are independent.',
      },
    ],
  },
  {
    id: 'promise-chaining-vs-nesting',
    title: 'Promise Chaining vs Nesting',
    code: `// Chaining (correct)
Promise.resolve(1)
  .then(v => {
    console.log('chain:', v)
    return v + 1
  })
  .then(v => {
    console.log('chain:', v)
    return v + 1
  })
  .then(v => console.log('chain:', v))

// Nesting (anti-pattern)
Promise.resolve(10)
  .then(v => {
    console.log('nest:', v)
    Promise.resolve(v + 1)
      .then(v2 => {
        console.log('nest:', v2)
        Promise.resolve(v2 + 1)
          .then(v3 => console.log('nest:', v3))
      })
  })`,
    expectedOutput: ['chain: 1', 'nest: 10', 'chain: 2', 'nest: 11', 'chain: 3', 'nest: 12'],
    explanation: 'Chaining returns values through .then() creating a sequential pipeline. Nesting creates promises inside .then() callbacks without returning them, leading to "callback hell" and lost error handling. The interleaved output shows they run as competing microtasks.',
    steps: [
      {
        callStack: ['<script>'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: [],
        highlight: 'callStack',
        explanation: 'Script starts. Two promise chains are about to be created.',
      },
      {
        callStack: ['<script>', 'Promise.resolve(1).then(cb1)'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: [],
        highlight: 'callStack',
        explanation: 'Promise.resolve(1) creates a resolved promise. .then(cb1) schedules cb1 as a microtask.',
      },
      {
        callStack: ['<script>'],
        microtaskQueue: ['chain cb1 (v=1)'],
        macrotaskQueue: [],
        webApis: [],
        output: [],
        highlight: 'microtask',
        explanation: 'Chain cb1 enters the microtask queue. The .then(cb2).then(cb3) are chained but cb2/cb3 won\'t be scheduled until cb1 returns.',
      },
      {
        callStack: ['<script>', 'Promise.resolve(10).then(nestCb1)'],
        microtaskQueue: ['chain cb1 (v=1)'],
        macrotaskQueue: [],
        webApis: [],
        output: [],
        highlight: 'callStack',
        explanation: 'Promise.resolve(10) creates the nesting chain. .then(nestCb1) schedules nestCb1.',
      },
      {
        callStack: [],
        microtaskQueue: ['chain cb1 (v=1)', 'nest cb1 (v=10)'],
        macrotaskQueue: [],
        webApis: [],
        output: [],
        highlight: 'microtask',
        explanation: 'Script finishes. Both first callbacks are in the microtask queue. They will execute in FIFO order.',
      },
      {
        callStack: ['chain cb1 (v=1)'],
        microtaskQueue: ['nest cb1 (v=10)'],
        macrotaskQueue: [],
        webApis: [],
        output: [],
        highlight: 'callStack',
        explanation: 'chain cb1 runs first (FIFO). v = 1. It logs "chain: 1" and returns v + 1 = 2.',
      },
      {
        callStack: [],
        microtaskQueue: ['nest cb1 (v=10)', 'chain cb2 (v=2)'],
        macrotaskQueue: [],
        webApis: [],
        output: ['chain: 1'],
        highlight: 'output',
        explanation: '"chain: 1" is printed. cb1 returned 2, so chain cb2 is scheduled with v=2. nest cb1 is next in queue.',
      },
      {
        callStack: ['nest cb1 (v=10)'],
        microtaskQueue: ['chain cb2 (v=2)'],
        macrotaskQueue: [],
        webApis: [],
        output: ['chain: 1'],
        highlight: 'callStack',
        explanation: 'nest cb1 runs. v = 10. It logs "nest: 10" and creates a nested Promise.resolve(11).then(...).',
      },
      {
        callStack: [],
        microtaskQueue: ['chain cb2 (v=2)', 'nest cb2 (v2=11)'],
        macrotaskQueue: [],
        webApis: [],
        output: ['chain: 1', 'nest: 10'],
        highlight: 'output',
        explanation: '"nest: 10" is printed. The nested promise schedules nest cb2. Notice it is NOT returned, so the outer .then does not wait for it.',
      },
      {
        callStack: ['chain cb2 (v=2)'],
        microtaskQueue: ['nest cb2 (v2=11)'],
        macrotaskQueue: [],
        webApis: [],
        output: ['chain: 1', 'nest: 10'],
        highlight: 'callStack',
        explanation: 'chain cb2 runs. v = 2. It logs "chain: 2" and returns v + 1 = 3.',
      },
      {
        callStack: [],
        microtaskQueue: ['nest cb2 (v2=11)', 'chain cb3 (v=3)'],
        macrotaskQueue: [],
        webApis: [],
        output: ['chain: 1', 'nest: 10', 'chain: 2'],
        highlight: 'output',
        explanation: '"chain: 2" is printed. chain cb3 is scheduled with v=3.',
      },
      {
        callStack: ['nest cb2 (v2=11)'],
        microtaskQueue: ['chain cb3 (v=3)'],
        macrotaskQueue: [],
        webApis: [],
        output: ['chain: 1', 'nest: 10', 'chain: 2'],
        highlight: 'callStack',
        explanation: 'nest cb2 runs. v2 = 11. It logs "nest: 11" and creates another nested promise.',
      },
      {
        callStack: [],
        microtaskQueue: ['chain cb3 (v=3)', 'nest cb3 (v3=12)'],
        macrotaskQueue: [],
        webApis: [],
        output: ['chain: 1', 'nest: 10', 'chain: 2', 'nest: 11'],
        highlight: 'output',
        explanation: '"nest: 11" is printed. nest cb3 is scheduled.',
      },
      {
        callStack: ['chain cb3 (v=3)'],
        microtaskQueue: ['nest cb3 (v3=12)'],
        macrotaskQueue: [],
        webApis: [],
        output: ['chain: 1', 'nest: 10', 'chain: 2', 'nest: 11'],
        highlight: 'callStack',
        explanation: 'chain cb3 runs. v = 3. It logs "chain: 3".',
      },
      {
        callStack: [],
        microtaskQueue: ['nest cb3 (v3=12)'],
        macrotaskQueue: [],
        webApis: [],
        output: ['chain: 1', 'nest: 10', 'chain: 2', 'nest: 11', 'chain: 3'],
        highlight: 'output',
        explanation: '"chain: 3" is printed. The chained pipeline is complete.',
      },
      {
        callStack: ['nest cb3 (v3=12)'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['chain: 1', 'nest: 10', 'chain: 2', 'nest: 11', 'chain: 3'],
        highlight: 'callStack',
        explanation: 'nest cb3 runs. v3 = 12. It logs "nest: 12".',
      },
      {
        callStack: [],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['chain: 1', 'nest: 10', 'chain: 2', 'nest: 11', 'chain: 3', 'nest: 12'],
        highlight: 'output',
        explanation: '"nest: 12" is printed. The interleaved output shows how chaining and nesting compete for microtask execution. Prefer chaining for readability and proper error propagation.',
      },
    ],
  },
  {
    id: 'async-iife',
    title: 'async IIFE Patterns',
    code: `console.log('1')

;(async () => {
  console.log('2')
  await Promise.resolve()
  console.log('3')
})()

console.log('4')

;(async () => {
  console.log('5')
  const x = await Promise.resolve('hello')
  console.log('6:', x)
})()

console.log('7')`,
    expectedOutput: ['1', '2', '4', '5', '7', '3', '6: hello'],
    explanation: 'Async IIFEs (Immediately Invoked Function Expressions) are useful for top-level await in scripts. The async function runs synchronously until the first await, then control returns to the enclosing scope. After synchronous code finishes, the suspended functions resume as microtasks.',
    steps: [
      {
        callStack: ['<script>'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: [],
        highlight: 'callStack',
        explanation: 'Script starts executing.',
      },
      {
        callStack: ['<script>', 'console.log("1")'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: [],
        highlight: 'callStack',
        explanation: 'console.log("1") runs synchronously.',
      },
      {
        callStack: ['<script>'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['1'],
        highlight: 'output',
        explanation: '"1" is printed.',
      },
      {
        callStack: ['<script>', 'async IIFE #1'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['1'],
        highlight: 'callStack',
        explanation: 'First async IIFE is invoked. It runs synchronously until await.',
      },
      {
        callStack: ['<script>', 'async IIFE #1', 'console.log("2")'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['1'],
        highlight: 'callStack',
        explanation: 'console.log("2") runs synchronously inside the IIFE (before the await).',
      },
      {
        callStack: ['<script>', 'async IIFE #1'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['1', '2'],
        highlight: 'output',
        explanation: '"2" is printed. Next line is await Promise.resolve().',
      },
      {
        callStack: ['<script>'],
        microtaskQueue: ['resume IIFE #1'],
        macrotaskQueue: [],
        webApis: [],
        output: ['1', '2'],
        highlight: 'microtask',
        explanation: 'await suspends IIFE #1. The promise is already resolved, so resuming is scheduled as a microtask. Control returns to the script.',
      },
      {
        callStack: ['<script>', 'console.log("4")'],
        microtaskQueue: ['resume IIFE #1'],
        macrotaskQueue: [],
        webApis: [],
        output: ['1', '2'],
        highlight: 'callStack',
        explanation: 'console.log("4") runs synchronously. IIFE #1 is still suspended.',
      },
      {
        callStack: ['<script>'],
        microtaskQueue: ['resume IIFE #1'],
        macrotaskQueue: [],
        webApis: [],
        output: ['1', '2', '4'],
        highlight: 'output',
        explanation: '"4" is printed.',
      },
      {
        callStack: ['<script>', 'async IIFE #2'],
        microtaskQueue: ['resume IIFE #1'],
        macrotaskQueue: [],
        webApis: [],
        output: ['1', '2', '4'],
        highlight: 'callStack',
        explanation: 'Second async IIFE is invoked. It runs synchronously until its await.',
      },
      {
        callStack: ['<script>', 'async IIFE #2', 'console.log("5")'],
        microtaskQueue: ['resume IIFE #1'],
        macrotaskQueue: [],
        webApis: [],
        output: ['1', '2', '4'],
        highlight: 'callStack',
        explanation: 'console.log("5") runs synchronously inside IIFE #2.',
      },
      {
        callStack: ['<script>'],
        microtaskQueue: ['resume IIFE #1', 'resume IIFE #2'],
        macrotaskQueue: [],
        webApis: [],
        output: ['1', '2', '4', '5'],
        highlight: 'microtask',
        explanation: '"5" is printed. await Promise.resolve("hello") suspends IIFE #2. Its resumption is scheduled as a microtask.',
      },
      {
        callStack: ['<script>', 'console.log("7")'],
        microtaskQueue: ['resume IIFE #1', 'resume IIFE #2'],
        macrotaskQueue: [],
        webApis: [],
        output: ['1', '2', '4', '5'],
        highlight: 'callStack',
        explanation: 'console.log("7") runs synchronously.',
      },
      {
        callStack: [],
        microtaskQueue: ['resume IIFE #1', 'resume IIFE #2'],
        macrotaskQueue: [],
        webApis: [],
        output: ['1', '2', '4', '5', '7'],
        highlight: 'output',
        explanation: '"7" is printed. Script finishes. All synchronous code is done. Time to drain microtasks.',
      },
      {
        callStack: ['IIFE #1 (resumed)'],
        microtaskQueue: ['resume IIFE #2'],
        macrotaskQueue: [],
        webApis: [],
        output: ['1', '2', '4', '5', '7'],
        highlight: 'callStack',
        explanation: 'IIFE #1 resumes after await. console.log("3") runs.',
      },
      {
        callStack: [],
        microtaskQueue: ['resume IIFE #2'],
        macrotaskQueue: [],
        webApis: [],
        output: ['1', '2', '4', '5', '7', '3'],
        highlight: 'output',
        explanation: '"3" is printed. IIFE #1 completes.',
      },
      {
        callStack: ['IIFE #2 (resumed)'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['1', '2', '4', '5', '7', '3'],
        highlight: 'callStack',
        explanation: 'IIFE #2 resumes after await. x = "hello". console.log("6:", x) runs.',
      },
      {
        callStack: [],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['1', '2', '4', '5', '7', '3', '6: hello'],
        highlight: 'output',
        explanation: '"6: hello" is printed. Both IIFEs complete. Key insight: async functions run synchronously until await, then yield back to the caller.',
      },
    ],
  },
  {
    id: 'retry-exponential-backoff',
    title: 'Retry with Exponential Backoff',
    code: `async function retry(fn, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn()
    } catch (e) {
      const delay = 2 ** i * 100
      console.log(\`attempt \${i+1} failed, retry in \${delay}ms\`)
      await sleep(delay)
    }
  }
  throw new Error('all retries failed')
}

// Simulated: fails twice, succeeds third time
retry(unstableFetch)
  .then(v => console.log('got:', v))
  .catch(e => console.log(e.message))`,
    expectedOutput: ['attempt 1 failed, retry in 100ms', 'attempt 2 failed, retry in 200ms', 'got: data'],
    explanation: 'Exponential backoff doubles the wait time between retries (100ms, 200ms, 400ms...). Each retry iteration uses await to pause, yielding control back. This pattern prevents overwhelming a failing server while giving it time to recover.',
    steps: [
      {
        callStack: ['<script>'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: [],
        highlight: 'callStack',
        explanation: 'Script starts. retry() and unstableFetch are defined. retry(unstableFetch) is called.',
      },
      {
        callStack: ['<script>', 'retry(unstableFetch)'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: [],
        highlight: 'callStack',
        explanation: 'retry() starts. i = 0. It enters the for loop and calls await fn() (unstableFetch).',
      },
      {
        callStack: ['<script>', 'retry()', 'await unstableFetch()'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: [],
        highlight: 'callStack',
        explanation: 'Attempt 1: unstableFetch() is called. It returns a rejected promise (simulated failure).',
      },
      {
        callStack: ['<script>'],
        microtaskQueue: ['resume retry (rejected)'],
        macrotaskQueue: [],
        webApis: [],
        output: [],
        highlight: 'microtask',
        explanation: 'retry() is suspended at await. The promise rejected, so retry will resume in the catch block.',
      },
      {
        callStack: [],
        microtaskQueue: ['resume retry (rejected)'],
        macrotaskQueue: [],
        webApis: [],
        output: [],
        highlight: 'callStack',
        explanation: 'Script frame finishes (the .then/.catch on retry\'s returned promise are registered). Microtask queue is drained.',
      },
      {
        callStack: ['retry (catch block, i=0)'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: [],
        highlight: 'callStack',
        explanation: 'retry() resumes in catch block. delay = 2^0 * 100 = 100. Logs the failure message.',
      },
      {
        callStack: ['retry (catch block, i=0)', 'console.log(...)'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: [],
        highlight: 'callStack',
        explanation: 'console.log("attempt 1 failed, retry in 100ms") executes.',
      },
      {
        callStack: ['retry (catch block, i=0)'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [{ label: 'sleep(100)', timer: 100 }],
        output: ['attempt 1 failed, retry in 100ms'],
        highlight: 'webApi',
        explanation: '"attempt 1 failed, retry in 100ms" is printed. await sleep(100) starts a 100ms timer.',
      },
      {
        callStack: [],
        microtaskQueue: [],
        macrotaskQueue: ['sleep resolve'],
        webApis: [],
        output: ['attempt 1 failed, retry in 100ms'],
        highlight: 'macrotask',
        explanation: '100ms passes. The sleep timer fires and its callback enters the macrotask queue.',
      },
      {
        callStack: ['retry (i=1)', 'await unstableFetch()'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['attempt 1 failed, retry in 100ms'],
        highlight: 'callStack',
        explanation: 'retry() resumes. Loop continues with i=1. Attempt 2: unstableFetch() is called again. It fails again.',
      },
      {
        callStack: ['retry (catch block, i=1)'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['attempt 1 failed, retry in 100ms'],
        highlight: 'callStack',
        explanation: 'retry() catches the rejection again. delay = 2^1 * 100 = 200. Logs the second failure.',
      },
      {
        callStack: ['retry (catch block, i=1)'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [{ label: 'sleep(200)', timer: 200 }],
        output: ['attempt 1 failed, retry in 100ms', 'attempt 2 failed, retry in 200ms'],
        highlight: 'webApi',
        explanation: '"attempt 2 failed, retry in 200ms" is printed. await sleep(200) — the delay doubled (exponential backoff).',
      },
      {
        callStack: [],
        microtaskQueue: [],
        macrotaskQueue: ['sleep resolve'],
        webApis: [],
        output: ['attempt 1 failed, retry in 100ms', 'attempt 2 failed, retry in 200ms'],
        highlight: 'macrotask',
        explanation: '200ms passes. The sleep timer fires.',
      },
      {
        callStack: ['retry (i=2)', 'await unstableFetch()'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['attempt 1 failed, retry in 100ms', 'attempt 2 failed, retry in 200ms'],
        highlight: 'callStack',
        explanation: 'retry() resumes. i=2. Attempt 3: unstableFetch() is called. This time it succeeds! Returns "data".',
      },
      {
        callStack: [],
        microtaskQueue: ['resume retry (resolved)'],
        macrotaskQueue: [],
        webApis: [],
        output: ['attempt 1 failed, retry in 100ms', 'attempt 2 failed, retry in 200ms'],
        highlight: 'microtask',
        explanation: 'The promise resolves with "data". retry() will resume with the resolved value.',
      },
      {
        callStack: ['retry (return "data")'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['attempt 1 failed, retry in 100ms', 'attempt 2 failed, retry in 200ms'],
        highlight: 'callStack',
        explanation: 'retry() resumes in the try block. return await fn() returns "data". The retry() promise resolves.',
      },
      {
        callStack: ['.then(cb)', 'console.log("got:", v)'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['attempt 1 failed, retry in 100ms', 'attempt 2 failed, retry in 200ms'],
        highlight: 'callStack',
        explanation: 'The .then callback runs with v = "data". console.log("got:", v) executes.',
      },
      {
        callStack: [],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['attempt 1 failed, retry in 100ms', 'attempt 2 failed, retry in 200ms', 'got: data'],
        highlight: 'output',
        explanation: '"got: data" is printed. The retry pattern succeeded on the 3rd attempt with exponential backoff (100ms, 200ms). Total wait: 300ms.',
      },
    ],
  },
  {
    id: 'abort-controller',
    title: 'AbortController Cancellation',
    code: `const controller = new AbortController()

fetch('/api/data', { signal: controller.signal })
  .then(r => r.json())
  .then(d => console.log('data:', d))
  .catch(e => {
    if (e.name === 'AbortError') {
      console.log('request aborted')
    }
  })

setTimeout(() => {
  controller.abort()
  console.log('aborted!')
}, 100)

console.log('request started')`,
    expectedOutput: ['request started', 'aborted!', 'request aborted'],
    explanation: 'AbortController provides a signal that can cancel fetch requests. When abort() is called, the fetch promise rejects with an AbortError. This is essential for cleanup in React effects, cancelling slow requests, and implementing timeout patterns.',
    steps: [
      {
        callStack: ['<script>'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: [],
        highlight: 'callStack',
        explanation: 'Script starts. AbortController is created with a signal.',
      },
      {
        callStack: ['<script>', 'fetch("/api/data", {signal})'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: [],
        highlight: 'callStack',
        explanation: 'fetch() is called with the AbortController\'s signal. The request starts in the browser\'s network layer.',
      },
      {
        callStack: ['<script>'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [{ label: 'fetch("/api/data")', timer: 500 }],
        output: [],
        highlight: 'webApi',
        explanation: 'The fetch is running in the Web API environment. .then/.catch handlers are registered on the returned promise.',
      },
      {
        callStack: ['<script>', 'setTimeout(abortCb, 100)'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [{ label: 'fetch("/api/data")', timer: 500 }],
        output: [],
        highlight: 'callStack',
        explanation: 'setTimeout is called with 100ms delay. This will abort the fetch before it completes.',
      },
      {
        callStack: ['<script>'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [
          { label: 'fetch("/api/data")', timer: 500 },
          { label: 'setTimeout(abort, 100)', timer: 100 },
        ],
        output: [],
        highlight: 'webApi',
        explanation: 'The abort timer is registered. Both the fetch and the abort timer are running concurrently.',
      },
      {
        callStack: ['<script>', 'console.log("request started")'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [
          { label: 'fetch("/api/data")', timer: 500 },
          { label: 'setTimeout(abort, 100)', timer: 100 },
        ],
        output: [],
        highlight: 'callStack',
        explanation: 'console.log("request started") runs synchronously.',
      },
      {
        callStack: [],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [
          { label: 'fetch("/api/data")', timer: 500 },
          { label: 'setTimeout(abort, 100)', timer: 100 },
        ],
        output: ['request started'],
        highlight: 'output',
        explanation: '"request started" is printed. Script finishes. Now we wait for timers.',
      },
      {
        callStack: [],
        microtaskQueue: [],
        macrotaskQueue: ['abort callback'],
        webApis: [{ label: 'fetch("/api/data")', timer: 500 }],
        output: ['request started'],
        highlight: 'macrotask',
        explanation: '100ms passes. The abort timer fires first (before the 500ms fetch completes). Its callback enters the macrotask queue.',
      },
      {
        callStack: ['abort callback', 'controller.abort()'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [{ label: 'fetch (ABORTED)', timer: 500 }],
        output: ['request started'],
        highlight: 'callStack',
        explanation: 'controller.abort() is called. This sends an abort signal to the fetch, which cancels the network request.',
      },
      {
        callStack: ['abort callback', 'console.log("aborted!")'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['request started'],
        highlight: 'callStack',
        explanation: 'The fetch is cancelled. console.log("aborted!") runs.',
      },
      {
        callStack: [],
        microtaskQueue: ['fetch .catch(cb)'],
        macrotaskQueue: [],
        webApis: [],
        output: ['request started', 'aborted!'],
        highlight: 'microtask',
        explanation: '"aborted!" is printed. The cancelled fetch rejects with AbortError. The .catch callback is scheduled as a microtask.',
      },
      {
        callStack: ['fetch .catch(cb)'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['request started', 'aborted!'],
        highlight: 'callStack',
        explanation: 'The .catch callback runs. e.name === "AbortError" is true, so it logs "request aborted".',
      },
      {
        callStack: [],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['request started', 'aborted!', 'request aborted'],
        highlight: 'output',
        explanation: '"request aborted" is printed. AbortController successfully cancelled the in-flight request. Always use AbortController in React useEffect cleanup to prevent state updates on unmounted components.',
      },
    ],
  },
  {
    id: 'microtask-in-macrotask',
    title: 'Microtask inside Macrotask',
    code: `console.log('start')

setTimeout(() => {
  console.log('timeout 1')
  Promise.resolve().then(() => {
    console.log('promise in timeout')
  })
}, 0)

setTimeout(() => {
  console.log('timeout 2')
}, 0)

Promise.resolve().then(() => {
  console.log('promise 1')
})

console.log('end')`,
    expectedOutput: ['start', 'end', 'promise 1', 'timeout 1', 'promise in timeout', 'timeout 2'],
    explanation: 'After each macrotask completes, the engine drains the entire microtask queue before moving to the next macrotask. So "promise in timeout" runs between "timeout 1" and "timeout 2" because the microtask created inside timeout 1 must be processed first.',
    steps: [
      {
        callStack: ['<script>'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: [],
        highlight: 'callStack',
        explanation: 'Script starts executing.',
      },
      {
        callStack: ['<script>', 'console.log("start")'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: [],
        highlight: 'callStack',
        explanation: 'console.log("start") runs synchronously.',
      },
      {
        callStack: ['<script>'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['start'],
        highlight: 'output',
        explanation: '"start" is printed.',
      },
      {
        callStack: ['<script>', 'setTimeout(cb1, 0)'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['start'],
        highlight: 'callStack',
        explanation: 'First setTimeout is called with 0ms delay.',
      },
      {
        callStack: ['<script>'],
        microtaskQueue: [],
        macrotaskQueue: ['setTimeout cb1'],
        webApis: [],
        output: ['start'],
        highlight: 'macrotask',
        explanation: 'Timer expires immediately. cb1 enters the macrotask queue.',
      },
      {
        callStack: ['<script>', 'setTimeout(cb2, 0)'],
        microtaskQueue: [],
        macrotaskQueue: ['setTimeout cb1'],
        webApis: [],
        output: ['start'],
        highlight: 'callStack',
        explanation: 'Second setTimeout is called with 0ms delay.',
      },
      {
        callStack: ['<script>'],
        microtaskQueue: [],
        macrotaskQueue: ['setTimeout cb1', 'setTimeout cb2'],
        webApis: [],
        output: ['start'],
        highlight: 'macrotask',
        explanation: 'cb2 enters the macrotask queue after cb1. Two macrotasks are waiting.',
      },
      {
        callStack: ['<script>', 'Promise.resolve().then(promiseCb)'],
        microtaskQueue: [],
        macrotaskQueue: ['setTimeout cb1', 'setTimeout cb2'],
        webApis: [],
        output: ['start'],
        highlight: 'callStack',
        explanation: 'Promise.resolve().then() schedules promiseCb as a microtask.',
      },
      {
        callStack: ['<script>'],
        microtaskQueue: ['promiseCb'],
        macrotaskQueue: ['setTimeout cb1', 'setTimeout cb2'],
        webApis: [],
        output: ['start'],
        highlight: 'microtask',
        explanation: 'promiseCb enters the microtask queue.',
      },
      {
        callStack: ['<script>', 'console.log("end")'],
        microtaskQueue: ['promiseCb'],
        macrotaskQueue: ['setTimeout cb1', 'setTimeout cb2'],
        webApis: [],
        output: ['start'],
        highlight: 'callStack',
        explanation: 'console.log("end") runs synchronously.',
      },
      {
        callStack: [],
        microtaskQueue: ['promiseCb'],
        macrotaskQueue: ['setTimeout cb1', 'setTimeout cb2'],
        webApis: [],
        output: ['start', 'end'],
        highlight: 'output',
        explanation: '"end" is printed. Script finishes. Microtask queue is drained before any macrotask.',
      },
      {
        callStack: ['promiseCb', 'console.log("promise 1")'],
        microtaskQueue: [],
        macrotaskQueue: ['setTimeout cb1', 'setTimeout cb2'],
        webApis: [],
        output: ['start', 'end'],
        highlight: 'callStack',
        explanation: 'promiseCb runs. console.log("promise 1") executes.',
      },
      {
        callStack: [],
        microtaskQueue: [],
        macrotaskQueue: ['setTimeout cb1', 'setTimeout cb2'],
        webApis: [],
        output: ['start', 'end', 'promise 1'],
        highlight: 'output',
        explanation: '"promise 1" is printed. Microtask queue is empty. Now the first macrotask can run.',
      },
      {
        callStack: ['setTimeout cb1'],
        microtaskQueue: [],
        macrotaskQueue: ['setTimeout cb2'],
        webApis: [],
        output: ['start', 'end', 'promise 1'],
        highlight: 'callStack',
        explanation: 'setTimeout cb1 runs. It logs "timeout 1" and creates a new promise.',
      },
      {
        callStack: ['setTimeout cb1', 'console.log("timeout 1")'],
        microtaskQueue: [],
        macrotaskQueue: ['setTimeout cb2'],
        webApis: [],
        output: ['start', 'end', 'promise 1'],
        highlight: 'callStack',
        explanation: 'console.log("timeout 1") executes.',
      },
      {
        callStack: ['setTimeout cb1'],
        microtaskQueue: ['promise in timeout cb'],
        macrotaskQueue: ['setTimeout cb2'],
        webApis: [],
        output: ['start', 'end', 'promise 1', 'timeout 1'],
        highlight: 'microtask',
        explanation: '"timeout 1" is printed. Promise.resolve().then() inside cb1 schedules a new microtask.',
      },
      {
        callStack: [],
        microtaskQueue: ['promise in timeout cb'],
        macrotaskQueue: ['setTimeout cb2'],
        webApis: [],
        output: ['start', 'end', 'promise 1', 'timeout 1'],
        highlight: 'callStack',
        explanation: 'cb1 finishes. But before timeout cb2 can run, the microtask queue must be drained!',
      },
      {
        callStack: ['promise in timeout cb', 'console.log("promise in timeout")'],
        microtaskQueue: [],
        macrotaskQueue: ['setTimeout cb2'],
        webApis: [],
        output: ['start', 'end', 'promise 1', 'timeout 1'],
        highlight: 'callStack',
        explanation: 'The microtask created inside timeout 1 runs NOW, before timeout 2. This is the key insight.',
      },
      {
        callStack: [],
        microtaskQueue: [],
        macrotaskQueue: ['setTimeout cb2'],
        webApis: [],
        output: ['start', 'end', 'promise 1', 'timeout 1', 'promise in timeout'],
        highlight: 'output',
        explanation: '"promise in timeout" is printed between the two timeouts. Microtask queue is empty. Now timeout 2 can run.',
      },
      {
        callStack: ['setTimeout cb2', 'console.log("timeout 2")'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['start', 'end', 'promise 1', 'timeout 1', 'promise in timeout'],
        highlight: 'callStack',
        explanation: 'setTimeout cb2 runs. console.log("timeout 2") executes.',
      },
      {
        callStack: [],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['start', 'end', 'promise 1', 'timeout 1', 'promise in timeout', 'timeout 2'],
        highlight: 'output',
        explanation: '"timeout 2" is printed last. Key rule: after EVERY macrotask, the engine fully drains the microtask queue before picking the next macrotask.',
      },
    ],
  },
  {
    id: 'async-generators',
    title: 'Async Generators',
    code: `async function* counter(max) {
  for (let i = 1; i <= max; i++) {
    await new Promise(r => setTimeout(r, 100))
    yield i
  }
}

async function main() {
  console.log('start')
  for await (const n of counter(3)) {
    console.log('got:', n)
  }
  console.log('done')
}

main()
console.log('after main()')`,
    expectedOutput: ['start', 'after main()', 'got: 1', 'got: 2', 'got: 3', 'done'],
    explanation: 'Async generators combine async/await with generators. for-await-of consumes values one at a time, awaiting each yield. The generator pauses between yields, allowing other code to run. main() is suspended at each iteration of for-await.',
    steps: [
      {
        callStack: ['<script>'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: [],
        highlight: 'callStack',
        explanation: 'Script starts. counter() (async generator) and main() (async function) are defined.',
      },
      {
        callStack: ['<script>', 'main()'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: [],
        highlight: 'callStack',
        explanation: 'main() is called. It runs synchronously until the first await.',
      },
      {
        callStack: ['<script>', 'main()', 'console.log("start")'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: [],
        highlight: 'callStack',
        explanation: 'console.log("start") runs synchronously inside main().',
      },
      {
        callStack: ['<script>', 'main()'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['start'],
        highlight: 'output',
        explanation: '"start" is printed. Next is for-await-of counter(3), which calls counter and awaits the first value.',
      },
      {
        callStack: ['<script>', 'main()', 'counter.next()'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['start'],
        highlight: 'callStack',
        explanation: 'for-await calls counter.next(). The generator starts with i=1 and hits await new Promise with setTimeout(r, 100).',
      },
      {
        callStack: ['<script>'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [{ label: 'setTimeout(resolve, 100)', timer: 100 }],
        output: ['start'],
        highlight: 'webApi',
        explanation: 'The generator is suspended at await. main() is suspended at for-await. Control returns to the script.',
      },
      {
        callStack: ['<script>', 'console.log("after main()")'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [{ label: 'setTimeout(resolve, 100)', timer: 100 }],
        output: ['start'],
        highlight: 'callStack',
        explanation: 'console.log("after main()") runs synchronously — main() is suspended, so control moved past the main() call.',
      },
      {
        callStack: [],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [{ label: 'setTimeout(resolve, 100)', timer: 100 }],
        output: ['start', 'after main()'],
        highlight: 'output',
        explanation: '"after main()" is printed. Script finishes. Waiting for the 100ms timer.',
      },
      {
        callStack: [],
        microtaskQueue: [],
        macrotaskQueue: ['timer resolve'],
        webApis: [],
        output: ['start', 'after main()'],
        highlight: 'macrotask',
        explanation: '100ms passes. The timer fires. The generator will resume.',
      },
      {
        callStack: ['counter (yield 1)'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['start', 'after main()'],
        highlight: 'callStack',
        explanation: 'The generator resumes after await. It reaches yield 1. The yielded value is sent to for-await.',
      },
      {
        callStack: ['main (for-await)', 'console.log("got:", 1)'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['start', 'after main()'],
        highlight: 'callStack',
        explanation: 'main() resumes. n = 1. console.log("got:", n) runs.',
      },
      {
        callStack: ['main (for-await)', 'counter.next()'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['start', 'after main()', 'got: 1'],
        highlight: 'callStack',
        explanation: '"got: 1" is printed. for-await calls counter.next() for the second iteration. i=2, another 100ms await.',
      },
      {
        callStack: [],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [{ label: 'setTimeout(resolve, 100)', timer: 100 }],
        output: ['start', 'after main()', 'got: 1'],
        highlight: 'webApi',
        explanation: 'Generator and main() are suspended again. Another 100ms wait.',
      },
      {
        callStack: ['counter (yield 2)'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['start', 'after main()', 'got: 1'],
        highlight: 'callStack',
        explanation: '100ms passes. Generator resumes, yields 2.',
      },
      {
        callStack: ['main (for-await)', 'console.log("got:", 2)'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['start', 'after main()', 'got: 1'],
        highlight: 'callStack',
        explanation: 'main() resumes. n = 2. console.log("got:", n) runs.',
      },
      {
        callStack: [],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [{ label: 'setTimeout(resolve, 100)', timer: 100 }],
        output: ['start', 'after main()', 'got: 1', 'got: 2'],
        highlight: 'webApi',
        explanation: '"got: 2" is printed. Third iteration begins with another 100ms wait.',
      },
      {
        callStack: ['counter (yield 3)'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['start', 'after main()', 'got: 1', 'got: 2'],
        highlight: 'callStack',
        explanation: '100ms passes. Generator resumes, yields 3 (last value since i <= max where max=3).',
      },
      {
        callStack: ['main (for-await)', 'console.log("got:", 3)'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['start', 'after main()', 'got: 1', 'got: 2'],
        highlight: 'callStack',
        explanation: 'main() resumes. n = 3. console.log("got:", n) runs.',
      },
      {
        callStack: ['main (for-await)'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['start', 'after main()', 'got: 1', 'got: 2', 'got: 3'],
        highlight: 'callStack',
        explanation: '"got: 3" is printed. for-await calls counter.next() again. The generator loop ends (i=4 > 3), so it returns {done: true}.',
      },
      {
        callStack: ['main', 'console.log("done")'],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['start', 'after main()', 'got: 1', 'got: 2', 'got: 3'],
        highlight: 'callStack',
        explanation: 'for-await loop exits. console.log("done") runs.',
      },
      {
        callStack: [],
        microtaskQueue: [],
        macrotaskQueue: [],
        webApis: [],
        output: ['start', 'after main()', 'got: 1', 'got: 2', 'got: 3', 'done'],
        highlight: 'output',
        explanation: '"done" is printed. Async generators are powerful for streaming data, paginated APIs, and lazy async iteration.',
      },
    ],
  },
]

type HighlightArea = ExecutionStep['highlight']

function getHighlightBadgeClass(highlight: HighlightArea): string {
  switch (highlight) {
    case 'callStack': return styles.badgeSync
    case 'microtask': return styles.badgeMicro
    case 'macrotask': return styles.badgeMacro
    case 'webApi': return styles.badgeWebApi
    default: return styles.badgeIdle
  }
}

function getHighlightLabel(highlight: HighlightArea): string {
  switch (highlight) {
    case 'callStack': return 'Call Stack'
    case 'microtask': return 'Microtask'
    case 'macrotask': return 'Macrotask'
    case 'webApi': return 'Web API'
    case 'output': return 'Output'
    default: return 'Idle'
  }
}

export default function AsyncVisualizerClient() {
  const [selectedExampleId, setSelectedExampleId] = useState(examples[0].id)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  const selectedExample = examples.find(e => e.id === selectedExampleId) ?? examples[0]
  const totalSteps = selectedExample.steps.length
  const currentStep = selectedExample.steps[currentStepIndex]

  const { isPlaying, toggle: togglePlay, setSpeed, speed } = useAutoPlay(
    totalSteps,
    currentStepIndex,
    setCurrentStepIndex,
    { speed: 1200 }
  )

  const handleExampleChange = useCallback((exampleId: string) => {
    setSelectedExampleId(exampleId)
    setCurrentStepIndex(0)
  }, [])

  const handlePrev = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(i => i - 1)
    }
  }, [currentStepIndex])

  const handleNext = useCallback(() => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(i => i + 1)
    }
  }, [currentStepIndex, totalSteps])

  const handleReset = useCallback(() => {
    setCurrentStepIndex(0)
  }, [])

  const previousOutput = currentStepIndex > 0
    ? selectedExample.steps[currentStepIndex - 1].output
    : []

  return (
    <>
      <NavBar breadcrumbs={[
        { label: 'Playground' },
        { label: 'Async Visualizer' },
      ]} />
      <motion.div
        className={styles.container}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={entranceTransition}
      >
        <header className={styles.header}>
          <h1 className={styles.title}>Promise & Async Visualizer</h1>
          <p className={styles.subtitle}>
            Step through async execution to understand call stack, microtask queue, macrotask queue, and Web APIs
          </p>
        </header>

        <div className={styles.exampleBar}>
          <span className={styles.exampleLabel}>Examples:</span>
          <div className={styles.exampleButtons}>
            {examples.map(ex => (
              <button
                key={ex.id}
                className={clsx(
                  styles.exampleButton,
                  selectedExampleId === ex.id && styles.exampleButtonActive
                )}
                onClick={() => handleExampleChange(ex.id)}
              >
                {ex.title}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.mainGrid}>
          <div className={styles.leftPanel}>
            <div className={styles.codeSection}>
              <div className={styles.codeSectionHeader}>
                <h2 className={styles.codeSectionTitle}>Code</h2>
              </div>
              <textarea
                className={styles.codeTextarea}
                value={selectedExample.code}
                readOnly
                spellCheck={false}
              />
              <div className={styles.expectedOutput}>
                <h3 className={styles.expectedOutputTitle}>Expected Output</h3>
                <div className={styles.expectedOutputList}>
                  {selectedExample.expectedOutput.map((item, i) => (
                    <span key={i} className={styles.expectedOutputItem}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <StepControls
              onPrev={handlePrev}
              onNext={handleNext}
              onReset={handleReset}
              canPrev={currentStepIndex > 0}
              canNext={currentStepIndex < totalSteps - 1}
              isPlaying={isPlaying}
              onPlayPause={togglePlay}
              showPlayPause
              stepInfo={{ current: currentStepIndex + 1, total: totalSteps }}
            />

            <div className={styles.controlsRow}>
              <div className={styles.speedControl}>
                <span>Speed:</span>
                <input
                  type="range"
                  className={styles.speedSlider}
                  min={200}
                  max={3000}
                  step={100}
                  value={3200 - speed}
                  onChange={e => setSpeed(3200 - Number(e.target.value))}
                />
                <span>{speed}ms</span>
              </div>
            </div>

            {currentStep && (
              <div className={styles.explanationBox}>
                <span className={clsx(
                  styles.explanationBadge,
                  getHighlightBadgeClass(currentStep.highlight)
                )}>
                  {getHighlightLabel(currentStep.highlight)}
                </span>
                <p className={styles.explanationText}>
                  {currentStep.explanation}
                </p>
              </div>
            )}
          </div>

          <div className={styles.rightPanel}>
            <div className={styles.queuesGrid}>
              <QueueColumn
                title="Call Stack"
                items={currentStep?.callStack ?? []}
                dotClass={styles.queueDotCallStack}
                itemClass={styles.queueItemCallStack}
                highlight={currentStep?.highlight === 'callStack'}
                emptyText="Empty"
              />
              <QueueColumn
                title="Microtask Queue"
                items={currentStep?.microtaskQueue ?? []}
                dotClass={styles.queueDotMicrotask}
                itemClass={styles.queueItemMicrotask}
                highlight={currentStep?.highlight === 'microtask'}
                emptyText="Empty"
              />
              <QueueColumn
                title="Macrotask Queue"
                items={currentStep?.macrotaskQueue ?? []}
                dotClass={styles.queueDotMacrotask}
                itemClass={styles.queueItemMacrotask}
                highlight={currentStep?.highlight === 'macrotask'}
                emptyText="Empty"
              />
              <QueueColumn
                title="Web APIs"
                items={currentStep?.webApis.map(w => w.label) ?? []}
                dotClass={styles.queueDotWebApi}
                itemClass={styles.queueItemWebApi}
                highlight={currentStep?.highlight === 'webApi'}
                emptyText="No active timers"
                timers={currentStep?.webApis}
              />
            </div>

            <div className={styles.outputPanel}>
              <div className={styles.queueHeader}>
                <div className={clsx(styles.queueDot, styles.queueDotOutput)} />
                <h3 className={styles.queueTitle}>Console Output</h3>
                <span className={styles.queueCount}>
                  {currentStep?.output.length ?? 0} lines
                </span>
              </div>
              <div className={styles.outputItems}>
                {currentStep && currentStep.output.length > 0 ? (
                  currentStep.output.map((line, i) => {
                    const isNew = i >= previousOutput.length
                    return (
                      <div
                        key={`${currentStepIndex}-${i}`}
                        className={clsx(
                          styles.outputLine,
                          isNew && styles.outputLineNew
                        )}
                      >
                        <span className={styles.outputLineNumber}>{i + 1}</span>
                        <span className={styles.outputLineText}>{line}</span>
                      </div>
                    )
                  })
                ) : (
                  <div className={styles.emptyQueue}>No output yet</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}

interface QueueColumnProps {
  title: string
  items: string[]
  dotClass: string
  itemClass: string
  highlight: boolean
  emptyText: string
  timers?: WebApiEntry[]
}

function QueueColumn({
  title,
  items,
  dotClass,
  itemClass,
  highlight,
  emptyText,
  timers,
}: QueueColumnProps) {
  return (
    <div className={clsx(styles.queueColumn, highlight && styles.queueItemHighlight)}>
      <div className={styles.queueHeader}>
        <div className={clsx(styles.queueDot, dotClass)} />
        <h3 className={styles.queueTitle}>{title}</h3>
        <span className={styles.queueCount}>{items.length}</span>
      </div>
      <div className={styles.queueItems}>
        {items.length > 0 ? (
          items.map((item, i) => (
            <div key={`${title}-${i}`} className={clsx(styles.queueItem, itemClass)}>
              {item}
              {timers?.[i]?.timer !== undefined && (
                <span className={styles.webApiTimer}>
                  <Timer size={10} /> {timers[i].timer}ms
                </span>
              )}
            </div>
          ))
        ) : (
          <div className={styles.emptyQueue}>{emptyText}</div>
        )}
      </div>
    </div>
  )
}
