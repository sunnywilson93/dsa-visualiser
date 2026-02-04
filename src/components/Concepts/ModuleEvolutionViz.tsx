'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, AlertTriangle, ArrowRight } from 'lucide-react'
import { StepControls } from '@/components/SharedViz'

interface Era {
  id: string
  name: string
  years: string
  color: string
  technologies: string[]
  code: string
  solved: string[]
  created: string[]
  description: string
}

const eras: Era[] = [
  {
    id: 'global-scripts',
    name: 'Global Scripts',
    years: '1995-2009',
    color: '#6b7280',
    technologies: ['<script>', 'Global vars'],
    code: `<!-- index.html - Load scripts in order! -->
<script src="jquery.js"></script>
<script src="utils.js"></script>
<script src="app.js"></script>

// utils.js - Everything is global
var Utils = {};
Utils.formatDate = function(date) {
  return date.toISOString();
};

// app.js - Hope Utils loaded first!
var result = Utils.formatDate(new Date());

// Problem: What if utils.js loads after app.js?
// Problem: What if another lib also uses "Utils"?`,
    solved: [
      'Simple to understand',
      'No build step needed',
      'Works in any browser',
    ],
    created: [
      'Global namespace pollution',
      'Order-dependent loading',
      'Name collisions between libraries',
    ],
    description: 'Everything lived in the global scope. Scripts had to be loaded in the right order.',
  },
  {
    id: 'iife',
    name: 'IIFE Pattern',
    years: '2009-2012',
    color: 'var(--color-purple-500)',
    technologies: ['IIFE', 'Revealing Module', 'Closures'],
    code: `// The Module Pattern - use IIFE for encapsulation
var MyModule = (function() {
  // Private - hidden in closure
  var privateCounter = 0;

  function privateLog(msg) {
    console.log('[MyModule]', msg);
  }

  // Public API - "revealed" via return
  return {
    increment: function() {
      privateCounter++;
      privateLog('Counter: ' + privateCounter);
    },
    getCount: function() {
      return privateCounter;
    }
  };
})(); // <-- Immediately invoked!

MyModule.increment();     // Works!
MyModule.privateCounter;  // undefined (private)
MyModule.privateLog;      // undefined (private)`,
    solved: [
      'Encapsulation via closures',
      'Public/private separation',
      'Reduced global pollution',
    ],
    created: [
      'Still one global per module',
      'No dependency management',
      'Manual script ordering',
    ],
    description: 'IIFEs (Immediately Invoked Function Expressions) created private scope using closures.',
  },
  {
    id: 'commonjs',
    name: 'CommonJS',
    years: '2009-2015',
    color: 'var(--color-emerald-500)',
    technologies: ['Node.js', 'require()', 'module.exports'],
    code: `// math.js - Export a module
function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

module.exports = { add, multiply };
// or: exports.add = add;

// app.js - Import the module
const math = require('./math');
const { add } = require('./math');

console.log(math.add(2, 3));    // 5
console.log(add(2, 3));         // 5
console.log(math.multiply(2, 3)); // 6

// Node.js wraps each file in a function:
// (function(exports, require, module, __filename, __dirname) {
//   // Your code here
// })`,
    solved: [
      'Real module system',
      'Dependency declaration',
      'NPM ecosystem possible',
    ],
    created: [
      'Synchronous - blocks execution',
      'Designed for server, not browser',
      'No static analysis (dynamic require)',
    ],
    description: 'Node.js introduced CommonJS - the first real module system for JavaScript.',
  },
  {
    id: 'amd',
    name: 'AMD',
    years: '2011-2015',
    color: '#3b82f6',
    technologies: ['RequireJS', 'define()', 'Async loading'],
    code: `// AMD: Asynchronous Module Definition
// Designed for browsers - async loading!

// math.js - Define a module
define('math', [], function() {
  return {
    add: function(a, b) { return a + b; },
    multiply: function(a, b) { return a * b; }
  };
});

// app.js - Require dependencies
define('app', ['math', 'jquery'], function(math, $) {
  // math and jquery are loaded async
  // then this callback runs

  $('#result').text(math.add(2, 3));
});

// Or using require() for one-off imports
require(['math'], function(math) {
  console.log(math.add(2, 3));
});`,
    solved: [
      'Async loading for browsers',
      'Parallel dependency loading',
      'No global pollution',
    ],
    created: [
      'Verbose "callback hell" syntax',
      'Different from CommonJS',
      'Required a loader (RequireJS)',
    ],
    description: 'AMD solved browser loading with async requires, but the syntax was verbose.',
  },
  {
    id: 'umd',
    name: 'UMD',
    years: '2013-2016',
    color: 'var(--color-amber-500)',
    technologies: ['Universal', 'Browserify', 'Webpack v1'],
    code: `// UMD: Universal Module Definition
// Works everywhere: AMD, CommonJS, and global

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS (Node)
    module.exports = factory(require('jquery'));
  } else {
    // Browser global
    root.MyModule = factory(root.jQuery);
  }
}(typeof self !== 'undefined' ? self : this, function($) {
  // Module code here
  return {
    init: function() {
      $('body').addClass('loaded');
    }
  };
}));

// This pattern was used by libraries like:
// jQuery, Lodash, Moment.js, React (before ES modules)`,
    solved: [
      'Write once, run anywhere',
      'Library authors loved it',
      'Bridged the ecosystem split',
    ],
    created: [
      'Complex boilerplate',
      'Still runtime detection',
      'Bundler configs got messy',
    ],
    description: 'UMD was the universal wrapper - one file that worked in AMD, CommonJS, and browsers.',
  },
  {
    id: 'esmodules',
    name: 'ES Modules',
    years: '2015-Present',
    color: '#ec4899',
    technologies: ['import/export', 'Tree-shaking', 'Native support'],
    code: `// math.js - Named exports
export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}

export const PI = 3.14159;

// Default export (one per file)
export default class Calculator { /* ... */ }

// app.js - Import syntax
import Calculator, { add, multiply, PI } from './math.js';
import * as math from './math.js';  // Namespace import

console.log(add(2, 3));        // Named import
console.log(math.multiply(2, 3)); // Namespace
console.log(PI);               // 3.14159

// Dynamic import (code splitting!)
const module = await import('./heavy-module.js');

// Tree-shaking: bundlers remove unused exports
// If you only import 'add', 'multiply' won't be bundled!`,
    solved: [
      'Official standard (works everywhere)',
      'Static analysis → tree-shaking',
      'Native browser support',
      'Async by default',
    ],
    created: [
      'Dual package hazard (CJS + ESM)',
      '.mjs vs .js confusion',
      'Migration pain from CommonJS',
    ],
    description: 'ES Modules became the official standard - static, tree-shakeable, and natively supported.',
  },
]

export function ModuleEvolutionViz() {
  const [activeEra, setActiveEra] = useState(0)
  const era = eras[activeEra]

  const handlePrev = () => {
    if (activeEra > 0) setActiveEra(activeEra - 1)
  }

  const handleNext = () => {
    if (activeEra < eras.length - 1) setActiveEra(activeEra + 1)
  }

  const handleReset = () => setActiveEra(0)

  return (
    <div className="flex flex-col gap-6">
      <div className="relative flex justify-between px-2 mb-2 max-md:overflow-x-auto max-md:pb-2 max-md:justify-start max-md:gap-6">
        {eras.map((e, i) => (
          <button
            key={e.id}
            className="relative z-10 flex flex-col items-center gap-1 p-0 bg-transparent border-none cursor-pointer transition-all duration-200 max-md:flex-shrink-0 group"
            onClick={() => setActiveEra(i)}
            style={{ '--era-color': e.color } as React.CSSProperties}
          >
            <span className={`text-xs font-medium transition-colors duration-200 max-md:hidden group-hover:text-gray-300 ${
              i === activeEra ? 'text-white' : i < activeEra ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {e.years.split('-')[0]}
            </span>
            <span 
              className={`w-4 h-4 rounded-full bg-[var(--color-bg-elevated)] border-2 border-white/20 transition-all duration-200 max-md:group-hover:border-[var(--era-color)] max-md:group-hover:shadow-[0_0_8px_var(--era-color)] ${
                i === activeEra 
                  ? 'scale-[1.3] shadow-[0_0_12px_var(--era-color)]' 
                  : i < activeEra 
                    ? '' 
                    : ''
              }`}
              style={{
                backgroundColor: i === activeEra || i < activeEra ? e.color : undefined,
                borderColor: i === activeEra || i < activeEra ? e.color : undefined
              }}
            />
            <span className={`text-xs whitespace-nowrap max-w-[60px] overflow-hidden text-ellipsis transition-colors duration-200 max-md:max-w-[50px] max-md:text-2xs max-md:group-hover:text-gray-300 ${
              i === activeEra 
                ? 'text-white font-semibold max-md:block max-md:absolute max-md:top-full max-md:mt-1 max-md:max-w-none' 
                : i < activeEra 
                  ? 'text-gray-300' 
                  : 'text-gray-700 max-md:hidden'
            }`}>
              {e.name}
            </span>
          </button>
        ))}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-1/2 -z-0" />
        <motion.div
          className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-primary)] -translate-y-1/2 z-[1]"
          initial={false}
          animate={{ width: `${(activeEra / (eras.length - 1)) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={era.id}
          className="p-6 bg-gradient-to-br from-[var(--color-brand-primary-8)] to-[var(--color-brand-primary-8)] border border-white/10 rounded-xl text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          style={{ '--era-color': era.color } as React.CSSProperties}
        >
          <div className="flex items-center justify-center gap-4 mb-2 flex-wrap max-md:flex-wrap">
            <span 
              className="w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: era.color }}
            >
              {activeEra + 1}
            </span>
            <h3 className="m-0 text-lg font-semibold text-[var(--color-text-bright)] max-md:text-base">{era.name}</h3>
            <span 
              className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/5"
              style={{ color: era.color }}
            >
              {era.years}
            </span>
          </div>
          <p className="m-0 mb-3 text-base text-gray-400 leading-snug">{era.description}</p>
          <div className="flex gap-1.5 justify-center flex-wrap">
            {era.technologies.map(tech => (
              <span 
                key={tech} 
                className="px-2 py-0.5 bg-white/8 border border-white/10 rounded text-2xs font-mono text-[var(--color-brand-light)]"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={`code-${era.id}`}
          className="bg-[var(--color-black-40)] border border-white/8 rounded-xl overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex justify-between items-center px-4 py-2 text-xs font-semibold text-gray-500 bg-white/5">
            <span>Example Code</span>
          </div>
          <pre className="m-0 p-4 max-h-[200px] overflow-y-auto font-mono text-2xs leading-normal text-gray-300 whitespace-pre-wrap">
            <code>{era.code}</code>
          </pre>
        </motion.div>
      </AnimatePresence>

      <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={`solved-${era.id}`}
            className="p-4 bg-[var(--color-emerald-8)] border border-[var(--color-emerald-20)] rounded-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="flex items-center gap-1.5 mb-2 text-xs font-semibold">
              <Check size={16} className="text-[var(--difficulty-1)]" />
              <span className="text-[var(--color-emerald-400)]">Problems Solved</span>
            </div>
            <ul className="m-0 p-0 list-none">
              {era.solved.map((item, i) => (
                <motion.li
                  key={i}
                  className="relative pl-3 text-xs text-gray-400 leading-normal mb-1 before:content-[''] before:absolute before:left-0 before:top-[0.45em] before:w-1.5 before:h-1.5 before:rounded-full before:bg-[var(--difficulty-1)]"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={`created-${era.id}`}
            className="p-4 bg-[var(--color-red-8)] border border-[var(--color-red-20)] rounded-lg"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div className="flex items-center gap-1.5 mb-2 text-xs font-semibold">
              <AlertTriangle size={16} className="text-[var(--color-accent-red)]" />
              <span className="text-[var(--color-red-400)]">New Challenges</span>
            </div>
            <ul className="m-0 p-0 list-none">
              {era.created.map((item, i) => (
                <motion.li
                  key={i}
                  className="relative pl-3 text-xs text-gray-400 leading-normal mb-1 before:content-[''] before:absolute before:left-0 before:top-[0.45em] before:w-1.5 before:h-1.5 before:rounded-full before:bg-[var(--color-accent-red)]"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>

      {activeEra < eras.length - 1 && (
        <div className="flex items-center justify-center gap-1.5 p-2 bg-[var(--color-brand-primary-8)] border border-dashed border-[var(--color-brand-primary-30)] rounded-lg text-xs text-gray-400">
          <ArrowRight size={14} className="text-[var(--color-brand-primary)] animate-pulse" />
          <span>These challenges led to: <strong className="text-[var(--color-brand-light)]">{eras[activeEra + 1].name}</strong></span>
        </div>
      )}

      <StepControls
        onPrev={handlePrev}
        onNext={handleNext}
        onReset={handleReset}
        canPrev={activeEra > 0}
        canNext={activeEra < eras.length - 1}
        stepInfo={{ current: activeEra + 1, total: eras.length }}
      />

      <div className="px-4 py-2.5 bg-[var(--color-brand-primary-8)] border border-[var(--color-brand-primary-20)] rounded-lg text-sm text-gray-400 text-center">
        <strong className="text-[var(--color-brand-primary)]">Key Insight:</strong> ES Modules won because static imports enable tree-shaking and native browser support.
      </div>
    </div>
  )
}
