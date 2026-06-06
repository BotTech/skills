---
estimated_steps: 22
estimated_files: 1
skills_used: []
---

# T01: Author skills/agent-first-cli/README.md with overview, sub-command table, submodule init snippet, and 8-axis evidence table

Why: S05's deliverable is a single new file — skills/agent-first-cli/README.md — that hosts the per-axis evidence map for the gitignorer sample asset and doubles as the skill's human-facing entry doc (which currently does not exist; SKILL.md is the agent-facing entry). S06 owns repo-root README.md and S05 stays out of its lane, so the evidence table lives at the skill-local path. Without this file, M001's success criterion ("verify against gitignorer produces a passing report") rests on uncited claims; with it, every axis traces to a concrete file path an agent can open and read.

Do:
1. Create skills/agent-first-cli/README.md (new file). Start with a 1-2 sentence description distilled from SKILL.md frontmatter ("Design, validate, and verify agent-first CLIs…"). Do not copy SKILL.md verbatim — the README is for humans landing on the skill from GitHub or a directory listing.
2. Add a "Sub-commands" section with a 3-column table (Sub-command | Loads | When) mirroring the routing table in SKILL.md but in human-readable prose. This gives a stranger a quick orientation without parsing SKILL.md frontmatter.
3. Add a "Sample asset: gitignorer" section. State that the skill ships a reference TypeScript/Node CLI at assets/samples/gitignorer/ as a git submodule (commit fb4357f7 at time of writing). Include the submodule init snippet: `git submodule update --init --recursive skills/agent-first-cli/assets/samples/gitignorer`. (Single command — S06 may also reference this from repo-root README; that is acceptable duplication because the skill-local README is the canonical install location when the skill is added standalone.)
4. Add the 8-axis evidence table. Use these columns: Axis | What to look for | Evidence file(s) | Notes. One row per axis, axis-aligned order (1..8). For each axis, cite at least one file under skills/agent-first-cli/assets/samples/gitignorer/ with a short path that an agent can resolve from the repo root. Use the file:line form where line-level specificity helps (e.g., src/schema/errors.ts:16-103 for the four error classes). Citations must use the stable axis ID form ("Axis 1" / "Axis 8" in prose; "Axis: 1" etc. in structured tables) — never `#axis-N` anchors and never `references/<file>.md#section` deep links (those are forbidden by R013 and the eval.md citation convention).
5. Honest-gap call-outs: for Axis 1 and Axis 8, the `examples` and `schema` action handlers are wired into the command surface but currently print "Not yet implemented" rather than emitting JSON payloads. State this in the Notes column so `verify` against gitignorer is not over-claimed. The axis is *covered* at the command-surface level; runtime payload emission is a known follow-up. Do not call this a failure — it is a documented shape-level reference.
6. Use the following evidence (verified against the current tree at gitignorer commit fb4357f7; line numbers below are accurate as of that commit):
   - Axis 1 (Discoverability): src/commands/examples.ts, src/commands/schema.ts, src/cli/program.ts (addCommand calls), package.json bin field. Note: action handlers are stubs.
   - Axis 2 (Invocation): src/cli/flags.ts (CommonFlags.input, applyCommonFlags), src/parsers/stdin.ts (parseStdinJSON), src/schema/input.ts (jsonInputSchema).
   - Axis 3 (I/O): src/cli/program.ts (configureOutput), src/cli/mode.ts (resolveMode), src/formatters/{json,ndjson,human}.ts.
   - Axis 4 (State): src/services/cache.service.ts (envPaths, ensureCacheDir), src/services/git.service.ts (TEMPLATE_REPO).
   - Axis 5 (Errors): src/schema/errors.ts:16-103 (four classes with readonly exitCode and toJSON).
   - Axis 6 (Exit Codes): src/cli/error-handler.ts (handleTopLevelError instanceof dispatch), src/bin.ts (main().catch(handleTopLevelError)). Note: implementation uses 1/2/3/4 per requirements.md R006; pitfalls.md POSIX-sympathetic 65/70/72/75 is aspirational.
   - Axis 7 (Idempotency): src/cli/flags.ts (dryRun flag), src/formatters/dry-run.ts (formatDryRunJSON same shape as live), src/services/cache.service.ts (fs.mkdir recursive), src/services/git.service.ts (pullUpdates before cloneTemplates).
   - Axis 8 (Examples): src/commands/examples.ts, src/schema/input.ts (envelope schema examples would be generated from), tests/services/cache.service.test.ts. Note: runtime emission is a stub (same gap as Axis 1).
7. End the README with a "What this skill does not do" note pointing to AGENTS.md for the strict rule, references/eval.md for the canonical axis list, and the SKILL.md routing table for sub-command semantics. State that this README is the human-facing entry; SKILL.md is the agent-facing entry.

Done when: skills/agent-first-cli/README.md exists, is non-empty, contains an 8-row evidence table with at least one cited file per row, contains the submodule init snippet, uses "Axis N" / "Axis: N" form throughout, contains zero `#axis-N` anchors and zero `references/<file>.md#` deep links, contains zero `gsd_*` / `/gsd ` / `.gsd/` write-instruction tokens (R011/R012 gates), and does not edit repo-root README.md or any file outside skills/agent-first-cli/.

Verify (run from repo root / worktree root):
  test -s skills/agent-first-cli/README.md
  grep -c "^| Axis:" skills/agent-first-cli/README.md
Full verification runs in T02. T01 only needs to confirm the file exists and the table row count is 8.

## Inputs

- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/SKILL.md`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/AGENTS.md`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/eval.md`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/requirements.md`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/features.md`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/assets/samples/gitignorer/src/schema/errors.ts`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/assets/samples/gitignorer/src/cli/error-handler.ts`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/assets/samples/gitignorer/src/cli/program.ts`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/assets/samples/gitignorer/src/cli/mode.ts`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/assets/samples/gitignorer/src/cli/flags.ts`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/assets/samples/gitignorer/src/bin.ts`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/assets/samples/gitignorer/src/parsers/stdin.ts`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/assets/samples/gitignorer/src/services/cache.service.ts`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/assets/samples/gitignorer/src/services/git.service.ts`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/assets/samples/gitignorer/src/formatters/dry-run.ts`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/assets/samples/gitignorer/src/commands/examples.ts`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/assets/samples/gitignorer/src/commands/schema.ts`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/assets/samples/gitignorer/src/schema/input.ts`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/assets/samples/gitignorer/package.json`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/assets/samples/gitignorer/tests/services/cache.service.test.ts`

## Expected Output

- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/README.md`

## Verification

test -s /Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/README.md && grep -c "^| Axis:" /Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/README.md

## Observability Impact

None — static documentation file.
