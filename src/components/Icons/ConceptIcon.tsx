'use client'

import {
  // DSA Concepts
  TrendingUp,
  Binary,
  TableProperties,
  Hash,
  Layers,
  ArrowLeftRight,
  GitBranch,
  // JS Concepts - Beginner Basics
  Lightbulb,
  Sigma,
  Package,
  Plus,
  FunctionSquare,
  Split,
  Repeat,
  ListOrdered,
  Box,
  // JS Concepts - Existing
  ArrowUp,
  Shuffle,
  Lock,
  Crosshair,
  RotateCw,
  Link2,
  Clock,
  Cpu,
  Gauge,
  Trash2,
  Waves,
  Code2,
  Share2,
  // JS Concepts - Phase 1 Deep Dive
  Combine,
  TimerReset,
  DatabaseZap,
  // JS Concepts - Evolution/History
  History,
  PackageOpen,
  Layers3,
  Container,
  Hammer,
  // JS Concepts - Additional
  ServerCog,
  Palette,
  Link,
  // Categories
  CircleDot,
  Settings,
  Globe,
  Puzzle,
  Zap,
  Compass,
  Sparkles,
  BookOpen,
  // Build categories (exampleCategories)
  Braces,
  Timer,
  List,
  MousePointer2,
  FileJson,
  GitMerge,
  BrainCircuit,
  // DSA subcategories
  BarChart3,
  Search,
  Type,
  ArrowUpDown,
  RefreshCw,
  Calculator,
  Coins,
  Undo2,
  Ruler,
  PanelTop,
  Mountain,
  // Phase 1-8 New Icons
  ArrowUpCircle,
  ShieldAlert,
  Parentheses,
  MessageSquare,
  AlertTriangle,
  GitCommitVertical,
  GitFork,
  Shield,
  Pencil,
  Minus,
  Copy,
  Key,
  RotateCcw,
  Database,
  PieChart,
  FileCode,
  CheckCircle2,
  Skull,
  AlertOctagon,
  UnfoldVertical,
  Maximize2,
  Minimize2,
  Quote,
  Filter,
  ShieldCheck,
  AlertCircle,
  BadgeAlert,
  Bomb,
  LayoutGrid,
  // Fallback
  HelpCircle,
  type LucideIcon,
} from 'lucide-react'

// Map concept IDs to Lucide icons
const conceptIconMap: Record<string, LucideIcon> = {
  // DSA Concepts
  'big-o-notation': TrendingUp,     // Growth curves, complexity graphs
  'binary-system': Binary,          // Binary/bits
  'arrays': TableProperties,        // Grid/Table structure
  'hash-tables': Hash,              // Hash symbol
  'stacks': Layers,                 // Stacked layers (LIFO)
  'queues': ArrowLeftRight,         // Flow in/out (FIFO)
  'linked-lists': GitBranch,        // Connected nodes

  // JS Concepts - Philosophy & Basics
  'js-philosophy': Lightbulb,       // Philosophy/ideas
  'variables': Sigma,               // Mathematical variable symbol
  'data-types': Box,                // Box/container for types
  'operators': Plus,                // Math/operators
  'functions': FunctionSquare,      // Function block
  'conditionals': Split,            // Branching/decisions
  'loops': Repeat,                  // Repeat/iteration
  'arrays-basics': ListOrdered,     // Ordered list
  'objects-basics': Package,        // Package/object container

  // JS Concepts - Fundamentals
  'hoisting': ArrowUp,              // Variables "hoisted" up
  'type-coercion': Shuffle,         // Type conversion/shuffling
  'closures': Lock,                 // Enclosed/captured scope
  'this-keyword': Crosshair,        // Context target
  'event-loop': RotateCw,           // Circular loop
  'scope-chain': Link2,             // Chained scopes
  'promises': Clock,                // Async/future values
  'memory-model': Cpu,              // Memory/processor
  'v8-engine': Gauge,               // Engine performance
  'garbage-collection': Trash2,     // Memory cleanup
  'streams-buffers': Waves,         // Data flow/streaming
  'dom-rendering': Code2,           // Code rendering
  'web-workers': Share2,            // Parallel threads/sharing

  // JS Concepts - Phase 1 Deep Dive
  'promises-deep-dive': Clock,      // Async/promises - future values
  'function-composition': Combine,  // Function pipelines/composition
  'timing-control': TimerReset,     // Debounce/throttle timing
  'memoization': DatabaseZap,       // Caching/storing results

  // JS Concepts - Evolution/History
  'web-evolution': History,         // Web history/evolution
  'module-evolution': PackageOpen,  // Module systems evolution
  'async-evolution': Layers3,       // Async patterns evolution
  'state-evolution': Container,     // State management evolution
  'build-tools-evolution': Hammer,  // Build tools evolution

  // JS Concepts - Additional
  'nodejs-event-loop': ServerCog,   // Node.js server event loop
  'critical-render-path': Palette,  // Browser rendering/painting
  'prototypes': Link,               // Prototype chain links

  // Engineering Foundations
  'mental-execution-model': BrainCircuit,  // Mental model / thinking process
  'values-and-memory': Database,           // Memory/storage
  'expressions-vs-statements': Split,      // Two types of code
  'reading-code': BookOpen,                // Reading/learning
  'debugging-mindset': Search,             // Searching for bugs

  // Categories - JS
  'philosophy': Sparkles,
  'foundations': Compass,                  // Engineering foundations
  'basics': BookOpen,
  'fundamentals': CircleDot,
  'core': Settings,
  'advanced': Zap,
  'runtime': Cpu,
  'backend': Settings,
  'browser': Globe,

  // Categories - DSA
  'data-structures': Box,
  'algorithms': Zap,
  'patterns': Puzzle,

  // Build categories (exampleCategories from examples.ts)
  'js-core': Braces,                // JavaScript Core - code syntax { }
  'async-js': Timer,                // Async JavaScript - async timing
  'array-polyfills': List,          // Array Polyfills - list/array structure
  'utility-functions': FunctionSquare, // Utility Functions - function blocks
  'functional-js': FunctionSquare,  // Functional JS - lambda/functions
  'dom-events': MousePointer2,      // DOM & Events - pointer/click events
  'object-utils': FileJson,         // Object Utilities - JSON/object structure
  'promise-polyfills': GitMerge,    // Promise Polyfills - merging async flows
  'dsa': BrainCircuit,              // DSA - algorithmic/circuit thinking

  // DSA subcategories (dsaSubcategories from examples.ts)
  'arrays-hashing': BarChart3,      // Arrays & Hashing - data visualization
  'two-pointers': ArrowLeftRight,   // Two Pointers - bidirectional movement
  'sliding-window': PanelTop,       // Sliding Window - panel/frame concept
  'stack': Layers,                  // Stack - stacked layers
  'binary-search': Search,          // Binary Search - search algorithm
  'linked-list': GitBranch,         // Linked List - connected nodes
  'strings': Type,                  // Strings - text/typography
  'sorting': ArrowUpDown,           // Sorting - ordering data
  'recursion': RefreshCw,           // Recursion - circular/repeat
  'dynamic-programming': Calculator,// DP - computation/memoization
  'greedy': Coins,                  // Greedy - optimal local choices
  'backtracking': Undo2,            // Backtracking - going back
  'graphs': Share2,                 // Graphs - network/connections
  'trees': GitBranch,               // Trees - branching structure
  'trie': GitBranch,                // Trie - prefix tree
  'heap': Mountain,                 // Heap - peak/priority
  'intervals': Ruler,               // Intervals - measurement/ranges
  'bit-manipulation': Binary,       // Bit Manipulation - binary operations
  'math': Calculator,               // Math & Geometry - calculations

  // ===== PHASE 1-8: NEW CONCEPT ICONS =====

  // Phase 1: Scope & Hoisting
  'scope-basics': Layers,
  'hoisting-variables': ArrowUp,
  'hoisting-functions': ArrowUpCircle,
  'temporal-dead-zone': ShieldAlert,
  'lexical-scope': Parentheses,

  // Phase 2: Async Foundation
  'callbacks-fundamentals': MessageSquare,
  'error-first-callbacks': AlertTriangle,
  'callback-hell': GitCommitVertical,
  'promises-creation': Clock,
  'promise-chaining': GitBranch,
  'promises-then-catch': Link2,
  'promise-static-methods': LayoutGrid,
  'async-await-basics': Timer,
  'async-await-parallel': GitFork,
  'async-await-error-handling': Shield,

  // Phase 3: Array Mastery
  'array-mutation-methods': Pencil,
  'array-iteration-methods': Repeat,
  'array-transformation': Shuffle,
  'array-searching-sorting': Search,
  'array-reduce-patterns': Minus,
  'array-immutable-patterns': Copy,

  // Phase 4: Closure & Prototypes
  'closure-definition': Lock,
  'closure-practical-uses': Key,
  'closure-in-loops': RotateCcw,
  'closure-memory': Database,
  'closure-patterns': PieChart,
  'module-pattern': Package,
  'prototype-chain-basics': Link,
  'property-lookup': Search,
  'class-syntax-sugar': FileCode,
  'instanceof-operator': CheckCircle2,
  'object-create': GitBranch,
  'prototype-pollution': Skull,

  // Phase 5: Event Loop
  'call-stack-basics': Layers,
  'web-apis-overview': Cpu,
  'task-queue-macrotasks': List,
  'microtask-queue': ListOrdered,
  'event-loop-tick': RotateCw,
  'event-loop-priority': AlertOctagon,

  // Phase 6: Modern JS
  'destructuring-complete': UnfoldVertical,
  'spread-operator-patterns': Maximize2,
  'rest-parameters': Minimize2,
  'template-literals': Quote,
  'optional-chaining': Link2,
  'nullish-coalescing': Filter,
  'logical-assignment': Zap,

  // Phase 7: Error Handling
  'try-catch-finally': ShieldCheck,
  'error-types-native': AlertCircle,
  'throwing-custom-errors': BadgeAlert,

  // Phase 8: Type Coercion
  'implicit-coercion-rules': Shuffle,
  'coercion-edge-cases': Bomb,

  // ===== ADDITIONAL MISSING ICONS =====
  // Array methods (granular)
  'array-searching': Search,
  'array-sorting': ArrowUpDown,
  
  // Async (additional)
  'async-await-syntax': Timer,
  'callbacks-basics': MessageSquare,
  'promises-chaining': GitBranch,
  'promises-static-methods': LayoutGrid,
  
  // Closure (additional)
  'closure-loops-classic': RotateCcw,
  'closure-memory-leaks': Database,
  'closure-module-pattern': Package,
  'closure-partial-application': PieChart,
  
  // Class/Prototype (additional)
  'class-syntax-prototypes': FileCode,
  'prototype-inheritance': GitBranch,
  
  // Event Loop (additional)
  'event-loop-starvation': AlertOctagon,
  
  // Runtime
  'javascript-runtime-model': Cpu,
}

interface ConceptIconProps {
  conceptId: string
  size?: number
  className?: string
  strokeWidth?: number
}

export function ConceptIcon({ conceptId, size = 20, className, strokeWidth = 2 }: ConceptIconProps) {
  const IconComponent = conceptIconMap[conceptId] || HelpCircle

  return (
    <IconComponent
      size={size}
      className={className}
      strokeWidth={strokeWidth}
    />
  )
}

// For use in search results where we need to look up by concept ID
export function getConceptIcon(conceptId: string): LucideIcon {
  return conceptIconMap[conceptId] || HelpCircle
}
