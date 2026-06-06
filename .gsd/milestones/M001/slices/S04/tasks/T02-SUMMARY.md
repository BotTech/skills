---
id: T02
parent: S04
milestone: M001
key_files:
  - skills/agent-first-cli/references/validate.md
key_decisions:
  - Treated the plan's '8 numbered sections' as: H1+intro paragraph (1), Inputs (2), Strict Rule (3), Parsing Rules (4), Algorithm (5), Report Format (6), Worked Example (7), Error Catalog (8) — yielding 7 H2 sections plus the H1+intro paragraph that the plan's structure (1) explicitly describes as 'H1 + 1-paragraph intro'.
  - Used the exact recommended phrasing from the plan in the Strict Rule section to ensure the bidirectional rule is cited verbatim while AGENTS.md remains the authoritative source.
  - Inlined only an excerpt of the expected report in the Worked Example (YAML frontmatter + Verdict + Axis 5 row of the Axis Coverage Audit) rather than a full 8-axis report — keeps the file within the 110-140 line target while still providing the regression target that T04's fixture must reproduce.
  - Listed the Per-Axis Detail subsection format as `### Axis N: <Name>` (H3) inside the validate.md spec, matching the H2 convention in eval.md (`## Axis N: <Name>`) at one level deeper — keeps validate.md's H2s reserved for the spec's own structure.
duration: 
verification_result: passed
completed_at: 2026-06-06T05:46:51.327Z
blocker_discovered: false
---

# T02: Authored references/validate.md as the plan-mode checker spec consuming eval.md and referencing AGENTS.md by name

**Authored references/validate.md as the plan-mode checker spec consuming eval.md and referencing AGENTS.md by name**

## What Happened

Authored `skills/agent-first-cli/references/validate.md` (131 lines, within the 110-140 target). The file delivers all eight structural sections per the task plan: (1) H1 + intro paragraph stating plan-mode purpose, harness-agnostic prohibitions, and no-write invariant (R011); (2) Inputs section naming REQUIREMENTS.md as required and the features.md Cross-Check Table as informational-only (citing research Q4); (3) Strict Rule section with the exact recommended phrasing referencing AGENTS.md by name and pointing at eval.md for axes — no rule body re-quoting; (4) Parsing Rules section covering the `Axis:\s*(\d+)` regex, both out-of-scope representations per research Q1 (Status field or Notes token, with mandatory reason), and Coverage Table parsing with the `^\| Axis (\d+)` regex — explicitly stating per-R### Notes are canonical and Coverage Table disagreement is a coverage-table-drift WARNING per research Q2; (5) Algorithm section with 7 numbered steps walking through axis list collection, R### block extraction, two-way classification, cross-check, verdict computation, and report emission; (6) Report Format section with YAML frontmatter (id, verdict, error_count, warning_count, validated_at), Verdict paragraph, 8-row Axis Coverage Audit table (Covered/Out-of-scope/UNCOVERED status enum), R### Audit table (Covered/Out-of-scope-justified/ORPHAN enum), and Per-Axis Detail subsections (### Axis N: <Name>); (7) Worked Example section inlining the expected fail-report excerpt for the fixture at tests/fixtures/gapped-requirements.md showing verdict: fail, error_count: 1, and the Axis 5 UNCOVERED row; (8) Error Catalog listing uncovered-axis (error), orphan-r### (error), out-of-scope-without-reason (error), and coverage-table-drift (warning).

Verified all R-constraint compliance: R003 cites eval.md as axis source (Strict Rule, Algorithm step 1, Error Catalog); R004 references AGENTS.md by name without re-quoting the rule body (Strict Rule, intro paragraph); R011 contains no imperative .gsd/ write instructions; R012 grep confirmed no `/gsd-*`, `gsd_*`, `gsd.db`, or `gsd-pi` tokens; R013 grep confirmed no `#axis-N` anchors or `references/<file>.md#` deep links — uses `Axis N` in prose and `Axis: N` only in structured-field examples. The file follows the citation convention established in eval.md (which T01 authored) so the two reference files are stylistically consistent. The worked example is keyed to the planned fixture path tests/fixtures/gapped-requirements.md (to be authored in T04) and shows the exact YAML frontmatter + Axis Coverage Audit row that T04's fixture must reproduce.

## Verification

Ran the task's specified verification command `test -f skills/agent-first-cli/references/validate.md` — exit 0, PASS. Then ran a structured grep audit confirming: line count is 131 (within 110-140 target); all 7 H2 sections present (Inputs, Strict Rule, Parsing Rules, Algorithm, Report Format, Worked Example, Error Catalog) plus the H1 + intro paragraph as section 1; AGENTS.md referenced by name in 4 locations; eval.md referenced as axis source in 3 locations; no prohibited R012 tokens (no /gsd-*, gsd_, gsd.db, gsd-pi); no prohibited R013 tokens (no #axis-N anchors, no references/<file>.md# deep links); worked example references tests/fixtures/gapped-requirements.md twice; error catalog contains all three error kinds (uncovered-axis, orphan-r###, out-of-scope-without-reason) plus the one warning (coverage-table-drift).

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `test -f skills/agent-first-cli/references/validate.md` | 0 | ✅ pass | 8ms |
| 2 | `wc -l skills/agent-first-cli/references/validate.md` | 0 | ✅ pass (131 lines, target 110-140) | 12ms |
| 3 | `grep -nE '/gsd-|gsd_|gsd\.db|gsd-pi|#axis-[0-9]|references/[a-z]+\.md#' validate.md` | 1 | ✅ pass (no prohibited R012/R013 tokens) | 11ms |
| 4 | `grep -cE 'AGENTS\.md|eval\.md' validate.md` | 0 | ✅ pass (both files referenced by name) | 9ms |
| 5 | `grep -nE 'uncovered-axis|orphan-r###|out-of-scope-without-reason|coverage-table-drift' validate.md` | 0 | ✅ pass (all 4 catalog entries present) | 10ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `skills/agent-first-cli/references/validate.md`
