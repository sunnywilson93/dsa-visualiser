// Frontend System Design Concepts - Interactive Learning Module

export interface SystemDesignExample {
  title: string
  code: string
  explanation: string
}

export interface SystemDesignQuestion {
  question: string
  answer: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export type SystemDesignCategory =
  | 'sd-framework'
  | 'sd-core-patterns'
  | 'sd-performance'
  | 'sd-case-studies'

export interface SystemDesignConcept {
  id: string
  title: string
  category: SystemDesignCategory
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  description: string
  shortDescription: string
  keyPoints: string[]
  examples: SystemDesignExample[]
  commonMistakes: string[]
  interviewTips: string[]
  interviewFrequency: 'very-high' | 'high' | 'medium' | 'low'
  estimatedReadTime: number
  prerequisites: string[]
  nextConcepts: string[]
  commonQuestions?: SystemDesignQuestion[]
}

export interface SystemDesignCategoryInfo {
  id: SystemDesignCategory
  label: string
  order: number
}

export const systemDesignCategories: SystemDesignCategoryInfo[] = [
  { id: 'sd-framework', label: 'Framework', order: 0 },
  { id: 'sd-core-patterns', label: 'Core Patterns', order: 1 },
  { id: 'sd-performance', label: 'Performance', order: 2 },
  { id: 'sd-case-studies', label: 'Case Studies', order: 3 },
]

export const systemDesignConcepts: SystemDesignConcept[] = [
  // ==========================================================================
  // FRAMEWORK
  // ==========================================================================
  {
    id: 'sd-radio-framework',
    title: 'The RADIO Framework',
    category: 'sd-framework',
    difficulty: 'intermediate',
    description: 'The RADIO framework provides a structured approach to frontend system design interviews. It stands for Requirements, Architecture, Data Model, Interface (API), and Optimizations. Mastering this framework ensures you cover all critical dimensions systematically rather than diving straight into implementation details.',
    shortDescription: 'Structured approach to frontend system design interviews',
    keyPoints: [
      'Requirements: Clarify functional and non-functional requirements before designing anything',
      'Architecture: Define the high-level component tree and module boundaries',
      'Data Model: Design the client-side state shape, server state, and data flow',
      'Interface: Define component APIs, prop contracts, and communication protocols',
      'Optimizations: Address performance, accessibility, and edge cases last',
      'Spend 3-5 minutes on requirements to avoid redesigning mid-interview',
      'Non-functional requirements include offline support, i18n, and real-time updates',
      'Draw diagrams to communicate architecture visually during interviews',
    ],
    examples: [
      {
        title: 'Requirements Gathering',
        code: `// Step 1: Functional Requirements
// - What are the core user actions?
// - What data needs to be displayed?
// - What interactions are expected?

interface Requirements {
  functional: {
    userActions: string[]    // e.g., ['search', 'filter', 'paginate']
    dataDisplay: string[]    // e.g., ['list view', 'detail view']
    interactions: string[]   // e.g., ['drag-drop', 'inline edit']
  }
  nonFunctional: {
    performance: string      // e.g., 'First paint < 1.5s'
    accessibility: string    // e.g., 'WCAG 2.1 AA'
    offline: boolean
    i18n: boolean
    realTime: boolean
  }
  scale: {
    users: string            // e.g., '10M DAU'
    dataVolume: string       // e.g., '10K items in list'
    updateFrequency: string  // e.g., 'every 30 seconds'
  }
}`,
        explanation: 'Always start by clarifying requirements. This prevents scope creep and shows the interviewer you think before coding. Ask about scale, data freshness, and edge cases.',
      },
      {
        title: 'Architecture Breakdown',
        code: `// Step 2: High-level Architecture
//
// ┌─────────────────────────────────────┐
// │           App Shell                  │
// │  ┌──────────┐  ┌──────────────────┐ │
// │  │  NavBar   │  │   Main Content   │ │
// │  │          │  │  ┌────────────┐  │ │
// │  │  Search  │  │  │  List View  │  │ │
// │  │  Filters │  │  │            │  │ │
// │  │          │  │  │  Detail    │  │ │
// │  │          │  │  │  Panel     │  │ │
// │  └──────────┘  │  └────────────┘  │ │
// │                └──────────────────┘ │
// └─────────────────────────────────────┘

interface ArchitectureLayer {
  presentation: string[]  // UI components
  logic: string[]         // Custom hooks, state machines
  data: string[]          // API layer, caching, normalization
  infra: string[]         // Error boundaries, logging, analytics
}

const layers: ArchitectureLayer = {
  presentation: ['AppShell', 'ListView', 'DetailPanel', 'SearchBar'],
  logic: ['useSearch', 'useInfiniteScroll', 'useOptimisticUpdate'],
  data: ['apiClient', 'queryCache', 'normalizedStore'],
  infra: ['ErrorBoundary', 'AnalyticsProvider', 'FeatureFlags'],
}`,
        explanation: 'Break the system into layers: presentation, logic, data, and infrastructure. This separation of concerns makes the design scalable and testable.',
      },
      {
        title: 'Data Model & Interface Design',
        code: `// Step 3: Data Model
interface ClientState {
  entities: Record<string, Entity>  // Normalized store
  ui: {
    selectedId: string | null
    filters: FilterState
    pagination: { cursor: string; hasMore: boolean }
  }
  cache: {
    queries: Map<string, CachedQuery>
    ttl: number
  }
}

// Step 4: Component Interface
interface ListViewProps {
  items: Entity[]
  onSelect: (id: string) => void
  onLoadMore: () => void
  isLoading: boolean
  error: Error | null
}

// Step 5: Optimizations
// - Virtual scrolling for 10K+ items
// - Debounced search (300ms)
// - Optimistic updates for mutations
// - Service worker for offline reads`,
        explanation: 'Design the data model to be normalized (avoiding duplication) and define clear component interfaces. Save optimizations for last but mention them proactively.',
      },
    ],
    commonMistakes: [
      'Jumping into component code before clarifying requirements',
      'Ignoring non-functional requirements like accessibility or offline support',
      'Designing only the happy path without considering error states and loading states',
      'Over-engineering the solution for a scale that was never mentioned',
      'Forgetting to discuss trade-offs between different approaches',
    ],
    interviewTips: [
      'Spend the first 3-5 minutes asking clarifying questions about requirements and constraints',
      'Draw a high-level architecture diagram before discussing implementation details',
      'Explicitly state trade-offs when making design decisions',
      'Mention optimizations even if you do not have time to implement them in detail',
      'Practice the RADIO framework with real products: Twitter feed, Google Docs, Spotify player',
    ],
    interviewFrequency: 'very-high',
    estimatedReadTime: 15,
    prerequisites: [],
    nextConcepts: ['sd-component-architecture', 'sd-data-fetching'],
    commonQuestions: [
      {
        question: 'How do you decide what to cover first in a frontend system design interview?',
        answer: 'Follow the RADIO framework: start with Requirements to understand scope, then Architecture for high-level structure, Data Model for state shape, Interface for APIs, and Optimizations last. This ensures you cover breadth before depth.',
        difficulty: 'easy',
      },
      {
        question: 'How do you handle ambiguous requirements in a system design interview?',
        answer: 'Ask clarifying questions about user scale, data volume, update frequency, offline needs, and device targets. State your assumptions explicitly and confirm with the interviewer before proceeding.',
        difficulty: 'medium',
      },
      {
        question: 'When should you use a normalized vs denormalized data model on the client?',
        answer: 'Use normalized stores when entities are referenced from multiple places (e.g., users in comments and posts). Use denormalized structures for simple, read-heavy views where data duplication is minimal and updates are rare.',
        difficulty: 'hard',
      },
    ],
  },
  {
    id: 'sd-component-architecture',
    title: 'Component Architecture',
    category: 'sd-framework',
    difficulty: 'intermediate',
    description: 'Component architecture defines how you decompose a complex UI into a hierarchy of reusable, maintainable components. In frontend system design, this means deciding component boundaries, defining prop contracts, choosing composition patterns, and structuring the component tree for testability and performance.',
    shortDescription: 'Decomposing UIs into scalable component hierarchies',
    keyPoints: [
      'Single Responsibility Principle: each component should have one reason to change',
      'Container/Presentational split separates data-fetching logic from rendering',
      'Compound components share implicit state via context for flexible composition',
      'Controlled vs uncontrolled components determine who owns the state',
      'Component boundaries should align with data boundaries to minimize prop drilling',
      'Use composition over configuration: children and render props beat mega-prop components',
      'Design leaf components to be stateless and pure for maximum reusability',
      'Barrel exports (index.ts) provide clean public APIs for component modules',
    ],
    examples: [
      {
        title: 'Container/Presentational Split',
        code: `// Container: owns data and logic
function UserListContainer() {
  const { data, isLoading, error } = useQuery(['users'], fetchUsers)
  const [sortBy, setSortBy] = useState<'name' | 'date'>('name')

  const sorted = useMemo(
    () => sortUsers(data ?? [], sortBy),
    [data, sortBy]
  )

  if (error) return <ErrorState error={error} />
  if (isLoading) return <UserListSkeleton />

  return (
    <UserList
      users={sorted}
      sortBy={sortBy}
      onSortChange={setSortBy}
    />
  )
}

// Presentational: pure rendering, no data fetching
interface UserListProps {
  users: User[]
  sortBy: 'name' | 'date'
  onSortChange: (sort: 'name' | 'date') => void
}

function UserList({ users, sortBy, onSortChange }: UserListProps) {
  return (
    <div>
      <SortControls value={sortBy} onChange={onSortChange} />
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  )
}`,
        explanation: 'Separating data concerns from presentation makes components easier to test, reuse, and reason about. The presentational component can be tested with static props without mocking API calls.',
      },
      {
        title: 'Compound Component Pattern',
        code: `// Compound components share state via context
interface TabsContextValue {
  activeTab: string
  setActiveTab: (id: string) => void
}

const TabsContext = createContext<TabsContextValue | null>(null)

function Tabs({ defaultTab, children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab)
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div role="tablist">{children}</div>
    </TabsContext.Provider>
  )
}

function TabTrigger({ id, children }: TabTriggerProps) {
  const ctx = useContext(TabsContext)!
  return (
    <button
      role="tab"
      aria-selected={ctx.activeTab === id}
      onClick={() => ctx.setActiveTab(id)}
    >
      {children}
    </button>
  )
}

function TabPanel({ id, children }: TabPanelProps) {
  const ctx = useContext(TabsContext)!
  if (ctx.activeTab !== id) return null
  return <div role="tabpanel">{children}</div>
}

// Usage: flexible, declarative API
<Tabs defaultTab="overview">
  <TabTrigger id="overview">Overview</TabTrigger>
  <TabTrigger id="code">Code</TabTrigger>
  <TabPanel id="overview">Overview content</TabPanel>
  <TabPanel id="code">Code content</TabPanel>
</Tabs>`,
        explanation: 'Compound components provide a flexible, declarative API where consumers control layout and composition while the parent manages shared state. This pattern avoids prop explosion.',
      },
      {
        title: 'Component Module Structure',
        code: `// Feature module structure
// src/features/UserProfile/
//   ├── index.ts              (public API)
//   ├── UserProfile.tsx       (main component)
//   ├── UserProfile.test.tsx  (tests)
//   ├── UserAvatar.tsx        (sub-component)
//   ├── useUserProfile.ts     (custom hook)
//   ├── userProfile.types.ts  (local types)
//   └── UserProfile.module.css

// index.ts — clean public API
export { UserProfile } from './UserProfile'
export type { UserProfileProps } from './userProfile.types'

// Shared types stay in src/types/
// Local types stay in the feature module
interface UserProfileProps {
  userId: string
  variant: 'compact' | 'full'
  onEdit?: () => void
}

// Internal sub-components are NOT exported
// Only the public API is accessible to other modules`,
        explanation: 'Organizing components into feature modules with barrel exports creates clear public APIs. Internal sub-components stay encapsulated, reducing coupling between modules.',
      },
    ],
    commonMistakes: [
      'Creating god components with 20+ props instead of composing smaller components',
      'Mixing data-fetching logic with rendering logic in the same component',
      'Prop drilling through 4+ levels instead of using context or composition',
      'Making every component controlled when uncontrolled defaults would simplify the API',
      'Exposing internal sub-components through the public module API',
    ],
    interviewTips: [
      'Start by sketching the component tree on a whiteboard before writing code',
      'Name components after what they render, not what data they fetch',
      'Discuss trade-offs between composition patterns when relevant',
      'Show awareness of testing strategy: pure presentational components are easier to test',
      'Mention accessibility concerns at the component API level (ARIA roles, keyboard navigation)',
    ],
    interviewFrequency: 'very-high',
    estimatedReadTime: 15,
    prerequisites: ['sd-radio-framework'],
    nextConcepts: ['sd-data-fetching', 'sd-state-management'],
    commonQuestions: [
      {
        question: 'When should you use composition vs configuration (props) for component APIs?',
        answer: 'Use composition (children, slots) when consumers need layout flexibility. Use configuration (props) when the component has a fixed structure with limited variations. If a component has more than 8-10 props, it probably needs composition.',
        difficulty: 'medium',
      },
      {
        question: 'How do you decide component boundaries in a complex UI?',
        answer: 'Align component boundaries with data boundaries: each component should map to one data entity or one user interaction. Apply the Single Responsibility Principle: if a component has multiple reasons to change, split it.',
        difficulty: 'medium',
      },
      {
        question: 'How would you design a reusable data table component for an enterprise app?',
        answer: 'Use a headless/compound component approach: the table provides state management (sorting, filtering, pagination, selection) via hooks and context, while consumers provide their own rendering. This separates logic from presentation and supports diverse use cases.',
        difficulty: 'hard',
      },
    ],
  },

  // ==========================================================================
  // CORE PATTERNS
  // ==========================================================================
  {
    id: 'sd-data-fetching',
    title: 'Data Fetching Patterns',
    category: 'sd-core-patterns',
    difficulty: 'intermediate',
    description: 'Data fetching in frontend system design goes far beyond simple API calls. It encompasses caching strategies, request deduplication, optimistic updates, pagination patterns, and error recovery. Choosing the right fetching pattern directly impacts perceived performance, data consistency, and user experience.',
    shortDescription: 'Caching, pagination, and optimistic update strategies',
    keyPoints: [
      'Stale-While-Revalidate (SWR) serves cached data instantly then refreshes in the background',
      'Request deduplication prevents redundant API calls when multiple components need the same data',
      'Optimistic updates show changes immediately and roll back on server failure',
      'Cursor-based pagination scales better than offset-based for large, dynamic datasets',
      'Prefetching loads data before the user navigates to reduce perceived latency',
      'Normalized caches prevent data inconsistency when the same entity appears in multiple views',
      'Error retry with exponential backoff handles transient network failures gracefully',
    ],
    examples: [
      {
        title: 'Stale-While-Revalidate Pattern',
        code: `// SWR pattern: serve stale, then revalidate
interface CacheEntry<T> {
  data: T
  timestamp: number
  staleTime: number
}

class SWRCache {
  private cache = new Map<string, CacheEntry<unknown>>()

  async fetch<T>(key: string, fetcher: () => Promise<T>, options = { staleTime: 30_000 }): Promise<T> {
    const cached = this.cache.get(key) as CacheEntry<T> | undefined

    if (cached) {
      const isStale = Date.now() - cached.timestamp > cached.staleTime
      if (isStale) {
        // Revalidate in background, serve stale data now
        fetcher().then(fresh => {
          this.cache.set(key, { data: fresh, timestamp: Date.now(), staleTime: options.staleTime })
        })
      }
      return cached.data
    }

    // No cache: fetch and store
    const data = await fetcher()
    this.cache.set(key, { data, timestamp: Date.now(), staleTime: options.staleTime })
    return data
  }
}`,
        explanation: 'SWR provides instant perceived performance by serving cached data while silently refreshing. This pattern is the foundation of libraries like React Query and SWR.',
      },
      {
        title: 'Optimistic Updates with Rollback',
        code: `// Optimistic update pattern
function useOptimisticUpdate<T>(
  mutationFn: (data: T) => Promise<T>,
  options: {
    onMutate: (data: T) => { previousData: T }
    onError: (error: Error, data: T, context: { previousData: T }) => void
    onSettled: () => void
  }
) {
  return async (newData: T) => {
    // 1. Snapshot previous state
    const context = options.onMutate(newData)

    try {
      // 2. Optimistically update UI immediately
      // 3. Send request to server
      const result = await mutationFn(newData)
      return result
    } catch (error) {
      // 4. Roll back to previous state on failure
      options.onError(error as Error, newData, context)
      throw error
    } finally {
      // 5. Refetch to ensure consistency
      options.onSettled()
    }
  }
}

// Usage: like/unlike a post
const toggleLike = useOptimisticUpdate(
  (post) => api.toggleLike(post.id),
  {
    onMutate: (post) => {
      const prev = queryCache.get(['post', post.id])
      queryCache.set(['post', post.id], { ...post, liked: !post.liked })
      return { previousData: prev }
    },
    onError: (_err, _post, ctx) => {
      queryCache.set(['post', _post.id], ctx.previousData)
    },
    onSettled: () => queryCache.invalidate(['posts']),
  }
)`,
        explanation: 'Optimistic updates make the UI feel instant by applying changes before the server responds. The key is maintaining a rollback path for when the server request fails.',
      },
      {
        title: 'Cursor-Based Pagination',
        code: `// Cursor-based pagination for infinite scroll
interface PaginatedResponse<T> {
  items: T[]
  nextCursor: string | null
  hasMore: boolean
}

function useInfiniteList<T>(
  fetchPage: (cursor: string | null) => Promise<PaginatedResponse<T>>
) {
  const [pages, setPages] = useState<T[][]>([])
  const [cursor, setCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return
    setIsLoading(true)

    const response = await fetchPage(cursor)
    setPages(prev => [...prev, response.items])
    setCursor(response.nextCursor)
    setHasMore(response.hasMore)
    setIsLoading(false)
  }, [cursor, hasMore, isLoading, fetchPage])

  const allItems = useMemo(() => pages.flat(), [pages])

  return { items: allItems, loadMore, hasMore, isLoading }
}

// Combine with Intersection Observer for auto-loading
function InfiniteList({ fetchPage }: { fetchPage: FetchFn }) {
  const { items, loadMore, hasMore } = useInfiniteList(fetchPage)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMore() },
      { rootMargin: '200px' }
    )
    if (sentinelRef.current) observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [loadMore])

  return (
    <>
      {items.map(item => <ListItem key={item.id} item={item} />)}
      {hasMore && <div ref={sentinelRef} />}
    </>
  )
}`,
        explanation: 'Cursor-based pagination avoids the offset drift problem where items shift as new data is added. Combined with Intersection Observer, it creates smooth infinite scroll experiences.',
      },
    ],
    commonMistakes: [
      'Not deduplicating concurrent requests for the same resource',
      'Using offset-based pagination for frequently-updated lists, causing items to shift or repeat',
      'Forgetting to invalidate related caches after a mutation',
      'Not showing loading/error states during background revalidation',
      'Caching data without a TTL, serving arbitrarily stale content',
    ],
    interviewTips: [
      'Always discuss caching strategy when the interviewer mentions data fetching',
      'Mention request waterfall vs parallel fetching as a key optimization',
      'Explain the trade-off between data freshness and perceived performance',
      'Discuss how React Suspense changes data fetching architecture',
      'Know the difference between server state (remote) and client state (local UI)',
    ],
    interviewFrequency: 'very-high',
    estimatedReadTime: 15,
    prerequisites: ['sd-radio-framework'],
    nextConcepts: ['sd-state-management', 'sd-real-time'],
    commonQuestions: [
      {
        question: 'When would you choose polling over WebSockets?',
        answer: 'Use polling when updates are infrequent (> 30s intervals), the data is not time-critical, or the backend does not support WebSockets. Use WebSockets when you need sub-second updates or bidirectional communication (chat, collaborative editing).',
        difficulty: 'medium',
      },
      {
        question: 'How do you handle data fetching in a micro-frontend architecture?',
        answer: 'Use a shared data layer or API gateway to avoid duplicate requests. Each micro-frontend can own its cache but should subscribe to a shared event bus for cross-boundary cache invalidation. Consider a BFF (Backend for Frontend) to aggregate API calls.',
        difficulty: 'hard',
      },
    ],
  },
  {
    id: 'sd-state-management',
    title: 'State Management at Scale',
    category: 'sd-core-patterns',
    difficulty: 'advanced',
    description: 'State management at scale requires distinguishing between server state, client state, and UI state. Each category has different caching, synchronization, and persistence needs. A well-designed state architecture prevents prop drilling, avoids unnecessary re-renders, and keeps the data flow predictable across a large application.',
    shortDescription: 'Scalable patterns for client, server, and UI state',
    keyPoints: [
      'Server state (remote data) should be managed by a dedicated library like React Query or SWR',
      'Client state (local UI) belongs in component state, context, or a lightweight store like Zustand',
      'URL state (route params, search params) is often overlooked but is the most shareable state',
      'Normalized stores prevent data duplication and keep entity updates consistent across views',
      'Derived state should be computed (useMemo, selectors) rather than stored separately',
      'Atomic state (Jotai, Recoil) scales better than single-tree stores for large apps',
      'State colocation: keep state as close to where it is used as possible',
    ],
    examples: [
      {
        title: 'State Category Classification',
        code: `// Classify state by its nature, then choose the right tool

// 1. SERVER STATE — remote, async, cached
// Tool: React Query, SWR, Apollo
// Characteristics: owned by the server, needs sync
const { data: user } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  staleTime: 5 * 60 * 1000,  // Fresh for 5 minutes
})

// 2. CLIENT STATE — local, synchronous, ephemeral
// Tool: useState, useReducer, Zustand, Jotai
// Characteristics: owned by the client, no server sync
const [isModalOpen, setIsModalOpen] = useState(false)
const [selectedTab, setSelectedTab] = useState('overview')

// 3. URL STATE — shareable, bookmarkable, navigable
// Tool: useSearchParams, URL routing
// Characteristics: should survive page refresh
const [searchParams, setSearchParams] = useSearchParams()
const filter = searchParams.get('filter') ?? 'all'
const page = Number(searchParams.get('page') ?? '1')

// 4. FORM STATE — complex validation, dirty tracking
// Tool: React Hook Form, Formik
const { register, handleSubmit, formState } = useForm<ProfileForm>()`,
        explanation: 'Choosing the wrong state management tool is a common design mistake. Server state needs caching and sync; client state needs reactivity; URL state needs persistence across navigation.',
      },
      {
        title: 'Normalized Store Pattern',
        code: `// Normalized store: entities stored by ID, referenced by collections
interface NormalizedState {
  entities: {
    users: Record<string, User>
    posts: Record<string, Post>
    comments: Record<string, Comment>
  }
  collections: {
    feedPostIds: string[]
    userPostIds: Record<string, string[]>
    postCommentIds: Record<string, string[]>
  }
}

// Normalizer: flatten nested API responses
function normalizePostResponse(response: PostAPIResponse): {
  entities: Partial<NormalizedState['entities']>
  result: string
} {
  const users: Record<string, User> = {}
  const comments: Record<string, Comment> = {}

  response.comments.forEach(c => {
    comments[c.id] = c
    users[c.author.id] = c.author
  })
  users[response.author.id] = response.author

  return {
    entities: {
      users,
      posts: { [response.id]: { ...response, comments: undefined } },
      comments,
    },
    result: response.id,
  }
}

// Selector: denormalize for components
function selectPostWithAuthor(
  state: NormalizedState,
  postId: string
): PostWithAuthor | undefined {
  const post = state.entities.posts[postId]
  if (!post) return undefined
  const author = state.entities.users[post.authorId]
  return { ...post, author }
}`,
        explanation: 'Normalization prevents data duplication. When a user updates their avatar, it reflects everywhere instantly because there is only one copy of the user entity in the store.',
      },
      {
        title: 'Atomic State with Derived Values',
        code: `// Atomic state: independent atoms, derived selectors
import { atom, useAtom, useAtomValue } from 'jotai'

// Base atoms: minimal, independent state
const searchQueryAtom = atom('')
const sortOrderAtom = atom<'asc' | 'desc'>('asc')
const itemsAtom = atom<Item[]>([])

// Derived atom: computed from base atoms (like a selector)
const filteredItemsAtom = atom((get) => {
  const query = get(searchQueryAtom).toLowerCase()
  const items = get(itemsAtom)
  const sort = get(sortOrderAtom)

  const filtered = query
    ? items.filter(item => item.name.toLowerCase().includes(query))
    : items

  return [...filtered].sort((a, b) =>
    sort === 'asc'
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name)
  )
})

// Components subscribe to specific atoms
// Only re-render when their subscribed atom changes
function SearchBar() {
  const [query, setQuery] = useAtom(searchQueryAtom)
  return <input value={query} onChange={e => setQuery(e.target.value)} />
}

function ItemCount() {
  const items = useAtomValue(filteredItemsAtom)
  return <span>{items.length} results</span>
}`,
        explanation: 'Atomic state management lets each component subscribe to exactly the state it needs. Derived atoms are automatically recomputed, eliminating the risk of stale derived state.',
      },
    ],
    commonMistakes: [
      'Using a global store for everything instead of categorizing state by its nature',
      'Storing derived data (filtered lists, computed values) instead of computing it with selectors',
      'Putting server-fetched data in Redux/Zustand instead of using a server state library',
      'Not using URL state for filters and pagination, making views non-shareable',
      'Over-subscribing to global state, causing unnecessary re-renders across the app',
    ],
    interviewTips: [
      'Always classify state into server/client/URL/form categories before choosing tools',
      'Explain why you would choose one state library over another for specific use cases',
      'Discuss how state architecture affects re-render performance',
      'Mention state colocation: keep state where it is consumed, lift only when necessary',
      'Show awareness of when global state becomes an anti-pattern (e.g., form state)',
    ],
    interviewFrequency: 'very-high',
    estimatedReadTime: 18,
    prerequisites: ['sd-radio-framework', 'sd-data-fetching'],
    nextConcepts: ['sd-real-time', 'sd-performance-budget'],
    commonQuestions: [
      {
        question: 'How do you decide between context, Zustand, and Redux for a large app?',
        answer: 'Context works for low-frequency updates (theme, auth). Zustand is ideal for medium-complexity apps with simple APIs and good performance. Redux suits teams that need strict conventions, middleware, and devtools. For server state, skip all three and use React Query.',
        difficulty: 'medium',
      },
      {
        question: 'How would you migrate a large Redux codebase to a modern state architecture?',
        answer: 'Migrate incrementally: first extract server state into React Query (biggest win). Then migrate UI state slice-by-slice to Zustand or component state. Keep Redux for remaining complex client state with middleware needs. Never big-bang rewrite.',
        difficulty: 'hard',
      },
    ],
  },
  {
    id: 'sd-real-time',
    title: 'Real-Time Communication',
    category: 'sd-core-patterns',
    difficulty: 'advanced',
    description: 'Real-time communication enables live updates in frontend applications without requiring the user to refresh. This covers WebSocket management, Server-Sent Events, long polling fallbacks, and the architectural patterns needed to handle presence, typing indicators, live feeds, and collaborative editing on the client side.',
    shortDescription: 'WebSockets, SSE, and live update architectures',
    keyPoints: [
      'WebSockets provide full-duplex communication for chat, collaboration, and gaming',
      'Server-Sent Events (SSE) are simpler than WebSockets for one-way server-to-client updates',
      'Long polling is a fallback when WebSocket/SSE connections are blocked by proxies',
      'Connection management must handle reconnection, backoff, and heartbeat/ping detection',
      'Presence systems track who is online using periodic heartbeats',
      'Operational Transform (OT) or CRDTs resolve conflicts in collaborative editing',
      'Message ordering requires sequence numbers or vector clocks for consistency',
    ],
    examples: [
      {
        title: 'WebSocket Connection Manager',
        code: `// Resilient WebSocket wrapper with auto-reconnect
class WebSocketManager {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 10
  private listeners = new Map<string, Set<(data: unknown) => void>>()

  constructor(private url: string) {}

  connect(): void {
    this.ws = new WebSocket(this.url)

    this.ws.onopen = () => {
      this.reconnectAttempts = 0
      this.emit('connected', null)
    }

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data)
      this.emit(message.type, message.payload)
    }

    this.ws.onclose = (event) => {
      if (!event.wasClean) this.reconnect()
    }

    this.ws.onerror = () => this.reconnect()
  }

  private reconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) return
    const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 30000)
    this.reconnectAttempts++
    setTimeout(() => this.connect(), delay)
  }

  subscribe(event: string, handler: (data: unknown) => void): () => void {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set())
    this.listeners.get(event)!.add(handler)
    return () => this.listeners.get(event)?.delete(handler)
  }

  private emit(event: string, data: unknown): void {
    this.listeners.get(event)?.forEach(handler => handler(data))
  }

  send(type: string, payload: unknown): void {
    this.ws?.send(JSON.stringify({ type, payload }))
  }
}`,
        explanation: 'A production WebSocket manager handles reconnection with exponential backoff, event-based message routing, and clean subscription cleanup to prevent memory leaks.',
      },
      {
        title: 'Server-Sent Events for Live Feed',
        code: `// SSE for one-way server-to-client updates
function useLiveFeed(feedUrl: string) {
  const [events, setEvents] = useState<FeedEvent[]>([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const source = new EventSource(feedUrl)

    source.onopen = () => setIsConnected(true)

    source.addEventListener('new-post', (e) => {
      const post = JSON.parse(e.data) as FeedEvent
      setEvents(prev => [post, ...prev].slice(0, 100)) // Cap at 100
    })

    source.addEventListener('update', (e) => {
      const update = JSON.parse(e.data) as FeedEvent
      setEvents(prev =>
        prev.map(item => item.id === update.id ? update : item)
      )
    })

    source.onerror = () => {
      setIsConnected(false)
      // EventSource auto-reconnects by default
    }

    return () => source.close()
  }, [feedUrl])

  return { events, isConnected }
}

// SSE advantages over WebSockets:
// - Built-in reconnection
// - Works over HTTP/2
// - Simpler server implementation
// - Automatic event ID tracking for resuming`,
        explanation: 'SSE is simpler than WebSockets for one-way data streams like feeds, notifications, and dashboards. The browser handles reconnection automatically, and events flow over standard HTTP.',
      },
      {
        title: 'Presence and Typing Indicators',
        code: `// Presence system: who is online, who is typing
interface PresenceState {
  onlineUsers: Map<string, { lastSeen: number }>
  typingUsers: Set<string>
}

function usePresence(ws: WebSocketManager, channelId: string) {
  const [presence, setPresence] = useState<PresenceState>({
    onlineUsers: new Map(),
    typingUsers: new Set(),
  })

  useEffect(() => {
    // Send heartbeat every 30 seconds
    const heartbeat = setInterval(() => {
      ws.send('presence:heartbeat', { channelId })
    }, 30_000)

    // Listen for presence updates
    const unsubs = [
      ws.subscribe('presence:join', (data) => {
        setPresence(prev => {
          const next = new Map(prev.onlineUsers)
          next.set((data as PresenceEvent).userId, { lastSeen: Date.now() })
          return { ...prev, onlineUsers: next }
        })
      }),
      ws.subscribe('presence:leave', (data) => {
        setPresence(prev => {
          const next = new Map(prev.onlineUsers)
          next.delete((data as PresenceEvent).userId)
          return { ...prev, onlineUsers: next }
        })
      }),
      ws.subscribe('typing:start', (data) => {
        setPresence(prev => ({
          ...prev,
          typingUsers: new Set(prev.typingUsers).add((data as PresenceEvent).userId),
        }))
      }),
      ws.subscribe('typing:stop', (data) => {
        setPresence(prev => {
          const next = new Set(prev.typingUsers)
          next.delete((data as PresenceEvent).userId)
          return { ...prev, typingUsers: next }
        })
      }),
    ]

    return () => {
      clearInterval(heartbeat)
      unsubs.forEach(unsub => unsub())
    }
  }, [ws, channelId])

  return presence
}`,
        explanation: 'Presence tracking uses periodic heartbeats to detect online status. Typing indicators use start/stop events with automatic timeout to handle cases where the stop event is lost.',
      },
    ],
    commonMistakes: [
      'Not implementing reconnection logic, leaving users in a broken state after network blips',
      'Opening a new WebSocket connection per component instead of sharing a single connection',
      'Forgetting to close WebSocket connections on component unmount, causing memory leaks',
      'Not handling message ordering, which leads to out-of-order updates in the UI',
      'Using WebSockets when SSE or polling would be simpler and sufficient',
    ],
    interviewTips: [
      'Explain the trade-offs between WebSocket, SSE, and polling for different use cases',
      'Discuss connection lifecycle: connect, authenticate, heartbeat, reconnect, disconnect',
      'Mention how you would handle offline/reconnection scenarios and message redelivery',
      'For collaborative editing, mention CRDTs vs Operational Transform at a high level',
      'Show awareness of scaling concerns: connection limits per server, fan-out cost',
    ],
    interviewFrequency: 'high',
    estimatedReadTime: 18,
    prerequisites: ['sd-data-fetching'],
    nextConcepts: ['sd-design-feed'],
    commonQuestions: [
      {
        question: 'How would you handle reconnection and missed messages in a chat application?',
        answer: 'On reconnect, send the last received message ID to the server. The server replays missed messages from that point. Use an event queue on the server side with a configurable retention window. On the client, deduplicate by message ID.',
        difficulty: 'hard',
      },
      {
        question: 'When would you choose SSE over WebSockets?',
        answer: 'Choose SSE for one-way server-to-client streams like live feeds, dashboards, or notifications. SSE has built-in reconnection, works over HTTP/2, and is simpler to implement. Choose WebSockets when you need bidirectional communication (chat, gaming).',
        difficulty: 'medium',
      },
    ],
  },

  // ==========================================================================
  // PERFORMANCE
  // ==========================================================================
  {
    id: 'sd-rendering-strategies',
    title: 'Rendering Strategies (SSR/SSG/ISR)',
    category: 'sd-performance',
    difficulty: 'intermediate',
    description: 'Rendering strategy determines when and where HTML is generated for your application. Client-Side Rendering (CSR), Server-Side Rendering (SSR), Static Site Generation (SSG), and Incremental Static Regeneration (ISR) each serve different performance and SEO trade-offs. Choosing the right strategy per page is a critical frontend system design decision.',
    shortDescription: 'CSR, SSR, SSG, and ISR trade-offs for different page types',
    keyPoints: [
      'CSR renders entirely in the browser, best for highly interactive apps behind auth',
      'SSR generates HTML per request, ideal for personalized or frequently-changing content with SEO needs',
      'SSG pre-builds pages at deploy time, giving the fastest TTFB for static content',
      'ISR combines SSG speed with periodic revalidation for content that changes periodically',
      'Streaming SSR sends HTML progressively, improving Time to First Byte for slow data sources',
      'React Server Components reduce client bundle size by keeping server-only code off the client',
      'Hybrid rendering applies different strategies to different routes within the same app',
    ],
    examples: [
      {
        title: 'Choosing Rendering Strategy by Page Type',
        code: `// Strategy decision matrix
//
// ┌─────────────────┬──────────┬─────────┬──────────────┐
// │ Page Type       │ Strategy │ TTFB    │ SEO          │
// ├─────────────────┼──────────┼─────────┼──────────────┤
// │ Marketing/Blog  │ SSG      │ ~50ms   │ Excellent    │
// │ Product listing │ ISR      │ ~50ms   │ Excellent    │
// │ Search results  │ SSR      │ ~200ms  │ Good         │
// │ User dashboard  │ CSR      │ ~100ms  │ Not needed   │
// │ E-commerce PDP  │ ISR      │ ~50ms   │ Excellent    │
// │ Social feed     │ SSR+CSR  │ ~150ms  │ Good (shell) │
// └─────────────────┴──────────┴─────────┴──────────────┘

// Next.js: SSG (default for static pages)
export default function BlogPost({ post }: { post: Post }) {
  return <article>{post.content}</article>
}
export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map(p => ({ slug: p.slug }))
}

// Next.js: ISR with on-demand revalidation
export const revalidate = 3600 // Revalidate every hour

// Next.js: SSR (dynamic, no caching)
export const dynamic = 'force-dynamic'`,
        explanation: 'No single rendering strategy fits all pages. System design interviews expect you to justify your choice per route based on data freshness needs, SEO requirements, and interactivity level.',
      },
      {
        title: 'Streaming SSR with Suspense',
        code: `// Streaming SSR: send the shell immediately, stream data later
// Server Component (Next.js App Router)
import { Suspense } from 'react'

export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <div>
      {/* Shell renders immediately */}
      <ProductHeader id={params.id} />

      {/* Reviews stream in when ready */}
      <Suspense fallback={<ReviewsSkeleton />}>
        <ProductReviews id={params.id} />
      </Suspense>

      {/* Recommendations stream in independently */}
      <Suspense fallback={<RecommendationsSkeleton />}>
        <Recommendations id={params.id} />
      </Suspense>
    </div>
  )
}

// Each async component fetches its own data
async function ProductReviews({ id }: { id: string }) {
  const reviews = await fetchReviews(id) // 400ms
  return <ReviewList reviews={reviews} />
}

async function Recommendations({ id }: { id: string }) {
  const recs = await fetchRecommendations(id) // 800ms
  return <RecGrid items={recs} />
}

// Timeline:
// 0ms   → Shell HTML sent (header, skeletons)
// 400ms → Reviews chunk streamed in
// 800ms → Recommendations chunk streamed in`,
        explanation: 'Streaming SSR with Suspense sends the page shell immediately and streams in data-dependent sections as they resolve. This dramatically improves perceived performance for pages with multiple data sources.',
      },
      {
        title: 'React Server Components Architecture',
        code: `// Server vs Client Component boundary
//
// ┌──────────────────────────────────────┐
// │         Server Component             │
// │  - Fetches data directly             │
// │  - Accesses DB, file system, env     │
// │  - Zero client JS bundle impact      │
// │  - Cannot use useState, useEffect    │
// │                                      │
// │  ┌──────────────────────────────┐    │
// │  │     Client Component         │    │
// │  │  'use client'                │    │
// │  │  - Interactive (onClick)     │    │
// │  │  - Uses hooks (state, ref)   │    │
// │  │  - Ships JS to browser       │    │
// │  └──────────────────────────────┘    │
// └──────────────────────────────────────┘

// Server Component (default in App Router)
async function ProductPage({ id }: { id: string }) {
  const product = await db.products.findUnique({ where: { id } })
  const mdxContent = await compileMDX(product.description)

  return (
    <article>
      <h1>{product.name}</h1>
      {mdxContent}
      {/* Only this ships JS to the client */}
      <AddToCartButton productId={id} price={product.price} />
    </article>
  )
}

// Client Component
'use client'
function AddToCartButton({ productId, price }: AddToCartProps) {
  const [isAdding, setIsAdding] = useState(false)
  const addToCart = async () => {
    setIsAdding(true)
    await cartApi.add(productId)
    setIsAdding(false)
  }
  return (
    <button onClick={addToCart} disabled={isAdding}>
      Add to Cart — \${price}
    </button>
  )
}`,
        explanation: 'React Server Components keep data-fetching and rendering logic on the server, sending only the minimal interactive JavaScript to the client. This reduces bundle size and improves performance.',
      },
    ],
    commonMistakes: [
      'Using CSR for SEO-critical pages like product listings or blog posts',
      'Applying SSR to every page when SSG or ISR would be faster and cheaper',
      'Not using streaming SSR when a page depends on multiple slow data sources',
      'Making entire pages client components when only a small interactive widget needs JavaScript',
      'Ignoring the hydration cost of SSR: shipping large JS bundles negates the SSR benefit',
    ],
    interviewTips: [
      'Always justify your rendering choice for each route type with concrete trade-offs',
      'Mention hybrid rendering: different strategies for different pages in the same app',
      'Discuss how streaming SSR with Suspense solves the slow-data-source problem',
      'Explain the Server Component boundary and when to add use client',
      'Know the performance metrics each strategy optimizes: TTFB, FCP, LCP, TTI',
    ],
    interviewFrequency: 'very-high',
    estimatedReadTime: 15,
    prerequisites: ['sd-radio-framework'],
    nextConcepts: ['sd-performance-budget', 'sd-accessibility'],
    commonQuestions: [
      {
        question: 'How do you choose between SSR and SSG for an e-commerce product page?',
        answer: 'Use ISR (not pure SSG or SSR). Product pages need SEO (ruling out CSR), change periodically (ruling out pure SSG), but do not need real-time freshness (ruling out SSR for every request). ISR gives SSG-like speed with configurable revalidation.',
        difficulty: 'medium',
      },
      {
        question: 'What is the hydration problem and how do you mitigate it?',
        answer: 'Hydration is when the client JavaScript re-attaches event listeners to server-rendered HTML. Large bundles cause a long non-interactive gap after FCP. Mitigate with code splitting, React Server Components (less client JS), selective hydration (Suspense), and progressive hydration.',
        difficulty: 'hard',
      },
    ],
  },
  {
    id: 'sd-performance-budget',
    title: 'Performance Budgets & Optimization',
    category: 'sd-performance',
    difficulty: 'advanced',
    description: 'Performance budgets set measurable thresholds for metrics like bundle size, Time to Interactive, and Largest Contentful Paint. In frontend system design, optimization is not an afterthought but an architectural constraint that influences component splitting, asset loading strategy, and rendering patterns from the start.',
    shortDescription: 'Bundle budgets, Core Web Vitals, and optimization techniques',
    keyPoints: [
      'Core Web Vitals: LCP < 2.5s, INP < 200ms, CLS < 0.1 are Google ranking signals',
      'JavaScript bundle budget: < 200KB compressed for initial load on mobile',
      'Code splitting by route ensures users only download JavaScript for the page they visit',
      'Tree shaking eliminates unused exports, but only works with ES module static imports',
      'Image optimization (next/image, srcset, lazy loading) often has the biggest LCP impact',
      'Font loading strategy (display: swap, preload) prevents invisible text flashes (FOIT)',
      'Third-party scripts (analytics, ads) are the most common performance budget busters',
    ],
    examples: [
      {
        title: 'Performance Budget Configuration',
        code: `// Performance budget in a CI pipeline
// webpack.config.js — bundle size limits
module.exports = {
  performance: {
    maxAssetSize: 200_000,       // 200KB per asset
    maxEntrypointSize: 300_000,  // 300KB per entry
    hints: 'error',              // Fail build if exceeded
  },
}

// Lighthouse CI thresholds
// lighthouserc.json
{
  "ci": {
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "first-contentful-paint": ["error", { "maxNumericValue": 1500 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "interactive": ["error", { "maxNumericValue": 3500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
        "total-byte-weight": ["error", { "maxNumericValue": 500000 }]
      }
    }
  }
}

// Bundle analysis — track per-route sizes
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
module.exports = withBundleAnalyzer(nextConfig)`,
        explanation: 'Performance budgets should be enforced in CI to prevent regressions. Setting limits on bundle size, Lighthouse scores, and Core Web Vitals catches issues before they reach production.',
      },
      {
        title: 'Code Splitting and Lazy Loading',
        code: `// Route-based code splitting (automatic in Next.js)
// Each page only loads its own JavaScript

// Component-level code splitting for heavy modules
import dynamic from 'next/dynamic'

const MarkdownEditor = dynamic(
  () => import('./MarkdownEditor').then(m => ({ default: m.MarkdownEditor })),
  {
    ssr: false,
    loading: () => <EditorSkeleton />,
  }
)

// Conditional code splitting: load only when needed
function Dashboard() {
  const [showChart, setShowChart] = useState(false)

  return (
    <div>
      <button onClick={() => setShowChart(true)}>Show Analytics</button>
      {showChart && (
        <Suspense fallback={<ChartSkeleton />}>
          <AnalyticsChart />  {/* Lazy loaded on demand */}
        </Suspense>
      )}
    </div>
  )
}

// Prefetch on hover: load before click
function NavLink({ href, children }: NavLinkProps) {
  const prefetch = useCallback(() => {
    // Prefetch the route chunk on hover
    import(\`./pages/\${href}\`)
  }, [href])

  return (
    <Link href={href} onMouseEnter={prefetch}>
      {children}
    </Link>
  )
}`,
        explanation: 'Code splitting ensures users only download the JavaScript they need. Route-based splitting is automatic in Next.js; component-level splitting is for heavy widgets like editors, charts, and maps.',
      },
      {
        title: 'Image and Font Optimization',
        code: `// Image optimization: srcset + lazy loading
import Image from 'next/image'

function ProductImage({ src, alt }: ImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={600}
      sizes="(max-width: 768px) 100vw, 50vw"
      placeholder="blur"
      blurDataURL={generateBlurPlaceholder(src)}
      priority={false}  // true only for above-the-fold LCP images
    />
  )
}

// Font loading: prevent FOIT/FOUT
// next/font eliminates layout shift from font loading
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',        // Show fallback font immediately
  preload: true,
  variable: '--font-inter',
})

// Critical CSS: inline above-the-fold styles
// next.config.js
module.exports = {
  experimental: {
    optimizeCss: true,     // Extract and inline critical CSS
  },
}

// Third-party script loading
import Script from 'next/script'

function Analytics() {
  return (
    <Script
      src="https://analytics.example.com/script.js"
      strategy="afterInteractive"  // Load after hydration
    />
  )
}`,
        explanation: 'Images and fonts are often the biggest performance bottlenecks. Proper srcset, lazy loading, font display strategies, and deferred third-party scripts can cut LCP by 40-60%.',
      },
    ],
    commonMistakes: [
      'Optimizing JavaScript bundle size while ignoring image optimization, which often has more impact',
      'Loading all third-party scripts eagerly instead of deferring non-critical scripts',
      'Not setting performance budgets in CI, allowing gradual regressions over time',
      'Using dynamic imports for everything, adding unnecessary loading states',
      'Forgetting about font loading: custom fonts without display:swap cause invisible text flashes',
    ],
    interviewTips: [
      'Quantify performance targets: name specific Core Web Vital thresholds',
      'Discuss the performance budget as an architectural constraint, not an afterthought',
      'Mention real-world tools: Lighthouse CI, webpack-bundle-analyzer, Web Vitals API',
      'Explain the waterfall: DNS > TCP > TLS > TTFB > FCP > LCP > TTI',
      'Show awareness of the mobile performance gap: 3G connections, low-end devices',
    ],
    interviewFrequency: 'high',
    estimatedReadTime: 16,
    prerequisites: ['sd-rendering-strategies'],
    nextConcepts: ['sd-accessibility', 'sd-design-feed'],
    commonQuestions: [
      {
        question: 'How would you diagnose and fix a slow LCP on a product page?',
        answer: 'First, identify the LCP element (usually the hero image). Check if it is lazy-loaded (it should not be for above-the-fold). Ensure the image has proper sizing (width/height attributes), uses modern formats (WebP/AVIF), and has a preload link. Check for render-blocking CSS/JS that delays the LCP paint.',
        difficulty: 'medium',
      },
      {
        question: 'How do you prevent performance regressions in a team of 20 engineers?',
        answer: 'Set up Lighthouse CI in the PR pipeline with budget thresholds that fail the build. Track bundle sizes per route with automated alerts. Use Web Vitals RUM (Real User Monitoring) to catch field regressions that lab tests miss. Make performance reviews part of code review culture.',
        difficulty: 'hard',
      },
    ],
  },
  {
    id: 'sd-accessibility',
    title: 'Accessibility Architecture',
    category: 'sd-performance',
    difficulty: 'intermediate',
    description: 'Accessibility architecture ensures that complex frontend systems are usable by everyone, including people using screen readers, keyboard navigation, and assistive technologies. In system design, accessibility is not a CSS checkbox but an architectural concern that affects component APIs, focus management, state announcements, and interaction patterns.',
    shortDescription: 'ARIA patterns, focus management, and inclusive component design',
    keyPoints: [
      'Semantic HTML (button, nav, main, article) provides free accessibility that divs cannot',
      'ARIA roles and properties bridge the gap when native HTML elements are insufficient',
      'Focus management is critical for modals, drawers, and dynamic content (focus trapping)',
      'Live regions (aria-live) announce dynamic content changes to screen readers',
      'Keyboard navigation patterns (roving tabindex, arrow keys) must follow WAI-ARIA patterns',
      'Color contrast must meet WCAG AA (4.5:1 for text, 3:1 for large text and UI components)',
      'Accessible components require proper labeling: aria-label, aria-labelledby, aria-describedby',
      'Touch targets should be at least 44x44px for motor accessibility on mobile',
    ],
    examples: [
      {
        title: 'Focus Trap for Modals',
        code: `// Focus trap: keep focus inside a modal dialog
function useFocusTrap(ref: RefObject<HTMLElement>) {
  useEffect(() => {
    const element = ref.current
    if (!element) return

    const focusableSelector = [
      'a[href]', 'button:not([disabled])', 'input:not([disabled])',
      'select:not([disabled])', 'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ')

    const focusableElements = element.querySelectorAll(focusableSelector)
    const firstFocusable = focusableElements[0] as HTMLElement
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement

    // Save previously focused element
    const previouslyFocused = document.activeElement as HTMLElement

    // Focus first element in trap
    firstFocusable?.focus()

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault()
          lastFocusable?.focus()
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault()
          firstFocusable?.focus()
        }
      }
    }

    element.addEventListener('keydown', handleKeyDown)
    return () => {
      element.removeEventListener('keydown', handleKeyDown)
      previouslyFocused?.focus() // Restore focus on unmount
    }
  }, [ref])
}

// Usage in a dialog component
function Dialog({ isOpen, onClose, children }: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  useFocusTrap(dialogRef)

  if (!isOpen) return null
  return (
    <div role="dialog" aria-modal="true" ref={dialogRef}>
      {children}
      <button onClick={onClose}>Close</button>
    </div>
  )
}`,
        explanation: 'Focus trapping ensures keyboard users cannot tab outside a modal dialog. Restoring focus to the previously focused element when the modal closes maintains navigation context.',
      },
      {
        title: 'Live Regions for Dynamic Content',
        code: `// Announce dynamic changes to screen readers
function SearchResults({ query, results, isLoading }: SearchResultsProps) {
  return (
    <div>
      {/* Polite: announced after current speech finishes */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {isLoading
          ? 'Searching...'
          : \`\${results.length} results found for \${query}\`
        }
      </div>

      <ul role="listbox" aria-label="Search results">
        {results.map((result, index) => (
          <li
            key={result.id}
            role="option"
            aria-selected={index === 0}
            aria-posinset={index + 1}
            aria-setsize={results.length}
          >
            {result.title}
          </li>
        ))}
      </ul>
    </div>
  )
}

// Toast notification system with announcements
function useToast() {
  const announce = useCallback((message: string, type: 'success' | 'error') => {
    // Visual toast
    showToast({ message, type })

    // Screen reader announcement via live region
    const liveRegion = document.getElementById('toast-live-region')
    if (liveRegion) {
      liveRegion.textContent = ''
      // Force re-announcement by clearing then setting
      requestAnimationFrame(() => {
        liveRegion.textContent = message
      })
    }
  }, [])

  return { announce }
}`,
        explanation: 'Live regions bridge the gap between visual UI updates and screen reader announcements. Without them, dynamic content changes (search results, toasts, loading states) are invisible to assistive technology users.',
      },
      {
        title: 'Roving Tabindex for Composite Widgets',
        code: `// Roving tabindex: arrow keys navigate, Tab moves to next widget
function useRovingTabindex<T extends HTMLElement>(
  items: string[],
  orientation: 'horizontal' | 'vertical' = 'horizontal'
) {
  const [activeIndex, setActiveIndex] = useState(0)
  const itemRefs = useRef<Map<number, T>>(new Map())

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const prevKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp'
    const nextKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown'

    let newIndex = activeIndex
    switch (e.key) {
      case nextKey:
        newIndex = (activeIndex + 1) % items.length
        break
      case prevKey:
        newIndex = (activeIndex - 1 + items.length) % items.length
        break
      case 'Home':
        newIndex = 0
        break
      case 'End':
        newIndex = items.length - 1
        break
      default:
        return
    }

    e.preventDefault()
    setActiveIndex(newIndex)
    itemRefs.current.get(newIndex)?.focus()
  }, [activeIndex, items.length, orientation])

  const getItemProps = (index: number) => ({
    ref: (el: T | null) => {
      if (el) itemRefs.current.set(index, el)
    },
    tabIndex: index === activeIndex ? 0 : -1,
    onKeyDown: handleKeyDown,
  })

  return { activeIndex, getItemProps }
}

// Usage: accessible toolbar
function Toolbar({ actions }: ToolbarProps) {
  const { activeIndex, getItemProps } = useRovingTabindex<HTMLButtonElement>(
    actions.map(a => a.id)
  )

  return (
    <div role="toolbar" aria-label="Formatting options">
      {actions.map((action, i) => (
        <button
          key={action.id}
          {...getItemProps(i)}
          aria-pressed={action.isActive}
        >
          {action.label}
        </button>
      ))}
    </div>
  )
}`,
        explanation: 'Roving tabindex follows the WAI-ARIA composite widget pattern: only one item in the group has tabIndex=0, and arrow keys move focus within the group. This matches native OS behavior for toolbars and menus.',
      },
    ],
    commonMistakes: [
      'Using div and span for interactive elements instead of button and a',
      'Adding aria-label to elements that already have visible text labels',
      'Forgetting focus management when opening/closing modals or routing to new pages',
      'Using color alone to convey meaning (error states, status indicators) without text alternatives',
      'Not testing with a screen reader: ARIA attributes require manual testing to verify',
    ],
    interviewTips: [
      'Frame accessibility as a design constraint from the start, not a retrofit',
      'Mention WCAG 2.1 AA as the standard target for most applications',
      'Discuss keyboard navigation patterns for custom widgets (roving tabindex, focus trapping)',
      'Show awareness of the component API implications: aria-label, role, and keyboard handlers',
      'Mention automated testing tools (axe-core, Lighthouse accessibility audit) and their limitations',
    ],
    interviewFrequency: 'high',
    estimatedReadTime: 15,
    prerequisites: ['sd-component-architecture'],
    nextConcepts: ['sd-design-autocomplete'],
    commonQuestions: [
      {
        question: 'How would you make a custom dropdown accessible?',
        answer: 'Use role="combobox" on the trigger with aria-expanded, aria-haspopup, and aria-controls. The listbox uses role="listbox" with role="option" children. Implement keyboard navigation: Enter/Space to open, arrow keys to navigate, Escape to close, type-ahead to jump to options.',
        difficulty: 'medium',
      },
      {
        question: 'How do you handle accessibility in a single-page application?',
        answer: 'Manage focus on route changes (move focus to the main content heading or a skip link). Announce page title changes with document.title updates. Use aria-live regions for asynchronous content loading. Ensure the back button works correctly with proper history management.',
        difficulty: 'hard',
      },
    ],
  },

  // ==========================================================================
  // CASE STUDIES
  // ==========================================================================
  {
    id: 'sd-design-feed',
    title: 'Design a Social Feed',
    category: 'sd-case-studies',
    difficulty: 'advanced',
    description: 'Designing a social feed (like Twitter, LinkedIn, or Instagram) is a classic frontend system design question. It tests your ability to handle infinite scrolling, real-time updates, optimistic interactions (like/comment), media rendering, and virtualization for thousands of items while maintaining a smooth 60fps scrolling experience.',
    shortDescription: 'Infinite scroll, virtualization, and real-time feed updates',
    keyPoints: [
      'Virtual scrolling is essential: only render items visible in the viewport plus a buffer',
      'Feed items have variable heights, requiring dynamic measurement and position caching',
      'New posts can be prepended without disrupting the current scroll position',
      'Optimistic updates for likes/comments make interactions feel instant',
      'Media (images, videos) needs lazy loading with aspect ratio preservation to prevent CLS',
      'Intersection Observer triggers both lazy loading and scroll-position-based pagination',
      'Feed state separates the item list (IDs) from item data (normalized entities)',
      'Skeleton screens improve perceived performance during initial load and pagination',
    ],
    examples: [
      {
        title: 'Virtualized Feed with Dynamic Heights',
        code: `// Virtual list: only renders visible items
interface VirtualItem {
  id: string
  index: number
  offsetTop: number
  height: number
}

function useVirtualFeed(
  items: FeedItem[],
  containerRef: RefObject<HTMLElement>,
  estimatedItemHeight = 300
) {
  const [scrollTop, setScrollTop] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)
  const heightCache = useRef<Map<string, number>>(new Map())

  // Calculate positions from cached heights
  const virtualItems = useMemo(() => {
    let offset = 0
    return items.map((item, index) => {
      const height = heightCache.current.get(item.id) ?? estimatedItemHeight
      const virtualItem: VirtualItem = {
        id: item.id,
        index,
        offsetTop: offset,
        height,
      }
      offset += height
      return virtualItem
    })
  }, [items, estimatedItemHeight])

  const totalHeight = virtualItems.length > 0
    ? virtualItems[virtualItems.length - 1].offsetTop +
      virtualItems[virtualItems.length - 1].height
    : 0

  // Only render items in viewport + buffer
  const overscan = 3
  const visibleItems = virtualItems.filter(item => {
    const itemBottom = item.offsetTop + item.height
    const viewTop = scrollTop - overscan * estimatedItemHeight
    const viewBottom = scrollTop + containerHeight + overscan * estimatedItemHeight
    return itemBottom > viewTop && item.offsetTop < viewBottom
  })

  // Measure actual heights after render
  const measureItem = useCallback((id: string, height: number) => {
    if (heightCache.current.get(id) !== height) {
      heightCache.current.set(id, height)
    }
  }, [])

  return { visibleItems, totalHeight, measureItem }
}`,
        explanation: 'Virtual scrolling keeps the DOM node count constant regardless of feed length. Dynamic height measurement with a cache handles variable-height items like posts with images, text, and embedded content.',
      },
      {
        title: 'New Post Insertion Without Scroll Jump',
        code: `// Insert new posts at top without disrupting scroll position
function useFeedUpdates(ws: WebSocketManager) {
  const [items, setItems] = useState<FeedItem[]>([])
  const [pendingCount, setPendingCount] = useState(0)
  const pendingItems = useRef<FeedItem[]>([])
  const scrollRef = useRef<HTMLElement>(null)

  useEffect(() => {
    return ws.subscribe('new-post', (data) => {
      const post = data as FeedItem

      // If user is scrolled down, batch new posts
      const isAtTop = (scrollRef.current?.scrollTop ?? 0) < 100

      if (isAtTop) {
        // User is at top: insert immediately
        setItems(prev => [post, ...prev])
      } else {
        // User is reading: show "N new posts" banner
        pendingItems.current = [post, ...pendingItems.current]
        setPendingCount(prev => prev + 1)
      }
    })
  }, [ws])

  const showNewPosts = useCallback(() => {
    setItems(prev => [...pendingItems.current, ...prev])
    pendingItems.current = []
    setPendingCount(0)
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return { items, pendingCount, showNewPosts, scrollRef }
}

// UI: "3 new posts" banner
function FeedHeader({ pendingCount, onShowNew }: FeedHeaderProps) {
  if (pendingCount === 0) return null
  return (
    <button
      onClick={onShowNew}
      className="sticky top-0 z-10 w-full bg-blue-500 text-white py-2"
    >
      {pendingCount} new {pendingCount === 1 ? 'post' : 'posts'}
    </button>
  )
}`,
        explanation: 'Inserting content above the viewport causes a scroll jump. The solution: if the user is at the top, insert immediately. Otherwise, queue new items behind a clickable banner that the user activates when ready.',
      },
      {
        title: 'Feed Architecture Overview',
        code: `// Complete feed architecture
//
// ┌─────────────────────────────────────────┐
// │              Feed Shell                  │
// │  ┌───────────────────────────────────┐  │
// │  │  NewPostsBanner (sticky)          │  │
// │  ├───────────────────────────────────┤  │
// │  │  VirtualizedList                  │  │
// │  │  ┌─────────────────────────────┐  │  │
// │  │  │  FeedItem                    │  │  │
// │  │  │  ├── AuthorHeader            │  │  │
// │  │  │  ├── PostContent             │  │  │
// │  │  │  ├── MediaGallery (lazy)     │  │  │
// │  │  │  ├── EngagementBar           │  │  │
// │  │  │  └── CommentPreview          │  │  │
// │  │  └─────────────────────────────┘  │  │
// │  │  ┌─────────────────────────────┐  │  │
// │  │  │  FeedItem                    │  │  │
// │  │  │  └── ...                     │  │  │
// │  │  └─────────────────────────────┘  │  │
// │  │  LoadMoreSentinel (observer)    │  │  │
// │  └───────────────────────────────────┘  │
// └─────────────────────────────────────────┘

// State architecture
interface FeedState {
  // Normalized entities
  posts: Record<string, Post>
  users: Record<string, User>
  comments: Record<string, Comment>
  // Ordered list of visible post IDs
  feedOrder: string[]
  // Pagination
  cursor: string | null
  hasMore: boolean
  // Real-time
  pendingPostIds: string[]
  // UI
  expandedComments: Set<string>
}

// Key architectural decisions:
// 1. Normalized state: update user avatar in one place
// 2. Virtual list: handle 10K+ items without DOM bloat
// 3. Cursor pagination: no offset drift on active feeds
// 4. Optimistic likes: instant UI, rollback on failure
// 5. Image lazy loading: Intersection Observer + blur placeholder
// 6. WebSocket for new posts, polling fallback every 30s`,
        explanation: 'The complete feed architecture combines normalized state, virtual scrolling, cursor pagination, real-time updates, and lazy-loaded media into a coherent system that scales to millions of users.',
      },
    ],
    commonMistakes: [
      'Rendering all feed items in the DOM instead of virtualizing, causing jank at 1000+ items',
      'Inserting new posts at the top while the user is reading, causing disorienting scroll jumps',
      'Not preserving scroll position when navigating to a detail view and back',
      'Loading full-resolution images instead of responsive srcset with blur placeholders',
      'Using a flat array for feed state instead of normalized entities, causing stale data',
    ],
    interviewTips: [
      'Start by sketching the component tree: Shell > VirtualList > FeedItem > sub-components',
      'Discuss the scroll position preservation problem when inserting new items',
      'Mention virtual scrolling and dynamic height measurement as key technical challenges',
      'Explain the normalized state model and why entity deduplication matters for feeds',
      'Address real-time: WebSocket for new posts, optimistic updates for interactions',
    ],
    interviewFrequency: 'very-high',
    estimatedReadTime: 20,
    prerequisites: ['sd-radio-framework', 'sd-data-fetching', 'sd-real-time'],
    nextConcepts: ['sd-design-autocomplete'],
    commonQuestions: [
      {
        question: 'How would you handle a feed with mixed content types (text, images, videos, polls)?',
        answer: 'Use a discriminated union type for feed items and a registry pattern for renderers. Each content type has a dedicated renderer component. The virtual list measures each item after render to handle variable heights. Videos use Intersection Observer to auto-play/pause.',
        difficulty: 'medium',
      },
      {
        question: 'How would you implement infinite scroll that also supports scroll restoration?',
        answer: 'Cache the scroll position and rendered range in sessionStorage or a state manager keyed by route. On back navigation, restore the feed data from cache, set the scroll position, and render items around that position. Use the browser History API scrollRestoration manual mode.',
        difficulty: 'hard',
      },
    ],
  },
  {
    id: 'sd-design-autocomplete',
    title: 'Design an Autocomplete',
    category: 'sd-case-studies',
    difficulty: 'advanced',
    description: 'Designing an autocomplete/typeahead component is a deceptively complex frontend system design problem. It involves debounced input handling, asynchronous search with race condition management, keyboard navigation, accessibility with ARIA combobox patterns, caching of previous results, and handling edge cases like network failures and empty states.',
    shortDescription: 'Debouncing, race conditions, and ARIA combobox patterns',
    keyPoints: [
      'Debounce input to avoid firing API requests on every keystroke (typically 200-300ms)',
      'AbortController cancels in-flight requests when the user types faster than the API responds',
      'Request deduplication serves cached results for repeated queries',
      'ARIA combobox pattern: role="combobox", aria-expanded, aria-activedescendant for screen readers',
      'Keyboard navigation: ArrowUp/Down to navigate, Enter to select, Escape to close',
      'Highlight matching text in results to show why each result matched',
      'Handle edge cases: empty query, no results, network error, minimum character threshold',
      'Recent searches and trending queries provide value before the user types anything',
    ],
    examples: [
      {
        title: 'Debounced Search with Race Condition Handling',
        code: `// Core autocomplete hook with debounce and abort
function useAutocomplete(
  searchFn: (query: string, signal: AbortSignal) => Promise<SearchResult[]>,
  options = { debounceMs: 250, minChars: 2 }
) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const cacheRef = useRef<Map<string, SearchResult[]>>(new Map())

  const debouncedSearch = useMemo(
    () => debounce(async (q: string) => {
      if (q.length < options.minChars) {
        setResults([])
        setIsLoading(false)
        return
      }

      // Check cache first
      const cached = cacheRef.current.get(q)
      if (cached) {
        setResults(cached)
        setIsLoading(false)
        return
      }

      // Abort previous in-flight request
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      try {
        const data = await searchFn(q, controller.signal)
        // Only update if this request was not aborted
        if (!controller.signal.aborted) {
          cacheRef.current.set(q, data)
          setResults(data)
          setError(null)
        }
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err)
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }, options.debounceMs),
    [searchFn, options.debounceMs, options.minChars]
  )

  const handleChange = useCallback((value: string) => {
    setQuery(value)
    setIsLoading(value.length >= options.minChars)
    debouncedSearch(value)
  }, [debouncedSearch, options.minChars])

  return { query, results, isLoading, error, handleChange }
}`,
        explanation: 'The core challenge is handling race conditions: when the user types "rea" then "reac", the response for "rea" might arrive after "reac". AbortController cancels stale requests, and the cache prevents redundant API calls.',
      },
      {
        title: 'Accessible Combobox with Keyboard Navigation',
        code: `// ARIA combobox pattern with keyboard support
function Autocomplete({ onSelect, searchFn }: AutocompleteProps) {
  const { query, results, isLoading, handleChange } = useAutocomplete(searchFn)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [isOpen, setIsOpen] = useState(false)
  const listboxId = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex(prev =>
          prev < results.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex(prev =>
          prev > 0 ? prev - 1 : results.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (activeIndex >= 0 && results[activeIndex]) {
          onSelect(results[activeIndex])
          setIsOpen(false)
        }
        break
      case 'Escape':
        setIsOpen(false)
        setActiveIndex(-1)
        inputRef.current?.focus()
        break
    }
  }

  const activeDescendantId = activeIndex >= 0
    ? \`\${listboxId}-option-\${activeIndex}\`
    : undefined

  return (
    <div role="combobox" aria-expanded={isOpen} aria-haspopup="listbox">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={e => { handleChange(e.target.value); setIsOpen(true) }}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsOpen(true)}
        aria-autocomplete="list"
        aria-controls={listboxId}
        aria-activedescendant={activeDescendantId}
        role="searchbox"
      />

      {isOpen && (
        <ul id={listboxId} role="listbox" aria-label="Search suggestions">
          {isLoading && (
            <li role="status" aria-live="polite">Searching...</li>
          )}
          {results.map((result, index) => (
            <li
              key={result.id}
              id={\`\${listboxId}-option-\${index}\`}
              role="option"
              aria-selected={index === activeIndex}
              onClick={() => { onSelect(result); setIsOpen(false) }}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <HighlightMatch text={result.title} query={query} />
            </li>
          ))}
          {!isLoading && results.length === 0 && query.length >= 2 && (
            <li role="status">No results found</li>
          )}
        </ul>
      )}
    </div>
  )
}`,
        explanation: 'The ARIA combobox pattern requires specific roles, properties, and keyboard interactions. aria-activedescendant tells the screen reader which option is focused without moving DOM focus away from the input.',
      },
      {
        title: 'Autocomplete Architecture Diagram',
        code: `// Complete autocomplete architecture
//
// User Input → Debounce (250ms) → Cache Check
//                                   ↓ miss
//                              AbortController
//                                   ↓
//                              API Request
//                                   ↓
//                              Cache Store
//                                   ↓
//                              Results State
//                                   ↓
//                         ┌─────────────────────┐
//                         │  Dropdown Panel       │
//                         │  ┌─────────────────┐ │
//                         │  │ Recent Searches  │ │  (query = '')
//                         │  ├─────────────────┤ │
//                         │  │ Suggestions      │ │  (query.length >= 2)
//                         │  │  → Highlighted   │ │
//                         │  │  → Highlighted   │ │
//                         │  │  → Highlighted   │ │
//                         │  ├─────────────────┤ │
//                         │  │ "See all results"│ │
//                         │  └─────────────────┘ │
//                         └─────────────────────┘

// Key architectural decisions:
// 1. Debounce: 200-300ms prevents excessive API calls
// 2. AbortController: cancel stale requests on new input
// 3. LRU cache: store last N query results client-side
// 4. Minimum chars: require 2+ characters before searching
// 5. Keyboard nav: full arrow key + Enter + Escape support
// 6. ARIA combobox: accessible to screen readers
// 7. Highlight matches: show why each result matched
// 8. Recent searches: value before typing (stored in localStorage)
// 9. Error boundary: graceful degradation on API failure

interface AutocompleteConfig {
  debounceMs: number        // 250ms
  minChars: number          // 2
  maxResults: number        // 8-10
  cacheSize: number         // 50 queries
  cacheTTL: number          // 5 minutes
  showRecent: boolean       // true
  maxRecent: number         // 5
  highlightMatches: boolean // true
  submitOnSelect: boolean   // depends on use case
}`,
        explanation: 'The autocomplete architecture balances responsiveness (debounce, cache), correctness (abort stale requests, race conditions), accessibility (ARIA combobox), and user experience (recent searches, match highlighting).',
      },
    ],
    commonMistakes: [
      'Not debouncing input, sending an API request on every keystroke',
      'Ignoring race conditions: stale API responses overwriting fresh results',
      'Using role="listbox" without implementing keyboard navigation (ArrowUp/Down, Enter, Escape)',
      'Not handling the empty state, loading state, and error state in the dropdown',
      'Forgetting to close the dropdown on blur/Escape and on selection',
    ],
    interviewTips: [
      'Start with the RADIO framework: requirements first, then architecture',
      'Draw the data flow: input > debounce > cache > API > results > render',
      'Discuss race condition handling with AbortController explicitly',
      'Mention accessibility as a first-class concern: ARIA combobox is expected',
      'Discuss caching strategy: LRU cache with TTL for repeated queries',
    ],
    interviewFrequency: 'very-high',
    estimatedReadTime: 18,
    prerequisites: ['sd-radio-framework', 'sd-data-fetching', 'sd-accessibility'],
    nextConcepts: [],
    commonQuestions: [
      {
        question: 'How would you handle autocomplete for a field with millions of possible values?',
        answer: 'For millions of values, always use server-side search (not client-side filtering). Use an optimized search backend (Elasticsearch, Algolia) with prefix matching. On the client, debounce at 200-300ms, cache the last 50 queries, and limit results to 8-10 items per request.',
        difficulty: 'medium',
      },
      {
        question: 'How would you implement multi-select autocomplete (like email recipients)?',
        answer: 'Use a token/chip pattern: selected items render as removable chips in the input area. The search filters out already-selected items. Support keyboard: Backspace removes the last chip, arrow keys navigate chips and suggestions. ARIA: use aria-multiselectable on the listbox.',
        difficulty: 'hard',
      },
    ],
  },
]

export function getSystemDesignConceptById(id: string): SystemDesignConcept | undefined {
  return systemDesignConcepts.find((concept) => concept.id === id)
}

export function getSystemDesignConceptsByCategory(category: SystemDesignCategory): SystemDesignConcept[] {
  return systemDesignConcepts.filter((concept) => concept.category === category)
}
