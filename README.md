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
| [agent-dx-cli-eval](./skills/agent-dx-cli-eval/) | Evaluate any CLI against agent-first design principles. Score 8 axes (0-3 each) for a total of 0-24: Machine-Readable Output, Raw Payload Input, Schema Introspection, Context Window Discipline, Input Hardening, Safety Rails, Agent Knowledge Packaging, and Multi-Surface Architecture. Includes verification steps and structured output format. | "evaluate this CLI", "agent dx score", "is this cli agent-ready", "cli agent review", or when assessing CLI quality for AI agents. |
| [gsd-new-cli-project](./skills/gsd-new-cli-project/) | Initialize a new CLI project with agent-first design context. Wraps `/gsd-new-project` and injects domain-specific guidance for the 4 parallel research agents (Stack, Features, Architecture, Pitfalls) based on the Agent DX CLI Scale framework. | Starting a new CLI project, creating a command-line tool, or whenever CLI + GSD is mentioned. |
| [timesheet](./skills/timesheet/) | Manage weekly timesheets in Google Sheets with NZ public holiday tracking. Per-day breakdown of work, PTO, holiday, and unpaid hours. Cumulative totals and remaining balances. | "timesheet", "fill timesheet", "record PTO", "record leave", "update hours", "check hours", "PTO remaining", "holiday balance". |
