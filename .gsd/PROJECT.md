# Project

## What This Is

`bottech/skills` is a personal library of reusable agent skills, installable via `npx skills add https://github.com/bottech/skills`. Skills ship as `SKILL.md` files consumed by any agent harness that loads them (Claude Code, Cursor, Codex, etc.). The repo also carries a `.gsd/` workspace for managing its own development under the GSD methodology.

## Core Value

Ship high-signal, harness-agnostic agent skills that work across the agent ecosystem — not tied to any specific harness (gsd-pi or otherwise).

## Project Shape

- **Complexity:** complex
- **Why:** Skills touch multiple agent harnesses (GSD methodology, Claude Code conventions, generic SKILL.md consumers), enforce a bidirectional traceability rule between axes and requirements, and must produce content that is shape-compatible with GSD's artifact templates. Multiple integration surfaces with cross-cutting concerns.

## Current State

Three skills exist in `skills/`:

- `agent-dx-cli-eval` — 8-axis (0–3 each, total /24) scoring rubric for evaluating any CLI against agent-first design principles.
- `gsd-new-cli-project` — Wrapper that injects CLI-specific context into GSD's `/gsd new-project` deep-mode research flow. Currently broken: instructs the agent to invoke a non-existent `/gsd-new-project` slash command.
- `timesheet` — Google Sheets timesheet skill (unrelated to this milestone).

Symlinked third-party skills (`docx`, `pdf`, `xlsx`, etc.) are managed by `skills-lock.json` and not in scope.

## Architecture / Key Patterns

- **Distribution:** GitHub repo at `git@github.com:BotTech/skills.git`, installed via `npx skills add`.
- **Skill shape:** each skill is a directory under `skills/` containing `SKILL.md` plus optional `references/`, `assets/`, `AGENTS.md` (with `CLAUDE.md` symlink for Claude Code compatibility).
- **Harness posture:** skills are pure content — no executable code, no `.gsd/` writes from within the skill itself. The skill provides context and reads/validates; the host agent harness does the writing.
- **gsd-core vs gsd-pi:** `gsd-core` is the methodology (templates, phases, artifact shapes — agent-harness-agnostic). `gsd-pi` is this specific harness (Node CLI, TUI, slash commands, DB-backed state machine). Skills in this repo target `gsd-core` so they work in any harness.

## Capability Contract

See `.gsd/REQUIREMENTS.md` for the explicit capability contract, requirement status, and coverage mapping.

## Milestone Sequence

- [ ] M001: Agent-First CLI Skill — merge the two CLI skills into one (`agent-first-cli`), with 7 sub-commands, strict axis↔requirement traceability, and a real reference implementation as a git submodule.
