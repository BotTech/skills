---
id: T01
parent: S06
milestone: M001
key_files:
  - README.md
key_decisions:
  - Used SKILL.md frontmatter description as the canonical one-line summary in the Skills Index (matches the trigger phrases verbatim from frontmatter, preserving identity across skill metadata surfaces)
  - Migration section explicitly warns against keeping both old and new skill names installed (per S06-RESEARCH Finding 2: no symlink fallback to avoid double-load confusion)
  - Sample-asset section gives both install paths: git submodule update for clone users, manual git clone --depth 1 for npx skills add users (which performs a non-recursive shallow clone)
duration: 
verification_result: passed
completed_at: 2026-06-06T06:08:45.770Z
blocker_discovered: false
---

# T01: Updated README.md skills index to agent-first-cli, added v0.2 migration note and gitignorer submodule init docs

**Updated README.md skills index to agent-first-cli, added v0.2 migration note and gitignorer submodule init docs**

## What Happened

Rewrote repo-root README.md to reflect the merged agent-first-cli skill:

1. Skills Index table: removed the `agent-dx-cli-eval` and `gsd-new-cli-project` rows; added a single `agent-first-cli` row linking to `./skills/agent-first-cli/` with a description distilled from SKILL.md frontmatter ("Design, validate, and verify agent-first command-line interfaces. Research/planning + plan-mode and impl-mode checks against the 8 agent-first axes...") and the trigger phrases from the frontmatter ("agent-first CLI", "new CLI project", "refactor this CLI for LLM use", "score my CLI", "validate my CLI plan", "verify my CLI build"). The `timesheet` row is untouched.

2. Added `## Updating from before v0.2` section after the Skills Index: explains gsd-new-cli-project + agent-dx-cli-eval were merged into agent-first-cli, gives the `npx skills remove gsd-new-cli-project` then `npx skills add https://github.com/bottech/skills` instructions, and warns against keeping both names installed (per S06-RESEARCH Finding 2 — no symlink fallback, double-load causes confusion).

3. Added `## Sample asset` section documenting that `skills/agent-first-cli/assets/samples/gitignorer/` is a git submodule pointing at BotTech/gitignore, with both install paths: (a) for `git clone` users, `git clone --recurse-submodules` or `git submodule update --init --recursive`; (b) for `npx skills add` users, the one-liner `git clone --depth 1 https://github.com/BotTech/gitignore.git ~/.agents/skills/agent-first-cli/assets/samples/gitignorer`.

Path convention: resolved all task-plan absolute paths (project-id worktree root) to relative paths under the executor's cwd at /Users/jason/src/bottech/skills/.gsd/worktrees/M001, per MEM011. All three input files (README.md, skills/agent-first-cli/SKILL.md, .gitmodules) exist at those relative paths.

## Verification

Verification gate from T01-PLAN ran clean:

`test -f README.md && grep -q 'agent-first-cli' README.md && grep -q 'Updating from before' README.md && grep -q 'git submodule update --init' README.md` — exit 0, all 4 checks pass.

Skills Index table inspection (sed range `/^## Skills Index/,/^## Updating/`):
- Exactly one row matching `agent-first-cli` (link `./skills/agent-first-cli/`).
- Zero rows matching `agent-dx-cli-eval` or `gsd-new-cli-project` (those strings only appear in the migration note section).
- `timesheet` row preserved.

Required strings present: `agent-first-cli`, `Updating from before`, `git submodule update --init`, plus the `gsd-new-cli-project` migration note (3 occurrences, all in the migration section, not the Skills Index). No other content was changed beyond the three documented additions.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `test -f README.md && grep -q 'agent-first-cli' README.md && grep -q 'Updating from before' README.md && grep -q 'git submodule update --init' README.md` | 0 | ✅ pass | 35ms |
| 2 | `sed -n '/^## Skills Index/,/^## Updating/p' README.md` | 0 | ✅ pass (Skills Index has 1 agent-first-cli row, 0 stale rows, timesheet preserved) | 20ms |
| 3 | `grep -c 'agent-first-cli' README.md` | 0 | ✅ pass (5 occurrences across skill index + sample asset section) | 15ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `README.md`
