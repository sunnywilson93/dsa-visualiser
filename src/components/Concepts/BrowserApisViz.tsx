'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Tab = 'dom-events' | 'fetch-api' | 'web-storage' | 'abort-controller'

const tabLabels: Record<Tab, string> = {
  'dom-events': 'DOM Events',
  'fetch-api': 'Fetch API',
  'web-storage': 'Web Storage',
  'abort-controller': 'AbortController',
}

const tabKeys: Tab[] = ['dom-events', 'fetch-api', 'web-storage', 'abort-controller']

const eventSteps = [
  { phase: 'Capture', path: ['document', 'body', 'div'], desc: 'Event travels DOWN from document to target' },
  { phase: 'Capture', path: ['document', 'body', 'div', 'button'], desc: 'Continuing down through the DOM tree' },
  { phase: 'Target', path: ['button'], desc: 'Event reaches the target element' },
  { phase: 'Bubble', path: ['button', 'div'], desc: 'Event bubbles UP from target to document' },
  { phase: 'Bubble', path: ['button', 'div', 'body', 'document'], desc: 'Continuing up to document' },
]

const fetchSteps = [
  { label: 'Request', code: 'fetch("/api/users")', status: 'pending' as const, desc: 'Initiate network request' },
  { label: 'Pending', code: '// Promise pending...', status: 'pending' as const, desc: 'Waiting for server response' },
  { label: 'Response', code: 'Response { status: 200, ok: true }', status: 'fulfilled' as const, desc: 'Server responds with data' },
  { label: 'Parse', code: 'const data = await res.json()', status: 'fulfilled' as const, desc: 'Parse response body as JSON' },
  { label: 'Error', code: '.catch(err => /* network fail */)', status: 'rejected' as const, desc: 'Or: request fails with error' },
]

const abortSteps = [
  { label: 'Create', desc: 'Create an AbortController', visual: ['const controller = new AbortController();', 'const signal = controller.signal;'] },
  { label: 'Pass Signal', desc: 'Attach signal to fetch request', visual: ['fetch("/api/data", { signal })', '  // fetch now listens for abort'] },
  { label: 'Abort!', desc: 'Calling abort() cancels the fetch', visual: ['controller.abort();', '  // signal.aborted = true'] },
  { label: 'Rejected', desc: 'Fetch rejects with AbortError', visual: ['catch(e) {', '  e.name === "AbortError"', '  // request was cancelled', '}'] },
]

const domElements = ['document', 'body', 'div', 'button'] as const

const statusStyle = { pending: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300', fulfilled: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300', rejected: 'bg-red-500/20 border-red-500/30 text-red-300' }

interface BrowserApisVizProps {
  mode?: Tab
}

export function BrowserApisViz({ mode }: BrowserApisVizProps) {
  const [tab, setTab] = useState<Tab>(mode ?? 'dom-events')
  const [step, setStep] = useState(0)
  const [storage, setStorage] = useState<{ local: Record<string, string>; session: Record<string, string> }>({ local: {}, session: {} })

  const switchTab = (t: Tab) => { setTab(t); setStep(0) }

  const addItem = (type: 'local' | 'session') => {
    const key = `key${Object.keys(storage[type]).length + 1}`
    setStorage(s => ({ ...s, [type]: { ...s[type], [key]: `val${Object.keys(s[type]).length + 1}` } }))
  }

  const clearStorage = (type: 'local' | 'session') => {
    setStorage(s => ({ ...s, [type]: {} }))
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-center text-lg font-semibold text-white">{tabLabels[tab]}</h3>

      <div className="flex gap-[var(--spacing-sm)] justify-center bg-[var(--color-black-30)] border border-[var(--color-white-8)] rounded-full p-[0.35rem] flex-wrap">
        {tabKeys.map(t => (
          <button key={t} onClick={() => switchTab(t)} className={`px-[var(--spacing-lg)] py-[var(--spacing-sm)] text-sm font-medium rounded-full transition-all duration-150 ${t === tab ? 'bg-[var(--color-neon-viz-18)] border border-[var(--color-neon-viz-70)] text-[var(--color-text-bright)] shadow-[var(--glow-xl)_var(--color-neon-viz-25)]' : 'bg-[var(--color-white-4)] border border-[var(--color-white-8)] text-[var(--color-gray-500)] hover:bg-[var(--color-white-8)] hover:text-[var(--color-gray-300)]'}`}>
            {tabLabels[t]}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'dom-events' && (
          <motion.div key="dom" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3">
            <div className="flex items-center justify-center gap-1">
              {domElements.map((el, i) => {
                const active = eventSteps[step].path.includes(el)
                return (
                  <motion.div key={el} animate={{ scale: active ? 1.1 : 1 }} className={`px-3 py-2 rounded-lg text-xs font-mono border transition-all ${active ? 'bg-blue-500/20 border-blue-500/30 text-blue-300' : 'bg-black-30 border-white-10 text-gray-500'}`}>
                    {el}
                    {i < domElements.length - 1 && <span className="ml-2 text-gray-600">&gt;</span>}
                  </motion.div>
                )
              })}
            </div>
            <div className={`text-center text-xs font-semibold ${eventSteps[step].phase === 'Capture' ? 'text-yellow-300' : eventSteps[step].phase === 'Target' ? 'text-emerald-300' : 'text-blue-300'}`}>
              Phase: {eventSteps[step].phase}
            </div>
            <div className="text-center text-sm text-gray-300">{eventSteps[step].desc}</div>
            <div className="flex justify-center gap-2">
              <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="px-4 py-2 rounded-lg bg-white-5 text-gray-400 disabled:opacity-30 hover:bg-white-10 transition-colors">Previous</button>
              <button onClick={() => setStep(Math.min(eventSteps.length - 1, step + 1))} disabled={step === eventSteps.length - 1} className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 disabled:opacity-30 hover:bg-blue-500/30 transition-colors">Next</button>
            </div>
          </motion.div>
        )}

        {tab === 'fetch-api' && (
          <motion.div key="fetch" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3">
            <div className={`p-4 rounded-xl border ${statusStyle[fetchSteps[step].status]}`}>
              <div className="text-xs uppercase tracking-wide mb-1 opacity-70">{fetchSteps[step].label}</div>
              <pre className="font-mono text-sm whitespace-pre-wrap">{fetchSteps[step].code}</pre>
            </div>
            <div className="text-center text-sm text-gray-300">{fetchSteps[step].desc}</div>
            <div className="flex justify-center gap-2">
              <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="px-4 py-2 rounded-lg bg-white-5 text-gray-400 disabled:opacity-30 hover:bg-white-10 transition-colors">Previous</button>
              <button onClick={() => setStep(Math.min(fetchSteps.length - 1, step + 1))} disabled={step === fetchSteps.length - 1} className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 disabled:opacity-30 hover:bg-blue-500/30 transition-colors">Next</button>
            </div>
          </motion.div>
        )}

        {tab === 'web-storage' && (
          <motion.div key="storage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              {(['local', 'session'] as const).map(type => (
                <div key={type} className="rounded-xl border border-white-10 bg-black-30 p-3">
                  <div className={`text-xs font-semibold mb-2 ${type === 'local' ? 'text-emerald-300' : 'text-yellow-300'}`}>
                    {type === 'local' ? 'localStorage' : 'sessionStorage'}
                    <span className="text-gray-600 font-normal ml-1">{type === 'local' ? '(persists)' : '(tab only)'}</span>
                  </div>
                  <div className="min-h-[60px] space-y-1">
                    <AnimatePresence>
                      {Object.entries(storage[type]).map(([k, v]) => (
                        <motion.div key={k} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="flex justify-between font-mono text-xs bg-black-50 rounded px-2 py-1">
                          <span className="text-blue-300">{k}</span>
                          <span className="text-gray-400">{v}</span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {Object.keys(storage[type]).length === 0 && <div className="text-gray-600 text-xs text-center py-3">Empty</div>}
                  </div>
                  <div className="flex gap-1 mt-2">
                    <button onClick={() => addItem(type)} className="flex-1 px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 transition-colors">setItem</button>
                    <button onClick={() => clearStorage(type)} className="flex-1 px-2 py-1 rounded text-xs bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 transition-colors">clear</button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {tab === 'abort-controller' && (
          <motion.div key="abort" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3">
            <div className={`p-4 rounded-xl border ${step >= 2 ? 'bg-red-500/20 border-red-500/30' : 'bg-blue-500/20 border-blue-500/30'}`}>
              <div className="text-xs uppercase tracking-wide mb-1 text-gray-400">{abortSteps[step].label}</div>
              <pre className={`font-mono text-sm whitespace-pre-wrap ${step >= 2 ? 'text-red-300' : 'text-blue-300'}`}>
                {abortSteps[step].visual.join('\n')}
              </pre>
            </div>
            <div className="text-center text-sm text-gray-300">{abortSteps[step].desc}</div>
            <div className="flex justify-center gap-2">
              <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="px-4 py-2 rounded-lg bg-white-5 text-gray-400 disabled:opacity-30 hover:bg-white-10 transition-colors">Previous</button>
              <button onClick={() => setStep(Math.min(abortSteps.length - 1, step + 1))} disabled={step === abortSteps.length - 1} className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 disabled:opacity-30 hover:bg-blue-500/30 transition-colors">Next</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
