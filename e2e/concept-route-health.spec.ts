import { expect, test } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
import { conceptCoverageBaseline } from '../src/data/conceptCoverageBaseline'

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000'

type ParsedExample = {
  id: string
  categories: string[]
}

const repoRoot = path.resolve(__dirname, '..')
const examplesPath = path.join(repoRoot, 'src/data/examples.ts')

function parseStringLiteral(node: ts.Expression | undefined): string | null {
  if (!node || !ts.isStringLiteral(node)) return null
  return node.text
}

function parseStringArray(node: ts.Expression | undefined): string[] {
  if (!node || !ts.isArrayLiteralExpression(node)) return []

  return node.elements
    .map((entry) => parseStringLiteral(entry))
    .filter((entry): entry is string => entry !== null)
}

function parseCodeExamples(source: string): ParsedExample[] {
  const sf = ts.createSourceFile('examples.ts', source, ts.ScriptTarget.ESNext, true, ts.ScriptKind.TS)
  let initializer: ts.Expression | null = null

  const visit = (node: ts.Node): void => {
    if (ts.isVariableStatement(node)) {
      const declaration = node.declarationList.declarations.find((entry) =>
        entry.name.getText(sf) === 'codeExamples',
      )
      if (declaration?.initializer) {
        initializer = declaration.initializer
      }
    }
    ts.forEachChild(node, visit)
  }

  visit(sf)

  if (!initializer) return []

  const expr = ts.isAsExpression(initializer) ? initializer.expression : initializer
  if (!ts.isArrayLiteralExpression(expr)) return []

  const examples: ParsedExample[] = []

  for (const element of expr.elements) {
    if (!ts.isObjectLiteralExpression(element)) continue

    let id: string | null = null
    let category: string | null = null
    const categories: string[] = []

    for (const property of element.properties) {
      if (!ts.isPropertyAssignment(property)) continue

      const key = property.name.getText(sf)
      if (key === 'id') {
        id = parseStringLiteral(property.initializer)
      } else if (key === 'category') {
        category = parseStringLiteral(property.initializer)
      } else if (key === 'categories') {
        categories.push(...parseStringArray(property.initializer))
      }
    }

    if (!id) continue

    const finalCategories = categories.length > 0
      ? categories
      : category
        ? [category]
        : []

    examples.push({
      id,
      categories: finalCategories,
    })
  }

  return examples
}

function parseDsaSubcategories(source: string): Set<string> {
  const sf = ts.createSourceFile('examples.ts', source, ts.ScriptTarget.ESNext, true, ts.ScriptKind.TS)
  let initializer: ts.Expression | null = null

  const visit = (node: ts.Node): void => {
    if (ts.isVariableStatement(node)) {
      const declaration = node.declarationList.declarations.find((entry) =>
        entry.name.getText(sf) === 'dsaSubcategories',
      )
      if (declaration?.initializer) {
        initializer = declaration.initializer
      }
    }
    ts.forEachChild(node, visit)
  }

  visit(sf)

  if (!initializer) return new Set()

  const expr = ts.isAsExpression(initializer) ? initializer.expression : initializer
  if (!ts.isArrayLiteralExpression(expr)) return new Set()

  const ids = new Set<string>()

  for (const element of expr.elements) {
    if (!ts.isObjectLiteralExpression(element)) continue

    for (const property of element.properties) {
      if (!ts.isPropertyAssignment(property)) continue
      if (property.name.getText(sf) !== 'id') continue
      const id = parseStringLiteral(property.initializer)
      if (id) ids.add(id)
    }
  }

  return ids
}

function parseProblemConceptIds(source: string): string[] {
  const sf = ts.createSourceFile('algorithmConcepts.ts', source, ts.ScriptTarget.ESNext, true, ts.ScriptKind.TS)
  let initializer: ts.Expression | null = null

  const visit = (node: ts.Node): void => {
    if (ts.isVariableStatement(node)) {
      const declaration = node.declarationList.declarations.find((entry) =>
        entry.name.getText(sf) === 'problemConcepts',
      )
      if (declaration?.initializer) {
        initializer = declaration.initializer
      }
    }
    ts.forEachChild(node, visit)
  }

  visit(sf)

  if (!initializer) return []

  const expr = ts.isAsExpression(initializer) ? initializer.expression : initializer
  if (!ts.isObjectLiteralExpression(expr)) return []

  return expr.properties
    .filter((property) => ts.isPropertyAssignment(property))
    .map((property) => property.name.getText(sf).replace(/['\"]/g, ''))
}

function getRouteCategories(
  example: ParsedExample,
  dsaSubcategoryIds: Set<string>,
): string[] {
  const categories = Array.from(new Set(example.categories))
  const hasDsaSubcategory = categories.some((category) => dsaSubcategoryIds.has(category))
  if (hasDsaSubcategory && !categories.includes('dsa')) {
    categories.push('dsa')
  }
  return categories
}

function buildMappedConceptRoutes(): string[] {
  const examplesSource = fs.readFileSync(examplesPath, 'utf8')
  const conceptSource = fs.readFileSync(
    path.join(repoRoot, 'src/data/algorithmConcepts.ts'),
    'utf8',
  )

  const dsaSubcategoryIds = parseDsaSubcategories(examplesSource)
  const examples = parseCodeExamples(examplesSource)
  const conceptIds = new Set(parseProblemConceptIds(conceptSource))

  const examplesById = new Map(examples.map((example) => [example.id, example]))
  const mappedRoutes = new Set<string>()

  for (const conceptId of conceptIds) {
    const example = examplesById.get(conceptId)
    if (!example) {
      continue
    }

    const routeCategories = getRouteCategories(example, dsaSubcategoryIds)
    for (const category of routeCategories) {
      mappedRoutes.add(`/${category}/${conceptId}/concept`)
    }
  }

  return [...mappedRoutes]
}

const conceptRoutes = buildMappedConceptRoutes()
if (conceptRoutes.length === 0) {
  throw new Error('No concept routes discovered for testing')
}
if (conceptRoutes.length < conceptCoverageBaseline.conceptRouteCount) {
  throw new Error(
    `Expected at least ${conceptCoverageBaseline.conceptRouteCount} concept routes; discovered ${conceptRoutes.length}`,
  )
}

test.describe('concept route health', () => {
  let appReachable = false

  test.beforeAll(async () => {
    try {
      const response = await fetch(baseURL, { method: 'GET' })
      appReachable = response.status > 0 && response.status < 500
    } catch {
      appReachable = false
    }
  })

  test.beforeEach(() => {
    test.skip(
      !appReachable,
      `App server not reachable at ${baseURL}. Start the app and set PLAYWRIGHT_BASE_URL if needed.`,
    )
  })

  for (const route of conceptRoutes) {
    test(`renders ${route}`, async ({ page }) => {
      const response = await page.goto(route)
      expect(response?.status()).toBe(200)
      await expect(page.getByText('Concept not found')).not.toBeVisible()
      await expect(page.getByText('Step-by-Step Walkthrough:')).toBeVisible()
    })
  }
})
