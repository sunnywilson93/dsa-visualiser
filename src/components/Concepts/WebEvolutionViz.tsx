'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, AlertTriangle, ArrowRight } from 'lucide-react'
import { StepControls } from '@/components/SharedViz'

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
    color: 'var(--color-purple-500)',
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
    color: 'var(--color-emerald-500)',
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
    color: 'var(--color-amber-500)',
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

  const handleReset = () => setActiveEra(0)

  return (
    <div className="flex flex-col gap-6">
      <div className="relative flex justify-between px-2 mb-2 max-md:overflow-x-auto max-md:pb-2 max-md:justify-start max-md:gap-6">
        {eras.map((e, i) => (
          <button
            key={e.id}
            className="relative z-10 flex flex-col items-center gap-1 p-0 bg-transparent border-none cursor-pointer transition-all duration-200 max-md:flex-shrink-0 group"
            onClick={() => setActiveEra(i)}
            style={{ '--era-color': e.color } as React.CSSProperties}
          >
            <span className={`text-xs font-medium transition-colors duration-200 max-md:hidden group-hover:text-gray-300 ${
              i === activeEra ? 'text-white' : i < activeEra ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {e.years.split('-')[0]}
            </span>
            <span 
              className={`w-4 h-4 rounded-full bg-[var(--color-bg-elevated)] border-2 border-white-20 transition-all duration-200 max-md:group-hover:border-[var(--era-color)] max-md:group-hover:shadow-[0_0_8px_var(--era-color)] ${
                i === activeEra 
                  ? 'scale-[1.3] shadow-[0_0_12px_var(--era-color)]' 
                  : i < activeEra 
                    ? '' 
                    : ''
              }`}
              style={{
                backgroundColor: i === activeEra || i < activeEra ? e.color : undefined,
                borderColor: i === activeEra || i < activeEra ? e.color : undefined
              }}
            />
            <span className={`text-xs whitespace-nowrap max-w-[60px] overflow-hidden text-ellipsis transition-colors duration-200 max-md:max-w-[50px] max-md:text-2xs max-md:group-hover:text-gray-300 ${
              i === activeEra 
                ? 'text-white font-semibold max-md:block max-md:absolute max-md:top-full max-md:mt-1 max-md:max-w-none' 
                : i < activeEra 
                  ? 'text-gray-300' 
                  : 'text-gray-700 max-md:hidden'
            }`}>
              {e.name}
            </span>
          </button>
        ))}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white-10 -translate-y-1/2 -z-0" />
        <motion.div
          className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-primary)] -translate-y-1/2 z-[1]"
          initial={false}
          animate={{ width: `${(activeEra / (eras.length - 1)) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={era.id}
          className="p-6 bg-gradient-to-br from-[var(--color-brand-primary-8)] to-[var(--color-brand-primary-8)] border border-white-10 rounded-xl text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          style={{ '--era-color': era.color } as React.CSSProperties}
        >
          <div className="flex items-center justify-center gap-4 mb-2 flex-wrap max-md:flex-wrap">
            <span 
              className="w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: era.color }}
            >
              {activeEra + 1}
            </span>
            <h3 className="m-0 text-lg font-semibold text-[var(--color-text-bright)] max-md:text-base">{era.name}</h3>
            <span 
              className="text-xs font-medium px-2 py-0.5 rounded-full bg-white-5"
              style={{ color: era.color }}
            >
              {era.years}
            </span>
          </div>
          <p className="m-0 mb-3 text-base text-gray-400 leading-snug">{era.description}</p>
          <div className="flex gap-1.5 justify-center flex-wrap">
            {era.technologies.map(tech => (
              <span 
                key={tech} 
                className="px-2 py-0.5 bg-white-8 border border-white-10 rounded text-2xs font-mono text-[var(--color-brand-light)]"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={`code-${era.id}`}
          className="bg-[var(--color-black-40)] border border-white/8 rounded-xl overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex justify-between items-center px-4 py-2 text-xs font-semibold text-gray-500 bg-white-5">
            <span>Example Code</span>
          </div>
          <pre className="m-0 p-4 max-h-[200px] overflow-y-auto font-mono text-2xs leading-normal text-gray-300 whitespace-pre-wrap">
            <code>{era.code}</code>
          </pre>
        </motion.div>
      </AnimatePresence>

      <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={`solved-${era.id}`}
            className="p-4 bg-[var(--color-emerald-8)] border border-[var(--color-emerald-20)] rounded-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="flex items-center gap-1.5 mb-2 text-xs font-semibold">
              <Check size={16} className="text-[var(--difficulty-1)]" />
              <span className="text-[var(--color-emerald-400)]">Problems Solved</span>
            </div>
            <ul className="m-0 p-0 list-none">
              {era.solved.map((item, i) => (
                <motion.li
                  key={i}
                  className="relative pl-3 text-xs text-gray-400 leading-normal mb-1 before:content-[''] before:absolute before:left-0 before:top-[0.45em] before:w-1.5 before:h-1.5 before:rounded-full before:bg-[var(--difficulty-1)]"
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
            className="p-4 bg-[var(--color-red-8)] border border-[var(--color-red-20)] rounded-lg"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div className="flex items-center gap-1.5 mb-2 text-xs font-semibold">
              <AlertTriangle size={16} className="text-[var(--color-accent-red)]" />
              <span className="text-[var(--color-red-400)]">New Challenges</span>
            </div>
            <ul className="m-0 p-0 list-none">
              {era.created.map((item, i) => (
                <motion.li
                  key={i}
                  className="relative pl-3 text-xs text-gray-400 leading-normal mb-1 before:content-[''] before:absolute before:left-0 before:top-[0.45em] before:w-1.5 before:h-1.5 before:rounded-full before:bg-[var(--color-accent-red)]"
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

      {activeEra < eras.length - 1 && (
        <div className="flex items-center justify-center gap-1.5 p-2 bg-[var(--color-brand-primary-8)] border border-dashed border-[var(--color-brand-primary-30)] rounded-lg text-xs text-gray-400">
          <ArrowRight size={14} className="text-[var(--color-brand-primary)] animate-pulse" />
          <span>These challenges led to: <strong className="text-[var(--color-brand-light)]">{eras[activeEra + 1].name}</strong></span>
        </div>
      )}

      <StepControls
        onPrev={handlePrev}
        onNext={handleNext}
        onReset={handleReset}
        canPrev={activeEra > 0}
        canNext={activeEra < eras.length - 1}
        stepInfo={{ current: activeEra + 1, total: eras.length }}
      />

      <div className="px-4 py-2.5 bg-[var(--color-brand-primary-8)] border border-[var(--color-brand-primary-20)] rounded-lg text-sm text-gray-400 text-center">
        <strong className="text-[var(--color-brand-primary)]">Pattern:</strong> Each era solves previous problems but creates new ones, driving the next evolution.
      </div>
    </div>
  )
}
