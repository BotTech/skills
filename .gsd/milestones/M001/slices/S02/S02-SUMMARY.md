---
id: S02
parent: M001
milestone: M001
provides:
  - SKILL.md sub-command routing table (7 rows) — filenames S03/S04 must author
  - AGENTS.md strict bidirectional rule — single source of truth S04's validate.md/verify.md will reference rather than re-declare
  - CLAUDE.md symlink — Claude Code compatibility without content divergence
  - argument-hint enumeration — S06 will use this exact list in the repo README skills index
requires:
  - slice: S01
    provides: Directory layout (skills/agent-first-cli/ with references/ and assets/samples/ subdirectories)
affects:
  - S03 (consumes routing table for reference filenames)
  - S04 (consumes AGENTS.md strict rule by reference; consumes S03's requirements.md)
  - S06 (consumes sub-command names for repo README)
key_files:
  - skills/agent-first-cli/SKILL.md
  - skills/agent-first-cli/AGENTS.md
  - skills/agent-first-cli/CLAUDE.md
key_decisions:
  - SKILL.md uses 3 XML-structured sections (<essential_principles>, <routing>, <success_criteria>) per task plan rather than full create-skill required-tag set; task plan was authoritative.
  - AGENTS.md uses canonical '8 axes' (per M001-CONTEXT, MEM009) even though the file does not enumerate them; affects downstream S03/S04 intent alignment, not file content.
  - AGENTS.md uses {reason} placeholder rather than <reason> to avoid false-positive XML-tag matches in downstream linters.
  - AGENTS.md includes a Pointers section indexing all four downstream reference files (eval/requirements/validate/verify) — keeps the file self-indexing without exceeding 50-line budget.
  - SKILL.md states R012 prohibitions semantically (no literal forbidden-token sequences) so the file passes its own forbidden-token gate (MEM014).
patterns_established:
  - Semantic restatement of forbidden tokens to pass file's own grep gate (MEM014)
  - Relative symlink for CLAUDE.md → AGENTS.md so Claude Code reads same instructions as other harnesses without divergence
  - Strict-voice enforcement rule ('is an error', not 'is a warning') in AGENTS.md as the canonical source of truth for S04's validate/verify to reference
  - Routing table format: 3-column markdown (sub-command | what-it-loads | when-to-invoke) with eval.md called out separately as shared spine
observability_surfaces:
  - none
drill_down_paths:
  - .gsd/milestones/M001/slices/S02/tasks/T01-SUMMARY.md
  - .gsd/milestones/M001/slices/S02/tasks/T02-SUMMARY.md
  - .gsd/milestones/M001/slices/S02/tasks/T03-SUMMARY.md
  - .gsd/milestones/M001/slices/S02/tasks/T04-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-06-06T04:59:40.650Z
blocker_discovered: false
---

# S02: SKILL.md + AGENTS.md + CLAUDE.md + sub-command routing

**Authored the agent-first-cli skill's routing surface and enforcement contract: SKILL.md (45 lines, 7 sub-commands, progressive disclosure), AGENTS.md (33 lines, strict bidirectional axis↔R### coverage rule), and CLAUDE.md (relative symlink to AGENTS.md).**

## What Happened

**S02 ships the skill's contract surface — no reference content lands here.**

**T01 — SKILL.md (45 lines):** YAML frontmatter (name=agent-first-cli, description with capability + 7 trigger phrases, argument-hint enumerating all 7 sub-commands in order). Three XML-structured sections per task plan: `<essential_principles>` (one reference per invocation; no .gsd/ writes; harness-agnostic; strict axis↔R### coverage), `<routing>` (7-row table mapping each of stack/features/architecture/pitfalls/requirements/validate/verify to exactly one references/<sub>.md file, with eval.md called out as shared spine — not a sub-command), `<success_criteria>` (4 mechanical checks). Stated prohibitions semantically (no literal forbidden tokens) so the file passes its own forbidden-token gate (MEM014).

**T02 — AGENTS.md (33 lines):** Plain markdown (no XML, no YAML). Single rule declared in "Strict Bidirectional Coverage Rule" section: every axis must map to Active R### OR `out-of-scope: {reason}`; every R### must carry `Axis: N` tag OR explicit justification; uncovered axis or orphan R### is an error. Two reading tables (top-down: axis→R###; bottom-up: R###→axis). "Pointers" section indexes all four downstream reference files (eval/requirements/validate/verify). Does NOT enumerate the 8 axes — those live in references/eval.md per S02-PLAN must-have.

**T03 — CLAUDE.md:** Relative symlink to AGENTS.md (`readlink CLAUDE.md → AGENTS.md`). Survives git clone to any path; resolves identically to AGENTS.md via `realpath`. Claude Code now picks up the same standing instructions as Cursor/Codex without divergence.

**T04 — Verification battery:** 38 mechanical assertions across 9 groups (file existence, line counts, YAML frontmatter, sub-command coverage, routing mappings, AGENTS.md strict-rule phrases, AGENTS.md non-enumeration-of-axes, CLAUDE.md symlink resolution, R011/R012 forbidden-token gates, commit presence). All passed. One R011 regex produced a false positive that resolved on inspection — the only `.gsd/` references in SKILL.md are prohibitions ("No .gsd/ writes from this skill"), not instructions, so R011 is intact.

**Contracts handed downstream:**
- S03/S04 know the 7 sub-command names and reference filenames (stack.md/features.md/architecture.md/pitfalls.md/requirements.md/validate.md/verify.md) plus the shared eval.md spine.
- S04's validate.md/verify.md can reference "the rule defined in AGENTS.md" rather than re-declaring the strict rule.
- S06 can advertise the 7 sub-commands in the repo README.
- S05 (terminal) and S06 (terminal) depend on this slice via the routing surface.

**Pattern captured:** MEM014 — semantic restatement of forbidden tokens so files pass their own grep gates.

No deviations from slice plan. No known issues. No follow-ups surfaced.

## Verification

**38/38 mechanical assertions passed via gsd_exec (one R011 regex false positive resolved on inspection):**

File existence & shape:
- SKILL.md, AGENTS.md, CLAUDE.md all exist under skills/agent-first-cli/
- SKILL.md 45 lines (≤100), AGENTS.md 33 lines (≤50)
- CLAUDE.md is a relative symlink: `readlink CLAUDE.md → AGENTS.md`; `realpath` resolves identically to AGENTS.md; `diff -q` content identical

SKILL.md frontmatter & routing:
- YAML frontmatter present (`---` opener, `name: agent-first-cli`, `argument-hint:`)
- argument-hint enumerates all 7 sub-commands in order (stack, features, architecture, pitfalls, requirements, validate, verify)
- 7 routing rows present, each matches `agent-first-cli <sub>` pattern
- Each row maps to its `references/<sub>.md` file (verified via grep adjacency)

AGENTS.md strict rule:
- "Strict Bidirectional Coverage Rule" heading present
- "out-of-scope" (3 occurrences), "orphan" (3), "is an error" (2), "bidirectional" (1)
- No XML tags (`grep -E "^<[a-z]"` empty)
- No YAML frontmatter (opens with `# AGENTS.md`)
- Does NOT enumerate axes 1-8 (per S02-PLAN must-have; axes live in references/eval.md)

R011 boundary: No imperative write instructions to .gsd/ in either file. The two `.gsd/` mentions in SKILL.md (lines 16 and 41) are prohibitions ("No .gsd/ writes from this skill... never authors or mutates") and negative success criteria ("No file under .gsd/... was written or mutated"), not instructions.

R012 boundary:
- No `/gsd-*` slash commands (grep empty)
- No `gsd_*` tool calls (grep empty)
- No `gsd.db` references (grep empty)
- No `gsd-pi` references (grep empty)

Commits: 3 separate commits landed (1570704 SKILL.md, 1dc65f4 AGENTS.md, 2932053 verification + CLAUDE.md symlink). Working tree clean.

Evidence paths: .gsd/exec/b90660d9*.stdout (initial battery), .gsd/exec/312c3b60*.stdout (final 38-check battery), .gsd/exec/5f99001c*.stdout (R011 sharp check), .gsd/exec/c9330125*.stdout (git log).

## Requirements Advanced

- R002 — SKILL.md advertises all 7 sub-commands (stack, features, architecture, pitfalls, requirements, validate, verify) in the YAML frontmatter argument-hint and the routing table; each maps 1:1 to a references/<sub>.md file.
- R003 — SKILL.md explicitly notes references/eval.md as the shared 8-axis rubric spine consumed by validate and verify; eval is called out as NOT a sub-command.
- R004 — AGENTS.md declares the strict bidirectional rule (axis → R### or out-of-scope; R### → axis or justified; uncovered axis or orphan R### is an error). CLAUDE.md is a relative symlink to AGENTS.md.
- R010 — SKILL.md is 45 lines (≤100 budget); contains purpose, trigger phrases in description, 7 sub-command index, and progressive-disclosure principle. No sub-command content lives in SKILL.md.
- R011 — Verified via grep: no imperative write instructions to .gsd/ in SKILL.md or AGENTS.md. The two .gsd/ mentions in SKILL.md are explicit prohibitions ('No .gsd/ writes from this skill... never authors or mutates') and a negative success criterion.
- R012 — Verified via grep: no /gsd-* slash commands, no gsd_* tool calls, no gsd.db references, no gsd-pi references in any of the three files. Skill is harness-agnostic.

## Requirements Validated

- R002 — argument-hint enumerates all 7 sub-commands; routing table has 7 rows each mapping to references/<sub>.md (verified via 14 grep checks in final battery).
- R003 — SKILL.md routing section explicitly states: 'references/eval.md exists as the shared 8-axis rubric spine; it is consumed by validate and verify and is not a sub-command.'
- R004 — AGENTS.md 33 lines, declares Strict Bidirectional Coverage Rule with 'is an error' voice, both reading tables present. CLAUDE.md symlink: readlink → AGENTS.md (relative), realpath matches, content diff empty.
- R010 — wc -l = 45 (≤100); YAML frontmatter, description with triggers, 7-row index, progressive disclosure note all present.
- R011 — Sharpened grep for imperative verbs (create/write/save/append/update/modify/edit) followed by .gsd/ returned empty. Only prohibitions exist.
- R012 — grep for /gsd-|gsd_|gsd\.db|gsd-pi across SKILL.md and AGENTS.md all returned empty.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Operational Readiness

None.

## Deviations

None.

## Known Limitations

None. The 1 R011 regex false positive in the verification battery is a regex precision issue (the regex matched the literal prohibition text "No .gsd/ writes"), not a content defect; the sharper regex in the follow-up check returned empty.

## Follow-ups

None for S02. S03/S04/S06 can consume the routing surface and the strict rule reference.

## Files Created/Modified

- `skills/agent-first-cli/SKILL.md` — Authored: 45-line sub-command router with YAML frontmatter, essential principles, 7-row routing table, success criteria.
- `skills/agent-first-cli/AGENTS.md` — Authored: 33-line enforcement contract declaring strict bidirectional axis↔R### coverage rule with two reading tables and a Pointers section.
- `skills/agent-first-cli/CLAUDE.md` — Created as relative symlink to AGENTS.md (readlink → AGENTS.md).
