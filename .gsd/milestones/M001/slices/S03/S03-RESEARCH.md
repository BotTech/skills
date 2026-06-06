# S03 — Reference content: stack, features, architecture, pitfalls, requirements

**Date:** 2026-06-06
**Slice goal:** Author 5 reference files in `skills/agent-first-cli/references/` (stack.md, features.md, architecture.md, pitfalls.md, requirements.md) that (a) shape-match GSD's deep-mode research templates, (b) encode the 8 agent-first axes from SKILL.md's description, and (c) feed S04's validate/verify and S05's gitignorer verification.

## Summary

S03 is a **5-file content authoring slice** with one cross-cutting invariant: every file must shape-match a specific GSD template so a planning agent can lift content directly into `.gsd/research/{STACK,FEATURES,ARCHITECTURE,PITFALLS}.md` or `.gsd/REQUIREMENTS.md` without translation. The riskiest deliverable is `requirements.md`, which must ship **starter R###s pre-tagged with `Axis: N` notes** — these R###s are the data that S04's validate/verify will check against. The 8 axes themselves live in `eval.md` (owned by S04), so S03 files **reference axes by stable ID ("Axis 1", "Axis 4")** per R013 but do not redefine them.

Templates are at `/Users/jason/.gsd/agent/extensions/gsd/templates/` and `/Users/jason/.gsd/agent/extensions/gsd/prompts/guided-research-project.md`. The gitignorer sample at `skills/agent-first-cli/assets/samples/gitignorer/` is a complete axis-by-axis reference (verified: each axis maps to concrete source files). Prior source material: `~/.agents/skills/agent-dx-cli-scale/SKILL.md` (7-axis eval — superseded), `~/.agents/skills/gsd-new-cli-project/references/rewrite-your-cli-for-ai-agents.md` (canonical blog post), `~/.agents/skills/gsd-new-cli-project/SKILL.md` (broken but has good per-context content).

## Recommendation

Plan S03 as **5 independent file tasks + 1 final verification task**. Each reference file is a self-contained seam — there is no shared runtime, no orchestration, no dependency on another S03 file landing first. The only cross-cutting work is **axis ID consistency** (R013): pick the canonical axis numbering once at the top of the slice, then every file uses the same `Axis N` labels. Final task runs a verification battery (file existence, section-header shape match, axis tag coverage, forbidden-token gate per R011/R012, stable-axis-ID lint).

**Build order**: requirements.md first (it defines the starter R###s that the other four files will reference), then stack/features/architecture/pitfalls in any order (parallel-safe), then verification.

## The 8 canonical axes (from SKILL.md description — DO NOT redefine in S03 files)

These are the canonical axis names and order, lifted verbatim from `skills/agent-first-cli/SKILL.md` line 4:

| # | Axis name | One-line meaning (for S03 authors) |
|---|---|---|
| 1 | discoverability | Agent can find what commands, schemas, and examples exist without external docs. |
| 2 | invocation | Agent can drive the CLI via structured input (--input json, stdin JSON, --params) without bespoke flags. |
| 3 | I/O | Output is structured (JSON/NDJSON), stdout/stderr separated, TTY-aware defaults. |
| 4 | state | CLI is idempotent across runs; cache, side-effects, and persistent state are explicit and well-defined. |
| 5 | errors | Errors are typed, structured (JSON), and include code+message+context fields. |
| 6 | exit codes | Exit codes form a stable taxonomy; each error class maps to a distinct exit code. |
| 7 | idempotency | Same input → same output / no duplicate side effects; mutating ops are dry-runnable. |
| 8 | examples | CLI ships runnable examples (sub-command) for every command; agents can introspect payloads without guessing. |

**R013 invariant:** every reference file uses `Axis 1` … `Axis 8` (numeric ID, this exact name). Do **not** use `axis: discoverability`, `Axis #1`, `A1`, or section anchors. Do **not** link to other files with paths like `references/eval.md#axis-4` — use "see eval.md" or "Axis 4".

## Implementation Landscape

### Key Files

**Source material to read before authoring:**

- `skills/agent-first-cli/SKILL.md` (lines 1-45) — already shipped by S02; contains the 7-row routing table and the 8-axis enumeration in the description field. **No edits needed in S03.**
- `skills/agent-first-cli/AGENTS.md` (lines 1-33) — already shipped by S02; declares the strict bidirectional rule. Reference this file by name ("per AGENTS.md", "see AGENTS.md") from `requirements.md` rather than re-declaring the rule.
- `~/.agents/skills/gsd-new-cli-project/references/rewrite-your-cli-for-ai-agents.md` — canonical blog post. Primary source for `architecture.md` (data flow narrative, multi-surface section) and `pitfalls.md` (input hardening, prompt injection, dry-run).
- `~/.agents/skills/gsd-new-cli-project/SKILL.md` — broken (`/gsd-new-project` invocation leak) but contains a complete `<context research_type="stack">`, `<context research_type="features">`, `<context research_type="architecture">`, `<context research_type="pitfalls">` block that maps almost 1:1 to the 4 reference files. Use as **content scaffolding**, not as a model for shape (it uses XML tags, not GSD template headers).
- `~/.agents/skills/agent-dx-cli-scale/SKILL.md` — earlier 7-axis eval (Machine-Readable Output, Raw Payload, Schema Introspection, Context Window Discipline, Input Hardening, Safety Rails, Agent Knowledge Packaging). **Superseded** by the 8-axis version in SKILL.md, but the 0/1/2/3 scoring prose per old-axis is excellent raw material — adapt it to the new 8-axis structure where the old axis maps onto a new one (e.g., old "Machine-Readable Output" → new Axis 3 I/O + Axis 1 discoverability).
- `skills/agent-first-cli/assets/samples/gitignorer/src/**` — concrete axis-by-axis evidence (see table below).

**GSD templates to shape-match:**

- `/Users/jason/.gsd/agent/extensions/gsd/prompts/guided-research-project.md` — defines the 4 research file shapes (stack/features/architecture/pitfalls). Authoritative on section headers.
- `/Users/jason/.gsd/agent/extensions/gsd/templates/requirements.md` — defines the R### block shape. Authoritative on field order.

**Files S03 must create:**

- `skills/agent-first-cli/references/stack.md`
- `skills/agent-first-cli/references/features.md`
- `skills/agent-first-cli/references/architecture.md`
- `skills/agent-first-cli/references/pitfalls.md`
- `skills/agent-first-cli/references/requirements.md`

The `references/.gitkeep` stays in place — `.gitkeep` is removed by git automatically once real files exist in the directory.

### Per-file shape contract (the single most important constraint in S03)

Each reference file MUST match its target GSD template's section headers. The exact headers are below — these come from `guided-research-project.md` and `templates/requirements.md`. Executors should copy them verbatim.

#### `stack.md` — shape mirrors `.gsd/research/STACK.md`

Required top-level headers (in this order):

```markdown
# Stack — Agent-First CLI

## Recommended Stack
## Alternatives Considered
## What NOT to Use
## Open Questions
```

Inside `Recommended Stack`, use a 5-column table mirroring the gitignorer STACK.md example:

```markdown
| Component | Library | Version | Confidence | Rationale |
|---|---|---|---|---|
```

Inside `What NOT to Use`, use a 2-column table:

```markdown
| Option | Avoid Because |
|---|---|
```

**Axis relevance (for R013):** stack choices directly enable Axis 2 (invocation — needs JSON-aware CLI framework), Axis 3 (I/O — needs NDJSON library, async I/O), Axis 5 (errors — needs error-serialization story). Tag relevant rows with "Supports Axis N" in the Rationale column, not as a separate column.

#### `features.md` — shape mirrors `.gsd/research/FEATURES.md`

Required top-level headers (per-category sections; the categories below are the canonical agent-first feature groups — do not change them):

```markdown
# Features — Agent-First CLI

## Discoverability Features
## Invocation Features
## I/O Features
## State Features
## Error Features
## Exit Code Features
## Idempotency Features
## Examples Features
## Differentiators
## Anti-Features
## Cross-Check vs REQUIREMENTS.md
```

For the 8 axis-aligned feature sections, use a 4-column table:

```markdown
| Feature | Why Required | Priority | Complexity |
|---|---|---|---|
```

Priority values: `P0` (required for axis coverage), `P1` (strongly recommended), `P2` (differentiator).
Each row's `Why Required` should explicitly cite the axis: "Required for Axis 1 (discoverability)".

The `Cross-Check vs REQUIREMENTS.md` section should be a short table mapping each P0 feature to a starter R### from `requirements.md`. This is the S03 internal cross-reference — executors can leave it as a stub initially and fill after `requirements.md` is authored.

#### `architecture.md` — shape mirrors `.gsd/research/ARCHITECTURE.md`

Required top-level headers:

```markdown
# Architecture — Agent-First CLI

## Recommended Architecture
## Data Model Sketch
## Integration Points
## Scaling Tier
## Reversibility Risk
```

Inside `Recommended Architecture`, include a component-by-component breakdown in this exact table format (lifted from the source gsd-new-cli-project SKILL.md `<context research_type="architecture">`):

```markdown
| Component | Input | Output | Responsibilities |
|---|---|---|---|
| Entry Points | CLI args, subcommands | Parsed route | Command routing, help text, version |
| Flag Parser | Command flags | Parsed key-values | Human-facing convenience flags, defaults |
| JSON Parser | --input json, stdin | Structured payload | Raw API payload input for agents, validation |
| Input Handler | Parsed input | Sanitized data | Validation, hardening, sanitization |
| Command Layer | Validated data | Business result | Logic execution, dry-run gate, error handling |
| Output Formatter | Result | JSON/NDJSON/human | Structured output, streaming pagination, mode-aware |
| Error Handler | Thrown errors | Structured JSON + exit code | Maps error class to exit code; never loses class info |
| Examples/Schema Surface | Sub-command invocation | JSON payload/schema | Self-documentation for agents |
```

Plus a **Data Flow Sequence** numbered list showing entry → parse → validate → execute → format → return (lifted from source SKILL.md `<context research_type="architecture">`).

**Axis relevance:** architecture directly serves all 8 axes via component boundaries. Tag each component row with which axes it owns in the Responsibilities column ("Owns Axis 5 errors, Axis 6 exit codes").

#### `pitfalls.md` — shape mirrors `.gsd/research/PITFALLS.md`

Required top-level headers (omit "Migration Pitfalls" only if project is greenfield; the agent-first CLI use case assumes greenfield, so include but mark as "N/A for greenfield CLIs"):

```markdown
# Pitfalls — Agent-First CLI

## Domain Pitfalls
## Stack Pitfalls
## Scope Traps
## Compliance / Security Gotchas
## Migration Pitfalls
```

Inside each section, use a 4-field block per pitfall (NOT a table — pitfalls need prose):

```markdown
### Pitfall: <name>
**What goes wrong:** <one paragraph>
**Why it happens:** <one paragraph>
**How to avoid:** <one paragraph, referencing the axis it threatens>
**Warning signs:** <comma-separated observable symptoms>
```

Required pitfalls (from source gsd-new-cli-project SKILL.md `<context research_type="pitfalls">`):

1. Blocking I/O (threatens Axis 3)
2. Mixed output formats on stdout (threatens Axis 3, Axis 5)
3. Missing input validation (threatens Axis 5)
4. Missing response sanitization for prompt injection (threatens Axis 5)
5. No dry-run for mutating operations (threatens Axis 7)
6. Exit code drift across commands (threatens Axis 6)
7. Non-idempotent cache or side effects (threatens Axis 4, Axis 7)
8. Examples and schemas that lie (threaten Axis 1, Axis 8)

#### `requirements.md` — shape mirrors `templates/requirements.md` per-R### block

This is the **riskiest** file because S04 depends on it directly. Required top-level headers:

```markdown
# Requirements — Agent-First CLI

## How to Use This File
## Starter Requirements
## Out-of-Scope (Intentional Non-Goals)
## Coverage Table
```

`How to Use This File` is a 2-paragraph section explaining: copy the starter R###s into your project's `.gsd/REQUIREMENTS.md`, renumber to your project's R### sequence, preserve the `Axis: N` tag in Notes. Reference AGENTS.md for the strict rule.

`Starter Requirements` contains **one R### block per axis** (8 minimum) plus optional supporting R###s. Each block uses this exact shape (lifted from `templates/requirements.md`):

```markdown
### R001 — <Title>
- Class: <one of the canonical classes>
- Status: active
- Description: <plain language>
- Why it matters: <one sentence>
- Source: this-skill
- Primary owning slice: <user-fills-in>
- Supporting slices: none
- Validation: unmapped
- Notes: Axis: N (covers axis N — <axis name>). <optional additional notes>
```

Canonical requirement class values (from `templates/requirements.md` and `gsd_requirement_save` schema):
core-capability, primary-user-loop, launchability, continuity, failure-visibility, integration, quality-attribute, operability, admin/support, compliance/security, differentiator, constraint, anti-feature.

**Required starter R###s (one per axis, minimum 8):**

| Starter R# | Title (suggested) | Class | Axis |
|---|---|---|---|
| R001 | CLI ships `examples <command>` and `schema <resource>` sub-commands | core-capability | Axis 1 |
| R002 | CLI accepts `--input json` and stdin JSON payloads alongside flags | core-capability | Axis 2 |
| R003 | CLI separates stdout (data) and stderr (messages); supports `--output json\|ndjson\|stdout` with TTY-aware defaults | core-capability | Axis 3 |
| R004 | CLI documents all persistent state (cache location, side effects) and is idempotent across repeated invocations | operability | Axis 4 |
| R005 | All errors are typed classes with `{error, message, ...context}` JSON shape and a stable error code | failure-visibility | Axis 5 |
| R006 | Exit codes form a stable taxonomy (e.g., 1=validation, 2=external-deps, 3=filesystem, 4=business) and are documented | failure-visibility | Axis 6 |
| R007 | All mutating commands support `--dry-run`; same input produces same output across runs | quality-attribute | Axis 7 |
| R008 | CLI ships `examples <command>` with runnable JSON payloads for every command | operability | Axis 8 |

(These IDs are *suggested* — the executor can use R001-R008 or any contiguous block. The IDs are placeholders users will renumber when copying into their project's REQUIREMENTS.md.)

`Out-of-Scope` section should contain 2-3 explicit anti-features to demonstrate the pattern:
- "MCP server (out of scope for v1; bash invocation is sufficient for current agents)"
- "Multi-language samples beyond TypeScript/Node"
- "GUI / TUI beyond flag-driven interactive mode"

`Coverage Table` is a 3-column table at the bottom mapping Axis → Starter R### → Notes:

```markdown
| Axis | Covered by Starter R### | Notes |
|---|---|---|
| Axis 1 (discoverability) | R001 | via examples + schema commands |
| Axis 2 (invocation) | R002 | --input json + stdin |
... etc through Axis 8 ...
```

This table is what makes S04's validate check trivial: it can read this file and grep for `Axis: \d` in Notes fields.

### Build Order

1. **requirements.md first.** It defines the starter R###s and the Axis → R### mapping that the other 4 files reference. Riskiest file because S04 consumes it directly. ~30-45 minutes.
2. **features.md second.** It cross-references the starter R###s and is the densest file (8 axis-aligned tables). ~30-45 minutes.
3. **stack.md, architecture.md, pitfalls.md in any order (parallel-safe).** Each is independent of the others; each references axes by ID but not by R###. ~20-30 min each.
4. **Verification task last.** Mechanical battery of shape checks and token gates. ~30 minutes.

### Verification Approach

Final task runs a `gsd_exec` script that checks, for each reference file:

```bash
# Shape check (per file)
for ref in stack features architecture pitfalls requirements; do
  test -f "skills/agent-first-cli/references/$ref.md"
done

# Section header shape match (exact-match the canonical headers)
grep -q "^## Recommended Stack$"        skills/agent-first-cli/references/stack.md
grep -q "^## Alternatives Considered$"  skills/agent-first-cli/references/stack.md
grep -q "^## What NOT to Use$"          skills/agent-first-cli/references/stack.md
grep -q "^## Open Questions$"           skills/agent-first-cli/references/stack.md

grep -q "^## Differentiators$"          skills/agent-first-cli/references/features.md
grep -q "^## Anti-Features$"            skills/agent-first-cli/references/features.md
grep -q "^## Cross-Check vs REQUIREMENTS.md$" skills/agent-first-cli/references/features.md
# ... and so on for each file's required headers

# Axis tag coverage — requirements.md has Axis: N for all 8 axes
for n in 1 2 3 4 5 6 7 8; do
  grep -q "Axis: $n\|Axis $n\|Axis: \[$n" skills/agent-first-cli/references/requirements.md
done

# R011 — no .gsd/ write instructions
! grep -qE "(create|write|save|append|update|modify|edit)[^.]*\.gsd/" \
  skills/agent-first-cli/references/*.md

# R012 — no gsd-pi coupling tokens
! grep -qE "/gsd-|gsd_|gsd\.db|gsd-pi" skills/agent-first-cli/references/*.md

# R013 — stable axis IDs (no anchors or path-style refs)
! grep -qE "axis-[0-9]|references/.*\.md#" skills/agent-first-cli/references/*.md

# Cross-references use role, not deep links (R013)
grep -q "see AGENTS.md\|per AGENTS.md\|per the strict rule in AGENTS.md" \
  skills/agent-first-cli/references/requirements.md
```

Plus a manual smoke check: for each reference file, the loaded file is the only one a user gets when they invoke the matching sub-command. (This is enforced structurally by SKILL.md's routing table — S02 already verified it.)

## Don't Hand-Roll

| Problem | Existing Solution | Why Use It |
|---|---|---|
| Section headers per file | `prompts/guided-research-project.md` defines them | Already the canonical GSD shape; matching it makes the file directly liftable |
| R### block shape | `templates/requirements.md` | Same — directly liftable |
| Error-class taxonomy | gitignorer `src/schema/errors.ts` (4 classes, exitCode 1/2/3/4) | Real working example; documented in `pitfalls.md` and `architecture.md` |
| Axis-by-axis concrete examples | gitignorer `src/**` (see table below) | Real reference implementation; S05 will verify against it |
| Blog source for architecture/pitfalls narrative | `rewrite-your-cli-for-ai-agents.md` | Canonical CC-BY-SA content; fold into architecture.md (multi-surface, data flow) and pitfalls.md (input hardening, dry-run) |

## Constraints

- **R005 (shape-match):** every section header in every reference file MUST match its GSD template's section header verbatim. Different capitalization, different ordering, or extra sections break the lift contract.
- **R006 (Axis tag format):** `Axis: N` in the Notes field of every starter R### in requirements.md. N is the integer 1-8 from SKILL.md's description order.
- **R011 (no .gsd/ writes):** no file in references/ instructs the agent to write to `.gsd/`. Prohibitions ("do not write to .gsd/") are fine; imperative write instructions are not.
- **R012 (no gsd-pi coupling):** no `/gsd-*`, no `gsd_*`, no `gsd.db`, no `gsd-pi` strings anywhere in references/. State prohibitions semantically per MEM014 (e.g., "the skill stays harness-agnostic") rather than restating the literal tokens.
- **R013 (stable axis IDs):** every cross-reference uses `Axis N` or `Axis: N`. No section anchors (`#axis-4`), no relative paths with fragments (`references/eval.md#axis-4`). Cross-file refs use role ("see eval.md", "see AGENTS.md").
- **Length budget:** each reference file target ≤ 200 lines. Stack and pitfalls are typically shortest (~100-150); features and architecture are typically longest (~200). Requirements.md is medium (~150). These are guidelines, not hard caps, but the file should not balloon.
- **No XML tags in reference files.** S02's AGENTS.md uses plain markdown by design; reference files follow suit. Tables, headers, lists — no `<context>` or `<essential_principles>`-style tags.

## Common Pitfalls

- **Re-defining the 8 axes inside an S03 file.** Axes live in `eval.md` (S04-owned). S03 files reference them by ID only. Re-declaring axes in stack.md or requirements.md causes drift the moment S04 lands eval.md.
- **Cross-referencing by section anchor.** `references/eval.md#axis-4` breaks the moment eval.md's headers change. Use "see eval.md" + "Axis 4".
- **Restating the strict rule in requirements.md.** AGENTS.md owns the rule. requirements.md says "per the strict rule in AGENTS.md" once and moves on.
- **Using R### IDs that collide with the user's project.** Starter R###s are explicitly placeholders; document that users will renumber when copying into their `.gsd/REQUIREMENTS.md`.
- **Writing R###s without an Axis tag.** Every starter R### MUST have an `Axis: N` (or multiple `Axis: [M,N]`) tag. R###s without tags become orphan R###s under AGENTS.md's strict rule.
- **Inventing a 9th axis.** SKILL.md description enumerates 8 axes (discoverability, invocation, I/O, state, errors, exit codes, idempotency, examples). If a feature doesn't fit, it's a differentiator or out-of-scope — not a new axis.
- **Forgetting the gitignorer sample.** Every recommendation should be traceable to a concrete file path in `assets/samples/gitignorer/src/**`. S05 will verify; if the references describe something gitignorer doesn't do, the verify report fails.

## Open Risks

- **The source gsd-new-cli-project SKILL.md content is good but shaped wrong.** The `<context research_type="stack">` blocks contain excellent raw material but use XML-style tags, not GSD template headers. Executors must translate shape, not copy verbatim. (Why it matters: copying the source verbatim produces files that fail the shape-match gate.)
- **The 7-axis → 8-axis translation is not 1:1.** The old "Machine-Readable Output" axis splits across new Axis 3 (I/O) and Axis 1 (discoverability); old "Safety Rails" splits across Axis 5 (errors) and Axis 7 (idempotency); old "Agent Knowledge Packaging" mostly rolls into Axis 1 + Axis 8. Executors must think about the mapping, not just rename. (Why it matters: mis-mapping produces R###s that don't actually cover the new axes.)
- **Axis 4 (state) is the least documented in prior art.** None of the source material has a strong section on state, idempotency, and cache semantics as a first-class axis. Executors will need to derive content from the gitignorer sample (`services/cache.service.ts`, `services/git.service.ts`, the pull-or-clone pattern in `commands/update.ts`) rather than from prior text. (Why it matters: thin Axis 4 coverage → weak requirements.md starter → validate report that passes superficially but doesn't catch real state bugs.)
- **`requirements.md` IDs may conflict with users' existing R###s.** Users with a mature `.gsd/REQUIREMENTS.md` may already have R001-R050. The skill's starter R001-R008 will collide. Mitigation: "How to Use This File" section explicitly says "renumber to your project's sequence" — but users may not read it. (Why it matters: collision creates confusion at adoption time.)

## Skills Discovered

| Technology | Skill | Status |
|---|---|---|
| SKILL.md authoring | `~/.gsd/agent/skills/create-skill/SKILL.md` | installed (bundled with GSD; do NOT modify) |
| GSD extension authoring (irrelevant here) | `~/.gsd/agent/skills/create-gsd-extension/SKILL.md` | installed (not used; this skill is content-only) |

No new skills to install. S03 is pure content authoring against existing templates.

## Sources

- GSD research template shape — `/Users/jason/.gsd/agent/extensions/gsd/prompts/guided-research-project.md` (Task 1-4 prompts define the 4 research file shapes)
- GSD requirements template shape — `/Users/jason/.gsd/agent/extensions/gsd/templates/requirements.md`
- Canonical 8-axis list — `skills/agent-first-cli/SKILL.md` description field (line 4)
- Strict bidirectional rule — `skills/agent-first-cli/AGENTS.md`
- Original blog post (architecture + pitfalls source material) — `~/.agents/skills/gsd-new-cli-project/references/rewrite-your-cli-for-ai-agents.md`
- Previous broken skill (content scaffolding only, not shape) — `~/.agents/skills/gsd-new-cli-project/SKILL.md`
- Previous 7-axis eval (superseded, raw material for 8-axis translation) — `~/.agents/skills/agent-dx-cli-scale/SKILL.md`
- Real axis-by-axis implementation evidence — `skills/agent-first-cli/assets/samples/gitignorer/src/**`
- gitignorer's own STACK.md (real example of shape) — `skills/agent-first-cli/assets/samples/gitignorer/.planning/research/STACK.md`
- gitignorer's own FEATURES.md (real example of shape) — `skills/agent-first-cli/assets/samples/gitignorer/.planning/research/FEATURES.md`

## Appendix — Concrete axis evidence in the gitignorer sample

For S05 verification and for use as concrete examples inside S03 reference files. Each axis is demonstrated by specific source files:

| Axis | gitignorer evidence (file:role) |
|---|---|
| Axis 1 (discoverability) | `src/commands/examples.ts` (show JSON examples per command), `src/commands/schema.ts` (show schema per resource), `src/cli/program.ts` (Commander's built-in help) |
| Axis 2 (invocation) | `src/cli/flags.ts` (`--input json` option), `src/parsers/stdin.ts` (async stdin JSON parser), `src/schema/input.ts` (`jsonInputSchema` zod schema), `src/cli/mode.ts` (`CliMode.AGENT`) |
| Axis 3 (I/O) | `src/formatters/json.ts`, `src/formatters/ndjson.ts`, `src/formatters/human.ts` (3 formatters by mode), `src/cli/mode.ts` (`resolveMode` based on `process.stdout.isTTY`), `src/cli/program.ts` (`configureOutput` separates stdout/stderr) |
| Axis 4 (state) | `src/services/cache.service.ts` (env-paths XDG cache), `src/services/git.service.ts` (template repo state), `src/commands/update.ts` (pull-or-clone pattern: check existing → pull if exists, clone if not) |
| Axis 5 (errors) | `src/schema/errors.ts` (4 typed classes: ValidationError, GitError, FsError, BusinessError — each with `code`, `toJSON()`), `src/cli/error-handler.ts` (top-level handler serializes to stderr as JSON) |
| Axis 6 (exit codes) | `src/schema/errors.ts` (`exitCode` readonly field per class: 1=validation, 2=git, 3=fs, 4=business), `src/cli/error-handler.ts` (calls `process.exit(err.exitCode)`) |
| Axis 7 (idempotency) | `src/commands/update.ts` (pull-or-clone is idempotent — repeated runs converge), `src/formatters/dry-run.ts` (formatDryRun shows what would be written), `--dry-run` flag in `src/cli/flags.ts` |
| Axis 8 (examples) | `src/commands/examples.ts` (sub-command exists; currently a stub "Not yet implemented" — note this is a partial implementation), `src/commands/schema.ts` (sub-command exists; same partial note) |

**Important caveat for S05:** `examples.ts` and `schema.ts` in the current gitignorer submodule snapshot are stubs ("Not yet implemented"). S05 verification of Axis 1 and Axis 8 may need to either (a) accept "stub command present" as evidence the axis is structurally covered, or (b) flag this as a known limitation in S05's report. S03 reference content should describe the **expected** behavior, not the current stub behavior.

## Appendix — Existing source-material matrix (what to lift from where)

| S03 file | Lift from | Adapt how |
|---|---|---|
| stack.md | `~/.agents/skills/gsd-new-cli-project/SKILL.md` `<context research_type="stack">` block + gitignorer `.planning/research/STACK.md` real example | Drop the XML wrapper, reshape into `## Recommended Stack` / `## What NOT to Use` sections; add Confidence column to the Recommended Stack table |
| features.md | `~/.agents/skills/gsd-new-cli-project/SKILL.md` `<context research_type="features">` block | Reorganize the "Table Stakes" table from flat feature list into 8 axis-aligned sub-sections; keep Differentiators and Anti-features tables as-is; add `## Cross-Check vs REQUIREMENTS.md` section |
| architecture.md | `~/.agents/skills/gsd-new-cli-project/SKILL.md` `<context research_type="architecture">` block + blog post "Multi-Surface" section | Use the Component Spec table as the `## Recommended Architecture` body; lift the Data Flow Sequence as a numbered list; add `## Data Model Sketch` (sketch the request→response shape), `## Integration Points` (CLI ↔ MCP ↔ extensions), `## Scaling Tier` (single-process; not a concern), `## Reversibility Risk` (low — content-only) |
| pitfalls.md | `~/.agents/skills/gsd-new-cli-project/SKILL.md` `<context research_type="pitfalls">` block + blog post input-hardening section | Use the 5 pitfalls from source SKILL.md as starting set; add exit-code drift (Axis 6), idempotency (Axis 7), schema/examples that lie (Axis 1/8) for full axis coverage |
| requirements.md | `~/.agents/skills/agent-dx-cli-scale/SKILL.md` axis definitions + gitignorer's actual error classes/exit codes | Use the 8-axis list from SKILL.md description; one starter R### per axis; Class from the canonical 13-value enum; Notes field uses `Axis: N` tag |

## Appendix — R### class enum (canonical 13 values)

For use in `requirements.md` Class field. Lifted from `gsd_requirement_save` schema and `templates/requirements.md`:

`core-capability`, `primary-user-loop`, `launchability`, `continuity`, `failure-visibility`, `integration`, `quality-attribute`, `operability`, `admin/support`, `compliance/security`, `differentiator`, `constraint`, `anti-feature`

## Appendix — Verification commands executors can run

Each command should be a separate assertion in the final verification task:

```bash
# 1. All 5 files exist
for f in stack features architecture pitfalls requirements; do
  test -f "skills/agent-first-cli/references/$f.md" || echo "MISSING: $f.md"
done

# 2. R005 shape-match — section headers match GSD templates exactly
# (per-file checks listed in the per-file shape contract above)

# 3. R006 — every Axis 1-8 appears in requirements.md Notes fields
for n in 1 2 3 4 5 6 7 8; do
  grep -qE "Axis: $n\b" skills/agent-first-cli/references/requirements.md \
    || echo "MISSING Axis: $n tag in requirements.md"
done

# 4. R011 — no .gsd/ write instructions
! grep -nE "(create|write|save|append|update|modify|edit)[^.]*\.gsd/" \
  skills/agent-first-cli/references/*.md

# 5. R012 — no gsd-pi coupling tokens
! grep -nE "/gsd-|gsd_[a-z]|gsd\.db|gsd-pi" \
  skills/agent-first-cli/references/*.md

# 6. R013 — no axis anchors or deep links
! grep -nE "references/[a-z]+\.md#|eval\.md#axis-" \
  skills/agent-first-cli/references/*.md

# 7. requirements.md references AGENTS.md by role (not by deep link)
grep -q "AGENTS.md" skills/agent-first-cli/references/requirements.md

# 8. Length budgets (soft)
for f in skills/agent-first-cli/references/*.md; do
  echo "$(wc -l < "$f") $f"
done
```

## Start Here

**First file to author:** `skills/agent-first-cli/references/requirements.md`.
**Why:** it defines the 8 starter R###s and the Axis → R### coverage table that the other 4 reference files cite. Features.md's `## Cross-Check vs REQUIREMENTS.md` section reads from this. S04's validate/verify consumes the Axis tags directly. Authoring it first surfaces axis-coverage gaps early; if you can't write a clean starter R### for Axis 4 (state), you don't yet understand the axis well enough to write stack.md or architecture.md either.

**Required pre-reads before authoring any file:**
1. `skills/agent-first-cli/SKILL.md` (45 lines) — for the 8-axis enumeration in the description.
2. `skills/agent-first-cli/AGENTS.md` (33 lines) — for the strict rule that requirements.md must reference.
3. `/Users/jason/.gsd/agent/extensions/gsd/prompts/guided-research-project.md` — for the canonical section headers per research file shape.
4. `/Users/jason/.gsd/agent/extensions/gsd/templates/requirements.md` — for the R### block shape.
5. `skills/agent-first-cli/assets/samples/gitignorer/src/cli/{flags,mode,program,error-handler}.ts` and `src/schema/errors.ts` — for concrete axis-by-axis examples to lift into reference content.
