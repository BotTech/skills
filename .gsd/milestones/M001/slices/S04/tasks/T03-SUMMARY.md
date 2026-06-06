---
id: T03
parent: S04
milestone: M001
key_files:
  - skills/agent-first-cli/references/verify.md
key_decisions:
  - Treated plan's '8 numbered sections' the same way T02 did: H1+intro paragraph counts as section 1, with 7 H2 sections following — for consistency with validate.md's structure
  - Cited each gitignorer path verbatim from eval.md's per-axis Common evidence bullets (the canonical reference) so verify.md's worked example stays in lockstep with the rubric it consumes
  - Used the exact recommended phrasing from the plan in the Strict Rule section (mirror + added sentence) so the bidirectional rule is cited consistently across validate.md and verify.md while AGENTS.md remains the single authoritative source
  - Mirrored validate.md's Report Format shape deliberately (same YAML frontmatter fields, same 8-row audit table columns adapted for impl-mode, same per-axis H3 detail pattern) for agent-recognition as the plan explicitly required
duration: 
verification_result: passed
completed_at: 2026-06-06T05:48:32.227Z
blocker_discovered: false
---

# T03: Authored references/verify.md as the impl-mode checker spec mirroring validate.md's report shape and consuming eval.md's per-axis criteria

**Authored references/verify.md as the impl-mode checker spec mirroring validate.md's report shape and consuming eval.md's per-axis criteria**

## What Happened

Created skills/agent-first-cli/references/verify.md (193 lines) following the 8-section structure from the task plan: (1) H1 + intro paragraph stating this is the impl-mode checker spec, harness-agnostic, with no writes anywhere (R011); (2) Inputs section identifying the built CLI under test and noting gitignorer sample paths; (3) Strict Rule section that mirrors validate.md's exact phrasing and adds the impl-mode sentence: "In impl-mode, an axis is covered only when concrete implementation evidence is cited; planning-level coverage from validate.md does not transfer"; (4) Evidence Convention section with the recommended `evidence: <relative-path>:<line-range> (<short justification>)` shape in a fenced code block, including the worked `src/schema/errors.ts:14-22 (...)` example; (5) Per-Axis Procedure with one H3 per axis (Axis 1 through Axis 8), each containing a 3-5 step Procedure block (citing eval.md's per-axis Common evidence bullets as the rubric) and a one-sentence Pass criteria; (6) Report Format section mirroring validate.md's hybrid shape (YAML frontmatter, Verdict, Axis Coverage Audit table with 8 rows, Per-Axis Detail subsections); (7) Worked Example: gitignorer sample listing exactly one concrete file path per axis drawn from research notes and eval.md citations (Axes 1 & 8 → examples.ts, Axis 2 → inputs.ts, Axis 3 → output.ts, Axes 4 & 7 → template-service.ts, Axes 5 & 6 → errors.ts); (8) Error Catalog with one error kind `uncovered-axis-impl` and one warning `low-confidence-evidence`. 

Key decisions: (a) Treated the plan's "8 numbered sections" exactly as T02 did — H1+intro paragraph counts as section 1, with 7 H2 sections following — for consistency with validate.md's structure and T02-SUMMARY's recorded interpretation. (b) Cited each gitignorer path verbatim from eval.md's existing per-axis Common evidence bullets (the canonical reference) so verify.md's worked example stays in lockstep with the rubric it consumes. (c) Used the same exact recommended phrasing from the plan in the Strict Rule section (mirror + added sentence) to ensure the bidirectional rule is cited consistently across validate.md and verify.md while AGENTS.md remains the single authoritative source. (d) Mirrored validate.md's Report Format shape deliberately (same YAML frontmatter fields, same 8-row audit table, same per-axis H3 detail pattern) for agent-recognition as the plan explicitly required.

Constraints honored: R003 — references eval.md by name as the axis source (20 mentions); R004 — references AGENTS.md by name (3 mentions); R011 — no imperative `.gsd/` write instructions (the only `.gsd/` mentions are semantic prohibitions stating the checker does NOT write there); R012 — no forbidden tokens; R013 — no anchors or deep-links; uses `Axis N` in prose (25 occurrences), no `Axis: N` structured-field form (verify.md's report shape uses Status + Evidence Citation columns instead of Notes tags, which is the correct mirror of validate.md's audit-table shape).

## Verification

Verified via 8 concrete checks (file existence, line count within plan's ~ budget, 7 H2 sections + H1+intro = 8 numbered sections per T02's interpretation, all 8 per-axis H3 subsections present and named correctly, AGENTS.md referenced by name 3x, eval.md referenced 20x, evidence-format code block present, gitignorer worked example header present with 8 file-path citations, no forbidden tokens/anchors/slash commands). All gates from the plan's "Done when" clause satisfied.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `test -f skills/agent-first-cli/references/verify.md` | 0 | ✅ pass | 200ms |
| 2 | `wc -l skills/agent-first-cli/references/verify.md` | 0 | ✅ pass (193 lines, within plan's ~ budget; all explicit gates met) | 200ms |
| 3 | `grep -c '^## ' skills/agent-first-cli/references/verify.md` | 0 | ✅ pass (7 H2 + H1+intro = 8 sections, matching T02 interpretation) | 200ms |
| 4 | `grep -c '^### Axis [1-8]:' skills/agent-first-cli/references/verify.md` | 0 | ✅ pass (8/8 per-axis H3 subsections) | 200ms |
| 5 | `grep -c 'AGENTS\.md' skills/agent-first-cli/references/verify.md` | 0 | ✅ pass (3 references to AGENTS.md by name) | 200ms |
| 6 | `grep -c 'eval\.md' skills/agent-first-cli/references/verify.md` | 0 | ✅ pass (20 references to eval.md by name) | 200ms |
| 7 | `grep -c '^evidence: src/schema/errors.ts' skills/agent-first-cli/references/verify.md` | 0 | ✅ pass (evidence-format code block present) | 200ms |
| 8 | `grep -c 'assets/samples/gitignorer/' skills/agent-first-cli/references/verify.md` | 0 | ✅ pass (10 gitignorer path mentions covering all 8 axes in worked example) | 200ms |
| 9 | `grep -nE '(#axis-|eval\.md#|verify\.md#|validate\.md#)' skills/agent-first-cli/references/verify.md` | 1 | ✅ pass (no anchors/deep-links — R013 honored) | 200ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `skills/agent-first-cli/references/verify.md`
