# Verify — Implementation-Mode Coverage Check

This is the implementation-mode checker spec for the agent-first-cli skill. An agent (human or LLM) reads this file, then runs the procedure against a built CLI — its source tree, test output, `--help` output, and `examples`/`schema` sub-command output — after the CLI has been built or after a sample build is available. The checker gathers concrete per-axis evidence and surfaces axes with no implementation. It does not write anywhere (R011): no writes under the CLI's project directory, no writes under any `.gsd/` directory, no writes anywhere else. The procedure is harness-agnostic: no slash commands, no tool calls, no database reads, no imperative `.gsd/` write instructions. Where this file references the strict bidirectional coverage rule, it points at `AGENTS.md` by name rather than re-quoting the rule body.

## Inputs

- **Required:** the built CLI under test — its source tree, tests, and runtime output. Concretely: the CLI's root directory (containing `src/`, `tests/`, `package.json` or equivalent), a built binary or a runnable entry point (e.g., `node --tsr`/`tsx` from source), the `--help` output, and the output of the `schema <resource>` and `examples <command>` sub-commands.
- **Optional, informational only:** the project's `REQUIREMENTS.md`. Used to cross-reference R### IDs in the report's per-axis detail; not required to compute the verdict.
- **Note on the gitignorer sample.** When the checker is run against the gitignorer sample shipped by this skill, the inputs come from `assets/samples/gitignorer/`. The worked example at the end of this file references that path.

## Strict Rule

This checker enforces the strict bidirectional coverage rule defined in `AGENTS.md`: every axis maps to an Active R### (or is marked out-of-scope with a reason), and every R### this skill suggests maps to at least one axis. An uncovered axis or orphan R### is an error, not a warning.

In impl-mode, an axis is covered only when concrete implementation evidence is cited; planning-level coverage from `validate.md` does not transfer. An axis that validate.md marked Covered because an R### carries `Axis: N` in its Notes remains UNCOVERED here until that R### is backed by a file:line citation showing the implemented behavior.

The authoritative rule statement and the axis list are not duplicated here. The axes live in `references/eval.md` (canonical 8-axis list); the rule lives in `AGENTS.md`.

## Evidence Convention

Every claim of coverage in the report must be backed by a concrete citation: a file path relative to the CLI under test root, a line range, and a one-sentence justification. The recommended exact shape:

```
evidence: src/schema/errors.ts:14-22 (defines ValidationError, GitError, FsError, BusinessError with readonly code + exitCode + toJSON)
```

That is, `evidence: <relative-path>:<line-range> (<short justification>)`. The path is relative to the CLI under test root (e.g., `src/...`, `tests/...`). A citation that names a file but no line range is acceptable only when the justification clearly refers to the file as a whole (e.g., a one-file module); when in doubt, cite a range. A citation that names a line range but no justification is never acceptable.

When the cited evidence is itself produced by the CLI at runtime (e.g., `--help` output, `schema <command>` JSON), cite the command and a short snippet rather than a file path: `evidence: cli --help (lists sub-commands: generate, schema, examples, mode; exit 0)`. The same `<command> (<justification>)` shape applies.

## Per-Axis Procedure

One subsection per axis, in canonical order. Each subsection references the per-axis "Common evidence" list in `eval.md` as the rubric; the procedure here tells the agent how to find that evidence in the CLI under test.

### Axis 1: Discoverability

**Procedure**

1. Run `cli --help` from the CLI under test root. Confirm exit code 0 and capture the list of sub-commands.
2. Run `cli --help --output json` (or the CLI's documented machine-readable variant). Confirm a JSON object with `commands[]` and `flags[]` arrays.
3. Run `cli schema <resource>` for at least the resources named in `--help`. Confirm each emits a JSON Schema document.
4. Run `cli examples <command>` for at least one command. Confirm at least one runnable JSON payload is emitted per command.
5. Match each finding against the per-axis Common evidence bullets in `eval.md`.

**Pass criteria.** Axis 1 is covered iff at least one concrete file:line evidence citation matches the per-axis criteria in `eval.md`.

### Axis 2: Invocation

**Procedure**

1. Identify the Zod (or equivalent) input schema module for at least one command (commonly `src/schema/inputs.ts` or similar).
2. Run `cli <cmd> --input '<json>'` and `echo '<json>' | cli <cmd>` with the same payload. Confirm identical results.
3. Run `cli schema <command>`. Confirm the exported schema matches the runtime Zod schema by comparing field names and types.
4. Check that `examples <command>` payloads round-trip through both `--input` and stdin.
5. Match each finding against the per-axis Common evidence bullets in `eval.md`.

**Pass criteria.** Axis 2 is covered iff at least one concrete file:line evidence citation matches the per-axis criteria in `eval.md`.

### Axis 3: I/O

**Procedure**

1. Run `cli <cmd> | jq .` against a command that emits structured output. Confirm `jq` parses it without errors.
2. Run `cli <cmd> 2>/dev/null`. Confirm stdout contains pure JSON (or pure text in stdout mode).
3. Run `cli <cmd> --output ndjson | head -n 1` against a streaming-friendly command. Confirm a single complete JSON object.
4. Locate the output layer source file (commonly `src/cli/output.ts`). Confirm it is a single component rather than scattered `console.log` calls.
5. Match each finding against the per-axis Common evidence bullets in `eval.md`.

**Pass criteria.** Axis 3 is covered iff at least one concrete file:line evidence citation matches the per-axis criteria in `eval.md`.

### Axis 4: State

**Procedure**

1. Run `cli schema <command>` for a stateful command. Confirm the output includes `state.reads[]`, `state.writes[]`, and `state.cache` fields (or documented equivalents).
2. Run the same command twice with identical input. Confirm the second run is a no-op on disk (no new files, no duplicate cache entries).
3. Resolve the cache root via env-paths (or equivalent). Confirm it points at `$XDG_CACHE_HOME/<cli>/` (or platform equivalent), not an undocumented home-directory path.
4. Run `cli <cmd> --no-cache`. Confirm the cache is bypassed for that invocation and the result is still correct.
5. Match each finding against the per-axis Common evidence bullets in `eval.md`.

**Pass criteria.** Axis 4 is covered iff at least one concrete file:line evidence citation matches the per-axis criteria in `eval.md`.

### Axis 5: Errors

**Procedure**

1. Locate the error taxonomy source file (commonly `src/schema/errors.ts`). Confirm a small set of typed error classes.
2. For each error class, confirm `readonly code: string`, `readonly exitCode: number`, and `toJSON(): {error, message, ...context}`.
3. Run a command with an invalid `--input` payload. Capture stderr with `cli <cmd> 2>&1 1>/dev/null` and confirm structured JSON on stderr, nothing on stdout.
4. Run `cli schema <command>`. Confirm the output includes an `errors[]` table for the command.
5. Match each finding against the per-axis Common evidence bullets in `eval.md`.

**Pass criteria.** Axis 5 is covered iff at least one concrete file:line evidence citation matches the per-axis criteria in `eval.md`.

### Axis 6: Exit Codes

**Procedure**

1. Run `cli --help`. Confirm an "Exit codes" section listing each code and its meaning.
2. Run `cli schema <command>`. Confirm the output includes `exitCodes: [{code, label, meaning}]` (or documented equivalent).
3. Inspect the error module (e.g., `src/schema/errors.ts`). Confirm `readonly exitCode` is encoded on each error class.
4. Run `cli <cmd> --bad-flag; echo $?`. Confirm the documented validation exit code, not a generic 1.
5. Match each finding against the per-axis Common evidence bullets in `eval.md`.

**Pass criteria.** Axis 6 is covered iff at least one concrete file:line evidence citation matches the per-axis criteria in `eval.md`.

### Axis 7: Idempotency

**Procedure**

1. Run `cli <mutating-cmd> --dry-run`. Confirm exit 0 and JSON output describing planned operations.
2. Run the same mutating command twice without `--dry-run`. Confirm the on-disk state is identical after both runs.
3. Locate the mutating write path (commonly `src/services/...`). Confirm it writes to a temp file and renames atomically, rather than writing directly.
4. Run `cli schema <command>` for the mutating command. Confirm the output includes `mutations[]` listing every side effect.
5. Match each finding against the per-axis Common evidence bullets in `eval.md`.

**Pass criteria.** Axis 7 is covered iff at least one concrete file:line evidence citation matches the per-axis criteria in `eval.md`.

### Axis 8: Examples

**Procedure**

1. Run `cli examples <command> | cli <command>` for at least one command. Confirm the pipe succeeds end-to-end.
2. Inspect the output of `cli examples <command>`. Confirm at least one entry includes `{expectedError: "..."}` so failure cases stay observable.
3. Locate the example generator source (commonly `src/cli/commands/examples.ts`). Confirm it is fixture-driven and that the same fixtures drive CI tests.
4. Diff `examples <command>` against `schema <command>` for the same command. Confirm field names, enum values, and required-vs-optional status agree.
5. Match each finding against the per-axis Common evidence bullets in `eval.md`.

**Pass criteria.** Axis 8 is covered iff at least one concrete file:line evidence citation matches the per-axis criteria in `eval.md`.

## Report Format

The report is a single Markdown document. Same hybrid shape as `validate.md` (mirrored intentionally for agent-recognition): machine-parseable YAML frontmatter for tooling, human-readable Markdown body for review.

```yaml
---
id: verify-<timestamp>
verdict: pass | fail
error_count: <int>
warning_count: <int>
verified_at: <ISO-8601>
---
```

### Verdict

One short paragraph stating `pass` or `fail`. On `fail`, name the error kinds (e.g., "failed with 2 uncovered-axis-impl errors on Axis 5 and Axis 6").

### Axis Coverage Audit

An 8-row table — one row per axis in the canonical list. Columns:

| Axis | Name | Status | Evidence Citation | Notes |
|------|------|--------|-------------------|-------|
| 1 | Discoverability | Covered | `cli --help` (lists sub-commands; exit 0) | — |
| 5 | Errors | UNCOVERED | — | uncovered-axis-impl |

`Status` is one of `Covered`, `UNCOVERED`. `Evidence Citation` lists the file:line (or `<command>)`) citations that back coverage; for UNCOVERED rows the cell is `—`. The `Notes` column carries short clarifications and error/warning IDs.

### Per-Axis Detail

One `### Axis N: <Name>` subsection per axis, in canonical order. Each subsection contains:

- **Status:** Covered | UNCOVERED.
- **Evidence:** a list of `evidence: <path>:<lines> (<justification>)` citations, or `UNCOVERED — no evidence found matching per-axis criteria in eval.md`.
- **Errors:** list of `{kind, detail}` for this axis, or `none`.
- **Warnings:** list of `{kind, detail}` for this axis, or `none`.

## Worked Example: gitignorer sample

The gitignorer sample ships under `assets/samples/gitignorer/`. The paths below are file-path prose references drawn from the research notes and from `references/eval.md` (which cites the same files). The executor does not need the submodule checked out to write this section; S05 owns the actual file-existence verification against this list.

For each axis, one concrete file path in the sample demonstrates coverage:

- **Axis 1: Discoverability** — `assets/samples/gitignorer/src/cli/commands/examples.ts` (the `examples generate` sub-command is implemented and enumerable via `--help`).
- **Axis 2: Invocation** — `assets/samples/gitignorer/src/schema/inputs.ts` (the Zod input schema shared between the JSON parser, the flag parser, and the `schema <command>` output).
- **Axis 3: I/O** — `assets/samples/gitignorer/src/cli/output.ts` (a single output layer component rather than scattered `console.log` calls; TTY-aware mode resolution).
- **Axis 4: State** — `assets/samples/gitignorer/src/services/template-service.ts` (smart-merge logic that turns repeated invocations with identical input into a no-op on the second run).
- **Axis 5: Errors** — `assets/samples/gitignorer/src/schema/errors.ts` (the four typed error classes `ValidationError`, `GitError`, `FsError`, `BusinessError`, each with `readonly code`, `readonly exitCode`, and `toJSON()`).
- **Axis 6: Exit Codes** — `assets/samples/gitignorer/src/schema/errors.ts` (the same module encodes `readonly exitCode` on each class, so error-class identity and exit code cannot drift apart).
- **Axis 7: Idempotency** — `assets/samples/gitignorer/src/services/template-service.ts` (the cache write path uses `fs.rename` over a temp file rather than `fs.writeFile` directly, so an interrupted run cannot leave a half-written artifact).
- **Axis 8: Examples** — `assets/samples/gitignorer/src/cli/commands/examples.ts` (fixture-driven example generator whose fixtures also drive CI tests, so example payloads cannot drift from the schema).

Against a fully built gitignorer sample, the verify report's verdict would be `pass`, the Axis Coverage Audit would list one Covered row per axis with the citation above, and the Per-Axis Detail subsections would each contain the citation in `Evidence:` form.

## Error Catalog

One error kind and one warning kind:

- `uncovered-axis-impl` — **error.** No concrete implementation evidence cited for this axis. Reported in the Axis Coverage Audit and the Per-Axis Detail subsection for the affected axis. The verdict moves from `pass` to `fail`.
- `low-confidence-evidence` — **warning.** The cited file:line (or command) is present but the evidence is speculative — for example, the cited file exists but the cited line range does not actually contain the claimed behavior, or the cited command was not actually run during the verify pass. Reported in the Per-Axis Detail subsection for the affected axis. Does not affect the verdict.

This file is reference content, not an executable. It writes nothing under any project's `.gsd/` directory and is harness-agnostic: no slash commands, no tool calls, no database reads.
