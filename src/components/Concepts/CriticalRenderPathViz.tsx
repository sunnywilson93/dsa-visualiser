import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepControls } from '@/components/SharedViz'

interface PipelineStage {
  name: string
  status: 'pending' | 'active' | 'done'
  blocking?: boolean
}

interface Step {
  description: string
  codeLine: number
  pipeline: PipelineStage[]
  domTree: string[]
  cssomTree: string[]
  renderTree: string[]
  output: string[]
}

interface Example {
  id: string
  title: string
  code: string[]
  steps: Step[]
  insight: string
}

type Level = 'beginner' | 'intermediate' | 'advanced'

const levelInfo: Record<Level, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: 'var(--color-emerald-500)' },
  intermediate: { label: 'Intermediate', color: 'var(--color-amber-500)' },
  advanced: { label: 'Advanced', color: 'var(--color-red-500)' }
}

const examples: Record<Level, Example[]> = {
  beginner: [
    {
      id: 'render-pipeline',
      title: 'The Render Pipeline',
      code: [
        '<html>',
        '  <head>',
        '    <link href="style.css" rel="stylesheet">',
        '  </head>',
        '  <body>',
        '    <div class="box">Hello</div>',
        '  </body>',
        '</html>',
      ],
      steps: [
        {
          description: 'Browser receives HTML and starts parsing',
          codeLine: 0,
          pipeline: [
            { name: 'HTML→DOM', status: 'active' },
            { name: 'CSS→CSSOM', status: 'pending' },
            { name: 'Render Tree', status: 'pending' },
            { name: 'Layout', status: 'pending' },
            { name: 'Paint', status: 'pending' },
          ],
          domTree: ['<html>'],
          cssomTree: [],
          renderTree: [],
          output: [],
        },
        {
          description: 'Parsing <head> - Found CSS link! Fetch begins.',
          codeLine: 2,
          pipeline: [
            { name: 'HTML→DOM', status: 'active' },
            { name: 'CSS→CSSOM', status: 'active', blocking: true },
            { name: 'Render Tree', status: 'pending' },
            { name: 'Layout', status: 'pending' },
            { name: 'Paint', status: 'pending' },
          ],
          domTree: ['<html>', '  <head>'],
          cssomTree: ['(loading...)'],
          renderTree: [],
          output: ['CSS is render-blocking!'],
        },
        {
          description: 'CSS loaded. CSSOM built. Continue HTML parsing.',
          codeLine: 4,
          pipeline: [
            { name: 'HTML→DOM', status: 'active' },
            { name: 'CSS→CSSOM', status: 'done' },
            { name: 'Render Tree', status: 'pending' },
            { name: 'Layout', status: 'pending' },
            { name: 'Paint', status: 'pending' },
          ],
          domTree: ['<html>', '  <head>', '  <body>'],
          cssomTree: ['.box { color: blue; }'],
          renderTree: [],
          output: ['CSS is render-blocking!'],
        },
        {
          description: 'DOM complete. Combine DOM + CSSOM = Render Tree',
          codeLine: 5,
          pipeline: [
            { name: 'HTML→DOM', status: 'done' },
            { name: 'CSS→CSSOM', status: 'done' },
            { name: 'Render Tree', status: 'active' },
            { name: 'Layout', status: 'pending' },
            { name: 'Paint', status: 'pending' },
          ],
          domTree: ['<html>', '  <head>', '  <body>', '    <div.box>'],
          cssomTree: ['.box { color: blue; }'],
          renderTree: ['div.box (visible)'],
          output: [],
        },
        {
          description: 'Layout: Calculate positions and sizes',
          codeLine: -1,
          pipeline: [
            { name: 'HTML→DOM', status: 'done' },
            { name: 'CSS→CSSOM', status: 'done' },
            { name: 'Render Tree', status: 'done' },
            { name: 'Layout', status: 'active' },
            { name: 'Paint', status: 'pending' },
          ],
          domTree: ['<html>', '  <head>', '  <body>', '    <div.box>'],
          cssomTree: ['.box { color: blue; }'],
          renderTree: ['div.box → x:0 y:0 w:100 h:20'],
          output: [],
        },
        {
          description: 'Paint: Fill in pixels. Page is now visible!',
          codeLine: -1,
          pipeline: [
            { name: 'HTML→DOM', status: 'done' },
            { name: 'CSS→CSSOM', status: 'done' },
            { name: 'Render Tree', status: 'done' },
            { name: 'Layout', status: 'done' },
            { name: 'Paint', status: 'active' },
          ],
          domTree: [],
          cssomTree: [],
          renderTree: [],
          output: ['First paint complete!'],
        },
      ],
      insight: 'The Critical Render Path: HTML→DOM, CSS→CSSOM, Render Tree, Layout, Paint. CSS blocks rendering!'
    },
    {
      id: 'dom-construction',
      title: 'DOM Construction',
      code: [
        '<body>',
        '  <h1>Title</h1>',
        '  <p>Paragraph</p>',
        '  <div>',
        '    <span>Nested</span>',
        '  </div>',
        '</body>',
      ],
      steps: [
        {
          description: 'Parser reads <body> - creates body node',
          codeLine: 0,
          pipeline: [
            { name: 'Parse', status: 'active' },
            { name: 'Build', status: 'pending' },
          ],
          domTree: ['body'],
          cssomTree: [],
          renderTree: [],
          output: [],
        },
        {
          description: '<h1>Title</h1> - Add child to body',
          codeLine: 1,
          pipeline: [
            { name: 'Parse', status: 'active' },
            { name: 'Build', status: 'active' },
          ],
          domTree: ['body', '  └─ h1: "Title"'],
          cssomTree: [],
          renderTree: [],
          output: [],
        },
        {
          description: '<p>Paragraph</p> - Another child',
          codeLine: 2,
          pipeline: [
            { name: 'Parse', status: 'active' },
            { name: 'Build', status: 'active' },
          ],
          domTree: ['body', '  └─ h1: "Title"', '  └─ p: "Paragraph"'],
          cssomTree: [],
          renderTree: [],
          output: [],
        },
        {
          description: '<div> with nested <span>',
          codeLine: 4,
          pipeline: [
            { name: 'Parse', status: 'active' },
            { name: 'Build', status: 'active' },
          ],
          domTree: ['body', '  └─ h1: "Title"', '  └─ p: "Paragraph"', '  └─ div', '      └─ span: "Nested"'],
          cssomTree: [],
          renderTree: [],
          output: [],
        },
        {
          description: 'DOM tree complete!',
          codeLine: 6,
          pipeline: [
            { name: 'Parse', status: 'done' },
            { name: 'Build', status: 'done' },
          ],
          domTree: ['body', '  └─ h1: "Title"', '  └─ p: "Paragraph"', '  └─ div', '      └─ span: "Nested"'],
          cssomTree: [],
          renderTree: [],
          output: ['DOM ready!'],
        },
      ],
      insight: 'HTML is parsed top-to-bottom. Each element becomes a node in the DOM tree.'
    },
  ],
  intermediate: [
    {
      id: 'render-blocking',
      title: 'Render-Blocking Resources',
      code: [
        '<head>',
        '  <!-- BLOCKS RENDER -->',
        '  <link href="styles.css" rel="stylesheet">',
        '',
        '  <!-- Does NOT block (print only) -->',
        '  <link href="print.css" media="print">',
        '',
        '  <!-- BLOCKS PARSING -->',
        '  <script src="app.js"></script>',
        '</head>',
      ],
      steps: [
        {
          description: 'Regular CSS blocks rendering until loaded',
          codeLine: 2,
          pipeline: [
            { name: 'HTML', status: 'active' },
            { name: 'CSS', status: 'active', blocking: true },
            { name: 'Render', status: 'pending' },
          ],
          domTree: [],
          cssomTree: [],
          renderTree: [],
          output: ['CSS blocks paint!'],
        },
        {
          description: 'media="print" CSS does NOT block render',
          codeLine: 5,
          pipeline: [
            { name: 'HTML', status: 'active' },
            { name: 'CSS (print)', status: 'done' },
            { name: 'Render', status: 'pending' },
          ],
          domTree: [],
          cssomTree: [],
          renderTree: [],
          output: ['CSS blocks paint!', 'print CSS ignored'],
        },
        {
          description: '<script> blocks HTML parsing!',
          codeLine: 8,
          pipeline: [
            { name: 'HTML', status: 'pending', blocking: true },
            { name: 'JS', status: 'active', blocking: true },
            { name: 'Render', status: 'pending' },
          ],
          domTree: [],
          cssomTree: [],
          renderTree: [],
          output: ['CSS blocks paint!', 'print CSS ignored', 'JS blocks parsing!'],
        },
        {
          description: 'Solution: Use defer or async for scripts',
          codeLine: -1,
          pipeline: [
            { name: 'HTML', status: 'done' },
            { name: 'JS (defer)', status: 'done' },
            { name: 'Render', status: 'done' },
          ],
          domTree: [],
          cssomTree: [],
          renderTree: [],
          output: ['defer = load async, run after HTML'],
        },
      ],
      insight: 'CSS blocks render, JS blocks parsing. Use defer/async for scripts, media queries for print CSS.'
    },
    {
      id: 'defer-vs-async',
      title: 'defer vs async',
      code: [
        '<!-- No attribute: blocks parsing -->',
        '<script src="a.js"></script>',
        '',
        '<!-- defer: load async, run after HTML -->',
        '<script defer src="b.js"></script>',
        '',
        '<!-- async: load async, run immediately -->',
        '<script async src="c.js"></script>',
      ],
      steps: [
        {
          description: 'Regular <script> blocks HTML parsing completely',
          codeLine: 1,
          pipeline: [
            { name: 'HTML Parse', status: 'pending', blocking: true },
            { name: 'Fetch JS', status: 'active' },
            { name: 'Execute JS', status: 'pending' },
          ],
          domTree: ['Parsing stopped...'],
          cssomTree: [],
          renderTree: [],
          output: [],
        },
        {
          description: 'defer: Fetch in parallel, execute after DOM ready',
          codeLine: 4,
          pipeline: [
            { name: 'HTML Parse', status: 'active' },
            { name: 'Fetch JS', status: 'active' },
            { name: 'Execute (after DOM)', status: 'pending' },
          ],
          domTree: ['Parsing continues!'],
          cssomTree: [],
          renderTree: [],
          output: ['defer: best for most scripts'],
        },
        {
          description: 'async: Fetch in parallel, execute IMMEDIATELY when ready',
          codeLine: 7,
          pipeline: [
            { name: 'HTML Parse', status: 'active' },
            { name: 'Fetch JS', status: 'active' },
            { name: 'Execute (when ready)', status: 'pending' },
          ],
          domTree: ['May interrupt!'],
          cssomTree: [],
          renderTree: [],
          output: ['defer: best for most scripts', 'async: analytics, ads'],
        },
        {
          description: 'defer maintains order, async does not',
          codeLine: -1,
          pipeline: [
            { name: 'defer', status: 'done' },
            { name: 'async', status: 'done' },
          ],
          domTree: [],
          cssomTree: [],
          renderTree: [],
          output: ['defer: ordered', 'async: race condition'],
        },
      ],
      insight: 'Use defer for scripts that need DOM. Use async for independent scripts (analytics). Never block the parser!'
    },
  ],
  advanced: [
    {
      id: 'reflow-repaint',
      title: 'Reflow vs Repaint',
      code: [
        '// REPAINT only (cheap)',
        'el.style.color = "red";',
        'el.style.background = "blue";',
        '',
        '// REFLOW + REPAINT (expensive)',
        'el.style.width = "200px";',
        'el.style.fontSize = "20px";',
        '',
        '// NEITHER (compositor only)',
        'el.style.transform = "translateX(10px)";',
        'el.style.opacity = "0.5";',
      ],
      steps: [
        {
          description: 'REPAINT: Only visual changes, no geometry change',
          codeLine: 1,
          pipeline: [
            { name: 'Layout', status: 'pending' },
            { name: 'Paint', status: 'active' },
            { name: 'Composite', status: 'pending' },
          ],
          domTree: [],
          cssomTree: [],
          renderTree: ['color: red'],
          output: ['Repaint is cheap'],
        },
        {
          description: 'REFLOW: Geometry changed, must recalculate layout',
          codeLine: 5,
          pipeline: [
            { name: 'Layout', status: 'active', blocking: true },
            { name: 'Paint', status: 'pending' },
            { name: 'Composite', status: 'pending' },
          ],
          domTree: [],
          cssomTree: [],
          renderTree: ['width: 200px'],
          output: ['Repaint is cheap', 'Reflow is EXPENSIVE!'],
        },
        {
          description: 'Reflow triggers repaint of affected elements',
          codeLine: 6,
          pipeline: [
            { name: 'Layout', status: 'done' },
            { name: 'Paint', status: 'active' },
            { name: 'Composite', status: 'pending' },
          ],
          domTree: [],
          cssomTree: [],
          renderTree: ['All children repainted'],
          output: ['Repaint is cheap', 'Reflow is EXPENSIVE!'],
        },
        {
          description: 'transform/opacity: GPU only, no layout or paint!',
          codeLine: 9,
          pipeline: [
            { name: 'Layout', status: 'pending' },
            { name: 'Paint', status: 'pending' },
            { name: 'Composite', status: 'active' },
          ],
          domTree: [],
          cssomTree: [],
          renderTree: ['GPU accelerated'],
          output: ['transform/opacity = FREE!'],
        },
      ],
      insight: 'Animate transform/opacity for 60fps. Avoid animating width/height/margin (triggers reflow).'
    },
    {
      id: 'layout-thrashing',
      title: 'Layout Thrashing',
      code: [
        '// BAD: Layout thrashing',
        'for (let i = 0; i < 100; i++) {',
        '  el.style.width = el.offsetWidth + 10 + "px";',
        '  // Read → Write → Read → Write...',
        '}',
        '',
        '// GOOD: Batch reads, then writes',
        'const width = el.offsetWidth;',
        'el.style.width = width + 1000 + "px";',
      ],
      steps: [
        {
          description: 'Reading offsetWidth forces layout calculation',
          codeLine: 2,
          pipeline: [
            { name: 'Read', status: 'active' },
            { name: 'Layout', status: 'active', blocking: true },
            { name: 'Write', status: 'pending' },
          ],
          domTree: [],
          cssomTree: [],
          renderTree: ['Force layout!'],
          output: [],
        },
        {
          description: 'Writing style invalidates layout',
          codeLine: 2,
          pipeline: [
            { name: 'Read', status: 'done' },
            { name: 'Layout', status: 'pending' },
            { name: 'Write', status: 'active' },
          ],
          domTree: [],
          cssomTree: [],
          renderTree: ['Layout invalidated'],
          output: ['Layout forced'],
        },
        {
          description: 'Next read forces ANOTHER layout! 100 layouts in loop!',
          codeLine: 2,
          pipeline: [
            { name: 'Read', status: 'active', blocking: true },
            { name: 'Layout', status: 'active', blocking: true },
            { name: 'Write', status: 'active' },
          ],
          domTree: [],
          cssomTree: [],
          renderTree: ['100 LAYOUTS!'],
          output: ['Layout forced', '...x100 = SLOW!'],
        },
        {
          description: 'FIX: Read once, write once. Only 1 layout!',
          codeLine: 7,
          pipeline: [
            { name: 'Read', status: 'done' },
            { name: 'Layout', status: 'done' },
            { name: 'Write', status: 'done' },
          ],
          domTree: [],
          cssomTree: [],
          renderTree: ['1 layout only'],
          output: ['Batch: Read all, then write all'],
        },
      ],
      insight: 'Never interleave reads and writes! Batch all reads first, then all writes. Use requestAnimationFrame.'
    },
  ],
}

export function CriticalRenderPathViz() {
  const [level, setLevel] = useState<Level>('beginner')
  const [exampleIndex, setExampleIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const lineRefs = useRef<(HTMLDivElement | null)[]>([])

  const currentExamples = examples[level]
  const currentExample = currentExamples[exampleIndex]
  const currentStep = currentExample.steps[stepIndex]

  useEffect(() => {
    const highlightedLine = currentStep.codeLine
    if (highlightedLine >= 0 && lineRefs.current[highlightedLine]) {
      lineRefs.current[highlightedLine]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }, [stepIndex, currentStep.codeLine])

  const handleLevelChange = (newLevel: Level) => {
    setLevel(newLevel)
    setExampleIndex(0)
    setStepIndex(0)
  }

  const handleExampleChange = (index: number) => {
    setExampleIndex(index)
    setStepIndex(0)
  }

  const handleNext = () => {
    if (stepIndex < currentExample.steps.length - 1) setStepIndex(s => s + 1)
  }

  const handlePrev = () => {
    if (stepIndex > 0) setStepIndex(s => s - 1)
  }

  const handleReset = () => setStepIndex(0)

  return (
    <div className="flex flex-col gap-6">
      {/* Level selector */}
      <div className="flex gap-2 justify-center mb-1 p-1.5 bg-black-30 border border-white/[0.08] rounded-full">
        {(Object.keys(levelInfo) as Level[]).map(lvl => (
          <button
            key={lvl}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-full cursor-pointer transition-all duration-200 ${
              level === lvl
                ? 'text-white'
                : 'bg-white/[0.04] border border-white/[0.08] text-gray-500 hover:bg-white/[0.08] hover:text-gray-300'
            }`}
            onClick={() => handleLevelChange(lvl)}
            style={{
              borderColor: level === lvl ? levelInfo[lvl].color : undefined,
              background: level === lvl ? `${levelInfo[lvl].color}15` : undefined
            }}
          >
            <span className="w-4 h-4 rounded-full" style={{ background: levelInfo[lvl].color }} />
            {levelInfo[lvl].label}
          </button>
        ))}
      </div>

      {/* Example selector */}
      <div className="flex gap-2 flex-wrap justify-center p-1.5 bg-black-30 border border-white/[0.08] rounded-full">
        {currentExamples.map((ex, i) => (
          <button
            key={ex.id}
            className={`px-4 py-1.5 font-mono text-sm rounded-full cursor-pointer transition-all duration-200 ${
              exampleIndex === i
                ? 'bg-blue-500/20 border border-blue-500/50 text-white shadow-[0_0_12px_rgba(59,130,246,0.25)]'
                : 'bg-white/[0.04] border border-white/[0.08] text-gray-500 hover:bg-white/[0.08] hover:text-gray-300'
            }`}
            onClick={() => handleExampleChange(i)}
          >
            {ex.title}
          </button>
        ))}
      </div>

      {/* Code panel */}
      <div className="rounded-xl overflow-hidden border border-white/[0.08] bg-black-40">
        <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-white-5">Code</div>
        <pre className="m-0 py-2 px-0 max-h-[150px] overflow-y-auto font-mono">
          {currentExample.code.map((line, i) => (
            <div
              key={i}
              ref={el => { lineRefs.current[i] = el }}
              className={`flex px-3 py-0.5 transition-colors duration-200 ${
                currentStep.codeLine === i ? 'bg-blue-500/20' : ''
              }`}
            >
              <span className="w-6 text-gray-600 font-mono text-[10px] select-none">{i + 1}</span>
              <span className={`font-mono text-[10px] ${currentStep.codeLine === i ? 'text-blue-300' : 'text-gray-300'}`}>
                {line || ' '}
              </span>
            </div>
          ))}
        </pre>
      </div>

      {/* Pipeline visualization - Neon Box */}
      <div className="relative rounded-xl p-[3px]" style={{ background: 'var(--gradient-neon-blue)' }}>
        <div className="absolute -top-px left-1/2 -translate-x-1/2 px-6 py-1 bg-gray-800 rounded-b-lg text-sm font-semibold text-white whitespace-nowrap z-10">
          Render Pipeline
        </div>
        <div className="bg-[var(--color-bg-page-secondary,#0f172a)] rounded-lg min-h-[60px] p-4 pt-6">
          <div className="flex gap-1.5 flex-wrap justify-center">
            {currentStep.pipeline.map((stage) => (
              <motion.div
                key={stage.name}
                className={`flex-1 min-w-[70px] p-2 rounded-md text-center relative border-2 ${
                  stage.status === 'pending'
                    ? 'opacity-50 bg-white-5 border-white-10'
                    : stage.status === 'active'
                    ? 'border-blue-500/60 bg-blue-500/10 shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                    : stage.blocking
                    ? 'border-red-500/60 bg-red-500/10'
                    : 'border-emerald-500/60 bg-emerald-500/10'
                }`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className={`text-[10px] font-semibold ${
                  stage.status === 'active' ? 'text-blue-300' :
                  stage.status === 'done' ? 'text-emerald-400' :
                  stage.blocking ? 'text-red-400' : 'text-gray-500'
                }`}>{stage.name}</div>
                {stage.blocking && (
                  <div className="absolute -top-1.5 -right-1.5 px-1 py-0.5 text-[8px] font-semibold text-white bg-red-500 rounded">
                    BLOCKING
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Trees - Neon Box */}
      {(currentStep.domTree.length > 0 || currentStep.cssomTree.length > 0 || currentStep.renderTree.length > 0) && (
        <div className="relative rounded-xl p-[3px]" style={{ background: 'var(--gradient-neon-orange)' }}>
          <div className="absolute -top-px left-1/2 -translate-x-1/2 px-6 py-1 bg-gray-800 rounded-b-lg text-sm font-semibold text-white whitespace-nowrap z-10">
            DOM & Render Trees
          </div>
          <div className="bg-[var(--color-bg-page-secondary,#0f172a)] rounded-lg min-h-[60px] p-4 pt-6">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-2">
              {currentStep.domTree.length > 0 && (
                <div className="bg-white-5 rounded-md overflow-hidden border border-white-10">
                  <div className="px-2 py-1 text-[10px] font-semibold text-amber-400 bg-amber-500/10 text-center">DOM Tree</div>
                  <div className="p-1.5 min-h-[50px]">
                    {currentStep.domTree.map((node, i) => (
                      <div key={i} className="font-mono text-xs text-gray-300 py-0.5 whitespace-pre">{node}</div>
                    ))}
                  </div>
                </div>
              )}

              {currentStep.cssomTree.length > 0 && (
                <div className="bg-white-5 rounded-md overflow-hidden border border-white-10">
                  <div className="px-2 py-1 text-[10px] font-semibold text-amber-400 bg-amber-500/10 text-center">CSSOM</div>
                  <div className="p-1.5 min-h-[50px]">
                    {currentStep.cssomTree.map((rule, i) => (
                      <div key={i} className="font-mono text-xs text-gray-300 py-0.5">{rule}</div>
                    ))}
                  </div>
                </div>
              )}

              {currentStep.renderTree.length > 0 && (
                <div className="bg-white-5 rounded-md overflow-hidden border border-white-10">
                  <div className="px-2 py-1 text-[10px] font-semibold text-amber-400 bg-amber-500/10 text-center">Render Tree</div>
                  <div className="p-1.5 min-h-[50px]">
                    {currentStep.renderTree.map((node, i) => (
                      <div key={i} className="font-mono text-xs text-gray-300 py-0.5">{node}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Output - Neon Box */}
      {currentStep.output.length > 0 && (
        <div className="relative rounded-xl p-[3px]" style={{ background: 'var(--gradient-neon-emerald)' }}>
          <div className="absolute -top-px left-1/2 -translate-x-1/2 px-6 py-1 bg-gray-800 rounded-b-lg text-sm font-semibold text-white whitespace-nowrap z-10">
            Console Output
          </div>
          <div className="bg-[var(--color-bg-page-secondary,#0f172a)] rounded-lg min-h-[50px] p-4 pt-6 flex gap-3 items-center flex-wrap">
            {currentStep.output.map((item, i) => (
              <span key={i} className="font-mono text-xs text-emerald-500">{item}</span>
            ))}
          </div>
        </div>
      )}

      {/* Step description */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${level}-${exampleIndex}-${stepIndex}`}
          className="px-4 py-2.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-base text-gray-300 text-center"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
        >
          {currentStep.description}
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <StepControls
        onPrev={handlePrev}
        onNext={handleNext}
        onReset={handleReset}
        canPrev={stepIndex > 0}
        canNext={stepIndex < currentExample.steps.length - 1}
        stepInfo={{ current: stepIndex + 1, total: currentExample.steps.length }}
      />

      {/* Key insight */}
      <div className="px-4 py-2 bg-blue-500/[0.08] border border-blue-500/20 rounded-lg text-xs text-gray-500 text-center">
        <strong className="text-blue-500">Key Insight:</strong> {currentExample.insight}
      </div>
    </div>
  )
}
