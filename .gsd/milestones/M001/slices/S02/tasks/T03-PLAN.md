---
estimated_steps: 7
estimated_files: 1
skills_used: []
---

# T03: Create CLAUDE.md as relative symlink to AGENTS.md

Why: Claude Code reads CLAUDE.md as its standing-instructions file; other harnesses read AGENTS.md. A symlink gives Claude Code compatibility without divergence (per MEM003). The symlink MUST be relative so it survives git clone to a different machine or path.

Do:
1. From the agent cwd, run: `cd skills/agent-first-cli && ln -s AGENTS.md CLAUDE.md`. This produces a relative symlink stored by git as-is. Do NOT use --physical or absolute forms.
2. Do NOT use an absolute path (e.g. `ln -s /Users/.../AGENTS.md`) — absolute symlinks break for anyone else who clones the repo.
3. Do NOT copy AGENTS.md's contents into CLAUDE.md as a regular file — divergence would be inevitable.
4. Confirm git tracks it as a symlink: `git status` should show skills/agent-first-cli/CLAUDE.md as a new file (type 'symlink'). On macOS/Linux, `ls -l skills/agent-first-cli/CLAUDE.md` shows `CLAUDE.md -> AGENTS.md`.

Done when: `test -L skills/agent-first-cli/CLAUDE.md` exits 0; `readlink skills/agent-first-cli/CLAUDE.md` outputs exactly `AGENTS.md`; `cat skills/agent-first-cli/CLAUDE.md` prints the same content as `cat skills/agent-first-cli/AGENTS.md`.

## Inputs

- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/AGENTS.md`

## Expected Output

- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/CLAUDE.md`

## Verification

test -L skills/agent-first-cli/CLAUDE.md
