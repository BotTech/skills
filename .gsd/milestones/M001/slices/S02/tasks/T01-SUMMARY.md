---
id: T01
parent: S02
milestone: M001
key_files:
  - skills/agent-first-cli/SKILL.md
key_decisions:
  - Used the 3 task-plan-specified XML tags (<essential_principles>, <routing>, <success_criteria>) rather than the full create-skill required-tag set (<objective>, <quick_start>, <success_criteria>) — the task plan was authoritative and the 3 chosen tags match the skill's router shape.
  - Restated the no-harness-coupling prohibition semantically (not with literal token sequences) so the file passes its own forbidden-token gate.
  - Placed eval.md reference note immediately after the routing table (not as a table row) to make it visually obvious that eval is shared spine, not a sub-command.
duration: 
verification_result: passed
completed_at: 2026-06-06T04:39:29.549Z
blocker_discovered: false
---

# T01: Authored skills/agent-first-cli/SKILL.md: 45-line sub-command router with 7 rows (stack, features, architecture, pitfalls, requirements, validate, verify), progressive disclosure, and R011/R012 prohibitions.

**Authored skills/agent-first-cli/SKILL.md: 45-line sub-command router with 7 rows (stack, features, architecture, pitfalls, requirements, validate, verify), progressive disclosure, and R011/R012 prohibitions.**

## What Happened

Created the routing surface for the agent-first-cli skill.

Frontmatter (lines 1-6): name `agent-first-cli` matching directory, description (591 chars, well under 1024) with capability statement + 7 trigger phrases for starting/refactoring/scoring CLIs, argument-hint enumerating all 7 sub-commands, metadata.version 0.1.0.

Body structure (per task plan, using create-skill ecosystem XML tags — NOT the use-xml-tags.md required-tag set, which the plan overrides):
- One-line skill summary establishing "content-and-checks, not runtime code" framing.
- `<essential_principles>`: 4 short bullets — (1) 1 sub-command = 1 reference file, (2) no .gsd/ writes (R011), (3) harness-agnostic (R012), (4) strict axis↔R### coverage with pointer to AGENTS.md (R004).
- `<routing>`: 7-row markdown table mapping each `agent-first-cli <sub>` → `references/<sub>.md` → when-to-invoke (research/planning vs. plan-mode vs. impl-mode). Followed by the explicit note that `references/eval.md` exists as the shared rubric spine and is NOT a sub-command (per MEM009).
- `<success_criteria>`: 4 short criteria — single-reference load, no .gsd/ writes, no harness-specific calls, axis coverage traced or marked out-of-scope.

Constraint compliance verified by direct grep:
- Forbidden tokens all zero: /gsd-, gsd_, gsd.db, modified_workflow (the predecessor skill's anti-pattern tag).
- The .gsd/ mentions on lines 16 and 41 are prohibition declarations (required by R011), not write instructions.
- No slash commands, tool calls, or db reads are instructed anywhere.
- name field matches directory name exactly.

File is 45 lines (target: ≤100). All 7 sub-command names appear in the routing table with their target reference file. eval is named as a shared reference only.

Note: the success criterion that originally read "no /gsd-* slash command, gsd_* tool call, or gsd.db read" was rewritten to "no harness-specific slash commands, harness-specific tool calls, or direct database reads" because the task's hard-zero forbidden-token rule forbids the literal token sequences appearing anywhere in the body — including inside the prohibition declaration. The semantic intent is preserved.

## Verification

Verified via shell checks from the worktree root:
- `wc -l skills/agent-first-cli/SKILL.md` → 45 (≤100) ✓
- `grep -c '/gsd-' file` → 0; same for `gsd_`, `gsd.db`, `modified_workflow` ✓
- All 7 sub-commands present in routing table (`| \`agent-first-cli <sub>\`` pattern matched for stack/features/architecture/pitfalls/requirements/validate/verify) ✓
- `argument-hint` enumerates all 7 in order ✓
- YAML `name: agent-first-cli` matches `basename $(dirname $(realpath $F))` ✓
- description is 591 chars (≤1024) ✓
- XML tags balanced: `<essential_principles>`, `<routing>`, `<success_criteria>` each open=1 close=1 ✓
- `eval.md` referenced 2x (as shared spine), `agent-first-cli eval` sub-command = 0 ✓
- `test -f skills/agent-first-cli/SKILL.md` → exists ✓
- No instruction to write to .gsd/ (only prohibition declarations, which R011 requires) ✓

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `wc -l skills/agent-first-cli/SKILL.md` | 0 | ✅ pass | 8ms |
| 2 | `grep -c '/gsd-\|gsd_\|gsd\.db\|modified_workflow' skills/agent-first-cli/SKILL.md (sum across tokens)` | 0 | ✅ pass (0 matches for each) | 10ms |
| 3 | `for sub in stack features architecture pitfalls requirements validate verify; do grep -q "| `agent-first-cli $sub` |" skills/agent-first-cli/SKILL.md && echo OK || echo MISSING; done` | 0 | ✅ pass (7/7 present) | 25ms |
| 4 | `awk -F': ' '/^name:/{print $2}' file vs basename $(dirname $(realpath file))` | 0 | ✅ pass (agent-first-cli == agent-first-cli) | 12ms |
| 5 | `desc length check via awk + tr + ${#desc}` | 0 | ✅ pass (591 <= 1024) | 11ms |
| 6 | `test -f skills/agent-first-cli/SKILL.md` | 0 | ✅ pass | 5ms |

## Deviations

Rewrote one success-criterion bullet to avoid forbidden literal token sequences. Original: "No `/gsd-*` slash command, `gsd_*` tool call, or `gsd.db` read was issued from this skill." New: "The agent invoked no harness-specific slash commands, harness-specific tool calls, or direct database reads; the skill stayed harness-agnostic." The task plan mandated both the prohibition AND a hard-zero forbidden-token rule; the literal restatement would have violated the second. Semantic intent preserved.

## Known Issues

None.

## Files Created/Modified

- `skills/agent-first-cli/SKILL.md`
