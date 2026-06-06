---
id: M001
title: Agent-First CLI Skill
status: ready-for-planning
---

# M001: Agent-First CLI Skill

**Gathered:** 2026-06-06
**Status:** Ready for planning

## Project Description

Merge the two existing CLI skills in this repo (`gsd-new-cli-project` and `agent-dx-cli-eval`) into a single `agent-first-cli` skill that provides the context required at the right steps of an agent-first CLI project's lifecycle. The merged skill ships reference material shaped to match GSD's artifact templates, an `AGENTS.md` rule enforcing strict bidirectional coverage between the 8 agent-first axes and the project's R### requirements, and a real reference implementation (`gitignorer`) as a git submodule under `assets/samples/`.

## Why This Milestone

The two existing skills were always paired — the project skill references the eval, and both reference the same blog post — but they're separated, the project skill is broken (invokes a non-existent `/gsd-new-project` slash command), and neither enforces that what gets planned actually covers the agent-first quality bar. Merging them, fixing the invocation shape, and adding a strict coverage rule produces one install, one mental model, and a verifiable quality contract. The skill targets gsd-core (methodology) not gsd-pi (this harness), so it works in any agent harness that loads SKILL.md files.

## User-Visible Outcome

### When this milestone is complete, the user can:

- Run `npx skills add https://github.com/bottech/skills` and get one merged `agent-first-cli` skill that replaces the previous two.
- Invoke `agent-first-cli stack` (or features / architecture / pitfalls / requirements / validate / verify) at the right phase and get the right reference loaded.
- Have GSD's planning agents consume the skill's reference content and lift it directly into `.gsd/research/STACK.md`, `.gsd/FEATURES.md`, `.gsd/ARCHITECTURE.md`, `.gsd/PITFALLS.md`, and `.gsd/REQUIREMENTS.md` without reformatting.
- Run `agent-first-cli validate` against planning docs and get a structured report flagging uncovered axes and orphan requirements as errors.
- Run `agent-first-cli verify` against the actual CLI implementation and get a structured report scoring it against the 8 axes.
- Read the skill's `assets/samples/gitignorer/` (TypeScript/Node/Commander/zod/ndjson) to see what passing looks like for each axis.

### Entry point / environment

- Entry point: load the skill in any agent harness that reads `SKILL.md`; invoke sub-commands by name.
- Environment: any agent harness that loads SKILL.md files (Claude Code, Cursor, Codex, pi, etc.). Submodule init required for the sample asset.
- Live dependencies involved: git submodule at `assets/samples/gitignorer` → `git@github.com:BotTech/gitignore.git` (branch `main`).

## Completion Class

- Contract complete means: every reference file matches its target GSD template shape; validate and verify produce structured reports against all 8 axes; the AGENTS.md rule is enforceable by visual inspection.
- Integration complete means: a user invoking any of the 7 sub-commands gets the correct reference loaded; `npx skills add` continues to install cleanly; existing installs either continue working or have a documented migration.
- Operational complete means: `git clone --recurse-submodules` produces a populated `assets/samples/gitignorer/`; a stranger reading the repo root README and the skill's SKILL.md can use the skill end-to-end without asking questions.

## Final Integrated Acceptance

To call this milestone complete, we must prove:

- A user can run `npx skills add https://github.com/bottech/skills` on a fresh machine, load the skill in their agent, invoke each of the 7 sub-commands by name, and get a useful reference loaded each time.
- A GSD project using this skill produces axis-coverage-complete REQUIREMENTS.md (every axis mapped to an R### or explicitly out of scope).
- `validate` against a sample project's planning docs catches a deliberately introduced axis gap and reports it as an error.
- `verify` against the `assets/samples/gitignorer/` reference produces a passing report (all 8 axes covered by concrete implementation evidence).
- No file in the skill writes to `.gsd/` in the target project. No file invokes `/gsd` slash commands or `gsd_*` tools.

## Architectural Decisions

### Merge into one skill

**Decision:** Collapse `gsd-new-cli-project` and `agent-dx-cli-eval` into a single `agent-first-cli` skill.

**Rationale:** The two were always paired — same author, same day, cross-referencing each other. Separating them forced users to discover and invoke both, and the project skill's reference to the eval was a fragile cross-directory link. One skill = one install = one mental model.

**Alternatives Considered:**
- Keep both, fix the phantom-command bug — leaves the duplication and the discoverability problem.
- Merge into the eval skill's name — eval is one phase of the lifecycle, not the whole thing; `agent-first-cli` better describes the skill's scope.

### Sub-commands as progressive disclosure

**Decision:** SKILL.md is short; each sub-command loads exactly one reference file.

**Rationale:** Skills are loaded into context on every invocation. Loading all 8 references on every invocation wastes context budget. Progressive disclosure lets the agent pull only what's needed for the current phase.

**Alternatives Considered:**
- Single long SKILL.md with all content inline — high context cost on every load.
- Multiple sibling skills (one per phase) — fragments the mental model and the install.

### Shared `eval.md` reference, not a sub-command

**Decision:** The 8 axes live in `references/eval.md`. Validate and verify both consume it. Eval is not a user-invocable sub-command.

**Rationale:** The 8 axes are canonical. Duplicating them across validate and verify would drift. Exposing eval as its own sub-command adds a command surface with no clear "when to invoke" trigger (eval is always part of validate or verify, never standalone).

**Alternatives Considered:**
- Eval as its own sub-command — extra surface, no clear standalone trigger.
- Inline axes in both validate.md and verify.md — duplication, certain drift.

### Strict bidirectional coverage rule in AGENTS.md

**Decision:** AGENTS.md (plus CLAUDE.md symlink) declares: every axis → R### or out-of-scope-with-reason; every R### from this skill → axis or justification. Strict = error, not warning.

**Rationale:** Without enforcement, axis coverage and project requirements drift apart silently. Strict rule forces explicit choices: either satisfy the axis or own the decision to skip it. Matches GSD's existing "every Active requirement must be mapped" pattern.

**Alternatives Considered:**
- Soft (warnings only) — easy to ignore, drifts anyway.
- No rule, just recommendations — guarantees drift over time.

### Sample project as git submodule

**Decision:** `assets/samples/gitignorer/` is a git submodule pointing to `git@github.com:BotTech/gitignore.git`, branch `main`.

**Rationale:** A real, maintained reference beats a contrived one. Submodule keeps the asset fresh as gitignorer evolves. Static copy would drift the moment gitignorer adds a new axis-relevant feature.

**Alternatives Considered:**
- Static copy — guaranteed drift.
- Symlink to local path — not portable across machines.
- Remove sample entirely — lose the concrete anchor for validate/verify reports.

### No `.gsd/` writes from the skill

**Decision:** The skill provides content and reads/validates. It never writes to `.gsd/`. GSD remains the sole author of `.gsd/` artifacts.

**Rationale:** Separation of concerns. GSD owns the artifact lifecycle and the format. Skill-side writes would couple it to GSD's internal format and risk write-write conflicts with GSD's own state machine.

**Alternatives Considered:**
- Skill writes its own `.gsd/axis-coverage.md` — adds a file GSD doesn't know about; users have two sources of truth.
- Skill writes directly into REQUIREMENTS.md — couples to GSD's format; conflicts with GSD's own writes.

### No gsd-pi coupling

**Decision:** The skill targets gsd-core (methodology) not gsd-pi (this harness). No `/gsd` slash command invocations, no `gsd_*` tool calls, no `.gsd/gsd.db` reads in skill instructions.

**Rationale:** The skill should work in any agent harness that loads SKILL.md files. The previous skill's `invoke /gsd-new-project` instruction was a pi-ism leak that made the skill un-runnable in Cursor or Codex.

**Alternatives Considered:**
- Allow pi-coupling with a "fall back gracefully" note — fragile, hard to test, doesn't actually work in non-pi harnesses.

## Error Handling Strategy

The skill itself does not perform IO that can fail in interesting ways. It is static content plus read-only checks. Error handling applies specifically to:

- **validate and verify reports:** structured format with per-axis status (covered / uncovered / out-of-scope), evidence path (file:line where applicable), and a top-level pass/fail verdict. Errors (uncovered axis, orphan R###) are listed individually with axis ID and explanation.
- **Missing inputs:** if the project being validated has no `.gsd/REQUIREMENTS.md`, validate emits a single "no REQUIREMENTS.md found" error and exits. Same for other required artifacts.
- **Submodule not initialized:** if `assets/samples/gitignorer/` is empty when verify runs, verify emits "submodule not initialized — run `git submodule update --init --recursive`" and exits.
- **No silent fallbacks:** the skill does not guess or substitute. Missing inputs are errors, not warnings.

## Risks and Unknowns

- **Renaming breaks existing installs** — `skills-lock.json` and any user-side references to the old skill names must be handled. Mitigation: S06 includes a migration audit and either continued operation under old paths (via symlinks) or a clear migration note. (Why it matters: silent breakage of installed users destroys trust in the distribution contract.)
- **AGENTS.md rule is text, not code** — strict enforcement depends on the host agent actually reading AGENTS.md and applying the rule. Mitigation: rule is short, explicit, and written in imperative voice. validate/verify sub-commands provide a programmatic check that catches violations regardless of whether the agent enforced the rule at write time. (Why it matters: a rule that isn't enforced is a rule that doesn't exist.)
- **Submodule initialization on `npx skills add`** — unclear whether the skills installer handles submodules. Mitigation: S06 verifies the install path and documents the manual init step if needed. (Why it matters: a broken submodule is worse than no submodule — looks like a populated dir but is empty.)
- **Reference files drift from GSD templates over time** — GSD's templates can change. Mitigation: R013 (stable axis IDs) and R005 (shape-matching) make drift detectable; validate can include a template-shape check. (Why it matters: shape-mismatched references defeat the whole point — agent has to translate instead of lift.)
- **Sample project drifts from current "what good looks like"** — gitignorer may evolve in ways that no longer demonstrate an axis cleanly. Mitigation: submodule pins to `main`; verify report against the submodule's current state catches regressions. (Why it matters: a sample that lies about what good looks like is worse than no sample.)

## Existing Codebase / Prior Art

- `skills/gsd-new-cli-project/SKILL.md` — broken invocation (`/gsd-new-project` doesn't exist); content roughly correct but wrapped in a `<modified_workflow>` tag that no longer applies. Will be removed in S01.
- `skills/gsd-new-cli-project/references/rewrite-your-cli-for-ai-agents.md` — the original blog post content. Will be incorporated into the merged skill's references (likely `architecture.md` and `pitfalls.md` source material).
- `skills/agent-dx-cli-eval/SKILL.md` — the 8-axis scoring rubric. Will be moved to `references/eval.md` in the merged skill. The current SKILL.md content becomes the eval reference body.
- `skills/agent-dx-cli-eval/references/agent-dx-cli-scale.md` — earlier 7-axis version. Will be merged into `references/eval.md` (we're keeping the 8-axis version).
- `skills/timesheet/` — unrelated; not touched in this milestone.
- `~/src/bottech/gitignore/` — local working copy of the gitignorer project that will become the submodule target. Already implements all 8 axes concretely (verified: parsers, formatters, schema/examples commands, dry-run, mode detection).

## Relevant Requirements

- R001 — Merged skill replaces both existing skills.
- R002 — 7 user-invocable sub-commands.
- R003 — `eval.md` as shared reference.
- R004 — `AGENTS.md` + `CLAUDE.md` enforcing strict bidirectional coverage.
- R005 — Reference files shape-match GSD templates.
- R006 — Starter requirements in GSD-template format with Axis tag.
- R007 — `validate` produces structured plan-mode report.
- R008 — `verify` produces structured impl-mode report.
- R009 — `assets/samples/gitignorer/` as git submodule.
- R010 — SKILL.md is short (progressive disclosure).
- R011 — No `.gsd/` writes from anywhere in the skill.
- R012 — No gsd-pi coupling.
- R013 — Stable axis IDs across references.
- R014 — Repo root README updated.
- R015 — skills-lock.json and symlinks updated.
- R016 — `.gitmodules` configured and documented.

## Scope

### In Scope

- Merging `gsd-new-cli-project` + `agent-dx-cli-eval` into `agent-first-cli`.
- Writing SKILL.md, AGENTS.md, CLAUDE.md symlink.
- Writing 8 reference files (stack, features, architecture, pitfalls, requirements, eval, validate, verify).
- Adding the gitignorer submodule under `assets/samples/gitignorer/`.
- Updating repo root README, skills-lock.json, and `.gitmodules`.
- Shape-matching all references to their GSD template equivalents.

### Out of Scope / Non-Goals

- Scaffolder binary or generator that emits a starter CLI repo (R017).
- Multi-language samples — only TypeScript/Node via gitignorer (R018).
- Auto-invocation hooks into GSD's planning flow (R019).
- Changes to GSD itself.
- Changes to the timesheet skill.

## Technical Constraints

- Skill must work in any agent harness that loads SKILL.md files.
- Skill must not write to `.gsd/` in the target project.
- Skill must not invoke `/gsd` slash commands or `gsd_*` tools in its instructions.
- Reference files must match GSD template section shapes exactly (headers, fields, list formats).
- Submodule must pin to `main` branch of `git@github.com:BotTech/gitignore.git`.
- Existing `npx skills add https://github.com/bottech/skills` install flow must keep working.

## Integration Points

- **GSD methodology** (gsd-core) — primary integration. Skill's references are consumed during GSD's planning phases; skill's validate/verify are invoked at validate and verify phases. Skill is harness-agnostic.
- **`npx skills` installer** — distribution. Skill's directory layout must match what the installer expects (SKILL.md at root, references/ subdirectory, assets/ subdirectory).
- **Agent harness conventions** — `AGENTS.md` is the universal filename; `CLAUDE.md` symlink makes Claude Code pick it up automatically. Both files declare the same standing rules.
- **gitignorer repo** (`git@github.com:BotTech/gitignore.git`) — submodule dependency. Skill tracks `main`; consumer-facing surface depends on gitignorer continuing to demonstrate the 8 axes.

## Testing Requirements

- **Static verification:** all expected files exist; CLAUDE.md is a symlink to AGENTS.md; .gitmodules entry is correct.
- **Submodule verification:** `git submodule status` shows the gitignorer submodule initialized and at a valid commit on `main`.
- **Reference shape verification:** each reference file's section headers match its target GSD template (scripted check possible).
- **Sub-command invocation verification:** manual smoke test — invoke each of the 7 sub-commands by name, confirm the correct reference loads.
- **validate verification:** run against a deliberately gapped `.gsd/REQUIREMENTS.md`, confirm the gap is flagged as an error.
- **verify verification:** run against the gitignorer submodule, confirm all 8 axes are detected as covered with concrete file evidence.
- **Stranger test:** a fresh agent given only the repo can use the skill end-to-end without asking questions.

## Acceptance Criteria

Per-slice acceptance criteria:

- **S01:** `skills/agent-first-cli/` exists; old directories gone; `.gitmodules` configured; `git submodule status` clean.
- **S02:** SKILL.md under 100 lines; AGENTS.md declares strict bidirectional rule; CLAUDE.md is a working symlink; each sub-command can be invoked and loads exactly one reference.
- **S03:** 5 reference files (stack, features, architecture, pitfalls, requirements) present and shape-matched to their GSD templates; `requirements.md` includes starter R###s with Axis tags.
- **S04:** `validate.md` and `verify.md` present; both reference `eval.md`; both produce structured reports with per-axis status; strict rule enforced.
- **S05:** Gitignorer submodule populates on clone; each axis traceable to a concrete file in the submodule.
- **S06:** Repo README updated; skills-lock.json audited; migration path documented if needed; submodule init step documented.

## Open Questions

- Should the `validate.md` and `verify.md` reports include suggested fixes for each error, or just identify the error? — Current thinking: identify the error and link to the relevant axis in `eval.md`; the axis definition is the fix recipe.
- Should the skill ship a scripted `validate` / `verify` runner, or are the references purely instructions for the host agent to follow? — Current thinking: references are instructions, not scripts. Keeping them as content preserves the harness-agnostic posture. Scripts would couple to a specific runtime.
