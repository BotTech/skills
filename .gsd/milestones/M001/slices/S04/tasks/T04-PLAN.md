---
estimated_steps: 21
estimated_files: 2
skills_used: []
---

# T04: Ship test fixture + expected report and run closure verification battery

Why: The roadmap success criterion 'agent-first-cli validate against a deliberately gapped REQUIREMENTS.md flags the gap as an error' requires a concrete fixture + expected report that an agent (or regression test) can re-run. This task ships both and then runs the slice's closure verification battery that gates S04 completion.

Do: Four sub-steps:

(A) Create directory skills/agent-first-cli/tests/fixtures/ (mkdir -p).

(B) Create skills/agent-first-cli/tests/fixtures/gapped-requirements.md (~70-90 lines). Content: a small but realistic REQUIREMENTS.md fixture with 5 R### blocks (R001-R005) covering Axis 1 (R001), Axis 2 (R002), Axis 3 (R003), Axis 4 (R004), and Axis 6 (R005) — leaving Axis 5 (Errors) UNCOVERED and Axis 7 (Idempotency) UNCOVERED and Axis 8 (Examples) UNCOVERED. To make the strict check interesting, exactly ONE of those gaps (Axis 5) is the deliberate gap; the other two (Axis 7, Axis 8) should be explicitly marked out-of-scope in a Coverage Table entry, so the only ERROR in the expected report is the Axis 5 uncovered gap. Use the GSD-template block format (`- Class:`, `- Status:`, `- Description:`, `- Why it matters:`, `- Source:`, `- Primary owning slice:`, `- Supporting slices:`, `- Validation:`, `- Notes:` per MEM015) for each R### block. Include a `## Coverage Table` at the bottom with rows for Axis 1-8 where Axis 5 row reads `UNCOVERED (deliberate gap — test fixture)` and Axis 7/8 rows read `Out of scope (test fixture)`. This file is fixture data, NOT real project content; it is consumed by validate.md's worked-example section.

(C) Create skills/agent-first-cli/tests/fixtures/expected-validate-report.md (~40-60 lines). Content: the exact report an agent following validate.md would produce when run against gapped-requirements.md. Use the Report Format from validate.md: YAML frontmatter (verdict: fail, error_count: 1, warning_count: 0), Verdict paragraph stating the failure, Axis Coverage Audit table (8 rows; Axis 5 row Status=UNCOVERED, source=—, notes='deliberate gap'), R### Audit table (5 rows; all Status=Covered with their axis tags), Per-Axis Detail for Axis 5 showing `UNCOVERED — no R### carries Axis: 5 tag and no out-of-scope declaration exists`. End with a one-line `## Regression Note` stating this report is the canonical expected output and any agent running validate against the fixture must produce a byte-identical verdict and audit-table content (Per-Axis Detail prose may vary).

(D) Run a closure verification battery via gsd_exec. The script performs ≥30 individual assertions and exits non-zero on any failure. Persist the script's stdout to .gsd/exec/<uuid>.stdout (gsd_exec handles this automatically). Assertions (each is a separate test in the script; numbering matches plan):

Existence (5): 1-5. eval.md, validate.md, verify.md, gapped-requirements.md, expected-validate-report.md all exist.

Length budgets (3): 6-8. Each of eval.md, validate.md, verify.md is between 100 and 200 lines.

R003 — eval consumed by both (4): 9. validate.md contains 'eval.md'. 10. verify.md contains 'eval.md'. 11. eval.md does NOT contain a routing-table row (no `| eval |` pattern). 12. SKILL.md calls eval.md 'not a sub-command' (existing, re-verify).

R004 — AGENTS.md referenced by name, not re-quoted (4): 13. validate.md contains 'AGENTS.md'. 14. verify.md contains 'AGENTS.md'. 15. validate.md does NOT re-enumerate the 8 axes inline (count of `## Axis` headers in validate.md must be 0 — axes live in eval.md only). 16. verify.md's Per-Axis Procedure section enumerates the 8 axes (this is intentional — verify.md's job IS to iterate per axis) but the file does NOT re-declare the strict rule text from AGENTS.md.

Report format shape (4): 17. validate.md contains `## Report Format`. 18. validate.md contains a fenced YAML block (e.g., `verdict: pass|fail`). 19. validate.md contains `## Axis Coverage Audit`. 20. validate.md contains `## Per-Axis Detail`.

Worked examples (3): 21. validate.md contains a section header mentioning `Worked Example` or `gapped-requirements`. 22. verify.md contains a section header mentioning `Worked Example` or `gitignorer`. 23. verify.md mentions at least 4 distinct file paths matching `assets/samples/gitignorer/[A-Za-z0-9_./-]+` (one per axis minimum sampled).

Out-of-scope dual representation (1): 24. validate.md documents BOTH the `Status: out-of-scope` block-field form AND the `out-of-scope:` Notes-token form.

Error catalogs (2): 25. validate.md contains `## Error Catalog` and lists `uncovered-axis`, `orphan-r###`, `out-of-scope-without-reason`. 26. verify.md contains `## Error Catalog` and lists `uncovered-axis-impl`.

R011 — no imperative .gsd/ write instructions (1): 27. Across all three new reference files plus the two fixture files, no line matches the pattern `(create|write|save|append|update|modify|edit)\s+[a-zA-Z`'\"].*\.gsd/` (imperative verb followed by .gsd/ path; descriptive mentions like 'as recorded in the project's .gsd/REQUIREMENTS.md' or 'No .gsd/ writes' are allowed).

R012 — no harness coupling (1): 28. Across all three new files plus the two fixture files, zero matches for `gsd-pi|gsd\.db|gsd_[a-z]+|/gsd-` (use grep -E).

R013 — stable axis IDs (3): 29. Across all three new files, zero matches for `#axis-[0-9]+` (no anchor-style axis refs). 30. Across all three new files, zero matches for `references/[a-z]+\.md#` (no file#section deep links). 31. eval.md uses the form `## Axis [0-9]+:` for all 8 H2 headers (count of matching lines is exactly 8).

Fixture contract (3): 32. gapped-requirements.md contains exactly 5 R### blocks — count of `### R[0-9]{3}` matches is 5. 33. gapped-requirements.md contains `Axis: 5` zero times (the deliberate gap). 34. expected-validate-report.md contains `verdict: fail` AND `error_count: 1`.

Run the script via gsd_exec with runtime `bash`. Verify exit code 0 and that the persisted stdout (at .gsd/exec/<uuid>.stdout) shows 'ALL 34 ASSERTIONS PASSED' or equivalent.

IMPORTANT — STALE-PATH NOTE: Path anchors below are the registered DB worktree root; the executing agent's cwd will differ (per MEM011). Convert absolute paths to relative paths from the executor's cwd. Equivalent relative paths for outputs: `skills/agent-first-cli/tests/fixtures/gapped-requirements.md`, `skills/agent-first-cli/tests/fixtures/expected-validate-report.md`. Equivalent relative paths for inputs: `skills/agent-first-cli/references/eval.md`, `skills/agent-first-cli/references/validate.md`, `skills/agent-first-cli/references/verify.md`, `skills/agent-first-cli/AGENTS.md`, `skills/agent-first-cli/SKILL.md`. The gsd_exec script should `cd` into the executor's cwd and use only relative paths; never reference the project-id worktree path directly.

Done when: both fixture files exist with the specified content, the verification script exits 0, all 34 assertions pass, and the script's stdout artifact path is captured for the task summary.

## Inputs

- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/eval.md`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/validate.md`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/verify.md`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/AGENTS.md`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/SKILL.md`

## Expected Output

- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/tests/fixtures/gapped-requirements.md`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/tests/fixtures/expected-validate-report.md`

## Verification

test -f skills/agent-first-cli/tests/fixtures/gapped-requirements.md && test -f skills/agent-first-cli/tests/fixtures/expected-validate-report.md

## Observability Impact

Verification artifact persisted at .gsd/exec/<uuid>.stdout by gsd_exec — future agents can re-read the closure battery output.
