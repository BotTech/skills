# S01: Restructure: rename, merge, submodule wiring

**Goal:** Land the empty placeholder directory layout for skills/agent-first-cli/ (with references/ and assets/samples/ subdirs), wire the gitignorer sample project as a git submodule at skills/agent-first-cli/assets/samples/gitignorer (SSH URL, branch main), delete the two superseded skills (gsd-new-cli-project and agent-dx-cli-eval), and commit. End state: repo has the new shape on this branch, .gitmodules is correct, git submodule status is clean, and a fresh git clone --recurse-submodules of this branch produces a populated gitignorer dir.
**Demo:** Repo has skills/agent-first-cli/ with empty placeholder files; skills/gsd-new-cli-project/ and skills/agent-dx-cli-eval/ removed; .gitmodules configured for assets/samples/gitignorer pointing to git@github.com:BotTech/gitignore.git branch main; git submodule status clean; git clone --recurse-submodules produces populated dir.

## Must-Haves

- `skills/agent-first-cli/references/` exists (empty placeholder directory, kept in git via a .gitkeep)
- `skills/agent-first-cli/assets/samples/` exists and contains the populated gitignorer submodule mount point
- `skills/gsd-new-cli-project/` no longer exists
- `skills/agent-dx-cli-eval/` no longer exists
- `skills/timesheet/` is untouched (same content as before this slice)
- `.gitmodules` exists at the worktree root with exactly one submodule block: path = skills/agent-first-cli/assets/samples/gitignorer, url = git@github.com:BotTech/gitignore.git, branch = main
- `git submodule status` reports exactly one initialized submodule on heads/main
- `git status` is clean (all changes committed on milestone/M001)
- A fresh `git clone --recurse-submodules <repo-url>` of this branch produces a populated gitignorer directory (the strongest single proof; may be skipped if the executor lacks network/SSH access, in which case the local `git submodule status` + populated-dir checks above are sufficient)
- No new files inside `.gsd/` were created by this slice (R011 boundary respected)

## Proof Level

- This slice proves: operational — slice proves the repo shape contract and the submodule's clone-with-recurse behavior end-to-end. No code execution from the skill; the proof is the working tree state plus a fresh-clone verification.

## Integration Closure

Produces for S02/S03/S04/S05/S06: (1) skills/agent-first-cli/ exists with references/ and assets/samples/ subdirs ready to receive content; (2) the gitignorer submodule is wired and populated so S05 can audit axis coverage against real files. Consumes: nothing (S01 is the first slice). What remains for milestone: S02 authors SKILL.md/AGENTS.md/CLAUDE.md into the empty placeholder; S03 fills references/; S04 adds eval.md/validate.md/verify.md; S05 documents the axis→file mapping in the skill README; S06 updates the repo root README and skills-lock.json audit.

## Verification

- none — this slice produces static layout only. No runtime, no logs, no failure surface beyond the git operations themselves (which surface via standard git exit codes). The submodule's state is inspectable via `git submodule status` for any downstream slice that needs to verify the asset is present.

## Tasks

- [x] **T01: Create skills/agent-first-cli/ placeholder layout** `est:5m`
  Why: S02/S03/S04/S05 need an existing skill directory to author content into. `git submodule add` (T02) requires the parent path `skills/agent-first-cli/assets/samples/` to exist and the target path `skills/agent-first-cli/assets/samples/gitignorer` to NOT exist. This task sets up exactly that state.
  - Files: `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/.gitkeep`, `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/assets/samples/.gitkeep`
  - Verify: test -d skills/agent-first-cli/references && test -d skills/agent-first-cli/assets/samples && test -f skills/agent-first-cli/references/.gitkeep && test -f skills/agent-first-cli/assets/samples/.gitkeep && test ! -e skills/agent-first-cli/assets/samples/gitignorer

- [x] **T02: Add gitignorer submodule, delete old skills, commit the restructure** `est:15m`
  Why: This is the substantive S01 shape change — one atomic commit that lands the merged-skill directory, wires the submodule, and removes the superseded skills. Combining them in one commit keeps the history readable and lets T03 verify against a clean tree.
  - Files: `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/.gitmodules`, `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/assets/samples/gitignorer`, `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/gsd-new-cli-project/SKILL.md`, `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/gsd-new-cli-project/references/rewrite-your-cli-for-ai-agents.md`, `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-dx-cli-eval/SKILL.md`, `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-dx-cli-eval/references/agent-dx-cli-scale.md`
  - Verify: git submodule status && test -f skills/agent-first-cli/assets/samples/gitignorer/package.json && test ! -d skills/gsd-new-cli-project && test ! -d skills/agent-dx-cli-eval && test -d skills/timesheet

- [x] **T03: Verify S01 layout end-to-end** `est:10m`
  Why: S01's proof is operational — the repo shape and the submodule contract hold. T02 produced the changes; T03 confirms them with explicit assertions so the slice completion summary can cite concrete evidence (not a visual inspection). All assertions are read-only; this task creates no new source files.
  - Verify: test -f .gitmodules && test -d skills/agent-first-cli/references && test -f skills/agent-first-cli/assets/samples/gitignorer/package.json && test ! -d skills/gsd-new-cli-project && test ! -d skills/agent-dx-cli-eval && test -d skills/timesheet && git submodule status

## Files Likely Touched

- /Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/.gitkeep
- /Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/assets/samples/.gitkeep
- /Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/.gitmodules
- /Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/assets/samples/gitignorer
- /Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/gsd-new-cli-project/SKILL.md
- /Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/gsd-new-cli-project/references/rewrite-your-cli-for-ai-agents.md
- /Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-dx-cli-eval/SKILL.md
- /Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-dx-cli-eval/references/agent-dx-cli-scale.md
