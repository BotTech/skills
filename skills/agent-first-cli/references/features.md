# Features — Agent-First CLI

Reference feature inventory for projects adopting the agent-first CLI pattern. The first eight sections align one-to-one with the 8-axis rubric in `eval.md`; the closing sections enumerate differentiators, anti-features, and the cross-check that ties P0 features back to the starter R### blocks in `requirements.md`.

The 4-column axis-aligned tables (`Feature | Why Required | Priority | Complexity`) are the canonical format. Priority values:

- **P0** — required for axis coverage; missing this feature means the axis is uncovered and the validate/verify report will flag the gap.
- **P1** — strongly recommended; ships a meaningful quality improvement and removes common agent friction.
- **P2** — differentiator; not required for axis coverage but distinguishes this CLI from peers.

Every axis reference uses the `Axis N` or `Axis: N` token so S04's validate/verify report can match features back to per-axis status without parsing prose.

## Discoverability Features

Required for Axis 1 — an agent cannot drive a CLI it cannot introspect. The features in this section make the command surface, schema, and examples machine-readable from inside the shell, with no external documentation lookup.

| Feature | Why Required | Priority | Complexity |
|---|---|---|---|
| `examples <command>` sub-command | Required for Axis 1 (discoverability) — agents need a single introspection point that emits runnable JSON payloads per command instead of grepping prose docs. | P0 | MEDIUM |
| `schema <resource>` sub-command | Required for Axis 1 (discoverability) — runtime introspection of input/output/error schemas lets agents validate payloads before sending and reason about response shape. | P0 | MEDIUM |
| `--help` JSON variant (e.g., `--help --output json`) | Required for Axis 1 (discoverability) — machine-readable help text lets an agent enumerate sub-commands and flags without parsing formatted prose. | P0 | LOW |
| Command names match operation verbs (`create`, `update`, `delete`, `list`) | Required for Axis 1 (discoverability) — predictable verb nouns let an agent guess a command from intent and reduce trial-and-error discovery. | P1 | LOW |
| `cli commands` listing (every sub-command on one line of NDJSON) | Required for Axis 1 (discoverability) — a single-call inventory of the command surface lets an agent build a stable internal map on first invocation. | P1 | LOW |

## Invocation Features

Required for Axis 2 — agents generate JSON natively, and translating JSON to bespoke CLI flags re-introduces all the shell-escaping problems structured I/O was meant to solve. The features in this section let an agent send one structured payload per command.

| Feature | Why Required | Priority | Complexity |
|---|---|---|---|
| `--input json` flag accepting a raw JSON payload | Required for Axis 2 (invocation) — agents emit JSON natively; a single `--input '<json>'` flag eliminates per-flag escaping and shape drift between shells. | P0 | LOW |
| stdin JSON parser (`echo '{...}' \| cli cmd`) | Required for Axis 2 (invocation) — piped JSON lets agents chain commands and send large payloads that exceed shell argv limits. | P0 | MEDIUM |
| Zod-validated input schema shared with `schema <resource>` | Required for Axis 2 (invocation) — the same schema validates input at runtime and is exported via `schema`, so agents can pre-validate payloads and never discover shape errors only after invocation. | P0 | MEDIUM |
| Raw API payload passthrough (no bespoke flag translation) | Required for Axis 2 (invocation) — the structured payload uses the same shape as the underlying operation, avoiding a parallel surface that drifts from the real API. | P1 | LOW |
| `--input json --file <path>` for payload files | Required for Axis 2 (invocation) — large or reusable payloads belong in versioned files, not inlined in command strings. | P2 | LOW |

## I/O Features

Required for Axis 3 — stdout and stderr must carry different signals, and the CLI must pick a sensible default based on whether a human or an agent is reading. The features in this section enforce the stdout=data / stderr=diagnostics split and let the caller override the default.

| Feature | Why Required | Priority | Complexity |
|---|---|---|---|
| `--output json\|ndjson\|stdout` with TTY-aware defaults | Required for Axis 3 (I/O) — the CLI must emit parseable JSON when piped while keeping humans happy when attached to a terminal, with an explicit override flag. | P0 | MEDIUM |
| stdout = data, stderr = diagnostics/messages | Required for Axis 3 (I/O) — strict stream separation is the contract that makes the CLI composable into pipelines; mixing data and prose on stdout forces fragile text scraping. | P0 | LOW |
| NDJSON streaming for paginated or large result sets | Required for Axis 3 (I/O) — agents can process one object per line as it arrives instead of buffering an arbitrary result list; keeps memory bounded on both ends of the pipe. | P0 | MEDIUM |
| Non-TTY auto-mode detection via `process.stdout.isTTY` | Required for Axis 3 (I/O) — the CLI must switch to JSON output when piped without requiring the caller to remember a flag, so naive `cli cmd \| jq` works on first contact. | P0 | LOW |
| `cli mode` prints the resolved output mode | Required for Axis 3 (I/O) — making mode resolution observable lets an agent reason about what it will receive without trial-and-error invocations. | P1 | LOW |

## State Features

Required for Axis 4 — agents retry on transient failures, and a CLI that creates a fresh clone on every run or accumulates cache entries without bound turns retries into resource exhaustion. The features in this section make the persistent-state contract explicit and bounded.

| Feature | Why Required | Priority | Complexity |
|---|---|---|---|
| Explicit cache location via env-paths (XDG-conformant) | Required for Axis 4 (state) — a single well-known cache root lets an agent clean up, inspect, or override state without reading source; XDG keeps the CLI well-behaved on shared systems. | P0 | LOW |
| Documented side-effects list per command (in `--help` and `schema`) | Required for Axis 4 (state) — an agent must know which filesystem paths a command will write to, which network endpoints it will hit, and whether it mutates external state before it commits to invoking. | P0 | LOW |
| Pull-or-clone idempotent pattern (cache hit → reuse, miss → fetch once) | Required for Axis 4 (state) — repeated runs with identical input must converge to the same on-disk state; a fresh fetch on every invocation is the failure mode that turns retries into resource exhaustion. | P0 | MEDIUM |
| `--no-cache` flag to bypass cache for one invocation | Required for Axis 4 (state) — when an agent suspects stale state it must be able to force a fresh fetch without editing config or clearing directories. | P1 | LOW |
| Cache TTL and invalidation policy surfaced in `schema <command>` | Required for Axis 4 (state) — the freshness contract must be machine-readable so an agent can decide whether to trust cached state before invoking. | P1 | LOW |

## Error Features

Required for Axis 5 — agents parse errors programmatically and branch their retry strategy on stable codes. Free-text errors force fragile string matching that breaks on the next release. The features in this section enforce a typed, structured, code-stable error contract.

| Feature | Why Required | Priority | Complexity |
|---|---|---|---|
| Typed error classes (`ValidationError`, `GitError`, `FsError`, `BusinessError`) | Required for Axis 5 (errors) — class identity is the stable branch key an agent uses to choose retry vs. abandon; free-text messages cannot serve that role. | P0 | LOW |
| `toJSON()` on every error class emitting `{error, message, ...context}` | Required for Axis 5 (errors) — structured serialization guarantees that stderr is parseable JSON, not prose, and that context fields are typed rather than informal. | P0 | LOW |
| Stable error-code taxonomy as string constants (e.g., `VALIDATION_ERROR`) | Required for Axis 5 (errors) — codes are the contract an agent pins its retry logic to; codes that drift across releases silently break every downstream agent loop. | P0 | LOW |
| Errors never reach stdout | Required for Axis 5 (errors) — stdout is reserved for data; an error on stdout corrupts the JSON stream and forces the caller to disambiguate parse failures from real data. | P0 | LOW |
| Error class carries typed `context` fields (path, command, status, etc.) | Required for Axis 5 (errors) — typed context lets an agent log the failure with the fields it needs for diagnostics and deduplication rather than grepping the message. | P1 | LOW |

## Exit Code Features

Required for Axis 6 — exit codes are the coarsest signal an agent has about whether to retry, abandon, or surface to the user. The features in this section make the code taxonomy stable, documented, and structurally tied to error class identity.

| Feature | Why Required | Priority | Complexity |
|---|---|---|---|
| Documented exit-code taxonomy (1=validation, 2=external-deps, 3=filesystem, 4=business) | Required for Axis 6 (exit codes) — a small documented table lets an agent map an exit code to a recovery strategy without reading source. | P0 | LOW |
| Top-level error handler calls `process.exit(err.exitCode)` | Required for Axis 6 (exit codes) — a single exit-code dispatch site prevents drift between error class and exit code; the mapping is structurally enforced. | P0 | LOW |
| `readonly exitCode` field on each error class | Required for Axis 6 (exit codes) — making the exit code a class-level constant means class identity and exit code cannot drift apart across releases. | P0 | LOW |
| `--help` and `--version` exit with code 0 | Required for Axis 6 (exit codes) — introspection calls must not be indistinguishable from failures; help and version are success cases. | P0 | LOW |
| Exit-code table exported via `schema <command>` | Required for Axis 6 (exit codes) — the taxonomy must be machine-readable so an agent can build its retry strategy from introspection alone. | P1 | LOW |

## Idempotency Features

Required for Axis 7 — agents must be able to preview the effect of a mutating call before committing, and to verify idempotency by running twice and diffing. The features in this section make mutation explicit and reversible-in-intent.

| Feature | Why Required | Priority | Complexity |
|---|---|---|---|
| `--dry-run` flag on every mutating command | Required for Axis 7 (idempotency) — dry-run is the contract that lets a planning loop propose, verify, then execute without committing side effects on the proposal pass. | P0 | LOW |
| Dry-run output uses the same JSON shape as live output | Required for Axis 7 (idempotency) — shape parity lets an agent diff structural JSON rather than free-text plans, making verification machine-checkable. | P0 | LOW |
| Pull-or-clone converges across repeated runs (same input → same on-disk state) | Required for Axis 7 (idempotency) — repeated invocations must not duplicate artifacts or accumulate cache entries; convergence is what makes retries safe. | P0 | MEDIUM |
| Atomic cache writes (write-to-tmp + rename) | Required for Axis 7 (idempotency) — partial writes from interrupted runs must not leave the cache in an undefined state; atomic rename guarantees the on-disk artifact is either old or new, never half-written. | P0 | MEDIUM |
| Mutation list is explicit per command (declared in `schema <command>`) | Required for Axis 7 (idempotency) — an agent must be able to enumerate what a command will mutate before invoking; hidden mutations break idempotency reasoning. | P1 | LOW |

## Examples Features

Required for Axis 8 — runnable examples are worth more than ten that don't run, because they double as smoke tests and onboarding for agents encountering the CLI for the first time. The features in this section make examples comprehensive, current, and structurally incapable of drifting from the schema.

| Feature | Why Required | Priority | Complexity |
|---|---|---|---|
| `examples <command>` emits runnable JSON for that command | Required for Axis 8 (examples) — one-call access to runnable payloads lets an agent bootstrap against a new CLI without external documentation lookup. | P0 | MEDIUM |
| Examples are versioned with the CLI (live in the package, not a separate repo) | Required for Axis 8 (examples) — version coupling ensures the examples an agent reads at runtime match the CLI it is invoking; out-of-tree examples silently drift. | P0 | LOW |
| Examples include at least one documented error case per command | Required for Axis 8 (examples) — error coverage forces the error taxonomy to stay observable and gives the agent a known-bad payload to reason about retry behavior. | P0 | LOW |
| Examples are generated from the same schema as `schema <resource>` | Required for Axis 8 (examples) — schema-coupled generation makes drift structurally impossible; an example that lies silently corrupts agent output and erodes trust in introspection. | P0 | MEDIUM |
| Examples cover both `--input '<json>'` and stdin pipe forms | Required for Axis 8 (examples) — both invocation forms are P0 in Axis 2; examples must show both so agents do not lock in to one form by accident. | P1 | LOW |

## Differentiators

Features beyond axis coverage that distinguish a well-built agent-first CLI from a minimum-viable one. These are not required for axis coverage but meaningfully improve safety, flexibility, or operational quality.

| Feature | Value | Complexity |
|---|---|---|
| Response sanitization for prompt injection (strip shell-control bytes from data emitted to stdout) | Prevents a compromised upstream source from injecting prompt text into agent-visible output; closes a real attack vector when the CLI is reading external feeds. | MEDIUM |
| Live schema resolution (schema is read from the running binary, not a static doc) | Eliminates the class of bug where docs say one shape and the binary enforces another; the agent's introspection is always truthful. | MEDIUM |
| Multi-surface configuration (one binary serves CLI, extension, and MCP from the same schema) | Removes the per-surface drift problem at the cost of more up-front design; only worth it if the surfaces are all in active use. | HIGH |
| `--fields` selector for response projection (NDJSON or JSON) | Lets an agent pay only for the fields it needs; relevant for CLIs whose payloads are wide and the agent is calling in a hot loop. | LOW |
| `--token-budget` hint that the CLI honors when summarizing | Lets a planning loop tell a search-style command how much context it has left, so the CLI can self-truncate rather than forcing the agent to re-summarize. | MEDIUM |

## Anti-Features

Explicit non-goals for v1. Naming them here prevents scope creep and tells the reader what the CLI deliberately does not do.

| Feature | Avoid Because |
|---|---|
| Web UI | A second surface doubles the cost of keeping examples, schemas, and error codes in sync; the CLI alone is the contract for v1. |
| Multi-language samples beyond TypeScript/Node | One high-quality reference implementation is already a meaningful burden; N parallel ports would each lag the canonical pattern. |
| Global config file (e.g., `~/.clirc`) | Per-project configuration via flags and `--input` only; a global config introduces hidden state that breaks the agent's idempotency reasoning. |
| Bundled scaffolder binary | The sample ships in `assets/samples/`; a scaffolder binary adds a second artifact to version and sign without adding capability the user cannot get from copying the sample. |
| Persistent interactive shell | Agents drive the CLI via stdin/stdout; an interactive REPL breaks the structured-input contract. Prompts that fall back to flag defaults when stdin is not a TTY are fine. |
| Harness-specific slash commands or skill packs | The CLI stays harness-agnostic. Integration with a specific agent harness belongs in that harness's skill/plugin system, not in the CLI's surface. |

## Cross-Check vs REQUIREMENTS.md

Mapping of every P0 feature in the eight axis-aligned sections to the starter R### block in `requirements.md` that traces the same axis. This is the structural bridge between "what features the agent-first CLI ships" and "what requirements a project adopting the pattern commits to." S04's validate report joins this table with the per-axis status to produce the verdict per axis.

| P0 Feature | Starter R### |
|---|---|
| `examples <command>` sub-command | R001 |
| `schema <resource>` sub-command | R001 |
| `--help` JSON variant | R001 |
| `--input json` flag | R002 |
| stdin JSON parser | R002 |
| Zod-validated input schema shared with `schema` | R002 |
| `--output json\|ndjson\|stdout` with TTY-aware defaults | R003 |
| stdout = data, stderr = diagnostics | R003 |
| NDJSON streaming for paginated result sets | R003 |
| Non-TTY auto-mode detection | R003 |
| Explicit cache location via env-paths | R004 |
| Documented side-effects list per command | R004, R009 |
| Pull-or-clone idempotent pattern | R004 |
| Typed error classes | R005 |
| `toJSON()` on every error class | R005 |
| Stable error-code taxonomy as string constants | R005 |
| Errors never reach stdout | R005 |
| Documented exit-code taxonomy (1/2/3/4) | R006 |
| `process.exit(err.exitCode)` in top-level handler | R006 |
| `readonly exitCode` on every error class | R006 |
| `--help` / `--version` exit with code 0 | R006 |
| `--dry-run` on every mutating command | R007 |
| Dry-run output uses the same JSON shape as live output | R007 |
| Pull-or-clone converges across repeated runs | R007 |
| Atomic cache writes (tmp + rename) | R007 |
| `examples <command>` emits runnable JSON | R008 |
| Examples versioned with the CLI | R008 |
| Examples include at least one documented error case per command | R008 |
| Examples generated from the same schema as `schema` | R008 |
