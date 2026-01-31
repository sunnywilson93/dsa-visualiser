import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, AlertTriangle, ArrowRight } from 'lucide-react'

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
    id: 'jquery-dom',
    name: 'jQuery DOM',
    years: '2006-2012',
    color: '#6b7280',
    technologies: ['jQuery', 'DOM manipulation', 'Event handlers'],
    code: `// State = the DOM itself
// Read state from DOM, write state to DOM

$('#add-btn').click(function() {
  // Read current count from DOM
  var count = parseInt($('#counter').text());

  // Update DOM directly
  $('#counter').text(count + 1);

  // Conditional UI updates
  if (count + 1 > 10) {
    $('#warning').show();
  }
});

// State is scattered across DOM elements
// No single source of truth
// Hard to track what changed and why`,
    solved: [
      'Made DOM manipulation easy',
      'Cross-browser compatibility',
      'Simple for small apps',
    ],
    created: [
      'State scattered across DOM',
      'No structure or patterns',
      'Spaghetti code at scale',
      'Hard to test or debug',
    ],
    description: 'The DOM was the state. Read from elements, write to elements. Simple but chaotic.',
  },
  {
    id: 'mvc',
    name: 'MVC / Backbone',
    years: '2010-2014',
    color: '#a855f7',
    technologies: ['Backbone.js', 'Models', 'Views', 'Collections'],
    code: `// Backbone.js - Separate Models from Views
var Todo = Backbone.Model.extend({
  defaults: { title: '', completed: false }
});

var TodoList = Backbone.Collection.extend({
  model: Todo
});

var TodoView = Backbone.View.extend({
  template: _.template($('#todo-template').html()),

  events: {
    'click .toggle': 'toggleComplete'
  },

  initialize: function() {
    // Re-render when model changes
    this.listenTo(this.model, 'change', this.render);
  },

  toggleComplete: function() {
    this.model.set('completed', !this.model.get('completed'));
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }
});`,
    solved: [
      'Separated data from presentation',
      'Models as source of truth',
      'Event-driven updates',
    ],
    created: [
      'Boilerplate heavy',
      'Views still manage their own state',
      'Complex data flow to trace',
    ],
    description: 'MVC brought structure. Models held data, Views rendered it, but syncing was manual.',
  },
  {
    id: 'two-way',
    name: 'Two-Way Binding',
    years: '2012-2016',
    color: '#f59e0b',
    technologies: ['Angular 1.x', 'Knockout', 'ng-model'],
    code: `<!-- Angular 1.x - Two-way data binding -->
<div ng-controller="TodoCtrl">
  <input ng-model="newTodo" placeholder="Add todo">
  <button ng-click="addTodo()">Add</button>

  <ul>
    <li ng-repeat="todo in todos">
      <input type="checkbox" ng-model="todo.completed">
      <span ng-class="{done: todo.completed}">
        {{todo.title}}
      </span>
    </li>
  </ul>

  <p>{{remaining()}} items left</p>
</div>

<script>
app.controller('TodoCtrl', function($scope) {
  $scope.todos = [];
  $scope.newTodo = '';

  $scope.addTodo = function() {
    $scope.todos.push({ title: $scope.newTodo, completed: false });
    $scope.newTodo = ''; // Auto-updates input!
  };
});
</script>`,
    solved: [
      'Automatic UI sync (magical!)',
      'Less boilerplate code',
      'Declarative templates',
    ],
    created: [
      'Hard to track what changed what',
      'Performance issues (digest cycles)',
      'Unpredictable update order',
    ],
    description: 'Two-way binding felt magical - change data, UI updates. But debugging was a nightmare.',
  },
  {
    id: 'flux',
    name: 'Flux Architecture',
    years: '2014-2016',
    color: '#3b82f6',
    technologies: ['Flux', 'Dispatcher', 'Stores', 'Actions'],
    code: `// Flux: Unidirectional data flow
// Action -> Dispatcher -> Store -> View

// Actions - describe what happened
var TodoActions = {
  addTodo: function(text) {
    AppDispatcher.dispatch({
      type: 'ADD_TODO',
      text: text
    });
  }
};

// Store - holds state, handles actions
var TodoStore = {
  todos: [],

  handleAction: function(action) {
    switch (action.type) {
      case 'ADD_TODO':
        this.todos.push({ text: action.text, completed: false });
        this.emit('change');
        break;
    }
  }
};

// Register store with dispatcher
AppDispatcher.register(TodoStore.handleAction.bind(TodoStore));

// View subscribes to store
TodoStore.on('change', function() {
  renderTodos(TodoStore.todos);
});`,
    solved: [
      'Predictable data flow',
      'Actions are traceable',
      'Easier debugging',
    ],
    created: [
      'Lots of boilerplate',
      'Multiple stores to coordinate',
      'Verbose action creation',
    ],
    description: 'Facebook\'s Flux introduced unidirectional flow: Actions → Dispatcher → Store → View.',
  },
  {
    id: 'redux',
    name: 'Redux',
    years: '2015-2020',
    color: '#764abc',
    technologies: ['Redux', 'Single store', 'Reducers', 'Middleware'],
    code: `// Redux: Single store, pure reducers
const initialState = { todos: [], filter: 'all' };

// Reducer - pure function (state, action) => newState
function todoReducer(state = initialState, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, {
          id: Date.now(),
          text: action.text,
          completed: false
        }]
      };
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.id
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      };
    default:
      return state;
  }
}

// Create store
const store = createStore(todoReducer);

// Dispatch actions
store.dispatch({ type: 'ADD_TODO', text: 'Learn Redux' });

// Subscribe to changes
store.subscribe(() => console.log(store.getState()));`,
    solved: [
      'Single source of truth',
      'Time-travel debugging',
      'Predictable state updates',
      'Great dev tools',
    ],
    created: [
      'Massive boilerplate',
      'Steep learning curve',
      'Action/reducer ceremony',
      'Overkill for simple apps',
    ],
    description: 'Redux simplified Flux to one store with pure reducer functions. Powerful but verbose.',
  },
  {
    id: 'hooks-context',
    name: 'Hooks + Context',
    years: '2018-2021',
    color: '#61dafb',
    technologies: ['React Hooks', 'Context API', 'useReducer'],
    code: `// React Context + Hooks - built-in state management
const TodoContext = createContext();

function TodoProvider({ children }) {
  const [todos, dispatch] = useReducer(todoReducer, []);

  return (
    <TodoContext.Provider value={{ todos, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
}

// Custom hook for clean API
function useTodos() {
  const context = useContext(TodoContext);
  if (!context) throw new Error('Must be in TodoProvider');
  return context;
}

// Component usage - no Redux needed!
function TodoList() {
  const { todos, dispatch } = useTodos();

  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id} onClick={() =>
          dispatch({ type: 'TOGGLE', id: todo.id })
        }>
          {todo.text}
        </li>
      ))}
    </ul>
  );
}`,
    solved: [
      'No external library needed',
      'Simpler mental model',
      'Composable with hooks',
    ],
    created: [
      'Context re-renders all consumers',
      'Not optimized for frequent updates',
      'Can lead to "provider hell"',
    ],
    description: 'React\'s built-in solution. Simple and sufficient for many apps, but has re-render issues.',
  },
  {
    id: 'modern',
    name: 'Modern Solutions',
    years: '2020-Present',
    color: '#10b981',
    technologies: ['Zustand', 'Jotai', 'Signals', 'Fine-grained'],
    code: `// Zustand - minimal, hook-based store
import { create } from 'zustand';

const useTodoStore = create((set) => ({
  todos: [],

  addTodo: (text) => set((state) => ({
    todos: [...state.todos, { id: Date.now(), text, completed: false }]
  })),

  toggleTodo: (id) => set((state) => ({
    todos: state.todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
  })),
}));

// Component - just use the hook!
function TodoList() {
  const todos = useTodoStore((state) => state.todos);
  const toggleTodo = useTodoStore((state) => state.toggleTodo);

  return todos.map(todo => (
    <li key={todo.id} onClick={() => toggleTodo(todo.id)}>
      {todo.text}
    </li>
  ));
}

// Only re-renders when selected state changes!
// No providers, no boilerplate, just works.`,
    solved: [
      'Minimal boilerplate',
      'Fine-grained reactivity',
      'No provider wrapper needed',
      'Great TypeScript support',
    ],
    created: [
      'Many competing solutions',
      'Ecosystem fragmentation',
      'Choosing is hard',
    ],
    description: 'Modern libraries like Zustand offer simplicity with fine-grained updates. Less is more.',
  },
]

export function StateEvolutionViz() {
  const [activeEra, setActiveEra] = useState(0)
  const era = eras[activeEra]

  const handlePrev = () => {
    if (activeEra > 0) setActiveEra(activeEra - 1)
  }

  const handleNext = () => {
    if (activeEra < eras.length - 1) setActiveEra(activeEra + 1)
  }

  return (
    <div className="flex flex-col gap-[var(--spacing-lg)]">
      <div className="relative flex justify-between px-2 mb-[var(--spacing-sm)] max-md:overflow-x-auto max-md:pb-2 max-md:justify-start max-md:gap-[var(--spacing-lg)]">
        {eras.map((e, i) => (
          <button
            key={e.id}
            className={`relative z-10 flex flex-col items-center gap-[var(--spacing-xs)] p-0 bg-none border-none cursor-pointer transition-all duration-150 max-md:flex-shrink-0 ${i === activeEra ? 'active' : ''} ${i < activeEra ? 'past' : ''}`}
            onClick={() => setActiveEra(i)}
            style={{ '--era-color': e.color } as React.CSSProperties}
          >
            <span className={`text-xs font-medium transition-colors ${i === activeEra ? 'text-white' : 'text-[var(--color-gray-700)] hover:text-[var(--color-gray-300)]'}`}>{e.years.split('-')[0]}</span>
            <span className={`w-[var(--spacing-md)] h-[var(--spacing-md)] rounded-full bg-[var(--color-bg-elevated)] border-2 border-white/20 transition-all ${i === activeEra ? 'scale-130 shadow-[0_0_12px_var(--era-color)]' : ''} ${i < activeEra ? 'bg-[var(--era-color)] border-[var(--era-color)]' : ''} ${i === activeEra ? 'bg-[var(--era-color)] border-[var(--era-color)]' : ''} hover:border-[var(--era-color)] hover:shadow-[0_0_8px_var(--era-color)]`} />
            <span className={`text-xs whitespace-nowrap transition-colors max-w-[60px] overflow-hidden text-ellipsis max-md:max-w-[50px] max-md:text-2xs max-sm:hidden ${i === activeEra ? 'text-white font-semibold' : 'text-[var(--color-gray-700)] hover:text-[var(--color-gray-300)]'}`}>{e.name}</span>
          </button>
        ))}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[var(--color-white-10)] -translate-y-1/2 z-0" />
        <motion.div
          className="absolute top-1/2 left-0 h-0.5 bg-[var(--color-brand-primary)] -translate-y-1/2 z-[1]"
          initial={false}
          animate={{ width: `${(activeEra / (eras.length - 1)) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={era.id}
          className="px-[var(--spacing-lg)] py-[var(--spacing-lg)] rounded-xl text-center max-md:px-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          style={{ 
            '--era-color': era.color,
            background: 'linear-gradient(135deg, var(--color-brand-primary-8), var(--color-brand-primary-8))',
            border: '1px solid var(--color-white-10)'
          } as React.CSSProperties}
        >
          <div className="flex items-center justify-center gap-[var(--spacing-md)] mb-[var(--spacing-sm)] max-sm:flex-wrap">
            <span className="w-[var(--spacing-xl)] h-[var(--spacing-xl)] flex items-center justify-center text-xs font-bold text-white rounded-full" style={{ background: era.color }}>{activeEra + 1}</span>
            <h3 className="m-0 text-lg font-semibold text-[var(--color-text-bright)] max-sm:text-base">{era.name}</h3>
            <span className="text-xs font-medium px-[var(--spacing-sm)] py-0.5 rounded-full" style={{ color: era.color, background: 'var(--color-white-5)' }}>{era.years}</span>
          </div>
          <p className="m-0 mb-3 text-base text-[var(--color-gray-400)] leading-snug">{era.description}</p>
          <div className="flex gap-1.5 justify-center flex-wrap">
            {era.technologies.map(tech => (
              <span key={tech} className="px-[var(--spacing-sm)] py-0.5 bg-[var(--color-white-8)] border border-[var(--color-white-10)] rounded-md text-2xs font-mono text-[var(--color-brand-light)]">{tech}</span>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={`code-${era.id}`}
          className="bg-[var(--color-black-40)] border border-[var(--color-white-8)] rounded-xl overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex justify-between items-center px-[var(--spacing-md)] py-[var(--spacing-sm)] bg-[var(--color-white-5)]">
            <span className="text-xs font-semibold text-[var(--color-gray-500)]">Example Code</span>
          </div>
          <pre className="m-0 px-[var(--spacing-md)] py-[var(--spacing-md)] max-h-52 overflow-y-auto font-mono text-2xs leading-normal text-[var(--color-gray-300)] whitespace-pre-wrap">
            <code>{era.code}</code>
          </pre>
        </motion.div>
      </AnimatePresence>

      <div className="grid grid-cols-2 gap-[var(--spacing-md)] max-md:grid-cols-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={`solved-${era.id}`}
            className="px-[var(--spacing-md)] py-[var(--spacing-md)] rounded-lg bg-[var(--color-emerald-8)] border border-[var(--color-emerald-20)]"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="flex items-center gap-1.5 mb-[var(--spacing-sm)] text-xs font-semibold text-[var(--color-emerald-400)]">
              <Check size={16} className="text-[var(--difficulty-1)]" />
              <span>Problems Solved</span>
            </div>
            <ul className="m-0 p-0 list-none">
              {era.solved.map((item, i) => (
                <motion.li
                  key={i}
                  className="relative pl-3 text-xs text-[var(--color-gray-400)] leading-normal mb-1 before:content-[''] before:absolute before:left-0 before:top-[0.45em] before:w-[var(--spacing-xs)] before:h-[var(--spacing-xs)] before:rounded-full before:bg-[var(--difficulty-1)]"
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
            className="px-[var(--spacing-md)] py-[var(--spacing-md)] rounded-lg bg-[var(--color-red-8)] border border-[var(--color-red-20)]"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div className="flex items-center gap-1.5 mb-[var(--spacing-sm)] text-xs font-semibold text-[var(--color-red-400)]">
              <AlertTriangle size={16} className="text-[var(--color-accent-red)]" />
              <span>New Challenges</span>
            </div>
            <ul className="m-0 p-0 list-none">
              {era.created.map((item, i) => (
                <motion.li
                  key={i}
                  className="relative pl-3 text-xs text-[var(--color-gray-400)] leading-normal mb-1 before:content-[''] before:absolute before:left-0 before:top-[0.45em] before:w-[var(--spacing-xs)] before:h-[var(--spacing-xs)] before:rounded-full before:bg-[var(--color-accent-red)]"
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
        <div className="flex items-center justify-center gap-1.5 px-[var(--spacing-sm)] py-[var(--spacing-sm)] rounded-lg bg-[var(--color-brand-primary-8)] border border-dashed border-[var(--color-brand-primary-30)] text-xs text-[var(--color-gray-400)]">
          <ArrowRight size={14} className="text-[var(--color-brand-primary)] animate-pulse" />
          <span>These challenges led to: <strong className="text-[var(--color-brand-light)]">{eras[activeEra + 1].name}</strong></span>
        </div>
      )}

      <div className="flex gap-[var(--spacing-md)] justify-center items-center">
        <button
          className="px-[var(--spacing-lg)] py-[var(--spacing-sm)] text-base font-medium bg-[var(--color-white-5)] border border-[var(--color-white-10)] rounded-md text-[var(--color-gray-500)] cursor-pointer transition-all hover:bg-[var(--color-white-10)] hover:text-white hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={handlePrev}
          disabled={activeEra === 0}
        >
          Previous Era
        </button>
        <span className="text-sm text-[var(--color-gray-700)] font-medium min-w-[3rem] text-center">
          {activeEra + 1} / {eras.length}
        </span>
        <button
          className="px-[var(--spacing-lg)] py-[var(--spacing-sm)] text-base font-medium bg-[var(--gradient-brand)] border-none rounded-md text-white cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_12px_var(--color-brand-primary-40)] disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleNext}
          disabled={activeEra === eras.length - 1}
        >
          Next Era
        </button>
      </div>

      <div className="px-[var(--spacing-md)] py-2.5 bg-[var(--color-brand-primary-8)] border border-[var(--color-brand-primary-20)] rounded-lg text-sm text-[var(--color-gray-400)] text-center">
        <strong className="text-[var(--color-brand-primary)]">Key Insight:</strong> The trend is toward simplicity. Modern solutions like Zustand prove you don&apos;t need complexity for predictable state.
      </div>
    </div>
  )
}
