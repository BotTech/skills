---
estimated_steps: 21
estimated_files: 1
skills_used: []
---

# T02: Author references/validate.md (plan-mode checker spec)

Why: validate.md is the plan-mode enforcement surface — an agent reads this spec, then runs the procedure against the project's REQUIREMENTS.md to surface uncovered axes and orphan R###s as errors. Must be authored after eval.md (consumes it) and before the test fixture (the fixture's expected report lives inline here).

Do: Create skills/agent-first-cli/references/validate.md (~110-140 lines). Structure:

(1) H1 `# Validate — Plan-Mode Coverage Check` + 1-paragraph intro: this is the plan-mode checker spec, run after the project has a populated REQUIREMENTS.md and before execution begins. The checker reads the project's REQUIREMENTS.md; it does not write anywhere (R011). State harness-agnostic prohibitions semantically: 'no harness-specific slash commands, tool calls, or database reads'.

(2) `## Inputs` section listing the one required input (the project's REQUIREMENTS.md) and the optional secondary input (references/features.md Cross-Check Table — informational only, not enforced; cite Q4 from research).

(3) `## Strict Rule` section: ONE sentence referencing AGENTS.md by name — recommended phrasing exactly: 'This checker enforces the strict bidirectional coverage rule defined in `AGENTS.md`: every axis maps to an Active R### (or is marked out-of-scope with a reason), and every R### this skill suggests maps to at least one axis. An uncovered axis or orphan R### is an error, not a warning.' Do NOT re-quote the rule body; do NOT enumerate the axes (those live in eval.md).

(4) `## Parsing Rules` section with prose + regex examples. Cover:
   - Per-R### Notes extraction: `Axis:\s*(\d+)` regex to pull axis tags from Notes fields.
   - Out-of-scope detection (both representations per research Q1): block field `Status: out-of-scope` (with reason in adjacent Description or `Why it matters:` field) OR Notes field containing the literal token `out-of-scope`. In either case, a reason MUST be present — an out-of-scope declaration with no reason is itself an error.
   - Coverage Table parsing: `^\| Axis (\d+)` regex. State explicitly: per-R### Notes tags are canonical; the Coverage Table is informational and a disagreement produces a `coverage-table-drift` WARNING (not error — see research Q2).

(5) `## Algorithm` section: ordered numbered steps an agent follows to produce the report. Iterate 'for each axis in eval.md'; iterate 'for each R### in REQUIREMENTS.md'; classify each side; emit per-axis status row and per-R### status row; emit aggregate verdict.

(6) `## Report Format` section. Hybrid shape (per research Q1/recommendation 1, modeled on GSD's milestone-validation.md template):
   - YAML frontmatter block (id, verdict: pass|fail, error_count, warning_count, validated_at).
   - `## Verdict` (one paragraph: pass / fail with reason summary).
   - `## Axis Coverage Audit` (8-row table: columns `Axis | Name | Status | Source R### | Notes`; one row per axis; Status ∈ {Covered, Out-of-scope, UNCOVERED}).
   - `## R### Audit` (one row per R###: columns `R### | Axis tag | Status`; Status ∈ {Covered, Out-of-scope (justified), ORPHAN}).
   - `## Per-Axis Detail` (one ### subsection per axis with status, evidence citations, errors list).

(7) `## Worked Example: Deliberately Gapped Input` section. Inline the expected report for the fixture at `tests/fixtures/gapped-requirements.md` (authored in T04). Show the YAML frontmatter (verdict: fail, error_count: 1), the Axis Coverage Audit row for Axis 5 with Status=UNCOVERED, and a short prose note that the full fixture ships at the path above for regression testing.

(8) `## Error Catalog` section listing the three error kinds: `uncovered-axis` (error), `orphan-r###` (error), `out-of-scope-without-reason` (error), plus one warning: `coverage-table-drift` (warning).

Constraints: R003 — file explicitly cites eval.md as axis source; R004 — references AGENTS.md by name (not re-quote); R011 — no imperative .gsd/ write instructions; R012 — no /gsd-* / gsd_* / gsd.db / gsd-pi tokens; R013 — no `#axis-N` anchors, no `references/<file>.md#` deep links; use `Axis N` in prose, `Axis: N` in structured fields only.

IMPORTANT — STALE-PATH NOTE: Path anchor below is the registered DB worktree root; the executing agent's cwd will differ (per MEM011). Convert absolute paths to relative paths from the executor's cwd. Equivalent relative paths: `skills/agent-first-cli/references/validate.md` (output); `skills/agent-first-cli/references/eval.md` and `skills/agent-first-cli/AGENTS.md` and `skills/agent-first-cli/references/requirements.md` (inputs).

Done when: validate.md exists at the relative path from the executor's cwd, is ~110-140 lines, contains all 8 numbered sections above, references AGENTS.md and eval.md by name, has the report-format YAML+table+detail template, includes the inline worked-example block keyed to the fixture path.

## Inputs

- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/eval.md`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/AGENTS.md`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/requirements.md`

## Expected Output

- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/validate.md`

## Verification

test -f skills/agent-first-cli/references/validate.md

## Observability Impact

None — spec document only.
