export interface ChallengeTest {
  description: string
  testCode: string
}

export interface ReactChallenge {
  id: string
  title: string
  difficulty: 'easy' | 'medium' | 'hard'
  description: string
  shortDescription: string
  skills: string[]
  starterCode: string
  solutionCode: string
  tests: ChallengeTest[]
  hints: string[]
  estimatedTime: number
}

export const reactChallenges: ReactChallenge[] = [
  // ==========================================================================
  // EASY CHALLENGES
  // ==========================================================================
  {
    id: 'build-counter',
    title: 'Build a Counter',
    difficulty: 'easy',
    description:
      'Build a simple counter component with increment, decrement, and reset buttons. The counter should display the current count and update when any button is clicked. This is the classic first exercise for learning useState.',
    shortDescription: 'A counter with increment, decrement, and reset',
    skills: ['useState', 'event handling'],
    estimatedTime: 10,
    starterCode: `import { useState } from 'react'

export function Counter() {
  // TODO: Create a state variable for the count

  // TODO: Implement increment, decrement, and reset handlers

  return (
    <div>
      <h2>Counter</h2>
      {/* TODO: Display the current count */}
      {/* TODO: Add increment, decrement, and reset buttons */}
    </div>
  )
}`,
    solutionCode: `import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)

  const increment = () => setCount((prev) => prev + 1)
  const decrement = () => setCount((prev) => prev - 1)
  const reset = () => setCount(0)

  return (
    <div>
      <h2>Counter</h2>
      <p data-testid="count">{count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
      <button onClick={reset}>Reset</button>
    </div>
  )
}`,
    tests: [
      {
        description: 'Renders with initial count of 0',
        testCode: 'The counter displays "0" on initial render',
      },
      {
        description: 'Increments the count when clicking Increment',
        testCode: 'Clicking "Increment" changes display from "0" to "1"',
      },
      {
        description: 'Decrements the count when clicking Decrement',
        testCode: 'Clicking "Decrement" changes display from "0" to "-1"',
      },
      {
        description: 'Resets the count when clicking Reset',
        testCode:
          'After incrementing to "3", clicking "Reset" returns display to "0"',
      },
    ],
    hints: [
      'Use useState(0) to initialize a count state variable',
      'Use the functional updater form: setCount(prev => prev + 1) to avoid stale closures',
      'Attach onClick handlers to each button',
    ],
  },
  {
    id: 'build-toggle',
    title: 'Build a Toggle',
    difficulty: 'easy',
    description:
      'Build a toggle switch component that alternates between ON and OFF states. The toggle should visually indicate its current state and change when clicked. Practice boolean state management and conditional rendering.',
    shortDescription: 'A toggle switch with ON/OFF states',
    skills: ['useState', 'conditional rendering'],
    estimatedTime: 10,
    starterCode: `import { useState } from 'react'

export function Toggle() {
  // TODO: Create a boolean state for the toggle

  // TODO: Implement the toggle handler

  return (
    <div>
      <h2>Toggle</h2>
      {/* TODO: Display ON or OFF based on state */}
      {/* TODO: Add a toggle button */}
      {/* TODO: Style the indicator based on state */}
    </div>
  )
}`,
    solutionCode: `import { useState } from 'react'

export function Toggle() {
  const [isOn, setIsOn] = useState(false)

  const toggle = () => setIsOn((prev) => !prev)

  return (
    <div>
      <h2>Toggle</h2>
      <p data-testid="status">{isOn ? 'ON' : 'OFF'}</p>
      <button onClick={toggle}>
        {isOn ? 'Turn Off' : 'Turn On'}
      </button>
      <div
        data-testid="indicator"
        style={{
          width: 60,
          height: 30,
          borderRadius: 15,
          backgroundColor: isOn ? '#34d399' : '#64748b',
          transition: 'background-color 0.3s',
          cursor: 'pointer',
        }}
        onClick={toggle}
      />
    </div>
  )
}`,
    tests: [
      {
        description: 'Renders with initial state OFF',
        testCode: 'The toggle displays "OFF" on initial render',
      },
      {
        description: 'Toggles to ON when clicked',
        testCode: 'Clicking the button changes display from "OFF" to "ON"',
      },
      {
        description: 'Toggles back to OFF when clicked again',
        testCode:
          'Clicking the button twice returns display to "OFF"',
      },
      {
        description: 'Button label reflects the current state',
        testCode:
          'When OFF, button says "Turn On"; when ON, button says "Turn Off"',
      },
    ],
    hints: [
      'Use useState(false) for a boolean toggle state',
      'Use the ternary operator for conditional rendering: isOn ? "ON" : "OFF"',
      'Use the functional updater: setIsOn(prev => !prev) to flip the state',
    ],
  },
  {
    id: 'build-character-count',
    title: 'Build a Character Counter',
    difficulty: 'easy',
    description:
      'Build a textarea with a live character counter that shows how many characters have been typed and how many remain before reaching a maximum limit. The counter should change color when approaching or exceeding the limit.',
    shortDescription: 'Textarea with live character count and limit',
    skills: ['useState', 'controlled inputs', 'derived state'],
    estimatedTime: 12,
    starterCode: `import { useState } from 'react'

const MAX_CHARS = 150

export function CharacterCount() {
  // TODO: Create state for the text input

  // TODO: Derive remaining character count

  // TODO: Determine warning/error state based on remaining chars

  return (
    <div>
      <h2>Character Counter</h2>
      {/* TODO: Add a controlled textarea */}
      {/* TODO: Display character count like "0 / 150" */}
      {/* TODO: Change style when near or over the limit */}
    </div>
  )
}`,
    solutionCode: `import { useState } from 'react'

const MAX_CHARS = 150

export function CharacterCount() {
  const [text, setText] = useState('')

  const remaining = MAX_CHARS - text.length
  const isWarning = remaining <= 20 && remaining > 0
  const isOver = remaining < 0

  const counterColor = isOver
    ? '#fb7185'
    : isWarning
      ? '#fbbf24'
      : '#94a3b8'

  return (
    <div>
      <h2>Character Counter</h2>
      <textarea
        data-testid="textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        placeholder="Type something..."
        style={{ width: '100%', resize: 'vertical' }}
      />
      <p
        data-testid="counter"
        style={{ color: counterColor, textAlign: 'right' }}
      >
        {text.length} / {MAX_CHARS}
      </p>
    </div>
  )
}`,
    tests: [
      {
        description: 'Renders with empty textarea and "0 / 150" count',
        testCode: 'Initial render shows "0 / 150" in the counter',
      },
      {
        description: 'Updates character count as user types',
        testCode: 'Typing "hello" changes counter to "5 / 150"',
      },
      {
        description: 'Shows warning color when near the limit',
        testCode:
          'Counter changes to yellow when 130+ characters are typed (<=20 remaining)',
      },
      {
        description: 'Shows error color when over the limit',
        testCode:
          'Counter changes to red when more than 150 characters are typed',
      },
    ],
    hints: [
      'Use useState("") and a controlled textarea with value and onChange',
      'Derive remaining = MAX_CHARS - text.length (no extra state needed)',
      'Use conditional styling based on remaining count thresholds',
    ],
  },
  {
    id: 'build-accordion',
    title: 'Build an Accordion',
    difficulty: 'easy',
    description:
      'Build an accordion component where clicking a section header expands or collapses its content. Only one section should be open at a time. This tests your ability to manage state that controls which item is active.',
    shortDescription: 'Expandable sections with single-open behavior',
    skills: ['useState', 'conditional rendering', 'lists'],
    estimatedTime: 15,
    starterCode: `import { useState } from 'react'

const sections = [
  { id: 'section-1', title: 'What is React?', content: 'React is a JavaScript library for building user interfaces. It lets you compose complex UIs from small, isolated pieces of code called components.' },
  { id: 'section-2', title: 'What are hooks?', content: 'Hooks are functions that let you use state and other React features without writing a class. useState and useEffect are the most common hooks.' },
  { id: 'section-3', title: 'What is JSX?', content: 'JSX is a syntax extension for JavaScript that looks similar to HTML. It produces React elements that describe what the UI should look like.' },
]

export function Accordion() {
  // TODO: Track which section is currently open (by id or index)

  // TODO: Implement toggle handler

  return (
    <div>
      <h2>Accordion</h2>
      {/* TODO: Render each section with a clickable header */}
      {/* TODO: Show content only for the active section */}
    </div>
  )
}`,
    solutionCode: `import { useState } from 'react'

const sections = [
  { id: 'section-1', title: 'What is React?', content: 'React is a JavaScript library for building user interfaces. It lets you compose complex UIs from small, isolated pieces of code called components.' },
  { id: 'section-2', title: 'What are hooks?', content: 'Hooks are functions that let you use state and other React features without writing a class. useState and useEffect are the most common hooks.' },
  { id: 'section-3', title: 'What is JSX?', content: 'JSX is a syntax extension for JavaScript that looks similar to HTML. It produces React elements that describe what the UI should look like.' },
]

export function Accordion() {
  const [activeId, setActiveId] = useState<string | null>(null)

  const toggle = (id: string) => {
    setActiveId((prev) => (prev === id ? null : id))
  }

  return (
    <div>
      <h2>Accordion</h2>
      {sections.map((section) => (
        <div key={section.id} data-testid={\`section-\${section.id}\`}>
          <button
            onClick={() => toggle(section.id)}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            {section.title}
            <span style={{ float: 'right' }}>
              {activeId === section.id ? '−' : '+'}
            </span>
          </button>
          {activeId === section.id && (
            <div data-testid={\`content-\${section.id}\`} style={{ padding: '12px' }}>
              {section.content}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}`,
    tests: [
      {
        description: 'Renders all section headers',
        testCode:
          'All three section titles are visible: "What is React?", "What are hooks?", "What is JSX?"',
      },
      {
        description: 'No content is visible initially',
        testCode: 'No section content is displayed on initial render',
      },
      {
        description: 'Clicking a header opens its content',
        testCode:
          'Clicking "What is React?" reveals the React description content',
      },
      {
        description: 'Clicking an open header closes it',
        testCode:
          'Clicking "What is React?" again hides the React description',
      },
      {
        description: 'Only one section is open at a time',
        testCode:
          'Opening "What are hooks?" while "What is React?" is open closes the first section',
      },
    ],
    hints: [
      'Track the active section id with useState<string | null>(null)',
      'Toggle by checking: if activeId === clickedId, set to null; otherwise set to clickedId',
      'Use conditional rendering: activeId === section.id && <content>',
    ],
  },
  {
    id: 'build-tabs',
    title: 'Build Tabs',
    difficulty: 'easy',
    description:
      'Build a tabbed interface where clicking a tab header shows its corresponding content panel. The active tab should be visually highlighted. This exercise focuses on indexed state management and rendering different content based on state.',
    shortDescription: 'Tabbed interface with content switching',
    skills: ['useState', 'event handling', 'conditional rendering'],
    estimatedTime: 12,
    starterCode: `import { useState } from 'react'

const tabs = [
  { label: 'HTML', content: 'HTML (HyperText Markup Language) is the standard markup language for documents designed to be displayed in a web browser.' },
  { label: 'CSS', content: 'CSS (Cascading Style Sheets) describes how HTML elements are to be displayed on screen. It handles layout, colors, and fonts.' },
  { label: 'JavaScript', content: 'JavaScript is a programming language that enables interactive web pages. It is an essential part of web applications.' },
]

export function Tabs() {
  // TODO: Track the active tab index

  return (
    <div>
      <h2>Tabs</h2>
      {/* TODO: Render tab buttons in a row */}
      {/* TODO: Highlight the active tab */}
      {/* TODO: Render the content for the active tab */}
    </div>
  )
}`,
    solutionCode: `import { useState } from 'react'

const tabs = [
  { label: 'HTML', content: 'HTML (HyperText Markup Language) is the standard markup language for documents designed to be displayed in a web browser.' },
  { label: 'CSS', content: 'CSS (Cascading Style Sheets) describes how HTML elements are to be displayed on screen. It handles layout, colors, and fonts.' },
  { label: 'JavaScript', content: 'JavaScript is a programming language that enables interactive web pages. It is an essential part of web applications.' },
]

export function Tabs() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div>
      <h2>Tabs</h2>
      <div style={{ display: 'flex', gap: '4px' }}>
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            data-testid={\`tab-\${index}\`}
            onClick={() => setActiveIndex(index)}
            style={{
              padding: '8px 16px',
              cursor: 'pointer',
              backgroundColor: activeIndex === index ? '#38bdf8' : 'transparent',
              color: activeIndex === index ? '#0a0a0f' : '#94a3b8',
              border: 'none',
              borderRadius: '4px 4px 0 0',
              fontWeight: activeIndex === index ? 'bold' : 'normal',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        data-testid="tab-content"
        style={{
          padding: '16px',
          border: '1px solid #333',
          borderRadius: '0 4px 4px 4px',
        }}
      >
        {tabs[activeIndex].content}
      </div>
    </div>
  )
}`,
    tests: [
      {
        description: 'Renders all tab labels',
        testCode: 'All three tab buttons are visible: "HTML", "CSS", "JavaScript"',
      },
      {
        description: 'First tab is active by default',
        testCode: 'The HTML tab is highlighted and HTML content is displayed on initial render',
      },
      {
        description: 'Clicking a tab shows its content',
        testCode: 'Clicking "CSS" tab displays the CSS description',
      },
      {
        description: 'Active tab is visually highlighted',
        testCode: 'The active tab has a different background color than inactive tabs',
      },
    ],
    hints: [
      'Use useState(0) to track the active tab by index',
      'Map over the tabs array to render buttons, using index to compare with activeIndex',
      'Render tabs[activeIndex].content for the current panel',
    ],
  },

  // ==========================================================================
  // MEDIUM CHALLENGES
  // ==========================================================================
  {
    id: 'build-todo-list',
    title: 'Build a Todo List',
    difficulty: 'medium',
    description:
      'Build a fully functional todo list with the ability to add, toggle completion, and delete items. Each todo should show its text with a checkbox for completion status and a delete button. This exercise tests managing an array of objects in state.',
    shortDescription: 'Add, complete, and delete todo items',
    skills: ['useState', 'array state', 'forms', 'event handling'],
    estimatedTime: 20,
    starterCode: `import { useState } from 'react'

interface Todo {
  id: number
  text: string
  completed: boolean
}

export function TodoList() {
  // TODO: Create state for the list of todos
  // TODO: Create state for the input field

  // TODO: Implement addTodo - add a new todo from the input

  // TODO: Implement toggleTodo - toggle completed status

  // TODO: Implement deleteTodo - remove a todo by id

  return (
    <div>
      <h2>Todo List</h2>
      {/* TODO: Add a form with input and submit button */}
      {/* TODO: Render the list of todos */}
      {/* TODO: Each todo should have a checkbox, text, and delete button */}
    </div>
  )
}`,
    solutionCode: `import { useState } from 'react'

interface Todo {
  id: number
  text: string
  completed: boolean
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState('')

  const addTodo = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    setTodos((prev) => [
      ...prev,
      { id: Date.now(), text: trimmed, completed: false },
    ])
    setInput('')
  }

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addTodo()
  }

  return (
    <div>
      <h2>Todo List</h2>
      <form onSubmit={handleSubmit}>
        <input
          data-testid="todo-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a todo..."
        />
        <button type="submit">Add</button>
      </form>
      <ul data-testid="todo-list" style={{ listStyle: 'none', padding: 0 }}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            data-testid={\`todo-\${todo.id}\`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 0',
            }}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span
              style={{
                flex: 1,
                textDecoration: todo.completed ? 'line-through' : 'none',
                opacity: todo.completed ? 0.5 : 1,
              }}
            >
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <p data-testid="todo-count">
        {todos.filter((t) => !t.completed).length} items remaining
      </p>
    </div>
  )
}`,
    tests: [
      {
        description: 'Renders with an empty todo list',
        testCode: 'Initial render shows no todo items and "0 items remaining"',
      },
      {
        description: 'Adds a new todo when submitting the form',
        testCode: 'Typing "Buy groceries" and clicking Add displays the todo in the list',
      },
      {
        description: 'Toggles a todo as completed',
        testCode: 'Clicking a todo checkbox applies line-through styling and updates remaining count',
      },
      {
        description: 'Deletes a todo',
        testCode: 'Clicking "Delete" removes the todo from the list',
      },
      {
        description: 'Does not add empty todos',
        testCode: 'Submitting with an empty input does not add any item',
      },
    ],
    hints: [
      'Use two state variables: useState<Todo[]>([]) for todos and useState("") for the input',
      'Generate unique ids with Date.now(). Use the spread operator to add: [...prev, newTodo]',
      'Use array .map() with spread to toggle: prev.map(t => t.id === id ? {...t, completed: !t.completed} : t)',
    ],
  },
  {
    id: 'build-debounced-search',
    title: 'Build a Debounced Search',
    difficulty: 'medium',
    description:
      'Build a search input that debounces user keystrokes, only triggering a search after the user stops typing for 300ms. Display a list of filtered results and a loading indicator while the debounce timer is active. This teaches effect cleanup and timer management.',
    shortDescription: 'Search input with 300ms debounce delay',
    skills: ['useState', 'useEffect', 'debouncing', 'cleanup'],
    estimatedTime: 20,
    starterCode: `import { useState, useEffect } from 'react'

const ALL_ITEMS = [
  'JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue',
  'Angular', 'Svelte', 'Node.js', 'Express', 'Python',
  'Django', 'Flask', 'Ruby', 'Rails', 'Go',
  'Rust', 'Kotlin', 'Swift', 'Flutter', 'Docker',
]

export function DebouncedSearch() {
  // TODO: Create state for search query, debounced query, and results

  // TODO: Set up a useEffect that debounces the search query
  // Hint: use setTimeout and return a cleanup function

  // TODO: Filter items based on the debounced query

  return (
    <div>
      <h2>Debounced Search</h2>
      {/* TODO: Add a search input */}
      {/* TODO: Show a "Searching..." indicator when debouncing */}
      {/* TODO: Display the filtered results */}
    </div>
  )
}`,
    solutionCode: `import { useState, useEffect } from 'react'

const ALL_ITEMS = [
  'JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue',
  'Angular', 'Svelte', 'Node.js', 'Express', 'Python',
  'Django', 'Flask', 'Ruby', 'Rails', 'Go',
  'Rust', 'Kotlin', 'Swift', 'Flutter', 'Docker',
]

export function DebouncedSearch() {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [isDebouncing, setIsDebouncing] = useState(false)

  useEffect(() => {
    if (query === '') {
      setDebouncedQuery('')
      setIsDebouncing(false)
      return
    }

    setIsDebouncing(true)
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
      setIsDebouncing(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const results = debouncedQuery
    ? ALL_ITEMS.filter((item) =>
        item.toLowerCase().includes(debouncedQuery.toLowerCase())
      )
    : ALL_ITEMS

  return (
    <div>
      <h2>Debounced Search</h2>
      <input
        data-testid="search-input"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search technologies..."
      />
      {isDebouncing && (
        <p data-testid="searching-indicator">Searching...</p>
      )}
      <p data-testid="result-count">{results.length} results</p>
      <ul data-testid="results-list">
        {results.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}`,
    tests: [
      {
        description: 'Shows all items initially',
        testCode: 'All 20 items are displayed when no search query is entered',
      },
      {
        description: 'Shows "Searching..." indicator while debouncing',
        testCode: 'After typing, a "Searching..." indicator appears before results update',
      },
      {
        description: 'Filters results after debounce delay',
        testCode: 'Typing "react" and waiting 300ms shows only "React" in results',
      },
      {
        description: 'Clears results when input is cleared',
        testCode: 'Clearing the input shows all items again',
      },
    ],
    hints: [
      'Use separate state for query (immediate) and debouncedQuery (delayed)',
      'In useEffect, use setTimeout to set the debounced value after 300ms',
      'Return a cleanup function: return () => clearTimeout(timer)',
    ],
  },
  {
    id: 'build-infinite-scroll',
    title: 'Build Infinite Scroll',
    difficulty: 'medium',
    description:
      'Build an infinite scroll component that loads more items when the user scrolls near the bottom. Simulate an API call that returns paginated data. Show a loading spinner during data fetches and a message when all data is loaded.',
    shortDescription: 'Load more items on scroll with pagination',
    skills: ['useState', 'useEffect', 'useRef', 'scroll events', 'pagination'],
    estimatedTime: 25,
    starterCode: `import { useState, useEffect, useRef, useCallback } from 'react'

function generateItems(page: number, pageSize: number): string[] {
  const start = (page - 1) * pageSize
  return Array.from({ length: pageSize }, (_, i) => \`Item \${start + i + 1}\`)
}

const TOTAL_ITEMS = 100
const PAGE_SIZE = 20

export function InfiniteScroll() {
  // TODO: Create state for items, current page, loading, and hasMore

  // TODO: Implement loadMore function that simulates an API call
  // Hint: use setTimeout to simulate a delay

  // TODO: Set up a scroll event listener or IntersectionObserver
  // to detect when user scrolls near the bottom

  // TODO: Load the first page on mount

  return (
    <div>
      <h2>Infinite Scroll</h2>
      {/* TODO: Render the list of items */}
      {/* TODO: Show a loading spinner when fetching */}
      {/* TODO: Show "All items loaded" when done */}
    </div>
  )
}`,
    solutionCode: `import { useState, useEffect, useRef, useCallback } from 'react'

function generateItems(page: number, pageSize: number): string[] {
  const start = (page - 1) * pageSize
  return Array.from({ length: pageSize }, (_, i) => \`Item \${start + i + 1}\`)
}

const TOTAL_ITEMS = 100
const PAGE_SIZE = 20

export function InfiniteScroll() {
  const [items, setItems] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return
    setLoading(true)

    setTimeout(() => {
      const newItems = generateItems(page, PAGE_SIZE)
      setItems((prev) => [...prev, ...newItems])
      setHasMore(page * PAGE_SIZE < TOTAL_ITEMS)
      setPage((prev) => prev + 1)
      setLoading(false)
    }, 500)
  }, [page, loading, hasMore])

  useEffect(() => {
    loadMore()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [loadMore])

  return (
    <div>
      <h2>Infinite Scroll</h2>
      <div
        data-testid="scroll-container"
        style={{ maxHeight: 400, overflowY: 'auto' }}
      >
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {items.map((item, index) => (
            <li
              key={index}
              data-testid={\`item-\${index}\`}
              style={{ padding: '12px', borderBottom: '1px solid #333' }}
            >
              {item}
            </li>
          ))}
        </ul>
        {loading && <p data-testid="loading">Loading more items...</p>}
        {!hasMore && <p data-testid="all-loaded">All items loaded</p>}
        {hasMore && <div ref={sentinelRef} style={{ height: 1 }} />}
      </div>
    </div>
  )
}`,
    tests: [
      {
        description: 'Loads the first page on mount',
        testCode: 'After initial render, 20 items are displayed',
      },
      {
        description: 'Shows loading indicator while fetching',
        testCode: 'A "Loading more items..." message appears during data fetch',
      },
      {
        description: 'Loads more items when scrolling to the bottom',
        testCode: 'Scrolling to the bottom triggers loading of the next 20 items',
      },
      {
        description: 'Shows "All items loaded" when no more data',
        testCode: 'After loading all 100 items, "All items loaded" message appears',
      },
    ],
    hints: [
      'Use IntersectionObserver on a sentinel element at the bottom of the list',
      'Track loading state to prevent duplicate fetches',
      'Use useCallback for loadMore to avoid stale closures in the observer',
    ],
  },
  {
    id: 'build-modal',
    title: 'Build a Modal',
    difficulty: 'medium',
    description:
      'Build a reusable modal dialog component. The modal should render as an overlay on top of the page content, close when clicking the backdrop or pressing Escape, and trap focus within the modal for accessibility. Prevent body scroll when the modal is open.',
    shortDescription: 'Accessible modal with backdrop and keyboard support',
    skills: ['useState', 'useEffect', 'event listeners', 'portals'],
    estimatedTime: 20,
    starterCode: `import { useState, useEffect, useRef } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

function Modal({ isOpen, onClose, title, children }: ModalProps) {
  // TODO: Set up an Escape key listener that calls onClose

  // TODO: Prevent body scroll when modal is open

  // TODO: If not open, return null

  return (
    <>
      {/* TODO: Render backdrop overlay */}
      {/* TODO: Render modal content with title, children, and close button */}
    </>
  )
}

export function ModalDemo() {
  // TODO: Create state to control modal visibility

  return (
    <div>
      <h2>Modal</h2>
      {/* TODO: Add a button to open the modal */}
      {/* TODO: Render the Modal component */}
    </div>
  )
}`,
    solutionCode: `import { useState, useEffect, useRef } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      data-testid="modal-backdrop"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        ref={modalRef}
        data-testid="modal-content"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#1c1c26',
          borderRadius: '8px',
          padding: '24px',
          minWidth: '400px',
          maxWidth: '90vw',
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button
            data-testid="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function ModalDemo() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <h2>Modal</h2>
      <button
        data-testid="open-modal"
        onClick={() => setIsOpen(true)}
      >
        Open Modal
      </button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Example Modal"
      >
        <p>This is the modal content. Press Escape or click outside to close.</p>
        <button onClick={() => setIsOpen(false)}>Got it</button>
      </Modal>
    </div>
  )
}`,
    tests: [
      {
        description: 'Modal is not visible initially',
        testCode: 'No modal backdrop or content is rendered on initial load',
      },
      {
        description: 'Opens when the trigger button is clicked',
        testCode: 'Clicking "Open Modal" renders the modal with title "Example Modal"',
      },
      {
        description: 'Closes when clicking the close button',
        testCode: 'Clicking the close (✕) button removes the modal from the DOM',
      },
      {
        description: 'Closes when clicking the backdrop',
        testCode: 'Clicking the backdrop overlay closes the modal',
      },
      {
        description: 'Closes when pressing Escape',
        testCode: 'Pressing the Escape key closes the modal',
      },
    ],
    hints: [
      'Use useEffect to add and remove a keydown event listener for Escape',
      'Use e.stopPropagation() on the modal content to prevent backdrop clicks from closing when clicking inside',
      'Set document.body.style.overflow = "hidden" when open, and clean it up on close',
    ],
  },
  {
    id: 'build-form-validation',
    title: 'Build Form Validation',
    difficulty: 'medium',
    description:
      'Build a registration form with real-time field validation. The form should validate email format, password strength (min 8 chars, uppercase, lowercase, number), and password confirmation match. Show inline error messages and disable the submit button until all fields are valid.',
    shortDescription: 'Registration form with real-time validation',
    skills: ['useState', 'forms', 'validation', 'derived state'],
    estimatedTime: 25,
    starterCode: `import { useState } from 'react'

interface FormData {
  email: string
  password: string
  confirmPassword: string
}

interface FormErrors {
  email?: string
  password?: string
  confirmPassword?: string
}

export function FormValidation() {
  // TODO: Create state for form data and errors

  // TODO: Implement validation logic for each field
  // - Email: must match a basic email pattern
  // - Password: min 8 chars, must contain uppercase, lowercase, and number
  // - Confirm Password: must match password

  // TODO: Implement onChange handlers that validate on change

  // TODO: Implement form submission handler

  return (
    <div>
      <h2>Registration Form</h2>
      {/* TODO: Build a form with email, password, and confirm password fields */}
      {/* TODO: Show inline error messages for each field */}
      {/* TODO: Disable submit button until form is valid */}
    </div>
  )
}`,
    solutionCode: `import { useState } from 'react'

interface FormData {
  email: string
  password: string
  confirmPassword: string
}

interface FormErrors {
  email?: string
  password?: string
  confirmPassword?: string
}

function validateEmail(email: string): string | undefined {
  if (!email) return 'Email is required'
  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) return 'Invalid email format'
  return undefined
}

function validatePassword(password: string): string | undefined {
  if (!password) return 'Password is required'
  if (password.length < 8) return 'Must be at least 8 characters'
  if (!/[A-Z]/.test(password)) return 'Must contain an uppercase letter'
  if (!/[a-z]/.test(password)) return 'Must contain a lowercase letter'
  if (!/[0-9]/.test(password)) return 'Must contain a number'
  return undefined
}

function validateConfirmPassword(
  password: string,
  confirmPassword: string
): string | undefined {
  if (!confirmPassword) return 'Please confirm your password'
  if (password !== confirmPassword) return 'Passwords do not match'
  return undefined
}

export function FormValidation() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (field: keyof FormData, value: string) => {
    const next = { ...formData, [field]: value }
    setFormData(next)

    const nextErrors: FormErrors = { ...errors }
    if (field === 'email') {
      nextErrors.email = validateEmail(value)
    } else if (field === 'password') {
      nextErrors.password = validatePassword(value)
      if (next.confirmPassword) {
        nextErrors.confirmPassword = validateConfirmPassword(value, next.confirmPassword)
      }
    } else if (field === 'confirmPassword') {
      nextErrors.confirmPassword = validateConfirmPassword(next.password, value)
    }
    setErrors(nextErrors)
  }

  const isValid =
    formData.email !== '' &&
    formData.password !== '' &&
    formData.confirmPassword !== '' &&
    !validateEmail(formData.email) &&
    !validatePassword(formData.password) &&
    !validateConfirmPassword(formData.password, formData.confirmPassword)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div>
        <h2>Registration Form</h2>
        <p data-testid="success-message">Registration successful!</p>
      </div>
    )
  }

  return (
    <div>
      <h2>Registration Form</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            data-testid="email-input"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            style={{ display: 'block', width: '100%', marginTop: '4px' }}
          />
          {errors.email && (
            <p data-testid="email-error" style={{ color: '#fb7185', margin: '4px 0 0' }}>
              {errors.email}
            </p>
          )}
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            data-testid="password-input"
            type="password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            style={{ display: 'block', width: '100%', marginTop: '4px' }}
          />
          {errors.password && (
            <p data-testid="password-error" style={{ color: '#fb7185', margin: '4px 0 0' }}>
              {errors.password}
            </p>
          )}
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            data-testid="confirm-password-input"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            style={{ display: 'block', width: '100%', marginTop: '4px' }}
          />
          {errors.confirmPassword && (
            <p data-testid="confirm-error" style={{ color: '#fb7185', margin: '4px 0 0' }}>
              {errors.confirmPassword}
            </p>
          )}
        </div>
        <button
          type="submit"
          data-testid="submit-button"
          disabled={!isValid}
        >
          Register
        </button>
      </form>
    </div>
  )
}`,
    tests: [
      {
        description: 'Submit button is disabled when form is empty',
        testCode: 'The submit button is disabled on initial render',
      },
      {
        description: 'Shows error for invalid email format',
        testCode: 'Typing "notanemail" shows "Invalid email format" error',
      },
      {
        description: 'Shows error for weak password',
        testCode: 'Typing "abc" shows "Must be at least 8 characters" error',
      },
      {
        description: 'Shows error when passwords do not match',
        testCode: 'Entering different passwords shows "Passwords do not match" error',
      },
      {
        description: 'Enables submit when all fields are valid',
        testCode: 'Entering a valid email, strong password, and matching confirm enables the button',
      },
    ],
    hints: [
      'Create separate validation functions for each field that return an error string or undefined',
      'Derive isValid from running all validators — do not store it as state',
      'When password changes, also re-validate confirmPassword if it has a value',
    ],
  },

  // ==========================================================================
  // HARD CHALLENGES
  // ==========================================================================
  {
    id: 'build-data-table',
    title: 'Build a Data Table',
    difficulty: 'hard',
    description:
      'Build a data table component with sorting, filtering, and pagination. Clicking a column header should toggle sort direction (ascending/descending/none). A search input should filter rows across all columns. Pagination controls should show page numbers and allow navigation.',
    shortDescription: 'Sortable, filterable, paginated data table',
    skills: ['useState', 'useMemo', 'sorting', 'filtering', 'pagination'],
    estimatedTime: 35,
    starterCode: `import { useState, useMemo } from 'react'

interface User {
  id: number
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
}

const USERS: User[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'active' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'active' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Viewer', status: 'inactive' },
  { id: 4, name: 'Diana Prince', email: 'diana@example.com', role: 'Admin', status: 'active' },
  { id: 5, name: 'Eve Adams', email: 'eve@example.com', role: 'Editor', status: 'inactive' },
  { id: 6, name: 'Frank Miller', email: 'frank@example.com', role: 'Viewer', status: 'active' },
  { id: 7, name: 'Grace Lee', email: 'grace@example.com', role: 'Admin', status: 'active' },
  { id: 8, name: 'Henry Wilson', email: 'henry@example.com', role: 'Editor', status: 'inactive' },
  { id: 9, name: 'Ivy Chen', email: 'ivy@example.com', role: 'Viewer', status: 'active' },
  { id: 10, name: 'Jack Davis', email: 'jack@example.com', role: 'Admin', status: 'active' },
  { id: 11, name: 'Karen White', email: 'karen@example.com', role: 'Editor', status: 'active' },
  { id: 12, name: 'Leo Garcia', email: 'leo@example.com', role: 'Viewer', status: 'inactive' },
]

type SortDirection = 'asc' | 'desc' | null
type SortKey = keyof User

const PAGE_SIZE = 5

export function DataTable() {
  // TODO: Create state for sort key, sort direction, filter query, and current page

  // TODO: Implement sorting logic
  // TODO: Implement filtering logic
  // TODO: Implement pagination logic

  // TODO: Use useMemo to compute the sorted, filtered, paginated data

  return (
    <div>
      <h2>Data Table</h2>
      {/* TODO: Add a search/filter input */}
      {/* TODO: Render a table with sortable column headers */}
      {/* TODO: Add pagination controls */}
    </div>
  )
}`,
    solutionCode: `import { useState, useMemo } from 'react'

interface User {
  id: number
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
}

const USERS: User[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'active' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'active' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Viewer', status: 'inactive' },
  { id: 4, name: 'Diana Prince', email: 'diana@example.com', role: 'Admin', status: 'active' },
  { id: 5, name: 'Eve Adams', email: 'eve@example.com', role: 'Editor', status: 'inactive' },
  { id: 6, name: 'Frank Miller', email: 'frank@example.com', role: 'Viewer', status: 'active' },
  { id: 7, name: 'Grace Lee', email: 'grace@example.com', role: 'Admin', status: 'active' },
  { id: 8, name: 'Henry Wilson', email: 'henry@example.com', role: 'Editor', status: 'inactive' },
  { id: 9, name: 'Ivy Chen', email: 'ivy@example.com', role: 'Viewer', status: 'active' },
  { id: 10, name: 'Jack Davis', email: 'jack@example.com', role: 'Admin', status: 'active' },
  { id: 11, name: 'Karen White', email: 'karen@example.com', role: 'Editor', status: 'active' },
  { id: 12, name: 'Leo Garcia', email: 'leo@example.com', role: 'Viewer', status: 'inactive' },
]

type SortDirection = 'asc' | 'desc' | null
type SortKey = keyof User

const PAGE_SIZE = 5
const COLUMNS: { key: SortKey; label: string }[] = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
]

export function DataTable() {
  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortDir, setSortDir] = useState<SortDirection>(null)
  const [filter, setFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      if (sortDir === 'asc') setSortDir('desc')
      else if (sortDir === 'desc') {
        setSortKey(null)
        setSortDir(null)
      }
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
    setCurrentPage(1)
  }

  const filtered = useMemo(() => {
    if (!filter) return USERS
    const q = filter.toLowerCase()
    return USERS.filter(
      (user) =>
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        user.role.toLowerCase().includes(q) ||
        user.status.toLowerCase().includes(q)
    )
  }, [filter])

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return filtered
    return [...filtered].sort((a, b) => {
      const aVal = String(a[sortKey]).toLowerCase()
      const bVal = String(b[sortKey]).toLowerCase()
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
      return 0
    })
  }, [filtered, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const safePage = Math.min(currentPage, totalPages)
  const paginated = sorted.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  )

  const getSortIndicator = (key: SortKey): string => {
    if (sortKey !== key) return ''
    return sortDir === 'asc' ? ' ▲' : ' ▼'
  }

  return (
    <div>
      <h2>Data Table</h2>
      <input
        data-testid="filter-input"
        type="text"
        value={filter}
        onChange={(e) => {
          setFilter(e.target.value)
          setCurrentPage(1)
        }}
        placeholder="Search users..."
      />
      <p data-testid="showing-count">
        Showing {paginated.length} of {sorted.length} users
      </p>
      <table data-testid="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                data-testid={\`header-\${col.key}\`}
                onClick={() => handleSort(col.key)}
                style={{ cursor: 'pointer', textAlign: 'left', padding: '8px' }}
              >
                {col.label}{getSortIndicator(col.key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginated.map((user) => (
            <tr key={user.id} data-testid={\`row-\${user.id}\`}>
              <td style={{ padding: '8px' }}>{user.name}</td>
              <td style={{ padding: '8px' }}>{user.email}</td>
              <td style={{ padding: '8px' }}>{user.role}</td>
              <td style={{ padding: '8px' }}>{user.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div data-testid="pagination" style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
        <button
          data-testid="prev-page"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={safePage <= 1}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            data-testid={\`page-\${i + 1}\`}
            onClick={() => setCurrentPage(i + 1)}
            style={{
              fontWeight: safePage === i + 1 ? 'bold' : 'normal',
            }}
          >
            {i + 1}
          </button>
        ))}
        <button
          data-testid="next-page"
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={safePage >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  )
}`,
    tests: [
      {
        description: 'Renders the first page of data',
        testCode: 'Initial render shows 5 rows and pagination with 3 pages',
      },
      {
        description: 'Sorts by column when clicking a header',
        testCode: 'Clicking "Name" header sorts rows alphabetically with ▲ indicator',
      },
      {
        description: 'Toggles sort direction on repeated clicks',
        testCode: 'Clicking "Name" again reverses order with ▼ indicator; third click removes sort',
      },
      {
        description: 'Filters rows across all columns',
        testCode: 'Typing "admin" in the search shows only Admin rows',
      },
      {
        description: 'Pagination navigates between pages',
        testCode: 'Clicking "Next" shows the next 5 rows; clicking page 3 shows remaining rows',
      },
    ],
    hints: [
      'Use useMemo to chain: filter -> sort -> paginate for performance',
      'Implement a three-state sort cycle: null -> asc -> desc -> null',
      'Reset currentPage to 1 when filter or sort changes',
    ],
  },
  {
    id: 'build-drag-and-drop',
    title: 'Build Drag and Drop',
    difficulty: 'hard',
    description:
      'Build a drag-and-drop reorderable list using the HTML5 Drag and Drop API. Users should be able to drag items to reorder them within the list. Provide visual feedback during the drag operation (highlight the drop target). This exercise tests event handler coordination and state transformation.',
    shortDescription: 'Reorderable list with drag-and-drop',
    skills: ['useState', 'useRef', 'drag events', 'array reordering'],
    estimatedTime: 30,
    starterCode: `import { useState, useRef } from 'react'

const INITIAL_ITEMS = [
  'Learn React',
  'Build a project',
  'Write tests',
  'Deploy to production',
  'Celebrate!',
]

export function DragAndDrop() {
  // TODO: Create state for the items list
  // TODO: Track the dragged item index and the drop target index

  // TODO: Implement onDragStart - store the dragged item index
  // TODO: Implement onDragOver - update the drop target, prevent default
  // TODO: Implement onDrop - reorder the array
  // TODO: Implement onDragEnd - clean up drag state

  return (
    <div>
      <h2>Drag & Drop Reorder</h2>
      {/* TODO: Render a list of draggable items */}
      {/* TODO: Highlight the current drop target */}
    </div>
  )
}`,
    solutionCode: `import { useState, useRef } from 'react'

const INITIAL_ITEMS = [
  'Learn React',
  'Build a project',
  'Write tests',
  'Deploy to production',
  'Celebrate!',
]

export function DragAndDrop() {
  const [items, setItems] = useState(INITIAL_ITEMS)
  const dragIndexRef = useRef<number | null>(null)
  const [dropTarget, setDropTarget] = useState<number | null>(null)

  const handleDragStart = (index: number) => {
    dragIndexRef.current = index
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    setDropTarget(index)
  }

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    const sourceIndex = dragIndexRef.current
    if (sourceIndex === null || sourceIndex === targetIndex) {
      setDropTarget(null)
      return
    }

    setItems((prev) => {
      const next = [...prev]
      const [moved] = next.splice(sourceIndex, 1)
      next.splice(targetIndex, 0, moved)
      return next
    })
    setDropTarget(null)
    dragIndexRef.current = null
  }

  const handleDragEnd = () => {
    setDropTarget(null)
    dragIndexRef.current = null
  }

  return (
    <div>
      <h2>Drag & Drop Reorder</h2>
      <ul data-testid="drag-list" style={{ listStyle: 'none', padding: 0 }}>
        {items.map((item, index) => (
          <li
            key={item}
            data-testid={\`drag-item-\${index}\`}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            style={{
              padding: '12px 16px',
              margin: '4px 0',
              backgroundColor:
                dropTarget === index ? '#1e3a5f' : '#1c1c26',
              border:
                dropTarget === index
                  ? '2px dashed #38bdf8'
                  : '2px solid #333',
              borderRadius: '6px',
              cursor: 'grab',
              transition: 'background-color 0.15s, border-color 0.15s',
              opacity: dragIndexRef.current === index ? 0.5 : 1,
            }}
          >
            <span style={{ marginRight: '8px' }}>☰</span>
            {item}
          </li>
        ))}
      </ul>
      <p data-testid="order-display">
        Order: {items.join(', ')}
      </p>
    </div>
  )
}`,
    tests: [
      {
        description: 'Renders all items in initial order',
        testCode: 'All 5 items are displayed in their initial order',
      },
      {
        description: 'Items are draggable',
        testCode: 'Each list item has the draggable attribute set to true',
      },
      {
        description: 'Highlights the drop target during drag',
        testCode: 'Dragging over an item changes its border to a dashed blue style',
      },
      {
        description: 'Reorders items on drop',
        testCode: 'Dragging "Celebrate!" above "Learn React" moves it to the first position',
      },
      {
        description: 'Cleans up drag state after drop',
        testCode: 'After dropping, no items have the drop target highlight',
      },
    ],
    hints: [
      'Use useRef for the drag source index (no re-render needed) and useState for drop target (needs visual update)',
      'Call e.preventDefault() in onDragOver to allow dropping',
      'Reorder with splice: remove from source, insert at target',
    ],
  },
  {
    id: 'build-virtualized-list',
    title: 'Build a Virtualized List',
    difficulty: 'hard',
    description:
      'Build a virtualized list that efficiently renders only the visible items in a scrollable container. Given a list of 10,000 items, only the items currently in the viewport (plus a small buffer) should be rendered as DOM elements. This tests your understanding of scroll calculations and performance optimization.',
    shortDescription: 'Render only visible items from 10,000 rows',
    skills: ['useState', 'useRef', 'useCallback', 'scroll math', 'performance'],
    estimatedTime: 35,
    starterCode: `import { useState, useRef, useCallback } from 'react'

const TOTAL_ITEMS = 10000
const ITEM_HEIGHT = 40
const CONTAINER_HEIGHT = 500
const BUFFER = 5

export function VirtualizedList() {
  // TODO: Create state for scroll position

  // TODO: Calculate which items are visible based on scroll position
  // startIndex = Math.floor(scrollTop / ITEM_HEIGHT)
  // endIndex = startIndex + Math.ceil(CONTAINER_HEIGHT / ITEM_HEIGHT)
  // Add buffer items above and below

  // TODO: Set up scroll event handler on the container

  // TODO: Render a container with total height set via an inner spacer
  // and absolutely positioned visible items

  return (
    <div>
      <h2>Virtualized List</h2>
      {/* TODO: Render a scrollable container */}
      {/* TODO: Inside, render a spacer div with full content height */}
      {/* TODO: Render only visible items positioned absolutely */}
    </div>
  )
}`,
    solutionCode: `import { useState, useRef, useCallback } from 'react'

const TOTAL_ITEMS = 10000
const ITEM_HEIGHT = 40
const CONTAINER_HEIGHT = 500
const BUFFER = 5

export function VirtualizedList() {
  const [scrollTop, setScrollTop] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const totalHeight = TOTAL_ITEMS * ITEM_HEIGHT

  const startIndex = Math.max(
    0,
    Math.floor(scrollTop / ITEM_HEIGHT) - BUFFER
  )
  const endIndex = Math.min(
    TOTAL_ITEMS - 1,
    Math.ceil((scrollTop + CONTAINER_HEIGHT) / ITEM_HEIGHT) + BUFFER
  )

  const visibleItems: { index: number; label: string }[] = []
  for (let i = startIndex; i <= endIndex; i++) {
    visibleItems.push({ index: i, label: \`Item \${i + 1}\` })
  }

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop)
    }
  }, [])

  return (
    <div>
      <h2>Virtualized List</h2>
      <p data-testid="info">
        Rendering {visibleItems.length} of {TOTAL_ITEMS} items
      </p>
      <div
        ref={containerRef}
        data-testid="scroll-container"
        onScroll={handleScroll}
        style={{
          height: CONTAINER_HEIGHT,
          overflowY: 'auto',
          position: 'relative',
          border: '1px solid #333',
        }}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          {visibleItems.map((item) => (
            <div
              key={item.index}
              data-testid={\`virtual-item-\${item.index}\`}
              style={{
                position: 'absolute',
                top: item.index * ITEM_HEIGHT,
                left: 0,
                right: 0,
                height: ITEM_HEIGHT,
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                borderBottom: '1px solid #222',
                boxSizing: 'border-box',
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}`,
    tests: [
      {
        description: 'Renders only a small subset of 10,000 items',
        testCode: 'The DOM contains far fewer than 10,000 list item elements (roughly 20-30)',
      },
      {
        description: 'Shows correct items for current scroll position',
        testCode: 'At the top, items 1 through ~18 are rendered',
      },
      {
        description: 'Updates visible items on scroll',
        testCode: 'Scrolling down replaces visible items with the next batch',
      },
      {
        description: 'Container has correct total scrollable height',
        testCode: 'The inner spacer height equals 10,000 * 40px = 400,000px',
      },
      {
        description: 'Items are positioned correctly using absolute positioning',
        testCode: 'Each item top value equals its index * 40px',
      },
    ],
    hints: [
      'Calculate startIndex and endIndex from scrollTop divided by ITEM_HEIGHT',
      'Use a spacer div with height = totalItems * itemHeight to maintain scroll size',
      'Position each visible item absolutely with top = index * ITEM_HEIGHT',
    ],
  },
  {
    id: 'build-undo-redo',
    title: 'Build Undo/Redo',
    difficulty: 'hard',
    description:
      'Build a drawing canvas (or text editor) with undo/redo functionality. Maintain a history stack of past states and a future stack for redo. Each action pushes to the history, undo pops from history to future, and redo pops from future back to history. This is a classic application of the Command pattern in UI.',
    shortDescription: 'History stack with undo/redo for a drawing app',
    skills: ['useReducer', 'state machines', 'immutable updates', 'keyboard shortcuts'],
    estimatedTime: 35,
    starterCode: `import { useReducer, useEffect } from 'react'

interface Circle {
  id: number
  x: number
  y: number
  color: string
}

interface HistoryState {
  past: Circle[][]
  present: Circle[]
  future: Circle[][]
}

// TODO: Define action types for the reducer
// - ADD_CIRCLE: adds a circle and pushes present to past
// - UNDO: moves present to future, pops past to present
// - REDO: moves present to past, pops future to present
// - CLEAR: resets everything

// TODO: Implement the reducer

const COLORS = ['#38bdf8', '#34d399', '#fbbf24', '#fb7185', '#a78bfa']

export function UndoRedo() {
  // TODO: Set up useReducer with the history state

  // TODO: Add keyboard shortcut listeners for Ctrl+Z (undo) and Ctrl+Shift+Z (redo)

  // TODO: Implement click handler on the canvas to add circles

  return (
    <div>
      <h2>Undo / Redo Canvas</h2>
      {/* TODO: Add Undo, Redo, and Clear buttons with disabled states */}
      {/* TODO: Render a canvas area that adds circles on click */}
      {/* TODO: Display circle count */}
    </div>
  )
}`,
    solutionCode: `import { useReducer, useEffect } from 'react'

interface Circle {
  id: number
  x: number
  y: number
  color: string
}

interface HistoryState {
  past: Circle[][]
  present: Circle[]
  future: Circle[][]
}

type HistoryAction =
  | { type: 'ADD_CIRCLE'; circle: Circle }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'CLEAR' }

const initialState: HistoryState = {
  past: [],
  present: [],
  future: [],
}

function historyReducer(state: HistoryState, action: HistoryAction): HistoryState {
  switch (action.type) {
    case 'ADD_CIRCLE':
      return {
        past: [...state.past, state.present],
        present: [...state.present, action.circle],
        future: [],
      }
    case 'UNDO': {
      if (state.past.length === 0) return state
      const previous = state.past[state.past.length - 1]
      return {
        past: state.past.slice(0, -1),
        present: previous,
        future: [state.present, ...state.future],
      }
    }
    case 'REDO': {
      if (state.future.length === 0) return state
      const next = state.future[0]
      return {
        past: [...state.past, state.present],
        present: next,
        future: state.future.slice(1),
      }
    }
    case 'CLEAR':
      return initialState
    default:
      return state
  }
}

const COLORS = ['#38bdf8', '#34d399', '#fbbf24', '#fb7185', '#a78bfa']

export function UndoRedo() {
  const [state, dispatch] = useReducer(historyReducer, initialState)
  const { past, present, future } = state

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') {
        e.preventDefault()
        dispatch({ type: 'REDO' })
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault()
        dispatch({ type: 'UNDO' })
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const color = COLORS[Math.floor(Math.random() * COLORS.length)]

    dispatch({
      type: 'ADD_CIRCLE',
      circle: { id: Date.now(), x, y, color },
    })
  }

  return (
    <div>
      <h2>Undo / Redo Canvas</h2>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <button
          data-testid="undo-button"
          onClick={() => dispatch({ type: 'UNDO' })}
          disabled={past.length === 0}
        >
          Undo ({past.length})
        </button>
        <button
          data-testid="redo-button"
          onClick={() => dispatch({ type: 'REDO' })}
          disabled={future.length === 0}
        >
          Redo ({future.length})
        </button>
        <button
          data-testid="clear-button"
          onClick={() => dispatch({ type: 'CLEAR' })}
          disabled={present.length === 0 && past.length === 0}
        >
          Clear
        </button>
      </div>
      <div
        data-testid="canvas"
        onClick={handleCanvasClick}
        style={{
          width: '100%',
          height: 400,
          backgroundColor: '#0d1117',
          borderRadius: '8px',
          border: '1px solid #333',
          position: 'relative',
          cursor: 'crosshair',
          overflow: 'hidden',
        }}
      >
        {present.map((circle) => (
          <div
            key={circle.id}
            data-testid={\`circle-\${circle.id}\`}
            style={{
              position: 'absolute',
              left: circle.x - 15,
              top: circle.y - 15,
              width: 30,
              height: 30,
              borderRadius: '50%',
              backgroundColor: circle.color,
              opacity: 0.8,
              pointerEvents: 'none',
            }}
          />
        ))}
      </div>
      <p data-testid="circle-count">
        {present.length} circle{present.length !== 1 ? 's' : ''} on canvas
      </p>
    </div>
  )
}`,
    tests: [
      {
        description: 'Canvas starts empty with disabled undo/redo',
        testCode: 'Initial render shows 0 circles and disabled Undo/Redo buttons',
      },
      {
        description: 'Clicking the canvas adds a circle',
        testCode: 'Clicking on the canvas renders a colored circle at the click position',
      },
      {
        description: 'Undo removes the last circle',
        testCode: 'After adding 2 circles, clicking Undo removes the second circle',
      },
      {
        description: 'Redo restores an undone circle',
        testCode: 'After undoing, clicking Redo restores the removed circle',
      },
      {
        description: 'New action clears the redo stack',
        testCode: 'After undoing, adding a new circle makes Redo disabled',
      },
    ],
    hints: [
      'Model state as { past: State[], present: State, future: State[] }',
      'Undo: move present to future[0], pop past[-1] to present',
      'Redo: move present to past[-1], pop future[0] to present. New actions clear future.',
    ],
  },
  {
    id: 'build-real-time-chat',
    title: 'Build a Real-Time Chat',
    difficulty: 'hard',
    description:
      'Build a chat interface that simulates real-time messaging. The component should auto-scroll to the latest message, support sending messages with Enter key, show typing indicators, and display timestamps. Simulate incoming messages with a timer to emulate a real-time experience.',
    shortDescription: 'Chat UI with simulated real-time messages',
    skills: ['useState', 'useEffect', 'useRef', 'scroll management', 'timers'],
    estimatedTime: 35,
    starterCode: `import { useState, useEffect, useRef } from 'react'

interface Message {
  id: number
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

const BOT_RESPONSES = [
  'That\\'s a great question! Let me think about it.',
  'Interesting point! Here\\'s what I think...',
  'I agree with you on that.',
  'Could you tell me more about that?',
  'That\\'s a fascinating perspective!',
  'I\\'ve been thinking about the same thing.',
  'Great observation! Let me add to that.',
  'That reminds me of something important.',
]

export function RealTimeChat() {
  // TODO: Create state for messages, input, and typing indicator

  // TODO: Implement sendMessage that adds a user message
  // and triggers a simulated bot response after a delay

  // TODO: Auto-scroll to the bottom when new messages arrive

  // TODO: Handle Enter key to send messages

  return (
    <div>
      <h2>Real-Time Chat</h2>
      {/* TODO: Render a scrollable message list */}
      {/* TODO: Show typing indicator when bot is "typing" */}
      {/* TODO: Render input with send button */}
    </div>
  )
}`,
    solutionCode: `import { useState, useEffect, useRef } from 'react'

interface Message {
  id: number
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

const BOT_RESPONSES = [
  'That\\'s a great question! Let me think about it.',
  'Interesting point! Here\\'s what I think...',
  'I agree with you on that.',
  'Could you tell me more about that?',
  'That\\'s a fascinating perspective!',
  'I\\'ve been thinking about the same thing.',
  'Great observation! Let me add to that.',
  'That reminds me of something important.',
]

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function RealTimeChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Welcome! Type a message to start chatting.',
      sender: 'bot',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const botResponseIndex = useRef(0)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const sendMessage = () => {
    const trimmed = input.trim()
    if (!trimmed) return

    const userMessage: Message = {
      id: Date.now(),
      text: trimmed,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')

    setIsTyping(true)
    const responseTime = 1000 + Math.random() * 1500
    setTimeout(() => {
      const botText = BOT_RESPONSES[botResponseIndex.current % BOT_RESPONSES.length]
      botResponseIndex.current += 1

      const botMessage: Message = {
        id: Date.now() + 1,
        text: botText,
        sender: 'bot',
        timestamp: new Date(),
      }

      setIsTyping(false)
      setMessages((prev) => [...prev, botMessage])
    }, responseTime)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div>
      <h2>Real-Time Chat</h2>
      <div
        data-testid="messages-container"
        style={{
          height: 400,
          overflowY: 'auto',
          border: '1px solid #333',
          borderRadius: '8px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          backgroundColor: '#0d1117',
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            data-testid={\`message-\${msg.id}\`}
            style={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '70%',
            }}
          >
            <div
              style={{
                backgroundColor: msg.sender === 'user' ? '#38bdf8' : '#1c1c26',
                color: msg.sender === 'user' ? '#0a0a0f' : '#f1f5f9',
                padding: '8px 12px',
                borderRadius: '12px',
                borderBottomRightRadius: msg.sender === 'user' ? '4px' : '12px',
                borderBottomLeftRadius: msg.sender === 'bot' ? '4px' : '12px',
              }}
            >
              {msg.text}
            </div>
            <div
              style={{
                fontSize: '11px',
                color: '#64748b',
                marginTop: '2px',
                textAlign: msg.sender === 'user' ? 'right' : 'left',
              }}
            >
              {formatTime(msg.timestamp)}
            </div>
          </div>
        ))}
        {isTyping && (
          <div data-testid="typing-indicator" style={{ color: '#64748b', fontStyle: 'italic' }}>
            Bot is typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <input
          data-testid="chat-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          style={{ flex: 1, padding: '8px 12px' }}
        />
        <button data-testid="send-button" onClick={sendMessage}>
          Send
        </button>
      </div>
      <p data-testid="message-count" style={{ color: '#64748b', marginTop: '8px' }}>
        {messages.length} message{messages.length !== 1 ? 's' : ''}
      </p>
    </div>
  )
}`,
    tests: [
      {
        description: 'Shows initial welcome message',
        testCode: 'Initial render displays the bot welcome message',
      },
      {
        description: 'Sends a message when clicking Send',
        testCode: 'Typing "Hello" and clicking Send adds the user message to the chat',
      },
      {
        description: 'Shows typing indicator after sending',
        testCode: 'After sending a message, "Bot is typing..." appears briefly',
      },
      {
        description: 'Bot responds after a delay',
        testCode: 'After 1-2 seconds, a bot response message appears in the chat',
      },
      {
        description: 'Sends message with Enter key',
        testCode: 'Pressing Enter in the input sends the message without clicking Send',
      },
    ],
    hints: [
      'Use useRef with scrollIntoView({ behavior: "smooth" }) to auto-scroll on new messages',
      'Simulate bot response with setTimeout and a typing indicator state',
      'Handle the Enter key in onKeyDown, checking for e.key === "Enter" and !e.shiftKey',
    ],
  },
]

export function getReactChallengeById(id: string): ReactChallenge | undefined {
  return reactChallenges.find((c) => c.id === id)
}
