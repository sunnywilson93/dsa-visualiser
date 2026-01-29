# Content Development Workflow

> Standardized 4-step process for each content phase

---

## Overview

Each phase follows a strict 4-step process before implementation:

```
┌─────────────────────────────────────────────────────────────┐
│  STEP 1: RESEARCH                                            │
│  • Identify learning blocks                                  │
│  • Find best presentation approaches                         │
│  • Research common misconceptions                            │
│  • Study how others teach this topic                         │
│  Status: 🔍 In Research → 📝 Research Complete                │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 2: RESEARCH COMPLETE                                   │
│  • All blocks identified and solutions documented            │
│  • Content scope is 100% clear                               │
│  • Examples and edge cases catalogued                        │
│  • Interview questions mapped                                │
│  Status: ✅ Research Complete → 📐 Planning                   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 3: PLAN                                                │
│  • Structure each concept                                    │
│  • Define visualizations needed                              │
│  • Create content templates                                  │
│  • Sequence and prerequisites                                │
│  Status: 📐 Planning → 💻 Implementation                      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 4: IMPLEMENT                                           │
│  • Write content following templates                         │
│  • Build visualizations                                      │
│  • Code review and testing                                   │
│  • Deploy                                                    │
│  Status: 💻 Implementation → ✅ Complete                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Research

### Objectives
- Understand what makes this topic HARD to learn
- Identify common mental blocks
- Research best pedagogical approaches
- Study real interview questions

### Research Checklist

#### 1.1 Learning Blocks Analysis
For each concept, identify:

```markdown
### Concept: [name]

#### Learning Blocks (Why is this hard?)
- [ ] Block 1: [e.g., "Students think hoisting only applies to var"]
  - Root cause: [e.g., "Many tutorials only mention var hoisting"]
  - Solution: [e.g., "Explicitly teach that let/const ARE hoisted but not initialized"]
  
- [ ] Block 2: [e.g., "TDZ is abstract"]
  - Root cause: [e.g., "Can't see TDZ, only its effects"]
  - Solution: [e.g., "Visual timeline showing TDZ period"]

- [ ] Block 3: [e.g., "Confusing hoisting with scope"]
  - Root cause: [e.g., "Both happen at compile time"]
  - Solution: [e.g., "Separate lessons: scope first, hoisting second"]
```

#### 1.2 Presentation Research
Research how others teach this:

```markdown
### Teaching Approaches Researched

| Source | Approach | Pros | Cons | Borrow? |
|--------|----------|------|------|---------|
| You Don't Know JS | Text-heavy, deep | Accurate | Too verbose | Structure |
| JavaScript.info | Code-first | Practical | Less theory | Examples |
| MDN | Reference | Complete | Not pedagogical | Technical details |
| Eloquent JS | Narrative | Engaging | Takes time | Storytelling |

### Our Differentiation
- [ ] Visual explanations (diagrams/animations)
- [ ] Interactive code execution
- [ ] Granular, 5-10 min concepts
- [ ] Interview-focused examples
```

#### 1.3 Interview Question Mining

```markdown
### Interview Questions Collected

Source: LeetCode Discuss, Glassdoor, Pramp, Interviewing.io

#### Junior Level
1. "What is hoisting?" (asked 95% of time)
   - What they want: Understanding of var vs let vs const
   - Common wrong answer: "Only var is hoisted"
   
2. "What's TDZ?" (asked 60% of time)
   - What they want: Deep understanding of let/const
   - Common wrong answer: "It's when you can't use the variable"

#### Mid Level
1. [Question]
   - What they test: [concept]
   - Follow-up questions: [list]

#### Senior Level
1. [Question]
   - What they test: [deep concept]
   - System design angle: [if applicable]
```

#### 1.4 Content Scope Definition

```markdown
### Content Scope for Phase

#### Must Include (P0)
- [ ] Topic A (interview frequency: 95%)
- [ ] Topic B (interview frequency: 80%)

#### Should Include (P1)
- [ ] Topic C (interview frequency: 60%)
- [ ] Topic D (edge cases)

#### Can Include (P2)
- [ ] Topic E (advanced patterns)
```

---

## Phase 2: Research Complete

### Completion Criteria
Before moving to planning, ALL of these must be true:

```markdown
## Research Complete Checklist

### Blocks Identified
- [ ] All learning blocks documented with solutions
- [ ] Common misconceptions catalogued
- [ ] Difficulty progression mapped

### Content Clear
- [ ] Exactly what to teach is defined
- [ ] Examples and edge cases listed
- [ ] Interview questions categorized by level

### Presentation Approach Selected
- [ ] Visual approach chosen (diagrams, animations, code)
- [ ] Interactive elements identified
- [ ] Code execution patterns decided

### Boundaries Set
- [ ] What's in scope vs out of scope
- [ ] Prerequisites defined
- [ ] Next concepts identified
```

### Sign-Off Document

```markdown
# Research Complete Sign-Off

## Phase: [Phase Name]
## Date: [Date]
## Status: ✅ READY FOR PLANNING

### Research Artifacts
- Learning blocks doc: [link]
- Interview questions: [link]
- Reference materials: [links]
- Example code snippets: [link]

### Key Insights
1. [Key insight about learning this topic]
2. [Another key insight]

### Blockers Resolved
| Block | Solution |
|-------|----------|
| [Block 1] | [How we're solving it] |
| [Block 2] | [How we're solving it] |

### Content Scope Confirmed
[X] concepts, [Y] examples, [Z] interview questions

Approved by: [Name]
```

---

## Phase 3: Plan

### Planning Checklist

#### 3.1 Concept Structure Template

```markdown
### Concept: [ID]

#### Metadata
- Title: [Name]
- Difficulty: [beginner/intermediate/advanced]
- Est. Time: [X] minutes
- Prerequisites: [list]
- Next Concepts: [list]

#### Structure
1. **Hook** (1-2 sentences)
   - Why this matters
   - Real-world relevance

2. **Core Concept** (2-3 paragraphs)
   - Clear definition
   - Mental model
   - Visual representation needed: [yes/no, describe]

3. **Examples** (3-5)
   - Example 1: [Title] - [Difficulty]
     - Code: [gist]
     - Explanation: [points]
     - Visualization needed: [yes/no]
   
   - Example 2: ...

4. **Common Mistakes** (2-3)
   - Mistake 1: [description]
     - Why it happens: [explanation]
     - Correct approach: [code]

5. **Interview Tips** (2-3)
   - Tip 1: [what to emphasize]
   - Tip 2: [trick question to watch]

6. **Practice Questions** (2-3 Q&A)
   - Q: [question]
   - A: [answer]
   - Difficulty: [easy/medium/hard]
```

#### 3.2 Visualization Planning

```markdown
### Visualizations Needed for Phase

| Concept | Type | Tool | Complexity |
|---------|------|------|------------|
| TDZ | Timeline diagram | SVG/CSS | Medium |
| Scope chain | Nested boxes | CSS/Framer | Low |
| Promise states | State machine | Animation | Medium |
| Event loop | Cycle diagram | Canvas/SVG | High |

### Interactivity Requirements
- [ ] Code playground (Monaco editor)
- [ ] Step-through execution
- [ ] Toggle between code states
- [ ] User input validation
```

#### 3.3 Content Flow

```markdown
### Concept Sequence

```
concept-a
  ↓ (prereq)
concept-b → concept-c (parallel)
  ↓
concept-d
```

### Progressive Disclosure
Week 1: concepts [a, b, c]
Week 2: concepts [d, e, f]
...
```

#### 3.4 Review Points

```markdown
### Quality Checkpoints

Before implementation, verify:
- [ ] Each concept is ONE specific topic
- [ ] Examples progress from simple to complex
- [ ] Interview questions are realistic
- [ ] Visualizations enhance understanding
- [ ] No concept exceeds 10 min read time
```

---

## Phase 4: Implement

### Implementation Checklist

#### 4.1 Content Writing

```markdown
### Content Writing Tasks

For each concept:
- [ ] Write content following template
- [ ] Create code examples
- [ ] Add inline comments
- [ ] Write explanations
- [ ] Add common mistakes
- [ ] Add interview tips
- [ ] Add Q&A

Quality checks:
- [ ] Proofread
- [ ] Code runs correctly
- [ ] Examples are clear
- [ ] No typos
```

#### 4.2 Visualization Building

```markdown
### Visualization Tasks

- [ ] Build diagram component
- [ ] Add animations/transitions
- [ ] Make interactive (if needed)
- [ ] Test on mobile
- [ ] Accessibility check (alt text, ARIA)
```

#### 4.3 Integration

```markdown
### Integration Tasks

- [ ] Add to concepts.ts
- [ ] Add navigation links
- [ ] Add to search index
- [ ] Add cross-links between concepts
- [ ] Update category pages
- [ ] Add breadcrumbs
```

#### 4.4 Testing & Review

```markdown
### Testing Checklist

- [ ] All code examples run correctly
- [ ] Links work
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Build passes
- [ ] Lighthouse score > 90

### Review Process
1. Self-review (author)
2. Code review (peer)
3. Content review (accuracy)
4. UX review (clarity)
5. Final approval
```

---

## Status Tracking

### Phase Status Labels

Use these labels in planning documents:

| Label | Meaning |
|-------|---------|
| 🔍 Step 1: Research | Currently identifying blocks and approaches |
| 📝 Step 1: Research Complete | Research done, ready for sign-off |
| ✅ Step 2: Research Complete | Signed off, ready for planning |
| 📐 Step 3: Planning | Currently planning structure and presentation |
| 💻 Step 4: Implementation | Currently writing code and content |
| 🧪 Step 4: Testing | Testing and review phase |
| ✅ Complete | Done and deployed |

### Progress Dashboard Template

```markdown
# Phase Progress Dashboard

## Phase 1: Scope & Hoisting

| Concept | Research | Plan | Implement | Status |
|---------|----------|------|-----------|--------|
| scope-basics | 🔍 | - | - | In Research |
| hoisting-variables | - | - | - | Not Started |
| hoisting-functions | - | - | - | Not Started |
| temporal-dead-zone | - | - | - | Not Started |
| lexical-scope | - | - | - | Not Started |

### Current Blockers
- None

### This Week's Goal
Complete research for all 5 concepts
```

---

## Example: Phase 1 Workflow

### Step 1: Research

```markdown
# Research: Scope & Hoisting

## Learning Blocks Identified

### Block 1: "Hoisting = moving to top"
- **Observation:** Students visualize code physically moving
- **Problem:** Leads to confusion about execution order
- **Solution:** Teach as "declarations processed before execution"
- **Visual:** Compilation phase vs execution phase diagram

### Block 2: TDZ is abstract
- **Observation:** Can't see TDZ, only experience errors
- **Problem:** Hard to understand "why can't I use this yet?"
- **Solution:** Timeline visualization with TDZ highlighted
- **Visual:** Time-based diagram showing declaration point

### Block 3: let/const not hoisted myth
- **Observation:** Many tutorials say let/const not hoisted
- **Problem:** Students confused by ReferenceError
- **Solution:** Explicit: "Hoisted but not initialized" vs "not hoisted"
- **Visual:** Compare var (undefined) vs let (TDZ error)
```

### Step 2: Research Complete

```markdown
# Research Complete: Scope & Hoisting

## Status: ✅ READY FOR PLANNING

### Key Insights
1. Must separate "scope" from "hoisting" concepts
2. TDZ needs visual timeline
3. Need to debunk "let not hoisted" myth upfront

### Content Scope
- 5 concepts total
- 15 code examples
- 12 interview questions mapped

### Blockers Resolved
| Block | Solution |
|-------|----------|
| Hoisting visualization | Two-phase diagram (compile + execute) |
| TDZ understanding | Interactive timeline with hover states |
```

### Step 3: Plan

```markdown
# Plan: Scope & Hoisting

## Concept 1: scope-basics

### Structure
1. **Hook:** "Variables live in containers called scopes"
2. **Core:** Global, function, block scope with box metaphor
3. **Examples:**
   - Ex1: Global variable (beginner)
   - Ex2: Function scope with var (beginner)
   - Ex3: Block scope with let (intermediate)
4. **Visual:** Nested scope boxes

### Visualizations
- Scope chain diagram: Nested colored boxes
- Interactive: Click to see what's accessible

## Concept 2: hoisting-variables
...
```

### Step 4: Implement

```markdown
# Implementation: Scope & Hoisting

## Completed
- [x] scope-basics content
- [x] scope-basics visualizations
- [x] hoisting-variables content
- [ ] hoisting-variables visualizations (in progress)
- [ ] hoisting-functions content
- [ ] temporal-dead-zone content
- [ ] lexical-scope content

## Testing
- [x] All code runs
- [x] Build passes
- [ ] Mobile check
- [ ] Final review
```

---

## Rules

1. **No skipping steps** - Must complete research before planning
2. **Research sign-off required** - Can't start planning without explicit approval
3. **Blocks must have solutions** - Don't document problems without fixes
4. **One concept at a time** - Finish one concept's full workflow before next
5. **Test everything** - All code must run, all links must work
