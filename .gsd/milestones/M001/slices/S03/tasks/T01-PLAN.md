---
estimated_steps: 27
estimated_files: 1
skills_used: []
---

# T01: Author requirements.md (starter R###s with Axis tags)

Why: requirements.md is the riskiest deliverable in S03 — S04's validate/verify consumes the `Axis: N` tags directly, and features.md's `## Cross-Check vs REQUIREMENTS.md` section reads from this file. Authoring it first surfaces axis-coverage gaps before any other file is touched.

Path note (per MEM011): the validator sees this worktree as /Users/jason/.gsd/projects/0809305c93fd/worktrees/M001, which is the same physical directory as the agent cwd /Users/jason/src/bottech/skills/.gsd/worktrees/M001 (symlink alias). All shell commands run from the agent cwd using relative paths; the absolute paths in this plan are only for the validator's path-resolution check.

Do:
1. Read `skills/agent-first-cli/SKILL.md` (45 lines) and `skills/agent-first-cli/AGENTS.md` (33 lines) — these are the source of the 8-axis enumeration and the strict rule.
2. Read `/Users/jason/.gsd/agent/extensions/gsd/templates/requirements.md` to lift the canonical R### block shape (Class/Status/Description/Why/Source/Owner/Supporting/Validation/Notes field order).
3. Create `skills/agent-first-cli/references/requirements.md` with these top-level headers in order:
   - `# Requirements — Agent-First CLI`
   - `## How to Use This File`
   - `## Starter Requirements`
   - `## Out-of-Scope (Intentional Non-Goals)`
   - `## Coverage Table`
4. `## How to Use This File`: 2 short paragraphs. Explain (a) copy starter R###s into your project's REQUIREMENTS.md, renumber to your project's R### sequence, preserve the `Axis: N` tag in Notes; (b) reference AGENTS.md by role ("per the strict rule in AGENTS.md") — do NOT redeclare the rule. State prohibitions semantically per MEM014 (e.g., "the skill stays harness-agnostic" rather than restating forbidden tokens).
5. `## Starter Requirements`: Author ≥8 R### blocks, one per axis. Suggested IDs R001..R008 with this axis mapping (use the exact titles from S03-RESEARCH.md's table):
   - R001 — CLI ships `examples <command>` and `schema <resource>` sub-commands → Axis 1 (discoverability), Class: core-capability
   - R002 — CLI accepts `--input json` and stdin JSON payloads alongside flags → Axis 2 (invocation), Class: core-capability
   - R003 — CLI separates stdout/stderr and supports `--output json|ndjson|stdout` with TTY-aware defaults → Axis 3 (I/O), Class: core-capability
   - R004 — CLI documents all persistent state and is idempotent across repeated invocations → Axis 4 (state), Class: operability
   - R005 — All errors are typed classes with `{error, message, ...context}` JSON shape and a stable error code → Axis 5 (errors), Class: failure-visibility
   - R006 — Exit codes form a stable taxonomy (1=validation, 2=external-deps, 3=filesystem, 4=business) and are documented → Axis 6 (exit codes), Class: failure-visibility
   - R007 — All mutating commands support `--dry-run`; same input produces same output across runs → Axis 7 (idempotency), Class: quality-attribute
   - R008 — CLI ships `examples <command>` with runnable JSON payloads for every command → Axis 8 (examples), Class: operability
   Each R### block uses the EXACT 9-line shape from templates/requirements.md (Class, Status, Description, Why it matters, Source, Primary owning slice, Supporting slices, Validation, Notes). Source: `this-skill`. Primary owning slice: `<user-fills-in>`. Validation: `unmapped`. Notes field MUST contain `Axis: N (covers axis N — <axis name>)` plus any additional clarification; for R005 the Notes also reference gitignorer's 4 error classes (`src/schema/errors.ts`) as a concrete example.
6. `## Out-of-Scope (Intentional Non-Goals)`: 3 anti-feature entries using the same R### block shape (Class: anti-feature, Status: out-of-scope) — (a) MCP server (out of scope for v1; bash invocation suffices), (b) multi-language samples beyond TypeScript/Node, (c) GUI/TUI beyond flag-driven interactive mode. Each gets a short Notes line.
7. `## Coverage Table`: 3-column markdown table at the bottom mapping Axis → Covered by Starter R### → Notes. One row per axis 1..8. Example: `| Axis 1 (discoverability) | R001 | via examples + schema commands |`.
8. Use `Axis N` or `Axis: N` for every axis reference (R013). Do NOT use `axis: discoverability`, `Axis #1`, `A1`, or section anchors like `#axis-4`. Cross-file references use role ("see eval.md", "see AGENTS.md"), never deep links like `references/eval.md#axis-4`.
9. State R011/R012 prohibitions semantically per MEM014 — "the skill stays harness-agnostic", "this file is reference content, not an authoring path" — never the literal forbidden tokens.

Done when: `skills/agent-first-cli/references/requirements.md` exists; all 5 required top-level headers present in order; ≥8 starter R### blocks in `## Starter Requirements`, each with `Axis: N` in Notes; Coverage Table has 8 rows covering Axis 1..Axis 8; at least one role-style reference to AGENTS.md (`grep -q "AGENTS.md" requirements.md` succeeds); no `references/*.md#` deep links; no `.gsd/` write instructions; no `/gsd-` or `gsd_` tokens.

## Inputs

- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/SKILL.md`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/AGENTS.md`

## Expected Output

- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/requirements.md`

## Verification

test -f skills/agent-first-cli/references/requirements.md

## Observability Impact

Defines the Axis tag data shape that S04's validate/verify will consume — this is the contract surface for S04's coverage check.
