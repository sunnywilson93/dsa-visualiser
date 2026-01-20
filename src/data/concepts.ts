// JavaScript Concepts - Interactive Learning Module

export interface ConceptExample {
  title: string
  code: string
  explanation: string
}

export interface Concept {
  id: string
  title: string
  category: 'philosophy' | 'basics' | 'fundamentals' | 'core' | 'advanced' | 'runtime' | 'backend' | 'browser'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  description: string
  shortDescription: string
  keyPoints: string[]
  examples: ConceptExample[]
  commonMistakes?: string[]
  interviewTips?: string[]
}

export const concepts: Concept[] = [
  // Philosophy
  {
    id: 'js-philosophy',
    title: 'Philosophy of JavaScript',
    category: 'philosophy',
    difficulty: 'beginner',
    description: 'JavaScript was created in 10 days in 1995 by Brendan Eich. Understanding its design philosophy helps you embrace its quirks instead of fighting them. JS prioritizes flexibility, backwards compatibility, and "just works" behavior.',
    shortDescription: 'Why JS is the way it is',
    keyPoints: [
      'Created in 10 days for Netscape browser (1995)',
      'Multi-paradigm: supports OOP, functional, and procedural styles',
      'Dynamic typing: types are checked at runtime, not compile time',
      'Prototype-based inheritance (not class-based like Java)',
      'First-class functions: functions are values you can pass around',
      '"Fail silently" design: prefers undefined over throwing errors',
      'Backwards compatible: old code must always work',
    ],
    examples: [
      {
        title: 'Dynamic Typing',
        code: `let x = 42;        // x is a number
x = "hello";       // now x is a string
x = { name: "JS" } // now x is an object

// No errors! Types can change freely`,
        explanation: 'Variables can hold any type and change types freely',
      },
      {
        title: 'First-Class Functions',
        code: `// Functions are values!
const greet = function(name) {
  return "Hello, " + name;
};

// Pass functions as arguments
const names = ["Alice", "Bob"];
const greetings = names.map(greet);
// ["Hello, Alice", "Hello, Bob"]`,
        explanation: 'Functions can be stored in variables, passed as arguments, returned from other functions',
      },
      {
        title: 'Multi-Paradigm',
        code: `// Procedural
for (let i = 0; i < 3; i++) {
  console.log(i);
}

// Functional
[0, 1, 2].forEach(i => console.log(i));

// Object-Oriented
class Counter {
  constructor() { this.count = 0; }
  increment() { this.count++; }
}`,
        explanation: 'JS lets you mix programming styles freely',
      },
      {
        title: 'Fail Silently',
        code: `const obj = {};
console.log(obj.missing);     // undefined (no error!)
console.log(obj.a.b);         // TypeError (only crashes on null/undefined access)

// Accessing array out of bounds
const arr = [1, 2, 3];
console.log(arr[100]);        // undefined (no error!)`,
        explanation: 'JS prefers returning undefined over throwing errors',
      },
    ],
    commonMistakes: [
      'Fighting dynamic typing instead of embracing it',
      'Not understanding that JS was designed for the web',
      'Expecting JS to behave like statically-typed languages',
    ],
    interviewTips: [
      'Know the history: Brendan Eich, 10 days, Netscape',
      'Explain why backwards compatibility matters for the web',
      'Discuss how JS evolved: ES5 → ES6 → modern JS',
    ],
  },
  // Basics
  {
    id: 'variables',
    title: 'Variables',
    category: 'basics',
    difficulty: 'beginner',
    description: 'Variables are containers that store data values. JavaScript has three ways to declare variables: var (old), let (modern), and const (constant). Understanding their differences is fundamental to writing good JavaScript.',
    shortDescription: 'var, let, and const explained',
    keyPoints: [
      'var: function-scoped, can be redeclared, hoisted with undefined',
      'let: block-scoped, cannot be redeclared, hoisted but in TDZ',
      'const: block-scoped, cannot be reassigned, must be initialized',
      'Use const by default, let when you need to reassign',
      'Avoid var in modern JavaScript',
    ],
    examples: [
      {
        title: 'Declaring Variables',
        code: `var oldWay = "I'm old school";
let modern = "I can change";
const fixed = "I stay the same";

modern = "See, I changed!";  // OK
// fixed = "Try to change me"; // Error!`,
        explanation: 'var is the old way, let allows reassignment, const is constant',
      },
      {
        title: 'const with Objects',
        code: `const person = { name: "Alice" };

// This WORKS! We're changing the object, not the binding
person.name = "Bob";
person.age = 25;

// This FAILS! Can't reassign the variable
// person = { name: "Charlie" }; // Error!`,
        explanation: 'const prevents reassignment, not mutation of objects',
      },
      {
        title: 'Block Scope',
        code: `if (true) {
  var x = 1;   // Function scoped
  let y = 2;   // Block scoped
  const z = 3; // Block scoped
}

console.log(x); // 1 (var leaks out!)
// console.log(y); // Error: y is not defined
// console.log(z); // Error: z is not defined`,
        explanation: 'let and const respect { } blocks, var does not',
      },
    ],
    commonMistakes: [
      'Using var in modern code (prefer let/const)',
      'Thinking const makes objects immutable (it doesn\'t)',
      'Not initializing const (const x; is invalid)',
    ],
    interviewTips: [
      'Know the difference between var, let, and const',
      'Explain scope differences (function vs block)',
      'Default to const, use let only when needed',
    ],
  },
  {
    id: 'data-types',
    title: 'Data Types',
    category: 'basics',
    difficulty: 'beginner',
    description: 'JavaScript has 7 primitive types and 1 object type. Primitives are immutable values stored by value, while objects are mutable and stored by reference. Knowing your types prevents bugs!',
    shortDescription: 'Primitives vs Objects',
    keyPoints: [
      '7 primitives: string, number, boolean, null, undefined, symbol, bigint',
      'Objects: everything else (arrays, functions, dates, etc.)',
      'typeof returns the type as a string',
      'Primitives are copied by value, objects by reference',
      'null and undefined both mean "no value" but are different',
    ],
    examples: [
      {
        title: 'Primitive Types',
        code: `// String
let name = "Alice";

// Number (integers and floats)
let age = 25;
let price = 19.99;

// Boolean
let isActive = true;

// null (intentionally empty)
let data = null;

// undefined (not yet assigned)
let x;
console.log(x); // undefined`,
        explanation: 'The 5 most common primitive types',
      },
      {
        title: 'typeof Operator',
        code: `typeof "hello"    // "string"
typeof 42         // "number"
typeof true       // "boolean"
typeof undefined  // "undefined"
typeof null       // "object" (bug!)
typeof {}         // "object"
typeof []         // "object"
typeof function(){} // "function"`,
        explanation: 'typeof null being "object" is a famous JavaScript bug',
      },
      {
        title: 'Value vs Reference',
        code: `// Primitives: copied by value
let a = 10;
let b = a;
b = 20;
console.log(a); // 10 (unchanged!)

// Objects: copied by reference
let obj1 = { x: 10 };
let obj2 = obj1;
obj2.x = 20;
console.log(obj1.x); // 20 (changed!)`,
        explanation: 'Changing obj2 affects obj1 because they point to the same object',
      },
    ],
    commonMistakes: [
      'Forgetting typeof null returns "object"',
      'Comparing objects with === (compares references, not values)',
      'Confusing null and undefined',
    ],
    interviewTips: [
      'List all 7 primitives confidently',
      'Explain the typeof null quirk',
      'Show value vs reference with a simple example',
    ],
  },
  {
    id: 'operators',
    title: 'Operators',
    category: 'basics',
    difficulty: 'beginner',
    description: 'Operators perform operations on values. JavaScript has arithmetic (+, -, *, /), comparison (==, ===, <, >), logical (&&, ||, !), and assignment (=, +=, -=) operators. Master these to write expressive code.',
    shortDescription: 'Arithmetic, comparison, and logical',
    keyPoints: [
      'Arithmetic: + - * / % ** (exponentiation)',
      'Comparison: == (loose) vs === (strict)',
      'Logical: && (and) || (or) ! (not)',
      '&& returns first falsy or last value, || returns first truthy or last value',
      'Nullish coalescing: ?? returns right side only if left is null/undefined',
    ],
    examples: [
      {
        title: 'Arithmetic Operators',
        code: `let a = 10, b = 3;

a + b   // 13 (addition)
a - b   // 7  (subtraction)
a * b   // 30 (multiplication)
a / b   // 3.333... (division)
a % b   // 1  (remainder)
a ** b  // 1000 (exponentiation: 10³)`,
        explanation: 'Basic math operators work as expected',
      },
      {
        title: 'Comparison: == vs ===',
        code: `// Loose equality (==) converts types
"5" == 5       // true (string becomes number)
0 == false     // true (both become 0)
null == undefined // true (special case)

// Strict equality (===) no conversion
"5" === 5      // false (different types)
0 === false    // false (different types)

// ALWAYS use === !`,
        explanation: '=== is safer because it doesn\'t do type coercion',
      },
      {
        title: 'Logical Operators',
        code: `// && returns first falsy OR last value
true && "hello"   // "hello"
false && "hello"  // false
0 && "hello"      // 0

// || returns first truthy OR last value
false || "hello"  // "hello"
"" || "default"   // "default"
"hi" || "default" // "hi"

// ?? returns right only if left is null/undefined
null ?? "default"  // "default"
0 ?? "default"     // 0 (0 is not null!)`,
        explanation: '&& and || return actual values, not just true/false',
      },
    ],
    commonMistakes: [
      'Using == instead of === (causes type coercion bugs)',
      'Forgetting && and || return actual values, not booleans',
      'Confusing || with ?? (|| checks falsy, ?? checks null/undefined)',
    ],
    interviewTips: [
      'Always explain why === is preferred over ==',
      'Know the short-circuit behavior of && and ||',
      'Demonstrate nullish coalescing with 0 vs null',
    ],
  },
  {
    id: 'functions',
    title: 'Functions',
    category: 'basics',
    difficulty: 'beginner',
    description: 'Functions are reusable blocks of code. JavaScript has three ways to create them: function declarations, function expressions, and arrow functions. Functions are "first-class" in JS, meaning they\'re values you can pass around.',
    shortDescription: 'Declarations, expressions, and arrows',
    keyPoints: [
      'Function declarations are hoisted (can call before definition)',
      'Function expressions are NOT hoisted',
      'Arrow functions have shorter syntax and no own "this"',
      'Functions can return values or undefined by default',
      'Parameters can have default values',
    ],
    examples: [
      {
        title: 'Function Declaration',
        code: `// Can call before definition (hoisting!)
greet("Alice"); // "Hello, Alice"

function greet(name) {
  return "Hello, " + name;
}

// Parameters and return
function add(a, b) {
  return a + b;  // returns the sum
}
add(2, 3); // 5`,
        explanation: 'Function declarations are hoisted to the top',
      },
      {
        title: 'Function Expression',
        code: `// Stored in a variable
const greet = function(name) {
  return "Hello, " + name;
};

// NOT hoisted - can't call before this line
greet("Bob"); // "Hello, Bob"

// Can be anonymous or named
const factorial = function fact(n) {
  return n <= 1 ? 1 : n * fact(n - 1);
};`,
        explanation: 'Function expressions are NOT hoisted',
      },
      {
        title: 'Arrow Functions',
        code: `// Full syntax
const add = (a, b) => {
  return a + b;
};

// Short syntax (implicit return)
const add2 = (a, b) => a + b;

// Single parameter (no parens needed)
const double = x => x * 2;

// No parameters
const sayHi = () => "Hello!";

// Arrow functions have no own 'this'`,
        explanation: 'Arrow functions are concise and inherit this from parent scope',
      },
      {
        title: 'Default Parameters',
        code: `function greet(name = "World") {
  return "Hello, " + name;
}

greet();        // "Hello, World"
greet("Alice"); // "Hello, Alice"

// Works with arrow functions too
const greet2 = (name = "World") => "Hello, " + name;`,
        explanation: 'Default values are used when argument is undefined',
      },
    ],
    commonMistakes: [
      'Forgetting to return a value (function returns undefined)',
      'Using arrow functions when you need your own "this"',
      'Not understanding hoisting differences between declaration and expression',
    ],
    interviewTips: [
      'Know when to use each function type',
      'Explain the "this" difference with arrow functions',
      'Be able to convert between function syntaxes',
    ],
  },
  {
    id: 'conditionals',
    title: 'Conditionals',
    category: 'basics',
    difficulty: 'beginner',
    description: 'Conditionals let your code make decisions. JavaScript has if/else, switch, and the ternary operator (?:). Understanding truthiness is key: JS converts values to booleans in conditions.',
    shortDescription: 'if, switch, and ternary',
    keyPoints: [
      'if/else: most common, can chain with else if',
      'switch: compare one value against many cases',
      'Ternary: condition ? valueIfTrue : valueIfFalse',
      'Falsy values: false, 0, "", null, undefined, NaN',
      'Everything else is truthy (including [], {}, "0")',
    ],
    examples: [
      {
        title: 'if/else Statement',
        code: `const age = 18;

if (age >= 21) {
  console.log("Can drink");
} else if (age >= 18) {
  console.log("Can vote");
} else {
  console.log("Too young");
}
// Output: "Can vote"`,
        explanation: 'Conditions are checked top to bottom, first true wins',
      },
      {
        title: 'Ternary Operator',
        code: `const age = 20;

// condition ? ifTrue : ifFalse
const status = age >= 18 ? "adult" : "minor";
// status = "adult"

// Nested ternary (use sparingly!)
const drink = age >= 21 ? "beer" : age >= 18 ? "coffee" : "juice";`,
        explanation: 'Ternary is great for simple conditional assignments',
      },
      {
        title: 'switch Statement',
        code: `const day = "Monday";

switch (day) {
  case "Monday":
  case "Tuesday":
    console.log("Work day");
    break;  // Important! Without break, falls through
  case "Saturday":
  case "Sunday":
    console.log("Weekend!");
    break;
  default:
    console.log("Midweek");
}`,
        explanation: 'switch uses strict equality (===) and needs break',
      },
      {
        title: 'Truthiness',
        code: `// Falsy values (evaluate to false)
if (false) {}
if (0) {}
if ("") {}
if (null) {}
if (undefined) {}
if (NaN) {}

// Truthy (everything else!)
if ("0") {}     // true! Non-empty string
if ([]) {}      // true! Empty array
if ({}) {}      // true! Empty object`,
        explanation: 'Only 6 values are falsy, everything else is truthy',
      },
    ],
    commonMistakes: [
      'Forgetting break in switch (causes fall-through)',
      'Thinking [] or {} are falsy (they\'re truthy!)',
      'Using == instead of === in conditions',
    ],
    interviewTips: [
      'Know all 6 falsy values by heart',
      'Explain why [] and {} are truthy',
      'Show when to use ternary vs if/else',
    ],
  },
  {
    id: 'loops',
    title: 'Loops',
    category: 'basics',
    difficulty: 'beginner',
    description: 'Loops repeat code until a condition is met. JavaScript has for, while, do-while, for...of (arrays), and for...in (objects). Choose the right loop for your use case!',
    shortDescription: 'for, while, and for...of',
    keyPoints: [
      'for: when you know how many iterations',
      'while: when you don\'t know how many iterations',
      'for...of: iterate over array VALUES',
      'for...in: iterate over object KEYS',
      'break: exit loop early, continue: skip to next iteration',
    ],
    examples: [
      {
        title: 'for Loop',
        code: `// Classic for loop
for (let i = 0; i < 5; i++) {
  console.log(i);  // 0, 1, 2, 3, 4
}

// Looping through array
const fruits = ["apple", "banana", "cherry"];
for (let i = 0; i < fruits.length; i++) {
  console.log(fruits[i]);
}`,
        explanation: 'for(init; condition; increment) - most versatile loop',
      },
      {
        title: 'while Loop',
        code: `// while: check condition first
let count = 0;
while (count < 3) {
  console.log(count);
  count++;
}
// 0, 1, 2

// do-while: runs at least once
let x = 10;
do {
  console.log(x);  // runs once even though x >= 3
} while (x < 3);`,
        explanation: 'while checks before running, do-while runs then checks',
      },
      {
        title: 'for...of (Arrays)',
        code: `const colors = ["red", "green", "blue"];

// Iterate over VALUES
for (const color of colors) {
  console.log(color);
}
// "red", "green", "blue"

// Works with strings too!
for (const char of "Hello") {
  console.log(char);  // "H", "e", "l", "l", "o"
}`,
        explanation: 'for...of gives you values directly (best for arrays)',
      },
      {
        title: 'for...in (Objects)',
        code: `const person = { name: "Alice", age: 25 };

// Iterate over KEYS
for (const key in person) {
  console.log(key, person[key]);
}
// "name" "Alice"
// "age" 25

// Warning: for...in on arrays gives indices as strings!
const arr = ["a", "b"];
for (const i in arr) {
  console.log(typeof i);  // "string" not "number"!
}`,
        explanation: 'for...in iterates over keys (use for objects, not arrays)',
      },
      {
        title: 'break and continue',
        code: `// break: exit loop completely
for (let i = 0; i < 10; i++) {
  if (i === 5) break;
  console.log(i);
}
// 0, 1, 2, 3, 4 (stops at 5)

// continue: skip to next iteration
for (let i = 0; i < 5; i++) {
  if (i === 2) continue;
  console.log(i);
}
// 0, 1, 3, 4 (skips 2)`,
        explanation: 'break exits the loop, continue skips current iteration',
      },
    ],
    commonMistakes: [
      'Using for...in on arrays (use for...of instead)',
      'Infinite loops: forgetting to update the counter',
      'Off-by-one errors: < vs <= in conditions',
    ],
    interviewTips: [
      'Know when to use for...of vs for...in',
      'Explain why for...in gives string indices',
      'Show how to exit a loop early with break',
    ],
  },
  {
    id: 'arrays-basics',
    title: 'Arrays',
    category: 'basics',
    difficulty: 'beginner',
    description: 'Arrays are ordered lists of values. They can hold any type and grow dynamically. JavaScript arrays come with powerful built-in methods like push, pop, map, filter, and reduce.',
    shortDescription: 'Lists of values and array methods',
    keyPoints: [
      'Arrays are zero-indexed (first element is at index 0)',
      'Arrays can hold mixed types',
      'length property gives the count of elements',
      'Mutating methods: push, pop, shift, unshift, splice',
      'Non-mutating methods: map, filter, slice, concat',
    ],
    examples: [
      {
        title: 'Creating Arrays',
        code: `// Array literal (preferred)
const fruits = ["apple", "banana", "cherry"];

// Array constructor (rare)
const numbers = new Array(1, 2, 3);

// Empty array
const empty = [];

// Mixed types (valid but unusual)
const mixed = [1, "hello", true, null];`,
        explanation: 'Use array literals [] for creating arrays',
      },
      {
        title: 'Accessing Elements',
        code: `const fruits = ["apple", "banana", "cherry"];

fruits[0]          // "apple" (first)
fruits[2]          // "cherry" (third)
fruits[10]         // undefined (no error!)
fruits.length      // 3
fruits[fruits.length - 1]  // "cherry" (last)

// Modifying
fruits[1] = "orange";
// ["apple", "orange", "cherry"]`,
        explanation: 'Access by index, use .length for size',
      },
      {
        title: 'Adding/Removing Elements',
        code: `const arr = [1, 2, 3];

// Add to end
arr.push(4);       // [1, 2, 3, 4]

// Remove from end
arr.pop();         // [1, 2, 3]

// Add to beginning
arr.unshift(0);    // [0, 1, 2, 3]

// Remove from beginning
arr.shift();       // [1, 2, 3]

// All these MUTATE the original array!`,
        explanation: 'push/pop for end, shift/unshift for beginning',
      },
      {
        title: 'map, filter, reduce',
        code: `const nums = [1, 2, 3, 4, 5];

// map: transform each element
nums.map(n => n * 2);    // [2, 4, 6, 8, 10]

// filter: keep elements that pass test
nums.filter(n => n > 2); // [3, 4, 5]

// reduce: combine into single value
nums.reduce((sum, n) => sum + n, 0);  // 15

// These return NEW arrays (don't mutate)`,
        explanation: 'map transforms, filter selects, reduce combines',
      },
    ],
    commonMistakes: [
      'Forgetting arrays are zero-indexed',
      'Confusing methods that mutate vs return new arrays',
      'Using delete on arrays (creates holes, use splice)',
    ],
    interviewTips: [
      'Know which methods mutate vs return new arrays',
      'Be comfortable with map, filter, reduce',
      'Explain time complexity: push/pop O(1), shift/unshift O(n)',
    ],
  },
  {
    id: 'objects-basics',
    title: 'Objects',
    category: 'basics',
    difficulty: 'beginner',
    description: 'Objects are collections of key-value pairs. They\'re the most important data structure in JavaScript - even arrays and functions are objects! Learn to create, access, and manipulate objects.',
    shortDescription: 'Key-value pairs and dot notation',
    keyPoints: [
      'Objects store data as key-value pairs (properties)',
      'Keys are strings (or Symbols), values can be anything',
      'Dot notation: obj.key vs Bracket notation: obj["key"]',
      'Objects are passed by reference, not copied',
      'Object.keys(), Object.values(), Object.entries() for iteration',
    ],
    examples: [
      {
        title: 'Creating Objects',
        code: `// Object literal (most common)
const person = {
  name: "Alice",
  age: 25,
  isStudent: true
};

// Empty object
const empty = {};

// Shorthand property names
const name = "Bob";
const age = 30;
const bob = { name, age };
// Same as { name: name, age: age }`,
        explanation: 'Object literals {} are the standard way to create objects',
      },
      {
        title: 'Accessing Properties',
        code: `const person = { name: "Alice", age: 25 };

// Dot notation (preferred)
person.name      // "Alice"
person.age       // 25

// Bracket notation (for dynamic keys)
person["name"]   // "Alice"
const key = "age";
person[key]      // 25

// Missing properties return undefined
person.job       // undefined (no error!)`,
        explanation: 'Use dot notation when you know the key, brackets for dynamic keys',
      },
      {
        title: 'Modifying Objects',
        code: `const person = { name: "Alice" };

// Add properties
person.age = 25;
person["job"] = "Developer";

// Update properties
person.name = "Alicia";

// Delete properties
delete person.job;

// Object is: { name: "Alicia", age: 25 }`,
        explanation: 'Objects are mutable - you can add/change/delete properties',
      },
      {
        title: 'Object Methods',
        code: `const person = { name: "Alice", age: 25 };

// Get all keys
Object.keys(person);    // ["name", "age"]

// Get all values
Object.values(person);  // ["Alice", 25]

// Get key-value pairs
Object.entries(person); // [["name", "Alice"], ["age", 25]]

// Check if key exists
"name" in person;       // true
person.hasOwnProperty("name"); // true`,
        explanation: 'Object static methods help iterate and inspect objects',
      },
      {
        title: 'Destructuring',
        code: `const person = { name: "Alice", age: 25, city: "NYC" };

// Extract properties into variables
const { name, age } = person;
console.log(name); // "Alice"

// Rename while destructuring
const { name: userName } = person;
console.log(userName); // "Alice"

// Default values
const { job = "Unknown" } = person;
console.log(job); // "Unknown"`,
        explanation: 'Destructuring extracts properties into variables',
      },
    ],
    commonMistakes: [
      'Using dot notation with variables (use brackets)',
      'Forgetting objects are passed by reference',
      'Not checking if a property exists before using it',
    ],
    interviewTips: [
      'Know dot vs bracket notation differences',
      'Explain object reference behavior with an example',
      'Be comfortable with destructuring syntax',
    ],
  },
  {
    id: 'hoisting',
    title: 'Hoisting',
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
      // Beginner
      { title: 'var Hoisting', code: `console.log(x);  // undefined
var x = 5;
console.log(x);  // 5

// JS interprets as:
// var x;
// console.log(x);
// x = 5;`, explanation: 'var declarations are hoisted, but not assignments' },
      { title: 'Function Declaration', code: `sayHi();  // "Hello!"

function sayHi() {
  console.log("Hello!");
}

// Works because function
// declarations are fully hoisted`, explanation: 'Function declarations are fully hoisted' },
      // Intermediate
      { title: 'let & TDZ', code: `console.log(x);  // ReferenceError!
let x = 5;

// let/const are hoisted but
// remain in "Temporal Dead Zone"
// until the declaration line`, explanation: 'let/const have Temporal Dead Zone' },
      { title: 'var vs let in Loops', code: `// var - shared across iterations
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i));
}
// Output: 3, 3, 3

// let - new binding each iteration
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i));
}
// Output: 0, 1, 2`, explanation: 'Different scoping behaviors' },
      { title: 'Function Expressions', code: `sayHi();  // TypeError!

var sayHi = function() {
  console.log("Hello!");
};

// Only the variable declaration
// is hoisted, not the function`, explanation: 'Expressions are NOT hoisted like declarations' },
      // Advanced
      { title: 'Mixed Declarations', code: `console.log(a);  // undefined
console.log(b);  // ReferenceError
console.log(c);  // [Function: c]

var a = 1;
let b = 2;
function c() {}`, explanation: 'Understanding declaration order' },
      { title: 'var Redeclaration', code: `var x = 1;
var x = 2;  // OK with var
console.log(x);  // 2

let y = 1;
let y = 2;  // SyntaxError!
// Cannot redeclare with let`, explanation: 'var allows redeclaration, let does not' },
      { title: 'Block Scope', code: `if (true) {
  var a = 1;   // function-scoped
  let b = 2;   // block-scoped
}
console.log(a);  // 1
console.log(b);  // ReferenceError!

// let/const respect {} blocks
// var ignores them`, explanation: 'let/const are block-scoped' },
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
    id: 'type-coercion',
    title: 'Data Types & Coercion',
    category: 'fundamentals',
    difficulty: 'beginner',
    description: 'JavaScript has a small set of primitives and automatic type conversion rules. Understanding coercion helps you predict equality checks, arithmetic, and truthiness in conditionals.',
    shortDescription: 'How JS converts values between types',
    keyPoints: [
      'Seven primitives: string, number, boolean, null, undefined, symbol, bigint',
      'typeof null is "object" (legacy quirk)',
      'Loose equality (==) coerces types, strict (===) does not',
      '+ concatenates when either operand is a string',
      'Other math operators convert operands to numbers',
      'Truthy/falsy rules drive conditionals and &&/||',
    ],
    examples: [
      {
        title: 'Loose vs strict equality',
        code: `'0' == 0           // true
0 == false         // true
null == undefined  // true

'0' === 0          // false
0 === false        // false
null === undefined // false`,
        explanation: 'Loose equality coerces types, strict equality does not',
      },
      {
        title: 'The plus operator',
        code: `'5' + 1     // "51"
5 + '1'     // "51"
true + '1'  // "true1"

5 + 1       // 6
true + 1    // 2 (true -> 1)`,
        explanation: '+ concatenates when a string is involved, otherwise adds numbers',
      },
      {
        title: 'Numeric operators',
        code: `'5' - 1     // 4
'5' * '2'   // 10
'five' - 1  // NaN`,
        explanation: 'Math operators other than + convert operands to numbers',
      },
      {
        title: 'Truthiness',
        code: `Boolean(0)    // false
Boolean('')   // false
Boolean('0')  // true
Boolean([])   // true`,
        explanation: 'Conditionals use truthiness, not strict booleans',
      },
      {
        title: 'typeof quirks',
        code: `typeof null       // "object"
typeof undefined  // "undefined"`,
        explanation: 'typeof null is a long-standing JavaScript quirk',
      },
    ],
    commonMistakes: [
      'Using == and expecting no type conversion',
      'Assuming empty strings are truthy',
      'Forgetting that null and undefined only equal each other with ==',
      'Assuming typeof null returns "null"',
    ],
    interviewTips: [
      'Explain the difference between == and === with examples',
      'Know the falsy values: false, 0, "", null, undefined, NaN',
      'Be ready to reason about + with strings and numbers',
    ],
  },
  {
    id: 'closures',
    title: 'Closures',
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
      // Beginner
      { title: 'Basic Closure', code: `function outer() {
  let count = 0;

  return function inner() {
    count++;
    return count;
  };
}

const counter = outer();
counter();  // 1
counter();  // 2
counter();  // 3`, explanation: 'Inner function remembers outer variables' },
      { title: 'Counter Example', code: `function createCounter(start) {
  let count = start;

  return {
    increment: () => ++count,
    decrement: () => --count,
    getValue: () => count
  };
}

const counter = createCounter(10);
counter.increment();  // 11
counter.increment();  // 12
counter.getValue();   // 12`, explanation: 'Each call uses the same closed-over variable' },
      // Intermediate
      { title: 'Private Variables', code: `function createAccount(initial) {
  let balance = initial;  // private!

  return {
    deposit(amount) {
      balance += amount;
      return balance;
    },
    withdraw(amount) {
      if (amount > balance) {
        return "Insufficient funds";
      }
      balance -= amount;
      return balance;
    },
    getBalance() {
      return balance;
    }
  };
}

const account = createAccount(100);
account.deposit(50);   // 150
account.balance;       // undefined (private!)`, explanation: 'Closures enable data privacy' },
      { title: 'Multiple Closures', code: `function createCounter(start) {
  let count = start;
  return () => count++;
}

const counterA = createCounter(0);
const counterB = createCounter(100);

counterA();  // 0
counterA();  // 1
counterB();  // 100
counterB();  // 101

// Each closure has independent state`, explanation: 'Each closure has its own independent state' },
      // Advanced
      { title: 'Loop Closure Bug', code: `// THE BUG: All callbacks share same i
for (var i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i);
  }, 100);
}
// Output: 3, 3, 3

// Why? var is function-scoped
// All 3 closures reference the
// SAME i, which is 3 after loop`, explanation: 'Classic var loop closure problem' },
      { title: 'Loop Fix with let', code: `// THE FIX: let creates new binding
for (let i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i);
  }, 100);
}
// Output: 0, 1, 2

// Why? let is block-scoped
// Each iteration gets its own i
// Each closure captures different i`, explanation: 'let creates new binding per iteration' },
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
      // Beginner
      { title: 'Object Method', code: `const person = {
  name: "Alice",
  greet() {
    console.log("Hi, I'm " + this.name);
  }
};

person.greet();
// "Hi, I'm Alice"

// this = object left of the dot`, explanation: 'Implicit binding: object left of dot' },
      { title: 'Standalone Function', code: `function showThis() {
  console.log(this);
}

showThis();
// In browser: Window object
// In strict mode: undefined

// No object = default binding`, explanation: 'Default binding: no object = global' },
      // Intermediate
      { title: 'call() / apply()', code: `function greet(greeting) {
  console.log(greeting + ", " + this.name);
}

const bob = { name: "Bob" };
const sue = { name: "Sue" };

greet.call(bob, "Hello");
// "Hello, Bob"

greet.apply(sue, ["Hi"]);
// "Hi, Sue"

// First argument becomes 'this'`, explanation: 'Explicit binding: first arg = this' },
      { title: 'bind()', code: `const person = {
  name: "Alice",
  greet() {
    console.log("Hi, " + this.name);
  }
};

const greet = person.greet;
greet();  // undefined (lost binding!)

const boundGreet = person.greet.bind(person);
boundGreet();  // "Hi, Alice"

// bind() permanently sets 'this'`, explanation: 'Hard binding: permanently set this' },
      { title: 'Arrow Functions', code: `const person = {
  name: "Alice",
  regularFunc() {
    console.log(this.name);  // "Alice"

    const arrow = () => {
      console.log(this.name);  // "Alice"
    };
    arrow();
  }
};

// Arrow functions inherit 'this'
// from their enclosing scope`, explanation: 'Lexical this: inherits from enclosing scope' },
      // Advanced
      { title: 'new Keyword', code: `function Person(name) {
  this.name = name;
  this.greet = function() {
    console.log("Hi, " + this.name);
  };
}

const alice = new Person("Alice");
alice.greet();  // "Hi, Alice"

// 'new' creates fresh object
// and binds it to 'this'`, explanation: 'Constructor binding: this = new instance' },
      { title: 'Lost Binding', code: `const person = {
  name: "Alice",
  greet() {
    console.log("Hi, " + this.name);
  }
};

// BUG: 'this' is lost in callback
setTimeout(person.greet, 100);
// "Hi, undefined"

// The method is passed as plain
// function, losing its context`, explanation: 'Common bug: callback loses context' },
      { title: 'Fixed with Arrow', code: `const person = {
  name: "Alice",
  greet() {
    console.log("Hi, " + this.name);
  }
};

// FIX 1: Arrow function wrapper
setTimeout(() => person.greet(), 100);
// "Hi, Alice"

// FIX 2: Use bind
setTimeout(person.greet.bind(person), 100);
// "Hi, Alice"`, explanation: 'Arrow function preserves this' },
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
      // Beginner
      { title: 'Promise vs setTimeout', code: `console.log("1");

setTimeout(() => {
  console.log("2");
}, 0);

Promise.resolve().then(() => {
  console.log("3");
});

console.log("4");

// Output: 1, 4, 3, 2
// Microtasks before macrotasks!`, explanation: 'Microtasks (Promise) run before macrotasks (setTimeout)' },
      { title: 'Sync Code Flow', code: `function greet() {
  console.log("Hello");
}

console.log("Start");
greet();
console.log("End");

// Output: Start, Hello, End
// Synchronous = line by line`, explanation: 'Synchronous code executes line by line on call stack' },
      // Intermediate
      { title: 'Chained Promises', code: `Promise.resolve(1)
  .then(x => {
    console.log(x);  // 1
    return x + 1;
  })
  .then(x => {
    console.log(x);  // 2
    return x + 1;
  })
  .then(x => {
    console.log(x);  // 3
  });

// Each .then queues a microtask
// when the previous resolves`, explanation: 'Each .then queues when previous resolves' },
      { title: 'async/await', code: `async function example() {
  console.log("1");

  await Promise.resolve();
  // Everything after await becomes
  // a microtask

  console.log("2");
}

console.log("A");
example();
console.log("B");

// Output: A, 1, B, 2`, explanation: 'await pauses function, queues continuation as microtask' },
      { title: 'Nested setTimeout', code: `setTimeout(() => {
  console.log("First macrotask");

  setTimeout(() => {
    console.log("Second macrotask");
  }, 0);

}, 0);

console.log("Sync");

// Output: Sync, First, Second
// Each setTimeout queues one
// macrotask for next loop cycle`, explanation: 'Nested creates new macrotask for next iteration' },
      // Advanced
      { title: 'Microtask in Macrotask', code: `setTimeout(() => {
  console.log("Macro 1");

  Promise.resolve().then(() => {
    console.log("Micro inside");
  });

  console.log("Macro 1 end");
}, 0);

setTimeout(() => {
  console.log("Macro 2");
}, 0);

// Output: Macro 1, Macro 1 end,
//         Micro inside, Macro 2`, explanation: 'Microtasks created during macrotask run before next macrotask' },
      { title: 'queueMicrotask', code: `queueMicrotask(() => {
  console.log("Microtask 1");

  queueMicrotask(() => {
    console.log("Microtask 2");
  });
});

console.log("Sync");

// Output: Sync, Microtask 1, Microtask 2
// All microtasks drain before
// any macrotask runs`, explanation: 'Direct microtask scheduling, can queue more microtasks' },
      { title: 'Microtask Starvation', code: `// DANGER: This blocks forever!
function recursive() {
  Promise.resolve().then(recursive);
}

recursive();
setTimeout(() => {
  console.log("Never runs!");
}, 0);

// Microtasks keep adding more
// macrotasks are STARVED`, explanation: 'Infinite microtasks block all macrotasks forever!' },
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
      // Beginner
      { title: 'Basic Prototype Chain', code: `const animal = {
  eats: true,
  walk() {
    console.log("Walking");
  }
};

const dog = {
  barks: true
};

dog.__proto__ = animal;

dog.barks;  // true (own property)
dog.eats;   // true (from prototype)
dog.walk(); // "Walking" (from prototype)`, explanation: 'JS walks up __proto__ links to find properties' },
      { title: 'Simple Object Literal', code: `const obj = { x: 1 };

// All objects inherit from Object.prototype
obj.__proto__ === Object.prototype  // true

// That's why we can use:
obj.toString();      // "[object Object]"
obj.hasOwnProperty("x");  // true

// These methods come from Object.prototype`, explanation: 'Object literals inherit from Object.prototype' },
      // Intermediate
      { title: 'Object.create()', code: `const parent = {
  greet() {
    console.log("Hello from " + this.name);
  }
};

const child = Object.create(parent);
child.name = "Child";

child.greet();  // "Hello from Child"

// Object.create() sets the prototype
Object.getPrototypeOf(child) === parent  // true`, explanation: 'Create object with specific prototype' },
      { title: 'Property Shadowing', code: `const parent = {
  name: "Parent",
  greet() {
    return "Hi from " + this.name;
  }
};

const child = Object.create(parent);
child.name = "Child";  // shadows parent.name

child.greet();  // "Hi from Child"

// child.name shadows parent.name
// but greet() is still from parent`, explanation: 'Child property hides parent property' },
      { title: 'Constructor Function', code: `function Person(name) {
  this.name = name;
}

Person.prototype.greet = function() {
  console.log("Hi, I'm " + this.name);
};

const alice = new Person("Alice");
const bob = new Person("Bob");

alice.greet();  // "Hi, I'm Alice"
bob.greet();    // "Hi, I'm Bob"

// Both share the same greet method!
alice.greet === bob.greet  // true`, explanation: 'Instances inherit from Constructor.prototype' },
      // Advanced
      { title: 'hasOwnProperty Check', code: `const parent = { inherited: true };
const child = Object.create(parent);
child.own = true;

// hasOwnProperty: only own properties
child.hasOwnProperty("own");       // true
child.hasOwnProperty("inherited"); // false

// 'in' operator: checks entire chain
"own" in child;        // true
"inherited" in child;  // true

// Useful for safe iteration
for (let key in child) {
  if (child.hasOwnProperty(key)) {
    console.log(key);  // only "own"
  }
}`, explanation: 'hasOwnProperty checks only object, "in" checks chain' },
      { title: 'Object.create(null)', code: `// Normal object has prototype
const normal = {};
normal.toString;  // [Function]

// Null prototype = truly empty
const dict = Object.create(null);
dict.toString;    // undefined

// Safe dictionary (no collisions)
dict["hasOwnProperty"] = "safe!";
dict.hasOwnProperty;  // "safe!"

// With normal object this would
// shadow the built-in method`, explanation: 'No prototype = no inherited methods, safe dictionaries' },
      { title: 'Class Syntax (ES6)', code: `class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(this.name + " makes a sound");
  }
}

class Dog extends Animal {
  speak() {
    console.log(this.name + " barks");
  }
}

const dog = new Dog("Rex");
dog.speak();  // "Rex barks"

// Classes are syntactic sugar!
// Under the hood: prototypes`, explanation: 'Classes are syntactic sugar over prototypes' },
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
  {
    id: 'recursion',
    title: 'Recursion',
    category: 'core',
    difficulty: 'intermediate',
    description: 'Recursion is when a function calls itself to solve smaller instances of the same problem. Every recursive function needs a base case (stopping condition) and a recursive case. Understanding the call stack is key to mastering recursion.',
    shortDescription: 'Functions that call themselves',
    keyPoints: [
      'A recursive function calls itself with a smaller/simpler input',
      'Every recursion needs a BASE CASE to stop (or you get infinite recursion)',
      'The call stack grows with each recursive call, then unwinds as functions return',
      'Recursion can be converted to iteration (and vice versa)',
      'Memoization can optimize recursive functions with overlapping subproblems',
    ],
    examples: [
      // Beginner
      { title: 'Factorial', code: `function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}`, explanation: 'Classic recursion: multiply n by factorial of (n-1)' },
      { title: 'Countdown', code: `function countdown(n) {
  if (n <= 0) return;
  console.log(n);
  countdown(n - 1);
}`, explanation: 'Simple recursion with side effects' },
      // Intermediate - Branching Recursion
      { title: 'Fibonacci', code: `function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}`, explanation: 'Tree recursion: TWO recursive calls combine results' },
      { title: 'Climbing Stairs', code: `function climbStairs(n) {
  if (n <= 1) return 1;
  return climbStairs(n - 1)
       + climbStairs(n - 2);
}`, explanation: 'Ways to climb: take 1 step OR 2 steps (branching)' },
      { title: 'Max Tree Depth', code: `function maxDepth(node) {
  if (!node) return 0;
  let left = maxDepth(node.left);
  let right = maxDepth(node.right);
  return Math.max(left, right) + 1;
}`, explanation: 'Compare TWO recursive results, take the max' },
      // Advanced - Complex Branching
      { title: 'Subsets', code: `function subsets(nums, i = 0, curr = []) {
  if (i === nums.length) {
    return [curr.slice()];
  }
  // Branch 1: exclude nums[i]
  let without = subsets(nums, i + 1, curr);
  // Branch 2: include nums[i]
  curr.push(nums[i]);
  let with_ = subsets(nums, i + 1, curr);
  curr.pop();
  return [...without, ...with_];
}`, explanation: 'Include OR exclude each element - exponential branching' },
      { title: 'Memoization', code: `function fibMemo(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  memo[n] = fibMemo(n - 1, memo)
          + fibMemo(n - 2, memo);
  return memo[n];
}`, explanation: 'Cache results to avoid recalculating branches' },
      { title: 'Tree DFS', code: `function dfs(node) {
  if (!node) return;
  console.log(node.val);
  dfs(node.left);   // Branch 1
  dfs(node.right);  // Branch 2
}`, explanation: 'Visit node, then recurse on BOTH children' },
    ],
    commonMistakes: [
      'Forgetting the base case (causes infinite recursion / stack overflow)',
      'Base case that is never reached',
      'Not reducing the problem size in recursive call',
      'Using recursion when simple iteration would be clearer',
    ],
    interviewTips: [
      'Always identify the base case first',
      'Trace through with a small example on paper',
      'Know when to use memoization (overlapping subproblems)',
      'Be able to convert between recursion and iteration',
    ],
  },
  // Runtime Internals
  {
    id: 'memory-model',
    title: 'Memory Model',
    category: 'runtime',
    difficulty: 'intermediate',
    description: 'JavaScript uses two memory regions: the Stack for primitives and function calls, and the Heap for objects and dynamic data. Understanding this helps you predict performance, avoid memory leaks, and understand how garbage collection works.',
    shortDescription: 'Stack vs Heap and garbage collection',
    keyPoints: [
      'Stack: stores primitives (numbers, booleans, strings) and function call frames',
      'Heap: stores objects, arrays, and functions (dynamic allocation)',
      'Variables hold references (pointers) to heap objects, not the objects themselves',
      'Garbage Collection: V8 uses mark-and-sweep to free unreachable objects',
      'Memory leaks occur when objects remain referenced but are no longer needed',
    ],
    examples: [
      { title: 'Primitives vs Objects', code: `// Primitives stored in stack
let a = 10;
let b = a;    // Copy of value
b = 20;
console.log(a);  // 10 (unchanged)

// Objects stored in heap
let obj1 = { x: 1 };
let obj2 = obj1;  // Copy of reference
obj2.x = 99;
console.log(obj1.x);  // 99 (same object!)`, explanation: 'Primitives are copied by value, objects by reference' },
      { title: 'Stack Frames', code: `function outer() {
  let x = 1;  // Frame 1
  inner();
}

function inner() {
  let y = 2;  // Frame 2
  // Stack: [global, outer, inner]
}

outer();
// inner() returns → frame popped
// outer() returns → frame popped`, explanation: 'Each function call creates a stack frame' },
      { title: 'Heap Allocation', code: `// Each {} creates new heap object
function createUser(name) {
  return {
    name: name,
    data: new Array(1000)
  };
}

let user1 = createUser("Alice");
let user2 = createUser("Bob");
// Two separate objects on heap`, explanation: 'Objects allocated on heap persist until GC' },
      { title: 'Garbage Collection', code: `let obj = { data: "important" };

// obj is reachable → NOT collected

obj = null;

// Original object now unreachable
// GC will reclaim this memory
// in next collection cycle`, explanation: 'Unreachable objects are garbage collected' },
      { title: 'Memory Leak', code: `const cache = [];

function processData(data) {
  // BUG: cache grows forever!
  cache.push(data);
  return data.value * 2;
}

// Fix: limit cache size or use WeakMap
const weakCache = new WeakMap();`, explanation: 'Unbounded caches cause memory leaks' },
      { title: 'Closures & Memory', code: `function createCounter() {
  let count = 0;  // Kept alive by closure

  return () => ++count;
}

const counter = createCounter();
// 'count' lives in heap as long
// as 'counter' function exists`, explanation: 'Closures keep variables alive on heap' },
    ],
    commonMistakes: [
      'Thinking primitives and objects are stored the same way',
      'Forgetting that object assignment copies references, not values',
      'Creating memory leaks with event listeners, closures, or global caches',
      'Not understanding that garbage collection is non-deterministic',
    ],
    interviewTips: [
      'Draw stack and heap diagrams for given code',
      'Explain why === behaves differently for primitives vs objects',
      'Know common memory leak patterns and how to fix them',
      'Understand WeakMap/WeakSet for cache scenarios',
    ],
  },
  {
    id: 'v8-engine',
    title: 'V8 Engine',
    category: 'runtime',
    difficulty: 'advanced',
    description: 'V8 is the JavaScript engine powering Chrome and Node.js. It compiles JavaScript to machine code using a two-tier approach: Ignition (interpreter) for quick startup, and TurboFan (JIT compiler) for hot code optimization.',
    shortDescription: 'JIT compilation and optimization',
    keyPoints: [
      'Parser converts source code to Abstract Syntax Tree (AST)',
      'Ignition: interpreter that generates bytecode for fast startup',
      'TurboFan: JIT compiler that optimizes "hot" frequently-run code',
      'Hidden Classes: V8 creates shapes for objects to optimize property access',
      'Inline Caching: remembers where to find properties on repeated access',
      'Deoptimization: falls back to interpreter when assumptions break',
    ],
    examples: [
      { title: 'Compilation Pipeline', code: `// Your code goes through:
// 1. Parser → AST
// 2. Ignition → Bytecode
// 3. (If hot) TurboFan → Machine Code

function add(a, b) {
  return a + b;
}

// Called once: interpreted
add(1, 2);

// Called 1000x: JIT compiled!
for (let i = 0; i < 1000; i++) {
  add(i, i);
}`, explanation: 'Hot functions get JIT compiled for speed' },
      { title: 'Hidden Classes', code: `// V8 creates hidden classes for shapes
function Point(x, y) {
  this.x = x;  // Hidden class C0 → C1
  this.y = y;  // Hidden class C1 → C2
}

// Same shape = same hidden class
let p1 = new Point(1, 2);
let p2 = new Point(3, 4);

// p1 and p2 share hidden class!
// Fast property access`, explanation: 'Same property order = same hidden class' },
      { title: 'Breaking Hidden Classes', code: `function Point(x, y) {
  this.x = x;
  this.y = y;
}

let p1 = new Point(1, 2);
let p2 = new Point(3, 4);

// BAD: Adding property breaks class
p1.z = 5;  // p1 gets new hidden class

// Now p1 and p2 have DIFFERENT
// hidden classes = slower access`, explanation: 'Adding properties creates new hidden classes' },
      { title: 'Monomorphic Calls', code: `// FAST: Always same type (monomorphic)
function getX(point) {
  return point.x;
}

let p = { x: 1, y: 2 };
for (let i = 0; i < 1000; i++) {
  getX(p);  // Same shape every time
}

// SLOW: Different types (polymorphic)
getX({ x: 1 });
getX({ x: 1, y: 2 });
getX({ x: 1, y: 2, z: 3 });`, explanation: 'Consistent object shapes enable optimization' },
      { title: 'Deoptimization', code: `function add(a, b) {
  return a + b;
}

// V8 optimizes for numbers
for (let i = 0; i < 10000; i++) {
  add(i, i);  // TurboFan optimizes
}

// Type change triggers deopt!
add("hello", "world");

// V8 must deoptimize and
// recompile with new assumptions`, explanation: 'Changing types causes deoptimization' },
      { title: 'Optimization Tips', code: `// 1. Initialize all properties in constructor
function User(name, age) {
  this.name = name;
  this.age = age;
  this.email = null;  // Even if null!
}

// 2. Keep types consistent
function process(x) {
  return x * 2;  // Always pass numbers!
}

// 3. Avoid delete (breaks hidden class)
user.email = undefined;  // Better
// delete user.email;     // Slower`, explanation: 'Tips for V8-friendly code' },
    ],
    commonMistakes: [
      'Adding properties to objects after creation (breaks hidden classes)',
      'Passing different types to the same function (polymorphic = slow)',
      'Using delete instead of setting to undefined',
      'Premature optimization without measuring',
    ],
    interviewTips: [
      'Explain the difference between interpreter and JIT compiler',
      'Know why consistent object shapes matter for performance',
      'Understand when deoptimization happens',
      'Be able to discuss hidden classes and inline caching',
    ],
  },
  // Backend (Node.js)
  {
    id: 'nodejs-event-loop',
    title: 'Node.js Event Loop',
    category: 'backend',
    difficulty: 'advanced',
    description: 'Node.js uses libuv to implement its event loop, which has 6 distinct phases. Understanding these phases helps you predict execution order and avoid blocking the server.',
    shortDescription: 'Libuv phases and async patterns',
    keyPoints: [
      'Node.js event loop has 6 phases (not just micro/macro queues)',
      'Timers phase: executes setTimeout/setInterval callbacks',
      'Poll phase: retrieves new I/O events, executes I/O callbacks',
      'Check phase: executes setImmediate callbacks',
      'process.nextTick runs BETWEEN phases (highest priority)',
      'Blocking the event loop freezes your entire server',
    ],
    examples: [
      { title: 'Event Loop Phases', code: `// Phase 1: Timers (setTimeout)
setTimeout(() => console.log("timer"), 0);

// Phase 4: Poll (I/O callbacks)
fs.readFile("file.txt", () => {
  console.log("file read");
});

// Phase 5: Check (setImmediate)
setImmediate(() => console.log("immediate"));

// Between phases: process.nextTick
process.nextTick(() => console.log("nextTick"));

// Output order depends on I/O!`, explanation: 'Different callbacks run in different phases' },
      { title: 'setTimeout vs setImmediate', code: `// In main module: order varies!
setTimeout(() => console.log("timeout"), 0);
setImmediate(() => console.log("immediate"));

// Inside I/O callback: immediate first!
fs.readFile("file.txt", () => {
  setTimeout(() => console.log("timeout"), 0);
  setImmediate(() => console.log("immediate"));
});
// Output: immediate, timeout
// (Check phase runs before Timers)`, explanation: 'setImmediate runs before setTimeout in I/O callbacks' },
      { title: 'process.nextTick', code: `// nextTick runs BETWEEN phases
// (even before Promises!)

Promise.resolve().then(() => {
  console.log("promise");
});

process.nextTick(() => {
  console.log("nextTick");
});

// Output: nextTick, promise
// nextTick has highest priority!`, explanation: 'process.nextTick runs before Promise callbacks' },
      { title: 'nextTick Starvation', code: `// DANGER: Recursive nextTick
// blocks the event loop forever!

function recurse() {
  process.nextTick(recurse);
}
recurse();

// I/O callbacks will NEVER run
// Server becomes unresponsive!

// Fix: use setImmediate instead
function safeRecurse() {
  setImmediate(safeRecurse);
}`, explanation: 'nextTick can starve I/O if abused' },
      { title: 'Blocking the Event Loop', code: `// BAD: Blocks entire server!
app.get("/slow", (req, res) => {
  // 10 billion iterations
  for (let i = 0; i < 1e10; i++) {}
  res.send("done");
});

// GOOD: Use Worker Threads
const { Worker } = require("worker_threads");

app.get("/fast", (req, res) => {
  const worker = new Worker("./heavy.js");
  worker.on("message", () => res.send("done"));
});`, explanation: 'CPU-heavy work blocks all requests' },
      { title: 'Event Loop Monitoring', code: `// Monitor event loop lag
const start = process.hrtime();

setImmediate(() => {
  const [s, ns] = process.hrtime(start);
  const lag = s * 1000 + ns / 1e6;
  console.log(\`Event loop lag: \${lag}ms\`);
});

// High lag = event loop blocked
// Target: < 100ms for responsive server`, explanation: 'Monitor lag to detect blocking issues' },
    ],
    commonMistakes: [
      'Confusing browser event loop with Node.js event loop',
      'Using recursive process.nextTick (causes starvation)',
      'Blocking the event loop with CPU-intensive code',
      'Assuming setTimeout(fn, 0) runs immediately',
    ],
    interviewTips: [
      'Know all 6 phases of the libuv event loop',
      'Explain the difference between setImmediate and setTimeout',
      'Understand why process.nextTick exists and when to use it',
      'Know how to handle CPU-intensive tasks (Worker Threads)',
    ],
  },
  {
    id: 'streams-buffers',
    title: 'Streams & Buffers',
    category: 'backend',
    difficulty: 'intermediate',
    description: 'Streams let you process data piece by piece instead of loading everything into memory. Buffers hold binary data. Together they enable efficient handling of files, network requests, and real-time data.',
    shortDescription: 'Efficient data processing',
    keyPoints: [
      'Streams process data in chunks (memory efficient)',
      'Four types: Readable, Writable, Duplex, Transform',
      'Buffers are fixed-size chunks of binary data',
      'Backpressure: slow consumer signals fast producer to pause',
      'pipe() handles backpressure automatically',
      'highWaterMark controls internal buffer size (default 16KB)',
    ],
    examples: [
      { title: 'Reading a File Stream', code: `const fs = require("fs");

// BAD: Loads entire file into memory
const data = fs.readFileSync("huge.txt");

// GOOD: Stream processes chunks
const stream = fs.createReadStream("huge.txt");

stream.on("data", (chunk) => {
  console.log(\`Received \${chunk.length} bytes\`);
});

stream.on("end", () => {
  console.log("Done reading");
});`, explanation: 'Streams process large files without loading into memory' },
      { title: 'Piping Streams', code: `const fs = require("fs");
const zlib = require("zlib");

// Read → Compress → Write
fs.createReadStream("input.txt")
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream("output.gz"));

// pipe() handles backpressure!
// If write is slow, read pauses`, explanation: 'pipe() chains streams with automatic backpressure' },
      { title: 'Transform Stream', code: `const { Transform } = require("stream");

const upperCase = new Transform({
  transform(chunk, encoding, callback) {
    // Modify data as it flows through
    const upper = chunk.toString().toUpperCase();
    callback(null, upper);
  }
});

process.stdin
  .pipe(upperCase)
  .pipe(process.stdout);

// Type lowercase → outputs UPPERCASE`, explanation: 'Transform streams modify data in flight' },
      { title: 'Buffer Basics', code: `// Create buffer from string
const buf1 = Buffer.from("Hello");
console.log(buf1);  // <Buffer 48 65 6c 6c 6f>

// Create empty buffer
const buf2 = Buffer.alloc(10);

// Buffer operations
buf1.toString();     // "Hello"
buf1.length;         // 5
buf1[0];             // 72 (ASCII 'H')

// Concatenate buffers
const combined = Buffer.concat([buf1, buf2]);`, explanation: 'Buffers hold raw binary data' },
      { title: 'Backpressure Handling', code: `const readable = getReadableStream();
const writable = getWritableStream();

readable.on("data", (chunk) => {
  // write() returns false if buffer full
  const ok = writable.write(chunk);

  if (!ok) {
    // Pause reading until drain
    readable.pause();
    writable.once("drain", () => {
      readable.resume();
    });
  }
});

// Or just use pipe() which does this!`, explanation: 'Manual backpressure handling (or use pipe)' },
      { title: 'HTTP Streaming', code: `const http = require("http");
const fs = require("fs");

http.createServer((req, res) => {
  // Stream file directly to response
  const stream = fs.createReadStream("video.mp4");

  res.writeHead(200, {
    "Content-Type": "video/mp4"
  });

  stream.pipe(res);

  // Video starts playing immediately!
  // No need to load entire file first
}).listen(3000);`, explanation: 'Stream large files in HTTP responses' },
    ],
    commonMistakes: [
      'Loading entire files into memory instead of streaming',
      'Ignoring backpressure (causes memory issues)',
      'Not handling stream errors (crashes server)',
      'Confusing Buffer.alloc() with Buffer.allocUnsafe()',
    ],
    interviewTips: [
      'Know the four stream types and when to use each',
      'Explain backpressure and how pipe() handles it',
      'Understand why streams are memory-efficient',
      'Be able to implement a custom Transform stream',
    ],
  },
  // Browser
  {
    id: 'critical-render-path',
    title: 'Critical Render Path',
    category: 'browser',
    difficulty: 'intermediate',
    description: 'The Critical Render Path is the sequence of steps the browser takes to convert HTML, CSS, and JavaScript into pixels on screen. Optimizing it is key to fast page loads and smooth interactions.',
    shortDescription: 'How browsers render pages',
    keyPoints: [
      'HTML parsing builds the DOM (Document Object Model)',
      'CSS parsing builds the CSSOM (CSS Object Model)',
      'DOM + CSSOM = Render Tree (only visible elements)',
      'Layout: calculates exact position and size of each element',
      'Paint: fills in pixels (colors, images, text)',
      'Composite: layers are combined and sent to GPU',
    ],
    examples: [
      { title: 'Render Pipeline', code: `<!-- Browser processes this: -->
<html>
  <head>
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
    <div class="box">Hello</div>
    <script src="app.js"></script>
  </body>
</html>

<!-- Pipeline:
1. Parse HTML → Build DOM
2. Parse CSS → Build CSSOM
3. Combine → Render Tree
4. Layout → Calculate positions
5. Paint → Fill pixels
6. Composite → Send to GPU -->`, explanation: 'The browser pipeline from HTML to pixels' },
      { title: 'Render-Blocking CSS', code: `<!-- CSS blocks rendering! -->
<head>
  <!-- This blocks paint until loaded -->
  <link rel="stylesheet" href="styles.css">

  <!-- This doesn't block (print only) -->
  <link rel="stylesheet" href="print.css" media="print">

  <!-- Preload critical CSS -->
  <link rel="preload" href="critical.css" as="style">
</head>

<!-- Browser waits for CSS before
     painting anything to avoid FOUC
     (Flash of Unstyled Content) -->`, explanation: 'CSS blocks rendering until fully loaded' },
      { title: 'Parser-Blocking JavaScript', code: `<!-- JS blocks HTML parsing! -->
<body>
  <div>Content above</div>

  <!-- Blocks parsing until executed -->
  <script src="app.js"></script>

  <!-- Use defer: loads async, runs after HTML -->
  <script defer src="app.js"></script>

  <!-- Use async: loads async, runs immediately -->
  <script async src="analytics.js"></script>

  <div>Content below (blocked by script)</div>
</body>`, explanation: 'Scripts block HTML parsing unless defer/async' },
      { title: 'Reflow (Layout)', code: `// EXPENSIVE: Triggers layout recalculation

// Reading layout properties:
element.offsetHeight;
element.getBoundingClientRect();

// Changing layout properties:
element.style.width = "100px";
element.style.margin = "10px";

// BAD: Layout thrashing
for (let i = 0; i < 100; i++) {
  el.style.width = el.offsetWidth + 10 + "px";
  // Read → Write → Read → Write...
}

// GOOD: Batch reads, then writes
const width = el.offsetWidth;
el.style.width = width + 1000 + "px";`, explanation: 'Avoid layout thrashing by batching DOM operations' },
      { title: 'Repaint vs Reflow', code: `// REPAINT only (cheap)
// Changes visual properties, not layout
element.style.color = "red";
element.style.backgroundColor = "blue";
element.style.visibility = "hidden";

// REFLOW + REPAINT (expensive)
// Changes geometry/layout
element.style.width = "200px";
element.style.fontSize = "20px";
element.style.display = "none";

// NEITHER (use transform/opacity)
element.style.transform = "translateX(100px)";
element.style.opacity = "0.5";
// Compositor-only, no layout/paint!`, explanation: 'Prefer compositor properties for animations' },
      { title: 'Optimize Critical Path', code: `<!-- 1. Inline critical CSS -->
<style>
  /* Above-the-fold styles only */
  .header { ... }
</style>

<!-- 2. Defer non-critical CSS -->
<link rel="preload" href="full.css" as="style"
      onload="this.rel='stylesheet'">

<!-- 3. Defer JavaScript -->
<script defer src="app.js"></script>

<!-- 4. Lazy load images -->
<img loading="lazy" src="below-fold.jpg">

<!-- 5. Use resource hints -->
<link rel="preconnect" href="https://api.com">`, explanation: 'Techniques to speed up initial render' },
    ],
    commonMistakes: [
      'Putting blocking scripts in <head> without defer/async',
      'Not inlining critical CSS for above-the-fold content',
      'Causing layout thrashing by mixing reads and writes',
      'Animating layout properties instead of transform/opacity',
    ],
    interviewTips: [
      'Draw the render pipeline from HTML to pixels',
      'Explain the difference between reflow and repaint',
      'Know which CSS properties trigger layout vs paint vs composite',
      'Understand defer vs async for script loading',
    ],
  },
  {
    id: 'web-workers',
    title: 'Web Workers',
    category: 'browser',
    difficulty: 'advanced',
    description: 'Web Workers enable multi-threading in JavaScript by running scripts in background threads. This keeps the main thread free for UI updates, preventing the page from freezing during heavy computations.',
    shortDescription: 'Multi-threading in the browser',
    keyPoints: [
      'Workers run in separate threads (true parallelism)',
      'Main thread stays responsive during heavy computation',
      'Communication via postMessage (data is copied, not shared)',
      'Workers have no DOM access (no document, window, etc.)',
      'SharedArrayBuffer allows shared memory between threads',
      'Service Workers: special workers for offline caching and network interception',
    ],
    examples: [
      { title: 'Basic Worker', code: `// main.js
const worker = new Worker("worker.js");

// Send data to worker
worker.postMessage({ numbers: [1, 2, 3, 4, 5] });

// Receive result from worker
worker.onmessage = (e) => {
  console.log("Sum:", e.data.sum);
};

// worker.js
self.onmessage = (e) => {
  const sum = e.data.numbers.reduce((a, b) => a + b);
  self.postMessage({ sum: sum });
};`, explanation: 'Worker runs in background thread' },
      { title: 'Heavy Computation', code: `// Without worker: UI freezes!
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
fibonacci(45);  // Blocks for seconds!

// With worker: UI stays responsive
const worker = new Worker("fib-worker.js");
worker.postMessage(45);
worker.onmessage = (e) => {
  console.log("Result:", e.data);
};

// User can still click buttons!`, explanation: 'Offload heavy work to keep UI responsive' },
      { title: 'Transferable Objects', code: `// postMessage copies data (slow for large data)

const bigArray = new Float32Array(1000000);

// SLOW: Data is copied
worker.postMessage(bigArray);

// FAST: Transfer ownership (zero-copy)
worker.postMessage(bigArray, [bigArray.buffer]);

// After transfer, bigArray is empty!
console.log(bigArray.length);  // 0

// Worker now owns the buffer`, explanation: 'Transfer large data without copying' },
      { title: 'SharedArrayBuffer', code: `// Create shared memory
const shared = new SharedArrayBuffer(4);
const view = new Int32Array(shared);

// Pass to worker (no copy!)
worker.postMessage(shared);

// Both threads see same memory
view[0] = 42;  // Worker sees this!

// Use Atomics for thread-safe access
Atomics.add(view, 0, 1);
Atomics.load(view, 0);  // 43

// Note: Requires COOP/COEP headers`, explanation: 'SharedArrayBuffer for shared memory' },
      { title: 'Worker Pool', code: `class WorkerPool {
  constructor(size, script) {
    this.workers = Array(size).fill(null)
      .map(() => new Worker(script));
    this.queue = [];
    this.available = [...this.workers];
  }

  run(data) {
    return new Promise((resolve) => {
      const task = { data, resolve };

      if (this.available.length > 0) {
        this.dispatch(task);
      } else {
        this.queue.push(task);
      }
    });
  }

  dispatch(task) {
    const worker = this.available.pop();
    worker.onmessage = (e) => {
      task.resolve(e.data);
      this.available.push(worker);
      if (this.queue.length > 0) {
        this.dispatch(this.queue.shift());
      }
    };
    worker.postMessage(task.data);
  }
}`, explanation: 'Pool workers for efficient parallel processing' },
      { title: 'Service Worker', code: `// Register service worker
navigator.serviceWorker.register("/sw.js");

// sw.js - Intercept network requests
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => {
      // Return cached version or fetch
      return cached || fetch(e.request);
    })
  );
});

// Cache resources for offline use
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open("v1").then((cache) => {
      return cache.addAll(["/", "/app.js"]);
    })
  );
});`, explanation: 'Service Workers enable offline-first apps' },
    ],
    commonMistakes: [
      'Trying to access DOM from a worker (not allowed)',
      'Sending large data without using Transferable objects',
      'Not handling worker errors (silent failures)',
      'Creating too many workers (overhead)',
    ],
    interviewTips: [
      'Explain when to use Web Workers vs main thread',
      'Know the difference between copying and transferring data',
      'Understand SharedArrayBuffer and Atomics for thread safety',
      'Explain Service Workers and their use cases (PWA, offline)',
    ],
  },
  {
    id: 'web-evolution',
    title: 'Evolution of Web Rendering',
    category: 'browser',
    difficulty: 'intermediate',
    description: 'The web has evolved through multiple paradigm shifts, each solving previous problems while creating new ones. From static HTML to SPAs to SSR/SSG, understanding this evolution helps you choose the right approach for your projects.',
    shortDescription: 'From static HTML to modern SSR/SSG',
    keyPoints: [
      'Static HTML (1990s): Simple but no interactivity',
      'CGI/PHP Era: Dynamic content but full page reloads',
      'AJAX (2005): Partial updates without reload, but complex state',
      'SPA Era (2010s): App-like UX but poor SEO & slow initial load',
      'SSR Revival: Fast initial load + SEO but server costs',
      'SSG: Pre-built pages, fast & cheap but not dynamic',
      'Modern Hybrid (ISR, RSC): Best of both worlds',
    ],
    examples: [
      {
        title: 'Era 1: Static HTML (1990s)',
        code: `<!-- The entire web was just documents -->
<html>
  <body>
    <h1>Welcome to my page!</h1>
    <p>Last updated: January 1995</p>
    <a href="page2.html">Next Page</a>
  </body>
</html>

// Solved: Share documents globally
// Created: No interactivity, manual updates`,
        explanation: 'The web started as linked documents. Every change required editing HTML files and uploading them to a server.',
      },
      {
        title: 'Era 2: Server-Side Scripting (CGI/PHP)',
        code: `// PHP generates HTML on each request
// <?php
//   $user = $_SESSION['user'];
//   $posts = db_query("SELECT * FROM posts");
// ?>

// Server builds complete HTML per request
// User sees: <h1>Welcome, John</h1>

// Solved: Dynamic, personalized content
// Created: Full page reload on every action`,
        explanation: 'Server generates fresh HTML for each request. Dynamic but every click reloads the entire page.',
      },
      {
        title: 'Era 3: AJAX Revolution (2005)',
        code: `// XMLHttpRequest enabled partial page updates
const xhr = new XMLHttpRequest();
xhr.open('GET', '/api/posts');
xhr.onload = function() {
  const posts = JSON.parse(xhr.response);
  // Update only part of the page
  renderPosts(posts);
};
xhr.send();

// Later: jQuery made it easier
// $.get('/api/posts', renderPosts);

// Solved: No full page reloads
// Created: Callback soup, state management chaos`,
        explanation: 'AJAX allowed updating parts of the page without reload. But managing state across many callbacks became messy.',
      },
      {
        title: 'Era 4: Single Page Apps (2010s)',
        code: `// React/Vue/Angular - Component-based SPA
function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(setPosts);
  }, []);

  return (
    <div>
      {posts.map(post => (
        <Post key={post.id} data={post} />
      ))}
    </div>
  );
}

// Client downloads JS bundle, renders everything
// Solved: Organized code, app-like UX
// Created: Blank page until JS loads (bad SEO)`,
        explanation: 'SPAs feel like native apps but search engines see a blank page, and users wait for large JS bundles to download.',
      },
      {
        title: 'Era 5: SSR Returns (Next.js, Nuxt)',
        code: `// Server renders HTML, then "hydrates" with JS
// pages/posts.js (Next.js)

export async function getServerSideProps() {
  const posts = await db.posts.findMany();
  return { props: { posts } };
}

export default function Posts({ posts }) {
  return (
    <div>
      {posts.map(post => <Post key={post.id} data={post} />)}
    </div>
  );
}

// Server sends complete HTML (fast, good SEO)
// Then JS loads and makes it interactive
// Solved: SEO, fast initial paint
// Created: Server costs, TTFB latency`,
        explanation: 'SSR renders HTML on the server for each request. Great for SEO and initial load, but requires running servers.',
      },
      {
        title: 'Era 6: Static Site Generation (SSG)',
        code: `// Generate HTML at BUILD time, not request time
// pages/posts.js (Next.js SSG)

export async function getStaticProps() {
  const posts = await db.posts.findMany();
  return {
    props: { posts },
    revalidate: 3600 // Rebuild every hour (ISR)
  };
}

// At build: generates /posts.html
// At runtime: serves static file (instant!)

// Solved: No server needed, instant loads
// Created: Not for real-time data, long builds`,
        explanation: 'SSG pre-builds pages at deploy time. Perfect for blogs, docs, marketing sites. ISR adds periodic rebuilds.',
      },
      {
        title: 'Era 7: Modern Hybrid (RSC, Islands)',
        code: `// React Server Components (Next.js 13+)
// Mix server and client components

// SERVER component (no JS sent to client)
async function PostList() {
  const posts = await db.posts.findMany();
  return (
    <div>
      {posts.map(post => <PostCard post={post} />)}
      <LikeButton /> {/* Client component */}
    </div>
  );
}

// CLIENT component - only this ships JS
'use client'
function LikeButton() {
  const [liked, setLiked] = useState(false);
  return <button onClick={() => setLiked(true)}>Like</button>;
}

// Solved: Less JS shipped, best of both
// Created: New mental model, still evolving`,
        explanation: 'Server Components run on the server with zero client JS. Mix with client components only where needed for interactivity.',
      },
    ],
    commonMistakes: [
      'Using SPA for content sites that need SEO',
      'Using SSR when SSG would suffice (unnecessary server costs)',
      'Over-hydrating: shipping JS for static content',
      'Not considering Time to First Byte (TTFB) in architecture',
    ],
    interviewTips: [
      'Know the trade-offs: SEO vs interactivity vs cost vs complexity',
      'Explain when to use SSG vs SSR vs CSR (client-side rendering)',
      'Discuss hydration and why it matters for performance',
      'Mention modern patterns: Islands Architecture, React Server Components',
      'Be ready to recommend an approach for a given use case',
    ],
  },
  {
    id: 'module-evolution',
    title: 'Evolution of JS Modules',
    category: 'core',
    difficulty: 'intermediate',
    description: 'JavaScript started with no module system. Over 20 years, we went from global scripts to ES Modules. Understanding this history explains why you see require(), define(), and import in different codebases.',
    shortDescription: 'From globals to ES Modules',
    keyPoints: [
      'Global Scripts (1995): No modules, everything global, order-dependent',
      'IIFE Pattern (2009): Closures for encapsulation, still manual ordering',
      'CommonJS (2009): Node.js require/exports, synchronous, server-focused',
      'AMD (2011): Async loading for browsers, verbose callback syntax',
      'UMD (2013): Universal wrapper for AMD + CommonJS + global',
      'ES Modules (2015): Official standard, static imports, tree-shaking',
    ],
    examples: [
      {
        title: 'Era 1: Global Scripts (1995-2009)',
        code: `<!-- Everything global, order matters! -->
<script src="jquery.js"></script>
<script src="utils.js"></script>
<script src="app.js"></script>

// utils.js
var Utils = {};
Utils.formatDate = function(d) { return d.toISOString(); };

// app.js - Hope Utils loaded first!
console.log(Utils.formatDate(new Date()));

// Problem: Name collisions, load order, no encapsulation`,
        explanation: 'Every script shared the global scope. Load order mattered, and name collisions were common.',
      },
      {
        title: 'Era 2: IIFE Pattern (2009-2012)',
        code: `// Module Pattern using IIFE + Closure
var MyModule = (function() {
  // Private (hidden in closure)
  var counter = 0;

  // Public API
  return {
    increment: function() { counter++; },
    getCount: function() { return counter; }
  };
})();

MyModule.increment();  // Works
MyModule.counter;      // undefined (private!)`,
        explanation: 'IIFEs created private scope via closures, but you still had one global per module.',
      },
      {
        title: 'Era 3: CommonJS (Node.js)',
        code: `// math.js - Export
function add(a, b) { return a + b; }
module.exports = { add };

// app.js - Import
const { add } = require('./math');
console.log(add(2, 3)); // 5

// Synchronous: require() blocks until file loads
// Designed for servers with fast file system access`,
        explanation: 'Node.js introduced CommonJS - the first real module system. Synchronous loading worked for servers.',
      },
      {
        title: 'Era 4: AMD (Browser Async)',
        code: `// RequireJS - async loading for browsers
define('app', ['jquery', 'utils'], function($, utils) {
  // Dependencies load asynchronously
  // Then this callback executes
  return {
    init: function() {
      $('#app').text(utils.formatDate());
    }
  };
});

// Verbose, but enabled lazy loading`,
        explanation: 'AMD solved async loading for browsers, but the callback syntax was verbose.',
      },
      {
        title: 'Era 5: UMD (Universal)',
        code: `// UMD: Works in AMD, CommonJS, AND browsers
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['dep'], factory);           // AMD
  } else if (typeof exports === 'object') {
    module.exports = factory(require('dep')); // CJS
  } else {
    root.MyLib = factory(root.Dep);     // Global
  }
}(this, function(dep) {
  return { /* module */ };
}));`,
        explanation: 'UMD wrapped modules to work everywhere. Complex but necessary for library authors.',
      },
      {
        title: 'Era 6: ES Modules (The Standard)',
        code: `// math.js - Named exports
export function add(a, b) { return a + b; }
export const PI = 3.14;

// Default export
export default class Calculator {}

// app.js - Import
import Calculator, { add, PI } from './math.js';

// Dynamic import (code splitting!)
const heavy = await import('./heavy.js');

// Static analysis enables tree-shaking!`,
        explanation: 'ES Modules are the official standard - static, tree-shakeable, and natively supported.',
      },
    ],
    commonMistakes: [
      'Mixing require() and import in the same file (different systems!)',
      'Forgetting .js extension in browser ES modules',
      'Not understanding "type": "module" in package.json',
      'Thinking require() works in browsers without a bundler',
    ],
    interviewTips: [
      'Explain why CommonJS is synchronous (designed for Node file system)',
      'Know why ES Modules enable tree-shaking (static analysis)',
      'Understand the dual package hazard when publishing libraries',
      'Be ready to explain require.cache and module resolution',
      'Know the difference: CJS copies values, ESM binds live references',
    ],
  },
  {
    id: 'async-evolution',
    title: 'Evolution of Async Patterns',
    category: 'core',
    difficulty: 'intermediate',
    description: 'JavaScript is single-threaded but handles async operations elegantly. From callbacks to async/await, each pattern solved problems while creating new ones. Understanding this evolution helps you write better async code.',
    shortDescription: 'From callbacks to async/await',
    keyPoints: [
      'Callbacks (1995): Pass a function to run later - simple but leads to nesting',
      'Callback Hell (2008): Deep nesting creates unreadable "pyramid of doom"',
      'Promises (2012): Chainable .then() flattens code, unified error handling',
      'Generators (2015): Pausable functions, paved the way for async/await',
      'Async/Await (2017): Sync-looking code, native try/catch, clear winner',
      'Modern Patterns: Promise.allSettled, AbortController, async iterators',
    ],
    examples: [
      {
        title: 'Era 1: Callbacks',
        code: `// Pass a function to be called later
function fetchUser(id, callback) {
  setTimeout(() => {
    callback(null, { id, name: 'Alice' });
  }, 1000);
}

fetchUser(1, function(err, user) {
  if (err) return console.error(err);
  console.log(user.name);
});`,
        explanation: 'Callbacks are the original async pattern. Simple, but hard to compose.',
      },
      {
        title: 'Era 2: Callback Hell',
        code: `// The "Pyramid of Doom"
getUser(id, function(err, user) {
  getOrders(user.id, function(err, orders) {
    getDetails(orders[0].id, function(err, details) {
      // 3 levels deep... keeps going
    });
  });
});`,
        explanation: 'Sequential async ops create deeply nested, unreadable code.',
      },
      {
        title: 'Era 3: Promises',
        code: `// Chain instead of nest
fetchUser(1)
  .then(user => getOrders(user.id))
  .then(orders => getDetails(orders[0].id))
  .catch(err => console.error(err));

// Parallel execution
Promise.all([fetchA(), fetchB(), fetchC()])
  .then(([a, b, c]) => console.log(a, b, c));`,
        explanation: 'Promises flatten the pyramid with .then() chains.',
      },
      {
        title: 'Era 4: Async/Await',
        code: `async function loadOrder(userId) {
  try {
    const user = await fetchUser(userId);
    const orders = await getOrders(user.id);
    const details = await getDetails(orders[0].id);
    return { user, orders, details };
  } catch (err) {
    console.error('Failed:', err);
  }
}`,
        explanation: 'Async/await makes async code look synchronous. The clear winner.',
      },
      {
        title: 'Modern: Promise.allSettled',
        code: `// Don't fail on first error
const results = await Promise.allSettled([
  fetchUser(1),   // succeeds
  fetchUser(-1),  // fails
  fetchUser(2)    // succeeds
]);
// All results returned, even failures`,
        explanation: 'Promise.allSettled handles partial failures gracefully.',
      },
      {
        title: 'Modern: AbortController',
        code: `const controller = new AbortController();

fetch('/api/data', { signal: controller.signal })
  .then(r => r.json())
  .catch(err => {
    if (err.name === 'AbortError') {
      console.log('Fetch cancelled');
    }
  });

// Cancel the request
controller.abort();`,
        explanation: 'AbortController lets you cancel in-flight async operations.',
      },
    ],
    commonMistakes: [
      'Forgetting await (Promise returned instead of value)',
      'Using await in a loop when Promise.all would parallelize',
      'Not handling Promise rejections (unhandled rejection)',
      'Mixing .then() and await inconsistently',
    ],
    interviewTips: [
      'Explain why async/await is just syntax sugar over Promises',
      'Know when to use Promise.all vs Promise.allSettled vs Promise.race',
      'Understand the event loop and how async fits in',
      'Be ready to convert callback code to Promises to async/await',
      'Know how to handle errors in async/await (try/catch vs .catch())',
    ],
  },
  {
    id: 'state-evolution',
    title: 'Evolution of State Management',
    category: 'advanced',
    difficulty: 'intermediate',
    description: 'Frontend state management has evolved dramatically. From jQuery DOM manipulation to Redux to modern solutions like Zustand, each era solved problems while creating new ones. Understanding this history helps you choose the right tool.',
    shortDescription: 'From jQuery to Zustand',
    keyPoints: [
      'jQuery DOM (2006): State lived in the DOM, read/write directly',
      'MVC/Backbone (2010): Separated models from views, event-driven',
      'Two-Way Binding (2012): Angular 1.x magic, but hard to debug',
      'Flux (2014): Unidirectional flow, actions → dispatcher → store',
      'Redux (2015): Single store, pure reducers, time-travel debugging',
      'Hooks + Context (2018): Built-in React, simpler but re-render issues',
      'Modern (2020+): Zustand, Jotai - minimal API, fine-grained updates',
    ],
    examples: [
      {
        title: 'Era 1: jQuery DOM',
        code: `// State = the DOM itself
$('#add-btn').click(function() {
  var count = parseInt($('#counter').text());
  $('#counter').text(count + 1);
});
// No structure, state scattered everywhere`,
        explanation: 'The DOM was the state. Simple but led to spaghetti code.',
      },
      {
        title: 'Era 2: MVC / Backbone',
        code: `var Todo = Backbone.Model.extend({
  defaults: { title: '', completed: false }
});

var TodoView = Backbone.View.extend({
  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
  }
});`,
        explanation: 'Models as source of truth, views subscribe to changes.',
      },
      {
        title: 'Era 3: Redux',
        code: `function todoReducer(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, { text: action.text }];
    default:
      return state;
  }
}

store.dispatch({ type: 'ADD_TODO', text: 'Learn Redux' });`,
        explanation: 'Single store, pure reducers, predictable but verbose.',
      },
      {
        title: 'Era 4: Context + Hooks',
        code: `const TodoContext = createContext();

function TodoProvider({ children }) {
  const [todos, dispatch] = useReducer(reducer, []);
  return (
    <TodoContext.Provider value={{ todos, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
}`,
        explanation: 'Built into React, no external library needed.',
      },
      {
        title: 'Era 5: Zustand (Modern)',
        code: `const useTodoStore = create((set) => ({
  todos: [],
  addTodo: (text) => set((state) => ({
    todos: [...state.todos, { text }]
  })),
}));

// In component - just use the hook!
const todos = useTodoStore((s) => s.todos);`,
        explanation: 'Minimal API, fine-grained updates, no provider needed.',
      },
    ],
    commonMistakes: [
      'Using Redux for simple apps (overkill)',
      'Storing derived state instead of computing it',
      'Not splitting Context to avoid unnecessary re-renders',
      'Mutating state directly instead of returning new objects',
    ],
    interviewTips: [
      'Explain trade-offs between different state solutions',
      'Know when Context is enough vs when you need Zustand/Redux',
      'Understand why immutability matters for React rendering',
      'Be ready to discuss fine-grained vs coarse-grained reactivity',
      'Know the difference between local, global, and server state',
    ],
  },
]

export const conceptCategories = [
  { id: 'philosophy', name: 'Philosophy', description: 'Why JS is the way it is' },
  { id: 'basics', name: 'Beginner Basics', description: 'Your first steps in JS' },
  { id: 'fundamentals', name: 'Fundamentals', description: 'Core JS basics' },
  { id: 'core', name: 'Core Mechanics', description: 'How JS really works' },
  { id: 'advanced', name: 'Advanced', description: 'Deep dive topics' },
  { id: 'runtime', name: 'Runtime Internals', description: 'How JS engines work' },
  { id: 'backend', name: 'Node.js', description: 'Server-side JavaScript' },
  { id: 'browser', name: 'Browser', description: 'Frontend rendering' },
]

// Related concepts mapping for internal linking (SEO)
const relatedConceptsMap: Record<string, string[]> = {
  // Philosophy & Basics
  'js-philosophy': ['variables', 'data-types', 'functions'],
  'variables': ['data-types', 'hoisting', 'js-philosophy'],
  'data-types': ['variables', 'operators', 'type-coercion'],
  'operators': ['data-types', 'conditionals', 'type-coercion'],
  'functions': ['variables', 'closures', 'this-keyword'],
  'conditionals': ['operators', 'loops', 'type-coercion'],
  'loops': ['conditionals', 'arrays-basics', 'functions'],
  'arrays-basics': ['loops', 'objects-basics', 'functions'],
  'objects-basics': ['arrays-basics', 'prototypes', 'this-keyword'],
  // Fundamentals
  'hoisting': ['variables', 'closures', 'this-keyword', 'memory-model'],
  'type-coercion': ['data-types', 'operators', 'hoisting'],
  // Core
  'closures': ['functions', 'hoisting', 'this-keyword', 'memory-model', 'recursion'],
  'this-keyword': ['functions', 'objects-basics', 'closures', 'prototypes'],
  'prototypes': ['objects-basics', 'this-keyword', 'closures', 'memory-model'],
  'recursion': ['functions', 'closures', 'memory-model', 'event-loop'],
  // Advanced
  'event-loop': ['this-keyword', 'nodejs-event-loop', 'web-workers'],
  // Runtime
  'memory-model': ['hoisting', 'closures', 'v8-engine', 'streams-buffers'],
  'v8-engine': ['memory-model', 'event-loop', 'nodejs-event-loop'],
  // Backend
  'nodejs-event-loop': ['event-loop', 'v8-engine', 'streams-buffers', 'web-workers'],
  'streams-buffers': ['memory-model', 'nodejs-event-loop'],
  // Browser
  'critical-render-path': ['event-loop', 'web-workers', 'memory-model'],
  'web-workers': ['event-loop', 'nodejs-event-loop', 'critical-render-path'],
}

export function getConceptById(id: string): Concept | undefined {
  return concepts.find(c => c.id === id)
}

export function getConceptsByCategory(category: string): Concept[] {
  return concepts.filter(c => c.category === category)
}

export function getRelatedConcepts(id: string): Concept[] {
  const relatedIds = relatedConceptsMap[id] || []
  return relatedIds
    .map(relatedId => concepts.find(c => c.id === relatedId))
    .filter((c): c is Concept => c !== undefined)
}
