'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams } from 'next/navigation'
import { StepControls } from '@/components/SharedViz'
import { CodeBlock } from '@/components/ui'
import { getTSConceptById } from '@/data/tsConcepts'

interface Step {
  title: string
  code: string
  explanation: string
  output?: string[]
}

interface Tab {
  id: string
  label: string
  steps: Step[]
}

const conceptTabs: Record<string, Tab[]> = {
  'ts-basics': [
    {
      id: 'annotations',
      label: 'Annotations',
      steps: [
        {
          title: 'Explicit Type Annotations',
          code: `let name: string = 'Alice'\nlet age: number = 30\nlet active: boolean = true`,
          explanation: 'TypeScript annotations use a colon after the variable name to declare the expected type.',
        },
        {
          title: 'Type Inference',
          code: `let city = 'London'    // inferred: string\nlet score = 100        // inferred: number\nlet items = [1, 2, 3]  // inferred: number[]`,
          explanation: 'When you assign a value, TypeScript infers the type automatically. Explicit annotations are optional here.',
        },
        {
          title: 'Function Types',
          code: `function greet(name: string): string {\n  return \`Hello, \${name}\`\n}\n\nconst add = (a: number, b: number): number => a + b`,
          explanation: 'Function parameters always need type annotations. Return types can be inferred but explicit annotations help catch mistakes.',
        },
      ],
    },
    {
      id: 'unions',
      label: 'Unions',
      steps: [
        {
          title: 'Union Types',
          code: `type ID = string | number\n\nfunction printId(id: ID) {\n  console.log(id)\n}`,
          explanation: 'Union types use the pipe `|` operator to allow a value to be one of several types.',
        },
        {
          title: 'Literal Types',
          code: `type Direction = 'north' | 'south' | 'east' | 'west'\n\nfunction move(dir: Direction) {\n  // dir can only be one of four values\n}`,
          explanation: 'Literal types restrict values to exact strings, numbers, or booleans — creating an enum-like constraint.',
        },
      ],
    },
  ],
  'ts-type-narrowing': [
    {
      id: 'typeof',
      label: 'typeof Guards',
      steps: [
        {
          title: 'typeof Narrowing',
          code: `function format(val: string | number): string {\n  if (typeof val === 'string') {\n    return val.trim()      // narrowed to string\n  }\n  return val.toFixed(2)    // narrowed to number\n}`,
          explanation: 'typeof checks narrow primitive types. TypeScript tracks control flow and knows the type in each branch.',
        },
        {
          title: 'instanceof Narrowing',
          code: `class ApiError extends Error {\n  statusCode: number\n  constructor(msg: string, code: number) {\n    super(msg)\n    this.statusCode = code\n  }\n}\n\nfunction handle(err: Error) {\n  if (err instanceof ApiError) {\n    console.log(err.statusCode) // narrowed\n  }\n}`,
          explanation: 'instanceof narrows class instances by checking the prototype chain.',
        },
      ],
    },
    {
      id: 'discriminated',
      label: 'Discriminated Unions',
      steps: [
        {
          title: 'Discriminant Property',
          code: `type Shape =\n  | { kind: 'circle'; radius: number }\n  | { kind: 'square'; side: number }\n\nfunction area(s: Shape): number {\n  switch (s.kind) {\n    case 'circle': return Math.PI * s.radius ** 2\n    case 'square': return s.side ** 2\n  }\n}`,
          explanation: 'A shared literal property (like `kind`) acts as the discriminant. TypeScript narrows the union in each case branch.',
        },
        {
          title: 'Exhaustive Check with never',
          code: `function assertNever(x: never): never {\n  throw new Error('Unexpected: ' + x)\n}\n\nfunction area(s: Shape): number {\n  switch (s.kind) {\n    case 'circle': return Math.PI * s.radius ** 2\n    case 'square': return s.side ** 2\n    default: return assertNever(s)\n  }\n}`,
          explanation: 'The never type appears when all cases are handled. Adding a default with assertNever causes a compile error if a new variant is added but not handled.',
        },
      ],
    },
  ],
  'ts-generics': [
    {
      id: 'basics',
      label: 'Generic Basics',
      steps: [
        {
          title: 'Generic Function',
          code: `function identity<T>(value: T): T {\n  return value\n}\n\nconst s = identity('hello')  // string\nconst n = identity(42)        // number`,
          explanation: 'The type parameter <T> is a placeholder filled in when the function is called. TypeScript infers T from the argument.',
        },
        {
          title: 'Generic Constraint',
          code: `function getLength<T extends { length: number }>(item: T): number {\n  return item.length\n}\n\ngetLength('hello')     // OK\ngetLength([1, 2, 3])   // OK\n// getLength(42)       // Error: no length`,
          explanation: 'The extends constraint limits what types T can be, ensuring the generic body can safely access specific properties.',
        },
      ],
    },
    {
      id: 'advanced',
      label: 'Generic Patterns',
      steps: [
        {
          title: 'keyof Constraint',
          code: `function pick<T, K extends keyof T>(\n  obj: T, keys: K[]\n): Pick<T, K> {\n  const result = {} as Pick<T, K>\n  for (const key of keys) {\n    result[key] = obj[key]\n  }\n  return result\n}`,
          explanation: 'keyof T produces a union of all property names of T. Constraining K to keyof T ensures only valid keys are accepted.',
        },
        {
          title: 'Generic Class',
          code: `class Stack<T> {\n  private items: T[] = []\n  push(item: T): void { this.items.push(item) }\n  pop(): T | undefined { return this.items.pop() }\n}\n\nconst nums = new Stack<number>()\nnums.push(1)\nconst top = nums.pop() // number | undefined`,
          explanation: 'Generic classes parameterize the type at the class level, so all methods share the same type parameter.',
        },
      ],
    },
  ],
  'ts-utility-types': [
    {
      id: 'transform',
      label: 'Transformers',
      steps: [
        {
          title: 'Partial & Required',
          code: `interface User {\n  id: number\n  name: string\n  email: string\n}\n\ntype UpdateUser = Partial<User>\n// { id?: number; name?: string; email?: string }\n\ntype CompleteUser = Required<User>\n// All fields required`,
          explanation: 'Partial makes all properties optional — perfect for update/patch operations. Required does the opposite.',
        },
        {
          title: 'Pick & Omit',
          code: `type Summary = Pick<User, 'id' | 'name'>\n// { id: number; name: string }\n\ntype Input = Omit<User, 'id'>\n// { name: string; email: string }`,
          explanation: 'Pick selects specific properties. Omit excludes them. They are complementary operations on object types.',
        },
      ],
    },
    {
      id: 'extract',
      label: 'Extract & Exclude',
      steps: [
        {
          title: 'Union Filtering',
          code: `type Events = 'click' | 'scroll' | 'keydown' | 'keyup'\n\ntype Mouse = Extract<Events, 'click' | 'scroll'>\n// 'click' | 'scroll'\n\ntype Keyboard = Exclude<Events, 'click' | 'scroll'>\n// 'keydown' | 'keyup'`,
          explanation: 'Extract keeps union members that match. Exclude removes members that match. They operate on union types, not object types.',
        },
        {
          title: 'ReturnType & Parameters',
          code: `function createUser(name: string, age: number) {\n  return { id: crypto.randomUUID(), name, age }\n}\n\ntype NewUser = ReturnType<typeof createUser>\n// { id: string; name: string; age: number }\n\ntype Args = Parameters<typeof createUser>\n// [name: string, age: number]`,
          explanation: 'ReturnType extracts the return type of a function. Parameters extracts the parameter types as a tuple.',
        },
      ],
    },
  ],
  'ts-mapped-types': [
    {
      id: 'basics',
      label: 'Mapped Basics',
      steps: [
        {
          title: 'Building Partial from Scratch',
          code: `type MyPartial<T> = {\n  [K in keyof T]?: T[K]\n}\n\n// Iterates over each key K in T\n// Makes each property optional with ?`,
          explanation: 'Mapped types use `[K in keyof T]` to iterate over all keys and transform each property. This is how Partial is implemented.',
        },
        {
          title: 'Modifiers: + and -',
          code: `type MyRequired<T> = {\n  [K in keyof T]-?: T[K]\n}\n\ntype MyReadonly<T> = {\n  readonly [K in keyof T]: T[K]\n}`,
          explanation: 'The -? modifier removes optionality. The readonly modifier prevents assignment. +readonly adds it, -readonly removes it.',
        },
      ],
    },
    {
      id: 'remapping',
      label: 'Key Remapping',
      steps: [
        {
          title: 'Renaming Keys',
          code: `type Getters<T> = {\n  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K]\n}\n\ninterface Person { name: string; age: number }\ntype PG = Getters<Person>\n// { getName: () => string; getAge: () => number }`,
          explanation: 'Key remapping with `as` transforms property names. Template literal types enable pattern-based transformations.',
        },
        {
          title: 'Filtering Keys',
          code: `type StringKeys<T> = {\n  [K in keyof T as T[K] extends string ? K : never]: T[K]\n}\n\ninterface Mixed { name: string; age: number; email: string }\ntype Strings = StringKeys<Mixed>\n// { name: string; email: string }`,
          explanation: 'Mapping a key to `never` removes it from the output. This lets you filter properties by their value type.',
        },
      ],
    },
  ],
  'ts-conditional-types': [
    {
      id: 'basics',
      label: 'Conditional Basics',
      steps: [
        {
          title: 'Type-Level Ternary',
          code: `type IsString<T> = T extends string ? true : false\n\ntype A = IsString<string>   // true\ntype B = IsString<number>   // false\ntype C = IsString<'hello'>  // true`,
          explanation: 'Conditional types use `T extends U ? X : Y` — a ternary operator at the type level.',
        },
        {
          title: 'Distributive Behavior',
          code: `type IsString<T> = T extends string ? true : false\n\n// Distributes over unions:\ntype D = IsString<string | number>\n// = IsString<string> | IsString<number>\n// = true | false\n// = boolean`,
          explanation: 'When T is a bare type parameter, conditional types distribute over unions — each member is checked individually.',
        },
      ],
    },
    {
      id: 'infer',
      label: 'infer Keyword',
      steps: [
        {
          title: 'Extracting Types with infer',
          code: `type MyReturnType<T> =\n  T extends (...args: unknown[]) => infer R ? R : never\n\ntype Fn = (x: string) => number\ntype Result = MyReturnType<Fn>  // number`,
          explanation: 'The `infer` keyword declares a type variable inside extends. TypeScript fills it in with the matching type.',
        },
        {
          title: 'Recursive Conditional Types',
          code: `type Awaited<T> =\n  T extends Promise<infer V> ? Awaited<V> : T\n\ntype Val = Awaited<Promise<Promise<string>>>\n// string (unwraps recursively)`,
          explanation: 'Conditional types can be recursive, unwrapping nested types until a base case is reached.',
        },
      ],
    },
  ],
  'ts-advanced-generics': [
    {
      id: 'recursive',
      label: 'Recursive Types',
      steps: [
        {
          title: 'DeepReadonly',
          code: `type DeepReadonly<T> = {\n  readonly [K in keyof T]: T[K] extends object\n    ? T[K] extends Function\n      ? T[K]\n      : DeepReadonly<T[K]>\n    : T[K]\n}`,
          explanation: 'Recursive types reference themselves. DeepReadonly applies readonly recursively to all nested objects.',
        },
        {
          title: 'JSON Type',
          code: `type JsonValue =\n  | string\n  | number\n  | boolean\n  | null\n  | JsonValue[]\n  | { [key: string]: JsonValue }`,
          explanation: 'The JSON type is a classic recursive type — arrays and objects can contain other JSON values.',
        },
      ],
    },
    {
      id: 'variadic',
      label: 'Variadic Tuples',
      steps: [
        {
          title: 'Tuple Manipulation',
          code: `type Concat<A extends unknown[], B extends unknown[]> =\n  [...A, ...B]\n\ntype AB = Concat<[1, 2], [3, 4]>  // [1, 2, 3, 4]\n\ntype Head<T extends unknown[]> =\n  T extends [infer H, ...unknown[]] ? H : never\n\ntype H = Head<[1, 2, 3]>  // 1`,
          explanation: 'Variadic tuple types use spread syntax at the type level to concatenate, split, and transform tuples.',
        },
      ],
    },
  ],
  'ts-type-assertions': [
    {
      id: 'assertions',
      label: 'Assertions',
      steps: [
        {
          title: 'as vs Type Guards',
          code: `// UNSAFE: assertion — no runtime check\nconst el = document.getElementById('x') as HTMLInputElement\n\n// SAFE: type guard — runtime check\nconst el2 = document.getElementById('x')\nif (el2 instanceof HTMLInputElement) {\n  el2.value = 'safe'\n}`,
          explanation: 'Type assertions override the compiler but provide no runtime safety. Type guards check at runtime.',
        },
        {
          title: 'as const',
          code: `const ROLES = ['admin', 'editor', 'viewer'] as const\ntype Role = (typeof ROLES)[number]\n// 'admin' | 'editor' | 'viewer'\n\nconst config = { host: 'localhost', port: 3000 } as const\n// { readonly host: 'localhost'; readonly port: 3000 }`,
          explanation: 'as const preserves literal types and makes values deeply readonly. It is commonly used to derive union types from arrays.',
        },
      ],
    },
  ],
  'ts-declaration-files': [
    {
      id: 'declare',
      label: 'Declarations',
      steps: [
        {
          title: 'Module Declaration',
          code: `// types/analytics.d.ts\ndeclare module 'analytics-lib' {\n  export function init(config: { apiKey: string }): void\n  export function track(event: string): Promise<void>\n}`,
          explanation: 'Declaration files describe the API surface of JavaScript modules. They contain only type information, no runtime code.',
        },
        {
          title: 'Module Augmentation',
          code: `import 'express'\n\ndeclare module 'express' {\n  interface Request {\n    userId?: string\n  }\n}`,
          explanation: 'Module augmentation extends existing module types with new properties without modifying the original source.',
        },
      ],
    },
  ],
  'ts-react-components': [
    {
      id: 'props',
      label: 'Props Typing',
      steps: [
        {
          title: 'Component Props',
          code: `interface ButtonProps {\n  label: string\n  variant?: 'primary' | 'secondary'\n  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void\n}\n\nfunction Button({ label, variant = 'primary', onClick }: ButtonProps) {\n  return <button onClick={onClick}>{label}</button>\n}`,
          explanation: 'Props are defined as an interface. Optional props use `?`. Event handlers use React synthetic event types.',
        },
        {
          title: 'Extending HTML Props',
          code: `type InputProps = React.ComponentPropsWithoutRef<'input'> & {\n  label: string\n  error?: string\n}\n\nfunction Input({ label, error, ...rest }: InputProps) {\n  return (\n    <label>\n      {label}\n      <input {...rest} />\n      {error && <span>{error}</span>}\n    </label>\n  )\n}`,
          explanation: 'ComponentPropsWithoutRef inherits all native HTML props, so you do not have to redefine standard attributes.',
        },
      ],
    },
    {
      id: 'patterns',
      label: 'Component Patterns',
      steps: [
        {
          title: 'Discriminated Union Props',
          code: `type AlertProps =\n  | { variant: 'success'; message: string }\n  | { variant: 'error'; message: string; retry: () => void }\n  | { variant: 'loading' }\n\nfunction Alert(props: AlertProps) {\n  switch (props.variant) {\n    case 'success': return <div>{props.message}</div>\n    case 'error': return <div>{props.message}<button onClick={props.retry}>Retry</button></div>\n    case 'loading': return <div>Loading...</div>\n  }\n}`,
          explanation: 'Discriminated union props ensure variant-specific props are only available with the matching variant.',
        },
      ],
    },
  ],
  'ts-react-hooks': [
    {
      id: 'state-ref',
      label: 'State & Ref',
      steps: [
        {
          title: 'Typed useState',
          code: `const [user, setUser] = useState<User | null>(null)\nconst [status, setStatus] = useState<'idle' | 'loading'>('idle')\n\n// Inferred from initial value:\nconst [count, setCount] = useState(0)  // number`,
          explanation: 'useState needs explicit type parameters when the initial value does not represent all possible states.',
        },
        {
          title: 'Typed useRef',
          code: `// DOM ref — immutable .current\nconst inputRef = useRef<HTMLInputElement>(null)\n\n// Value ref — mutable .current\nconst timerRef = useRef<number>(0)\ntimerRef.current = window.setTimeout(() => {}, 1000)`,
          explanation: 'Passing null as initial value creates a readonly ref (for DOM elements). Omitting null creates a mutable ref (for values).',
        },
      ],
    },
    {
      id: 'reducer',
      label: 'useReducer',
      steps: [
        {
          title: 'Typed Reducer',
          code: `type Action =\n  | { type: 'ADD'; text: string }\n  | { type: 'TOGGLE'; id: string }\n  | { type: 'DELETE'; id: string }\n\nfunction reducer(state: State, action: Action): State {\n  switch (action.type) {\n    case 'ADD': return { ...state, items: [...state.items, action.text] }\n    case 'TOGGLE': return state // ...\n    case 'DELETE': return state // ...\n  }\n}`,
          explanation: 'Discriminated union actions ensure dispatch only accepts valid action shapes. The reducer must handle every case.',
        },
      ],
    },
  ],
  'ts-react-patterns': [
    {
      id: 'polymorphic',
      label: 'Polymorphic',
      steps: [
        {
          title: 'Polymorphic as Prop',
          code: `type PolyProps<E extends React.ElementType, P = object> =\n  P & Omit<React.ComponentPropsWithoutRef<E>, keyof P | 'as'> & { as?: E }\n\nfunction Box<E extends React.ElementType = 'div'>({\n  as, children, ...rest\n}: PolyProps<E, { children?: React.ReactNode }>) {\n  const Component = as || 'div'\n  return <Component {...rest}>{children}</Component>\n}`,
          explanation: 'Polymorphic components accept an `as` prop that changes the rendered element. TypeScript ensures remaining props match.',
        },
      ],
    },
    {
      id: 'context',
      label: 'Strict Context',
      steps: [
        {
          title: 'Context Factory',
          code: `function createStrictContext<T>(name: string): [\n  React.Provider<T>,\n  () => T,\n] {\n  const Ctx = React.createContext<T | undefined>(undefined)\n  function useCtx(): T {\n    const v = React.useContext(Ctx)\n    if (v === undefined) throw new Error(\`Missing \${name}Provider\`)\n    return v\n  }\n  return [Ctx.Provider as React.Provider<T>, useCtx]\n}`,
          explanation: 'The strict context factory creates a typed provider and hook pair. The hook throws if used outside the provider, eliminating undefined checks.',
        },
      ],
    },
  ],
  'ts-tricky-questions': [
    {
      id: 'structural',
      label: 'Structural Typing',
      steps: [
        {
          title: 'Structural vs Nominal',
          code: `interface Point2D { x: number; y: number }\ninterface Point3D { x: number; y: number; z: number }\n\nconst p3: Point3D = { x: 1, y: 2, z: 3 }\nconst p2: Point2D = p3  // OK — structural subtype\n\n// But excess property checking catches literals:\n// const p2b: Point2D = { x: 1, y: 2, z: 3 }  // Error!`,
          explanation: 'TypeScript uses structural typing — types are compatible if they have the same shape. Excess property checking only applies to object literals.',
        },
        {
          title: 'Branded Types',
          code: `type USD = number & { __brand: 'USD' }\ntype EUR = number & { __brand: 'EUR' }\n\nfunction pay(amount: USD): void { }\n\nconst dollars = 100 as USD\npay(dollars)      // OK\n// pay(100)        // Error: number is not USD\n// pay(100 as EUR) // Error: EUR is not USD`,
          explanation: 'Branded types simulate nominal typing by adding a phantom property. They prevent accidental mixing of structurally identical types.',
        },
      ],
    },
    {
      id: 'variance',
      label: 'Variance',
      steps: [
        {
          title: 'Covariance & Contravariance',
          code: `class Animal { name = '' }\nclass Dog extends Animal { breed = '' }\n\n// Covariant return types:\ntype AF = () => Animal\ntype DF = () => Dog\nconst df: DF = () => new Dog()\nconst af: AF = df  // OK — Dog extends Animal\n\n// Contravariant parameters (with strictFunctionTypes):\ntype AH = (a: Animal) => void\ntype DH = (d: Dog) => void\n// const dh: DH = (a: Animal) => {}  // Error!`,
          explanation: 'Return types are covariant (subtypes OK). Parameter types are contravariant (supertypes OK). This prevents unsafe function substitution.',
        },
      ],
    },
  ],
  'ts-strict-mode': [
    {
      id: 'flags',
      label: 'Strict Flags',
      steps: [
        {
          title: 'strictNullChecks',
          code: `// WITH strictNullChecks:\nlet name: string | null = null\n\nconst user = getUser('1')  // User | undefined\n// user.name  // Error!\nif (user) {\n  console.log(user.name)  // OK — narrowed\n}`,
          explanation: 'strictNullChecks makes null and undefined distinct types. Values must be explicitly checked before use.',
        },
        {
          title: 'noImplicitAny',
          code: `// function greet(name) { }  // Error: implicit any\n\nfunction greet(name: string): string {\n  return \`Hello, \${name}\`\n}`,
          explanation: 'noImplicitAny errors when TypeScript cannot infer a type and would fall back to `any`.',
        },
      ],
    },
  ],
  'ts-migration': [
    {
      id: 'strategy',
      label: 'Strategy',
      steps: [
        {
          title: 'Phase 1: Coexistence',
          code: `// tsconfig.json\n{\n  "compilerOptions": {\n    "allowJs": true,\n    "checkJs": false,\n    "strict": false\n  }\n}`,
          explanation: 'Start with a permissive config that allows JS and TS to coexist. Convert files one at a time.',
        },
        {
          title: 'Phase 2: Tighten',
          code: `// Enable strict flags one by one:\n// "noImplicitAny": true\n// "strictNullChecks": true\n// "strict": true  // Final goal`,
          explanation: 'Gradually enable strict flags as files are converted. This prevents blocking the entire team.',
        },
      ],
    },
    {
      id: 'blockers',
      label: 'Common Blockers',
      steps: [
        {
          title: 'Dynamic Objects',
          code: `// JS pattern (broken in TS):\nconst config = {}\nconfig.host = 'localhost'  // Error!\n\n// Fix: define interface upfront\ninterface Config { host: string; port: number }\nconst config: Config = { host: 'localhost', port: 3000 }`,
          explanation: 'JavaScript commonly builds objects incrementally. TypeScript requires defining the shape upfront.',
        },
      ],
    },
  ],
}

export function TypeScriptViz(): JSX.Element {
  const params = useParams()
  const conceptId = params.conceptId as string
  const concept = getTSConceptById(conceptId)

  const tabs = useMemo(() => conceptTabs[conceptId] ?? [], [conceptId])
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)

  const activeTab = tabs[activeTabIndex]
  const steps = activeTab?.steps ?? []
  const currentStep = steps[stepIndex]

  const handleTabChange = (index: number): void => {
    setActiveTabIndex(index)
    setStepIndex(0)
  }

  if (!concept || tabs.length === 0) {
    return (
      <div className="flex h-[250px] items-center justify-center text-text-muted">
        Visualization coming soon
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-[var(--spacing-lg)]">
      {tabs.length > 1 && (
        <div className="flex gap-[var(--spacing-sm)] flex-wrap">
          {tabs.map((tab, i) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(i)}
              className={`px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] text-[length:var(--text-sm)] font-[var(--font-weight-medium)] transition-colors duration-[var(--transition-fast)] border ${
                i === activeTabIndex
                  ? 'bg-[var(--color-brand-primary-15)] text-[color:var(--color-brand-primary-light)] border-[var(--color-brand-primary-40)]'
                  : 'bg-transparent text-text-muted border-[var(--color-border-card)] hover:text-text-secondary hover:bg-[var(--color-white-5)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {currentStep && (
          <motion.div
            key={`${activeTab.id}-${stepIndex}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-[var(--spacing-md)]"
          >
            <h3 className="m-0 text-[length:var(--text-md)] font-[var(--font-weight-semibold)] text-text-bright">
              {currentStep.title}
            </h3>

            <CodeBlock code={currentStep.code} />

            <p className="m-0 text-[length:var(--text-base)] leading-[var(--leading-relaxed)] text-text-secondary">
              {currentStep.explanation}
            </p>

            {currentStep.output && currentStep.output.length > 0 && (
              <div className="rounded-[var(--radius-md)] bg-[var(--color-black-30)] p-[var(--spacing-md)] font-mono text-[length:var(--text-sm)]">
                {currentStep.output.map((line, i) => (
                  <div key={i} className="text-text-muted">{line}</div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {steps.length > 1 && (
        <StepControls
          onPrev={() => setStepIndex((i) => Math.max(0, i - 1))}
          onNext={() => setStepIndex((i) => Math.min(steps.length - 1, i + 1))}
          onReset={() => setStepIndex(0)}
          canPrev={stepIndex > 0}
          canNext={stepIndex < steps.length - 1}
          stepInfo={{ current: stepIndex + 1, total: steps.length }}
        />
      )}
    </div>
  )
}
