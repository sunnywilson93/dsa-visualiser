import postcss from 'postcss'
import { readFileSync, globSync } from 'fs'
import { resolve, relative, join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT = resolve(__dirname, '..')

interface KeyframeViolation {
  file: string
  name: string
  line: number
}

function main() {
  const files = globSync(join(ROOT, 'src/**/*.module.css'))
  const violations: KeyframeViolation[] = []

  for (const filePath of files) {
    const css = readFileSync(filePath, 'utf-8')
    const root = postcss.parse(css, { from: filePath })
    const relPath = relative(ROOT, filePath)

    root.walkAtRules('keyframes', (atRule) => {
      violations.push({
        file: relPath,
        name: atRule.params,
        line: atRule.source?.start?.line ?? 0,
      })
    })
  }

  if (violations.length === 0) {
    console.log(
      `No @keyframes in CSS Modules. All animations correctly in @theme. ${files.length} files checked.`
    )
    process.exit(0)
  } else {
    console.error(
      `Found ${violations.length} @keyframes in CSS Modules (should be in @theme):\n`
    )
    for (const v of violations) {
      console.error(`  ${v.file}:${v.line} - @keyframes ${v.name}`)
    }
    process.exit(1)
  }
}

main()
