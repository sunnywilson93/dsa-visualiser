export interface QuizQuestion {
  id: string
  question: string
  codeSnippet?: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface Quiz {
  id: string
  title: string
  shortDescription: string
  description: string
  domain: 'js' | 'react' | 'ts' | 'dsa'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  questions: QuizQuestion[]
  targetKeywords: string[]
  estimatedTime: number
}

export const quizzes: Quiz[] = [
  {
    id: 'js-output-quiz',
    title: "What's the Output?",
    shortDescription: 'Test your knowledge of JavaScript quirks and gotchas',
    description: 'Can you predict what JavaScript will actually output? This quiz covers closures, hoisting, type coercion, the this keyword, event loop behavior, prototypes, and other common JS interview traps. Each question shows a code snippet — your job is to figure out what gets logged.',
    domain: 'js',
    difficulty: 'intermediate',
    targetKeywords: ['javascript output quiz', 'js interview questions', 'javascript quirks', 'closures quiz', 'hoisting quiz', 'type coercion', 'this keyword quiz'],
    estimatedTime: 15,
    questions: [
      {
        id: 'js-out-1',
        question: 'What does this code output?',
        codeSnippet: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}`,
        options: ['0 1 2', '3 3 3', 'undefined undefined undefined', '0 0 0'],
        correctIndex: 1,
        explanation: '`var` is function-scoped, not block-scoped. By the time the setTimeout callbacks run, the loop has finished and `i` is 3. All three callbacks share the same `i` variable. Using `let` instead of `var` would give 0 1 2 because `let` creates a new binding per iteration.',
      },
      {
        id: 'js-out-2',
        question: 'What does this code output?',
        codeSnippet: `console.log(typeof null);`,
        options: ['"null"', '"undefined"', '"object"', '"boolean"'],
        correctIndex: 2,
        explanation: 'This is a well-known JavaScript bug that persists for backwards compatibility. `typeof null` returns "object" even though null is not actually an object. This dates back to the first implementation of JavaScript where values were stored with a type tag, and the tag for objects was 0 — the same as the tag for null.',
      },
      {
        id: 'js-out-3',
        question: 'What does this code output?',
        codeSnippet: `console.log(1 + '2' + 3);`,
        options: ['6', '"123"', '"33"', 'NaN'],
        correctIndex: 1,
        explanation: 'JavaScript evaluates left to right. First, 1 + "2" — since one operand is a string, the number is coerced to a string, giving "12". Then "12" + 3 coerces 3 to a string, giving "123".',
      },
      {
        id: 'js-out-4',
        question: 'What does this code output?',
        codeSnippet: `let a = { x: 1 };
let b = a;
b.x = 2;
console.log(a.x);`,
        options: ['1', '2', 'undefined', 'ReferenceError'],
        correctIndex: 1,
        explanation: 'Objects are assigned by reference in JavaScript. `b = a` does not create a copy — both `a` and `b` point to the same object in memory. Modifying `b.x` also modifies `a.x` because they reference the same object.',
      },
      {
        id: 'js-out-5',
        question: 'What does this code output?',
        codeSnippet: `console.log([] == false);
console.log([] == ![]);`,
        options: ['true, true', 'true, false', 'false, true', 'false, false'],
        correctIndex: 0,
        explanation: 'For `[] == false`: the array is coerced to a primitive via ToPrimitive, becoming "" (empty string), which becomes 0. false also becomes 0. So 0 == 0 is true. For `[] == ![]`: `![]` is false (arrays are truthy, so negating gives false). Then it becomes `[] == false`, which we just showed is true.',
      },
      {
        id: 'js-out-6',
        question: 'What does this code output?',
        codeSnippet: `function foo() {
  console.log(this.bar);
}
const obj = { bar: 'hello', foo };
const fn = obj.foo;
fn();`,
        options: ['"hello"', 'undefined', 'TypeError', 'null'],
        correctIndex: 1,
        explanation: 'When you assign `obj.foo` to `fn` and call `fn()`, the `this` context is lost. In non-strict mode, `this` defaults to the global object (window/global), which does not have a `bar` property, so `this.bar` is undefined. In strict mode this would throw a TypeError since `this` would be undefined.',
      },
      {
        id: 'js-out-7',
        question: 'What does this code output?',
        codeSnippet: `console.log(0.1 + 0.2 === 0.3);`,
        options: ['true', 'false', 'TypeError', 'NaN'],
        correctIndex: 1,
        explanation: 'Due to IEEE 754 floating-point arithmetic, 0.1 + 0.2 equals 0.30000000000000004, not exactly 0.3. Therefore the strict equality check returns false. This is a common gotcha in all languages that use floating-point numbers.',
      },
      {
        id: 'js-out-8',
        question: 'What does this code output?',
        codeSnippet: `console.log('5' - 3);
console.log('5' + 3);`,
        options: ['2, 8', '2, "53"', '"53", 8', 'NaN, "53"'],
        correctIndex: 1,
        explanation: 'The minus operator only works with numbers, so "5" is coerced to 5, giving 5 - 3 = 2. The plus operator, however, also serves as string concatenation. When one operand is a string, the other is converted to a string: "5" + "3" = "53".',
      },
      {
        id: 'js-out-9',
        question: 'What does this code output?',
        codeSnippet: `function createCounter() {
  let count = 0;
  return {
    increment: () => ++count,
    getCount: () => count,
  };
}
const counter = createCounter();
counter.increment();
counter.increment();
console.log(counter.getCount());`,
        options: ['0', '1', '2', '3'],
        correctIndex: 2,
        explanation: 'This is a closure. The `count` variable is enclosed in the scope of `createCounter`. Both `increment` and `getCount` share the same `count` reference. After two calls to `increment()`, count is 2.',
      },
      {
        id: 'js-out-10',
        question: 'What does this code output?',
        codeSnippet: `console.log(typeof undefined);
console.log(typeof undeclaredVar);`,
        options: ['"undefined", ReferenceError', '"undefined", "undefined"', '"undefined", "null"', 'ReferenceError, ReferenceError'],
        correctIndex: 1,
        explanation: '`typeof undefined` is "undefined" as expected. Surprisingly, `typeof` on a variable that was never declared also returns "undefined" instead of throwing a ReferenceError. This is the only operator in JavaScript that does not throw on undeclared variables, which was designed to allow safe feature detection.',
      },
      {
        id: 'js-out-11',
        question: 'What does this code output?',
        codeSnippet: `const arr = [1, 2, 3];
arr[10] = 11;
console.log(arr.length);`,
        options: ['3', '4', '11', '10'],
        correctIndex: 2,
        explanation: 'Setting `arr[10] = 11` creates a "sparse" array. JavaScript automatically sets `length` to the highest index + 1. Indices 3 through 9 are empty slots (not undefined — they literally do not exist as properties). The length becomes 11.',
      },
      {
        id: 'js-out-12',
        question: 'What does this code output?',
        codeSnippet: `console.log(false == '0');
console.log(false === '0');`,
        options: ['true, true', 'true, false', 'false, true', 'false, false'],
        correctIndex: 1,
        explanation: 'With `==` (loose equality), false is coerced to 0, and "0" is coerced to 0, so 0 == 0 is true. With `===` (strict equality), no type coercion occurs — a boolean is never equal to a string, so it returns false.',
      },
      {
        id: 'js-out-13',
        question: 'What does this code output?',
        codeSnippet: `const obj = { a: 1 };
Object.freeze(obj);
obj.a = 2;
obj.b = 3;
console.log(obj.a, obj.b);`,
        options: ['2, 3', '1, undefined', '1, 3', 'TypeError'],
        correctIndex: 1,
        explanation: '`Object.freeze()` makes an object immutable at the top level. In non-strict mode, assignments silently fail — they do not throw. So `obj.a` remains 1 and `obj.b` is never created (undefined). In strict mode, both assignments would throw a TypeError.',
      },
      {
        id: 'js-out-14',
        question: 'What does this code output?',
        codeSnippet: `let x = 1;
function foo() {
  console.log(x);
  let x = 2;
}
foo();`,
        options: ['1', '2', 'undefined', 'ReferenceError'],
        correctIndex: 3,
        explanation: 'This is the Temporal Dead Zone (TDZ). The `let x = 2` declaration is hoisted to the top of the function scope, but unlike `var`, it is not initialized. Accessing `x` before the `let` declaration throws a ReferenceError. The outer `x = 1` is shadowed but not accessible.',
      },
      {
        id: 'js-out-15',
        question: 'What does this code output?',
        codeSnippet: `const a = {};
const b = { key: 'b' };
const c = { key: 'c' };
a[b] = 123;
a[c] = 456;
console.log(a[b]);`,
        options: ['123', '456', 'undefined', 'TypeError'],
        correctIndex: 1,
        explanation: 'When you use an object as a property key, JavaScript calls `.toString()` on it, which returns "[object Object]". Both `b` and `c` produce the same key string "[object Object]". So `a[c] = 456` overwrites `a[b] = 123`. Therefore `a[b]` is 456.',
      },
      {
        id: 'js-out-16',
        question: 'What does this code output?',
        codeSnippet: `function Person(name) {
  this.name = name;
}
Person.prototype.greet = function () {
  return 'Hi, ' + this.name;
};
const p = new Person('Alice');
console.log(p.greet());
console.log(p.hasOwnProperty('greet'));`,
        options: ['"Hi, Alice", true', '"Hi, Alice", false', '"Hi, undefined", false', 'TypeError'],
        correctIndex: 1,
        explanation: '`greet` is defined on `Person.prototype`, not on the instance `p`. So `p.greet()` works via prototype chain lookup and returns "Hi, Alice". But `p.hasOwnProperty("greet")` is false because `greet` is an inherited property, not an own property of `p`.',
      },
      {
        id: 'js-out-17',
        question: 'What does this code output?',
        codeSnippet: `console.log(+'');
console.log(+true);
console.log(+null);
console.log(+undefined);`,
        options: ['0, 1, 0, NaN', '0, 1, 0, 0', 'NaN, 1, 0, NaN', '0, true, null, NaN'],
        correctIndex: 0,
        explanation: 'The unary `+` operator converts values to numbers. Empty string becomes 0. true becomes 1. null becomes 0. undefined becomes NaN. These follow the ToNumber abstract operation rules in the ECMAScript spec.',
      },
      {
        id: 'js-out-18',
        question: 'What does this code output?',
        codeSnippet: `const sym1 = Symbol('id');
const sym2 = Symbol('id');
console.log(sym1 === sym2);`,
        options: ['true', 'false', 'TypeError', '"id" === "id" → true'],
        correctIndex: 1,
        explanation: 'Every `Symbol()` call creates a unique symbol, regardless of the description string passed to it. The description is just a label for debugging; it does not affect uniqueness. To share symbols, use `Symbol.for("id")` which looks up a global symbol registry.',
      },
      {
        id: 'js-out-19',
        question: 'What does this code output?',
        codeSnippet: `const arr = [1, 2, 3, 4, 5];
const result = arr.filter(Boolean).map(x => x * 2);
console.log(result);`,
        options: ['[2, 4, 6, 8, 10]', '[1, 2, 3, 4, 5]', '[]', 'TypeError'],
        correctIndex: 0,
        explanation: '`arr.filter(Boolean)` removes falsy values from the array. Since all values (1-5) are truthy, the filtered array is [1, 2, 3, 4, 5]. Then `.map(x => x * 2)` doubles each element, producing [2, 4, 6, 8, 10].',
      },
      {
        id: 'js-out-20',
        question: 'What does this code output?',
        codeSnippet: `const foo = () => {
  let a = b = 0;
};
foo();
console.log(typeof a);
console.log(typeof b);`,
        options: ['"undefined", "undefined"', '"number", "number"', '"undefined", "number"', 'ReferenceError'],
        correctIndex: 2,
        explanation: '`let a = b = 0` is parsed as `b = 0; let a = b;`. The assignment `b = 0` without a declaration keyword creates an implicit global variable. So after `foo()` runs, `b` exists globally (typeof b is "number"), but `a` was declared with `let` inside the function and is not accessible outside (typeof a is "undefined").',
      },
    ],
  },
  {
    id: 'react-rerender-quiz',
    title: 'Will It Re-render?',
    shortDescription: 'Predict when React components re-render',
    description: 'Understanding when and why React components re-render is crucial for writing performant applications. This quiz tests your knowledge of state changes, prop changes, context updates, React.memo, key changes, and other re-rendering triggers.',
    domain: 'react',
    difficulty: 'intermediate',
    targetKeywords: ['react rerender quiz', 'react performance', 'react memo', 'useMemo', 'useCallback', 'react reconciliation', 'react interview'],
    estimatedTime: 12,
    questions: [
      {
        id: 'react-rr-1',
        question: 'Will the Child component re-render when the button is clicked?',
        codeSnippet: `function Parent() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>
        Click
      </button>
      <Child />
    </div>
  );
}

function Child() {
  return <div>I am a child</div>;
}`,
        options: ['Yes — Parent re-renders, so Child re-renders too', 'No — Child has no props, so it skips re-render', 'No — Child has no state, so it never re-renders', 'Only on the first click'],
        correctIndex: 0,
        explanation: 'When a parent component re-renders, all of its child components re-render by default, regardless of whether they receive props or not. React does not automatically bail out of rendering children. To prevent this, you would need to wrap Child with `React.memo()`.',
      },
      {
        id: 'react-rr-2',
        question: 'Will MemoChild re-render when the button is clicked?',
        codeSnippet: `const MemoChild = React.memo(function Child({ name }) {
  return <div>Hello {name}</div>;
});

function Parent() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>
        Click
      </button>
      <MemoChild name="Alice" />
    </div>
  );
}`,
        options: ['Yes — Parent re-renders, so MemoChild must too', 'No — React.memo does a shallow comparison and "Alice" === "Alice"', 'Yes — React.memo only works with useCallback', 'No — string props never cause re-renders'],
        correctIndex: 1,
        explanation: '`React.memo` performs a shallow comparison of the previous and next props. Since the `name` prop is always the string literal "Alice", the shallow comparison returns true (same value), and MemoChild skips re-rendering.',
      },
      {
        id: 'react-rr-3',
        question: 'Will MemoChild re-render when the button is clicked?',
        codeSnippet: `const MemoChild = React.memo(function Child({ style }) {
  return <div style={style}>Styled</div>;
});

function Parent() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>
        Click
      </button>
      <MemoChild style={{ color: 'red' }} />
    </div>
  );
}`,
        options: ['No — the style object has the same values', 'Yes — a new object reference is created every render', 'No — React.memo does deep comparison by default', 'Only if color changes'],
        correctIndex: 1,
        explanation: 'Even though the object has the same shape and values, `{ color: "red" }` creates a new object reference every time Parent renders. `React.memo` does shallow comparison, so `prevProps.style !== nextProps.style` is true (different references), causing a re-render. Use `useMemo` to stabilize the reference.',
      },
      {
        id: 'react-rr-4',
        question: 'What happens when setCount is called with the same value?',
        codeSnippet: `function Counter() {
  const [count, setCount] = useState(0);
  console.log('render');
  return (
    <button onClick={() => setCount(0)}>
      Count: {count}
    </button>
  );
}`,
        options: ['Re-renders every click', 'Never re-renders after initial', 'Re-renders once extra, then bails out', 'Throws an error — same value'],
        correctIndex: 2,
        explanation: 'React may render the component one extra time after setting state to the same value, as an optimization check. After that, React bails out of subsequent renders if the state has not changed. You will see "render" logged one extra time, then no more on subsequent clicks.',
      },
      {
        id: 'react-rr-5',
        question: 'Will ComponentB re-render when the theme changes?',
        codeSnippet: `const ThemeContext = createContext('light');

function ComponentA() {
  return <ComponentB />;
}

function ComponentB() {
  return <div>No context used</div>;
}

function App() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={theme}>
      <button onClick={() => setTheme('dark')}>
        Toggle
      </button>
      <ComponentA />
    </ThemeContext.Provider>
  );
}`,
        options: ['Yes — all descendants of a Provider re-render', 'No — ComponentB does not consume the context', 'Yes — context changes always re-render the entire tree', 'Only if wrapped in useContext'],
        correctIndex: 0,
        explanation: 'When `setTheme` is called, the App component re-renders. Since ComponentA is a child of App, it re-renders. Since ComponentB is a child of ComponentA, it also re-renders. This happens because of normal parent-child re-rendering, not because of context. To prevent this, you would need React.memo on the components.',
      },
      {
        id: 'react-rr-6',
        question: 'Will the list items re-render when a new item is added?',
        codeSnippet: `function List({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}`,
        options: ['Only the new item renders; existing items are untouched', 'All items re-render because the parent re-renders', 'React skips re-render if items have stable keys', 'Only items whose index changed re-render'],
        correctIndex: 1,
        explanation: 'Stable keys help React identify which DOM elements to reuse during reconciliation (avoiding unnecessary DOM mutations), but they do not prevent re-rendering of the React components themselves. Since the parent (List) re-renders, all its children (`<li>` elements) will also re-render. The key prop is about DOM reconciliation, not render bailout.',
      },
      {
        id: 'react-rr-7',
        question: 'Will MemoChild re-render when the button is clicked?',
        codeSnippet: `const MemoChild = React.memo(function Child({ onClick }) {
  return <button onClick={onClick}>Click me</button>;
});

function Parent() {
  const [count, setCount] = useState(0);
  const handleClick = () => console.log('clicked');
  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>
        Increment
      </button>
      <MemoChild onClick={handleClick} />
    </div>
  );
}`,
        options: ['No — React.memo prevents re-render', 'Yes — handleClick is recreated each render', 'No — functions are compared by behavior', 'Only on the first click'],
        correctIndex: 1,
        explanation: '`handleClick` is defined inside the render function, so it is a new function reference on every render. `React.memo` shallow-compares props, and `prevOnClick !== nextOnClick`. To fix this, wrap `handleClick` with `useCallback` to maintain a stable reference.',
      },
      {
        id: 'react-rr-8',
        question: 'Does the ExpensiveTree re-render when count changes?',
        codeSnippet: `function App({ children }) {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>
        {count}
      </button>
      {children}
    </div>
  );
}

// Usage:
<App>
  <ExpensiveTree />
</App>`,
        options: ['Yes — App re-renders so children re-render', 'No — children is a prop that does not change', 'Yes — but only the first time', 'Depends on ExpensiveTree implementation'],
        correctIndex: 1,
        explanation: 'This is the "children as props" pattern. `<ExpensiveTree />` is created in the parent of App, not inside App itself. When App re-renders due to count changing, the `children` prop still points to the same React element (same reference from the parent scope). React sees that the element reference has not changed and skips re-rendering ExpensiveTree.',
      },
      {
        id: 'react-rr-9',
        question: 'What happens when the key changes on a component?',
        codeSnippet: `function App() {
  const [userId, setUserId] = useState(1);
  return (
    <div>
      <button onClick={() => setUserId(id => id + 1)}>
        Next User
      </button>
      <UserProfile key={userId} userId={userId} />
    </div>
  );
}`,
        options: ['UserProfile re-renders with new props', 'UserProfile unmounts and remounts (fresh instance)', 'React throws an error for dynamic keys', 'Nothing happens — key is only for lists'],
        correctIndex: 1,
        explanation: 'Changing the `key` prop tells React that this is a conceptually different component. React unmounts the old instance (including running cleanup effects and destroying state) and mounts a completely new one. This is a common pattern to reset component state when switching between items.',
      },
      {
        id: 'react-rr-10',
        question: 'Will the component re-render when the ref changes?',
        codeSnippet: `function Timer() {
  const countRef = useRef(0);

  const increment = () => {
    countRef.current += 1;
    console.log(countRef.current);
  };

  return (
    <div>
      <p>Count: {countRef.current}</p>
      <button onClick={increment}>+1</button>
    </div>
  );
}`,
        options: ['Yes — the ref value changed', 'No — ref changes do not trigger re-renders', 'Yes — but only if the ref is used in JSX', 'Depends on React version'],
        correctIndex: 1,
        explanation: 'Mutating `useRef().current` does NOT trigger a re-render. Refs are specifically designed for values that should persist across renders without causing updates. The displayed count in the JSX will be stale (always 0) because the component never re-renders. To update the UI, you must use `useState`.',
      },
      {
        id: 'react-rr-11',
        question: 'Will useEffect run after every re-render here?',
        codeSnippet: `function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchResults(query).then(setResults);
  });

  return (
    <input
      value={query}
      onChange={e => setQuery(e.target.value)}
    />
  );
}`,
        options: ['No — useEffect only runs on mount', 'Yes — no dependency array means it runs after every render', 'No — it only runs when query changes', 'Yes — but only in development mode'],
        correctIndex: 1,
        explanation: 'When `useEffect` has no dependency array at all (not even an empty one), it runs after every render. This will cause an infinite loop here: setResults triggers a re-render, which runs the effect again, which calls fetchResults, which calls setResults, and so on. You need `[query]` as the dependency array.',
      },
      {
        id: 'react-rr-12',
        question: 'How many times does Child render when count goes from 0 to 1?',
        codeSnippet: `function Parent() {
  const [count, setCount] = useState(0);

  const data = useMemo(() => ({
    value: count
  }), [count]);

  return <MemoChild data={data} />;
}

const MemoChild = React.memo(function Child({ data }) {
  console.log('Child render');
  return <div>{data.value}</div>;
});`,
        options: ['0 times', '1 time', '2 times', '3 times'],
        correctIndex: 1,
        explanation: '`useMemo` creates a new object only when `count` changes. When count goes from 0 to 1, useMemo produces a new reference, so React.memo sees different props and allows re-render. Child renders exactly 1 time for this state change. If count stayed at 0, useMemo would return the same reference, and React.memo would bail out.',
      },
      {
        id: 'react-rr-13',
        question: 'Will the component update when dispatchAction is called with the same state?',
        codeSnippet: `function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'reset':
      return state;
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(
    reducer, { count: 0 }
  );
  return (
    <button onClick={() => dispatch({ type: 'reset' })}>
      {state.count}
    </button>
  );
}`,
        options: ['Yes — dispatch always triggers a re-render', 'No — React bails out if reducer returns same reference', 'Yes — useReducer always re-renders on dispatch', 'Error — dispatch cannot return same state'],
        correctIndex: 1,
        explanation: 'When a reducer returns the exact same state object reference (using `return state`), React bails out of the re-render. This is similar to how setState bails out on same values. React uses Object.is to compare the previous and next state; since it is the same reference, no re-render occurs.',
      },
      {
        id: 'react-rr-14',
        question: 'Will ComponentB re-render when the name state changes?',
        codeSnippet: `const UserContext = createContext({ name: '' });

const ComponentA = React.memo(function A() {
  return <ComponentB />;
});

function ComponentB() {
  const { name } = useContext(UserContext);
  return <div>{name}</div>;
}

function App() {
  const [name, setName] = useState('Alice');
  return (
    <UserContext.Provider value={{ name }}>
      <ComponentA />
    </UserContext.Provider>
  );
}`,
        options: ['No — ComponentA is memoized, blocking the update', 'Yes — useContext bypasses React.memo', 'No — context only works with class components', 'Yes — but only if ComponentB is also memoized'],
        correctIndex: 1,
        explanation: 'Even though ComponentA is wrapped in React.memo (and would skip re-rendering since it has no props), ComponentB directly consumes the context via `useContext`. Context subscriptions bypass the normal parent-child rendering flow — when the context value changes, any component that calls `useContext` for that context will re-render, regardless of memo on ancestors.',
      },
      {
        id: 'react-rr-15',
        question: 'What renders when the button is clicked?',
        codeSnippet: `function App() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(1);
    setCount(2);
    setCount(3);
  }

  console.log('render', count);

  return (
    <button onClick={handleClick}>
      Click
    </button>
  );
}`,
        options: [
          'render 1, render 2, render 3',
          'render 3 (single re-render)',
          'render 0, render 3',
          'render 1, render 3',
        ],
        correctIndex: 1,
        explanation: 'React 18 automatically batches state updates inside event handlers. All three `setCount` calls are batched into a single re-render. The final value is 3, so the component re-renders once and logs "render 3". This batching behavior was extended to all updates (including promises and timeouts) in React 18.',
      },
    ],
  },
  {
    id: 'promise-order-quiz',
    title: 'Promise Execution Order',
    shortDescription: 'Predict the order of async operations',
    description: 'Mastering JavaScript async behavior requires understanding microtasks, macrotasks, and the event loop. This quiz shows you code with Promises, setTimeout, async/await, and console.log statements — your challenge is to predict the exact output order.',
    domain: 'js',
    difficulty: 'advanced',
    targetKeywords: ['promise execution order', 'javascript event loop', 'microtask macrotask', 'async await order', 'promise quiz', 'javascript async interview'],
    estimatedTime: 10,
    questions: [
      {
        id: 'promise-1',
        question: 'What is the output order?',
        codeSnippet: `console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');`,
        options: ['1, 2, 3, 4', '1, 4, 3, 2', '1, 4, 2, 3', '1, 3, 4, 2'],
        correctIndex: 1,
        explanation: 'Synchronous code runs first: "1", then "4". The Promise.then callback is a microtask, and setTimeout is a macrotask. Microtasks always run before the next macrotask. So after sync code: microtask "3" runs, then macrotask "2". Final order: 1, 4, 3, 2.',
      },
      {
        id: 'promise-2',
        question: 'What is the output order?',
        codeSnippet: `async function foo() {
  console.log('A');
  await Promise.resolve();
  console.log('B');
}

console.log('C');
foo();
console.log('D');`,
        options: ['C, A, B, D', 'C, A, D, B', 'A, C, D, B', 'C, D, A, B'],
        correctIndex: 1,
        explanation: '"C" logs first (sync). Then `foo()` is called — "A" logs synchronously. The `await` pauses foo and schedules the continuation as a microtask. Control returns to the caller and "D" logs. After the current task finishes, the microtask runs and "B" logs. Order: C, A, D, B.',
      },
      {
        id: 'promise-3',
        question: 'What is the output order?',
        codeSnippet: `Promise.resolve()
  .then(() => {
    console.log('1');
    return Promise.resolve('2');
  })
  .then(val => console.log(val));

Promise.resolve()
  .then(() => console.log('3'))
  .then(() => console.log('4'))
  .then(() => console.log('5'));`,
        options: ['1, 2, 3, 4, 5', '1, 3, 4, 2, 5', '3, 1, 4, 5, 2', '1, 3, 2, 4, 5'],
        correctIndex: 1,
        explanation: 'Both promise chains start in the microtask queue. First tick: "1" and "3" log (first .then of each chain). Returning `Promise.resolve("2")` takes extra microtask ticks to unwrap. Second tick: "4" logs from chain 2, and the return promise starts unwrapping. Third tick: "2" logs (unwrapped), "5" logs from chain 2. Order: 1, 3, 4, 2, 5.',
      },
      {
        id: 'promise-4',
        question: 'What is the output order?',
        codeSnippet: `setTimeout(() => console.log('A'), 0);

const p = new Promise(resolve => {
  console.log('B');
  resolve();
});

p.then(() => console.log('C'));
console.log('D');`,
        options: ['B, D, C, A', 'A, B, D, C', 'B, C, D, A', 'D, B, C, A'],
        correctIndex: 0,
        explanation: 'The Promise executor runs synchronously, so "B" logs immediately. "D" logs next (sync). The promise .then callback is a microtask: "C". Finally, the setTimeout macrotask: "A". Order: B, D, C, A.',
      },
      {
        id: 'promise-5',
        question: 'What is the output order?',
        codeSnippet: `async function first() {
  console.log('1');
  await second();
  console.log('2');
}

async function second() {
  console.log('3');
  await third();
  console.log('4');
}

async function third() {
  console.log('5');
}

console.log('6');
first();
console.log('7');`,
        options: ['6, 1, 3, 5, 7, 4, 2', '6, 1, 3, 5, 4, 2, 7', '6, 7, 1, 3, 5, 4, 2', '1, 3, 5, 4, 2, 6, 7'],
        correctIndex: 0,
        explanation: '"6" logs (sync). `first()` is called: "1" logs (sync), then calls `second()`: "3" logs (sync), then calls `third()`: "5" logs (sync). `third` resoletes, but the awaits schedule continuations as microtasks. "7" logs (sync, back in top-level). Then microtasks run: `second` resumes logging "4", then `first` resumes logging "2". Order: 6, 1, 3, 5, 7, 4, 2.',
      },
      {
        id: 'promise-6',
        question: 'What is the output?',
        codeSnippet: `const promise = Promise.reject('error');

setTimeout(() => {
  promise.catch(e => console.log('caught:', e));
}, 0);`,
        options: ['caught: error', 'UnhandledPromiseRejection then caught: error', 'Nothing — catch is attached too late', 'TypeError — cannot catch after rejection'],
        correctIndex: 1,
        explanation: 'The promise is rejected immediately, but the .catch handler is not attached until the setTimeout callback runs (a macrotask later). Before that macrotask executes, the microtask queue is processed and Node/browsers detect an unhandled rejection. The .catch handler added later will still execute and log "caught: error", but the unhandled rejection warning has already fired.',
      },
      {
        id: 'promise-7',
        question: 'What is the output order?',
        codeSnippet: `console.log('start');

setTimeout(() => console.log('timeout1'), 0);
setTimeout(() => console.log('timeout2'), 0);

Promise.resolve()
  .then(() => {
    console.log('promise1');
    setTimeout(() => console.log('timeout3'), 0);
  })
  .then(() => console.log('promise2'));

console.log('end');`,
        options: [
          'start, end, promise1, promise2, timeout1, timeout2, timeout3',
          'start, end, timeout1, timeout2, promise1, promise2, timeout3',
          'start, end, promise1, timeout1, promise2, timeout2, timeout3',
          'start, promise1, end, promise2, timeout1, timeout2, timeout3',
        ],
        correctIndex: 0,
        explanation: 'Sync code: "start", "end". Then microtasks: "promise1" (schedules timeout3), "promise2". Then macrotasks in order: "timeout1", "timeout2", "timeout3". Microtasks always drain completely before the next macrotask, and macrotasks execute in the order they were scheduled.',
      },
      {
        id: 'promise-8',
        question: 'What is the output?',
        codeSnippet: `async function foo() {
  const result = await 42;
  console.log(result);
}

foo();
console.log('after');`,
        options: ['42, after', 'after, 42', '42', 'after'],
        correctIndex: 1,
        explanation: '`await 42` wraps 42 in Promise.resolve(42). The await pauses `foo` and schedules the continuation as a microtask. Execution returns to the top level and "after" logs synchronously. Then the microtask runs and "42" logs. Even awaiting a plain value introduces an async tick.',
      },
      {
        id: 'promise-9',
        question: 'What is the output?',
        codeSnippet: `Promise.all([
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.reject(3),
  Promise.resolve(4),
]).then(
  values => console.log('resolved:', values),
  error => console.log('rejected:', error)
);`,
        options: ['resolved: [1, 2, 3, 4]', 'rejected: 3', 'resolved: [1, 2, 4]', 'rejected: [3]'],
        correctIndex: 1,
        explanation: '`Promise.all` rejects as soon as any promise in the array rejects. It does not wait for the remaining promises to settle. The rejection value is the value of the first rejected promise (3). The .then error handler catches it, logging "rejected: 3".',
      },
      {
        id: 'promise-10',
        question: 'What is the output order?',
        codeSnippet: `queueMicrotask(() => console.log('micro1'));
setTimeout(() => console.log('macro1'), 0);
queueMicrotask(() => console.log('micro2'));
requestAnimationFrame(() => console.log('raf'));
console.log('sync');`,
        options: [
          'sync, micro1, micro2, raf, macro1',
          'sync, micro1, micro2, macro1, raf',
          'sync, macro1, micro1, micro2, raf',
          'micro1, micro2, sync, raf, macro1',
        ],
        correctIndex: 0,
        explanation: 'Synchronous code runs first: "sync". Then all microtasks drain: "micro1", "micro2". Next, requestAnimationFrame callbacks run before the browser paints (before regular macrotasks in the rendering cycle): "raf". Finally, the setTimeout macrotask: "macro1". Note: in Node.js where rAF is not available, the order of the last two may differ.',
      },
    ],
  },
  {
    id: 'ts-type-quiz',
    title: "What's the Type?",
    shortDescription: 'Predict TypeScript type inference and utility types',
    description: 'TypeScript\'s type system is powerful but can be surprising. This quiz tests your understanding of type inference, generics, utility types, conditional types, and other advanced TypeScript features. For each question, determine what type a variable or expression resolves to.',
    domain: 'ts',
    difficulty: 'advanced',
    targetKeywords: ['typescript type quiz', 'typescript interview', 'type inference', 'utility types', 'conditional types', 'generics quiz', 'typescript advanced'],
    estimatedTime: 12,
    questions: [
      {
        id: 'ts-type-1',
        question: 'What is the type of `result`?',
        codeSnippet: `const result = [1, 'hello', true];`,
        options: ['[number, string, boolean]', '(number | string | boolean)[]', 'Array<number | string | boolean>', 'Both B and C (equivalent)'],
        correctIndex: 3,
        explanation: 'TypeScript infers array literals as arrays with union element types, not tuples. The type is `(number | string | boolean)[]`, which is equivalent to `Array<number | string | boolean>`. To get a tuple type, you would need `[1, "hello", true] as const` or an explicit type annotation.',
      },
      {
        id: 'ts-type-2',
        question: 'What is the type of `x`?',
        codeSnippet: `const obj = { a: 1, b: 'hello' } as const;
type X = typeof obj;
let x: X['a'];`,
        options: ['number', '1', 'string | number', 'readonly 1'],
        correctIndex: 1,
        explanation: '`as const` creates a readonly literal type. `typeof obj` is `{ readonly a: 1; readonly b: "hello" }`. Indexing with `X["a"]` gives the literal type `1`, not the wider `number` type.',
      },
      {
        id: 'ts-type-3',
        question: 'What is the resulting type?',
        codeSnippet: `type Result = Exclude<
  'a' | 'b' | 'c' | 'd',
  'a' | 'c'
>;`,
        options: ['"a" | "c"', '"b" | "d"', '"a" | "b" | "c" | "d"', 'never'],
        correctIndex: 1,
        explanation: '`Exclude<T, U>` removes from T those types that are assignable to U. It distributes over the union: each member of the first union is checked — "a" is excluded, "b" stays, "c" is excluded, "d" stays. Result: "b" | "d".',
      },
      {
        id: 'ts-type-4',
        question: 'What is the type of `value`?',
        codeSnippet: `function identity<T>(arg: T): T {
  return arg;
}
const value = identity('hello');`,
        options: ['T', 'string', '"hello"', 'unknown'],
        correctIndex: 2,
        explanation: 'TypeScript infers the generic type T from the argument. When passing a string literal directly, TypeScript infers the literal type "hello" (not the wider string type). So the return type is also "hello". If the value were stored in a `let` variable first, it would widen to `string`.',
      },
      {
        id: 'ts-type-5',
        question: 'What is the resulting type?',
        codeSnippet: `type Flatten<T> = T extends Array<infer U> ? U : T;

type A = Flatten<string[]>;
type B = Flatten<number>;`,
        options: ['A = string[], B = number', 'A = string, B = number', 'A = string, B = never', 'A = unknown, B = number'],
        correctIndex: 1,
        explanation: '`Flatten<string[]>`: `string[]` extends `Array<infer U>` — yes, with U = string. So A = string. `Flatten<number>`: `number` extends `Array<infer U>` — no. So it takes the false branch: B = number.',
      },
      {
        id: 'ts-type-6',
        question: 'What is the type of `result`?',
        codeSnippet: `type Result = NonNullable<
  string | number | null | undefined
>;`,
        options: ['string | number | null | undefined', 'string | number | null', 'string | number', 'never'],
        correctIndex: 2,
        explanation: '`NonNullable<T>` removes `null` and `undefined` from a union type. It is defined as `T extends null | undefined ? never : T`. Distributing over the union: string stays, number stays, null becomes never, undefined becomes never. Result: string | number.',
      },
      {
        id: 'ts-type-7',
        question: 'Does this compile without error?',
        codeSnippet: `interface Dog {
  name: string;
  breed: string;
}

interface Animal {
  name: string;
}

const dog: Dog = { name: 'Rex', breed: 'Lab' };
const animal: Animal = dog;`,
        options: ['Error — Dog is not assignable to Animal', 'Compiles — Dog has all properties of Animal', 'Error — Animal is missing breed', 'Compiles — but only with type assertion'],
        correctIndex: 1,
        explanation: 'TypeScript uses structural typing, not nominal typing. Dog has all the properties required by Animal (namely, `name: string`), plus extra ones. A type with more properties is assignable to a type with fewer required properties. This is sometimes called "duck typing" — if it has a name, it is an Animal.',
      },
      {
        id: 'ts-type-8',
        question: 'What is the type of `keys`?',
        codeSnippet: `interface User {
  name: string;
  age: number;
  email: string;
}

type Keys = keyof User;`,
        options: ['"name" | "age" | "email"', 'string', 'string[]', '("name" | "age" | "email")[]'],
        correctIndex: 0,
        explanation: '`keyof T` produces a union of the literal string types of all property keys of T. For the User interface, `keyof User` is `"name" | "age" | "email"`. It is a union of string literal types, not an array and not just `string`.',
      },
      {
        id: 'ts-type-9',
        question: 'What is the resulting type?',
        codeSnippet: `type IsString<T> = T extends string ? 'yes' : 'no';

type A = IsString<string>;
type B = IsString<number>;
type C = IsString<'hello'>;`,
        options: [
          'A = "yes", B = "no", C = "no"',
          'A = "yes", B = "no", C = "yes"',
          'A = "yes", B = "yes", C = "yes"',
          'A = "no", B = "no", C = "yes"',
        ],
        correctIndex: 1,
        explanation: '`string extends string` is true → A = "yes". `number extends string` is false → B = "no". `"hello" extends string` is true (string literals extend string) → C = "yes".',
      },
      {
        id: 'ts-type-10',
        question: 'What is the type of `result`?',
        codeSnippet: `type Result = Pick<
  { a: string; b: number; c: boolean },
  'a' | 'c'
>;`,
        options: ['{ a: string; c: boolean }', '{ b: number }', '{ a: string; b: number; c: boolean }', 'string | boolean'],
        correctIndex: 0,
        explanation: '`Pick<T, K>` creates a new type by picking only the specified properties from T. `Pick<{ a: string; b: number; c: boolean }, "a" | "c">` produces `{ a: string; c: boolean }`. Only the properties whose keys are in the union are kept.',
      },
      {
        id: 'ts-type-11',
        question: 'What is the type of `value`?',
        codeSnippet: `function getValue(x: number): string;
function getValue(x: string): number;
function getValue(x: number | string): string | number {
  return typeof x === 'number' ? String(x) : x.length;
}

const value = getValue(42);`,
        options: ['string | number', 'string', 'number', '42'],
        correctIndex: 1,
        explanation: 'TypeScript resolves overloaded functions by matching the call against overload signatures in order. `getValue(42)` matches the first overload `(x: number): string`. The return type is `string`. The implementation signature is not visible to callers.',
      },
      {
        id: 'ts-type-12',
        question: 'What is the type of `result`?',
        codeSnippet: `type Result = ReturnType<
  (x: string, y: number) => boolean
>;`,
        options: ['(x: string, y: number) => boolean', 'boolean', '[string, number]', 'string | number | boolean'],
        correctIndex: 1,
        explanation: '`ReturnType<T>` extracts the return type of a function type. For `(x: string, y: number) => boolean`, the return type is `boolean`. Parameters are ignored by ReturnType.',
      },
      {
        id: 'ts-type-13',
        question: 'Is this assignment valid?',
        codeSnippet: `let x: unknown = 42;
let y: number = x;`,
        options: ['Valid — 42 is a number', 'Error — unknown is not assignable to number', 'Valid — unknown accepts any value', 'Error — cannot assign number to unknown'],
        correctIndex: 1,
        explanation: 'You can assign anything TO `unknown`, but you cannot assign `unknown` TO other types without narrowing first. `let x: unknown = 42` works fine. But `let y: number = x` fails because unknown is not assignable to number. You need a type guard: `if (typeof x === "number") { y = x; }`.',
      },
      {
        id: 'ts-type-14',
        question: 'What is the type of `result`?',
        codeSnippet: `type Readonly2<T> = { readonly [K in keyof T]: T[K] };

type Original = { name: string; age: number };
type Result = Readonly2<Original>;`,
        options: [
          '{ name: string; age: number }',
          '{ readonly name: string; readonly age: number }',
          '{ name: readonly string; age: readonly number }',
          'Readonly<{ name: string; age: number }>',
        ],
        correctIndex: 1,
        explanation: 'The mapped type iterates over each key K in Original and adds the `readonly` modifier. The result is `{ readonly name: string; readonly age: number }`. This is exactly what the built-in `Readonly<T>` utility type does.',
      },
      {
        id: 'ts-type-15',
        question: 'What is the type of `result`?',
        codeSnippet: `type StringOrNumber<T> = T extends string
  ? 'string'
  : T extends number
    ? 'number'
    : 'other';

type Result = StringOrNumber<string | number | boolean>;`,
        options: ['"string"', '"number"', '"string" | "number" | "other"', '"other"'],
        correctIndex: 2,
        explanation: 'Conditional types distribute over union types. Each member is evaluated separately: `StringOrNumber<string>` = "string", `StringOrNumber<number>` = "number", `StringOrNumber<boolean>` = "other". The result is the union: "string" | "number" | "other".',
      },
    ],
  },
  {
    id: 'big-o-quiz',
    title: "What's the Time Complexity?",
    shortDescription: 'Analyze algorithm performance with Big O notation',
    description: 'Knowing time complexity is essential for coding interviews. This quiz shows you algorithms and code patterns — your job is to determine the Big O time complexity. Covers loops, recursion, array methods, search algorithms, and common data structure operations.',
    domain: 'dsa',
    difficulty: 'intermediate',
    targetKeywords: ['big o quiz', 'time complexity quiz', 'algorithm complexity', 'coding interview', 'big o notation', 'data structures', 'algorithm analysis'],
    estimatedTime: 12,
    questions: [
      {
        id: 'bigo-1',
        question: 'What is the time complexity?',
        codeSnippet: `function sum(arr) {
  let total = 0;
  for (let i = 0; i < arr.length; i++) {
    total += arr[i];
  }
  return total;
}`,
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correctIndex: 2,
        explanation: 'The function iterates through each element of the array exactly once. The number of operations grows linearly with the input size. One loop over n elements = O(n).',
      },
      {
        id: 'bigo-2',
        question: 'What is the time complexity?',
        codeSnippet: `function hasDuplicate(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) return true;
    }
  }
  return false;
}`,
        options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'],
        correctIndex: 2,
        explanation: 'Two nested loops where both iterate up to n. The inner loop starts at i+1, so the total comparisons are n*(n-1)/2, which simplifies to O(n²). This is the brute-force approach; using a Set would give O(n).',
      },
      {
        id: 'bigo-3',
        question: 'What is the time complexity?',
        codeSnippet: `function binarySearch(arr, target) {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        correctIndex: 1,
        explanation: 'Binary search halves the search space in each iteration. Starting with n elements: n → n/2 → n/4 → ... → 1. The number of steps is log₂(n). This gives O(log n) time complexity.',
      },
      {
        id: 'bigo-4',
        question: 'What is the time complexity?',
        codeSnippet: `function printPairs(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      console.log(arr[i], arr[j]);
    }
  }
}`,
        options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(n³)'],
        correctIndex: 2,
        explanation: 'Two nested loops, each iterating over all n elements. For each of the n iterations of the outer loop, the inner loop runs n times. Total operations: n × n = n². Time complexity: O(n²).',
      },
      {
        id: 'bigo-5',
        question: 'What is the time complexity?',
        codeSnippet: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`,
        options: ['O(n)', 'O(n²)', 'O(2ⁿ)', 'O(n log n)'],
        correctIndex: 2,
        explanation: 'Each call branches into two recursive calls, forming a binary tree of calls. The depth is n, and the number of nodes roughly doubles at each level. This gives approximately 2ⁿ total calls. The exact complexity is O(φⁿ) where φ ≈ 1.618 (the golden ratio), but it is commonly expressed as O(2ⁿ).',
      },
      {
        id: 'bigo-6',
        question: 'What is the time complexity?',
        codeSnippet: `function findInHashMap(map, key) {
  return map.get(key);
}`,
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        correctIndex: 0,
        explanation: 'Hash map (Map/Object) lookups are O(1) average case. The key is hashed to compute the index directly. While worst-case can be O(n) due to hash collisions, the average and amortized time is constant.',
      },
      {
        id: 'bigo-7',
        question: 'What is the time complexity?',
        codeSnippet: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(a, b) {
  const result = [];
  let i = 0, j = 0;
  while (i < a.length && j < b.length) {
    result.push(a[i] < b[j] ? a[i++] : b[j++]);
  }
  return [...result, ...a.slice(i), ...b.slice(j)];
}`,
        options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
        correctIndex: 1,
        explanation: 'Merge sort divides the array in half (log n levels of recursion) and at each level, merges all elements (O(n) work per level). Total: O(n) work × O(log n) levels = O(n log n). This is optimal for comparison-based sorting.',
      },
      {
        id: 'bigo-8',
        question: 'What is the time complexity of the entire snippet?',
        codeSnippet: `const arr = [3, 1, 4, 1, 5, 9];
arr.sort((a, b) => a - b);
const idx = arr.indexOf(5);`,
        options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
        correctIndex: 1,
        explanation: '`arr.sort()` is O(n log n). `arr.indexOf()` is O(n) — linear scan. The total is O(n log n) + O(n) = O(n log n), since n log n dominates n. The bottleneck is the sort step.',
      },
      {
        id: 'bigo-9',
        question: 'What is the time complexity?',
        codeSnippet: `function foo(n) {
  for (let i = 1; i < n; i *= 2) {
    console.log(i);
  }
}`,
        options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(√n)'],
        correctIndex: 1,
        explanation: 'The loop variable `i` doubles each iteration: 1, 2, 4, 8, 16, ... until it exceeds n. The number of iterations is log₂(n). Time complexity: O(log n).',
      },
      {
        id: 'bigo-10',
        question: 'What is the time complexity?',
        codeSnippet: `function twoSum(arr, target) {
  const seen = new Set();
  for (const num of arr) {
    if (seen.has(target - num)) return true;
    seen.add(num);
  }
  return false;
}`,
        options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n²)'],
        correctIndex: 1,
        explanation: 'One pass through the array (O(n)), with O(1) Set.has and Set.add operations per iteration. Total: O(n). This is the optimal approach compared to the O(n²) nested-loop brute force.',
      },
      {
        id: 'bigo-11',
        question: 'What is the time complexity?',
        codeSnippet: `function outer(n) {
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      for (let k = 0; k < n; k++) {
        console.log(i, j, k);
      }
    }
  }
}`,
        options: ['O(n)', 'O(n²)', 'O(n³)', 'O(3n)'],
        correctIndex: 2,
        explanation: 'Three nested loops, each running n times. The innermost statement executes n × n × n = n³ times. Time complexity: O(n³).',
      },
      {
        id: 'bigo-12',
        question: 'What is the time complexity?',
        codeSnippet: `function mystery(arr) {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < 10; j++) {
      console.log(arr[i]);
    }
  }
}`,
        options: ['O(n)', 'O(10n)', 'O(n²)', 'O(n log n)'],
        correctIndex: 0,
        explanation: 'The inner loop runs a fixed 10 times regardless of input size. Constants are dropped in Big O notation. The outer loop runs n times, and 10 is a constant multiplier: O(10n) = O(n). The time complexity is linear.',
      },
      {
        id: 'bigo-13',
        question: 'What is the time complexity of Array.prototype.includes?',
        codeSnippet: `const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const found = arr.includes(7);`,
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correctIndex: 2,
        explanation: '`Array.includes()` performs a linear scan from the beginning of the array. In the worst case, it checks every element before finding the target or reaching the end. Time complexity: O(n). For O(1) lookups, use a Set instead.',
      },
      {
        id: 'bigo-14',
        question: 'What is the space complexity?',
        codeSnippet: `function reverseArray(arr) {
  const result = [];
  for (let i = arr.length - 1; i >= 0; i--) {
    result.push(arr[i]);
  }
  return result;
}`,
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correctIndex: 2,
        explanation: 'The function creates a new array `result` that holds all n elements of the input. The space used grows linearly with input size. Space complexity: O(n). An in-place reversal using two pointers would be O(1) space.',
      },
      {
        id: 'bigo-15',
        question: 'What is the time complexity?',
        codeSnippet: `function buildMatrix(n) {
  const matrix = [];
  for (let i = 0; i < n; i++) {
    matrix[i] = [];
    for (let j = 0; j < n; j++) {
      matrix[i][j] = i * n + j;
    }
  }
  return matrix;
}`,
        options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'],
        correctIndex: 2,
        explanation: 'Two nested loops each running n times. Total operations: n × n = n². This creates an n×n matrix, so both time and space complexity are O(n²).',
      },
    ],
  },
]

export function getQuizById(id: string): Quiz | undefined {
  return quizzes.find(q => q.id === id)
}
