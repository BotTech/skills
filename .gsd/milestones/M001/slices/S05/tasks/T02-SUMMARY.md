---
id: T02
parent: S05
milestone: M001
key_files:
  - skills/agent-first-cli/tests/s05-readme-evidence.test.mjs
key_decisions:
  - Path resolver is dual-base: repo-relative paths (skills/...) resolve against repoRoot, skill-relative paths (assets/...) against skillRoot — supports either citation style without skewing the assertion count.
  - Deep-link prohibition matches only the 8 real reference-file names (architecture/eval/features/pitfalls/requirements/stack/validate/verify), not the literal placeholder `<file>`, so the README's intentional meta-description of the avoided suffix form remains legal.
  - Imperative-write prohibition regex requires a sentence-start (or post-punctuation) anchor before write/create verbs — allows 'Do not write to .gsd/' prohibition phrasings (MEM018 carve-out) while still catching standalone 'write to .gsd/' or 'create .gsd/' imperatives.
  - Line-range citation `:N-M` suffix is stripped before fs.access so the README's evidence path with line range (`errors.ts:16-103`) passes the existence check; a separate assertion verifies the cited range contains the claimed patterns.
duration: 
verification_result: passed
completed_at: 2026-06-06T06:02:45.615Z
blocker_discovered: false
---

# T02: Added node:test verification battery for the README evidence table; all 10 assertions pass against T01's README and the gitignorer asset.

**Added node:test verification battery for the README evidence table; all 10 assertions pass against T01's README and the gitignorer asset.**

## What Happened

Created skills/agent-first-cli/tests/s05-readme-evidence.test.mjs using Node's built-in node:test runner with 10 assertions covering: README non-emptiness; exactly 8 axis rows in order 1..8 using the `^| Axis: N |` row pattern; every cited gitignorer path resolves to an existing file (handles both repo-relative `skills/agent-first-cli/...` and skill-relative `assets/...` forms, and strips `:N-M` line-range suffixes before fs.access); Axis 5 line-range citation (errors.ts:16-103) contains all four error classes (ValidationError, GitError, FsError, BusinessError); zero #axis-N anchor forms for N=1..8; zero real references/<file>.md# deep links (the README's intentional `references/<file>.md#section` placeholder prose is allowed by matching only the real reference-file names); zero harness-coupling tokens (gsd_*, /gsd slash commands, imperative .gsd/ write instructions); presence of the submodule init snippet; AGENTS.md back-pointer; eval.md back-pointer. First run revealed two fixable defects: a stray `}` typo in the eval.md test, and an incorrect repo-root resolution (`..`/`..` reached `skills/` rather than the repo root because `tests/` is three levels deep under repo root). Fixed both without weakening any assertion. Final run: 10/10 pass in ~60ms. The test file is itself a deliverable — it stays in the tree as regression coverage for future README edits by S06 or maintenance.

## Verification

`node --test skills/agent-first-cli/tests/s05-readme-evidence.test.mjs` from repo root passes all 10 assertions (1 suite, 10 tests, 10 pass, 0 fail, ~61ms wall clock). The script uses no shell pipes, redirects, semicolons, backticks, command substitution, or grep regex alternation — only node:fs/promises readFile/access, node:assert/strict, and plain regex.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `node --test skills/agent-first-cli/tests/s05-readme-evidence.test.mjs` | 0 | ✅ pass | 102ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `skills/agent-first-cli/tests/s05-readme-evidence.test.mjs`
