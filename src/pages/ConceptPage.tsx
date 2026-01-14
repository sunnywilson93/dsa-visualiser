import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Lightbulb, AlertTriangle, Award } from 'lucide-react'
import { NavBar } from '@/components/NavBar'
import { getConceptById } from '@/data/concepts'
import styles from './ConceptPage.module.css'

// Visualization components
import { HoistingViz } from '@/components/Concepts/HoistingViz'
import { ClosuresViz } from '@/components/Concepts/ClosuresViz'
import { ThisKeywordViz } from '@/components/Concepts/ThisKeywordViz'
import { EventLoopViz } from '@/components/Concepts/EventLoopViz'
import { PrototypesViz } from '@/components/Concepts/PrototypesViz'
import { RecursionViz } from '@/components/Concepts/RecursionViz'
import { MemoryModelViz } from '@/components/Concepts/MemoryModelViz'
import { V8EngineViz } from '@/components/Concepts/V8EngineViz'
import { NodeEventLoopViz } from '@/components/Concepts/NodeEventLoopViz'
import { StreamsBuffersViz } from '@/components/Concepts/StreamsBuffersViz'
import { CriticalRenderPathViz } from '@/components/Concepts/CriticalRenderPathViz'
import { WebWorkersViz } from '@/components/Concepts/WebWorkersViz'

const visualizations: Record<string, React.ComponentType> = {
  'hoisting': HoistingViz,
  'closures': ClosuresViz,
  'this-keyword': ThisKeywordViz,
  'event-loop': EventLoopViz,
  'prototypes': PrototypesViz,
  'recursion': RecursionViz,
  'memory-model': MemoryModelViz,
  'v8-engine': V8EngineViz,
  'nodejs-event-loop': NodeEventLoopViz,
  'streams-buffers': StreamsBuffersViz,
  'critical-render-path': CriticalRenderPathViz,
  'web-workers': WebWorkersViz,
}

const difficultyColors = {
  beginner: '#10b981',
  intermediate: '#f59e0b',
  advanced: '#ef4444',
}

export function ConceptPage() {
  const { conceptId } = useParams<{ conceptId: string }>()
  const navigate = useNavigate()

  const concept = conceptId ? getConceptById(conceptId) : undefined

  if (!concept) {
    return (
      <div className={styles.page}>
        <NavBar />
        <div className={styles.notFound}>
          <h1>Concept not found</h1>
          <Link to="/concepts">Back to Concepts</Link>
        </div>
      </div>
    )
  }

  const Visualization = visualizations[concept.id]

  return (
    <div className={styles.page}>
      <NavBar
        breadcrumbs={[
          { label: 'Concepts', path: '/concepts' },
          { label: concept.title },
        ]}
      />

      <main className={styles.main}>
        {/* Header */}
        <header className={styles.header}>
          <button className={styles.backBtn} onClick={() => navigate('/concepts')}>
            <ArrowLeft size={18} />
            <span>All Concepts</span>
          </button>

          <div className={styles.titleRow}>
            <span className={styles.icon}>{concept.icon}</span>
            <h1 className={styles.title}>{concept.title}</h1>
            <span
              className={styles.difficulty}
              style={{ background: difficultyColors[concept.difficulty] }}
            >
              {concept.difficulty}
            </span>
          </div>

          <p className={styles.description}>{concept.description}</p>
        </header>

        {/* Interactive Visualization */}
        <section className={styles.vizSection}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>🎮</span>
            Interactive Visualization
          </h2>
          <div className={styles.vizContainer}>
            {Visualization ? (
              <Visualization />
            ) : (
              <div className={styles.vizPlaceholder}>
                Visualization coming soon
              </div>
            )}
          </div>
        </section>

        {/* Key Points */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <Lightbulb size={20} className={styles.sectionIconSvg} />
            Key Points
          </h2>
          <ul className={styles.keyPoints}>
            {concept.keyPoints.map((point, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {point}
              </motion.li>
            ))}
          </ul>
        </section>

        {/* Code Examples */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>💻</span>
            Code Examples
          </h2>
          <div className={styles.examples}>
            {concept.examples.map((example, i) => (
              <motion.div
                key={i}
                className={styles.example}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <h3 className={styles.exampleTitle}>{example.title}</h3>
                <pre className={styles.code}>
                  <code>{example.code}</code>
                </pre>
                <p className={styles.explanation}>{example.explanation}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Common Mistakes */}
        {concept.commonMistakes && concept.commonMistakes.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <AlertTriangle size={20} className={styles.sectionIconSvg} />
              Common Mistakes
            </h2>
            <ul className={styles.mistakes}>
              {concept.commonMistakes.map((mistake, i) => (
                <li key={i}>{mistake}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Interview Tips */}
        {concept.interviewTips && concept.interviewTips.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Award size={20} className={styles.sectionIconSvg} />
              Interview Tips
            </h2>
            <ul className={styles.tips}>
              {concept.interviewTips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  )
}
