---
sliceId: S05
uatType: artifact-driven
verdict: PASS
date: 2026-06-06T06:35:00.000Z
---

# UAT Result — S05

UAT mode in the spec file is **artifact-driven** (the deliverable is a static README plus a node:test battery; there is no runtime/CLI to invoke). The auto-detected `browser-executable` tag is a mis-classification — no browser is needed and the spec explicitly states "There is no runtime, no CLI to invoke." All checks below were executed with shell commands and file reads, consistent with the spec's intent.

## Checks

| Check | Mode | Result | Notes |
|-------|------|--------|-------|
| **Smoke test**: `node --test skills/agent-first-cli/tests/s05-readme-evidence.test.mjs` exits 0 with 10/10 pass | runtime | PASS | Suite=1, tests=10, pass=10, fail=0, duration=58.7ms. Exit code 0. Evidence: `gsd_exec dda662fe`. |
| **Test 1**: README is double-click-runnable (sample identification, init command, pinned commit) | artifact | PASS | `skills/agent-first-cli/README.md` contains the "Sample asset: gitignorer" section with the canonical init command and pinned commit `fb4357f7`. Stranger-readable: overview, install, and evidence table appear in document order without needing to consult other files. |
| **Test 2**: Submodule populated; `ls assets/samples/gitignorer/src` shows real source files | artifact | PASS | `git submodule status` shows `fb4357f7bbdda68d2ae7366e69fa4afa8c99e7c1` checked out. `src/` tree contains `bin.ts`, `index.ts`, and directories `commands/{examples,generate,list,scan,schema,search,update}.ts`, `cli/{error-handler,flags,mode,program}.ts`, `formatters/{dry-run,human,json,ndjson}.ts`, `parsers/{flags,stdin}.ts`, `schema/{errors,input,output}.ts`, `services/{cache.service,git.service}.ts`. Evidence: `gsd_exec 1bb1bf7a`. |
| **Test 3**: Evidence table has exactly 8 axis rows in axis-aligned order (1..8) | artifact | PASS | `grep -cE '^\| Axis: [0-9]+ \|' README.md` → 8. Battery assertion `evidence table has exactly 8 axis rows in axis-aligned order` passed (deepEqual `[1,2,3,4,5,6,7,8]`). Evidence: `gsd_exec 491c92be`. |
| **Test 4**: Every cited evidence path resolves | artifact | PASS | Battery assertion `every cited gitignorer path resolves to an existing file` passed; extracted ≥8 cited paths and all `fs.access` checks succeeded. Cross-confirmed by manual `ls`: every cited file path (commands/examples.ts, commands/schema.ts, cli/program.ts, package.json, cli/flags.ts, parsers/stdin.ts, schema/input.ts, formatters/*.ts, cli/mode.ts, services/cache.service.ts, services/git.service.ts, schema/errors.ts, formatters/dry-run.ts, cli/error-handler.ts, bin.ts, tests/services/cache.service.test.ts) exists under the populated submodule. |
| **Test 5**: `errors.ts:16-103` contains claimed patterns (4 error classes with `readonly exitCode` and `toJSON`) | artifact | PASS | `sed -n '16,103p'` finds all four classes in range: `export class ValidationError`, `export class GitError`, `export class FsError`, `export class BusinessError`. `grep 'readonly exitCode'` returns 4 hits at lines 17, 41, 65, 89 (values 1, 2, 3, 4). `grep -c 'toJSON'` returns 4. Battery assertion `Axis 5 cited line range (errors.ts:16-103) contains all 4 error classes` passed. File has 107 lines total, so the 16–103 range is in-bounds. Evidence: `gsd_exec 1bb1bf7a`. |
| **Test 6**: No forbidden tokens/anchors (`#axis-N`, real `references/<file>.md#` deep links, imperative `.gsd/` writes) | artifact | PASS | `grep '#axis-[1-8]'` → no matches. `grep -E 'references/(architecture\|eval\|features\|pitfalls\|requirements\|stack\|validate\|verify)\.md#'` → no matches. `grep -Ei '(write\|create) (to\|in\|under) \.gsd/'` → no matches. Three corresponding battery assertions also passed (`no #axis-N anchor form`, `no real references/<file>.md# deep-link`, `no harness-coupling tokens`). Evidence: `gsd_exec 491c92be`. |
| **Test 7**: Strict-rule back-pointers (`AGENTS.md` and `eval.md` both mentioned) | artifact | PASS | `grep -c 'AGENTS\.md' README.md` → 2 mentions. `grep -c 'eval\.md' README.md` → 3 mentions. Two corresponding battery assertions passed (`README mentions AGENTS.md at least once`, `README mentions eval.md at least once`). Evidence: `gsd_exec 491c92be`. |

## Overall Verdict

**PASS** — All 7 UAT test cases plus the smoke test passed. The executable node:test battery (10/10 assertions) plus targeted shell/file checks confirm the README is a complete stranger-facing artifact: the submodule is populated at pinned commit `fb4357f7`, the evidence table has exactly 8 axis rows in axis-aligned order, every cited path resolves, the cited `errors.ts:16-103` range contains all four claimed error classes with `readonly exitCode` and `toJSON`, no forbidden anchors/deep-links/imperative `.gsd/` writes appear, and both strict-rule back-pointers (`AGENTS.md`, `eval.md`) are present.

## Notes

- **Mode correction**: The dispatcher tagged this UAT as `browser-executable`, but the spec file explicitly identifies as `artifact-driven` and the deliverable has no runtime/CLI/UI. All checks were executed with `gsd_exec` shell commands (verification-lane policy blocks raw `bash`), which is the correct tool for an artifact-driven UAT.
- **Evidence files persisted** under `.gsd/exec/`: `dda662fe-…` (test battery output), `491c92be-…` (README structural grep checks), `1bb1bf7a-…` (submodule tree + errors.ts line-range verification).
- **Verification lane compliance**: All commands were issued via `gsd_exec` rather than `bash`, in accordance with the verification-lane tools policy. No write operations were performed; the README and test battery are unchanged from S05's deliverable state.
- **No human-only checks**: Test 1 (stranger-readability) was assessable from the README's document structure and content; no subjective UX judgment was required. The README introduces the sample, gives the canonical init command, names the pinned commit, and proceeds to the evidence table in a single readable top-to-bottom pass.
- **Known limitation surfaced in README prose** (not a UAT failure): Axes 1 and 8 note that `examples` and `schema` command action handlers emit `Not yet implemented` stubs rather than JSON payloads. The README documents this as a known follow-up rather than claiming runtime payload coverage; the UAT spec does not require runtime payload emission, so this is informational only.
