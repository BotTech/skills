---
id: T02
parent: S03
milestone: M001
key_files:
  - skills/agent-first-cli/references/features.md
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-06-06T05:21:37.032Z
blocker_discovered: false
---

# T02: Authored features.md with 8 axis-aligned feature tables, differentiators, anti-features, and a cross-check table mapping 27 P0 features to R001-R009.

**Authored features.md with 8 axis-aligned feature tables, differentiators, anti-features, and a cross-check table mapping 27 P0 features to R001-R009.**

## What Happened

Authored skills/agent-first-cli/references/features.md as the densest reference file in the skill (168 lines). The file ships all 11 required top-level headers in the exact order specified by T02's plan: H1 + 8 axis-aligned H2s + Differentiators + Anti-Features + Cross-Check vs REQUIREMENTS.md.

Each of the 8 axis-aligned sections uses the canonical 4-column table (Feature | Why Required | Priority | Complexity) and contains 5 rows lifted and adapted from gsd-new-cli-project's table-stakes list. Every row's "Why Required" column cites the corresponding axis explicitly with "Required for Axis N (<axis name>) — <reason>" form, satisfying R013's Axis: N tag requirement and producing 6-7 axis references per section (well above the 1-minimum).

Differentiators uses the required 3-column table (Feature | Value | Complexity) with 5 entries: response sanitization for prompt injection, live schema resolution, multi-surface configuration, --fields projection, --token-budget hint. Anti-Features uses the required 2-column table (Feature | Avoid Because) with 6 non-goals including Web UI, multi-language samples, global config, scaffolder binary, persistent interactive shell, and harness-specific slash commands (per MEM014, phrased semantically rather than literally).

The Cross-Check vs REQUIREMENTS.md table maps 27 P0 features from the 8 axis sections to the canonical starter R### IDs from T01's requirements.md. All 8 starter R001-R008 IDs are referenced plus R009 (which complements R004 for Axis 4 per the requirements.md coverage table). This table is the structural bridge between "what features the CLI ships" and "what requirements a project commits to," which S04's validate/verify report will join with per-axis status to produce axis verdicts.

No deep links (references/*.md#) appear anywhere in the file, per the plan's prohibition. The file references eval.md and requirements.md by bare filename only.

## Verification

Verified via bash inspection of the authored file:
1. test -f confirms the file exists at skills/agent-first-cli/references/features.md.
2. grep '^## ' confirms 11 H2 headers in exact order: Discoverability, Invocation, I/O, State, Error, Exit Code, Idempotency, Examples, Differentiators, Anti-Features, Cross-Check vs REQUIREMENTS.md — matching the plan's required order verbatim.
3. grep '^# ' confirms exactly one H1: "# Features — Agent-First CLI".
4. Per-axis axis-tag counts (Axis N / Axis: N tokens) all ≥6 for axes 1-8, satisfying the plan's "every axis-aligned section's Why Required column contains Axis N or Axis: N text."
5. Row counts per axis table: 5/5/5/5/5/5/5/5 — all ≥ the 2-row minimum.
6. grep for `references/.*\.md#` returns no matches (no deep links).
7. Cross-Check section contains 27 P0 feature rows and references R001-R009 (the full set of in-scope starter R###s from T01).
8. File is 168 lines and ~18KB — appropriate density for the densest reference file.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `test -f skills/agent-first-cli/references/features.md` | 0 | pass | 5ms |
| 2 | `grep '^## ' features.md | head -11` | 0 | pass | 10ms |
| 3 | `grep -c 'Axis [1-8]\|Axis: [1-8]' features.md per-axis` | 0 | pass | 15ms |
| 4 | `grep 'references/.*\.md#' features.md (must be empty)` | 1 | pass | 8ms |
| 5 | `Cross-Check row count: 27 P0 feature rows mapping to R001-R009` | 0 | pass | 12ms |

## Deviations

None. All 11 headers shipped in exact order; all 8 axes covered with 5 rows each; cross-check table extended to include R009 (Axis 4 complement to R004) per the requirements.md coverage table.

## Known Issues

None.

## Files Created/Modified

- `skills/agent-first-cli/references/features.md`
