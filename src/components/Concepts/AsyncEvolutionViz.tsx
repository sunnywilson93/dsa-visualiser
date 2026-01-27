import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, AlertTriangle, ArrowRight } from 'lucide-react'

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
    id: 'callbacks',
    name: 'Callbacks',
    years: '1995-2011',
    color: '#6b7280',
    technologies: ['setTimeout', 'XMLHttpRequest', 'Node.js'],
    code: `// The original async pattern: callbacks
function fetchUser(id, callback) {
  setTimeout(() => {
    const user = { id, name: 'Alice' };
    callback(null, user);  // (error, result) convention
  }, 1000);
}

// Usage
fetchUser(1, function(err, user) {
  if (err) {
    console.error('Failed:', err);
    return;
  }
  console.log('Got user:', user.name);
});

// Node.js made this the standard pattern
// Error-first callbacks: callback(err, result)`,
    solved: [
      'Enabled async operations',
      'Simple mental model',
      'Works everywhere (no polyfills)',
    ],
    created: [
      'Inversion of control (who calls callback?)',
      'No guaranteed single call',
      'Hard to compose multiple async ops',
    ],
    description: 'Callbacks were the original async pattern. Pass a function to be called later.',
  },
  {
    id: 'callback-hell',
    name: 'Callback Hell',
    years: '2008-2015',
    color: '#ef4444',
    technologies: ['Nested callbacks', 'Pyramid of Doom'],
    code: `// The infamous "Pyramid of Doom"
getUser(userId, function(err, user) {
  if (err) return handleError(err);

  getOrders(user.id, function(err, orders) {
    if (err) return handleError(err);

    getOrderDetails(orders[0].id, function(err, details) {
      if (err) return handleError(err);

        getShippingInfo(details.shipId, function(err, shipping) {
          if (err) return handleError(err);

          // Finally! 4 levels deep...
          displayOrder(user, orders[0], details, shipping);
        });
      });
    });
  });
});

// Problems:
// 1. Hard to read (indentation nightmare)
// 2. Error handling repeated everywhere
// 3. Can't easily run in parallel
// 4. Try/catch doesn't work with callbacks`,
    solved: [
      'Sequential async operations work',
      'Data flows through nested scopes',
    ],
    created: [
      'Unreadable "pyramid" code',
      'Duplicated error handling',
      'Hard to parallelize',
      'Can\'t use try/catch',
    ],
    description: 'Sequential async operations led to deeply nested callbacks - the "Pyramid of Doom".',
  },
  {
    id: 'promises',
    name: 'Promises',
    years: '2012-2017',
    color: '#3b82f6',
    technologies: ['Promise', 'then/catch', 'Bluebird', 'Q'],
    code: `// Promises: chainable, composable async
function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id <= 0) reject(new Error('Invalid ID'));
      else resolve({ id, name: 'Alice' });
    }, 1000);
  });
}

// Chain instead of nest!
fetchUser(1)
  .then(user => getOrders(user.id))
  .then(orders => getOrderDetails(orders[0].id))
  .then(details => getShippingInfo(details.shipId))
  .then(shipping => displayOrder(shipping))
  .catch(err => handleError(err)); // One error handler!

// Parallel execution
Promise.all([
  fetchUser(1),
  fetchUser(2),
  fetchUser(3)
]).then(users => console.log('All users:', users));`,
    solved: [
      'Flat chaining (no pyramid)',
      'Single .catch() for all errors',
      'Promise.all for parallelism',
      'Guaranteed single resolution',
    ],
    created: [
      'Still not as readable as sync code',
      'Easy to forget return in .then()',
      'Unhandled rejection warnings',
      'Can\'t break out of chain early',
    ],
    description: 'Promises flattened callback hell with .then() chains and unified error handling.',
  },
  {
    id: 'generators',
    name: 'Generators',
    years: '2015-2017',
    color: '#a855f7',
    technologies: ['function*', 'yield', 'co', 'Koa'],
    code: `// Generators: pausable functions
function* fetchSequence() {
  const user = yield fetchUser(1);
  console.log('Got user:', user.name);

  const orders = yield getOrders(user.id);
  console.log('Got orders:', orders.length);

  return orders;
}

// Looks sync but is async!
// Libraries like 'co' ran generators automatically
const co = require('co');
co(fetchSequence).then(orders => {
  console.log('Done!', orders);
});

// How yield works:
function* counter() {
  yield 1;        // Pause, return 1
  yield 2;        // Pause, return 2
  return 3;       // Done
}
const gen = counter();
gen.next(); // { value: 1, done: false }
gen.next(); // { value: 2, done: false }
gen.next(); // { value: 3, done: true }`,
    solved: [
      'Sync-looking async code',
      'Can use try/catch!',
      'Pausable execution flow',
    ],
    created: [
      'Required runner library (co)',
      'Confusing syntax (function*, yield)',
      'Not widely adopted',
    ],
    description: 'Generators enabled sync-looking async code, paving the way for async/await.',
  },
  {
    id: 'async-await',
    name: 'Async/Await',
    years: '2017-Present',
    color: '#10b981',
    technologies: ['async', 'await', 'try/catch'],
    code: `// Async/Await: the best of all worlds
async function fetchOrderFlow(userId) {
  try {
    const user = await fetchUser(userId);
    const orders = await getOrders(user.id);
    const details = await getOrderDetails(orders[0].id);
    const shipping = await getShippingInfo(details.shipId);

    return { user, orders, details, shipping };
  } catch (err) {
    console.error('Failed:', err.message);
    throw err;
  }
}

// Parallel with async/await
async function fetchAllUsers() {
  const [user1, user2, user3] = await Promise.all([
    fetchUser(1),
    fetchUser(2),
    fetchUser(3)
  ]);
  return [user1, user2, user3];
}

// Top-level await (ES2022)
const data = await fetch('/api/data').then(r => r.json());`,
    solved: [
      'Reads like synchronous code',
      'Native try/catch works',
      'Built into the language',
      'Works with existing Promises',
    ],
    created: [
      'Easy to forget await (silent bug)',
      'Sequential by default (perf trap)',
      'Error stack traces can be confusing',
    ],
    description: 'Async/await made async code look and behave like sync code. The clear winner.',
  },
  {
    id: 'modern',
    name: 'Modern Patterns',
    years: '2020-Present',
    color: '#ec4899',
    technologies: ['Promise.allSettled', 'AbortController', 'AsyncIterator'],
    code: `// Promise.allSettled - don't fail on first error
const results = await Promise.allSettled([
  fetchUser(1),       // succeeds
  fetchUser(-1),      // fails
  fetchUser(2)        // succeeds
]);
// [{ status: 'fulfilled', value: {...} },
//  { status: 'rejected', reason: Error },
//  { status: 'fulfilled', value: {...} }]

// AbortController - cancel async operations
const controller = new AbortController();
fetch('/api/data', { signal: controller.signal });
controller.abort(); // Cancel the fetch!

// Async Iterators - streams of async data
async function* fetchPages(url) {
  let page = 1;
  while (true) {
    const data = await fetch(\`\${url}?page=\${page}\`);
    if (!data.length) return;
    yield data;
    page++;
  }
}

for await (const page of fetchPages('/api')) {
  console.log('Got page:', page);
}`,
    solved: [
      'Handle partial failures gracefully',
      'Cancel in-flight requests',
      'Stream async data with for-await',
    ],
    created: [
      'More APIs to learn',
      'Browser support varies',
      'Complexity for simple cases',
    ],
    description: 'Modern JS adds tools for cancellation, partial failures, and async iteration.',
  },
]

export function AsyncEvolutionViz() {
  const [activeEra, setActiveEra] = useState(0)
  const era = eras[activeEra]

  const handlePrev = () => {
    if (activeEra > 0) setActiveEra(activeEra - 1)
  }

  const handleNext = () => {
    if (activeEra < eras.length - 1) setActiveEra(activeEra + 1)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="relative flex justify-between px-2 mb-2">
        {eras.map((e, i) => (
          <button
            key={e.id}
            className={`relative z-10 flex flex-col items-center gap-1 p-0 bg-transparent border-0 cursor-pointer transition-all duration-200 ${
              i === activeEra ? 'text-white' : i < activeEra ? 'text-gray-400' : 'text-gray-500'
            }`}
            onClick={() => setActiveEra(i)}
            style={{ '--era-color': e.color } as React.CSSProperties}
          >
            <span className={`text-xs font-medium transition-colors duration-200 ${
              i === activeEra ? 'text-white font-semibold' : 'text-gray-500 hover:text-gray-300'
            }`}>
              {e.years.split('-')[0]}
            </span>
            <span
              className={`w-4 h-4 rounded-full transition-all duration-200 ${
                i === activeEra
                  ? 'scale-130'
                  : i < activeEra
                  ? ''
                  : 'bg-[var(--color-bg-elevated)] border-2 border-white/20 hover:border-[var(--era-color)] hover:shadow-[0_0_8px_var(--era-color)]'
              }`}
              style={{
                background: i <= activeEra ? e.color : undefined,
                borderColor: i <= activeEra ? e.color : undefined,
                boxShadow: i === activeEra ? `0 0 12px ${e.color}` : undefined
              }}
            />
            <span className={`text-xs whitespace-nowrap max-w-[60px] overflow-hidden text-ellipsis transition-colors duration-200 ${
              i === activeEra ? 'text-white font-semibold' : 'text-gray-500 hover:text-gray-300'
            }`}>
              {e.name}
            </span>
          </button>
        ))}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-1/2 z-0" />
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
          className="p-6 rounded-xl text-center border border-white/10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          style={{ 
            '--era-color': era.color,
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(59, 130, 246, 0.08))'
          } as React.CSSProperties}
        >
          <div className="flex items-center justify-center gap-4 mb-2 flex-wrap">
            <span 
              className="w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ background: era.color }}
            >
              {activeEra + 1}
            </span>
            <h3 className="text-lg font-semibold text-gray-100 m-0">{era.name}</h3>
            <span className="text-xs font-medium text-[var(--era-color)] px-2 py-0.5 rounded-full bg-white/5">
              {era.years}
            </span>
          </div>
          <p className="text-base text-gray-400 m-0 mb-3 leading-snug">{era.description}</p>
          <div className="flex gap-1.5 justify-center flex-wrap">
            {era.technologies.map(tech => (
              <span 
                key={tech} 
                className="px-2 py-0.5 bg-white/[0.08] border border-white/10 rounded text-[10px] font-mono text-blue-300"
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
          className="rounded-xl overflow-hidden border border-white/[0.08] bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex justify-between items-center px-4 py-2 text-xs font-semibold text-gray-500 bg-white/5">
            <span>Example Code</span>
          </div>
          <pre className="m-0 p-4 max-h-[200px] overflow-y-auto font-mono text-[10px] leading-normal text-gray-300 whitespace-pre-wrap">
            <code>{era.code}</code>
          </pre>
        </motion.div>
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={`solved-${era.id}`}
            className="p-4 rounded-lg bg-emerald-500/[0.08] border border-emerald-500/20"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="flex items-center gap-1.5 mb-2 text-xs font-semibold text-emerald-400">
              <Check size={16} className="text-emerald-500" />
              <span>Problems Solved</span>
            </div>
            <ul className="m-0 p-0 list-none">
              {era.solved.map((item, i) => (
                <motion.li
                  key={i}
                  className="relative pl-3 text-xs text-gray-400 leading-normal mb-1 before:content-[''] before:absolute before:left-0 before:top-[0.45em] before:w-1.5 before:h-1.5 before:rounded-full before:bg-emerald-500"
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
            className="p-4 rounded-lg bg-red-500/[0.08] border border-red-500/20"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div className="flex items-center gap-1.5 mb-2 text-xs font-semibold text-red-400">
              <AlertTriangle size={16} className="text-red-500" />
              <span>New Challenges</span>
            </div>
            <ul className="m-0 p-0 list-none">
              {era.created.map((item, i) => (
                <motion.li
                  key={i}
                  className="relative pl-3 text-xs text-gray-400 leading-normal mb-1 before:content-[''] before:absolute before:left-0 before:top-[0.45em] before:w-1.5 before:h-1.5 before:rounded-full before:bg-red-500"
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
        <div className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-500/[0.08] border border-dashed border-blue-500/30 rounded-lg text-xs text-gray-400">
          <ArrowRight size={14} className="text-blue-500 animate-pulse" />
          <span>These challenges led to: <strong className="text-blue-300">{eras[activeEra + 1].name}</strong></span>
        </div>
      )}

      <div className="flex gap-4 justify-center items-center">
        <button
          className="px-4 py-2 text-sm bg-white/5 border border-white/10 rounded-md text-gray-400 cursor-pointer transition-all duration-200 hover:bg-white/10 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={handlePrev}
          disabled={activeEra === 0}
        >
          Previous Era
        </button>
        <span className="text-sm text-gray-500 font-medium min-w-[3rem] text-center">
          {activeEra + 1} / {eras.length}
        </span>
        <button
          className="px-6 py-2 text-base font-medium bg-gradient-to-r from-blue-500 to-cyan-500 border-0 rounded-md text-white cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          onClick={handleNext}
          disabled={activeEra === eras.length - 1}
        >
          Next Era
        </button>
      </div>

      <div className="px-4 py-2.5 bg-blue-500/[0.08] border border-blue-500/20 rounded-lg text-sm text-gray-400 text-center">
        <strong className="text-blue-500">Key Insight:</strong> Async/await won because it makes async code look synchronous while preserving all Promise capabilities.
      </div>
    </div>
  )
}
