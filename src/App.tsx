import { CodeEditor } from '@/components/CodeEditor'
import { CallStack } from '@/components/CallStack'
import { Controls } from '@/components/Controls'
import { Variables } from '@/components/Variables'
import { Console } from '@/components/Console'
import { VisualizationPanel } from '@/components/Visualization'
import { ExampleSelector } from '@/components/ExampleSelector'
import styles from './App.module.css'

function App() {
  return (
    <div className={styles.app}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>⚡</span>
            <h1 className={styles.title}>DSA Visualizer</h1>
          </div>
          <p className={styles.subtitle}>
            Step through code execution • Visualize data structures
          </p>
        </div>
        <ExampleSelector />
      </header>

      {/* Main content area */}
      <main className={styles.main}>
        {/* Left panel: Code Editor */}
        <section className={styles.editorPanel}>
          <CodeEditor />
        </section>

        {/* Center panel: Visualization and Controls */}
        <section className={styles.centerPanel}>
          <div className={styles.controlsWrapper}>
            <Controls />
          </div>
          <div className={styles.visualizationWrapper}>
            <VisualizationPanel />
          </div>
          <div className={styles.consoleWrapper}>
            <Console />
          </div>
        </section>

        {/* Right panel: Call Stack and Variables */}
        <section className={styles.inspectorPanel}>
          <div className={styles.callStackWrapper}>
            <CallStack />
          </div>
          <div className={styles.variablesWrapper}>
            <Variables />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <span>Press <kbd>Space</kbd> to run • <kbd>←</kbd><kbd>→</kbd> to step • Click gutter to set breakpoints</span>
      </footer>
    </div>
  )
}

export default App
