---
estimated_steps: 22
estimated_files: 5
skills_used: []
---

# T06: Run S03 verification battery (shape, axis tags, R011/R012/R013 gates)

Why: S03's contract is mechanical — every file has shape requirements, every axis needs tags, every forbidden-token gate must pass. This task runs the full battery as a single bash script via gsd_exec and reports pass/fail per check. It does not produce new files; it produces a verification log that future slices (S04, S05) can point at as proof S03's content is sound.

Do:
1. Run a single gsd_exec bash script that performs ALL of the following checks and reports pass/fail per check (the script's stdout is the verification artifact):
   - **Existence:** each of `skills/agent-first-cli/references/{stack,features,architecture,pitfalls,requirements}.md` exists and is non-empty.
   - **R005 shape (per-file section header match):** for each file, grep for each required top-level header listed in T01-T05's done-when criteria. Use simple `grep -q '^## HeaderName$'` per check — no alternation, no pipes. Run each as its own assertion so a failure pinpoints the missing header. Minimum checks:
     - requirements.md: `^## How to Use This File$`, `^## Starter Requirements$`, `^## Out-of-Scope \(Intentional Non-Goals\)$`, `^## Coverage Table$`
     - features.md: `^## Discoverability Features$`, `^## Invocation Features$`, `^## I/O Features$`, `^## State Features$`, `^## Error Features$`, `^## Exit Code Features$`, `^## Idempotency Features$`, `^## Examples Features$`, `^## Differentiators$`, `^## Anti-Features$`, `^## Cross-Check vs REQUIREMENTS.md$`
     - stack.md: `^## Recommended Stack$`, `^## Alternatives Considered$`, `^## What NOT to Use$`, `^## Open Questions$`
     - architecture.md: `^## Recommended Architecture$`, `^## Data Model Sketch$`, `^## Integration Points$`, `^## Scaling Tier$`, `^## Reversibility Risk$`
     - pitfalls.md: `^## Domain Pitfalls$`, `^## Stack Pitfalls$`, `^## Scope Traps$`, `^## Compliance / Security Gotchas$`, `^## Migration Pitfalls$`
   - **R006 axis tag coverage in requirements.md:** for n in 1 2 3 4 5 6 7 8, `grep -q "Axis: $n"` or `grep -q "Axis $n "` skills/agent-first-cli/references/requirements.md — at least one of the two must succeed for each n. Use two separate grep calls per n to avoid shell-pipe alternation.
   - **R013 stable axis IDs:** assert no `axis-[0-9]` anchors and no `references/[a-z]+\.md#` deep links in any of the 5 files. Use `grep -q 'axis-[0-9]'` per file and `grep -q 'references/[a-z]*\.md#'` per file — each must return empty (use `! grep ...` to invert).
   - **R011 no .gsd/ write instructions:** for each file, run a sharpened grep (per S02-T04's lesson — avoid false positives on prohibition prose). Use a regex that requires an imperative verb before `.gsd/`: `grep -nE '(create|write|save|append|update|modify|edit)[^\.]*\.gsd/' FILE` must be empty. Prose like "do not write to .gsd/" is allowed.
   - **R012 no gsd-pi coupling tokens:** for each file, separately grep for `/gsd-`, `gsd_[a-z]`, `gsd\.db`, `gsd-pi` — each must be empty.
   - **AGENTS.md reference in requirements.md:** `grep -q 'AGENTS.md' skills/agent-first-cli/references/requirements.md` must succeed (≥1 reference by role).
   - **Cross-Check section in features.md:** `grep -q '^## Cross-Check vs REQUIREMENTS.md$' skills/agent-first-cli/references/features.md` must succeed AND the section must contain `R00` (starter R### IDs).
   - **Coverage Table rows in requirements.md:** count rows matching `^| Axis [0-9]` — must be ≥ 8.
   - **Pitfalls count in pitfalls.md:** count `^### Pitfall:` occurrences — must be ≥ 8.
   - **Length budget (soft, informational):** `wc -l` on each file — log the count; flag if any file exceeds 250 lines but do not fail the task.
2. Aggregate the results into a single pass/fail line per check, with a final summary line at the top: "S03 verification: PASSED N/M checks" or "FAILED N/M checks". Write the full log to a file the executor captures as verification evidence.
3. If any hard check fails, fix the offending reference file and re-run the battery. Hard checks: existence, R005 shape, R006 axis tag coverage, R013 stable IDs, R011, R012, AGENTS.md reference, Cross-Check, Coverage Table rows, Pitfalls count. Soft checks (length budget) are informational only.

Done when: every hard check passes; the gsd_exec stdout shows "S03 verification: PASSED" with all hard-check counts matching; soft length-budget counts are logged.

## Inputs

- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/requirements.md`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/features.md`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/stack.md`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/architecture.md`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/pitfalls.md`

## Expected Output

- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/requirements.md`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/features.md`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/stack.md`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/architecture.md`
- `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/pitfalls.md`

## Verification

test -f skills/agent-first-cli/references/requirements.md

## Observability Impact

The verification battery itself is the observability surface for S03's contract — it's the same shape S04's validate/verify will follow when reporting per-axis pass/fail to users of the skill.
