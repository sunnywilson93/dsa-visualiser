import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './CriticalRenderPathViz.module.css'

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
  beginner: { label: 'Beginner', color: '#10b981' },
  intermediate: { label: 'Intermediate', color: '#f59e0b' },
  advanced: { label: 'Advanced', color: '#ef4444' }
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
    <div className={styles.container}>
      {/* Level selector */}
      <div className={styles.levelSelector}>
        {(Object.keys(levelInfo) as Level[]).map(lvl => (
          <button
            key={lvl}
            className={`${styles.levelBtn} ${level === lvl ? styles.activeLevel : ''}`}
            onClick={() => handleLevelChange(lvl)}
            style={{
              borderColor: level === lvl ? levelInfo[lvl].color : 'transparent',
              background: level === lvl ? `${levelInfo[lvl].color}15` : 'transparent'
            }}
          >
            <span className={styles.levelDot} style={{ background: levelInfo[lvl].color }}></span>
            {levelInfo[lvl].label}
          </button>
        ))}
      </div>

      {/* Example selector */}
      <div className={styles.exampleSelector}>
        {currentExamples.map((ex, i) => (
          <button
            key={ex.id}
            className={`${styles.exampleBtn} ${exampleIndex === i ? styles.active : ''}`}
            onClick={() => handleExampleChange(i)}
          >
            {ex.title}
          </button>
        ))}
      </div>

      {/* Code panel */}
      <div className={styles.codePanel}>
        <div className={styles.panelHeader}>Code</div>
        <pre className={styles.code}>
          {currentExample.code.map((line, i) => (
            <div
              key={i}
              ref={el => { lineRefs.current[i] = el }}
              className={`${styles.codeLine} ${currentStep.codeLine === i ? styles.activeLine : ''}`}
            >
              <span className={styles.lineNum}>{i + 1}</span>
              <span className={styles.lineCode}>{line || ' '}</span>
            </div>
          ))}
        </pre>
      </div>

      {/* Pipeline visualization - Neon Box */}
      <div className={`${styles.neonBox} ${styles.pipelineBox}`}>
        <div className={styles.neonBoxHeader}>Render Pipeline</div>
        <div className={styles.neonBoxInner}>
          <div className={styles.pipelineContainer}>
            {currentStep.pipeline.map((stage) => (
              <motion.div
                key={stage.name}
                className={`${styles.pipelineStage} ${styles[stage.status]} ${stage.blocking ? styles.blocking : ''}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className={styles.stageName}>{stage.name}</div>
                {stage.blocking && <div className={styles.blockingBadge}>BLOCKING</div>}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Trees - Neon Box */}
      {(currentStep.domTree.length > 0 || currentStep.cssomTree.length > 0 || currentStep.renderTree.length > 0) && (
        <div className={`${styles.neonBox} ${styles.treesBox}`}>
          <div className={styles.neonBoxHeader}>DOM & Render Trees</div>
          <div className={styles.neonBoxInner}>
            <div className={styles.treesContainer}>
              {currentStep.domTree.length > 0 && (
                <div className={styles.tree}>
                  <div className={styles.treeHeader}>DOM Tree</div>
                  <div className={styles.treeContent}>
                    {currentStep.domTree.map((node, i) => (
                      <div key={i} className={styles.treeNode}>{node}</div>
                    ))}
                  </div>
                </div>
              )}

              {currentStep.cssomTree.length > 0 && (
                <div className={styles.tree}>
                  <div className={styles.treeHeader}>CSSOM</div>
                  <div className={styles.treeContent}>
                    {currentStep.cssomTree.map((rule, i) => (
                      <div key={i} className={styles.treeNode}>{rule}</div>
                    ))}
                  </div>
                </div>
              )}

              {currentStep.renderTree.length > 0 && (
                <div className={styles.tree}>
                  <div className={styles.treeHeader}>Render Tree</div>
                  <div className={styles.treeContent}>
                    {currentStep.renderTree.map((node, i) => (
                      <div key={i} className={styles.treeNode}>{node}</div>
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
        <div className={`${styles.neonBox} ${styles.outputBox}`}>
          <div className={styles.neonBoxHeader}>Console Output</div>
          <div className={styles.neonBoxInner}>
            {currentStep.output.map((item, i) => (
              <span key={i} className={styles.outputItem}>{item}</span>
            ))}
          </div>
        </div>
      )}

      {/* Step description */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${level}-${exampleIndex}-${stepIndex}`}
          className={styles.description}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
        >
          <span className={styles.stepBadge}>Step {stepIndex + 1}/{currentExample.steps.length}</span>
          {currentStep.description}
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className={styles.controls}>
        <button className={styles.btnSecondary} onClick={handlePrev} disabled={stepIndex === 0}>
          Prev
        </button>
        <motion.button
          className={styles.btnPrimary}
          onClick={handleNext}
          disabled={stepIndex >= currentExample.steps.length - 1}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {stepIndex >= currentExample.steps.length - 1 ? 'Done' : 'Next'}
        </motion.button>
        <button className={styles.btnSecondary} onClick={handleReset}>
          Reset
        </button>
      </div>

      {/* Key insight */}
      <div className={styles.insight}>
        <strong>Key Insight:</strong> {currentExample.insight}
      </div>
    </div>
  )
}
