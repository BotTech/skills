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
| [gsd-new-cli-project](./skills/gsd-new-cli-project/) | Initialize a new CLI project with agent-first design context. Wraps `/gsd-new-project` and injects domain-specific guidance for the 4 parallel research agents (Stack, Features, Architecture, Pitfalls) based on the Agent DX CLI Scale framework. | Starting a new CLI project, creating a command-line tool, or whenever CLI + GSD is mentioned. |

## Adding Skills

To add a new skill to this repository:

1. Create a new directory under `skills/`
2. Add a `SKILL.md` file with the skill definition
3. Update this README with the skill information
