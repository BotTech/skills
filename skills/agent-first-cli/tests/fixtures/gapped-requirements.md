---
id: gapped-requirements-fixture
title: Gapped Requirements Fixture
status: fixture-only
---

# Gapped Requirements (Fixture)

This is a test fixture consumed by `references/validate.md`'s worked example
and by `tests/fixtures/expected-validate-report.md`. It is **not** real
project content. The file deliberately leaves Axis 5 (Errors) UNCOVERED so
the validate procedure flags an `uncovered-axis` error. Axis 7
(Idempotency) and Axis 8 (Examples) are declared out-of-scope by the
Coverage Table at the bottom; those are not errors.

### R001 — Discoverable command surface

- Class: core-capability
- Status: active
- Description: The CLI enumerates every sub-command and flag through a single introspection call (`--help`) and emits machine-readable JSON schemas for each command's input and output.
- Why it matters: Agents cannot drive a CLI they cannot introspect from inside the shell without reading source.
- Source: design
- Primary owning slice: S01
- Supporting slices: S02
- Validation: `cli --help` exits 0; `cli --help --output json` returns `commands[]` and `flags[]`.
- Notes: Axis: 1. Maps to eval.md's Discoverability axis. Cite `cli --help --output json` and `cli schema <command>`.

### R002 — Structured invocation contract

- Class: core-capability
- Status: active
- Description: Every command that takes structured input accepts the same payload through `--input '<json>'` and through stdin, using the raw API payload shape (no agent-only flag mangling).
- Why it matters: Agents generate JSON natively; composing CLI flags from JSON reintroduces the shell-escaping problems structured I/O was meant to solve.
- Source: design
- Primary owning slice: S01
- Supporting slices: S02, S03
- Validation: `cli cmd --input '{...}'` and `echo '{...}' | cli cmd` succeed with identical results.
- Notes: Axis: 2. Maps to eval.md's Invocation axis. The Zod schema is shared between the JSON parser, the flag parser, and `schema <command>`.

### R003 — stdout/stderr separation

- Class: core-capability
- Status: active
- Description: stdout is reserved for the structured payload; stderr carries progress, warnings, and human-readable errors. A TTY-aware default selects human format vs. JSON based on whether a human or an agent is reading.
- Why it matters: Mixing data and diagnostics on stdout breaks downstream `jq` pipelines and forces agents to grep free text.
- Source: design
- Primary owning slice: S02
- Supporting slices: S01
- Validation: `cli cmd | jq .` succeeds; `cli cmd 2>/dev/null` yields pure JSON on stdout.
- Notes: Axis: 3. Maps to eval.md's I/O axis. Large or paginated result sets stream as NDJSON rather than buffering.

### R004 — Documented persistent state

- Class: quality-attribute
- Status: active
- Description: Every persistent artifact lives under an XDG-conformant path discovered via env-paths; `--help` and `schema <command>` name the paths read, paths written, and side effects.
- Why it matters: Agents retry on transient failures; a CLI that creates fresh clones or accumulates cache entries without bound turns retries into resource exhaustion.
- Source: design
- Primary owning slice: S02
- Supporting slices: S03
- Validation: `cli schema <command>` includes `state.reads[]`, `state.writes[]`, and `state.cache: {root, ttl}`.
- Notes: Axis: 4. Maps to eval.md's State axis. A `--no-cache` flag lets an agent force a fresh fetch for one invocation.

### R005 — Stable exit-code taxonomy

- Class: quality-attribute
- Status: active
- Description: A small, documented exit-code taxonomy (e.g., 1=validation, 2=external-deps, 3=filesystem, 4=business) tied structurally to error-class identity via a `readonly exitCode` field on each typed error class.
- Why it matters: Exit codes are the coarsest signal an agent has about whether to retry, abandon, or surface to the user; drift between class identity and exit code breaks retry logic.
- Source: design
- Primary owning slice: S03
- Supporting slices: S02
- Validation: `cli --bad-flag; echo $?` produces the documented validation exit code; `cli --help` lists each code and its meaning.
- Notes: Axis: 6. Maps to eval.md's Exit Codes axis. A single top-level error handler dispatches `process.exit(err.exitCode)`.

## Coverage Table

| Axis | Name | Status | Source R### | Notes |
|------|------|--------|-------------|-------|
| 1 | Discoverability | Covered | R001 | — |
| 2 | Invocation | Covered | R002 | — |
| 3 | I/O | Covered | R003 | — |
| 4 | State | Covered | R004 | — |
| 5 | Errors | UNCOVERED (deliberate gap — test fixture) | — | uncovered-axis (deliberate; this is what validate must flag as an error) |
| 6 | Exit Codes | Covered | R005 | — |
| 7 | Idempotency | Out of scope (test fixture) | — | Out of scope for the fixture; a real skill would carry an Axis: 7 R### here. |
| 8 | Examples | Out of scope (test fixture) | — | Out of scope for the fixture; a real skill would carry an Axis: 8 R### here. |
