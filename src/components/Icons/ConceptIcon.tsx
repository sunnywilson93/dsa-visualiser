'use client'

import {
  // DSA Concepts
  LineChart,
  Binary,
  Rows3,
  Hash,
  Layers,
  ArrowRightLeft,
  GitBranch,
  // JS Concepts - Beginner Basics
  Lightbulb,
  Variable,
  Boxes,
  Plus,
  FunctionSquare,
  GitFork,
  Repeat,
  ListOrdered,
  Package,
  // JS Concepts - Existing
  ArrowUp,
  Shuffle,
  Lock,
  Target,
  RotateCw,
  Link2,
  Clock,
  Cpu,
  Gauge,
  Trash2,
  Activity,
  Code2,
  Network,
  // Categories
  CircleDot,
  Settings,
  Globe,
  Puzzle,
  Zap,
  Compass,
  Box,
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
  CornerUpLeft,
  Ruler,
  PanelTop,
  Mountain,
  // Fallback
  HelpCircle,
  type LucideIcon,
} from 'lucide-react'

// Map concept IDs to Lucide icons
const conceptIconMap: Record<string, LucideIcon> = {
  // DSA Concepts
  'big-o-notation': LineChart,      // Growth curves, complexity graphs
  'binary-system': Binary,          // Binary/bits
  'arrays': Rows3,                  // Sequential rows of data
  'hash-tables': Hash,              // Hash symbol
  'stacks': Layers,                 // Stacked layers (LIFO)
  'queues': ArrowRightLeft,         // Flow in/out (FIFO)
  'linked-lists': GitBranch,        // Connected nodes

  // JS Concepts - Philosophy & Basics
  'js-philosophy': Lightbulb,       // Philosophy/ideas
  'variables': Variable,            // Variable symbol
  'data-types': Boxes,              // Different type boxes
  'operators': Plus,                // Math/operators
  'functions': FunctionSquare,      // Function block
  'conditionals': GitFork,          // Branching/decisions
  'loops': Repeat,                  // Repeat/iteration
  'arrays-basics': ListOrdered,     // Ordered list
  'objects-basics': Package,        // Package/object container

  // JS Concepts - Fundamentals
  'hoisting': ArrowUp,              // Variables "hoisted" up
  'type-coercion': Shuffle,         // Type conversion/shuffling
  'closures': Lock,                 // Enclosed/captured scope
  'this-keyword': Target,           // Context target
  'event-loop': RotateCw,           // Circular loop
  'scope-chain': Link2,             // Chained scopes
  'promises': Clock,                // Async/future values
  'memory-model': Cpu,              // Memory/processor
  'v8-engine': Gauge,               // Engine performance
  'garbage-collection': Trash2,     // Memory cleanup
  'streams-buffers': Activity,      // Data flow/streaming
  'dom-rendering': Code2,           // Code rendering
  'web-workers': Network,           // Parallel threads

  // Categories - JS
  'philosophy': Sparkles,
  'basics': BookOpen,
  'fundamentals': CircleDot,
  'core': Settings,
  'advanced': Zap,
  'runtime': Cpu,
  'backend': Settings,
  'browser': Globe,

  // Categories - DSA
  'foundations': Compass,
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
  'two-pointers': ArrowRightLeft,   // Two Pointers - bidirectional movement
  'sliding-window': PanelTop,       // Sliding Window - panel/frame concept
  'stack': Layers,                  // Stack - stacked layers
  'binary-search': Search,          // Binary Search - search algorithm
  'linked-list': GitBranch,         // Linked List - connected nodes
  'strings': Type,                  // Strings - text/typography
  'sorting': ArrowUpDown,           // Sorting - ordering data
  'recursion': RefreshCw,           // Recursion - circular/repeat
  'dynamic-programming': Calculator,// DP - computation/memoization
  'greedy': Coins,                  // Greedy - optimal local choices
  'backtracking': CornerUpLeft,     // Backtracking - going back
  'graphs': Network,                // Graphs - network of nodes
  'trees': GitBranch,               // Trees - branching structure
  'trie': GitBranch,                // Trie - prefix tree
  'heap': Mountain,                 // Heap - peak/priority
  'intervals': Ruler,               // Intervals - measurement/ranges
  'bit-manipulation': Binary,       // Bit Manipulation - binary operations
  'math': Calculator,               // Math & Geometry - calculations
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
