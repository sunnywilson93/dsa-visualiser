import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, AlertTriangle, ArrowRight } from 'lucide-react'
import styles from './BuildToolsEvolutionViz.module.css'

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
    id: 'no-build',
    name: 'No Build Step',
    years: '1995-2010',
    color: '#6b7280',
    technologies: ['Script tags', 'Manual concatenation', 'FTP upload'],
    code: `<!-- index.html - Just include scripts in order -->
<html>
<head>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div id="app"></div>

  <!-- Load in dependency order! -->
  <script src="lib/jquery.min.js"></script>
  <script src="lib/underscore.min.js"></script>
  <script src="js/utils.js"></script>
  <script src="js/models.js"></script>
  <script src="js/views.js"></script>
  <script src="js/app.js"></script>
</body>
</html>

<!-- Deploy: FTP files to server -->
<!-- Minify: Manually paste into online minifier -->
<!-- No source maps, no hot reload, no tree shaking -->`,
    solved: [
      'Simple to understand',
      'No tooling to learn',
      'Works everywhere',
    ],
    created: [
      'Manual script ordering',
      'No minification/optimization',
      'Global namespace pollution',
      'Slow page loads (many requests)',
    ],
    description: 'Just write files and upload. Simple but manual and error-prone at scale.',
  },
  {
    id: 'task-runners',
    name: 'Task Runners',
    years: '2012-2016',
    color: '#f59e0b',
    technologies: ['Grunt', 'Gulp', 'npm scripts'],
    code: `// Gruntfile.js - Configuration-based task runner
module.exports = function(grunt) {
  grunt.initConfig({
    concat: {
      dist: {
        src: ['src/js/**/*.js'],
        dest: 'dist/bundle.js'
      }
    },
    uglify: {
      dist: {
        src: 'dist/bundle.js',
        dest: 'dist/bundle.min.js'
      }
    },
    watch: {
      scripts: {
        files: ['src/**/*.js'],
        tasks: ['concat', 'uglify']
      }
    }
  });

  grunt.registerTask('build', ['concat', 'uglify']);
};

// Gulp - Code-based, streaming
gulp.task('scripts', () => {
  return gulp.src('src/**/*.js')
    .pipe(concat('bundle.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});`,
    solved: [
      'Automated build process',
      'File watching and live reload',
      'Plugin ecosystem',
    ],
    created: [
      'Complex configuration',
      'Still no module system',
      'Slow (file I/O heavy)',
      'Many plugins to configure',
    ],
    description: 'Task runners automated the boring stuff but didn\'t solve the module problem.',
  },
  {
    id: 'bundlers',
    name: 'Module Bundlers',
    years: '2014-2019',
    color: '#3b82f6',
    technologies: ['Webpack', 'Browserify', 'Rollup'],
    code: `// webpack.config.js - The configuration monster
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js'
  },
  module: {
    rules: [
      {
        test: /\\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\\.(png|svg|jpg)$/,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './index.html' }),
    new MiniCssExtractPlugin()
  ],
  optimization: {
    splitChunks: { chunks: 'all' }
  }
};

// Finally: import/export works in browser!
import { helper } from './utils';
import './styles.css';`,
    solved: [
      'Real module system for browsers',
      'Code splitting',
      'Tree shaking (Rollup)',
      'Asset handling (images, CSS)',
    ],
    created: [
      'Complex configuration',
      'Slow builds (bundle everything)',
      'Steep learning curve',
      'Heavy node_modules',
    ],
    description: 'Webpack brought modules to the browser. Powerful but notoriously hard to configure.',
  },
  {
    id: 'zero-config',
    name: 'Zero-Config Era',
    years: '2017-2020',
    color: '#8b5cf6',
    technologies: ['Create React App', 'Parcel', 'Vue CLI'],
    code: `# Create React App - Zero config to start
npx create-react-app my-app
cd my-app
npm start  # That's it!

# Parcel - Zero config bundler
# Just point at your entry file
parcel index.html

# package.json - All you need
{
  "scripts": {
    "start": "parcel index.html",
    "build": "parcel build index.html"
  }
}

// Your code - Just write it!
// Parcel auto-detects: Babel, PostCSS, TypeScript
import React from 'react';
import './styles.scss';  // Just works!

function App() {
  return <h1>Hello World</h1>;
}`,
    solved: [
      'No config to start',
      'Best practices built-in',
      'Fast onboarding',
    ],
    created: [
      'Hidden complexity (eject = chaos)',
      'Hard to customize',
      'Still slow dev server',
      'Large node_modules',
    ],
    description: 'Zero-config tools hid complexity but didn\'t solve the fundamental speed problem.',
  },
  {
    id: 'native-esm',
    name: 'Native ESM / Unbundled',
    years: '2019-Present',
    color: '#10b981',
    technologies: ['Vite', 'esbuild', 'Snowpack', 'Turbopack'],
    code: `// vite.config.js - Minimal config, maximum speed
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()]
});

// That's it! Vite uses native ES modules in dev
// No bundling during development - instant startup

// How it works:
// 1. Dev: Browser loads ES modules directly
//    <script type="module" src="/src/main.tsx">
//
// 2. Vite transforms files on-demand (not upfront)
//    Request /src/App.tsx → Transform → Serve
//
// 3. esbuild for transforms (100x faster than Babel)
//
// 4. Build: Rollup bundles for production

// Speed comparison (large project):
// Webpack dev start: 30-60 seconds
// Vite dev start:    300ms - 1 second

// HMR (Hot Module Replacement):
// Webpack: 1-3 seconds
// Vite:    <50ms`,
    solved: [
      'Instant dev server startup',
      'Lightning fast HMR',
      'Native ES modules',
      'Simple configuration',
    ],
    created: [
      'Requires modern browsers for dev',
      'Different dev/prod behavior',
      'Ecosystem still maturing',
    ],
    description: 'Vite and esbuild leverage native ES modules for 10-100x faster development.',
  },
]

export function BuildToolsEvolutionViz() {
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

      {activeEra < eras.length - 1 && (
        <div className={styles.nextHint}>
          <ArrowRight size={14} />
          <span>These challenges led to: <strong>{eras[activeEra + 1].name}</strong></span>
        </div>
      )}

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

      <div className={styles.insight}>
        <strong>Key Insight:</strong> Vite won by skipping bundling during dev. Native ESM + on-demand transforms = instant feedback.
      </div>
    </div>
  )
}
