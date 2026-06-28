# BotTech Skills

A collection of custom agent skills.

## Installation

Run:

```bash
npx skills add https://github.com/bottech/skills
```

## About

This repository contains custom skills that extend Claude Code's capabilities. Each skill is a self-contained module with a `SKILL.md` file that defines its behavior, triggers, and documentation.

## Skills Index

| Skill | Description | Trigger |
|-------|-------------|---------|
| [agent-first-cli](./skills/agent-first-cli/) | Design, validate, and verify agent-first command-line interfaces. Research/planning + plan-mode and impl-mode checks against the 8 agent-first axes (discoverability, invocation, I/O, state, errors, exit codes, idempotency, examples). | "agent-first CLI", "new CLI project", "refactor this CLI for LLM use", "score my CLI", "validate my CLI plan", "verify my CLI build". |

## Sample asset

The `agent-first-cli` skill ships a sample CLI under `skills/agent-first-cli/assets/samples/gitignorer/`. This directory is a git submodule pointing at [BotTech/gitignore](https://github.com/BotTech/gitignore).

**If you cloned this repo directly:**

```bash
git clone --recurse-submodules https://github.com/bottech/skills.git
# or, for an existing clone:
git submodule update --init --recursive
```

**If you installed via `npx skills add`** (which uses a shallow, non-recursive clone), initialize the sample manually:

```bash
git clone --depth 1 https://github.com/BotTech/gitignore.git ~/.agents/skills/agent-first-cli/assets/samples/gitignorer
```

(Adjust the destination path if your `npx skills` install location differs.)
