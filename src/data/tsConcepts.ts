export interface TSConceptExample {
  title: string
  code: string
  explanation: string
}

export interface TSConceptQuestion {
  question: string
  answer: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export type TSConceptCategory =
  | 'ts-foundations'
  | 'ts-utility-types'
  | 'ts-advanced'
  | 'ts-react'
  | 'ts-interview'

export interface TSConcept {
  id: string
  title: string
  category: TSConceptCategory
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  description: string
  shortDescription: string
  keyPoints: string[]
  examples: TSConceptExample[]
  commonMistakes: string[]
  interviewTips: string[]
  interviewFrequency: 'very-high' | 'high' | 'medium' | 'low'
  estimatedReadTime: number
  prerequisites: string[]
  nextConcepts: string[]
  commonQuestions?: TSConceptQuestion[]
}

export interface TSConceptCategoryInfo {
  id: TSConceptCategory
  label: string
  order: number
}

export const tsConceptCategories: TSConceptCategoryInfo[] = [
  { id: 'ts-foundations', label: 'Foundations', order: 0 },
  { id: 'ts-utility-types', label: 'Utility Types', order: 1 },
  { id: 'ts-advanced', label: 'Advanced', order: 2 },
  { id: 'ts-react', label: 'React + TS', order: 3 },
  { id: 'ts-interview', label: 'Interview', order: 4 },
]

export const tsConcepts: TSConcept[] = [
  // ==========================================================================
  // FOUNDATIONS
  // ==========================================================================
  {
    id: 'ts-basics',
    title: 'TypeScript Basics',
    category: 'ts-foundations',
    difficulty: 'beginner',
    description: 'TypeScript adds a compile-time type system on top of JavaScript. Every valid JavaScript file is already valid TypeScript, but TypeScript lets you annotate variables, parameters, and return values so the compiler catches errors before your code ever runs. Understanding the primitive types, type annotations, and basic inference rules is the foundation for everything else in TypeScript.',
    shortDescription: 'Type annotations, primitives, and basic inference',
    keyPoints: [
      'TypeScript is a strict superset of JavaScript — all JS is valid TS',
      'Type annotations use a colon syntax: `let name: string`',
      'Primitive types include string, number, boolean, null, undefined, symbol, and bigint',
      'TypeScript infers types when you assign a value, so explicit annotations are often optional',
      'The `unknown` type is the type-safe counterpart of `any` — it requires narrowing before use',
      'Union types (`string | number`) allow a value to be one of several types',
      'Literal types (`"hello"` or `42`) restrict values to exact literals',
    ],
    examples: [
      {
        title: 'Type Annotations & Inference',
        code: `// Explicit annotations
let name: string = 'Alice'
let age: number = 30
let active: boolean = true

// TypeScript infers these types automatically
let city = 'London'       // inferred as string
let score = 100           // inferred as number
let items = [1, 2, 3]     // inferred as number[]

// Function with typed parameters and return
function greet(name: string, formal: boolean): string {
  return formal ? \`Dear \${name}\` : \`Hi \${name}\`
}`,
        explanation: 'TypeScript can infer types from initial assignments, but explicit annotations on function parameters are required when the compiler cannot infer them from context.',
      },
      {
        title: 'Union & Literal Types',
        code: `// Union type — accepts multiple types
type ID = string | number

function findUser(id: ID): void {
  if (typeof id === 'string') {
    console.log(id.toUpperCase()) // TS knows id is string here
  } else {
    console.log(id.toFixed(2))    // TS knows id is number here
  }
}

// Literal type — restricts to exact values
type Direction = 'north' | 'south' | 'east' | 'west'

function move(dir: Direction): void {
  // dir can only be one of the four strings
}

move('north') // OK
// move('up')  // Error: not assignable to Direction`,
        explanation: 'Union types combine multiple types, while literal types restrict a value to specific constants. Together they model finite sets of valid values.',
      },
      {
        title: 'Interfaces vs Type Aliases',
        code: `// Interface — describes object shapes, can be extended
interface User {
  name: string
  age: number
}

interface Admin extends User {
  role: 'admin'
}

// Type alias — can represent any type, including unions
type Result = { success: true; data: string } | { success: false; error: string }

// Intersection type — combine multiple types
type AdminUser = User & { role: 'admin'; permissions: string[] }`,
        explanation: 'Interfaces define object contracts and support declaration merging. Type aliases are more flexible — they can represent unions, intersections, and mapped types.',
      },
    ],
    commonMistakes: [
      'Using `any` to silence type errors instead of properly typing the value',
      'Confusing `unknown` with `any` — unknown requires narrowing, any bypasses all checks',
      'Forgetting that TypeScript types are erased at runtime — they provide no runtime safety',
      'Over-annotating when TypeScript can infer the type automatically',
      'Using `String` (capital S object wrapper) instead of `string` (primitive type)',
    ],
    interviewTips: [
      'Explain the difference between `any` and `unknown` — this is a classic question',
      'Know when to use `interface` vs `type` — interfaces for object shapes, types for unions and complex compositions',
      'Mention that TypeScript is structurally typed, not nominally typed',
      'Be ready to explain type inference and when explicit annotations are needed',
    ],
    interviewFrequency: 'very-high',
    estimatedReadTime: 10,
    prerequisites: [],
    nextConcepts: ['ts-type-narrowing', 'ts-generics'],
    commonQuestions: [
      {
        question: 'What is the difference between `any` and `unknown`?',
        answer: '`any` disables all type checking — you can do anything with an `any` value. `unknown` is type-safe: you must narrow the type (e.g., with typeof or instanceof) before performing operations on it.',
        difficulty: 'easy',
      },
      {
        question: 'When should you use `interface` vs `type`?',
        answer: 'Use `interface` for object shapes that may be extended or implemented. Use `type` for unions, intersections, mapped types, or when you need to alias a primitive or tuple. Interfaces support declaration merging; type aliases do not.',
        difficulty: 'medium',
      },
      {
        question: 'Does TypeScript provide runtime type checking?',
        answer: 'No. TypeScript types are completely erased during compilation to JavaScript. For runtime validation, use libraries like Zod, io-ts, or manual type guards.',
        difficulty: 'easy',
      },
    ],
  },
  {
    id: 'ts-type-narrowing',
    title: 'Type Narrowing',
    category: 'ts-foundations',
    difficulty: 'intermediate',
    description: 'Type narrowing is the process by which TypeScript refines a broad type to a more specific one within a conditional branch. When you use `typeof`, `instanceof`, `in`, or custom type guards, TypeScript tracks the control flow and narrows the type so you can safely access properties or methods that only exist on the narrowed type.',
    shortDescription: 'Refining types with control flow and type guards',
    keyPoints: [
      '`typeof` narrows primitive types: string, number, boolean, symbol, bigint, function, object, undefined',
      '`instanceof` narrows class instances by checking the prototype chain',
      'The `in` operator narrows by checking if a property exists on the object',
      'Discriminated unions use a common literal property to narrow between variants',
      'Custom type guards (functions returning `x is Type`) enable reusable narrowing logic',
      'Truthiness checks narrow out `null`, `undefined`, `0`, `""`, and `false`',
      'The `never` type appears when all possibilities are exhausted — useful for exhaustive checks',
    ],
    examples: [
      {
        title: 'typeof & instanceof Guards',
        code: `function format(value: string | number | Date): string {
  if (typeof value === 'string') {
    return value.trim()          // narrowed to string
  }
  if (typeof value === 'number') {
    return value.toFixed(2)      // narrowed to number
  }
  // TypeScript knows value is Date here
  return value.toISOString()
}

class ApiError extends Error {
  statusCode: number
  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
  }
}

function handleError(err: Error) {
  if (err instanceof ApiError) {
    console.log(err.statusCode)  // narrowed to ApiError
  }
}`,
        explanation: 'typeof works for primitives, instanceof for class instances. TypeScript follows your control flow and narrows the type in each branch automatically.',
      },
      {
        title: 'Discriminated Unions',
        code: `type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; side: number }
  | { kind: 'rectangle'; width: number; height: number }

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2
    case 'square':
      return shape.side ** 2
    case 'rectangle':
      return shape.width * shape.height
  }
}

// Exhaustive check helper
function assertNever(x: never): never {
  throw new Error(\`Unexpected value: \${x}\`)
}`,
        explanation: 'Discriminated unions use a shared literal property (like `kind`) as a discriminant. TypeScript narrows the union in each case branch, giving you access to variant-specific properties.',
      },
      {
        title: 'Custom Type Guards',
        code: `interface Fish {
  swim: () => void
}

interface Bird {
  fly: () => void
}

// Custom type guard — returns a type predicate
function isFish(pet: Fish | Bird): pet is Fish {
  return 'swim' in pet
}

function move(pet: Fish | Bird): void {
  if (isFish(pet)) {
    pet.swim()  // narrowed to Fish
  } else {
    pet.fly()   // narrowed to Bird
  }
}

// Assertion function — throws if assertion fails
function assertString(val: unknown): asserts val is string {
  if (typeof val !== 'string') {
    throw new TypeError('Expected a string')
  }
}`,
        explanation: 'Custom type guards let you encapsulate narrowing logic in reusable functions. The `pet is Fish` return type tells TypeScript to narrow the parameter in the truthy branch.',
      },
    ],
    commonMistakes: [
      'Forgetting that `typeof null` returns "object" — null must be checked separately',
      'Using `==` instead of `===` which can coerce types and confuse narrowing',
      'Not handling all cases in a discriminated union (missing exhaustive check)',
      'Writing type guards that do not actually narrow correctly at runtime',
      'Relying on truthiness checks when `0` or `""` are valid values',
    ],
    interviewTips: [
      'Discriminated unions are a favorite interview topic — know the pattern cold',
      'Explain the `never` type and exhaustive checking with `assertNever`',
      'Custom type guards show advanced TypeScript knowledge — mention `is` predicates',
      'Know the difference between type assertions (`as`) and type guards (runtime checks)',
    ],
    interviewFrequency: 'very-high',
    estimatedReadTime: 12,
    prerequisites: ['ts-basics'],
    nextConcepts: ['ts-generics', 'ts-type-assertions'],
    commonQuestions: [
      {
        question: 'What is a discriminated union in TypeScript?',
        answer: 'A discriminated union is a union of types that share a common literal property (the discriminant). TypeScript uses this property to narrow the union in switch/if blocks, giving safe access to variant-specific fields.',
        difficulty: 'medium',
      },
      {
        question: 'How do custom type guard functions work?',
        answer: 'A type guard is a function whose return type is a type predicate (`param is Type`). When the function returns true, TypeScript narrows the parameter to that type in the calling scope.',
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'ts-generics',
    title: 'Generics',
    category: 'ts-foundations',
    difficulty: 'intermediate',
    description: 'Generics let you write reusable code that works with any type while preserving type safety. Instead of using `any`, you define type parameters (like `<T>`) that act as placeholders. The actual type is filled in when the generic is used, so TypeScript can still check everything at compile time. Generics appear in functions, interfaces, classes, and type aliases.',
    shortDescription: 'Reusable, type-safe code with type parameters',
    keyPoints: [
      'Generics use angle brackets `<T>` to declare type parameters',
      'Type parameters act as placeholders that are filled in at usage site',
      'Constraints (`extends`) limit what types a generic can accept',
      'Default type parameters (`<T = string>`) provide fallback types',
      'Multiple type parameters (`<K, V>`) are common in maps and key-value patterns',
      'Generic inference lets TypeScript determine `T` from function arguments automatically',
      'Generics preserve the relationship between input and output types',
    ],
    examples: [
      {
        title: 'Generic Functions',
        code: `// Identity function — preserves the exact input type
function identity<T>(value: T): T {
  return value
}

const str = identity('hello')  // inferred as string
const num = identity(42)       // inferred as number

// Generic with constraint
function getLength<T extends { length: number }>(item: T): number {
  return item.length
}

getLength('hello')    // OK — string has length
getLength([1, 2, 3])  // OK — array has length
// getLength(42)      // Error — number has no length

// Multiple type parameters
function mapObject<K extends string, V, R>(
  obj: Record<K, V>,
  fn: (value: V, key: K) => R
): Record<K, R> {
  const result = {} as Record<K, R>
  for (const key in obj) {
    result[key] = fn(obj[key], key)
  }
  return result
}`,
        explanation: 'Generic functions infer their type parameters from arguments. Constraints (extends) restrict what types are acceptable, ensuring the generic body can safely use specific properties.',
      },
      {
        title: 'Generic Interfaces & Classes',
        code: `// Generic interface
interface Repository<T> {
  findById(id: string): T | undefined
  findAll(): T[]
  save(item: T): void
}

// Generic class
class Stack<T> {
  private items: T[] = []

  push(item: T): void {
    this.items.push(item)
  }

  pop(): T | undefined {
    return this.items.pop()
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1]
  }

  get size(): number {
    return this.items.length
  }
}

const numStack = new Stack<number>()
numStack.push(1)
numStack.push(2)
const top = numStack.pop() // type is number | undefined`,
        explanation: 'Generic interfaces and classes parameterize their type at the class/interface level, so all methods share the same type parameter throughout.',
      },
      {
        title: 'Default & Constrained Generics',
        code: `// Default type parameter
interface ApiResponse<T = unknown> {
  data: T
  status: number
  message: string
}

// No type argument needed — defaults to unknown
const res: ApiResponse = { data: null, status: 200, message: 'OK' }

// With explicit type
const userRes: ApiResponse<{ name: string }> = {
  data: { name: 'Alice' },
  status: 200,
  message: 'OK',
}

// keyof constraint — ensures K is a valid key of T
function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>
  for (const key of keys) {
    result[key] = obj[key]
  }
  return result
}

const user = { name: 'Alice', age: 30, email: 'a@b.com' }
const subset = pick(user, ['name', 'email'])
// type: { name: string; email: string }`,
        explanation: 'Default type parameters reduce boilerplate when a common type is expected. The `keyof` constraint is a powerful pattern for ensuring type-safe property access.',
      },
    ],
    commonMistakes: [
      'Using `any` instead of a generic when the type should be preserved',
      'Over-constraining generics with unnecessary `extends` that limit reusability',
      'Forgetting that generic type parameters are erased at runtime',
      'Not leveraging type inference — explicitly passing type args when TS can infer them',
      'Creating overly complex generic signatures that are hard to read and maintain',
    ],
    interviewTips: [
      'Be able to write a generic function from scratch during an interview',
      'Explain the difference between generics and `any` in terms of type safety',
      'Know how `keyof` and `extends` work together for property-safe access',
      'Mention real-world use cases: API responses, collections, utility functions',
    ],
    interviewFrequency: 'very-high',
    estimatedReadTime: 12,
    prerequisites: ['ts-basics'],
    nextConcepts: ['ts-utility-types', 'ts-advanced-generics'],
    commonQuestions: [
      {
        question: 'Why use generics instead of `any`?',
        answer: 'Generics preserve the relationship between input and output types. With `any`, TypeScript loses all type information. Generics let you write flexible code that is still fully type-checked.',
        difficulty: 'easy',
      },
      {
        question: 'What does `extends` mean in a generic constraint?',
        answer: 'In `<T extends SomeType>`, extends constrains T to be assignable to SomeType. This means T must have at least all the properties of SomeType, enabling safe property access inside the generic.',
        difficulty: 'medium',
      },
    ],
  },

  // ==========================================================================
  // UTILITY TYPES
  // ==========================================================================
  {
    id: 'ts-utility-types',
    title: 'Utility Types',
    category: 'ts-utility-types',
    difficulty: 'intermediate',
    description: 'TypeScript ships with built-in utility types that transform existing types into new ones. These let you derive types from other types without duplicating definitions. Understanding utility types is essential because they appear constantly in real codebases and are a staple of TypeScript interviews.',
    shortDescription: 'Built-in type transformers: Partial, Pick, Omit, and more',
    keyPoints: [
      '`Partial<T>` makes all properties of T optional',
      '`Required<T>` makes all properties of T required',
      '`Pick<T, K>` creates a type with only the specified keys from T',
      '`Omit<T, K>` creates a type with all keys except the specified ones',
      '`Record<K, V>` creates an object type with keys K and values V',
      '`Readonly<T>` makes all properties of T read-only',
      '`ReturnType<T>` extracts the return type of a function type',
    ],
    examples: [
      {
        title: 'Partial, Required & Readonly',
        code: `interface User {
  id: number
  name: string
  email: string
  avatar?: string
}

// Partial — all fields become optional
type UpdateUser = Partial<User>
// { id?: number; name?: string; email?: string; avatar?: string }

function updateUser(id: number, updates: Partial<User>): User {
  const existing = getUserById(id)
  return { ...existing, ...updates }
}

// Required — all fields become required (removes ?)
type CompleteUser = Required<User>
// avatar is now required

// Readonly — prevents mutation
type FrozenUser = Readonly<User>
const user: FrozenUser = { id: 1, name: 'Alice', email: 'a@b.com' }
// user.name = 'Bob'  // Error: Cannot assign to 'name'

declare function getUserById(id: number): User`,
        explanation: 'Partial is the most commonly used utility type. It is perfect for update/patch operations where only some fields need to change.',
      },
      {
        title: 'Pick, Omit & Record',
        code: `interface Product {
  id: string
  name: string
  price: number
  description: string
  category: string
  createdAt: Date
}

// Pick — select specific properties
type ProductSummary = Pick<Product, 'id' | 'name' | 'price'>
// { id: string; name: string; price: number }

// Omit — remove specific properties
type ProductInput = Omit<Product, 'id' | 'createdAt'>
// { name: string; price: number; description: string; category: string }

// Record — create an object type from keys and value type
type CategoryCounts = Record<string, number>
const counts: CategoryCounts = {
  electronics: 42,
  clothing: 18,
}

// Record with union keys
type StatusMap = Record<'active' | 'inactive' | 'pending', User[]>`,
        explanation: 'Pick and Omit are complementary — one selects properties, the other excludes them. Record is ideal for dictionary-like objects with known key patterns.',
      },
      {
        title: 'Extract, Exclude & ReturnType',
        code: `type EventType = 'click' | 'scroll' | 'mousemove' | 'keydown' | 'keyup'

// Extract — keep only members that match
type MouseEvents = Extract<EventType, 'click' | 'scroll' | 'mousemove'>
// 'click' | 'scroll' | 'mousemove'

// Exclude — remove members that match
type KeyboardEvents = Exclude<EventType, 'click' | 'scroll' | 'mousemove'>
// 'keydown' | 'keyup'

// ReturnType — extract return type of a function
function createUser(name: string, age: number) {
  return { id: crypto.randomUUID(), name, age, createdAt: new Date() }
}

type NewUser = ReturnType<typeof createUser>
// { id: string; name: string; age: number; createdAt: Date }

// Parameters — extract parameter types as a tuple
type CreateUserParams = Parameters<typeof createUser>
// [name: string, age: number]`,
        explanation: 'Extract and Exclude operate on union types. ReturnType and Parameters operate on function types. These are powerful for deriving types from existing code without duplication.',
      },
    ],
    commonMistakes: [
      'Redefining types manually when a utility type would derive it from an existing type',
      'Confusing Pick (select properties) with Extract (filter union members)',
      'Using `Omit<T, "key">` without realizing it does not error on non-existent keys',
      'Forgetting that `Readonly` is shallow — nested objects remain mutable',
      'Not knowing that `Partial` makes ALL properties optional, including required ones',
    ],
    interviewTips: [
      'Be ready to explain the difference between Pick and Omit with real examples',
      'Know how to implement Partial, Pick, and Readonly from scratch using mapped types',
      'Mention that utility types are built on mapped types and conditional types under the hood',
      'Show fluency by combining utility types: `Partial<Pick<User, "name" | "email">>`',
    ],
    interviewFrequency: 'very-high',
    estimatedReadTime: 10,
    prerequisites: ['ts-basics', 'ts-generics'],
    nextConcepts: ['ts-mapped-types', 'ts-conditional-types'],
    commonQuestions: [
      {
        question: 'Implement Partial<T> from scratch.',
        answer: '`type MyPartial<T> = { [K in keyof T]?: T[K] }`. It uses a mapped type to iterate over all keys of T and makes each property optional with the `?` modifier.',
        difficulty: 'medium',
      },
      {
        question: 'What is the difference between Pick and Extract?',
        answer: 'Pick selects properties from an object type by key. Extract filters members from a union type that are assignable to a given type. Pick works on object types, Extract works on union types.',
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'ts-mapped-types',
    title: 'Mapped Types',
    category: 'ts-utility-types',
    difficulty: 'advanced',
    description: 'Mapped types let you create new types by transforming each property of an existing type. They use the `in keyof` syntax to iterate over property keys and apply transformations such as making properties optional, readonly, or changing their value types. All of TypeScript\'s built-in utility types like Partial, Required, and Readonly are implemented as mapped types.',
    shortDescription: 'Transform object types property by property',
    keyPoints: [
      'Syntax: `{ [K in keyof T]: TransformedType }` iterates over all keys of T',
      'Modifiers `?` (optional) and `readonly` can be added or removed with `+` / `-`',
      'Key remapping with `as` lets you rename or filter keys: `{ [K in keyof T as NewKey]: T[K] }`',
      'Template literal types in key remapping enable pattern-based key transformations',
      'Mapped types can be combined with conditional types for powerful type-level logic',
      'The `-?` modifier removes optionality (used by `Required<T>` internally)',
    ],
    examples: [
      {
        title: 'Basic Mapped Types',
        code: `// Make all properties optional (this is how Partial works)
type MyPartial<T> = {
  [K in keyof T]?: T[K]
}

// Make all properties required (remove ?)
type MyRequired<T> = {
  [K in keyof T]-?: T[K]
}

// Make all properties readonly
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K]
}

// Make all property values nullable
type Nullable<T> = {
  [K in keyof T]: T[K] | null
}

interface Config {
  host: string
  port: number
  debug?: boolean
}

type NullableConfig = Nullable<Config>
// { host: string | null; port: number | null; debug?: boolean | null }`,
        explanation: 'Mapped types iterate over each key in a type and produce a new type. The `in keyof` clause enumerates all property keys, and you can transform both keys and values.',
      },
      {
        title: 'Key Remapping with `as`',
        code: `// Prefix all keys with "get"
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K]
}

interface Person {
  name: string
  age: number
}

type PersonGetters = Getters<Person>
// { getName: () => string; getAge: () => number }

// Filter keys by value type — keep only string properties
type StringKeysOnly<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K]
}

interface Mixed {
  name: string
  age: number
  email: string
  active: boolean
}

type StringProps = StringKeysOnly<Mixed>
// { name: string; email: string }`,
        explanation: 'Key remapping with `as` lets you transform or filter property keys. Mapping a key to `never` removes it from the output type, which is how you filter properties by their value type.',
      },
      {
        title: 'Event Handler Map Pattern',
        code: `// Real-world pattern: generate event handler types from an event map
interface EventMap {
  click: { x: number; y: number }
  focus: { target: HTMLElement }
  submit: { data: FormData }
}

type EventHandlers<T> = {
  [K in keyof T as \`on\${Capitalize<string & K>}\`]: (event: T[K]) => void
}

type Handlers = EventHandlers<EventMap>
// {
//   onClick: (event: { x: number; y: number }) => void
//   onFocus: (event: { target: HTMLElement }) => void
//   onSubmit: (event: { data: FormData }) => void
// }

// Make specific keys optional, rest required
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

type UserWithOptionalEmail = PartialBy<Person & { email: string }, 'email'>`,
        explanation: 'Mapped types with template literal keys enable powerful patterns like auto-generating event handler interfaces from event definitions. This is a common pattern in UI frameworks.',
      },
    ],
    commonMistakes: [
      'Forgetting the `string &` intersection when using template literal key remapping (K may be symbol)',
      'Not realizing that mapped types distribute over union types in `keyof`',
      'Confusing the `-?` modifier (remove optional) with just `?` (add optional)',
      'Writing overly complex mapped types that are difficult to debug',
      'Not knowing that homomorphic mapped types preserve modifiers from the original type',
    ],
    interviewTips: [
      'Be able to implement Partial, Required, and Readonly from scratch — they are all mapped types',
      'Key remapping with `as` is an advanced feature that impresses interviewers',
      'Explain how `never` in key position removes a property from the mapped type',
      'Mention that built-in utility types are mapped types under the hood',
    ],
    interviewFrequency: 'high',
    estimatedReadTime: 12,
    prerequisites: ['ts-generics', 'ts-utility-types'],
    nextConcepts: ['ts-conditional-types', 'ts-advanced-generics'],
    commonQuestions: [
      {
        question: 'How do you filter object properties by value type using mapped types?',
        answer: 'Use key remapping with a conditional: `{ [K in keyof T as T[K] extends TargetType ? K : never]: T[K] }`. Keys that map to `never` are excluded from the result.',
        difficulty: 'hard',
      },
      {
        question: 'What does the `-?` modifier do in a mapped type?',
        answer: 'The `-?` modifier removes the optional flag from properties. This is how `Required<T>` works: `{ [K in keyof T]-?: T[K] }` makes every property required.',
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'ts-conditional-types',
    title: 'Conditional Types',
    category: 'ts-utility-types',
    difficulty: 'advanced',
    description: 'Conditional types select one of two types based on a condition, similar to a ternary operator but at the type level. The syntax `T extends U ? X : Y` checks if T is assignable to U and resolves to X or Y accordingly. When combined with `infer`, conditional types can extract types from complex structures, enabling powerful type-level programming.',
    shortDescription: 'Type-level ternary with `extends` and `infer`',
    keyPoints: [
      'Syntax: `T extends U ? TrueType : FalseType` — a type-level ternary',
      'Conditional types distribute over union types when T is a bare type parameter',
      'The `infer` keyword declares an inner type variable to extract sub-types',
      '`ReturnType<T>` is implemented as a conditional type with infer',
      'Nested conditionals can chain multiple checks for complex logic',
      'Use `[T] extends [U]` (wrapped in tuple) to prevent distribution over unions',
    ],
    examples: [
      {
        title: 'Basic Conditional Types',
        code: `// Simple conditional type
type IsString<T> = T extends string ? true : false

type A = IsString<string>   // true
type B = IsString<number>   // false
type C = IsString<'hello'>  // true (literal extends string)

// Distributive behavior over unions
type D = IsString<string | number>  // true | false => boolean

// Prevent distribution with tuple wrapping
type IsStringStrict<T> = [T] extends [string] ? true : false
type E = IsStringStrict<string | number>  // false (union is not string)

// Practical example: non-nullable
type NonNullable<T> = T extends null | undefined ? never : T

type F = NonNullable<string | null | undefined>  // string`,
        explanation: 'Conditional types perform type-level branching. They distribute over unions by default, meaning each member of a union is checked individually. This is how Exclude and Extract work.',
      },
      {
        title: 'The `infer` Keyword',
        code: `// Extract return type of a function
type MyReturnType<T> = T extends (...args: unknown[]) => infer R ? R : never

type Fn = (x: string) => number
type Result = MyReturnType<Fn>  // number

// Extract element type of an array
type ElementOf<T> = T extends (infer E)[] ? E : never
type Nums = ElementOf<number[]>  // number

// Extract promise value
type Awaited<T> = T extends Promise<infer V> ? Awaited<V> : T
type Val = Awaited<Promise<Promise<string>>>  // string (recursive!)

// Extract first argument type
type FirstArg<T> = T extends (first: infer F, ...rest: unknown[]) => unknown
  ? F
  : never

type FA = FirstArg<(name: string, age: number) => void>  // string`,
        explanation: 'The `infer` keyword lets you "capture" a type from within a conditional check. It is like pattern matching — TypeScript extracts the type that fits in the infer position.',
      },
      {
        title: 'Advanced Conditional Patterns',
        code: `// Flatten nested arrays to a specific depth
type Flatten<T> = T extends (infer E)[] ? Flatten<E> : T

type Deep = number[][][]
type Flat = Flatten<Deep>  // number

// Type-safe event emitter
type EventHandler<T> =
  T extends void
    ? () => void
    : (data: T) => void

interface Events {
  login: { userId: string }
  logout: void
  error: Error
}

type LoginHandler = EventHandler<Events['login']>
// (data: { userId: string }) => void

type LogoutHandler = EventHandler<Events['logout']>
// () => void

// String manipulation at type level
type CamelToSnake<S extends string> =
  S extends \`\${infer Head}\${infer Tail}\`
    ? Tail extends Uncapitalize<Tail>
      ? \`\${Lowercase<Head>}\${CamelToSnake<Tail>}\`
      : \`\${Lowercase<Head>}_\${CamelToSnake<Tail>}\`
    : S`,
        explanation: 'Conditional types can be recursive and can perform string manipulation at the type level. These patterns are common in library types for things like API response transformation.',
      },
    ],
    commonMistakes: [
      'Not understanding distributive behavior — `IsString<string | number>` produces `boolean`, not `false`',
      'Forgetting that `infer` only works inside the `extends` clause of a conditional type',
      'Creating deeply recursive conditional types that hit TypeScript recursion limits',
      'Confusing the type-level ternary with a runtime ternary — conditional types run at compile time only',
      'Using conditional types when a simpler mapped type or generic constraint would suffice',
    ],
    interviewTips: [
      'Be able to implement ReturnType and Parameters from scratch using infer',
      'Explain distributive conditional types and how to prevent distribution',
      'Show understanding of infer as "type-level pattern matching"',
      'Know when conditional types are overkill vs when they are the right tool',
    ],
    interviewFrequency: 'high',
    estimatedReadTime: 14,
    prerequisites: ['ts-generics', 'ts-utility-types'],
    nextConcepts: ['ts-advanced-generics'],
    commonQuestions: [
      {
        question: 'What does `infer` do in a conditional type?',
        answer: '`infer` declares a type variable inside the extends clause that TypeScript will try to fill in. It is like pattern matching — if the condition matches, the inferred type is captured and available in the true branch.',
        difficulty: 'medium',
      },
      {
        question: 'Why does `IsString<string | number>` return `boolean` instead of `false`?',
        answer: 'Conditional types distribute over unions by default. Each member is checked individually: `IsString<string>` is `true`, `IsString<number>` is `false`, so the result is `true | false` which simplifies to `boolean`.',
        difficulty: 'hard',
      },
    ],
  },

  // ==========================================================================
  // ADVANCED
  // ==========================================================================
  {
    id: 'ts-advanced-generics',
    title: 'Advanced Generics',
    category: 'ts-advanced',
    difficulty: 'advanced',
    description: 'Advanced generic patterns go beyond simple type parameters. They include recursive types, higher-order generics (generics that take other generics), variadic tuple types, and builder patterns. These patterns power the type systems of popular libraries like Zod, tRPC, and Prisma, and understanding them separates intermediate TypeScript developers from advanced ones.',
    shortDescription: 'Recursive types, variadic tuples, and builder patterns',
    keyPoints: [
      'Recursive generic types can reference themselves for tree-like or nested structures',
      'Variadic tuple types (`...T`) let generics work with tuples of arbitrary length',
      'Higher-order generics accept other generic types as parameters',
      'The builder pattern in TypeScript uses method chaining with generic return types',
      'Template literal types combined with generics enable string pattern matching',
      'Distributive conditional types within generics create powerful type-level logic',
      'Const type parameters (`<const T>`) preserve literal types without `as const`',
    ],
    examples: [
      {
        title: 'Recursive Types',
        code: `// JSON type — recursively defines valid JSON values
type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue }

// Deep readonly — makes all nested properties readonly
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object
    ? T[K] extends Function
      ? T[K]
      : DeepReadonly<T[K]>
    : T[K]
}

interface Config {
  db: { host: string; port: number }
  features: { darkMode: boolean }
}

type FrozenConfig = DeepReadonly<Config>
// db.host is readonly, features.darkMode is readonly, etc.

// Deeply nested path type
type Path<T, Prefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends object
    ? Path<T[K], \`\${Prefix}\${K}.\`>
    : \`\${Prefix}\${K}\`
}[keyof T & string]`,
        explanation: 'Recursive types reference themselves in their definition. They are essential for modeling tree structures, deeply nested objects, and JSON-like data.',
      },
      {
        title: 'Variadic Tuple Types',
        code: `// Concat two tuples
type Concat<A extends unknown[], B extends unknown[]> = [...A, ...B]

type AB = Concat<[1, 2], [3, 4]>  // [1, 2, 3, 4]

// Type-safe curry function
type Curry<Args extends unknown[], Return> =
  Args extends [infer First, ...infer Rest]
    ? (arg: First) => Curry<Rest, Return>
    : Return

type CurriedAdd = Curry<[number, number, number], number>
// (arg: number) => (arg: number) => (arg: number) => number

// Head and Tail of a tuple
type Head<T extends unknown[]> = T extends [infer H, ...unknown[]] ? H : never
type Tail<T extends unknown[]> = T extends [unknown, ...infer R] ? R : never

type H = Head<[1, 2, 3]>  // 1
type T = Tail<[1, 2, 3]>  // [2, 3]

// Zip two tuples
type Zip<A extends unknown[], B extends unknown[]> =
  A extends [infer AH, ...infer AT]
    ? B extends [infer BH, ...infer BT]
      ? [[AH, BH], ...Zip<AT, BT>]
      : []
    : []`,
        explanation: 'Variadic tuple types use the spread operator at the type level to manipulate tuples of arbitrary length. They enable type-safe implementations of functional programming patterns.',
      },
      {
        title: 'Builder Pattern with Generics',
        code: `// Type-safe query builder
class QueryBuilder<
  Selected extends string = never,
  Filtered extends string = never,
> {
  private selectCols: string[] = []
  private whereClauses: string[] = []

  select<C extends string>(
    ...columns: C[]
  ): QueryBuilder<Selected | C, Filtered> {
    this.selectCols.push(...columns)
    return this as unknown as QueryBuilder<Selected | C, Filtered>
  }

  where<C extends string>(
    column: C,
    value: unknown
  ): QueryBuilder<Selected, Filtered | C> {
    this.whereClauses.push(\`\${column} = ?\`)
    return this as unknown as QueryBuilder<Selected, Filtered | C>
  }

  build(): { select: Selected; where: Filtered } {
    return { select: '' as Selected, where: '' as Filtered }
  }
}

const query = new QueryBuilder()
  .select('name', 'email')
  .where('age', 30)
  .build()
// type: { select: 'name' | 'email'; where: 'age' }`,
        explanation: 'The builder pattern accumulates type information through method chaining. Each method call extends the generic parameters, building up a complete type description incrementally.',
      },
    ],
    commonMistakes: [
      'Creating infinitely recursive types without a base case, causing compiler hangs',
      'Over-engineering types that could be simpler — complexity should be justified',
      'Not testing complex generic types with various inputs to verify correctness',
      'Forgetting that TypeScript has a recursion depth limit (~50 levels) for type evaluation',
      'Using variadic tuples when a simpler array type would suffice',
    ],
    interviewTips: [
      'Know how to build DeepReadonly and DeepPartial from scratch',
      'Variadic tuple types show advanced knowledge — mention them when discussing function typing',
      'The builder pattern demonstrates practical advanced generics in real applications',
      'Be honest about complexity — acknowledge when simpler alternatives exist',
    ],
    interviewFrequency: 'medium',
    estimatedReadTime: 15,
    prerequisites: ['ts-generics', 'ts-conditional-types', 'ts-mapped-types'],
    nextConcepts: ['ts-react-patterns'],
    commonQuestions: [
      {
        question: 'How would you type a deeply nested readonly object?',
        answer: 'Use a recursive mapped type: `type DeepReadonly<T> = { readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K] }`. Add a check for Function to avoid making functions readonly.',
        difficulty: 'hard',
      },
      {
        question: 'What are variadic tuple types?',
        answer: 'Variadic tuple types use `...T` spread syntax at the type level to work with tuples of arbitrary length. They enable type-safe concat, zip, and curry operations on tuple types.',
        difficulty: 'hard',
      },
    ],
  },
  {
    id: 'ts-type-assertions',
    title: 'Type Assertions & Guards',
    category: 'ts-advanced',
    difficulty: 'intermediate',
    description: 'Type assertions tell the compiler to treat a value as a specific type, overriding its inference. While assertions (`as Type`) are sometimes necessary, they bypass type checking and should be used sparingly. Type guards are the safer alternative — they perform runtime checks that TypeScript understands, narrowing types without losing safety. Knowing when to use each is critical for writing robust TypeScript.',
    shortDescription: 'Safe vs unsafe type coercion patterns',
    keyPoints: [
      'Type assertions (`as Type`) tell the compiler to trust you — no runtime check occurs',
      'The non-null assertion (`!`) asserts that a value is not null or undefined',
      'Type guards (`typeof`, `instanceof`, `in`, custom predicates) narrow types safely at runtime',
      'Assertion functions (`asserts val is Type`) narrow types by throwing on failure',
      'Const assertions (`as const`) make values immutable and preserve literal types',
      'Double assertions (`value as unknown as Target`) bypass assignability — a code smell',
      'Prefer type guards over assertions whenever possible for type safety',
    ],
    examples: [
      {
        title: 'Type Assertions vs Type Guards',
        code: `// UNSAFE: Type assertion — no runtime check
const input = document.getElementById('name') as HTMLInputElement
input.value = 'hello'  // works, but crashes if element is null or not an input

// SAFE: Type guard with runtime check
const el = document.getElementById('name')
if (el instanceof HTMLInputElement) {
  el.value = 'hello'  // safely narrowed
}

// Non-null assertion — tells TS a value is not null
function getFirst<T>(arr: T[]): T {
  return arr[0]!  // asserts arr[0] is not undefined
}

// Safer alternative: explicit check
function getFirstSafe<T>(arr: T[]): T | undefined {
  return arr.length > 0 ? arr[0] : undefined
}`,
        explanation: 'Type assertions override the compiler but provide no runtime safety. Type guards actually check at runtime, giving both type safety and runtime safety.',
      },
      {
        title: 'Const Assertions',
        code: `// Without const assertion — types are widened
const config = {
  endpoint: '/api',
  retries: 3,
  methods: ['GET', 'POST'],
}
// type: { endpoint: string; retries: number; methods: string[] }

// With const assertion — types are narrowed to literals
const configConst = {
  endpoint: '/api',
  retries: 3,
  methods: ['GET', 'POST'],
} as const
// type: {
//   readonly endpoint: '/api'
//   readonly retries: 3
//   readonly methods: readonly ['GET', 'POST']
// }

// Common pattern: derive a union from const array
const ROLES = ['admin', 'editor', 'viewer'] as const
type Role = (typeof ROLES)[number]
// 'admin' | 'editor' | 'viewer'

// Satisfies + as const — validate AND preserve literals
const themes = {
  light: '#ffffff',
  dark: '#000000',
} as const satisfies Record<string, string>`,
        explanation: 'Const assertions preserve literal types and make objects deeply readonly. Combined with `typeof` and indexed access, they let you derive union types from runtime arrays.',
      },
      {
        title: 'Assertion Functions',
        code: `// Assertion function — narrows type by throwing
function assertDefined<T>(
  val: T | null | undefined,
  msg?: string
): asserts val is T {
  if (val === null || val === undefined) {
    throw new Error(msg ?? 'Value is null or undefined')
  }
}

// Usage
function processUser(user: User | null): void {
  assertDefined(user, 'User must exist')
  // After assertion, user is narrowed to User
  console.log(user.name)
}

// Assertion function for type checking
function assertIsString(val: unknown): asserts val is string {
  if (typeof val !== 'string') {
    throw new TypeError(\`Expected string, got \${typeof val}\`)
  }
}

interface User { name: string; age: number }`,
        explanation: 'Assertion functions throw if the assertion fails, otherwise they narrow the type for the rest of the scope. They are useful for validation at function boundaries.',
      },
    ],
    commonMistakes: [
      'Using `as` assertions to silence errors instead of fixing the underlying type issue',
      'Overusing the non-null assertion `!` when a proper null check is needed',
      'Confusing `as const` (narrows to literal types) with `as Type` (type assertion)',
      'Using double assertions (`as unknown as T`) which completely bypass type safety',
      'Writing assertion functions that do not actually throw on invalid input',
    ],
    interviewTips: [
      'Always prefer type guards over assertions — explain why in interviews',
      'Know the `as const` pattern for deriving union types from arrays',
      'Explain `satisfies` + `as const` for validation with preserved literal types',
      'Mention that assertions are sometimes unavoidable (DOM elements, third-party libraries)',
    ],
    interviewFrequency: 'high',
    estimatedReadTime: 10,
    prerequisites: ['ts-basics', 'ts-type-narrowing'],
    nextConcepts: ['ts-declaration-files', 'ts-strict-mode'],
    commonQuestions: [
      {
        question: 'What is the difference between `as const` and `as Type`?',
        answer: '`as const` narrows values to their most specific literal types and makes everything readonly. `as Type` tells the compiler to treat a value as a specific type, bypassing inference — it provides no runtime safety.',
        difficulty: 'medium',
      },
      {
        question: 'When is a type assertion justified?',
        answer: 'When you know more about a type than TypeScript can infer, and a runtime check is unnecessary or already guaranteed by surrounding code. Examples: DOM element types after querySelector, or deserialized JSON where the shape is guaranteed by the API contract.',
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'ts-declaration-files',
    title: 'Declaration Files',
    category: 'ts-advanced',
    difficulty: 'advanced',
    description: 'Declaration files (`.d.ts`) describe the types of JavaScript code without containing any implementation. They are how TypeScript understands third-party JavaScript libraries, global variables, and module shapes. The DefinitelyTyped repository (`@types/*` packages) provides declaration files for thousands of libraries. Understanding how to read, write, and troubleshoot declaration files is essential for working with TypeScript in real projects.',
    shortDescription: '.d.ts files, ambient declarations, and module augmentation',
    keyPoints: [
      'Declaration files (`.d.ts`) contain only type information — no runtime code',
      '`declare` keyword introduces ambient declarations for existing JavaScript',
      '`@types/*` packages from DefinitelyTyped provide types for JS libraries',
      'Module augmentation lets you extend existing module types',
      'Global augmentation adds types to the global scope',
      'Triple-slash directives (`/// <reference>`) link declaration files together',
      '`declare module "name"` creates type definitions for untyped modules',
    ],
    examples: [
      {
        title: 'Writing Declaration Files',
        code: `// types/analytics.d.ts — declare types for a JS analytics library
declare module 'analytics-lib' {
  interface AnalyticsConfig {
    apiKey: string
    debug?: boolean
    batchSize?: number
  }

  interface Event {
    name: string
    properties?: Record<string, unknown>
    timestamp?: Date
  }

  export function init(config: AnalyticsConfig): void
  export function track(event: Event): Promise<void>
  export function identify(userId: string, traits?: Record<string, unknown>): void
}

// Usage in application code
import { init, track } from 'analytics-lib'

init({ apiKey: 'abc123', debug: true })
track({ name: 'page_view', properties: { path: '/home' } })`,
        explanation: 'Declaration files describe the API surface of JavaScript libraries. The `declare module` syntax creates type definitions that TypeScript uses for type checking imports.',
      },
      {
        title: 'Module Augmentation',
        code: `// Extend Express Request with custom properties
import 'express'

declare module 'express' {
  interface Request {
    userId?: string
    sessionId?: string
  }
}

// Now TypeScript recognizes these properties
import { Request, Response } from 'express'

function authMiddleware(req: Request, _res: Response, next: () => void): void {
  req.userId = 'user-123'  // No type error
  next()
}

// Extend a library's types with new methods
declare module 'dayjs' {
  interface Dayjs {
    businessDaysAdd(days: number): Dayjs
  }
}`,
        explanation: 'Module augmentation lets you add new properties or methods to existing types from third-party libraries without modifying the original source code.',
      },
      {
        title: 'Global & Ambient Declarations',
        code: `// global.d.ts — add global types
declare global {
  interface Window {
    __APP_CONFIG__: {
      apiUrl: string
      version: string
      features: Record<string, boolean>
    }
  }

  // Declare a global function (e.g., injected by a script tag)
  function gtag(command: string, ...args: unknown[]): void
}

// Environment variable types for Vite or Next.js
declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string
    API_SECRET: string
    NODE_ENV: 'development' | 'production' | 'test'
  }
}

export {}  // This makes the file a module (required for declare global)`,
        explanation: 'Global declarations extend the global scope with custom types. The `declare global` block adds types to Window, process.env, or any global interface.',
      },
    ],
    commonMistakes: [
      'Forgetting the `export {}` in files that use `declare global` (makes it a module)',
      'Confusing `declare module` (module augmentation) with regular module declarations',
      'Not checking DefinitelyTyped before writing custom declarations for popular libraries',
      'Placing declaration files outside the TypeScript compilation scope (not included in tsconfig)',
      'Writing implementation code in `.d.ts` files — they should only contain type declarations',
    ],
    interviewTips: [
      'Know how to write a basic declaration file for an untyped JavaScript library',
      'Explain module augmentation with a practical example like extending Express Request',
      'Mention DefinitelyTyped and `@types/*` packages as the standard type source',
      'Understand the difference between `declare module` for new modules vs augmentation',
    ],
    interviewFrequency: 'medium',
    estimatedReadTime: 12,
    prerequisites: ['ts-basics', 'ts-generics'],
    nextConcepts: ['ts-migration'],
    commonQuestions: [
      {
        question: 'How do you add types for a JavaScript library that has no type definitions?',
        answer: 'Create a `.d.ts` file with `declare module "library-name" { ... }` and define the exports. Alternatively, check if `@types/library-name` exists on DefinitelyTyped.',
        difficulty: 'medium',
      },
      {
        question: 'What is module augmentation?',
        answer: 'Module augmentation lets you add new declarations to an existing module\'s types. You import the module and then use `declare module "name"` to extend its interfaces with additional properties or methods.',
        difficulty: 'medium',
      },
    ],
  },

  // ==========================================================================
  // REACT + TS
  // ==========================================================================
  {
    id: 'ts-react-components',
    title: 'TypeScript React Components',
    category: 'ts-react',
    difficulty: 'intermediate',
    description: 'TypeScript and React are a natural pairing. Typing component props ensures that consumers pass the correct data, and TypeScript catches missing or wrong props at compile time. Understanding how to type functional components, children, event handlers, and common React patterns is essential for any modern React project.',
    shortDescription: 'Typing props, children, events, and component patterns',
    keyPoints: [
      'Define props as an interface: `interface ButtonProps { label: string; onClick: () => void }`',
      'Use `React.FC<Props>` sparingly — prefer explicit return types or no annotation',
      'Type children with `React.ReactNode` for the broadest JSX-compatible type',
      'Event handlers use React synthetic event types: `React.MouseEvent<HTMLButtonElement>`',
      'Discriminated union props enable type-safe component variants',
      'Use `React.ComponentPropsWithoutRef<"button">` to inherit native HTML props',
      'Generic components use generics in the function signature for type-safe data rendering',
    ],
    examples: [
      {
        title: 'Component Props & Events',
        code: `interface ButtonProps {
  label: string
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}

function Button({ label, variant = 'primary', disabled, onClick }: ButtonProps) {
  return (
    <button
      className={\`btn btn-\${variant}\`}
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

// Extending native HTML props
type InputProps = React.ComponentPropsWithoutRef<'input'> & {
  label: string
  error?: string
}

function Input({ label, error, ...rest }: InputProps) {
  return (
    <label>
      {label}
      <input {...rest} />
      {error && <span className="error">{error}</span>}
    </label>
  )
}`,
        explanation: 'Props interfaces define the contract between a component and its consumers. Extending native HTML props with ComponentPropsWithoutRef avoids redefining standard attributes.',
      },
      {
        title: 'Children & Composition',
        code: `// ReactNode is the broadest children type
interface CardProps {
  title: string
  children: React.ReactNode
}

function Card({ title, children }: CardProps) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div className="card-body">{children}</div>
    </div>
  )
}

// Render prop pattern with TypeScript
interface DataFetcherProps<T> {
  url: string
  children: (data: T, loading: boolean) => React.ReactNode
}

function DataFetcher<T>({ url, children }: DataFetcherProps<T>) {
  const [data, setData] = React.useState<T | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetch(url)
      .then(r => r.json() as Promise<T>)
      .then(d => { setData(d); setLoading(false) })
  }, [url])

  return <>{data && children(data, loading)}</>
}`,
        explanation: 'React.ReactNode accepts anything renderable: elements, strings, numbers, fragments, null. The render prop pattern benefits greatly from generics to type the data being passed.',
      },
      {
        title: 'Discriminated Union Props',
        code: `// Props that depend on a variant discriminant
type AlertProps =
  | { variant: 'success'; message: string }
  | { variant: 'error'; message: string; retryAction: () => void }
  | { variant: 'loading' }

function Alert(props: AlertProps) {
  switch (props.variant) {
    case 'success':
      return <div className="alert-success">{props.message}</div>
    case 'error':
      return (
        <div className="alert-error">
          {props.message}
          <button onClick={props.retryAction}>Retry</button>
        </div>
      )
    case 'loading':
      return <div className="alert-loading">Loading...</div>
  }
}

// Usage
<Alert variant="error" message="Failed" retryAction={() => {}} />
// <Alert variant="loading" message="hi" />  // Error: message not on loading`,
        explanation: 'Discriminated union props ensure that variant-specific props are only available when the matching variant is selected. TypeScript enforces this at compile time.',
      },
    ],
    commonMistakes: [
      'Using `React.FC` which adds implicit children and complicates generic components',
      'Typing children as `JSX.Element` instead of `React.ReactNode` (too restrictive)',
      'Forgetting to type event handlers — `onClick: () => void` misses the event parameter',
      'Not using `ComponentPropsWithoutRef` when wrapping native HTML elements',
      'Creating monolithic props interfaces instead of using discriminated unions for variants',
    ],
    interviewTips: [
      'Know the difference between ReactNode, ReactElement, and JSX.Element',
      'Explain why `React.FC` is often avoided in modern TypeScript React codebases',
      'Demonstrate generic components — they show advanced TypeScript + React knowledge',
      'Mention discriminated union props for type-safe component variants',
    ],
    interviewFrequency: 'very-high',
    estimatedReadTime: 12,
    prerequisites: ['ts-basics', 'ts-generics'],
    nextConcepts: ['ts-react-hooks', 'ts-react-patterns'],
    commonQuestions: [
      {
        question: 'What type should you use for React children?',
        answer: 'Use `React.ReactNode` — it accepts elements, strings, numbers, fragments, portals, null, and undefined. `JSX.Element` is too restrictive (excludes strings and null).',
        difficulty: 'easy',
      },
      {
        question: 'Why is React.FC considered problematic?',
        answer: 'React.FC adds implicit children prop (before React 18), does not work well with generic components, and provides an implicit return type that can mask issues. Explicit prop interfaces are clearer.',
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'ts-react-hooks',
    title: 'TypeScript React Hooks',
    category: 'ts-react',
    difficulty: 'intermediate',
    description: 'React hooks have excellent TypeScript support, but some patterns require explicit type annotations. useState needs type parameters for complex state, useRef needs to distinguish between mutable and immutable refs, and useReducer needs properly typed actions. Custom hooks that return tuples need `as const` to preserve the tuple type.',
    shortDescription: 'Typing useState, useRef, useReducer, and custom hooks',
    keyPoints: [
      '`useState<T>` accepts a type parameter for complex or union state types',
      '`useRef<HTMLElement>(null)` creates an immutable ref; `useRef<number>(0)` creates a mutable ref',
      '`useReducer` needs typed state and discriminated union actions',
      'Custom hooks returning tuples should use `as const` to avoid widening to arrays',
      '`useCallback` and `useMemo` infer types from the callback/factory function',
      '`useContext` returns `T | undefined` when the provider may be missing',
      'Generic custom hooks use type parameters for reusable, type-safe hook logic',
    ],
    examples: [
      {
        title: 'useState & useRef',
        code: `// useState with explicit type for unions/complex state
const [user, setUser] = useState<User | null>(null)
const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')

// useState infers from initial value when possible
const [count, setCount] = useState(0)  // inferred as number

// useRef for DOM elements — immutable ref (null initial)
const inputRef = useRef<HTMLInputElement>(null)

// useRef for mutable values — no null in type parameter
const timerRef = useRef<number>(0)
timerRef.current = window.setTimeout(() => {}, 1000)

// Cleanup pattern
useEffect(() => {
  return () => clearTimeout(timerRef.current)
}, [])

interface User {
  name: string
  email: string
}`,
        explanation: 'useState needs explicit types when the initial value does not represent all possible states (e.g., starting as null but later holding an object). useRef distinguishes DOM refs (immutable .current) from value refs (mutable .current).',
      },
      {
        title: 'useReducer with Typed Actions',
        code: `interface TodoState {
  todos: Todo[]
  filter: 'all' | 'active' | 'completed'
}

// Discriminated union for actions
type TodoAction =
  | { type: 'ADD'; payload: { text: string } }
  | { type: 'TOGGLE'; payload: { id: string } }
  | { type: 'DELETE'; payload: { id: string } }
  | { type: 'SET_FILTER'; payload: { filter: TodoState['filter'] } }

function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'ADD':
      return {
        ...state,
        todos: [...state.todos, {
          id: crypto.randomUUID(),
          text: action.payload.text,
          completed: false,
        }],
      }
    case 'TOGGLE':
      return {
        ...state,
        todos: state.todos.map(t =>
          t.id === action.payload.id
            ? { ...t, completed: !t.completed }
            : t
        ),
      }
    case 'DELETE':
      return {
        ...state,
        todos: state.todos.filter(t => t.id !== action.payload.id),
      }
    case 'SET_FILTER':
      return { ...state, filter: action.payload.filter }
  }
}

const [state, dispatch] = useReducer(todoReducer, {
  todos: [],
  filter: 'all',
})

// dispatch is fully typed — only valid actions allowed
dispatch({ type: 'ADD', payload: { text: 'Learn TypeScript' } })

interface Todo { id: string; text: string; completed: boolean }`,
        explanation: 'useReducer benefits enormously from TypeScript. Discriminated union actions ensure dispatch only accepts valid action shapes, and the reducer must handle every case.',
      },
      {
        title: 'Custom Hooks with Generics',
        code: `// Generic data fetching hook
function useFetch<T>(url: string): {
  data: T | null
  loading: boolean
  error: Error | null
} {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch(url)
      .then(r => r.json() as Promise<T>)
      .then(d => { if (!cancelled) { setData(d); setLoading(false) } })
      .catch(e => { if (!cancelled) { setError(e as Error); setLoading(false) } })
    return () => { cancelled = true }
  }, [url])

  return { data, loading, error }
}

// Usage — type parameter specifies the response shape
const { data, loading } = useFetch<User[]>('/api/users')
// data is User[] | null

// Tuple return with as const
function useToggle(initial = false) {
  const [on, setOn] = useState(initial)
  const toggle = useCallback(() => setOn(v => !v), [])
  return [on, toggle] as const  // preserves [boolean, () => void]
}

const [isOpen, toggleOpen] = useToggle()
// Without as const: (boolean | (() => void))[] — unusable!

interface User { name: string; email: string }`,
        explanation: 'Generic custom hooks accept type parameters to type their return data. The `as const` assertion is critical for tuple returns — without it, TypeScript widens the type to a union array.',
      },
    ],
    commonMistakes: [
      'Not providing a type parameter to useState when the initial value is null',
      'Using `useRef<HTMLInputElement>(null)` but trying to assign to `.current` (it is readonly for DOM refs)',
      'Forgetting `as const` on custom hook tuple returns, getting a widened array type',
      'Not typing useReducer actions as discriminated unions, losing exhaustive checking',
      'Using `any` in custom hooks instead of generic type parameters',
    ],
    interviewTips: [
      'Know the mutable vs immutable ref distinction and when each applies',
      'Be ready to type a useReducer with discriminated union actions',
      'Explain the `as const` trick for custom hooks that return tuples',
      'Mention generic hooks as a pattern for reusable data fetching or form logic',
    ],
    interviewFrequency: 'high',
    estimatedReadTime: 12,
    prerequisites: ['ts-basics', 'ts-react-components'],
    nextConcepts: ['ts-react-patterns'],
    commonQuestions: [
      {
        question: 'Why do you sometimes need to pass a type parameter to useState?',
        answer: 'When the initial value does not represent all possible states. For example, `useState(null)` infers `null`, not `User | null`. You need `useState<User | null>(null)` to allow setting a User later.',
        difficulty: 'easy',
      },
      {
        question: 'What is the difference between a mutable and immutable ref in TypeScript?',
        answer: '`useRef<HTMLElement>(null)` creates an immutable ref where `.current` is readonly — React manages it. `useRef<number>(0)` (no null) creates a mutable ref where `.current` can be freely assigned.',
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'ts-react-patterns',
    title: 'Advanced React + TS Patterns',
    category: 'ts-react',
    difficulty: 'advanced',
    description: 'Advanced React TypeScript patterns combine generics, conditional types, and mapped types to create type-safe APIs for complex component libraries. These patterns include generic list/table components, polymorphic `as` props, strictly typed context with no undefined checks, and form handling with inferred field types. Mastering these patterns is what separates senior frontend engineers from intermediate ones.',
    shortDescription: 'Polymorphic components, typed context, and generic lists',
    keyPoints: [
      'Polymorphic `as` prop lets a component render as any HTML element or component',
      'Generic components maintain type relationships between data and render callbacks',
      'Strictly typed context factories eliminate undefined checks at usage sites',
      'Compound components use React context with TypeScript for type-safe slot patterns',
      'Forwarded refs require `React.forwardRef` with explicit generic type parameters',
      'Template literal types can generate prop types from string patterns',
    ],
    examples: [
      {
        title: 'Polymorphic Components',
        code: `type PolymorphicProps<E extends React.ElementType, P = object> = P &
  Omit<React.ComponentPropsWithoutRef<E>, keyof P | 'as'> & {
    as?: E
  }

// Box component that can render as any element
function Box<E extends React.ElementType = 'div'>({
  as,
  children,
  ...rest
}: PolymorphicProps<E, { children?: React.ReactNode }>) {
  const Component = as || 'div'
  return <Component {...rest}>{children}</Component>
}

// Usage
<Box as="section" id="main">Content</Box>
<Box as="a" href="/home">Link</Box>
// <Box as="a" href={42} />  // Error: href must be string

// With custom props
type TextProps<E extends React.ElementType> = PolymorphicProps<E, {
  size?: 'sm' | 'md' | 'lg'
  weight?: 'normal' | 'bold'
}>

function Text<E extends React.ElementType = 'span'>({
  as, size, weight, ...rest
}: TextProps<E>) {
  const Component = as || 'span'
  return <Component {...rest} />
}`,
        explanation: 'Polymorphic components accept an `as` prop that changes the rendered element. TypeScript ensures that the remaining props match the element type, preventing invalid prop combinations.',
      },
      {
        title: 'Strictly Typed Context',
        code: `// Context factory — eliminates undefined checks at usage sites
function createStrictContext<T>(displayName: string): [
  React.Provider<T>,
  () => T,
] {
  const Context = React.createContext<T | undefined>(undefined)
  Context.displayName = displayName

  function useStrictContext(): T {
    const value = React.useContext(Context)
    if (value === undefined) {
      throw new Error(
        \`use\${displayName} must be used within a \${displayName}Provider\`
      )
    }
    return value
  }

  return [Context.Provider as React.Provider<T>, useStrictContext]
}

// Usage
interface AuthContext {
  user: User
  logout: () => void
}

const [AuthProvider, useAuth] = createStrictContext<AuthContext>('Auth')

// In component — no undefined check needed
function Profile() {
  const { user, logout } = useAuth()  // AuthContext, not AuthContext | undefined
  return <div>{user.name}</div>
}

interface User { name: string; email: string }`,
        explanation: 'The strict context factory pattern creates a context and hook pair where the hook throws if used outside the provider. This eliminates the need for undefined checks at every usage site.',
      },
      {
        title: 'Generic List Component',
        code: `// Generic list with type-safe item rendering
interface ListProps<T> {
  items: T[]
  keyExtractor: (item: T) => string
  renderItem: (item: T, index: number) => React.ReactNode
  emptyMessage?: string
}

function List<T>({
  items,
  keyExtractor,
  renderItem,
  emptyMessage = 'No items',
}: ListProps<T>) {
  if (items.length === 0) {
    return <div className="empty">{emptyMessage}</div>
  }

  return (
    <ul>
      {items.map((item, index) => (
        <li key={keyExtractor(item)}>{renderItem(item, index)}</li>
      ))}
    </ul>
  )
}

// Usage — T is inferred from items
interface Todo {
  id: string
  text: string
  done: boolean
}

const todos: Todo[] = []

<List
  items={todos}
  keyExtractor={t => t.id}
  renderItem={(todo) => (
    <span style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>
      {todo.text}
    </span>
  )}
/>`,
        explanation: 'Generic list components infer their type parameter from the items array. The renderItem callback then receives properly typed items, enabling type-safe rendering without manual type annotations.',
      },
    ],
    commonMistakes: [
      'Making polymorphic components too complex — not all components need the `as` pattern',
      'Not using context factories, leading to `| undefined` checks everywhere',
      'Forgetting to handle the empty/default case in generic components',
      'Over-abstracting with generics when a simpler component with specific props would suffice',
      'Not testing polymorphic components with various element types to catch type issues',
    ],
    interviewTips: [
      'The polymorphic `as` pattern shows deep TypeScript + React knowledge',
      'Explain the strict context factory — it solves a real pain point in React + TS',
      'Generic components demonstrate both React architecture and TypeScript fluency',
      'Know when these patterns are worth the complexity vs simpler alternatives',
    ],
    interviewFrequency: 'high',
    estimatedReadTime: 14,
    prerequisites: ['ts-react-components', 'ts-react-hooks', 'ts-advanced-generics'],
    nextConcepts: [],
    commonQuestions: [
      {
        question: 'What is a polymorphic component in React?',
        answer: 'A polymorphic component accepts an `as` prop that changes the rendered HTML element or component. TypeScript ensures that the remaining props match the chosen element type, preventing invalid combinations.',
        difficulty: 'hard',
      },
      {
        question: 'How do you avoid undefined checks with React context in TypeScript?',
        answer: 'Use a strict context factory that creates a context and hook pair. The hook throws if used outside the provider, so the return type is `T` instead of `T | undefined`, eliminating the need for null checks.',
        difficulty: 'medium',
      },
    ],
  },

  // ==========================================================================
  // INTERVIEW
  // ==========================================================================
  {
    id: 'ts-tricky-questions',
    title: 'Tricky TS Interview Questions',
    category: 'ts-interview',
    difficulty: 'advanced',
    description: 'TypeScript interviews often include tricky questions that test deep understanding of the type system. These cover structural typing vs nominal typing, type widening and narrowing edge cases, variance (covariance and contravariance), template literal type manipulation, and subtle differences between similar-looking constructs. Mastering these questions demonstrates expert-level TypeScript knowledge.',
    shortDescription: 'Structural typing, variance, and type system gotchas',
    keyPoints: [
      'TypeScript uses structural typing — two types are compatible if they have the same shape',
      'Type widening occurs when TS infers a broader type than the literal value',
      'Covariance: arrays of subtypes are assignable to arrays of supertypes (read-only is safe)',
      'Contravariance: function parameter types work in reverse — wider params accept narrower',
      'Excess property checking only applies to object literals, not variables',
      'Declaration merging lets you extend interfaces across multiple declarations',
      'The `satisfies` operator validates a type without changing the inferred type',
    ],
    examples: [
      {
        title: 'Structural Typing Gotchas',
        code: `interface Point2D { x: number; y: number }
interface Point3D { x: number; y: number; z: number }

// Structural typing: Point3D has all properties of Point2D
const p3: Point3D = { x: 1, y: 2, z: 3 }
const p2: Point2D = p3  // OK — Point3D is a structural subtype

// But excess property checking catches extra properties on literals
// const p2b: Point2D = { x: 1, y: 2, z: 3 }  // Error on object literal!

// This works because it is assigned from a variable, not a literal
const temp = { x: 1, y: 2, z: 3, w: 4 }
const p2c: Point2D = temp  // OK — no excess property check on variables

// Nominal-ish typing with branded types
type USD = number & { __brand: 'USD' }
type EUR = number & { __brand: 'EUR' }

function payInUSD(amount: USD): void { /* ... */ }

const dollars = 100 as USD
payInUSD(dollars)  // OK
// payInUSD(100)   // Error — number is not USD
// payInUSD(100 as EUR)  // Error — EUR is not USD`,
        explanation: 'TypeScript is structurally typed, meaning types are compatible based on their shape, not their name. Branded types simulate nominal typing by adding a phantom property that prevents accidental mixing.',
      },
      {
        title: 'Variance & Function Types',
        code: `class Animal { name = 'animal' }
class Dog extends Animal { breed = 'unknown' }
class Labrador extends Dog { color = 'golden' }

// Covariance — subtypes can be assigned to supertypes (return types)
type AnimalFactory = () => Animal
type DogFactory = () => Dog

const dogFactory: DogFactory = () => new Dog()
const animalFactory: AnimalFactory = dogFactory  // OK — Dog extends Animal

// Contravariance — supertypes accepted for parameter types
type AnimalHandler = (a: Animal) => void
type DogHandler = (d: Dog) => void

const handleAnimal: AnimalHandler = (a) => console.log(a.name)
// With strictFunctionTypes, this is an error:
// const handleDog: DogHandler = handleAnimal  // OK in --strict!

// Bivariance trap (method syntax vs function syntax)
interface Arr {
  // Method syntax — bivariant (less safe)
  forEach(cb: (item: Dog) => void): void
  // Function property syntax — contravariant (safer)
  map: (cb: (item: Dog) => void) => void
}`,
        explanation: 'Variance rules determine when types are substitutable. Return types are covariant (subtypes OK), parameter types are contravariant (supertypes OK). Method syntax in interfaces is bivariant for historical reasons.',
      },
      {
        title: 'Type Widening & Narrowing Edge Cases',
        code: `// Widening: let declarations widen to the base type
let x = 'hello'       // string (widened)
const y = 'hello'     // 'hello' (literal — no widening)

// Fresh object literals are widened
let obj = { x: 1 }    // { x: number } — not { x: 1 }
const objConst = { x: 1 }  // still { x: number } — only value is const!
const objAsConst = { x: 1 } as const  // { readonly x: 1 }

// Narrowing gotcha: null check in callbacks
function processItems(items: string[] | null): void {
  if (items === null) return

  // items is string[] here
  items.forEach(item => {
    // items is STILL narrowed to string[] in sync callbacks
    console.log(item, items.length)
  })

  // But in async callbacks, narrowing is lost!
  setTimeout(() => {
    // items could theoretically be reassigned (if let)
    // TypeScript may or may not narrow here depending on mutability
  }, 100)
}

// Exhaustive narrowing with never
type Shape = { kind: 'circle'; r: number } | { kind: 'square'; s: number }

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle': return Math.PI * shape.r ** 2
    case 'square': return shape.s ** 2
    default: {
      const _exhaustive: never = shape  // Error if a case is missing
      return _exhaustive
    }
  }
}`,
        explanation: 'Type widening and narrowing edge cases are common in interviews. Understanding when TypeScript widens (let declarations, object properties) vs preserves literals (const, as const) is key.',
      },
    ],
    commonMistakes: [
      'Assuming TypeScript uses nominal typing — it uses structural typing',
      'Not understanding that excess property checking only applies to object literals',
      'Confusing covariance and contravariance in function type assignments',
      'Forgetting that `const` declarations only make the binding immutable, not the value',
      'Not using branded types when you need nominal-like distinctions between number/string types',
    ],
    interviewTips: [
      'Explain structural vs nominal typing with a concrete example',
      'Know variance rules — covariance for return types, contravariance for parameters',
      'Be ready to explain type widening with let vs const vs as const',
      'Mention branded types as a workaround for nominal typing needs',
      'Practice the exhaustive switch with `never` pattern — it comes up frequently',
    ],
    interviewFrequency: 'high',
    estimatedReadTime: 15,
    prerequisites: ['ts-type-narrowing', 'ts-generics'],
    nextConcepts: ['ts-strict-mode'],
    commonQuestions: [
      {
        question: 'What is structural typing and how does it differ from nominal typing?',
        answer: 'Structural typing checks type compatibility based on shape (properties and their types), not the type\'s declared name. Nominal typing (used in Java, C#) requires explicit declarations of relationships. In TypeScript, `{x: number}` is compatible with any interface that has an `x: number` property.',
        difficulty: 'medium',
      },
      {
        question: 'What are branded types and when would you use them?',
        answer: 'Branded types add a phantom property (`& { __brand: "X" }`) to create nominal-like distinctions. Use them when structurally identical types should not be interchangeable, like USD vs EUR amounts or user IDs vs post IDs.',
        difficulty: 'hard',
      },
    ],
  },
  {
    id: 'ts-strict-mode',
    title: 'Strict Mode Deep Dive',
    category: 'ts-interview',
    difficulty: 'intermediate',
    description: 'TypeScript strict mode is a set of compiler flags that enable stricter type checking. The `strict` flag in tsconfig.json is a shorthand that enables multiple individual strict checks. Understanding each strict flag, what errors it catches, and why it matters is important for interviews and for configuring TypeScript projects correctly.',
    shortDescription: 'tsconfig strict flags and what each one catches',
    keyPoints: [
      '`strict: true` enables all strict flags as a bundle',
      '`strictNullChecks` makes null and undefined distinct types that must be handled',
      '`strictFunctionTypes` enforces contravariant parameter type checking',
      '`strictBindCallApply` enforces correct typing for bind, call, and apply',
      '`noImplicitAny` errors when TypeScript cannot infer a type and falls back to any',
      '`strictPropertyInitialization` requires class properties to be initialized in the constructor',
      '`useUnknownInCatchVariables` types catch variables as unknown instead of any',
    ],
    examples: [
      {
        title: 'strictNullChecks',
        code: `// WITHOUT strictNullChecks: null is assignable to any type
// const name: string = null  // no error (dangerous!)

// WITH strictNullChecks: must explicitly allow null
let name: string | null = null

// Force handling of nullable values
function getUser(id: string): User | undefined {
  // ...implementation
  return undefined
}

const user = getUser('1')
// user.name  // Error: Object is possibly 'undefined'

// Safe access patterns
if (user) {
  console.log(user.name)  // narrowed to User
}

const displayName = user?.name ?? 'Anonymous'  // optional chaining + nullish coalescing

interface User { name: string; email: string }`,
        explanation: 'strictNullChecks is the most impactful strict flag. Without it, null and undefined can be assigned to any type, defeating the purpose of type checking for one of the most common error sources.',
      },
      {
        title: 'noImplicitAny & strictPropertyInitialization',
        code: `// noImplicitAny — catches untyped parameters
// function greet(name) { }  // Error: Parameter 'name' implicitly has an 'any' type

// Must explicitly type parameters
function greet(name: string): string {
  return \`Hello, \${name}\`
}

// Array methods need type context
// [1, 2].reduce((acc, val) => acc + val)  // might error without context
const sum = [1, 2].reduce((acc: number, val: number) => acc + val, 0)

// strictPropertyInitialization — class properties must be initialized
class UserService {
  // name: string  // Error: not initialized and no initializer

  // Options to fix:
  name: string = ''                    // 1. Default value
  age: number                          // 2. Initialized in constructor
  email!: string                       // 3. Definite assignment assertion (use sparingly)
  nickname: string | undefined         // 4. Allow undefined

  constructor(age: number) {
    this.age = age
  }
}`,
        explanation: 'noImplicitAny catches untyped parameters and variables. strictPropertyInitialization ensures class properties are assigned before use, preventing undefined access errors.',
      },
      {
        title: 'strictFunctionTypes & useUnknownInCatchVariables',
        code: `// strictFunctionTypes — enforces contravariant parameter checking
class Animal { name = '' }
class Dog extends Animal { breed = '' }

type Handler<T> = (item: T) => void

// With strictFunctionTypes:
const animalHandler: Handler<Animal> = (a) => console.log(a.name)
// const dogHandler: Handler<Dog> = animalHandler
// Error: Dog handler cannot accept a broader Animal handler
// (Animal could be Cat, which has no 'breed')

// useUnknownInCatchVariables — catch blocks use unknown
try {
  JSON.parse('invalid')
} catch (err) {
  // With useUnknownInCatchVariables: err is unknown
  if (err instanceof SyntaxError) {
    console.log(err.message)  // safely narrowed
  }

  // Without it: err is any (unsafe!)
  // console.log(err.message)  // no error but no safety
}

// The strict flag bundle
// {
//   "compilerOptions": {
//     "strict": true,
//     // Equivalent to enabling ALL of these:
//     // "strictNullChecks": true,
//     // "strictFunctionTypes": true,
//     // "strictBindCallApply": true,
//     // "strictPropertyInitialization": true,
//     // "noImplicitAny": true,
//     // "noImplicitThis": true,
//     // "useUnknownInCatchVariables": true,
//     // "alwaysStrict": true
//   }
// }`,
        explanation: 'strictFunctionTypes prevents unsafe function type assignments. useUnknownInCatchVariables makes catch blocks type-safe by using unknown instead of any, requiring narrowing before access.',
      },
    ],
    commonMistakes: [
      'Not enabling strict mode in new projects — always start with `strict: true`',
      'Using the `!` non-null assertion to silence strictNullChecks instead of handling null properly',
      'Adding `// @ts-ignore` to bypass strict errors instead of fixing the type',
      'Not understanding that `strict: true` is a bundle of flags, not a single check',
      'Disabling individual strict flags without understanding the safety they provide',
    ],
    interviewTips: [
      'Know all the individual flags that `strict: true` enables',
      'Explain why strictNullChecks is the most impactful flag with a concrete example',
      'Mention that useUnknownInCatchVariables makes error handling type-safe',
      'Be ready to discuss tradeoffs of strict mode in legacy migration scenarios',
    ],
    interviewFrequency: 'high',
    estimatedReadTime: 10,
    prerequisites: ['ts-basics', 'ts-type-narrowing'],
    nextConcepts: ['ts-migration'],
    commonQuestions: [
      {
        question: 'What does `strict: true` enable in tsconfig?',
        answer: 'It enables strictNullChecks, strictFunctionTypes, strictBindCallApply, strictPropertyInitialization, noImplicitAny, noImplicitThis, useUnknownInCatchVariables, and alwaysStrict — all as a single flag.',
        difficulty: 'medium',
      },
      {
        question: 'Why is strictNullChecks the most important strict flag?',
        answer: 'Without it, null and undefined are assignable to every type, meaning TypeScript cannot catch the most common runtime error: accessing properties on null/undefined values.',
        difficulty: 'easy',
      },
    ],
  },
  {
    id: 'ts-migration',
    title: 'JavaScript to TypeScript Migration',
    category: 'ts-interview',
    difficulty: 'intermediate',
    description: 'Migrating a JavaScript codebase to TypeScript is a common real-world task and a popular interview topic. A successful migration happens incrementally — you configure TypeScript to coexist with JavaScript, gradually add types starting with the most critical paths, and progressively tighten strict checks. Understanding the migration strategy, common blockers, and tooling is essential for senior frontend roles.',
    shortDescription: 'Incremental migration strategies and common blockers',
    keyPoints: [
      'Enable `allowJs: true` and `checkJs: false` to let JS and TS coexist',
      'Rename files from `.js` to `.ts` one at a time, starting with leaf modules',
      'Use `// @ts-check` in JS files to enable TypeScript checking without renaming',
      'Start with `strict: false` and enable strict flags incrementally',
      'Create declaration files (`.d.ts`) for third-party JS modules without types',
      'Use `unknown` instead of `any` for untyped boundaries — it forces proper handling',
      'The migration order should be: utilities → types → business logic → components',
    ],
    examples: [
      {
        title: 'Incremental tsconfig Setup',
        code: `// tsconfig.json — Phase 1: Coexistence
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowJs": true,          // Allow .js files in the project
    "checkJs": false,         // Don't type-check .js files yet
    "strict": false,          // Start permissive
    "noImplicitAny": false,   // Allow implicit any initially
    "esModuleInterop": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "jsx": "react-jsx"
  },
  "include": ["src/**/*"]
}

// Phase 2: Tighten gradually
// "noImplicitAny": true        // Enable after fixing most any types
// "strictNullChecks": true     // Enable after adding null checks
// "strict": true               // Final goal`,
        explanation: 'Start with a permissive tsconfig that allows JS and TS to coexist. Gradually enable strict flags as you convert files and fix type errors. This prevents blocking the entire team.',
      },
      {
        title: 'Migration Patterns',
        code: `// BEFORE: JavaScript module
// utils/format.js
export function formatCurrency(amount, currency) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

// AFTER: TypeScript with explicit types
// utils/format.ts
interface FormatCurrencyOptions {
  locale?: string
  minimumFractionDigits?: number
}

export function formatCurrency(
  amount: number,
  currency: string,
  options: FormatCurrencyOptions = {}
): string {
  const { locale = 'en-US', minimumFractionDigits } = options
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
  }).format(amount)
}

// Typing a JS module you cannot modify yet
// types/legacy-lib.d.ts
declare module 'legacy-analytics' {
  export function track(event: string, data?: Record<string, unknown>): void
  export function init(config: { apiKey: string }): void
}`,
        explanation: 'Convert files by adding type annotations to parameters and return types. Start with utility modules that have no dependencies, then work inward toward the core business logic.',
      },
      {
        title: 'Common Migration Blockers',
        code: `// Blocker 1: Dynamic object shapes
// JS pattern — add properties dynamically
const config = {}
config.host = 'localhost'  // Error in TS: property does not exist

// Fix: Define the interface upfront
interface Config {
  host: string
  port: number
  debug?: boolean
}
const config: Config = { host: 'localhost', port: 3000 }

// Blocker 2: Untyped event emitters
// Fix: Type the event map
interface AppEvents {
  userLogin: { userId: string }
  error: Error
  ready: void
}

// Blocker 3: Mixed module systems
// Fix: Enable esModuleInterop for CommonJS interop
// import express from 'express'  // instead of require()

// Blocker 4: Implicit this
class Timer {
  seconds = 0

  // start() { setInterval(function() {
  //   this.seconds++  // Error: 'this' is any in regular functions
  // }, 1000) }

  start(): void {
    setInterval(() => {
      this.seconds++  // Arrow function preserves 'this'
    }, 1000)
  }
}`,
        explanation: 'The most common migration blockers are dynamic object shapes, untyped event emitters, mixed module systems, and implicit `this` in callbacks. Each has a standard TypeScript fix.',
      },
    ],
    commonMistakes: [
      'Trying to migrate the entire codebase at once instead of incrementally',
      'Using `any` everywhere to make the build pass — defeats the purpose of migration',
      'Not setting up CI to run type checking — errors slip through',
      'Renaming files without actually adding types — `.ts` extension alone adds no safety',
      'Blocking the team by enabling strict mode before the codebase is ready',
    ],
    interviewTips: [
      'Describe a concrete migration strategy: start with leaf modules, work inward',
      'Mention the allowJs + checkJs coexistence approach for gradual adoption',
      'Know the common blockers and their fixes — interviewers want practical experience',
      'Explain the business case: migration reduces bugs, improves refactoring confidence, and helps onboarding',
    ],
    interviewFrequency: 'high',
    estimatedReadTime: 12,
    prerequisites: ['ts-basics', 'ts-strict-mode'],
    nextConcepts: ['ts-declaration-files'],
    commonQuestions: [
      {
        question: 'How would you migrate a large JavaScript project to TypeScript?',
        answer: 'Enable allowJs in tsconfig so JS and TS coexist. Convert files incrementally starting with leaf modules (utilities, types). Use strict: false initially and enable strict flags one at a time. Create .d.ts files for untyped dependencies. Set up CI to run tsc --noEmit.',
        difficulty: 'medium',
      },
      {
        question: 'What is the biggest challenge in a JS to TS migration?',
        answer: 'Dynamic object shapes — JavaScript commonly builds objects incrementally (`obj.prop = value`), which TypeScript flags as errors. The fix is defining interfaces upfront and initializing objects with all required properties.',
        difficulty: 'medium',
      },
    ],
  },
]

export function getTSConceptById(id: string): TSConcept | undefined {
  return tsConcepts.find((concept) => concept.id === id)
}

export function getTSConceptsByCategory(category: TSConceptCategory): TSConcept[] {
  return tsConcepts.filter((concept) => concept.category === category)
}
