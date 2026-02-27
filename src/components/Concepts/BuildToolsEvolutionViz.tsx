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
    color: 'var(--color-amber-500)',
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
    color: 'var(--color-purple-500)',
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
    color: 'var(--color-emerald-500)',
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

  const handleReset = () => setActiveEra(0)

  return (
    <div className="flex flex-col gap-6">
      <div className="relative flex justify-between px-2 mb-2">
        {eras.map((e, i) => (
          <button
            key={e.id}
            className={`relative z-10 flex flex-col items-center gap-1 p-0 bg-transparent border-none cursor-pointer transition-all duration-200 ${
              i === activeEra ? '' : i < activeEra ? '' : ''
            }`}
            onClick={() => setActiveEra(i)}
            style={{ '--era-color': e.color } as React.CSSProperties}
          >
            <span className={`text-xs font-medium transition-colors duration-200 ${
              i === activeEra ? 'text-white' : i < activeEra ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {e.years.split('-')[0]}
            </span>
            <span 
              className={`w-4 h-4 rounded-full bg-[var(--color-bg-elevated)] border-2 border-white-20 transition-all duration-200 ${
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
            <span className={`text-xs whitespace-nowrap max-w-[60px] overflow-hidden text-ellipsis transition-colors duration-200 ${
              i === activeEra ? 'text-white font-semibold' : i < activeEra ? 'text-gray-300' : 'text-gray-700'
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
          <div className="flex items-center justify-center gap-4 mb-2 flex-wrap">
            <span 
              className="w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: era.color }}
            >
              {activeEra + 1}
            </span>
            <h3 className="m-0 text-lg font-semibold text-[var(--color-text-bright)]">{era.name}</h3>
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
            <div className="flex items-center gap-1.5 mb-2 text-xs font-semibold text-[var(--difficulty-1)]">
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
            <div className="flex items-center gap-1.5 mb-2 text-xs font-semibold text-[var(--color-accent-red)]">
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
        <strong className="text-[var(--color-brand-primary)]">Key Insight:</strong> Vite won by skipping bundling during dev. Native ESM + on-demand transforms = instant feedback.
      </div>
    </div>
  )
}
