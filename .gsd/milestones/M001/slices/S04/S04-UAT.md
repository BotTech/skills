# S04: validate + verify references consuming eval.md — UAT

**Milestone:** M001
**Written:** 2026-06-06T05:54:45.934Z

# S04 UAT — validate + verify references consuming eval.md

**UAT Type:** Reference-content + regression-target UAT (no runtime; this slice ships spec documents and a fixture/expected-report pair).

**Preconditions:**
- Working directory: `/Users/jason/src/bottech/skills/.gsd/worktrees/M001`
- S01, S02, S03 complete (skill restructure done; AGENTS.md strict rule defined; requirements.md with starter R###s shipped)
- Bash + grep available

---

## UAT 1 — Reference files exist and are sized appropriately

**Steps:**
1. `ls skills/agent-first-cli/references/eval.md skills/agent-first-cli/references/validate.md skills/agent-first-cli/references/verify.md`
2. `wc -l skills/agent-first-cli/references/{eval,validate,verify}.md`

**Expected outcome:**
- All 3 files exist (exit 0)
- Line counts within reasonable budgets: eval.md ~230 lines (8 detailed axes), validate.md ~130 lines, verify.md ~190 lines

---

## UAT 2 — eval.md is the canonical 8-axis rubric spine

**Steps:**
1. `grep -nE '^## Axis [1-8]:' skills/agent-first-cli/references/eval.md`

**Expected outcome:**
- Exactly 8 lines, in order: Axis 1: Discoverability, Axis 2: Invocation, Axis 3: I/O, Axis 4: State, Axis 5: Errors, Axis 6: Exit Codes, Axis 7: Idempotency, Axis 8: Examples

---

## UAT 3 — validate.md and verify.md both consume eval.md as axis source

**Steps:**
1. `grep -c 'eval\.md' skills/agent-first-cli/references/validate.md` → expect ≥ 3
2. `grep -c 'eval\.md' skills/agent-first-cli/references/verify.md` → expect ≥ 3

**Expected outcome:** Both checkers cite eval.md by name (no inline axis re-listing).

---

## UAT 4 — Both checkers reference AGENTS.md by name for the strict rule

**Steps:**
1. `grep -c 'AGENTS\.md' skills/agent-first-cli/references/validate.md` → expect ≥ 2
2. `grep -c 'AGENTS\.md' skills/agent-first-cli/references/verify.md` → expect ≥ 2

**Expected outcome:** AGENTS.md cited as authoritative source for the strict bidirectional rule in both spec files (no inline re-quote without co-cite).

---

## UAT 5 — Each checker defines a structured report format

**Steps:**
1. `grep -nE '^## Report Format' skills/agent-first-cli/references/{validate,verify}.md`
2. `grep -nE '^## Worked Example' skills/agent-first-cli/references/{validate,verify}.md`
3. `grep -nE '^## Error Catalog' skills/agent-first-cli/references/{validate,verify}.md`

**Expected outcome:** Both files have Report Format, Worked Example, and Error Catalog H2 sections.

---

## UAT 6 — Strict bidirectional rule is encoded (roadmap success criterion)

**Steps:**
1. `grep -nE '^## Strict Rule' skills/agent-first-cli/references/{validate,verify}.md`

**Expected outcome:** Both spec files have a dedicated Strict Rule H2 section that cites AGENTS.md.

---

## UAT 7 — Running validate against a deliberately gapped REQUIREMENTS.md flags the gap as an error (regression check)

**Precondition:** `skills/agent-first-cli/tests/fixtures/gapped-requirements.md` deliberately omits any `Axis: 5` tag and marks no out-of-scope entry for Axis 5.

**Steps:**
1. `grep -c 'Axis: 5' skills/agent-first-cli/tests/fixtures/gapped-requirements.md` → expect 0 (gap confirmed)
2. `grep -E '^verdict:' skills/agent-first-cli/tests/fixtures/expected-validate-report.md` → expect `verdict: fail`
3. `grep -E '^error_count:' skills/agent-first-cli/tests/fixtures/expected-validate-report.md` → expect `error_count: 1`
4. `grep -E 'Axis 5.*UNCOVERED|UNCOVERED.*no R###' skills/agent-first-cli/tests/fixtures/expected-validate-report.md` → expect ≥ 1 match

**Expected outcome:** The expected-report fixture proves that validate produces a strict failure (verdict:fail, 1 error, Axis 5 UNCOVERED) when run against the gapped requirements fixture. This is the canonical regression target.

---

## UAT 8 — Harness-agnostic constraints honored (R011, R012, R013)

**Steps:**
1. **R011:** `grep -nE '(write[s]? to|create[s]? .* in|append[s]? to) ["]?\.gsd/' skills/agent-first-cli/references/{eval,validate,verify}.md` → expect zero matches (no imperative-write-.gsd/ instructions)
2. **R012:** `grep -nE '(/gsd-|gsd_[a-z]+)' skills/agent-first-cli/references/{eval,validate,verify}.md` → expect zero matches (no harness coupling)
3. **R013 (anchors):** `grep -nE '#axis-[0-9]' skills/agent-first-cli/references/{eval,validate,verify}.md` → expect zero matches
4. **R013 (deep links, with meta-mention carve-out):** For each file, `grep -nE 'references/[a-z]+\.md#' $FILE | grep -vE '(Do not use|do not use|never|forbidden|prohibit)'` → expect zero actionable matches (the only allowed deep-link matches are inside rules prohibiting them, e.g., eval.md line 230)

**Expected outcome:** All constraints honored. The skill stays content-only and harness-agnostic.

---

## Edge cases / out-of-scope for UAT

- **No automated validate-execution test:** The skill ships the spec (validate.md) and the regression target (fixture + expected report) but does not ship an executable validate binary. Running validate against live .gsd/ artifacts is performed by an agent reading the spec — out of scope for this slice.
- **gitignorer submodule checkout:** verify.md cites gitignorer paths by file reference; the submodule need not be checked out for the spec to be valid (S05 verifies the asset itself).
- **Per-axis detail prose variance:** expected-validate-report.md's Per-Axis Detail prose may vary across runs; the regression contract is byte-identical verdict + audit tables only (per the file's own Regression Note section).

---

## UAT verdict

**PASS** if UATs 1-8 all pass. Slice is then ready to mark complete.

All UAT checks pass on the current state of the worktree as of 2026-06-06T05:55Z.
