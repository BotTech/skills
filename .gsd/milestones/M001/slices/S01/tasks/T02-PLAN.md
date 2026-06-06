---
estimated_steps: 25
estimated_files: 6
skills_used: []
---

# T02: Add gitignorer submodule, delete old skills, commit the restructure

Why: This is the substantive S01 shape change — one atomic commit that lands the merged-skill directory, wires the submodule, and removes the superseded skills. Combining them in one commit keeps the history readable and lets T03 verify against a clean tree.

Do (all from the worktree root, which is on branch milestone/M001):
1. Verify T01 produced the expected parent layout: `test -d skills/agent-first-cli/assets/samples && test ! -e skills/agent-first-cli/assets/samples/gitignorer` should exit 0. If it fails, T01 is incomplete — stop and reopen T01.
2. Add the gitignorer submodule with branch pinning: `git submodule add -b main git@github.com:BotTech/gitignore.git skills/agent-first-cli/assets/samples/gitignorer`. This requires SSH key access to BotTech; if the executor lacks it, the task is blocked (escalate). Expected side effects: a new entry in `.gitmodules`, a gitlink entry in the tree at `skills/agent-first-cli/assets/samples/gitignorer`, and the working tree at that path populated with the submodule's contents.
3. Verify the submodule is initialized and populated: `git submodule status` should show one line beginning with a space (initialized) for `skills/agent-first-cli/assets/samples/gitignorer` ending with `(heads/main)`. `test -f skills/agent-first-cli/assets/samples/gitignorer/package.json` should exit 0.
4. Delete the superseded skills using `git rm -r`: `git rm -r skills/gsd-new-cli-project skills/agent-dx-cli-eval`. This stages both deletions and removes the working-tree files in one step. Do NOT delete skills/timesheet — it is out of scope for M001.
5. Stage the placeholder files from T01: `git add skills/agent-first-cli`. This picks up the `.gitkeep` files and the new submodule entry.
6. Verify the staged changes look right: `git status` should show (a) new file `.gitmodules`, (b) new directory `skills/agent-first-cli/` containing the submodule + 2 .gitkeep files, (c) deleted `skills/gsd-new-cli-project/` (2 files), (d) deleted `skills/agent-dx-cli-eval/` (2 files), and nothing else.
7. Commit: `git commit -m "refactor(agent-first-cli): merge gsd-new-cli-project + agent-dx-cli-eval, wire gitignorer submodule\n\nS01 restructure: skills/agent-first-cli/ is the new merged skill directory.\n- Adds skills/agent-first-cli/references/ and skills/agent-first-cli/assets/samples/ placeholders.\n- Adds gitignorer as git submodule at skills/agent-first-cli/assets/samples/gitignorer (SSH, branch main).\n- Removes skills/gsd-new-cli-project/ and skills/agent-dx-cli-eval/ (content re-authored from scratch in S03).\n- timesheet/ untouched.\n\nReference content, SKILL.md, AGENTS.md, and CLAUDE.md land in S02/S03/S04."`
8. After commit, `git status` should be clean (nothing to commit, working tree clean).

Done when:
- `git submodule status` shows exactly one initialized submodule at skills/agent-first-cli/assets/samples/gitignorer on heads/main
- `test -f skills/agent-first-cli/assets/samples/gitignorer/package.json` exits 0 (submodule populated)
- `test ! -d skills/gsd-new-cli-project && test ! -d skills/agent-dx-cli-eval` exits 0 (old skills gone)
- `test -d skills/timesheet` exits 0 (timesheet preserved)
- `git status` reports clean working tree
- `.gitmodules` exists and contains the correct [submodule "..."] block (path, url, branch=main)

Failure Modes:
- SSH key not available → `git submodule add` fails with auth error. Escalate; do not fall back to HTTPS (decision MEM005 requires SSH).
- Parent path missing → `git submodule add` fails with `destination path already exists or parent missing`. Stop; T01 was incomplete.
- Submodule already exists from a prior failed attempt → `git submodule add` reports already exists. Stop; escalate for cleanup (likely need `git submodule deinit -f` + `rm -rf` + `git rm --cached`).
- Worktree cwd mismatch → `git submodule add` writes to the wrong tree. The executor must confirm `pwd` matches the worktree root before running the command.

Files: .gitmodules, skills/agent-first-cli/assets/samples/gitignorer (submodule gitlink), skills/gsd-new-cli-project/SKILL.md, skills/gsd-new-cli-project/references/rewrite-your-cli-for-ai-agents.md, skills/agent-dx-cli-eval/SKILL.md, skills/agent-dx-cli-eval/references/agent-dx-cli-scale.md
Inputs: skills/agent-first-cli/references/.gitkeep, skills/agent-first-cli/assets/samples/.gitkeep
ExpectedOutput: .gitmodules

## Inputs

- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/.gitkeep`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/assets/samples/.gitkeep`

## Expected Output

- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/.gitmodules`

## Verification

git submodule status && test -f skills/agent-first-cli/assets/samples/gitignorer/package.json && test ! -d skills/gsd-new-cli-project && test ! -d skills/agent-dx-cli-eval && test -d skills/timesheet
