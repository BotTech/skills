# S03: Reference content: stack, features, architecture, pitfalls, requirements — UAT

**Milestone:** M001
**Written:** 2026-06-06T05:32:07.957Z

# S03 UAT — Reference content: stack, features, architecture, pitfalls, requirements

**UAT Type:** Static-content / contract UAT (no runtime to exercise; downstream slices S04/S05 will exercise the content functionally).

**Preconditions:**
- Working directory is `/Users/jason/src/bottech/skills/.gsd/worktrees/M001`.
- All S03 tasks (T01..T06) marked complete.
- The 5 reference files exist at `skills/agent-first-cli/references/{stack,features,architecture,pitfalls,requirements}.md`.

---

## Scenario 1: A GSD planning agent lifts a starter requirement set from requirements.md

**Steps:**
1. Open `skills/agent-first-cli/references/requirements.md`.
2. Locate the `## Starter Requirements` section.
3. Pick any starter R### block (e.g., R003 — I/O stdout/stderr separation).
4. Copy the entire block verbatim into a target project's `.gsd/REQUIREMENTS.md` (mocked for UAT).

**Expected outcomes:**
- The block is well-formed GSD-template format with the 9 expected fields (`Class`, `Status`, `Description`, `Why it matters`, `Source`, `Primary owning slice`, `Supporting slices`, `Validation`, `Notes`).
- The `Notes` field contains an `Axis: N` tag (for R003, `Axis: 3`).
- No reformatting or translation is required to make it a valid R### block in the target project.

**Pass criteria:** Block pastes cleanly into a GSD REQUIREMENTS.md without edits; Axis tag survives the paste.

---

## Scenario 2: A user reads features.md and traces a feature back to a starter R###

**Steps:**
1. Open `skills/agent-first-cli/references/features.md`.
2. Scroll to the `## Cross-Check vs REQUIREMENTS.md` section.
3. Pick any row (e.g., a row mapping a P0 I/O feature to R003).
4. Open `requirements.md` and locate the cited R###.

**Expected outcomes:**
- The Cross-Check section exists and is a table.
- Each cited R### ID resolves to a real `### R###` block in requirements.md.
- No broken R### references.

**Pass criteria:** 100% of R### IDs cited in the Cross-Check table resolve to actual blocks in requirements.md.

---

## Scenario 3: A user follows an axis citation across files

**Steps:**
1. Open `pitfalls.md` and find the pitfall tagged for Axis 5 (errors).
2. Note the `Axis 5` (or `Axis: 5`) form of the citation.
3. Open `features.md` and find the matching Axis 5 feature table (`## Error`).
4. Open `requirements.md` and find the starter R### tagged `Axis: 5`.

**Expected outcomes:**
- All three files use the same citation form (`Axis N` or `Axis: N`).
- No `#axis-5` anchors or `references/<file>.md#axis-5` deep links appear anywhere.
- The user can navigate by axis ID alone, without depending on file paths or anchor text.

**Pass criteria:** Cross-file navigation by axis ID works without any broken deep links.

---

## Scenario 4: Forbidden-token gates hold across the slice

**Steps:**
1. From the worktree root, run:
   ```
   grep -rnoE '#axis-[0-9]|references/[^ ]*#axis-[0-9]' skills/agent-first-cli/references/
   grep -rnoE 'write[^.]*\.gsd/|gsd_(task|slice|milestone)_(complete|reopen|replan)|/gsd (start|complete|skip)' skills/agent-first-cli/references/
   grep -rnoE 'gsd_exec|gsd_journal_query|gsd_save_gate_result|gsd_milestone_status' skills/agent-first-cli/references/
   ```

**Expected outcomes:**
- All three grep invocations return zero matches.

**Pass criteria:** R011 (no .gsd/ write instructions), R012 (no gsd-pi coupling), and R013 (no forbidden axis anchors) all hold across every reference file.

---

## Scenario 5: GSD-template-shape match (R005) is verifiable by visual inspection

**Steps:**
1. Open each reference file and compare its top-level section headers against the target GSD template:
   - `requirements.md` → GSD per-R### block format (must have `## How to Use This File`, `## Starter Requirements`, `## Coverage Table`)
   - `features.md` → axis-aligned feature sections (Discoverability, Invocation, I/O, State, Error, Exit Code, Idempotency, Examples)
   - `stack.md` → STACK.md shape (`## Recommended Stack`, `## What NOT to Use`)
   - `architecture.md` → ARCHITECTURE.md shape (`## Recommended Architecture`, `## Data Model Sketch`, `## Integration Points`, `## Scaling Tier`, `## Reversibility Risk`)
   - `pitfalls.md` → PITFALLS.md shape (`## Domain Pitfalls`, `## Stack Pitfalls`, `## Scope Traps`, `## Compliance / Security Gotchas`, `## Migration Pitfalls`)

**Expected outcomes:**
- Each file's required headers are present verbatim.

**Pass criteria:** 100% header match against the GSD template shape for each file.

---

## Edge cases / negative paths

- **Edge: a starter R###'s axis tag is malformed (e.g., `Axis:0` no space, or `axis 5` lowercase).** S04's validate sub-command will catch this (planned). For S03, the closure battery verified all 8 axis tags appear in canonical `Axis: N` form.
- **Edge: a Cross-Check row cites an R### that doesn't exist.** Verified absent in T02's per-row grep and re-verified in closure battery.
- **Edge: a pitfall lacks an axis tag.** Verified: 8 pitfalls collectively cover all 8 axes (pitfalls.md grep found 8 distinct axis values 1..8).
- **Edge: a file exceeds the 250-line soft budget.** None do — actual line counts: stack 50, features 168, architecture 81, pitfalls 97, requirements 158.

---

## Out of scope for S03 UAT

- Functional exercise of validate/verify (S04's job).
- Functional exercise of gitignorer → axis mapping (S05's job).
- Repo-root README index (S06's job).

---

## Overall pass criterion

All 5 scenarios pass. T06's 81/81 battery plus the closure battery's 12 Must-Have checks together constitute the full S03 UAT evidence.
