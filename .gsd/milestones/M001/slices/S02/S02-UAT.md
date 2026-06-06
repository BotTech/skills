# S02: SKILL.md + AGENTS.md + CLAUDE.md + sub-command routing — UAT

**Milestone:** M001
**Written:** 2026-06-06T04:59:40.650Z

# S02 UAT — SKILL.md + AGENTS.md + CLAUDE.md + sub-command routing

**UAT Type:** Contract / static-content (no runtime behavior to exercise; this is a routing surface + enforcement contract slice).

**Preconditions:**
- Working directory is the M001 worktree: `/Users/jason/src/bottech/skills/.gsd/worktrees/M001`.
- Files exist at `skills/agent-first-cli/SKILL.md`, `AGENTS.md`, `CLAUDE.md`.
- An agent harness that loads `SKILL.md` files (any of: GSD/pi, Cursor, Codex, Claude Code).

---

## UAT-01: SKILL.md is the routing surface — 7 sub-commands load 1 reference each

**Steps:**
1. Read `skills/agent-first-cli/SKILL.md`.
2. Count routing-table rows whose first column matches `agent-first-cli <sub>`.
3. For each sub-command in {stack, features, architecture, pitfalls, requirements, validate, verify}:
   - Confirm the row exists.
   - Confirm the second column references exactly one `references/<sub>.md` file.

**Expected outcomes:**
- Exactly 7 routing rows.
- Each row's "What it loads" column contains exactly one `references/...md` path; no row references two files.
- `eval.md` is mentioned but is NOT a sub-command row (called out as shared spine below the table).

**Edge cases:**
- A sub-command is missing → UAT fails (regression in routing table).
- A row points to two reference files → UAT fails (violates progressive disclosure).

---

## UAT-02: SKILL.md respects size and shape budgets

**Steps:**
1. `wc -l skills/agent-first-cli/SKILL.md`.
2. Read first 5 lines; confirm YAML frontmatter open.
3. Grep for `^name:`, `^description:`, `^argument-hint:`.

**Expected outcomes:**
- Line count ≤ 100 (actual: 45).
- YAML frontmatter present with `name: agent-first-cli`, `description:` containing trigger phrases, `argument-hint:` enumerating all 7 sub-commands.
- `metadata.version` present.

**Edge cases:**
- Line count drifts above 100 as content lands → UAT fails (R010 violation).
- YAML frontmatter missing → UAT fails (skill-loader contract broken).

---

## UAT-03: AGENTS.md is the enforcement contract — strict bidirectional rule

**Steps:**
1. Read `skills/agent-first-cli/AGENTS.md`.
2. Locate the "Strict Bidirectional Coverage Rule" section.
3. Confirm two reading tables: axis→R### (top-down) and R###→axis (bottom-up).
4. Grep for "out-of-scope", "orphan", "is an error".
5. Grep for `axis[[:space:]]*[1-8]` enumeration.

**Expected outcomes:**
- File ≤ 50 lines (actual: 33).
- Single rule declared once; both reading tables present.
- Strict voice ("is an error", not "is a warning") at least once.
- The literal list of 8 axes is NOT in this file (lives in references/eval.md).
- No XML tags; no YAML frontmatter (plain markdown only).

**Edge cases:**
- File grows past 50 lines → UAT fails (must-have budget).
- Axes enumerated inline → UAT fails (would diverge from references/eval.md).

---

## UAT-04: CLAUDE.md is a working relative symlink

**Steps:**
1. `test -L skills/agent-first-cli/CLAUDE.md` → expect true.
2. `readlink skills/agent-first-cli/CLAUDE.md` → expect `AGENTS.md` (relative, not absolute).
3. `diff -q skills/agent-first-cli/CLAUDE.md skills/agent-first-cli/AGENTS.md` → expect exit 0.
4. `cat skills/agent-first-cli/CLAUDE.md | head -1` → expect `# AGENTS.md — agent-first-cli`.

**Expected outcomes:**
- Symlink exists, target is relative (`AGENTS.md`, not `/abs/path/AGENTS.md`).
- Content reads identically to AGENTS.md.

**Edge cases:**
- Someone replaces symlink with a regular file → UAT fails (drift between Claude Code and other harnesses).
- Symlink target becomes absolute path → UAT fails (breaks across machines / clone paths).

---

## UAT-05: R011 boundary — no .gsd/ write instructions

**Steps:**
1. `grep -nE "(create|write|save|append|update|modify|edit)[^.]*\.gsd/" skills/agent-first-cli/{SKILL,AGENTS}.md | grep -viE "never (write|author|mutate|create)|no \.gsd/ write|not.*write|don.t.*write|must not.*write|skill.*never|never.*\.gsd"`
2. Expect empty output.

**Expected outcomes:**
- No imperative verbs instructing the agent to write/create/save anything under `.gsd/`.
- Prohibitions and negative success criteria ("No .gsd/ writes from this skill") are allowed and expected.

**Edge cases:**
- Future S03/S04 reference files introduce a write instruction → UAT fails (R011 violation; that content does not belong in this skill).

---

## UAT-06: R012 boundary — no gsd-pi coupling tokens

**Steps:**
1. `grep -nE "/gsd-" skills/agent-first-cli/{SKILL,AGENTS}.md` → expect empty.
2. `grep -nE "gsd_" skills/agent-first-cli/{SKILL,AGENTS}.md` → expect empty.
3. `grep -nE "gsd\.db" skills/agent-first-cli/{SKILL,AGENTS}.md` → expect empty.
4. `grep -nE "gsd-pi" skills/agent-first-cli/{SKILL,AGENTS}.md` → expect empty.

**Expected outcomes:**
- No matches for any of the four patterns.
- The skill remains harness-agnostic (loads cleanly in Cursor, Codex, or any non-pi harness).

**Edge cases:**
- A future edit adds an `/gsd-foo` slash command path → UAT fails (couples skill to pi).

---

## UAT-07: Sub-command names are stable strings downstream slices can grep for

**Steps:**
1. For each sub-command `<sub>` in {stack, features, architecture, pitfalls, requirements, validate, verify}:
   - `grep -cE "agent-first-cli[[:space:]]+<sub>\b" skills/agent-first-cli/SKILL.md` → expect ≥ 1.
2. Same loop for `references/<sub>.md` mentions in SKILL.md → expect ≥ 1 each.

**Expected outcomes:**
- All 7 sub-commands appear in SKILL.md with the canonical `agent-first-cli <sub>` form.
- All 7 reference filenames appear in SKILL.md.
- S03/S04/S06 can grep for these exact strings without false positives.

**Edge cases:**
- Sub-command gets renamed piecemeal → UAT fails (downstream slices will author the wrong filenames).

---

## Summary

If all 7 UATs pass, S02 has delivered its contract: a routing surface, an enforcement contract, and a Claude Code compatibility shim — with no reference content, no runtime behavior, and no harness coupling. S03, S04, and S06 can proceed against these stable names.
