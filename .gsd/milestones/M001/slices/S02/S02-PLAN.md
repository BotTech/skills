# S02: SKILL.md + AGENTS.md + CLAUDE.md + sub-command routing

**Goal:** Author the agent-first-cli skill's routing surface and enforcement contract: SKILL.md (≤100 lines, 7 sub-commands, progressive disclosure), AGENTS.md (strict bidirectional axis↔R### coverage rule), and CLAUDE.md as a relative symlink to AGENTS.md. No reference content lands here — those files are owned by S03/S04.
**Demo:** agent-first-cli/SKILL.md exists, under 100 lines, advertises 7 sub-commands; AGENTS.md declares strict bidirectional axis<->R### coverage rule; CLAUDE.md is a working symlink to AGENTS.md; each sub-command name appears in SKILL.md with the reference file it loads.

## Must-Haves

- skills/agent-first-cli/SKILL.md exists, ≤100 lines, with YAML frontmatter (name=agent-first-cli, description with capability + trigger phrases, argument-hint enumerating all 7 sub-commands) and a routing table mapping each of stack/features/architecture/pitfalls/requirements/validate/verify to exactly one file under references/.
- skills/agent-first-cli/AGENTS.md exists, ≤50 lines, declares the Strict Bidirectional Coverage Rule (axis → R### OR out-of-scope with reason; R### → axis OR justified in Notes), does NOT enumerate the 8 axes (those live in references/eval.md), uses plain markdown (no XML tags, no YAML frontmatter).
- skills/agent-first-cli/CLAUDE.md is a relative symlink to AGENTS.md (readlink CLAUDE.md → AGENTS.md).
- R011 boundary intact: none of SKILL.md/AGENTS.md/CLAUDE.md instruct the agent to write to .gsd/ in the user's project.
- R012 boundary intact: no /gsd-* slash commands, no gsd_* tool calls, no gsd.db references in any of the three files.
- All 7 sub-command names (stack, features, architecture, pitfalls, requirements, validate, verify) each appear in SKILL.md with the reference file each loads.

## Proof Level

- This slice proves: contract — slice produces the routing surface and enforcement contract; no runtime behavior to exercise. Verification is a battery of static assertions (line count, file existence, symlink resolution, presence/absence of forbidden tokens, sub-command coverage).

## Integration Closure

Produces for S03/S04/S06: SKILL.md's sub-command routing table (so S03/S04 know which filenames to author, and S06 knows which sub-commands to advertise in the repo README); AGENTS.md's strict rule (so S04's validate.md and verify.md can reference "the rule defined in AGENTS.md" rather than re-declaring it); CLAUDE.md symlink (so the skill is Claude-Code-compatible from day one). No runtime wiring introduced — this is a content-only slice.

## Verification

- None — pure-content slice with no runtime behavior, signals, or failure paths added.

## Tasks

- [x] **T01: Author SKILL.md — sub-command router under 100 lines** `est:30m`
  Why: SKILL.md is the skill's routing surface and the biggest unblocker for S03/S04/S06 (those slices need stable sub-command names and the references/ filenames). Doing it first lets parallel work reference concrete paths.
  - Files: `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/SKILL.md`
  - Verify: test -f skills/agent-first-cli/SKILL.md

- [x] **T02: Author AGENTS.md — strict bidirectional coverage rule, declarative, ≤50 lines** `est:20m`
  Why: AGENTS.md is the skill's enforcement contract — the smallest file but the hardest to get right. S04's validate.md and verify.md will reference 'the rule defined in AGENTS.md' rather than re-declaring it, so this file must be the single source of truth. Avoid the trap of expanding it into 'everything an agent should know' — that's references/'s job.
  - Files: `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/AGENTS.md`
  - Verify: test -f skills/agent-first-cli/AGENTS.md

- [x] **T03: Create CLAUDE.md as relative symlink to AGENTS.md** `est:5m`
  Why: Claude Code reads CLAUDE.md as its standing-instructions file; other harnesses read AGENTS.md. A symlink gives Claude Code compatibility without divergence (per MEM003). The symlink MUST be relative so it survives git clone to a different machine or path.
  - Files: `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/CLAUDE.md`
  - Verify: test -L skills/agent-first-cli/CLAUDE.md

- [x] **T04: Run S02 verification battery and commit** `est:30m`
  Why: This slice ships a routing surface and an enforcement contract — both must be verified with mechanical checks before the slice closes, so S03/S04/S06 can rely on the contracts. S01 established the pattern of one verification task per slice; S02 follows suit.
  - Files: `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/SKILL.md`, `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/AGENTS.md`, `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/CLAUDE.md`
  - Verify: git log --oneline -1 -- skills/agent-first-cli/SKILL.md

## Files Likely Touched

- /Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/SKILL.md
- /Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/AGENTS.md
- /Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/CLAUDE.md
