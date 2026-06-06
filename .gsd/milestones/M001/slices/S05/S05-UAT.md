# S05: Asset verification: gitignorer demonstrates all 8 axes — UAT

**Milestone:** M001
**Written:** 2026-06-06T06:04:59.067Z

# S05: Asset verification: gitignorer demonstrates all 8 axes — UAT

**Milestone:** M001
**Written:** 2026-06-06

## UAT Type

- UAT mode: artifact-driven
- Why this mode is sufficient: S05 produces a static Markdown file plus a node:test battery. There is no runtime, no CLI to invoke, no side effect to observe — the deliverable is "every axis cites a real file." The node:test battery is the executable UAT; manual UAT confirms the README is readable as a stranger-facing artifact.

## Preconditions

- Repository checked out at `/Users/jason/src/bottech/skills/.gsd/worktrees/M001` (or any clone of the skills repo).
- `git submodule update --init --recursive skills/agent-first-cli/assets/samples/gitignorer` has been run (or the recursive clone equivalent), so the asset at `assets/samples/gitignorer/` is populated at commit `fb4357f7`.
- Node.js available on PATH (any version that ships `node --test`, i.e. ≥18).

## Smoke Test

From the repo root, run `node --test skills/agent-first-cli/tests/s05-readme-evidence.test.mjs`. Expected: 1 suite, 10 tests, 10 pass, 0 fail; process exits 0 in under 1 second. If any assertion fails, the smoke test fails.

## Test Cases

### 1. README is double-click-runnable

1. Open `skills/agent-first-cli/README.md` with no prior context (fresh reader).
2. Read the "Sample asset: gitignorer" section.
3. **Expected:** The reader can identify (a) what the sample is, (b) the canonical init command, (c) that the pinned commit is `fb4357f7`, without consulting any other file.

### 2. Sub-module init snippet works on a fresh clone

1. Clone the repo without recursive submodule init.
2. Run `git submodule update --init --recursive skills/agent-first-cli/assets/samples/gitignorer` from the repo root.
3. **Expected:** The directory is populated; `ls skills/agent-first-cli/assets/samples/gitignorer/src` shows real source files (commands, parsers, formatters, etc.).

### 3. Evidence table covers all 8 axes

1. Open `skills/agent-first-cli/README.md` and locate the "Axis evidence" table.
2. Count rows starting with `| Axis:` in the data section.
3. **Expected:** Exactly 8 rows, numbered Axis: 1 through Axis: 8, in axis-aligned order. The node:test battery enforces this automatically.

### 4. Every cited file resolves

1. For each axis row, copy the cited path(s) and strip any `:N-M` line-range suffix.
2. Resolve each path from the repo root.
3. **Expected:** Every path exists and is readable. The node:test battery enforces this automatically (assertion: "every cited evidence path resolves").

### 5. Cited line ranges contain claimed patterns

1. For Axis 5 (`errors.ts:16-103`), open `skills/agent-first-cli/assets/samples/gitignorer/src/schema/errors.ts` lines 16–103.
2. **Expected:** The range declares error classes (`ValidationError`, `GitError`, `FsError`, `BusinessError`) with `readonly exitCode` and `toJSON`. The node:test battery enforces this automatically.

### 6. No forbidden tokens / anchors

1. Search the README for `#axis-N` (where N=1..8) functioning as anchors.
2. Search for `references/<file>.md#<section>` deep links (where `<file>` is one of architecture/eval/features/pitfalls/requirements/stack/validate/verify).
3. Search for imperative `.gsd/` write phrasings (allowing prohibition verbs like "Do not write").
4. **Expected:** Zero actionable matches. The node:test battery enforces this automatically. Meta-prose describing what's avoided (inside backticks or after prohibition verbs) is allowed per MEM016/MEM018.

### 7. Strict-rule back-pointer is present

1. Search the README for `AGENTS.md`.
2. Search the README for `eval.md` (the canonical axis list spine).
3. **Expected:** Both mentioned at least once. The node:test battery enforces this automatically.

## Edge Cases

- **Submodule not initialized:** Test 1 fails to find files. Mitigation: the README's submodule init snippet is the canonical recovery step.
- **gitignorer moves to a newer commit:** Test 4 may fail if cited paths are renamed. Recovery: update pinned commit reference in README and re-cite any renamed files.
- **Header row phrasing drift:** If a future editor rewrites the header to `| Axis: |`, the plan-author's grep would return 9 instead of 8; the node:test battery uses a stricter regex that ignores the header, so the battery is robust to this drift.

## Sign-off

All 7 test cases verified via the executable battery plus manual review of the README as a stranger-facing artifact. Slice is ready to mark complete.
