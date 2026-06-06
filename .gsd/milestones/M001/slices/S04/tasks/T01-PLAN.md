---
estimated_steps: 6
estimated_files: 1
skills_used: []
---

# T01: Author references/eval.md (8-axis rubric spine)

Why: eval.md is the shared axis spine that validate.md and verify.md both consume. Authoring it first prevents axis duplication and lets T02/T03 reference it by name rather than re-listing axes.

Do: Create skills/agent-first-cli/references/eval.md (~120-150 lines). Structure: (1) opening H1 `# Evaluation Rubric — Agent-First CLI` and one-paragraph intro stating the file is the canonical 8-axis rubric spine consumed by validate.md (plan-mode) and verify.md (impl-mode), NOT a sub-command; (2) one H2 per axis in axis order (Axis 1: Discoverability, Axis 2: Invocation, Axis 3: I/O, Axis 4: State, Axis 5: Errors, Axis 6: Exit Codes, Axis 7: Idempotency, Axis 8: Examples), each H2 containing: a 1-2 sentence definition, a `**Pass criteria**` bullet list (3-5 bullets stating what 'covered' means for this axis), a `**Common evidence**` bullet list (3-5 bullets naming concrete artifacts — file paths, sub-commands, --help fields, JSON shapes — that demonstrate coverage; cite gitignorer sample paths as examples where useful), and a `**Failure symptoms**` bullet list (3-5 bullets lifted from pitfalls.md warning-signs patterns, phrased as observable symptoms an agent can detect); (3) closing H2 `## Citation Convention` stating the canonical forms: `Axis N` in prose, `Axis: N` in structured Notes/Coverage Table fields (never `#axis-N` anchors or file#section deep links); (4) closing one-line note that this file is reference content (not an executable), harness-agnostic, no .gsd/ writes.

Constraints (must hold): R013 — zero `#axis-N` anchors and zero `references/<file>.md#` deep links anywhere in the file; R011 — no imperative instructions to write under .gsd/ (the file is a reference, not an authoring instruction; if .gsd/ paths appear, they appear as descriptive context like 'as recorded in the project's .gsd/REQUIREMENTS.md', never as 'write to .gsd/'); R012 — no /gsd-* slash commands, no gsd_* tool calls, no gsd.db reads, no gsd-pi references anywhere.

Citation convention reminder: use `Axis N` in prose sentences ('Axis 5 errors means...'), use `Axis: N` only when tagging a structured field (e.g., inside a bullet that becomes a Notes entry). The H2 headers use the form `## Axis N: <Name>` (e.g., `## Axis 1: Discoverability`).

IMPORTANT — STALE-PATH NOTE: The path anchor below is the registered DB worktree root; the executing agent's cwd will be `/Users/jason/src/bottech/skills/.gsd/worktrees/M001` (per MEM011). Treat any absolute path in this task's `files`, `inputs`, or `expectedOutput` as stale; convert to the equivalent relative path from the executor's cwd before reading or writing. The equivalent relative paths are: `skills/agent-first-cli/references/eval.md` (output), `skills/agent-first-cli/SKILL.md` and `skills/agent-first-cli/AGENTS.md` and `skills/agent-first-cli/references/requirements.md` and `skills/agent-first-cli/references/pitfalls.md` and `skills/agent-first-cli/references/features.md` (inputs).

Done when: eval.md exists at the relative path from the executor's cwd, is ~120-150 lines, contains all 8 axis H2s in order, each H2 has the 4 required bullet blocks (definition is prose, the other three are bullet lists), no forbidden tokens, no deep-link anchors, no .gsd/ write instructions.

## Inputs

- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/SKILL.md`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/AGENTS.md`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/requirements.md`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/pitfalls.md`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/features.md`

## Expected Output

- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/eval.md`

## Verification

test -f skills/agent-first-cli/references/eval.md

## Observability Impact

None — reference content only.
