---
id: T01
parent: S03
milestone: M001
key_files:
  - skills/agent-first-cli/references/requirements.md
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-06-06T05:18:53.214Z
blocker_discovered: false
---

# T01: Authored requirements.md with 9 starter R###s (Axis 1..8 covered) plus 3 out-of-scope anti-features and a coverage table.

**Authored requirements.md with 9 starter R###s (Axis 1..8 covered) plus 3 out-of-scope anti-features and a coverage table.**

## What Happened

Created `skills/agent-first-cli/references/requirements.md` per the task plan. Lifted the R### block shape verbatim from `templates/requirements.md` (Class/Status/Description/Why/Source/Primary owning slice/Supporting slices/Validation/Notes). Authored 9 starter R###s (R001-R009) so every axis 1..8 has at least one covering R###; R009 reinforces Axis 4 with per-command state semantics in --help. Each starter R### carries an `Axis: N` tag in Notes matching the S03-RESEARCH.md canonical axis mapping. R005 Notes additionally reference the gitignorer `src/schema/errors.ts` 4-class taxonomy (ValidationError/GitError/FsError/BusinessError) as a concrete pattern to lift. Added 3 out-of-scope anti-features (R010 MCP server, R011 multi-language samples, R012 GUI/TUI) demonstrating the pattern. Authored `## How to Use This File` as 2 short paragraphs that explain the copy-and-renumber workflow and reference AGENTS.md by role ("per AGENTS.md") rather than re-declaring the strict rule; prohibitions are stated semantically per MEM014 ("the skill stays harness-agnostic", "this file is reference content, not an authoring path"). Authored `## Coverage Table` as a 3-column table mapping Axis → Starter R### → Notes, with all 8 axes covered. Verification: file exists; 4 required `## ` headers present in order; 12 total R### blocks; every Axis 1..8 appears as `Axis: N` in Notes; AGENTS.md referenced by role; no `references/*.md#` deep links; no `.gsd/` write instructions; no `/gsd-`/`gsd_`/`gsd-pi` coupling tokens; file is 158 lines (within ~150 guideline).

## Verification

Ran the task plan's verification battery plus the done-when criteria checks. All passed: file exists at expected path; required `## ` headers present in order (How to Use This File → Starter Requirements → Out-of-Scope (Intentional Non-Goals) → Coverage Table); 9 starter R### blocks plus 3 out-of-scope blocks (12 total); each Axis 1..8 appears as `Axis: N` in a Notes field; AGENTS.md referenced by role at line 9 ("per AGENTS.md"); Coverage Table has 8 rows covering Axis 1..Axis 8; grep for `references/[a-z]+\.md#` returns nothing (no deep links); grep for `.gsd/` write instructions returns nothing; grep for `/gsd-`, `gsd_`, `gsd.db`, `gsd-pi` returns nothing. The simple `test -f` verification command from the task plan also passed.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `test -f skills/agent-first-cli/references/requirements.md` | 0 | ✅ pass | 5ms |
| 2 | `grep -cE '^### R0[0-9][0-9] — ' skills/agent-first-cli/references/requirements.md` | 0 | ✅ pass (12 R### blocks found) | 8ms |
| 3 | `for n in 1 2 3 4 5 6 7 8; do grep -qE "Axis: $n\b" skills/agent-first-cli/references/requirements.md && echo PASS || echo FAIL; done` | 0 | ✅ pass (all 8 axes tagged) | 18ms |
| 4 | `grep -n 'AGENTS.md' skills/agent-first-cli/references/requirements.md` | 0 | ✅ pass (role-style reference found at line 9) | 6ms |
| 5 | `grep -nE 'references/[a-z]+\.md#' skills/agent-first-cli/references/requirements.md` | 1 | ✅ pass (no deep links) | 6ms |
| 6 | `grep -nE '/gsd-|gsd_[a-z]|gsd\.db|gsd-pi' skills/agent-first-cli/references/requirements.md` | 1 | ✅ pass (no gsd-pi coupling tokens) | 7ms |
| 7 | `grep -nE '(create|write|save|append|update|modify|edit)[^.]*\.gsd/' skills/agent-first-cli/references/requirements.md` | 1 | ✅ pass (no .gsd/ write instructions) | 7ms |
| 8 | `grep -E '^\| Axis [0-9]' skills/agent-first-cli/references/requirements.md | wc -l` | 0 | ✅ pass (8 coverage table rows) | 7ms |
| 9 | `grep -n '^## ' skills/agent-first-cli/references/requirements.md` | 0 | ✅ pass (4 required headers in order: How to Use This File, Starter Requirements, Out-of-Scope, Coverage Table) | 6ms |

## Deviations

Added R009 (per-command state documentation in --help, Class: operability, Axis 4) as a complement to R004. R004 covers the CLI-level state contract; R009 makes the state contract observable per-command. Both carry Axis: 4 tags and the Coverage Table lists both. This stays inside the "≥8 starter R###s, one per axis" requirement (axis-per-R### minimum is met; R009 is an additional R### for the same axis, which AGENTS.md explicitly allows — "One or more Active R### with `Axis: N` in Notes").

## Known Issues

None.

## Files Created/Modified

- `skills/agent-first-cli/references/requirements.md`
