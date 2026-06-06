---
estimated_steps: 19
estimated_files: 1
skills_used: []
---

# T03: Verify S01 layout end-to-end

Why: S01's proof is operational — the repo shape and the submodule contract hold. T02 produced the changes; T03 confirms them with explicit assertions so the slice completion summary can cite concrete evidence (not a visual inspection). All assertions are read-only; this task creates no new source files.

Do:
1. Run the assertions below in order. Each must pass (exit 0). If any fails, the task is incomplete — escalate with the failing assertion's output.
2. Optionally, if the executor has network/SSH access and a writable /tmp, run the strong-form proof: `cd /tmp && rm -rf skills-s01-verify && git clone --recurse-submodules git@github.com:BotTech/skills.git -b milestone/M001 skills-s01-verify && test -f skills-s01-verify/skills/agent-first-cli/assets/samples/gitignorer/package.json && rm -rf skills-s01-verify`. This exercises the full submodule contract from a consumer's perspective. If network is unavailable, skip it; the local assertions are sufficient proof for slice completion.
3. Confirm no `.gsd/` writes leaked out (R011 boundary): `git show --stat HEAD` should list only `.gitmodules`, the new `skills/agent-first-cli/...` paths, and the deleted old-skill paths — no `.gsd/` paths.

Assertions (all must exit 0):
- `test -f .gitmodules` — submodule config committed at repo root
- `test -d skills/agent-first-cli/references` — new skill layout exists
- `test -d skills/agent-first-cli/assets/samples/gitignorer` — submodule mount point exists
- `test -f skills/agent-first-cli/assets/samples/gitignorer/package.json` — submodule is populated (not empty)
- `test ! -d skills/gsd-new-cli-project` — old skill removed
- `test ! -d skills/agent-dx-cli-eval` — old skill removed
- `test -d skills/timesheet` — out-of-scope skill preserved
- `git submodule status` exits 0 and reports exactly one submodule at skills/agent-first-cli/assets/samples/gitignorer with status prefix ` ` (space = initialized)
- `git status` reports clean working tree ("nothing to commit, working tree clean")

Done when: all assertions pass and the slice completion summary records the evidence. The clone-with-recurse test is a strong-form bonus proof, not a gate.

Files: (none — this task is read-only verification)
Inputs: .gitmodules
ExpectedOutput: []

## Inputs

- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/.gitmodules`

## Expected Output

- Update the implementation and proof artifacts needed for this task.

## Verification

test -f .gitmodules && test -d skills/agent-first-cli/references && test -f skills/agent-first-cli/assets/samples/gitignorer/package.json && test ! -d skills/gsd-new-cli-project && test ! -d skills/agent-dx-cli-eval && test -d skills/timesheet && git submodule status
