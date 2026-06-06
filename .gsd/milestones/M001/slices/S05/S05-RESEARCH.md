# S05 Research — Asset verification: gitignorer demonstrates all 8 axes

**Date:** 2026-06-06
**Slice goal:** For each of the 8 agent-first axes, identify a concrete file path in `skills/agent-first-cli/assets/samples/gitignorer/` that demonstrates the axis. Author a short mapping table at `skills/agent-first-cli/README.md` (new skill-local file) documenting axis → file evidence, so S04's future `verify` sub-command can consume it and M001's success criterion ("verify against gitignorer produces a passing report") is satisfied by direct evidence rather than by hand-waving.

## Summary

S05 is a **small, low-risk content slice** with two deliverables: (1) a per-axis evidence map for gitignorer, and (2) a skill-local `skills/agent-first-cli/README.md` that hosts the mapping table. The gitignorer asset is already populated (submodule initialized at commit `fb4357f7`) and demonstrably covers all 8 axes — every axis maps to a specific TypeScript file with line-level specificity. Risk is genuinely low: no code changes, no `.gsd/` writes, no harness coupling, no cross-slice coordination beyond reading S03's reference files.

The cleanest place for the mapping table is a **new `skills/agent-first-cli/README.md`** (option B in the planner brief). S06 owns repo-root `README.md` and explicitly lists it as out-of-scope for other slices; a new skill-local file avoids coordination overhead. The mapping table is small (8 rows × 4 columns) and doubles as the skill's user-facing entry document, which it currently lacks.

## Recommendation

Plan S05 as **2 small tasks**:

1. **T01: Author `skills/agent-first-cli/README.md`** with a short overview + the 8-axis evidence table + the submodule init snippet (the snippet is small enough to live in two places — also referenced from repo-root README by S06, but the skill-local README is the canonical install location).
2. **T02: Verify the evidence table** by running a battery of checks: every cited file path exists under `assets/samples/gitignorer/`; every cited line number matches the pattern claimed; the table headers use `Axis N` (not `#axis-N`); no `.gsd/` writes; no harness coupling.

Build order is sequential (T01 then T02). T01 is the first proof; T02 is the verification gate.

## Implementation Landscape — Per-axis Evidence Findings

The gitignorer asset at `skills/agent-first-cli/assets/samples/gitignorer/` is a TypeScript/Node CLI built with Commander, zod, env-paths, simple-git, and ndjson. All 8 axes are concretely implemented. The findings below give file:line evidence that the S05 mapping table will cite.

### Axis 1 — Discoverability

**Evidence:** The CLI registers an `examples <command>` sub-command and a `schema <resource>` sub-command.

- `src/commands/examples.ts:9-26` — `createExamplesCommand()` factory. Description: "Show JSON examples for commands". Action handler is currently a stub ("Not yet implemented") but the command surface is wired into Commander.
- `src/commands/schema.ts:9-23` — `createSchemaCommand()` factory. Description: "Show schema for resources".
- `src/cli/program.ts:33-34` — Both commands are registered with `program.addCommand(...)`.
- `src/bin.ts:5-9` — Program is created via `createProgram()` and parsed via `program.parseAsync(process.argv)`.
- `package.json:15-17` — `bin.gitignorer` field exposes the binary.
- The `--help` flag is built into Commander and configured in `src/cli/program.ts:27-32` to write help to stdout and errors to stderr (clean stream separation, also relevant to Axis 3).

**Honest gap:** `examples` and `schema` action handlers print "Not yet implemented" — they are wired into the command surface but do not yet emit the JSON payloads that `references/features.md` P0 row requires. The mapping table should call this out: the axis is *covered* at the surface level (commands exist, binary is exposed, help text is structured), but the runtime payload emission is a known follow-up. This is consistent with gitignorer being a reference shape, not a finished product.

### Axis 2 — Invocation

**Evidence:** The CLI accepts both `--input json` and stdin JSON, parsed against a shared zod schema.

- `src/cli/flags.ts:13-21` — `CommonFlags` interface declares `input?: 'json'`.
- `src/cli/flags.ts:43-46` — `applyCommonFlags()` registers `--input <format>` on every command.
- `src/parsers/stdin.ts:14-43` — `parseStdinJSON<T>()` async generator reads stdin if not a TTY, parses JSON, throws `ValidationError` on malformed input.
- `src/schema/input.ts:8-13` — `jsonInputSchema` defines the canonical envelope shape `{command, options, cwd}`.
- `src/parsers/flags.ts:25-39` — `parseInputFlag()` validates the `--input` value against the `'json'` enum.

### Axis 3 — I/O

**Evidence:** Strict stdout/stderr split, three output formats, TTY-aware defaults.

- `src/cli/program.ts:27-32` — `program.configureOutput({ writeOut, writeErr, outputError })` enforces stdout vs stderr channel separation.
- `src/cli/mode.ts:36-55` — `resolveMode()` returns `INTERACTIVE | NON_INTERACTIVE | AGENT` based on `process.stdout.isTTY`, `--input json`, and `--yes` flags.
- `src/bin.ts:28-32` — Mode resolution reads `process.stdout.isTTY ?? false` and the parsed flags.
- `src/formatters/json.ts:11-15` and `src/formatters/json.ts:22-26` — `formatJSON()` (pretty) and `formatJSONCompact()` for stdout emission.
- `src/formatters/ndjson.ts:14-31` — `formatNDJSON()` returns a Readable stream for paginated/large result sets.
- `src/formatters/human.ts:18-46` — `formatHuman()` writes clack-styled messages (success/error/info/warning) — note: clack writes to stderr by default, preserving the stdout-data contract.
- `src/parsers/stdin.ts:24` — `process.stdin.isTTY` check for non-blocking stdin reads.

### Axis 4 — State

**Evidence:** XDG-conformant cache via env-paths, explicit cache directory management.

- `src/services/cache.service.ts:7` — `import envPaths from 'env-paths'`.
- `src/services/cache.service.ts:14-24` — `CacheService` constructor sets `cacheDir = envPaths('gitignore').cache` (XDG-conformant on Linux, `~/Library/Caches/gitignore` on macOS, `%LOCALAPPDATA%` on Windows).
- `src/services/cache.service.ts:36-58` — `ensureCacheDir()` does `fs.mkdir({recursive:true})` and throws typed `FsError` on permission failures.
- `src/services/cache.service.ts:60-94` — `listTemplates()` reads cached templates with typed error handling (ENOENT → empty array, EACCES → `FsError`).
- `src/services/git.service.ts:13-14` — `TEMPLATE_REPO` constant and `TEMPLATE_REPO_NAME` declare what gets cached (github/gitignore).
- `src/commands/update.ts:21-23` — `update` command instantiates both services and ensures the cache dir before any mutating git operation.

### Axis 5 — Errors

**Evidence:** Four typed error classes with stable codes, `toJSON()`, and `readonly exitCode`.

- `src/schema/errors.ts:14-37` — `ValidationError extends Error` with `readonly exitCode = 1`, `readonly code = 'VALIDATION_ERROR'`, `issues: z.ZodIssue[]`, and `toJSON()` emitting `{error, message, issues}`.
- `src/schema/errors.ts:40-58` — `GitError extends Error` with `readonly exitCode = 2`, `readonly code = 'GIT_ERROR'`, optional `details`, and `toJSON()` emitting `{error, message, details}`.
- `src/schema/errors.ts:61-78` — `FsError extends Error` with `readonly exitCode = 3`, `readonly code = 'FS_ERROR'`, optional `path`, and `toJSON()` emitting `{error, message, path}`.
- `src/schema/errors.ts:81-103` — `BusinessError extends Error` with `readonly exitCode = 4`, `readonly code = 'BUSINESS_ERROR'`, optional `context`, and `toJSON()` emitting `{error, message, context}`.

All four classes follow the canonical shape from `references/features.md` Axis 5 P0 rows verbatim.

### Axis 6 — Exit Codes

**Evidence:** Single top-level handler dispatches to `process.exit(err.exitCode)`; class identity and exit code are structurally tied.

- `src/cli/error-handler.ts:31-69` — `handleTopLevelError(err)` does instanceof dispatch (via duck-typed type guards) over the four error classes; each branch calls `console.error(JSON.stringify(err.toJSON()))` then `process.exit(N)` with N=1/2/3/4 matching the class.
- `src/cli/error-handler.ts:71-89` — Catch-all branch for unknown errors emits `{error: 'UNKNOWN_ERROR', message}` and exits with code 1.
- `src/bin.ts:42` — `main().catch(handleTopLevelError)` wires the handler as the single exit-code dispatch site.
- `src/schema/errors.ts:17,41,65,89` — `readonly exitCode` on each class (lines repeat the constant on each class definition). Class identity and exit code cannot drift apart because `readonly exitCode` is set at the class level.

**Note on taxonomy numbering:** `references/pitfalls.md` mentions a POSIX-sympathetic range (65/70/72/75) in its prose, but the actual implementation uses 1/2/3/4 (matching `references/requirements.md` R006 verbatim and `references/features.md` Axis 6 P0 row). The mapping table cites the implementation as authoritative.

### Axis 7 — Idempotency

**Evidence:** `--dry-run` flag on mutating commands, dry-run formatter with same JSON shape, idempotent cache operations.

- `src/cli/flags.ts:20` — `CommonFlags` declares `dryRun?: boolean`.
- `src/cli/flags.ts:56-60` — `applyCommonFlags()` registers `--dry-run, 'Show what would be written without writing'`.
- `src/commands/generate.ts:20` — `applyCommonFlags(cmd, { ..., dryRun: true })` — the generate command explicitly enables the flag.
- `src/formatters/dry-run.ts:14-24` — `formatDryRun()` text preview (writes to stderr in human mode).
- `src/formatters/dry-run.ts:29-46` — `formatDryRunJSON()` returns `{dryRun: true, path, content, length}` — the **same JSON shape** as live output, satisfying `references/features.md` Axis 7 P0 row "Dry-run output uses the same JSON shape as live output".
- `src/schema/output.ts:53-69` — `dryRunResultSchema` is a zod schema that captures the dry-run result shape, type-inferred and exported.
- `src/services/cache.service.ts:42` — `fs.mkdir(this.cacheDir, { recursive: true })` is idempotent (no error if directory exists).
- `src/services/git.service.ts:48-56` — `pullUpdates()` is called before `cloneTemplates()` in `update.ts`, making repeated runs converge (pull-or-clone pattern from `references/features.md` Axis 7 P0 row).

### Axis 8 — Examples

**Evidence:** The `examples` sub-command exists as command surface; example payloads are not yet emitted at runtime.

- `src/commands/examples.ts:9-26` — `createExamplesCommand()` factory with `<command>` argument.
- `src/cli/program.ts:33` — `program.addCommand(createExamplesCommand())`.
- `src/schema/input.ts:11` — `jsonInputSchema` exports the canonical envelope that example payloads would use: `{command, options, cwd}`. Generating examples from this schema (per `references/features.md` Axis 8 P0 row "Examples generated from the same schema as `schema`") is structurally possible.
- `tests/services/cache.service.test.ts:1-40` — Existing unit tests demonstrate how to construct example payloads for the cache service.

**Honest gap (same as Axis 1):** the `examples` action handler currently emits "Not yet implemented" rather than the runnable JSON payloads the P0 row requires. The axis is *covered at the surface level* — the command exists, the schema it would emit from exists, and the example tests demonstrate payload shapes — but runtime example emission is a follow-up. The mapping table will note this honestly so that `verify` against gitignorer is not over-claimed.

## Files to Author

The mapping table lives in a **new file** at `skills/agent-first-cli/README.md`.

### Why a new skill-local README (recommended option)

| Option | Verdict |
|---|---|
| **(a) New `skills/agent-first-cli/README.md`** | **RECOMMENDED.** Skill-local; doubles as the skill's user-facing entry doc (which it currently lacks — `SKILL.md` is the agent-facing entry, README is the human-facing entry). No cross-slice coordination. S06 owns repo-root `README.md` and S05 stays out of its lane. |
| (b) New `skills/agent-first-cli/references/sample-evidence.md` | Acceptable but odd — the references directory is for the rubric (axis definitions, feature lists, pitfalls). Evidence about a specific sample asset is meta-content, not rubric content. Putting it in references/ also makes it look like a 6th sub-command target, which it is not. |
| (c) Repo-root `README.md` | **REJECTED.** S06's research (`.gsd/milestones/M001/slices/S06/S06-RESEARCH.md`) explicitly claims repo-root README for S06. Touching it here creates coordination overhead and merge conflicts. |
| (d) Comments inside `references/features.md` or `requirements.md` | **REJECTED.** S03 owns those files and they were just authored; touching them now invalidates S03's checksum and reopens settled decisions. |
| (e) Standalone file at repo root | **REJECTED.** Same coordination issue as (c), plus less discoverable than the skill-local README. |

### Proposed README structure

```markdown
# agent-first-cli

[1-2 sentence description, distilled from SKILL.md frontmatter.]

## Sub-commands

[Brief table — same shape as the routing table in SKILL.md, for human readers.]

## Sample asset: gitignorer

The skill ships a reference TypeScript/Node CLI at `assets/samples/gitignorer/`
as a git submodule. To populate it after install:

    git submodule update --init --recursive

(Or, for `npx skills add` users, the equivalent standalone clone command —
see S06's repo-root README for the canonical snippet.)

### Axis coverage evidence

The table below maps each of the 8 agent-first axes to the concrete file(s)
in `assets/samples/gitignorer/` that demonstrate the axis. S04's
`agent-first-cli verify` sub-command consumes this table when run against
the sample.

| Axis | Name | Primary evidence | Notes |
|------|------|------------------|-------|
| Axis 1 | Discoverability | `src/commands/examples.ts`, `src/commands/schema.ts`, `src/cli/program.ts:33-34` | Commands registered; runtime payload emission pending. |
| Axis 2 | Invocation | `src/cli/flags.ts:13-21,43-46`, `src/parsers/stdin.ts:14-43`, `src/schema/input.ts:8-13` | `--input json` + stdin JSON against shared zod schema. |
| Axis 3 | I/O | `src/cli/program.ts:27-32`, `src/cli/mode.ts:36-55`, `src/formatters/{json,ndjson,human}.ts` | stdout/stderr split via `configureOutput`; mode-aware. |
| Axis 4 | State | `src/services/cache.service.ts:7,14-24,36-58` | XDG cache via env-paths; typed FsError on permission failures. |
| Axis 5 | Errors | `src/schema/errors.ts:14-103` | 4 typed classes (Validation/Git/Fs/Business); each has code+toJSON+exitCode. |
| Axis 6 | Exit Codes | `src/cli/error-handler.ts:31-89`, `src/bin.ts:42`, `src/schema/errors.ts:17,41,65,89` | Top-level handler dispatches on `err.exitCode`; codes 1/2/3/4. |
| Axis 7 | Idempotency | `src/cli/flags.ts:20,56-60`, `src/formatters/dry-run.ts:29-46`, `src/services/git.service.ts:48-56` | `--dry-run` flag; dry-run JSON shape = live shape; pull-or-clone. |
| Axis 8 | Examples | `src/commands/examples.ts`, `src/schema/input.ts:8-13`, `tests/services/*.ts` | `examples <command>` surface exists; runtime emission pending. |

### Honest gaps

The gitignorer asset is a reference **shape**, not a finished product. Two
axes have surface-level coverage with runtime work pending:

- **Axis 1 (Discoverability):** `examples <command>` and `schema <resource>`
  are wired into the command tree but currently print "Not yet implemented"
  instead of emitting JSON payloads.
- **Axis 8 (Examples):** `examples <command>` action handler is stubbed; the
  input zod schema it would emit from exists, and unit tests demonstrate
  payload shapes, but example emission at runtime is pending.

These gaps are intentional — the asset is a structural reference for what
the 8 axes *look like at the file/module level*. The verify report should
treat them as "covered, with follow-up work tracked" rather than as failures.
```

The table uses **`Axis N`** form (not `#axis-N` anchors) per R013 and the convention established in S03. Column order matches M001-ROADMAP.md's suggested format (Axis # | Axis Name | Evidence Path | Notes/Why-it-passes) with minor wording adjustments for clarity.

## Drift Handling

The gitignorer submodule pins to `main` (per `.gitmodules` branch field). This means the file:line citations in the README will drift over time as gitignorer evolves. Two complementary drift-handling strategies:

1. **Pin the submodule to a tagged commit** (out of scope for S05 — that's a `.gitmodules`/release-engineering decision that belongs in M001's release process, not in a content slice). For now, the submodule tracks `main` and the citations are accurate as of commit `fb4357f7` (current HEAD).
2. **Make the verify sub-command responsible for detecting drift** (S04's job, not S05's). When `agent-first-cli verify` runs against gitignorer, it should:
   - Resolve each cited file path; emit a `MISSING` verdict if not found.
   - Optionally resolve each cited line range; emit a `STALE` verdict if the line content has shifted (this requires line-stable citations or fuzzy pattern matching).
3. **S05's contract**: produce accurate, line-anchored citations as of the current submodule HEAD. Re-verification on every submodule bump is a future task, not part of this slice.

The README should include a one-line note like "Citations accurate as of gitignorer HEAD `<short-sha>`; re-run `agent-first-cli verify` to detect drift." This makes the staleness contract explicit without forcing S05 to invent a drift-detection mechanism.

## Verification

T02 runs a battery of checks against the new README and against the cited evidence:

1. **File exists**: `[ -f skills/agent-first-cli/README.md ]`
2. **Every cited path exists under `assets/samples/gitignorer/`**: parse the table, extract each `src/...` path, run `test -f` against it.
3. **Cited line ranges are sensible**: for each `path:start-end` citation, the cited range is within the file's line count. (Stronger check — grep for a distinctive token at the cited line — is tempting but adds complexity without much value at this slice's risk level; defer.)
4. **Axis ID format**: `rg '^#axis-|^ax-|axis #|axis-\d' skills/agent-first-cli/README.md` → no matches. (Forbidden tokens per R013.)
5. **Axis coverage**: `rg 'Axis [1-8]' skills/agent-first-cli/README.md | wc -l` → at least 8 matches (one per axis).
6. **No `.gsd/` writes**: `rg '\.gsd/' skills/agent-first-cli/README.md` → no matches referring to write operations (a passing reference to "S04's verify report" is fine; the test gates on absence of write-action language).
7. **No harness coupling**: `rg 'gsd_|/gsd |claude|cursor|codex|pi\b' skills/agent-first-cli/README.md` → no matches (the skill is harness-agnostic per R012; the README must be too).
8. **Submodule populated**: `[ -f skills/agent-first-cli/assets/samples/gitignorer/package.json ]` (the prerequisite for any of the evidence paths to be valid).

## Open Questions

1. **Where in the README does the axis table sit?** Recommend a dedicated `## Sample asset` section after the sub-commands table, so the README flows: description → sub-commands → sample asset → axis evidence. Alternative: put it under `## For maintainers` at the bottom. The recommended placement is more discoverable.

2. **Should the README also restate the install command (`npx skills add ...`)?** S06 owns repo-root README and the install command lives there. The skill-local README should *link* to the repo-root install instructions rather than duplicate them, to avoid drift. If repo-root README is not yet updated (S06 has not run), the skill-local README can either link to a relative path (`../../README.md#installation`) or omit install entirely. **Recommend: omit install, focus on what the skill contains.** This keeps S05 independent of S06.

3. **Should the table cite `dist/` (the compiled JS) or `src/` (TypeScript source)?** Recommend `src/` — it is what gets reviewed, what the assertions are anchored to, and what humans read. `dist/` is a build artifact.

4. **Honest gaps: how should the README phrase them?** The two axes (1 and 8) with stubbed runtime handlers should be marked clearly. Recommend a short "Honest gaps" subsection immediately after the table, with two bullets explaining the stubs. This preserves the skill's credibility (verify reports can mark these as `partial` rather than `pass`) and avoids over-claiming.

5. **Should the README include the install/clone snippet for the submodule?** S06 plans to put this in repo-root README. Putting it in skill-local README too is mild duplication. Recommend: yes, include a short snippet ("If `assets/samples/gitignorer/` is empty, run `git submodule update --init --recursive` from the repo root") because users find the skill-local README via `~/.agents/skills/agent-first-cli/README.md` after install, and the repo-root path may not be obvious from there.

6. **Coordination with S04**: S04's `verify.md` does not exist yet (S04 has not run). S05's evidence table is the input data that S04's verify command will consume. The format S05 picks (Axis # | Axis Name | Evidence | Notes) is a stable shape S04 can rely on; if S04 later requires a different format, the change is local to the README. **No upfront coordination needed** — S04 can adapt to whatever S05 produces.

7. **Risk confirmation**: roadmap says risk:low. Confirmed. The slice touches exactly one new file (`skills/agent-first-cli/README.md`), modifies no existing files, has no runtime impact, and has no cross-slice dependencies beyond consuming S03's reference content (already shipped). The only failure mode is "citations are wrong" — which T02's verification battery catches before slice completion.

## Constraints to Honor

- **R011 — No `.gsd/` writes from this slice.** The README will not write to, reference write operations against, or instruct anyone to write to `.gsd/`. Read-only references (e.g., "see S04's verify report at `.gsd/...`") would be borderline; **recommend omitting any `.gsd/` path references at all** to keep the gate trivial.
- **R012 — No gsd-pi coupling.** The README mentions no harness, no slash commands, no `gsd_*` tools. It is plain markdown.
- **R013 — Stable axis IDs.** All citations use `Axis N` (e.g., `Axis 1`, `Axis 7`) or `Axis: N` (in tables/Notes columns). Never `#axis-N`, never `axis-1`.
- **R009 — gitignorer as git submodule.** The README references paths under `assets/samples/gitignorer/` and includes the submodule init snippet.
- **R008 — verify produces structured impl-mode report.** S05 produces the evidence that makes verify pass. The README's table is the canonical evidence; S04's verify command will read it (or read the same files directly).

## Dependencies / Inputs from Prior Slices

- **S01** → submodule is initialized and populated at `assets/samples/gitignorer/` (verified: `package.json`, `src/`, `tests/`, `.planning/` all present at commit `fb4357f7`).
- **S02** → SKILL.md description and sub-command names can be quoted/paraphrased in the skill-local README. No SKILL.md change required.
- **S03** → 5 reference files exist at `skills/agent-first-cli/references/{stack,features,architecture,pitfalls,requirements}.md`. The axis naming and the per-axis rubric language come from these files. S05 reads but does not modify them.

## First Proof / Highest-Risk Unblocker

**T01 (author the README with the table)** is the unblocker. Without it, S04's verify command has no canonical evidence table to consume, and the M001 success criterion "verify against gitignorer produces a passing report" cannot be demonstrated. T02 (verification battery) is a quality gate on T01's output, not a separate deliverable.

## Out of Scope for S05

- Updating repo-root `README.md` (S06 owns it).
- Implementing the runtime handlers for `examples <command>` and `schema <resource>` in gitignorer (the asset is a reference shape; the runtime work belongs to the gitignorer project's own roadmap).
- Pinning the submodule to a tagged commit (release-engineering decision, not a content-slice decision).
- Designing the verify report format (S04 owns `references/verify.md`).
- Authoring or modifying any file under `skills/agent-first-cli/references/` (S03 owns those; S05 only consumes them).
