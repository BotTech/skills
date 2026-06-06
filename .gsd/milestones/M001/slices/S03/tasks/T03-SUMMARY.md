---
id: T03
parent: S03
milestone: M001
key_files:
  - (none)
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-06-06T05:19:10.131Z
blocker_discovered: false
---

# T03: Authored skills/agent-first-cli/references/stack.md with 5 required headers in exact order, 10-row Recommended Stack table with inline axis tags, 7-row What NOT to Use table, and 5 open questions.

**Authored skills/agent-first-cli/references/stack.md with 5 required headers in exact order, 10-row Recommended Stack table with inline axis tags, 7-row What NOT to Use table, and 5 open questions.**

## What Happened

Read gitignorer's STACK.md for the canonical 5-column shape (Component / Library / Version / Confidence / Rationale) and the gsd-new-cli-project SKILL.md `<context research_type="stack">` block for additional priorities (async I/O, JSON serialization, flag + JSON parsing, schema tools, examples pattern). Authored stack.md as a lift-and-drop source for a project's .gsd/research/STACK.md.

Recommended Stack table covers all 10 required components (TypeScript, Node 20.10+, Commander, @clack/prompts, zod, ndjson, fs/promises + async iterators, env-paths, tsdown, tsx). The Rationale column cites axis relevance inline ("Axis 2 invocation", "Axis 3 streaming I/O", "Axis 1/Axis 5 schema introspection", "Axis 4 state transparency") rather than as a separate Axis column — 11 axis citations total, well above the 3-row minimum. Alternatives Considered is a 2-column table with 7 rejected options (oclif, Inquirer, axios, glob, yargs, citty, picocolors) each with a one-sentence rationale. What NOT to Use is a 2-column table with 7 entries covering: stdout progress/JSON mixing (Axis 3), sync I/O (Axis 3), ad-hoc error strings (Axis 5), ANSI escapes on stdout (Axis 3), single shared exit code (Axis 6), mutable global state (Axis 4/7), untyped any payloads (Axis 2/5). Open Questions lists 5 unresolved scoping items (MCP surface, ESM/CJS, plugin hooks, watch/daemon modes, minimum Node version).

Mechanical verification: all 5 required top-level headers present in exact order; Recommended Stack has exact 5-column header (| Component | Library | Version | Confidence | Rationale |) and 10 data rows; What NOT to Use is 2-column (| Option | Avoid Because |) with 7 rows; 11 axis citations in Recommended Stack rationale. No R012 forbidden tokens (/gsd commands, gsd_* tool calls, .gsd/gsd.db). No R013 deep links (no .md# anchors). File is 50 lines, well under the 250-line soft budget. Prohibitions stated semantically per MEM014 — no literal forbidden-token sequences written anywhere in the file.

## Verification

Verified file existence via `test -f skills/agent-first-cli/references/stack.md` (exit 0). Verified header order via grep (title, then ## Recommended Stack, ## Alternatives Considered, ## What NOT to Use, ## Open Questions in that exact sequence). Verified Recommended Stack columns via awk: `| Component | Library | Version | Confidence | Rationale |` with 10 data rows. Verified What NOT to Use columns: `| Option | Avoid Because |` with 7 data rows. Verified axis citations: 11 occurrences of "Axis N" inside the Recommended Stack section (≥3 required). Verified no R012 forbidden tokens (`/gsd `, `gsd_*(`, `.gsd/gsd.db`) and no R013 deep-link forms (`.md#`). File is 50 lines, 5933 bytes.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `test -f skills/agent-first-cli/references/stack.md` | 0 | ✅ pass | 6ms |
| 2 | `awk header-order check (grep '^## ' stack.md)` | 0 | ✅ pass | 12ms |
| 3 | `awk row count for Recommended Stack (must be ≥8)` | 0 | ✅ pass (10 rows) | 11ms |
| 4 | `awk row count for What NOT to Use (must be ≥5)` | 0 | ✅ pass (7 rows) | 9ms |
| 5 | `axis citation count in Recommended Stack (must be ≥3)` | 0 | ✅ pass (11 citations) | 11ms |
| 6 | `grep forbidden tokens R012 (/gsd, gsd_*(, .gsd/gsd.db)` | 1 | ✅ pass (none found) | 8ms |
| 7 | `grep deep links R013 (.md#)` | 1 | ✅ pass (none found) | 8ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

None.
