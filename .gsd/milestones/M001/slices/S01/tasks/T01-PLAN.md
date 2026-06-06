---
estimated_steps: 15
estimated_files: 2
skills_used: []
---

# T01: Create skills/agent-first-cli/ placeholder layout

Why: S02/S03/S04/S05 need an existing skill directory to author content into. `git submodule add` (T02) requires the parent path `skills/agent-first-cli/assets/samples/` to exist and the target path `skills/agent-first-cli/assets/samples/gitignorer` to NOT exist. This task sets up exactly that state.

Do:
1. From the worktree root (cwd of this slice's executor), create the placeholder directory tree with one command: `mkdir -p skills/agent-first-cli/references skills/agent-first-cli/assets/samples`.
2. Add `.gitkeep` files so the empty placeholder directories survive in git: `skills/agent-first-cli/references/.gitkeep` and `skills/agent-first-cli/assets/samples/.gitkeep`. Each file should contain a single comment line: `# placeholder — populated by S02/S03/S04 (references) or T02 (assets/samples/gitignorer)`.
3. Do NOT add SKILL.md, AGENTS.md, CLAUDE.md, or any reference content here — those belong to S02 and S03.
4. Do NOT run `git submodule add` here — that is T02's job. T01 only creates the parent skeleton.
5. Do NOT commit yet — T02 will combine the layout, the submodule add, and the deletions into a single restructure commit.

Done when:
- `skills/agent-first-cli/references/` exists and contains only `.gitkeep`
- `skills/agent-first-cli/assets/samples/` exists and contains only `.gitkeep`
- `skills/agent-first-cli/assets/samples/gitignorer/` does NOT exist yet (T02 creates it via `git submodule add`)
- `test -d skills/agent-first-cli/references && test -d skills/agent-first-cli/assets/samples && test ! -e skills/agent-first-cli/assets/samples/gitignorer` exits 0

Files: skills/agent-first-cli/references/.gitkeep, skills/agent-first-cli/assets/samples/.gitkeep
Inputs: []
ExpectedOutput: ["skills/agent-first-cli/references/.gitkeep", "skills/agent-first-cli/assets/samples/.gitkeep"]

## Inputs

- None specified.

## Expected Output

- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/.gitkeep`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/assets/samples/.gitkeep`

## Verification

test -d skills/agent-first-cli/references && test -d skills/agent-first-cli/assets/samples && test -f skills/agent-first-cli/references/.gitkeep && test -f skills/agent-first-cli/assets/samples/.gitkeep && test ! -e skills/agent-first-cli/assets/samples/gitignorer
