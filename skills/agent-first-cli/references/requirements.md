# Requirements — Agent-First CLI

Starter requirement blocks for projects adopting the agent-first CLI pattern. Each starter R### is pre-tagged with an `Axis: N` Note that traces to the 8-axis rubric in `eval.md`. Copy these blocks into your project's `REQUIREMENTS.md` and renumber to your project's R### sequence.

## How to Use This File

Copy the starter R### blocks under `## Starter Requirements` into your project's `REQUIREMENTS.md`, renumber each ID to fit your project's existing R### sequence, and preserve the `Axis: N` tag in the Notes field. The starter IDs (R001-R011) here are placeholders; your project owns the real numbering. The Class, Description, and Notes shape is lifted directly from the canonical requirements template, so the blocks paste without reformatting.

Each starter R### must satisfy the strict bidirectional coverage rule per AGENTS.md: every axis maps to an Active R### (or is marked out-of-scope with a reason), and every R### this skill suggests maps to at least one axis via the `Axis: N` tag. The Coverage Table at the bottom of this file is the quick-reference for axis coverage; AGENTS.md is the authoritative rule statement, and the skill stays harness-agnostic by referencing it by role rather than redeclaring it. This file is reference content, not an authoring path.

## Starter Requirements

### R001 — CLI ships `examples <command>` and `schema <resource>` sub-commands
- Class: core-capability
- Status: active
- Description: The CLI exposes an `examples <command>` sub-command that prints runnable JSON payloads for every command, and a `schema <resource>` sub-command that prints the JSON schema for every resource. Both sub-commands emit JSON to stdout by default and require no external documentation lookup.
- Why it matters: Agents cannot reliably drive a CLI they cannot introspect. Self-documenting sub-commands let an agent discover the full request/response surface without leaving the shell.
- Source: this-skill
- Primary owning slice: `<user-fills-in>`
- Supporting slices: none
- Validation: unmapped
- Notes: Axis: 1 (covers axis 1 — discoverability). The `examples` and `schema` sub-commands must stay in lockstep with the actual command surface — examples that lie are worse than no examples (see pitfalls.md).

### R002 — CLI accepts `--input json` and stdin JSON payloads alongside flags
- Class: core-capability
- Status: active
- Description: Every command that takes structured input accepts the same payload via `--input '<json>'` or piped stdin (`echo '{...}' | cli cmd`), in addition to the human-facing flag form. The structured form uses the raw API payload shape — no bespoke agent-only flags.
- Why it matters: Agents generate JSON natively; flag composition requires string escaping that drifts across shells and harnesses. A single structured-input contract removes a whole class of invocation bugs.
- Source: this-skill
- Primary owning slice: `<user-fills-in>`
- Supporting slices: none
- Validation: unmapped
- Notes: Axis: 2 (covers axis 2 — invocation). The JSON schema for `--input` should be exported by the `schema` sub-command so agents can validate payloads before sending.

### R003 — CLI separates stdout/stderr and supports `--output json|ndjson|stdout` with TTY-aware defaults
- Class: core-capability
- Status: active
- Description: Data goes to stdout; diagnostics, progress, and human-readable messages go to stderr. The CLI supports `--output json|ndjson|stdout` and defaults based on `process.stdout.isTTY` (human format when TTY, JSON when piped), with an explicit `--output` flag override.
- Why it matters: Piping CLI output into another tool or agent must yield parseable JSON; mixing data and prose on stdout forces fragile text scraping. TTY-aware defaults keep humans happy without breaking agent pipelines.
- Source: this-skill
- Primary owning slice: `<user-fills-in>`
- Supporting slices: none
- Validation: unmapped
- Notes: Axis: 3 (covers axis 3 — I/O). The mode resolution must be observable (`cli mode` should print the resolved mode) so agents can reason about what they will receive without trial-and-error.

### R004 — CLI documents all persistent state and is idempotent across repeated invocations
- Class: operability
- Status: active
- Description: Every persistent artifact the CLI creates or mutates (cache directory, cloned templates, lock files, generated outputs) is documented and lives under an XDG-conformant path discovered via env-paths or equivalent. Repeated invocations with the same input converge to the same on-disk state — no duplicate side effects, no accumulating cache entries.
- Why it matters: Agents retry on transient failures. A CLI that creates a new clone on every run, or that accumulates cache entries without bound, turns retries into resource exhaustion. Explicit state boundaries make the CLI safe to invoke unattended.
- Source: this-skill
- Primary owning slice: `<user-fills-in>`
- Supporting slices: none
- Validation: unmapped
- Notes: Axis: 4 (covers axis 4 — state). Cache location, TTL, and invalidation policy belong in the command's `--help` text and in the `schema` output so agents can reason about freshness without reading source.

### R005 — All errors are typed classes with `{error, message, ...context}` JSON shape and a stable error code
- Class: failure-visibility
- Status: active
- Description: Every error the CLI can raise is an instance of a typed error class with: a stable string `code` (e.g., `VALIDATION_ERROR`), a human-readable `message`, optional typed `context` fields, and a `toJSON()` method that emits `{error, message, ...context}` to stderr. Errors never reach stdout.
- Why it matters: Agents parse errors programmatically. A stable `code` lets the agent branch its retry strategy; structured context lets it log the failure without grepping a free-text message. Free-text errors force fragile string matching that breaks on the next release.
- Source: this-skill
- Primary owning slice: `<user-fills-in>`
- Supporting slices: none
- Validation: unmapped
- Notes: Axis: 5 (covers axis 5 — errors). The gitignorer sample ships a concrete 4-class taxonomy in `src/schema/errors.ts` (`ValidationError`, `GitError`, `FsError`, `BusinessError`) — each with `code`, `exitCode`, and `toJSON()`. Lift that pattern verbatim.

### R006 — Exit codes form a stable taxonomy and are documented
- Class: failure-visibility
- Status: active
- Description: The CLI uses a small, documented exit-code taxonomy where each error class maps to a distinct code (suggested: 1=validation, 2=external-deps, 3=filesystem, 4=business). The mapping is exported by the `schema` sub-command and printed in `--help`. No command reuses a code for a different meaning across releases.
- Why it matters: Agents decide retry-vs-abandon based on exit code. A code that means "validation error" today and "network error" tomorrow silently breaks every downstream retry loop. Stable codes are the contract that lets an agent's error handling stay correct across releases.
- Source: this-skill
- Primary owning slice: `<user-fills-in>`
- Supporting slices: none
- Validation: unmapped
- Notes: Axis: 6 (covers axis 6 — exit codes). The gitignorer sample encodes the taxonomy as a `readonly exitCode` field on each error class in `src/schema/errors.ts` — the class identity and the exit code cannot drift apart.

### R007 — All mutating commands support `--dry-run`; same input produces same output across runs
- Class: quality-attribute
- Status: active
- Description: Every command that writes to disk, mutates state, or calls a remote API accepts a `--dry-run` flag. In dry-run mode the CLI prints the exact operations it would perform (paths written, HTTP calls made, commands invoked) and exits 0 without performing them. Outside dry-run, repeated invocations with identical input produce identical results.
- Why it matters: Agents must be able to preview the effect of a mutating call before committing to it. `--dry-run` is the contract that lets a planning loop propose, verify, then execute — and lets a verification loop confirm idempotency by running twice and diffing.
- Source: this-skill
- Primary owning slice: `<user-fills-in>`
- Supporting slices: none
- Validation: unmapped
- Notes: Axis: 7 (covers axis 7 — idempotency). Dry-run output should use the same JSON shape as live output so the agent can diff structurally rather than textually.

### R008 — CLI ships `examples <command>` with runnable JSON payloads for every command
- Class: operability
- Status: active
- Description: For every command the CLI exposes, `examples <command>` returns at least one JSON payload that can be piped directly back into the CLI via `--input` or stdin and run successfully end-to-end. Examples cover the happy path and at least one documented error case per command.
- Why it matters: An example that runs is worth ten that don't. Runnable examples double as smoke tests and as onboarding for agents encountering the CLI for the first time. Examples that lie (out-of-date flags, removed fields) silently corrupt agent output and erode trust in the introspection surface.
- Source: this-skill
- Primary owning slice: `<user-fills-in>`
- Supporting slices: none
- Validation: unmapped
- Notes: Axis: 8 (covers axis 8 — examples). Examples should be generated from the same schema the `schema` sub-command exports, so drift is structurally impossible. Coverage of at least one error case per command forces the error taxonomy to stay observable.

### R009 — CLI documents cache, side effects, and idempotency semantics in `--help`
- Class: operability
- Status: active
- Description: Each command's `--help` text explicitly lists: what persistent state the command reads or writes, what side effects it has on the filesystem or network, and whether it is idempotent. The same information is available in JSON form via `schema <command>`.
- Why it matters: Agents need to reason about the blast radius of a command before invoking it. Surfacing state semantics in the introspection surface (rather than only in prose docs) keeps the contract enforceable and reviewable.
- Source: this-skill
- Primary owning slice: `<user-fills-in>`
- Supporting slices: none
- Validation: unmapped
- Notes: Axis: 4 (covers axis 4 — state). This R### complements R004 by making the state contract observable per-command, not just at the CLI level.

## Out-of-Scope (Intentional Non-Goals)

### R010 — MCP server
- Class: anti-feature
- Status: out-of-scope
- Description: This skill does not require or recommend shipping a Model Context Protocol server alongside the CLI. Direct bash invocation of the CLI is sufficient for current agents and avoids a second surface to keep in sync.
- Why it matters: Adding an MCP server doubles the introspection surface (CLI + server) and doubles the cost of keeping examples, schemas, and error codes consistent. For v1, the CLI alone is the contract.
- Source: this-skill
- Primary owning slice: none
- Supporting slices: none
- Validation: n/a
- Notes: Out of scope for v1. Revisit if a meaningful agent population stops being able to drive a bash-spawned CLI.

### R011 — Multi-language samples beyond TypeScript/Node
- Class: anti-feature
- Status: out-of-scope
- Description: The shipped sample (`assets/samples/gitignorer/`) is TypeScript/Node only. Ports to Python, Go, Rust, or other languages are intentionally not provided by this skill.
- Why it matters: Maintaining one high-quality reference implementation is already a meaningful burden; N parallel ports would each lag behind the canonical pattern. Users who want a port can fork.
- Source: this-skill
- Primary owning slice: none
- Supporting slices: none
- Validation: n/a
- Notes: Out of scope for v1. The architectural pattern (typed errors, NDJSON formatter, dry-run gate) translates across languages without a sample per language.

### R012 — GUI/TUI beyond flag-driven interactive mode
- Class: anti-feature
- Status: out-of-scope
- Description: This skill does not cover GUI or full-screen TUI surfaces. Interactive prompts (when `--help` is invoked without a sub-command, or when a required flag is missing) are in scope; persistent interactive shells are not.
- Why it matters: Agents drive CLIs via stdin/stdout; an interactive shell breaks the structured-input contract. Keeping the surface flag-driven preserves the agent-first invariants.
- Source: this-skill
- Primary owning slice: none
- Supporting slices: none
- Validation: n/a
- Notes: Out of scope for v1. Prompts that fall back to flag defaults when stdin is not a TTY are fine and expected.

## Coverage Table

| Axis | Covered by Starter R### | Notes |
|---|---|---|
| Axis 1 (discoverability) | R001 | via `examples` and `schema` sub-commands |
| Axis 2 (invocation) | R002 | `--input json` + stdin JSON payload |
| Axis 3 (I/O) | R003 | stdout/stderr split, `--output json\|ndjson\|stdout`, TTY-aware defaults |
| Axis 4 (state) | R004, R009 | explicit state documentation; per-command state semantics in `--help` |
| Axis 5 (errors) | R005 | typed error classes with `{error, message, ...context}` JSON shape |
| Axis 6 (exit codes) | R006 | stable taxonomy (1/2/3/4) tied to error class identity |
| Axis 7 (idempotency) | R007 | `--dry-run` on every mutating command; same input → same output |
| Axis 8 (examples) | R008 | runnable JSON examples per command, including error cases |
