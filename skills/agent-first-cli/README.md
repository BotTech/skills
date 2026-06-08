# agent-first-cli

Design, validate, and verify agent-first command-line interfaces. The skill ships reference material for the research/planning phase (stack, features, architecture, pitfalls, requirements) and read-only checks for plan validation and build verification against the 8 agent-first axes. It contains no runtime code; it produces research artifacts and reports.

`SKILL.md` is the agent-facing entry point (frontmatter, routing table, success criteria). This README is the human-facing entry point for landing on the skill from a directory listing or GitHub.

## Sub-commands

Each sub-command loads exactly one reference file (progressive disclosure). Run `agent-first-cli <sub-command>` from the agent harness.

| Sub-command | Loads | When to invoke |
|---|---|---|
| `stack` | `references/stack.md` | Choosing the tech stack — language, framework, schema tools |
| `features` | `features` reference | Scoping the agent-first feature surface (`--output json`, `--dry-run`, etc.) |
| `architecture` | `references/architecture.md` | Designing module boundaries — commands, formatters, parsers, schemas |
| `pitfalls` | `references/pitfalls.md` | Assessing risks — streaming, pipes, exit-code drift, idempotency traps |
| `requirements` | `references/requirements.md` | Seeding R###s in the project's `REQUIREMENTS.md` with axis tags |
| `validate` | `references/validate.md` | Plan-mode — before execution, check axis coverage against PROJECT/REQUIREMENTS/ROADMAP/CONTEXT/PLAN |
| `verify` | `references/verify.md` | Implementation-mode — after execution, check the built CLI against the 8-axis rubric |

`references/eval.md` is the shared 8-axis rubric spine consumed by `validate` and `verify`, **and** the authoritative home of the strict bidirectional Axis ↔ R### coverage rule. It is **not** a sub-command.

The enforcement contract (strict bidirectional Axis ↔ R### coverage) is stated authoritatively in `references/eval.md`; `AGENTS.md` documents the setup branching contract and points back to eval.md for the coverage rule.

## Sample asset: gitignorer

The skill ships a reference TypeScript/Node CLI at `assets/samples/gitignorer/` as a git submodule. At time of writing the pinned commit is `fb4357f7`. The sample demonstrates all 8 agent-first axes; the `verify` sub-command can run against it to produce a passing report.

After cloning this repository, initialize the submodule:

```sh
git submodule update --init --recursive skills/agent-first-cli/assets/samples/gitignorer
```

This single command is the canonical install step when the skill is added standalone. The repo-root `README.md` may repeat it for top-level discoverability; the skill-local snippet here remains authoritative.

## Axis evidence (gitignorer)

The table below maps each of the 8 agent-first axes to concrete files in `assets/samples/gitignorer/`. Paths are resolved from the repository root. The `verify` sub-command consumes this mapping as direct evidence — every axis traces to a file an agent can open and read.

| Axis | What to look for | Evidence file(s) | Notes |
|---|---|---|---|
| Axis: 1 | Named commands wired into the program; `bin` field for install discovery | `skills/agent-first-cli/assets/samples/gitignorer/src/commands/examples.ts`, `skills/agent-first-cli/assets/samples/gitignorer/src/commands/schema.ts`, `skills/agent-first-cli/assets/samples/gitignorer/src/cli/program.ts` (addCommand calls), `skills/agent-first-cli/assets/samples/gitignorer/package.json` (`bin.gitignorer` → `./dist/bin.js`) | The `examples` and `schema` commands are wired into the command surface and resolve to named actions, but their action handlers currently emit a `Not yet implemented` info message rather than JSON payloads. Axis 1 is covered at the command-surface level (discoverability is real: `--help` shows both). Runtime payload emission for these two commands is a known follow-up, not a failure. |
| Axis: 2 | Stable flag grammar; stdin parser; typed input schema | `skills/agent-first-cli/assets/samples/gitignorer/src/cli/flags.ts` (`CommonFlags.input`, `applyCommonFlags`), `skills/agent-first-cli/assets/samples/gitignorer/src/parsers/stdin.ts` (`parseStdinJSON`), `skills/agent-first-cli/assets/samples/gitignorer/src/schema/input.ts` (`jsonInputSchema`) | Flags are declared once and applied consistently across sub-commands; the same JSON envelope schema is reused by stdin and `--input`. |
| Axis: 3 | Explicit output channel routing; mode resolver; per-format serializers | `skills/agent-first-cli/assets/samples/gitignorer/src/cli/program.ts` (`configureOutput`), `skills/agent-first-cli/assets/samples/gitignorer/src/cli/mode.ts` (`resolveMode`), `skills/agent-first-cli/assets/samples/gitignorer/src/formatters/json.ts`, `skills/agent-first-cli/assets/samples/gitignorer/src/formatters/ndjson.ts`, `skills/agent-first-cli/assets/samples/gitignorer/src/formatters/human.ts` | `configureOutput` separates stdout (data) from stderr (errors and help) per the architecture reference. |
| Axis: 4 | Externalized state locations; explicit cache root; pinned template source | `skills/agent-first-cli/assets/samples/gitignorer/src/services/cache.service.ts` (`envPaths`, `ensureCacheDir`), `skills/agent-first-cli/assets/samples/gitignorer/src/services/git.service.ts` (`TEMPLATE_REPO` constant) | All mutable state lives under the platform cache dir; no writes inside the working tree. The template repo URL is a single named constant, not a flag. |
| Axis: 5 | Typed error classes with `readonly exitCode` and structured `toJSON` | `skills/agent-first-cli/assets/samples/gitignorer/src/schema/errors.ts:16-103` (`ValidationError`, `GitError`, `FsError`, `BusinessError`) | Four classes, each with a stable `code` string, a `readonly exitCode`, and a `toJSON()` that the top-level handler can serialize. |
| Axis: 6 | Single top-level error handler dispatched by `instanceof`; `main().catch(...)` boundary | `skills/agent-first-cli/assets/samples/gitignorer/src/cli/error-handler.ts` (`handleTopLevelError` with `instanceof` dispatch), `skills/agent-first-cli/assets/samples/gitignorer/src/bin.ts` (`main().catch(handleTopLevelError)`) | Implementation uses exit codes 1/2/3/4 per `references/requirements.md` R006 (Validation/Git/Fs/Business). The POSIX-sympathetic 65/70/72/75 mapping described in `references/pitfalls.md` is aspirational for a future major version; the current codebase ships the 1–4 mapping, which is what `verify` checks. |
| Axis: 7 | `--dry-run` flag; live and dry-run formatters share shape; mkdir recursive; pull-before-clone | `skills/agent-first-cli/assets/samples/gitignorer/src/cli/flags.ts` (`dryRun` flag), `skills/agent-first-cli/assets/samples/gitignorer/src/formatters/dry-run.ts` (`formatDryRunJSON` — same envelope as live), `skills/agent-first-cli/assets/samples/gitignorer/src/services/cache.service.ts` (`fs.mkdir` recursive), `skills/agent-first-cli/assets/samples/gitignorer/src/services/git.service.ts` (`pullUpdates` before `cloneTemplates`) | Dry-run emits the same JSON shape as a live run, so callers can diff the payload before committing. `mkdir recursive` is idempotent; the cache dir is created on first use and reused. |
| Axis: 8 | Examples command surface; envelope schema suitable for example generation; unit tests showing input fixtures | `skills/agent-first-cli/assets/samples/gitignorer/src/commands/examples.ts`, `skills/agent-first-cli/assets/samples/gitignorer/src/schema/input.ts` (envelope schema examples would be generated from), `skills/agent-first-cli/assets/samples/gitignorer/tests/services/cache.service.test.ts` | The `examples` action handler is a stub (`Not yet implemented`) — same gap shape as Axis 1. The schema and tests still demonstrate the envelope a future implementation would emit. Axis 8 is covered at the schema-and-surface level; runtime example emission is the same follow-up. |

Axis numbering follows `references/eval.md`. Citations use the `Axis: N` form in structured tables and `Axis N` in prose, per the eval.md citation convention. Deep-link anchors (`#axis-N`) and `references/<file>.md#section` suffixes are intentionally avoided.

## Setup (opt-in, branching model)

Loading this skill writes nothing. The only path that writes is the explicit `agent-first-cli setup` sub-command. Setup writes re-invocation cues into **exactly one** target file, determined by a single harness probe. The branches are mutually exclusive — pick one, never both.

- **GSD branch** (`.gsd/PREFERENCES.md` exists at the project root OR `~/.gsd/PREFERENCES.md` exists): cues go into the discovered `.gsd/PREFERENCES.md` only. `AGENTS.md` is **not** touched.
- **Universal branch** (neither GSD preferences file exists): cues go into `AGENTS.md` at the project root only. `.gsd/` is **not** touched at all.

```sh
agent-first-cli setup           # apply cues to the single target chosen by the branch
agent-first-cli setup --force   # replace the existing marker block on the chosen target
```

See `references/setup.md` for the full branching algorithm, the snippets, and the regression history.

## What this skill does not do

- **It does not auto-initialize.** Loading the skill writes nothing. Setup is opt-in via the explicit `agent-first-cli setup` sub-command, and it writes to exactly one target determined by the branching model.
- **It does not write to both targets.** Setup is mutually exclusive: GSD projects get cues in `.gsd/PREFERENCES.md` only; non-GSD projects get cues in `AGENTS.md` only. Never both. If you feel an urge to write both, stop — you are about to violate the branching rule.
- **Its non-setup sub-commands are read-only.** `stack`, `features`, `architecture`, `pitfalls`, `requirements`, `validate`, `verify` write nothing, anywhere, ever. `validate` reads GSD artifacts; `verify` reads the built CLI; neither writes.
- It does not invoke harness-specific slash commands or tools outside setup's harness-detection probe. It is harness-agnostic.
- It does not ship runtime code. The gitignorer sample is an *asset* (a reference CLI to verify against), not a dependency of the skill itself.

For the strict coverage rule (every axis → R### or `out-of-scope`; every R### → axis or justification), see `references/eval.md` — the rule lives alongside the axes it operates over. For setup branching and the mutual-exclusion contract, see `AGENTS.md` and `references/setup.md`. For sub-command semantics and progressive-disclosure routing, see `SKILL.md`.
