import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, AlertTriangle, ArrowRight } from 'lucide-react'
import styles from './WebEvolutionViz.module.css'

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
    id: 'static',
    name: 'Static HTML',
    years: '1991-1995',
    color: '#6b7280',
    technologies: ['HTML', 'HTTP'],
    code: `<!DOCTYPE html>
<html>
<head>
  <title>My Page</title>
</head>
<body>
  <h1>Welcome!</h1>
  <p>This is static HTML.</p>
  <a href="page2.html">Next</a>
</body>
</html>`,
    solved: [
      'Created the foundation of the web',
      'Simple, fast to serve',
      'Works everywhere',
    ],
    created: [
      'No dynamic content',
      'Full page reload for any change',
      'No user interaction',
    ],
    description: 'The birth of the web - pure static HTML documents linked together.',
  },
  {
    id: 'server-scripting',
    name: 'Server-Side Scripting',
    years: '1995-2005',
    color: '#a855f7',
    technologies: ['PHP', 'CGI', 'ASP', 'JSP'],
    code: `<?php
// Server generates HTML dynamically
$user = $_SESSION['user'];
$posts = fetchFromDB("
  SELECT * FROM posts
  WHERE user_id = ?
", $user->id);
?>
<html>
<body>
  <h1>Welcome, <?= $user->name ?></h1>
  <?php foreach($posts as $post): ?>
    <article><?= $post->content ?></article>
  <?php endforeach; ?>
</body>
</html>`,
    solved: [
      'Dynamic content generation',
      'Database connectivity',
      'User sessions & auth',
    ],
    created: [
      'Still full page reloads',
      'Server does all the work',
      'Slow user interactions',
    ],
    description: 'Servers generate HTML on each request using PHP, ASP, or CGI scripts.',
  },
  {
    id: 'ajax',
    name: 'AJAX Revolution',
    years: '2005-2010',
    color: '#3b82f6',
    technologies: ['XMLHttpRequest', 'jQuery', 'JSON'],
    code: `// Partial page updates without reload!
function loadComments() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', '/api/comments');
  xhr.onload = function() {
    const comments = JSON.parse(xhr.response);
    // Update DOM without full reload
    renderComments(comments);
  };
  xhr.send();
}

// jQuery made AJAX simple
$.get('/api/comments', renderComments);`,
    solved: [
      'Partial page updates',
      'Richer user experience',
      'Less server load',
    ],
    created: [
      'Callback hell',
      'SEO problems (crawlers see empty page)',
      'Back button broken',
    ],
    description: 'AJAX enabled partial page updates - Gmail and Google Maps showed what was possible.',
  },
  {
    id: 'spa',
    name: 'Single Page Apps',
    years: '2010-2016',
    color: '#10b981',
    technologies: ['Angular', 'Backbone', 'Ember', 'React'],
    code: `// React SPA - Client renders everything
function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(setPosts);
  }, []);

  return (
    <Router>
      <Route path="/" element={<Home />} />
      <Route path="/posts" element={
        <Posts data={posts} />
      } />
    </Router>
  );
}`,
    solved: [
      'App-like experience',
      'Client-side routing (no reload)',
      'Rich component model',
    ],
    created: [
      'Large JS bundles (slow initial load)',
      'SEO disaster (empty HTML)',
      'Complex state management',
    ],
    description: 'The browser becomes the application runtime. JS frameworks take over.',
  },
  {
    id: 'ssr-return',
    name: 'SSR Returns',
    years: '2016-2020',
    color: '#f59e0b',
    technologies: ['Next.js', 'Nuxt.js', 'Gatsby'],
    code: `// Next.js - Server renders, then hydrates
export async function getServerSideProps() {
  const posts = await db.posts.findMany();
  return { props: { posts } };
}

export default function Page({ posts }) {
  // Server renders this HTML
  // Client hydrates for interactivity
  return (
    <div>
      <h1>Blog Posts</h1>
      {posts.map(post => (
        <Article key={post.id} {...post} />
      ))}
    </div>
  );
}`,
    solved: [
      'SEO fixed (full HTML sent)',
      'Fast First Contentful Paint',
      'Best of both worlds',
    ],
    created: [
      'Double rendering (server + client)',
      'Hydration mismatch bugs',
      'Server costs increased',
    ],
    description: 'Frameworks add SSR back, fixing SEO while keeping SPA benefits.',
  },
  {
    id: 'ssg',
    name: 'Static Site Generation',
    years: '2018-2022',
    color: '#ec4899',
    technologies: ['Gatsby', 'Next.js SSG', 'Astro', '11ty'],
    code: `// Next.js Static Generation
export async function getStaticProps() {
  // Runs at BUILD time, not request time
  const posts = await fetchCMS('/posts');
  return {
    props: { posts },
    revalidate: 3600 // ISR: rebuild hourly
  };
}

export async function getStaticPaths() {
  const posts = await fetchCMS('/posts');
  return {
    paths: posts.map(p => ({
      params: { slug: p.slug }
    })),
    fallback: 'blocking'
  };
}`,
    solved: [
      'Blazing fast (pre-built HTML)',
      'Cheap to host (CDN)',
      'Great SEO',
    ],
    created: [
      'Build times grow with content',
      'Stale content between builds',
      'Not for highly dynamic sites',
    ],
    description: 'Pre-render pages at build time. Perfect for blogs, docs, marketing sites.',
  },
  {
    id: 'modern-hybrid',
    name: 'Modern Hybrid',
    years: '2022-Present',
    color: '#06b6d4',
    technologies: ['React Server Components', 'Islands', 'Partial Hydration'],
    code: `// React Server Component (RSC)
// This runs ONLY on server - zero JS sent
async function BlogPosts() {
  const posts = await db.posts.findMany();
  return (
    <div>
      {posts.map(post => (
        <Article key={post.id} {...post} />
      ))}
      {/* Only this ships JS to client */}
      <LikeButton postId={post.id} />
    </div>
  );
}

// Islands: Interactive parts hydrate
// Static parts stay as HTML`,
    solved: [
      'Zero JS for static parts',
      'Smaller bundles',
      'Server + client components coexist',
    ],
    created: [
      'Mental model complexity',
      'New learning curve',
      'Ecosystem still evolving',
    ],
    description: 'Ship zero JS for static content, hydrate only interactive "islands".',
  },
]

export function WebEvolutionViz() {
  const [activeEra, setActiveEra] = useState(0)
  const era = eras[activeEra]

  const handlePrev = () => {
    if (activeEra > 0) setActiveEra(activeEra - 1)
  }

  const handleNext = () => {
    if (activeEra < eras.length - 1) setActiveEra(activeEra + 1)
  }

  return (
    <div className={styles.container}>
      {/* Timeline */}
      <div className={styles.timeline}>
        {eras.map((e, i) => (
          <button
            key={e.id}
            className={`${styles.timelineNode} ${i === activeEra ? styles.active : ''} ${i < activeEra ? styles.past : ''}`}
            onClick={() => setActiveEra(i)}
            style={{ '--era-color': e.color } as React.CSSProperties}
          >
            <span className={styles.nodeYear}>{e.years.split('-')[0]}</span>
            <span className={styles.nodeDot} />
            <span className={styles.nodeLabel}>{e.name}</span>
          </button>
        ))}
        <div className={styles.timelineLine} />
        <motion.div
          className={styles.timelineProgress}
          initial={false}
          animate={{ width: `${(activeEra / (eras.length - 1)) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Era Header */}
      <AnimatePresence mode="wait">
        <motion.div
          key={era.id}
          className={styles.eraHeader}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          style={{ '--era-color': era.color } as React.CSSProperties}
        >
          <div className={styles.eraTitle}>
            <span className={styles.eraNumber}>{activeEra + 1}</span>
            <h3>{era.name}</h3>
            <span className={styles.eraYears}>{era.years}</span>
          </div>
          <p className={styles.eraDescription}>{era.description}</p>
          <div className={styles.techTags}>
            {era.technologies.map(tech => (
              <span key={tech} className={styles.techTag}>{tech}</span>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Code Example */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`code-${era.id}`}
          className={styles.codePanel}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className={styles.codePanelHeader}>
            <span>Example Code</span>
          </div>
          <pre className={styles.code}>
            <code>{era.code}</code>
          </pre>
        </motion.div>
      </AnimatePresence>

      {/* Problems Solved / Created */}
      <div className={styles.impactGrid}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`solved-${era.id}`}
            className={styles.impactCard}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className={styles.impactHeader}>
              <Check size={16} className={styles.solvedIcon} />
              <span>Problems Solved</span>
            </div>
            <ul className={styles.impactList}>
              {era.solved.map((item, i) => (
                <motion.li
                  key={i}
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
            className={`${styles.impactCard} ${styles.createdCard}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div className={styles.impactHeader}>
              <AlertTriangle size={16} className={styles.createdIcon} />
              <span>New Challenges</span>
            </div>
            <ul className={styles.impactList}>
              {era.created.map((item, i) => (
                <motion.li
                  key={i}
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

      {/* Navigation hint */}
      {activeEra < eras.length - 1 && (
        <div className={styles.nextHint}>
          <ArrowRight size={14} />
          <span>These challenges led to: <strong>{eras[activeEra + 1].name}</strong></span>
        </div>
      )}

      {/* Controls */}
      <div className={styles.controls}>
        <button
          className={styles.btnSecondary}
          onClick={handlePrev}
          disabled={activeEra === 0}
        >
          Previous Era
        </button>
        <span className={styles.stepIndicator}>
          {activeEra + 1} / {eras.length}
        </span>
        <button
          className={styles.btnPrimary}
          onClick={handleNext}
          disabled={activeEra === eras.length - 1}
        >
          Next Era
        </button>
      </div>

      {/* Key Insight */}
      <div className={styles.insight}>
        <strong>Pattern:</strong> Each era solves previous problems but creates new ones, driving the next evolution.
      </div>
    </div>
  )
}
