---
estimated_steps: 37
estimated_files: 1
skills_used: []
---

# T05: Author pitfalls.md (8 pitfalls covering all 8 axes)

Why: pitfalls.md shape-matches GSD's PITFALLS.md template and lifts the 5-pitfall seed set from gsd-new-cli-project SKILL.md `<context research_type="pitfalls">` block, then extends to 8 pitfalls so every axis has at least one pitfall that threatens it. Independent of T03/T04 — runs in any order against them.

Do:
1. Read the `<context research_type="pitfalls">` block of `~/.agents/skills/gsd-new-cli-project/SKILL.md` for the seed 5 pitfalls (Blocking I/O, Mixed Output Formats, Missing Input Validation, Missing Response Sanitization, No Dry-Run).
2. Read `skills/agent-first-cli/assets/samples/gitignorer/.planning/research/PITFALLS.md` for shape and density.
3. Create `skills/agent-first-cli/references/pitfalls.md` with these top-level headers IN THIS EXACT ORDER (R005 shape contract — agent-first CLI is greenfield, but include Migration Pitfalls marked N/A per S03-RESEARCH.md guidance):
   - `# Pitfalls — Agent-First CLI`
   - `## Domain Pitfalls`
   - `## Stack Pitfalls`
   - `## Scope Traps`
   - `## Compliance / Security Gotchas`
   - `## Migration Pitfalls`
4. Each pitfall uses a 4-field block (NOT a table — pitfalls need prose):
   ```
   ### Pitfall: <name>
   **What goes wrong:** <one paragraph>
   **Why it happens:** <one paragraph>
   **How to avoid:** <one paragraph, referencing the axis it threatens>
   **Warning signs:** <comma-separated observable symptoms>
   ```
5. Author the 8 required pitfalls, distributed across sections, each tagging at least one axis in the `How to avoid` field (R013):
   - **Domain Pitfalls**
     - Pitfall: Examples and schemas that lie (threatens Axis 1, Axis 8) — generated examples that don't match the real input shape; outdated schemas. Warning signs: "agents send payloads that always fail validation," "docs show fields the CLI doesn't accept."
   - **Stack Pitfalls**
     - Pitfall: Blocking I/O (threatens Axis 3) — synchronous fs/git operations break piped agent workflows.
     - Pitfall: Mixed output formats on stdout (threatens Axis 3, Axis 5) — progress messages mixed with JSON break parsers.
   - **Scope Traps**
     - Pitfall: Exit code drift across commands (threatens Axis 6) — each command invents its own exit-code scheme; downstream scripts can't distinguish failure modes.
     - Pitfall: Non-idempotent cache or side effects (threatens Axis 4, Axis 7) — repeated invocations create duplicate files, multiple cache copies, or double-applied transformations.
   - **Compliance / Security Gotchas**
     - Pitfall: Missing input validation (threatens Axis 5) — path traversal, control characters, double percent-encoding reach the filesystem. Lift the specific validation functions from source SKILL.md (validate_safe_output_dir, reject_control_chars, validate_resource_name, encode_path_segment). Include the security posture quote: "The agent is not a trusted operator."
     - Pitfall: Missing response sanitization for prompt injection (threatens Axis 5) — API responses containing "ignore previous instructions" survive into agent context.
   - **Migration Pitfalls** (1 line, marked N/A for greenfield)
     - "N/A for greenfield CLIs. If refactoring an existing CLI to agent-first, the dominant migration pitfall is mid-migration mixed output: half the commands emit JSON, half emit prose. Plan a flag-day cutover per command surface, not a gradual rollout."
6. Optional: add a 9th pitfall — `Pitfall: No dry-run for mutating operations` (threatens Axis 7) — under Scope Traps if there's room; the source SKILL.md seed set has this as a headline pitfall. If you include it, you'll have 9 pitfalls (one extra) — that's fine.
7. Use `Axis N` or `Axis: N` (R013) in every `How to avoid` field. No deep links. No XML tags.
8. State prohibitions semantically per MEM014 (e.g., "the skill stays harness-agnostic" rather than restating forbidden tokens).

Done when: `skills/agent-first-cli/references/pitfalls.md` exists; all 6 top-level headers present in order; 8 pitfalls present in 4-field block format (What goes wrong / Why it happens / How to avoid / Warning signs); every pitfall's `How to avoid` field contains `Axis N` or `Axis: N`; Migration Pitfalls section explicitly marked N/A for greenfield.

## Inputs

- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/SKILL.md`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/AGENTS.md`

## Expected Output

- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/pitfalls.md`

## Verification

test -f skills/agent-first-cli/references/pitfalls.md

## Observability Impact

Each pitfall's `Warning signs` field becomes the failure-symptom checklist S04's verify report cites when an axis fails — "if you see these symptoms, axis N is uncovered."
