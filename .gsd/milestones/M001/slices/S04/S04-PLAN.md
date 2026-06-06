# S04: validate + verify references consuming eval.md

**Goal:** Ship the validate/verify enforcement surface: references/eval.md (canonical 8-axis rubric spine, not a sub-command), references/validate.md (plan-mode checker spec), references/verify.md (impl-mode checker spec), plus tests/fixtures/ test fixture and expected-report demonstrating the strict-gap error behavior. All three reference files consume eval.md as their axis source and reference AGENTS.md by name for the strict bidirectional rule (never re-quote it). Together they enable the roadmap's "validate flags a deliberately introduced axis gap as an error" success criterion via the fixture + inline worked example pattern.
**Demo:** references/eval.md, validate.md, verify.md exist; validate.md and verify.md both reference eval.md; each defines a structured report format with per-axis status; strict rule (uncovered axis or orphan R### is error) is encoded; running validate against a deliberately gapped REQUIREMENTS.md flags the gap as an error.

## Must-Haves

- references/eval.md exists, is the canonical 8-axis list, contains per-axis H2 sections (definition + pass criteria + common evidence + failure symptoms), and is consumed by both validate.md and verify.md.
- references/validate.md exists, references eval.md as axis source and AGENTS.md by name for the strict rule (no inline re-quote), defines a hybrid report format (verdict block + per-axis audit table + per-axis detail), accepts both `Status: out-of-scope` block-field and `out-of-scope: <reason>` Notes-token representations, and includes an inline worked example report keyed to the gapped-requirements.md fixture.
- references/verify.md exists, references eval.md as axis source and AGENTS.md by name for the strict rule, defines a per-axis evidence-gathering procedure with file:line evidence convention, ships the gitignorer sample as a worked example referenced by file path (not requiring the submodule to be checked out), and uses the same report format shape as validate.md.
- tests/fixtures/gapped-requirements.md exists with a deliberate Axis 5 gap (no R### carries `Axis: 5` and Axis 5 is not marked out-of-scope) and tests/fixtures/expected-validate-report.md exists showing the strict error report this fixture must produce.
- R011: no imperative `.gsd/` write instructions in any S04 file (prohibitions stated semantically, matching S02/S03 convention).
- R012: no `/gsd-*`, `gsd_*`, `gsd.db`, or `gsd-pi` tokens in any S04 file (skill stays harness-agnostic).
- R013: stable axis IDs across all three new files — `Axis N` in prose, `Axis: N` in structured fields; zero `#axis-N` anchors, zero `references/<file>.md#` deep links.
- Closure verification battery (mechanical): all assertions above checked via a single gsd_exec script with ≥30 individual assertions, persisted to .gsd/exec/<uuid>.stdout.

## Proof Level

- This slice proves: contract — this slice ships spec documents an agent reads and follows; the contract is what an agent reading the spec can produce without further guidance. The fixture + expected-report pair is the regression check that proves the strict-gap error behavior is well-specified.

## Integration Closure

S04 is terminal within M001 alongside S05 and S06. It consumes S02's AGENTS.md strict-rule definition (by name reference) and S03's requirements.md (the data validate.md checks). It provides to S05 the per-axis "Common evidence" and "Failure symptoms" lists that S05 will use as the rubric for matching gitignorer files to axes. It provides to S06 the three new sub-command reference filenames (already in S02's routing table) backed by real content. No downstream consumer needs further wiring; S04's deliverables stand alone as the enforcement surface.

## Verification

- None. S04 ships reference content and a fixture; no runtime signals added.

## Tasks

- [x] **T01: Author references/eval.md (8-axis rubric spine)** `est:1h`
  Why: eval.md is the shared axis spine that validate.md and verify.md both consume. Authoring it first prevents axis duplication and lets T02/T03 reference it by name rather than re-listing axes.
  - Files: `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/eval.md`
  - Verify: test -f skills/agent-first-cli/references/eval.md

- [x] **T02: Author references/validate.md (plan-mode checker spec)** `est:1h30m`
  Why: validate.md is the plan-mode enforcement surface — an agent reads this spec, then runs the procedure against the project's REQUIREMENTS.md to surface uncovered axes and orphan R###s as errors. Must be authored after eval.md (consumes it) and before the test fixture (the fixture's expected report lives inline here).
  - Files: `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/validate.md`
  - Verify: test -f skills/agent-first-cli/references/validate.md

- [x] **T03: Author references/verify.md (impl-mode checker spec)** `est:1h30m`
  Why: verify.md is the implementation-mode enforcement surface — an agent reads this spec, then walks the built CLI's source/tests/--help/examples/schema output to gather per-axis evidence and surface axes with no concrete implementation. Must be authored after eval.md (consumes per-axis 'Common evidence' lists as the rubric) and after validate.md (mirrors the same report format shape).
  - Files: `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/verify.md`
  - Verify: test -f skills/agent-first-cli/references/verify.md

- [x] **T04: Ship test fixture + expected report and run closure verification battery** `est:1h30m`
  Why: The roadmap success criterion 'agent-first-cli validate against a deliberately gapped REQUIREMENTS.md flags the gap as an error' requires a concrete fixture + expected report that an agent (or regression test) can re-run. This task ships both and then runs the slice's closure verification battery that gates S04 completion.
  - Files: `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/tests/fixtures/gapped-requirements.md`, `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/tests/fixtures/expected-validate-report.md`
  - Verify: test -f skills/agent-first-cli/tests/fixtures/gapped-requirements.md && test -f skills/agent-first-cli/tests/fixtures/expected-validate-report.md

## Files Likely Touched

- /Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/eval.md
- /Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/validate.md
- /Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/verify.md
- /Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/tests/fixtures/gapped-requirements.md
- /Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/tests/fixtures/expected-validate-report.md
