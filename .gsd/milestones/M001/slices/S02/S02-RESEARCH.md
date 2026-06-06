# S02 Research — SKILL.md + AGENTS.md + CLAUDE.md + sub-command routing

**Date:** 2026-06-06
**Depth:** Targeted research. SKILL.md routing and AGENTS.md enforcement are well-understood patterns (extensive prior art in `~/.gsd/agent/skills/`); the novel aspect here is the bidirectional axis↔R### rule and the strict 100-line budget for SKILL.md.

## Summary

S02 produces three authored files in `skills/agent-first-cli/` (SKILL.md, AGENTS.md, CLAUDE.md as a symlink) that together form the skill's "routing surface" and "enforcement contract." SKILL.md is a short sub-command router (≤100 lines, no body content); AGENTS.md is a small, declarative rules file that encodes the strict bidirectional coverage rule; CLAUDE.md is a symlink so Claude Code picks up AGENTS.md without divergence.

The slice must NOT touch `references/` content (S03's job) or write any sub-command body — only the routing table and the rule. Everything else (8 axes content, validate/verify mechanics, shape-matched section bodies) is downstream.

The biggest risk is over-scoping: AGENTS.md could balloon into "everything an agent should know" rather than the small enforcement contract R004 requires. The boundary is: AGENTS.md = the rules; SKILL.md = the routing index; references/*.md = the content the routing points at.

## Recommendation

Build S02 as three independent files in this order, with one verification pass at the end:

1. **SKILL.md first** (lowest risk, biggest unblocker for S03/S04/S06) — the sub-command routing table; under 100 lines; pure-XML structure per the skill ecosystem conventions; uses the `<routing>` pattern from `create-skill/templates/router-skill.md`.
2. **AGENTS.md second** (the contract; hardest to get right; smallest file) — declarative rules only, in three sections: (a) The Strict Bidirectional Coverage Rule, (b) Axis → R### direction, (c) R### → Axis direction. No prose, no how-tos.
3. **CLAUDE.md third** (`ln -s AGENTS.md CLAUDE.md` — one command, atomic).
4. **Verify** with a single battery: line count of SKILL.md ≤ 100, each of the 7 sub-command names present, AGENTS.md has both rule directions, CLAUDE.md is a symlink resolving to AGENTS.md, no `/gsd` or `gsd_*` tokens in any file, no `.gsd/` write instructions.

The slice should ship as one commit per file (3 commits) plus a verification commit, mirroring S01's commit cadence and giving S03/S04 a clean handoff.

## Implementation Landscape

### Files to Author

- **`skills/agent-first-cli/SKILL.md`** (new) — Sub-command router. Target ≤100 lines including frontmatter. R002, R010, R011, R012.
- **`skills/agent-first-cli/AGENTS.md`** (new) — Strict bidirectional coverage rule. R004. Also touches R011/R012 by virtue of being a "skill file" subject to the same constraints.
- **`skills/agent-first-cli/CLAUDE.md`** (new, symlink) — `ln -s AGENTS.md CLAUDE.md` from inside the skill dir. R004.
- **`skills/agent-first-cli/references/.gitkeep`** — will be removed by S03 when references/stack.md et al. land. S02 should NOT touch this; S03 removes it as part of populating references/.
- **`skills/agent-first-cli/assets/samples/.gitkeep`** — also stays for now. S05 may or may not remove it depending on whether other content lands alongside gitignorer.

### Key Inputs

- `M001-CONTEXT.md` (inlined into the unit prompt) — vision, architectural decisions (especially "Strict bidirectional coverage rule in AGENTS.md" and "No gsd-pi coupling"), and error handling strategy.
- `M001-ROADMAP.md` (inlined) — slice contract: "SKILL.md exists, under 100 lines, advertises 7 sub-commands; AGENTS.md declares strict bidirectional axis<->R### coverage rule; CLAUDE.md is a working symlink to AGENTS.md; each sub-command name appears in SKILL.md with the reference file it loads."
- Memory entries MEM002, MEM003, MEM004, MEM006, MEM007, MEM009, MEM012 — locked architectural choices.
- `~/.gsd/agent/skills/create-skill/templates/router-skill.md` — the canonical router SKILL.md pattern (YAML frontmatter + `<essential_principles>` + `<intake>` + `<routing>` + `<success_criteria>`).
- `~/.gsd/agent/skills/create-skill/references/skill-structure.md` — required/conditional XML tags, YAML validation rules, anti-patterns.
- `~/.agents/skills/agent-dx-cli-scale/SKILL.md` — the 8-axis source content (will move to `references/eval.md` in S04; S02 references it only by name in SKILL.md).
- `~/.agents/skills/gsd-new-cli-project/SKILL.md` — the broken pattern to avoid: invoked a `/gsd-new-project` slash command (R012 violation), wrapped content in `<modified_workflow>` (a non-standard XML tag), embedded per-domain research content directly in SKILL.md (violates R010 progressive disclosure).
- `skills/timesheet/SKILL.md` — local precedent for `argument-hint` frontmatter and the multiple-sub-command pattern (setup/fill/pto/unpaid/status — analogous shape to stack/features/architecture/pitfalls/requirements/validate/verify).

### SKILL.md Authoring Constraints (R002 + R010 + R011 + R012)

R010's 100-line budget is the binding constraint. Content budget per R010:
- YAML frontmatter (~10 lines): `name`, `description`, `argument-hint`, optional `metadata`.
- Skill purpose + when-to-use trigger phrases (~10–15 lines).
- The 7-row sub-command routing table (~15 lines): each row is `| sub-command | what it loads | when to invoke |`.
- Progressive-disclosure note (~5 lines): explicit statement that each sub-command loads exactly one reference file from `references/`.
- `<success_criteria>` or equivalent (~5–10 lines): what "the skill worked" looks like for the harness.
- Buffer (~30 lines) for headers, blank lines, brief `<essential_principles>` block.

Tight. No sub-command body content. No 8-axis enumeration (that lives in `references/eval.md`, S04). No sample project narrative (S05). No README content (S06).

**Sub-command names** (R002, MEM009): `stack`, `features`, `architecture`, `pitfalls`, `requirements`, `validate`, `verify`. Eval is NOT a sub-command — it's a shared reference file that validate and verify both consume.

**Reference file mapping** (declared in SKILL.md's routing table, files themselves authored in S03/S04):
| Sub-command | Loads | Phase |
|-------------|-------|-------|
| `agent-first-cli stack` | `references/stack.md` | research/planning |
| `agent-first-cli features` | `references/features.md` | research/planning |
| `agent-first-cli architecture` | `references/architecture.md` | research/planning |
| `agent-first-cli pitfalls` | `references/pitfalls.md` | research/planning |
| `agent-first-cli requirements` | `references/requirements.md` | planning |
| `agent-first-cli validate` | `references/validate.md` | plan-mode (pre-execution) |
| `agent-first-cli verify` | `references/verify.md` | impl-mode (post-execution) |

**YAML frontmatter** — the create-skill ecosystem reference (`skill-structure.md`) and timesheet/SKILL.md both show:
```yaml
---
name: agent-first-cli
description: Reference content and bidirectional coverage rule for building agent-first CLIs. Loads phase-specific reference files via 7 sub-commands: stack, features, architecture, pitfalls, requirements, validate, verify. Use when starting or refactoring a CLI project intended for AI agent consumption.
argument-hint: "[stack|features|architecture|pitfalls|requirements|validate|verify]"
metadata:
  version: 0.1.0
---
```
- `name` MUST match directory name exactly (`agent-first-cli`). Lowercase + hyphens only. Max 64 chars. No reserved words.
- `description` MUST be third person, include both capability AND trigger phrases, ≤1024 chars, no XML tags.
- `argument-hint` is optional but recommended for multi-sub-command skills (timesheet uses it).

**R011 (no `.gsd/` writes)** — SKILL.md and AGENTS.md must not instruct the agent to write to `.gsd/`. Reading from `.gsd/REQUIREMENTS.md` is fine (validate/verify need to); writing is not.

**R012 (no gsd-pi coupling)** — no `/gsd-*` slash commands, no `gsd_*` tool calls, no `gsd.db` reads. The previous skill (`gsd-new-cli-project`) was exactly this kind of leak (`invoke /gsd-new-project`). SKILL.md should phrase invocation as natural-language triggers (e.g., "When the user is starting a new CLI project…") and let the host harness decide how to surface that.

### AGENTS.md Authoring Constraints (R004)

AGENTS.md is the **rules** file, not the **content** file. It must:

1. Declare the **Strict Bidirectional Coverage Rule** in imperative voice:
   > Every axis (1–7 of the agent-first axis rubric in `references/eval.md`) must map to an Active R### in the project's REQUIREMENTS.md OR be marked `out-of-scope` with a reason.
   > Every R### generated by this skill (via `references/requirements.md`) must map to at least one axis OR carry an explicit justification in its Notes field.
   > An uncovered axis or an orphan R### is an error, not a warning. Run `agent-first-cli validate` to surface errors.

2. Be **short** — under 50 lines is reasonable. Three sections maximum:
   - The Strict Bidirectional Coverage Rule (above).
   - Axis → R### direction (one short paragraph or table).
   - R### → Axis direction (one short paragraph or table).
   - Optionally a one-line pointer to `references/eval.md` and `references/requirements.md`.

3. **Not enumerate the 8 axes** — that lives in `references/eval.md` (S04). AGENTS.md references eval.md by name only. This is the same progressive-disclosure principle as SKILL.md.

4. **Not duplicate** the validate/verify mechanics — those live in `references/validate.md` and `references/verify.md` (S04). AGENTS.md is the contract; validate/verify are the enforcers.

5. Use plain markdown (no XML tags, no YAML frontmatter). AGENTS.md is read directly by harnesses as a rules file, not parsed as a SKILL.md.

**Naming convention** (MEM003): `AGENTS.md` is canonical (emerging universal convention across Claude Code, Cursor, Codex). `CLAUDE.md` is Claude Code's specific filename. Symlinking `CLAUDE.md → AGENTS.md` gives Claude Code compatibility without divergence.

**Important convention for AGENTS.md vs `<rules>` in SKILL.md**: some skills (e.g., `~/.gsd/agent/skills/api-design/SKILL.md`) embed rules directly in SKILL.md as XML tags. This skill separates them: SKILL.md is the **routing index**, AGENTS.md is the **rules**. Don't merge.

### CLAUDE.md Authoring Constraints (R004)

CLAUDE.md is a **symlink**, not a copy. From inside `skills/agent-first-cli/`:

```bash
cd skills/agent-first-cli
ln -s AGENTS.md CLAUDE.md
```

This must be a relative symlink (not `ln -s /abs/path/AGENTS.md`) so it survives `git clone` to a different machine. Git stores symlinks as-is; on Windows without symlink support, behavior may differ — but R016 (`.gitmodules` configured and documented) and S06's README will cover that caveat.

Verification: `readlink CLAUDE.md` should print `AGENTS.md`. `cat CLAUDE.md` should print the same content as `cat AGENTS.md`. `test -L CLAUDE.md` should exit 0.

### Build Order

The order is forced by independence — all three files can be authored in parallel since none references the others' content (SKILL.md only names reference files; AGENTS.md only names eval.md; CLAUDE.md is a symlink). But for a single-executor slice, the natural order is:

1. **SKILL.md** — produces the routing surface; lets S03/S04/S06 reference sub-command names immediately. Lowest risk; highest unblocker.
2. **AGENTS.md** — produces the enforcement contract; lets S04's validate.md/verify.md reference "the rule defined in AGENTS.md."
3. **CLAUDE.md** — symlink. One command.
4. **Verify** — single battery; commit.

If the executor goes sequential, commit each file separately for clean history (matches S01's T01/T02/T03 cadence).

### Verification Approach (Tailored for S02)

Single gsd_exec battery. Each check is one shell command:

1. `test -f skills/agent-first-cli/SKILL.md` — file exists.
2. `wc -l < skills/agent-first-cli/SKILL.md` returns ≤100.
3. `grep -c '^---$' skills/agent-first-cli/SKILL.md` returns ≥2 (frontmatter present).
4. `grep -E '^name: agent-first-cli$' skills/agent-first-cli/SKILL.md` — name matches dir.
5. For each sub-command name in `{stack, features, architecture, pitfalls, requirements, validate, verify}`:
   `grep -w -c '<name>' skills/agent-first-cli/SKILL.md` returns ≥1.
6. `grep -E '(references/stack\.md|references/features\.md|references/architecture\.md|references/pitfalls\.md|references/requirements\.md|references/validate\.md|references/verify\.md)' skills/agent-first-cli/SKILL.md` — routing table maps to reference files.
7. `test -f skills/agent-first-cli/AGENTS.md` — file exists.
8. `grep -i -c 'axis' skills/agent-first-cli/AGENTS.md` returns ≥2 (rule references axes in both directions).
9. `grep -i -c 'R###\|requirement' skills/agent-first-cli/AGENTS.md` returns ≥2 (rule references R###s).
10. `grep -i -E 'error|strict' skills/agent-first-cli/AGENTS.md` — rule declares strict/error posture.
11. `test -L skills/agent-first-cli/CLAUDE.md` — symlink.
12. `test "$(readlink skills/agent-first-cli/CLAUDE.md)" = "AGENTS.md"` — points at AGENTS.md.
13. `diff <(cat skills/agent-first-cli/AGENTS.md) <(cat skills/agent-first-cli/CLAUDE.md)` returns no diff.
14. R011 sweep: `grep -r '\.gsd/' skills/agent-first-cli/SKILL.md skills/agent-first-cli/AGENTS.md` should not match any write instruction (read references allowed; `cat >`, `write`, `create`, `mkdir .gsd/` not allowed).
15. R012 sweep: `grep -rE '(/gsd|gsd_)' skills/agent-first-cli/SKILL.md skills/agent-first-cli/AGENTS.md` returns no matches.
16. `git status --porcelain` shows exactly three new files (SKILL.md, AGENTS.md, CLAUDE.md) and no modifications to existing files.

## Don't Hand-Roll

| Problem | Existing Solution | Why Use It |
|---------|-------------------|------------|
| SKILL.md routing pattern | `~/.gsd/agent/skills/create-skill/templates/router-skill.md` | Canonical router pattern with `<routing>` table; matches what skill loaders expect |
| Required/conditional XML tags | `~/.gsd/agent/skills/create-skill/references/skill-structure.md` | Documents the exact required tags (`<objective>`, `<quick_start>`, `<success_criteria>`) and naming rules |
| AGENTS.md conventions | `/Users/jason/src/openclaw/AGENTS.md`, `/Users/jason/.agents/AGENTS.md` | Real-world examples of the AGENTS.md format; terse, imperative, sectioned by concern |
| `argument-hint` for sub-commands | `skills/timesheet/SKILL.md` | Local precedent: `[setup\|fill\|pto\|unpaid\|status]` shape directly analogous to `[stack\|features\|...]` |
| Sub-command surface (7 names) | MEM009 + R002 | Locked decision: eval is not a sub-command; the 7 names are fixed |

## Constraints

- **R010 line budget is binding** — 100 lines including frontmatter. Any SKILL.md over 100 lines fails the slice contract.
- **AGENTS.md must not enumerate the 8 axes** — that lives in `references/eval.md` (S04). Listing them in AGENTS.md would create two sources of truth and violate MEM009's "shared eval.md" decision.
- **CLAUDE.md must be a symlink, not a copy** — copying creates two files that will drift. MEM003 locks this as the convention.
- **R011 (no `.gsd/` writes)** applies even to AGENTS.md and SKILL.md instructions. The skill cannot tell the agent to write to `.gsd/REQUIREMENTS.md` — that's GSD's job. The skill can tell the agent to read `.gsd/REQUIREMENTS.md` for validation purposes.
- **R012 (no gsd-pi coupling)** applies to every file in the skill. SKILL.md must NOT say things like "invoke /gsd-new-project" or "run gsd_task_complete." It must work in Cursor, Codex, pi, or any harness that reads SKILL.md/AGENTS.md files.
- **The 7 sub-command names are fixed by R002** — no creativity allowed. If the executor thinks "score" would be a better name than "verify," that's a future-R### conversation, not an S02 decision.
- **Cross-references use stable axis IDs (R013)** — but R013 is owned by S03 (where reference content lives). S02's SKILL.md/AGENTS.md may mention "Axis 1" through "Axis 7" by ID, but the canonical axis definitions live in S04's eval.md.

## Common Pitfalls

- **Embedding the 8 axes in SKILL.md or AGENTS.md** — easy to do reflexively ("while I'm here, let me just list them"). Avoids the S04 deliverable; creates duplication. Keep SKILL.md/AGENTS.md narrow.
- **Making AGENTS.md too long** — the "strict bidirectional rule" can grow into a treatise on why axis coverage matters. Don't. AGENTS.md is a contract, not an explainer. The "why" lives in `references/eval.md` (S04).
- **Using XML tags in AGENTS.md** — AGENTS.md is read as plain markdown by harnesses (Claude Code, Cursor). XML tags work in SKILL.md but are wrong here. Use markdown headings (`##`) for sections.
- **Phrasing R011 as "no `.gsd/` access"** — too strict. The skill must READ `.gsd/REQUIREMENTS.md` for validate/verify. R011 forbids WRITES only.
- **Forgetting that CLAUDE.md is a symlink means git stores it as a symlink** — `git status` will show "CLAUDE.md" as a new file but `git diff` will show the symlink target, not file contents. This is correct behavior. The executor should verify with `file CLAUDE.md` or `test -L CLAUDE.md`, not by reading the file's contents via cat on a checked-out copy.
- **Absolute vs relative symlink target** — `ln -s AGENTS.md CLAUDE.md` (relative) is correct; `ln -s /Users/jason/.../AGENTS.md CLAUDE.md` (absolute) breaks on any other machine. Always use the relative form from inside the skill dir.
- **Putting validate/verify mechanics in AGENTS.md** — the rule belongs in AGENTS.md; the mechanics ("read .gsd/REQUIREMENTS.md, parse R### blocks, map to axes, emit per-axis status") belong in references/validate.md (S04).
- **Inventing new sub-command names** — the 7 are fixed by R002. Don't add "examples" or "score" or "help" as 8th sub-commands. Help is the host harness's job.
- **Leaking gsd-pi-isms** — R012. Easy to slip in phrases like "the gsd_core planning agent" or "the pi harness." Use generic terms: "the host agent," "the harness."

## Sources

- `.gsd/milestones/M001/M001-CONTEXT.md` (inlined into unit prompt) — vision, architectural decisions, error handling strategy
- `.gsd/milestones/M001/M001-ROADMAP.md` (inlined) — slice contract
- `.gsd/REQUIREMENTS.md` — R002, R003, R004, R010, R011, R012 (S02's owned requirements)
- Memory: MEM002 (merge), MEM003 (AGENTS.md naming), MEM004 (strict bidirectional rule), MEM006 (no .gsd/ writes), MEM007 (no gsd-pi coupling), MEM009 (eval.md as shared reference), MEM012 (.gsd/ boundary interpretation)
- `~/.gsd/agent/skills/create-skill/templates/router-skill.md` — router SKILL.md pattern
- `~/.gsd/agent/skills/create-skill/references/skill-structure.md` — required tags, YAML rules, anti-patterns
- `~/.gsd/agent/skills/create-skill/references/gsd-skill-ecosystem.md` — skill directories, discovery, validation constraints
- `~/.agents/skills/gsd-new-cli-project/SKILL.md` — the broken pattern to avoid (R012 violation; embedded content; non-standard `<modified_workflow>` tag)
- `~/.agents/skills/agent-dx-cli-scale/SKILL.md` — the 8-axis source content (moves to `references/eval.md` in S04; only the existence is referenced in S02)
- `skills/timesheet/SKILL.md` — local precedent for `argument-hint` and multi-sub-command frontmatter
- `~/.gsd/agent/skills/api-design/SKILL.md`, `~/.gsd/agent/skills/observability/SKILL.md`, `~/.gsd/agent/skills/decompose-into-slices/SKILL.md` — line counts for skill-size calibration (139–190 lines; SKILL.md in this skill must be tighter because the content lives in 7 reference files)
- `/Users/jason/src/openclaw/AGENTS.md`, `/Users/jason/.agents/AGENTS.md` — real-world AGENTS.md format examples (plain markdown, terse, imperative)
- `npx skills --help` output — confirmed `npx skills add https://github.com/<owner>/<repo>` is the canonical install command; no submodule-handling guarantee (S06's responsibility to document)

## Requirements Advanced by This Slice

- **R002** — Will be VALIDATED by S02: SKILL.md exists, advertises 7 sub-commands by exact name, maps each to one reference file.
- **R003** — Will be ADVANCED by S02: SKILL.md references `eval.md` by name (S04 will create the file itself).
- **R004** — Will be VALIDATED by S02: AGENTS.md exists with strict bidirectional rule; CLAUDE.md is a working symlink.
- **R010** — Will be VALIDATED by S02: SKILL.md is ≤100 lines, contains only routing/purpose/trigger content.
- **R011** — Will be ADVANCED by S02: SKILL.md and AGENTS.md contain no `.gsd/` write instructions.
- **R012** — Will be VALIDATED by S02: SKILL.md and AGENTS.md contain no `/gsd`, no `gsd_*` tool calls, no pi-isms.

(Requirements formally VALIDATED should wait for slice completion; the planner/executor may choose to mark them as "advanced" until verification passes, then promote.)

## Forward Intelligence (for S03/S04/S06)

**Fragility:**
- S03 must use the exact reference file names declared in SKILL.md's routing table. If S03 decides to rename `references/pitfalls.md` to `references/risks.md`, SKILL.md's routing row breaks silently. Mitigation: S02's verification includes a grep that the 7 reference paths appear in SKILL.md; S03's first task should be to read SKILL.md and confirm the names match before authoring any reference file.
- AGENTS.md's strict rule references "the 7 axes in references/eval.md." If S04 decides there are actually 8 axes (the source blog post scale lists 7; the project context says "8 axes"), the rule and eval.md will disagree. Mitigation: S04 must use the same axis count that AGENTS.md declares. S02 should phrase AGENTS.md's axis count generically ("the axes defined in `references/eval.md`") so S04 can pick the count without S02 needing to update. **Recommendation: AGENTS.md should NOT hardcode "7 axes" or "8 axes" — it should say "every axis defined in `references/eval.md`" and let S04 own the count.** This is a small but important flexibility.
- CLAUDE.md as a symlink is portable across Unix but may not survive on Windows checkouts without `core.symlinks=true`. S06's README should document this.

**Changed assumptions:**
- The original 7-axis rubric in `~/.agents/skills/agent-dx-cli-scale/SKILL.md` lists 7 axes; the project context repeatedly says "8 axes." The discrepancy is S04's problem (it will write eval.md with the canonical count), but S02's AGENTS.md wording must NOT lock in a number.

**Watch-outs:**
- `npx skills` install path: `npx skills add https://github.com/bottech/skills` is the canonical install command per M001's success criteria. Whether the skills CLI handles git submodules is unclear (S06 verifies and documents). S02 does not need to verify this.
- The existing `references/.gitkeep` placeholder file: S02 should NOT delete it (S03 will, when references/stack.md et al. land). S02's verification should NOT fail on its existence.
- The GSD research template (`research.md` in `gsd-pi/dist/resources/extensions/gsd/templates/`) is one consolidated template with optional sections — not separate STACK/FEATURES/ARCHITECTURE/PITFALLS templates. So R005's "shape-match" mapping is: `stack.md` shape-matches the research template's "stack" content area; `features.md` shape-matches the research template's "features" content area; `architecture.md` shape-matches `context.md`'s "Architectural Decisions" section; `pitfalls.md` shape-matches `context.md`'s "Risks and Unknowns" section; `requirements.md` shape-matches the requirements template. **This is S03's concern, not S02's, but S02's SKILL.md routing table implies the shape mapping by listing these sub-command names.**
