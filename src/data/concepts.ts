// JavaScript Concepts - Interactive Learning Module

export interface ConceptExample {
  title: string
  code: string
  explanation: string
}

export interface Concept {
  id: string
  title: string
  icon: string
  category: 'fundamentals' | 'core' | 'advanced'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  description: string
  shortDescription: string
  keyPoints: string[]
  examples: ConceptExample[]
  commonMistakes?: string[]
  interviewTips?: string[]
}

export const concepts: Concept[] = [
  {
    id: 'hoisting',
    title: 'Hoisting',
    icon: '🎈',
    category: 'fundamentals',
    difficulty: 'beginner',
    description: 'Hoisting is JavaScript\'s default behavior of moving declarations to the top of their scope before code execution. Understanding hoisting helps you predict how variables and functions behave before they\'re defined in your code.',
    shortDescription: 'How JS moves declarations to the top',
    keyPoints: [
      'Variable declarations (var) are hoisted, but not their assignments',
      'Function declarations are fully hoisted (name + body)',
      'let and const are hoisted but stay in the "Temporal Dead Zone" until declared',
      'Function expressions are NOT hoisted like function declarations',
    ],
    examples: [
      {
        title: 'var hoisting',
        code: `console.log(x); // undefined (not error!)
var x = 5;
console.log(x); // 5

// JS sees it as:
// var x;
// console.log(x);
// x = 5;`,
        explanation: 'The declaration `var x` is hoisted to the top, but the assignment `= 5` stays in place. So x exists but is undefined when first logged.',
      },
      {
        title: 'let/const - Temporal Dead Zone',
        code: `console.log(y); // ReferenceError!
let y = 10;

// let/const ARE hoisted, but accessing
// them before declaration throws an error.
// This "danger zone" is called the TDZ.`,
        explanation: 'let and const are hoisted but remain uninitialized until the declaration is reached. Accessing them before that throws a ReferenceError.',
      },
      {
        title: 'Function Declaration vs Expression',
        code: `// This works - declarations are hoisted
sayHello(); // "Hello!"

function sayHello() {
  console.log("Hello!");
}

// This fails - expressions are NOT hoisted
sayBye(); // TypeError: sayBye is not a function

var sayBye = function() {
  console.log("Bye!");
};`,
        explanation: 'Function declarations are fully hoisted (you can call them before they appear). Function expressions follow variable hoisting rules - only the variable name is hoisted, not the function body.',
      },
    ],
    commonMistakes: [
      'Assuming let/const don\'t hoist (they do, but have TDZ)',
      'Using var in loops and expecting block scope',
      'Relying on hoisting instead of declaring variables at the top',
    ],
    interviewTips: [
      'Explain the difference between declaration and initialization',
      'Know what TDZ means and when it applies',
      'Be able to predict output of hoisting quiz questions',
    ],
  },
  {
    id: 'closures',
    title: 'Closures',
    icon: '🎒',
    category: 'core',
    difficulty: 'intermediate',
    description: 'A closure is a function that remembers the variables from its outer scope even after the outer function has returned. Think of it as a function carrying a "backpack" of variables wherever it goes.',
    shortDescription: 'Functions that remember their scope',
    keyPoints: [
      'A closure is created every time a function is created',
      'Inner functions have access to outer function variables',
      'The outer variables are captured by reference, not by value',
      'Closures enable data privacy and stateful functions',
    ],
    examples: [
      {
        title: 'Basic Closure',
        code: `function outer() {
  let count = 0;  // This variable is "closed over"

  return function inner() {
    count++;
    return count;
  };
}

const counter = outer();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3`,
        explanation: 'The inner function "remembers" the count variable from outer(), even after outer() has finished executing. Each call to counter() increments the same count.',
      },
      {
        title: 'Multiple Closures',
        code: `function createCounter(start) {
  let count = start;
  return function() {
    return count++;
  };
}

const counterA = createCounter(0);
const counterB = createCounter(100);

console.log(counterA()); // 0
console.log(counterA()); // 1
console.log(counterB()); // 100
console.log(counterB()); // 101`,
        explanation: 'Each call to createCounter() creates a NEW closure with its own separate count variable. counterA and counterB have independent state.',
      },
      {
        title: 'Data Privacy',
        code: `function createBankAccount(initial) {
  let balance = initial; // Private!

  return {
    deposit: function(amount) {
      balance += amount;
      return balance;
    },
    getBalance: function() {
      return balance;
    }
  };
}

const account = createBankAccount(100);
console.log(account.getBalance()); // 100
account.deposit(50);
console.log(account.getBalance()); // 150
console.log(account.balance); // undefined - can't access directly!`,
        explanation: 'Closures enable private variables. The balance variable cannot be accessed directly from outside - only through the methods that close over it.',
      },
    ],
    commonMistakes: [
      'Loop variable capture - all callbacks share the same variable',
      'Memory leaks from closures holding large objects',
      'Forgetting that closures capture by reference, not value',
    ],
    interviewTips: [
      'Use the "backpack" metaphor to explain closures',
      'Show practical uses: data privacy, function factories, memoization',
      'Be ready to solve the classic loop closure problem',
    ],
  },
  {
    id: 'this-keyword',
    title: 'The "this" Keyword',
    icon: '👆',
    category: 'core',
    difficulty: 'intermediate',
    description: 'The `this` keyword refers to the object that is executing the current function. Its value is determined by HOW a function is called, not where it\'s defined. There are 4 main rules that determine what `this` refers to.',
    shortDescription: 'Context binding rules',
    keyPoints: [
      'this is determined at call time, not definition time',
      'Rule 1: new binding - this = new instance',
      'Rule 2: Explicit binding (call/apply/bind) - this = specified object',
      'Rule 3: Implicit binding (obj.method()) - this = object left of dot',
      'Rule 4: Default binding - this = window (or undefined in strict mode)',
      'Arrow functions inherit this from enclosing scope',
    ],
    examples: [
      {
        title: 'Implicit Binding',
        code: `const person = {
  name: 'Alice',
  greet: function() {
    console.log('Hi, I am ' + this.name);
  }
};

person.greet(); // "Hi, I am Alice"
// this = person (object left of the dot)

const greetFn = person.greet;
greetFn(); // "Hi, I am undefined"
// this = window (no object left of dot)`,
        explanation: 'When calling obj.method(), `this` is the object to the left of the dot. When the method is called without an object, `this` falls back to the default binding.',
      },
      {
        title: 'Explicit Binding',
        code: `function introduce(greeting) {
  console.log(greeting + ', I am ' + this.name);
}

const bob = { name: 'Bob' };
const carol = { name: 'Carol' };

introduce.call(bob, 'Hello');   // "Hello, I am Bob"
introduce.apply(carol, ['Hi']); // "Hi, I am Carol"

const boundFn = introduce.bind(bob);
boundFn('Hey'); // "Hey, I am Bob"`,
        explanation: 'call() and apply() invoke the function with a specific `this`. bind() returns a new function with `this` permanently set.',
      },
      {
        title: 'Arrow Functions',
        code: `const obj = {
  name: 'Object',

  regular: function() {
    console.log('Regular:', this.name);
  },

  arrow: () => {
    console.log('Arrow:', this.name);
  },

  nested: function() {
    const inner = () => {
      console.log('Nested arrow:', this.name);
    };
    inner();
  }
};

obj.regular(); // "Regular: Object"
obj.arrow();   // "Arrow: undefined" (inherits from global)
obj.nested();  // "Nested arrow: Object" (inherits from nested)`,
        explanation: 'Arrow functions don\'t have their own `this`. They inherit `this` from the enclosing scope at definition time, not call time.',
      },
    ],
    commonMistakes: [
      'Losing this when passing methods as callbacks',
      'Using arrow functions as object methods',
      'Forgetting that this in nested functions is different',
    ],
    interviewTips: [
      'Know all 4 binding rules in order of precedence',
      'Explain why arrow functions are useful in callbacks',
      'Be able to fix "this" issues with bind or arrow functions',
    ],
  },
  {
    id: 'event-loop',
    title: 'Event Loop',
    icon: '🔄',
    category: 'advanced',
    difficulty: 'advanced',
    description: 'The Event Loop is how JavaScript handles asynchronous operations despite being single-threaded. It continuously checks if the call stack is empty, then moves callbacks from the task queues to the stack for execution.',
    shortDescription: 'How async JavaScript works',
    keyPoints: [
      'JavaScript is single-threaded (one call stack)',
      'Web APIs handle async operations (setTimeout, fetch, etc.)',
      'Task Queue (Macrotasks): setTimeout, setInterval, I/O',
      'Microtask Queue: Promises, queueMicrotask, MutationObserver',
      'Microtasks run before the next macrotask',
      'Event loop: Stack empty? → Run all microtasks → Run one macrotask → Repeat',
    ],
    examples: [
      {
        title: 'Basic Event Loop',
        code: `console.log('1: Start');

setTimeout(() => {
  console.log('2: Timeout');
}, 0);

console.log('3: End');

// Output:
// 1: Start
// 3: End
// 2: Timeout`,
        explanation: 'Even with 0ms delay, setTimeout callback goes to the Task Queue. It only runs after the current synchronous code finishes and the stack is empty.',
      },
      {
        title: 'Microtasks vs Macrotasks',
        code: `console.log('1: Start');

setTimeout(() => console.log('2: Timeout'), 0);

Promise.resolve()
  .then(() => console.log('3: Promise 1'))
  .then(() => console.log('4: Promise 2'));

console.log('5: End');

// Output:
// 1: Start
// 5: End
// 3: Promise 1
// 4: Promise 2
// 2: Timeout`,
        explanation: 'Promise callbacks (microtasks) have higher priority than setTimeout (macrotask). All microtasks run before the next macrotask.',
      },
      {
        title: 'Nested Promises and Timeouts',
        code: `setTimeout(() => console.log('1: Timeout 1'), 0);

Promise.resolve().then(() => {
  console.log('2: Promise 1');
  setTimeout(() => console.log('3: Timeout 2'), 0);
  Promise.resolve().then(() => console.log('4: Promise 2'));
});

console.log('5: Sync');

// Output:
// 5: Sync
// 2: Promise 1
// 4: Promise 2
// 1: Timeout 1
// 3: Timeout 2`,
        explanation: 'The nested microtask (Promise 2) runs before any macrotasks. Timeout 2 is added to the queue during Promise 1 execution, so it runs after Timeout 1.',
      },
    ],
    commonMistakes: [
      'Thinking setTimeout(fn, 0) runs immediately',
      'Not understanding microtask priority over macrotasks',
      'Blocking the event loop with long-running synchronous code',
    ],
    interviewTips: [
      'Draw the event loop diagram (stack, queues, Web APIs)',
      'Know the order: sync → microtasks → macrotasks',
      'Explain why Promises are faster than setTimeout',
    ],
  },
  {
    id: 'prototypes',
    title: 'Prototypes',
    icon: '🔗',
    category: 'core',
    difficulty: 'intermediate',
    description: 'Prototypes are JavaScript\'s mechanism for inheritance. Every object has a hidden [[Prototype]] link to another object. When you access a property, JS looks up the prototype chain until it finds it or reaches null.',
    shortDescription: 'JavaScript inheritance mechanism',
    keyPoints: [
      'Every object has a [[Prototype]] (accessible via __proto__ or Object.getPrototypeOf)',
      'Property lookup walks up the prototype chain',
      'Functions have a .prototype property used for constructor instances',
      'Object.create() creates objects with a specific prototype',
      'ES6 classes are syntactic sugar over prototypes',
    ],
    examples: [
      {
        title: 'Prototype Chain',
        code: `const animal = {
  eats: true,
  walk() {
    console.log('Walking...');
  }
};

const dog = {
  barks: true,
  __proto__: animal  // dog inherits from animal
};

console.log(dog.barks); // true (own property)
console.log(dog.eats);  // true (inherited)
dog.walk();             // "Walking..." (inherited method)

console.log(dog.hasOwnProperty('barks')); // true
console.log(dog.hasOwnProperty('eats'));  // false`,
        explanation: 'When accessing dog.eats, JS doesn\'t find it on dog, so it looks up the prototype chain to animal and finds it there.',
      },
      {
        title: 'Constructor Functions',
        code: `function Person(name) {
  this.name = name;
}

// Methods go on the prototype (shared by all instances)
Person.prototype.greet = function() {
  console.log('Hi, I am ' + this.name);
};

const alice = new Person('Alice');
const bob = new Person('Bob');

alice.greet(); // "Hi, I am Alice"
bob.greet();   // "Hi, I am Bob"

// Both share the same greet function
console.log(alice.greet === bob.greet); // true`,
        explanation: 'Methods on the prototype are shared across all instances, saving memory. Each instance has its own name, but they all share the same greet function.',
      },
      {
        title: 'Object.create',
        code: `const personProto = {
  greet() {
    console.log('Hello, ' + this.name);
  }
};

// Create object with personProto as prototype
const john = Object.create(personProto);
john.name = 'John';
john.greet(); // "Hello, John"

// Check the prototype
console.log(Object.getPrototypeOf(john) === personProto); // true

// Create with null prototype (no inherited methods)
const bare = Object.create(null);
console.log(bare.toString); // undefined (no Object.prototype)`,
        explanation: 'Object.create() gives you direct control over the prototype chain. You can even create objects with no prototype (null), which have no inherited methods.',
      },
    ],
    commonMistakes: [
      'Confusing __proto__ with .prototype',
      'Modifying Object.prototype (affects all objects!)',
      'Not understanding that arrays/functions are also objects with prototypes',
    ],
    interviewTips: [
      'Draw the prototype chain for a given object',
      'Explain the difference between __proto__ and .prototype',
      'Know how ES6 classes relate to prototypes',
    ],
  },
]

export const conceptCategories = [
  { id: 'fundamentals', name: 'Fundamentals', icon: '🟢', description: 'Core JS basics' },
  { id: 'core', name: 'Core Mechanics', icon: '🟡', description: 'How JS really works' },
  { id: 'advanced', name: 'Advanced', icon: '🔴', description: 'Deep dive topics' },
]

export function getConceptById(id: string): Concept | undefined {
  return concepts.find(c => c.id === id)
}

export function getConceptsByCategory(category: string): Concept[] {
  return concepts.filter(c => c.category === category)
}
