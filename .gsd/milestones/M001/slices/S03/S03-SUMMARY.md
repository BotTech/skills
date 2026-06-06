---
id: S03
parent: M001
milestone: M001
provides:
  - 5 shape-matched reference files at skills/agent-first-cli/references/{stack,features,architecture,pitfalls,requirements}.md
  - 12 starter R### blocks with Axis: N Notes tags (data S04 validate/verify will check)
  - Coverage Table in requirements.md mapping Axis 1..8 to starter R###s
  - Cross-Check table in features.md mapping 27 P0 features to R001..R009
  - Stable axis-ID citation convention enforced across all 5 files (no broken deep links)
  - 8 pitfalls covering all 8 axes (one per axis threat pairing)
requires:
  - slice: S01
    provides: skills/agent-first-cli/ directory layout with references/ subdirectory and assets/samples/gitignorer submodule wiring
  - slice: S02
    provides: SKILL.md sub-command routing surface (each sub-command names the reference file it loads) and AGENTS.md strict bidirectional rule definition
affects:
  - S04 (consumes requirements.md's Axis: N tags as the data validate/verify check; consumes the file shape as the contract those tools must read)
  - S05 (consumes the per-axis description language in the 5 reference files as the rubric for matching gitignorer evidence to axes)
  - S06 (sub-command → reference-file mapping is now backed by populated content)
key_files:
  - skills/agent-first-cli/references/requirements.md
  - skills/agent-first-cli/references/features.md
  - skills/agent-first-cli/references/stack.md
  - skills/agent-first-cli/references/architecture.md
  - skills/agent-first-cli/references/pitfalls.md
key_decisions:
  - Author requirements.md first (T01) to surface axis-coverage gaps before any other file is touched — proved out when Coverage Table was the natural place to verify all 8 axes had at least one starter R###
  - Add R009 (per-command state documentation in --help, Axis 4) as complement to R004 — AGENTS.md allows >1 R### per axis; gives finer-grained coverage of the state contract
  - Use the verbatim GSD-template-shaped headers in each reference file (e.g., architecture.md uses ## Recommended Architecture / ## Data Model Sketch / ## Integration Points / ## Scaling Tier / ## Reversibility Risk from GSD's ARCHITECTURE.md template) rather than inventing skill-specific section names
patterns_established:
  - Stable axis ID citation form: `Axis N` in prose, `Axis: N` in structured Notes/Coverage Table fields — never `#axis-N` anchors or file#section deep links
  - Coverage Table pattern in requirements.md: every reference set ships a table mapping Axis → R###s at the bottom, making coverage auditable at a glance
  - Cross-Check Table pattern in features.md: every feature set ships a table mapping P0 features → R### IDs at the bottom, making feature/requirement trace bidirectional
  - Per-axis description language: each axis has a single canonical name (Discoverability, Invocation, I/O, State, Error, Exit Code, Idempotency, Examples) used as H2 headers in features.md and as citation subjects across all other files
observability_surfaces:
  - T06 verification artifact at .gsd/exec/85f4a4e0-6a0f-495a-8f19-7fb33fc7460f.stdout (81-check battery log)
  - S03 closure battery artifact at .gsd/exec/56d8fba9-dfa4-4e6c-a260-62aca9eb538a.stdout (12 Must-Have re-verification)
drill_down_paths:
  - .gsd/milestones/M001/slices/S03/tasks/T01-SUMMARY.md
  - .gsd/milestones/M001/slices/S03/tasks/T02-SUMMARY.md
  - .gsd/milestones/M001/slices/S03/tasks/T03-SUMMARY.md
  - .gsd/milestones/M001/slices/S03/tasks/T04-SUMMARY.md
  - .gsd/milestones/M001/slices/S03/tasks/T05-SUMMARY.md
  - .gsd/milestones/M001/slices/S03/tasks/T06-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-06-06T05:32:07.956Z
blocker_discovered: false
---

# S03: Reference content: stack, features, architecture, pitfalls, requirements

**Authored 5 reference files (stack.md, features.md, architecture.md, pitfalls.md, requirements.md) shape-matched to GSD templates with stable Axis 1..8 IDs; 12 starter R###s cover all 8 axes; all R005/R006/R011/R012/R013 gates green on T06 battery (81/81) and closure re-verification.**

## What Happened

S03 produced the static reference content that S04's validate/verify will consume and that S05 will map gitignorer evidence against.

**Files authored (all in skills/agent-first-cli/references/):**
- `requirements.md` (158 lines): 9 starter R###s (R001..R009) + 3 out-of-scope anti-features = 12 GSD-template blocks. Each starter carries an `Axis: N` Notes tag; Coverage Table at the bottom maps Axis 1..Axis 8 → the R###s that cover them. References AGENTS.md by role (line 9) without restating the strict rule. R004 (state) complemented by R009 (per-command state documentation) for finer-grained Axis 4 coverage.
- `features.md` (168 lines): 11 H2 sections in axis-aligned order (Discoverability → Invocation → I/O → State → Error → Exit Code → Idempotency → Examples → Differentiators → Anti-Features → Cross-Check vs REQUIREMENTS.md). 8 axis-aligned feature tables with 5 rows each, plus a Cross-Check table mapping 27 P0 features to R001..R009 starter IDs.
- `stack.md` (50 lines): Recommended Stack (10 rows) + Alternatives Considered + What NOT to Use (7 rows) + Open Questions. Inline Axis N citations in the Recommended Stack rationale column (22 total).
- `architecture.md` (81 lines): 5 GSD ARCHITECTURE.md template headers (Recommended Architecture, Data Model Sketch, Integration Points, Scaling Tier, Reversibility Risk). Component table tags each row with the axis(es) it owns.
- `pitfalls.md` (97 lines): 5 GSD PITFALLS.md template headers (Domain / Stack / Scope / Compliance / Migration) containing 8 `### Pitfall:` blocks — one per axis threat pairing.

**Cross-cutting invariants (verified):**
- R013 stable axis IDs: 0 `#axis-N` anchors, 0 `references/<file>.md#` deep links across all 5 files. Axis citations per file: stack=22, features=48, architecture=13, pitfalls=8, requirements=17.
- R011 semantic: no imperative `.gsd/` write instructions in any file (prohibition stated semantically per MEM014).
- R012 harness-agnostic: 0 gsd-pi coupling tokens (`gsd_*`, `gsd.db`, `/gsd-`, etc.).
- Soft length budget: every file comfortably under the 250-line flag threshold.

**Verification:** T06 ran an 81-check hard battery and got 81/81 PASS on first run (artifact persisted at .gsd/exec/85f4a4e0-6a0f-495a-8f19-7fb33fc7460f.stdout). Slice closure ran an independent 12-check Must-Have battery covering existence, R### count, axis coverage, AGENTS.md reference, Cross-Check section, pitfalls count, R013/R011/R012 forbidden-token gates, axis citations per file, shape-match per file, and GSD-template block field format — 0 failures.

**Decisions / Gotchas:** None worth a decision record. One convention captured (MEM015): the GSD-template block format uses `- Why it matters:` rather than `- **Why**:`, which tripped an early verification regex.

**What this provides to downstream slices:**
- S04 consumes: requirements.md's `Axis: N` tags as the data validate/verify checks against; the file shape (5 sections, block format) defines the contract those tools must read.
- S05 consumes: the per-axis description language used throughout the 5 files as the rubric for matching gitignorer evidence files to axes.
- S06 consumes: the sub-command → reference-file mapping is now backed by real content (every sub-command in SKILL.md resolves to a populated file).

## Verification

T06 plan-defined battery: 81/81 hard checks PASSED (existence 5, R005 shape 33, R006 axis-tag coverage 8, R013 stable-ID 10, R011 semantic 5, R012 coupling 20, plus AGENTS.md reference, Cross-Check, Coverage Table, Pitfalls count). Independent S03 closure battery: 12 Must-Have checks PASSED with 0 failures — covers existence, R### ≥8, all-8-axes-in-requirements, AGENTS.md by role, features cross-check section, pitfalls ≥8 with all 8 axes, R013/R011/R012 forbidden-token gates, per-file axis citations, per-file shape-match, and GSD-template block field format. Verification evidence persisted at .gsd/exec/85f4a4e0-6a0f-495a-8f19-7fb33fc7460f.stdout (T06) and .gsd/exec/56d8fba9-dfa4-4e6c-a260-62aca9eb538a.stdout (closure). R005, R006, R013 advanced from active → validated based on this proof.

## Requirements Advanced

None.

## Requirements Validated

- R005 — T06 verification battery (81/81) and S03 closure battery (12/12) confirmed all 5 reference files have their target GSD-template headers verbatim: requirements.md (4), features.md (11), stack.md (4), architecture.md (5), pitfalls.md (5).
- R006 — requirements.md ships 12 R### blocks (9 starter R001-R009 + 3 out-of-scope anti-features) in GSD-template block format. All 8 axes appear as `Axis: N` Notes tags. Coverage Table has 8 rows mapping Axis 1..8 to starter R###s.
- R013 — T06 battery (10 checks) and closure battery confirmed 0 forbidden `#axis-N` anchors and 0 `references/<file>.md#` deep links across all 5 files. Cross-refs use `Axis N` / `Axis: N` form (per-file counts: stack=22, features=48, architecture=13, pitfalls=8, requirements=17).

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Operational Readiness

None.

## Deviations

Added R009 (per-command state documentation, Axis 4) as a complement to R004 within the ≥8 starter R### requirement — stays inside AGENTS.md's allowance of one-or-more R###s per axis. All other deliverables shipped as planned.

## Known Limitations

None within S03 scope. S04 will need to confirm that validate/verify can parse the actual `- Why it matters:` field name (the convention captured as MEM015) — pre-S03 verification regex assumed a different field name.

## Follow-ups

S04 must consume requirements.md's `Axis: N` tags and the file shape directly. S04 should also consume the Cross-Check table pattern from features.md if it chooses to enforce bidirectional feature↔R### coverage (the strict rule in AGENTS.md is axis↔R###; feature↔R### is a stronger variant S04 may optionally enforce).

## Files Created/Modified

- `skills/agent-first-cli/references/requirements.md` — New file (158 lines): 9 starter R###s + 3 anti-features, all 8 axes covered, Coverage Table
- `skills/agent-first-cli/references/features.md` — New file (168 lines): 8 axis-aligned feature tables + Differentiators + Anti-Features + Cross-Check table mapping 27 P0 features to R001-R009
- `skills/agent-first-cli/references/stack.md` — New file (50 lines): Recommended Stack (10 rows), Alternatives Considered, What NOT to Use (7 rows), Open Questions
- `skills/agent-first-cli/references/architecture.md` — New file (81 lines): 5 GSD ARCHITECTURE.md template sections with component table tagging axis ownership
- `skills/agent-first-cli/references/pitfalls.md` — New file (97 lines): 5 GSD PITFALLS.md template sections containing 8 axis-covering pitfalls
