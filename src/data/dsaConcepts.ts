// DSA Concepts - Foundational Data Structures & Algorithms

export interface DSAExample {
  title: string
  code: string
  explanation: string
}

export interface ComplexityInfo {
  time: string
  space?: string
  note?: string
}

export interface DSAConcept {
  id: string
  title: string
  category: 'foundations' | 'data-structures' | 'algorithms' | 'patterns'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  description: string
  shortDescription: string
  keyPoints: string[]
  examples: DSAExample[]
  complexity?: {
    average?: Record<string, string>
    worst?: Record<string, string>
    best?: Record<string, string>
  }
  commonMistakes?: string[]
  interviewTips?: string[]
  relatedProblems?: string[]  // Links to problem IDs
  learningPath?: { stage: string; problemIds: string[] }[]
}

export const dsaConcepts: DSAConcept[] = [
  // ============================================================================
  // FOUNDATIONS
  // ============================================================================
  {
    id: 'big-o-notation',
    title: 'Big O Notation',
    category: 'foundations',
    difficulty: 'beginner',
    description: 'Big O notation describes how an algorithm\'s runtime or space requirements grow as the input size increases. It\'s the language we use to talk about efficiency and is essential for comparing algorithms and making informed decisions about which approach to use.',
    shortDescription: 'Measuring algorithm efficiency',
    keyPoints: [
      'Describes WORST-CASE growth rate, not exact time',
      'We drop constants: O(2n) → O(n)',
      'We keep only the dominant term: O(n² + n) → O(n²)',
      'Common complexities: O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ)',
      'Space complexity measures memory usage growth',
    ],
    examples: [
      {
        title: 'O(1) - Constant',
        code: `function getFirst(arr) {
  return arr[0]
}

// No matter if arr has 10 or 10 million
// elements, we do ONE operation
// Array access by index is O(1)`,
        explanation: 'Always same time regardless of input size'
      },
      {
        title: 'O(n) - Linear',
        code: `function findMax(arr) {
  let max = arr[0]
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i]
    }
  }
  return max
}

// Must check EVERY element once
// 10 elements → ~10 operations
// 1000 elements → ~1000 operations`,
        explanation: 'Time grows proportionally with input size'
      },
      {
        title: 'O(n²) - Quadratic',
        code: `function hasDuplicate(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) {
        return true
      }
    }
  }
  return false
}

// Nested loops over same array
// 10 elements → ~100 comparisons
// 1000 elements → ~1,000,000 comparisons`,
        explanation: 'Each element compared with every other element'
      },
      {
        title: 'O(log n) - Logarithmic',
        code: `function binarySearch(arr, target) {
  let left = 0
  let right = arr.length - 1

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    if (arr[mid] === target) return mid
    if (arr[mid] < target) {
      left = mid + 1  // Eliminate left half
    } else {
      right = mid - 1 // Eliminate right half
    }
  }
  return -1
}

// Each step eliminates HALF the elements
// 1000 elements → ~10 steps
// 1,000,000 elements → ~20 steps`,
        explanation: 'Halving the problem each step'
      },
      {
        title: 'O(n log n) - Linearithmic',
        code: `// Most efficient comparison-based sorts
// like Merge Sort and Quick Sort

function mergeSort(arr) {
  if (arr.length <= 1) return arr

  const mid = Math.floor(arr.length / 2)
  const left = mergeSort(arr.slice(0, mid))
  const right = mergeSort(arr.slice(mid))

  return merge(left, right)
}

// Divides log(n) times, each level does n work
// This is the "sweet spot" for sorting`,
        explanation: 'Divide and conquer - split log(n) times, n work each level'
      },
      {
        title: 'Space Complexity',
        code: `// O(1) space - in-place
function reverseInPlace(arr) {
  let left = 0, right = arr.length - 1
  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]]
    left++
    right--
  }
}

// O(n) space - creates new array
function reverseCopy(arr) {
  const result = []
  for (let i = arr.length - 1; i >= 0; i--) {
    result.push(arr[i])
  }
  return result
}`,
        explanation: 'Space complexity tracks additional memory used'
      },
    ],
    commonMistakes: [
      'Confusing O(n) with exact number of operations',
      'Forgetting that O(1) doesn\'t mean "fast", just constant',
      'Not considering space complexity alongside time',
      'Thinking O(log n) is always better (constants matter for small n)',
    ],
    interviewTips: [
      'Always state time AND space complexity of your solution',
      'Know complexities of common operations (array access, hash lookup, sort)',
      'Be ready to explain WHY something is O(n²) vs O(n)',
      'Mention trade-offs: "I can do O(n) time with O(n) space, or O(n²) time with O(1) space"',
    ],
  },
  {
    id: 'binary-system',
    title: 'Binary System & Bit Manipulation',
    category: 'foundations',
    difficulty: 'beginner',
    description: 'Computers store everything as bits. Understanding binary representation, signed numbers, and bitwise operations lets you reason about memory, speed, and many interview tricks like XOR cancellation or power-of-two checks.',
    shortDescription: 'Base-2 representation and bitwise operations',
    keyPoints: [
      'Binary is base-2: each bit is a power of two (1, 2, 4, 8, ...)',
      'A byte is 8 bits; unsigned 8-bit range is 0-255',
      'Signed integers typically use two\'s complement (highest bit is the sign)',
      'Bitwise ops (& | ^ ~) operate per-bit, not per-number',
      'Shifts (<< >> >>>) move bits; in JS, bitwise ops use 32-bit signed integers',
      'Bit masks let you set, clear, toggle, or test specific bits quickly',
    ],
    examples: [
      {
        title: 'Decimal to Binary (manual)',
        code: `function toBinary(n) {
  let bits = ''
  let value = n

  while (value > 0) {
    bits = (value & 1) + bits
    value = value >> 1
  }

  return bits || '0'
}

const n = 13
console.log(n, '->', toBinary(n)) // 1101`,
        explanation: 'Repeatedly divide by 2 and record remainders (LSB first)'
      },
      {
        title: 'Bitwise AND / OR / XOR',
        code: `const a = 12 // 1100
const b = 10 // 1010

console.log(a & b) // 8  (1000)
console.log(a | b) // 14 (1110)
console.log(a ^ b) // 6  (0110)`,
        explanation: 'Each operator combines bits independently'
      },
      {
        title: 'Bit Masks (set, clear, toggle, test)',
        code: `const READ = 1 << 0  // 0001
const WRITE = 1 << 1 // 0010
const EXEC = 1 << 2  // 0100

let perms = 0
perms = perms | READ   // set READ
perms = perms | EXEC   // set EXEC

const canWrite = (perms & WRITE) !== 0
perms = perms ^ EXEC   // toggle EXEC`,
        explanation: 'Masks make flag operations O(1) and very compact'
      },
    ],
    commonMistakes: [
      'Forgetting JS bitwise ops are 32-bit signed (values may overflow)',
      'Confusing XOR (^) with OR (|)',
      'Using >> instead of >>> when you need zero-fill right shift',
      'Shifting by more than 31 bits (JS masks the shift count)',
    ],
    interviewTips: [
      'Use n & (n - 1) to clear the lowest set bit',
      'XOR cancels pairs: a ^ a = 0, a ^ 0 = a',
      'Bitmask enumeration: 0..(1 << n) - 1 can represent subsets',
      'Mention two\'s complement when negatives appear in bit problems',
    ],
    relatedProblems: [
      'single-number',
      'number-of-1-bits',
      'counting-bits',
      'power-of-two',
      'bitwise-and-range',
      'maximum-xor',
    ],
  },

  // ============================================================================
  // DATA STRUCTURES
  // ============================================================================
  {
    id: 'arrays',
    title: 'Arrays',
    category: 'data-structures',
    difficulty: 'beginner',
    description: 'Arrays store elements in contiguous memory locations, allowing O(1) access by index. They\'re the most fundamental data structure and the building block for many others. Understanding when arrays excel and when they struggle is crucial for algorithm design.',
    shortDescription: 'Contiguous memory, indexed access',
    keyPoints: [
      'Elements stored in contiguous (sequential) memory',
      'O(1) access by index - direct memory address calculation',
      'O(n) search in unsorted array - must check each element',
      'O(n) insert/delete in middle - must shift elements',
      'Fixed size in most languages (JS arrays are dynamic)',
      'Great cache performance due to memory locality',
    ],
    examples: [
      {
        title: 'Array Access O(1)',
        code: `const arr = [10, 20, 30, 40, 50]

// Direct access by index
arr[0]  // 10 - instant
arr[2]  // 30 - instant
arr[4]  // 50 - instant

// Why O(1)? Memory address calculation:
// address = baseAddress + (index × elementSize)
// No iteration needed!`,
        explanation: 'Index gives direct memory location'
      },
      {
        title: 'Array Search O(n)',
        code: `const arr = [10, 20, 30, 40, 50]

// Find index of value 30
function indexOf(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i
  }
  return -1
}

indexOf(arr, 30)  // Returns 2
indexOf(arr, 99)  // Returns -1

// Must check elements one by one
// Worst case: check ALL elements`,
        explanation: 'Must scan until found or end'
      },
      {
        title: 'Insert at End O(1)*',
        code: `const arr = [10, 20, 30]

// Append to end - usually O(1)
arr.push(40)  // [10, 20, 30, 40]

// * Amortized O(1) because:
// - Usually just adds to next slot
// - Occasionally needs to resize (copy all)
// - Resize doubles capacity, so rare

// JS handles this automatically
// In other languages, you manage capacity`,
        explanation: 'Fast append, occasional resize'
      },
      {
        title: 'Insert in Middle O(n)',
        code: `const arr = [10, 20, 40, 50]

// Insert 30 at index 2
arr.splice(2, 0, 30)
// Result: [10, 20, 30, 40, 50]

// What happened internally:
// 1. Shift 40 to index 3
// 2. Shift 50 to index 4
// 3. Place 30 at index 2

// Must shift all elements after insertion point
// Inserting at index 0 is O(n) - shifts everything!`,
        explanation: 'Must shift all elements after'
      },
      {
        title: 'Delete from Middle O(n)',
        code: `const arr = [10, 20, 30, 40, 50]

// Remove element at index 2
arr.splice(2, 1)
// Result: [10, 20, 40, 50]

// What happened internally:
// 1. Remove 30
// 2. Shift 40 to index 2
// 3. Shift 50 to index 3

// Same issue as insert - must close the gap`,
        explanation: 'Must shift elements to fill gap'
      },
      {
        title: 'When to Use Arrays',
        code: `// ✅ GOOD for arrays:
// - Need random access by index
// - Mostly reading, few writes
// - Iterating in order
// - Fixed or known size

// ❌ AVOID arrays when:
// - Frequent insert/delete in middle
// - Frequent insert/delete at beginning
// - Unknown/highly variable size
// - Need fast search (use hash table)

// Common array operations:
arr.push(x)      // O(1) - add to end
arr.pop()        // O(1) - remove from end
arr.shift()      // O(n) - remove from start
arr.unshift(x)   // O(n) - add to start
arr[i]           // O(1) - access
arr.includes(x)  // O(n) - search`,
        explanation: 'Know when arrays are the right choice'
      },
    ],
    complexity: {
      average: {
        'Access': 'O(1)',
        'Search': 'O(n)',
        'Insert (end)': 'O(1)',
        'Insert (middle)': 'O(n)',
        'Delete (end)': 'O(1)',
        'Delete (middle)': 'O(n)',
      },
    },
    commonMistakes: [
      'Using array.shift() in a loop (O(n²) total)',
      'Not considering that splice is O(n)',
      'Assuming JS arrays work like other languages (they\'re actually objects)',
      'Using arrays when a hash map would give O(1) lookup',
    ],
    interviewTips: [
      'Arrays are great when you need index-based access',
      'For frequent front operations, consider a deque or linked list',
      'Sorted arrays enable O(log n) binary search',
      'Two-pointer techniques often work well on sorted arrays',
    ],
    relatedProblems: ['two-sum', 'contains-duplicate', 'valid-anagram'],
  },

  {
    id: 'hash-tables',
    title: 'Hash Tables',
    category: 'data-structures',
    difficulty: 'beginner',
    description: 'Hash tables (also called hash maps or dictionaries) store key-value pairs with O(1) average lookup, insert, and delete. They use a hash function to convert keys into array indices. In JavaScript, both Objects and Maps are implemented as hash tables.',
    shortDescription: 'O(1) key-value lookup',
    keyPoints: [
      'Hash function converts key → array index',
      'O(1) average for get, set, delete',
      'Collisions: when two keys hash to same index',
      'Collision handling: chaining (linked lists) or open addressing',
      'Load factor = entries / buckets (affects performance)',
      'JS Object and Map are both hash tables',
    ],
    examples: [
      {
        title: 'How Hashing Works',
        code: `// Simplified hash function
function hash(key, tableSize) {
  let hash = 0
  for (let char of String(key)) {
    hash += char.charCodeAt(0)
  }
  return hash % tableSize
}

// Example:
hash("cat", 10)  // Maybe returns 5
hash("dog", 10)  // Maybe returns 8
hash("tac", 10)  // Maybe returns 5 (collision!)

// Real hash functions are more sophisticated
// to distribute keys evenly`,
        explanation: 'Hash function maps key to array index'
      },
      {
        title: 'Using Map in JavaScript',
        code: `const map = new Map()

// Set key-value pairs - O(1)
map.set('apple', 5)
map.set('banana', 3)
map.set('orange', 8)

// Get value by key - O(1)
map.get('apple')    // 5
map.get('grape')    // undefined

// Check if key exists - O(1)
map.has('banana')   // true

// Delete by key - O(1)
map.delete('orange')

// Size
map.size            // 2`,
        explanation: 'Map provides clean key-value API'
      },
      {
        title: 'Using Object as Hash Map',
        code: `const obj = {}

// Set values - O(1)
obj['apple'] = 5
obj.banana = 3

// Get values - O(1)
obj['apple']    // 5
obj.banana      // 3

// Check existence - O(1)
'apple' in obj           // true
obj.hasOwnProperty('x')  // false

// Delete - O(1)
delete obj.apple

// ⚠️ Object keys are always strings!
obj[1] = 'one'
obj['1']  // 'one' (same key!)`,
        explanation: 'Objects work as hash maps with string keys'
      },
      {
        title: 'Frequency Counter Pattern',
        code: `// Count occurrences of each element
function frequencyCounter(arr) {
  const freq = new Map()

  for (const item of arr) {
    freq.set(item, (freq.get(item) || 0) + 1)
  }

  return freq
}

frequencyCounter(['a', 'b', 'a', 'c', 'a', 'b'])
// Map { 'a' => 3, 'b' => 2, 'c' => 1 }

// This pattern is O(n) - one pass!
// Without hash map: O(n²) with nested loops`,
        explanation: 'Hash maps enable O(n) frequency counting'
      },
      {
        title: 'Two Sum with Hash Map',
        code: `function twoSum(nums, target) {
  const seen = new Map()  // value → index

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i]

    if (seen.has(complement)) {
      return [seen.get(complement), i]
    }

    seen.set(nums[i], i)
  }

  return []
}

// Without hash map: O(n²) - check all pairs
// With hash map: O(n) - one pass!`,
        explanation: 'Hash map turns O(n²) into O(n)'
      },
      {
        title: 'Map vs Object',
        code: `// Use Map when:
// - Keys aren't strings (numbers, objects)
// - Need to preserve insertion order
// - Frequently add/remove keys
// - Need .size property

const map = new Map()
map.set(1, 'number key')      // Works!
map.set({id: 1}, 'object key') // Works!

// Use Object when:
// - Keys are strings
// - Need JSON serialization
// - Simple key-value storage

const obj = {}
obj[1] = 'becomes string "1"'
// obj[{id:1}] = 'becomes "[object Object]"'`,
        explanation: 'Map is more flexible, Object is simpler'
      },
    ],
    complexity: {
      average: {
        'Get': 'O(1)',
        'Set': 'O(1)',
        'Delete': 'O(1)',
        'Has': 'O(1)',
      },
      worst: {
        'Get': 'O(n)',
        'Set': 'O(n)',
        'Delete': 'O(n)',
        'Has': 'O(n)',
      },
    },
    commonMistakes: [
      'Forgetting that Object keys are always strings',
      'Using objects as keys in regular Object (use Map instead)',
      'Not handling missing keys (check with has() or in)',
      'Assuming hash map maintains insertion order (Map does, Object mostly does)',
    ],
    interviewTips: [
      'Hash maps often turn O(n²) brute force into O(n)',
      'When you need "have I seen this before?", think hash set',
      'When you need "what was the index of X?", think hash map',
      'Trading space for time is a common interview pattern',
    ],
    relatedProblems: ['two-sum', 'valid-anagram', 'contains-duplicate', 'group-anagrams'],
  },

  {
    id: 'stacks',
    title: 'Stacks',
    category: 'data-structures',
    difficulty: 'beginner',
    description: 'A stack is a Last-In-First-Out (LIFO) data structure. Think of a stack of plates - you add to the top and remove from the top. Stacks are used for function calls, undo operations, parsing expressions, and many algorithms.',
    shortDescription: 'Last-In-First-Out (LIFO)',
    keyPoints: [
      'LIFO: Last In, First Out',
      'Two main operations: push (add to top), pop (remove from top)',
      'peek: look at top without removing',
      'JS arrays work as stacks with push/pop',
      'The call stack is literally a stack!',
      'Used for: matching brackets, undo/redo, DFS, expression evaluation',
    ],
    examples: [
      {
        title: 'Stack Operations',
        code: `// Using array as stack
const stack = []

// Push - add to top - O(1)
stack.push(1)  // [1]
stack.push(2)  // [1, 2]
stack.push(3)  // [1, 2, 3]

// Pop - remove from top - O(1)
stack.pop()    // Returns 3, stack is [1, 2]
stack.pop()    // Returns 2, stack is [1]

// Peek - look at top - O(1)
stack[stack.length - 1]  // 1 (doesn't remove)

// Check if empty
stack.length === 0  // false`,
        explanation: 'Arrays have built-in stack operations'
      },
      {
        title: 'The Call Stack',
        code: `function a() {
  console.log('a start')
  b()
  console.log('a end')
}

function b() {
  console.log('b start')
  c()
  console.log('b end')
}

function c() {
  console.log('c')
}

a()
// Call stack grows:    [a] → [a, b] → [a, b, c]
// Then unwinds:        [a, b, c] → [a, b] → [a] → []

// Output:
// a start → b start → c → b end → a end`,
        explanation: 'Function calls use a stack internally'
      },
      {
        title: 'Valid Parentheses',
        code: `function isValid(s) {
  const stack = []
  const pairs = {
    ')': '(',
    ']': '[',
    '}': '{'
  }

  for (const char of s) {
    if ('([{'.includes(char)) {
      // Opening bracket - push to stack
      stack.push(char)
    } else {
      // Closing bracket - must match top
      if (stack.pop() !== pairs[char]) {
        return false
      }
    }
  }

  return stack.length === 0
}

isValid('([{}])')  // true
isValid('([)]')    // false
isValid('((')      // false`,
        explanation: 'Classic stack problem - matching pairs'
      },
      {
        title: 'Reverse a String',
        code: `function reverse(str) {
  const stack = []

  // Push all characters
  for (const char of str) {
    stack.push(char)
  }

  // Pop to build reversed string
  let result = ''
  while (stack.length > 0) {
    result += stack.pop()
  }

  return result
}

reverse('hello')  // 'olleh'

// LIFO naturally reverses order!`,
        explanation: 'LIFO order reverses sequence'
      },
      {
        title: 'Evaluate Reverse Polish Notation',
        code: `function evalRPN(tokens) {
  const stack = []

  for (const token of tokens) {
    if ('+-*/'.includes(token)) {
      const b = stack.pop()
      const a = stack.pop()

      switch (token) {
        case '+': stack.push(a + b); break
        case '-': stack.push(a - b); break
        case '*': stack.push(a * b); break
        case '/': stack.push(Math.trunc(a / b)); break
      }
    } else {
      stack.push(Number(token))
    }
  }

  return stack[0]
}

evalRPN(['2', '3', '+', '4', '*'])  // (2+3)*4 = 20`,
        explanation: 'Stack handles operator precedence naturally'
      },
      {
        title: 'Min Stack',
        code: `class MinStack {
  constructor() {
    this.stack = []
    this.minStack = []  // Track minimums
  }

  push(val) {
    this.stack.push(val)
    // Push to minStack if empty or <= current min
    if (this.minStack.length === 0 ||
        val <= this.getMin()) {
      this.minStack.push(val)
    }
  }

  pop() {
    const val = this.stack.pop()
    if (val === this.getMin()) {
      this.minStack.pop()
    }
  }

  getMin() {
    return this.minStack[this.minStack.length - 1]
  }
}

// All operations O(1)!`,
        explanation: 'Auxiliary stack tracks minimum at each state'
      },
    ],
    complexity: {
      average: {
        'Push': 'O(1)',
        'Pop': 'O(1)',
        'Peek': 'O(1)',
        'isEmpty': 'O(1)',
      },
    },
    commonMistakes: [
      'Popping from empty stack (check isEmpty first)',
      'Using shift/unshift instead of push/pop (O(n) vs O(1))',
      'Forgetting stack is LIFO when order matters',
      'Not recognizing stack problems (look for "matching", "nested", "undo")',
    ],
    interviewTips: [
      'When you see nested structures or matching pairs, think stack',
      'DFS (depth-first search) can use explicit stack or recursion',
      'Monotonic stack solves "next greater element" problems',
      'Stack + queue can simulate other data structures',
    ],
    relatedProblems: [
      'valid-parentheses',
      'min-stack',
      'evaluate-rpn',
      'daily-temperatures',
      'next-greater-element-i',
      'largest-rectangle-in-histogram',
      'car-fleet',
      'simplify-path',
      'remove-k-digits',
      'decode-string',
      'basic-calculator-ii',
    ],
  },

  {
    id: 'queues',
    title: 'Queues',
    category: 'data-structures',
    difficulty: 'beginner',
    description: 'A queue is a First-In-First-Out (FIFO) data structure. Think of a line at a store - first person in line is first served. Queues are essential for BFS, scheduling, buffering, and any scenario where order of arrival matters.',
    shortDescription: 'First-In-First-Out (FIFO)',
    keyPoints: [
      'FIFO: First In, First Out',
      'enqueue: add to back, dequeue: remove from front',
      'JS arrays can work as queues but shift() is O(n)',
      'For performance, use a proper Queue class or linked list',
      'BFS (Breadth-First Search) uses a queue',
      'Used for: level-order traversal, scheduling, buffering',
    ],
    examples: [
      {
        title: 'Queue Operations (Simple)',
        code: `// Using array as queue (simple but not optimal)
const queue = []

// Enqueue - add to back - O(1)
queue.push(1)  // [1]
queue.push(2)  // [1, 2]
queue.push(3)  // [1, 2, 3]

// Dequeue - remove from front - O(n)!
queue.shift()  // Returns 1, queue is [2, 3]
queue.shift()  // Returns 2, queue is [3]

// Peek front
queue[0]  // 3

// ⚠️ shift() is O(n) - not ideal for large queues`,
        explanation: 'Arrays work but shift() is slow'
      },
      {
        title: 'Efficient Queue Class',
        code: `class Queue {
  constructor() {
    this.items = {}
    this.head = 0
    this.tail = 0
  }

  enqueue(item) {
    this.items[this.tail] = item
    this.tail++
  }

  dequeue() {
    if (this.isEmpty()) return undefined
    const item = this.items[this.head]
    delete this.items[this.head]
    this.head++
    return item
  }

  peek() {
    return this.items[this.head]
  }

  isEmpty() {
    return this.tail === this.head
  }

  size() {
    return this.tail - this.head
  }
}

// All operations O(1)!`,
        explanation: 'Object-based queue avoids shifting'
      },
      {
        title: 'BFS Tree Traversal',
        code: `function levelOrder(root) {
  if (!root) return []

  const result = []
  const queue = [root]

  while (queue.length > 0) {
    const levelSize = queue.length
    const level = []

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()
      level.push(node.val)

      if (node.left) queue.push(node.left)
      if (node.right) queue.push(node.right)
    }

    result.push(level)
  }

  return result
}

// Tree:     1
//          / \\
//         2   3
// Output: [[1], [2, 3]]`,
        explanation: 'Queue enables level-by-level processing'
      },
      {
        title: 'BFS Shortest Path',
        code: `function shortestPath(graph, start, end) {
  const queue = [[start, 0]]  // [node, distance]
  const visited = new Set([start])

  while (queue.length > 0) {
    const [node, dist] = queue.shift()

    if (node === end) return dist

    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor)
        queue.push([neighbor, dist + 1])
      }
    }
  }

  return -1  // No path found
}

// BFS finds shortest path in unweighted graphs
// because it explores level by level`,
        explanation: 'BFS guarantees shortest path in unweighted graph'
      },
      {
        title: 'Number of Islands (BFS)',
        code: `function numIslands(grid) {
  let count = 0

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === '1') {
        count++
        bfs(grid, i, j)  // Mark entire island
      }
    }
  }

  return count
}

function bfs(grid, r, c) {
  const queue = [[r, c]]
  grid[r][c] = '0'  // Mark visited

  while (queue.length > 0) {
    const [row, col] = queue.shift()
    const dirs = [[1,0], [-1,0], [0,1], [0,-1]]

    for (const [dr, dc] of dirs) {
      const nr = row + dr, nc = col + dc
      if (nr >= 0 && nr < grid.length &&
          nc >= 0 && nc < grid[0].length &&
          grid[nr][nc] === '1') {
        grid[nr][nc] = '0'
        queue.push([nr, nc])
      }
    }
  }
}`,
        explanation: 'BFS explores all connected cells'
      },
      {
        title: 'Stack vs Queue',
        code: `// STACK (LIFO) - Last In, First Out
// Like a stack of plates
const stack = []
stack.push(1)  // [1]
stack.push(2)  // [1, 2]
stack.pop()    // 2 (last added)

// Use for: DFS, recursion, undo, matching

// QUEUE (FIFO) - First In, First Out
// Like a line at a store
const queue = []
queue.push(1)  // [1]
queue.push(2)  // [1, 2]
queue.shift()  // 1 (first added)

// Use for: BFS, scheduling, buffering

// Easy to remember:
// Stack = DFS = go DEEP first
// Queue = BFS = go WIDE first`,
        explanation: 'Stack for DFS, Queue for BFS'
      },
    ],
    complexity: {
      average: {
        'Enqueue': 'O(1)',
        'Dequeue': 'O(1)*',
        'Peek': 'O(1)',
        'isEmpty': 'O(1)',
      },
    },
    commonMistakes: [
      'Using array.shift() in hot path (O(n) each call)',
      'Confusing BFS (queue) with DFS (stack)',
      'Not tracking visited nodes in graph BFS (infinite loop)',
      'Forgetting queue for shortest path problems',
    ],
    interviewTips: [
      'BFS = Queue, DFS = Stack (or recursion)',
      'BFS finds shortest path in UNWEIGHTED graphs',
      'Level-order tree traversal = BFS with a queue',
      'For large queues, implement O(1) dequeue',
    ],
    relatedProblems: ['number-of-islands', 'binary-tree-level-order'],
  },

  {
    id: 'linked-lists',
    title: 'Linked Lists',
    category: 'data-structures',
    difficulty: 'beginner',
    description: 'A linked list is a sequence of nodes where each node contains data and a pointer to the next node. Unlike arrays, linked lists don\'t require contiguous memory, making insertions and deletions efficient. However, they sacrifice random access.',
    shortDescription: 'Nodes connected by pointers',
    keyPoints: [
      'Each node has: data + pointer to next node',
      'No contiguous memory needed - nodes can be anywhere',
      'O(1) insert/delete if you have the node reference',
      'O(n) access - must traverse from head',
      'Types: singly linked, doubly linked, circular',
      'Trade-off: fast insert/delete vs slow random access',
    ],
    examples: [
      {
        title: 'Node Structure',
        code: `// Singly Linked List Node
class ListNode {
  constructor(val) {
    this.val = val
    this.next = null
  }
}

// Create a linked list: 1 → 2 → 3
const head = new ListNode(1)
head.next = new ListNode(2)
head.next.next = new ListNode(3)

// Traverse the list
let current = head
while (current !== null) {
  console.log(current.val)  // 1, 2, 3
  current = current.next
}`,
        explanation: 'Nodes linked by next pointers'
      },
      {
        title: 'Insert at Head O(1)',
        code: `function insertAtHead(head, val) {
  const newNode = new ListNode(val)
  newNode.next = head
  return newNode  // New head
}

// Before: 1 → 2 → 3
// insertAtHead(head, 0)
// After: 0 → 1 → 2 → 3

// O(1) - just update pointers!
// Compare to array unshift which is O(n)`,
        explanation: 'Insert at head is always O(1)'
      },
      {
        title: 'Insert at Position O(n)',
        code: `function insertAt(head, val, position) {
  const newNode = new ListNode(val)

  if (position === 0) {
    newNode.next = head
    return newNode
  }

  let current = head
  for (let i = 0; i < position - 1; i++) {
    if (!current) return head
    current = current.next
  }

  newNode.next = current.next
  current.next = newNode
  return head
}

// Must traverse to find position: O(n)
// But the actual insertion is O(1)`,
        explanation: 'Finding position is O(n), insertion is O(1)'
      },
      {
        title: 'Reverse Linked List',
        code: `function reverseList(head) {
  let prev = null
  let current = head

  while (current !== null) {
    const next = current.next  // Save next
    current.next = prev        // Reverse pointer
    prev = current             // Move prev forward
    current = next             // Move current forward
  }

  return prev  // New head
}

// Before: 1 → 2 → 3 → null
// After:  null ← 1 ← 2 ← 3
// Return: 3 → 2 → 1 → null

// Classic interview question!`,
        explanation: 'Reverse by flipping pointers one by one'
      },
      {
        title: 'Detect Cycle (Floyd\'s)',
        code: `function hasCycle(head) {
  let slow = head
  let fast = head

  while (fast !== null && fast.next !== null) {
    slow = slow.next        // Move 1 step
    fast = fast.next.next   // Move 2 steps

    if (slow === fast) {
      return true  // They met - cycle exists!
    }
  }

  return false  // Fast reached end - no cycle
}

// Tortoise and Hare algorithm
// If there's a cycle, fast will "lap" slow
// O(n) time, O(1) space!`,
        explanation: 'Fast pointer catches slow if cycle exists'
      },
      {
        title: 'Find Middle Node',
        code: `function middleNode(head) {
  let slow = head
  let fast = head

  while (fast !== null && fast.next !== null) {
    slow = slow.next
    fast = fast.next.next
  }

  return slow
}

// 1 → 2 → 3 → 4 → 5
// slow: 1 → 2 → 3 (stops here)
// fast: 1 → 3 → 5 → null

// When fast reaches end,
// slow is at middle!`,
        explanation: 'Fast moves 2x speed, slow ends up at middle'
      },
    ],
    complexity: {
      average: {
        'Access': 'O(n)',
        'Search': 'O(n)',
        'Insert (at head)': 'O(1)',
        'Insert (at position)': 'O(n)',
        'Delete (at head)': 'O(1)',
        'Delete (at position)': 'O(n)',
      },
    },
    commonMistakes: [
      'Losing reference to head (always keep track!)',
      'Not handling null/empty list edge cases',
      'Creating cycles accidentally during manipulation',
      'Forgetting to update both prev and next in doubly linked',
    ],
    interviewTips: [
      'Draw the pointers! Visualize before coding',
      'Use dummy head node to simplify edge cases',
      'Fast/slow pointer technique solves many problems',
      'Know trade-offs vs arrays: insert O(1) vs access O(n)',
    ],
    relatedProblems: [
      'reverse-linked-list',
      'merge-two-sorted-lists',
      'linked-list-cycle',
      'middle-of-linked-list',
      'remove-nth-from-end',
      'add-two-numbers',
      'reorder-list',
      'swap-nodes-in-pairs',
      'copy-list-random-pointer',
      'reverse-nodes-k-group',
      'merge-k-sorted-lists',
      'lru-cache',
    ],
    learningPath: [
      {
        stage: 'Foundation',
        problemIds: ['reverse-linked-list', 'merge-two-sorted-lists'],
      },
      {
        stage: 'Runner Technique',
        problemIds: ['linked-list-cycle', 'middle-of-linked-list', 'remove-nth-from-end'],
      },
      {
        stage: 'Construction',
        problemIds: ['add-two-numbers', 'reorder-list', 'swap-nodes-in-pairs'],
      },
      {
        stage: 'Advanced',
        problemIds: ['copy-list-random-pointer', 'reverse-nodes-k-group', 'merge-k-sorted-lists', 'lru-cache'],
      },
    ],
  },
  // ============================================================================
  // ALGORITHMS
  // ============================================================================
  {
    id: 'sorting-algorithms',
    title: 'Sorting Algorithms',
    category: 'algorithms',
    difficulty: 'intermediate',
    description: 'Sorting algorithms arrange elements in a specific order. Understanding sorting is essential because it\'s a preprocessing step for many problems, and partition logic from QuickSort appears in disguised forms across FAANG interviews. Know the tradeoffs: stability, in-place vs extra space, and when comparison-based sorts hit their O(n log n) lower bound.',
    shortDescription: 'Arranging elements efficiently',
    keyPoints: [
      'Comparison sorts cannot beat O(n log n) average case',
      'Stable sort preserves relative order of equal elements',
      'In-place sort uses O(1) extra space (QuickSort, HeapSort)',
      'Merge Sort: O(n log n) guaranteed, stable, but O(n) space',
      'QuickSort: O(n log n) average, O(n²) worst, in-place, unstable',
      'Partition logic from QuickSort is reused in many interview problems',
      'Non-comparison sorts (Counting, Radix, Bucket) achieve O(n) when values are bounded',
      'JavaScript Array.sort() uses TimSort — O(n log n), stable',
    ],
    examples: [
      {
        title: 'Bubble Sort — O(n²)',
        code: `function bubbleSort(arr) {
  const n = arr.length

  for (let i = 0; i < n - 1; i++) {
    let swapped = false

    for (let j = 0; j < n - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        swapped = true
      }
    }

    if (!swapped) break
  }

  return arr
}

bubbleSort([64, 34, 25, 12, 22, 11, 90])
// After each pass, largest unsorted element
// "bubbles" to its correct position`,
        explanation: 'Simple but slow. Good for teaching; never use in production. Early exit if no swaps makes best case O(n) for nearly sorted arrays.',
      },
      {
        title: 'Merge Sort — O(n log n)',
        code: `function mergeSort(arr) {
  if (arr.length <= 1) return arr

  const mid = Math.floor(arr.length / 2)
  const left = mergeSort(arr.slice(0, mid))
  const right = mergeSort(arr.slice(mid))

  return merge(left, right)
}

function merge(left, right) {
  const result = []
  let i = 0, j = 0

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++])
    } else {
      result.push(right[j++])
    }
  }

  return [...result, ...left.slice(i), ...right.slice(j)]
}

mergeSort([38, 27, 43, 3, 9, 82, 10])
// Divide → sort halves → merge back`,
        explanation: 'Divide-and-conquer. Always O(n log n). Stable. Uses O(n) extra space. The merge step is the key — it combines two sorted arrays in linear time.',
      },
      {
        title: 'QuickSort — Partition Logic',
        code: `function quickSort(arr, lo = 0, hi = arr.length - 1) {
  if (lo >= hi) return arr

  const pivot = partition(arr, lo, hi)
  quickSort(arr, lo, pivot - 1)
  quickSort(arr, pivot + 1, hi)

  return arr
}

function partition(arr, lo, hi) {
  const pivot = arr[hi]
  let i = lo

  for (let j = lo; j < hi; j++) {
    if (arr[j] < pivot) {
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
      i++
    }
  }

  ;[arr[i], arr[hi]] = [arr[hi], arr[i]]
  return i
}

quickSort([10, 80, 30, 90, 40, 50, 70])
// Partition places pivot in correct position
// Elements left of pivot are smaller
// Elements right of pivot are larger`,
        explanation: 'In-place, O(n log n) average. The partition function is the star — it appears in QuickSelect (Kth largest), Dutch Flag (sort colors), and many FAANG problems.',
      },
      {
        title: 'Counting Sort — O(n + k)',
        code: `function countingSort(arr) {
  const max = Math.max(...arr)
  const count = new Array(max + 1).fill(0)

  for (const num of arr) {
    count[num]++
  }

  const result = []
  for (let i = 0; i <= max; i++) {
    while (count[i] > 0) {
      result.push(i)
      count[i]--
    }
  }

  return result
}

countingSort([4, 2, 2, 8, 3, 3, 1])
// Not comparison-based — counts occurrences
// O(n + k) where k is the range of values`,
        explanation: 'When values are bounded (e.g., ages 0-150, grades 0-100), counting sort beats O(n log n). This same idea powers bucket sort and Top K Frequent Elements.',
      },
    ],
    complexity: {
      best: {
        'Bubble Sort': 'O(n)',
        'Merge Sort': 'O(n log n)',
        'QuickSort': 'O(n log n)',
        'Counting Sort': 'O(n + k)',
      },
      average: {
        'Bubble Sort': 'O(n²)',
        'Merge Sort': 'O(n log n)',
        'QuickSort': 'O(n log n)',
        'Counting Sort': 'O(n + k)',
      },
      worst: {
        'Bubble Sort': 'O(n²)',
        'Merge Sort': 'O(n log n)',
        'QuickSort': 'O(n²)',
        'Counting Sort': 'O(n + k)',
      },
    },
    commonMistakes: [
      'Using bubble sort in production (always O(n²) average)',
      'Forgetting QuickSort worst case is O(n²) on sorted input with bad pivot',
      'Confusing stable vs unstable — matters when sorting objects by multiple keys',
      'Not recognizing when a problem needs sorting as preprocessing (intervals, custom order)',
      'Implementing sort from scratch when Array.sort() with custom comparator suffices',
    ],
    interviewTips: [
      'You rarely implement sort from scratch — but you MUST understand partition logic',
      'When you see intervals, pairs, or "closest/largest" — think sort first',
      'Custom comparators: (a, b) => a - b ascending, (a, b) => b - a descending',
      'Partition logic solves: Kth largest (QuickSelect), Sort Colors, Sort Array by Parity',
      'Know TimSort: JS/Python built-in, stable, O(n log n), uses merge + insertion',
    ],
    relatedProblems: [
      'bubble-sort',
      'insertion-sort',
      'merge-sort',
      'quick-sort',
      'merge-intervals',
      'meeting-rooms',
      'meeting-rooms-ii',
      'largest-number',
      'sort-characters-by-frequency',
      'sort-colors',
      'kth-largest-element',
      'non-overlapping-intervals',
    ],
    learningPath: [
      {
        stage: 'Foundation',
        problemIds: ['bubble-sort', 'insertion-sort', 'merge-sort'],
      },
      {
        stage: 'Efficient Sorts',
        problemIds: ['quick-sort', 'sort-colors'],
      },
      {
        stage: 'Sort as Tool',
        problemIds: ['merge-intervals', 'meeting-rooms', 'largest-number'],
      },
      {
        stage: 'Advanced',
        problemIds: ['kth-largest-element', 'meeting-rooms-ii', 'non-overlapping-intervals'],
      },
    ],
  },
]

export const dsaConceptCategories = [
  { id: 'foundations', name: 'Foundations', description: 'Core concepts every developer needs' },
  { id: 'data-structures', name: 'Data Structures', description: 'Building blocks for algorithms' },
  { id: 'algorithms', name: 'Algorithms', description: 'Common algorithm techniques' },
  { id: 'patterns', name: 'Patterns', description: 'Reusable problem-solving patterns' },
]

// Related concepts mapping
const relatedDSAConceptsMap: Record<string, string[]> = {
  'big-o-notation': ['binary-system', 'arrays', 'hash-tables', 'linked-lists'],
  'binary-system': ['big-o-notation', 'arrays', 'hash-tables'],
  'arrays': ['big-o-notation', 'hash-tables', 'stacks', 'queues', 'sorting-algorithms'],
  'hash-tables': ['big-o-notation', 'arrays'],
  'stacks': ['arrays', 'queues', 'linked-lists'],
  'queues': ['arrays', 'stacks', 'linked-lists'],
  'linked-lists': ['arrays', 'stacks', 'queues'],
  'sorting-algorithms': ['arrays', 'big-o-notation', 'linked-lists'],
}

export function getDSAConceptById(id: string): DSAConcept | undefined {
  return dsaConcepts.find(c => c.id === id)
}

export function getDSAConceptsByCategory(category: string): DSAConcept[] {
  return dsaConcepts.filter(c => c.category === category)
}

export function getRelatedDSAConcepts(id: string): DSAConcept[] {
  const relatedIds = relatedDSAConceptsMap[id] || []
  return relatedIds
    .map(relatedId => dsaConcepts.find(c => c.id === relatedId))
    .filter((c): c is DSAConcept => c !== undefined)
}
