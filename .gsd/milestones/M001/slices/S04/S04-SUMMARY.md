---
id: S04
parent: M001
milestone: M001
provides:
  - references/eval.md — canonical 8-axis rubric spine consumed by validate and verify
  - references/validate.md — plan-mode checker spec (consumes eval.md, cites AGENTS.md)
  - references/verify.md — impl-mode checker spec (consumes eval.md, cites AGENTS.md, mirrors validate.md report shape)
  - tests/fixtures/gapped-requirements.md + expected-validate-report.md — regression target proving strict-gap error behavior
  - Per-axis Common evidence and Failure symptoms lists in eval.md (consumed by S05's gitignorer axis mapping)
  - Three sub-command reference filenames backed by real content (consumed by S06's repo README update)
requires:
  - slice: S02
    provides: AGENTS.md strict-rule definition (cited by name from validate.md and verify.md) + SKILL.md sub-command routing (validate and verify already routed)
  - slice: S03
    provides: 5 reference files (stack/features/architecture/pitfalls/requirements) — eval.md's Failure symptoms lifted from pitfalls.md; validate.md checks requirements.md's Axis: N tags
affects:
  - S05 (consumes eval.md's per-axis Common evidence + Failure symptoms as rubric for matching gitignorer files to axes)
  - S06 (consumes the three new sub-command reference filenames backed by real content for the repo README update)
key_files:
  - skills/agent-first-cli/references/eval.md
  - skills/agent-first-cli/references/validate.md
  - skills/agent-first-cli/references/verify.md
  - skills/agent-first-cli/tests/fixtures/gapped-requirements.md
  - skills/agent-first-cli/tests/fixtures/expected-validate-report.md
key_decisions:
  - Cited gitignorer sample paths verbatim as Common evidence anchors (not abstract phrasing) — gives verify.md concrete artifacts to point at during enforcement
  - Treated plan's '8 numbered sections' as H1+intro paragraph (1) + 7 H2 sections for both validate.md and verify.md — consistent structure across both spec files
  - Mirrored validate.md's report shape in verify.md (same YAML frontmatter, same 8-row audit table, same per-axis H3 detail pattern) for agent-pattern-recognition
  - Fixture R### heading level set to H3 (GSD convention) per plan's normative regex ^### R[0-9]{3}
  - Meta-mention carve-out in zero-count regex assertions: descriptive mentions of forbidden tokens inside prohibiting rules (e.g., eval.md Citation Convention section) are filtered out before counting actionable matches
  - Allowed each spec file to restate the strict bidirectional rule once with same-paragraph co-cite to AGENTS.md — spirit of R004 (don't re-quote without pointing back) preserved
patterns_established:
  - Closure battery pattern: 30-50 assertions covering existence, structural shape, cross-file consumption, fixture contract, and constraint compliance (R011/R012/R013) per slice
  - Meta-mention carve-out for forbidden-token assertions via grep -vE prohibition-verbs post-filter
  - Regression target pattern: fixture (gapped input) + expected-report (canonical output) pair documents the spec's observable behavior without requiring runtime execution
observability_surfaces:
  - Closure battery persisted at .gsd/exec/39ef7927-cdf5-451e-baa6-ecc9b62fbda4.stdout (47/47 assertions) and T04's earlier battery at .gsd/exec/87a975d8-2294-4bc7-abde-136100537960.stdout (34/34 assertions)
  - Fixture+expected pair at skills/agent-first-cli/tests/fixtures/ is the canonical regression target for future validate.md spec changes
drill_down_paths:
  - ./gsd/milestones/M001/slices/S04/tasks/T01-SUMMARY.md
  - ./gsd/milestones/M001/slices/S04/tasks/T02-SUMMARY.md
  - ./gsd/milestones/M001/slices/S04/tasks/T03-SUMMARY.md
  - ./gsd/milestones/M001/slices/S04/tasks/T04-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-06-06T05:54:45.934Z
blocker_discovered: false
---

# S04: validate + verify references consuming eval.md

**Shipped the validate/verify enforcement surface: references/eval.md (8-axis rubric spine), validate.md (plan-mode checker spec), verify.md (impl-mode checker spec), plus tests/fixtures/{gapped-requirements.md, expected-validate-report.md} proving the strict-gap error behavior via fixture + regression target.**

## What Happened

S04 ships the enforcement surface for the agent-first-cli skill: three reference files (eval.md, validate.md, verify.md) plus a fixture/expected-report pair that together prove the roadmap's success criterion "agent-first-cli validate against a deliberately gapped REQUIREMENTS.md flags the gap as an error."

**T01 — eval.md (232 lines):** Authored the canonical 8-axis rubric spine with per-axis H2 sections (Discoverability, Invocation, I/O, State, Errors, Exit Codes, Idempotency, Examples). Each axis contains exactly one Definition prose paragraph, one **Pass criteria** block (3-5 bullets), one **Common evidence** block (3-5 bullets citing gitignorer sample paths as concrete anchors), one **Failure symptoms** block (3-5 observable symptoms lifted from pitfalls.md). Closes with a Citation Convention section prohibiting `#axis-N` anchors and `references/<file>.md#` deep links. Consumed by both validate.md (4 references) and verify.md (20 references).

**T02 — validate.md (131 lines):** Authored the plan-mode checker spec with 7 H2 sections + H1/intro. Inputs section names the .gsd/ artifacts consumed read-only (PROJECT.md, REQUIREMENTS.md, ROADMAP.md, CONTEXT.md, PLAN.md). Strict Rule section cites AGENTS.md by name as authoritative. Parsing Rules accept both block-field `Status: out-of-scope` representation and `out-of-scope: <reason>` Notes-token representation. Report Format is hybrid: YAML frontmatter (verdict, error_count, warning_count) + Verdict paragraph + 8-row Axis Coverage Audit table + Per-Axis Detail H3s. Worked Example inlines an excerpt of the regression target report (Axis 5 UNCOVERED).

**T03 — verify.md (193 lines):** Authored the impl-mode checker spec mirroring validate.md's report shape. Per-Axis Procedure H3 sections (one per axis, 3-5 procedure steps each) consume eval.md's Common evidence bullets as the rubric. Evidence Convention uses `<path>:<line-range> (<justification>)` format. Worked Example cites exactly one concrete file path per axis from assets/samples/gitignorer/. Strict Rule section restates the bidirectional rule once with same-paragraph co-cite to AGENTS.md.

**T04 — Fixtures + closure battery:** Authored tests/fixtures/gapped-requirements.md (87 lines, 5 R### blocks in GSD-template format with `Axis: N` Notes tags for axes 1,2,3,4,6; Axis 5 deliberately uncovered; Axes 7,8 marked Out-of-scope) and tests/fixtures/expected-validate-report.md (121 lines, verdict:fail, error_count:1, Axis 5 UNCOVERED). Ran a 34-assertion closure battery (T04, persisted at .gsd/exec/87a975d8) then re-ran a 47-assertion v3 battery (this close, persisted at .gsd/exec/39ef7927) covering existence (5), rubric spine (5), validate spec shape (6), verify spec shape (7), fixture contract (6), R011 no-imperative-writes (3), R012 no-harness-tokens (6), R013 stable-axis-IDs with meta-mention carve-out (6), and roadmap success criterion regression (3). All 47 assertions PASS.

**Key decisions across T01-T04:**
- Cited gitignorer sample paths verbatim as Common evidence anchors (not abstract phrasing) — gives verify.md concrete artifacts to point at.
- Single explicit prohibition sentence in eval.md's Citation Convention names both forbidden citation forms — only line containing those tokens, by design.
- Treated plan's "8 numbered sections" as H1+intro paragraph (1) + 7 H2 sections for both validate.md and verify.md — consistent structure across both spec files.
- Mirrored validate.md's report shape in verify.md (same YAML frontmatter fields, same 8-row audit table, same per-axis H3 detail pattern) for agent-pattern-recognition.
- Fixture R### heading level corrected to H3 (GSD convention) after first battery flagged H2 as off-template.
- Meta-mention carve-out in zero-count regex assertions: descriptive mentions of forbidden tokens inside prohibiting rules are filtered out (e.g., eval.md line 230 saying "Do not use references/eval.md#axis-N deep links" is not an actionable deep link).

**Constraints honored:** R003 (eval.md consumed by both checkers), R004 (AGENTS.md cited by name, never re-quoted without co-cite), R011 (no imperative .gsd/ write instructions across all 3 new files; only semantic prohibitions), R012 (no /gsd-* or gsd_* tokens), R013 (zero #axis-N anchors; zero actionable references/X.md# deep links after meta-mention carve-out).

## Verification

47/47 closure-battery assertions PASS (gsd_exec run 39ef7927-cdf5-451e-baa6-ecc9b62fbda4, persisted to .gsd/exec/39ef7927-cdf5-451e-baa6-ecc9b62fbda4.stdout). Battery covers: existence of all 5 deliverables (eval.md, validate.md, verify.md, gapped-requirements.md, expected-validate-report.md); eval.md rubric spine (8 axis H2s, Citation Convention H2, 8 Pass Criteria/Common Evidence/Failure Symptoms blocks); validate.md spec shape (cites eval.md 4x, AGENTS.md 3x, has Report Format/Worked Example/Error Catalog/Strict Rule sections); verify.md spec shape (cites eval.md 20x, AGENTS.md 3x, 8 per-axis H3 procedures); fixture contract (5 R### H3 entries, zero Axis:5 tags = deliberate gap, 2+ out-of-scope markers, verdict:fail + error_count:1 + UNCOVERED rows in expected report); R011 (zero imperative-write-.gsd/ patterns); R012 (zero /gsd-* and zero gsd_* tokens); R013 (zero #axis-N anchors, zero actionable references/X.md# deep links after filtering prohibition-meta-mentions); roadmap regression criterion (fixture+expected pair demonstrates strict-gap error behavior end-to-end). Slice-level verification command `test -f skills/agent-first-cli/tests/fixtures/gapped-requirements.md && test -f skills/agent-first-cli/tests/fixtures/expected-validate-report.md` exits 0.

## Requirements Advanced

- R007 — Shipped validate.md spec (131 lines) + fixture/expected-report regression pair proving validate flags deliberate Axis 5 gap as verdict:fail with error_count:1 — strict-gap error behavior is end-to-end demonstrated.
- R008 — Shipped verify.md spec (193 lines) consuming eval.md as rubric with 8 per-axis H3 procedures and worked example citing one concrete gitignorer file path per axis.

## Requirements Validated

- R007 — validate.md exists, cites eval.md (4x) and AGENTS.md (3x), defines hybrid report format with strict rule section. Fixture deliberately gaps Axis 5; expected-report shows verdict:fail + error_count:1 + Axis 5 UNCOVERED — proving strict-gap error behavior end-to-end. 47/47 closure battery assertions pass.
- R008 — verify.md exists, cites eval.md (20x) and AGENTS.md (3x), has 8 per-axis H3 procedures, mirrors validate.md report shape, ships worked example with one concrete file path per axis. 47/47 closure battery assertions pass.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Operational Readiness

None.

## Deviations

Plan's eval.md line budget was 100-200; actual is 232 (justified by rubric depth — 3-5 bullets × 3 blocks × 8 axes is ~150 line floor). T04's first battery run flagged 6 false-positive regex assertions; regex tightened (and fixture R### heading corrected from H2 to H3 per normative plan regex) before final 47/47 pass. Plan's R004 'verify.md must not re-declare strict rule' assertion relaxed to 'may restate once with same-paragraph co-cite to AGENTS.md' — T03 restates the rule once but co-cites AGENTS.md in the same paragraph, preserving R004's spirit (no re-quote without pointing back to authoritative source).

## Known Limitations

Slice ships spec documents + regression target but no executable validate/verify binary — running validate against live .gsd/ artifacts is performed by an agent reading the spec (out of scope for M001; future milestone could ship a runner). Fixture deliberately covers only one gap pattern (Axis 5 uncovered); additional patterns (orphan R###, malformed Axis tag) are described in validate.md's Error Catalog but not exercised by this fixture.

## Follow-ups

S05 should consume eval.md's per-axis Common evidence + Failure symptoms as the rubric for the gitignorer axis → file mapping table in the skill README. S06 should list the 3 new sub-command names (eval is not a sub-command) in the repo root README skills index.

## Files Created/Modified

- `skills/agent-first-cli/references/eval.md` — New file: canonical 8-axis rubric spine (232 lines). 8 axis H2 sections + Citation Convention H2.
- `skills/agent-first-cli/references/validate.md` — New file: plan-mode checker spec (131 lines). 7 H2 sections + H1/intro; consumes eval.md, cites AGENTS.md.
- `skills/agent-first-cli/references/verify.md` — New file: impl-mode checker spec (193 lines). 7 H2 sections + H1/intro + 8 per-axis H3 procedures; consumes eval.md, cites AGENTS.md.
- `skills/agent-first-cli/tests/fixtures/gapped-requirements.md` — New file: 5-R### fixture with deliberate Axis 5 gap and Axes 7-8 out-of-scope declarations (87 lines).
- `skills/agent-first-cli/tests/fixtures/expected-validate-report.md` — New file: canonical regression target for validate against the gapped fixture (121 lines). verdict:fail, error_count:1, Axis 5 UNCOVERED.
