---
estimated_steps: 18
estimated_files: 1
skills_used: []
---

# T01: Author SKILL.md — sub-command router under 100 lines

Why: SKILL.md is the skill's routing surface and the biggest unblocker for S03/S04/S06 (those slices need stable sub-command names and the references/ filenames). Doing it first lets parallel work reference concrete paths.

Do:
1. Create skills/agent-first-cli/SKILL.md with YAML frontmatter: `name: agent-first-cli` (must match directory exactly), `description:` (third person, capability + trigger phrases for starting/refactoring an agent-first CLI project, ≤1024 chars, no XML tags), `argument-hint: "[stack|features|architecture|pitfalls|requirements|validate|verify]"`, optional `metadata: { version: 0.1.0 }`.
2. Add a short <essential_principles> block (2–4 short bullets): the skill loads reference content via 7 sub-commands; each sub-command loads exactly ONE reference file (progressive disclosure, R010); the skill never writes to .gsd/ and never invokes /gsd-* (R011, R012).
3. Add a <routing> table with exactly 7 rows, one per sub-command. Each row: | sub-command | what it loads | when to invoke |. Map:
   - agent-first-cli stack → references/stack.md → research/planning, when choosing the tech stack
   - agent-first-cli features → references/features.md → research/planning, when scoping feature surface
   - agent-first-cli architecture → references/architecture.md → research/planning, when designing module boundaries
   - agent-first-cli pitfalls → references/pitfalls.md → research/planning, when assessing risks
   - agent-first-cli requirements → references/requirements.md → planning, when seeding R###s
   - agent-first-cli validate → references/validate.md → plan-mode, before execution
   - agent-first-cli verify → references/verify.md → impl-mode, after execution
   Do NOT include eval as a sub-command (it's a shared reference consumed by validate/verify per MEM009).
4. Add a <success_criteria> block: 2–4 short criteria (e.g., 'Agent loaded exactly one reference file', 'No .gsd/ writes were performed').
5. Keep total ≤100 lines including frontmatter and blank lines.
6. Use plain markdown for body text and the create-skill ecosystem's XML tags (<essential_principles>, <routing>, <success_criteria>). Do NOT use non-standard tags like <modified_workflow> (that was the gsd-new-cli-project anti-pattern).

Done when: file exists at skills/agent-first-cli/SKILL.md; wc -l reports ≤100; all 7 sub-command names are present; argument-hint enumerates all 7; no token sequence matching /gsd-, gsd_, or gsd.db appears in the file body; no instruction writes to .gsd/ in the user's project.

Path note (per MEM011): the validator sees this worktree as /Users/jason/.gsd/projects/0809305c93fd/worktrees/M001, which is the same physical directory as the agent cwd /Users/jason/src/bottech/skills/.gsd/worktrees/M001 (symlink alias). All shell commands must run from the agent cwd using relative paths; the absolute path here is only for the validator's path-resolution check.

## Inputs

- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/.gitkeep`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/assets/samples/.gitkeep`

## Expected Output

- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/SKILL.md`

## Verification

test -f skills/agent-first-cli/SKILL.md
