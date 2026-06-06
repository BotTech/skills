---
name: agent-first-cli
description: "Design, validate, and verify agent-first command-line interfaces. Provides research, planning, and lifecycle hooks for starting a new CLI project or refactoring an existing CLI to score well on the 8 agent-first axes (discoverability, invocation, I/O, state, errors, exit codes, idempotency, examples). Use when the user says 'agent-first CLI', 'new CLI project', 'CLI for agents', 'refactor this CLI for LLM use', 'score my CLI', 'validate my CLI plan', or 'verify my CLI build'."
argument-hint: "[stack|features|architecture|pitfalls|requirements|validate|verify]"
metadata:
  version: 0.1.0
---

# agent-first-cli

A content-and-checks skill for building CLIs that LLM agents can drive reliably. Routes the user to exactly one reference file per invocation (progressive disclosure). Ships no runtime code; provides reference material for research/planning and read-only checks for plan validation and build verification.

<essential_principles>

- **One sub-command loads one reference file.** Never load more than one reference per invocation; the user asks for `stack`, they get `references/stack.md`, nothing else.
- **No `.gsd/` writes from this skill.** The skill reads GSD artifacts (during `validate`) and reads the CLI implementation (during `verify`); it never authors or mutates anything in the user's `.gsd/`. GSD is the sole writer.
- **Harness-agnostic.** This skill contains no slash commands, no tool calls, no database reads. It works in any agent harness that loads `SKILL.md` files.
- **Strict axis ↔ R### coverage.** Every one of the 8 axes must trace to an Active R### (or be marked out-of-scope with reason); every R### this skill suggests must trace to an axis (or be justified). See `AGENTS.md`.

</essential_principles>

<routing>

| Sub-command | What it loads | When to invoke |
|---|---|---|
| `agent-first-cli stack` | `references/stack.md` | Research/planning — choosing the tech stack (language, framework, schema tools) |
| `agent-first-cli features` | `references/features.md` | Research/planning — scoping the agent-first feature surface (--output json, --dry-run, etc.) |
| `agent-first-cli architecture` | `references/architecture.md` | Research/planning — designing module boundaries (commands, formatters, parsers, schemas) |
| `agent-first-cli pitfalls` | `references/pitfalls.md` | Research/planning — assessing risks (streaming, pipes, exit-code drift, idempotency traps) |
| `agent-first-cli requirements` | `references/requirements.md` | Planning — seeding R###s in the project's REQUIREMENTS.md with axis tags |
| `agent-first-cli validate` | `references/validate.md` | Plan-mode — before execution, check axis coverage against PROJECT/REQUIREMENTS/ROADMAP/CONTEXT/PLAN |
| `agent-first-cli verify` | `references/verify.md` | Implementation-mode — after execution, check the built CLI against the 8-axis rubric |

`references/eval.md` exists as the shared 8-axis rubric spine; it is consumed by `validate` and `verify` and is **not** a sub-command.

</routing>

<success_criteria>

- The agent loaded **exactly one** reference file matching the sub-command name (or none, if the user only wanted the index).
- No file under `.gsd/` in the user's project was written or mutated by this skill.
- The agent invoked no harness-specific slash commands, harness-specific tool calls, or direct database reads; the skill stayed harness-agnostic.
- Each axis from `references/eval.md` is either traced to an Active R### or explicitly marked out-of-scope with a reason.

</success_criteria>
