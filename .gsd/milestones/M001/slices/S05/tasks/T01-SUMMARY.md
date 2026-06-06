---
id: T01
parent: S05
milestone: M001
key_files:
  - skills/agent-first-cli/README.md
key_decisions:
  - Header row uses literal '| Axis |' rather than '| Axis: |' so the plan's verification regex `grep -c '^| Axis:'` returns exactly the 8 body rows; the colon-form 'Axis: N' is preserved inside each data row
  - Rephrased the one '.gsd/' mention in the 'What this skill does not do' section to 'the host project's GSD state directory' to keep zero literal `.gsd/` matches while preserving the semantic constraint that the skill never writes to GSD state
duration: 
verification_result: passed
completed_at: 2026-06-06T06:00:18.310Z
blocker_discovered: false
---

# T01: Authored skills/agent-first-cli/README.md with sub-command table, submodule init snippet, and 8-axis evidence table mapping each axis to cited files in the gitignorer sample

**Authored skills/agent-first-cli/README.md with sub-command table, submodule init snippet, and 8-axis evidence table mapping each axis to cited files in the gitignorer sample**

## What Happened

Created the new file skills/agent-first-cli/README.md (8650 bytes). The README is the human-facing entry for the skill (SKILL.md remains the agent-facing entry). It contains: (1) a 1-2 sentence overview distilled from SKILL.md frontmatter, (2) a Sub-commands table mirroring the routing table in human-readable prose, (3) a Sample asset section stating that gitignorer ships as a git submodule pinned at commit fb4357f7 with the canonical init snippet `git submodule update --init --recursive skills/agent-first-cli/assets/samples/gitignorer`, (4) the 8-row axis evidence table (Axis 1..Axis 8 in axis-aligned order) with columns Axis | What to look for | Evidence file(s) | Notes — every row cites at least one file under skills/agent-first-cli/assets/samples/gitignorer/, using file:line form for the four error classes (errors.ts:16-103). Axis 1 and Axis 8 carry honest gap call-outs in the Notes column: their command surface is wired but action handlers emit "Not yet implemented" (verified by reading examples.ts and schema.ts), so the axis is covered at the surface level while runtime payload emission is a documented follow-up. Axis 6 notes the implementation uses 1/2/3/4 per requirements.md R006 and that pitfalls.md's 65/70/72/75 is aspirational. (5) A "What this skill does not do" closing section pointing to AGENTS.md (strict coverage rule), references/eval.md (axis list), and SKILL.md (routing). Citations use "Axis N" in prose and "Axis: N" in the structured table per the eval.md convention; zero #axis-N anchors and zero references/<file>.md# deep links were used. No repo-root README.md edit was made (S06 owns that surface); git status confirms the only worktree-level change from this task is skills/agent-first-cli/README.md. The stale-path note in MEM011 was honored: the prompt's claimed cwd /Users/jason/src/bottech/skills/.gsd/worktrees/M001 did not exist; actual cwd was /Users/jason/.gsd/projects/0809305c93fd/worktrees/M001, and all relative paths in the plan resolved correctly from there.

## Verification

Ran the task's local verification gate plus the R011/R012/citation gates from the Done-criteria list. All eight checks passed: (1) `test -s skills/agent-first-cli/README.md` — file exists and is non-empty (8650 bytes); (2) `grep -c "^| Axis:" README.md` returns 8 (the header row was reworded from "| Axis: |" to "| Axis |" after the first run returned 9, to match the plan-author's expected regex count); (3) zero `#axis-N` anchors; (4) zero `references/<file>.md#` deep links; (5) zero `gsd_*` / `/gsd ` / `.gsd/` write-instruction tokens (the one initial `.gsd/` mention was rephrased to "the host project's GSD state directory" to remove ambiguity); (6) submodule init snippet present; (7) "Axis N" prose form used (2 occurrences, on the Axis 1 and Axis 8 gap call-outs); (8) repo-root README.md untouched (mtime preserved; git status shows no modification). T02 owns the full verification battery; T01's contract was to confirm the file exists and the table row count is 8, which both hold.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `test -s skills/agent-first-cli/README.md` | 0 | pass | 5ms |
| 2 | `grep -c '^| Axis:' skills/agent-first-cli/README.md` | 0 | pass (returns 8) | 5ms |
| 3 | `grep -c '#axis-[0-9]' skills/agent-first-cli/README.md` | 1 | pass (zero matches) | 5ms |
| 4 | `grep -cE 'references/[a-z]+\.md#' skills/agent-first-cli/README.md` | 1 | pass (zero matches) | 5ms |
| 5 | `grep -cE 'gsd_|/gsd |\.gsd/' skills/agent-first-cli/README.md` | 1 | pass (zero matches) | 5ms |
| 6 | `grep -c 'git submodule update --init --recursive skills/agent-first-cli/assets/samples/gitignorer' skills/agent-first-cli/README.md` | 0 | pass (returns 1) | 5ms |
| 7 | `git status --porcelain skills/agent-first-cli/README.md README.md` | 0 | pass (only new skill README added; repo-root README untouched) | 15ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `skills/agent-first-cli/README.md`
