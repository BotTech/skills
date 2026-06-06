---
estimated_steps: 16
estimated_files: 3
skills_used: []
---

# T04: Run S02 verification battery and commit

Why: This slice ships a routing surface and an enforcement contract — both must be verified with mechanical checks before the slice closes, so S03/S04/S06 can rely on the contracts. S01 established the pattern of one verification task per slice; S02 follows suit.

Do:
1. Write a small verification script (bash, executed via gsd_exec from the agent cwd) that asserts all of the following and exits non-zero with a clear message on the first failure:
   a. skills/agent-first-cli/SKILL.md exists and wc -l reports ≤100.
   b. skills/agent-first-cli/AGENTS.md exists and wc -l reports ≤50.
   c. skills/agent-first-cli/CLAUDE.md is a symlink resolving to AGENTS.md (test -L AND readlink equals AGENTS.md).
   d. SKILL.md contains all 7 sub-command names: stack, features, architecture, pitfalls, requirements, validate, verify. Use individual `grep -q` calls per token, not a single alternation (alternation is banned by plan rules).
   e. SKILL.md contains `argument-hint:` in frontmatter.
   f. SKILL.md references each of the 7 reference files: references/stack.md, references/features.md, references/architecture.md, references/pitfalls.md, references/requirements.md, references/validate.md, references/verify.md. Use individual `grep -q` per token.
   g. AGENTS.md contains the phrases out-of-scope, is an error (strict voice), and references references/eval.md. Individual `grep -q` per token.
   h. NONE of the three files contain any of: /gsd-, gsd_, gsd.db (R012 boundary). Use three `grep` invocations per file (one pattern each), inverted with ! — exit non-zero if any match.
   i. NONE of the three files instruct writing to .gsd/ in the user's project (R011 boundary). Specifically: no occurrence of the phrase `write to .gsd` or `> .gsd/` or `mkdir .gsd` in any of the three files.
2. Run the battery. All checks must pass.
3. Stage and commit from the agent cwd: `git add skills/agent-first-cli/SKILL.md skills/agent-first-cli/AGENTS.md skills/agent-first-cli/CLAUDE.md` then `git commit -m 'skill(agent-first-cli): add SKILL.md routing + AGENTS.md bidirectional rule + CLAUDE.md symlink'`. Use a single commit since the three files form one logical unit (routing + contract + symlink).
4. Verify `git status --porcelain --untracked-files=normal` is clean modulo GSD harness runtime files (event-log.jsonl, metrics.json, state-manifest.json — untracked, owned by harness).

Done when: all 9 assertion groups pass; the three new files are committed; working tree is clean.

## Inputs

- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/SKILL.md`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/AGENTS.md`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/CLAUDE.md`

## Expected Output

- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/SKILL.md`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/AGENTS.md`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/CLAUDE.md`

## Verification

git log --oneline -1 -- skills/agent-first-cli/SKILL.md
