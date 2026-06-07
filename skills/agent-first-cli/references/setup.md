# Setup — Re-Invocation Cues

`setup` is the only sub-command that writes anything. It writes re-invocation cues into exactly one target file so future phases auto-route back to the right sub-commands. The skip-signal `${agent-first-cli:setup-complete} = true` lives inside the cues — once it's in the target file, setup is a no-op until `--force`.

## How setup picks the target

<detect_harness>
  if exists("<project-root>/.gsd/PREFERENCES.md") OR exists("~/.gsd/PREFERENCES.md"):
    ${harness} = "gsd"
    ${target} = the .gsd/PREFERENCES.md that was found (project root preferred over home)
  else:
    ${harness} = "universal"
    ${target} = "<project-root>/AGENTS.md"
</detect_harness>

The probe is a pure file-existence check. It does not parse file contents. Presence of either preferences file means the host has opted into GSD; absence means Universal.

## What setup writes

The branches are mutually exclusive. Pick one. Never both.

### GSD branch

Target: the discovered `.gsd/PREFERENCES.md`. Merge into the existing file — do **not** rewrite it, do **not** touch `AGENTS.md`.

<merge targets="always_use_skills, custom_instructions">
  always_use_skills:
    — append `agent-first-cli` if not already present

  custom_instructions:
    — append the block below if no existing list item contains `<agent-first-cli>`
    — on `--force`, replace the existing `<agent-first-cli>...</agent-first-cli>` list item with the block below
</merge>

Snippet to merge into `custom_instructions` (one list item, YAML literal block scalar `|-`):

```yaml
  - |-
    <agent-first-cli>
    ${agent-first-cli:setup-complete} = true
    Run these commands at the matching phase:
      - `agent-first-cli stack` — at research-milestone: tech-stack guidance before designing
      - `agent-first-cli features` — at plan-milestone: scope the agent-first feature surface
      - `agent-first-cli architecture` — at plan-milestone: module boundaries
      - `agent-first-cli pitfalls` — at plan-milestone: risks (streaming, pipes, exit codes)
      - `agent-first-cli requirements` — at plan-milestone or plan-slice: seed R###s with axis tags
      - `agent-first-cli validate` — at complete-slice: check axis coverage against the plan
      - `agent-first-cli verify` — at complete-slice or validate-milestone: check built CLI against the 8-axis rubric
    Each command loads one reference file from references/.
    </agent-first-cli>
```

Phase names (`research-milestone`, `plan-milestone`, `plan-slice`, `complete-slice`, `validate-milestone`) match GSD's auto-dispatch phase names. `execute-task` is intentionally absent — the skill's references are read-only and add nothing during task execution.

### Universal branch

Target: `<project-root>/AGENTS.md` (create if absent). Do **not** touch `.gsd/` anywhere — not at the project root, not in the user's home directory.

Append the block below. If `--force` and the block already exists, replace it.

```markdown
<agent-first-cli>
${agent-first-cli:setup-complete} = true

Run these commands when working on a CLI in this project:

- `agent-first-cli stack` — at research: tech-stack guidance before designing
- `agent-first-cli features` — at plan: scope the agent-first feature surface
- `agent-first-cli architecture` — at plan: module boundaries
- `agent-first-cli pitfalls` — at plan: risks (streaming, pipes, exit codes)
- `agent-first-cli requirements` — at plan: seed R###s with axis tags in REQUIREMENTS.md
- `agent-first-cli validate` — at complete: check axis coverage against plan artifacts
- `agent-first-cli verify` — at complete or validate: check built CLI against the 8-axis rubric

Each command loads one reference file from `references/`.
</agent-first-cli>
```

Universal phase names (research / plan / complete / validate) are deliberately generic — non-GSD harnesses do not share GSD's milestone/slice phase vocabulary.

## Idempotency

<skip-check>
  if the chosen target file contains the literal string `${agent-first-cli:setup-complete} = true`:
    skip setup (it has already run)
  else:
    run setup
</skip-check>

The `<agent-first-cli>` XML wrapper around the skip-signal gives setup a structural anchor for `--force` replacement: find the list item (GSD) or block (Universal) starting with `<agent-first-cli>` and replace everything through `</agent-first-cli>`.

## Force re-init

`agent-first-cli setup --force` bypasses the skip-check on the chosen branch's target only. The branch decision is still made — `--force` does not cause both branches to run. If the host has switched harness types since the last setup (e.g. added `.gsd/PREFERENCES.md` later), the previous Universal-branch block in `AGENTS.md` is **not** removed by `--force`; clean it up manually.

## What was fixed and why

Previous versions described setup as "Universal only, or Universal + GSD" — implying both files get written in GSD projects — in the same breath as "do not write under `.gsd/`" — forbidding the GSD branch entirely. Both phrasings were bugs:

- The GSD branch **must** write under `.gsd/` (the whole point is to put cues in the GSD preferences file).
- The Universal branch **must not** write under `.gsd/` (the host is not a GSD project).
- The two branches are **mutually exclusive**, not additive.

This file makes the branching model explicit: probe once, pick one branch, merge into one target. The `<agent-first-cli>` skip-signal inside the cues is the single source of truth for "has setup already run."
