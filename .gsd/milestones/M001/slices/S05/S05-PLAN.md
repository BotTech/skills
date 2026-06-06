# S05: Asset verification: gitignorer demonstrates all 8 axes

**Goal:** For each of the 8 agent-first axes, identify a concrete file path in skills/agent-first-cli/assets/samples/gitignorer/ that demonstrates the axis; document axis → file evidence in a new skills/agent-first-cli/README.md so S04's future `verify` sub-command can consume the mapping as direct evidence and M001's success criterion ("verify against gitignorer produces a passing report") is satisfied by cited paths rather than hand-waving.
**Demo:** For each of the 8 axes, a concrete file path in assets/samples/gitignorer/ is identified that demonstrates the axis; a short mapping table in the skill's README documents the axis → file evidence.

## Must-Haves

- skills/agent-first-cli/README.md exists as a new file containing a per-axis evidence table with 8 rows (one per axis), each row citing at least one concrete file path under skills/agent-first-cli/assets/samples/gitignorer/.
- Every file path cited in the evidence table resolves to a real file in the gitignorer submodule (current commit fb4357f7).
- Table headers and prose citations use the stable Axis ID form ("Axis N" / "Axis: N"); zero `#axis-N` anchors and zero `references/<file>.md#` deep links anywhere in the new README.
- The README contains the submodule init snippet so a stranger can populate the sample asset on first contact.
- The README stays out of S06's lane: it does not edit repo-root README.md, does not duplicate S06's skills-lock.json audit, and does not claim ownership of repo-level install instructions beyond the submodule init line.
- No file in the skill writes to .gsd/ in the target project; no file invokes /gsd slash commands or gsd_* tools; no harness-coupling tokens appear in the new README.
- README is double-click-runnable: a stranger reading it can populate the gitignorer sample and audit the 8-axis mapping without asking questions.

## Proof Level

- This slice proves: contract — verifies file existence, line-level evidence, axis-tag form, forbidden-token gates, and submodule init snippet via executable node:test assertions. No runtime CLI invocation required because the slice is pure documentation that cites existing code; the cited files are the proof.

## Integration Closure

Upstream surfaces consumed: S03's 5 reference files (references/{stack,features,architecture,pitfalls,requirements}.md) for axis names and citation form; S01's submodule wiring (.gitmodules entry for assets/samples/gitignorer) for the asset being mapped; S02's AGENTS.md strict rule for the bidirectional coverage framing; references/eval.md for the canonical axis list. Downstream consumers: S04's verify.md will reference the mapping table as evidence format guidance; S06's repo-root README may link to the skill-local README as the human-facing skill entry. No new wiring introduced — this slice adds a static documentation file. What remains before M001 is end-to-end usable: S06 (repo-root README and skills-lock.json audit) and S04 (validate/verify consuming eval.md).

## Verification

- None. This slice produces a static Markdown file. It introduces no runtime, no async flows, no error paths, no metrics. Failure visibility for this slice is the T02 verification battery itself: any failed assertion is a planning or content defect correctable by editing the README.

## Tasks

- [x] **T01: Author skills/agent-first-cli/README.md with overview, sub-command table, submodule init snippet, and 8-axis evidence table** `est:45m`
  Why: S05's deliverable is a single new file — skills/agent-first-cli/README.md — that hosts the per-axis evidence map for the gitignorer sample asset and doubles as the skill's human-facing entry doc (which currently does not exist; SKILL.md is the agent-facing entry). S06 owns repo-root README.md and S05 stays out of its lane, so the evidence table lives at the skill-local path. Without this file, M001's success criterion ("verify against gitignorer produces a passing report") rests on uncited claims; with it, every axis traces to a concrete file path an agent can open and read.
  - Files: `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/README.md`
  - Verify: test -s /Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/README.md && grep -c "^| Axis:" /Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/README.md

- [x] **T02: Verify the README evidence table: file existence, line-range spot checks, axis-tag form, forbidden-token gates, and submodule init snippet via node:test** `est:45m`
  Why: T01 produces the deliverable but the evidence table is the slice's whole point — every cited path must resolve, every cited line range must match the claimed pattern, and the file must pass the R011/R012/R013 gates that S03 established. T02 is the verification gate that converts T01's "I wrote it" into "the citations are true." T02 produces one assertion script under tests/s05-readme-evidence.test.mjs (a real node:test file, not inline node -e) so the assertions are reusable if the README is edited later.
  - Files: `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/tests/s05-readme-evidence.test.mjs`
  - Verify: node --test /Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/tests/s05-readme-evidence.test.mjs

## Files Likely Touched

- /Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/README.md
- /Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/tests/s05-readme-evidence.test.mjs
