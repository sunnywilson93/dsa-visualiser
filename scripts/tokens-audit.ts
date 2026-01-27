import postcss from 'postcss'
import valueParser from 'postcss-value-parser'
import { readFileSync, globSync } from 'fs'
import { resolve, relative, join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT = resolve(__dirname, '..')
const GLOBALS_PATH = resolve(ROOT, 'src/styles/globals.css')

interface TokenDefinition {
  prop: string
  value: string
}

function collectGlobalTokens(): TokenDefinition[] {
  const css = readFileSync(GLOBALS_PATH, 'utf-8')
  const root = postcss.parse(css)
  const tokens: TokenDefinition[] = []

  root.walk((node) => {
    if (node.type === 'decl' && node.prop.startsWith('--')) {
      tokens.push({ prop: node.prop, value: node.value })
    }
  })

  return tokens
}

function collectModuleReferences(files: string[]): Map<string, Set<string>> {
  const refs = new Map<string, Set<string>>()

  for (const filePath of files) {
    const css = readFileSync(filePath, 'utf-8')
    const root = postcss.parse(css, { from: filePath })
    const relPath = relative(ROOT, filePath)

    root.walkDecls((decl) => {
      const parsed = valueParser(decl.value)
      parsed.walk((node) => {
        if (node.type === 'function' && node.value === 'var') {
          const propNode = node.nodes.find(
            (n) => n.type === 'word' && n.value.startsWith('--')
          )
          if (propNode) {
            const propName = propNode.value
            if (!refs.has(propName)) refs.set(propName, new Set())
            refs.get(propName)!.add(relPath)
          }
        }
      })
    })
  }

  return refs
}

function collectComponentScoped(files: string[]): Map<string, Set<string>> {
  const scoped = new Map<string, Set<string>>()

  for (const filePath of files) {
    const css = readFileSync(filePath, 'utf-8')
    const root = postcss.parse(css, { from: filePath })
    const relPath = relative(ROOT, filePath)

    const localDefs = new Set<string>()
    const localRefs = new Set<string>()

    root.walkDecls((decl) => {
      if (decl.prop.startsWith('--')) {
        localDefs.add(decl.prop)
      }
      const parsed = valueParser(decl.value)
      parsed.walk((node) => {
        if (node.type === 'function' && node.value === 'var') {
          const propNode = node.nodes.find(
            (n) => n.type === 'word' && n.value.startsWith('--')
          )
          if (propNode) localRefs.add(propNode.value)
        }
      })
    })

    for (const prop of localDefs) {
      if (localRefs.has(prop)) {
        if (!scoped.has(prop)) scoped.set(prop, new Set())
        scoped.get(prop)!.add(relPath)
      }
    }
  }

  return scoped
}

function main() {
  const globalTokens = collectGlobalTokens()
  const globalNames = new Set(globalTokens.map((t) => t.prop))

  const files = globSync(join(ROOT, 'src/**/*.module.css'))
  const moduleRefs = collectModuleReferences(files)
  const componentScoped = collectComponentScoped(files)

  const uniqueRefs = new Set(moduleRefs.keys())
  const unused = globalTokens.filter(
    (t) => !moduleRefs.has(t.prop) && !t.prop.endsWith(': initial')
  )
  const unresolved = [...uniqueRefs].filter((r) => !globalNames.has(r))

  console.log('=== CSS Token Usage Audit ===\n')
  console.log(`Global tokens defined:     ${globalTokens.length}`)
  console.log(`Unique var() references:   ${uniqueRefs.size}`)
  console.log(`Module files scanned:      ${files.length}`)
  console.log()

  console.log(`--- Unused tokens (defined globally, never referenced in modules): ${unused.length} ---`)
  if (unused.length > 0) {
    for (const t of unused.slice(0, 50)) {
      console.log(`  ${t.prop}: ${t.value.substring(0, 60)}`)
    }
    if (unused.length > 50) {
      console.log(`  ... and ${unused.length - 50} more`)
    }
  } else {
    console.log('  None')
  }
  console.log()

  console.log(`--- Unresolved references (used in modules, not in globals): ${unresolved.length} ---`)
  if (unresolved.length > 0) {
    for (const prop of unresolved) {
      const usedIn = [...(moduleRefs.get(prop) ?? [])]
      console.log(`  ${prop} (used in ${usedIn.length} file${usedIn.length > 1 ? 's' : ''})`)
      for (const f of usedIn.slice(0, 3)) {
        console.log(`    - ${f}`)
      }
      if (usedIn.length > 3) {
        console.log(`    ... and ${usedIn.length - 3} more`)
      }
    }
  } else {
    console.log('  None')
  }
  console.log()

  console.log(`--- Component-scoped tokens (defined + used in same module): ${componentScoped.size} ---`)
  if (componentScoped.size > 0) {
    for (const [prop, filesSet] of componentScoped) {
      console.log(`  ${prop} (in ${[...filesSet].join(', ')})`)
    }
  } else {
    console.log('  None')
  }
}

main()
