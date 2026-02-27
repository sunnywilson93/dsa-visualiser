'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepControls } from '@/components/SharedViz'

interface ChainNode {
  id: string
  name: string
  type: 'instance' | 'prototype' | 'null'
  props: { name: string; value: string }[]
  protoRef: string | null
  color: string
}

interface InheritanceStep {
  description: string
  code: string[]
  codeHighlight?: number
  superCallActive?: boolean
  prototypeLink?: { from: string; to: string }
  chain: ChainNode[]
  constructorStack?: string[]
  output: string[]
  phase: 'class-definition' | 'prototype-linking' | 'super-call' | 'instance-creation'
}

interface Example {
  id: string
  title: string
  steps: InheritanceStep[]
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
      id: 'dog-extends-animal',
      title: 'Dog extends Animal',
      steps: [
        {
          description: 'Define the parent class Animal with a constructor and method',
          code: [
            'class Animal {',
            '  constructor(name) {',
            '    this.name = name',
            '  }',
            '  speak() {',
            '    console.log(`${this.name} makes a sound`)',
            '  }',
            '}'
          ],
          codeHighlight: 0,
          chain: [],
          output: [],
          phase: 'class-definition'
        },
        {
          description: 'Define Dog class that extends Animal - this sets up prototype chain',
          code: [
            'class Dog extends Animal {',
            '  constructor(name) {',
            '    super(name)  // Must call before using this',
            '    this.isGoodBoy = true',
            '  }',
            '  bark() {',
            '    console.log("Woof!")',
            '  }',
            '}'
          ],
          codeHighlight: 0,
          prototypeLink: { from: 'Dog.prototype', to: 'Animal.prototype' },
          chain: [
            { id: 'Dog.prototype', name: 'Dog.prototype', type: 'prototype', props: [{ name: 'bark', value: 'fn()' }, { name: 'constructor', value: 'Dog' }], protoRef: 'Animal.prototype', color: 'var(--color-purple-500)' },
            { id: 'Animal.prototype', name: 'Animal.prototype', type: 'prototype', props: [{ name: 'speak', value: 'fn()' }, { name: 'constructor', value: 'Animal' }], protoRef: 'Object.prototype', color: '#06b6d4' },
            { id: 'Object.prototype', name: 'Object.prototype', type: 'prototype', props: [{ name: 'toString', value: 'fn()' }], protoRef: 'null', color: 'var(--color-amber-500)' },
            { id: 'null', name: 'null', type: 'null', props: [], protoRef: null, color: 'var(--color-red-500)' }
          ],
          output: ['// extends keyword links Dog.prototype.__proto__ to Animal.prototype'],
          phase: 'prototype-linking'
        },
        {
          description: 'Create new Dog("Rex") - super(name) calls Animal constructor first',
          code: [
            'const rex = new Dog("Rex")',
            '',
            '// What happens inside:',
            '// 1. new Dog() creates empty object',
            '// 2. super(name) calls Animal(name)',
            '// 3. Animal sets this.name = "Rex"',
            '// 4. Dog sets this.isGoodBoy = true'
          ],
          codeHighlight: 0,
          superCallActive: true,
          constructorStack: ['Dog("Rex")', 'super("Rex") → Animal("Rex")'],
          chain: [
            { id: 'Dog.prototype', name: 'Dog.prototype', type: 'prototype', props: [{ name: 'bark', value: 'fn()' }, { name: 'constructor', value: 'Dog' }], protoRef: 'Animal.prototype', color: 'var(--color-purple-500)' },
            { id: 'Animal.prototype', name: 'Animal.prototype', type: 'prototype', props: [{ name: 'speak', value: 'fn()' }, { name: 'constructor', value: 'Animal' }], protoRef: 'Object.prototype', color: '#06b6d4' },
            { id: 'Object.prototype', name: 'Object.prototype', type: 'prototype', props: [{ name: 'toString', value: 'fn()' }], protoRef: 'null', color: 'var(--color-amber-500)' },
            { id: 'null', name: 'null', type: 'null', props: [], protoRef: null, color: 'var(--color-red-500)' }
          ],
          output: ['// super() must be called before using "this"'],
          phase: 'super-call'
        },
        {
          description: 'Instance created with full prototype chain - can access all inherited methods',
          code: [
            'rex.name        // "Rex" (own property)',
            'rex.isGoodBoy   // true (own property)',
            'rex.bark()      // "Woof!" (from Dog.prototype)',
            'rex.speak()     // "Rex makes a sound" (from Animal.prototype)',
            'rex.toString()  // "[object Object]" (from Object.prototype)'
          ],
          codeHighlight: undefined,
          chain: [
            { id: 'rex', name: 'rex (instance)', type: 'instance', props: [{ name: 'name', value: '"Rex"' }, { name: 'isGoodBoy', value: 'true' }], protoRef: 'Dog.prototype', color: 'var(--color-purple-500)' },
            { id: 'Dog.prototype', name: 'Dog.prototype', type: 'prototype', props: [{ name: 'bark', value: 'fn()' }, { name: 'constructor', value: 'Dog' }], protoRef: 'Animal.prototype', color: 'var(--color-purple-500)' },
            { id: 'Animal.prototype', name: 'Animal.prototype', type: 'prototype', props: [{ name: 'speak', value: 'fn()' }, { name: 'constructor', value: 'Animal' }], protoRef: 'Object.prototype', color: '#06b6d4' },
            { id: 'Object.prototype', name: 'Object.prototype', type: 'prototype', props: [{ name: 'toString', value: 'fn()' }], protoRef: 'null', color: 'var(--color-amber-500)' },
            { id: 'null', name: 'null', type: 'null', props: [], protoRef: null, color: 'var(--color-red-500)' }
          ],
          output: ['"Rex"', 'true', '"Woof!"', '"Rex makes a sound"'],
          phase: 'instance-creation'
        }
      ],
      insight: 'extends sets up the prototype chain (Dog.prototype.__proto__ = Animal.prototype). super() calls the parent constructor to initialize inherited properties.'
    },
    {
      id: 'method-override',
      title: 'Method Override with super.method()',
      steps: [
        {
          description: 'Parent class with a speak() method',
          code: [
            'class Animal {',
            '  constructor(name) {',
            '    this.name = name',
            '  }',
            '  speak() {',
            '    return `${this.name} makes a sound`',
            '  }',
            '}'
          ],
          codeHighlight: 4,
          chain: [
            { id: 'Animal.prototype', name: 'Animal.prototype', type: 'prototype', props: [{ name: 'speak', value: 'fn()' }], protoRef: 'Object.prototype', color: '#06b6d4' },
            { id: 'Object.prototype', name: 'Object.prototype', type: 'prototype', props: [{ name: 'toString', value: 'fn()' }], protoRef: 'null', color: 'var(--color-amber-500)' },
            { id: 'null', name: 'null', type: 'null', props: [], protoRef: null, color: 'var(--color-red-500)' }
          ],
          output: [],
          phase: 'class-definition'
        },
        {
          description: 'Child class overrides speak() but calls super.speak() first',
          code: [
            'class Cat extends Animal {',
            '  speak() {',
            '    const base = super.speak()  // Call parent method',
            '    return `${base}... Meow!`',
            '  }',
            '}'
          ],
          codeHighlight: 2,
          prototypeLink: { from: 'Cat.prototype', to: 'Animal.prototype' },
          chain: [
            { id: 'Cat.prototype', name: 'Cat.prototype', type: 'prototype', props: [{ name: 'speak', value: 'fn() (override)' }], protoRef: 'Animal.prototype', color: 'var(--color-purple-500)' },
            { id: 'Animal.prototype', name: 'Animal.prototype', type: 'prototype', props: [{ name: 'speak', value: 'fn()' }], protoRef: 'Object.prototype', color: '#06b6d4' },
            { id: 'Object.prototype', name: 'Object.prototype', type: 'prototype', props: [{ name: 'toString', value: 'fn()' }], protoRef: 'null', color: 'var(--color-amber-500)' },
            { id: 'null', name: 'null', type: 'null', props: [], protoRef: null, color: 'var(--color-red-500)' }
          ],
          output: ['// super.speak() accesses Animal.prototype.speak'],
          phase: 'prototype-linking'
        },
        {
          description: 'Create instance and call overridden method',
          code: [
            'const whiskers = new Cat("Whiskers")',
            '',
            'whiskers.speak()',
            '// 1. Finds speak() on Cat.prototype',
            '// 2. Cat.speak calls super.speak()',
            '// 3. Animal.speak returns "Whiskers makes a sound"',
            '// 4. Cat.speak returns "...Meow!" appended'
          ],
          codeHighlight: 2,
          superCallActive: true,
          constructorStack: ['Cat.speak()', 'super.speak() → Animal.speak()'],
          chain: [
            { id: 'whiskers', name: 'whiskers', type: 'instance', props: [{ name: 'name', value: '"Whiskers"' }], protoRef: 'Cat.prototype', color: 'var(--color-purple-500)' },
            { id: 'Cat.prototype', name: 'Cat.prototype', type: 'prototype', props: [{ name: 'speak', value: 'fn() (override)' }], protoRef: 'Animal.prototype', color: 'var(--color-purple-500)' },
            { id: 'Animal.prototype', name: 'Animal.prototype', type: 'prototype', props: [{ name: 'speak', value: 'fn()' }], protoRef: 'Object.prototype', color: '#06b6d4' },
            { id: 'Object.prototype', name: 'Object.prototype', type: 'prototype', props: [{ name: 'toString', value: 'fn()' }], protoRef: 'null', color: 'var(--color-amber-500)' },
            { id: 'null', name: 'null', type: 'null', props: [], protoRef: null, color: 'var(--color-red-500)' }
          ],
          output: ['"Whiskers makes a sound... Meow!"'],
          phase: 'super-call'
        }
      ],
      insight: 'super.method() calls the parent prototype version of a method. This lets you extend behavior rather than completely replace it.'
    }
  ],
  intermediate: [
    {
      id: 'multi-level-inheritance',
      title: 'Multi-level Inheritance Chain',
      steps: [
        {
          description: 'Three-level inheritance: GoldenRetriever → Dog → Animal',
          code: [
            'class Animal {',
            '  constructor(name) { this.name = name }',
            '  breathe() { return "breathing" }',
            '}',
            '',
            'class Dog extends Animal {',
            '  constructor(name) { super(name); this.legs = 4 }',
            '  bark() { return "woof" }',
            '}',
            '',
            'class GoldenRetriever extends Dog {',
            '  constructor(name) { super(name); this.color = "golden" }',
            '  fetch() { return "fetching!" }',
            '}'
          ],
          codeHighlight: 10,
          chain: [
            { id: 'GR.prototype', name: 'GoldenRetriever.prototype', type: 'prototype', props: [{ name: 'fetch', value: 'fn()' }], protoRef: 'Dog.prototype', color: 'var(--color-purple-500)' },
            { id: 'Dog.prototype', name: 'Dog.prototype', type: 'prototype', props: [{ name: 'bark', value: 'fn()' }], protoRef: 'Animal.prototype', color: '#06b6d4' },
            { id: 'Animal.prototype', name: 'Animal.prototype', type: 'prototype', props: [{ name: 'breathe', value: 'fn()' }], protoRef: 'Object.prototype', color: '#22c55e' },
            { id: 'Object.prototype', name: 'Object.prototype', type: 'prototype', props: [{ name: 'toString', value: 'fn()' }], protoRef: 'null', color: 'var(--color-amber-500)' },
            { id: 'null', name: 'null', type: 'null', props: [], protoRef: null, color: 'var(--color-red-500)' }
          ],
          output: ['// Each class extends the previous one'],
          phase: 'prototype-linking'
        },
        {
          description: 'super() chains through all constructors',
          code: [
            'const buddy = new GoldenRetriever("Buddy")',
            '',
            '// Constructor chain:',
            '// 1. GoldenRetriever("Buddy")',
            '// 2.   → super("Buddy") calls Dog("Buddy")',
            '// 3.     → super("Buddy") calls Animal("Buddy")',
            '// 4.       → Animal sets this.name = "Buddy"',
            '// 5.     → Dog sets this.legs = 4',
            '// 6.   → GoldenRetriever sets this.color = "golden"'
          ],
          codeHighlight: 0,
          superCallActive: true,
          constructorStack: ['GoldenRetriever("Buddy")', 'super() → Dog("Buddy")', 'super() → Animal("Buddy")'],
          chain: [
            { id: 'GR.prototype', name: 'GoldenRetriever.prototype', type: 'prototype', props: [{ name: 'fetch', value: 'fn()' }], protoRef: 'Dog.prototype', color: 'var(--color-purple-500)' },
            { id: 'Dog.prototype', name: 'Dog.prototype', type: 'prototype', props: [{ name: 'bark', value: 'fn()' }], protoRef: 'Animal.prototype', color: '#06b6d4' },
            { id: 'Animal.prototype', name: 'Animal.prototype', type: 'prototype', props: [{ name: 'breathe', value: 'fn()' }], protoRef: 'Object.prototype', color: '#22c55e' },
            { id: 'Object.prototype', name: 'Object.prototype', type: 'prototype', props: [{ name: 'toString', value: 'fn()' }], protoRef: 'null', color: 'var(--color-amber-500)' },
            { id: 'null', name: 'null', type: 'null', props: [], protoRef: null, color: 'var(--color-red-500)' }
          ],
          output: [],
          phase: 'super-call'
        },
        {
          description: 'Instance has properties from all levels, methods from all prototypes',
          code: [
            'buddy.name     // "Buddy" (from Animal)',
            'buddy.legs     // 4 (from Dog)',
            'buddy.color    // "golden" (from GoldenRetriever)',
            '',
            'buddy.fetch()   // from GoldenRetriever.prototype',
            'buddy.bark()    // from Dog.prototype',
            'buddy.breathe() // from Animal.prototype'
          ],
          codeHighlight: undefined,
          chain: [
            { id: 'buddy', name: 'buddy (instance)', type: 'instance', props: [{ name: 'name', value: '"Buddy"' }, { name: 'legs', value: '4' }, { name: 'color', value: '"golden"' }], protoRef: 'GR.prototype', color: 'var(--color-purple-500)' },
            { id: 'GR.prototype', name: 'GoldenRetriever.prototype', type: 'prototype', props: [{ name: 'fetch', value: 'fn()' }], protoRef: 'Dog.prototype', color: 'var(--color-purple-500)' },
            { id: 'Dog.prototype', name: 'Dog.prototype', type: 'prototype', props: [{ name: 'bark', value: 'fn()' }], protoRef: 'Animal.prototype', color: '#06b6d4' },
            { id: 'Animal.prototype', name: 'Animal.prototype', type: 'prototype', props: [{ name: 'breathe', value: 'fn()' }], protoRef: 'Object.prototype', color: '#22c55e' },
            { id: 'Object.prototype', name: 'Object.prototype', type: 'prototype', props: [{ name: 'toString', value: 'fn()' }], protoRef: 'null', color: 'var(--color-amber-500)' },
            { id: 'null', name: 'null', type: 'null', props: [], protoRef: null, color: 'var(--color-red-500)' }
          ],
          output: ['"Buddy"', '4', '"golden"', '"fetching!"', '"woof"', '"breathing"'],
          phase: 'instance-creation'
        }
      ],
      insight: 'Each extends adds a link in the prototype chain. super() chains through all constructors, and methods are looked up through the entire chain.'
    },
    {
      id: 'static-inheritance',
      title: 'Static Method Inheritance',
      steps: [
        {
          description: 'Static methods belong to the class itself, not the prototype',
          code: [
            'class Animal {',
            '  static kingdom = "Animalia"',
            '  static describe() {',
            '    return `Kingdom: ${this.kingdom}`',
            '  }',
            '}',
            '',
            '// Static properties are on Animal itself:',
            '// Animal.kingdom = "Animalia"',
            '// Animal.describe = fn()'
          ],
          codeHighlight: 1,
          chain: [
            { id: 'Animal', name: 'Animal (class)', type: 'prototype', props: [{ name: 'kingdom', value: '"Animalia"' }, { name: 'describe', value: 'static fn()' }], protoRef: 'Function.prototype', color: '#06b6d4' },
            { id: 'Animal.prototype', name: 'Animal.prototype', type: 'prototype', props: [{ name: 'constructor', value: 'Animal' }], protoRef: 'Object.prototype', color: '#06b6d4' }
          ],
          output: ['// Static = on class, not prototype'],
          phase: 'class-definition'
        },
        {
          description: 'Child class inherits static methods via class chain (not prototype chain)',
          code: [
            'class Dog extends Animal {',
            '  static species = "Canis lupus"',
            '}',
            '',
            '// Dog inherits Animal statics:',
            'Dog.kingdom    // "Animalia" (inherited)',
            'Dog.describe() // "Kingdom: Animalia" (inherited)',
            'Dog.species    // "Canis lupus" (own static)'
          ],
          codeHighlight: 5,
          prototypeLink: { from: 'Dog', to: 'Animal' },
          chain: [
            { id: 'Dog', name: 'Dog (class)', type: 'prototype', props: [{ name: 'species', value: '"Canis lupus"' }], protoRef: 'Animal', color: 'var(--color-purple-500)' },
            { id: 'Animal', name: 'Animal (class)', type: 'prototype', props: [{ name: 'kingdom', value: '"Animalia"' }, { name: 'describe', value: 'static fn()' }], protoRef: 'Function.prototype', color: '#06b6d4' }
          ],
          output: ['"Animalia"', '"Kingdom: Animalia"', '"Canis lupus"'],
          phase: 'prototype-linking'
        },
        {
          description: 'Two inheritance chains: one for instances, one for classes',
          code: [
            '// INSTANCE chain (for instance methods):',
            '// dog -> Dog.prototype -> Animal.prototype -> Object.prototype',
            '',
            '// CLASS chain (for static methods):',
            '// Dog -> Animal -> Function.prototype',
            '',
            'const dog = new Dog()',
            'dog.describe  // undefined (statics not on instances!)',
            'Dog.describe() // works (static on class)'
          ],
          codeHighlight: undefined,
          chain: [
            { id: 'dog', name: 'dog (instance)', type: 'instance', props: [], protoRef: 'Dog.prototype', color: 'var(--color-purple-500)' },
            { id: 'Dog.prototype', name: 'Dog.prototype', type: 'prototype', props: [], protoRef: 'Animal.prototype', color: 'var(--color-purple-500)' },
            { id: 'Animal.prototype', name: 'Animal.prototype', type: 'prototype', props: [], protoRef: 'Object.prototype', color: '#06b6d4' },
            { id: 'Object.prototype', name: 'Object.prototype', type: 'prototype', props: [], protoRef: 'null', color: 'var(--color-amber-500)' },
            { id: 'null', name: 'null', type: 'null', props: [], protoRef: null, color: 'var(--color-red-500)' }
          ],
          output: ['undefined', '"Kingdom: Animalia"'],
          phase: 'instance-creation'
        }
      ],
      insight: 'extends creates TWO chains: instances inherit via prototype chain, while static methods inherit via the class chain (Dog.__proto__ === Animal).'
    }
  ],
  advanced: [
    {
      id: 'mixins-composition',
      title: 'Mixins and Composition',
      steps: [
        {
          description: 'JavaScript only supports single inheritance - one parent class',
          code: [
            '// Problem: Dog needs both Animal and Swimmer behavior',
            '// But: class Dog extends Animal, Swimmer {}  // ERROR!',
            '',
            '// Solution: Mixins - functions that add behavior',
            'const Swimmer = (Base) => class extends Base {',
            '  swim() { return `${this.name} is swimming` }',
            '}',
            '',
            'const Flyer = (Base) => class extends Base {',
            '  fly() { return `${this.name} is flying` }',
            '}'
          ],
          codeHighlight: 4,
          chain: [],
          output: ['// Mixins return new classes that extend the input class'],
          phase: 'class-definition'
        },
        {
          description: 'Compose mixins by chaining them',
          code: [
            'class Animal {',
            '  constructor(name) { this.name = name }',
            '}',
            '',
            '// Apply mixins: Swimmer(Flyer(Animal))',
            'class Duck extends Swimmer(Flyer(Animal)) {',
            '  quack() { return "Quack!" }',
            '}',
            '',
            '// Creates chain:',
            '// Duck -> SwimmerMixin -> FlyerMixin -> Animal'
          ],
          codeHighlight: 5,
          prototypeLink: { from: 'Duck.prototype', to: 'SwimmerMixin.prototype' },
          chain: [
            { id: 'Duck.prototype', name: 'Duck.prototype', type: 'prototype', props: [{ name: 'quack', value: 'fn()' }], protoRef: 'SwimmerMixin', color: 'var(--color-purple-500)' },
            { id: 'SwimmerMixin', name: 'SwimmerMixin.prototype', type: 'prototype', props: [{ name: 'swim', value: 'fn()' }], protoRef: 'FlyerMixin', color: '#06b6d4' },
            { id: 'FlyerMixin', name: 'FlyerMixin.prototype', type: 'prototype', props: [{ name: 'fly', value: 'fn()' }], protoRef: 'Animal.prototype', color: '#22c55e' },
            { id: 'Animal.prototype', name: 'Animal.prototype', type: 'prototype', props: [{ name: 'constructor', value: 'Animal' }], protoRef: 'Object.prototype', color: 'var(--color-amber-500)' },
            { id: 'Object.prototype', name: 'Object.prototype', type: 'prototype', props: [{ name: 'toString', value: 'fn()' }], protoRef: 'null', color: 'var(--color-amber-500)' },
            { id: 'null', name: 'null', type: 'null', props: [], protoRef: null, color: 'var(--color-red-500)' }
          ],
          output: [],
          phase: 'prototype-linking'
        },
        {
          description: 'Instance can access all mixin methods through the chain',
          code: [
            'const daffy = new Duck("Daffy")',
            '',
            'daffy.quack()  // "Quack!" (from Duck.prototype)',
            'daffy.swim()   // "Daffy is swimming" (from Swimmer)',
            'daffy.fly()    // "Daffy is flying" (from Flyer)',
            'daffy.name     // "Daffy" (from Animal constructor)'
          ],
          codeHighlight: undefined,
          chain: [
            { id: 'daffy', name: 'daffy (instance)', type: 'instance', props: [{ name: 'name', value: '"Daffy"' }], protoRef: 'Duck.prototype', color: 'var(--color-purple-500)' },
            { id: 'Duck.prototype', name: 'Duck.prototype', type: 'prototype', props: [{ name: 'quack', value: 'fn()' }], protoRef: 'SwimmerMixin', color: 'var(--color-purple-500)' },
            { id: 'SwimmerMixin', name: 'SwimmerMixin.prototype', type: 'prototype', props: [{ name: 'swim', value: 'fn()' }], protoRef: 'FlyerMixin', color: '#06b6d4' },
            { id: 'FlyerMixin', name: 'FlyerMixin.prototype', type: 'prototype', props: [{ name: 'fly', value: 'fn()' }], protoRef: 'Animal.prototype', color: '#22c55e' },
            { id: 'Animal.prototype', name: 'Animal.prototype', type: 'prototype', props: [{ name: 'constructor', value: 'Animal' }], protoRef: 'Object.prototype', color: 'var(--color-amber-500)' },
            { id: 'Object.prototype', name: 'Object.prototype', type: 'prototype', props: [{ name: 'toString', value: 'fn()' }], protoRef: 'null', color: 'var(--color-amber-500)' },
            { id: 'null', name: 'null', type: 'null', props: [], protoRef: null, color: 'var(--color-red-500)' }
          ],
          output: ['"Quack!"', '"Daffy is swimming"', '"Daffy is flying"', '"Daffy"'],
          phase: 'instance-creation'
        }
      ],
      insight: 'Mixins are functions that return classes extending their input. They simulate multiple inheritance by building longer prototype chains.'
    },
    {
      id: 'setprototypeof-dangers',
      title: 'Object.setPrototypeOf Dangers',
      steps: [
        {
          description: 'Object.setPrototypeOf can change prototype AFTER object creation',
          code: [
            'const animal = {',
            '  speak() { return "generic sound" }',
            '}',
            '',
            'const dog = {',
            '  name: "Rex",',
            '  bark() { return "woof" }',
            '}',
            '',
            '// dog has no prototype methods yet',
            'dog.speak  // undefined'
          ],
          codeHighlight: 10,
          chain: [
            { id: 'dog', name: 'dog', type: 'instance', props: [{ name: 'name', value: '"Rex"' }, { name: 'bark', value: 'fn()' }], protoRef: 'Object.prototype', color: 'var(--color-purple-500)' },
            { id: 'Object.prototype', name: 'Object.prototype', type: 'prototype', props: [{ name: 'toString', value: 'fn()' }], protoRef: 'null', color: 'var(--color-amber-500)' },
            { id: 'null', name: 'null', type: 'null', props: [], protoRef: null, color: 'var(--color-red-500)' }
          ],
          output: ['undefined'],
          phase: 'class-definition'
        },
        {
          description: 'setPrototypeOf dynamically changes the prototype chain',
          code: [
            '// WARNING: This is slow and discouraged!',
            'Object.setPrototypeOf(dog, animal)',
            '',
            '// Now dog has animal in its chain',
            'dog.speak()  // "generic sound"',
            'dog.bark()   // "woof"',
            '',
            '// Chain was modified at runtime:',
            '// dog -> animal -> Object.prototype -> null'
          ],
          codeHighlight: 1,
          prototypeLink: { from: 'dog', to: 'animal' },
          chain: [
            { id: 'dog', name: 'dog', type: 'instance', props: [{ name: 'name', value: '"Rex"' }, { name: 'bark', value: 'fn()' }], protoRef: 'animal', color: 'var(--color-purple-500)' },
            { id: 'animal', name: 'animal', type: 'prototype', props: [{ name: 'speak', value: 'fn()' }], protoRef: 'Object.prototype', color: '#06b6d4' },
            { id: 'Object.prototype', name: 'Object.prototype', type: 'prototype', props: [{ name: 'toString', value: 'fn()' }], protoRef: 'null', color: 'var(--color-amber-500)' },
            { id: 'null', name: 'null', type: 'null', props: [], protoRef: null, color: 'var(--color-red-500)' }
          ],
          output: ['"generic sound"', '"woof"'],
          phase: 'prototype-linking'
        },
        {
          description: 'Why setPrototypeOf is dangerous and slow',
          code: [
            '// Problems with setPrototypeOf:',
            '',
            '// 1. PERFORMANCE: Breaks V8 optimizations',
            '//    - Hidden classes become invalid',
            '//    - Inline caches must be flushed',
            '',
            '// 2. PREDICTABILITY: Chain changes at runtime',
            '//    - Hard to reason about object behavior',
            '//    - instanceof results can change',
            '',
            '// Better: Set prototype at creation time',
            'const betterDog = Object.create(animal)',
            'betterDog.name = "Rex"'
          ],
          codeHighlight: 11,
          chain: [
            { id: 'betterDog', name: 'betterDog', type: 'instance', props: [{ name: 'name', value: '"Rex"' }], protoRef: 'animal', color: '#22c55e' },
            { id: 'animal', name: 'animal', type: 'prototype', props: [{ name: 'speak', value: 'fn()' }], protoRef: 'Object.prototype', color: '#06b6d4' },
            { id: 'Object.prototype', name: 'Object.prototype', type: 'prototype', props: [{ name: 'toString', value: 'fn()' }], protoRef: 'null', color: 'var(--color-amber-500)' },
            { id: 'null', name: 'null', type: 'null', props: [], protoRef: null, color: 'var(--color-red-500)' }
          ],
          output: ['// Object.create() is the safe alternative'],
          phase: 'instance-creation'
        }
      ],
      insight: 'Object.setPrototypeOf allows runtime prototype changes but kills performance. Prefer Object.create() or class syntax to set prototypes at creation time.'
    }
  ]
}

export function PrototypeInheritanceViz() {
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
      {/* Level selector */}
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

      {/* Main visualization area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Code Panel */}
        <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-4">
          <div className="mb-3 text-center text-sm font-semibold text-purple-400">
            Code
          </div>
          <div className="bg-black-40 rounded-lg p-3 font-mono text-sm overflow-x-auto">
            {currentStep.code.map((line, i) => (
              <div
                key={i}
                className={`py-0.5 px-2 rounded transition-colors ${
                  currentStep.codeHighlight === i
                    ? 'bg-purple-500/20 border-l-2 border-purple-500'
                    : ''
                }`}
              >
                <span className="text-gray-600 mr-3 select-none">{String(i + 1).padStart(2, ' ')}</span>
                <span className={line.startsWith('//') ? 'text-gray-500' : 'text-gray-300'}>{line || ' '}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Prototype Chain Visualization */}
        <div className="relative rounded-xl p-[2px]" style={{ background: 'linear-gradient(135deg, var(--color-purple-500), var(--color-cyan-500))' }}>
          <div className="absolute -top-px left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-900 rounded-b-lg text-xs font-semibold text-white whitespace-nowrap z-10">
            Prototype Chain
          </div>
          <div className="bg-gray-900 rounded-xl min-h-[200px] p-4 pt-6">
            {currentStep.chain.length === 0 ? (
              <div className="flex items-center justify-center h-[150px] text-gray-600 text-sm">
                Chain will appear after class definition
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1">
                {currentStep.chain.map((obj, index) => (
                  <div key={obj.id} className="w-full max-w-[220px]">
                    <motion.div
                      className="w-full bg-black-30 border-2 rounded-lg overflow-hidden"
                      style={{ borderColor: obj.color }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div
                        className="px-2 py-1 text-2xs font-semibold text-black text-center"
                        style={{ background: obj.color }}
                      >
                        {obj.name}
                      </div>
                      <div className="p-2">
                        {obj.type === 'null' ? (
                          <div className="text-center text-xs text-gray-600 italic">End of chain</div>
                        ) : (
                          <>
                            {obj.props.length > 0 && (
                              <div className="flex flex-col gap-0.5 mb-1">
                                {obj.props.map(p => (
                                  <div key={p.name} className="flex justify-between px-1 py-0.5 bg-black-30 rounded font-mono text-2xs">
                                    <span className="text-gray-500">{p.name}:</span>
                                    <span className="text-emerald-500">{p.value}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            {obj.protoRef && (
                              <div className="font-mono text-2xs text-purple-400 pt-1 border-t border-white-5">
                                __proto__: → {obj.protoRef}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </motion.div>
                    {index < currentStep.chain.length - 1 && (
                      <div
                        className="text-center text-xs py-0.5 transition-colors"
                        style={{
                          color: currentStep.prototypeLink?.from === obj.id || currentStep.prototypeLink?.to === currentStep.chain[index + 1]?.id
                            ? 'var(--color-purple-500)'
                            : '#444'
                        }}
                      >
                        ↓ __proto__
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* super() Call Flow - shows when superCallActive */}
      <AnimatePresence>
        {currentStep.superCallActive && currentStep.constructorStack && (
          <motion.div
            className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="mb-3 text-center text-sm font-semibold text-amber-400">
              super() Call Flow
            </div>
            <div className="flex flex-col items-center gap-2">
              {currentStep.constructorStack.map((call, i) => (
                <motion.div
                  key={i}
                  className={`w-full max-w-[300px] px-4 py-2 rounded-lg border-2 text-center font-mono text-sm ${
                    i === 0
                      ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                      : 'border-amber-500/50 bg-amber-500/10 text-amber-400/80'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}
                >
                  {call}
                  {i === 0 && (
                    <span className="ml-2 text-xs text-amber-500">← current</span>
                  )}
                </motion.div>
              ))}
              {currentStep.constructorStack.length > 1 && (
                <div className="text-xs text-gray-500 mt-1">
                  Each super() calls the parent constructor
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prototype Link Animation */}
      <AnimatePresence>
        {currentStep.prototypeLink && (
          <motion.div
            className="flex items-center justify-center gap-3 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <span className="font-mono text-sm text-cyan-400">{currentStep.prototypeLink.from}</span>
            <motion.span
              className="text-cyan-400"
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              →→→
            </motion.span>
            <span className="font-mono text-sm text-cyan-400">{currentStep.prototypeLink.to}</span>
            <span className="text-xs text-cyan-500 ml-2">(extends links prototypes)</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step description */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${level}-${exampleIndex}-${stepIndex}`}
          className="px-4 py-2.5 bg-black-30 border border-white-10 rounded-lg text-base text-center text-gray-300"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
        >
          {currentStep.description}
        </motion.div>
      </AnimatePresence>

      {/* Output */}
      {currentStep.output.length > 0 && (
        <div className="px-4 py-2 bg-black-40 border border-white-10 rounded-lg">
          <div className="text-xs text-gray-500 mb-1">Output:</div>
          <div className="font-mono text-sm text-emerald-400">
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
      <div className="px-4 py-2.5 bg-amber-500/10 border border-amber-400/20 rounded-lg text-xs text-gray-500 text-center">
        <strong className="text-amber-500">Key Insight:</strong> {currentExample.insight}
      </div>
    </div>
  )
}
