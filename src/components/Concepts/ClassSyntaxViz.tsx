'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Code2 } from 'lucide-react'
import { StepControls } from '@/components/SharedViz'

interface ChainNode {
  id: string
  name: string
  type: 'instance' | 'prototype' | 'null'
  props: { name: string; value: string; location: 'instance' | 'prototype' }[]
  protoRef: string | null
  color: string
}

interface ClassSyntaxStep {
  description: string
  classCode: string[]
  prototypeCode: string[]
  classHighlight?: number
  prototypeHighlight?: number
  chain: ChainNode[]
  createdInstances: string[]
  output: string[]
  phase: 'class-definition' | 'equivalent-prototype' | 'instantiation' | 'method-call'
}

interface Example {
  id: string
  title: string
  steps: ClassSyntaxStep[]
  insight: string
}

type Level = 'beginner' | 'intermediate' | 'advanced'

const levelInfo: Record<Level, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: 'var(--color-emerald-500)' },
  intermediate: { label: 'Intermediate', color: 'var(--color-amber-500)' },
  advanced: { label: 'Advanced', color: 'var(--color-red-500)' }
}

const examples: Record<Level, Example[]> = {
  beginner: [
    {
      id: 'simple-class',
      title: 'Simple Class vs Constructor',
      steps: [
        {
          description: 'ES6 class syntax: A clean, familiar way to define a constructor and methods.',
          classCode: [
            'class Animal {',
            '  constructor(name) {',
            '    this.name = name',
            '  }',
            '  speak() {',
            '    console.log(this.name + " speaks")',
            '  }',
            '}',
          ],
          prototypeCode: [
            '// Exact equivalent using prototypes:',
            'function Animal(name) {',
            '  this.name = name',
            '}',
            '',
            'Animal.prototype.speak = function() {',
            '  console.log(this.name + " speaks")',
            '}',
          ],
          classHighlight: 0,
          prototypeHighlight: 1,
          chain: [],
          createdInstances: [],
          output: [],
          phase: 'class-definition',
        },
        {
          description: 'The constructor() in a class becomes the constructor function itself.',
          classCode: [
            'class Animal {',
            '  constructor(name) {',
            '    this.name = name',
            '  }',
            '  speak() {',
            '    console.log(this.name + " speaks")',
            '  }',
            '}',
          ],
          prototypeCode: [
            '// Exact equivalent using prototypes:',
            'function Animal(name) {',
            '  this.name = name',
            '}',
            '',
            'Animal.prototype.speak = function() {',
            '  console.log(this.name + " speaks")',
            '}',
          ],
          classHighlight: 1,
          prototypeHighlight: 2,
          chain: [],
          createdInstances: [],
          output: [],
          phase: 'class-definition',
        },
        {
          description: 'Class methods go on the prototype - they are shared by all instances!',
          classCode: [
            'class Animal {',
            '  constructor(name) {',
            '    this.name = name',
            '  }',
            '  speak() {',
            '    console.log(this.name + " speaks")',
            '  }',
            '}',
          ],
          prototypeCode: [
            '// Exact equivalent using prototypes:',
            'function Animal(name) {',
            '  this.name = name',
            '}',
            '',
            'Animal.prototype.speak = function() {',
            '  console.log(this.name + " speaks")',
            '}',
          ],
          classHighlight: 4,
          prototypeHighlight: 5,
          chain: [],
          createdInstances: [],
          output: [],
          phase: 'equivalent-prototype',
        },
        {
          description: 'Both create the SAME prototype chain when you use "new".',
          classCode: [
            'class Animal {',
            '  constructor(name) {',
            '    this.name = name',
            '  }',
            '  speak() {',
            '    console.log(this.name + " speaks")',
            '  }',
            '}',
            '',
            'const dog = new Animal("Rex")',
          ],
          prototypeCode: [
            '// Exact equivalent using prototypes:',
            'function Animal(name) {',
            '  this.name = name',
            '}',
            '',
            'Animal.prototype.speak = function() {',
            '  console.log(this.name + " speaks")',
            '}',
            '',
            'const dog = new Animal("Rex")',
          ],
          classHighlight: 9,
          prototypeHighlight: 9,
          chain: [
            {
              id: 'dog',
              name: 'dog (instance)',
              type: 'instance',
              props: [
                { name: 'name', value: '"Rex"', location: 'instance' },
              ],
              protoRef: 'Animal.prototype',
              color: 'var(--color-purple-500)',
            },
            {
              id: 'Animal.prototype',
              name: 'Animal.prototype',
              type: 'prototype',
              props: [
                { name: 'speak', value: 'fn()', location: 'prototype' },
                { name: 'constructor', value: 'Animal', location: 'prototype' },
              ],
              protoRef: 'Object.prototype',
              color: 'var(--color-purple-500)',
            },
            {
              id: 'Object.prototype',
              name: 'Object.prototype',
              type: 'prototype',
              props: [
                { name: 'toString', value: 'fn()', location: 'prototype' },
              ],
              protoRef: 'null',
              color: 'var(--color-amber-500)',
            },
            {
              id: 'null',
              name: 'null',
              type: 'null',
              props: [],
              protoRef: null,
              color: 'var(--color-red-500)',
            },
          ],
          createdInstances: ['dog'],
          output: [],
          phase: 'instantiation',
        },
        {
          description: 'Calling dog.speak() finds the method on Animal.prototype - same chain!',
          classCode: [
            'class Animal {',
            '  constructor(name) {',
            '    this.name = name',
            '  }',
            '  speak() {',
            '    console.log(this.name + " speaks")',
            '  }',
            '}',
            '',
            'const dog = new Animal("Rex")',
            'dog.speak()  // "Rex speaks"',
          ],
          prototypeCode: [
            '// Exact equivalent using prototypes:',
            'function Animal(name) {',
            '  this.name = name',
            '}',
            '',
            'Animal.prototype.speak = function() {',
            '  console.log(this.name + " speaks")',
            '}',
            '',
            'const dog = new Animal("Rex")',
            'dog.speak()  // "Rex speaks"',
          ],
          classHighlight: 10,
          prototypeHighlight: 10,
          chain: [
            {
              id: 'dog',
              name: 'dog (instance)',
              type: 'instance',
              props: [
                { name: 'name', value: '"Rex"', location: 'instance' },
              ],
              protoRef: 'Animal.prototype',
              color: 'var(--color-purple-500)',
            },
            {
              id: 'Animal.prototype',
              name: 'Animal.prototype',
              type: 'prototype',
              props: [
                { name: 'speak', value: 'fn()', location: 'prototype' },
                { name: 'constructor', value: 'Animal', location: 'prototype' },
              ],
              protoRef: 'Object.prototype',
              color: 'var(--color-purple-500)',
            },
            {
              id: 'Object.prototype',
              name: 'Object.prototype',
              type: 'prototype',
              props: [
                { name: 'toString', value: 'fn()', location: 'prototype' },
              ],
              protoRef: 'null',
              color: 'var(--color-amber-500)',
            },
            {
              id: 'null',
              name: 'null',
              type: 'null',
              props: [],
              protoRef: null,
              color: 'var(--color-red-500)',
            },
          ],
          createdInstances: ['dog'],
          output: ['"Rex speaks"'],
          phase: 'method-call',
        },
      ],
      insight: 'Class syntax is syntactic sugar - both create the same prototype chain. Methods go on prototype, instance data goes on the instance.',
    },
    {
      id: 'typeof-class',
      title: 'typeof class === "function"',
      steps: [
        {
          description: 'A class declaration creates a function - classes ARE functions!',
          classCode: [
            'class Animal {}',
            '',
            'console.log(typeof Animal)',
            '// "function"',
          ],
          prototypeCode: [
            'function Animal() {}',
            '',
            'console.log(typeof Animal)',
            '// "function"',
          ],
          classHighlight: 0,
          prototypeHighlight: 0,
          chain: [],
          createdInstances: [],
          output: [],
          phase: 'class-definition',
        },
        {
          description: 'Both typeof checks return "function" - because a class IS a function.',
          classCode: [
            'class Animal {}',
            '',
            'console.log(typeof Animal)',
            '// "function"',
          ],
          prototypeCode: [
            'function Animal() {}',
            '',
            'console.log(typeof Animal)',
            '// "function"',
          ],
          classHighlight: 2,
          prototypeHighlight: 2,
          chain: [],
          createdInstances: [],
          output: ['"function"'],
          phase: 'class-definition',
        },
        {
          description: 'Class.prototype.constructor points back to the class itself.',
          classCode: [
            'class Animal {}',
            '',
            'console.log(Animal.prototype.constructor === Animal)',
            '// true',
          ],
          prototypeCode: [
            'function Animal() {}',
            '',
            'console.log(Animal.prototype.constructor === Animal)',
            '// true',
          ],
          classHighlight: 2,
          prototypeHighlight: 2,
          chain: [],
          createdInstances: [],
          output: ['true'],
          phase: 'class-definition',
        },
      ],
      insight: 'Classes are functions in disguise. typeof Class === "function" proves the syntactic sugar nature.',
    },
  ],
  intermediate: [
    {
      id: 'static-methods',
      title: 'Static Methods',
      steps: [
        {
          description: 'Static methods are defined on the constructor itself, NOT on the prototype.',
          classCode: [
            'class MathHelper {',
            '  static add(a, b) {',
            '    return a + b',
            '  }',
            '  ',
            '  multiply(a, b) {',
            '    return a * b',
            '  }',
            '}',
          ],
          prototypeCode: [
            'function MathHelper() {}',
            '',
            '// Static = on constructor',
            'MathHelper.add = function(a, b) {',
            '  return a + b',
            '}',
            '',
            '// Instance = on prototype',
            'MathHelper.prototype.multiply = function(a, b) {',
            '  return a * b',
            '}',
          ],
          classHighlight: 1,
          prototypeHighlight: 3,
          chain: [],
          createdInstances: [],
          output: [],
          phase: 'class-definition',
        },
        {
          description: 'Static methods are called on the class, not on instances.',
          classCode: [
            'class MathHelper {',
            '  static add(a, b) {',
            '    return a + b',
            '  }',
            '  multiply(a, b) {',
            '    return a * b',
            '  }',
            '}',
            '',
            'MathHelper.add(2, 3)  // 5 (static)',
          ],
          prototypeCode: [
            'function MathHelper() {}',
            '',
            'MathHelper.add = function(a, b) {',
            '  return a + b',
            '}',
            '',
            'MathHelper.prototype.multiply = function(a, b) {',
            '  return a * b',
            '}',
            '',
            'MathHelper.add(2, 3)  // 5',
          ],
          classHighlight: 9,
          prototypeHighlight: 10,
          chain: [],
          createdInstances: [],
          output: ['5'],
          phase: 'method-call',
        },
        {
          description: 'Instance methods require creating an instance first.',
          classCode: [
            'class MathHelper {',
            '  static add(a, b) {',
            '    return a + b',
            '  }',
            '  multiply(a, b) {',
            '    return a * b',
            '  }',
            '}',
            '',
            'const m = new MathHelper()',
            'm.multiply(2, 3)  // 6 (instance)',
          ],
          prototypeCode: [
            'function MathHelper() {}',
            '',
            'MathHelper.add = function(a, b) {',
            '  return a + b',
            '}',
            '',
            'MathHelper.prototype.multiply = function(a, b) {',
            '  return a * b',
            '}',
            '',
            'const m = new MathHelper()',
            'm.multiply(2, 3)  // 6',
          ],
          classHighlight: 10,
          prototypeHighlight: 11,
          chain: [
            {
              id: 'm',
              name: 'm (instance)',
              type: 'instance',
              props: [],
              protoRef: 'MathHelper.prototype',
              color: 'var(--color-purple-500)',
            },
            {
              id: 'MathHelper.prototype',
              name: 'MathHelper.prototype',
              type: 'prototype',
              props: [
                { name: 'multiply', value: 'fn()', location: 'prototype' },
              ],
              protoRef: 'Object.prototype',
              color: 'var(--color-purple-500)',
            },
          ],
          createdInstances: ['m'],
          output: ['6'],
          phase: 'method-call',
        },
      ],
      insight: 'Static methods live on the constructor function, not on its prototype. They are shared utilities, not instance behaviors.',
    },
    {
      id: 'getters-setters',
      title: 'Getters & Setters',
      steps: [
        {
          description: 'Getters and setters provide computed properties with nice syntax.',
          classCode: [
            'class Circle {',
            '  constructor(radius) {',
            '    this._radius = radius',
            '  }',
            '  get area() {',
            '    return Math.PI * this._radius ** 2',
            '  }',
            '  set radius(val) {',
            '    this._radius = Math.abs(val)',
            '  }',
            '}',
          ],
          prototypeCode: [
            'function Circle(radius) {',
            '  this._radius = radius',
            '}',
            '',
            'Object.defineProperty(Circle.prototype, "area", {',
            '  get: function() {',
            '    return Math.PI * this._radius ** 2',
            '  }',
            '})',
            '',
            'Object.defineProperty(Circle.prototype, "radius", {',
            '  set: function(val) {',
            '    this._radius = Math.abs(val)',
            '  }',
            '})',
          ],
          classHighlight: 4,
          prototypeHighlight: 5,
          chain: [],
          createdInstances: [],
          output: [],
          phase: 'class-definition',
        },
        {
          description: 'Getters are accessed like properties but execute code.',
          classCode: [
            'class Circle {',
            '  constructor(radius) {',
            '    this._radius = radius',
            '  }',
            '  get area() {',
            '    return Math.PI * this._radius ** 2',
            '  }',
            '}',
            '',
            'const c = new Circle(5)',
            'console.log(c.area)  // ~78.54',
          ],
          prototypeCode: [
            'function Circle(radius) {',
            '  this._radius = radius',
            '}',
            '',
            'Object.defineProperty(Circle.prototype, "area", {',
            '  get: function() {',
            '    return Math.PI * this._radius ** 2',
            '  }',
            '})',
            '',
            'const c = new Circle(5)',
            'console.log(c.area)  // ~78.54',
          ],
          classHighlight: 10,
          prototypeHighlight: 11,
          chain: [
            {
              id: 'c',
              name: 'c (instance)',
              type: 'instance',
              props: [
                { name: '_radius', value: '5', location: 'instance' },
              ],
              protoRef: 'Circle.prototype',
              color: 'var(--color-purple-500)',
            },
            {
              id: 'Circle.prototype',
              name: 'Circle.prototype',
              type: 'prototype',
              props: [
                { name: 'area', value: 'getter', location: 'prototype' },
              ],
              protoRef: 'Object.prototype',
              color: 'var(--color-purple-500)',
            },
          ],
          createdInstances: ['c'],
          output: ['78.54'],
          phase: 'method-call',
        },
      ],
      insight: 'Class getters/setters use Object.defineProperty under the hood - just with cleaner syntax.',
    },
  ],
  advanced: [
    {
      id: 'private-fields',
      title: 'Private Fields (#)',
      steps: [
        {
          description: 'Private fields (#) are truly private - only accessible inside the class.',
          classCode: [
            'class BankAccount {',
            '  #balance = 0  // Truly private!',
            '  ',
            '  deposit(amount) {',
            '    this.#balance += amount',
            '  }',
            '  getBalance() {',
            '    return this.#balance',
            '  }',
            '}',
          ],
          prototypeCode: [
            '// Prototype equivalent uses closures:',
            'function BankAccount() {',
            '  let balance = 0  // "Private" via closure',
            '  ',
            '  this.deposit = function(amount) {',
            '    balance += amount',
            '  }',
            '  this.getBalance = function() {',
            '    return balance',
            '  }',
            '}',
          ],
          classHighlight: 1,
          prototypeHighlight: 2,
          chain: [],
          createdInstances: [],
          output: [],
          phase: 'class-definition',
        },
        {
          description: 'Class private fields are enforced at runtime - closure pattern just hides the variable.',
          classCode: [
            'class BankAccount {',
            '  #balance = 0',
            '  deposit(amount) { this.#balance += amount }',
            '  getBalance() { return this.#balance }',
            '}',
            '',
            'const acc = new BankAccount()',
            'acc.deposit(100)',
            'console.log(acc.#balance) // SyntaxError!',
          ],
          prototypeCode: [
            'function BankAccount() {',
            '  let balance = 0',
            '  this.deposit = function(amt) { balance += amt }',
            '  this.getBalance = function() { return balance }',
            '}',
            '',
            'const acc = new BankAccount()',
            'acc.deposit(100)',
            'console.log(acc.balance) // undefined (not error)',
          ],
          classHighlight: 8,
          prototypeHighlight: 8,
          chain: [
            {
              id: 'acc',
              name: 'acc (instance)',
              type: 'instance',
              props: [
                { name: '#balance', value: '100', location: 'instance' },
              ],
              protoRef: 'BankAccount.prototype',
              color: 'var(--color-purple-500)',
            },
            {
              id: 'BankAccount.prototype',
              name: 'BankAccount.prototype',
              type: 'prototype',
              props: [
                { name: 'deposit', value: 'fn()', location: 'prototype' },
                { name: 'getBalance', value: 'fn()', location: 'prototype' },
              ],
              protoRef: 'Object.prototype',
              color: 'var(--color-purple-500)',
            },
          ],
          createdInstances: ['acc'],
          output: ['SyntaxError: Private field'],
          phase: 'method-call',
        },
        {
          description: 'Key difference: Class # fields are on the instance, closure vars are shared per-method.',
          classCode: [
            '// With class # fields:',
            '// - deposit/getBalance on PROTOTYPE',
            '// - #balance on each INSTANCE',
            '// - Memory efficient!',
            '',
            'class BankAccount {',
            '  #balance = 0',
            '  deposit(amount) { this.#balance += amount }',
            '  getBalance() { return this.#balance }',
            '}',
          ],
          prototypeCode: [
            '// With closure pattern:',
            '// - deposit/getBalance on each INSTANCE',
            '// - balance in closure scope',
            '// - Uses more memory!',
            '',
            'function BankAccount() {',
            '  let balance = 0',
            '  this.deposit = function(amt) {...}',
            '  this.getBalance = function() {...}',
            '}',
          ],
          classHighlight: 7,
          prototypeHighlight: 7,
          chain: [],
          createdInstances: [],
          output: [],
          phase: 'equivalent-prototype',
        },
      ],
      insight: 'Private # fields are truly private and more memory-efficient than closure patterns because methods stay on the prototype.',
    },
    {
      id: 'hoisting-diff',
      title: 'Class Hoisting Difference',
      steps: [
        {
          description: 'Functions are fully hoisted, but classes are NOT - they have a Temporal Dead Zone.',
          classCode: [
            '// This throws ReferenceError:',
            'const a = new Animal("Rex")',
            '',
            'class Animal {',
            '  constructor(name) {',
            '    this.name = name',
            '  }',
            '}',
          ],
          prototypeCode: [
            '// This works! (function is hoisted)',
            'const a = new Animal("Rex")',
            '',
            'function Animal(name) {',
            '  this.name = name',
            '}',
          ],
          classHighlight: 1,
          prototypeHighlight: 1,
          chain: [],
          createdInstances: [],
          output: [],
          phase: 'class-definition',
        },
        {
          description: 'Classes must be declared BEFORE use - like let/const, not like var/function.',
          classCode: [
            '// Must declare class first:',
            'class Animal {',
            '  constructor(name) {',
            '    this.name = name',
            '  }',
            '}',
            '',
            'const a = new Animal("Rex")  // Works!',
          ],
          prototypeCode: [
            '// Functions can be used before declaration:',
            'const a = new Animal("Rex")  // Works!',
            '',
            'function Animal(name) {',
            '  this.name = name',
            '}',
          ],
          classHighlight: 7,
          prototypeHighlight: 1,
          chain: [
            {
              id: 'a',
              name: 'a (instance)',
              type: 'instance',
              props: [
                { name: 'name', value: '"Rex"', location: 'instance' },
              ],
              protoRef: 'Animal.prototype',
              color: 'var(--color-purple-500)',
            },
            {
              id: 'Animal.prototype',
              name: 'Animal.prototype',
              type: 'prototype',
              props: [
                { name: 'constructor', value: 'Animal', location: 'prototype' },
              ],
              protoRef: 'Object.prototype',
              color: 'var(--color-purple-500)',
            },
          ],
          createdInstances: ['a'],
          output: [],
          phase: 'instantiation',
        },
      ],
      insight: 'Unlike functions, classes are NOT hoisted. This is one case where class and function behavior differs.',
    },
    {
      id: 'class-expression',
      title: 'Class Expressions',
      steps: [
        {
          description: 'Classes can be expressions too, just like function expressions.',
          classCode: [
            '// Named class expression',
            'const Animal = class AnimalClass {',
            '  constructor(name) {',
            '    this.name = name',
            '  }',
            '}',
            '',
            'console.log(Animal.name)  // "AnimalClass"',
          ],
          prototypeCode: [
            '// Named function expression',
            'const Animal = function AnimalFunc(name) {',
            '  this.name = name',
            '}',
            '',
            '',
            '',
            'console.log(Animal.name)  // "AnimalFunc"',
          ],
          classHighlight: 1,
          prototypeHighlight: 1,
          chain: [],
          createdInstances: [],
          output: ['"AnimalClass"'],
          phase: 'class-definition',
        },
        {
          description: 'Anonymous class expressions also work.',
          classCode: [
            '// Anonymous class expression',
            'const Animal = class {',
            '  constructor(name) {',
            '    this.name = name',
            '  }',
            '}',
            '',
            'console.log(Animal.name)  // "Animal" (inferred)',
          ],
          prototypeCode: [
            '// Anonymous function expression',
            'const Animal = function(name) {',
            '  this.name = name',
            '}',
            '',
            '',
            '',
            'console.log(Animal.name)  // "Animal" (inferred)',
          ],
          classHighlight: 1,
          prototypeHighlight: 1,
          chain: [],
          createdInstances: [],
          output: ['"Animal"'],
          phase: 'class-definition',
        },
      ],
      insight: 'Classes can be declarations or expressions, just like functions. Both support named and anonymous forms.',
    },
  ],
}

export function ClassSyntaxViz() {
  const [level, setLevel] = useState<Level>('beginner')
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

  return (
    <div className="flex flex-col gap-5">
      {/* Syntactic Sugar Badge */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-amber-500/20 border border-purple-500/30 rounded-full">
          <Sparkles size={16} className="text-purple-400" />
          <span className="text-sm font-semibold text-white">
            Classes are <span className="text-purple-400">Syntactic Sugar</span> over Prototypes
          </span>
          <Sparkles size={16} className="text-amber-400" />
        </div>
      </div>

      {/* Level selector */}
      <div className="flex gap-2 justify-center bg-black/30 border border-white/10 rounded-full p-1.5">
        {(Object.keys(levelInfo) as Level[]).map(lvl => (
          <button
            key={lvl}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-full transition-all cursor-pointer ${
              level === lvl ? 'text-white' : 'bg-white/5 border border-transparent text-gray-500 hover:bg-white/10 hover:text-gray-300'
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
      <div className="flex gap-2 flex-wrap justify-center bg-black/30 border border-white/10 rounded-full p-1.5">
        {currentExamples.map((ex, i) => (
          <button
            key={ex.id}
            className={`px-4 py-1.5 font-mono text-sm rounded-full transition-all cursor-pointer ${
              exampleIndex === i
                ? 'bg-purple-500/20 border border-purple-500/70 text-white shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                : 'bg-white/5 border border-white/10 text-gray-500 hover:bg-white/10 hover:text-gray-300'
            }`}
            onClick={() => handleExampleChange(i)}
          >
            {ex.title}
          </button>
        ))}
      </div>

      {/* Side-by-side code comparison */}
      <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
        {/* Class Syntax Panel */}
        <div className="relative rounded-xl p-[2px]" style={{ background: 'linear-gradient(135deg, var(--color-purple-500), var(--color-purple-400))' }}>
          <div className="absolute -top-px left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-900 rounded-b-lg text-xs font-semibold text-purple-400 whitespace-nowrap z-10 flex items-center gap-1.5">
            <Code2 size={12} />
            ES6 Class Syntax
          </div>
          <div className="bg-gray-900 rounded-lg min-h-[200px] overflow-hidden">
            <pre className="m-0 py-3 max-h-72 overflow-y-auto">
              {currentStep.classCode.map((line, i) => (
                <div
                  key={i}
                  className={`flex px-3 py-0.5 transition-colors ${
                    currentStep.classHighlight === i
                      ? 'bg-purple-500/20 border-l-2 border-purple-500'
                      : ''
                  }`}
                >
                  <span className="w-5 text-gray-700 font-mono text-xs select-none">{i + 1}</span>
                  <span className={`font-mono text-xs ${
                    currentStep.classHighlight === i
                      ? 'text-purple-300'
                      : 'text-gray-400'
                  }`}>{line || ' '}</span>
                </div>
              ))}
            </pre>
          </div>
        </div>

        {/* Prototype Equivalent Panel */}
        <div className="relative rounded-xl p-[2px]" style={{ background: 'var(--gradient-neon-amber)' }}>
          <div className="absolute -top-px left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-900 rounded-b-lg text-xs font-semibold text-amber-400 whitespace-nowrap z-10 flex items-center gap-1.5">
            <Code2 size={12} />
            Prototype Reality
          </div>
          <div className="bg-gray-900 rounded-lg min-h-[200px] overflow-hidden">
            <pre className="m-0 py-3 max-h-72 overflow-y-auto">
              {currentStep.prototypeCode.map((line, i) => (
                <div
                  key={i}
                  className={`flex px-3 py-0.5 transition-colors ${
                    currentStep.prototypeHighlight === i
                      ? 'bg-amber-500/20 border-l-2 border-amber-500'
                      : ''
                  }`}
                >
                  <span className="w-5 text-gray-700 font-mono text-xs select-none">{i + 1}</span>
                  <span className={`font-mono text-xs ${
                    currentStep.prototypeHighlight === i
                      ? 'text-amber-300'
                      : 'text-gray-400'
                  }`}>{line || ' '}</span>
                </div>
              ))}
            </pre>
          </div>
        </div>
      </div>

      {/* Prototype Chain Visualization */}
      {currentStep.chain.length > 0 && (
        <div className="relative rounded-xl p-[2px]" style={{ background: 'linear-gradient(135deg, var(--color-purple-500), var(--color-amber-500))' }}>
          <div className="absolute -top-px left-1/2 -translate-x-1/2 px-4 py-1 bg-gray-900 rounded-b-lg text-sm font-semibold text-white whitespace-nowrap z-10">
            Resulting Prototype Chain (Same Either Way!)
          </div>
          <div className="bg-gray-900 rounded-lg min-h-[100px] p-4 pt-8">
            <div className="flex flex-col items-center gap-1">
              {currentStep.chain.map((obj, index) => (
                <div key={obj.id} className="w-full max-w-[320px]">
                  <motion.div
                    className="w-full bg-black/30 border-2 rounded-lg overflow-hidden transition-all"
                    style={{ borderColor: obj.color }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="px-2 py-1 text-xs font-semibold text-black text-center" style={{ background: obj.color }}>
                      {obj.name}
                    </div>
                    <div className="p-2">
                      {obj.type === 'null' ? (
                        <div className="text-center text-xs text-gray-600 italic">End of chain</div>
                      ) : (
                        <>
                          <div className="flex flex-col gap-1 mb-2">
                            {obj.props.map(p => (
                              <div
                                key={p.name}
                                className="flex justify-between px-1 py-0.5 bg-black/30 rounded font-mono text-xs"
                              >
                                <span className="text-gray-500">{p.name}:</span>
                                <span className={p.location === 'instance' ? 'text-purple-400' : 'text-amber-400'}>
                                  {p.value}
                                </span>
                              </div>
                            ))}
                          </div>
                          {obj.protoRef && (
                            <div className="font-mono text-xs text-purple-400 pt-1 border-t border-white/5">
                              __proto__: {obj.protoRef}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </motion.div>
                  {index < currentStep.chain.length - 1 && (
                    <div className="text-center text-xs py-0.5 text-purple-400">
                      __proto__
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Output Section */}
      {currentStep.output.length > 0 && (
        <div className="bg-black/30 border border-white/10 rounded-lg p-3">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            Console Output
          </div>
          <div className="font-mono text-sm">
            {currentStep.output.map((item, i) => (
              <motion.div
                key={i}
                className={`py-0.5 ${
                  item.includes('Error') ? 'text-red-400' : 'text-emerald-400'
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Step description */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${level}-${exampleIndex}-${stepIndex}`}
          className="px-4 py-2.5 bg-black/30 border border-white/10 rounded-lg text-base text-gray-300 text-center"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
        >
          {currentStep.description}
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <StepControls
        onPrev={handlePrev}
        onNext={handleNext}
        onReset={handleReset}
        canPrev={stepIndex > 0}
        canNext={stepIndex < currentExample.steps.length - 1}
        stepInfo={{ current: stepIndex + 1, total: currentExample.steps.length }}
      />

      {/* Key insight */}
      <div className="px-4 py-2.5 bg-gradient-to-r from-purple-500/10 to-amber-500/10 border border-purple-500/20 rounded-lg text-xs text-gray-500 text-center">
        <strong className="text-purple-400">Key Insight:</strong> {currentExample.insight}
      </div>
    </div>
  )
}
