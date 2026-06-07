# Setup — Initialization Cues for This Skill

This is the initialization spec for the agent-first-cli skill. An agent (human or LLM) loads this file once, the first time the skill is invoked in a project, and writes a small set of integration cues into the host project so subsequent invocations route correctly without re-running setup. The cues are written inside a stable marker comment block so re-runs are idempotent. The procedure is harness-aware: it detects whether the host project is a GSD project (`.gsd/PREFERENCES.md` present locally or at `~/.gsd/PREFERENCES.md`) and writes GSD-specific cues in that case; otherwise it writes universal cues into `AGENTS.md`. The skill never invokes harness-specific slash commands or tool calls; it produces text the agent inserts via normal file editing.

## Universal

The universal cues are written to `AGENTS.md` at the project root. If `AGENTS.md` does not exist, create it. The cues go inside a marker block so re-runs can detect prior init:

```
<!-- agent-first-cli begin -->
When working on a CLI in this project, invoke the `agent-first-cli` skill at these points:

| Phase | What to run | Why |
|---|---|---|
| Research | `agent-first-cli stack`, then `features`, then `architecture`, then `pitfalls` | Load tech-stack, feature-surface, module-boundary, and risk guidance before designing |
| Plan | `agent-first-cli requirements` | Seed R###s with axis tags in REQUIREMENTS.md |
| Execute | (no invocation; the references are read-only) | Implementation proceeds without skill-side writes |
| Complete | `agent-first-cli validate`, then `verify` | Check plan coverage, then built-CLI coverage against the 8-axis rubric |

Each sub-command loads exactly one reference file. The skill never writes to `.gsd/`.
<!-- agent-first-cli end -->
```

After writing, the agent proceeds to whatever sub-command the user originally requested.

## GSD

When the host project is a GSD project (`.gsd/PREFERENCES.md` or `~/.gsd/PREFERENCES.md` exists), also append the following block to `.gsd/PREFERENCES.md` (creating the file at the project root if it does not exist and the home file is the only one present is not required; prefer writing at the project root when present). The block sits inside the same marker pair so a future `setup --force` can find and replace it:

```yaml
# <!-- agent-first-cli begin -->
always_use_skills:
  - agent-first-cli
skill_rules:
  - when: research-milestone
    then: agent-first-cli stack
  - when: plan-milestone
    then:
      - agent-first-cli features
      - agent-first-cli architecture
      - agent-first-cli pitfalls
      - agent-first-cli requirements
  - when: plan-slice
    then: agent-first-cli requirements
  - when: execute-task
    then: null
  - when: complete-slice
    then:
      - agent-first-cli validate
      - agent-first-cli verify
  - when: validate-milestone
    then: agent-first-cli verify
# <!-- agent-first-cli end -->
```

The phase names (`research-milestone`, `plan-milestone`, `plan-slice`, `execute-task`, `complete-slice`, `validate-milestone`) match GSD's auto-dispatch phase names exactly so GSD can dispatch this skill automatically at each phase. `execute-task` carries `then: null` to make the no-invocation rule explicit and machine-readable.

## Force re-init

`agent-first-cli setup --force` bypasses the marker check. The agent locates the existing `<!-- agent-first-cli begin --> ... <!-- agent-first-cli end -->` block (in both `AGENTS.md` and, when present, the GSD preferences file) and replaces its contents with the snippets above. Without `--force`, an existing marker block causes setup to skip silently and proceed to the originally requested sub-command. This keeps re-runs idempotent and lets users explicitly refresh cues after upgrading the skill.
