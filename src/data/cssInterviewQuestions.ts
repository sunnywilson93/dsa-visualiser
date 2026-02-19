export type CSSInterviewTopic =
  | 'core-fundamentals'
  | 'layout-systems'
  | 'modern-css'
  | 'architecture-performance'

export interface CSSInterviewQuestion {
  id: number
  title: string
  difficulty: 'easy' | 'medium' | 'hard'
  topic: CSSInterviewTopic
  subtopic: string
  answer: string
  codeExample?: string
  followUp: string
  keyTakeaway: string
}

export interface CSSTopicConfig {
  id: CSSInterviewTopic
  label: string
  description: string
}

export const cssTopics: CSSTopicConfig[] = [
  {
    id: 'core-fundamentals',
    label: 'Core Fundamentals',
    description: 'Box model, specificity, cascade, positioning, units',
  },
  {
    id: 'layout-systems',
    label: 'Layout Systems',
    description: 'Flexbox, Grid, responsive design, container queries',
  },
  {
    id: 'modern-css',
    label: 'Modern CSS',
    description: 'Selectors, variables, animations, pseudo-elements',
  },
  {
    id: 'architecture-performance',
    label: 'Architecture & Perf',
    description: 'Methodologies, render pipeline, specificity management',
  },
]

export const cssTopicMap: Record<CSSInterviewTopic, CSSTopicConfig> =
  Object.fromEntries(cssTopics.map((t) => [t.id, t])) as Record<CSSInterviewTopic, CSSTopicConfig>

export const cssInterviewQuestions: CSSInterviewQuestion[] = []

export function filterCSSQuestions(
  questions: CSSInterviewQuestion[],
  difficulty: 'all' | 'easy' | 'medium' | 'hard',
  topic: 'all' | CSSInterviewTopic,
): CSSInterviewQuestion[] {
  return questions.filter((q) => {
    if (difficulty !== 'all' && q.difficulty !== difficulty) return false
    if (topic !== 'all' && q.topic !== topic) return false
    return true
  })
}
