'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Tab = 'map' | 'set' | 'symbol'

interface Entry { key: string; value: string }

export function DataStructuresViz() {
  const [tab, setTab] = useState<Tab>('map')
  const [mapEntries, setMapEntries] = useState<Entry[]>([{ key: '"age"', value: '30' }])
  const [mapResult, setMapResult] = useState('')
  const [setItems, setSetItems] = useState<string[]>(['3'])
  const [setResult, setSetResult] = useState('')
  const [symbolResult, setSymbolResult] = useState('')

  const tabs: { id: Tab; label: string }[] = [
    { id: 'map', label: 'Map' },
    { id: 'set', label: 'Set' },
    { id: 'symbol', label: 'Symbol' },
  ]

  const mapOps = [
    { label: 'set("name", "Alice")', run: () => { setMapEntries(e => e.some(x => x.key === '"name"') ? e.map(x => x.key === '"name"' ? { ...x, value: '"Alice"' } : x) : [...e, { key: '"name"', value: '"Alice"' }]); setMapResult('Map size: ' + (mapEntries.some(x => x.key === '"name"') ? mapEntries.length : mapEntries.length + 1)) } },
    { label: 'set({}, "obj key")', run: () => { setMapEntries(e => [...e, { key: '{} (object)', value: '"obj key"' }]); setMapResult('Any type can be a key!') } },
    { label: 'get("name")', run: () => { const found = mapEntries.find(x => x.key === '"name"'); setMapResult(found ? `"${found.value}"` : 'undefined') } },
    { label: 'delete("name")', run: () => { setMapEntries(e => e.filter(x => x.key !== '"name"')); setMapResult('Deleted "name"') } },
  ]

  const setOps = [
    { label: 'add(1)', run: () => { if (!setItems.includes('1')) { setSetItems(s => [...s, '1']); setSetResult('Added 1') } else setSetResult('1 already exists!') } },
    { label: 'add(2)', run: () => { if (!setItems.includes('2')) { setSetItems(s => [...s, '2']); setSetResult('Added 2') } else setSetResult('2 already exists!') } },
    { label: 'add(1) again', run: () => setSetResult('Ignored! 1 already exists (Sets are unique)') },
    { label: 'has(3)', run: () => setSetResult(setItems.includes('3') ? 'true' : 'false') },
    { label: 'delete(2)', run: () => { setSetItems(s => s.filter(x => x !== '2')); setSetResult('Deleted 2') } },
  ]

  const symbolOps = [
    { label: 'Symbol("id") === Symbol("id")', run: () => setSymbolResult('false -- every Symbol is unique!') },
    { label: 'Symbol.for("shared")', run: () => setSymbolResult('Returns the SAME symbol from global registry') },
    { label: 'typeof Symbol("x")', run: () => setSymbolResult('"symbol" -- a primitive type') },
  ]

  const reset = () => {
    setMapEntries([{ key: '"age"', value: '30' }]); setMapResult('')
    setSetItems(['3']); setSetResult('')
    setSymbolResult('')
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-center text-lg font-semibold text-white">Built-in Data Structures</h3>

      <div className="flex gap-[var(--spacing-sm)] justify-center bg-[var(--color-black-30)] border border-[var(--color-white-8)] rounded-full p-[0.35rem]">
        {tabs.map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); reset() }} className={`px-[var(--spacing-lg)] py-[var(--spacing-sm)] text-sm font-medium rounded-full transition-all duration-150 ${tab === t.id ? 'bg-[var(--color-neon-viz-18)] border border-[var(--color-neon-viz-70)] text-[var(--color-text-bright)] shadow-[var(--glow-xl)_var(--color-neon-viz-25)]' : 'bg-[var(--color-white-4)] border border-[var(--color-white-8)] text-[var(--color-gray-500)] hover:bg-[var(--color-white-8)] hover:text-[var(--color-gray-300)]'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'map' && (
          <motion.div key="map" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-3">
            <div className="flex flex-wrap justify-center gap-2">
              {mapEntries.map((e, i) => (
                <motion.div key={`${e.key}-${i}`} layout initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-1 px-3 py-2 rounded-lg bg-blue-500/20 border border-blue-500/30">
                  <span className="font-mono text-sm text-blue-300">{e.key}</span>
                  <span className="text-gray-500">:</span>
                  <span className="font-mono text-sm text-emerald-400">{e.value}</span>
                </motion.div>
              ))}
              {mapEntries.length === 0 && <div className="text-gray-600 text-sm py-2">Empty Map</div>}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {mapOps.map(op => (
                <button key={op.label} onClick={op.run} className="p-2 rounded-lg bg-black-30 border border-white-10 hover:bg-white-5 transition-colors font-mono text-xs text-blue-300 text-left">{op.label}</button>
              ))}
            </div>
            {mapResult && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg py-2">{mapResult}</motion.div>}
          </motion.div>
        )}

        {tab === 'set' && (
          <motion.div key="set" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-3">
            <div className="flex justify-center gap-2">
              <AnimatePresence mode="popLayout">
                {setItems.map(item => (
                  <motion.div key={item} layout initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="w-12 h-12 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center font-mono text-xl text-blue-300">{item}</motion.div>
                ))}
              </AnimatePresence>
              {setItems.length === 0 && <div className="text-gray-600 text-sm py-3">Empty Set</div>}
            </div>
            <div className="text-center text-xs text-gray-500">Values are always unique</div>
            <div className="grid grid-cols-3 gap-2">
              {setOps.map(op => (
                <button key={op.label} onClick={op.run} className="p-2 rounded-lg bg-black-30 border border-white-10 hover:bg-white-5 transition-colors font-mono text-xs text-blue-300">{op.label}</button>
              ))}
            </div>
            {setResult && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg py-2">{setResult}</motion.div>}
          </motion.div>
        )}

        {tab === 'symbol' && (
          <motion.div key="symbol" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-3">
            <div className="flex justify-center gap-3">
              {['Symbol("id")', 'Symbol("id")'].map((s, i) => (
                <div key={i} className="px-4 py-3 rounded-lg bg-purple-500/10 border border-purple-500/30 font-mono text-sm text-purple-300">{s}<div className="text-[10px] text-gray-500 mt-1">#{i + 1} (unique)</div></div>
              ))}
            </div>
            <div className="text-center text-xs text-gray-500">Same description, different identities</div>
            <div className="flex flex-col gap-2">
              {symbolOps.map(op => (
                <button key={op.label} onClick={op.run} className="p-2 rounded-lg bg-black-30 border border-white-10 hover:bg-white-5 transition-colors font-mono text-xs text-purple-300 text-left">{op.label}</button>
              ))}
            </div>
            {symbolResult && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-sm text-purple-300 bg-purple-500/10 border border-purple-500/20 rounded-lg py-2">{symbolResult}</motion.div>}
          </motion.div>
        )}
      </AnimatePresence>

      <button onClick={reset} className="mx-auto px-4 py-2 rounded-lg bg-white-5 text-gray-400 hover:bg-white-10 transition-colors">Reset</button>
    </div>
  )
}
