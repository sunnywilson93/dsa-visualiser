// JavaScript Concepts - Interactive Learning Module

export interface ConceptExample {
  title: string
  code: string
  explanation: string
}

export interface ConceptQuestion {
  question: string
  answer: string
  difficulty: 'easy' | 'medium' | 'hard'
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
  relatedProblems?: string[]
  prerequisites?: string[]
  nextConcepts?: string[]
  interviewFrequency?: 'very-high' | 'high' | 'medium' | 'low'
  estimatedReadTime?: number
  commonQuestions?: ConceptQuestion[]
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

  // ===== PHASE 1: SCOPE & HOISTING (Granular Concepts) =====

  // 1.1 Scope Basics
  {
    id: 'scope-basics',
    title: 'Scope Basics: Global, Function & Block',
    category: 'fundamentals',
    difficulty: 'beginner',
    description: 'Scope determines where variables are accessible in your code. Think of scope as a series of nested containers - inner containers can see outward, but outer containers cannot see inward. JavaScript has three types of scope: global (everywhere), function (inside functions), and block (inside curly braces with let/const).',
    shortDescription: 'Where variables live and are accessible',
    estimatedReadTime: 6,
    interviewFrequency: 'very-high',
    prerequisites: ['variables'],
    nextConcepts: ['lexical-scope', 'hoisting-variables'],
    keyPoints: [
      'Global scope: Variables accessible from anywhere in the code',
      'Function scope: Variables declared with var inside a function',
      'Block scope: Variables declared with let/const inside {}',
      'Inner scopes can access outer scope variables (scope chain)',
      'Outer scopes cannot access inner scope variables',
      'Variables are looked up through the scope chain until found',
    ],
    examples: [
      {
        title: 'Global Scope Access',
        code: `// Global variable - accessible everywhere
const globalVar = "I'm global";

function myFunction() {
  console.log(globalVar); // ✅ Works!
  return globalVar;
}

myFunction(); // "I'm global"
console.log(globalVar); // "I'm global"`,
        explanation: 'Global variables can be accessed from any function or block',
      },
      {
        title: 'Function Scope with var',
        code: `function outer() {
  var functionScoped = "I'm function scoped";
  
  if (true) {
    var alsoFunctionScoped = "I leak out!";
    console.log(functionScoped); // ✅ Works!
  }
  
  console.log(alsoFunctionScoped); // ✅ "I leak out!" - var ignores { }
}

outer();
// console.log(functionScoped); // ❌ Error! Not accessible outside`,
        explanation: 'var is function-scoped, not block-scoped. It ignores curly braces inside functions.',
      },
      {
        title: 'Block Scope with let/const',
        code: `function demo() {
  if (true) {
    let blockScoped = "I'm block scoped";
    const alsoBlockScoped = "Me too!";
    
    console.log(blockScoped); // ✅ Works inside block
  }
  
  // console.log(blockScoped);     // ❌ Error! Block scoped
  // console.log(alsoBlockScoped); // ❌ Error! Block scoped
}

demo();`,
        explanation: 'let and const respect curly braces { } - they are block-scoped',
      },
      {
        title: 'Scope Chain Lookup',
        code: `const outer = "I'm outside";

function level1() {
  const level1Var = "I'm in level 1";
  
  function level2() {
    const level2Var = "I'm in level 2";
    
    console.log(outer);      // ✅ Found in global
    console.log(level1Var);  // ✅ Found in level1
    console.log(level2Var);  // ✅ Found in current scope
  }
  
  level2();
}

level1();`,
        explanation: 'JavaScript looks up through nested scopes until it finds the variable (scope chain)',
      },
      {
        title: 'Shadowing Variables',
        code: `const name = "Global";

function outer() {
  const name = "Outer"; // Shadows global "name"
  
  if (true) {
    const name = "Block"; // Shadows outer "name"
    console.log(name); // "Block" - uses closest scope
  }
  
  console.log(name); // "Outer" - outer function scope
}

outer();
console.log(name); // "Global" - global scope`,
        explanation: 'Inner variables with the same name "shadow" outer variables',
      },
    ],
    commonMistakes: [
      'Thinking all { } create scope (only with let/const)',
      'Assuming outer scopes can see inner scope variables',
      'Not understanding that var ignores block scope',
      'Creating accidental global variables by forgetting const/let/var',
    ],
    interviewTips: [
      'Explain scope as nested containers or bubbles',
      'Know the difference between function scope and block scope',
      'Be able to trace scope chain lookup',
      'Understand variable shadowing',
    ],
    commonQuestions: [
      {
        question: 'What are the three types of scope in JavaScript?',
        answer: 'Global scope (accessible everywhere), Function scope (variables declared inside functions with var), and Block scope (variables declared with let/const inside curly braces).',
        difficulty: 'easy',
      },
      {
        question: 'Can a function access variables from its outer scope?',
        answer: 'Yes! This is called the scope chain. Inner scopes can access outer scope variables, but outer scopes cannot access inner scope variables.',
        difficulty: 'easy',
      },
      {
        question: 'What is variable shadowing?',
        answer: 'When an inner scope declares a variable with the same name as an outer scope, the inner variable "shadows" (hides) the outer one within that scope.',
        difficulty: 'medium',
      },
    ],
  },

  // 1.2 Variable Hoisting
  {
    id: 'hoisting-variables',
    title: 'Variable Hoisting: var vs let vs const',
    category: 'fundamentals',
    difficulty: 'beginner',
    estimatedReadTime: 8,
    interviewFrequency: 'very-high',
    prerequisites: ['scope-basics', 'variables'],
    nextConcepts: ['temporal-dead-zone', 'hoisting-functions'],
    description: 'Hoisting is JavaScript\'s behavior of moving declarations to the top of their scope during the compilation phase. All variable declarations (var, let, const) are hoisted, but they behave very differently: var is initialized with undefined, while let and const are not initialized, creating the Temporal Dead Zone (TDZ). Understanding this difference is crucial for interview success.',
    shortDescription: 'How var, let, and const are hoisted differently',
    keyPoints: [
      'All declarations are hoisted to the top of their scope during compilation',
      'var declarations are hoisted AND initialized with undefined',
      'let and const declarations are hoisted but NOT initialized',
      'Accessing let/const before declaration throws ReferenceError (TDZ)',
      'typeof an undeclared variable returns "undefined", but typeof in TDZ throws',
      'const must be initialized at declaration time',
    ],
    examples: [
      {
        title: 'var Hoisting - Initialized with undefined',
        code: `console.log(x); // undefined (not an error!)
var x = 5;
console.log(x); // 5

// JavaScript interprets this as:
// var x;          // Declaration hoisted, initialized undefined
// console.log(x); // undefined
// x = 5;          // Assignment stays in place
// console.log(x); // 5`,
        explanation: 'var is hoisted and automatically set to undefined. No error when accessing before declaration.',
      },
      {
        title: 'let Hoisting - NOT Initialized (TDZ)',
        code: `// console.log(y); // ❌ ReferenceError! Cannot access before initialization
let y = 10;
console.log(y); // 10

// let IS hoisted, but not initialized
// The variable exists but has no value until declaration line`,
        explanation: 'let is hoisted but not initialized. Accessing it before declaration is the Temporal Dead Zone.',
      },
      {
        title: 'const Hoisting - Same as let',
        code: `// console.log(z); // ❌ ReferenceError! TDZ
const z = 20;
console.log(z); // 20

// const z;        // ❌ SyntaxError! Must initialize
// const z = 20;   // ✅ Correct`,
        explanation: 'const behaves like let for hoisting, but must be initialized at declaration',
      },
      {
        title: 'typeof Behavior - Key Difference',
        code: `// Undeclared variable
console.log(typeof undeclaredVar); // "undefined" (no error!)

// TDZ variable
// console.log(typeof tdzLet); // ❌ ReferenceError!
let tdzLet = 5;

// This proves let IS hoisted - typeof knows it exists!`,
        explanation: 'typeof behaves differently: undeclared = "undefined", TDZ = ReferenceError. This proves let IS hoisted.',
      },
      {
        title: 'Function Scope Hoisting with var',
        code: `function demo() {
  console.log(a); // undefined
  
  if (true) {
    var a = "I'm var in a block";
  }
  
  console.log(a); // "I'm var in a block"
}

demo();`,
        explanation: 'var is hoisted to the function scope, not block scope. It leaks out of the if block.',
      },
    ],
    commonMistakes: [
      'Thinking let/const are NOT hoisted (they are, just not initialized)',
      'Using variables before declaration and relying on hoisting',
      'Confusing the TDZ error with "variable not defined"',
      'Forgetting that var hoists to function scope, not block scope',
    ],
    interviewTips: [
      'Emphasize: ALL declarations are hoisted, initialization behavior differs',
      'Use the typeof test to prove let/const are hoisted',
      'Explain that TDZ is a ReferenceError, not undefined',
      'Know that var hoists with undefined, let/const don\'t initialize',
    ],
    commonQuestions: [
      {
        question: 'What is the output: console.log(x); var x = 5;',
        answer: 'undefined. var declarations are hoisted and initialized with undefined, so x exists but has no value yet.',
        difficulty: 'easy',
      },
      {
        question: 'What is the output: console.log(y); let y = 5;',
        answer: 'ReferenceError: Cannot access \'y\' before initialization. let is hoisted but not initialized - this is the Temporal Dead Zone.',
        difficulty: 'easy',
      },
      {
        question: 'Are let and const hoisted?',
        answer: 'Yes! They ARE hoisted to the top of their block scope. However, they are not initialized, creating the Temporal Dead Zone from the start of the block to the declaration line.',
        difficulty: 'medium',
      },
      {
        question: 'What is the Temporal Dead Zone?',
        answer: 'The time between entering a scope and the variable declaration line where a let/const variable exists but cannot be accessed. Accessing it throws a ReferenceError.',
        difficulty: 'medium',
      },
    ],
  },

  // 1.3 Function Hoisting
  {
    id: 'hoisting-functions',
    title: 'Function Hoisting: Declarations vs Expressions',
    category: 'fundamentals',
    difficulty: 'intermediate',
    estimatedReadTime: 7,
    interviewFrequency: 'high',
    prerequisites: ['hoisting-variables'],
    nextConcepts: ['lexical-scope'],
    description: 'Function declarations and function expressions behave very differently with hoisting. Function declarations are fully hoisted (both name and body), allowing you to call them before their definition. Function expressions follow variable hoisting rules - var function expressions are hoisted as undefined, while let/const function expressions are in the TDZ.',
    shortDescription: 'Why function declarations can be called before definition',
    keyPoints: [
      'Function declarations: fully hoisted (name + body)',
      'Function expressions: follow variable hoisting rules',
      'var function expressions: hoisted as undefined',
      'let/const function expressions: TDZ error if called early',
      'Arrow functions are expressions, not declarations',
      'Named function expressions are different from declarations',
    ],
    examples: [
      {
        title: 'Function Declaration - Fully Hoisted',
        code: `// Can call BEFORE definition!
sayHello(); // "Hello!" - Works!

function sayHello() {
  console.log("Hello!");
}

// The entire function is hoisted to the top
// This is why it works!`,
        explanation: 'Function declarations are fully hoisted - both the name and the function body move to the top',
      },
      {
        title: 'Function Expression with var',
        code: `// console.log(sayHi); // undefined
// sayHi();              // ❌ TypeError: sayHi is not a function

var sayHi = function() {
  console.log("Hi!");
};

sayHi(); // "Hi!" - Works after assignment

// JavaScript sees:
// var sayHi;           // Hoisted declaration
// console.log(sayHi);  // undefined
// sayHi();             // undefined is not callable!
// sayHi = function(){}; // Assignment happens here`,
        explanation: 'var function expressions are hoisted as undefined, so calling them before assignment throws TypeError',
      },
      {
        title: 'Function Expression with let',
        code: `// sayHey(); // ❌ ReferenceError! TDZ

let sayHey = function() {
  console.log("Hey!");
};

sayHey(); // "Hey!"

// Same TDZ behavior as any let variable`,
        explanation: 'let function expressions are in TDZ until the declaration line',
      },
      {
        title: 'Arrow Functions - Always Expressions',
        code: `// arrowFunc(); // ❌ ReferenceError! TDZ

const arrowFunc = () => {
  console.log("Arrow!");
};

arrowFunc(); // "Arrow!"

// Arrow functions are always expressions
// They follow variable hoisting rules`,
        explanation: 'Arrow functions are always function expressions, never declarations',
      },
      {
        title: 'Named Function Expression',
        code: `const factorial = function fact(n) {
  // 'fact' is available inside for recursion
  return n <= 1 ? 1 : n * fact(n - 1);
};

console.log(factorial(5)); // 120
// console.log(fact);      // ❌ Error! 'fact' is not available outside

// The name 'fact' is only available inside the function`,
        explanation: 'Named function expressions allow self-reference but the name is not available outside',
      },
    ],
    commonMistakes: [
      'Calling function expressions before their definition',
      'Thinking arrow functions are hoisted like declarations',
      'Using function declarations when conditional creation is needed',
      'Expecting named function expression names to be available outside',
    ],
    interviewTips: [
      'Clearly distinguish declarations vs expressions',
      'Remember: function declarations = fully hoisted, expressions = variable hoisting',
      'Arrow functions are always expressions',
      'Named function expressions help with debugging and recursion',
    ],
    commonQuestions: [
      {
        question: 'Can you call a function before it is declared?',
        answer: 'Only function declarations. Function declarations are fully hoisted. Function expressions (including arrow functions) cannot be called before their definition - they follow variable hoisting rules.',
        difficulty: 'easy',
      },
      {
        question: 'What is the difference between: function foo(){} and var foo = function(){}?',
        answer: 'function foo(){} is a declaration - fully hoisted (can call before). var foo = function(){} is an expression - hoisted as undefined, so calling before throws TypeError.',
        difficulty: 'medium',
      },
      {
        question: 'Are arrow functions hoisted?',
        answer: 'Arrow functions follow variable hoisting rules, not function declaration rules. If declared with const/let, they are in TDZ until declaration.',
        difficulty: 'medium',
      },
    ],
  },

  // 1.4 Temporal Dead Zone
  {
    id: 'temporal-dead-zone',
    title: 'Temporal Dead Zone (TDZ) Explained',
    category: 'fundamentals',
    difficulty: 'intermediate',
    estimatedReadTime: 9,
    interviewFrequency: 'high',
    prerequisites: ['hoisting-variables'],
    nextConcepts: ['lexical-scope'],
    description: 'The Temporal Dead Zone (TDZ) is the period between entering a scope and the actual declaration of a let or const variable. During this time, the variable exists but cannot be accessed. Accessing it throws a ReferenceError. The TDZ exists to catch programming errors early - it prevents accessing variables before they are declared, making code more predictable.',
    shortDescription: 'Why you cannot access let/const before declaration',
    keyPoints: [
      'TDZ = time from scope start to variable declaration',
      'Variables in TDZ exist but cannot be accessed',
      'Accessing TDZ variable throws ReferenceError (not undefined)',
      'typeof behaves differently in TDZ (throws vs returns "undefined")',
      'TDZ ends at the declaration line, not initialization',
      'TDZ applies to let, const, and class declarations',
    ],
    examples: [
      {
        title: 'Basic TDZ Example',
        code: `{
  // TDZ starts here (beginning of block)
  
  // console.log(value); // ❌ ReferenceError!
  
  let value = 10; // TDZ ends here
  
  console.log(value); // ✅ 10
}`,
        explanation: 'From the opening { to the let declaration is the TDZ',
      },
      {
        title: 'typeof in TDZ vs Undeclared',
        code: `// Undeclared variable
console.log(typeof notDeclared); // "undefined" - no error

// TDZ variable
{
  // console.log(typeof tdzVar); // ❌ ReferenceError!
  let tdzVar = 5;
}

// This difference proves let IS hoisted!`,
        explanation: 'typeof of undeclared returns "undefined" but typeof in TDZ throws. This proves the variable exists (hoisted) but is not accessible.',
      },
      {
        title: 'TDZ in Default Parameters',
        code: `function example(a = b, b) {
  // Parameter 'a' default value tries to access 'b'
  // But 'b' is in TDZ at this point!
  console.log(a, b);
}

// example(1, 2);     // Works: a=1, b=2
// example(undefined, 2); // ❌ ReferenceError! b is in TDZ

// Correct order:
function correct(b, a = b) {
  console.log(a, b); // ✅ Works!
}
correct(5); // a=5, b=5`,
        explanation: 'Default parameters have their own TDZ - cannot access later parameters',
      },
      {
        title: 'TDZ Across Function Calls',
        code: `const funcs = [];

for (let i = 0; i < 3; i++) {
  // Each iteration creates a new block scope
  // New i with its own TDZ
  funcs.push(function() {
    console.log(i);
  });
}

funcs[0](); // 0
funcs[1](); // 1  
funcs[2](); // 2

// With var, this would print 3, 3, 3!`,
        explanation: 'Each loop iteration creates a new block scope with its own TDZ - why let fixes the classic closure bug',
      },
      {
        title: 'Self-Reference TDZ',
        code: `// const x = x; // ❌ ReferenceError! x is in its own TDZ

// Cannot reference the variable being declared
// in its own initialization

// Valid with different scope
const y = (function() {
  const y = 10; // This is a different scope!
  return y;
})();`,
        explanation: 'A variable cannot reference itself during initialization - it is in its own TDZ',
      },
    ],
    commonMistakes: [
      'Thinking TDZ means the variable doesn\'t exist (it does!)',
      'Confusing TDZ ReferenceError with "variable not defined"',
      'Not realizing typeof behaves differently',
      'Using let/const variables in default parameter expressions of earlier parameters',
    ],
    interviewTips: [
      'Explain TDZ as "declared but not initialized"',
      'Use the typeof test to prove the variable exists',
      'Emphasize TDZ is a ReferenceError, not undefined',
      'Know that let solves the loop closure problem via TDZ',
    ],
    commonQuestions: [
      {
        question: 'What is the Temporal Dead Zone?',
        answer: 'The period between entering a scope and the variable declaration line where a let/const variable exists but cannot be accessed. Accessing it throws a ReferenceError.',
        difficulty: 'medium',
      },
      {
        question: 'Why does typeof return "undefined" for undeclared variables but throw for TDZ variables?',
        answer: 'This difference proves let/const ARE hoisted! The variable exists (so typeof knows about it) but is in TDZ. Undeclared variables truly don\'t exist, so typeof safely returns "undefined".',
        difficulty: 'hard',
      },
      {
        question: 'What happens with: let x = x?',
        answer: 'ReferenceError! The right-hand side x is evaluated while x is still in TDZ. A variable cannot reference itself during initialization.',
        difficulty: 'hard',
      },
    ],
  },

  // 1.5 Lexical Scope
  {
    id: 'lexical-scope',
    title: 'Lexical Scoping & Scope Chain',
    category: 'fundamentals',
    difficulty: 'intermediate',
    estimatedReadTime: 8,
    interviewFrequency: 'high',
    prerequisites: ['scope-basics', 'hoisting-variables'],
    nextConcepts: ['closure-definition'],
    description: 'Lexical scope means that scope is determined by where variables and functions are declared in the source code (at write time), not where they are called (at runtime). This creates a static scope chain that never changes. Understanding lexical scope is the foundation for understanding closures - a function always has access to the scope where it was defined, no matter where it is executed.',
    shortDescription: 'Scope is determined at write time, not runtime',
    keyPoints: [
      'Lexical = "where written" not "where called"',
      'Scope chain: inner scope → outer scope → global',
      'Variable lookup follows the scope chain until found',
      'Scope is static - doesn\'t change based on how function is called',
      'This is different from "this" binding which is dynamic',
      'Lexical scope enables closures',
    ],
    examples: [
      {
        title: 'Lexical vs Dynamic Scope',
        code: `const x = "global";

function outer() {
  const x = "outer";
  return inner;
}

function inner() {
  console.log(x); // "global" - looks at where DEFINED, not called!
}

const fn = outer();
fn(); // "global" - inner\'s scope is determined at definition

// With dynamic scope, this would print "outer"
// JavaScript uses lexical scope, not dynamic scope`,
        explanation: 'inner() uses the scope where it was defined, not where outer() was called',
      },
      {
        title: 'Scope Chain Lookup',
        code: `const a = "global-a";

function level1() {
  const b = "level1-b";
  
  function level2() {
    const c = "level2-c";
    
    console.log(a); // "global-a" - found in global
    console.log(b); // "level1-b" - found in level1
    console.log(c); // "level2-c" - found in current scope
  }
  
  level2();
}

level1();

// Lookup path for 'a': level2 → level1 → global ✅ Found!`,
        explanation: 'JavaScript walks up the scope chain looking for variables',
      },
      {
        title: 'Lexical Scope Never Changes',
        code: `function createFunction() {
  const message = "Hello from createFunction";
  
  return function() {
    console.log(message);
  };
}

const fn = createFunction();

// Even though createFunction has finished executing...
// fn still has access to its scope!
fn(); // "Hello from createFunction"

// The scope chain is fixed at definition time
// and preserved (closure)`,
        explanation: 'The returned function carries its lexical scope with it - this is closure',
      },
      {
        title: 'Shadowing with Lexical Scope',
        code: `const value = "global";

function outer() {
  const value = "outer";
  
  function inner() {
    // const value = "inner";
    console.log(value); // "outer" - finds nearest in scope chain
  }
  
  inner();
}

outer();`,
        explanation: 'Inner scope shadows outer scope - JavaScript finds the nearest definition in the lexical scope chain',
      },
      {
        title: 'Scope Chain vs This Binding',
        code: `const obj = {
  name: "Object",
  method: function() {
    console.log(this.name);    // "Object" - dynamic binding
    
    const arrow = () => {
      console.log(this.name);  // "Object" - arrow uses lexical this
    };
    arrow();
  }
};

const fn = obj.method;
fn(); // this.name = undefined (or global name)
      // But arrow still uses obj\'s scope

// Scope (lexical) ≠ this (dynamic)`,
        explanation: 'Scope is lexical (static), but this is dynamic. Arrow functions use lexical this.',
      },
    ],
    commonMistakes: [
      'Confusing lexical scope with dynamic scope',
      'Expecting scope to change based on where function is called',
      'Confusing scope chain with prototype chain',
      'Confusing scope with this binding',
    ],
    interviewTips: [
      'Emphasize: scope is determined at write time, this at runtime',
      'Trace scope chain explicitly in examples',
      'Contrast lexical scope with dynamic scope',
      'Connect lexical scope to closures',
    ],
    commonQuestions: [
      {
        question: 'What is lexical scoping?',
        answer: 'Lexical scoping means scope is determined by where variables/functions are declared in the source code (at write time), not where they are called (at runtime). The scope chain is static.',
        difficulty: 'medium',
      },
      {
        question: 'How does JavaScript look up variables?',
        answer: 'JavaScript follows the scope chain: it first looks in the current scope, then the outer scope, continuing up until it reaches the global scope. If not found, it throws ReferenceError.',
        difficulty: 'medium',
      },
      {
        question: 'What is the difference between lexical scope and this binding?',
        answer: 'Lexical scope is static (determined at write time). "this" is dynamic (determined at call time). Regular functions get dynamic this, arrow functions use lexical this.',
        difficulty: 'hard',
      },
    ],
  },

  // ===== END PHASE 1 =====

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

  // ===== PHASE 3: ARRAY MASTERY (Granular Concepts) =====

  // 3.1 Array Mutation Methods
  {
    id: 'array-mutation-methods',
    title: 'Array Mutation Methods: push, pop, splice, sort',
    category: 'basics',
    difficulty: 'beginner',
    estimatedReadTime: 8,
    interviewFrequency: 'medium',
    prerequisites: ['arrays-basics'],
    nextConcepts: ['array-iteration-methods'],
    description: 'Mutating methods modify the original array in place. Understanding which methods mutate (vs return new arrays) is crucial for preventing bugs. This concept covers push, pop, shift, unshift, splice, sort, reverse, and fill - all of which change the array they operate on.',
    shortDescription: 'Methods that modify arrays in place',
    keyPoints: [
      'Mutating methods change the original array',
      'push/pop work at end, shift/unshift work at beginning',
      'splice can add, remove, or replace elements at any position',
      'sort and reverse rearrange elements in place',
      'Return values vary: push returns new length, pop returns removed element',
      'Know time complexity: push/pop O(1), shift/unshift/splice O(n)',
    ],
    examples: [
      {
        title: 'push and pop (End Operations)',
        code: `const arr = [1, 2, 3];

// push - adds to end, returns new length
const newLength = arr.push(4, 5);
console.log(arr);        // [1, 2, 3, 4, 5]
console.log(newLength);  // 5

// pop - removes from end, returns removed element
const last = arr.pop();
console.log(last);       // 5
console.log(arr);        // [1, 2, 3, 4]

// O(1) time - very fast`,
        explanation: 'push and pop work at the end of array. O(1) time complexity.',
      },
      {
        title: 'shift and unshift (Beginning Operations)',
        code: `const arr = [2, 3, 4];

// unshift - adds to beginning, returns new length
const newLength = arr.unshift(1);
console.log(arr);        // [1, 2, 3, 4]
console.log(newLength);  // 4

// shift - removes from beginning, returns removed element
const first = arr.shift();
console.log(first);      // 1
console.log(arr);        // [2, 3, 4]

// O(n) time - must reindex all elements!`,
        explanation: 'shift and unshift work at the beginning. O(n) time - slower for large arrays.',
      },
      {
        title: 'splice - Swiss Army Knife',
        code: `const arr = ['a', 'b', 'c', 'd', 'e'];

// Remove elements
// splice(startIndex, deleteCount)
const removed = arr.splice(1, 2);  // Remove 2 elements starting at index 1
console.log(arr);      // ['a', 'd', 'e']
console.log(removed);  // ['b', 'c']

// Insert elements
arr.splice(1, 0, 'x', 'y');  // Insert at index 1, remove 0
console.log(arr);      // ['a', 'x', 'y', 'd', 'e']

// Replace elements
arr.splice(2, 1, 'z');  // Remove 1 at index 2, insert 'z'
console.log(arr);      // ['a', 'x', 'z', 'd', 'e']`,
        explanation: 'splice can remove, insert, or replace elements at any position. Returns removed elements.',
      },
      {
        title: 'sort and reverse',
        code: `const nums = [3, 1, 4, 1, 5];

// sort - sorts in place (converts to strings!)
nums.sort();
console.log(nums);  // [1, 1, 3, 4, 5] (lucky!)

// But wait...
const numbers = [10, 2, 30];
numbers.sort();
console.log(numbers);  // [10, 2, 30] - wrong! (sorted as strings)

// Correct numeric sort
numbers.sort((a, b) => a - b);
console.log(numbers);  // [2, 10, 30] - correct!

// reverse
nums.reverse();
console.log(nums);  // [5, 4, 3, 1, 1]`,
        explanation: 'sort() and reverse() mutate the array. sort() needs comparator for numbers.',
      },
    ],
    commonMistakes: [
      'Not realizing sort() converts to strings by default',
      'Using shift/unshift in performance-critical code (O(n))',
      'Forgetting that splice changes the original array',
      'Expecting sort() to return a new array',
    ],
    interviewTips: [
      'Know which methods mutate vs return new arrays',
      'Understand O(1) vs O(n) performance implications',
      'Remember sort() default string comparison',
      'Know how to properly sort numbers',
    ],
    commonQuestions: [
      {
        question: 'What is the time complexity of push vs shift?',
        answer: 'push/pop are O(1) - constant time at the end. shift/unshift are O(n) - must reindex all elements when adding/removing at the beginning.',
        difficulty: 'medium',
      },
      {
        question: 'Why is [10, 2, 1].sort() returning [1, 10, 2]?',
        answer: 'sort() converts elements to strings by default. "10" comes before "2" lexicographically. Use sort((a, b) => a - b) for numeric sorting.',
        difficulty: 'medium',
      },
    ],
  },

  // 3.2 Array Iteration Methods
  {
    id: 'array-iteration-methods',
    title: 'Array Iteration: forEach, map, filter, find',
    category: 'basics',
    difficulty: 'intermediate',
    estimatedReadTime: 12,
    interviewFrequency: 'very-high',
    prerequisites: ['array-mutation-methods', 'functions'],
    nextConcepts: ['array-reduce-patterns'],
    description: 'Array iteration methods provide powerful, declarative ways to process arrays without manual loops. Each method has a specific purpose: forEach for side effects, map for transformation, filter for selection, find for searching, some/every for testing. Understanding when to use each is essential for writing clean, functional JavaScript.',
    shortDescription: 'Declarative array processing methods',
    keyPoints: [
      'forEach - executes function for each element, returns undefined',
      'map - transforms each element, returns new array',
      'filter - keeps elements passing test, returns new array',
      'find - returns first element passing test, or undefined',
      'findIndex - returns index of first match, or -1',
      'some - returns true if ANY element passes test',
      'every - returns true if ALL elements pass test',
    ],
    examples: [
      {
        title: 'forEach vs map',
        code: `const nums = [1, 2, 3];

// forEach - side effects, returns undefined
nums.forEach(n => console.log(n * 2));
// Logs: 2, 4, 6
// Returns: undefined

// map - transforms, returns new array
const doubled = nums.map(n => n * 2);
console.log(doubled);  // [2, 4, 6]
console.log(nums);     // [1, 2, 3] (unchanged)

// Rule: Use map when you need a new array, forEach for side effects`,
        explanation: 'forEach for side effects (logs, external vars). map for transforming to new array.',
      },
      {
        title: 'filter - Selection',
        code: `const users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 17 },
  { name: 'Carol', age: 30 }
];

// Get adults
const adults = users.filter(user => user.age >= 18);
console.log(adults);
// [{ name: 'Alice', age: 25 }, { name: 'Carol', age: 30 }]

// Chaining: adults over 25
const over25 = users
  .filter(u => u.age >= 18)
  .filter(u => u.age > 25);

// Or with single filter
const over25b = users.filter(u => u.age >= 18 && u.age > 25);`,
        explanation: 'filter keeps elements where callback returns truthy. Returns new array.',
      },
      {
        title: 'find and findIndex',
        code: `const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Carol' }
];

// find - returns first match, or undefined
const bob = users.find(u => u.name === 'Bob');
console.log(bob);  // { id: 2, name: 'Bob' }

const dave = users.find(u => u.name === 'Dave');
console.log(dave);  // undefined

// findIndex - returns index, or -1
const bobIndex = users.findIndex(u => u.name === 'Bob');
console.log(bobIndex);  // 1

// Use case: find then update (if found)
const user = users.find(u => u.id === 2);
if (user) {
  user.name = 'Bobby';  // Mutates original!
}`,
        explanation: 'find returns the element, findIndex returns the index. Both stop at first match.',
      },
      {
        title: 'some and every',
        code: `const scores = [85, 92, 78, 95];

// some - true if ANY pass
const hasHighScore = scores.some(s => s >= 90);
console.log(hasHighScore);  // true

// every - true if ALL pass
const allPassed = scores.every(s => s >= 70);
console.log(allPassed);  // true

// Practical: validation
const users = [
  { name: 'Alice', email: 'alice@test.com' },
  { name: 'Bob', email: null }
];

const allHaveEmail = users.every(u => u.email);
const anyMissingEmail = users.some(u => !u.email);`,
        explanation: 'some returns true if any element passes. every returns true if all pass.',
      },
    ],
    commonMistakes: [
      'Using forEach when map/filter would be cleaner',
      'Forgetting that find returns undefined if not found',
      'Using map when forEach is intended (creates unused array)',
      'Trying to break out of forEach (cannot break)',
    ],
    interviewTips: [
      'Know when to use each method',
      'Understand map vs forEach distinction',
      'Know that find returns undefined, not null',
      'Be comfortable chaining methods',
    ],
    commonQuestions: [
      {
        question: 'What is the difference between map and forEach?',
        answer: 'map transforms each element and returns a new array. forEach executes a function for each element for side effects and returns undefined. Use map when you need the resulting array.',
        difficulty: 'easy',
      },
      {
        question: 'What does find() return if no element matches?',
        answer: 'undefined. This is important to handle in your code.',
        difficulty: 'easy',
      },
      {
        question: 'Can you break out of a forEach loop?',
        answer: 'No. forEach always iterates through all elements. Use a regular for loop, for...of, or some()/every() if you need early termination.',
        difficulty: 'medium',
      },
    ],
  },

  // 3.3 Array.reduce() Mastery
  {
    id: 'array-reduce-patterns',
    title: 'Mastering Array.reduce()',
    category: 'fundamentals',
    difficulty: 'advanced',
    estimatedReadTime: 15,
    interviewFrequency: 'high',
    prerequisites: ['array-iteration-methods'],
    nextConcepts: ['array-searching'],
    description: 'Array.reduce() is the most powerful and versatile array method. It transforms an array into any value type: number, string, object, array, or even another function. Mastering reduce patterns is essential for functional programming and many interview problems. This concept covers common patterns: sum, groupBy, flatten, pipe, and count.',
    shortDescription: 'Transform arrays into any value type',
    keyPoints: [
      'reduce((accumulator, current) => newAccumulator, initialValue)',
      'Can transform array into any type (number, object, array, etc.)',
      'Always provide initial value to avoid bugs',
      'Common patterns: sum, groupBy, flatten, pipe, count',
      'Can replace map+filter chains for single pass',
      'More powerful but less readable than specialized methods',
    ],
    examples: [
      {
        title: 'Sum and Product',
        code: `const nums = [1, 2, 3, 4, 5];

// Sum
const sum = nums.reduce((acc, n) => acc + n, 0);
console.log(sum);  // 15

// Product
const product = nums.reduce((acc, n) => acc * n, 1);
console.log(product);  // 120

// Maximum
const max = nums.reduce((acc, n) => n > acc ? n : acc, -Infinity);
console.log(max);  // 5

// Initial value is crucial!`,
        explanation: 'Basic reduce patterns. Always provide initial value.',
      },
      {
        title: 'groupBy Pattern',
        code: `const users = [
  { name: 'Alice', city: 'NYC' },
  { name: 'Bob', city: 'LA' },
  { name: 'Carol', city: 'NYC' }
];

// Group by city
const grouped = users.reduce((acc, user) => {
  const key = user.city;
  if (!acc[key]) {
    acc[key] = [];
  }
  acc[key].push(user);
  return acc;
}, {});

console.log(grouped);
// {
//   NYC: [{ name: 'Alice', city: 'NYC' }, { name: 'Carol', city: 'NYC' }],
//   LA: [{ name: 'Bob', city: 'LA' }]
// }`,
        explanation: 'Most common reduce pattern: group array elements by a key.',
      },
      {
        title: 'Flatten Array',
        code: `const nested = [[1, 2], [3, 4], [5, 6]];

// Flatten one level
const flat = nested.reduce((acc, arr) => acc.concat(arr), []);
console.log(flat);  // [1, 2, 3, 4, 5, 6]

// Or with spread
const flat2 = nested.reduce((acc, arr) => [...acc, ...arr], []);

// Deep flatten (recursive)
const deepNested = [1, [2, [3, 4]], 5];

function deepFlatten(arr) {
  return arr.reduce((acc, val) => 
    acc.concat(Array.isArray(val) ? deepFlatten(val) : val),
    []
  );
}

console.log(deepFlatten(deepNested));  // [1, 2, 3, 4, 5]`,
        explanation: 'Flatten nested arrays. For simple cases, use arr.flat() instead.',
      },
      {
        title: 'Count Occurrences',
        code: `const fruits = ['apple', 'banana', 'apple', 'orange', 'banana', 'apple'];

// Count each fruit
const counts = fruits.reduce((acc, fruit) => {
  acc[fruit] = (acc[fruit] || 0) + 1;
  return acc;
}, {});

console.log(counts);
// { apple: 3, banana: 2, orange: 1 }

// With nullish coalescing
const counts2 = fruits.reduce((acc, fruit) => {
  acc[fruit] = (acc[fruit] ?? 0) + 1;
  return acc;
}, {});`,
        explanation: 'Count frequency of elements. Very common interview pattern.',
      },
      {
        title: 'Pipeline (Function Composition)',
        code: `// Compose functions left to right
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);

// Usage
const add5 = x => x + 5;
const multiply2 = x => x * 2;
const toString = x => String(x);

const transform = pipe(add5, multiply2, toString);

console.log(transform(3));  // "16"
// (3 + 5) * 2 = 16 -> "16"

// Equivalent to: toString(multiply2(add5(3)))`,
        explanation: 'Advanced: use reduce for function composition and pipelines.',
      },
    ],
    commonMistakes: [
      'Forgetting initial value (causes TypeError on empty array)',
      'Not returning accumulator in callback',
      'Using reduce when map/filter/find would be clearer',
      'Mutating the accumulator object incorrectly',
    ],
    interviewTips: [
      'Always provide initial value',
      'Know common patterns: sum, groupBy, flatten, count',
      'Be able to implement groupBy from scratch',
      'Understand reduce can create any data type',
    ],
    commonQuestions: [
      {
        question: 'Implement a groupBy function using reduce',
        answer: 'array.reduce((acc, item) => { const key = item[keyProp]; if (!acc[key]) acc[key] = []; acc[key].push(item); return acc; }, {})',
        difficulty: 'medium',
      },
      {
        question: 'What happens if you call reduce on an empty array without an initial value?',
        answer: 'TypeError: Reduce of empty array with no initial value. Always provide an initial value to avoid this.',
        difficulty: 'medium',
      },
      {
        question: 'Count the occurrences of each word in an array',
        answer: 'Use reduce with an object as accumulator: arr.reduce((acc, word) => { acc[word] = (acc[word] || 0) + 1; return acc; }, {})',
        difficulty: 'medium',
      },
    ],
  },

  // 3.4 Array Searching
  {
    id: 'array-searching',
    title: 'Finding Elements: indexOf, includes, find',
    category: 'basics',
    difficulty: 'intermediate',
    estimatedReadTime: 8,
    interviewFrequency: 'medium',
    prerequisites: ['array-iteration-methods'],
    nextConcepts: ['array-transformation'],
    description: 'JavaScript provides multiple ways to search arrays: indexOf/lastIndexOf for primitive searches, includes for presence checking, and find/findIndex for predicate-based searches. Understanding the differences between strict equality (for primitives) and reference equality (for objects) is crucial for correct array searching.',
    shortDescription: 'Search arrays by value or predicate',
    keyPoints: [
      'indexOf/lastIndexOf - search by value, returns index or -1',
      'includes - search by value, returns boolean',
      'find/findIndex - search by predicate function',
      'All use strict equality (===) for comparison',
      'Object comparison is by reference, not value',
      'find returns element, findIndex returns index',
    ],
    examples: [
      {
        title: 'indexOf and includes',
        code: `const fruits = ['apple', 'banana', 'cherry', 'banana'];

// indexOf - returns first match index or -1
console.log(fruits.indexOf('banana'));      // 1
console.log(fruits.indexOf('grape'));       // -1
console.log(fruits.lastIndexOf('banana'));  // 3

// includes - returns boolean
console.log(fruits.includes('apple'));   // true
console.log(fruits.includes('grape'));   // false

// From index
console.log(fruits.indexOf('banana', 2));  // 3 (start at index 2)

// NaN behavior (special case)
console.log([NaN].indexOf(NaN));      // -1 (bug!)
console.log([NaN].includes(NaN));     // true (fixed!)`,
        explanation: 'indexOf returns index, includes returns boolean. includes fixes NaN comparison.',
      },
      {
        title: 'Object Reference Problem',
        code: `const obj = { id: 1, name: 'Alice' };
const users = [obj, { id: 2, name: 'Bob' }];

// Searching by reference works
console.log(users.indexOf(obj));  // 0
console.log(users.includes(obj)); // true

// Searching by "equal value" does NOT work
const searchFor = { id: 1, name: 'Alice' };
console.log(users.indexOf(searchFor));  // -1
console.log(users.includes(searchFor)); // false

// Objects are compared by reference, not value!
console.log(obj === searchFor);  // false (different objects)`,
        explanation: 'Objects are compared by reference. Two objects with same properties are not equal.',
      },
      {
        title: 'find and findIndex with Objects',
        code: `const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Carol' }
];

// find - search by predicate
const bob = users.find(user => user.name === 'Bob');
console.log(bob);  // { id: 2, name: 'Bob' }

const dave = users.find(user => user.name === 'Dave');
console.log(dave);  // undefined

// findIndex
const bobIndex = users.findIndex(user => user.id === 2);
console.log(bobIndex);  // 1

// Practical: update if found
const targetId = 2;
const user = users.find(u => u.id === targetId);
if (user) {
  user.name = 'Bobby';
}`,
        explanation: 'Use find/findIndex with predicate functions to search objects by property values.',
      },
    ],
    commonMistakes: [
      'Using indexOf/includes to find objects by value (compares reference)',
      'Not handling undefined return from find()',
      'Forgetting that NaN !== NaN with indexOf',
      'Not using find when searching objects',
    ],
    interviewTips: [
      'Know indexOf vs includes difference',
      'Understand reference equality for objects',
      'Use find/findIndex for object searches',
      'Know the NaN indexOf bug',
    ],
    commonQuestions: [
      {
        question: 'Why does [{a: 1}].includes({a: 1}) return false?',
        answer: 'Objects are compared by reference, not value. {a: 1} === {a: 1} is false because they are different objects in memory. Use find() with a predicate to search by property values.',
        difficulty: 'medium',
      },
      {
        question: 'What is the difference between indexOf and findIndex?',
        answer: 'indexOf searches for a specific value using strict equality. findIndex searches using a predicate function, useful for finding objects by property values.',
        difficulty: 'easy',
      },
    ],
  },

  // 3.5 Array Transformation
  {
    id: 'array-transformation',
    title: 'Transforming Arrays: slice, concat, flat, join',
    category: 'basics',
    difficulty: 'intermediate',
    estimatedReadTime: 8,
    interviewFrequency: 'medium',
    prerequisites: ['array-iteration-methods'],
    nextConcepts: ['array-sorting'],
    description: 'Array transformation methods create new arrays or values from existing arrays without mutating the original. slice creates shallow copies, concat merges arrays, flat flattens nested structures, and join creates strings. These are essential tools for immutable array operations.',
    shortDescription: 'Non-mutating array transformations',
    keyPoints: [
      'slice(start, end) - extracts portion, returns new array',
      'concat(...arrays) - merges arrays, returns new array',
      'flat(depth) - flattens nested arrays',
      'flatMap(callback) - map + flat combined',
      'join(separator) - creates string from array',
      'All return new values (non-mutating)',
    ],
    examples: [
      {
        title: 'slice - Shallow Copy',
        code: `const arr = [1, 2, 3, 4, 5];

// Extract portion
const middle = arr.slice(1, 4);  // index 1 to 3 (end is exclusive)
console.log(middle);  // [2, 3, 4]

// Copy entire array (shallow)
const copy = arr.slice();
console.log(copy);  // [1, 2, 3, 4, 5]
console.log(copy === arr);  // false (different array)

// Last N elements
const last3 = arr.slice(-3);
console.log(last3);  // [3, 4, 5]

// Original unchanged
console.log(arr);  // [1, 2, 3, 4, 5]`,
        explanation: 'slice extracts a portion without mutating. Use slice() for shallow copy.',
      },
      {
        title: 'concat vs Spread',
        code: `const arr1 = [1, 2];
const arr2 = [3, 4];

// concat
const combined = arr1.concat(arr2, [5, 6]);
console.log(combined);  // [1, 2, 3, 4, 5, 6]

// Spread syntax (modern, preferred)
const combined2 = [...arr1, ...arr2, 5, 6];
console.log(combined2);  // [1, 2, 3, 4, 5, 6]

// Originals unchanged
console.log(arr1);  // [1, 2]
console.log(arr2);  // [3, 4]`,
        explanation: 'concat merges arrays. Spread syntax [...a, ...b] is modern equivalent.',
      },
      {
        title: 'flat - Flatten Nested Arrays',
        code: `const nested = [1, [2, 3], [[4, 5]], 6];

// flat(depth) - default depth 1
console.log(nested.flat());     // [1, 2, 3, [4, 5], 6]
console.log(nested.flat(2));    // [1, 2, 3, 4, 5, 6]
console.log(nested.flat(Infinity));  // Fully flattened

// Remove empty slots
const sparse = [1, , 3, , 5];  // Has holes
console.log(sparse.flat());  // [1, 3, 5] (holes removed)

// Practical: flatMap
const sentences = ['Hello world', 'Goodbye moon'];
const words = sentences.flatMap(s => s.split(' '));
console.log(words);  // ['Hello', 'world', 'Goodbye', 'moon']`,
        explanation: 'flat() flattens nested arrays. flatMap() = map() + flat(1).',
      },
      {
        title: 'join - Array to String',
        code: `const words = ['Hello', 'world', 'from', 'JS'];

// join(separator)
console.log(words.join());       // "Hello,world,from,JS" (default comma)
console.log(words.join(' '));    // "Hello world from JS"
console.log(words.join('-'));    // "Hello-world-from-JS"
console.log(words.join(''));     // "HelloworldfromJS"

// CSV format
const rows = [
  ['Name', 'Age'],
  ['Alice', '25'],
  ['Bob', '30']
];
const csv = rows.map(row => row.join(',')).join('\\n');
console.log(csv);
// Name,Age
// Alice,25
// Bob,30`,
        explanation: 'join() creates a string from array elements with specified separator.',
      },
    ],
    commonMistakes: [
      'Confusing slice (non-mutating) with splice (mutating)',
      'Thinking slice makes deep copies (it is shallow)',
      'Not understanding flat default depth is 1',
      'Using join without specifying separator',
    ],
    interviewTips: [
      'Know slice vs splice difference',
      'Understand shallow vs deep copy',
      'Know when to use flatMap',
      'Prefer spread over concat for simple cases',
    ],
    commonQuestions: [
      {
        question: 'What is the difference between slice and splice?',
        answer: 'slice(start, end) extracts a portion without mutating the original. splice(start, deleteCount, ...items) modifies the original array by removing/inserting elements and returns removed elements.',
        difficulty: 'easy',
      },
      {
        question: 'How do you make a copy of an array?',
        answer: 'Shallow copy: [...arr], arr.slice(), or Array.from(arr). Deep copy: structuredClone(arr) or JSON.parse(JSON.stringify(arr)) for JSON-serializable data.',
        difficulty: 'easy',
      },
    ],
  },

  // 3.6 Array Sorting
  {
    id: 'array-sorting',
    title: 'Sorting Arrays Correctly',
    category: 'fundamentals',
    difficulty: 'intermediate',
    estimatedReadTime: 10,
    interviewFrequency: 'high',
    prerequisites: ['array-mutation-methods'],
    nextConcepts: ['array-immutable-patterns'],
    description: 'Array sorting in JavaScript has a critical gotcha: the default sort() converts elements to strings! This causes unexpected behavior with numbers. Understanding comparator functions is essential for correct sorting. This concept covers numeric sorting, string sorting with locale awareness, object sorting by properties, and the new immutable toSorted() method.',
    shortDescription: 'Correct array sorting with comparators',
    keyPoints: [
      'sort() converts elements to strings by default!',
      'Comparator: (a, b) => negative if a < b, positive if a > b, 0 if equal',
      'Numeric sort: arr.sort((a, b) => a - b)',
      'String sort: use localeCompare for proper Unicode',
      'Object sort: compare object properties in comparator',
      'toSorted() ES2023 - immutable version',
    ],
    examples: [
      {
        title: 'The Number Sorting Trap',
        code: `const nums = [10, 2, 30, 1, 15];

// ❌ WRONG: Default sort (converts to strings!)
nums.sort();
console.log(nums);  // [1, 10, 15, 2, 30] - wrong!

// Why? String comparison: "10" < "2" (lexicographic)

// ✅ CORRECT: Numeric comparator
const nums2 = [10, 2, 30, 1, 15];
nums2.sort((a, b) => a - b);
console.log(nums2);  // [1, 2, 10, 15, 30] - correct!

// How comparator works:
// if a - b < 0: a comes first
// if a - b > 0: b comes first
// if a - b === 0: keep order`,
        explanation: 'sort() converts to strings. Always provide comparator for numbers: (a, b) => a - b',
      },
      {
        title: 'Descending Order',
        code: `const nums = [3, 1, 4, 1, 5];

// Descending: b - a (reverse order)
nums.sort((a, b) => b - a);
console.log(nums);  // [5, 4, 3, 1, 1]

// Or negate ascending
nums.sort((a, b) => -(a - b));

// Remember: positive result = b comes first`,
        explanation: 'For descending order, reverse the comparison: (a, b) => b - a',
      },
      {
        title: 'Sorting Objects by Property',
        code: `const users = [
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 },
  { name: 'Carol', age: 35 }
];

// Sort by age
users.sort((a, b) => a.age - b.age);
console.log(users.map(u => u.name));  // ['Bob', 'Alice', 'Carol']

// Sort by name (string)
users.sort((a, b) => a.name.localeCompare(b.name));
console.log(users.map(u => u.name));  // ['Alice', 'Bob', 'Carol']

// Multi-field sort (age desc, then name asc)
users.sort((a, b) => {
  if (b.age !== a.age) {
    return b.age - a.age;  // Age descending
  }
  return a.name.localeCompare(b.name);  // Name ascending
});`,
        explanation: 'Compare object properties in comparator. Use localeCompare for strings.',
      },
      {
        title: 'Immutable Sorting (ES2023)',
        code: `const original = [3, 1, 4, 1, 5];

// ❌ OLD: Mutates original
const sorted = [...original].sort((a, b) => a - b);

// ✅ NEW: toSorted() (ES2023)
const sorted2 = original.toSorted((a, b) => a - b);

console.log(original);   // [3, 1, 4, 1, 5] - unchanged!
console.log(sorted2);    // [1, 1, 3, 4, 5]

// Other immutable methods
const reversed = original.toReversed();
const spliced = original.toSpliced(1, 2, 'x', 'y');
const replaced = original.with(2, 'new');

// All return new arrays, leave original unchanged`,
        explanation: 'ES2023 adds toSorted(), toReversed(), toSpliced(), and with() for immutable array operations.',
      },
    ],
    commonMistakes: [
      'Using default sort() on numbers',
      'Forgetting sort mutates the original array',
      'Not using localeCompare for international strings',
      'Returning boolean from comparator instead of number',
    ],
    interviewTips: [
      'Always remember: default sort converts to strings!',
      'Know the numeric comparator: (a, b) => a - b',
      'Know how to sort objects by property',
      'Know about toSorted() for immutable sorting',
    ],
    commonQuestions: [
      {
        question: 'Why is [10, 2, 1].sort() returning [1, 10, 2]?',
        answer: 'sort() converts elements to strings by default. "10" comes before "2" in lexicographic order. Use nums.sort((a, b) => a - b) for numeric sorting.',
        difficulty: 'easy',
      },
      {
        question: 'Sort an array of objects by multiple fields',
        answer: 'In comparator, check primary field first. If equal, check secondary: users.sort((a, b) => { if (a.age !== b.age) return a.age - b.age; return a.name.localeCompare(b.name); })',
        difficulty: 'medium',
      },
      {
        question: 'What is the time complexity of Array.sort()?',
        answer: 'The ECMAScript spec requires O(n log n) time complexity. V8 (Chrome/Node) uses Timsort, which is O(n log n) but optimized for real-world data.',
        difficulty: 'hard',
      },
    ],
  },

  // 3.7 Immutable Array Patterns
  {
    id: 'array-immutable-patterns',
    title: 'Immutable Array Patterns (ES2023)',
    category: 'fundamentals',
    difficulty: 'intermediate',
    estimatedReadTime: 9,
    interviewFrequency: 'medium',
    prerequisites: ['array-sorting', 'array-transformation'],
    nextConcepts: [],
    description: 'Immutable array operations create new arrays instead of modifying the original. This is essential for functional programming, React state updates, and avoiding side effects. ES2023 added new immutable methods: toSorted(), toReversed(), toSpliced(), and with(). Learn patterns for adding, removing, and updating elements immutably.',
    shortDescription: 'Non-mutating array operations',
    keyPoints: [
      'Immutable operations return new arrays',
      'Spread operator [...arr] for shallow copies',
      'ES2023: toSorted(), toReversed(), toSpliced(), with()',
      'filter() for removing elements immutably',
      'map() for updating elements immutably',
      'slice() and spread for inserting elements',
    ],
    examples: [
      {
        title: 'ES2023 Immutable Methods',
        code: `const arr = [3, 1, 4, 1, 5];

// toSorted - immutable sort
const sorted = arr.toSorted((a, b) => a - b);
console.log(sorted);  // [1, 1, 3, 4, 5]
console.log(arr);     // [3, 1, 4, 1, 5] - unchanged!

// toReversed - immutable reverse
const reversed = arr.toReversed();
console.log(reversed);  // [5, 1, 4, 1, 3]

// toSpliced - immutable splice
const spliced = arr.toSpliced(1, 2, 'a', 'b');
console.log(spliced);  // [3, 'a', 'b', 1, 5]

// with - replace element at index
const replaced = arr.with(2, 'x');
console.log(replaced);  // [3, 1, 'x', 1, 5]`,
        explanation: 'ES2023 adds immutable versions of mutating methods. All return new arrays.',
      },
      {
        title: 'Add Elements Immutably',
        code: `const arr = [1, 2, 3];

// Add to end
const addEnd = [...arr, 4];
console.log(addEnd);  // [1, 2, 3, 4]

// Add to beginning
const addStart = [0, ...arr];
console.log(addStart);  // [0, 1, 2, 3]

// Insert at index
const insertAt2 = [...arr.slice(0, 2), 'x', ...arr.slice(2)];
console.log(insertAt2);  // [1, 2, 'x', 3]

// Or use toSpliced (ES2023)
const insertES2023 = arr.toSpliced(2, 0, 'x');
console.log(insertES2023);  // [1, 2, 'x', 3]`,
        explanation: 'Use spread with slice for immutable insertion at any position.',
      },
      {
        title: 'Remove Elements Immutably',
        code: `const arr = [1, 2, 3, 4, 5];

// Remove by value
const without3 = arr.filter(x => x !== 3);
console.log(without3);  // [1, 2, 4, 5]

// Remove by index
const removeAt2 = [...arr.slice(0, 2), ...arr.slice(3)];
console.log(removeAt2);  // [1, 2, 4, 5]

// Remove first
const [, ...rest] = arr;
console.log(rest);  // [2, 3, 4, 5]

// Remove last
const withoutLast = arr.slice(0, -1);
console.log(withoutLast);  // [1, 2, 3, 4]

// Or use toSpliced
const removedES2023 = arr.toSpliced(2, 1);  // Remove 1 element at index 2
console.log(removedES2023);  // [1, 2, 4, 5]`,
        explanation: 'Use filter to remove by value, slice/spread to remove by index.',
      },
      {
        title: 'Update Elements Immutably',
        code: `const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Carol' }
];

// Update one element
const updated = users.map(user =>
  user.id === 2
    ? { ...user, name: 'Bobby' }  // New object for changed item
    : user  // Unchanged reference
);

console.log(updated[1]);  // { id: 2, name: 'Bobby' }
console.log(users[1]);    // { id: 2, name: 'Bob' } - unchanged!

// Or use with() for simple arrays
const nums = [1, 2, 3, 4];
const newNums = nums.with(1, 99);
console.log(newNums);  // [1, 99, 3, 4]`,
        explanation: 'Use map to update elements, spreading to create new objects. with() for simple value replacement.',
      },
    ],
    commonMistakes: [
      'Using mutating methods when immutability is needed (React state)',
      'Creating deep copies when shallow is sufficient',
      'Not realizing spread is shallow (nested objects still shared)',
      'Using JSON.parse/stringify for deep copy (loses functions, dates)',
    ],
    interviewTips: [
      'Know ES2023 immutable methods',
      'Understand shallow vs deep copy',
      'Know patterns for add/remove/update immutably',
      'Know structuredClone() for deep copy',
    ],
    commonQuestions: [
      {
        question: 'How do you add an element to an array without mutating it?',
        answer: 'Use spread: [...arr, newElement] for end, [newElement, ...arr] for beginning, or [...arr.slice(0, i), element, ...arr.slice(i)] for middle. ES2023: arr.toSpliced(i, 0, element).',
        difficulty: 'easy',
      },
      {
        question: 'What is the difference between a shallow copy and a deep copy?',
        answer: 'Shallow copy creates new array but references same nested objects. Deep copy creates new array AND new nested objects. [...arr] is shallow. structuredClone(arr) creates deep copy.',
        difficulty: 'medium',
      },
    ],
  },

  // ===== END PHASE 3 =====

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

  // ===== PHASE 4: CLOSURE & PROTOTYPES (Granular Concepts) =====

  // 4.1 Closure Definition
  {
    id: 'closure-definition',
    title: 'What is a Closure?',
    category: 'fundamentals',
    difficulty: 'intermediate',
    estimatedReadTime: 8,
    interviewFrequency: 'very-high',
    prerequisites: ['lexical-scope'],
    nextConcepts: ['closure-practical-uses'],
    description: 'A closure is a function that has access to variables from its outer (enclosing) scope even after the outer function has returned. The closure "remembers" the environment in which it was created. This is possible because of lexical scoping - functions in JavaScript form closures. Understanding closures is fundamental to mastering JavaScript.',
    shortDescription: 'Functions that remember their outer scope',
    keyPoints: [
      'A closure is created when a function is defined inside another function',
      'The inner function maintains access to outer scope variables',
      'Variables are captured by reference, not by value',
      'Closures exist even without explicit return (all inner functions are closures)',
      'Lexical scope determines what variables a closure has access to',
    ],
    examples: [
      {
        title: 'Simple Closure',
        code: `function outer() {
  const message = "Hello from outer";
  
  function inner() {
    console.log(message); // Accesses outer variable
  }
  
  return inner;
}

const fn = outer();    // outer() finishes executing
fn();                  // "Hello from outer"

// inner() still has access to message!
// This is a closure.`,
        explanation: 'The inner function maintains access to outer variables even after outer() has returned.',
      },
      {
        title: 'Closure Captures Reference',
        code: `function createCounter() {
  let count = 0;
  
  return {
    increment() {
      count++;           // References outer count
      return count;
    },
    decrement() {
      count--;
      return count;
    },
    getValue() {
      return count;
    }
  };
}

const counter = createCounter();
console.log(counter.getValue());  // 0
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.decrement()); // 1

// count persists between calls!`,
        explanation: 'The returned object methods form closures over the count variable.',
      },
      {
        title: 'Every Function is a Closure',
        code: `const globalVar = "I'm global";

function example() {
  console.log(globalVar); // Accesses global scope
}

example(); // "I'm global"

// Even this is technically a closure!
// It has access to variables in its lexical scope (global)

function outer() {
  const outerVar = "I'm outer";
  
  function inner() {
    console.log(outerVar); // Closure
    console.log(globalVar); // Also a closure
  }
  
  inner(); // Both are closures
}

outer();`,
        explanation: 'Technically, every function in JavaScript is a closure because they all have access to their outer scope.',
      },
    ],
    commonMistakes: [
      'Thinking closures only happen with explicit returns',
      'Not understanding that variables are captured by reference',
      'Expecting closures to capture by value (like copies)',
    ],
    interviewTips: [
      'Use the "backpack" or "backpack" metaphor',
      'Explain that closures are formed at function definition, not execution',
      'Mention that all functions in JS are technically closures',
      'Be ready to trace what variables a closure has access to',
    ],
    commonQuestions: [
      {
        question: 'What is a closure in JavaScript?',
        answer: 'A closure is a function that has access to variables from its outer scope even after the outer function has returned. It "remembers" the environment where it was created.',
        difficulty: 'easy',
      },
      {
        question: 'When is a closure created?',
        answer: 'A closure is created when a function is defined inside another function. The inner function maintains a reference to the outer scope at the time of its definition.',
        difficulty: 'medium',
      },
    ],
  },

  // 4.2 Closure Practical Uses
  {
    id: 'closure-practical-uses',
    title: 'Practical Closure Patterns',
    category: 'fundamentals',
    difficulty: 'intermediate',
    estimatedReadTime: 10,
    interviewFrequency: 'high',
    prerequisites: ['closure-definition'],
    nextConcepts: ['closure-loops-classic'],
    description: 'Closures enable powerful patterns in JavaScript: data privacy (making variables private), function factories (creating functions with preset values), maintaining state in callbacks, and memoization (caching expensive computations). These patterns are used extensively in real-world code and frameworks.',
    shortDescription: 'Data privacy, factories, and stateful functions',
    keyPoints: [
      'Data privacy: closures hide variables from external access',
      'Function factories: create specialized functions with preset configuration',
      'State preservation: maintain state in event handlers and callbacks',
      'Memoization: cache expensive function results',
      'Module pattern: use IIFE + closure for encapsulation',
    ],
    examples: [
      {
        title: 'Data Privacy (Private Variables)',
        code: `function createBankAccount(initialBalance) {
  let balance = initialBalance;  // Private variable!
  
  return {
    deposit(amount) {
      if (amount > 0) {
        balance += amount;
        return balance;
      }
      return "Invalid amount";
    },
    withdraw(amount) {
      if (amount > 0 && amount <= balance) {
        balance -= amount;
        return balance;
      }
      return "Insufficient funds";
    },
    getBalance() {
      return balance;
    }
  };
}

const account = createBankAccount(100);
console.log(account.getBalance());  // 100
console.log(account.balance);       // undefined - private!
account.deposit(50);
console.log(account.getBalance());  // 150`,
        explanation: 'The balance variable is hidden from external access - only methods in the closure can access it.',
      },
      {
        title: 'Function Factory',
        code: `function makeMultiplier(factor) {
  // factor is captured in closure
  return function(number) {
    return number * factor;
  };
}

const double = makeMultiplier(2);
const triple = makeMultiplier(3);
const halve = makeMultiplier(0.5);

console.log(double(5));  // 10
console.log(triple(5));  // 15
console.log(halve(10));  // 5

// Each function has its own factor in closure`,
        explanation: 'Function factories create specialized functions with preset values captured in closure.',
      },
      {
        title: 'Once Function (Run Only Once)',
        code: `function once(fn) {
  let ran = false;
  let result;
  
  return function(...args) {
    if (!ran) {
      ran = true;
      result = fn.apply(this, args);
    }
    return result;
  };
}

const initialize = once(() => {
  console.log("Initializing...");
  return "Setup complete";
});

console.log(initialize()); // "Initializing...", "Setup complete"
console.log(initialize()); // "Setup complete" (no log)
console.log(initialize()); // "Setup complete" (no log)

// The ran variable is preserved in closure`,
        explanation: 'Closures can track state - in this case, whether a function has been called.',
      },
      {
        title: 'Memoization Pattern',
        code: `function memoize(fn) {
  const cache = {};  // Private cache
  
  return function(...args) {
    const key = JSON.stringify(args);
    
    if (key in cache) {
      console.log("Cache hit!");
      return cache[key];
    }
    
    console.log("Computing...");
    const result = fn.apply(this, args);
    cache[key] = result;
    return result;
  };
}

const expensive = memoize((n) => {
  console.log("Heavy computation...");
  return n * n;
});

console.log(expensive(5));  // Computing..., Heavy..., 25
console.log(expensive(5));  // Cache hit!, 25 (instant!)`,
        explanation: 'Closures maintain private cache to store expensive computation results.',
      },
    ],
    commonMistakes: [
      'Creating memory leaks by holding large objects in closures',
      'Not realizing closure variables are shared (not copied)',
      'Forgetting to clean up event listeners that use closures',
    ],
    interviewTips: [
      'Give concrete examples: data privacy, memoization, once function',
      'Explain the module pattern (IIFE + closure)',
      'Know when closures might cause memory leaks',
      'Show you understand practical applications',
    ],
    commonQuestions: [
      {
        question: 'How do you create private variables in JavaScript?',
        answer: 'Use closures. Define variables in an outer function, return an object with methods that access those variables. The variables are hidden from external code but accessible to the closure methods.',
        difficulty: 'medium',
      },
      {
        question: 'What is the module pattern?',
        answer: 'An IIFE (Immediately Invoked Function Expression) that returns an object with public methods. Private variables and functions are hidden in the closure. (function() { var private = 1; return { public: function() {} } })()',
        difficulty: 'medium',
      },
    ],
  },

  // 4.3 Closure in Loops (Classic Bug)
  {
    id: 'closure-loops-classic',
    title: 'The Infamous Loop Closure Bug',
    category: 'fundamentals',
    difficulty: 'intermediate',
    estimatedReadTime: 10,
    interviewFrequency: 'very-high',
    prerequisites: ['closure-practical-uses', 'hoisting-variables'],
    nextConcepts: ['closure-memory-leaks'],
    description: 'The loop closure bug is one of the most famous JavaScript interview questions. When creating closures inside a loop with var, all closures share the same variable reference. When the callbacks execute, they all see the final value of that variable. Understanding why this happens (var scoping vs block scoping) and how to fix it is essential.',
    shortDescription: 'Why var + closures in loops cause bugs',
    keyPoints: [
      'var is function-scoped, not block-scoped',
      'All closures in a var loop share the same variable reference',
      'By the time callbacks run, the loop has finished (i is final value)',
      'Fix 1: Use let instead of var (block-scoped, new binding each iteration)',
      'Fix 2: Use an IIFE to create a new scope',
      'Fix 3: Use forEach (new function scope each iteration)',
    ],
    examples: [
      {
        title: 'The Bug with var',
        code: `for (var i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i);
  }, 100);
}

// Expected: 0, 1, 2
// Actual: 3, 3, 3

// Why?
// 1. var i is function-scoped (one variable shared)
// 2. Loop runs immediately, i becomes 3
// 3. setTimeout callbacks execute later
// 4. All closures reference the SAME i (which is now 3)`,
        explanation: 'var creates one variable for the entire function. All closures share this same reference.',
      },
      {
        title: 'Fix 1: Use let (Block Scope)',
        code: `for (let i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i);
  }, 100);
}

// Output: 0, 1, 2 ✅

// Why?
// 1. let is block-scoped
// 2. Each iteration creates a NEW binding of i
// 3. Each closure captures its own i
// 4. TDZ ensures proper initialization

// JavaScript engine effectively does:
// {
//   let i = 0;
//   setTimeout(() => console.log(i), 100);
// }
// {
//   let i = 1;
//   setTimeout(() => console.log(i), 100);
// }
// ...`,
        explanation: 'let creates a new binding for each iteration, so each closure captures a different i.',
      },
      {
        title: 'Fix 2: IIFE (Old School)',
        code: `for (var i = 0; i < 3; i++) {
  (function(capturedI) {
    setTimeout(() => {
      console.log(capturedI);
    }, 100);
  })(i);
}

// Output: 0, 1, 2 ✅

// The IIFE creates a new scope
// capturedI is a parameter (new variable each call)
// Closure captures capturedI, not the outer i`,
        explanation: 'IIFE creates a new function scope, capturing the current value of i at each iteration.',
      },
      {
        title: 'Fix 3: forEach',
        code: `[0, 1, 2].forEach(i => {
  setTimeout(() => {
    console.log(i);
  }, 100);
});

// Output: 0, 1, 2 ✅

// forEach callback creates new scope
// Each iteration has its own i parameter
// No var scoping issues`,
        explanation: 'forEach creates a new function scope for each iteration, avoiding the var scoping problem.',
      },
    ],
    commonMistakes: [
      'Using var in loops with async operations or callbacks',
      'Not understanding why let fixes it',
      'Thinking the problem is with closures, not var scoping',
    ],
    interviewTips: [
      'This is the #1 closure interview question',
      'Explain both the problem (var scoping) and the solution (let)',
      'Know the IIFE fix for older code',
      'Understand TDZ helps with let in this case',
    ],
    commonQuestions: [
      {
        question: 'What is the output and why: for (var i = 0; i < 3; i++) { setTimeout(() => console.log(i), 100); }',
        answer: 'Output: 3, 3, 3. Because var is function-scoped, all closures share the same i. By the time setTimeout runs, the loop has finished and i is 3.',
        difficulty: 'medium',
      },
      {
        question: 'How do you fix the loop closure bug?',
        answer: '1) Use let instead of var (block-scoped, new binding per iteration). 2) Use an IIFE to capture current value. 3) Use forEach which creates new scope each iteration.',
        difficulty: 'medium',
      },
      {
        question: 'Why does let fix the loop closure problem?',
        answer: 'let is block-scoped. Each iteration of the loop creates a new binding (new variable) for i. Each closure captures its own i from that iteration\'s block scope.',
        difficulty: 'hard',
      },
    ],
  },

  // 4.4 Closure Memory Leaks
  {
    id: 'closure-memory-leaks',
    title: 'Closures & Memory Management',
    category: 'fundamentals',
    difficulty: 'advanced',
    estimatedReadTime: 8,
    interviewFrequency: 'medium',
    prerequisites: ['closure-practical-uses'],
    nextConcepts: ['closure-module-pattern'],
    description: 'Closures keep references to outer scope variables alive as long as the closure exists. This can lead to memory leaks if closures unintentionally hold large objects or DOM references that are no longer needed. Understanding when and how to release closures is important for long-running applications.',
    shortDescription: 'When closures prevent garbage collection',
    keyPoints: [
      'Closures keep outer scope variables alive',
      'Large objects captured in closures cannot be garbage collected',
      'Event listeners with closures can hold DOM references',
      'Remove event listeners when no longer needed',
      'Set variables to null when done to allow GC',
      'Use weak references (WeakMap/WeakSet) for cache-like structures',
    ],
    examples: [
      {
        title: 'Accidental Large Object Retention',
        code: `function processLargeData(data) {
  const hugeData = loadHugeDataset(); // 100MB
  
  return {
    getSmallResult() {
      // Only uses small part of hugeData
      return data.summary;
    }
  };
}

const result = processLargeData({ summary: "Done" });

// Problem: hugeData (100MB) is kept in memory
// because the closure in getSmallResult references it
// Even though it only uses data.summary!

// Fix: Only capture what you need
function processLargeDataFixed(data) {
  const hugeData = loadHugeDataset();
  const summary = hugeData.summary; // Extract what you need
  
  return {
    getSmallResult() {
      return summary; // Only captures summary, not hugeData
    }
  };
}`,
        explanation: 'Closures capture the entire outer scope. Extract only what you need to avoid retaining large objects.',
      },
      {
        title: 'Event Listener Leak',
        code: `function setupHandler() {
  const element = document.getElementById('button');
  const largeData = fetchLargeData();
  
  element.addEventListener('click', function handler() {
    console.log(largeData); // Closure captures largeData
  });
}

// Problem: Even if element is removed from DOM,
// the event listener keeps both element and largeData in memory!

// Fix: Remove listener when done
function setupHandlerFixed() {
  const element = document.getElementById('button');
  const largeData = fetchLargeData();
  
  function handler() {
    console.log(largeData);
  }
  
  element.addEventListener('click', handler);
  
  // Cleanup function
  return function cleanup() {
    element.removeEventListener('click', handler);
  };
}

const cleanup = setupHandlerFixed();
// Later...
cleanup(); // Releases closure and allows GC`,
        explanation: 'Event listeners with closures keep references alive. Always remove listeners when components are destroyed.',
      },
    ],
    commonMistakes: [
      'Creating closures that capture large unnecessary objects',
      'Not removing event listeners in SPAs when components unmount',
      'Using regular Map/Object for caches that should use WeakMap',
    ],
    interviewTips: [
      'Know that closures prevent garbage collection of captured variables',
      'Understand the event listener memory leak pattern',
      'Know about WeakMap/WeakSet for avoiding leaks',
      'Show awareness of cleanup in component lifecycles',
    ],
    commonQuestions: [
      {
        question: 'Can closures cause memory leaks?',
        answer: 'Yes. Closures keep references to outer scope variables, preventing garbage collection. If closures capture large objects or DOM references and are kept alive indefinitely (e.g., event listeners), it can cause memory leaks.',
        difficulty: 'medium',
      },
      {
        question: 'How do you prevent closure memory leaks with event listeners?',
        answer: 'Remove event listeners when components are destroyed using removeEventListener. In React, this is handled by useEffect cleanup. Alternatively, use AbortController or once: true option.',
        difficulty: 'medium',
      },
    ],
  },

  // 4.5 Module Pattern
  {
    id: 'closure-module-pattern',
    title: 'The Module Pattern (IIFE + Closure)',
    category: 'fundamentals',
    difficulty: 'advanced',
    estimatedReadTime: 10,
    interviewFrequency: 'medium',
    prerequisites: ['closure-practical-uses'],
    nextConcepts: ['closure-partial-application'],
    description: 'The Module Pattern uses an IIFE (Immediately Invoked Function Expression) combined with closures to create encapsulated modules with private and public members. This was the standard way to create modules before ES6 modules. It provides true privacy - unlike ES6 classes where "private" fields are merely conventions.',
    shortDescription: 'Encapsulation with IIFE and closures',
    keyPoints: [
      'IIFE creates a new scope that encapsulates private variables',
      'Return an object with public methods (closures)',
      'Private variables are truly private - no external access',
      'Before ES6 modules, this was the standard pattern',
      'Revealing Module Pattern: define all at top, return object at bottom',
    ],
    examples: [
      {
        title: 'Basic Module Pattern',
        code: `const counterModule = (function() {
  // Private variables
  let count = 0;
  const privateMethod = () => console.log("Private!");
  
  // Public API
  return {
    increment() {
      count++;
      return count;
    },
    decrement() {
      count--;
      return count;
    },
    getCount() {
      return count;
    }
  };
})();

console.log(counterModule.getCount());  // 0
counterModule.increment();
counterModule.increment();
console.log(counterModule.getCount());  // 2
console.log(counterModule.count);       // undefined (private!)

// The IIFE runs immediately, returns public API
// Private variables are hidden in closure`,
        explanation: 'IIFE creates scope, returns object with methods that form closures over private variables.',
      },
      {
        title: 'Revealing Module Pattern',
        code: `const myModule = (function() {
  // All declarations at the top
  let privateVar = 0;
  
  function privateMethod() {
    console.log("Private:", privateVar);
  }
  
  function publicMethod() {
    privateMethod();
  }
  
  function anotherPublic() {
    privateVar++;
  }
  
  // Reveal public API at the bottom
  return {
    doSomething: publicMethod,
    increment: anotherPublic,
    getValue: () => privateVar
  };
})();

myModule.doSomething();  // "Private: 0"
myModule.increment();
myModule.doSomething();  // "Private: 1"`,
        explanation: 'Revealing pattern: define functions with descriptive names, then return object mapping public names to them.',
      },
    ],
    commonMistakes: [
      'Not using parentheses around function in IIFE',
      'Trying to access private variables from outside',
      'Forgetting that each IIFE call creates separate scope',
    ],
    interviewTips: [
      'Know the IIFE syntax: (function() { ... })()',
      'Understand the difference between Module Pattern and ES6 modules',
      'Know that Module Pattern provides true privacy',
      'Show the Revealing Module Pattern variant',
    ],
    commonQuestions: [
      {
        question: 'What is the Module Pattern?',
        answer: 'A design pattern using an IIFE (Immediately Invoked Function Expression) that returns an object with public methods. Private variables and functions are hidden in the closure. Pattern: const Module = (function() { var private = 1; return { public: function() {} }; })();',
        difficulty: 'medium',
      },
      {
        question: 'How is the Module Pattern different from ES6 classes?',
        answer: 'Module Pattern provides true privacy via closures - private variables cannot be accessed from outside. ES6 classes have private fields (#private) which are newer, or rely on conventions (_private) in older code.',
        difficulty: 'medium',
      },
    ],
  },

  // 4.6 Partial Application
  {
    id: 'closure-partial-application',
    title: 'Partial Application & Currying',
    category: 'advanced',
    difficulty: 'advanced',
    estimatedReadTime: 12,
    interviewFrequency: 'medium',
    prerequisites: ['closure-practical-uses'],
    nextConcepts: [],
    description: 'Partial application fixes some arguments of a function, producing another function with fewer parameters. Currying transforms a function with multiple arguments into a sequence of functions each taking a single argument. These functional programming techniques leverage closures to create specialized functions and enable function composition patterns.',
    shortDescription: 'Fixing function arguments with closures',
    keyPoints: [
      'Partial application: fix some arguments, return function for rest',
      'Currying: f(a,b,c) => f(a)(b)(c)',
      'Both use closures to remember fixed arguments',
      'Useful for creating specialized functions',
      'Enables point-free style (tacit programming)',
    ],
    examples: [
      {
        title: 'Partial Application',
        code: `function partial(fn, ...fixedArgs) {
  return function(...remainingArgs) {
    return fn(...fixedArgs, ...remainingArgs);
  };
}

// Or with bind
function greet(greeting, name) {
  return \`\${greeting}, \${name}!\`;
}

const sayHello = partial(greet, "Hello");
const sayHi = greet.bind(null, "Hi");

console.log(sayHello("Alice"));  // "Hello, Alice!"
console.log(sayHi("Bob"));       // "Hi, Bob!"

// Practical: logger with prefix
function log(level, message) {
  console.log(\`[\${level}] \${message}\`);
}

const logError = partial(log, "ERROR");
const logInfo = partial(log, "INFO");

logError("File not found");  // [ERROR] File not found
logInfo("Server started");    // [INFO] Server started`,
        explanation: 'Partial application fixes some arguments, returning a function that takes the rest.',
      },
      {
        title: 'Currying',
        code: `// Transform f(a, b, c) to f(a)(b)(c)
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function(...nextArgs) {
        return curried.apply(this, args.concat(nextArgs));
      };
    }
  };
}

// Usage
const add = curry((a, b, c) => a + b + c);

console.log(add(1)(2)(3));  // 6
console.log(add(1, 2)(3));  // 6
console.log(add(1)(2, 3));  // 6
console.log(add(1, 2, 3));  // 6

// Create specialized functions
const add10 = add(10);
const add10and5 = add10(5);
console.log(add10and5(3));  // 18`,
        explanation: 'Currying transforms multi-argument functions into nested single-argument functions using closures.',
      },
    ],
    commonMistakes: [
      'Confusing partial application with currying',
      'Not handling this context when currying methods',
      'Over-engineering simple functions',
    ],
    interviewTips: [
      'Know the difference: partial fixes N args, curry transforms to single-arg chain',
      'Know bind() for simple partial application',
      'Show practical use cases (logging, validation)',
    ],
    commonQuestions: [
      {
        question: 'What is the difference between partial application and currying?',
        answer: 'Partial application fixes some arguments of a function, returning a function with fewer parameters. Currying transforms a multi-argument function into a chain of single-argument functions. Both use closures to remember arguments.',
        difficulty: 'hard',
      },
      {
        question: 'Implement a curry function',
        answer: 'function curry(fn) { return function curried(...args) { if (args.length >= fn.length) return fn(...args); return (...next) => curried(...args, ...next); }; }',
        difficulty: 'hard',
      },
    ],
  },

  // ===== PROTOTYPE SECTION =====

  // 4.7 Prototype Chain Basics
  {
    id: 'prototype-chain-basics',
    title: 'Prototype Chain Fundamentals',
    category: 'fundamentals',
    difficulty: 'intermediate',
    estimatedReadTime: 10,
    interviewFrequency: 'high',
    prerequisites: ['objects-basics'],
    nextConcepts: ['property-lookup'],
    description: 'Every JavaScript object has an internal link to another object called its prototype. When you access a property, JavaScript first looks on the object itself. If not found, it looks on the prototype, then the prototype\'s prototype, and so on up the chain until it finds the property or reaches null. This is the foundation of JavaScript\'s inheritance model.',
    shortDescription: 'How JS objects inherit from other objects',
    keyPoints: [
      'Every object has [[Prototype]] (access via __proto__ or Object.getPrototypeOf)',
      '__proto__ is the object it inherits from',
      '.prototype is a property of constructor functions only',
      'Property lookup walks up the prototype chain',
      'Object.prototype is at the top of most chains',
      'Object.create(proto) creates object with specific prototype',
    ],
    examples: [
      {
        title: '__proto__ vs .prototype',
        code: `// __proto__ is on ALL objects - points to prototype it inherits from
const obj = {};
obj.__proto__ === Object.prototype;  // true

// .prototype is only on constructor functions
function Person(name) {
  this.name = name;
}

Person.prototype.greet = function() {
  return "Hi, I'm " + this.name;
};

const alice = new Person("Alice");

// alice's __proto__ points to Person.prototype
alice.__proto__ === Person.prototype;  // true

// Person.prototype's __proto__ points to Object.prototype
Person.prototype.__proto__ === Object.prototype;  // true

// Visual chain:
// alice → Person.prototype → Object.prototype → null`,
        explanation: '__proto__ is the prototype link on instances. .prototype is the template object for instances created with new.',
      },
      {
        title: 'Object.create()',
        code: `const animal = {
  eats: true,
  walk() {
    console.log("Animal walks");
  }
};

// Create object with animal as prototype
const rabbit = Object.create(animal);
rabbit.jumps = true;

console.log(rabbit.jumps);  // true (own property)
console.log(rabbit.eats);   // true (from prototype)
rabbit.walk();              // "Animal walks" (from prototype)

// Check prototype
Object.getPrototypeOf(rabbit) === animal;  // true

// Visual:
// rabbit → animal → Object.prototype → null`,
        explanation: 'Object.create(proto) creates a new object with proto as its prototype.',
      },
      {
        title: 'The Prototype Chain',
        code: `const grandparent = { generation: 1 };
const parent = Object.create(grandparent);
parent.generation = 2;
const child = Object.create(parent);
child.generation = 3;

// Property lookup walks up the chain
console.log(child.generation);       // 3 (own property)
console.log(child.__proto__.generation);  // 2 (parent's)
console.log(child.__proto__.__proto__.generation);  // 1 (grandparent's)

// The chain:
// child → parent → grandparent → Object.prototype → null

// Setting always happens on the object itself
child.name = "Child";
console.log(parent.name);  // undefined (not inherited!)`,
        explanation: 'Property lookup walks up the chain. Property setting always creates on the object itself.',
      },
    ],
    commonMistakes: [
      'Confusing __proto__ with .prototype',
      'Thinking setting a property updates the prototype (it creates own property)',
      'Not understanding that Object.prototype is the root',
    ],
    interviewTips: [
      'Clearly distinguish __proto__ (instance) from .prototype (constructor property)',
      'Draw the prototype chain diagram',
      'Know that Object.create() sets __proto__',
      'Understand that setting properties creates own properties',
    ],
    commonQuestions: [
      {
        question: 'What is the difference between __proto__ and prototype?',
        answer: '__proto__ is the actual object that is used in the lookup chain (on instances). prototype is a property of constructor functions that is used as the __proto__ for instances created with new.',
        difficulty: 'medium',
      },
      {
        question: 'How do you create an object with a specific prototype?',
        answer: 'Use Object.create(proto): const child = Object.create(parent); This creates a new object with parent as its prototype.',
        difficulty: 'easy',
      },
    ],
  },

  // 4.8 Property Lookup
  {
    id: 'property-lookup',
    title: 'Property Lookup & Shadowing',
    category: 'fundamentals',
    difficulty: 'intermediate',
    estimatedReadTime: 8,
    interviewFrequency: 'medium',
    prerequisites: ['prototype-chain-basics'],
    nextConcepts: ['instanceof-operator'],
    description: 'When you access a property, JavaScript walks up the prototype chain until it finds the property or reaches null. Setting a property always creates or updates an own property on the object itself. When an object has a property with the same name as one on its prototype, the own property "shadows" (hides) the inherited one.',
    shortDescription: 'How JS finds properties on the chain',
    keyPoints: [
      'Get: Walk up prototype chain until found or null',
      'Set: Always creates/updates own property (never modifies prototype)',
      'Own property shadows inherited property with same name',
      'hasOwnProperty() checks only own properties',
      'in operator checks entire chain including prototypes',
    ],
    examples: [
      {
        title: 'Property Lookup Walk',
        code: `const proto = { x: 1, y: 2 };
const obj = Object.create(proto);
obj.x = 10;  // Own property

console.log(obj.x);  // 10 (own property)
console.log(obj.y);  // 2 (from prototype)
console.log(obj.z);  // undefined (not found)

// Lookup process for obj.y:
// 1. Check obj own properties - not found
// 2. Check obj.__proto__ (proto) - found y: 2
// 3. Return 2

// Lookup process for obj.z:
// 1. Check obj - not found
// 2. Check proto - not found
// 3. Check Object.prototype - not found
// 4. Check null - end of chain
// 5. Return undefined`,
        explanation: 'Getting walks up the chain. Setting creates own property.',
      },
      {
        title: 'Shadowing',
        code: `const parent = { name: "Parent", value: 100 };
const child = Object.create(parent);

child.name = "Child";  // Shadows parent.name

console.log(child.name);   // "Child" (own property)
console.log(parent.name);  // "Parent" (unchanged!)

// Setting never modifies the prototype
// It always creates an own property

// child.value = child.value + 1;
// This reads parent.value (100), adds 1, sets child.value to 101
// parent.value is still 100`,
        explanation: 'When an object has a property with the same name as its prototype, the own property shadows the inherited one.',
      },
      {
        title: 'hasOwnProperty vs in',
        code: `const parent = { inherited: true };
const child = Object.create(parent);
child.own = true;

// hasOwnProperty: only own properties
console.log(child.hasOwnProperty('own'));       // true
console.log(child.hasOwnProperty('inherited')); // false

// in operator: checks entire chain
console.log('own' in child);       // true
console.log('inherited' in child); // true
console.log('toString' in child);  // true (from Object.prototype)

// Iteration safety
for (let key in child) {
  if (child.hasOwnProperty(key)) {
    console.log(key);  // Only "own"
  }
}`,
        explanation: 'hasOwnProperty checks only own properties. in operator checks entire prototype chain.',
      },
    ],
    commonMistakes: [
      'Thinking setting a property updates the prototype',
      'Using for...in without hasOwnProperty check',
      'Not understanding that hasOwnProperty is different from in operator',
    ],
    interviewTips: [
      'Know the difference between hasOwnProperty and in',
      'Understand that setting always creates own property',
      'Know shadowing behavior',
      'Explain the lookup walk process',
    ],
    commonQuestions: [
      {
        question: 'What is the difference between hasOwnProperty and the in operator?',
        answer: 'hasOwnProperty checks if the property exists directly on the object (not inherited). The in operator checks the entire prototype chain, including inherited properties.',
        difficulty: 'easy',
      },
      {
        question: 'Does setting a property on an object modify its prototype?',
        answer: 'No. Setting a property always creates or updates an own property on the object itself. It never modifies the prototype. This is called shadowing when the property name exists on the prototype.',
        difficulty: 'medium',
      },
    ],
  },

  // 4.9 instanceof Operator
  {
    id: 'instanceof-operator',
    title: 'How instanceof Works',
    category: 'fundamentals',
    difficulty: 'intermediate',
    estimatedReadTime: 8,
    interviewFrequency: 'medium',
    prerequisites: ['prototype-chain-basics'],
    nextConcepts: ['class-syntax-prototypes'],
    description: 'The instanceof operator checks if an object appears in the prototype chain of another object. Specifically, object instanceof Constructor checks if Constructor.prototype exists anywhere in object\'s prototype chain. This is how JavaScript implements type checking for constructor-created objects.',
    shortDescription: 'Checking prototype chain membership',
    keyPoints: [
      'obj instanceof Constructor checks prototype chain',
      'Returns true if Constructor.prototype is in obj\'s chain',
      'Walks up __proto__ links looking for prototype property',
      'Does not work across iframes (different realms)',
      'Can be overridden with Symbol.hasInstance',
    ],
    examples: [
      {
        title: 'Basic instanceof',
        code: `function Animal(name) {
  this.name = name;
}

const dog = new Animal("Rex");

console.log(dog instanceof Animal);  // true
dog.__proto__ === Animal.prototype;  // true

// instanceof checks:
// Is Animal.prototype in dog's prototype chain?
// dog → Animal.prototype → Object.prototype → null
// Yes! Found at first link.

console.log(dog instanceof Object);  // true
// Object.prototype is also in the chain`,
        explanation: 'instanceof checks if the constructor\'s prototype property appears in the object\'s prototype chain.',
      },
      {
        title: 'Manual instanceof Implementation',
        code: `function myInstanceOf(obj, Constructor) {
  // Get the prototype we're looking for
  const targetPrototype = Constructor.prototype;
  
  // Walk up the prototype chain
  let current = Object.getPrototypeOf(obj);
  
  while (current !== null) {
    if (current === targetPrototype) {
      return true;
    }
    current = Object.getPrototypeOf(current);
  }
  
  return false;
}

function Animal() {}
const dog = new Animal();

console.log(myInstanceOf(dog, Animal));  // true
console.log(myInstanceOf(dog, Object));  // true`,
        explanation: 'instanceof walks up the prototype chain looking for the constructor\'s prototype property.',
      },
      {
        title: 'Cross-Realm Issue',
        code: `// In main window
const arr = [];
arr instanceof Array;  // true

// In iframe (different realm)
const iframe = document.createElement('iframe');
document.body.appendChild(iframe);
const iframeArray = iframe.contentWindow.Array;

const arr2 = new iframeArray();

// Problem: different realms have different Array constructors
arr2 instanceof Array;         // false!
arr2 instanceof iframeArray;   // true

// Solutions:
Array.isArray(arr2);           // true ✅ Works across realms
Object.prototype.toString.call(arr2); // "[object Array]"`,
        explanation: 'instanceof fails across iframes/windows because each realm has its own constructor functions.',
      },
    ],
    commonMistakes: [
      'Thinking instanceof checks the constructor that created the object',
      'Not realizing it fails across iframes',
      'Confusing it with typeof',
    ],
    interviewTips: [
      'Know that instanceof checks the prototype chain',
      'Understand the iframe limitation',
      'Know alternatives: Array.isArray(), Object.prototype.toString',
      'Be able to implement instanceof manually',
    ],
    commonQuestions: [
      {
        question: 'How does instanceof work?',
        answer: 'instanceof checks if the constructor\'s prototype property appears anywhere in the object\'s prototype chain. It walks up __proto__ links looking for a match.',
        difficulty: 'medium',
      },
      {
        question: 'Why does instanceof fail across iframes?',
        answer: 'Each iframe has its own global execution context with its own constructor functions (Array, Object, etc.). instanceof checks identity of prototype objects, and prototypes from different realms are different objects.',
        difficulty: 'hard',
      },
    ],
  },

  // 4.10 ES6 Classes as Prototype Sugar
  {
    id: 'class-syntax-prototypes',
    title: 'ES6 Classes: Prototype Sugar',
    category: 'fundamentals',
    difficulty: 'intermediate',
    estimatedReadTime: 10,
    interviewFrequency: 'high',
    prerequisites: ['prototype-chain-basics'],
    nextConcepts: ['prototype-inheritance'],
    description: 'ES6 classes are primarily syntactic sugar over JavaScript\'s existing prototype-based inheritance. The class syntax makes it easier to create constructor functions and manage prototypes, but under the hood, the same prototype mechanism is still at work. Understanding what class desugars to helps demystify how classes actually work in JavaScript.',
    shortDescription: 'What class syntax desugars to',
    keyPoints: [
      'class is syntactic sugar over constructor functions and prototypes',
      'constructor() method becomes the constructor function',
      'Methods are added to Class.prototype',
      'static methods become properties on the constructor',
      'typeof Class === "function"',
      'Class.prototype is the prototype for instances',
    ],
    examples: [
      {
        title: 'Class Desugaring',
        code: `// ES6 Class
class Person {
  constructor(name) {
    this.name = name;
  }
  
  greet() {
    return "Hello, I'm " + this.name;
  }
  
  static species() {
    return "Homo sapiens";
  }
}

// Desugars to:
function Person(name) {
  this.name = name;
}

Person.prototype.greet = function() {
  return "Hello, I'm " + this.name;
};

Person.species = function() {
  return "Homo sapiens";
};

// They are essentially the same!
console.log(typeof Person);  // "function"`,
        explanation: 'Classes desugar to constructor functions with prototype methods.',
      },
      {
        title: 'Prototype Chain with Classes',
        code: `class Animal {
  speak() {
    return "Some sound";
  }
}

class Dog extends Animal {
  speak() {
    return "Woof!";
  }
}

const dog = new Dog();

// The prototype chain:
// dog → Dog.prototype → Animal.prototype → Object.prototype → null

console.log(dog instanceof Dog);     // true
console.log(dog instanceof Animal);  // true
console.log(dog instanceof Object);  // true

// Same chain as manual prototype setup!`,
        explanation: 'extends sets up the same prototype chain as Object.create() manually.',
      },
      {
        title: 'Methods on Prototype',
        code: `class Counter {
  constructor() {
    this.count = 0;
  }
  
  increment() {
    this.count++;
  }
}

const c1 = new Counter();
const c2 = new Counter();

// Methods are shared on prototype
console.log(c1.increment === c2.increment);  // true

// Same as:
// Counter.prototype.increment = function() { ... }

// This is efficient - one method object shared by all instances`,
        explanation: 'Class methods are added to the prototype, shared across all instances.',
      },
    ],
    commonMistakes: [
      'Thinking classes are not based on prototypes',
      'Not realizing typeof Class is "function"',
      'Thinking classes provide true privacy (private fields are newer)',
    ],
    interviewTips: [
      'Know that classes are syntactic sugar',
      'Be able to desugar a simple class',
      'Understand the prototype chain is the same',
      'Know that methods are shared on prototype',
    ],
    commonQuestions: [
      {
        question: 'Are ES6 classes just syntactic sugar?',
        answer: 'Mostly yes. Classes desugar to constructor functions with prototype methods. However, classes have some differences: they must be called with new, methods are non-enumerable, and class declarations are not hoisted.',
        difficulty: 'medium',
      },
      {
        question: 'What does a class desugar to?',
        answer: 'A constructor function. The constructor() method becomes the function body. Instance methods become properties on Constructor.prototype. Static methods become properties on the constructor function itself.',
        difficulty: 'medium',
      },
    ],
  },

  // 4.11 Classical Inheritance in JS
  {
    id: 'prototype-inheritance',
    title: 'Classical Inheritance in JavaScript',
    category: 'fundamentals',
    difficulty: 'advanced',
    estimatedReadTime: 12,
    interviewFrequency: 'medium',
    prerequisites: ['class-syntax-prototypes'],
    nextConcepts: ['prototype-pollution'],
    description: 'While JavaScript uses prototypal inheritance, you can implement classical inheritance patterns. Before ES6 classes, this was done with constructor functions and Object.create(). Understanding these patterns helps you understand how extends works under the hood and how to work with older codebases.',
    shortDescription: 'Constructor function inheritance patterns',
    keyPoints: [
      'Subclass.prototype = Object.create(Superclass.prototype)',
      'Call parent constructor: Superclass.call(this, args)',
      'Fix constructor property after setting prototype',
      'ES6 extends handles this automatically',
      'Understanding the pattern helps debug older code',
    ],
    examples: [
      {
        title: 'Manual Inheritance Pattern',
        code: `function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function() {
  return this.name + " makes a sound";
};

// Dog inherits from Animal
function Dog(name, breed) {
  // Call parent constructor
  Animal.call(this, name);
  this.breed = breed;
}

// Set up prototype chain
Dog.prototype = Object.create(Animal.prototype);

// Fix constructor property
Dog.prototype.constructor = Dog;

// Add Dog-specific method
Dog.prototype.speak = function() {
  return this.name + " barks";
};

const dog = new Dog("Rex", "German Shepherd");
console.log(dog.speak());  // "Rex barks"
console.log(dog instanceof Dog);     // true
console.log(dog instanceof Animal);  // true`,
        explanation: 'Manual inheritance: call parent constructor, set prototype with Object.create(), fix constructor.',
      },
      {
        title: 'ES6 Equivalent',
        code: `class Animal {
  constructor(name) {
    this.name = name;
  }
  
  speak() {
    return this.name + " makes a sound";
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);  // Calls parent constructor
    this.breed = breed;
  }
  
  speak() {
    return this.name + " barks";
  }
}

const dog = new Dog("Rex", "German Shepherd");

// extends desugars to the manual pattern above
// super() desugars to Animal.call(this, name)`,
        explanation: 'ES6 class extends handles all the manual prototype setup automatically.',
      },
    ],
    commonMistakes: [
      'Forgetting to call parent constructor',
      'Not setting Dog.prototype.constructor back to Dog',
      'Using Dog.prototype = new Animal() instead of Object.create()',
    ],
    interviewTips: [
      'Know the manual inheritance pattern',
      'Understand what extends desugars to',
      'Know why Object.create() is preferred over new Parent()',
      'Be able to set up inheritance without class syntax',
    ],
    commonQuestions: [
      {
        question: 'How do you implement inheritance without ES6 classes?',
        answer: '1) Create subclass constructor that calls parent with Parent.call(this, args). 2) Set Subclass.prototype = Object.create(Parent.prototype). 3) Fix Subclass.prototype.constructor = Subclass.',
        difficulty: 'hard',
      },
      {
        question: 'Why use Object.create() instead of new Parent() for the prototype?',
        answer: 'Object.create(Parent.prototype) creates an object with the correct prototype without calling the Parent constructor. new Parent() would call the constructor, which might have side effects or require arguments we do not have.',
        difficulty: 'hard',
      },
    ],
  },

  // 4.12 Prototype Pollution
  {
    id: 'prototype-pollution',
    title: 'Prototype Pollution Attacks',
    category: 'fundamentals',
    difficulty: 'advanced',
    estimatedReadTime: 10,
    interviewFrequency: 'medium',
    prerequisites: ['prototype-inheritance'],
    nextConcepts: [],
    description: 'Prototype pollution is a security vulnerability where an attacker manipulates the prototype chain to inject malicious properties. This can lead to denial of service, property injection, or even remote code execution. It commonly occurs when merging or cloning objects without proper key validation, especially with user-controlled input.',
    shortDescription: 'Security vulnerability via prototype manipulation',
    keyPoints: [
      'Attacker injects properties via __proto__, constructor, or prototype',
      'Affected operations: merge, clone, extend, deep assign',
      'Can affect all objects if Object.prototype is polluted',
      'Prevention: validate keys, use Object.create(null), freeze',
      'Famous in lodash merge, jQuery extend, etc.',
    ],
    examples: [
      {
        title: 'The Attack Vector',
        code: `// Vulnerable merge function
function merge(target, source) {
  for (let key in source) {
    if (typeof source[key] === 'object') {
      if (!target[key]) target[key] = {};
      merge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

// Attacker input
const malicious = JSON.parse('{ "__proto__": { "isAdmin": true } }');

const victim = {};
merge(victim, malicious);

// All objects now have isAdmin: true!
console.log({}.isAdmin);  // true 😱

// The attack:
// merge follows __proto__ and sets {}.__proto__.isAdmin
// This modifies Object.prototype!`,
        explanation: 'Attacker uses __proto__ key to inject properties onto Object.prototype, affecting all objects.',
      },
      {
        title: 'Prevention',
        code: `// Safe merge - skip dangerous keys
function safeMerge(target, source) {
  for (let key in source) {
    // Skip prototype pollution keys
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue;
    }
    
    if (typeof source[key] === 'object') {
      if (!target[key]) target[key] = {};
      safeMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

// Or use Object.create(null) for maps
const safeMap = Object.create(null);
safeMap["__proto__"] = "value";  // Just a property, not the prototype

// Or freeze Object.prototype
Object.freeze(Object.prototype);`,
        explanation: 'Prevent by: 1) Skipping dangerous keys, 2) Using Object.create(null), 3) Freezing Object.prototype.',
      },
    ],
    commonMistakes: [
      'Not validating keys in merge/clone functions',
      'Using user input directly in object property names',
      'Not knowing about Object.freeze(Object.prototype) as protection',
    ],
    interviewTips: [
      'Know what prototype pollution is',
      'Know the dangerous keys: __proto__, constructor, prototype',
      'Know prevention techniques',
      'Be aware of affected libraries (lodash < 4.17.12)',
    ],
    commonQuestions: [
      {
        question: 'What is prototype pollution?',
        answer: 'A security vulnerability where an attacker manipulates __proto__ to inject properties onto Object.prototype (or other prototypes). Since all objects inherit from Object.prototype, this affects all objects in the application.',
        difficulty: 'hard',
      },
      {
        question: 'How do you prevent prototype pollution?',
        answer: '1) Validate/skip dangerous keys (__proto__, constructor, prototype) in merge functions. 2) Use Object.create(null) for maps (no prototype). 3) Freeze Object.prototype. 4) Use structured cloning instead of JSON.parse for untrusted data.',
        difficulty: 'hard',
      },
    ],
  },

  // ===== END PHASE 4 =====

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

  // ===== PHASE 5: EVENT LOOP MASTERY (Granular Concepts) =====

  // 5.1 Call Stack Basics
  {
    id: 'call-stack-basics',
    title: 'The Call Stack Explained',
    category: 'fundamentals',
    difficulty: 'beginner',
    estimatedReadTime: 6,
    interviewFrequency: 'high',
    prerequisites: ['functions'],
    nextConcepts: ['javascript-runtime-model'],
    description: 'The call stack is JavaScript\'s mechanism for tracking function execution. It is a LIFO (Last In, First Out) data structure where function calls are pushed onto the stack when invoked and popped off when they return. Understanding the call stack is essential for debugging errors (stack traces) and understanding recursion limits.',
    shortDescription: 'How JS tracks function execution',
    keyPoints: [
      'Call stack is LIFO: Last In, First Out',
      'Functions are pushed when called, popped when return',
      'Stack overflow occurs with infinite recursion',
      'Stack traces show the path of execution',
      'JavaScript is single-threaded: one call stack',
    ],
    examples: [
      {
        title: 'Call Stack in Action',
        code: `function first() {
  console.log("First");
  second();
  console.log("First end");
}

function second() {
  console.log("Second");
  third();
  console.log("Second end");
}

function third() {
  console.log("Third");
}

first();

// Execution flow:
// 1. first() pushed → prints "First"
// 2. second() pushed → prints "Second"
// 3. third() pushed → prints "Third"
// 4. third() popped
// 5. second() prints "Second end", popped
// 6. first() prints "First end", popped

// Output: First, Second, Third, Second end, First end`,
        explanation: 'Functions are pushed onto stack when called, popped when complete. LIFO order.',
      },
      {
        title: 'Stack Overflow',
        code: `function infiniteRecursion() {
  infiniteRecursion(); // No base case!
}

// infiniteRecursion();
// RangeError: Maximum call stack size exceeded

// Each call adds to stack
// Stack has limited size (varies by engine)
// Eventually runs out of memory`,
        explanation: 'Infinite recursion causes stack overflow when the call stack exceeds its maximum size.',
      },
      {
        title: 'Reading Stack Traces',
        code: `function a() { b(); }
function b() { c(); }
function c() {
  throw new Error("Oops!");
}

// a();
// Error: Oops!
//   at c (line X)
//   at b (line Y)
//   at a (line Z)

// Stack trace shows the path:
// a called b, b called c, c threw error`,
        explanation: 'Stack traces show the sequence of function calls that led to an error.',
      },
    ],
    commonMistakes: [
      'Not realizing stack size is limited',
      'Creating deep recursion without base case',
      'Not understanding stack traces when debugging',
    ],
    interviewTips: [
      'Explain LIFO with a clear example',
      'Know what causes stack overflow',
      'Be able to read and interpret stack traces',
      'Know JavaScript is single-threaded (one stack)',
    ],
    commonQuestions: [
      {
        question: 'What is the call stack?',
        answer: 'A LIFO data structure that tracks function execution. Functions are pushed when called, popped when they return. JavaScript has one call stack because it is single-threaded.',
        difficulty: 'easy',
      },
      {
        question: 'What causes a stack overflow?',
        answer: 'Infinite or very deep recursion without proper base cases. Each function call adds to the stack, and when it exceeds the maximum size, a RangeError is thrown.',
        difficulty: 'easy',
      },
    ],
  },

  // 5.2 JavaScript Runtime Model
  {
    id: 'javascript-runtime-model',
    title: 'How the JS Engine + Web APIs Work',
    category: 'fundamentals',
    difficulty: 'intermediate',
    estimatedReadTime: 9,
    interviewFrequency: 'high',
    prerequisites: ['call-stack-basics'],
    nextConcepts: ['task-queue-macrotasks'],
    description: 'JavaScript runs in a runtime environment that includes the JS Engine (V8, SpiderMonkey, etc.) and Web APIs (provided by the browser or Node.js). The engine executes JavaScript code on the call stack, while Web APIs handle asynchronous operations like timers, DOM events, and network requests. Understanding how these components work together is key to understanding async JavaScript.',
    shortDescription: 'The components of the JS runtime',
    keyPoints: [
      'JS Engine: Heap (memory) + Call Stack (execution)',
      'Web APIs: setTimeout, fetch, DOM, etc. (provided by environment)',
      'Engine executes code on call stack',
      'Async operations are handed off to Web APIs',
      'Web APIs queue callbacks when operations complete',
      'Event loop coordinates between stack and queues',
    ],
    examples: [
      {
        title: 'The Runtime Components',
        code: `console.log("Start");

setTimeout(() => {
  console.log("Timeout callback");
}, 1000);

console.log("End");

// What happens:
// 1. "Start" logs (sync, on call stack)
// 2. setTimeout handed to Web API
//    - Browser starts 1s timer
//    - JavaScript continues immediately!
// 3. "End" logs (sync)
// 4. Call stack empty
// 5. 1 second passes...
// 6. Web API puts callback in queue
// 7. Event loop moves callback to stack
// 8. "Timeout callback" logs

// Output: Start, End, (1s delay), Timeout callback`,
        explanation: 'Async operations are handed to Web APIs. JavaScript continues executing without waiting.',
      },
      {
        title: 'setTimeout is Not Guaranteed Time',
        code: `setTimeout(() => {
  console.log("Timer done");
}, 100);

// Block the main thread for 200ms
const start = Date.now();
while (Date.now() - start < 200) {
  // Busy wait
}

console.log("Loop done");

// Output: Loop done, Timer done
// (not the other way around!)

// Why? The timer callback can only run
// when the call stack is empty.
// The busy loop blocks everything.`,
        explanation: 'setTimeout minimum delay, not guaranteed. Callback runs only when call stack is clear.',
      },
    ],
    commonMistakes: [
      'Thinking JavaScript is multi-threaded',
      'Expecting setTimeout to be precise timing',
      'Not understanding that Web APIs are external to JS engine',
    ],
    interviewTips: [
      'Draw the diagram: Stack, Web APIs, Queues, Event Loop',
      'Explain how async operations work without threads',
      'Know that setTimeout is "at least" the delay, not exactly',
    ],
    commonQuestions: [
      {
        question: 'Is JavaScript multi-threaded?',
        answer: 'No. JavaScript is single-threaded with one call stack. However, the runtime environment (browser/Node) provides Web APIs that operate independently, allowing asynchronous behavior without blocking the main thread.',
        difficulty: 'easy',
      },
      {
        question: 'Why is setTimeout not accurate?',
        answer: 'setTimeout specifies a minimum delay, not an exact time. The callback only runs when the call stack is empty and after the minimum delay has passed. If the main thread is busy, the callback waits longer.',
        difficulty: 'medium',
      },
    ],
  },

  // 5.3 Task Queue (Macrotasks)
  {
    id: 'task-queue-macrotasks',
    title: 'Task Queue: Macrotasks',
    category: 'fundamentals',
    difficulty: 'intermediate',
    estimatedReadTime: 8,
    interviewFrequency: 'high',
    prerequisites: ['javascript-runtime-model'],
    nextConcepts: ['microtask-queue'],
    description: 'The Task Queue (also called Macrotask Queue or Callback Queue) holds callbacks from Web APIs that are ready to execute. When a Web API operation completes (like a timer finishing), its callback is placed in the task queue. The event loop moves one task from this queue to the call stack when the stack is empty.',
    shortDescription: 'Queue for setTimeout, setInterval, I/O callbacks',
    keyPoints: [
      'Macrotasks: setTimeout, setInterval, I/O, UI rendering',
      'Callbacks queue here when Web APIs complete',
      'Event loop runs ONE macrotask per iteration',
      'Macrotasks yield between each other (browser can paint)',
    ],
    examples: [
      {
        title: 'Multiple setTimeout Order',
        code: `setTimeout(() => console.log("1"), 0);
setTimeout(() => console.log("2"), 0);
setTimeout(() => console.log("3"), 0);

console.log("Sync");

// Output: Sync, 1, 2, 3

// All three callbacks queue in order
// Event loop runs one per iteration
// (All with 0ms delay, so queue immediately)`,
        explanation: 'Multiple macrotasks queue in order. Event loop runs one per iteration.',
      },
      {
        title: 'Macrotask Priority',
        code: `setTimeout(() => console.log("Timeout"), 0);

Promise.resolve().then(() => console.log("Promise"));

console.log("Sync");

// Output: Sync, Promise, Timeout

// Promise queues as MICROTASK
// Microtasks run BEFORE next macrotask
// Even though both have "0 delay"`,
        explanation: 'Macrotasks run after all microtasks, even if queued first.',
      },
    ],
    commonMistakes: [
      'Thinking macrotasks run immediately when timer expires',
      'Not knowing the difference between macrotasks and microtasks',
    ],
    interviewTips: [
      'List macrotask sources: setTimeout, setInterval, I/O, events',
      'Know one macrotask per event loop iteration',
      'Contrast with microtask queue',
    ],
    commonQuestions: [
      {
        question: 'What are macrotasks?',
        answer: 'Callbacks from Web APIs like setTimeout, setInterval, I/O operations, and UI events. They queue in the Task Queue and the event loop runs one per iteration.',
        difficulty: 'medium',
      },
    ],
  },

  // 5.4 Microtask Queue
  {
    id: 'microtask-queue',
    title: 'Microtask Queue: Promises & queueMicrotask',
    category: 'fundamentals',
    difficulty: 'intermediate',
    estimatedReadTime: 10,
    interviewFrequency: 'very-high',
    prerequisites: ['task-queue-macrotasks'],
    nextConcepts: ['event-loop-tick'],
    description: 'The Microtask Queue is a special queue for high-priority asynchronous operations. Promises (.then, .catch, .finally), queueMicrotask(), and MutationObserver use this queue. The critical difference from macrotasks: the event loop drains the ENTIRE microtask queue before running any macrotask. This means microtasks always execute before the next macrotask, even if queued later.',
    shortDescription: 'Higher priority than macrotasks',
    keyPoints: [
      'Microtasks: Promises, queueMicrotask, MutationObserver',
      'Event loop drains ALL microtasks before next macrotask',
      'Microtasks can queue more microtasks (drained recursively)',
      'Always execute before next macrotask',
    ],
    examples: [
      {
        title: 'Promise vs setTimeout Priority',
        code: `console.log("1");

setTimeout(() => console.log("2"), 0);

Promise.resolve().then(() => console.log("3"));

console.log("4");

// Output: 1, 4, 3, 2

// Why 3 before 2?
// 1. Sync: 1, 4
// 2. Promise queues microtask
// 3. setTimeout queues macrotask
// 4. Event loop: Run ALL microtasks (3)
// 5. Then run one macrotask (2)`,
        explanation: 'Microtasks (Promises) run before macrotasks (setTimeout), regardless of order queued.',
      },
      {
        title: 'Chained Promises Queue Multiple Microtasks',
        code: `Promise.resolve()
  .then(() => {
    console.log("1");
    return Promise.resolve("2");
  })
  .then(v => console.log(v));

setTimeout(() => console.log("3"), 0);

console.log("0");

// Output: 0, 1, 2, 3

// Each .then() queues a microtask
// All microtasks drain before setTimeout`,
        explanation: 'Each Promise .then() queues a separate microtask. All run before any macrotask.',
      },
      {
        title: 'Microtask Starvation',
        code: `// DANGER: Infinite microtasks block everything
function infiniteMicrotasks() {
  Promise.resolve().then(() => {
    console.log("Microtask");
    infiniteMicrotasks(); // Queue another
  });
}

// infiniteMicrotasks();
// setTimeout(() => console.log("Never runs"), 0);

// The microtask queue never empties
// Macrotasks are starved forever`,
        explanation: 'Recursively queueing microtasks prevents macrotasks from ever running.',
      },
    ],
    commonMistakes: [
      'Thinking Promise.then() is like setTimeout',
      'Not knowing microtasks run before macrotasks',
      'Creating infinite microtask loops',
    ],
    interviewTips: [
      'Know the order: Sync → All Microtasks → One Macrotask',
      'Explain why Promise is faster than setTimeout',
      'Know that microtasks can starve macrotasks',
      'List microtask sources: Promises, queueMicrotask',
    ],
    commonQuestions: [
      {
        question: 'What is the difference between microtasks and macrotasks?',
        answer: 'Microtasks (Promises, queueMicrotask) have higher priority. The event loop drains ALL microtasks before running the next macrotask. Macrotasks (setTimeout, I/O) run one per iteration.',
        difficulty: 'medium',
      },
      {
        question: 'What is the output: setTimeout(() => console.log(1), 0); Promise.resolve().then(() => console.log(2)); console.log(3);',
        answer: '3, 2, 1. Sync code (3) runs first. Promise microtask (2) runs next. setTimeout macrotask (1) runs last.',
        difficulty: 'medium',
      },
    ],
  },

  // 5.5 Event Loop Tick
  {
    id: 'event-loop-tick',
    title: 'One Event Loop Cycle',
    category: 'fundamentals',
    difficulty: 'intermediate',
    estimatedReadTime: 9,
    interviewFrequency: 'high',
    prerequisites: ['microtask-queue'],
    nextConcepts: ['event-loop-starvation'],
    description: 'An event loop tick (or iteration) is one complete cycle of the event loop. Understanding exactly what happens in each tick is crucial for predicting the order of asynchronous code execution. One tick consists of: execute one macrotask, then drain all microtasks, then potentially render.',
    shortDescription: 'The complete event loop iteration',
    keyPoints: [
      '1. Execute one macrotask from task queue (if any)',
      '2. Drain ALL microtasks (execute until microtask queue empty)',
      '3. Render (if needed)',
      '4. Repeat',
      'If no macrotask, wait for one',
    ],
    examples: [
      {
        title: 'Complete Event Loop Order',
        code: `console.log("Script start");

setTimeout(() => console.log("setTimeout"), 0);

Promise.resolve()
  .then(() => console.log("Promise 1"))
  .then(() => console.log("Promise 2"));

console.log("Script end");

// Output:
// Script start
// Script end
// Promise 1
// Promise 2
// setTimeout

// Execution:
// 1. Run script (macrotask) → logs start, end
// 2. Drain microtasks → Promise 1, Promise 2
// 3. Next tick → setTimeout`,
        explanation: 'One tick = run macrotask, drain all microtasks, render if needed.',
      },
      {
        title: 'setTimeout 0 is Not Immediate',
        code: `Promise.resolve().then(() => console.log("Promise"));
setTimeout(() => console.log("setTimeout 0"), 0);

// Promise runs before setTimeout 0

// Why? Even with 0ms delay:
// 1. Promise queues microtask (runs this tick)
// 2. setTimeout queues macrotask (runs next tick)

// Microtasks always before next macrotask!`,
        explanation: 'Even setTimeout(..., 0) waits for the next tick, after all microtasks.',
      },
    ],
    commonMistakes: [
      'Thinking setTimeout(fn, 0) runs before Promise.then()',
      'Not understanding the one-macrotask-per-tick rule',
    ],
    interviewTips: [
      'Describe one complete tick: macrotask → all microtasks → render',
      'Know why setTimeout 0 is not immediate',
      'Be able to trace code execution order',
    ],
    commonQuestions: [
      {
        question: 'Describe one event loop tick',
        answer: '1) Execute one macrotask from the task queue. 2) Drain the entire microtask queue (run all microtasks, including any queued during step 1). 3) Render UI updates if needed. 4) Repeat.',
        difficulty: 'medium',
      },
    ],
  },

  // 5.6 Event Loop Starvation
  {
    id: 'event-loop-starvation',
    title: 'Event Loop Starvation',
    category: 'fundamentals',
    difficulty: 'advanced',
    estimatedReadTime: 7,
    interviewFrequency: 'medium',
    prerequisites: ['event-loop-tick'],
    nextConcepts: [],
    description: 'Event loop starvation occurs when one type of task blocks others from running. Infinite microtasks can starve macrotasks. Long-running synchronous code blocks everything. Understanding these scenarios helps prevent UI freezing and ensures responsive applications.',
    shortDescription: 'When tasks block the event loop',
    keyPoints: [
      'Infinite microtasks prevent macrotasks from running',
      'Long sync operations block the entire thread',
      'Use setTimeout(fn, 0) to yield control',
      'Break heavy work into chunks',
      'Use Web Workers for CPU-intensive tasks',
    ],
    examples: [
      {
        title: 'Microtask Starvation',
        code: `// This blocks forever!
function recursivePromise() {
  Promise.resolve().then(() => {
    console.log("Microtask");
    recursivePromise();
  });
}

// recursivePromise();
// setTimeout(() => console.log("Never!"), 0);

// The microtask queue never drains
// setTimeout never gets a chance`,
        explanation: 'Recursively queueing microtasks prevents macrotasks from ever executing.',
      },
      {
        title: 'Yielding with setTimeout',
        code: `// Bad: Blocks for 5 seconds
function heavyTask() {
  for (let i = 0; i < 1000000000; i++) {} // Blocks!
}

// Better: Break into chunks
function chunkedTask(i = 0) {
  if (i >= 1000000000) return;
  
  // Do chunk of work
  for (let j = 0; j < 1000; j++, i++) {}
  
  // Yield to event loop
  setTimeout(() => chunkedTask(i), 0);
}

// Now other code can run between chunks`,
        explanation: 'Use setTimeout to yield control between chunks of work.',
      },
    ],
    commonMistakes: [
      'Running heavy computation on main thread',
      'Creating infinite microtask loops',
      'Not yielding control in long operations',
    ],
    interviewTips: [
      'Know how to identify starvation scenarios',
      'Know solutions: setTimeout yielding, Web Workers',
      'Understand the recursive Promise problem',
    ],
    commonQuestions: [
      {
        question: 'What is event loop starvation?',
        answer: 'When one type of task (microtasks or long sync code) prevents other tasks from running. Example: infinite Promise chain prevents setTimeout callbacks from executing.',
        difficulty: 'medium',
      },
      {
        question: 'How do you prevent blocking the main thread?',
        answer: '1) Break work into chunks with setTimeout yielding. 2) Use Web Workers for CPU-intensive tasks. 3) Use requestIdleCallback for non-urgent work. 4) Avoid infinite microtask loops.',
        difficulty: 'medium',
      },
    ],
  },

  // ===== END PHASE 5 =====

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
  {
    id: 'build-tools-evolution',
    title: 'Evolution of Build Tools',
    category: 'advanced',
    difficulty: 'intermediate',
    description: 'JavaScript build tools have evolved from nothing to complex bundlers to lightning-fast native ESM tools. Understanding this history explains why we have Vite today and why it\'s so much faster than Webpack.',
    shortDescription: 'From script tags to Vite',
    keyPoints: [
      'No Build (1995): Script tags, manual ordering, FTP deploy',
      'Task Runners (2012): Grunt/Gulp automated concatenation and minification',
      'Module Bundlers (2014): Webpack enabled import/export in browsers',
      'Zero-Config (2017): CRA/Parcel hid complexity but were still slow',
      'Native ESM (2019): Vite/esbuild skip bundling in dev for 100x speed',
    ],
    examples: [
      {
        title: 'Era 1: No Build Step',
        code: `<!-- Just include scripts in order -->
<script src="lib/jquery.min.js"></script>
<script src="js/utils.js"></script>
<script src="js/app.js"></script>

<!-- Deploy: FTP to server -->`,
        explanation: 'Simple but manual. No modules, no optimization.',
      },
      {
        title: 'Era 2: Task Runners (Grunt/Gulp)',
        code: `// Gruntfile.js
grunt.initConfig({
  concat: { src: ['src/**/*.js'], dest: 'dist/bundle.js' },
  uglify: { src: 'dist/bundle.js', dest: 'dist/bundle.min.js' }
});
grunt.registerTask('build', ['concat', 'uglify']);`,
        explanation: 'Automated tasks but no module system.',
      },
      {
        title: 'Era 3: Webpack',
        code: `// webpack.config.js
module.exports = {
  entry: './src/index.js',
  output: { filename: '[name].[contenthash].js' },
  module: {
    rules: [
      { test: /\\.js$/, use: 'babel-loader' },
      { test: /\\.css$/, use: ['style-loader', 'css-loader'] }
    ]
  }
};`,
        explanation: 'Modules work! But config is complex and builds are slow.',
      },
      {
        title: 'Era 4: Vite (Native ESM)',
        code: `// vite.config.js - That's it!
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()]
});

// Dev: No bundling, native ES modules
// Build: Rollup for production`,
        explanation: 'No bundling in dev = instant startup and HMR.',
      },
    ],
    commonMistakes: [
      'Ejecting from CRA without understanding Webpack',
      'Not using code splitting for large apps',
      'Ignoring bundle size until production',
      'Using Webpack for new projects when Vite works',
    ],
    interviewTips: [
      'Explain why Vite is faster than Webpack in development',
      'Know the difference between dev and production builds',
      'Understand tree-shaking and how it reduces bundle size',
      'Be ready to discuss code splitting strategies',
      'Know what problems esbuild solves (100x faster transforms)',
    ],
  },
  // ============================================================================
  // Phase 1: JavaScript Deep Dive Concepts
  // ============================================================================

  // ===== PHASE 2: ASYNC FOUNDATION (Granular Concepts) =====

  // 2.1 Callback Fundamentals
  {
    id: 'callbacks-basics',
    title: 'Callback Functions 101',
    category: 'fundamentals',
    difficulty: 'beginner',
    estimatedReadTime: 6,
    interviewFrequency: 'high',
    prerequisites: ['functions'],
    nextConcepts: ['callback-hell'],
    description: 'A callback is a function passed as an argument to another function, which is then invoked inside the outer function to complete some kind of routine or action. Callbacks are the foundation of asynchronous programming in JavaScript - they allow code to run after an operation completes without blocking execution.',
    shortDescription: 'Functions passed as arguments to other functions',
    keyPoints: [
      'A callback is a function passed into another function as an argument',
      'Callbacks can be synchronous (array methods) or asynchronous (setTimeout, events)',
      'Callbacks allow for non-blocking code execution',
      'Higher-order functions accept callbacks as parameters',
      'Callbacks enable code reusability and customization',
    ],
    examples: [
      {
        title: 'Synchronous Callback',
        code: `// Array method with callback
const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map(function(num) {
  return num * 2;
});

console.log(doubled); // [2, 4, 6, 8, 10]

// The callback function(num) is called synchronously
// for each element in the array`,
        explanation: 'Array methods like map, filter, forEach use synchronous callbacks',
      },
      {
        title: 'Asynchronous Callback',
        code: `console.log("Start");

setTimeout(function() {
  console.log("Callback executed!");
}, 1000);

console.log("End");

// Output:
// Start
// End
// Callback executed! (after 1 second)

// The callback runs asynchronously after the timer`,
        explanation: 'setTimeout schedules a callback to run later, allowing other code to execute first',
      },
      {
        title: 'Custom Higher-Order Function',
        code: `// Higher-order function that accepts a callback
function greet(name, formatter) {
  return "Hello, " + formatter(name);
}

// Different callbacks for different formatting
const upperCase = (str) => str.toUpperCase();
const addExclamation = (str) => str + "!";

console.log(greet("Alice", upperCase));      // "Hello, ALICE"
console.log(greet("Bob", addExclamation));   // "Hello, Bob!"`,
        explanation: 'Higher-order functions use callbacks to customize behavior',
      },
      {
        title: 'Event Listener Callback',
        code: `// Event handling with callbacks
document.getElementById('button').addEventListener('click', function(event) {
  console.log('Button was clicked!');
  console.log('Event:', event);
});

// The callback runs when the click event occurs
// This is asynchronous - we don't know when it will happen!`,
        explanation: 'Event listeners register callbacks that run when events occur',
      },
    ],
    commonMistakes: [
      'Not understanding the difference between passing a function and calling a function',
      'Forgetting that callbacks may execute asynchronously',
      'Not handling errors in callbacks',
      'Callback hell - deeply nested callbacks',
    ],
    interviewTips: [
      'Explain the difference between synchronous and asynchronous callbacks',
      'Know what a higher-order function is',
      'Be ready to write a simple function that accepts a callback',
      'Understand why callbacks are needed for async operations',
    ],
    commonQuestions: [
      {
        question: 'What is a callback function?',
        answer: 'A callback is a function passed as an argument to another function, which is then invoked inside the outer function to complete some kind of action.',
        difficulty: 'easy',
      },
      {
        question: 'What is the difference between synchronous and asynchronous callbacks?',
        answer: 'Synchronous callbacks execute immediately during the function execution (like array methods). Asynchronous callbacks execute later, after some operation completes (like setTimeout, fetch, event handlers).',
        difficulty: 'easy',
      },
      {
        question: 'What is a higher-order function?',
        answer: 'A higher-order function is a function that accepts a callback as a parameter, or returns a function, or both. Examples: map, filter, reduce.',
        difficulty: 'medium',
      },
    ],
  },

  // 2.2 Callback Hell
  {
    id: 'callback-hell',
    title: 'Callback Hell & The Pyramid of Doom',
    category: 'fundamentals',
    difficulty: 'intermediate',
    estimatedReadTime: 8,
    interviewFrequency: 'high',
    prerequisites: ['callbacks-basics'],
    nextConcepts: ['promises-creation'],
    description: 'Callback hell (also known as "pyramid of doom") occurs when multiple asynchronous operations are nested within each other, creating code that is hard to read, maintain, and debug. The code indents further with each nested callback, forming a pyramid shape. This anti-pattern led to the creation of Promises and async/await.',
    shortDescription: 'Why nested callbacks become unmaintainable',
    keyPoints: [
      'Callback hell occurs with deeply nested asynchronous callbacks',
      'Code becomes harder to read as indentation increases',
      'Error handling becomes complex and scattered',
      'Difficult to coordinate multiple async operations',
      'Solutions: Promises, async/await, or modularization',
      'Named functions can help flatten the pyramid',
    ],
    examples: [
      {
        title: 'The Pyramid of Doom',
        code: `getUserData(1, function(user) {
  getOrders(user.id, function(orders) {
    getProducts(orders[0].id, function(products) {
      getInventory(products[0].id, function(inventory) {
        getPricing(inventory.id, function(price) {
          console.log("Price:", price);
          // This is getting hard to read!
        });
      });
    });
  });
});

// Each level nests deeper
// Error handling would be at every level!`,
        explanation: 'Each async operation nests inside the previous callback, creating the pyramid shape',
      },
      {
        title: 'Error Handling Nightmare',
        code: `getUserData(1, function(user, error) {
  if (error) {
    console.error(error);
    return;
  }
  
  getOrders(user.id, function(orders, error) {
    if (error) {
      console.error(error);
      return;
    }
    
    getProducts(orders[0].id, function(products, error) {
      if (error) {
        console.error(error);
        return;
      }
      // Error handling repeated at every level!
    });
  });
});`,
        explanation: 'Error handling must be repeated at every level, making code verbose and error-prone',
      },
      {
        title: 'Solution: Named Functions',
        code: `// Break into named functions
getUserData(1, handleUser);

function handleUser(user, error) {
  if (error) return console.error(error);
  getOrders(user.id, handleOrders);
}

function handleOrders(orders, error) {
  if (error) return console.error(error);
  getProducts(orders[0].id, handleProducts);
}

function handleProducts(products, error) {
  if (error) return console.error(error);
  // Continue...
}

// Better, but still callback-based`,
        explanation: 'Named functions can help flatten the pyramid, but it is still callback-based',
      },
      {
        title: 'Solution: Promises',
        code: `// With Promises (preview)
getUserData(1)
  .then(user => getOrders(user.id))
  .then(orders => getProducts(orders[0].id))
  .then(products => getInventory(products[0].id))
  .then(inventory => getPricing(inventory.id))
  .then(price => console.log("Price:", price))
  .catch(error => console.error(error));

// Flat structure!
// Single error handler!`,
        explanation: 'Promises allow chaining with .then(), creating a flat structure with centralized error handling',
      },
    ],
    commonMistakes: [
      'Nesting callbacks more than 2-3 levels deep',
      'Not handling errors at every level',
      'Using anonymous functions for deeply nested callbacks',
      'Trying to parallelize operations with nested callbacks',
    ],
    interviewTips: [
      'Be able to identify callback hell in code',
      'Know the solutions: Promises, async/await, named functions',
      'Explain why callback hell is a problem (readability, error handling)',
      'Show how to refactor callback hell to Promises',
    ],
    commonQuestions: [
      {
        question: 'What is callback hell?',
        answer: 'Callback hell (pyramid of doom) is when multiple asynchronous operations are nested within callbacks, creating deeply indented code that is hard to read and maintain.',
        difficulty: 'easy',
      },
      {
        question: 'How do you avoid callback hell?',
        answer: 'Use Promises with .then() chaining, use async/await, break callbacks into named functions, or use modularization. Modern JavaScript prefers async/await.',
        difficulty: 'medium',
      },
      {
        question: 'Refactor this callback hell code: [example]',
        answer: 'Extract into named functions or convert to Promises/async-await for a flatter structure.',
        difficulty: 'medium',
      },
    ],
  },

  // 2.3 Error-First Callbacks
  {
    id: 'error-first-callbacks',
    title: 'Error-First Callback Pattern (Node.js)',
    category: 'backend',
    difficulty: 'intermediate',
    estimatedReadTime: 7,
    interviewFrequency: 'medium',
    prerequisites: ['callbacks-basics'],
    nextConcepts: ['promises-creation'],
    description: 'The error-first callback pattern is a convention in Node.js where callbacks always receive an error object as the first argument. If an error occurred, the first argument contains the error; otherwise, it is null. The second argument contains the successful result. This pattern became the standard in Node.js core APIs.',
    shortDescription: 'Node.js convention: callback(err, result)',
    keyPoints: [
      'First parameter is always an error object (or null if no error)',
      'Second parameter contains the successful result',
      'Standard pattern in Node.js core modules (fs, http, etc.)',
      'Always check if error exists before using result',
      'Promises and async/await have largely replaced this pattern',
    ],
    examples: [
      {
        title: 'Basic Error-First Pattern',
        code: `// Node.js fs module example
const fs = require('fs');

fs.readFile('file.txt', 'utf8', function(error, data) {
  // First parameter: error (null if success)
  // Second parameter: result
  
  if (error) {
    console.error('Error reading file:', error.message);
    return;
  }
  
  console.log('File contents:', data);
});`,
        explanation: 'The callback receives (error, result). Always check error first!',
      },
      {
        title: 'Writing Your Own Error-First Function',
        code: `function divide(a, b, callback) {
  if (b === 0) {
    // Pass error as first argument
    callback(new Error('Cannot divide by zero'), null);
    return;
  }
  
  // Pass null as error, result as second argument
  callback(null, a / b);
}

// Usage
divide(10, 2, function(error, result) {
  if (error) {
    console.error(error.message);
    return;
  }
  console.log('Result:', result); // 5
});

divide(10, 0, function(error, result) {
  if (error) {
    console.error(error.message); // "Cannot divide by zero"
  }
});`,
        explanation: 'When implementing, pass Error object first on failure, null first on success',
      },
      {
        title: 'Common Mistake: Ignoring Error',
        code: `// ❌ WRONG: Not checking error first
fs.readFile('file.txt', 'utf8', function(err, data) {
  console.log(data); // Could be undefined if error!
});

// ✅ CORRECT: Always check error first
fs.readFile('file.txt', 'utf8', function(err, data) {
  if (err) {
    console.error('Failed:', err);
    return;
  }
  console.log(data); // Safe to use
});`,
        explanation: 'Always check if error exists before accessing the result',
      },
    ],
    commonMistakes: [
      'Not checking the error before using the result',
      'Passing non-Error objects as the first parameter',
      'Forgetting to return after handling error',
      'Checking result before error',
    ],
    interviewTips: [
      'Know this is the Node.js standard pattern',
      'Always check error first, return early on error',
      'Understand why this pattern exists (consistent error handling)',
      'Know that Promises have largely replaced this in modern code',
    ],
    commonQuestions: [
      {
        question: 'What is the error-first callback pattern?',
        answer: 'A Node.js convention where callbacks receive (error, result). If an error occurred, error contains the Error object; otherwise, it is null. The second argument contains the successful result.',
        difficulty: 'medium',
      },
      {
        question: 'Why is error the first parameter?',
        answer: 'It forces developers to check for errors. If it were the second parameter, it would be easy to forget to check it. Being first makes it visually prominent.',
        difficulty: 'medium',
      },
    ],
  },

  // ===== PROMISES SECTION =====

  {
    id: 'promises-deep-dive',
    title: 'Promises Deep Dive',
    category: 'core',
    difficulty: 'intermediate',
    description: 'Promises are JavaScript\'s primary abstraction for asynchronous operations. Understanding Promise internals, combinators (all/race/any/allSettled), and error handling patterns is essential for writing robust async code.',
    shortDescription: 'Async operations and combinators',
    keyPoints: [
      'A Promise represents a value that may be available now, later, or never',
      'Promise states: pending → fulfilled OR rejected (immutable once settled)',
      'Promise.all() fails fast: rejects on first rejection',
      'Promise.race() returns first settled (fulfilled OR rejected)',
      'Promise.any() returns first fulfilled (ignores rejections until all fail)',
      'Promise.allSettled() waits for all, never short-circuits',
      '.then() always returns a new Promise (enabling chaining)',
      'Unhandled rejections are dangerous - always add .catch() or try/catch',
    ],
    examples: [
      {
        title: 'Promise States',
        code: `// Creating Promises
const pending = new Promise(() => {});  // stays pending
const fulfilled = Promise.resolve(42);  // immediately fulfilled
const rejected = Promise.reject('err'); // immediately rejected

// State transitions are ONE-WAY and IMMUTABLE
const p = new Promise((resolve, reject) => {
  resolve('first');   // Promise is now fulfilled
  resolve('second');  // ignored!
  reject('error');    // ignored!
});

p.then(v => console.log(v));  // "first"`,
        explanation: 'Once a Promise settles, its state and value are locked forever',
      },
      {
        title: 'Promise.all() - Fail Fast',
        code: `// All must succeed
const results = await Promise.all([
  fetch('/api/users'),
  fetch('/api/posts'),
  fetch('/api/comments')
]);
// results = [usersResponse, postsResponse, commentsResponse]

// One failure = immediate rejection
await Promise.all([
  Promise.resolve(1),
  Promise.reject('Error!'),  // Fails here
  Promise.resolve(3)          // Never awaited!
]);
// Throws: "Error!"`,
        explanation: 'Use all() when you need ALL results and want fast failure',
      },
      {
        title: 'Promise.race() - First Wins',
        code: `// Timeout pattern
async function fetchWithTimeout(url, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), ms)
  );
  return Promise.race([fetch(url), timeout]);
}

// First to settle wins (success OR failure)
await Promise.race([
  fetch('/slow'),    // takes 5s
  fetch('/fast')     // takes 1s - this wins!
]);`,
        explanation: 'Use race() for timeouts or "first response wins" patterns',
      },
      {
        title: 'Promise.any() - First Success',
        code: `// Try multiple sources, take first success
const data = await Promise.any([
  fetch('https://primary.api/data'),
  fetch('https://backup.api/data'),
  fetch('https://fallback.api/data')
]);
// Returns first successful response

// Only fails if ALL fail
await Promise.any([
  Promise.reject('A failed'),
  Promise.reject('B failed'),
  Promise.reject('C failed')
]);
// Throws: AggregateError with all rejection reasons`,
        explanation: 'Use any() for redundant sources or fallback chains',
      },
      {
        title: 'Promise.allSettled() - Wait for All',
        code: `// Get results regardless of success/failure
const results = await Promise.allSettled([
  Promise.resolve('success'),
  Promise.reject('error'),
  Promise.resolve('another')
]);

// results = [
//   { status: 'fulfilled', value: 'success' },
//   { status: 'rejected', reason: 'error' },
//   { status: 'fulfilled', value: 'another' }
// ]

// Filter successes
const successes = results
  .filter(r => r.status === 'fulfilled')
  .map(r => r.value);`,
        explanation: 'Use allSettled() when you need all results regardless of failures',
      },
      {
        title: 'Promisify Callback APIs',
        code: `// Convert callback-based function to Promise
function promisify(fn) {
  return function(...args) {
    return new Promise((resolve, reject) => {
      fn(...args, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  };
}

// Usage
const readFile = promisify(fs.readFile);
const data = await readFile('file.txt', 'utf8');`,
        explanation: 'Promisify wraps Node-style callbacks (err, result) into Promises',
      },
      {
        title: 'Retry with Exponential Backoff',
        code: `async function retry(fn, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, delay * Math.pow(2, i)));
    }
  }
}

// Usage
const data = await retry(
  () => fetch('/flaky-api'),
  3,    // 3 attempts
  1000  // 1s, 2s, 4s delays
);`,
        explanation: 'Retry pattern with increasing delays between attempts',
      },
    ],
    commonMistakes: [
      'Forgetting to return in .then() chains (breaks the chain)',
      'Not handling Promise rejections (.catch or try/catch)',
      'Using Promise.all() when you need allSettled() behavior',
      'Creating promises in loops without proper batching',
      'Mixing async/await with .then() inconsistently',
    ],
    interviewTips: [
      'Know the difference between all/race/any/allSettled',
      'Implement Promise.all() from scratch',
      'Explain the microtask queue and Promise execution order',
      'Write a promisify function',
      'Implement retry with exponential backoff',
    ],
    relatedProblems: [
      'promise-all',
      'promise-race',
      'promisify',
      'promise-allsettled',
      'promise-any',
      'promise-finally',
      'promise-retry',
      'promise-timeout',
      'promise-throttle',
      'promise-sequence',
      'create-promise',
      'promise-chain',
    ],
  },

  // ===== PHASE 2 CONTINUED: PROMISES & ASYNC/AWAIT =====

  // 2.4 Promise Creation
  {
    id: 'promises-creation',
    title: 'Creating Promises',
    category: 'fundamentals',
    difficulty: 'intermediate',
    estimatedReadTime: 7,
    interviewFrequency: 'high',
    prerequisites: ['callback-hell'],
    nextConcepts: ['promises-then-catch'],
    description: 'A Promise is an object representing the eventual completion or failure of an asynchronous operation. Promises are created using the new Promise(executor) constructor, which takes a function with resolve and reject parameters. Understanding Promise creation is fundamental to working with modern asynchronous JavaScript.',
    shortDescription: 'new Promise() and the executor function',
    keyPoints: [
      'new Promise(executor) creates a Promise object',
      'Executor receives resolve and reject functions',
      'Call resolve(value) to fulfill the Promise',
      'Call reject(error) to reject the Promise',
      'Promise starts in "pending" state, settles to "fulfilled" or "rejected"',
      'Once settled, a Promise cannot change state',
    ],
    examples: [
      {
        title: 'Basic Promise Creation',
        code: `const promise = new Promise((resolve, reject) => {
  // Async operation
  setTimeout(() => {
    resolve("Success!"); // Promise is fulfilled
  }, 1000);
});

// The promise starts pending, then becomes fulfilled
console.log(promise); // Promise {<pending>}

promise.then(result => {
  console.log(result); // "Success!" (after 1 second)
});`,
        explanation: 'Create a Promise with new Promise(). Call resolve() when the operation succeeds.',
      },
      {
        title: 'Promise Rejection',
        code: `const promise = new Promise((resolve, reject) => {
  const success = false;
  
  if (success) {
    resolve("Operation succeeded");
  } else {
    reject(new Error("Operation failed")); // Promise is rejected
  }
});

promise
  .then(result => console.log(result))
  .catch(error => console.log(error.message)); // "Operation failed"`,
        explanation: 'Call reject() with an Error object when the operation fails.',
      },
      {
        title: 'Converting Callback to Promise',
        code: `// Original callback-based function
function fetchData(callback) {
  setTimeout(() => {
    callback(null, "Data"); // (error, result)
  }, 1000);
}

// Converted to Promise
function fetchDataPromise() {
  return new Promise((resolve, reject) => {
    fetchData((error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

// Usage
fetchDataPromise()
  .then(data => console.log(data))
  .catch(err => console.error(err));`,
        explanation: 'Wrap callback-based APIs in Promises for cleaner async code.',
      },
      {
        title: 'Promise State Transitions',
        code: `console.log("Creating promise...");

const promise = new Promise((resolve, reject) => {
  console.log("Executor runs immediately!"); // Synchronous
  
  setTimeout(() => {
    resolve("Done");
    console.log("Already resolved, this does nothing:");
    resolve("Ignored"); // Second resolve is ignored!
  }, 1000);
});

console.log("Promise created:", promise);

// Output:
// "Creating promise..."
// "Executor runs immediately!"
// "Promise created:" Promise {<pending>}
// ...1 second...
// "Done"
// "Already resolved, this does nothing:"`,
        explanation: 'The executor runs synchronously. Once resolved/rejected, a Promise cannot change state.',
      },
    ],
    commonMistakes: [
      'Forgetting to return the Promise from a function',
      'Calling both resolve and reject (only first one matters)',
      'Not wrapping errors in reject (should use Error objects)',
      'Thinking the executor runs asynchronously (it runs synchronously)',
    ],
    interviewTips: [
      'Know the Promise constructor syntax',
      'Understand that executor runs synchronously',
      'Know that Promises are immutable once settled',
      'Be able to convert a callback API to Promises',
    ],
    commonQuestions: [
      {
        question: 'How do you create a Promise?',
        answer: 'Using the Promise constructor: new Promise((resolve, reject) => { ... }). Call resolve(value) for success, reject(error) for failure.',
        difficulty: 'easy',
      },
      {
        question: 'Does the Promise executor run synchronously or asynchronously?',
        answer: 'The executor function runs synchronously and immediately when the Promise is created. Only the resolve/reject calls may be scheduled asynchronously.',
        difficulty: 'medium',
      },
      {
        question: 'Can a Promise change its state multiple times?',
        answer: 'No. Once a Promise is settled (fulfilled or rejected), it cannot change state. Additional calls to resolve or reject are ignored.',
        difficulty: 'medium',
      },
    ],
  },

  // 2.5 Promise Consumption (then/catch)
  {
    id: 'promises-then-catch',
    title: 'Consumsuming Promises: then, catch, finally',
    category: 'fundamentals',
    difficulty: 'intermediate',
    estimatedReadTime: 9,
    interviewFrequency: 'high',
    prerequisites: ['promises-creation'],
    nextConcepts: ['promises-chaining'],
    description: 'Promises are consumed using .then(), .catch(), and .finally() methods. .then() handles fulfillment, .catch() handles rejection, and .finally() runs regardless of outcome. These methods return new Promises, enabling chaining. Understanding how to properly consume Promises is essential for clean asynchronous code.',
    shortDescription: 'Handling Promise results and errors',
    keyPoints: [
      '.then(onFulfilled, onRejected) handles success and optionally error',
      '.catch(onRejected) is shorthand for .then(null, onRejected)',
      '.finally(onFinally) runs on both success and failure',
      'These methods return new Promises (enabling chaining)',
      'Unhandled Promise rejections should always be caught',
      'Errors in .then() are caught by subsequent .catch()',
    ],
    examples: [
      {
        title: 'Basic then and catch',
        code: `fetch('/api/user')
  .then(response => {
    return response.json(); // Returns a Promise
  })
  .then(user => {
    console.log('User:', user);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });`,
        explanation: '.then() handles successful Promise resolution. .catch() handles any rejection in the chain.',
      },
      {
        title: 'then with Two Arguments',
        code: `fetch('/api/user')
  .then(
    response => response.json(),     // onFulfilled
    error => ({ error: error.message }) // onRejected
  )
  .then(data => {
    if (data.error) {
      console.log('Handled error:', data.error);
    } else {
      console.log('User:', data);
    }
  });

// Note: Error here won't be caught by the inline handler!`,
        explanation: '.then() can take two callbacks: success handler and error handler.',
      },
      {
        title: 'catch vs then(null, handler)',
        code: `// These are equivalent:

fetch('/api/user')
  .then(response => response.json())
  .then(null, error => console.error(error)); // Error only for previous .then()

fetch('/api/user')
  .then(response => response.json())
  .catch(error => console.error(error)); // Catches ALL previous errors

// catch is usually preferred as it catches all errors in the chain`,
        explanation: '.catch() catches errors from the entire chain. Inline error handler only catches the previous .then().',
      },
      {
        title: 'finally for Cleanup',
        code: `let loading = true;

fetch('/api/user')
  .then(response => response.json())
  .then(user => console.log(user))
  .catch(error => console.error(error))
  .finally(() => {
    loading = false; // Runs regardless of success/failure
    console.log('Request complete');
  });

// Use case: Hide loading spinner, close connections`,
        explanation: '.finally() runs after Promise settles, regardless of outcome. Great for cleanup.',
      },
      {
        title: 'Errors in then are Caught by catch',
        code: `Promise.resolve("start")
  .then(value => {
    throw new Error("Oops!"); // Error in .then()
  })
  .then(value => {
    console.log("Skipped!"); // This won't run
  })
  .catch(error => {
    console.log("Caught:", error.message); // "Caught: Oops!"
  });

// Errors in any .then() are caught by the next .catch()`,
        explanation: 'If a .then() throws an error, it rejects the returned Promise, caught by the next .catch().',
      },
    ],
    commonMistakes: [
      'Forgetting to return in .then() (breaks the chain)',
      'Using .then() second argument instead of .catch()',
      'Not handling errors at all (unhandled rejection)',
      'Forgetting that .finally() does not receive the result',
    ],
    interviewTips: [
      'Know the difference between .then() two-arg form and .catch()',
      'Understand error propagation in Promise chains',
      'Know when to use .finally()',
      'Always handle Promise rejections',
    ],
    commonQuestions: [
      {
        question: 'What is the difference between .catch() and the second argument of .then()?',
        answer: '.catch() catches errors from the entire chain above it. The second argument to .then() only catches errors from the immediate previous Promise. .catch() is generally preferred.',
        difficulty: 'medium',
      },
      {
        question: 'What happens if you throw an error in .then()?',
        answer: 'Throwing an error in .then() causes the returned Promise to reject. This rejection is caught by the next .catch() in the chain.',
        difficulty: 'medium',
      },
      {
        question: 'Does .finally() receive the resolved value or rejection reason?',
        answer: 'No. .finally() does not receive any arguments. It is used for cleanup code that needs to run regardless of the Promise outcome.',
        difficulty: 'easy',
      },
    ],
  },

  // 2.6 Promise Chaining
  {
    id: 'promises-chaining',
    title: 'Promise Chaining',
    category: 'fundamentals',
    difficulty: 'intermediate',
    estimatedReadTime: 10,
    interviewFrequency: 'high',
    prerequisites: ['promises-then-catch'],
    nextConcepts: ['promises-static-methods'],
    description: 'Promise chaining allows sequential asynchronous operations to be written in a flat, readable structure. Each .then() returns a new Promise, allowing chains of dependent async operations. Returning a value passes it to the next .then(); returning a Promise waits for it to settle. Mastering chaining is key to writing clean async code.',
    shortDescription: 'Sequential async operations in a flat structure',
    keyPoints: [
      '.then() always returns a new Promise',
      'Return a value to pass it to the next .then()',
      'Return a Promise to wait for it before continuing',
      'Errors skip to the next .catch()',
      'Breaking the chain: forgetting to return',
      'Chaining enables sequential async without nesting',
    ],
    examples: [
      {
        title: 'Basic Chaining',
        code: `getUser(1)
  .then(user => {
    console.log('Got user:', user.name);
    return getOrders(user.id); // Return Promise
  })
  .then(orders => {
    console.log('Got orders:', orders.length);
    return orders[0]; // Return value
  })
  .then(firstOrder => {
    console.log('First order:', firstOrder);
  })
  .catch(error => {
    console.error('Any step failed:', error);
  });

// Flat structure, each step depends on previous`,
        explanation: 'Each .then() receives the value returned by the previous .then().',
      },
      {
        title: 'Returning Promises Waits',
        code: `fetchUser(1)
  .then(user => {
    // Returning a Promise pauses the chain until it settles
    return fetchOrders(user.id); // Waits for orders
  })
  .then(orders => {
    // This runs AFTER fetchOrders completes
    console.log(orders);
    return fetchProducts(orders[0].id);
  })
  .then(products => {
    console.log(products);
  });

// Sequential execution, not parallel`,
        explanation: 'When you return a Promise from .then(), the next .then() waits for it to complete.',
      },
      {
        title: 'The Classic Return Mistake',
        code: `// ❌ WRONG: Forgetting to return
fetchUser(1)
  .then(user => {
    fetchOrders(user.id); // No return!
  })
  .then(orders => {
    // orders is undefined!
    // This runs immediately, not waiting for fetchOrders
  });

// ✅ CORRECT: Always return
fetchUser(1)
  .then(user => {
    return fetchOrders(user.id); // Return the Promise!
  })
  .then(orders => {
    // orders has the actual data
  });`,
        explanation: 'Forgetting to return breaks the chain. The next .then() receives undefined immediately.',
      },
      {
        title: 'Error Propagation in Chains',
        code: `step1()
  .then(result1 => {
    console.log('Step 1 done');
    if (result1.invalid) {
      throw new Error('Invalid result');
    }
    return step2(result1);
  })
  .then(result2 => {
    console.log('Step 2 done'); // Skipped if error above
    return step3(result2);
  })
  .then(result3 => {
    console.log('Step 3 done'); // Skipped if error above
  })
  .catch(error => {
    console.error('Failed at some step:', error);
  });

// Errors skip to the next .catch(), skipping intermediate .then()s`,
        explanation: 'When an error occurs, it skips all remaining .then() handlers until a .catch() is found.',
      },
    ],
    commonMistakes: [
      'Forgetting to return a value/Promise in .then()',
      'Creating nested Promises inside .then() instead of returning',
      'Not handling errors that may occur in any step',
      'Confusing sequential chains with parallel execution',
    ],
    interviewTips: [
      'Always return in .then() to continue the chain',
      'Know that returning a Promise waits for it',
      'Understand error propagation through chains',
      'Be able to refactor nested callbacks to Promise chains',
    ],
    commonQuestions: [
      {
        question: 'What does .then() return?',
        answer: '.then() always returns a new Promise. If you return a value, the Promise resolves with that value. If you return a Promise, it adopts that Promise\'s state.',
        difficulty: 'medium',
      },
      {
        question: 'What happens if you don\'t return anything from .then()?',
        answer: 'The next .then() receives undefined immediately. If you were expecting a Promise result, you must return the Promise from the previous .then().',
        difficulty: 'medium',
      },
      {
        question: 'How do errors propagate through Promise chains?',
        answer: 'An error (rejection or thrown exception) skips all remaining .then() handlers and propagates to the next .catch() in the chain.',
        difficulty: 'medium',
      },
    ],
  },

  // 2.7 Promise Static Methods
  {
    id: 'promises-static-methods',
    title: 'Promise.all, race, allSettled, any',
    category: 'fundamentals',
    difficulty: 'intermediate',
    estimatedReadTime: 12,
    interviewFrequency: 'high',
    prerequisites: ['promises-chaining'],
    nextConcepts: ['async-await-syntax'],
    description: 'JavaScript provides powerful static methods for working with multiple Promises: Promise.all() waits for all to succeed (fails fast), Promise.race() returns the first to settle, Promise.allSettled() waits for all regardless of outcome, and Promise.any() returns the first success. Knowing when to use each is essential for efficient async operations.',
    shortDescription: 'Working with multiple Promises',
    keyPoints: [
      'Promise.all([promises]) - waits for all, fails on first rejection',
      'Promise.race([promises]) - returns first to settle (fulfilled OR rejected)',
      'Promise.allSettled([promises]) - waits for all, never rejects',
      'Promise.any([promises]) - returns first fulfilled, ignores rejections until all fail',
      'Promise.resolve(value) - creates resolved Promise',
      'Promise.reject(error) - creates rejected Promise',
    ],
    examples: [
      {
        title: 'Promise.all - Wait for All',
        code: `const urls = ['/api/user', '/api/posts', '/api/comments'];

const promises = urls.map(url => fetch(url));

Promise.all(promises)
  .then(responses => {
    // responses is an array in the same order as input
    console.log('All fetched successfully');
    return Promise.all(responses.map(r => r.json()));
  })
  .then(([user, posts, comments]) => {
    console.log(user, posts, comments);
  })
  .catch(error => {
    // Fails fast - rejects immediately if any Promise rejects
    console.error('At least one failed:', error);
  });`,
        explanation: 'Promise.all() waits for all Promises. Resolves with array of results. Rejects immediately if any fails.',
      },
      {
        title: 'Promise.race - First to Settle',
        code: `const fetchWithTimeout = (url, timeout = 5000) => {
  return Promise.race([
    fetch(url),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), timeout)
    )
  ]);
};

fetchWithTimeout('/api/slow-endpoint')
  .then(response => console.log('Success'))
  .catch(error => console.log('Failed or timeout'));

// Useful for: timeouts, responding to first available server`,
        explanation: 'Promise.race() returns whichever Promise settles first, whether fulfilled or rejected.',
      },
      {
        title: 'Promise.allSettled - Never Fails',
        code: `const promises = [
  Promise.resolve('success'),
  Promise.reject('error'),
  Promise.resolve('another success')
];

Promise.allSettled(promises)
  .then(results => {
    // results is always an array of {status, value|reason}
    console.log(results);
    // [
    //   { status: 'fulfilled', value: 'success' },
    //   { status: 'rejected', reason: 'error' },
    //   { status: 'fulfilled', value: 'another success' }
    // ]
    
    const successes = results
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value);
    
    console.log('Successes:', successes);
  });

// Never rejects, always resolves with status array`,
        explanation: 'Promise.allSettled() waits for all Promises and never rejects. Returns status for each.',
      },
      {
        title: 'Promise.any - First Success',
        code: `const urls = [
  'https://backup1.com/api',
  'https://backup2.com/api',
  'https://backup3.com/api'
];

const promises = urls.map(url => fetch(url));

Promise.any(promises)
  .then(response => {
    // First successful response
    console.log('First available server responded');
    return response.json();
  })
  .catch(error => {
    // All failed - error is AggregateError
    console.log('All servers failed:', error.errors);
  });

// Ignores rejections until all fail`,
        explanation: 'Promise.any() returns the first fulfilled Promise, ignoring rejections until all fail.',
      },
    ],
    commonMistakes: [
      'Using Promise.all() when you need allSettled() behavior',
      'Not handling partial failures with Promise.all()',
      'Forgetting that Promise.all() rejects immediately on first failure',
      'Not using Promise.race() for timeout patterns',
    ],
    interviewTips: [
      'Know the difference between all/race/any/allSettled',
      'Implement Promise.all() from scratch',
      'Know when to use each method',
      'Understand fail-fast vs wait-for-all behavior',
    ],
    commonQuestions: [
      {
        question: 'What is the difference between Promise.all and Promise.allSettled?',
        answer: 'Promise.all() rejects immediately when any Promise rejects (fail-fast). Promise.allSettled() waits for all Promises to settle and never rejects, returning the status of each.',
        difficulty: 'medium',
      },
      {
        question: 'How would you implement a timeout for a fetch request?',
        answer: 'Use Promise.race() between the fetch Promise and a timeout Promise that rejects after a delay.',
        difficulty: 'medium',
      },
      {
        question: 'What is Promise.any()?',
        answer: 'Promise.any() returns the first Promise to fulfill, ignoring rejections. If all Promises reject, it rejects with an AggregateError.',
        difficulty: 'medium',
      },
    ],
  },

  // ===== ASYNC/AWAIT SECTION =====

  // 2.8 Async/Await Syntax
  {
    id: 'async-await-syntax',
    title: 'Async/Await Syntax Basics',
    category: 'fundamentals',
    difficulty: 'intermediate',
    estimatedReadTime: 8,
    interviewFrequency: 'high',
    prerequisites: ['promises-then-catch'],
    nextConcepts: ['async-await-error-handling'],
    description: 'Async/await is syntactic sugar over Promises that makes asynchronous code look and behave more like synchronous code. The async keyword makes a function return a Promise, and the await keyword pauses execution until a Promise settles. This leads to cleaner, more readable code compared to Promise chains.',
    shortDescription: 'Syntactic sugar for Promises',
    keyPoints: [
      'async function always returns a Promise',
      'await pauses execution until Promise settles',
      'await can only be used inside async functions',
      'Top-level await available in ES2022 (modules)',
      'async/await is just Promise syntax sugar',
      'Sequential by default, parallel with Promise.all()',
    ],
    examples: [
      {
        title: 'Basic Async/Await',
        code: `async function getUser() {
  // await pauses here until fetch completes
  const response = await fetch('/api/user');
  const user = await response.json();
  return user; // Returns a Promise!
}

// Usage
getUser().then(user => console.log(user));

// Or in another async function
async function displayUser() {
  const user = await getUser();
  console.log(user.name);
}`,
        explanation: 'await pauses function execution until the Promise resolves, then returns the value.',
      },
      {
        title: 'Async Function Returns Promise',
        code: `async function greet() {
  return "Hello"; // Returns Promise.resolve("Hello")
}

// Equivalent to:
function greetPromise() {
  return Promise.resolve("Hello");
}

greet().then(message => console.log(message)); // "Hello"

// Even if you return a non-Promise, it's wrapped`,
        explanation: 'async functions always return Promises, even if you return a plain value.',
      },
      {
        title: 'Await Multiple in Sequence',
        code: `async function getDashboard() {
  // These run SEQUENTIALLY (one after another)
  const user = await fetchUser();      // Wait...
  const posts = await fetchPosts();    // Wait...
  const comments = await fetchComments(); // Wait...
  
  return { user, posts, comments };
}

// Total time = user time + posts time + comments time`,
        explanation: 'Each await waits for the previous operation to complete. Sequential by default.',
      },
      {
        title: 'Top-Level Await (ES2022)',
        code: `// In ES modules, await can be used at top level
// Without wrapping in async function

const response = await fetch('/api/config');
const config = await response.json();

console.log(config);

// Only works in ES modules, not regular scripts`,
        explanation: 'Modern JavaScript (ES2022) allows await at the top level of modules.',
      },
    ],
    commonMistakes: [
      'Using await in non-async functions',
      'Forgetting that async functions return Promises',
      'Creating accidental sequential execution when parallel is needed',
      'Not handling errors with try/catch',
    ],
    interviewTips: [
      'Know that async/await is Promise syntax sugar',
      'Understand sequential vs parallel execution',
      'Know top-level await is ES2022+',
      'Be able to convert between Promise chains and async/await',
    ],
    commonQuestions: [
      {
        question: 'What does async/await do under the hood?',
        answer: 'It is syntactic sugar over Promises. The async keyword makes a function return a Promise. The await keyword pauses execution until a Promise settles, then returns its value.',
        difficulty: 'medium',
      },
      {
        question: 'Can you use await outside of an async function?',
        answer: 'In modern ES2022+ modules, yes (top-level await). In older JavaScript or non-modules, no - await must be inside an async function.',
        difficulty: 'easy',
      },
      {
        question: 'Does await block the main thread?',
        answer: 'No. await only pauses the async function, not the main thread. Other JavaScript continues running while waiting for the Promise.',
        difficulty: 'medium',
      },
    ],
  },

  // 2.9 Async/Await Error Handling
  {
    id: 'async-await-error-handling',
    title: 'Error Handling with Async/Await',
    category: 'fundamentals',
    difficulty: 'intermediate',
    estimatedReadTime: 9,
    interviewFrequency: 'high',
    prerequisites: ['async-await-syntax'],
    nextConcepts: ['async-await-parallel'],
    description: 'Error handling with async/await uses standard try/catch blocks, making it more intuitive than Promise chains. Any rejected Promise awaited inside a try block will trigger the catch block. This allows for synchronous-style error handling in asynchronous code. Understanding proper error handling patterns is crucial for robust applications.',
    shortDescription: 'try/catch with async/await',
    keyPoints: [
      'Use try/catch for async error handling',
      'Rejected Promises become thrown exceptions in await',
      'catch block receives the rejection reason',
      'Can mix await and .catch() on same Promise',
      'Re-throw errors to propagate them',
      'finally block works as expected for cleanup',
    ],
    examples: [
      {
        title: 'Basic try/catch with Async/Await',
        code: `async function getUser() {
  try {
    const response = await fetch('/api/user');
    
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    
    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Error:', error.message);
    // Return default or re-throw
    return null;
  }
}`,
        explanation: 'Use try/catch around awaited operations. Rejected Promises are caught as exceptions.',
      },
      {
        title: 'Catching Specific Errors',
        code: `async function fetchData() {
  try {
    const data = await fetchUser();
    return data;
  } catch (error) {
    if (error.name === 'NetworkError') {
      console.log('Network issue, retrying...');
      return await fetchData(); // Retry
    }
    if (error.status === 404) {
      console.log('User not found');
      return null;
    }
    throw error; // Re-throw unknown errors
  }
}`,
        explanation: 'Check error properties to handle different error types appropriately.',
      },
      {
        title: 'try/catch vs .catch()',
        code: `// Both work - choose based on context

// Option 1: try/catch (preferred for multiple awaits)
async function method1() {
  try {
    const user = await fetchUser();
    const posts = await fetchPosts(user.id);
    return posts;
  } catch (error) {
    console.error(error);
  }
}

// Option 2: .catch() on specific Promise
async function method2() {
  const user = await fetchUser().catch(() => null);
  if (!user) return []; // Handle specific failure
  
  const posts = await fetchPosts(user.id);
  return posts;
}`,
        explanation: 'try/catch handles multiple awaits. .catch() on a single Promise handles that specific failure.',
      },
      {
        title: 'Finally for Cleanup',
        code: `async function withLoading() {
  let loading = true;
  
  try {
    const data = await fetchData();
    return data;
  } catch (error) {
    console.error(error);
    throw error; // Re-throw after logging
  } finally {
    loading = false; // Always runs
    console.log('Loading complete');
  }
}

// finally runs whether try succeeds or catch handles`,
        explanation: 'finally block runs after try completes or catch handles, perfect for cleanup.',
      },
    ],
    commonMistakes: [
      'Not wrapping await calls in try/catch',
      'Forgetting to re-throw errors after logging',
      'Catching all errors without differentiation',
      'Not handling errors at appropriate level',
    ],
    interviewTips: [
      'Know how to use try/catch with await',
      'Know when to use .catch() vs try/catch',
      'Understand error propagation in async functions',
      'Know how to re-throw errors',
    ],
    commonQuestions: [
      {
        question: 'How do you handle errors in async/await?',
        answer: 'Use try/catch blocks. When a Promise rejects, await throws an exception that can be caught. The catch block receives the rejection reason.',
        difficulty: 'easy',
      },
      {
        question: 'What is the difference between try/catch and .catch() with async/await?',
        answer: 'try/catch handles errors from multiple await calls in one place. .catch() on a specific Promise handles only that Promise\'s rejection. Use try/catch for grouped operations, .catch() for specific fallbacks.',
        difficulty: 'medium',
      },
    ],
  },

  // 2.10 Async/Await Parallel
  {
    id: 'async-await-parallel',
    title: 'Parallel Async Operations',
    category: 'fundamentals',
    difficulty: 'advanced',
    estimatedReadTime: 10,
    interviewFrequency: 'high',
    prerequisites: ['async-await-syntax', 'promises-static-methods'],
    nextConcepts: ['async-await-sequential'],
    description: 'By default, async/await runs operations sequentially. To run operations in parallel, use Promise.all() with await. This is one of the most common performance optimizations in JavaScript. Understanding when to parallelize and when to sequence is essential for writing efficient async code.',
    shortDescription: 'Running async operations in parallel with Promise.all',
    keyPoints: [
      'await runs sequentially by default',
      'Use Promise.all() to run operations in parallel',
      'Start operations before awaiting to run in parallel',
      'Do NOT use await in a loop for independent operations',
      'Promise.all() fails fast on first rejection',
      'Use Promise.allSettled() when partial success is acceptable',
    ],
    examples: [
      {
        title: 'Sequential vs Parallel',
        code: `// ❌ SEQUENTIAL (slow)
async function sequential() {
  const user = await fetchUser();      // 100ms
  const posts = await fetchPosts();    // 100ms
  const comments = await fetchComments(); // 100ms
  // Total: 300ms
  return { user, posts, comments };
}

// ✅ PARALLEL (fast)
async function parallel() {
  const [user, posts, comments] = await Promise.all([
    fetchUser(),      // Start immediately
    fetchPosts(),     // Start immediately
    fetchComments()   // Start immediately
  ]);
  // Total: ~100ms (max of all)
  return { user, posts, comments };
}`,
        explanation: 'Promise.all() runs all Promises simultaneously, waiting for all to complete.',
      },
      {
        title: 'The Loop Anti-Pattern',
        code: `// ❌ WRONG: Sequential in loop
async function fetchUsers(ids) {
  const users = [];
  for (const id of ids) {
    const user = await fetchUser(id); // Waits each iteration!
    users.push(user);
  }
  return users; // Slow: ids.length × fetch time
}

// ✅ CORRECT: Parallel with map
async function fetchUsers(ids) {
  const promises = ids.map(id => fetchUser(id));
  const users = await Promise.all(promises);
  return users; // Fast: ~single fetch time
}

// Alternative with Promise.all()
async function fetchUsers(ids) {
  return Promise.all(ids.map(id => fetchUser(id)));
}`,
        explanation: 'Never use await inside a loop for independent operations. Use map + Promise.all().',
      },
      {
        title: 'Start Before Await',
        code: `// ✅ Good: Start operations, then await
async function fetchDashboard() {
  // Start all operations immediately
  const userPromise = fetchUser();
  const postsPromise = fetchPosts();
  const statsPromise = fetchStats();
  
  // Now await results (already running in parallel!)
  const user = await userPromise;
  const posts = await postsPromise;
  const stats = await statsPromise;
  
  return { user, posts, stats };
}

// Same as Promise.all() but more flexible`,
        explanation: 'Start Promises before awaiting to run them in parallel. Then await results.',
      },
      {
        title: 'Partial Success with allSettled',
        code: `// When some can fail but you want the rest
async function fetchWithFallbacks(urls) {
  const results = await Promise.allSettled(
    urls.map(url => fetch(url))
  );
  
  const successes = results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value);
  
  const failures = results
    .filter(r => r.status === 'rejected')
    .map(r => r.reason);
  
  console.log('Loaded:', successes.length);
  console.log('Failed:', failures.length);
  
  return successes; // Return what worked
}`,
        explanation: 'Use Promise.allSettled() when you need all results regardless of individual failures.',
      },
    ],
    commonMistakes: [
      'Using await inside loops for independent operations',
      'Not realizing sequential is the default',
      'Using Promise.all() when operations depend on each other',
      'Not handling partial failures appropriately',
    ],
    interviewTips: [
      'Know how to parallelize with Promise.all()',
      'Know the "await in loop" anti-pattern',
      'Understand when to use all() vs allSettled()',
      'Be able to optimize slow sequential code',
    ],
    commonQuestions: [
      {
        question: 'How do you run async operations in parallel?',
        answer: 'Use Promise.all() with an array of Promises. Start all operations, then await the Promise.all() which resolves when all complete.',
        difficulty: 'easy',
      },
      {
        question: 'What is wrong with: for (const id of ids) { await fetch(id); }?',
        answer: 'This runs fetches sequentially, one after another. For independent operations, use ids.map(id => fetch(id)) then Promise.all() to run them in parallel.',
        difficulty: 'medium',
      },
      {
        question: 'When should you NOT parallelize async operations?',
        answer: 'When operations depend on each other (e.g., need user ID before fetching posts). Also when rate limiting or resource constraints apply.',
        difficulty: 'medium',
      },
    ],
  },

  // ===== END PHASE 2 =====

  {
    id: 'function-composition',
    title: 'Function Composition',
    category: 'core',
    difficulty: 'intermediate',
    description: 'Function composition is the art of combining simple functions to build complex ones. Master currying, partial application, pipe/compose, and middleware patterns to write declarative, reusable code.',
    shortDescription: 'Curry, pipe, compose, and middleware',
    keyPoints: [
      'Currying transforms f(a, b, c) into f(a)(b)(c) - one arg at a time',
      'Partial application fixes some arguments, returns function for the rest',
      'pipe() flows left-to-right: pipe(f, g, h)(x) = h(g(f(x)))',
      'compose() flows right-to-left: compose(f, g, h)(x) = f(g(h(x)))',
      'Point-free style eliminates explicit parameter references',
      'Middleware chains handlers: request → handler1 → handler2 → response',
    ],
    examples: [
      {
        title: 'Currying',
        code: `// Manual currying
const add = a => b => c => a + b + c;
add(1)(2)(3);  // 6

// Generic curry function
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return (...more) => curried(...args, ...more);
  };
}

const curriedAdd = curry((a, b, c) => a + b + c);
curriedAdd(1)(2)(3);  // 6
curriedAdd(1, 2)(3);  // 6
curriedAdd(1)(2, 3);  // 6`,
        explanation: 'Currying enables partial application of any argument',
      },
      {
        title: 'Partial Application',
        code: `// _.partial fixes arguments from the left
function partial(fn, ...presetArgs) {
  return function(...laterArgs) {
    return fn(...presetArgs, ...laterArgs);
  };
}

const greet = (greeting, name) => \`\${greeting}, \${name}!\`;
const sayHello = partial(greet, 'Hello');

sayHello('Alice');  // "Hello, Alice!"
sayHello('Bob');    // "Hello, Bob!"

// Real-world: pre-configure API calls
const fetchJSON = partial(fetch, { headers: { 'Content-Type': 'application/json' } });`,
        explanation: 'Partial fixes some args, unlike curry which transforms the signature',
      },
      {
        title: 'Pipe and Compose',
        code: `// pipe: left-to-right (reading order)
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);

// compose: right-to-left (math notation)
const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);

// Example functions
const add10 = x => x + 10;
const multiply2 = x => x * 2;
const subtract5 = x => x - 5;

// pipe: 5 → add10 → multiply2 → subtract5
pipe(add10, multiply2, subtract5)(5);     // ((5+10)*2)-5 = 25

// compose: subtract5 ← multiply2 ← add10 ← 5
compose(subtract5, multiply2, add10)(5);  // ((5+10)*2)-5 = 25`,
        explanation: 'Pipe reads naturally; compose matches mathematical notation f∘g',
      },
      {
        title: 'Point-Free Style',
        code: `// With explicit parameters
const getNames = users => users.map(user => user.name);

// Point-free (no explicit parameters)
const prop = key => obj => obj[key];
const map = fn => arr => arr.map(fn);

const getName = prop('name');
const getNames = map(getName);

// Usage
const users = [{ name: 'Alice' }, { name: 'Bob' }];
getNames(users);  // ['Alice', 'Bob']

// Point-free with pipe
const getActiveNames = pipe(
  filter(prop('active')),
  map(prop('name'))
);`,
        explanation: 'Point-free eliminates intermediate variables for cleaner pipelines',
      },
      {
        title: '_.once() - Execute Once',
        code: `function once(fn) {
  let called = false;
  let result;

  return function(...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args);
    }
    return result;
  };
}

// Usage: expensive initialization
const initializeApp = once(() => {
  console.log('Initializing...');
  return { config: loadConfig() };
});

initializeApp();  // "Initializing..." + returns config
initializeApp();  // returns cached config (no log)
initializeApp();  // returns cached config (no log)`,
        explanation: 'Once ensures a function runs exactly once, caching the result',
      },
      {
        title: 'Middleware Pattern',
        code: `// Express-style middleware
function createApp() {
  const middlewares = [];

  return {
    use(fn) {
      middlewares.push(fn);
    },
    async handle(req) {
      let idx = 0;
      const next = async () => {
        if (idx < middlewares.length) {
          await middlewares[idx++](req, next);
        }
      };
      await next();
      return req;
    }
  };
}

const app = createApp();
app.use(async (req, next) => { req.start = Date.now(); await next(); });
app.use(async (req, next) => { req.user = await getUser(req); await next(); });
app.use(async (req, next) => { req.result = process(req); });

await app.handle({ path: '/api' });`,
        explanation: 'Middleware chains functions with next() control flow',
      },
    ],
    commonMistakes: [
      'Confusing curry (transforms signature) with partial (fixes args)',
      'Forgetting that pipe and compose return functions, not values',
      'Over-using point-free style when it hurts readability',
      'Not handling async functions in compose/pipe',
    ],
    interviewTips: [
      'Implement curry() that handles any arity',
      'Implement pipe() and compose() - know the difference',
      'Explain when to use currying vs partial application',
      'Write a middleware system from scratch',
    ],
    relatedProblems: [
      'implement-curry',
      'implement-compose',
      'implement-pipe',
      'implement-curry-placeholder',
      'implement-partial',
      'implement-once',
    ],
  },
  {
    id: 'timing-control',
    title: 'Timing Control',
    category: 'core',
    difficulty: 'intermediate',
    description: 'Debounce and throttle are essential patterns for controlling function execution frequency. Debounce delays execution until activity stops; throttle limits execution rate. Both use closures to maintain timer state.',
    shortDescription: 'Debounce and throttle patterns',
    keyPoints: [
      'Debounce: waits for pause in calls before executing (e.g., search input)',
      'Throttle: executes at most once per interval (e.g., scroll handler)',
      'Both use closures to persist timer state between calls',
      'Leading edge: execute immediately on first call',
      'Trailing edge: execute after the wait period',
      'Cancel methods allow cleanup on unmount',
    ],
    examples: [
      {
        title: 'Basic Debounce',
        code: `function debounce(fn, wait) {
  let timeoutId;

  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), wait);
  };
}

// Usage: search input
const searchInput = document.getElementById('search');
const handleSearch = debounce((query) => {
  fetch(\`/api/search?q=\${query}\`);
}, 300);

searchInput.addEventListener('input', (e) => {
  handleSearch(e.target.value);
});
// Only searches 300ms after user stops typing`,
        explanation: 'Each call resets the timer; function runs after activity stops',
      },
      {
        title: 'Debounce with Leading/Trailing',
        code: `function debounce(fn, wait, options = {}) {
  let timeoutId;
  let lastArgs;
  const { leading = false, trailing = true } = options;

  return function(...args) {
    const shouldCallNow = leading && !timeoutId;
    lastArgs = args;

    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (trailing && lastArgs) {
        fn.apply(this, lastArgs);
      }
    }, wait);

    if (shouldCallNow) {
      fn.apply(this, args);
    }
  };
}

// Leading: execute immediately, then debounce
const saveNow = debounce(save, 1000, { leading: true, trailing: false });

// Trailing (default): wait for pause, then execute
const saveAfter = debounce(save, 1000, { leading: false, trailing: true });`,
        explanation: 'Leading fires immediately; trailing fires after wait period',
      },
      {
        title: 'Basic Throttle',
        code: `function throttle(fn, wait) {
  let lastTime = 0;

  return function(...args) {
    const now = Date.now();
    if (now - lastTime >= wait) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

// Usage: scroll handler
const handleScroll = throttle(() => {
  console.log('Scroll position:', window.scrollY);
}, 100);

window.addEventListener('scroll', handleScroll);
// Logs at most every 100ms while scrolling`,
        explanation: 'Throttle ensures function runs at most once per interval',
      },
      {
        title: 'Throttle with Leading/Trailing',
        code: `function throttle(fn, wait, options = {}) {
  let lastTime = 0;
  let timeoutId;
  const { leading = true, trailing = true } = options;

  return function(...args) {
    const now = Date.now();
    const remaining = wait - (now - lastTime);

    if (remaining <= 0 || remaining > wait) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      lastTime = now;
      if (leading || lastTime !== 0) {
        fn.apply(this, args);
      }
    } else if (!timeoutId && trailing) {
      timeoutId = setTimeout(() => {
        lastTime = leading ? Date.now() : 0;
        timeoutId = null;
        fn.apply(this, args);
      }, remaining);
    }
  };
}

// Trailing ensures final call executes after scrolling stops
const handleResize = throttle(recalculate, 200, { trailing: true });`,
        explanation: 'Trailing ensures the final invocation is not lost',
      },
      {
        title: 'Debounce with Cancel',
        code: `function debounce(fn, wait) {
  let timeoutId;

  function debounced(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), wait);
  }

  debounced.cancel = function() {
    clearTimeout(timeoutId);
    timeoutId = null;
  };

  return debounced;
}

// React usage with cleanup
function SearchComponent() {
  const debouncedSearch = useMemo(
    () => debounce(search, 300),
    []
  );

  useEffect(() => {
    return () => debouncedSearch.cancel();  // Cleanup on unmount
  }, [debouncedSearch]);

  return <input onChange={e => debouncedSearch(e.target.value)} />;
}`,
        explanation: 'Cancel method prevents stale executions after unmount',
      },
      {
        title: 'Comparison: Debounce vs Throttle',
        code: `// User types: a...b...c...d (each 50ms apart)
// wait = 200ms

// DEBOUNCE: waits for pause, then executes ONCE
// Timeline: a--b--c--d-------[execute with 'd']
// Calls: 0, 0, 0, 0, 0, 0, 0, 1

// THROTTLE: executes every 200ms
// Timeline: a--b--c--d--[exec]--[exec]
// Calls: 1, 0, 0, 0, 1, 0, 0, 1

// Use DEBOUNCE for:
// - Search input (wait for user to stop typing)
// - Window resize (recalculate after resizing stops)
// - Auto-save (save after user stops editing)

// Use THROTTLE for:
// - Scroll events (update UI at fixed rate)
// - Mouse move (track position without overwhelming)
// - API rate limiting (max N calls per second)`,
        explanation: 'Debounce: wait for pause. Throttle: limit rate.',
      },
    ],
    commonMistakes: [
      'Confusing debounce (wait for pause) with throttle (rate limit)',
      'Forgetting to cancel debounced functions on component unmount',
      'Not preserving "this" context in the returned function',
      'Using debounce when throttle is more appropriate (and vice versa)',
    ],
    interviewTips: [
      'Implement debounce from scratch with cancel method',
      'Implement throttle from scratch',
      'Explain when to use debounce vs throttle with examples',
      'Know how leading and trailing edge options work',
    ],
    relatedProblems: [
      'implement-debounce',
      'implement-throttle',
    ],
  },
  {
    id: 'memoization',
    title: 'Memoization',
    category: 'core',
    difficulty: 'intermediate',
    description: 'Memoization is an optimization technique that caches function results based on arguments. When called with the same inputs, the cached result is returned instead of recomputing. Essential for expensive calculations and React optimizations.',
    shortDescription: 'Cache function results',
    keyPoints: [
      'Memoization trades memory for speed - cache results for repeated calls',
      'Works best for pure functions (same input → same output)',
      'Cache key is typically derived from function arguments',
      'memoizeOne: caches only the last result (great for React)',
      'Consider cache invalidation and memory limits for production',
      'React.memo, useMemo, useCallback are built-in memoization',
    ],
    examples: [
      {
        title: 'Basic Memoization',
        code: `function memoize(fn) {
  const cache = new Map();

  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// Usage
const expensiveCalc = memoize((n) => {
  console.log('Computing...');
  return n * n;
});

expensiveCalc(5);  // "Computing..." → 25
expensiveCalc(5);  // → 25 (cached, no log)
expensiveCalc(10); // "Computing..." → 100`,
        explanation: 'Cache stores results keyed by stringified arguments',
      },
      {
        title: 'Custom Cache Key',
        code: `function memoize(fn, keyFn = JSON.stringify) {
  const cache = new Map();

  return function(...args) {
    const key = keyFn(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// Custom key for object arguments
const fetchUser = memoize(
  async (user) => await api.get(\`/users/\${user.id}\`),
  ([user]) => user.id  // Use only id as cache key
);

await fetchUser({ id: 1, name: 'Alice' });
await fetchUser({ id: 1, name: 'Bob' });  // Cache hit! Same id`,
        explanation: 'Custom keyFn allows flexible cache key generation',
      },
      {
        title: 'memoizeOne - Last Call Only',
        code: `function memoizeOne(fn) {
  let lastArgs = null;
  let lastResult;

  return function(...args) {
    // Check if args are the same as last call
    if (
      lastArgs !== null &&
      args.length === lastArgs.length &&
      args.every((arg, i) => arg === lastArgs[i])
    ) {
      return lastResult;
    }

    lastArgs = args;
    lastResult = fn.apply(this, args);
    return lastResult;
  };
}

// Perfect for React - only caches last result
const filterUsers = memoizeOne((users, query) => {
  console.log('Filtering...');
  return users.filter(u => u.name.includes(query));
});

filterUsers(users, 'A');  // "Filtering..."
filterUsers(users, 'A');  // cached (same args)
filterUsers(users, 'B');  // "Filtering..." (new args)
filterUsers(users, 'A');  // "Filtering..." (args changed)`,
        explanation: 'memoizeOne only remembers the last call - ideal for React renders',
      },
      {
        title: 'Cache with Max Size (LRU)',
        code: `function memoize(fn, maxSize = 100) {
  const cache = new Map();

  return function(...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      // Move to end (most recently used)
      const value = cache.get(key);
      cache.delete(key);
      cache.set(key, value);
      return value;
    }

    const result = fn.apply(this, args);

    if (cache.size >= maxSize) {
      // Remove oldest (first) entry
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    cache.set(key, result);
    return result;
  };
}

// Cache stays bounded at 100 entries
const memoizedFetch = memoize(fetchData, 100);`,
        explanation: 'LRU eviction prevents unbounded memory growth',
      },
      {
        title: 'React useMemo & useCallback',
        code: `function UserList({ users, filter }) {
  // Memoize expensive computation
  const filteredUsers = useMemo(() => {
    return users.filter(u => u.name.includes(filter));
  }, [users, filter]);  // Only recompute if deps change

  // Memoize callback to prevent child re-renders
  const handleClick = useCallback((userId) => {
    console.log('Clicked', userId);
  }, []);  // Empty deps = same function reference

  return (
    <div>
      {filteredUsers.map(user => (
        <UserRow
          key={user.id}
          user={user}
          onClick={handleClick}  // Stable reference
        />
      ))}
    </div>
  );
}

// Memoize component to skip re-renders
const UserRow = React.memo(({ user, onClick }) => (
  <div onClick={() => onClick(user.id)}>{user.name}</div>
));`,
        explanation: 'React provides useMemo, useCallback, and React.memo for memoization',
      },
      {
        title: 'Recursive Memoization (Fibonacci)',
        code: `// Without memoization: O(2^n) - exponential!
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}

// With memoization: O(n) - linear!
function memoizedFib() {
  const cache = {};

  function fib(n) {
    if (n in cache) return cache[n];
    if (n <= 1) return n;
    cache[n] = fib(n - 1) + fib(n - 2);
    return cache[n];
  }

  return fib;
}

const fib = memoizedFib();
fib(50);  // Instant! Without memo: years

// Or using our generic memoize
const fib = memoize((n) => {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
});`,
        explanation: 'Memoization transforms exponential recursion to linear',
      },
    ],
    commonMistakes: [
      'Memoizing impure functions (functions with side effects)',
      'Using memoize for functions that rarely repeat inputs',
      'Not considering memory usage for large caches',
      'Using JSON.stringify for objects with circular references',
      'Forgetting that React.memo does shallow comparison',
    ],
    interviewTips: [
      'Implement memoize() with configurable cache key function',
      'Implement memoizeOne() for React-style single-result caching',
      'Explain when memoization helps vs hurts performance',
      'Know how useMemo and useCallback work in React',
      'Discuss cache invalidation strategies',
    ],
    relatedProblems: [
      'implement-memoize',
      'implement-memoize-one',
    ],
  },

  // ===== PHASE 6: MODERN JS FEATURES =====

  // 6.1 Destructuring
  {
    id: 'destructuring-complete',
    title: 'Destructuring: Objects & Arrays',
    category: 'fundamentals',
    difficulty: 'beginner',
    estimatedReadTime: 10,
    interviewFrequency: 'high',
    prerequisites: ['arrays-basics', 'objects-basics'],
    nextConcepts: ['spread-operator-patterns'],
    description: 'Destructuring extracts values from arrays and objects into distinct variables. Essential for modern JavaScript development with support for defaults, renaming, and nesting.',
    shortDescription: 'Extract values into variables concisely',
    keyPoints: [
      'Object: const {a, b} = obj',
      'Array: const [x, y] = arr',
      'Defaults: const {a = 1} = obj',
      'Rename: const {a: newName} = obj',
      'Nested: const {a: {b}} = obj',
      'Params: function({a, b}) {}',
    ],
    examples: [
      {
        title: 'Object Destructuring',
        code: 'const user = { name: "Alice", age: 25 };\nconst { name, age } = user;\n// name = "Alice", age = 25\n\n// With defaults\nconst { city = "NYC" } = user;\n\n// Renaming\nconst { name: fullName } = user;',
        explanation: 'Extract properties with optional defaults and renaming',
      },
    ],
  },

  // 6.2 Spread Operator
  {
    id: 'spread-operator-patterns',
    title: 'Spread Operator Patterns',
    category: 'fundamentals',
    difficulty: 'beginner',
    estimatedReadTime: 8,
    interviewFrequency: 'high',
    prerequisites: ['destructuring-complete'],
    nextConcepts: ['rest-parameters'],
    description: 'The spread operator (...) expands iterables and objects. Essential for creating copies, combining data, and passing arguments. Creates shallow copies only.',
    shortDescription: 'Expand arrays and objects with ...',
    keyPoints: [
      'Arrays: [...arr1, ...arr2]',
      'Objects: {...obj1, ...obj2}',
      'Calls: fn(...args)',
      'Shallow copies',
      'Later props overwrite',
    ],
    examples: [
      {
        title: 'Array and Object Spread',
        code: 'const arr1 = [1, 2];\nconst arr2 = [3, 4];\nconst combined = [...arr1, ...arr2];\n// [1, 2, 3, 4]\n\nconst obj1 = { a: 1 };\nconst obj2 = { b: 2 };\nconst merged = { ...obj1, ...obj2 };\n// { a: 1, b: 2 }',
        explanation: 'Spread creates shallow copies and merges data',
      },
    ],
  },

  // 6.3 Rest Parameters
  {
    id: 'rest-parameters',
    title: 'Rest Parameters',
    category: 'fundamentals',
    difficulty: 'beginner',
    estimatedReadTime: 7,
    interviewFrequency: 'medium',
    prerequisites: ['spread-operator-patterns'],
    nextConcepts: ['template-literals'],
    description: 'Rest parameters collect remaining arguments into an array. Cleaner than the arguments object and works with arrow functions.',
    shortDescription: 'Collect remaining arguments into array',
    keyPoints: [
      'function(...args)',
      'Must be last parameter',
      'Real array (unlike arguments)',
      'Works with arrow functions',
    ],
    examples: [
      {
        title: 'Rest vs Arguments',
        code: 'function sum(...numbers) {\n  return numbers.reduce((a, b) => a + b, 0);\n}\nsum(1, 2, 3); // 6\n\n// Rest is real array\nconst logAll = (...args) => args.forEach(console.log);',
        explanation: 'Rest collects args into a real array with all methods',
      },
    ],
  },

  // 6.4 Template Literals
  {
    id: 'template-literals',
    title: 'Template Literals',
    category: 'fundamentals',
    difficulty: 'beginner',
    estimatedReadTime: 8,
    interviewFrequency: 'medium',
    prerequisites: ['functions'],
    nextConcepts: ['optional-chaining'],
    description: 'Template literals (backticks) provide string interpolation and multi-line strings. Replaces messy concatenation with clean syntax.',
    shortDescription: 'String interpolation with backticks',
    keyPoints: [
      'Interpolation: Hello \${name}',
      'Multi-line support',
      'Expression evaluation',
      'Tagged templates',
    ],
    examples: [
      {
        title: 'Template Literal Basics',
        code: 'const name = "Alice";\nconst age = 25;\nconst msg = `Hello, \${name}! You are \${age}.`;\n\n// Multi-line\nconst html = `\n  <div>\n    <h1>Title</h1>\n  </div>\n`;',
        explanation: 'Use backticks for interpolation and multi-line strings',
      },
    ],
  },

  // 6.5 Optional Chaining
  {
    id: 'optional-chaining',
    title: 'Optional Chaining (?.)',
    category: 'fundamentals',
    difficulty: 'intermediate',
    estimatedReadTime: 8,
    interviewFrequency: 'high',
    prerequisites: ['objects-basics'],
    nextConcepts: ['nullish-coalescing'],
    description: 'Optional chaining allows safe nested property access. Returns undefined if any part of chain is nullish instead of throwing.',
    shortDescription: 'Safe property access with ?.',
    keyPoints: [
      'obj?.property',
      'obj?.[key]',
      'func?.()',
      'Short-circuits on nullish',
      'Read-only (no assignment)',
    ],
    examples: [
      {
        title: 'Optional Chaining Usage',
        code: 'const user = { address: { city: "NYC" } };\n\n// Without: verbose\nconst city = user && user.address && user.address.city;\n\n// With: clean\nconst city = user?.address?.city;\n\n// Combined with nullish coalescing\nconst zip = user?.address?.zip ?? "Unknown";',
        explanation: '?. safely accesses nested properties, returning undefined if nullish',
      },
    ],
  },

  // 6.6 Nullish Coalescing
  {
    id: 'nullish-coalescing',
    title: 'Nullish Coalescing (??)',
    category: 'fundamentals',
    difficulty: 'intermediate',
    estimatedReadTime: 7,
    interviewFrequency: 'high',
    prerequisites: ['optional-chaining'],
    nextConcepts: ['logical-assignment'],
    description: 'Nullish coalescing returns right side only for null/undefined. Unlike || which treats 0 and "" as falsy.',
    shortDescription: 'Default values for null/undefined only',
    keyPoints: [
      'a ?? b for null/undefined',
      'Unlike || (0, "" matter)',
      'Cannot mix with && ||',
      'Use when 0/"" valid',
    ],
    examples: [
      {
        title: '?? vs ||',
        code: 'const value = 0;\n\n// Wrong: || replaces 0\nvalue || 100; // 100\n\n// Right: ?? keeps 0\nvalue ?? 100; // 0\n\nconst empty = "";\nempty || "default"; // "default"\nempty ?? "default"; // ""',
        explanation: '?? only checks null/undefined, not all falsy values',
      },
    ],
  },

  // 6.7 Logical Assignment
  {
    id: 'logical-assignment',
    title: 'Logical Assignment Operators',
    category: 'fundamentals',
    difficulty: 'intermediate',
    estimatedReadTime: 6,
    interviewFrequency: 'low',
    prerequisites: ['nullish-coalescing'],
    nextConcepts: [],
    description: 'Logical assignment operators: ??= (nullish), ||= (OR), &&= (AND). Assign conditionally based on current value.',
    shortDescription: '??=, ||=, &&= operators',
    keyPoints: [
      'x ??= y (nullish)',
      'x ||= y (falsy)',
      'x &&= y (truthy)',
      'Conditional assignment',
    ],
    examples: [
      {
        title: 'Logical Assignment',
        code: 'let count = null;\ncount ??= 0; // sets to 0\n\nlet name = "";\nname ||= "Anonymous"; // sets to "Anonymous"\n\nlet value = "hello";\nvalue &&= value.toUpperCase(); // "HELLO"',
        explanation: 'Assign based on current value state',
      },
    ],
  },

  // ===== PHASE 7: ERROR HANDLING =====

  // 7.1 Try/Catch/Finally
  {
    id: 'try-catch-finally',
    title: 'Try, Catch, Finally',
    category: 'fundamentals',
    difficulty: 'beginner',
    estimatedReadTime: 8,
    interviewFrequency: 'high',
    prerequisites: ['functions'],
    nextConcepts: ['error-types-native'],
    description: 'Try...catch...finally handles errors gracefully. Catch receives error object. Finally always executes for cleanup.',
    shortDescription: 'Graceful error handling',
    keyPoints: [
      'try: code that might throw',
      'catch: handles errors',
      'finally: always runs',
      'Error object properties',
      'Can re-throw',
    ],
    examples: [
      {
        title: 'Try/Catch Pattern',
        code: 'try {\n  riskyOperation();\n} catch (error) {\n  console.error(error.message);\n} finally {\n  // cleanup always runs\n  closeConnection();\n}',
        explanation: 'Handle errors gracefully with guaranteed cleanup',
      },
    ],
  },

  // 7.2 Error Types
  {
    id: 'error-types-native',
    title: 'Native Error Types',
    category: 'fundamentals',
    difficulty: 'beginner',
    estimatedReadTime: 6,
    interviewFrequency: 'medium',
    prerequisites: ['try-catch-finally'],
    nextConcepts: ['throwing-custom-errors'],
    description: 'Built-in error types: Error, TypeError, ReferenceError, SyntaxError, RangeError. Each for different failure scenarios.',
    shortDescription: 'Built-in error constructors',
    keyPoints: [
      'Error: base type',
      'TypeError: wrong type',
      'ReferenceError: undefined var',
      'SyntaxError: invalid code',
      'RangeError: out of range',
    ],
    examples: [
      {
        title: 'Common Errors',
        code: 'null.doSomething(); // TypeError\nundefinedVar; // ReferenceError\nnew Array(-1); // RangeError',
        explanation: 'Different errors for different failure scenarios',
      },
    ],
  },

  // 7.3 Custom Errors
  {
    id: 'throwing-custom-errors',
    title: 'Creating Custom Errors',
    category: 'fundamentals',
    difficulty: 'intermediate',
    estimatedReadTime: 8,
    interviewFrequency: 'medium',
    prerequisites: ['error-types-native'],
    nextConcepts: [],
    description: 'Extend Error class for semantic error handling. Add custom properties, proper stack traces, and type checking.',
    shortDescription: 'Extending Error for custom types',
    keyPoints: [
      'Extend Error class',
      'Set name property',
      'Capture stack trace',
      'Custom properties',
      'instanceof checks',
    ],
    examples: [
      {
        title: 'Custom Error Class',
        code: 'class ValidationError extends Error {\n  constructor(message, field) {\n    super(message);\n    this.name = "ValidationError";\n    this.field = field;\n  }\n}\n\nthrow new ValidationError("Required", "email");',
        explanation: 'Create semantic error types with custom properties',
      },
    ],
  },

  // ===== PHASE 8: TYPE COERCION =====

  // 8.1 Implicit Coercion
  {
    id: 'implicit-coercion-rules',
    title: 'Implicit Type Coercion',
    category: 'fundamentals',
    difficulty: 'intermediate',
    estimatedReadTime: 10,
    interviewFrequency: 'high',
    prerequisites: ['operators', 'data-types'],
    nextConcepts: ['coercion-edge-cases'],
    description: 'JS automatically converts types in operations. Understanding coercion prevents bugs. Use === to avoid comparison coercion.',
    shortDescription: 'When JS automatically converts types',
    keyPoints: [
      'Arithmetic converts to numbers',
      'String + anything = string',
      '== coerces, === does not',
      'Logical ops return values',
      'Falsy/truthy rules',
    ],
    examples: [
      {
        title: 'Coercion Examples',
        code: '"5" + 3; // "53" (string)\n"5" - 3; // 2 (number)\n"5" == 5; // true (coerced)\n"5" === 5; // false (no coerce)',
        explanation: '+ with string concatenates. Other ops convert to number.',
      },
    ],
  },

  // 8.2 Coercion Edge Cases
  {
    id: 'coercion-edge-cases',
    title: 'Notorious Coercion Edge Cases',
    category: 'fundamentals',
    difficulty: 'advanced',
    estimatedReadTime: 8,
    interviewFrequency: 'medium',
    prerequisites: ['implicit-coercion-rules'],
    nextConcepts: [],
    description: 'Famous JS quirks: [] + [], typeof null, NaN !== NaN. Know these for interviews and to write defensive code.',
    shortDescription: 'Famous JS quirks and gotchas',
    keyPoints: [
      '[] + [] = ""',
      '[] + {} = "[object Object]"',
      'typeof null = "object"',
      'NaN !== NaN',
    ],
    examples: [
      {
        title: 'Famous Gotchas',
        code: '[] + []; // ""\n[] + {}; // "[object Object]"\ntypeof null; // "object" (bug)\nNaN === NaN; // false',
        explanation: 'Historic bugs and quirks in JS coercion',
      },
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
  // Phase 1: JavaScript Deep Dive
  'promises-deep-dive': ['event-loop', 'closures', 'async-evolution'],
  'function-composition': ['closures', 'functions', 'memoization'],
  'timing-control': ['closures', 'event-loop', 'memoization'],
  'memoization': ['closures', 'function-composition', 'recursion'],
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

export function getRelatedProblems(id: string): string[] {
  const concept = getConceptById(id)
  return concept?.relatedProblems || []
}
