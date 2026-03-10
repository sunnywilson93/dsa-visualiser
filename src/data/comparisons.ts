import type { ConceptQuestion } from '@/data/concepts'

export interface ComparisonItem {
  id: string
  title: string
  keyPoints: string[]
  codeExample: string
}

export interface ComparisonDimension {
  dimension: string
  aspects: Record<string, string>
}

export interface Comparison {
  id: string
  title: string
  domain: 'js' | 'react' | 'dsa'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  shortDescription: string
  items: ComparisonItem[]
  dimensions: ComparisonDimension[]
  whenToUse: { itemId: string; guidance: string }[]
  commonMistakes: string[]
  interviewQuestions: ConceptQuestion[]
  relatedConceptIds: string[]
  targetKeywords: string[]
}

export const comparisons: Comparison[] = [
  // ── var vs let vs const ───────────────────────────────────────────────
  {
    id: 'var-let-const',
    title: 'var vs let vs const',
    domain: 'js',
    difficulty: 'beginner',
    shortDescription: 'Understand the differences between var, let, and const — scope, hoisting, reassignment, and when to use each.',
    items: [
      {
        id: 'var',
        title: 'var',
        keyPoints: [
          'Function-scoped (not block-scoped)',
          'Hoisted and initialized to undefined',
          'Can be redeclared in the same scope',
          'Can be reassigned',
        ],
        codeExample: `function example() {
  console.log(x) // undefined (hoisted)
  var x = 10
  if (true) {
    var x = 20 // same variable!
  }
  console.log(x) // 20
}`,
      },
      {
        id: 'let',
        title: 'let',
        keyPoints: [
          'Block-scoped (respects {curly braces})',
          'Hoisted but NOT initialized (TDZ)',
          'Cannot be redeclared in the same scope',
          'Can be reassigned',
        ],
        codeExample: `function example() {
  // console.log(x) // ReferenceError (TDZ)
  let x = 10
  if (true) {
    let x = 20 // different variable
    console.log(x) // 20
  }
  console.log(x) // 10
}`,
      },
      {
        id: 'const',
        title: 'const',
        keyPoints: [
          'Block-scoped (like let)',
          'Hoisted but NOT initialized (TDZ)',
          'Cannot be redeclared or reassigned',
          'Object/array properties CAN still be mutated',
        ],
        codeExample: `const obj = { name: 'Alice' }
obj.name = 'Bob'    // OK — mutating property
// obj = {}          // TypeError — reassignment

const arr = [1, 2, 3]
arr.push(4)          // OK — mutating array
// arr = [5, 6]      // TypeError — reassignment`,
      },
    ],
    dimensions: [
      { dimension: 'Scope', aspects: { var: 'Function', let: 'Block', const: 'Block' } },
      { dimension: 'Hoisting', aspects: { var: 'Yes (undefined)', let: 'Yes (TDZ)', const: 'Yes (TDZ)' } },
      { dimension: 'Redeclaration', aspects: { var: 'Allowed', let: 'Not allowed', const: 'Not allowed' } },
      { dimension: 'Reassignment', aspects: { var: 'Allowed', let: 'Allowed', const: 'Not allowed' } },
      { dimension: 'Global object property', aspects: { var: 'Yes (window.x)', let: 'No', const: 'No' } },
    ],
    whenToUse: [
      { itemId: 'const', guidance: 'Default choice. Use for all values that won\'t be reassigned — objects, arrays, functions, primitives.' },
      { itemId: 'let', guidance: 'Use when the binding needs to change — loop counters, accumulators, conditional assignments.' },
      { itemId: 'var', guidance: 'Avoid in modern code. Only appears in legacy codebases or when you specifically need function-scoping.' },
    ],
    commonMistakes: [
      'Thinking const makes objects immutable — it only prevents reassignment of the binding',
      'Using var in for loops and expecting block scope — var leaks out of the loop body',
      'Not understanding TDZ — accessing let/const before declaration throws ReferenceError, not undefined',
    ],
    interviewQuestions: [
      { question: 'What is the Temporal Dead Zone (TDZ)?', answer: 'The TDZ is the period between entering a scope and the let/const declaration being reached. Accessing the variable during this period throws a ReferenceError. This exists because let/const are hoisted but not initialized.', difficulty: 'medium' },
      { question: 'Why does var in a for loop cause issues with closures?', answer: 'Because var is function-scoped, all iterations share the same variable. By the time callbacks execute, the loop has finished and the variable holds the final value. Using let creates a new binding per iteration, fixing this.', difficulty: 'medium' },
      { question: 'Can you change a property of a const object?', answer: 'Yes. const prevents reassignment of the binding, not mutation of the value. To make an object truly immutable, use Object.freeze() — but note it is shallow.', difficulty: 'easy' },
    ],
    relatedConceptIds: ['variables', 'scope-basics', 'hoisting-variables', 'temporal-dead-zone'],
    targetKeywords: ['var vs let vs const', 'javascript var let const difference', 'when to use let vs const', 'var vs let vs const interview'],
  },

  // ── Debounce vs Throttle ──────────────────────────────────────────────
  {
    id: 'debounce-vs-throttle',
    title: 'Debounce vs Throttle',
    domain: 'js',
    difficulty: 'intermediate',
    shortDescription: 'Both limit how often a function executes, but debounce waits until activity stops while throttle enforces a steady maximum rate.',
    items: [
      {
        id: 'debounce',
        title: 'Debounce',
        keyPoints: [
          'Delays execution until after a pause in activity',
          'Resets the timer on every new call',
          'Only the LAST call in a burst actually executes',
          'Best for "wait until the user is done" scenarios',
        ],
        codeExample: `function debounce(fn, delay) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

// User types "hello" — only fires ONCE after typing stops
input.addEventListener('input',
  debounce(handleSearch, 300)
)`,
      },
      {
        id: 'throttle',
        title: 'Throttle',
        keyPoints: [
          'Executes at most once per time interval',
          'Guarantees regular execution during sustained activity',
          'First call executes immediately (leading edge)',
          'Best for "limit the rate" scenarios',
        ],
        codeExample: `function throttle(fn, limit) {
  let inThrottle = false
  return (...args) => {
    if (!inThrottle) {
      fn(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Fires at most every 200ms during scrolling
window.addEventListener('scroll',
  throttle(handleScroll, 200)
)`,
      },
    ],
    dimensions: [
      { dimension: 'Execution timing', aspects: { debounce: 'After activity stops', throttle: 'At regular intervals during activity' } },
      { dimension: 'During rapid calls', aspects: { debounce: 'Keeps resetting, only last fires', throttle: 'Fires once per interval' } },
      { dimension: 'Guaranteed execution', aspects: { debounce: 'Only after pause', throttle: 'At steady intervals' } },
      { dimension: 'First call', aspects: { debounce: 'Delayed', throttle: 'Immediate (leading edge)' } },
    ],
    whenToUse: [
      { itemId: 'debounce', guidance: 'Search input, form validation, window resize handler, auto-save — anything where you want to wait until the user finishes.' },
      { itemId: 'throttle', guidance: 'Scroll handlers, mousemove tracking, rate-limited API calls, game input — anything where you need regular updates during continuous activity.' },
    ],
    commonMistakes: [
      'Using debounce for scroll handlers — causes janky UX because no updates happen until scrolling stops',
      'Using throttle for search inputs — fires unnecessary intermediate searches before the user finishes typing',
      'Forgetting to cancel debounce on component unmount — leads to state updates on unmounted components',
    ],
    interviewQuestions: [
      { question: 'What happens if you debounce a scroll handler?', answer: 'The handler only fires after the user stops scrolling, which creates a poor UX — no visual updates during scrolling, then a sudden jump. Throttle is the right choice for scroll because it provides regular updates at a controlled rate.', difficulty: 'medium' },
      { question: 'Implement debounce from scratch', answer: 'Return a wrapper function that clears any existing timeout and sets a new one. The key insight is that clearTimeout(timer) on each call resets the delay, so only the last call in a burst survives to execute.', difficulty: 'medium' },
      { question: 'How do leading and trailing edge throttle differ?', answer: 'Leading edge executes on the first call then blocks. Trailing edge blocks then executes at the end. Lodash\'s throttle supports both via options: { leading: true, trailing: true }.', difficulty: 'hard' },
    ],
    relatedConceptIds: ['timing-control', 'higher-order-functions', 'closures'],
    targetKeywords: ['debounce vs throttle', 'javascript debounce throttle difference', 'debounce vs throttle interview', 'when to use debounce vs throttle'],
  },

  // ── useMemo vs useCallback ────────────────────────────────────────────
  {
    id: 'usememo-vs-usecallback',
    title: 'useMemo vs useCallback',
    domain: 'react',
    difficulty: 'intermediate',
    shortDescription: 'useMemo memoizes a computed VALUE, useCallback memoizes a FUNCTION reference. Both use dependency arrays to control when recalculation happens.',
    items: [
      {
        id: 'usememo',
        title: 'useMemo',
        keyPoints: [
          'Memoizes the RETURN VALUE of a function',
          'Recalculates only when dependencies change',
          'Avoids expensive recomputation on every render',
          'Returns the cached value, not a function',
        ],
        codeExample: `function ProductList({ items, filter }) {
  // Only recalculates when items or filter change
  const filtered = useMemo(
    () => items.filter(i => i.name.includes(filter)),
    [items, filter]
  )

  return filtered.map(item => <Item key={item.id} item={item} />)
}`,
      },
      {
        id: 'usecallback',
        title: 'useCallback',
        keyPoints: [
          'Memoizes the FUNCTION ITSELF (its reference)',
          'Returns the same function reference between renders',
          'Useful when passing callbacks to memoized children',
          'useCallback(fn, deps) === useMemo(() => fn, deps)',
        ],
        codeExample: `function Parent({ id }) {
  // Same function reference unless id changes
  const handleClick = useCallback(
    () => { console.log('Clicked', id) },
    [id]
  )

  // Child won't re-render if wrapped in React.memo
  return <MemoizedChild onClick={handleClick} />
}`,
      },
    ],
    dimensions: [
      { dimension: 'What it memoizes', aspects: { usememo: 'A computed value', usecallback: 'A function reference' } },
      { dimension: 'Returns', aspects: { usememo: 'The cached result', usecallback: 'The cached function' } },
      { dimension: 'Primary use case', aspects: { usememo: 'Expensive computations', usecallback: 'Stable callback references' } },
      { dimension: 'Works with React.memo', aspects: { usememo: 'Indirectly (via stable values)', usecallback: 'Directly (stable function props)' } },
      { dimension: 'Equivalent', aspects: { usememo: 'useMemo(() => value, deps)', usecallback: 'useMemo(() => fn, deps)' } },
    ],
    whenToUse: [
      { itemId: 'usememo', guidance: 'Expensive calculations (filtering/sorting large lists), deriving data from props/state, creating objects/arrays passed as props to memoized children.' },
      { itemId: 'usecallback', guidance: 'Callbacks passed to React.memo children, event handlers used in useEffect dependency arrays, functions passed to custom hooks.' },
    ],
    commonMistakes: [
      'Using useMemo for cheap operations — the memoization overhead can exceed the computation cost',
      'Forgetting that useCallback is useless without React.memo on the child component',
      'Including unstable references in the dependency array — defeats the purpose of memoization',
    ],
    interviewQuestions: [
      { question: 'When is useMemo actually harmful?', answer: 'When the computation is trivial (simple math, string concatenation). Memoization adds memory overhead and dependency comparison cost. Only use it when profiling shows the computation is expensive enough to justify caching.', difficulty: 'medium' },
      { question: 'Why is useCallback useless without React.memo?', answer: 'Without React.memo, the child component re-renders whenever its parent re-renders regardless of prop changes. useCallback preserves function identity, but that only matters if something is actually checking for reference equality — which React.memo does.', difficulty: 'hard' },
      { question: 'How does the React Compiler change useMemo/useCallback?', answer: 'React Compiler (React Forget) automatically memoizes values and callbacks, making manual useMemo/useCallback unnecessary. It analyzes your code at build time and inserts memoization where beneficial.', difficulty: 'hard' },
    ],
    relatedConceptIds: ['use-memo', 'use-callback', 'react-memo'],
    targetKeywords: ['usememo vs usecallback', 'react usememo usecallback difference', 'when to use usememo vs usecallback', 'usememo vs usecallback interview'],
  },

  // ── == vs === ─────────────────────────────────────────────────────────
  {
    id: 'equality-operators',
    title: '== vs === in JavaScript',
    domain: 'js',
    difficulty: 'beginner',
    shortDescription: '== performs type coercion before comparing (loose equality), while === compares value AND type without any conversion (strict equality).',
    items: [
      {
        id: 'loose',
        title: '== (Loose Equality)',
        keyPoints: [
          'Performs type coercion before comparison',
          'null == undefined is true',
          'String/Boolean are converted to Number for comparison',
          'Can produce surprising results with different types',
        ],
        codeExample: `0 == ''        // true ('' → 0)
0 == '0'       // true ('0' → 0)
'' == '0'      // false (same type, different values)
false == '0'   // true (false → 0, '0' → 0)
null == undefined // true (special rule)
null == 0      // false (null only == undefined)
NaN == NaN     // false (NaN is never equal to anything)`,
      },
      {
        id: 'strict',
        title: '=== (Strict Equality)',
        keyPoints: [
          'No type coercion — types must match first',
          'If types differ, immediately returns false',
          'More predictable and easier to reason about',
          'Recommended in virtually all cases',
        ],
        codeExample: `0 === ''        // false (number vs string)
0 === '0'       // false (number vs string)
false === '0'   // false (boolean vs string)
null === undefined // false (different types)
1 === 1         // true
'a' === 'a'     // true
NaN === NaN     // false (still!)`,
      },
    ],
    dimensions: [
      { dimension: 'Type coercion', aspects: { loose: 'Yes — converts types before comparing', strict: 'No — different types always false' } },
      { dimension: 'null == undefined', aspects: { loose: 'true', strict: 'false' } },
      { dimension: 'Predictability', aspects: { loose: 'Low — memorize coercion rules', strict: 'High — simple type + value check' } },
      { dimension: 'Performance', aspects: { loose: 'Slightly slower (coercion step)', strict: 'Slightly faster (no coercion)' } },
      { dimension: 'Best practice', aspects: { loose: 'Avoid (except null checks)', strict: 'Always prefer' } },
    ],
    whenToUse: [
      { itemId: 'strict', guidance: 'Use === by default for all comparisons. It\'s predictable and avoids unexpected coercion bugs.' },
      { itemId: 'loose', guidance: 'Only acceptable for null/undefined checks: `value == null` catches both null and undefined in one check. ESLint\'s eqeqeq rule allows this specific case.' },
    ],
    commonMistakes: [
      'Using == for form input validation — input values are strings, so 0 == "" is true but meaningless',
      'Not knowing that NaN is never equal to itself — use Number.isNaN() instead',
      'Assuming null == 0 is true — null only loosely equals undefined, nothing else',
    ],
    interviewQuestions: [
      { question: 'Is there any legitimate use for == in modern JavaScript?', answer: 'Yes, one: checking for null/undefined. `value == null` catches both null and undefined in a single check, which is more concise than `value === null || value === undefined`. Many style guides allow this specific case.', difficulty: 'medium' },
      { question: 'Why does [] == false evaluate to true?', answer: 'The coercion chain: [] → "" (toString), "" → 0 (toNumber), false → 0 (toNumber). Then 0 == 0 is true. This is why == with objects is particularly dangerous.', difficulty: 'hard' },
      { question: 'How does Object.is() differ from ===?', answer: 'Object.is() handles two edge cases differently: Object.is(NaN, NaN) is true (=== gives false), and Object.is(+0, -0) is false (=== gives true). React uses Object.is() internally for state comparison.', difficulty: 'hard' },
    ],
    relatedConceptIds: ['equality-comparisons', 'type-coercion', 'implicit-coercion-rules', 'coercion-edge-cases'],
    targetKeywords: ['== vs === javascript', 'loose vs strict equality', 'javascript equality operators', 'double equals vs triple equals'],
  },

  // ── Promises vs async/await ───────────────────────────────────────────
  {
    id: 'promise-vs-async-await',
    title: 'Promises vs async/await',
    domain: 'js',
    difficulty: 'intermediate',
    shortDescription: 'async/await is syntactic sugar over Promises. Both handle asynchronous operations, but async/await reads like synchronous code while Promises use .then() chaining.',
    items: [
      {
        id: 'promises',
        title: 'Promises (.then/.catch)',
        keyPoints: [
          'Chain-based API with .then(), .catch(), .finally()',
          'Each .then() returns a new Promise',
          'Can handle multiple async operations with Promise.all/race/allSettled',
          'Error handling via .catch() at end of chain',
        ],
        codeExample: `function fetchUserData(id) {
  return fetch(\`/api/users/\${id}\`)
    .then(res => res.json())
    .then(user => fetch(\`/api/posts/\${user.name}\`))
    .then(res => res.json())
    .catch(err => console.error('Failed:', err))
}`,
      },
      {
        id: 'async-await',
        title: 'async/await',
        keyPoints: [
          'Syntactic sugar over Promises — same underlying mechanism',
          'Makes async code read like synchronous code',
          'Error handling via try/catch (familiar pattern)',
          'async function always returns a Promise',
        ],
        codeExample: `async function fetchUserData(id) {
  try {
    const res = await fetch(\`/api/users/\${id}\`)
    const user = await res.json()
    const postsRes = await fetch(\`/api/posts/\${user.name}\`)
    return await postsRes.json()
  } catch (err) {
    console.error('Failed:', err)
  }
}`,
      },
    ],
    dimensions: [
      { dimension: 'Syntax style', aspects: { promises: 'Chain-based (.then/.catch)', 'async-await': 'Sequential (await keyword)' } },
      { dimension: 'Error handling', aspects: { promises: '.catch() at chain end', 'async-await': 'try/catch blocks' } },
      { dimension: 'Readability', aspects: { promises: 'Can become nested with complex flows', 'async-await': 'Reads like synchronous code' } },
      { dimension: 'Debugging', aspects: { promises: 'Stack traces can be harder to follow', 'async-await': 'Better stack traces, easier to step through' } },
      { dimension: 'Parallel execution', aspects: { promises: 'Natural with Promise.all()', 'async-await': 'Requires explicit Promise.all()' } },
    ],
    whenToUse: [
      { itemId: 'async-await', guidance: 'Default choice for sequential async operations, complex error handling, and any code where readability matters. Use for most async code.' },
      { itemId: 'promises', guidance: 'Better for parallel operations (Promise.all), simple transformations, and when building composable async utilities. Also needed in non-async contexts.' },
    ],
    commonMistakes: [
      'Using await in a loop instead of Promise.all for parallel operations — sequential awaits are N times slower',
      'Forgetting that async functions always return a Promise — returning a value wraps it in Promise.resolve()',
      'Not handling errors — unhandled promise rejections crash Node.js processes',
    ],
    interviewQuestions: [
      { question: 'Can you use await at the top level?', answer: 'Yes, in ES modules (not CommonJS). Top-level await was introduced in ES2022. In Node.js, the file must use .mjs extension or have "type": "module" in package.json.', difficulty: 'medium' },
      { question: 'What happens if you forget await before a Promise?', answer: 'The code continues without waiting for resolution. The variable holds the pending Promise object instead of the resolved value. This is a common source of bugs — the code appears to work but processes data incorrectly.', difficulty: 'easy' },
      { question: 'How would you run 5 API calls in parallel with async/await?', answer: 'Use Promise.all(): `const results = await Promise.all([fetch(url1), fetch(url2), ...])`. Each fetch runs concurrently and await pauses until all resolve. For partial failure tolerance, use Promise.allSettled() instead.', difficulty: 'medium' },
    ],
    relatedConceptIds: ['promises-deep-dive', 'async-await-syntax', 'async-await-parallel', 'promises-chaining'],
    targetKeywords: ['promise vs async await', 'javascript promises vs async await', 'when to use promise vs async await', 'async await vs then'],
  },

  // ── map() vs forEach() ────────────────────────────────────────────────
  {
    id: 'map-vs-foreach',
    title: 'map() vs forEach()',
    domain: 'js',
    difficulty: 'beginner',
    shortDescription: 'map() transforms each element and returns a NEW array. forEach() executes a side effect for each element and returns undefined.',
    items: [
      {
        id: 'map',
        title: 'Array.map()',
        keyPoints: [
          'Returns a NEW array with transformed elements',
          'Does NOT mutate the original array',
          'Each callback return value becomes an element in the new array',
          'Chainable — can call .filter(), .reduce() etc. after',
        ],
        codeExample: `const numbers = [1, 2, 3, 4]

const doubled = numbers.map(n => n * 2)
// doubled: [2, 4, 6, 8]
// numbers: [1, 2, 3, 4] (unchanged)

// Chainable
const result = numbers
  .map(n => n * 2)
  .filter(n => n > 4)
// result: [6, 8]`,
      },
      {
        id: 'foreach',
        title: 'Array.forEach()',
        keyPoints: [
          'Returns undefined — cannot chain',
          'Used for SIDE EFFECTS (logging, DOM updates, mutations)',
          'Does NOT create a new array',
          'Cannot break or return early (use for...of instead)',
        ],
        codeExample: `const numbers = [1, 2, 3, 4]

// Side effect: logging
numbers.forEach(n => console.log(n))

// Side effect: DOM manipulation
items.forEach(item => {
  document.body.appendChild(
    createItemElement(item)
  )
})

// Returns undefined — can't chain!
// numbers.forEach(...).filter(...) // TypeError`,
      },
    ],
    dimensions: [
      { dimension: 'Return value', aspects: { map: 'New array', foreach: 'undefined' } },
      { dimension: 'Purpose', aspects: { map: 'Transform data', foreach: 'Execute side effects' } },
      { dimension: 'Chainable', aspects: { map: 'Yes', foreach: 'No' } },
      { dimension: 'Original array', aspects: { map: 'Not mutated', foreach: 'Not mutated (but callbacks may mutate)' } },
      { dimension: 'Break early', aspects: { map: 'No (use for...of)', foreach: 'No (use for...of)' } },
    ],
    whenToUse: [
      { itemId: 'map', guidance: 'When you need a transformed version of the data — converting formats, extracting properties, computing derived values. The functional programming choice.' },
      { itemId: 'foreach', guidance: 'When you need to DO something with each element without producing a new array — logging, API calls, DOM updates, accumulating into an external variable.' },
    ],
    commonMistakes: [
      'Using map() just for side effects and ignoring the return value — wastes memory creating an unused array',
      'Using forEach() when you need the result — then assigning to an external variable instead of using map()',
      'Trying to break out of forEach() with return — return only skips the current iteration, not the loop',
    ],
    interviewQuestions: [
      { question: 'When should you use for...of instead of forEach?', answer: 'When you need early termination (break/continue), when working with async/await (forEach doesn\'t await properly), or when iterating non-array iterables (Map, Set, generators).', difficulty: 'medium' },
      { question: 'Does map() mutate the original array?', answer: 'No, map() always returns a new array. However, if the callback mutates elements that are objects/arrays (reference types), those mutations affect the originals since both arrays share the same object references.', difficulty: 'easy' },
    ],
    relatedConceptIds: ['array-iteration-methods', 'array-reduce-patterns', 'higher-order-functions'],
    targetKeywords: ['map vs foreach javascript', 'array map vs foreach', 'when to use map vs foreach', 'javascript map foreach difference'],
  },

  // ── null vs undefined ─────────────────────────────────────────────────
  {
    id: 'null-vs-undefined',
    title: 'null vs undefined',
    domain: 'js',
    difficulty: 'beginner',
    shortDescription: 'undefined means a variable exists but has no assigned value. null is an intentional assignment meaning "no value." Both represent absence, but with different semantics.',
    items: [
      {
        id: 'undefined',
        title: 'undefined',
        keyPoints: [
          'Default value for uninitialized variables',
          'Returned by functions with no return statement',
          'Value of missing object properties',
          'Value of missing function arguments',
        ],
        codeExample: `let x            // x is undefined
function foo() {} // foo() returns undefined

const obj = { a: 1 }
obj.b            // undefined (missing property)

function bar(a, b) {
  console.log(b) // undefined if not passed
}
bar(1)`,
      },
      {
        id: 'null',
        title: 'null',
        keyPoints: [
          'Must be explicitly assigned — never appears automatically',
          'Represents intentional absence of a value',
          'typeof null === "object" (historical bug in JavaScript)',
          'Used to clear/reset a variable or DOM reference',
        ],
        codeExample: `let user = null  // intentionally empty

// Clear a reference
let element = document.getElementById('app')
element = null   // help garbage collection

// API responses often use null
const response = { data: null, error: 'Not found' }

typeof null      // "object" (JS bug since 1995)
typeof undefined // "undefined"`,
      },
    ],
    dimensions: [
      { dimension: 'Meaning', aspects: { undefined: 'Not yet assigned', null: 'Intentionally empty' } },
      { dimension: 'typeof', aspects: { undefined: '"undefined"', null: '"object" (historical bug)' } },
      { dimension: 'Appears automatically', aspects: { undefined: 'Yes (uninitialized vars, missing props)', null: 'No (must be explicitly set)' } },
      { dimension: 'JSON serialization', aspects: { undefined: 'Omitted from JSON', null: 'Preserved as null' } },
      { dimension: '== comparison', aspects: { undefined: 'null == undefined is true', null: 'null == undefined is true' } },
    ],
    whenToUse: [
      { itemId: 'null', guidance: 'When you intentionally want to represent "no value" — clearing references, API responses, initial state that hasn\'t been fetched yet.' },
      { itemId: 'undefined', guidance: 'Generally don\'t assign undefined explicitly. Let JavaScript use it as the default. If you need "no value," prefer null for clarity of intent.' },
    ],
    commonMistakes: [
      'Checking typeof x === "null" — typeof null returns "object", not "null"',
      'Not handling both null and undefined — use `x == null` to catch both, or `x ?? fallback` with nullish coalescing',
      'Confusing undefined with "not declared" — accessing an undeclared variable throws ReferenceError, but typeof undeclared returns "undefined"',
    ],
    interviewQuestions: [
      { question: 'Why does typeof null return "object"?', answer: 'It\'s a bug from the original JavaScript implementation in 1995. Internally, values were stored with a type tag, and null used the same tag as objects (0). This was never fixed for backward compatibility.', difficulty: 'medium' },
      { question: 'What does the nullish coalescing operator (??) do?', answer: '`a ?? b` returns b only if a is null or undefined. Unlike `a || b`, it doesn\'t treat 0, "", or false as "nullish." This makes it safer for default values where falsy values are valid.', difficulty: 'easy' },
    ],
    relatedConceptIds: ['data-types', 'nullish-coalescing', 'optional-chaining', 'typeof-type-checking'],
    targetKeywords: ['null vs undefined javascript', 'difference between null and undefined', 'null undefined javascript interview', 'when to use null vs undefined'],
  },

  // ── call vs apply vs bind ─────────────────────────────────────────────
  {
    id: 'call-apply-bind',
    title: 'call vs apply vs bind',
    domain: 'js',
    difficulty: 'intermediate',
    shortDescription: 'All three set the "this" context of a function. call() and apply() invoke immediately (differing in argument format), while bind() returns a new function for later use.',
    items: [
      {
        id: 'call',
        title: 'Function.call()',
        keyPoints: [
          'Invokes the function IMMEDIATELY',
          'First argument sets "this"',
          'Remaining arguments passed individually',
          'fn.call(context, arg1, arg2)',
        ],
        codeExample: `function greet(greeting, punctuation) {
  return \`\${greeting}, \${this.name}\${punctuation}\`
}

const user = { name: 'Alice' }
greet.call(user, 'Hello', '!')
// "Hello, Alice!"`,
      },
      {
        id: 'apply',
        title: 'Function.apply()',
        keyPoints: [
          'Invokes the function IMMEDIATELY',
          'First argument sets "this"',
          'Second argument is an ARRAY of arguments',
          'fn.apply(context, [arg1, arg2])',
        ],
        codeExample: `function greet(greeting, punctuation) {
  return \`\${greeting}, \${this.name}\${punctuation}\`
}

const user = { name: 'Alice' }
const args = ['Hello', '!']
greet.apply(user, args)
// "Hello, Alice!"

// Classic use: Math.max with array
Math.max.apply(null, [1, 5, 3]) // 5`,
      },
      {
        id: 'bind',
        title: 'Function.bind()',
        keyPoints: [
          'Returns a NEW function with "this" permanently set',
          'Does NOT invoke immediately',
          'Can partially apply arguments (partial application)',
          'Returned function can be called later',
        ],
        codeExample: `function greet(greeting, punctuation) {
  return \`\${greeting}, \${this.name}\${punctuation}\`
}

const user = { name: 'Alice' }
const greetAlice = greet.bind(user)
greetAlice('Hello', '!') // "Hello, Alice!"

// Partial application
const hiAlice = greet.bind(user, 'Hi')
hiAlice('!') // "Hi, Alice!"`,
      },
    ],
    dimensions: [
      { dimension: 'Invokes immediately', aspects: { call: 'Yes', apply: 'Yes', bind: 'No (returns new function)' } },
      { dimension: 'Argument format', aspects: { call: 'Individual: fn.call(ctx, a, b)', apply: 'Array: fn.apply(ctx, [a, b])', bind: 'Individual: fn.bind(ctx, a, b)' } },
      { dimension: 'Partial application', aspects: { call: 'No', apply: 'No', bind: 'Yes' } },
      { dimension: 'Returns', aspects: { call: 'Function result', apply: 'Function result', bind: 'New bound function' } },
    ],
    whenToUse: [
      { itemId: 'call', guidance: 'When you know the arguments and want to invoke immediately. Common for borrowing methods: Array.prototype.slice.call(arguments).' },
      { itemId: 'apply', guidance: 'When arguments are already in an array. Less common since spread syntax arrived: Math.max(...arr) replaces Math.max.apply(null, arr).' },
      { itemId: 'bind', guidance: 'When you need to pass a function with a specific "this" for later invocation — event handlers, callbacks, React class component methods.' },
    ],
    commonMistakes: [
      'Using bind() in a render method creates a new function every render — bind in the constructor or use arrow functions instead',
      'Forgetting that apply() takes an array — passing individual args gives unexpected results',
      'Trying to rebind a bound function — bind() creates a permanent binding that cannot be overridden',
    ],
    interviewQuestions: [
      { question: 'How has spread syntax reduced the need for apply()?', answer: 'Math.max.apply(null, arr) is now Math.max(...arr). Function.apply(ctx, args) is now fn.call(ctx, ...args). Spread syntax is more readable and doesn\'t require the null context placeholder.', difficulty: 'easy' },
      { question: 'Implement Function.prototype.bind from scratch', answer: 'Return a wrapper function that uses apply internally: function bind(context, ...boundArgs) { const fn = this; return function(...callArgs) { return fn.apply(context, [...boundArgs, ...callArgs]); }; }', difficulty: 'hard' },
    ],
    relatedConceptIds: ['this-keyword', 'closure-partial-application', 'higher-order-functions'],
    targetKeywords: ['call vs apply vs bind', 'javascript call apply bind difference', 'call apply bind interview', 'function call apply bind javascript'],
  },

  // ── Shallow vs Deep Copy ──────────────────────────────────────────────
  {
    id: 'shallow-vs-deep-copy',
    title: 'Shallow vs Deep Copy',
    domain: 'js',
    difficulty: 'intermediate',
    shortDescription: 'Shallow copy duplicates top-level properties but shares nested references. Deep copy creates entirely independent copies at all levels.',
    items: [
      {
        id: 'shallow',
        title: 'Shallow Copy',
        keyPoints: [
          'Copies only the top level of properties',
          'Nested objects/arrays still share references',
          'Methods: spread (...), Object.assign(), Array.slice()',
          'Fast — only one level of copying',
        ],
        codeExample: `const original = { a: 1, nested: { b: 2 } }

const shallow = { ...original }
shallow.a = 99       // independent
shallow.nested.b = 99 // MUTATES original!

console.log(original.nested.b) // 99 — shared reference!

// Array shallow copy
const arr = [1, [2, 3]]
const copy = [...arr]
copy[1].push(4) // original[1] is now [2, 3, 4]`,
      },
      {
        id: 'deep',
        title: 'Deep Copy',
        keyPoints: [
          'Copies ALL levels recursively',
          'No shared references — fully independent',
          'Methods: structuredClone(), JSON.parse(JSON.stringify())',
          'Slower — must traverse entire object graph',
        ],
        codeExample: `const original = { a: 1, nested: { b: 2 } }

// Modern approach (recommended)
const deep = structuredClone(original)
deep.nested.b = 99
console.log(original.nested.b) // 2 — independent!

// JSON approach (limited — no functions, Dates, etc.)
const jsonCopy = JSON.parse(JSON.stringify(original))

// structuredClone handles: Date, Map, Set, RegExp, ArrayBuffer
// structuredClone CANNOT handle: functions, DOM nodes, Symbols`,
      },
    ],
    dimensions: [
      { dimension: 'Nesting depth', aspects: { shallow: 'Top level only', deep: 'All levels' } },
      { dimension: 'Shared references', aspects: { shallow: 'Yes (nested objects)', deep: 'No — fully independent' } },
      { dimension: 'Performance', aspects: { shallow: 'Fast (O(n) top-level props)', deep: 'Slower (traverses entire graph)' } },
      { dimension: 'Best method', aspects: { shallow: 'Spread (...) or Object.assign()', deep: 'structuredClone()' } },
      { dimension: 'Handles functions', aspects: { shallow: 'Yes (copies reference)', deep: 'No (structuredClone throws)' } },
    ],
    whenToUse: [
      { itemId: 'shallow', guidance: 'When the object has only primitive properties, or when you intentionally want nested objects to stay shared (performance optimization).' },
      { itemId: 'deep', guidance: 'When you need a fully independent copy — state management (Redux), undo/redo systems, or anytime mutation of the copy must not affect the original.' },
    ],
    commonMistakes: [
      'Assuming spread creates a deep copy — it only copies one level deep',
      'Using JSON.parse(JSON.stringify()) for deep copy — it drops functions, undefined, Infinity, NaN, Dates (become strings), and circular references throw',
      'Not knowing about structuredClone() — it\'s the modern, built-in solution available in all modern browsers and Node.js 17+',
    ],
    interviewQuestions: [
      { question: 'What are the limitations of JSON-based deep copy?', answer: 'It drops: functions, undefined, Symbol keys, Infinity/NaN (become null), Date objects (become strings), Map/Set (become {}), RegExp (become {}), and it throws on circular references. structuredClone handles most of these correctly.', difficulty: 'medium' },
      { question: 'Implement a deep clone function', answer: 'Recursively copy: check if value is null/primitive (return as-is), handle arrays (map with recursive call), handle objects (Object.entries + recursive call). For production, handle Date, Map, Set, and circular references with a WeakMap.', difficulty: 'hard' },
    ],
    relatedConceptIds: ['structured-clone', 'spread-operator-patterns', 'values-and-memory'],
    targetKeywords: ['shallow vs deep copy javascript', 'javascript shallow deep copy difference', 'structuredClone javascript', 'how to deep copy javascript'],
  },

  // ── React.memo vs useMemo ─────────────────────────────────────────────
  {
    id: 'react-memo-vs-usememo',
    title: 'React.memo vs useMemo',
    domain: 'react',
    difficulty: 'intermediate',
    shortDescription: 'React.memo is a higher-order component that skips re-rendering when props haven\'t changed. useMemo is a hook that memoizes a computed value inside a component.',
    items: [
      {
        id: 'react-memo',
        title: 'React.memo',
        keyPoints: [
          'Higher-order component — wraps the entire component',
          'Prevents re-rendering when props are shallowly equal',
          'Compares PROPS only (not state or context)',
          'Optional custom comparison function',
        ],
        codeExample: `// Without memo: re-renders every time Parent renders
// With memo: skips re-render if props unchanged
const ExpensiveList = React.memo(function ExpensiveList({
  items,
  onSelect,
}) {
  return items.map(item => (
    <Item key={item.id} item={item} onSelect={onSelect} />
  ))
})

// Custom comparison
const Chart = React.memo(ChartComponent, (prev, next) => {
  return prev.data.length === next.data.length
})`,
      },
      {
        id: 'usememo',
        title: 'useMemo',
        keyPoints: [
          'Hook — used INSIDE a component',
          'Memoizes a computed VALUE (not the component itself)',
          'Recalculates only when dependencies change',
          'Avoids expensive recalculation on every render',
        ],
        codeExample: `function Dashboard({ transactions }) {
  // Only recalculates when transactions change
  const summary = useMemo(() => {
    return {
      total: transactions.reduce((s, t) => s + t.amount, 0),
      count: transactions.length,
      avg: transactions.reduce((s, t) => s + t.amount, 0)
            / transactions.length,
    }
  }, [transactions])

  return <SummaryCard {...summary} />
}`,
      },
    ],
    dimensions: [
      { dimension: 'What it is', aspects: { 'react-memo': 'Higher-order component (HOC)', usememo: 'React hook' } },
      { dimension: 'What it memoizes', aspects: { 'react-memo': 'Component render output', usememo: 'A computed value' } },
      { dimension: 'Where it\'s used', aspects: { 'react-memo': 'Wraps component definition', usememo: 'Inside component body' } },
      { dimension: 'Comparison basis', aspects: { 'react-memo': 'Shallow prop comparison', usememo: 'Dependency array' } },
      { dimension: 'Prevents', aspects: { 'react-memo': 'Unnecessary re-renders', usememo: 'Unnecessary recalculation' } },
    ],
    whenToUse: [
      { itemId: 'react-memo', guidance: 'When a child component re-renders frequently due to parent renders but its own props rarely change. Most impactful on components with expensive render trees.' },
      { itemId: 'usememo', guidance: 'When you have an expensive computation inside a component that doesn\'t need to run on every render. Also for stabilizing object/array references passed to memoized children.' },
    ],
    commonMistakes: [
      'Using React.memo on components that receive new object/array/function props every render — memo does shallow comparison, so new references always cause re-render',
      'Wrapping everything in React.memo — adds overhead for components that almost always re-render with different props anyway',
      'Confusing the two — React.memo prevents RE-RENDERING, useMemo prevents RE-COMPUTATION within a render',
    ],
    interviewQuestions: [
      { question: 'How do React.memo and useMemo work together?', answer: 'useMemo stabilizes values (objects, arrays) passed as props. React.memo on the child then detects that the prop references haven\'t changed and skips re-rendering. Without useMemo, new object references would defeat React.memo\'s shallow comparison.', difficulty: 'medium' },
      { question: 'When would React.memo actually hurt performance?', answer: 'When props change on almost every render, React.memo adds the cost of comparison without any benefit — it still re-renders plus now also runs the comparison. Also on very cheap components where the render cost is less than the comparison cost.', difficulty: 'hard' },
    ],
    relatedConceptIds: ['react-memo', 'use-memo', 'use-callback', 'rerender-triggers'],
    targetKeywords: ['react memo vs usememo', 'react.memo vs usememo difference', 'when to use react memo', 'react memo vs usememo interview'],
  },
]

export function getComparison(id: string): Comparison | undefined {
  return comparisons.find((c) => c.id === id)
}
