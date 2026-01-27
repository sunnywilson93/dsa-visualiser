# UX Redesign for Practice Page

## Current Problems
1. **Scattered information** - Eyes jump between code (left), controls (middle), variables (right)
2. **Too many panels** - Call Stack, Variables, Console, Visualization all visible at once
3. **Disconnected experience** - Code line 5 is highlighted but variable panel is far away
4. **Wasted space** - Empty visualization panel takes up prime real estate

## New Design Philosophy
**"Contextual Focus"** - Show relevant information near where user is looking

## New Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [Back]  Problem Name  [Easy]                    "Reverse bits..."         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌────────────────────────────────────────┐  ┌─────────────────────────┐   │
│  │                                        │  │    📊 VISUALIZATION     │   │
│  │           CODE EDITOR                  │  │    (Context-aware)      │   │
│  │                                        │  │                         │   │
│  │   Line 5: let bit = n & 1;  ◄─┐        │  │   [Binary visualization │   │
│  │                               │        │  │    shows automatically  │   │
│  │   ┌─────────────────────┐     │        │  │    when relevant]       │   │
│  │   │ bit = 0  n = 432... │◄────┘        │  │                         │   │
│  │   └─────────────────────┘              │  └─────────────────────────┘   │
│  │                                        │                                │
│  └────────────────────────────────────────┘                                │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  [←] [→]  Step 5 of 32    "Extract bit using AND operation"         │   │
│  │                                                                     │   │
│  │  [▶ Play] [⟲ Reset]  Speed: [0.5x] [1x] [2x]                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  🔍 STATE  │  📋 STACK  │  🖥️ CONSOLE                                │   │
│  │                                                                     │   │
│  │  Variables (live):                 Call Stack:                      │   │
│  │  • bit = 0                         reverseBits() #0                 │   │
│  │  • n = 43261596                    n = 43261596                     │   │
│  │  • result = 0                                                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Key Changes

### 1. Bottom Control Bar
- Timeline slider with step info
- Play/Step controls
- Speed selector
- Step description in context

### 2. Code Editor with Inline Annotations
- Variables shown inline next to relevant lines
- Hover to see full values
- Highlighted line has expanded variable view

### 3. Collapsible Bottom Panel with Tabs
- **State**: Variables + Call Stack combined
- **Console**: Progressive output
- Only one tab visible at a time (or split on large screens)

### 4. Context-Aware Visualization
- Appears in right column only when relevant
- Shows array/binary/heap viz based on current step
- Auto-hides when not needed

### 5. Unified Information Flow
```
Code (left) → Controls (bottom) → State (bottom panel)
                     ↓
              Visualization (right, when relevant)
```

## Implementation Plan
1. Create new `ExecutionControls` component (bottom bar)
2. Create `StatePanel` with tabs (bottom)
3. Modify `CodeEditor` for inline annotations
4. Update `VisualizationPanel` to be context-aware
5. Redesign main layout grid
