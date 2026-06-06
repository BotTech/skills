# S04 Research — eval.md + validate.md + verify.md

## Summary

S04 authors three new reference files at `skills/agent-first-cli/references/`:

- `eval.md` — canonical 8-axis rubric spine (shared by validate and verify; NOT a sub-command).
- `validate.md` — plan-mode checker spec: parses project's `REQUIREMENTS.md`, reports per-axis coverage + orphan R###s, strict verdict.
- `verify.md` — impl-mode checker spec: walks the built CLI's source/tests/`--help`/`examples`/`schema` output, reports per-axis evidence, strict verdict.

All three are reference documents an agent reads and follows — not executables. S04 owns the *spec*; the agent harness executes the procedure. The roadmap's "running validate against a deliberately gapped REQUIREMENTS.md flags the gap as an error" success criterion is satisfied by a **test fixture under `tests/fixtures/`** plus a prose demonstration in `validate.md` showing the fixture's expected report — not by shipping an executable.

This slice owns R003 (eval.md shared reference), R007 (validate structured report), R008 (verify structured report). R004, R010, R011, R012, R013 are inherited constraints that apply to every line written.

## Recommendation

**Single-pass authoring, eval-first**, because validate.md and verify.md both consume eval.md's axis definitions and per-axis pass criteria. Sequencing: T01 eval.md → T02 validate.md → T03 verify.md → T04 fixture + demonstration of strict-gap behavior.

For the three open design questions:

1. **Report format**: hybrid — top-level verdict block + per-axis status table + per-axis detail sections (for context, evidence, errors). This mirrors GSD's `milestone-validation.md` template shape (audit table + per-criterion verdict) so the format is recognizable to GSD-trained agents.
2. **Strict rule encoding**: validate.md and verify.md **reference AGENTS.md by name** rather than re-quoting the rule. They state: "the strict bidirectional coverage rule from `AGENTS.md` is enforced; an uncovered axis or orphan R### is an error, not a warning." Avoids drift if AGENTS.md rule evolves.
3. **Test/demonstration**: a `tests/fixtures/gapped-requirements.md` file with a deliberately introduced gap (e.g., Axis 5 missing — no R### with `Axis: 5` tag) ships with the skill. `validate.md` shows the expected report for that fixture inline as a worked example, which doubles as documentation and as a regression check an agent can re-run.

## Implementation Landscape

### What exists (from S01-S03)

- **AGENTS.md** (78 lines): canonical strict rule with two tables (Axis → R###; R### → Axis). Uses `{reason}` placeholder syntax (not `<reason>`), per MEM014. References `references/eval.md` as canonical axis list — but eval.md does NOT yet exist. AGENTS.md is the **authoritative rule source**; validate/verify reference it, never re-declare.
- **SKILL.md**: routing table lists `validate` and `verify` sub-commands; calls out `eval.md` as shared spine, **not** a sub-command. Skill stays harness-agnostic — no slash commands, no tool calls, no `.gsd/` writes.
- **requirements.md** (140 lines): 12 starter R###s, 3 out-of-scope anti-features, Coverage Table. Two data formats validate.md must parse:
  - **Per-R### Notes field**: `Axis: N (covers axis N — <name>). <free text>` — extractable via regex `Axis:\s*(\d+)`.
  - **Coverage Table**: `| Axis N (<name>) | R001, R009 | <notes> |` — extractable via `^\| Axis (\d+)`.
  - **Out-of-scope R###s**: use `Status: out-of-scope` block field (NOT `Notes: out-of-scope: {reason}`). This is an ambiguity validate.md must resolve — see Open Questions Q1.
- **features.md**: 27 P0 features with `Axis: N` tags in `Why Required` column; Cross-Check Table mapping P0 features → R###s. Optional stronger check (see Open Questions Q4).
- **stack.md / architecture.md / pitfalls.md**: use `Axis: N` and `Axis N` citation forms. validate.md and verify.md should not require these for the strict check, but verify.md may cite them as evidence for axes like Axis 1 / Axis 4.

### What is missing

- `references/eval.md` — does not exist anywhere on disk or in any prior skill version. Must be authored from scratch using the canonical 8-axis names already encoded across S03 files (1=Discoverability, 2=Invocation, 3=I/O, 4=State, 5=Error, 6=Exit Code, 7=Idempotency, 8=Examples).
- `references/validate.md` — does not exist. Must define: input (project's REQUIREMENTS.md), parsing rules, bidirectional check algorithm, report format, error catalog, strict verdict semantics.
- `references/verify.md` — does not exist. Must define: input (sample CLI source/tests/--help/examples/schema output), per-axis evidence-gathering procedure, report format, error catalog, strict verdict semantics.
- A test fixture demonstrating strict-gap behavior. No `tests/` directory exists yet at `skills/agent-first-cli/tests/`.

### Reference: prior art in legacy `agent-dx-cli-scale` skill

The legacy skill at `~/.agents/skills/agent-dx-cli-scale/SKILL.md` shipped a 7-axis 0-3 **scoring** rubric. It is **not** the same model as M001's 8-axis **bidirectional coverage** model — different axis list, different semantics (score vs. covered/uncovered). It IS useful as prior art for:

- Per-axis criterion structure ("Score | Criteria" table)
- Per-axis explanation pattern (1-2 sentences explaining the axis, then criteria)
- The "interpreting the result" summary block at the end

eval.md should adapt this structure: per-axis H2 header → 1-sentence definition → "Pass criteria" bullets → "Common evidence" bullets → "Failure symptoms" bullets (lifted from pitfalls.md warning signs).

### What constrains the approach (hard rules from inlined context + memory)

- **R011**: no `.gsd/` writes from the skill. validate.md must spec "read `REQUIREMENTS.md` from the user's project; do not author or modify any file under `.gsd/`."
- **R012 / MEM014**: no `/gsd-*` slash commands, no `gsd_*` tool calls, no `gsd.db` reads, no `.gsd/` writes — in validate.md/verify.md prose. State prohibitions **semantically** ("no harness-specific slash commands, tool calls, or database reads"), never restate the literal forbidden tokens. validate.md/verify.md must pass the same forbidden-token gate they help enforce.
- **R003**: eval.md is a shared reference, NOT a sub-command. SKILL.md routing table already reflects this; validate.md and verify.md must both cite eval.md as their axis source.
- **R004**: strict bidirectional rule lives in AGENTS.md. validate.md/verify.md reference it by role ("per the strict bidirectional coverage rule in `AGENTS.md`") rather than re-declaring.
- **R005 / MEM008**: shape-match to existing GSD templates where applicable. Closest analog is `milestone-validation.md` (verdict + audit table + per-criterion blocks). validate/verify reports should follow this shape.
- **R013**: stable axis IDs across all references. eval.md establishes the canonical citation form: `Axis N` in prose, `Axis: N` in structured fields (matches S03 convention).
- **MEM015**: GSD-template block format uses `- Why it matters:` not `- **Why**:`. Any R###-shape blocks in fixtures must use the hyphen-label form, not bold-label.
- **Length budget**: S03 files averaged 120-180 lines. Target: eval.md ~120-150 lines (8 axes × ~12 lines + intro), validate.md ~100-130 lines, verify.md ~120-160 lines. Total ~350-440 lines for the three files.

### Reference-vs-tool tension (critical)

validate.md and verify.md are **spec documents** an agent reads, not programs. Three implications:

1. The "parsing logic" is described in prose with regex examples (e.g., "to extract axis tags from R### Notes fields, use `Axis:\s*(\d+)`"), not implemented. The agent reading the spec translates the prose into actual parsing when it runs the check.
2. The "report format" is a template the agent fills in, with placeholders and worked examples. An agent that has read validate.md should be able to produce a structurally identical report for any input REQUIREMENTS.md without further guidance.
3. The "evidence path" convention (file:line) must be specified explicitly so different agents converge on the same shape. Example: `evidence: src/schema/errors.ts:14-22 (defines ValidationError, GitError, FsError, BusinessError with readonly code + exitCode + toJSON)`.

### Strict-rule encoding (critical)

validate.md and verify.md must **reference** AGENTS.md, never re-quote. Recommended phrasing, used identically in both files:

> This checker enforces the strict bidirectional coverage rule defined in `AGENTS.md`: every axis maps to an Active R### (or is marked out-of-scope with a reason), and every R### this skill suggests maps to at least one axis. An uncovered axis or orphan R### is an error, not a warning. See `AGENTS.md` for the rule's two direction tables.

This single sentence (a) names the rule, (b) points to the canonical source, (c) restates the strict-vs-warning semantics, (d) avoids duplicating the rule body. If AGENTS.md's rule evolves, the change propagates without editing validate.md/verify.md.

## Don't Hand-Roll

- **Axis enumeration**: do not re-list the 8 axes in validate.md or verify.md. They live in eval.md. validate.md and verify.md cite eval.md as the source and iterate "for each axis in eval.md" — never enumerate inline.
- **Per-axis pass criteria**: live in eval.md. validate.md says "Axis N is covered iff at least one Active R### with `Axis: N` Notes tag exists OR the axis is marked out-of-scope with a reason" — that is a *structural* rule independent of what each axis *means*. The semantic per-axis criteria (what counts as evidence for Axis 1, etc.) live in eval.md and are consumed by verify.md.
- **Strict rule text**: do not re-quote AGENTS.md. Reference by name.
- **GSD report shape**: do not invent a new report format. Lift the verdict-block + audit-table + per-criterion-detail shape from `milestone-validation.md`.

## Open Questions

### Q1: Out-of-scope representation — Status field vs. Notes field

The strict rule in AGENTS.md says "marked `out-of-scope` with a reason" and the example table row reads "An R### (or a Notes entry on a covering R###) saying `out-of-scope: {reason}`". But S03's actual out-of-scope R###s (R010, R011, R012 in requirements.md) use `Status: out-of-scope` as a **block field**, with the reason in the `Why it matters:` field — NOT in a `Notes:` field.

**Recommendation**: validate.md accepts **both** representations as valid out-of-scope signal:
- Block field `Status: out-of-scope` (with reason in adjacent `Description` or `Why it matters:` field) — used by S03 anti-features.
- Notes field containing `out-of-scope: <reason>` — used for partial-coverage cases (e.g., "Axis 4 covered by R004; Axis 4 sub-feature X out-of-scope: <reason>").

validate.md parsing rule (prose, with regex):
> An R### is out-of-scope if (a) its block has `Status: out-of-scope`, OR (b) its Notes field contains the literal token `out-of-scope`. In either case, the reason MUST be present (in `Why it matters:`, `Description:`, or trailing the `out-of-scope:` token). An out-of-scope declaration with no reason is itself an error.

### Q2: Coverage Table vs. per-R### Notes — which is canonical for the strict check?

requirements.md ships BOTH a per-R### `Axis: N` Notes tag AND a Coverage Table mapping Axis → R###s. They could disagree.

**Recommendation**: per-R### Notes tags are canonical. The Coverage Table is a human-readable summary; if it disagrees with the Notes tags, validate.md reports a `coverage-table-drift` WARNING (not error — table is informational). This keeps the strict check anchored on the per-R### field, which is the field the project's real R###s will carry.

### Q3: Where does the test fixture live?

The roadmap success criterion is "running validate against a deliberately gapped REQUIREMENTS.md flags the gap as an error." Options:

- **A**: `skills/agent-first-cli/tests/fixtures/gapped-requirements.md` + `tests/fixtures/expected-validate-report.md`. A test directory ships with the skill.
- **B**: Inline worked example in validate.md itself (no separate fixture file). The "expected report" is shown in the spec.
- **C**: Both — fixture file + inline example that references the fixture.

**Recommendation: C.** Fixture file gives agents something to actually parse; inline example in validate.md shows the expected report without requiring the agent to leave the spec. Total cost: one extra file (~30-40 lines for the fixture, ~25 lines for the expected-report block in validate.md).

### Q4: Should validate also check the Cross-Check table in features.md?

S03 SUMMARY raised this as optional. The strict rule in AGENTS.md is axis ↔ R### only; it does NOT mention feature ↔ R###.

**Recommendation: NO** — keep S04 strictly within the AGENTS.md rule. Feature ↔ R### cross-check is a stronger variant that could ship in a future slice if it becomes valuable. validate.md mentions features.md only in passing ("features.md Cross-Check Table is informational; not enforced by this checker").

### Q5: verify evidence — prescriptive file patterns, or descriptive file:line + reason?

verify.md needs to tell an agent how to find evidence that each axis is implemented. Two models:

- **Prescriptive**: "for Axis 5, look for `src/schema/errors.ts` with `extends Error` classes and `readonly code` fields".
- **Descriptive**: "for Axis 5, find at least one file:line that demonstrates typed error classes with stable codes; cite it as evidence".

**Recommendation: descriptive**, because the skill must work across CLI implementations (not just gitignorer). eval.md per-axis "Common evidence" bullets give examples, but verify.md's procedure is "find evidence matching the per-axis criteria in eval.md, cite file:line + 1-sentence justification." The gitignorer sample serves as a worked example inside verify.md, not as the spec.

### Q6: Should validate.md verify the project's R###s come from this skill's requirements.md?

AGENTS.md says "every R### **this skill suggests** must map to at least one axis." But validate runs against an arbitrary project's REQUIREMENTS.md, which may have R###s from many sources. Only R###s whose Source field is `this-skill` are in scope for the orphan check.

**Recommendation**: validate.md's orphan-R### check applies only to R###s with `Source: this-skill` (or whatever convention the project adopts for skill-sourced requirements). R###s from other sources (user research, compliance, etc.) are exempt from the bidirectional rule and are not flagged as orphans. validate.md states this scope rule explicitly.

## Files to Author

### 1. `skills/agent-first-cli/references/eval.md` (T01)

**Purpose**: Canonical 8-axis rubric spine. Consumed by validate.md (for axis enumeration) and verify.md (for per-axis pass criteria).

**Structure** (~120-150 lines):

```
# Eval — Agent-First CLI 8-Axis Rubric

Intro: shared spine for validate.md (plan-mode coverage check) and verify.md
(impl-mode evidence check). NOT a sub-command — invoked only via validate or
verify. Axis list is canonical; do not duplicate in other files (cite this file).

## How to cite
- Prose: "Axis N" (e.g., "Axis 3")
- Structured fields: "Axis: N" (e.g., Notes: Axis: 3)
- Stable across all references in this skill (per R013).

## Axis 1 — Discoverability
- Definition: <one sentence — what it means for a CLI to be discoverable by agents>
- Why it matters: <2-3 sentences>
- Pass criteria (plan-mode): <what an Active R### covering Axis 1 must commit to>
- Pass criteria (impl-mode): <what concrete evidence in the built CLI demonstrates Axis 1>
- Common evidence: <2-4 bullet examples: file:line patterns, --help output, schema sub-command output>
- Failure symptoms: <2-3 bullets lifted from pitfalls.md warning signs for this axis>

## Axis 2 — Invocation
... (same shape)

## Axis 3 — I/O
...

## Axis 4 — State
...

## Axis 5 — Error
...

## Axis 6 — Exit Code
...

## Axis 7 — Idempotency
...

## Axis 8 — Examples
...

## Out-of-scope declarations
<prose: how to mark an axis out-of-scope, with reason. Two valid forms per Q1.>
```

Per-axis ~10-12 lines. Total ~120-150 lines including intro and out-of-scope section.

### 2. `skills/agent-first-cli/references/validate.md` (T02)

**Purpose**: Plan-mode checker spec. Tells an agent how to verify axis ↔ R### coverage in a project's REQUIREMENTS.md before execution begins.

**Structure** (~110-140 lines):

```
# Validate — Plan-Mode Coverage Check

## When to invoke
<plan-mode; before execution; after seeding R###s from requirements.md>

## Inputs
- Required: project's REQUIREMENTS.md (typically at .gsd/REQUIREMENTS.md)
- Optional: project's PLAN.md / ROADMAP.md (not parsed by core check; may be
  cited in evidence text)
- If REQUIREMENTS.md does not exist or is empty: emit single error
  "no REQUIREMENTS.md found at <path>; cannot validate" and stop.

## What this checker does
<one-paragraph restatement: enforces strict bidirectional coverage rule from
AGENTS.md; checks Axis → R### (top-down) and R### → Axis (bottom-up);
strict = errors not warnings>

## Strict rule source
<single paragraph: rule is defined in AGENTS.md; this checker implements it;
see AGENTS.md for the canonical two-direction tables>

## Parsing rules
### Extracting R### blocks
<prose: an R### block is a `### R<digits> — <title>` heading followed by
hyphen-label fields (`- Class:`, `- Status:`, `- Description:`, `- Why it matters:`,
..., `- Notes:`). Use the regex `^### R(\d+) — (.+)$` to find block starts;
read until the next `###` or `##` heading.>

### Extracting Axis tags
<prose: from a parsed R### block, the Notes field yields axis tags via the
regex `Axis:\s*(\d+)`. A single R### may cover multiple axes (multiple matches).
Example: `Notes: Axis: 4 (covers axis 4 — state). ...` yields Axis 4.>

### Detecting out-of-scope
<prose per Q1: Status: out-of-scope OR Notes contains 'out-of-scope' token;
reason must be present in adjacent field; bare out-of-scope with no reason
is itself an error.>

### Detecting orphans
<prose per Q6: only R###s with Source: this-skill are in scope for the
orphan check. An in-scope R### with no Axis: N tag and no out-of-scope
declaration is an orphan.>

## Algorithm
<ordered list:
  1. Read REQUIREMENTS.md; if missing, emit error E_INPUT_MISSING and stop.
  2. Parse into R### blocks.
  3. For each axis 1..8 in eval.md:
     a. Find R###s with Axis: N Notes tag.
     b. If none found, check for explicit out-of-scope declaration.
     c. If neither, emit error E_AXIS_UNCOVERED with axis ID.
  4. For each in-scope R### (Source: this-skill):
     a. Extract Axis tags.
     b. If no tags and no out-of-scope declaration, emit error E_ORPHAN_REQUIREMENT.
  5. Emit report.
>

## Error catalog
| Code | Severity | Meaning |
|---|---|---|
| E_INPUT_MISSING | error | REQUIREMENTS.md not found at expected path |
| E_AXIS_UNCOVERED | error | Axis N has no Active R### and no out-of-scope declaration |
| E_ORPHAN_REQUIREMENT | error | R### has Source: this-skill but no Axis tag |
| E_OUT_OF_SCOPE_NO_REASON | error | R### marked out-of-scope without a reason |
| W_COVERAGE_TABLE_DRIFT | warning | requirements.md Coverage Table disagrees with per-R### Notes (informational) |

## Report format
<Top-level verdict block + per-axis audit table + per-error detail sections.
Lift the shape from milestone-validation.md. Example shown below for a
3-error case.>

### Verdict block
```
Verdict: FAIL
Errors: 2
Warnings: 1
Axes covered: 6/8
Orphan requirements: 1
```

### Per-axis audit table
```
| Axis | Name | Status | Covered by |
|------|------|--------|------------|
| 1 | Discoverability | covered | R001 |
| 2 | Invocation | covered | R002 |
| 3 | I/O | covered | R003 |
| 4 | State | covered | R004, R009 |
| 5 | Error | UNCOVERED | — |
| 6 | Exit Code | covered | R006 |
| 7 | Idempotency | covered | R007 |
| 8 | Examples | covered | R008 |
```

### Per-error detail
```
### Error: E_AXIS_UNCOVERED (Axis 5 — Error)
No R### in REQUIREMENTS.md has an `Axis: 5` Notes tag, and no out-of-scope
declaration was found. Either add an R### covering typed error classes with
stable codes and {error, message, ...context} JSON shape, or add an R###
with Status: out-of-scope and a reason in Why it matters:.

### Error: E_ORPHAN_REQUIREMENT (R014)
R014 has Source: this-skill but no Axis: N tag in Notes and no out-of-scope
declaration. Either tag it with the axis it covers, or add a justification
in Notes.
```

## Worked example
<inline: paste the expected report for tests/fixtures/gapped-requirements.md
(see T04). Demonstrates strict-gap behavior end-to-end. ~20-30 lines.>

## What this checker does NOT do
<bullets: does not write to .gsd/; does not invoke slash commands or tool
calls; does not read gsd.db; does not check features.md Cross-Check Table
(informational only); does not check that R### text actually fulfills the
axis semantically — only that the tag is present>

## Harness-agnostic operation
<semantic statement of R011/R012 prohibitions, per MEM014 — no literal
forbidden tokens>
```

### 3. `skills/agent-first-cli/references/verify.md` (T03)

**Purpose**: Impl-mode checker spec. Tells an agent how to gather concrete file:line evidence from a built CLI sample and produce a per-axis pass/fail report.

**Structure** (~130-160 lines):

```
# Verify — Impl-Mode Evidence Check

## When to invoke
<impl-mode; after the CLI builds and runs; against the gitignorer sample or
against a project's own CLI source/test/example surface>

## Inputs
- Required: path to the CLI project root (the directory containing src/, tests/,
  package.json or equivalent)
- Required: built CLI binary available (or `node --tsr`/`tsx` runnable from source)
- Optional: the project's REQUIREMENTS.md (used to cross-reference R### IDs in
  the report; not required)

## What this checker does
<one paragraph: gathers concrete evidence for each axis in eval.md by inspecting
the CLI's source, --help output, schema sub-command output, examples sub-command
output, and tests. Produces per-axis pass/fail with file:line citations.
Strict = errors not warnings — an uncovered axis in impl-mode means the CLI
does not yet implement what its plan claimed it would.>

## Strict rule source
<same paragraph shape as validate.md: rule is in AGENTS.md; this checker
implements the impl-mode half; see AGENTS.md>

## Per-axis evidence procedure
<for each axis 1..8, a sub-section with:
  - "Evidence required": what concrete artifacts demonstrate this axis
    (lifted from eval.md's per-axis "Common evidence" bullets — DO NOT
    duplicate, reference eval.md by name and restate only the procedure)
  - "How to gather": concrete shell commands or grep patterns
    (e.g., for Axis 1: run `cli --help`; run `cli schema commands`;
    run `cli examples <command>`; check each succeeds and emits JSON)
  - "Pass criteria": evidence is present and structurally matches the axis
    contract (typed classes, stable codes, JSON output, etc.)
  - "Common failure modes": 2-3 bullets lifted from pitfalls.md

The 8 sub-sections are short (10-15 lines each); together ~100 lines.>

## Worked example: gitignorer sample
<inline: abbreviated expected verify report for assets/samples/gitignorer/,
showing file:line evidence for all 8 axes. ~30-40 lines. Demonstrates
"passing" report shape.>

## Error catalog
| Code | Severity | Meaning |
|---|---|---|
| E_AXIS_NOT_IMPLEMENTED | error | Axis N has no concrete evidence in the CLI source/tests/output |
| E_SAMPLE_MISSING | error | Sample project path does not exist or is not built |
| E_EVIDENCE_WEAK | error | Evidence exists but does not satisfy per-axis pass criteria (e.g., errors exist but no toJSON method) |
| E_EXAMPLES_LIE | error | Example or schema output does not match runtime behavior (per pitfalls.md lying-examples pitfall) |
| W_EVIDENCE_THIN | warning | Evidence present but minimal; recommend strengthening |

## Report format
<same shape as validate.md: verdict block + per-axis audit table + per-axis
detail sections. Per-axis detail includes "Evidence" subsection with
file:line citations and 1-sentence justification per citation.>

## What this checker does NOT do
<bullets paralleling validate.md; plus: does not modify the CLI source;
does not run mutating commands without --dry-run; does not execute tests
beyond smoke checks (--help, --version, schema, examples)>

## Harness-agnostic operation
<same semantic statement as validate.md>
```

### 4. `skills/agent-first-cli/tests/fixtures/gapped-requirements.md` (T04)

**Purpose**: Regression fixture for the strict-gap success criterion. A 50-60 line REQUIREMENTS.md with a deliberate Axis 5 gap and an orphan R###, so validate.md's worked example is grounded in a real file an agent can re-validate.

**Structure** (~50-60 lines):

- 8-10 R### blocks lifted from requirements.md, with:
  - Axis 5 R### REMOVED (R005 absent) — exercises E_AXIS_UNCOVERED
  - One extra R### (e.g., R014) with Source: this-skill, no Axis tag, no out-of-scope — exercises E_ORPHAN_REQUIREMENT
- Same hyphen-label format per MEM015
- Header explaining the fixture's purpose

### 5. Updates to existing files (potentially)

- `skills/agent-first-cli/AGENTS.md` — if Q1's "two valid out-of-scope forms" needs to be reflected in the rule's example table. Recommend adding one row to the "Axis → R###" table OR a footnote; ~3 lines of change. **Likely no change needed** — current AGENTS.md text already says "An R### (or a Notes entry on a covering R###) saying `out-of-scope: {reason}`" which is permissive enough to cover both forms via "An R###" (covers Status-field form).
- `skills/agent-first-cli/SKILL.md` — no change; routing table already references validate.md and verify.md.
- `skills/agent-first-cli/references/requirements.md` — no change required; the existing file already parses cleanly under the proposed rules.

## Verification

Per-file checks an executor can run:

### eval.md verification

```bash
# 1. File exists at expected path
test -f skills/agent-first-cli/references/eval.md

# 2. All 8 axes present as H2 sections (canonical names)
for axis in "Axis 1 — Discoverability" "Axis 2 — Invocation" "Axis 3 — I/O" \
            "Axis 4 — State" "Axis 5 — Error" "Axis 6 — Exit Code" \
            "Axis 7 — Idempotency" "Axis 8 — Examples"; do
  grep -q "^## $axis" skills/agent-first-cli/references/eval.md \
    || { echo "MISSING: $axis"; exit 1; }
done

# 3. Length within budget (~120-180 lines)
LINES=$(wc -l < skills/agent-first-cli/references/eval.md)
[ "$LINES" -ge 100 ] && [ "$LINES" -le 200 ] || { echo "BAD LENGTH: $LINES"; exit 1; }

# 4. R011/R012 forbidden-token gate — no literal forbidden tokens
#    (semantic restatement only; per MEM014)
grep -nE '(/gsd-|gsd_[a-z]+\(|gsd\.db)' skills/agent-first-cli/references/eval.md \
  && { echo "FORBIDDEN TOKEN FOUND"; exit 1; } || true
```

### validate.md verification

```bash
# 1. File exists
test -f skills/agent-first-cli/references/validate.md

# 2. Required sections present
for section in "## When to invoke" "## Inputs" "## Strict rule source" \
               "## Parsing rules" "## Algorithm" "## Error catalog" \
               "## Report format" "## Worked example" \
               "## What this checker does NOT do" \
               "## Harness-agnostic operation"; do
  grep -q "^$section" skills/agent-first-cli/references/validate.md \
    || { echo "MISSING SECTION: $section"; exit 1; }
done

# 3. References eval.md and AGENTS.md by name (not duplicating content)
grep -q 'eval.md' skills/agent-first-cli/references/validate.md
grep -q 'AGENTS.md' skills/agent-first-cli/references/validate.md

# 4. Strict-rule encoding — single semantic sentence, no re-quote of the rule body
#    (the rule body lives in AGENTS.md)
grep -q 'strict bidirectional coverage rule' skills/agent-first-cli/references/validate.md

# 5. Forbidden-token gate
grep -nE '(/gsd-|gsd_[a-z]+\(|gsd\.db|\.gsd/.*write|\.gsd/.*author)' \
  skills/agent-first-cli/references/validate.md \
  && { echo "FORBIDDEN TOKEN FOUND"; exit 1; } || true

# 6. All 4 error codes from the catalog appear in the algorithm or report format
for code in E_INPUT_MISSING E_AXIS_UNCOVERED E_ORPHAN_REQUIREMENT \
            E_OUT_OF_SCOPE_NO_REASON W_COVERAGE_TABLE_DRIFT; do
  grep -q "$code" skills/agent-first-cli/references/validate.md \
    || { echo "MISSING ERROR CODE: $code"; exit 1; }
done

# 7. Worked example demonstrates strict-gap behavior (mentions E_AXIS_UNCOVERED
#    in the example block)
grep -A 30 '## Worked example' skills/agent-first-cli/references/validate.md \
  | grep -q 'E_AXIS_UNCOVERED'
```

### verify.md verification

```bash
# 1. File exists
test -f skills/agent-first-cli/references/verify.md

# 2. Required sections present
for section in "## When to invoke" "## Inputs" "## Strict rule source" \
               "## Per-axis evidence procedure" "## Worked example" \
               "## Error catalog" "## Report format" \
               "## What this checker does NOT do" \
               "## Harness-agnostic operation"; do
  grep -q "^$section" skills/agent-first-cli/references/verify.md \
    || { echo "MISSING SECTION: $section"; exit 1; }
done

# 3. All 8 axes have evidence-procedure sub-sections
for n in 1 2 3 4 5 6 7 8; do
  grep -q "^### Axis $n " skills/agent-first-cli/references/verify.md \
    || { echo "MISSING AXIS SECTION: $n"; exit 1; }
done

# 4. Forbidden-token gate
grep -nE '(/gsd-|gsd_[a-z]+\(|gsd\.db)' \
  skills/agent-first-cli/references/verify.md \
  && { echo "FORBIDDEN TOKEN FOUND"; exit 1; } || true

# 5. gitignorer worked example cites file:line evidence for at least 6 of 8 axes
#    (sample may not fully cover all 8 — that's a verify report finding, not a
#    spec defect)
grep -A 50 '## Worked example' skills/agent-first-cli/references/verify.md \
  | grep -cE 'src/[a-z/]+\.(ts|js):[0-9]+' \
  | awk '$1 >= 6 { exit 0 } { exit 1 }'
```

### Fixture verification

```bash
# Fixture exists and parses as expected
test -f skills/agent-first-cli/tests/fixtures/gapped-requirements.md

# Has exactly the deliberate gap (Axis 5 absent from Notes)
! grep -q 'Axis: 5' skills/agent-first-cli/tests/fixtures/gapped-requirements.md \
  || { echo "FIXTURE INVALID: Axis 5 tag present"; exit 1; }

# Has the orphan R### (R014 with Source: this-skill, no Axis tag)
grep -q '^### R014' skills/agent-first-cli/tests/fixtures/gapped-requirements.md
grep -A 12 '^### R014' skills/agent-first-cli/tests/fixtures/gapped-requirements.md \
  | grep -q 'Source: this-skill'
grep -A 12 '^### R014' skills/agent-first-cli/tests/fixtures/gapped-requirements.md \
  | grep -L 'Axis:'  # the R014 block must NOT contain an Axis: tag

# Uses MEM015-compliant hyphen-label format (not bold-label)
grep -q '^- Why it matters:' skills/agent-first-cli/tests/fixtures/gapped-requirements.md
```

### Cross-cutting checks

```bash
# 1. SKILL.md routing table still validates (eval.md is NOT a sub-command;
#    validate and verify ARE)
grep -q '| `agent-first-cli validate`' skills/agent-first-cli/SKILL.md
grep -q '| `agent-first-cli verify`' skills/agent-first-cli/SKILL.md
! grep -q '| `agent-first-cli eval`' skills/agent-first-cli/SKILL.md

# 2. No new writes to .gsd/ in any of the 3 new files
#    (semantic check: none of the 3 files describe authoring .gsd/ content)
for f in eval.md validate.md verify.md; do
  ! grep -qE '^(```|    )?(cat|echo|write).*\.gsd/' \
    skills/agent-first-cli/references/$f
done

# 3. All 3 files stay within rough length budget
for f in eval.md validate.md verify.md; do
  L=$(wc -l < skills/agent-first-cli/references/$f)
  [ "$L" -le 220 ] || { echo "$f TOO LONG: $L lines"; exit 1; }
done
```

### Demonstration of strict-gap success criterion

```bash
# The skill's roadmap success criterion is satisfied if a reader following
# validate.md's procedure against the fixture produces the report shown in
# validate.md's Worked Example section. Manual demonstration: an agent
# (or human) reads validate.md, applies the algorithm to
# tests/fixtures/gapped-requirements.md, and produces a report containing
# at minimum:
#   - Verdict: FAIL
#   - Per-axis audit table with Axis 5 marked UNCOVERED
#   - Error: E_AXIS_UNCOVERED (Axis 5)
#   - Error: E_ORPHAN_REQUIREMENT (R014)
#
# This is verifiable by a future executor by re-running the procedure
# against the fixture; it is not a programmatic test (the skill ships no
# executables, per design).
```

## Sources

- `skills/agent-first-cli/AGENTS.md` (78 lines) — strict rule, two direction tables, pointers to eval/validate/verify.
- `skills/agent-first-cli/SKILL.md` (~62 lines) — routing table; eval.md explicitly NOT a sub-command.
- `skills/agent-first-cli/references/requirements.md` (140 lines) — 12 starter R###s with Axis tags + Coverage Table; anti-features use `Status: out-of-scope`.
- `skills/agent-first-cli/references/features.md` (~290 lines) — 27 P0 features, Cross-Check Table (informational for S04).
- `skills/agent-first-cli/references/stack.md`, `architecture.md`, `pitfalls.md` — citation conventions + warning-sign source for eval.md failure-symptom bullets.
- `skills/agent-first-cli/assets/samples/gitignorer/src/schema/errors.ts` and `src/cli/error-handler.ts` — concrete evidence examples for verify.md worked example (Axes 5, 6).
- `/Users/jason/.agents/skills/agent-dx-cli-scale/SKILL.md` — legacy prior art for per-axis criterion structure (different axis model; structural inspiration only).
- `/Users/jason/.gsd/agent/extensions/gsd/templates/milestone-validation.md` — GSD template shape for verdict + audit-table report format (R005 shape-match target).
- MEM002, MEM003, MEM004, MEM006, MEM007, MEM008, MEM009, MEM010, MEM014, MEM015 — architectural memory entries constraining this slice.
