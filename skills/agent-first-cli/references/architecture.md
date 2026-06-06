# Architecture — Agent-First CLI

This file is the canonical recommended component layout for an agent-first CLI built in the TypeScript / Node ecosystem. It is the lift-and-drop source for a project's `.gsd/research/ARCHITECTURE.md`. The component table lifts the canonical 8-row table from the gsd-new-cli-project skill's architecture research block and tags every row with the agent-first axis (Axis 1..Axis 8; see eval.md) it owns or supports, so S04's validate/verify report can map components back to per-axis status without parsing prose.

## Recommended Architecture

An agent-first CLI is structured as eight single-responsibility components arranged in a linear validate-then-execute-then-format pipeline. Two input parsers (Flag Parser for humans, JSON Parser for agents) converge on a shared Input Handler so validation logic is written once. The Output Formatter is mode-aware and never mixes data and prose on the same channel. The Error Handler sits at the top of the call stack and is the only place that translates a thrown error into a process exit, which keeps exit codes a project-wide contract rather than an accident. The Examples/Schema Surface is the component the rest of the architecture publishes to so agents can self-discover the surface — without it, the architecture is agent-callable but not agent-discoverable.

| Component | Input | Output | Responsibilities |
|-----------|-------|--------|------------------|
| Entry Points | CLI args, subcommands | Parsed route | Command routing, help text, version. Owns Axis 1 (discoverability via help). |
| Flag Parser | Command flags | Parsed key-values | Human-facing convenience flags, defaults. Supports Axis 2 (invocation) alongside JSON Parser. |
| JSON Parser | `--input json`, stdin | Structured payload | Raw API payload input for agents, zod validation. Owns Axis 2 (invocation). |
| Input Handler | Parsed input | Sanitized data | Validation, hardening, sanitization (path traversal, control char, percent-encoding rejection). Supports Axis 5 (errors) and Axis 7 (idempotency via early rejection). |
| Command Layer | Validated data | Business result | Logic execution, dry-run gate, error handling. Owns Axis 7 (idempotency via dry-run gate). |
| Output Formatter | Result | JSON/NDJSON/human | Structured output, streaming pagination, mode-aware. Owns Axis 3 (I/O). |
| Error Handler | Thrown errors | Structured JSON + exit code | Maps error class to exit code; never loses class info. Owns Axis 5 (errors) and Axis 6 (exit codes). |
| Examples/Schema Surface | Sub-command invocation | JSON payload/schema | Self-documentation for agents. Owns Axis 1 (discoverability) and Axis 8 (examples). |

### Data Flow Sequence

1. **Entry** — The Entry Points component receives the invocation (a subcommand plus flags, or a JSON payload on stdin via `--input json`) and routes it to the correct command handler. Routing is the only thing Entry Points does; it owns no business logic.
2. **Parse** — The invocation is handed to either the Flag Parser (human typing at a terminal) or the JSON Parser (agent or piped script). Both parsers must produce the same internal shape so downstream code is parser-agnostic; this is the mechanical pivot for Axis 2 (invocation).
3. **Validate** — The Input Handler runs zod validation and the hardening passes (path-traversal, control-character, and percent-encoding rejection for free-form string fields). Validation happens before any side effect, which is what makes the CLI safe to invoke twice in a row and underpins Axis 7 (idempotency via early rejection).
4. **Execute** — The Command Layer runs the business logic with the dry-run gate in front of any mutating operation. The dry-run check is the architectural hook that lets an agent safely probe a command before committing to it; it is also the second half of Axis 7.
5. **Format** — The Output Formatter shapes the result according to the resolved mode: JSON or NDJSON on stdout for agent mode, plain text on stdout for non-interactive humans, and colored text for TTY humans. Pagination for large result sets is the formatter's responsibility, never the command's, and large responses stream rather than buffer.
6. **Return** — Data goes to stdout, messages and logs go to stderr, and on failure the Error Handler selects the exit code from the thrown error class. The strict stdout/stderr split is what lets an agent reliably pipe data while reading human diagnostics on a separate channel.

## Data Model Sketch

All components communicate via three canonical shapes: an input envelope that both parsers produce, an output envelope that the formatter consumes, and an error shape that the Error Handler serializes. Keeping the shapes fixed is what makes the components independently testable.

```ts
// Canonical input envelope — produced by Flag Parser OR JSON Parser.
type CliInput = {
  command: string;              // e.g. "generate"
  args: string[];               // positional args
  input?: unknown;              // structured payload from --input json / stdin
  flags: {                      // normalized flag map
    output?: 'json' | 'ndjson' | 'stdout';
    input?: 'json';
    yes?: boolean;
    dryRun?: boolean;
  };
};

// Canonical output envelope — consumed by Output Formatter.
type CliResult = {
  ok: boolean;
  data?: unknown;               // present when ok === true
  error?: CliError;             // present when ok === false
  meta?: { durationMs: number; mode: 'INTERACTIVE' | 'NON_INTERACTIVE' | 'AGENT' };
};

// Canonical error shape — serialized by Error Handler to stderr + exit code.
type CliError = {
  error: string;                // machine-readable code, e.g. "VALIDATION_ERROR"
  message: string;              // human-readable message
  issues?: unknown[];           // zod issues on ValidationError
  details?: unknown;            // arbitrary structured context
  path?: string;                // filesystem path on FsError
  context?: Record<string, unknown>;
};
```

The error shape is not theoretical — it lifts directly from the gitignorer sample's `src/schema/errors.ts`, which defines four typed error classes (`ValidationError`, `GitError`, `FsError`, `BusinessError`), each carrying a stable `code` constant and a `toJSON()` method that emits exactly the canonical shape above. The Error Handler in `src/cli/error-handler.ts` does an `instanceof` dispatch over those classes and calls `process.exit(1|2|3|4)` accordingly, with `1` as the catch-all for unknown errors. That mapping is the project-wide exit-code contract; the architecture treats it as immutable from v1 onward.

## Integration Points

- **Terminal (TTY)** — the human-facing surface; Entry Points emits colored help and the Output Formatter emits colored text only when `process.stdout.isTTY` is true.
- **Pipes / scripts (non-TTY)** — detected via `!process.stdout.isTTY`; suppresses color, suppresses prompts, and routes everything data-shaped to stdout so `| jq` works.
- **Agent harnesses (bash tool invocation)** — agents invoke the binary as a subprocess and read JSON from stdout; the Examples/Schema Surface is what they grep to compose the invocation.
- **MCP server (stdio JSON-RPC)** — optional in v1; when present, wraps the Command Layer and emits JSON-RPC responses over stdio so the same CLI can be driven by an MCP-aware agent without changing its command surface.

## Scaling Tier

Agent-first CLIs are single-process, single-operator tools — the relevant scaling tier is "one invocation at a time per operator," not requests per second. Throughput is intentionally not a design goal; what does matter is async I/O for pipe correctness (a slow consumer must not block the CLI's event loop) and streaming for large result sets so an agent can paginate without the CLI buffering the entire response in memory.

## Reversibility Risk

Reversibility risk is low for the component boundaries themselves — the eight components are single-responsibility and a refactor that splits or merges one is a local change with local tests. Reversibility risk is high at the error-shape and exit-code contract boundary: changing an exit code or removing a field from the canonical `CliError` shape silently breaks downstream agent scripts that branched on the old value. That contract is the architectural anchor for Axis 6 (exit codes) and Axis 5 (errors) and should be treated as a public API from v1 onward.
