---
name: agent-first-cli
description: "Design, validate, and verify agent-first command-line interfaces. Provides research, planning, and lifecycle hooks for starting a new CLI project or refactoring an existing CLI to score well on the 8 agent-first axes (discoverability, invocation, I/O, state, errors, exit codes, idempotency, examples). Use when the user says 'agent-first CLI', 'new CLI project', 'CLI for agents', 'refactor this CLI for LLM use', 'score my CLI', 'validate my CLI plan', or 'verify my CLI build'."
argument-hint: "[stack|features|architecture|pitfalls|requirements|validate|verify|setup]"
metadata:
  version: 0.3.0
---

# agent-first-cli

A content-and-checks skill for building CLIs that LLM agents can drive reliably. Routes to exactly one reference file per invocation (progressive disclosure). Ships no runtime code.

<setup skip-iff="${agent-first-cli:setup-complete}">
  BEFORE any other sub-command, follow [setup.md](references/setup.md).
  If `${agent-first-cli:setup-complete} = true` is present in the chosen
  target file, skip. Otherwise run setup to completion before doing
  anything else. Do not prompt the user; do not list sub-commands; do
  not return control until setup is done or correctly skipped.
</setup>

<routing>

| Sub-command | Loads | When |
|---|---|---|
| `agent-first-cli stack` | `references/stack.md` | Choosing the tech stack |
| `agent-first-cli features` | `references/features.md` | Scoping the agent-first feature surface |
| `agent-first-cli architecture` | `references/architecture.md` | Designing module boundaries |
| `agent-first-cli pitfalls` | `references/pitfalls.md` | Assessing risks |
| `agent-first-cli requirements` | `references/requirements.md` | Seeding R###s in REQUIREMENTS.md with axis tags |
| `agent-first-cli validate` | `references/validate.md` | Plan-mode — check axis coverage before execution |
| `agent-first-cli verify` | `references/verify.md` | Implementation-mode — check built CLI against the 8-axis rubric |
| `agent-first-cli setup` | `references/setup.md` | Apply re-invocation cues. Runs automatically on the first invocation without `${agent-first-cli:setup-complete}`; `--force` re-runs. |

`references/eval.md` is the shared 8-axis rubric spine; consumed by `validate` and `verify`, not a sub-command.

</routing>

<essential_principles>

- **One sub-command loads one reference file.**
- **Strict axis ↔ R### coverage.** Every axis → an Active R### or `out-of-scope`; every R### this skill suggests → an axis or a justification. See `AGENTS.md`.

</essential_principles>

<success_criteria>

- On every invocation, the agent ran setup to completion before any other sub-command, OR correctly skipped setup because `${agent-first-cli:setup-complete} = true` was already present in the chosen target.
- The agent did not prompt the user to choose a sub-command before setup completed (or was skipped).
- If `setup` ran, the agent wrote to exactly one target — the one setup.md selected for this harness — and did not touch the other.
- Each axis from `references/eval.md` traces to an Active R### or is marked out-of-scope with a reason.

</success_criteria>
