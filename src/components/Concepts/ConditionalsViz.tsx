import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Tab = 'ifelse' | 'ternary' | 'truthy'

interface FalsyValue {
  value: string
  display: string
  isFalsy: boolean
}

const falsyValues: FalsyValue[] = [
  { value: 'false', display: 'false', isFalsy: true },
  { value: '0', display: '0', isFalsy: true },
  { value: '""', display: '""', isFalsy: true },
  { value: 'null', display: 'null', isFalsy: true },
  { value: 'undefined', display: 'undefined', isFalsy: true },
  { value: 'NaN', display: 'NaN', isFalsy: true },
  { value: '"0"', display: '"0"', isFalsy: false },
  { value: '[]', display: '[]', isFalsy: false },
  { value: '{}', display: '{}', isFalsy: false },
  { value: '"false"', display: '"false"', isFalsy: false },
]

interface IfElseStep {
  age: number
  highlighted: 'if' | 'elseif' | 'else' | 'none'
  output: string
}

export function ConditionalsViz() {
  const [activeTab, setActiveTab] = useState<Tab>('ifelse')
  const [age, setAge] = useState(18)
  const [ternaryValue, setTernaryValue] = useState(20)
  const [selectedFalsy, setSelectedFalsy] = useState<string | null>(null)

  const getIfElseResult = (): IfElseStep => {
    if (age >= 21) {
      return { age, highlighted: 'if', output: 'Can drink' }
    } else if (age >= 18) {
      return { age, highlighted: 'elseif', output: 'Can vote' }
    } else {
      return { age, highlighted: 'else', output: 'Too young' }
    }
  }

  const result = getIfElseResult()

  return (
    <div className="flex flex-col gap-5">
      {/* Tab selector */}
      <div className="flex gap-2 justify-center bg-black/30 border border-white/10 rounded-full p-1.5">
        <button
          className={`px-5 py-2 text-sm font-medium rounded-full transition-all ${
            activeTab === 'ifelse'
              ? 'bg-purple-500/20 border border-purple-500/70 text-white shadow-[0_0_12px_rgba(168,85,247,0.25)]'
              : 'bg-white/5 border border-white/10 text-gray-500 hover:bg-white/10 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('ifelse')}
        >
          if / else
        </button>
        <button
          className={`px-5 py-2 text-sm font-medium rounded-full transition-all ${
            activeTab === 'ternary'
              ? 'bg-purple-500/20 border border-purple-500/70 text-white shadow-[0_0_12px_rgba(168,85,247,0.25)]'
              : 'bg-white/5 border border-white/10 text-gray-500 hover:bg-white/10 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('ternary')}
        >
          Ternary ? :
        </button>
        <button
          className={`px-5 py-2 text-sm font-medium rounded-full transition-all ${
            activeTab === 'truthy'
              ? 'bg-purple-500/20 border border-purple-500/70 text-white shadow-[0_0_12px_rgba(168,85,247,0.25)]'
              : 'bg-white/5 border border-white/10 text-gray-500 hover:bg-white/10 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('truthy')}
        >
          Truthy / Falsy
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'ifelse' && (
          <motion.div
            key="ifelse"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-5"
          >
            <div className="flex items-center gap-5 px-4 py-3 bg-black/30 rounded-lg">
              <label className="font-mono text-base text-white min-w-20">age = {age}</label>
              <input
                type="range"
                min="10"
                max="30"
                value={age}
                onChange={e => setAge(Number(e.target.value))}
                className="flex-1 h-1.5 bg-white/10 rounded outline-none appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-purple-500 [&::-webkit-slider-thumb]:to-pink-500 [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </div>

            <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden">
              <pre className="m-0 p-4 font-mono text-xs">
                <div className={`px-2 py-0.5 transition-colors ${result.highlighted === 'if' ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-500'}`}>
                  {`if (age >= 21) {`}
                </div>
                <div className={`px-2 py-0.5 transition-colors ${result.highlighted === 'if' ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-500'}`}>
                  {`  console.log("Can drink");`}
                </div>
                <div className={`px-2 py-0.5 transition-colors ${result.highlighted === 'elseif' ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-500'}`}>
                  {`} else if (age >= 18) {`}
                </div>
                <div className={`px-2 py-0.5 transition-colors ${result.highlighted === 'elseif' ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-500'}`}>
                  {`  console.log("Can vote");`}
                </div>
                <div className={`px-2 py-0.5 transition-colors ${result.highlighted === 'else' ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-500'}`}>
                  {`} else {`}
                </div>
                <div className={`px-2 py-0.5 transition-colors ${result.highlighted === 'else' ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-500'}`}>
                  {`  console.log("Too young");`}
                </div>
                <div className="px-2 py-0.5 text-gray-500">{`}`}</div>
              </pre>
            </div>

            <div className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500/10 border border-emerald-400/30 rounded-lg">
              <span className="text-sm text-gray-500">Output:</span>
              <motion.code
                key={result.output}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                className="font-mono text-lg font-semibold text-emerald-500"
              >
                &quot;{result.output}&quot;
              </motion.code>
            </div>
          </motion.div>
        )}

        {activeTab === 'ternary' && (
          <motion.div
            key="ternary"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-5"
          >
            <div className="flex items-center gap-5 px-4 py-3 bg-black/30 rounded-lg">
              <label className="font-mono text-base text-white min-w-20">age = {ternaryValue}</label>
              <input
                type="range"
                min="10"
                max="30"
                value={ternaryValue}
                onChange={e => setTernaryValue(Number(e.target.value))}
                className="flex-1 h-1.5 bg-white/10 rounded outline-none appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-purple-500 [&::-webkit-slider-thumb]:to-pink-500 [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-center flex-wrap gap-2 px-5 py-6 bg-black/30 rounded-xl">
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xs text-gray-500 uppercase">condition</span>
                <code className={`px-2.5 py-1 rounded-md font-mono text-base transition-all ${
                  ternaryValue >= 18 ? 'text-emerald-500 bg-emerald-500/15' : 'text-red-500 bg-red-500/15'
                }`}>
                  age &gt;= 18
                </code>
              </div>
              <span className="text-2xl text-gray-600 font-semibold">?</span>
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xs text-gray-500 uppercase">if true</span>
                <code className={`px-2.5 py-1 rounded-md font-mono text-base transition-all ${
                  ternaryValue >= 18 ? 'text-white bg-purple-500/20 shadow-[0_0_8px_rgba(168,85,247,0.3)]' : 'text-gray-500 bg-black/30'
                }`}>
                  &quot;adult&quot;
                </code>
              </div>
              <span className="text-2xl text-gray-600 font-semibold">:</span>
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xs text-gray-500 uppercase">if false</span>
                <code className={`px-2.5 py-1 rounded-md font-mono text-base transition-all ${
                  ternaryValue < 18 ? 'text-white bg-purple-500/20 shadow-[0_0_8px_rgba(168,85,247,0.3)]' : 'text-gray-500 bg-black/30'
                }`}>
                  &quot;minor&quot;
                </code>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500/10 border border-emerald-400/30 rounded-lg">
              <span className="text-sm text-gray-500">Result:</span>
              <motion.code
                key={ternaryValue >= 18 ? 'adult' : 'minor'}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                className="font-mono text-lg font-semibold text-emerald-500"
              >
                &quot;{ternaryValue >= 18 ? 'adult' : 'minor'}&quot;
              </motion.code>
            </div>
          </motion.div>
        )}

        {activeTab === 'truthy' && (
          <motion.div
            key="truthy"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-5"
          >
            <p className="text-base text-gray-500 text-center m-0">
              Click a value to test it in an if statement:
            </p>

            <div className="grid grid-cols-5 sm:grid-cols-5 gap-2 max-sm:grid-cols-3">
              {falsyValues.map(item => (
                <motion.button
                  key={item.value}
                  className={`flex items-center justify-center p-2.5 bg-black/30 border-2 rounded-lg cursor-pointer transition-all hover:bg-white/5 ${
                    selectedFalsy === item.value ? 'bg-white/10' : ''
                  }`}
                  style={{
                    borderColor: selectedFalsy === item.value
                      ? (item.isFalsy ? 'var(--color-red-500)' : 'var(--color-emerald-500)')
                      : 'rgba(255,255,255,0.1)'
                  }}
                  onClick={() => setSelectedFalsy(item.value)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <code className="font-mono text-xs text-gray-300">{item.display}</code>
                </motion.button>
              ))}
            </div>

            {selectedFalsy && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-4 px-4 py-3 bg-black/30 rounded-lg"
              >
                <code className="font-mono text-base text-white">if ({selectedFalsy})</code>
                <span className="text-gray-600">→</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  falsyValues.find(f => f.value === selectedFalsy)?.isFalsy
                    ? 'bg-red-500/15 text-red-400'
                    : 'bg-emerald-500/15 text-emerald-500'
                }`}>
                  {falsyValues.find(f => f.value === selectedFalsy)?.isFalsy ? 'FALSY (skips block)' : 'TRUTHY (runs block)'}
                </span>
              </motion.div>
            )}

            <div className="flex gap-6 justify-center">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span>Falsy (6 values)</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Truthy (everything else)</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
