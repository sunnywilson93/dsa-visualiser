# Phase 19: Async/Await & Event Loop Deep Dive - Context

**Gathered:** 2026-01-30
**Status:** Ready for planning

<domain>
## Phase Boundary

Step-through visualizations teaching async/await syntax and microtask/macrotask queue ordering. Covers 7 visualizations: Promise static methods, async function suspension, error handling, parallel execution, microtask queue, task queue, and event loop tick cycle.

</domain>

<decisions>
## Implementation Decisions

### Promise.all/race/allSettled/any Comparison
- Include Promise.any (ES2021) for complete coverage — 4 methods total
- Show both single rejection and multiple rejection scenarios
- Animated timeline showing settlement order (critical for understanding Promise.race)
- Claude's discretion: Layout choice (side-by-side columns vs tabbed view)

### Async/Await Suspension Points
- Progressive disclosure: beginner hides promise internals, advanced shows implicit promise creation
- Nested async/await: simple single-function examples in beginner, nested chains in intermediate/advanced
- Reuse Phase 18 fork pattern for error propagation (ErrorFirstCallbacksViz red/green path design)
- Claude's discretion: Exact "paused at await" visual treatment (grayed function, suspended badge, etc.)

### Queue Visualization Layout
- Match existing EventLoopViz layout patterns for consistency
- Items slide out one-by-one animation (smooth FIFO removal, not flash+remove)
- Both key insights covered:
  1. Microtasks drain completely before ANY macrotask runs
  2. Microtasks can spawn more microtasks (recursive scheduling)
- Claude's discretion: Whether queue items show source labels vs color-coding only

### Event Loop Tick Granularity
- Progressive detail: beginner shows simplified cycle (check → run → repeat), advanced shows full spec detail (render steps, idle callbacks)
- Core concepts weighted by level:
  - Beginner: JavaScript is single-threaded (one task at a time)
  - Intermediate: Queue priority ordering (microtasks before macrotasks)
  - Advanced: Non-blocking I/O (async operations don't block main thread)
- Claude's discretion: Rotating position indicator vs phase labels, integration vs standalone component

</decisions>

<specifics>
## Specific Ideas

- Build error propagation visualization on Phase 18's ErrorFirstCallbacksViz fork diagram pattern
- Settlement order timing is key for Promise.race — animation should make it obvious why "first to settle wins"
- Microtask recursive scheduling example: promise.then that creates another promise.then

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 19-async-await-queues*
*Context gathered: 2026-01-30*
