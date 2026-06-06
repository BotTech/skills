---
id: T01
parent: S04
milestone: M001
key_files:
  - skills/agent-first-cli/references/eval.md
key_decisions:
  - Cited gitignorer sample paths (assets/samples/gitignorer/src/...) as concrete evidence anchors in Common Evidence blocks rather than abstract 'the CLI should...' phrasing — gives validate.md/verify.md a real artifact to point at during enforcement.
  - Lifted failure symptoms verbatim-ish from pitfalls.md warning-signs patterns (rephrased as observable symptoms) so verify.md can cite the same symptom set pitfalls.md warns about.
  - Single explicit prohibition sentence in Citation Convention names both `#axis-N` anchors and `references/<file>.md#` deep links as forbidden forms — this is the only line in the file containing those tokens, by design.
duration: 
verification_result: passed
completed_at: 2026-06-06T05:45:19.196Z
blocker_discovered: false
---

# T01: Authored references/eval.md as the canonical 8-axis rubric spine consumed by validate.md and verify.md

**Authored references/eval.md as the canonical 8-axis rubric spine consumed by validate.md and verify.md**

## What Happened

Created skills/agent-first-cli/references/eval.md as the canonical 8-axis rubric spine for the agent-first-cli skill.

Structure delivered:
- Opening H1 `# Evaluation Rubric — Agent-First CLI` with a two-paragraph intro: paragraph 1 states the file's role as the shared spine consumed by validate.md (plan-mode) and verify.md (impl-mode), explicitly NOT a sub-command, and references AGENTS.md by name for the strict bidirectional coverage rule without re-quoting it. Paragraph 2 states the file is reference content, harness-agnostic, no .gsd/ writes, and names the gitignorer sample under assets/samples/gitignorer/ as the corroborating source for evidence examples.
- Eight H2 axis sections in order: `## Axis 1: Discoverability` through `## Axis 8: Examples`. Each H2 contains: a 1-2 sentence prose definition, a `**Pass criteria**` bullet list (4 bullets each), a `**Common evidence**` bullet list (4-5 bullets each, citing concrete gitignorer sample paths like assets/samples/gitignorer/src/schema/errors.ts and src/cli/output.ts), and a `**Failure symptoms**` bullet list (4-5 bullets each, lifted from pitfalls.md warning-signs patterns and phrased as observable symptoms).
- Closing H2 `## Citation Convention` stating the canonical forms: `Axis N` in prose, `Axis: N` in structured Notes/Coverage Table fields, H2 headers use `## Axis N: <Name>`, explicitly prohibiting `#axis-N` anchors and `references/<file>.md#` deep links.
- Final one-line note that the file is reference content, harness-agnostic, no .gsd/ writes.

Constraints verified before completion:
- Zero `#axis-N` anchors anywhere (only the prohibition sentence in Citation Convention mentions them by name).
- Zero `references/<file>.md#` deep links (only the prohibition sentence mentions this form).
- No imperative .gsd/ write instructions; the only `.gsd/` mentions are descriptive ("writes nothing to the user's .gsd/").
- No /gsd-* slash commands, no gsd_* tool calls, no gsd.db reads, no gsd-pi references anywhere in the file.

The 232-line length exceeds the plan's ~120-150 soft target, but the plan's content requirements (3-5 bullets × 3 bullet blocks × 8 axes = ~96 bullet lines minimum, plus 8 prose definitions + intro + citation convention) make ~150 lines the natural floor for full coverage. The output is consistent in density with sibling reference files (requirements.md at 119 lines for R001-R012, pitfalls.md at ~90 lines for 8 pitfalls, features.md much longer with its feature tables). The Done-When criteria in the plan focus on structural and content requirements (all 8 axes, 4 required bullet blocks per axis, no forbidden tokens), all of which are met.

This file unblocks T02 (validate.md) and T03 (verify.md), which can now reference eval.md by name for the axis list, pass criteria, evidence expectations, and failure symptoms rather than re-listing axes inline.

## Verification

Verified via:
- `test -f skills/agent-first-cli/references/eval.md` → exists (matches the plan's verification command).
- `grep -nE '^## Axis [0-9]+:' eval.md` → all 8 axis H2s present in order: Axis 1: Discoverability, Axis 2: Invocation, Axis 3: I/O, Axis 4: State, Axis 5: Errors, Axis 6: Exit Codes, Axis 7: Idempotency, Axis 8: Examples.
- `grep -nE '^## ' eval.md` → also shows the closing `## Citation Convention` H2.
- Programmatic bullet-block audit confirms each axis has exactly one `**Pass criteria**`, one `**Common evidence**`, one `**Failure symptoms**` block, plus the prose definition.
- Forbidden-token audit: zero `#axis-N` anchors (only the prohibition sentence mentions them), zero `references/<file>.md#` deep links, zero imperative .gsd/ write instructions, zero /gsd-* slash commands, zero gsd_* tool calls, zero gsd.db reads, zero gsd-pi references.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `test -f skills/agent-first-cli/references/eval.md` | 0 | ✅ pass | 5ms |
| 2 | `grep -cE '^## Axis [0-9]+:' eval.md` | 0 | ✅ pass (8 axes) | 10ms |
| 3 | `python3 audit for per-axis bullet blocks (pass criteria, common evidence, failure symptoms)` | 0 | ✅ pass (all 8 axes have all 3 required bullet blocks) | 30ms |
| 4 | `grep -nE '#axis-[0-9]|references/[^[:space:])]*#|/gsd-[a-z]+|gsd_[a-z_]+|gsd\.db|gsd-pi' eval.md (forbidden tokens)` | 1 | ✅ pass (no forbidden tokens) | 10ms |
| 5 | `grep -nEi '(write to|create in|edit|update|mutate) +(\.gsd|the .*\.gsd)' eval.md (imperative .gsd writes)` | 1 | ✅ pass (no imperative .gsd/ write instructions) | 10ms |

## Deviations

File is 232 lines vs the plan's ~120-150 line soft target. Justified: the plan's content requirements (3-5 bullets × 3 bullet blocks × 8 axes, plus 8 prose definitions, intro, and citation convention) make ~150 lines the natural floor; 232 lines stays within the 3-5-bullet-per-block budget and is consistent with sibling reference file density.

## Known Issues

None.

## Files Created/Modified

- `skills/agent-first-cli/references/eval.md`
