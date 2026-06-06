# Evaluation Rubric — Agent-First CLI

This file is the canonical 8-axis rubric spine for the agent-first-cli skill. It is consumed by `validate.md` (plan-mode checker) and `verify.md` (impl-mode checker), which both read the axis list, pass criteria, evidence expectations, and failure symptoms from here. It is **not** a sub-command of the skill — the skill never routes a user to eval.md directly. The strict bidirectional coverage rule (every axis maps to an Active R### or is marked out-of-scope; every R### this skill suggests maps to an axis or carries a justification) is stated authoritatively in `AGENTS.md`; this file does not redeclare that rule, it lists the axes the rule operates over.

This file is reference content, not an executable. It writes nothing to the user's `.gsd/` and is harness-agnostic: no slash commands, no tool calls, no database reads. Where this file references concrete artifacts as evidence examples (file paths, sub-commands, JSON shapes), it draws from the gitignorer sample shipped under `assets/samples/gitignorer/` so an agent can corroborate the example against running code.

## Axis 1: Discoverability

An agent cannot drive a CLI it cannot introspect from inside the shell. Axis 1 is the contract that the CLI's command surface, schemas, and example payloads are machine-readable without leaving the terminal or consulting external documentation.

**Pass criteria**

- Every sub-command and flag enumerable through a single introspection call (`--help`, `commands`, or equivalent) rather than by reading source.
- Input and output shapes for every command are available as JSON schemas emitted by the CLI itself, not as hand-authored docs.
- Example payloads are runnable end-to-end: piping an example back into the CLI via `--input` or stdin succeeds without modification.
- Help text is available in a machine-readable variant (e.g., `--help --output json`) so an agent can enumerate flags without parsing formatted prose.

**Common evidence**

- `cli --help` lists every sub-command with a one-line summary, exit code 0.
- `cli --help --output json` returns a JSON object with `commands[]` and `flags[]` arrays.
- `cli schema <resource>` emits a JSON Schema document for the named resource.
- `cli examples <command>` emits at least one runnable JSON payload per command (see the gitignorer sample's `examples generate` command at `assets/samples/gitignorer/src/cli/commands/examples.ts`).
- The command surface is documented in `--help` and in the schema output, in lockstep.

**Failure symptoms**

- "Agents send payloads that always fail validation" — schema and runtime have drifted apart.
- Docs show fields the CLI does not accept, or the CLI accepts fields the docs do not show.
- The README example works but the `examples generate` output for the same command does not.
- `schema <resource>` rejects payloads that `schema` itself produced.
- An agent cannot enumerate the command surface without grepping the source tree.

## Axis 2: Invocation

Agents generate JSON natively; composing CLI flags from JSON re-introduces every shell-escaping problem structured I/O was meant to solve. Axis 2 is the contract that every command accepts the same payload via a single structured-input channel, in addition to the human-facing flag form.

**Pass criteria**

- Every command that takes structured input accepts the same payload through `--input '<json>'` and through stdin (`echo '{...}' | cli cmd`).
- The structured payload uses the raw API payload shape — no bespoke agent-only flags or name mangling.
- The input schema is the same Zod (or equivalent) source the runtime validates against and the same schema `schema <resource>` exports.
- Both invocation forms appear in example coverage so an agent does not lock in to one by accident.

**Common evidence**

- `cli cmd --input '{"name":"..."}'` and `echo '{"name":"..."}' | cli cmd` succeed with identical results.
- The Zod schema for `<command>` is shared between the JSON Parser, the Flag Parser, and the `schema <command>` output (see gitignorer's `assets/samples/gitignorer/src/schema/inputs.ts`).
- `cli schema <command>` prints the input schema an agent can validate against before sending.
- Example payloads in `examples <command>` round-trip through `--input` and stdin.

**Failure symptoms**

- Flag-form invocation succeeds but JSON-form invocation fails on the same logical payload.
- An agent must double-escape quotes or pre-percent-encode fields to get the CLI to accept a payload.
- The schema exported by `schema <command>` rejects payloads that the runtime accepts, or vice versa.
- stdin piping hangs, drops bytes, or yields a different result from `--input '<json>'`.
- Per-shell escaping quirks (`bash` vs `zsh` vs `fish`) produce different parse outcomes for the same JSON.

## Axis 3: I/O

stdout and stderr must carry different signals, and the CLI must pick a sensible default based on whether a human or an agent is reading. Axis 3 is the contract that data flows on stdout and diagnostics flow on stderr, with a TTY-aware default the caller can override.

**Pass criteria**

- stdout is reserved for the structured payload (JSON, NDJSON, or the requested text format); nothing else is ever written there.
- stderr carries progress messages, warnings, human-readable errors, and debug logs — never data.
- `--output json|ndjson|stdout` is honored with TTY-aware defaults (human format when TTY, JSON when piped).
- Large or paginated result sets stream as NDJSON rather than buffering.
- Mode resolution is observable so an agent can reason about what it will receive without trial-and-error.

**Common evidence**

- `cli cmd | jq .` succeeds on first contact with no parse errors.
- `cli cmd 2>/dev/null` yields pure JSON (or pure text in stdout mode) on stdout.
- `cli cmd --output ndjson | head -n 1` returns a single complete JSON object.
- `cli mode` prints the resolved output mode (`json`, `ndjson`, `stdout`) given the current TTY/flag state.
- The output layer is a single component (see gitignorer's `assets/samples/gitignorer/src/cli/output.ts`) rather than scattered `console.log` calls.

**Failure symptoms**

- Pipe breaks when output is large, or `jq` fails at line 1 column 1 on output that looks fine in a terminal.
- Verbose mode (`-v`) returns a different output shape than default mode.
- Progress messages like "Generating templates..." appear interleaved with JSON on stdout.
- The CLI works in a terminal but hangs or produces garbled output when an agent pipes it.
- NDJSON output buffers the entire result set before emitting the first line.

## Axis 4: State

Agents retry on transient failures. A CLI that creates a fresh clone on every run or accumulates cache entries without bound turns retries into resource exhaustion. Axis 4 is the contract that persistent state is documented, lives under a well-known path, and converges across repeated invocations.

**Pass criteria**

- Every persistent artifact the CLI creates or mutates lives under an XDG-conformant path discovered via env-paths (or equivalent).
- Each command's `--help` and `schema <command>` output names the paths it reads, the paths it writes, the network endpoints it hits, and whether it mutates external state.
- Repeated invocations with identical input converge to the same on-disk state — no duplicate artifacts, no accumulating cache entries.
- Cache location, TTL, and invalidation policy are surfaced in the schema output so an agent can reason about freshness.
- A `--no-cache` flag (or equivalent) lets an agent force a fresh fetch for one invocation without editing config.

**Common evidence**

- `cli schema <command>` includes `state.reads[]`, `state.writes[]`, and `state.cache: {root, ttl}` fields.
- Running the same command twice produces a no-op on the second run (see gitignorer's smart-merge logic in `assets/samples/gitignorer/src/services/template-service.ts`).
- The cache root resolves to `$XDG_CACHE_HOME/<cli>/` (or platform equivalent via env-paths), not a hidden directory inside the user's home.
- `cli cmd --no-cache` bypasses the cache for that single invocation and still produces the correct result.
- `--help` for each command lists "Reads:", "Writes:", and "Side effects:" sections.

**Failure symptoms**

- Running the command twice creates two files, or the cache directory has five copies of the same template after five runs.
- A retry on transient timeout doubles the side effect (e.g., creates a second API resource).
- The CLI writes to paths under the user's home that are not documented anywhere in `--help`.
- Cache TTL is undocumented; an agent cannot tell whether it is reading fresh or stale state.
- Removing the cache directory breaks the CLI rather than triggering a clean re-fetch.

## Axis 5: Errors

Agents parse errors programmatically and branch retry strategy on stable codes. Free-text errors force fragile string matching that breaks on the next release. Axis 5 is the contract that every error is a typed instance with a stable code and a structured JSON shape.

**Pass criteria**

- Every error the CLI can raise is an instance of a typed error class with a stable string `code` (e.g., `VALIDATION_ERROR`).
- Every error class implements `toJSON()` that emits `{error, message, ...context}` to stderr.
- Errors never reach stdout under any code path.
- Input validation rejects unsafe input (path traversal, control characters, double-encoding) with a structured `ValidationError` rather than crashing.
- Typed `context` fields (path, command, status) travel with the error so the agent can log and deduplicate without grepping the message.

**Common evidence**

- The error taxonomy is encoded as a small set of typed classes (see gitignorer's `assets/samples/gitignorer/src/schema/errors.ts`: `ValidationError`, `GitError`, `FsError`, `BusinessError`).
- Each error class has `readonly code: string`, `readonly exitCode: number`, and `toJSON(): {error, message, ...context}`.
- `cli cmd 2>&1 1>/dev/null` shows structured JSON on stderr when the command fails.
- An invalid `--input` payload produces `{error: "ValidationError", code: "VALIDATION_ERROR", message: "...", path: "..."}` on stderr and nothing on stdout.
- The schema output for `<command>` includes an `errors[]` table enumerating the typed errors that command can raise.

**Failure symptoms**

- Errors reach stdout as unstructured text, breaking any downstream `jq` pipeline.
- The same logical failure produces different free-text messages across releases, breaking agent retry logic.
- An agent passing `../` in a path field causes a filesystem crash instead of a structured `ValidationError`.
- Error messages include shell-control bytes or unsanitized input that corrupt agent context.
- The error class identity and the exit code have drifted apart (e.g., `ValidationError` exits 1 in one command and 2 in another).

## Axis 6: Exit Codes

Exit codes are the coarsest signal an agent has about whether to retry, abandon, or surface to the user. Axis 6 is the contract that exit codes form a small, stable, documented taxonomy tied structurally to error class identity.

**Pass criteria**

- The CLI uses a small, documented exit-code taxonomy (suggested: 1=validation, 2=external-deps, 3=filesystem, 4=business — or any small set in the POSIX user-defined range 64-113).
- The mapping from error class to exit code is encoded as a `readonly exitCode` field on each error class so class identity and code cannot drift apart.
- A single top-level error handler dispatches `process.exit(err.exitCode)`; no other site calls `process.exit` with a hardcoded code.
- `--help` and `--version` exit with code 0.
- The taxonomy is exported by `schema <command>` and printed in `--help` so an agent can build its retry strategy from introspection alone.

**Common evidence**

- `cli --help` includes an "Exit codes" section listing each code and its meaning.
- `cli schema <command>` returns a JSON object with `exitCodes: [{code, label, meaning}]`.
- The error module (e.g., `assets/samples/gitignorer/src/schema/errors.ts`) defines `readonly exitCode` on each class.
- `cli cmd --bad-flag; echo $?` produces the documented validation exit code, not a generic 1.
- The same logical failure produces the same exit code across every command in the CLI.

**Failure symptoms**

- The same error produces different exit codes across commands (e.g., validation is 1 in `cmd-a` and 2 in `cmd-b`).
- An agent's retry policy does not fire because exit code 1 means five different things.
- Downstream scripts special-case exit codes by command name to compensate for drift.
- The README's exit code table does not match what the binary actually emits.
- `--help` exits with a non-zero code on a CLI that is otherwise healthy.

## Axis 7: Idempotency

Agents must be able to preview the effect of a mutating call before committing, and to verify idempotency by running twice and diffing. Axis 7 is the contract that mutation is explicit, previewable, and convergent across repeated invocations.

**Pass criteria**

- Every mutating command accepts a `--dry-run` flag that prints the planned operations and exits 0 without performing them.
- Dry-run output uses the same JSON shape as live output (with an added `wouldChange` indicator per affected path) so an agent can diff structurally rather than textually.
- Repeated invocations with identical input produce no additional side effects: no duplicate files, no duplicate API calls, no accumulating cache entries.
- Mutating writes are atomic (write-to-tmp + rename) so an interrupted run cannot leave the on-disk state half-written.
- The list of mutations a command can perform is declared in `schema <command>` so an agent can enumerate blast radius before invoking.

**Common evidence**

- `cli mutating-cmd --dry-run` prints `[{op: "write", path: "...", wouldChange: true}, ...]` and exits 0; rerunning without `--dry-run` performs exactly those operations.
- Running the same mutating command twice yields identical on-disk state on both runs (git diff shows no change after the second run).
- The cache write path uses `fs.rename` over a temp file (see gitignorer's template service) rather than `fs.writeFile` directly.
- `cli schema <command>` includes `mutations[]` listing every side effect the command can perform.
- `--dry-run | jq` and `<live run> | jq` produce JSON of the same shape, differing only in the `wouldChange` field.

**Failure symptoms**

- A retry on transient failure doubles the side effect (e.g., two resources created, two files written).
- `--dry-run` exists but emits prose that an agent cannot diff against the live run's JSON output.
- An interrupted run leaves a half-written file at the target path.
- A command mutates state that is not declared in its schema output (hidden side effects).
- Running the CLI in a polling loop gradually fills the cache directory or accumulates log files.

## Axis 8: Examples

Runnable examples are worth more than ten that do not run, because they double as smoke tests and onboarding for agents encountering the CLI for the first time. Axis 8 is the contract that example payloads are present, runnable, and structurally incapable of drifting from the schema.

**Pass criteria**

- `examples <command>` emits at least one JSON payload per command that can be piped back into the CLI and run successfully end-to-end.
- Examples include at least one documented error case per command so the error taxonomy stays observable.
- Examples are generated from the same schema the `schema <resource>` sub-command exports, so drift is structurally impossible.
- Examples are versioned with the CLI (live in the package, not a separate repo) so the examples an agent reads at runtime match the binary it is invoking.
- Examples cover both `--input '<json>'` and stdin pipe forms.

**Common evidence**

- `cli examples <command> | cli <command>` succeeds end-to-end as a smoke test.
- `cli examples <command>` includes entries with `{expectedError: "ValidationError", ...}` so an agent can see what failure looks like.
- The example generator is fixture-driven and the same fixtures drive CI tests (see gitignorer's `assets/samples/gitignorer/src/cli/commands/examples.ts`).
- `examples <command>` and `schema <command>` for the same command agree on every field name and enum value.
- The CLI's release artifact includes the examples directory; `cli --version` and the examples share a single version number.

**Failure symptoms**

- An example payload that worked at v1.2 fails at v1.3 because the schema changed and nobody updated the example.
- `examples <command>` and `schema <command>` disagree on field names, enum values, or required-vs-optional status.
- The example directory shows the command shape from three releases ago.
- All examples are happy-path; an agent has no documented failure case to reason about retry behavior.
- Examples live in a separate repo with its own release cadence, so the agent cannot trust that the example matches the binary it has installed.

## Citation Convention

When citing an axis in prose, use the form `Axis N` (e.g., "Axis 5 errors means the CLI must emit structured JSON on stderr"). When tagging a structured field — typically a Notes entry on an R### or a Coverage Table row — use the form `Axis: N` (e.g., `Axis: 5` inside a Notes bullet). The H2 headers in this file use the form `## Axis N: <Name>` (e.g., `## Axis 5: Errors`). Do not use `#axis-N` anchors, `references/eval.md#axis-N` deep links, or any file-and-section citation form; both `validate.md` and `verify.md` reference axes by name and number only, never by anchor.

This file is reference content, not an executable. It writes nothing under any project's `.gsd/` directory and is harness-agnostic: no slash commands, no tool calls, no database reads.
