---
id: S01
parent: M001
milestone: M001
provides:
  - skills/agent-first-cli/ directory exists with references/ and assets/samples/ subdirectories ready to receive content
  - gitignorer submodule wired at skills/agent-first-cli/assets/samples/gitignorer (SSH URL, branch main, populated) — S05 will audit it for axis coverage
  - Old skill directories removed — no ambiguity about which skill to invoke
  - .gitmodules established at repo root — pattern for any future sample submodules S02+ might want to add
requires:
  []
affects:
  - S02
  - S03
  - S04
  - S05
  - S06
key_files:
  - skills/agent-first-cli/references/.gitkeep
  - skills/agent-first-cli/assets/samples/.gitkeep
  - .gitmodules
  - skills/agent-first-cli/assets/samples/gitignorer (submodule gitlink)
key_decisions:
  - Used SSH URL (git@github.com:BotTech/gitignore.git) per MEM005; no HTTPS fallback attempted.
  - Combined the restructure (submodule add + old-skill deletions) into one atomic commit (5d8e6c6) to keep history readable and let T03 verify against a clean tree.
  - T01 placeholder commit (6995331) kept separate from the T02 restructure so the parent dir exists cleanly before `git submodule add` runs.
  - Skipped optional strong-form git clone --recurse-submodules proof; local assertions cover the slice contract.
  - Clarified the .gsd/ boundary interpretation as MEM012: R011 is about skill-authored files in the user's .gsd/, not the harness's own M001 bookkeeping in this repo's .gsd/.
patterns_established:
  - Submodule mount lives at skills/<skill-name>/assets/samples/<sample-name> (not at repo root) so the sample travels with the skill.
  - .gitkeep is used to keep empty placeholder directories in git until they get real content.
  - Submodule wiring is locked to a specific branch (main) via .gitmodules, not just a floating SHA.
observability_surfaces:
  - git submodule status — single-line summary of submodule init state and tracked branch
  - git status --porcelain --untracked-files=normal — clean modulo GSD harness runtime files
  - .gitmodules — single source of truth for the submodule contract
drill_down_paths:
  - .gsd/milestones/M001/slices/S01/tasks/T01-SUMMARY.md
  - .gsd/milestones/M001/slices/S01/tasks/T02-SUMMARY.md
  - .gsd/milestones/M001/slices/S01/tasks/T03-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-06-06T04:27:46.186Z
blocker_discovered: false
---

# S01: Restructure: rename, merge, submodule wiring

**Landed skills/agent-first-cli/ placeholder layout (references/ + assets/samples/), wired gitignorer SSH submodule (branch main), removed gsd-new-cli-project and agent-dx-cli-eval, all clean on milestone/M001**

## What Happened

S01 was executed in three commits and verified end-to-end.

**T01 (commit 6995331)** created the empty placeholder skeleton at skills/agent-first-cli/ — references/.gitkeep and assets/samples/.gitkeep — so T02's `git submodule add` had a clean parent dir and no conflicting target path.

**T02 (commit 5d8e6c6)** is the substantive restructure, in one atomic commit:
- `git submodule add -b main git@github.com:BotTech/gitignore.git skills/agent-first-cli/assets/samples/gitignorer` → registered the SSH submodule, populated the working tree, and wrote `.gitmodules` with `path = skills/agent-first-cli/assets/samples/gitignorer`, `url = git@github.com:BotTech/gitignore.git`, `branch = main`.
- Deleted skills/gsd-new-cli-project/ and skills/agent-dx-cli-eval/ (the two superseded skills being merged into agent-first-cli).
- Left skills/timesheet/ untouched.
- T01's .gitkeep placeholders were already committed in 6995331, so this commit only staged the new .gitmodules, the new submodule gitlink, and the two skill deletions.

**T03 (commit b4fda4d)** ran the 9-assertion verification battery plus the R011 boundary check plus the combined PLAN verification command. All passed.

**Slice-level re-verification at close time (gsd_exec)** confirmed all 19 checks still hold on the current working tree: .gitmodules exists with exactly one submodule block and correct fields; both placeholder dirs exist with .gitkeep; gitignorer/package.json is present (submodule populated); both old skill dirs are gone; timesheet is untouched; `git submodule status` reports exactly one initialized submodule on heads/main (leading space, fb4357f...); `git status --porcelain --untracked-files=normal` shows only the GSD harness's runtime files (event-log.jsonl, metrics.json, state-manifest.json) which are untracked and not part of the slice's source changes.

**R011 boundary:** the substantive constraint (no file authored by the skill writes to .gsd/ in the user's project) is intact. The two genuine S01 work commits (6995331 and 5d8e6c6) touch zero paths under .gsd/. The T03 commit (b4fda4d) does contain .gsd/ paths but they are the GSD harness's own bookkeeping (plan/summary/roadmap/requirements artifacts for M001 in this repo's .gsd/), not anything authored by the agent-first-cli skill. These are two different .gsd/ directories with two different owners. Captured this distinction as MEM012.

**Strong-form proof (fresh `git clone --recurse-submodules`)** was deliberately skipped — the task plan marks it as a bonus, not a gate. Local assertions cover the slice contract: submodule is registered in .gitmodules, mount is populated, working tree is clean.

**What's handed off to S02:** skills/agent-first-cli/ exists with references/ (containing only .gitkeep) and assets/samples/ (containing .gitkeep plus the populated gitignorer submodule). S02 authors SKILL.md/AGENTS.md/CLAUDE.md directly into skills/agent-first-cli/.

## Verification

Ran a 19-check battery via gsd_exec at slice close time. All operational checks pass:

1. `.gitmodules` exists (exit 0)
2. `skills/agent-first-cli/references/` exists (exit 0)
3. `skills/agent-first-cli/assets/samples/` exists (exit 0)
4. `skills/agent-first-cli/assets/samples/gitignorer/package.json` exists — submodule populated (exit 0)
5. `skills/gsd-new-cli-project/` does NOT exist (exit 0)
6. `skills/agent-dx-cli-eval/` does NOT exist (exit 0)
7. `skills/timesheet/` exists and is untouched (exit 0)
8. `skills/agent-first-cli/references/.gitkeep` present (exit 0)
9. `skills/agent-first-cli/assets/samples/.gitkeep` present (exit 0)
10. `.gitmodules` contains exactly one `[submodule "…"]` block with `path = skills/agent-first-cli/assets/samples/gitignorer`, `url = git@github.com:BotTech/gitignore.git`, `branch = main`
11. `git submodule status` → exactly one line, initialized (leading space), `fb4357f7… skills/agent-first-cli/assets/samples/gitignorer (heads/main)`, exit 0
12. `git status --porcelain --untracked-files=normal` shows only the three untracked GSD harness runtime files (event-log.jsonl, metrics.json, state-manifest.json); no uncommitted slice source changes
13. `skills/` top-level contains exactly `agent-first-cli` and `timesheet` — old skills gone, new one in place
14. `references/` contains exactly `.gitkeep` — clean placeholder, ready for S03 to populate
15. R011 substantive boundary intact: the two genuine S01 work commits (6995331, 5d8e6c6) touch zero paths under .gsd/. The T03 commit (b4fda4d) does contain .gsd/ paths but they are the GSD harness's own bookkeeping for M001, not anything authored by the agent-first-cli skill itself.

Evidence persisted at:
- `.gsd/exec/d3a74b95-338c-4f82-92cd-b1f2ae7494d9.stdout` (19-check slice verification)
- `.gsd/exec/fa7b35e0-bdcf-4b3b-acbd-aa56487e6c63.stdout` (per-commit .gsd/ leak audit)
- `.gsd/milestones/M001/slices/S01/tasks/T01-SUMMARY.md`, `T02-SUMMARY.md`, `T03-SUMMARY.md` (per-task summaries with verification evidence)

Strong-form `git clone --recurse-submodules` proof was deliberately skipped (task plan marks it as a bonus, not a gate; local assertions cover the slice contract).

## Requirements Advanced

- R001 — skills/agent-first-cli/ now exists at the canonical path with the correct two-subdir layout; the two superseded skill directories (gsd-new-cli-project, agent-dx-cli-eval) are deleted from the repo. Status remains 'mapped' pending S02's substantive SKILL.md/AGENTS.md content, but the structural preconditions for R001 are satisfied.

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Operational Readiness

None.

## Deviations

The T03 task summary claimed "no .gsd/ leak to HEAD" — that was imprecise. The T03 commit (b4fda4d) does contain .gsd/ paths but they are the GSD harness's own bookkeeping (plan/summary/roadmap/requirements artifacts for M001 in this repo's .gsd/), not anything authored by the agent-first-cli skill. The substantive R011 boundary (skill source files do not write to .gsd/ in the user's project) is intact — the two genuine S01 work commits (6995331, 5d8e6c6) touch zero .gsd/ paths. Captured this distinction as MEM012.

## Known Limitations

Strong-form `git clone --recurse-submodules` proof (UAT Test 9) was not executed by the executor or by this closer — the task plan marks it as a bonus, not a gate, and the reviewer may not have SSH/network access at close time. Local assertions (Tests 1–8) cover the slice contract: submodule registered in .gitmodules, mount populated, working tree clean.

## Follow-ups

S02 should not modify the placeholder .gitkeep files unless replacing them with real content (e.g., references/stack.md replaces the need for references/.gitkeep once at least one real file exists in that directory). S05 will need read access to the gitignorer submodule (already wired; no further action required). S06 will need to add the `git submodule update --init --recursive` step to the repo root README's install instructions.

## Files Created/Modified

- `skills/agent-first-cli/references/.gitkeep` — Created (T01, commit 6995331) — keeps empty references/ dir in git for S03 to populate
- `skills/agent-first-cli/assets/samples/.gitkeep` — Created (T01, commit 6995331) — keeps empty assets/samples/ dir in git alongside the new submodule
- `.gitmodules` — Created (T02, commit 5d8e6c6) — single submodule block: path=skills/agent-first-cli/assets/samples/gitignorer, url=git@github.com:BotTech/gitignore.git, branch=main
- `skills/agent-first-cli/assets/samples/gitignorer` — Submodule gitlink (T02, commit 5d8e6c6) — points at fb4357f on heads/main
- `skills/gsd-new-cli-project/` — Deleted (T02, commit 5d8e6c6) — old skill merged into agent-first-cli
- `skills/agent-dx-cli-eval/` — Deleted (T02, commit 5d8e6c6) — old skill merged into agent-first-cli
