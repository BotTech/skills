---
id: T05
parent: S03
milestone: M001
key_files:
  - skills/agent-first-cli/references/pitfalls.md
key_decisions:
  - Placed Blocking I/O and Mixed output formats under Stack Pitfalls (not Domain) per the canonical GSD PITFALLS.md template semantics — they are stack-level (sync vs async I/O, stream discipline) failures rather than domain failures.
  - Extended the plan's minimum 8 pitfalls with Axis 2 tagging on 'Examples and schemas that lie' (lying schemas directly break --input json invocation) so every axis 1-8 is threatened by at least one pitfall, satisfying the slice demo's 'all 8 axes' requirement.
  - Kept the source SKILL.md's security posture quote and 4 validation function names verbatim in the 'Missing input validation' pitfall — these are the load-bearing references S04 verify will cite when checking Axis 5 coverage.
duration: 
verification_result: passed
completed_at: 2026-06-06T05:28:22.566Z
blocker_discovered: false
---

# T05: Authored pitfalls.md with 8 axis-tagged pitfalls covering all 8 axes (1-8), 4-field prose blocks, and Migration marked N/A for greenfield.

**Authored pitfalls.md with 8 axis-tagged pitfalls covering all 8 axes (1-8), 4-field prose blocks, and Migration marked N/A for greenfield.**

## What Happened

Created skills/agent-first-cli/references/pitfalls.md (17,951 bytes) shape-matching the GSD PITFALLS.md template. The file has the required 5 ## headers in order (Domain Pitfalls, Stack Pitfalls, Scope Traps, Compliance / Security Gotchas, Migration Pitfalls) under one # header. 8 ### Pitfall: entries each use the 4-field block format (What goes wrong / Why it happens / How to avoid / Warning signs).

Content lifted the seed-5 pitfalls verbatim from ~/.agents/skills/gsd-new-cli-project/SKILL.md `<context research_type="pitfalls">` block (Blocking I/O, Mixed output formats, Missing input validation, Missing response sanitization, No dry-run) and extended with 3 more (Examples and schemas that lie, Exit code drift across commands, Non-idempotent cache or side effects) to cover all 8 axes. The "Missing input validation" pitfall preserves the four canonical validation function names (validate_safe_output_dir, reject_control_chars, validate_resource_name, encode_path_segment) and the security posture quote "The agent is not a trusted operator."

Axis coverage (verified): Axis 1 (Examples/schemas that lie), Axis 2 (also tied to Examples/schemas since agents construct --input json from the exported schema), Axis 3 (Blocking I/O; Mixed output formats), Axis 4 (Non-idempotent cache), Axis 5 (Mixed output formats; Missing input validation; Missing response sanitization), Axis 6 (Exit code drift), Axis 7 (Non-idempotent cache; No dry-run), Axis 8 (Examples/schemas that lie). Every How to avoid field contains at least one Axis: N tag per R013.

Section distribution: Domain=1, Stack=2, Scope=3, Compliance/Security=2, Migration=N/A prose (one paragraph explaining the dominant migration pitfall for refactoring existing CLIs, marked N/A for greenfield). Each Warning signs field is a comma-separated observable-symptom list that becomes the failure-symptom checklist S04's verify report cites. Prohibitions stated semantically per MEM014 (no re-stating of forbidden tokens like "CLAUDE.md" or "harness-agnostic"). Cross-references use stable axis IDs ("Axis: N", "see references/eval.md", "gitignorer sample's src/schema/errors.ts") per R013/R011/R012.

## Verification

Verified via shell checks: (1) `test -f skills/agent-first-cli/references/pitfalls.md` → exists, 17951 bytes. (2) H1 grep `^# Pitfalls — Agent-First CLI$` → 1 match. (3) Section header grep `^## ` returns 5 headers in exact order: Domain Pitfalls, Stack Pitfalls, Scope Traps, Compliance / Security Gotchas, Migration Pitfalls. (4) Pitfall count `^### Pitfall:` = 8. (5) Each of the 4 prose fields (What goes wrong, Why it happens, How to avoid, Warning signs) appears exactly 8 times. (6) awk walk over each `### Pitfall:` block verifies every `**How to avoid:**` line contains `Axis[: ]+[0-9]` — all 8 tagged. (7) Union of axis numbers across all `How to avoid` fields = {1,2,3,4,5,6,7,8} — all 8 axes covered. (8) `sed -n '/^## Migration Pitfalls/,$p'` includes the literal "N/A for greenfield" marker exactly once.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `test -f skills/agent-first-cli/references/pitfalls.md && wc -c <FILE>` | 0 | ✅ pass | 12ms |
| 2 | `grep -c '^# Pitfalls — Agent-First CLI$' <FILE>` | 0 | ✅ pass — H1 present exactly once | 8ms |
| 3 | `grep '^## ' <FILE>` | 0 | ✅ pass — 5 ## headers in order: Domain Pitfalls, Stack Pitfalls, Scope Traps, Compliance / Security Gotchas, Migration Pitfalls | 9ms |
| 4 | `grep -c '^### Pitfall:' <FILE>` | 0 | ✅ pass — 8 pitfalls | 7ms |
| 5 | `grep -c '^\*\*What goes wrong:\*\*' / '^\*\*Why it happens:\*\*' / '^\*\*How to avoid:\*\*' / '^\*\*Warning signs:\*\*' <FILE>` | 0 | ✅ pass — each of 4 fields = 8 (one per pitfall) | 11ms |
| 6 | `awk '/^### Pitfall:/{name=$0} /^\*\*How to avoid:\*\*/{if($0 ~ /Axis[: ]+[0-9]/){print "OK",name}else{print "FAIL",name}}' <FILE>` | 0 | ✅ pass — all 8 pitfalls tag at least one axis in How to avoid | 15ms |
| 7 | `grep '^\*\*How to avoid:\*\*' <FILE> | grep -oE 'Axis:?\s*[0-9]' | grep -oE '[0-9]' | sort -nu` | 0 | ✅ pass — axes {1,2,3,4,5,6,7,8} all covered | 13ms |
| 8 | `sed -n '/^## Migration Pitfalls/,$p' <FILE> | grep -c 'N/A for greenfield'` | 0 | ✅ pass — Migration section marked N/A for greenfield | 10ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `skills/agent-first-cli/references/pitfalls.md`
