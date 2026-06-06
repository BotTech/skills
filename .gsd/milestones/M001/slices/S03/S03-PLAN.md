# S03: Reference content: stack, features, architecture, pitfalls, requirements

**Goal:** Author 5 reference files in skills/agent-first-cli/references/ (stack.md, features.md, architecture.md, pitfalls.md, requirements.md) that (a) shape-match their target GSD templates, (b) tag content with stable Axis 1..Axis 8 IDs per R013, and (c) ship starter R###s in requirements.md with `Axis: N` Notes tags that S04's validate/verify will consume.
**Demo:** 5 reference files in references/ (stack.md, features.md, architecture.md, pitfalls.md, requirements.md); each file's section headers match its target GSD template; requirements.md includes starter R###s with Axis: N tags; cross-references use stable axis IDs.

## Must-Haves

- All 5 reference files exist at skills/agent-first-cli/references/{stack,features,architecture,pitfalls,requirements}.md.\n- Each file's top-level section headers match its target GSD template's headers verbatim (R005).\n- requirements.md ships ≥8 starter R###s in GSD-template block format, each carrying an `Axis: N` Notes tag; the 8 axes (1..8) all appear at least once (R006).\n- Every axis cross-reference across all 5 files uses the form `Axis N` or `Axis: N` (R013); no `#axis-N` anchors, no `references/eval.md#axis-4` deep links.\n- No file contains imperative `.gsd/` write instructions (R011) or gsd-pi coupling tokens (R012). Prohibitions are stated semantically per MEM014.\n- requirements.md references AGENTS.md by role at least once (\"per AGENTS.md\" or \"see AGENTS.md\") without restating the strict rule.\n- features.md contains the `## Cross-Check vs REQUIREMENTS.md` section mapping P0 features to starter R### IDs.\n- pitfalls.md contains all 8 required pitfalls (one per axis threat pairing).\n- Each reference file is ≤ 250 lines (soft budget; verified but not blocking).

## Proof Level

- This slice proves: contract — files exist with the exact section headers required by GSD templates, axis tags appear in every reference, and a forbidden-token gate (R011/R012) plus stable-axis-ID lint (R013) all pass. No runtime behavior to verify; S04/S05 will exercise the content.

## Integration Closure

Upstream surfaces consumed: SKILL.md sub-command routing (S02), AGENTS.md strict bidirectional rule (S02), .gitmodules for gitignorer sample (S01). New wiring introduced: 5 reference files that S04's eval.md/validate.md/verify.md will read; references cross-cite each other by stable axis ID, not deep link. What remains before M001 is end-to-end usable: S04 (validate/verify/eval), S05 (asset verification mapping), S06 (repo README + skills-lock).

## Verification

- None — this slice ships static reference content only; no runtime, no errors, no metrics. The 5 files do define what S04's validate/verify report format will look like (per-axis status + evidence), which becomes observability for skill users running validate/verify in their own projects.

## Tasks

- [x] **T01: Author requirements.md (starter R###s with Axis tags)** `est:45m`
  Why: requirements.md is the riskiest deliverable in S03 — S04's validate/verify consumes the `Axis: N` tags directly, and features.md's `## Cross-Check vs REQUIREMENTS.md` section reads from this file. Authoring it first surfaces axis-coverage gaps before any other file is touched.
  - Files: `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/requirements.md`
  - Verify: test -f skills/agent-first-cli/references/requirements.md

- [ ] **T02: Author features.md (8 axis-aligned feature tables + cross-check)** `est:45m`
  Why: features.md is the densest file (8 axis-aligned feature tables plus differentiators and anti-features). It cross-references the starter R### IDs from T01's requirements.md, so it must run after T01. The `## Cross-Check vs REQUIREMENTS.md` section is the structural bridge between "what features the agent-first CLI ships" and "what requirements trace to those features."
  - Files: `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/features.md`
  - Verify: test -f skills/agent-first-cli/references/features.md

- [x] **T03: Author stack.md (Recommended Stack + What NOT to Use)** `est:30m`
  Why: stack.md is the simplest file in S03 — short, table-driven, and lift-able almost verbatim from gitignorer's STACK.md plus the source gsd-new-cli-project SKILL.md `<context research_type="stack">` block. Independent of T02/T04/T05 — runs in any order against them. The stack choices directly enable Axis 2 (invocation needs a JSON-aware CLI framework), Axis 3 (I/O needs NDJSON library + async I/O), and Axis 5 (errors need an error-serialization story).
  - Files: `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/stack.md`
  - Verify: test -f skills/agent-first-cli/references/stack.md

- [ ] **T04: Author architecture.md (component table + data flow)** `est:40m`
  Why: architecture.md shape-matches GSD's ARCHITECTURE.md template and lifts the component table verbatim from the source gsd-new-cli-project SKILL.md `<context research_type="architecture">` block. It owns the structural contract for how an agent-first CLI's components divide axis responsibilities — every component row tags which axis(es) it owns. Independent of T03/T05.
  - Files: `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/architecture.md`
  - Verify: test -f skills/agent-first-cli/references/architecture.md

- [ ] **T05: Author pitfalls.md (8 pitfalls covering all 8 axes)** `est:35m`
  Why: pitfalls.md shape-matches GSD's PITFALLS.md template and lifts the 5-pitfall seed set from gsd-new-cli-project SKILL.md `<context research_type="pitfalls">` block, then extends to 8 pitfalls so every axis has at least one pitfall that threatens it. Independent of T03/T04 — runs in any order against them.
  - Files: `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/pitfalls.md`
  - Verify: test -f skills/agent-first-cli/references/pitfalls.md

- [ ] **T06: Run S03 verification battery (shape, axis tags, R011/R012/R013 gates)** `est:30m`
  Why: S03's contract is mechanical — every file has shape requirements, every axis needs tags, every forbidden-token gate must pass. This task runs the full battery as a single bash script via gsd_exec and reports pass/fail per check. It does not produce new files; it produces a verification log that future slices (S04, S05) can point at as proof S03's content is sound.
  - Files: `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/requirements.md`, `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/features.md`, `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/stack.md`, `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/architecture.md`, `/Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/pitfalls.md`
  - Verify: test -f skills/agent-first-cli/references/requirements.md

## Files Likely Touched

- /Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/requirements.md
- /Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/features.md
- /Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/stack.md
- /Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/architecture.md
- /Users/jason/.gsd/projects/0809305c93fd/worktrees/M001/skills/agent-first-cli/references/pitfalls.md
