# Documentation Accuracy Audit — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correct `docs-and-architecture` so every doc matches the current `api-server` code, then propagate the corrections into the web-dashboard documentation site.

**Architecture:** A documentation-correction pass. Each task audits one document against the authoritative source (the api-server code / `schema.sql`) and rewrites the stale parts. The api-server **code is the single source of truth** — never change code to match docs; never rewrite git/migration history. The grading drift is already audited (see Ground Truth below); each remaining doc has a concrete drift list.

**Tech Stack:** Markdown docs (`docs-and-architecture`), MDX docs (`web-dashboard`), Python source (`api-server`, read-only reference).

**Spec:** `docs/superpowers/specs/2026-05-22-docs-accuracy-audit-design.md`

**Repos (absolute paths):**

- api-server (truth, read-only): `/Users/valceven/Documents/School/Thesis/api-server`
- docs-and-architecture (correct these): `/Users/valceven/Documents/School/Thesis/docs-and-architecture`
- web-dashboard (propagate): `/Users/valceven/Documents/School/Thesis/web-dashboard`

---

## Ground Truth (verified against api-server code, 2026-05-22)

**Quality grades** — `qualityGrade` is the **raw PNS grade string**, one of:
`Premium`, `Grade no. 1`, `Grade no. 2`, `Grade no. 3`, `Grade no. 4`,
`Grade no. 5`, `Off-Grade`. **No A/B/C/D letters, no Premium→A mapping.**
Source: `api-server/app/grading/grader.py` `GRADE_ORDER`.

**Graded factors** — exactly five: `broken`, `brewers`, `discolored`, `chalky`, `red`.
The `damaged` factor was removed (commit 906ddb7, 2026-05-15) and merged into
`discolored`. Source: `api-server/app/grading/grader.py` `GRADE_THRESHOLDS`,
`PARAMETER_ORDER`.

**Grade thresholds** (max % by weight) — `GRADE_THRESHOLDS` in `grader.py`:

| Grade       | broken | brewers | discolored | chalky | red |
| ----------- | ------ | ------- | ---------- | ------ | --- |
| Premium     | 5.0    | 0.10    | 0.5        | 4.0    | 1.0 |
| Grade no. 1 | 10.0   | 0.20    | 0.7        | 5.0    | 2.0 |
| Grade no. 2 | 15.0   | 0.40    | 1.0        | 7.0    | 4.0 |
| Grade no. 3 | 25.0   | 0.60    | 3.0        | 9.0    | 5.0 |
| Grade no. 4 | 35.0   | 1.00    | 5.0        | 12.0   | 6.0 |
| Grade no. 5 | 45.0   | 2.00    | 8.0        | 15.0   | 7.0 |

**`results.metrics` JSONB shape** — produced by `build_metrics()` in
`api-server/app/utils/metrics.py`. Fields:

| Field                     | Type          | Notes                                                   |
| ------------------------- | ------------- | ------------------------------------------------------- |
| `qualityGrade`            | string        | raw PNS grade                                           |
| `totalGrains`             | int           |                                                         |
| `grainSizeClass`          | string        | PNS class                                               |
| `estimatedSizeClass`      | string        | fallback estimate                                       |
| `limitingFactor`          | string        | the factor that set the grade                           |
| `brokenGrains`            | float         | % by weight                                             |
| `brewers`                 | float         | % by weight                                             |
| `chalkinessPercentage`    | float         | % by weight                                             |
| `discolorationPercentage` | float         | % by weight                                             |
| `damagedPercentage`       | float         | legacy, always `0.0`                                    |
| `redKernelPercentage`     | float         | % by weight                                             |
| `foreignCount`            | int           | count-only diagnostic                                   |
| `paddyCount`              | int           | count-only diagnostic                                   |
| `grainLengthMm`           | float \| null |                                                         |
| `rawGrade`                | string        | copy of `qualityGrade`                                  |
| `gradeOverridden`         | bool          |                                                         |
| `parameters`              | object        | `{ broken, brewers, discolored, chalky, red }` (floats) |
| `perGrain`                | array         | per-grain detail objects                                |

**Fields the docs invent that do NOT exist:** `qualityScore`, `foreignMatter`,
`moistureContent`.

> Implementers: always open the cited code file to confirm exact names/values
> before writing — the table above is a verified summary, the code is final.

---

## Task 1: Correct `metrics-contract.md`

**Files:**

- Modify: `docs-and-architecture/api-server/metrics-contract.md`
- Reference (read-only): `api-server/app/utils/metrics.py`

- [ ] **Step 1: Read both files**

Read the full `metrics-contract.md` and `api-server/app/utils/metrics.py`
(`build_metrics()` and `PNS_GRADE_NAMES`). Confirm the field list in Ground
Truth above against `build_metrics()`'s returned dict.

- [ ] **Step 2: Remove the A/B/C/D grade scheme**

Delete the entire **"Grade Mapping"** section (the table mapping
`"Premium"→"A"`, `"Grade No. 1"→"A"`, … `"Off-Grade"→"D"`). The code has no
such mapping. Replace it with a short **"Grade naming"** section stating that
`qualityGrade` and `rawGrade` both carry the raw PNS grade string verbatim, one
of: `Premium`, `Grade no. 1`–`Grade no. 5`, `Off-Grade` — and that there is no
letter-grade collapse.

- [ ] **Step 3: Rewrite the example JSON**

Replace the example `results.metrics` JSON object with one that uses the real
fields (Ground Truth table). Concretely:

```json
{
  "qualityGrade": "Grade no. 2",
  "totalGrains": 112,
  "grainSizeClass": "long",
  "estimatedSizeClass": "long",
  "limitingFactor": "chalky",
  "brokenGrains": 8.93,
  "brewers": 0.12,
  "chalkinessPercentage": 6.25,
  "discolorationPercentage": 0.71,
  "damagedPercentage": 0.0,
  "redKernelPercentage": 1.4,
  "foreignCount": 0,
  "paddyCount": 1,
  "grainLengthMm": 6.8,
  "rawGrade": "Grade no. 2",
  "gradeOverridden": false,
  "parameters": {
    "broken": 8.93,
    "brewers": 0.12,
    "discolored": 0.71,
    "chalky": 6.25,
    "red": 1.4
  },
  "perGrain": ["… per-grain objects …"]
}
```

Remove `qualityScore`, `foreignMatter`, `moistureContent` entirely. Document
`damagedPercentage` as a legacy field that is always `0.0` (the `damaged`
factor was consolidated into `discolored`).

- [ ] **Step 4: Rewrite the field table**

Update the field-reference table to exactly the 18 fields in the Ground Truth
table, with correct types (`foreignCount`/`paddyCount` are `int`, not float).
If the doc documents the `perGrain` object shape, verify it against the
`perGrain` construction in `metrics.py` and correct it.

- [ ] **Step 5: Verify no stale terms remain**

Run:

```bash
cd /Users/valceven/Documents/School/Thesis/docs-and-architecture
grep -nE 'qualityScore|foreignMatter|moistureContent|"A"|"B"|"C"|"D"|Grade Mapping' api-server/metrics-contract.md
```

Expected: no output (or only legitimate prose, e.g. a sentence that explicitly says these were removed). Investigate every hit.

- [ ] **Step 6: Commit**

```bash
cd /Users/valceven/Documents/School/Thesis/docs-and-architecture
git add api-server/metrics-contract.md
git commit -m "docs: correct metrics-contract to real build_metrics shape"
```

---

## Task 2: Correct `grading-pipeline.md`

**Files:**

- Modify: `docs-and-architecture/api-server/grading-pipeline.md`
- Reference (read-only): `api-server/app/grading/grader.py`, `api-server/app/grading/features.py`

- [ ] **Step 1: Read both files**

Read `grading-pipeline.md` fully and `api-server/app/grading/grader.py`
(`GRADE_ORDER`, `GRADE_THRESHOLDS`, `PARAMETER_ORDER`, `grade_supported_factors`).

- [ ] **Step 2: Fix the threshold table**

The doc's "Grade thresholds (PNS Table 2)" table has a **`damaged` column** —
that factor was removed. Replace the table with the five-factor table from
Ground Truth (broken, brewers, discolored, chalky, red). Verify every number
against `GRADE_THRESHOLDS` in `grader.py` — the code wins if anything differs.

- [ ] **Step 3: Verify the factor list and algorithm description**

Confirm the doc lists exactly five graded factors (broken, brewers, discolored,
chalky, red) everywhere — search for any other mention of `damaged` as a
_grading factor_ and remove/correct it. (A mention that `damaged` was
consolidated into `discolored` is fine and helpful.) Confirm the grade-naming
list and the `grade_supported_factors` rule description still match the code;
correct any drift.

- [ ] **Step 4: Verify**

Run:

```bash
cd /Users/valceven/Documents/School/Thesis/docs-and-architecture
grep -niE 'damaged' api-server/grading-pipeline.md
```

Expected: only lines that explicitly describe `damaged` as removed/consolidated — no line that treats it as a live grading factor or a threshold column.

- [ ] **Step 5: Commit**

```bash
cd /Users/valceven/Documents/School/Thesis/docs-and-architecture
git add api-server/grading-pipeline.md
git commit -m "docs: remove deleted 'damaged' factor from grading-pipeline"
```

---

## Task 3: Correct `database-schema.md`

**Files:**

- Modify: `docs-and-architecture/api-server/database-schema.md`
- Reference (read-only): `docs-and-architecture/schema.sql`, `api-server/app/utils/metrics.py`

The audit confirmed all core table definitions (REGIONS, USERS, DEVICES,
RESULTS, RESULT_IMAGES, RESULT_CORRECTIONS, DEVICE_COMMANDS, DEVICE_EVENTS,
EDGE_SESSIONS, SUGGESTIONS) match `schema.sql`. Only two corrections are needed.

- [ ] **Step 1: Fix the `results.metrics` quick-reference table**

In the `## results.metrics JSONB Shape` section, the quick-reference table is
wrong. Replace it with the real fields (Ground Truth table). In particular:

- `qualityGrade` type → raw PNS grade string (e.g. `"Grade no. 2"`), NOT `"A"|"B"|"C"|"D"`.
- Remove `qualityScore`, `foreignMatter`, `moistureContent`.
- Add the missing fields: `brewers`, `damagedPercentage`, `redKernelPercentage`,
  `foreignCount`, `paddyCount`, `estimatedSizeClass`, `gradeOverridden`, `perGrain`.
- Keep the cross-reference to `metrics-contract.md` and to
  `app/utils/metrics.py::build_metrics()`.

- [ ] **Step 2: Add SUGGESTIONS to the ER diagram**

The `suggestions` table exists in `schema.sql` but is missing from the doc's
mermaid ER diagram. Add a `SUGGESTIONS` entity (columns: `id`, `title`, `body`,
`user_id`, `created_at`) with its `user_id` → `auth.users` relationship.

- [ ] **Step 3: Verify**

Run:

```bash
cd /Users/valceven/Documents/School/Thesis/docs-and-architecture
grep -nE 'qualityScore|foreignMatter|moistureContent|"A"\|"B"\|"C"\|"D"' api-server/database-schema.md
grep -n 'SUGGESTIONS\|suggestions' api-server/database-schema.md
```

Expected: first grep empty; second grep shows the new ER entity.

- [ ] **Step 4: Commit**

```bash
cd /Users/valceven/Documents/School/Thesis/docs-and-architecture
git add api-server/database-schema.md
git commit -m "docs: fix database-schema metrics table, add suggestions to ER"
```

---

## Task 4: Correct `architecture.md`

**Files:**

- Modify: `docs-and-architecture/api-server/architecture.md`
- Reference (read-only): `api-server/app/` (routers, services, repositories, grading, utils)

Apply these audited corrections (the code is truth; re-open each cited file to
confirm before writing):

- [ ] **Step 1: Fix the endpoint table**

- `routers/edge/devices.py` — paths must include the `/edge/v1/devices` prefix
  and use `{device_id}`: `POST /edge/v1/devices/provision`,
  `POST /edge/v1/devices/claim`,
  `POST /edge/v1/devices/{device_id}/upload-training`,
  `GET /edge/v1/devices/{device_id}/status`.
- `routers/edge/sessions.py` — use `{session_id}`:
  `POST /edge/v1/sessions`, `GET /edge/v1/sessions/{session_id}`,
  `PATCH /edge/v1/sessions/{session_id}`,
  `POST /edge/v1/sessions/{session_id}/batches`,
  `POST /edge/v1/sessions/{session_id}/submit`.
- `routers/dashboard/results.py` — add the missing endpoints:
  `GET /results/images`, `GET /results/images/{image_id}/signed-url`,
  `GET /results/{result_id}/batch-images`.
- `routers/dashboard/devices.py` — add the missing `GET /devices/{device_id}`.
- `routers/dashboard/analytics.py` — fix paths: `GET /analytics/trends`,
  `GET /analytics/dashboard` (the `/analytics` prefix was missing).

- [ ] **Step 2: Fix the service/repository/grading function lists**

- `grading_service.py` — add `render_annotated_ir`, `upload_annotated_ir`,
  `upload_annotated_batch`, `upload_annotated_ir_batch`; note `grade_result` is
  `async`.
- `result_service.py` — add `get_images_by_batch`.
- `result_images_repo.py` — add `insert_batch_images`, `replace_annotated_ir`,
  `insert_annotated_batch`, `insert_annotated_ir_batch`, `get_all_by_result_id`.
- `grader.py` — add `summarize_counts`, `summarize_area_percentages`,
  `summarize_weight_percentages`, `summarize_count`, `summarize_paddy_proxy`;
  note `CLASS_COLORS` is defined in `grader.py` (and duplicated in
  `grading_service.py`).

- [ ] **Step 3: Fix the metrics constant name**

The doc references `GRADE_TO_LETTER`. The actual constant in
`api-server/app/utils/metrics.py` is `PNS_GRADE_NAMES` (a tuple of the raw PNS
grade strings — there is no letter mapping). Correct the reference.

- [ ] **Step 4: Verify**

Run:

```bash
cd /Users/valceven/Documents/School/Thesis/docs-and-architecture
grep -nE 'GRADE_TO_LETTER|GET /trends|GET /dashboard\b' api-server/architecture.md
```

Expected: no output (the `/trends` and `/dashboard` paths should now be prefixed).

- [ ] **Step 5: Commit**

```bash
cd /Users/valceven/Documents/School/Thesis/docs-and-architecture
git add api-server/architecture.md
git commit -m "docs: align architecture.md endpoints and function lists with code"
```

---

## Task 5: Correct `device-events-operations.md` + flag schema/migration inconsistency

**Files:**

- Modify: `docs-and-architecture/api-server/device-events-operations.md`
- Modify: `docs-and-architecture/api-server/database-schema.md`
- Reference (read-only): `api-server` source, `docs-and-architecture/schema.sql`, `docs-and-architecture/migrations/`

The audit found `device-events-operations.md` is mostly accurate (event tiers
INFO/WARN/ERROR, retention 14d/120d, NDJSON archive, warm-audit rules all match
the code). Two issues:

- [ ] **Step 1: Fix the pg_cron claim**

`device-events-operations.md` describes an "Optional Scheduling (Supabase
pg_cron)" `cron.schedule()` job. There is **no pg_cron implementation** anywhere
in the api-server, migrations, or schema. Reword that section to explicitly say
pg_cron scheduling is **a suggested option, not currently implemented** — or
remove it. Do not claim it exists.

- [ ] **Step 2: Add a "Known schema/migration inconsistency" note to `database-schema.md`**

Add a clearly-marked subsection to `database-schema.md` documenting this real,
verified inconsistency (do NOT change `schema.sql` or any migration file):

> **Known inconsistency — device_events vs. migrations.** The migration
> `migrations/2026-05-10_remove_mqtt_tables.sql` drops both `device_commands`
> and `device_events`. However, the current api-server code **requires
> `device_events`** — it is used by `app/routers/dashboard/events.py`,
> `app/repositories/device_events_repo.py`, and
> `app/services/device_event_service.py`. So running base + all migrations
> diverges from both `schema.sql` (which still defines `device_events`) and the
> code. A follow-up migration that re-creates `device_events` is likely needed.
> `device_commands` is currently **not referenced anywhere** in the api-server
> code. These are flagged for a team decision; this docs pass does not rewrite
> migration history.

- [ ] **Step 3: Verify**

Run:

```bash
cd /Users/valceven/Documents/School/Thesis/docs-and-architecture
grep -niE 'pg_cron|cron.schedule' api-server/device-events-operations.md
grep -n 'Known inconsistency' api-server/database-schema.md
```

Expected: pg_cron lines now explicitly say "not implemented"; the inconsistency note is present.

- [ ] **Step 4: Commit**

```bash
cd /Users/valceven/Documents/School/Thesis/docs-and-architecture
git add api-server/device-events-operations.md api-server/database-schema.md
git commit -m "docs: fix pg_cron claim, flag device_events migration inconsistency"
```

---

## Task 6: Re-sync the web-dashboard technical-reference pages

**Files:**

- Run: `web-dashboard/scripts/sync-docs.mjs` (via `npm run sync:docs`)
- Result: `web-dashboard/src/content/docs/technical-reference/*.md` (regenerated)

- [ ] **Step 1: Run the sync**

```bash
cd /Users/valceven/Documents/School/Thesis/web-dashboard
npm run sync:docs
```

Expected: `Synced 5/5 files.` The 5 technical-reference `.md` files are
regenerated from the now-corrected `docs-and-architecture` docs.

- [ ] **Step 2: Verify the corrections propagated**

```bash
cd /Users/valceven/Documents/School/Thesis/web-dashboard
grep -nE 'qualityScore|foreignMatter|moistureContent' src/content/docs/technical-reference/*.md
grep -nE 'Grade Mapping|"qualityGrade": "A"' src/content/docs/technical-reference/*.md
```

Expected: no output — the stale grading content is gone from the synced pages.

- [ ] **Step 3: Commit**

```bash
cd /Users/valceven/Documents/School/Thesis/web-dashboard
git add src/content/docs/technical-reference
git commit -m "docs: re-sync technical-reference pages from corrected source"
```

(The Husky pre-commit hook runs `lint-staged` + `npm run build` — let it run.)

---

## Task 7: Revise the web-dashboard operator-guide grading pages

**Files:**

- Modify: `web-dashboard/src/content/docs/grading-and-standards/how-grading-works.mdx`
- Modify: `web-dashboard/src/content/docs/grading-and-standards/quality-grades.mdx`
- Modify: `web-dashboard/src/content/docs/grading-and-standards/defect-types.mdx`

These are hand-written operator-guide pages. Revise them to match the Ground
Truth, keeping the operator-level tone (they explain the system to dashboard
users, not developers). Do not turn them into developer reference.

- [ ] **Step 1: Revise `quality-grades.mdx`**

State the actual grade scale explicitly: the system assigns one of seven
outcomes — `Premium`, `Grade no. 1`, `Grade no. 2`, `Grade no. 3`,
`Grade no. 4`, `Grade no. 5`, or `Off-Grade` — and explain that `Off-Grade`
means a sample exceeded the limits of every grade. Remove any wording that
implies A/B/C/D letter grades. Keep the existing `<Callout>` reminding readers
to confirm details against PNS/BAFS 290:2025.

- [ ] **Step 2: Revise `defect-types.mdx`**

Make the defect list match the five graded factors: **broken**, **brewers**,
**discolored**, **chalky**, **red** kernels. Explain `brewers` (very small
fragments) and that `broken` and `brewers` are determined by grain dimensions.
Mention `foreign matter` and `paddy` as count-only diagnostics that are
reported but not part of the grade. Remove any "damaged" defect as a separate
category — note it is covered by `discolored`.

- [ ] **Step 3: Revise `how-grading-works.mdx`**

Ensure the pipeline overview is consistent: the model detects per-grain
defects, each of the five factors is measured as a percentage, each factor is
compared to the PNS thresholds, and the overall grade is the worst factor's
grade (or `Off-Grade`). Keep it high-level.

- [ ] **Step 4: Verify**

Run:

```bash
cd /Users/valceven/Documents/School/Thesis/web-dashboard
grep -niE 'grade a\b|grade b\b|grade c\b|grade d\b|a/b/c/d' src/content/docs/grading-and-standards/*.mdx
```

Expected: no output.

- [ ] **Step 5: Commit**

```bash
cd /Users/valceven/Documents/School/Thesis/web-dashboard
git add src/content/docs/grading-and-standards
git commit -m "docs: align operator grading guide with real PNS grade scale"
```

---

## Task 8: Full verification

**Files:** none modified — verification only.

- [ ] **Step 1: web-dashboard build + tests + type-check**

```bash
cd /Users/valceven/Documents/School/Thesis/web-dashboard
npm run test
npx tsc --noEmit 2>&1 | grep -E 'features/docs|content/docs|routes/docs' ; echo "(docs tsc check done)"
npm run build
```

Expected: `npm run test` — all unit tests pass; the `tsc` grep prints nothing
(docs feature type-clean — the project has ~13 unrelated pre-existing tsc
errors that are out of scope); `npm run build` succeeds.

- [ ] **Step 2: Cross-repo grep for any remaining stale grading terms**

```bash
echo '--- docs-and-architecture ---'
grep -rniE 'qualityScore|foreignMatter|moistureContent|grade mapping' /Users/valceven/Documents/School/Thesis/docs-and-architecture/api-server/ || echo 'clean'
echo '--- web-dashboard docs ---'
grep -rniE 'qualityScore|foreignMatter|moistureContent|grade mapping' /Users/valceven/Documents/School/Thesis/web-dashboard/src/content/docs/ || echo 'clean'
```

Expected: `clean` for both (or only legitimate prose explicitly noting these
fields do not exist).

- [ ] **Step 3: Report**

Summarize: which docs were corrected, the verification results, and re-state
the flagged `device_events` migration inconsistency (Task 5) as an item needing
a team decision. No commit — this task is verification only.

---

## Notes for the implementer

- **Code is truth.** For every correction, open the cited api-server file and
  confirm the exact name/value before writing. The Ground Truth table is a
  verified summary, but the code is final.
- **Do not** modify any api-server code, and **do not** rewrite or delete
  migration files or git history. The `device_events` migration issue is
  _reported_, not fixed.
- `docs-and-architecture` has no pre-commit hook — commits there are plain.
  `web-dashboard` commits trigger the Husky hook (`lint-staged` + `npm run build`).
- Task order: Tasks 1, 2, 4 are independent. **Task 5 also edits
  `database-schema.md`, so it must run after Task 3.** Task 6 (re-sync) depends
  on Tasks 1–5 being committed. Task 7 is independent. Task 8 is last.
