---
estimated_steps: 17
estimated_files: 1
skills_used: []
---

# T03: Author stack.md (Recommended Stack + What NOT to Use)

Why: stack.md is the simplest file in S03 — short, table-driven, and lift-able almost verbatim from gitignorer's STACK.md plus the source gsd-new-cli-project SKILL.md `<context research_type="stack">` block. Independent of T02/T04/T05 — runs in any order against them. The stack choices directly enable Axis 2 (invocation needs a JSON-aware CLI framework), Axis 3 (I/O needs NDJSON library + async I/O), and Axis 5 (errors need an error-serialization story).

Do:
1. Read `skills/agent-first-cli/assets/samples/gitignorer/.planning/research/STACK.md` for the canonical shape (it's the most shape-faithful example available).
2. Read the `<context research_type="stack">` block of `~/.agents/skills/gsd-new-cli-project/SKILL.md` for additional content (CLI Framework Priorities, Examples Command Pattern).
3. Create `skills/agent-first-cli/references/stack.md` with these top-level headers IN THIS EXACT ORDER (R005 shape contract):
   - `# Stack — Agent-First CLI`
   - `## Recommended Stack`
   - `## Alternatives Considered`
   - `## What NOT to Use`
   - `## Open Questions`
4. `## Recommended Stack`: 5-column table with exact columns `| Component | Library | Version | Confidence | Rationale |`. ~10 rows covering: language (TypeScript), runtime (Node 20+), CLI framework (Commander), interactive prompts (@clack/prompts), validation (zod), streaming output (NDJSON), async I/O (fs/promises + async iterators), cache paths (env-paths), build/bundle (tsdown), dev runner (tsx). The Rationale column cites axis relevance inline: e.g., "Async-first; required for Axis 3 I/O." or "Built-in JSON mode enables Axis 2 invocation." Don't add a separate Axis column.
5. `## Alternatives Considered`: short prose or table covering the runner-up choices — e.g., oclif (rejected: heavy multi-command overhead), Inquirer.js (rejected: @clack/prompts is more modern), axios (rejected: native fetch sufficient in Node 18+), glob (rejected: native fs.readdir recursive). One paragraph or 2-column `| Option | Why Rejected |` table.
6. `## What NOT to Use`: 2-column table `| Option | Avoid Because |` with 5-7 entries that actively harm agent-first design — e.g., `console.log` for mixed data + progress (breaks Axis 3); synchronous I/O (breaks Axis 3 streaming); bespoke error strings (breaks Axis 5); shell-color codes in stdout (breaks Axis 3 JSON); shared exit code for all errors (breaks Axis 6); mutable global state across commands (breaks Axis 4/7).
7. `## Open Questions`: 3-5 short bullet items the user's project will need to resolve (e.g., is MCP surface in scope for v1? Will the CLI ship as ESM or CJS? Is there a need for plugin hooks?).
8. Use `Axis N` or `Axis: N` (R013) in the Rationale column where stack choices touch axes; otherwise plain prose. No deep links. No XML tags.
9. State prohibitions semantically per MEM014.

Done when: `skills/agent-first-cli/references/stack.md` exists; all 5 required top-level headers present in order; `## Recommended Stack` table has the exact 5 columns and ≥8 rows; `## What NOT to Use` is a 2-column table with ≥5 rows; at least 3 rows in the Recommended Stack table cite an axis in their Rationale ("Axis N" or "Axis: N").

## Inputs

- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/SKILL.md`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/assets/samples/gitignorer/.planning/research/STACK.md`

## Expected Output

- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/stack.md`

## Verification

test -f skills/agent-first-cli/references/stack.md

## Observability Impact

None — static reference content. The Rationale column's axis tags propagate into S04's eval.md when it lists stack-driven axis coverage.
