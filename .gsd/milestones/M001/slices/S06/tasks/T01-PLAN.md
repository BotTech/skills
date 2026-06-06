---
estimated_steps: 13
estimated_files: 1
skills_used: []
---

# T01: Edit README.md: replace stale skills-index rows, add migration note, document submodule init

Why: S06's primary deliverable is the repo-root README reflecting the merged skill. R014 requires the skills index to list agent-first-cli and drop the two old rows; R015's migration concern reduces to a note; R016 requires submodule init docs.

Path convention (per slice success-criteria note + MEM011): the absolute paths in this task point at the project-id worktree root (`/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001`). The executor's actual cwd is `/Users/jason/src/bottech/skills/.gsd/worktrees/M001`. Resolve by stripping the worktree root prefix and treating the remainder as a relative path from cwd. All paths below (`README.md`, `skills/agent-first-cli/SKILL.md`, `.gitmodules`) exist in BOTH worktrees as relative paths from their respective worktree roots.

Do:
1. Open `README.md` (already exists at repo root).
2. In the Skills Index table: delete the `agent-dx-cli-eval` row and the `gsd-new-cli-project` row. Add a new row for `agent-first-cli` that links to `./skills/agent-first-cli/`, carries a description distilled from SKILL.md frontmatter (e.g. "Design, validate, and verify agent-first command-line interfaces. Research/planning + plan-mode and impl-mode checks against the 8 agent-first axes."), and lists trigger phrases ("agent-first CLI", "new CLI project", "refactor this CLI for LLM use", "score my CLI", "validate my CLI plan", "verify my CLI build"). Leave the `timesheet` row untouched.
3. After the Skills Index section, add a short `## Updating from before v0.2` section (or similar): one or two sentences noting that the prior `gsd-new-cli-project` skill is now `agent-first-cli`, and that users who installed the old name should run `npx skills remove gsd-new-cli-project` then `npx skills add https://github.com/bottech/skills`. Do NOT create a symlink fallback (per S06-RESEARCH Finding 2 — double-load confusion).
4. Add a `## Sample asset` subsection (or expand Installation) documenting that `skills/agent-first-cli/assets/samples/gitignorer/` is a git submodule, and provide BOTH post-install paths: (a) for `git clone` users, recommend `git clone --recurse-submodules https://github.com/bottech/skills.git` (or `git submodule update --init --recursive` after clone); (b) for `npx skills add` users, provide the one-liner: `git clone --depth 1 https://github.com/BotTech/gitignore.git ~/.agents/skills/agent-first-cli/assets/samples/gitignorer` (or the relative equivalent inside the install path).
5. Stage the change for a single commit (commit is made by the executor; planner does not commit).

Done when:
- Skills Index has exactly one row matching `agent-first-cli` and zero rows matching `agent-dx-cli-eval` or `gsd-new-cli-project`.
- README contains the strings `gsd-new-cli-project` (in the migration note, NOT in the Skills Index), `git submodule update --init` or `git clone --recurse-submodules`, and `agent-first-cli`.
- README has no other unintended changes.

Verify rules: no shell pipes, no alternation with `|`. Use separate simple `grep -q` commands joined with `&&`.

## Inputs

- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/SKILL.md`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/.gitmodules`

## Expected Output

- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/README.md`

## Verification

test -f README.md && grep -q 'agent-first-cli' README.md && grep -q 'Updating from before' README.md && grep -q 'git submodule update --init' README.md
