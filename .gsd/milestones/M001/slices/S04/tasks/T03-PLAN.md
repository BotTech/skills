---
estimated_steps: 21
estimated_files: 1
skills_used: []
---

# T03: Author references/verify.md (impl-mode checker spec)

Why: verify.md is the implementation-mode enforcement surface — an agent reads this spec, then walks the built CLI's source/tests/--help/examples/schema output to gather per-axis evidence and surface axes with no concrete implementation. Must be authored after eval.md (consumes per-axis 'Common evidence' lists as the rubric) and after validate.md (mirrors the same report format shape).

Do: Create skills/agent-first-cli/references/verify.md (~120-160 lines). Structure:

(1) H1 `# Verify — Implementation-Mode Coverage Check` + 1-paragraph intro: this is the impl-mode checker spec, run after the CLI has been built (or after a sample build is available). The checker reads source files, runs `--help`, runs `examples <cmd>` and `schema <resource>`, and reads test output; it does not write anywhere (R011). State harness-agnostic prohibitions semantically.

(2) `## Inputs` section: the built CLI under test (source tree, tests, `--help` output, examples/schema sub-command output). Note that when running against the gitignorer sample, the inputs come from `assets/samples/gitignorer/`.

(3) `## Strict Rule` section: identical phrasing to validate.md — 'This checker enforces the strict bidirectional coverage rule defined in `AGENTS.md`...' but with one added sentence: 'In impl-mode, an axis is covered only when concrete implementation evidence is cited; planning-level coverage from validate.md does not transfer.'

(4) `## Evidence Convention` section. Specify the file:line + 1-sentence justification format. Recommended exact shape (show as a fenced code block example): `evidence: src/schema/errors.ts:14-22 (defines ValidationError, GitError, FsError, BusinessError with readonly code + exitCode + toJSON)` — i.e., `evidence: <relative-path>:<line-range> (<short justification>)`. Note that the path is relative to the CLI under test root.

(5) `## Per-Axis Procedure` section. One H3 per axis (Axis 1 through Axis 8) with the form:
   `### Axis N: <Name>`
   Two bullet blocks:
   - `**Procedure**` (3-5 numbered steps telling the agent how to find evidence for this axis; cite eval.md's per-axis Common evidence bullets as the rubric).
   - `**Pass criteria**` (one sentence: 'Axis N is covered iff at least one concrete file:line evidence citation matches the per-axis criteria in eval.md').

(6) `## Report Format` section. Same hybrid shape as validate.md (mirrored intentionally for agent-recognition):
   - YAML frontmatter (id, verdict: pass|fail, error_count, warning_count, verified_at).
   - `## Verdict` (one paragraph).
   - `## Axis Coverage Audit` (8-row table: columns `Axis | Name | Status | Evidence Citation | Notes`; Status ∈ {Covered, UNCOVERED}).
   - `## Per-Axis Detail` (one ### per axis with evidence citations list, or `UNCOVERED — no evidence found matching per-axis criteria in eval.md`).

(7) `## Worked Example: gitignorer sample` section. For each of the 8 axes, name ONE concrete file path from `assets/samples/gitignorer/` that demonstrates coverage (e.g., Axis 5 → `src/schema/errors.ts` defining the 4 typed error classes). These are file-path prose references only — the executor does NOT need the submodule checked out to write this section; the paths come from research notes (S04-RESEARCH.md) and existing skills/agent-first-cli/references files which already cite gitignorer paths. Note: this worked example serves as documentation; S05 owns the actual file-existence verification.

(8) `## Error Catalog` section: one error kind `uncovered-axis-impl` (error) with the meaning 'no concrete implementation evidence cited for this axis'; one warning `low-confidence-evidence` (warning) for cases where the cited file:line is speculative.

Constraints: R003 — explicitly cites eval.md as axis source; R004 — references AGENTS.md by name; R011 — no imperative .gsd/ write instructions; R012 — no forbidden tokens; R013 — no anchors/deep-links; uses `Axis N` in prose, `Axis: N` in structured fields.

IMPORTANT — STALE-PATH NOTE: Path anchor below is the registered DB worktree root; the executing agent's cwd will differ (per MEM011). Convert absolute paths to relative paths from the executor's cwd. Equivalent relative paths: `skills/agent-first-cli/references/verify.md` (output); `skills/agent-first-cli/references/eval.md`, `skills/agent-first-cli/references/validate.md`, `skills/agent-first-cli/AGENTS.md` (inputs).

Done when: verify.md exists at the relative path from the executor's cwd, is ~120-160 lines, contains all 8 numbered sections, has all 8 per-axis H3 subsections in the Per-Axis Procedure section, references AGENTS.md and eval.md by name, has the evidence-format code block, includes the gitignorer worked example with one file path per axis.

## Inputs

- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/eval.md`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/validate.md`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/AGENTS.md`

## Expected Output

- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/verify.md`

## Verification

test -f skills/agent-first-cli/references/verify.md

## Observability Impact

None — spec document only.
