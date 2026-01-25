import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, AlertTriangle, ArrowRight } from 'lucide-react'
import styles from './AsyncEvolutionViz.module.css'

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
    <div className={styles.container}>
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

      {activeEra < eras.length - 1 && (
        <div className={styles.nextHint}>
          <ArrowRight size={14} />
          <span>These challenges led to: <strong>{eras[activeEra + 1].name}</strong></span>
        </div>
      )}

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

      <div className={styles.insight}>
        <strong>Key Insight:</strong> Async/await won because it makes async code look synchronous while preserving all Promise capabilities.
      </div>
    </div>
  )
}
