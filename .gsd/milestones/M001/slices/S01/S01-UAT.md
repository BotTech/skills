# S01: Restructure: rename, merge, submodule wiring — UAT

**Milestone:** M001
**Written:** 2026-06-06T04:27:46.186Z

# S01 UAT — Restructure: rename, merge, submodule wiring

**UAT Type:** Operational (static layout + git contract). No runtime to exercise; the slice's contract IS the repo shape plus the submodule's clone-with-recurse behavior.

## Preconditions

- The repo is on branch `milestone/M001` in worktree `/Users/jason/src/bottech/skills/.gsd/worktrees/M001`.
- The S01 work has been committed (commits 6995331, 5d8e6c6, b4fda4d on this branch).
- Reviewer has read access to `git@github.com:BotTech/gitignore.git` (SSH key registered with GitHub) if running the optional strong-form proof.
- Reviewer is running the UAT from the worktree root.

## Test 1 — Placeholder layout is in place

**Steps:**
1. `ls skills/agent-first-cli/`
2. `ls -A skills/agent-first-cli/references/`
3. `ls -A skills/agent-first-cli/assets/samples/`

**Expected:**
1. Output includes `references/` and `assets/`.
2. Output is exactly `.gitkeep` (no other files — S02/S03/S04 will fill this in).
3. Output includes `.gitkeep` and `gitignorer/`.

## Test 2 — Old skills are gone

**Steps:**
1. `test ! -d skills/gsd-new-cli-project && echo OK || echo FAIL`
2. `test ! -d skills/agent-dx-cli-eval && echo OK || echo FAIL`

**Expected:** Both print `OK`.

## Test 3 — Unrelated skill is untouched

**Steps:**
1. `test -d skills/timesheet && echo OK || echo FAIL`

**Expected:** Prints `OK`.

## Test 4 — .gitmodules is correctly configured

**Steps:**
1. `cat .gitmodules`

**Expected:** Exactly this content (tab indentation on field lines):
```
[submodule "skills/agent-first-cli/assets/samples/gitignorer"]
	path = skills/agent-first-cli/assets/samples/gitignorer
	url = git@github.com:BotTech/gitignore.git
	branch = main
```

## Test 5 — Submodule is initialized and on main

**Steps:**
1. `git submodule status`

**Expected:**
- Exactly one line.
- Leading character is a SPACE (initialized; `-` would mean uninitialized, `+` would mean checked out at a different SHA than recorded).
- Format: ` fb4357f7… skills/agent-first-cli/assets/samples/gitignorer (heads/main)`.

## Test 6 — Submodule mount is populated

**Steps:**
1. `test -f skills/agent-first-cli/assets/samples/gitignorer/package.json && echo OK || echo FAIL`
2. `ls skills/agent-first-cli/assets/samples/gitignorer/ | head -10`

**Expected:**
1. Prints `OK`.
2. Output includes real gitignorer source files (package.json, README.md, src/, etc.) — not empty.

## Test 7 — Working tree is clean (modulo GSD harness runtime)

**Steps:**
1. `git status --porcelain --untracked-files=normal`

**Expected:** Either empty, or contains only untracked GSD harness runtime files (`.gsd/event-log.jsonl`, `.gsd/metrics.json`, `.gsd/state-manifest.json`). No `M` or staged entries related to slice source files.

## Test 8 — R011 substantive boundary (skill doesn't write to user's .gsd/)

**Steps:**
1. `git diff-tree --no-commit-id --name-only -r 6995331 | grep -c '^\.gsd/'` → expect 0
2. `git diff-tree --no-commit-id --name-only -r 5d8e6c6 | grep -c '^\.gsd/'` → expect 0
3. Inspect any files now under `skills/agent-first-cli/` and confirm none reference `.gsd/` paths in the user's project or invoke `gsd_*` tools or `/gsd` slash commands.

**Expected:**
1. `0`
2. `0`
3. No file under `skills/agent-first-cli/` writes to or invokes anything in the user's `.gsd/`.

## Test 9 — Strong-form proof (optional — requires network + SSH)

**Steps:**
1. From a scratch directory outside the worktree: `git clone --recurse-submodules -b milestone/M001 <repo-url> s01-fresh`
2. `cd s01-fresh && ls skills/agent-first-cli/assets/samples/gitignorer/package.json`

**Expected:**
- Clone succeeds (no "fatal: clone of 'git@github.com:BotTech/gitignore.git' into submodule path '…' failed" errors).
- `package.json` exists in the freshly cloned tree — proving the submodule wiring survives a fresh clone with `--recurse-submodules`.

**Skip conditions:** Skip Test 9 if the reviewer lacks network access, GitHub SSH credentials, or push/read permissions on `git@github.com:BotTech/gitignore.git`. Tests 1–8 are the gate.

## Edge cases explicitly covered

- **Submodule uninitialized after fresh clone without `--recurse-submodules`:** reviewer should run `git submodule update --init --recursive` and re-run Test 5 + Test 6.
- **Submodule points to wrong branch:** Test 4's `branch = main` line catches this; if absent or wrong, fails.
- **Submodule URL is HTTPS instead of SSH:** Test 4 catches this (must be `git@github.com:BotTech/gitignore.git`).
- **Old skill dirs sneak back via cherry-pick or merge:** Tests 2.1 and 2.2 catch this.
- **timesheet/ accidentally deleted:** Test 3 catches this.

## Out of scope for S01 UAT

- Skill content (SKILL.md, references/*.md, etc.) — that's S02/S03/S04.
- Axis coverage of gitignorer — that's S05.
- Repo root README and skills-lock.json updates — that's S06.
- Any runtime behavior of the agent-first-cli skill — there is no runtime in S01, just layout + submodule contract.
