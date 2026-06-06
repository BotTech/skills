---
estimated_steps: 29
estimated_files: 1
skills_used: []
---

# T04: Author architecture.md (component table + data flow)

Why: architecture.md shape-matches GSD's ARCHITECTURE.md template and lifts the component table verbatim from the source gsd-new-cli-project SKILL.md `<context research_type="architecture">` block. It owns the structural contract for how an agent-first CLI's components divide axis responsibilities — every component row tags which axis(es) it owns. Independent of T03/T05.

Do:
1. Read the `<context research_type="architecture">` block of `~/.agents/skills/gsd-new-cli-project/SKILL.md` for the canonical 8-row component table and 6-step Data Flow Sequence.
2. Read `skills/agent-first-cli/assets/samples/gitignorer/.planning/research/ARCHITECTURE.md` for shape and density.
3. Read `skills/agent-first-cli/assets/samples/gitignorer/src/cli/{program,error-handler,mode,flags}.ts` and `src/schema/errors.ts` for concrete axis-by-axis implementation evidence to cite.
4. Create `skills/agent-first-cli/references/architecture.md` with these top-level headers IN THIS EXACT ORDER (R005 shape contract):
   - `# Architecture — Agent-First CLI`
   - `## Recommended Architecture`
   - `## Data Model Sketch`
   - `## Integration Points`
   - `## Scaling Tier`
   - `## Reversibility Risk`
5. `## Recommended Architecture`: opens with 1-paragraph framing, then the 4-column component table `| Component | Input | Output | Responsibilities |` with these 8 rows (copy verbatim from source SKILL.md and tag axis ownership in Responsibilities):
   - Entry Points | CLI args, subcommands | Parsed route | Command routing, help text, version. Owns Axis 1 (discoverability via help).
   - Flag Parser | Command flags | Parsed key-values | Human-facing convenience flags, defaults. Supports Axis 2 (invocation) alongside JSON Parser.
   - JSON Parser | `--input json`, stdin | Structured payload | Raw API payload input for agents, zod validation. Owns Axis 2 (invocation).
   - Input Handler | Parsed input | Sanitized data | Validation, hardening, sanitization (path traversal, control char, percent-encoding rejection). Supports Axis 5 (errors) and Axis 7 (idempotency via early rejection).
   - Command Layer | Validated data | Business result | Logic execution, dry-run gate, error handling. Owns Axis 7 (idempotency via dry-run gate).
   - Output Formatter | Result | JSON/NDJSON/human | Structured output, streaming pagination, mode-aware. Owns Axis 3 (I/O).
   - Error Handler | Thrown errors | Structured JSON + exit code | Maps error class to exit code; never loses class info. Owns Axis 5 (errors) and Axis 6 (exit codes).
   - Examples/Schema Surface | Sub-command invocation | JSON payload/schema | Self-documentation for agents. Owns Axis 1 (discoverability) and Axis 8 (examples).
6. Below the component table, add a `### Data Flow Sequence` numbered list (6 steps): 1. Entry → 2. Parse (Flag Parser OR JSON Parser) → 3. Validate (Input Handler) → 4. Execute (Command Layer, with dry-run check for mutating operations) → 5. Format (Output Formatter, JSON/NDJSON/human by mode) → 6. Return (stdout for data, stderr for messages, exit code from Error Handler on failure). Each step gets 1-2 sentences.
7. `## Data Model Sketch`: 1 short paragraph + a TypeScript-style sketch showing the canonical input envelope (e.g., `{command, args, input, flags}`), the canonical output envelope (`{ok, data | error, meta}`), and the canonical error shape (`{error: code, message, ...context}`). Cite gitignorer's `src/schema/errors.ts` (ValidationError/GitError/FsError/BusinessError each with `toJSON()`).
8. `## Integration Points`: short list of the surfaces the CLI integrates with — CLI (terminal), MCP server (stdio JSON-RPC, optional in v1), scripts (non-TTY detection), agent harnesses (via bash tool invocation). Each bullet 1 sentence.
9. `## Scaling Tier`: 1-2 sentences noting that agent-first CLIs are typically single-process, low-throughput tools; scaling tier is "single operator invocation" not "requests per second." Async I/O matters for pipe correctness, not throughput.
10. `## Reversibility Risk`: 1-2 sentences noting low reversibility risk for the architecture itself (component boundaries are easily refactored); high reversibility risk lives at the error/exit-code contract boundary (changing an exit code breaks downstream scripts) — ties to Axis 6.
11. Use `Axis N` or `Axis: N` in the Responsibilities column and other prose (R013). No deep links. No XML tags.
12. State prohibitions semantically per MEM014.

Done when: `skills/agent-first-cli/references/architecture.md` exists; all 6 top-level headers present in order; `## Recommended Architecture` contains the exact 4-column 8-row component table with axis ownership tagged in Responsibilities; `### Data Flow Sequence` has 6 numbered steps; `## Data Model Sketch` references gitignorer's `src/schema/errors.ts`; every component row's Responsibilities column contains at least one `Axis N` reference.

## Inputs

- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/SKILL.md`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/assets/samples/gitignorer/src/schema/errors.ts`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/assets/samples/gitignorer/src/cli/error-handler.ts`

## Expected Output

- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/architecture.md`

## Verification

test -f skills/agent-first-cli/references/architecture.md

## Observability Impact

The Error Handler component row defines the error→exit-code contract that S04's verify will grep for in any user project: presence of a top-level error handler that serializes typed errors and calls process.exit.
