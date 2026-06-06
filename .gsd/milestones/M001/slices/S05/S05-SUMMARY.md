---
id: S05
parent: M001
milestone: M001
provides:
  - skills/agent-first-cli/README.md — human-facing skill entry with submodule init snippet and 8-axis evidence table
  - skills/agent-first-cli/tests/s05-readme-evidence.test.mjs — reusable verification battery (10 node:test assertions) for README citation correctness
  - Canonical axis→file mapping that S04's verify sub-command can consume as evidence format guidance
  - Proof that R009 (gitignorer as the 8-axis reference) is satisfied
requires:
  - slice: S01
    provides: git submodule wiring (.gitmodules entry for assets/samples/gitignorer) and the populated sample asset at pinned commit fb4357f7
  - slice: S02
    provides: AGENTS.md strict bidirectional coverage rule referenced as a back-pointer in the README
  - slice: S03
    provides: 5 reference files (stack, features, architecture, pitfalls, requirements) and the axis naming/citation conventions used in the evidence table
  - slice: S04
    provides: references/eval.md as the canonical axis list referenced by the README's evidence table
affects:
  []
key_files:
  - skills/agent-first-cli/README.md
  - skills/agent-first-cli/tests/s05-readme-evidence.test.mjs
key_decisions:
  - README table header reads `| Axis |` (not `| Axis: |`) so the plan-author's verification regex `^| Axis:` returns exactly the 8 data rows; the colon-form `Axis: N` is preserved inside each row for the strict-rule canonical form.
  - T02 test battery uses a dual-base path resolver (repo-relative paths against repoRoot, skill-relative against skillRoot) to support either citation style without skewing assertion counts.
  - T02 line-range citations like `errors.ts:16-103` strip the `:N-M` suffix before fs.access; a separate assertion verifies the cited range contains claimed patterns.
  - T02 deep-link prohibition regex matches only the 8 real reference-file names (architecture/eval/features/pitfalls/requirements/stack/validate/verify), not the literal `<file>` placeholder — preserves meta-prose that describes the avoided form.
patterns_established:
  - Reusable node:test battery pattern for documentation-as-evidence files: every cited path is verified to resolve, every line range is verified to contain the claimed pattern, and forbidden-token gates include prohibition-verb carve-outs (per MEM018).
  - Human-facing skill README as a separate file from agent-facing SKILL.md: SKILL.md is for routing (frontmatter + sub-command table), README is for landing (overview + submodule init + evidence table).
observability_surfaces:
  - skills/agent-first-cli/tests/s05-readme-evidence.test.mjs — executable verification gate that surfaces README citation drift as failing assertions when the gitignorer submodule is updated or cited paths are renamed.
drill_down_paths:
  - .gsd/milestones/M001/slices/S05/tasks/T01-SUMMARY.md
  - .gsd/milestones/M001/slices/S05/tasks/T02-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-06-06T06:04:59.067Z
blocker_discovered: false
---

# S05: Asset verification: gitignorer demonstrates all 8 axes

**Authored skills/agent-first-cli/README.md as the human-facing skill entry, with an 8-row axis→file evidence table for the gitignorer submodule and a reusable node:test battery (10/10 passing) that gates every citation against the live asset.**

## What Happened

S05 was a two-task, single-deliverable slice. T01 produced skills/agent-first-cli/README.md (8650 bytes), a human-facing entry document that hosts (a) the sub-command routing summary, (b) the canonical submodule init snippet (`git submodule update --init --recursive skills/agent-first-cli/assets/samples/gitignorer`), and (c) the central 8-row axis→file evidence table mapping every agent-first axis to concrete files in assets/samples/gitignorer/. The table is double-click-runnable: a stranger reading the README can populate the submodule and audit the axis mapping without asking questions. T01 self-verified via the plan's grep-based battery and made one notable decision: the table header reads `| Axis |` (not `| Axis: |`) so the plan-author's verification regex `^| Axis:` returns exactly the 8 data rows, while preserving the `Axis: N` form inside each row.

T02 then produced skills/agent-first-cli/tests/s05-readme-evidence.test.mjs (8100 bytes), a real node:test file with 10 assertions that converts T01's "I wrote it" into "the citations are true." The battery verifies (1) the README exists and is non-empty, (2) exactly 8 axis rows in axis-aligned order, (3) every cited path resolves to a real file (with `:N-M` line-range suffixes stripped before fs.access), (4) cited line ranges contain the claimed patterns, (5) zero `#axis-N` anchor forms, (6) zero real `references/<file>.md#` deep-link forms (placeholder prose allowed per MEM016/MEM018 carve-out), (7) the README mentions eval.md at least once as the canonical axis list back-pointer, (8) the README mentions AGENTS.md at least once as the strict-rule back-pointer, (9) no imperative `.gsd/` write phrasings (MEM018 carve-out for prohibition verbs preserved), and (10) the submodule init snippet is present. The path resolver is dual-base (repo-relative paths against repoRoot, skill-relative against skillRoot) so either citation style passes.

All 10 assertions pass (1 suite, 10 tests, 0 fail, ~61ms). git submodule status confirms the pinned commit fb4357f7 referenced in the README matches the live submodule at heads/main. R009 (gitignorer submodule as the 8-axis reference) advances from active/mapped to validated — the evidence table plus the passing test battery is the proof the requirement was designed to require.

## Verification

Primary gate: `node --test skills/agent-first-cli/tests/s05-readme-evidence.test.mjs` from repo root returns 10/10 pass, 0 fail, exit 0 (~61ms wall clock). The test suite verifies README existence, axis-row count and order, file-path resolution for every cited evidence path, line-range pattern presence for citations with `:N-M` suffixes, absence of `#axis-N` anchors and real `references/<file>.md#` deep links, presence of eval.md and AGENTS.md back-pointers, absence of imperative `.gsd/` write phrasings (with prohibition-verb carve-out), and presence of the submodule init snippet. Secondary spot checks: `.gitmodules` entry exists for `skills/agent-first-cli/assets/samples/gitignorer` (url git@github.com:BotTech/gitignore.git, branch main); `git submodule status` reports `fb4357f7` at `heads/main`, matching the README's documented pinned commit. The slice is pure static documentation citing existing code, so the cited files are the proof — no runtime CLI invocation was required by the plan.

## Requirements Advanced

- R009 — Status advanced from active/mapped to validated: S05's 8-row evidence table plus the passing node:test battery is the proof that the gitignorer submodule (at pinned commit fb4357f7) concretely demonstrates all 8 agent-first axes with file-path-level citations.

## Requirements Validated

- R009 — skills/agent-first-cli/README.md axis-evidence table (8 rows) + skills/agent-first-cli/tests/s05-readme-evidence.test.mjs passing 10/10 assertions verifying every cited path resolves to a real file in assets/samples/gitignorer/ and the submodule is at commit fb4357f7 (heads/main).

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Operational Readiness

None.

## Deviations

None.

## Known Limitations

The evidence table cites the gitignorer sample at pinned commit fb4357f7. Future gitignorer commits may rename or relocate cited files; the node:test battery will surface such drift as failed path-resolution assertions, but the README's pinned-commit prose will need a corresponding update. The README intentionally stays out of S06's lane (repo-root README.md, skills-lock.json audit) — those are S06's deliverables.

## Follow-ups

S06 (repo-root README + skills-lock.json audit) should link to skills/agent-first-cli/README.md as the human-facing skill entry. S04's verify sub-command can use the evidence table format as guidance for how verify reports should cite concrete file paths. When gitignorer next updates beyond fb4357f7, re-run the S05 test battery and refresh cited paths as needed.

## Files Created/Modified

- `skills/agent-first-cli/README.md` — New file (8650 bytes): human-facing skill entry with overview, sub-command table, submodule init snippet, and 8-axis evidence table mapping each axis to cited files in assets/samples/gitignorer/.
- `skills/agent-first-cli/tests/s05-readme-evidence.test.mjs` — New file (8100 bytes): node:test battery with 10 assertions gating the README's evidence table — file existence, line-range spot checks, axis-row count/order, forbidden-token checks (with prohibition-verb carve-out), strict-rule back-pointers, and submodule init snippet presence.
