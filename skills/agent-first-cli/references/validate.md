# Validate — Plan-Mode Coverage Check

This is the plan-mode checker spec for the agent-first-cli skill. An agent (human or LLM) reads this file, then runs the procedure against the project's `REQUIREMENTS.md` after it is populated and before execution begins. The checker reads `REQUIREMENTS.md` and the canonical axis list in `eval.md`; it produces a report. It does not write anywhere under the project's `.gsd/` directory or any other location. The procedure is harness-agnostic: no slash commands, no tool calls, no database reads. Where this file references the strict bidirectional coverage rule, it points at `AGENTS.md` by name rather than re-quoting the rule body.

## Inputs

- **Required:** the project's `REQUIREMENTS.md` (the file produced by following `references/requirements.md`).
- **Optional, informational only:** the Cross-Check Table in `references/features.md` (if present). This table is a quick-reference for designers; it is not enforced by validate. Disagreements between the features Cross-Check Table and `REQUIREMENTS.md` are reported as `coverage-table-drift` warnings (see Error Catalog), never as errors.

## Strict Rule

This checker enforces the strict bidirectional coverage rule defined in `AGENTS.md`: every axis maps to an Active R### (or is marked out-of-scope with a reason), and every R### this skill suggests maps to at least one axis. An uncovered axis or orphan R### is an error, not a warning.

The authoritative rule statement and the axis list are not duplicated here. The axes live in `references/eval.md` (canonical 8-axis list); the rule lives in `AGENTS.md`.

## Parsing Rules

The procedure parses `REQUIREMENTS.md` as structured text. Three extraction steps:

**Per-R### Notes extraction.** For each R### block, extract the Notes field. Within Notes, find every match of the regex `Axis:\s*(\d+)` and capture the digit. Each captured digit is an axis tag claimed by that R###. A Notes field with no matches and no other justification marks the R### as an orphan candidate (see Algorithm).

**Out-of-scope detection.** An R### is out-of-scope if **either** of the following holds (both representations are accepted, per the project's research notes):

- The block's `Status:` field equals `out-of-scope` (e.g., `Status: out-of-scope`). In this form, a reason MUST be present in the adjacent `Description:` or `Why it matters:` field. An out-of-scope declaration with no reason is itself an error (`out-of-scope-without-reason`).
- The Notes field contains the literal token `out-of-scope` (case-insensitive). The same reason requirement applies: the surrounding Notes or block text must justify the declaration.

**Coverage Table parsing.** If `REQUIREMENTS.md` contains a Coverage Table with rows of the form `^\| Axis (\d+)`, extract each row's axis number and the R### IDs listed for it. Per-R### Notes tags are canonical. The Coverage Table is informational; a disagreement between the Coverage Table and the per-R### Notes tags produces a `coverage-table-drift` warning, not an error. A disagreement between the two never changes the verdict from fail to pass or vice versa.

## Algorithm

An agent executing this procedure performs the following steps in order. The output is the report described under Report Format.

1. Read `references/eval.md` and collect the canonical axis list: the set `{1..8}` with each axis's name. Any axis number outside this set seen in an R### Notes tag is reported as `orphan-r###` with a note that the tag does not correspond to a real axis.
2. Read the project's `REQUIREMENTS.md`. Split it into R### blocks by header (`^### R\d{3}`). For each block, extract: ID (e.g., `R005`), `Status:` value, `Description:`, `Why it matters:`, and `Notes:`. Apply the parsing rules above to collect axis tags and out-of-scope status.
3. **For each axis** in the canonical set, classify the axis as one of:
   - **Covered** — at least one Active R### carries `Axis: N` matching this axis in its Notes.
   - **Out-of-scope** — at least one R### (any status) declares this axis out-of-scope with a reason.
   - **UNCOVERED** — neither of the above. Emit `uncovered-axis` error.
4. **For each R###**, classify it as one of:
   - **Covered** — Notes contains at least one valid `Axis: N` tag matching a real axis.
   - **Out-of-scope (justified)** — declared out-of-scope with a reason present.
   - **ORPHAN** — Notes contains no `Axis: N` tag and no justification. Emit `orphan-r###` error. (An R### with an `Axis: N` tag pointing at a non-existent axis is also ORPHAN.)
5. Cross-check the Coverage Table (if present) against the per-R### Notes tags. Emit one `coverage-table-drift` warning per axis where the two disagree.
6. Compute the aggregate verdict: `pass` iff `error_count == 0`; otherwise `fail`. Warnings do not affect the verdict.
7. Emit the report per the format below.

## Report Format

The report is a single Markdown document. Hybrid shape: machine-parseable YAML frontmatter for tooling, human-readable Markdown body for review.

```yaml
---
id: validate-<timestamp>
verdict: pass | fail
error_count: <int>
warning_count: <int>
validated_at: <ISO-8601>
---
```

### Verdict

One short paragraph stating `pass` or `fail`. On `fail`, name the error kinds (e.g., "failed with 1 uncovered-axis and 0 orphan-r### errors").

### Axis Coverage Audit

An 8-row table — one row per axis in the canonical list. Columns:

| Axis | Name | Status | Source R### | Notes |
|------|------|--------|-------------|-------|
| 1 | Discoverability | Covered | R001 | — |
| 5 | Errors | UNCOVERED | — | no Active R### with `Axis: 5` |

`Status` is one of `Covered`, `Out-of-scope`, `UNCOVERED`. `Source R###` lists the R### IDs whose Notes contain the matching `Axis: N` tag (or the R### that declares the axis out-of-scope). The `Notes` column carries short clarifications; error and warning IDs live here (e.g., `uncovered-axis`).

### R### Audit

One row per R### parsed from `REQUIREMENTS.md`. Columns:

| R### | Axis tag | Status |
|------|----------|--------|
| R001 | 1 | Covered |
| R010 | — | Out-of-scope (justified) |
| R013 | — | ORPHAN |

`Status` is one of `Covered`, `Out-of-scope (justified)`, `ORPHAN`.

### Per-Axis Detail

One `### Axis N: <Name>` subsection per axis, in canonical order. Each subsection contains:

- **Status:** Covered | Out-of-scope | UNCOVERED.
- **Evidence:** citations to the R### IDs and the specific Notes or block text that supports the status. Cite by R### ID (e.g., `R001 Notes`); do not use anchor links.
- **Errors:** list of `{kind, detail}` for this axis, or `none`.

## Worked Example: Deliberately Gapped Input

The fixture at `tests/fixtures/gapped-requirements.md` (shipped by this skill) is a REQUIREMENTS.md with one axis deliberately left uncovered: Axis 5 (Errors) has no Active R### carrying an `Axis: 5` tag and is not declared out-of-scope. Running validate against that fixture produces the following report (excerpt):

```yaml
---
id: validate-gapped-fixture
verdict: fail
error_count: 1
warning_count: 0
validated_at: 2026-06-06T00:00:00Z
---
```

**Verdict.** Failed with 1 uncovered-axis error. Axis 5 (Errors) has no Active R### with `Axis: 5` in its Notes and no out-of-scope declaration.

**Axis Coverage Audit (excerpt).**

| Axis | Name | Status | Source R### | Notes |
|------|------|--------|-------------|-------|
| 5 | Errors | UNCOVERED | — | uncovered-axis |

**R### Audit (excerpt).** No ORPHAN rows; all fixture R###s carry valid `Axis: N` tags except the missing Axis 5 coverage.

The full fixture ships at `tests/fixtures/gapped-requirements.md` for regression testing. The expected report (this excerpt, completed for all 8 axes and all fixture R###s) is the canonical regression target: any future change to validate.md's report shape or to the parsing rules must keep the validate run against that fixture matching the expected report.

## Error Catalog

Three error kinds (each moves the verdict from `pass` to `fail`) and one warning kind (does not affect verdict):

- `uncovered-axis` — **error.** An axis in `eval.md` has no Active R### with the matching `Axis: N` tag and is not declared out-of-scope with a reason. Reported in the Axis Coverage Audit and the Per-Axis Detail subsection for the affected axis.
- `orphan-r###` — **error.** An R### this skill suggests has no `Axis: N` tag in its Notes (or has a tag pointing at a non-existent axis) and no justification. Reported in the R### Audit.
- `out-of-scope-without-reason` — **error.** An R### declares itself or an axis out-of-scope but provides no reason in the adjacent `Description:`, `Why it matters:`, or Notes field. Reported in the R### Audit and, where relevant, the Per-Axis Detail subsection.
- `coverage-table-drift` — **warning.** The Coverage Table's row for an axis disagrees with the per-R### Notes tags for the same axis. Reported once per drifted axis. Never changes the verdict.

This file is reference content, not an executable. It writes nothing under any project's `.gsd/` directory and is harness-agnostic: no slash commands, no tool calls, no database reads.
