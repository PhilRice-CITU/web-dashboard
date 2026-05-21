# Design — Documentation Accuracy Audit (docs-and-architecture ↔ api-server)

**Date:** 2026-05-22
**Repos:** `docs-and-architecture` (primary), `web-dashboard` (propagation)
**Status:** Approved design, ready for implementation planning

## 1. Goal

Bring `docs-and-architecture` back in line with the current `api-server`
codebase, then propagate the corrections into the web-dashboard documentation
site. The docs have drifted — most visibly, they describe a quality-grade
A/B/C/D ("strict Grade A") scheme that no longer exists in the code.

## 2. Guiding principle

**The api-server code is the single source of truth.** Wherever a doc and the
code disagree, the doc is wrong and gets corrected to match the code. Do not
change api-server code to match the docs. Do not rewrite git/migration history.

## 3. Ground truth (from the api-server code, 2026-05-22)

This is the authoritative reference the corrections are made against.

**Quality grades** — `qualityGrade` stores the **raw PNS grade string**, one of:
`Premium`, `Grade no. 1`, `Grade no. 2`, `Grade no. 3`, `Grade no. 4`,
`Grade no. 5`, `Off-Grade`. There is **no** A/B/C/D letter scheme and **no**
Premium→A / Grade No. 1→A mapping. (`app/grading/grader.py` `GRADE_ORDER`.)

**Graded factors** — five: `broken`, `brewers`, `discolored`, `chalky`, `red`.
The `damaged` factor was removed (commit 906ddb7, 2026-05-15) and consolidated
into `discolored`. (`app/grading/grader.py` `GRADE_THRESHOLDS`, `PARAMETER_ORDER`.)

**`results.metrics` JSONB shape** — produced by `build_metrics()` in
`app/utils/metrics.py`: `qualityGrade`, `totalGrains`, `grainSizeClass`,
`estimatedSizeClass`, `limitingFactor`, `brokenGrains`, `brewers`,
`chalkinessPercentage`, `discolorationPercentage`, `damagedPercentage` (legacy,
always `0.0`), `redKernelPercentage`, `foreignCount`, `paddyCount`,
`grainLengthMm`, `rawGrade`, `gradeOverridden`, `parameters` (`broken`,
`brewers`, `discolored`, `chalky`, `red`), `perGrain[]`. Fields the docs
currently invent that do **not** exist: `qualityScore`, `foreignMatter`,
`moistureContent`.

> The full audit treats the code as truth for every doc — Section 3 captures the
> grading facts already verified; other docs are audited the same way during
> implementation.

## 4. Part 1 — Audit & correct `docs-and-architecture/api-server/`

One document per task. For each: read the current doc, read the corresponding
api-server code, list every drift, and rewrite the stale parts to match the
code exactly — preserving prose and structure that are still accurate.

- **`metrics-contract.md`** — _known drift._ Remove the `qualityGrade` A/B/C/D
  scheme and the "Grade Mapping" table; `qualityGrade` is the raw PNS string.
  Rewrite the example JSON and the field table to the real `build_metrics`
  shape (Section 3). Drop the invented fields. Document `damagedPercentage` as a
  legacy always-`0.0` field.
- **`grading-pipeline.md`** — _known drift._ Remove the `damaged` column from
  the threshold table (consolidated into `discolored`). Re-verify every
  threshold number, the grade names, and the algorithm description against
  `app/grading/grader.py` and `features.py`.
- **`database-schema.md`** — fix the `qualityGrade` type in the metrics
  quick-reference table. Audit the rest of the schema description against
  `schema.sql` and the api-server repositories/models.
- **`architecture.md`** — audit the directory tree, the per-layer
  service/repository function lists, and the endpoint table against the actual
  `app/` source tree. Correct any drift.
- **`device-events-operations.md`** — audit the event tiers, retention windows,
  and operational notes against the actual device-events code.
- **`schema.sql` / `migrations/`** — verify they reflect what the code expects.
  Report mismatches; do **not** rewrite migration history. If `schema.sql`
  (the fresh-install snapshot) is itself drifted, correct it; leave dated
  migration files untouched.

## 5. Part 2 — Web-dashboard documentation

- Run `npm run sync:docs` so the technical-reference pages
  (`web-dashboard/src/content/docs/technical-reference/`) pick up the corrected
  `docs-and-architecture` content.
- Revise the hand-written operator-guide grading pages to match the ground
  truth in Section 3:
  - `src/content/docs/grading-and-standards/how-grading-works.mdx`
  - `src/content/docs/grading-and-standards/quality-grades.mdx`
  - `src/content/docs/grading-and-standards/defect-types.mdx`

  Use the real grade names (`Premium`, `Grade no. 1`–`5`, `Off-Grade`) and the
  real five-factor defect set (broken, brewers, discolored, chalky, red). Keep
  the operator-level tone — these pages explain the system to dashboard users,
  not developers.

## 6. Part 3 — Verification

- `web-dashboard`: `npm run build`, `npm run test`, and
  `npx tsc --noEmit` (docs feature must stay type-clean) all pass.
- Sanity-check the corrected technical-reference pages render in the docs site.
- Confirm no remaining mention of "Grade A/B/C/D", "strict grade", `qualityScore`,
  `foreignMatter`, or `moistureContent` across `docs-and-architecture` and the
  web-dashboard docs.

## 7. Out of scope

- Changing any api-server code (it is the source of truth).
- Rewriting git history or existing dated migration files.
- The non-grading operator-guide pages in the web-dashboard.
- New documentation pages — this is a correctness pass on existing docs only.
