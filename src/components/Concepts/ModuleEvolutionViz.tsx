import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, AlertTriangle, ArrowRight } from 'lucide-react'
import styles from './ModuleEvolutionViz.module.css'

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
    color: '#8b5cf6',
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
    color: '#10b981',
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
    color: '#f59e0b',
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

  return (
    <div className={styles.container}>
      {/* Timeline */}
      <div className={styles.timeline}>
        {eras.map((e, i) => (
          <button
            key={e.id}
            className={`${styles.timelineNode} ${i === activeEra ? styles.active : ''} ${i < activeEra ? styles.past : ''}`}
            onClick={() => setActiveEra(i)}
            style={{ '--era-color': e.color } as React.CSSProperties}
          >
            <span className={styles.nodeYear}>{e.years.split('-')[0]}</span>
            <span className={styles.nodeDot} />
            <span className={styles.nodeLabel}>{e.name}</span>
          </button>
        ))}
        <div className={styles.timelineLine} />
        <motion.div
          className={styles.timelineProgress}
          initial={false}
          animate={{ width: `${(activeEra / (eras.length - 1)) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Era Header */}
      <AnimatePresence mode="wait">
        <motion.div
          key={era.id}
          className={styles.eraHeader}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          style={{ '--era-color': era.color } as React.CSSProperties}
        >
          <div className={styles.eraTitle}>
            <span className={styles.eraNumber}>{activeEra + 1}</span>
            <h3>{era.name}</h3>
            <span className={styles.eraYears}>{era.years}</span>
          </div>
          <p className={styles.eraDescription}>{era.description}</p>
          <div className={styles.techTags}>
            {era.technologies.map(tech => (
              <span key={tech} className={styles.techTag}>{tech}</span>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Code Example */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`code-${era.id}`}
          className={styles.codePanel}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className={styles.codePanelHeader}>
            <span>Example Code</span>
          </div>
          <pre className={styles.code}>
            <code>{era.code}</code>
          </pre>
        </motion.div>
      </AnimatePresence>

      {/* Problems Solved / Created */}
      <div className={styles.impactGrid}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`solved-${era.id}`}
            className={styles.impactCard}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className={styles.impactHeader}>
              <Check size={16} className={styles.solvedIcon} />
              <span>Problems Solved</span>
            </div>
            <ul className={styles.impactList}>
              {era.solved.map((item, i) => (
                <motion.li
                  key={i}
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
            className={`${styles.impactCard} ${styles.createdCard}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div className={styles.impactHeader}>
              <AlertTriangle size={16} className={styles.createdIcon} />
              <span>New Challenges</span>
            </div>
            <ul className={styles.impactList}>
              {era.created.map((item, i) => (
                <motion.li
                  key={i}
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

      {/* Navigation hint */}
      {activeEra < eras.length - 1 && (
        <div className={styles.nextHint}>
          <ArrowRight size={14} />
          <span>These challenges led to: <strong>{eras[activeEra + 1].name}</strong></span>
        </div>
      )}

      {/* Controls */}
      <div className={styles.controls}>
        <button
          className={styles.btnSecondary}
          onClick={handlePrev}
          disabled={activeEra === 0}
        >
          Previous Era
        </button>
        <span className={styles.stepIndicator}>
          {activeEra + 1} / {eras.length}
        </span>
        <button
          className={styles.btnPrimary}
          onClick={handleNext}
          disabled={activeEra === eras.length - 1}
        >
          Next Era
        </button>
      </div>

      {/* Key Insight */}
      <div className={styles.insight}>
        <strong>Key Insight:</strong> ES Modules won because static imports enable tree-shaking and native browser support.
      </div>
    </div>
  )
}
