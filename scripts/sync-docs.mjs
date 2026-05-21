// Syncs technical-reference markdown from the sibling docs-and-architecture repo.
// Run: npm run sync:docs
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

const root = dirname(dirname(fileURLToPath(import.meta.url)))

// docs-and-architecture sits beside the MAIN repo checkout. Resolve the main
// repo via git's common dir so this also works when run from a git worktree.
let mainRepo
try {
  const gitCommonDir = execSync('git rev-parse --git-common-dir', {
    cwd: root,
    stdio: ['ignore', 'pipe', 'pipe'],
  })
    .toString()
    .trim()
  mainRepo = dirname(resolve(root, gitCommonDir))
} catch {
  console.error(
    'sync-docs: could not resolve the git common dir. Run this from inside the web-dashboard repo.',
  )
  process.exit(1)
}

const SRC = join(mainRepo, '..', 'docs-and-architecture', 'api-server')
const DEST = join(root, 'src', 'content', 'docs', 'technical-reference')

/** source file → { target, title, description } */
const FILES = {
  'architecture.md': {
    target: 'api-architecture.md',
    title: 'API architecture',
    description: 'FastAPI request flow: routers, services, repositories.',
  },
  'database-schema.md': {
    target: 'database-schema.md',
    title: 'Database schema',
    description: 'Supabase Postgres tables, relationships, and RLS policies.',
  },
  'grading-pipeline.md': {
    target: 'grading-pipeline.md',
    title: 'Grading pipeline',
    description: 'YOLO inference and PNS 290:2025 grading internals.',
  },
  'metrics-contract.md': {
    target: 'metrics-contract.md',
    title: 'Metrics contract',
    description: 'Canonical shape of the results.metrics JSON payload.',
  },
  'device-events-operations.md': {
    target: 'device-events.md',
    title: 'Device events & operations',
    description: 'Event tiers, retention windows, and operational notes.',
  },
}

await mkdir(DEST, { recursive: true })

let synced = 0
for (const [srcName, cfg] of Object.entries(FILES)) {
  const srcPath = join(SRC, srcName)
  if (!existsSync(srcPath)) {
    console.warn(`! skipped (not found): ${srcPath}`)
    continue
  }
  const body = await readFile(srcPath, 'utf8')
  // Quote the YAML scalars — titles/descriptions may contain colons.
  const frontmatter = `---\ntitle: "${cfg.title}"\ndescription: "${cfg.description}"\n---\n\n`
  await writeFile(join(DEST, cfg.target), frontmatter + body, 'utf8')
  console.log(`✓ ${srcName} → technical-reference/${cfg.target}`)
  synced++
}
console.log(`\nSynced ${synced}/${Object.keys(FILES).length} files.`)
