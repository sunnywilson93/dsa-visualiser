import postcss from 'postcss'
import valueParser from 'postcss-value-parser'
import { readFileSync, globSync } from 'fs'
import { resolve, relative, join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT = resolve(__dirname, '..')
const GLOBALS_PATH = resolve(ROOT, 'src/styles/globals.css')

const DYNAMIC_PROPS_ALLOWLIST = new Set([
  '--era-color',
  '--frame-color',
  '--js-viz-primary',
  '--js-viz-secondary',
  '--js-viz-tertiary',
  '--js-viz-quaternary',
  '--neon-start',
  '--neon-end',
  '--delay',
  '--glow-color',
  '--category-color',
  '--category-bg',
  '--step-color',
  '--topic-color',
  '--topic-bg',
  '--arrow-x',
  '--arrow-rotate',
  '--level-color',
  '--bucket-color',
  '--bit-color',
  '--result-color',
  '--active-color',
  '--stagger',
  '--rule-color',
])

function collectGlobalProperties(): Set<string> {
  const css = readFileSync(GLOBALS_PATH, 'utf-8')
  const root = postcss.parse(css)
  const defined = new Set<string>()

  root.walk((node) => {
    if (node.type === 'decl' && node.prop.startsWith('--')) {
      defined.add(node.prop)
    }
  })

  return defined
}

interface UnresolvedRef {
  file: string
  line: number
  prop: string
}

function findModuleFiles(): string[] {
  return globSync(join(ROOT, 'src/**/*.module.css'))
}

function collectAllModuleProperties(files: string[]): Set<string> {
  const allProps = new Set<string>()
  for (const filePath of files) {
    const css = readFileSync(filePath, 'utf-8')
    const root = postcss.parse(css, { from: filePath })
    root.walkDecls((decl) => {
      if (decl.prop.startsWith('--')) {
        allProps.add(decl.prop)
      }
    })
  }
  return allProps
}

function checkFile(
  filePath: string,
  knownProps: Set<string>
): { refs: number; unresolved: UnresolvedRef[] } {
  const css = readFileSync(filePath, 'utf-8')
  const root = postcss.parse(css, { from: filePath })
  const relPath = relative(ROOT, filePath)

  let refs = 0
  const unresolved: UnresolvedRef[] = []

  root.walkDecls((decl) => {
    const parsed = valueParser(decl.value)
    parsed.walk((node) => {
      if (node.type === 'function' && node.value === 'var') {
        refs++
        const args = node.nodes.filter(
          (n) => n.type === 'word' || n.type === 'div'
        )
        const propNode = args.find(
          (n) => n.type === 'word' && n.value.startsWith('--')
        )
        if (!propNode) return

        const propName = propNode.value
        const hasFallback = args.some((n) => n.type === 'div' && n.value === ',')

        if (knownProps.has(propName)) return
        if (hasFallback) return
        if (DYNAMIC_PROPS_ALLOWLIST.has(propName)) return

        const line = decl.source?.start?.line ?? 0
        unresolved.push({ file: relPath, line, prop: propName })
      }
    })
  })

  return { refs, unresolved }
}

function main() {
  const globalProps = collectGlobalProperties()
  const files = findModuleFiles()
  const moduleProps = collectAllModuleProperties(files)
  const knownProps = new Set([...globalProps, ...moduleProps])

  let totalRefs = 0
  const allUnresolved: UnresolvedRef[] = []

  for (const file of files) {
    const { refs, unresolved } = checkFile(file, knownProps)
    totalRefs += refs
    allUnresolved.push(...unresolved)
  }

  if (allUnresolved.length === 0) {
    console.log(
      `All var() references resolve correctly. ${totalRefs} references checked across ${files.length} files.`
    )
    process.exit(0)
  } else {
    console.error(`Found ${allUnresolved.length} unresolved var() references:\n`)
    for (const ref of allUnresolved) {
      console.error(`  ${ref.file}:${ref.line} - ${ref.prop}`)
    }
    console.error(
      `\n${totalRefs} total references checked across ${files.length} files.`
    )
    process.exit(1)
  }
}

main()
