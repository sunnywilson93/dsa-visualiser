'use client'

import {
  // DSA Concepts
  TrendingUp,
  Binary,
  TableProperties,
  Hash,
  Layers,
  ArrowLeftRight,
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
  Container,
  Hammer,
  // JS Concepts - Additional
  ServerCog,
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
  Search,
  Type,
  ArrowUpDown,
  RefreshCw,
  Calculator,
  Coins,
  Undo2,
  Ruler,
  ScanLine,
  Mountain,
  // Phase 1-8 New Icons
  ArrowUpCircle,
  ShieldAlert,
  Parentheses,
  MessageSquare,
  AlertTriangle,
  IndentIncrease,
  GitFork,
  Shield,
  Pencil,
  FoldVertical,
  Copy,
  Key,
  RotateCcw,
  Database,
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
  // Intent-fix replacements
  Monitor,
  Workflow,
  Server,
  Frame,
  // Icon overhaul — GitBranch replacements
  TreePine,
  Network,
  PlusSquare,
  ArrowDownFromLine,
  // Icon overhaul — wrong metaphor fixes
  Route,
  Plug,
  Hourglass,
  CircuitBoard,
  GitCompareArrows,
  Scissors,
  // Icon overhaul — missing JS concept icons
  Map,
  Play,
  Gem,
  Regex,
  ZapOff,
  CopyPlus,
  MapPinOff,
  HardDrive,
  ScanSearch,
  Equal,
  Download,
  GraduationCap,
  CircleStop,
  ListRestart,
  Tag,
  // Icon overhaul — React concept icons
  ToggleLeft,
  Anchor,
  Wrench,
  LayoutDashboard,
  Share,
  Target,
  Loader,
  DoorOpen,
  Orbit,
  // Fallback
  HelpCircle,
  type LucideIcon,
} from 'lucide-react'
import {
  ReactLogo,
  Html5Logo,
  Css3Logo,
  JavaScriptLogo,
  WebpackLogo,
} from './BrandIcons'
import { type ComponentType } from 'react'

// Supports both Lucide stroke icons and custom brand fill icons
type IconEntry = ComponentType<{ size?: number | string; className?: string; strokeWidth?: number | string }>

const conceptIconMap: Record<string, IconEntry> = {
  // DSA Concepts
  'big-o-notation': TrendingUp,
  'binary-system': Binary,
  'arrays': TableProperties,
  'hash-tables': Hash,
  'stacks': Layers,
  'queues': ArrowLeftRight,
  'linked-lists': Workflow,

  // JS Concepts - Philosophy & Basics
  'js-philosophy': Lightbulb,
  'variables': Sigma,
  'data-types': Box,
  'operators': Plus,
  'functions': FunctionSquare,
  'conditionals': Split,
  'loops': Repeat,
  'arrays-basics': ListOrdered,
  'objects-basics': Package,

  // JS Concepts - Fundamentals
  'hoisting': ArrowUp,
  'type-coercion': Shuffle,
  'closures': Lock,
  'this-keyword': Crosshair,
  'event-loop': RotateCw,
  'scope-chain': Link2,
  'promises': Hourglass,
  'memory-model': Cpu,
  'v8-engine': Gauge,
  'garbage-collection': Trash2,
  'streams-buffers': Waves,
  'dom-rendering': Monitor,
  'web-workers': Workflow,

  // JS Concepts - Phase 1 Deep Dive
  'promises-deep-dive': Hourglass,
  'function-composition': Combine,
  'timing-control': TimerReset,
  'memoization': DatabaseZap,

  // JS Concepts - Evolution/History
  'web-evolution': History,
  'module-evolution': PackageOpen,
  'async-evolution': GitCompareArrows,
  'state-evolution': Container,
  'build-tools-evolution': Hammer,

  // JS Concepts - Additional
  'nodejs-event-loop': ServerCog,
  'critical-render-path': Route,
  'prototypes': Link,

  // Engineering Foundations
  'mental-execution-model': BrainCircuit,
  'values-and-memory': Database,
  'expressions-vs-statements': Split,
  'reading-code': BookOpen,
  'debugging-mindset': Search,

  // Categories - JS
  'philosophy': Sparkles,
  'foundations': Compass,
  'basics': BookOpen,
  'fundamentals': CircleDot,
  'core': CircuitBoard,
  'advanced': Zap,
  'runtime': Cpu,
  'backend': Server,
  'browser': Globe,

  // Categories - DSA
  'data-structures': Box,
  'algorithms': Zap,
  'patterns': Puzzle,

  // Build categories (exampleCategories from examples.ts)
  'js-core': JavaScriptLogo,
  'async-js': Timer,
  'array-polyfills': List,
  'utility-functions': FunctionSquare,
  'functional-js': FunctionSquare,
  'dom-events': MousePointer2,
  'object-utils': FileJson,
  'promise-polyfills': GitMerge,
  'dsa': BrainCircuit,

  // DSA subcategories (dsaSubcategories from examples.ts)
  'arrays-hashing': Hash,
  'two-pointers': ArrowLeftRight,
  'sliding-window': ScanLine,
  'stack': Layers,
  'binary-search': Search,
  'linked-list': Workflow,
  'strings': Type,
  'sorting': ArrowUpDown,
  'recursion': RefreshCw,
  'dynamic-programming': Calculator,
  'greedy': Coins,
  'backtracking': Undo2,
  'graphs': Share2,
  'trees': TreePine,
  'trie': Network,
  'heap': Mountain,
  'intervals': Ruler,
  'bit-manipulation': Binary,
  'math': Calculator,

  // ===== PHASE 1-8: CONCEPT ICONS =====

  // Phase 1: Scope & Hoisting
  'scope-basics': Frame,
  'hoisting-variables': ArrowUp,
  'hoisting-functions': ArrowUpCircle,
  'temporal-dead-zone': ShieldAlert,
  'lexical-scope': Parentheses,

  // Phase 2: Async Foundation
  'callbacks-fundamentals': MessageSquare,
  'error-first-callbacks': AlertTriangle,
  'callback-hell': IndentIncrease,
  'promises-creation': Hourglass,
  'promise-chaining': Link2,
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
  'array-reduce-patterns': FoldVertical,
  'array-immutable-patterns': Copy,

  // Phase 4: Closure & Prototypes
  'closure-definition': Lock,
  'closure-practical-uses': Key,
  'closure-in-loops': RotateCcw,
  'closure-memory': Database,
  'closure-patterns': Braces,
  'module-pattern': Package,
  'prototype-chain-basics': Link,
  'property-lookup': Search,
  'class-syntax-sugar': FileCode,
  'instanceof-operator': CheckCircle2,
  'object-create': PlusSquare,
  'prototype-pollution': Skull,

  // Phase 5: Event Loop
  'call-stack-basics': Layers,
  'web-apis-overview': Plug,
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

  // Interview categories (brand icons)
  'html': Html5Logo,
  'css': Css3Logo,
  'react': ReactLogo,
  'bundlers': WebpackLogo,

  // ===== ADDITIONAL MISSING ICONS =====

  // Array methods (granular)
  'array-searching': Search,
  'array-sorting': ArrowUpDown,

  // Async (additional)
  'async-await-syntax': Timer,
  'callbacks-basics': MessageSquare,
  'promises-chaining': Link2,
  'promises-static-methods': LayoutGrid,

  // Closure (additional)
  'closure-loops-classic': RotateCcw,
  'closure-memory-leaks': Database,
  'closure-module-pattern': Package,
  'closure-partial-application': Scissors,

  // Class/Prototype (additional)
  'class-syntax-prototypes': FileCode,
  'prototype-inheritance': ArrowDownFromLine,

  // Event Loop (additional)
  'event-loop-starvation': AlertOctagon,

  // Runtime
  'javascript-runtime-model': Cpu,

  // ===== MISSING JS CONCEPT ICONS =====
  'map-set': Map,
  'iterators-generators': Play,
  'proxy-reflect': Shield,
  'symbols': Gem,
  'regular-expressions': Regex,
  'short-circuit-evaluation': ZapOff,
  'strict-mode': ShieldCheck,
  'strings-methods': Type,
  'structured-clone': CopyPlus,
  'weakmap-weakset': MapPinOff,
  'web-storage': HardDrive,
  'typeof-type-checking': ScanSearch,
  'json': FileJson,
  'higher-order-functions': Layers,
  'getters-setters': ArrowUpDown,
  'equality-comparisons': Equal,
  'fetch-api': Download,
  'for-in-vs-for-of': Repeat,
  'class-advanced': GraduationCap,
  'abort-controller': CircleStop,
  'async-iterators': ListRestart,
  'tagged-template-literals': Tag,

  // ===== REACT CONCEPT ICONS =====
  'jsx-rendering': Code2,
  'components-props': LayoutGrid,
  'component-lifecycle': RefreshCw,
  'conditional-rendering': Split,
  'lists-keys': List,
  'controlled-uncontrolled': ToggleLeft,
  'use-state': Box,
  'use-effect': Sparkles,
  'use-reducer': Settings,
  'use-callback': FunctionSquare,
  'use-memo': Zap,
  'use-context': Orbit,
  'use-ref': Anchor,
  'custom-hooks': Wrench,
  'use-layout-effect': LayoutDashboard,
  'higher-order-components': Layers,
  'render-props': Share,
  'children-composition': LayoutGrid,
  'compound-components': Puzzle,
  'context-patterns': Target,
  'error-boundaries': ShieldAlert,
  'suspense': Loader,
  'concurrent-features': Cpu,
  'server-components': Server,
  'react-memo': DatabaseZap,
  'refs-dom-access': Crosshair,
  'portals': DoorOpen,
  'code-splitting': Scissors,
  'rerender-triggers': RotateCw,
  'virtual-dom': TreePine,

  // React category icons
  'react-foundations': BookOpen,
  'hooks-basic': Anchor,
  'hooks-advanced': Wrench,
  'rendering': Monitor,
  'react-performance': Gauge,
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

export function getConceptIcon(conceptId: string): IconEntry {
  return conceptIconMap[conceptId] || HelpCircle
}
