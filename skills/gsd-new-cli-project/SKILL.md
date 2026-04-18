---
name: gsd-new-cli-project
description: "Initialize a new CLI project with agent-first design context. Wraps /gsd-new-project and injects domain-specific guidance for the 4 parallel research agents. Use when starting a CLI project or creating a command-line tool."
argument-hint: "[--auto]"
compatibility:
  - Skill
---

# GSD New CLI Project

Initialize a new CLI project with agent-first design principles. This skill wraps `/gsd-new-project` and provides domain-specific context for the 4 parallel research agents.

<modified_workflow>

When executing `/gsd-new-project`, apply the following modifications:

<step number="6" name="Research Decision">

**6. Research Decision**

When spawning the 4 parallel `gsd-project-researcher` agents, provide each agent with the following context:

<context research_type="stack">
**CLI Framework Priorities:**

When researching CLI frameworks, prioritize:

1. **Async I/O support** — Essential for pipe compatibility. All operations must be non-blocking.
2. **JSON serialization** — Built-in support for structured output and NDJSON streaming.
3. **Flag parsing** — Support for both flags and raw JSON payload input.
4. **Schema tools** — Libraries for runtime schema introspection (OpenAPI, discovery docs).

**Verify with ctx7:**
- Click / Typer (Python) — Flag parsing, JSON input
- Cobra (Go) — CLIs, schemas, streaming
- Commander (Node) — Async-first, pipes
- clap (Rust) — Type-safe, schema derivation

**Examples Command Pattern:**

CLIs must provide their own examples via subcommands:
```
cli examples &lt;command&gt;
```

This outputs example JSON payloads for agents to use as templates.
</context>

<context research_type="features">
**Table Stakes (Agent-First CLI Features):**

These features are expected in any agent-first CLI:

| Feature | Why Required | Priority |
|---------|--------------|----------|
| `--output json` | Agents need structured output | P1 |
| `--output ndjson` | Streaming for large results | P1 |
| Structured error JSON | Errors must be parseable | P1 |
| `--dry-run` flag | Validate before acting (mutating) | P1 |
| `--fields` flag | Limit response size | P1 |
| `examples &lt;cmd&gt;` | CLI self-documents payloads | P1 |
| `schema &lt;resource&gt;` | Runtime introspection (API) | P1 |

**Differentiators:**

| Feature | Value | Complexity |
|---------|-------|------------|
| MCP surface | Typed JSON-RPC interface | MEDIUM |
| Response sanitization | Prompt injection defense | HIGH |
| Live schema resolution | From discovery docs | MEDIUM |
</context>

<context research_type="architecture">
**Standard CLI Architecture:**

```
┌─────────────────────────────────────┐
│         CLI Entry Points             │
│  (commands, flags, subcommands)      │
└──────────────┬──────────────────────┘
               │
       ┌───────┴───────┐
       ▼               ▼
┌──────────────┐  ┌──────────────┐
│  Flag Parser │  │ JSON Parser  │
│              │  │ (raw input)  │
└──────┬───────┘  └──────┬───────┘
       │                 │
       └───────┬─────────┘
               ▼
      ┌────────────────┐
      │  Input Handler │
      │  (hardening)   │
      └────────┬───────┘
               ▼
      ┌────────────────┐
      │  Command Layer │
      │ (dry-run gate) │
      └────────┬───────┘
               │
        ┌───────┴────────┐
        ▼                ▼
┌──────────────┐  ┌──────────────┐
│  API Client  │  │ Output Form. │
│  (if wrapper)│  │ (JSON/NDJSON)│
└──────────────┘  └──────────────┘
```

**Data Flow Requirements:**

- **Async everywhere** — Support piped input/output
- **Streaming paths** — Do not buffer large responses
- **Early validation** — Check inputs before API calls

**Component Responsibilities:**

| Component | Responsibility |
|-----------|---------------|
| Flag Parser | Human-facing convenience flags |
| JSON Parser | Raw payload input (agents) |
| Input Handler | Validation, hardening, sanitization |
| Command Layer | Business logic, dry-run gate |
| Output Formatter | Structured output, streaming |
</context>

<context research_type="pitfalls">
**Critical Pitfalls for Agent-First CLIs:**

### Pitfall 1: Blocking I/O

**What goes wrong:** CLI blocks on stdin/stdout, breaks pipes.
**Why it happens:** Synchronous I/O is easier to implement.
**How to avoid:** Use async I/O throughout. Do not block.
**Warning signs:** "Pipe breaks when output is large," "Can't chain commands"
**Phase to address:** Phase 1 (Core CLI Infrastructure)

### Pitfall 2: Mixed Output Formats

**What goes wrong:** Agents can't parse when JSON and prose mix.
**Why it happens:** Adding progress messages to JSON output.
**How to avoid:** Separate channels: stdout for data, stderr for messages.
**Warning signs:** "Agents fail on partial output," "JSON parsing errors"
**Phase to address:** Phase 1 (Output Layer)

### Pitfall 3: Missing Input Validation

**What goes wrong:** Agents inject dangerous inputs (path traversal, query params).
**Why it happens:** Assuming human typing patterns, not agent generation patterns.
**How to avoid:** Reject `../`, `?`, `#`, `%XX`, control chars explicitly.
**Warning signs:** "Strange resource ID errors," "Files created outside expected dirs"
**Phase to address:** Phase 1 (Input Handler)

### Pitfall 4: No Dry-Run for Mutating Operations

**What goes wrong:** Agents execute without validating, cause production incidents.
**Why it happens:** Treating dry-run as optional feature.
**How to avoid:** Require --dry-run for ALL mutating operations in docs and examples.
**Warning signs:** "Accidental deletions," "Production rollbacks"
**Phase to address:** Phase 1 (Command Layer - CRITICAL for mutating CLIs)
</context>

</step>

<step number="7" name="Define Requirements">

**7. Define Requirements**

After defining the requirements and before proceeding to Step 8 (Create Roadmap), run `/agent-dx-cli-scale` to validate the requirements against the 7-axis Agent DX CLI Scale framework.

**Target score:** 16-21 (Agent-First)

This evaluation identifies gaps in the requirements while they are still cheap to fix.

</step>

</modified_workflow>

## Execution

After reading the above context, invoke `/gsd-new-project` and apply the workflow modifications.

---

## References

- [You Need to Rewrite Your CLI for AI Agents](https://justin.poehnelt.com/posts/rewrite-your-cli-for-ai-agents/)
- [Google Workspace CLI](https://github.com/googleworkspace/cli) — Reference implementation
- `/agent-dx-cli-scale` skill — Evaluation framework
