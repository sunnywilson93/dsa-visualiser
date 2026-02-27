'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Shield } from 'lucide-react'
import { StepControls } from '@/components/SharedViz'

interface PollutionStep {
  description: string
  code: string[]
  codeHighlight?: number
  pollutedProperty?: { name: string; value: string }
  affectedObjects: string[]
  showWarning: boolean
  showAffectedRipple: boolean
  prevention?: 'freeze' | 'seal' | 'hasOwn' | 'createNull'
  output: string[]
  phase: 'normal' | 'polluting' | 'affected' | 'prevention'
}

interface ObjectDisplay {
  id: string
  name: string
  props: { name: string; value: string; polluted?: boolean }[]
  protoRef: string | null
}

interface Example {
  id: string
  title: string
  steps: PollutionStep[]
  objects: ObjectDisplay[]
  insight: string
}

type Level = 'intermediate' | 'advanced'

const levelInfo: Record<Level, { label: string; color: string }> = {
  intermediate: { label: 'Intermediate', color: 'var(--color-amber-500)' },
  advanced: { label: 'Advanced', color: 'var(--color-red-500)' }
}

const examples: Record<Level, Example[]> = {
  intermediate: [
    {
      id: 'simple-pollution',
      title: 'Simple Pollution Attack',
      objects: [
        { id: 'user', name: 'user', props: [{ name: 'name', value: '"Alice"' }], protoRef: 'Object.prototype' },
        { id: 'config', name: 'config', props: [{ name: 'theme', value: '"dark"' }], protoRef: 'Object.prototype' },
        { id: 'Object.prototype', name: 'Object.prototype', props: [{ name: 'toString', value: 'fn()' }], protoRef: null }
      ],
      steps: [
        {
          description: 'Normal state - two clean objects with their own properties',
          code: [
            'const user = { name: "Alice" }',
            'const config = { theme: "dark" }',
            '',
            'user.isAdmin    // undefined',
            'config.isAdmin  // undefined',
            '',
            '// Both objects are clean - no isAdmin property'
          ],
          codeHighlight: undefined,
          affectedObjects: [],
          showWarning: false,
          showAffectedRipple: false,
          output: ['undefined', 'undefined'],
          phase: 'normal'
        },
        {
          description: 'DANGER: Someone modifies Object.prototype directly!',
          code: [
            '// Prototype Pollution Attack!',
            'Object.prototype.isAdmin = true',
            '',
            '// This adds isAdmin to the prototype',
            '// that ALL objects inherit from!'
          ],
          codeHighlight: 1,
          pollutedProperty: { name: 'isAdmin', value: 'true' },
          affectedObjects: [],
          showWarning: true,
          showAffectedRipple: false,
          output: [],
          phase: 'polluting'
        },
        {
          description: 'Every object now has isAdmin = true through inheritance!',
          code: [
            'user.isAdmin    // true !!!',
            'config.isAdmin  // true !!!',
            '',
            '// Even new objects are affected:',
            'const newObj = {}',
            'newObj.isAdmin  // true !!!'
          ],
          codeHighlight: undefined,
          pollutedProperty: { name: 'isAdmin', value: 'true' },
          affectedObjects: ['user', 'config'],
          showWarning: true,
          showAffectedRipple: true,
          output: ['true', 'true', 'true'],
          phase: 'affected'
        },
        {
          description: 'Prevention: Use Object.hasOwn() to check own properties only',
          code: [
            '// Safe access check:',
            'if (Object.hasOwn(user, "isAdmin") && user.isAdmin) {',
            '  // Only true if isAdmin is users OWN property',
            '  grantAccess()',
            '}',
            '',
            'Object.hasOwn(user, "isAdmin")  // false (not own property!)',
            'Object.hasOwn(user, "name")     // true (own property)'
          ],
          codeHighlight: 1,
          pollutedProperty: { name: 'isAdmin', value: 'true' },
          affectedObjects: ['user', 'config'],
          showWarning: false,
          showAffectedRipple: false,
          prevention: 'hasOwn',
          output: ['false', 'true'],
          phase: 'prevention'
        }
      ],
      insight: 'Modifying Object.prototype affects ALL objects. Always use Object.hasOwn() to distinguish own properties from inherited ones.'
    },
    {
      id: 'create-null',
      title: 'Object.create(null) Safe Alternative',
      objects: [
        { id: 'normalObj', name: 'normalObj {}', props: [{ name: 'key', value: '"value"' }], protoRef: 'Object.prototype' },
        { id: 'nullObj', name: 'Object.create(null)', props: [{ name: 'key', value: '"value"' }], protoRef: null },
        { id: 'Object.prototype', name: 'Object.prototype', props: [{ name: 'toString', value: 'fn()' }], protoRef: null }
      ],
      steps: [
        {
          description: 'Normal objects inherit from Object.prototype - vulnerable to pollution',
          code: [
            'const normalObj = { key: "value" }',
            '',
            '// normalObj inherits from Object.prototype',
            'normalObj.__proto__ === Object.prototype  // true',
            '',
            '// If Object.prototype is polluted:',
            'Object.prototype.polluted = "bad"',
            'normalObj.polluted  // "bad" (inherited!)'
          ],
          codeHighlight: 6,
          pollutedProperty: { name: 'polluted', value: '"bad"' },
          affectedObjects: ['normalObj'],
          showWarning: true,
          showAffectedRipple: true,
          output: ['true', '"bad"'],
          phase: 'affected'
        },
        {
          description: 'Object.create(null) creates object with NO prototype',
          code: [
            'const nullObj = Object.create(null)',
            'nullObj.key = "value"',
            '',
            '// nullObj has NO prototype chain!',
            'nullObj.__proto__  // undefined',
            '',
            '// Its completely immune to pollution!',
            'Object.prototype.polluted = "bad"',
            'nullObj.polluted  // undefined (no inheritance!)'
          ],
          codeHighlight: 0,
          affectedObjects: [],
          showWarning: false,
          showAffectedRipple: false,
          prevention: 'createNull',
          output: ['undefined', 'undefined'],
          phase: 'prevention'
        },
        {
          description: 'Trade-off: No inherited methods like toString',
          code: [
            'const nullObj = Object.create(null)',
            '',
            '// No inherited methods:',
            'nullObj.toString  // undefined',
            'nullObj.hasOwnProperty  // undefined',
            '',
            '// Must use Object.keys() etc:',
            'Object.keys(nullObj)  // works!',
            '',
            '// Perfect for dictionaries/maps!'
          ],
          codeHighlight: undefined,
          affectedObjects: [],
          showWarning: false,
          showAffectedRipple: false,
          prevention: 'createNull',
          output: ['undefined', 'undefined', '["key"]'],
          phase: 'prevention'
        }
      ],
      insight: 'Object.create(null) creates a truly empty object with no prototype - perfect for dictionaries and immune to prototype pollution.'
    }
  ],
  advanced: [
    {
      id: 'security-bypass',
      title: 'Security Access Control Bypass',
      objects: [
        { id: 'user', name: 'user', props: [{ name: 'id', value: '123' }, { name: 'role', value: '"viewer"' }], protoRef: 'Object.prototype' },
        { id: 'Object.prototype', name: 'Object.prototype', props: [{ name: 'toString', value: 'fn()' }], protoRef: null }
      ],
      steps: [
        {
          description: 'A common security pattern - checking user properties for access',
          code: [
            'function checkAccess(user) {',
            '  if (user.isAdmin) {',
            '    return "FULL ACCESS"',
            '  }',
            '  return "LIMITED ACCESS"',
            '}',
            '',
            'const user = { id: 123, role: "viewer" }',
            'checkAccess(user)  // "LIMITED ACCESS"'
          ],
          codeHighlight: 1,
          affectedObjects: [],
          showWarning: false,
          showAffectedRipple: false,
          output: ['"LIMITED ACCESS"'],
          phase: 'normal'
        },
        {
          description: 'Attacker pollutes Object.prototype with isAdmin = true',
          code: [
            '// Malicious code (e.g., from unsafe JSON.parse)',
            'Object.prototype.isAdmin = true',
            '',
            '// Now the security check is bypassed!',
            'checkAccess(user)  // "FULL ACCESS" !!!',
            '',
            '// The attacker gained admin access',
            '// without having isAdmin on their user object!'
          ],
          codeHighlight: 4,
          pollutedProperty: { name: 'isAdmin', value: 'true' },
          affectedObjects: ['user'],
          showWarning: true,
          showAffectedRipple: true,
          output: ['"FULL ACCESS" // SECURITY BYPASS!'],
          phase: 'affected'
        },
        {
          description: 'Fix: Always check for own properties in security code',
          code: [
            'function checkAccessSafe(user) {',
            '  // Use hasOwn - only checks own properties!',
            '  if (Object.hasOwn(user, "isAdmin") && user.isAdmin) {',
            '    return "FULL ACCESS"',
            '  }',
            '  return "LIMITED ACCESS"',
            '}',
            '',
            'checkAccessSafe(user)  // "LIMITED ACCESS" (safe!)'
          ],
          codeHighlight: 2,
          pollutedProperty: { name: 'isAdmin', value: 'true' },
          affectedObjects: ['user'],
          showWarning: false,
          showAffectedRipple: false,
          prevention: 'hasOwn',
          output: ['"LIMITED ACCESS"'],
          phase: 'prevention'
        }
      ],
      insight: 'Prototype pollution can bypass security checks. Always use Object.hasOwn() for access control decisions.'
    },
    {
      id: 'freeze-prevention',
      title: 'Object.freeze Prevention',
      objects: [
        { id: 'Object.prototype', name: 'Object.prototype', props: [{ name: 'toString', value: 'fn()' }, { name: 'valueOf', value: 'fn()' }], protoRef: null }
      ],
      steps: [
        {
          description: 'Object.freeze() prevents any modifications to an object',
          code: [
            '// Before protection, pollution works:',
            'Object.prototype.polluted = "bad"  // works',
            '',
            '// Clean up and protect:',
            'delete Object.prototype.polluted',
            'Object.freeze(Object.prototype)',
            '',
            '// Now Object.prototype is immutable!'
          ],
          codeHighlight: 5,
          affectedObjects: [],
          showWarning: false,
          showAffectedRipple: false,
          output: [],
          phase: 'normal'
        },
        {
          description: 'After freezing, pollution attempts silently fail',
          code: [
            'Object.freeze(Object.prototype)',
            '',
            '// Attempt to pollute:',
            'Object.prototype.isAdmin = true',
            '',
            '// In non-strict mode: silently fails',
            '// In strict mode: throws TypeError',
            '',
            'Object.prototype.isAdmin  // undefined (protected!)'
          ],
          codeHighlight: 3,
          affectedObjects: [],
          showWarning: false,
          showAffectedRipple: false,
          prevention: 'freeze',
          output: ['undefined'],
          phase: 'prevention'
        },
        {
          description: 'Freeze all built-in prototypes for maximum protection',
          code: [
            '// Protect all built-in prototypes:',
            'Object.freeze(Object.prototype)',
            'Object.freeze(Array.prototype)',
            'Object.freeze(String.prototype)',
            'Object.freeze(Function.prototype)',
            '',
            '// Now ALL prototype pollution is blocked!',
            '',
            '// Caution: Some libraries may break',
            '// if they extend built-ins'
          ],
          codeHighlight: undefined,
          affectedObjects: [],
          showWarning: false,
          showAffectedRipple: false,
          prevention: 'freeze',
          output: ['// All prototypes protected'],
          phase: 'prevention'
        }
      ],
      insight: 'Object.freeze(Object.prototype) makes it immutable and blocks all pollution attempts. Use early in application bootstrap.'
    },
    {
      id: 'seal-vs-freeze',
      title: 'Object.seal vs Object.freeze',
      objects: [
        { id: 'obj', name: 'obj', props: [{ name: 'existing', value: '"value"' }], protoRef: 'Object.prototype' },
        { id: 'Object.prototype', name: 'Object.prototype', props: [], protoRef: null }
      ],
      steps: [
        {
          description: 'Object.seal: Prevents adding/removing properties, but allows modification',
          code: [
            'const obj = { existing: "value" }',
            'Object.seal(obj)',
            '',
            '// Cannot ADD new properties:',
            'obj.newProp = "x"  // silently fails',
            'obj.newProp        // undefined',
            '',
            '// CAN modify existing properties:',
            'obj.existing = "modified"  // works!',
            'obj.existing               // "modified"'
          ],
          codeHighlight: 1,
          affectedObjects: [],
          showWarning: false,
          showAffectedRipple: false,
          prevention: 'seal',
          output: ['undefined', '"modified"'],
          phase: 'prevention'
        },
        {
          description: 'Object.freeze: Prevents ALL modifications (add, remove, AND modify)',
          code: [
            'const obj = { existing: "value" }',
            'Object.freeze(obj)',
            '',
            '// Cannot ADD new properties:',
            'obj.newProp = "x"  // fails',
            '',
            '// Cannot MODIFY existing properties:',
            'obj.existing = "modified"  // fails',
            'obj.existing               // "value" (unchanged!)',
            '',
            '// Cannot DELETE properties:',
            'delete obj.existing        // fails'
          ],
          codeHighlight: 1,
          affectedObjects: [],
          showWarning: false,
          showAffectedRipple: false,
          prevention: 'freeze',
          output: ['"value"'],
          phase: 'prevention'
        },
        {
          description: 'For prototype protection, freeze is stronger than seal',
          code: [
            '// Object.seal(Object.prototype):',
            '// - Blocks new pollution properties',
            '// - But existing props can be changed',
            '',
            '// Object.freeze(Object.prototype):',
            '// - Blocks new pollution properties',
            '// - AND prevents modifying toString, etc.',
            '',
            '// Recommendation: Use freeze for security'
          ],
          codeHighlight: undefined,
          affectedObjects: [],
          showWarning: false,
          showAffectedRipple: false,
          prevention: 'freeze',
          output: ['// freeze > seal for security'],
          phase: 'prevention'
        }
      ],
      insight: 'seal prevents adding new properties, freeze prevents ALL changes. For prototype protection, freeze is the stronger choice.'
    },
    {
      id: 'library-vulnerability',
      title: 'Library Vulnerability Pattern',
      objects: [
        { id: 'target', name: 'target', props: [{ name: 'a', value: '1' }], protoRef: 'Object.prototype' },
        { id: 'Object.prototype', name: 'Object.prototype', props: [], protoRef: null }
      ],
      steps: [
        {
          description: 'Many libraries do deep merging that can be exploited',
          code: [
            '// Vulnerable merge function (simplified):',
            'function unsafeMerge(target, source) {',
            '  for (const key in source) {',
            '    if (typeof source[key] === "object") {',
            '      target[key] = unsafeMerge(target[key] || {}, source[key])',
            '    } else {',
            '      target[key] = source[key]',
            '    }',
            '  }',
            '  return target',
            '}'
          ],
          codeHighlight: 3,
          affectedObjects: [],
          showWarning: false,
          showAffectedRipple: false,
          output: [],
          phase: 'normal'
        },
        {
          description: 'Attacker crafts malicious input with __proto__ key',
          code: [
            '// Attacker-controlled input (e.g., from JSON):',
            'const malicious = JSON.parse(`{',
            '  "__proto__": {',
            '    "isAdmin": true',
            '  }',
            '}`)',
            '',
            '// When merged, this pollutes Object.prototype!',
            'unsafeMerge({}, malicious)',
            '',
            '// Now all objects have isAdmin: true'
          ],
          codeHighlight: 1,
          pollutedProperty: { name: 'isAdmin', value: 'true' },
          affectedObjects: ['target'],
          showWarning: true,
          showAffectedRipple: true,
          output: [],
          phase: 'polluting'
        },
        {
          description: 'Fix: Block __proto__ and constructor in merge functions',
          code: [
            'function safeMerge(target, source) {',
            '  for (const key in source) {',
            '    // Block dangerous keys:',
            '    if (key === "__proto__" || key === "constructor") {',
            '      continue  // Skip!',
            '    }',
            '    if (typeof source[key] === "object") {',
            '      target[key] = safeMerge(target[key] || {}, source[key])',
            '    } else {',
            '      target[key] = source[key]',
            '    }',
            '  }',
            '  return target',
            '}'
          ],
          codeHighlight: 3,
          affectedObjects: [],
          showWarning: false,
          showAffectedRipple: false,
          prevention: 'hasOwn',
          output: ['// __proto__ key is blocked'],
          phase: 'prevention'
        }
      ],
      insight: 'Libraries like older lodash had prototype pollution vulnerabilities. Always block __proto__ and constructor keys in merge/clone functions.'
    }
  ]
}

export function PrototypePollutionViz() {
  const [level, setLevel] = useState<Level>('intermediate')
  const [exampleIndex, setExampleIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)

  const currentExamples = examples[level]
  const currentExample = currentExamples[exampleIndex]
  const currentStep = currentExample.steps[stepIndex]

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
    if (stepIndex < currentExample.steps.length - 1) {
      setStepIndex(s => s + 1)
    }
  }

  const handlePrev = () => {
    if (stepIndex > 0) {
      setStepIndex(s => s - 1)
    }
  }

  const handleReset = () => {
    setStepIndex(0)
  }

  const getObjectsToDisplay = () => {
    return currentExample.objects.map(obj => ({
      ...obj,
      props: obj.props.map(p => ({
        ...p,
        polluted: false
      })).concat(
        currentStep.pollutedProperty && obj.id !== 'Object.prototype' && currentStep.phase !== 'normal'
          ? [{ name: currentStep.pollutedProperty.name, value: currentStep.pollutedProperty.value, polluted: true }]
          : []
      )
    }))
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Level selector - intermediate and advanced only */}
      <div className="flex gap-2 justify-center bg-black-30 border border-white-10 rounded-full p-1.5 flex-wrap">
        {(Object.keys(levelInfo) as Level[]).map(lvl => (
          <button
            key={lvl}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
              level === lvl ? 'text-white' : 'bg-white-5 border border-transparent text-gray-500 hover:bg-white-10 hover:text-gray-300'
            }`}
            onClick={() => handleLevelChange(lvl)}
            style={{
              borderColor: level === lvl ? levelInfo[lvl].color : 'transparent',
              background: level === lvl ? `${levelInfo[lvl].color}15` : 'transparent'
            }}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: levelInfo[lvl].color }} />
            {levelInfo[lvl].label}
          </button>
        ))}
      </div>

      {/* Example selector */}
      <div className="flex gap-2 flex-wrap justify-center bg-black-30 border border-white-10 rounded-full p-1.5">
        {currentExamples.map((ex, i) => (
          <button
            key={ex.id}
            className={`px-4 py-1.5 font-mono text-sm rounded-full transition-all ${
              exampleIndex === i
                ? 'bg-purple-500/20 border border-purple-500/70 text-white shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                : 'bg-white-5 border border-white-10 text-gray-500 hover:bg-white-10 hover:text-gray-300'
            }`}
            onClick={() => handleExampleChange(i)}
          >
            {ex.title}
          </button>
        ))}
      </div>

      {/* Warning badge */}
      <AnimatePresence>
        {currentStep.showWarning && (
          <motion.div
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <AlertTriangle className="text-red-400" size={20} />
            <span className="text-red-400 font-medium">Prototype Pollution!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prevention badge */}
      <AnimatePresence>
        {currentStep.prevention && !currentStep.showWarning && (
          <motion.div
            className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Shield className="text-emerald-400" size={20} />
            <span className="text-emerald-400 font-medium">
              {currentStep.prevention === 'freeze' && 'Object.freeze() prevents modification!'}
              {currentStep.prevention === 'seal' && 'Object.seal() prevents new properties!'}
              {currentStep.prevention === 'hasOwn' && 'Object.hasOwn() checks own properties only!'}
              {currentStep.prevention === 'createNull' && 'Object.create(null) has no prototype!'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main visualization area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Code Panel */}
        <div className={`rounded-xl border p-4 ${
          currentStep.showWarning
            ? 'border-red-500/30 bg-red-500/5'
            : currentStep.prevention
              ? 'border-emerald-500/30 bg-emerald-500/5'
              : 'border-purple-500/30 bg-purple-500/5'
        }`}>
          <div className={`mb-3 text-center text-sm font-semibold ${
            currentStep.showWarning
              ? 'text-red-400'
              : currentStep.prevention
                ? 'text-emerald-400'
                : 'text-purple-400'
          }`}>
            Code
          </div>
          <div className="bg-black-40 rounded-lg p-3 font-mono text-sm overflow-x-auto">
            {currentStep.code.map((line, i) => (
              <div
                key={i}
                className={`py-0.5 px-2 rounded transition-colors ${
                  currentStep.codeHighlight === i
                    ? currentStep.showWarning
                      ? 'bg-red-500/20 border-l-2 border-red-500'
                      : currentStep.prevention
                        ? 'bg-emerald-500/20 border-l-2 border-emerald-500'
                        : 'bg-purple-500/20 border-l-2 border-purple-500'
                    : ''
                }`}
              >
                <span className="text-gray-600 mr-3 select-none">{String(i + 1).padStart(2, ' ')}</span>
                <span className={line.startsWith('//') ? 'text-gray-500' : 'text-gray-300'}>{line || ' '}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Objects Visualization */}
        <div className={`relative rounded-xl p-[2px] ${
          currentStep.showWarning
            ? 'bg-gradient-to-br from-red-500 to-orange-500'
            : currentStep.prevention
              ? 'bg-gradient-to-br from-emerald-500 to-cyan-500'
              : 'bg-gradient-to-br from-purple-500 to-pink-500'
        }`}>
          <div className="absolute -top-px left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-900 rounded-b-lg text-xs font-semibold text-white whitespace-nowrap z-10">
            Objects
          </div>
          <div className="bg-gray-900 rounded-xl min-h-[200px] p-4 pt-6">
            <div className="flex flex-col items-center gap-3">
              {getObjectsToDisplay().map((obj) => (
                <motion.div
                  key={obj.id}
                  className={`w-full max-w-[250px] bg-black-30 border-2 rounded-lg overflow-hidden ${
                    currentStep.affectedObjects.includes(obj.id)
                      ? 'border-red-500/70'
                      : obj.id === 'Object.prototype' && currentStep.pollutedProperty
                        ? 'border-amber-500/70'
                        : 'border-white-20'
                  }`}
                  animate={
                    currentStep.showAffectedRipple && currentStep.affectedObjects.includes(obj.id)
                      ? {
                          boxShadow: [
                            '0 0 0 rgba(239,68,68,0)',
                            '0 0 20px rgba(239,68,68,0.4)',
                            '0 0 0 rgba(239,68,68,0)'
                          ]
                        }
                      : {}
                  }
                  transition={
                    currentStep.showAffectedRipple
                      ? { duration: 1.5, repeat: Infinity }
                      : {}
                  }
                >
                  <div
                    className={`px-2 py-1 text-2xs font-semibold text-center ${
                      currentStep.affectedObjects.includes(obj.id)
                        ? 'bg-red-500 text-white'
                        : obj.id === 'Object.prototype' && currentStep.pollutedProperty
                          ? 'bg-amber-500 text-black'
                          : 'bg-purple-500 text-white'
                    }`}
                  >
                    {obj.name}
                    {currentStep.affectedObjects.includes(obj.id) && ' (affected!)'}
                    {obj.id === 'Object.prototype' && currentStep.pollutedProperty && ' (polluted!)'}
                  </div>
                  <div className="p-2">
                    {obj.props.length > 0 ? (
                      <div className="flex flex-col gap-0.5">
                        {obj.props.map(p => (
                          <div
                            key={p.name}
                            className={`flex justify-between px-1 py-0.5 rounded font-mono text-2xs ${
                              p.polluted
                                ? 'bg-red-500/20 border border-red-500/50'
                                : 'bg-black-30'
                            }`}
                          >
                            <span className={p.polluted ? 'text-red-400' : 'text-gray-500'}>
                              {p.name}:
                            </span>
                            <span className={p.polluted ? 'text-red-300' : 'text-emerald-500'}>
                              {p.value}
                              {p.polluted && ' (!)'}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-xs text-gray-600 italic">
                        (built-in methods)
                      </div>
                    )}
                    {obj.protoRef && (
                      <div className="font-mono text-2xs text-purple-400 pt-1 mt-1 border-t border-white-5">
                        __proto__: → {obj.protoRef}
                      </div>
                    )}
                    {obj.protoRef === null && obj.id !== 'Object.prototype' && (
                      <div className="font-mono text-2xs text-emerald-400 pt-1 mt-1 border-t border-white-5">
                        __proto__: null (no prototype!)
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Step description */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${level}-${exampleIndex}-${stepIndex}`}
          className={`px-4 py-2.5 border rounded-lg text-base text-center ${
            currentStep.showWarning
              ? 'bg-red-500/10 border-red-500/30 text-red-300'
              : currentStep.prevention
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-black-30 border-white-10 text-gray-300'
          }`}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
        >
          {currentStep.description}
        </motion.div>
      </AnimatePresence>

      {/* Output */}
      {currentStep.output.length > 0 && (
        <div className={`px-4 py-2 border rounded-lg ${
          currentStep.showWarning
            ? 'bg-red-500/5 border-red-500/20'
            : 'bg-black-40 border-white-10'
        }`}>
          <div className="text-xs text-gray-500 mb-1">Output:</div>
          <div className={`font-mono text-sm ${
            currentStep.showWarning ? 'text-red-400' : 'text-emerald-400'
          }`}>
            {currentStep.output.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <StepControls
        onPrev={handlePrev}
        onNext={handleNext}
        onReset={handleReset}
        canPrev={stepIndex > 0}
        canNext={stepIndex < currentExample.steps.length - 1}
        stepInfo={{ current: stepIndex + 1, total: currentExample.steps.length }}
      />

      {/* Insight */}
      <div className={`px-4 py-2.5 border rounded-lg text-xs text-center ${
        currentStep.showWarning
          ? 'bg-red-500/10 border-red-400/20 text-gray-500'
          : 'bg-amber-500/10 border-amber-400/20 text-gray-500'
      }`}>
        <strong className={currentStep.showWarning ? 'text-red-500' : 'text-amber-500'}>
          {currentStep.showWarning ? 'Warning:' : 'Key Insight:'}
        </strong>{' '}
        {currentExample.insight}
      </div>
    </div>
  )
}
