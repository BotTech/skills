---
estimated_steps: 28
estimated_files: 1
skills_used: []
---

# T02: Verify the README evidence table: file existence, line-range spot checks, axis-tag form, forbidden-token gates, and submodule init snippet via node:test

Why: T01 produces the deliverable but the evidence table is the slice's whole point — every cited path must resolve, every cited line range must match the claimed pattern, and the file must pass the R011/R012/R013 gates that S03 established. T02 is the verification gate that converts T01's "I wrote it" into "the citations are true." T02 produces one assertion script under tests/s05-readme-evidence.test.mjs (a real node:test file, not inline node -e) so the assertions are reusable if the README is edited later.

Do:
1. Create skills/agent-first-cli/tests/s05-readme-evidence.test.mjs using Node's built-in node:test runner. The gitignorer asset ships a Node-friendly ESM setup; the skill root has no test runner, but node --test works on any modern Node without configuration.
2. The test file must NOT touch .gsd/, .planning/, or .audits/ paths (per the planning rules). It reads only:
   - skills/agent-first-cli/README.md (the file under test)
   - skills/agent-first-cli/assets/samples/gitignorer/... (the cited evidence files)
   - skills/agent-first-cli/references/eval.md (for axis list cross-check only — read-only)
3. The test battery must include the following assertions (use node:fs/promises readFile + node:assert + plain regex; no external deps):
   a. README exists and is non-empty.
   b. The evidence table has exactly 8 rows with axis IDs 1..8 in axis-aligned order.
   c. For each row, every file path cited under assets/samples/gitignorer/ resolves to an existing file (use fs.access).
   d. For cited line ranges (e.g., src/schema/errors.ts:16-103), the file has at least that many lines and the cited range contains at least one match of the claimed pattern (e.g., 'export class ValidationError', 'export class GitError', 'export class FsError', 'export class BusinessError').
   e. Zero occurrences of `#axis-N` anchor form for N in 1..8 anywhere in the README.
   f. Zero occurrences of `references/<file>.md#` deep-link form (the README may name references files but must not anchor them).
   g. Zero occurrences of harness-coupling tokens: imperative `.gsd/` write instructions, `gsd_` tool names, `/gsd ` slash commands. The literal string `assets/samples/gitignorer/` is allowed (it is a content path, not a .gsd/ write). The prohibition verbs carve-out from MEM018 applies if the README phrases prohibitions in prose (e.g., "Do not write to .gsd/").
   h. The submodule init snippet is present: README contains the string `git submodule update --init --recursive`.
   i. README mentions AGENTS.md at least once (the strict-rule back-pointer).
   j. README mentions eval.md at least once (the canonical-axis-list back-pointer).
   k. README does NOT contain imperative write instructions targeting .gsd/ (e.g., "write to .gsd/", "create .gsd/..."). Prohibition phrasings ("Do not write to .gsd/") are allowed under the MEM018 carve-out.
4. Run the test file with `node --test skills/agent-first-cli/tests/s05-readme-evidence.test.mjs` from the repo root. The test must pass on first run. If any assertion fails, fix the README (T01's deliverable) until all assertions pass — do not weaken assertions.
5. The test file is itself a deliverable (it stays in the tree as regression coverage for future README edits by S06 or maintenance).

Done when:
- All assertions a–k pass on a single `node --test` invocation.
- The test file exists at skills/agent-first-cli/tests/s05-readme-evidence.test.mjs.
- README citation density holds: every Axis 1..8 has at least one evidence file that exists and whose cited range matches its claimed pattern.

Verify (run from repo root):
  node --test skills/agent-first-cli/tests/s05-readme-evidence.test.mjs
The node --test exit code is the gate. The command uses no shell pipes, redirects, semicolons, backticks, command substitution, or grep regex alternation.

## Inputs

- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/README.md`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/eval.md`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/assets/samples/gitignorer/src/schema/errors.ts`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/assets/samples/gitignorer/src/cli/error-handler.ts`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/assets/samples/gitignorer/src/cli/program.ts`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/assets/samples/gitignorer/src/cli/mode.ts`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/assets/samples/gitignorer/src/cli/flags.ts`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/assets/samples/gitignorer/src/bin.ts`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/assets/samples/gitignorer/src/parsers/stdin.ts`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/assets/samples/gitignorer/src/services/cache.service.ts`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/assets/samples/gitignorer/src/services/git.service.ts`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/assets/samples/gitignorer/src/formatters/dry-run.ts`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/assets/samples/gitignorer/src/commands/examples.ts`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/assets/samples/gitignorer/src/commands/schema.ts`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/assets/samples/gitignorer/src/schema/input.ts`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/assets/samples/gitignorer/package.json`

## Expected Output

- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/tests/s05-readme-evidence.test.mjs`

## Verification

node --test /Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/tests/s05-readme-evidence.test.mjs

## Observability Impact

None — pure assertion script against static files.
