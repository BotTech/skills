---
estimated_steps: 33
estimated_files: 1
skills_used: []
---

# T02: Author features.md (8 axis-aligned feature tables + cross-check)

Why: features.md is the densest file (8 axis-aligned feature tables plus differentiators and anti-features). It cross-references the starter R### IDs from T01's requirements.md, so it must run after T01. The `## Cross-Check vs REQUIREMENTS.md` section is the structural bridge between "what features the agent-first CLI ships" and "what requirements trace to those features."

Do:
1. Read `skills/agent-first-cli/references/requirements.md` (T01 output) to get the canonical R001..R008 IDs that the cross-check table will reference.
2. Read `~/.agents/skills/gsd-new-cli-project/SKILL.md`'s `<context research_type="features">` block as content scaffolding (especially the table-stakes table and the Multi-Surface table).
3. Read `skills/agent-first-cli/assets/samples/gitignorer/.planning/research/FEATURES.md` as a real example of shape and content density.
4. Create `skills/agent-first-cli/references/features.md` with these top-level headers IN THIS EXACT ORDER (R005 shape contract):
   - `# Features — Agent-First CLI`
   - `## Discoverability Features` (Axis 1)
   - `## Invocation Features` (Axis 2)
   - `## I/O Features` (Axis 3)
   - `## State Features` (Axis 4)
   - `## Error Features` (Axis 5)
   - `## Exit Code Features` (Axis 6)
   - `## Idempotency Features` (Axis 7)
   - `## Examples Features` (Axis 8)
   - `## Differentiators`
   - `## Anti-Features`
   - `## Cross-Check vs REQUIREMENTS.md`
5. For each of the 8 axis-aligned sections, use a 4-column table: `| Feature | Why Required | Priority | Complexity |`. Priority values: `P0` (required for axis coverage), `P1` (strongly recommended), `P2` (differentiator). Each row's `Why Required` MUST explicitly cite the axis: e.g., "Required for Axis 1 (discoverability) — agents cannot find commands without this." Suggested rows per section (lift from gsd-new-cli-project SKILL.md table-stakes and adapt to each axis):
   - Axis 1 (Discoverability): `examples <cmd>` sub-command; `schema <resource>` sub-command; `--help` JSON variant; command-name conventions that match operation verbs
   - Axis 2 (Invocation): `--input json` flag; stdin JSON parser; zod-validated input schema; raw API payload passthrough (no bespoke flag translation)
   - Axis 3 (I/O): `--output json|ndjson|stdout` with TTY-aware defaults; stdout=data / stderr=messages separation; NDJSON streaming for paginated results; non-TTY auto-mode detection
   - Axis 4 (State): explicit cache location (e.g., env-paths XDG); documented side-effects list; pull-or-clone idempotent pattern; `--no-cache` flag for cache bypass
   - Axis 5 (Errors): typed error classes (ValidationError, GitError, FsError, BusinessError); `toJSON()` on every error class; error code taxonomy as string constants
   - Axis 6 (Exit Codes): documented exit-code table (1=validation, 2=external-deps, 3=filesystem, 4=business); top-level error handler calls `process.exit(err.exitCode)`; help text exits with code 0
   - Axis 7 (Idempotency): `--dry-run` flag on every mutating command; pull-or-clone converges across repeated runs; cache writes are atomic (tmp+rename); mutation list is explicit per command
   - Axis 8 (Examples): `examples <command>` emits runnable JSON for that command; examples are versioned with the CLI; examples include both happy-path and error cases
6. `## Differentiators`: 3-column table (Feature, Value, Complexity) with 3-5 differentiating features beyond axis coverage — e.g., response sanitization for prompt injection, live schema resolution, multi-surface configuration (CLI/MCP/extension from one binary).
7. `## Anti-Features`: 2-column table (Feature, Avoid Because) with 4-6 explicit non-goals — e.g., Web UI, multi-language samples, global config file, scaffolder binary, MCP server (for v1).
8. `## Cross-Check vs REQUIREMENTS.md`: 2-column table mapping each P0 feature from the 8 axis-aligned sections to its starter R### ID from requirements.md. Columns: `| P0 Feature | Starter R### |`. One row per P0 feature; rows reference R001..R008 by ID.
9. Use `Axis N` or `Axis: N` for every axis reference (R013). No deep links, no anchors. No XML tags.
10. State prohibitions semantically per MEM014 — e.g., "no harness-specific slash commands" rather than literal `/gsd-`.

Done when: `skills/agent-first-cli/references/features.md` exists; all 11 top-level headers present in the exact order above; each of the 8 axis-aligned sections has a 4-column table with at least 2 rows; `## Cross-Check vs REQUIREMENTS.md` table references the R001..R008 IDs from T01; every axis-aligned section's `Why Required` column contains `Axis N` or `Axis: N` text; no `references/*.md#` deep links.

## Inputs

- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/SKILL.md`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/requirements.md`

## Expected Output

- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/features.md`

## Verification

test -f skills/agent-first-cli/references/features.md

## Observability Impact

The 8 axis-aligned feature tables directly drive S04's verify report: each axis row in verify's report cites the feature from features.md and the implementation file that delivers it.
