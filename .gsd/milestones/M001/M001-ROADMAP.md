# M001: Agent-First CLI Skill

**Vision:** Merge gsd-new-cli-project and agent-dx-cli-eval into a single agent-first-cli skill that provides shape-matched reference content for GSD's planning phases and a strict 8-axis bidirectional coverage rule enforced via AGENTS.md, with gitignorer as a real reference implementation under assets/samples/.

## Success Criteria

- A user can run `npx skills add https://github.com/bottech/skills` on a fresh machine, load the skill in any agent harness, invoke each of the 7 sub-commands by name, and get the correct reference loaded.
- A GSD project using this skill produces axis-coverage-complete REQUIREMENTS.md (every axis mapped to an R### or explicitly out of scope).
- `agent-first-cli validate` against a sample project's planning docs catches a deliberately introduced axis gap and reports it as an error.
- `agent-first-cli verify` against assets/samples/gitignorer/ produces a passing report (all 8 axes covered by concrete implementation evidence).
- No file in the skill writes to .gsd/ in the target project; no file invokes /gsd slash commands or gsd_* tools.
- A stranger reading the repo root README and the skill's SKILL.md can use the skill end-to-end without asking questions.

## Slices

- [x] **S01: Restructure: rename, merge, submodule wiring** `risk:medium` `depends:[]`
  > After this: Repo has skills/agent-first-cli/ with empty placeholder files; skills/gsd-new-cli-project/ and skills/agent-dx-cli-eval/ removed; .gitmodules configured for assets/samples/gitignorer pointing to git@github.com:BotTech/gitignore.git branch main; git submodule status clean; git clone --recurse-submodules produces populated dir.

- [x] **S02: SKILL.md + AGENTS.md + CLAUDE.md + sub-command routing** `risk:medium` `depends:[S01]`
  > After this: agent-first-cli/SKILL.md exists, under 100 lines, advertises 7 sub-commands; AGENTS.md declares strict bidirectional axis<->R### coverage rule; CLAUDE.md is a working symlink to AGENTS.md; each sub-command name appears in SKILL.md with the reference file it loads.

- [x] **S03: Reference content: stack, features, architecture, pitfalls, requirements** `risk:medium` `depends:[S02]`
  > After this: 5 reference files in references/ (stack.md, features.md, architecture.md, pitfalls.md, requirements.md); each file's section headers match its target GSD template; requirements.md includes starter R###s with Axis: N tags; cross-references use stable axis IDs.

- [x] **S04: validate + verify references consuming eval.md** `risk:high` `depends:[S02,S03]`
  > After this: references/eval.md, validate.md, verify.md exist; validate.md and verify.md both reference eval.md; each defines a structured report format with per-axis status; strict rule (uncovered axis or orphan R### is error) is encoded; running validate against a deliberately gapped REQUIREMENTS.md flags the gap as an error.

- [x] **S05: Asset verification: gitignorer demonstrates all 8 axes** `risk:low` `depends:[S03]`
  > After this: For each of the 8 axes, a concrete file path in assets/samples/gitignorer/ is identified that demonstrates the axis; a short mapping table in the skill's README documents the axis → file evidence.

- [ ] **S06: Repo-level updates: README, skills-lock.json, migration note** `risk:low` `depends:[S02]`
  > After this: Repo root README.md skills index lists agent-first-cli with correct description and triggers; old entries removed; skills-lock.json audited (no references to old paths, or migration note added); submodule init step documented in README.

## Boundary Map

### S01 → S02\n\nProduces:\n- `skills/agent-first-cli/` directory exists with `references/` and `assets/samples/` subdirectories\n- `.gitmodules` entry for `assets/samples/gitignorer`\n- Old skill directories removed\n\nConsumes:\n- nothing (first slice)\n\n### S02 → S03\n\nProduces:\n- `SKILL.md` with sub-command index (the routing surface)\n- `AGENTS.md` with strict bidirectional rule (the enforcement contract)\n- `CLAUDE.md` symlink\n\nConsumes:\n- S01's directory layout\n\n### S02 → S04\n\nProduces:\n- Same as S02 → S03 (S04 also depends on the routing surface)\n\nConsumes:\n- Same\n\n### S03 → S04\n\nProduces:\n- 5 reference files (stack, features, architecture, pitfalls, requirements) with content for eval.md and validate/verify to consume\n- requirements.md's starter R###s with Axis tags — the data validate/verify checks against\n\nConsumes:\n- S02's SKILL.md (sub-command routing) and AGENTS.md (strict rule definition)\n\n### S04 (terminal)\n\nProduces:\n- `references/eval.md` — the rubric spine\n- `references/validate.md` — plan-mode checker consuming eval.md\n- `references/verify.md` — impl-mode checker consuming eval.md\n\nConsumes:\n- S02's strict rule definition\n- S03's requirements.md (the data being checked)\n\n### S03 → S05\n\nProduces:\n- Reference content describing what each axis should look like\n\nConsumes:\n- S01's gitignorer submodule (the asset being verified against the references)\n\n### S02 → S06\n\nProduces:\n- Sub-command names that need to appear in repo README\n\nConsumes:\n- S01's submodule wiring (for documenting init step)\n\n### S05, S06 (terminal)\n\nNo downstream consumers within M001.
