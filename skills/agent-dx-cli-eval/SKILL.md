---
name: agent-dx-cli-eval
description: Evaluate any CLI against agent-first design principles. Score 8 axes (0-3 each), total 0-24. Use when assessing CLI readiness for AI agents, validating requirements, or reviewing implementation quality. Trigger on: "evaluate this CLI", "agent dx score", "is this cli agent-ready", "cli agent review".
argument-hint: "<cli-path-or-name>"
compatibility:
  - CLI
  - Agent
---

# Agent DX CLI Evaluation

Evaluate any CLI against agent-first design principles. Score each axis from 0–3, then sum for a total between 0–24.

> Human DX optimizes for discoverability and forgiveness.
> Agent DX optimizes for predictability and defense-in-depth.
> — Justin Poehnelt

## Evaluation Process

1. **Explore the CLI** — Run `--help`, examine source/docs, test key commands
2. **Score each axis** — Use criteria tables below, document evidence
3. **Calculate total** — Sum all 8 axes for final score
4. **Identify gaps** — Note which axes scored lowest and why
5. **Recommend improvements** — Map gaps to specific actionable changes

---

## Scoring Axes

### Axis 1: Machine-Readable Output

Can an agent parse the CLI's output without heuristics?

| Score | Criteria | Evidence to Look For |
| ----- | -------- | ------------------- |
| 0 | Human-only output (tables, colors, prose) | Tables, ANSI codes, mixed text/data |
| 1 | `--output json` exists but incomplete/inconsistent | Some commands lack JSON flag |
| 2 | Consistent JSON across all commands, errors structured | All commands support `--output json`, errors are JSON |
| 3 | NDJSON streaming, JSON default in non-TTY | `--output ndjson`, auto-detects pipes, stdout=data only |

**Verification steps:**
```bash
cli command --output json  # Check if exists
cli command 2>&1 | cat     # Check if non-TTY yields JSON
cli invalid-command        # Check error format
```

---

### Axis 2: Raw Payload Input

Can an agent send the full API payload without bespoke flag translation?

| Score | Criteria | Evidence to Look For |
| ----- | -------- | ------------------- |
| 0 | Only bespoke flags, no structured input | 10+ flags required for complex operations |
| 1 | `--json` or stdin JSON for some commands | Inconsistent support across commands |
| 2 | All mutating commands accept raw JSON payload | Maps directly to underlying API schema |
| 3 | Raw payload is first-class, documented for agents | Examples show JSON usage, zero translation loss |

**Verification steps:**
```bash
cli command --json '{"key": "value"}'
echo '{"key": "value"}' | cli command
cli examples <command>  # Should show JSON payloads
```

---

### Axis 3: Schema Introspection

Can an agent discover what the CLI accepts at runtime without external docs?

| Score | Criteria | Evidence to Look For |
| ----- | -------- | ------------------- |
| 0 | Only `--help` text, no machine-readable schema | Help text only |
| 1 | `--help --json` or `describe` for some commands | Partial coverage |
| 2 | Full schema introspection for all commands | `schema <resource>`, includes params/types/required |
| 3 | Live runtime-resolved schemas from discovery docs | Includes scopes, enums, nested types, $ref resolution |

**Verification steps:**
```bash
cli schema <resource>        # Check for schema command
cli describe <command>       # Alternative pattern
cli --help --json            # JSON help format
```

---

### Axis 4: Context Window Discipline

Does the CLI help agents control response size to protect their context window?

| Score | Criteria | Evidence to Look For |
| ----- | -------- | ------------------- |
| 0 | Full API responses, no field limits | Large nested JSON returns |
| 1 | `--fields` or field masks on some commands | Inconsistent support |
| 2 | Field masks on all read commands, pagination supported | `--fields`, `--page-all` available |
| 3 | Streaming pagination (NDJSON), explicit guidance | CONTEXT.md says "ALWAYS use --fields" |

**Verification steps:**
```bash
cli list --fields "id,name"      # Field mask support
cli list --page-all              # Pagination mode
cli list | head -1                # Check if streamable
grep -r "ALWAYS use --fields"    # Check for guidance
```

---

### Axis 5: Input Hardening

Does the CLI defend against agent-specific hallucination patterns?

| Score | Criteria | Evidence to Look For |
| ----- | -------- | ------------------- |
| 0 | No input validation beyond type checks | Accepts any string |
| 1 | Validates some inputs, misses agent patterns | Basic validation only |
| 2 | Rejects control chars, `../`, `%2e`, `?`, `#` | Specific patterns rejected |
| 3 | Comprehensive hardening + explicit security posture | "Agent is not trusted operator" in docs |

**Required validations (for score 2+):**
- Control characters (< ASCII 0x20)
- Path traversals (`../`, `..\`)
- Percent-encoded segments (`%2e`, `%2e%2e`)
- Embedded query params (`?`, `#`)
- Output path sandboxing to CWD
- HTTP-layer percent-encoding

**Verification steps:**
```bash
# Test dangerous inputs (use with --dry-run if available)
cli command --id "../../../etc/passwd"
cli command --id "file?fields=name"
cli command --id "file%2e%2e/etc"
cli command --id $'\x00\x01file'

# Check source for validation functions
grep -r "validate" src/
grep -r "sanitize" src/
```

---

### Axis 6: Safety Rails

Can agents validate before acting? Are responses sanitized against prompt injection?

| Score | Criteria | Evidence to Look For |
| ----- | -------- | ------------------- |
| 0 | No dry-run, no response sanitization | Mutating commands execute immediately |
| 1 | `--dry-run` for some mutating commands | Partial coverage |
| 2 | `--dry-run` for all mutating commands | Consistent safety gate |
| 3 | Dry-run + response sanitization | Model Armor, prompt injection defense |

**Verification steps:**
```bash
cli create --dry-run           # Check dry-run exists
cli delete --dry-run --id xyz  # Check on destructive ops
# Check source for sanitization layer
grep -r "sanitize\|armor" src/
```

---

### Axis 7: Agent Knowledge Packaging

Does the CLI ship knowledge in formats agents consume at conversation start?

| Score | Criteria | Evidence to Look For |
| ----- | -------- | ------------------- |
| 0 | Only `--help` and docs site | No agent-specific files |
| 1 | `CONTEXT.md` or `AGENTS.md` with basic guidance | Single context file |
| 2 | Structured skill files per command/surface | YAML frontmatter, invariants encoded |
| 3 | Comprehensive skill library, versioned, discoverable | OpenClaw standard, guardrails encoded |

**What to look for (score 2+):**
- SKILL.md files with YAML frontmatter
- Encoded invariants: "always use --dry-run"
- Per-command or per-API-surface guidance
- Version metadata
- Discovery mechanism (index, manifest)

**Verification steps:**
```bash
find . -name "SKILL.md" -o -name "CONTEXT.md"
find . -name "AGENTS.md"
ls -la skills/  # Check for skill library
```

---

### Axis 8: Multi-Surface Architecture (NEW)

Does the CLI expose multiple agent surfaces from the same binary?

| Score | Criteria | Evidence to Look For |
| ----- | -------- | ------------------- |
| 0 | CLI only, single interface | One entry point only |
| 1 | One additional surface (MCP OR extension) | Partial multi-surface support |
| 2 | Two additional surfaces + headless auth | MCP + extension, env var auth |
| 3 | All surfaces: CLI, MCP, extension, headless auth | Full matrix, typed interfaces |

**Surface requirements:**
- **CLI (human)**: Interactive, colors, progress bars
- **MCP (stdio)**: JSON-RPC over stdio, typed tools, no shell escaping
- **Extension/Plugin**: Framework-native packaging
- **Headless auth**: Env vars for tokens/credentials (`CLI_TOKEN`, `CLI_CREDENTIALS_FILE`)

**Verification steps:**
```bash
cli mcp --help                  # Check MCP server
cli --mcp                       # Alternative MCP invocation
ls -la dist/                    # Check for extension packages
grep -r "TOKEN\|CREDENTIALS"    # Check env var auth support
```

---

## Interpreting the Total

| Range | Rating | Description | Action |
| ----- | ------ | ----------- | ------ |
| 0–8 | **Human-only** | Built for humans. Agents will struggle. | Rewrite for agents or provide wrapper |
| 9–16 | **Agent-tolerant** | Usable but inefficient. Token waste, errors. | Add critical gaps first (output, validation) |
| 17–20 | **Agent-ready** | Solid support. Some gaps remain. | Address lowest-scoring axes |
| 21–24 | **Agent-first** | Purpose-built for agents. | Minor polish, share as reference |

---

## Output Format

When completing an evaluation, produce:

```markdown
# CLI Evaluation: <cli-name>

## Summary
**Total Score:** X/24
**Rating:** [Human-only|Agent-tolerant|Agent-ready|Agent-first]

## Axis Breakdown
| Axis | Score | Notes |
|------|-------|-------|
| Machine-Readable Output | X/3 | ... |
| Raw Payload Input | X/3 | ... |
| Schema Introspection | X/3 | ... |
| Context Window Discipline | X/3 | ... |
| Input Hardening | X/3 | ... |
| Safety Rails | X/3 | ... |
| Agent Knowledge Packaging | X/3 | ... |
| Multi-Surface Architecture | X/3 | ... |

## Critical Gaps
[List axes scoring 0-1 with specific issues]

## Recommended Improvements
1. [Specific action for lowest-scoring axis]
2. [Next priority action]
...

## Testing Evidence
[Key commands run and their results]
```

---

## References

- `../gsd-new-cli-project/references/rewrite-your-cli-for-ai-agents.md` — Full principles blog post
- `references/agent-dx-cli-scale.md` — Original 7-axis scale
- [Google Workspace CLI](https://github.com/googleworkspace/cli) — Reference implementation
