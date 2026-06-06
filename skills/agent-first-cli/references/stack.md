# Stack — Agent-First CLI

This file is the canonical recommended stack for an agent-first CLI built in the TypeScript / Node ecosystem. It is the lift-and-drop source for a project's `.gsd/research/STACK.md`. Each row in the Recommended Stack table names a single library (or native API) the project should commit to up front, with rationale tied to the agent-first axes (Axis 1..Axis 8; see eval.md). Alternatives and rejected options follow; the "What NOT to Use" section lists options that actively harm agent-first design.

## Recommended Stack

| Component | Library | Version | Confidence | Rationale |
|-----------|---------|---------|------------|-----------|
| Language | TypeScript | ^5.8.0 | High | Type safety end-to-end; zod schemas compile to TS types that drive both Flag and JSON parsers (Axis 2 invocation, Axis 5 errors). |
| Runtime | Node.js | ≥20.10 (LTS) | High | Native `fs.readdir({recursive:true})`, native `fetch`, stable ESM. Required baseline for Axis 3 streaming I/O. |
| CLI Framework | Commander | ^13.0.0 | High | Mature async-first command/flag parser; built-in JSON mode enables Axis 2 invocation without a custom flag grammar. |
| Interactive Prompts | @clack/prompts | ^0.9.0 | High | Modern TTY-only prompts; auto-suppressed under non-TTY so they never bleed into Axis 3 stdout data channel. |
| Validation | zod | ^4.0.0 | High | Single source of truth: runtime validation + TS types + schema introspection for the `schema <resource>` command (Axis 1, Axis 5). |
| Streaming Output | ndjson | ^3.0.0 | High | One JSON object per line, streamable and parseable by agents without buffering — the literal wire format for Axis 3 I/O. |
| Async I/O | fs/promises + async iterators | Node built-in | High | All filesystem and pipe operations non-blocking; required for Axis 3 streaming and piped invocation. |
| Cache Paths | env-paths | ^4.0.0 | High | XDG-compliant cross-platform cache/config dirs; underpins Axis 4 state transparency (documented, predictable location). |
| Build / Bundle | tsdown | ^1.0.0 | High | Fast TS bundler producing a single ESM/CJS distributable; ships the binary that all 8 axes are verified against. |
| Dev Runner | tsx | ^4.20.0 | High | Zero-config TS execution for local iteration; preserves ESM semantics during development so Axis 2/3 behavior matches production. |

## Alternatives Considered

| Option | Why Rejected |
|--------|--------------|
| oclif | Heavy multi-command framework with its own plugin lifecycle; overhead is unjustified for a single-purpose agent-first CLI where Commander's flat command tree is enough. |
| Inquirer.js | Older prompt library; @clack/prompts has the same functionality with a smaller footprint, native ESM, and cleaner TTY detection that won't leak into Axis 3 stdout. |
| axios | Native `fetch` ships in Node 18+ and covers every HTTP need of an agent-first CLI; an extra HTTP dependency adds bundle size without capability. |
| glob | Native `fs.readdir({recursive:true})` (Node 20.10+) handles recursive directory enumeration without a runtime dependency or its own pattern DSL. |
| yargs | Strong flag parser but weaker JSON-input handling than Commander; agents prefer structured payloads over flag strings (Axis 2). |
| citty | Newer and minimalist, but smaller ecosystem and less battle-tested async/pipe behavior than Commander. |
| picocolors | Fine library for stderr coloring; rejected only because it is unnecessary — colors must never touch the Axis 3 stdout channel. |

## What NOT to Use

| Option | Avoid Because |
|--------|---------------|
| Mixing progress text with JSON on stdout | Breaks Axis 3 (I/O): agents cannot separate parseable data from human chatter when both share stdout. Progress belongs on stderr. |
| Synchronous fs / readFileSync-style I/O | Breaks Axis 3 (streaming): blocking calls stall pipes, break NDJSON consumers, and deadlock downstream agents reading stdin. |
| Ad-hoc string error messages | Breaks Axis 5 (errors): unstructured strings force agents to regex-match prose; use typed error classes with a stable `{error, message, ...context}` JSON shape and a documented error code. |
| ANSI color escapes emitted to stdout | Breaks Axis 3 (I/O): color bytes corrupt the JSON byte stream on stdout; if coloring is needed, restrict it to stderr and the human TTY path. |
| A single shared exit code for every failure | Breaks Axis 6 (exit codes): agents branch on exit codes; collapse them into a stable taxonomy (e.g., 1=validation, 2=external-deps, 3=filesystem, 4=business). |
| Mutable global state shared across commands | Breaks Axis 4 (state) and Axis 7 (idempotency): in-process globals drift between invocations and make `--dry-run` non-representative of the real run. |
| Untyped `any` payloads at module boundaries | Breaks Axis 5 (errors) and Axis 2 (invocation): without zod gates on input/output, malformed JSON reaches the core and surfaces as opaque crashes rather than typed rejections. |

## Open Questions

- Is an MCP (Model Context Protocol) surface in scope for v1, or deferred until the CLI surface is stable? An MCP server over stdio adds a second invocation surface alongside the CLI (Axis 2) and changes the bundling story.
- Will the CLI ship as pure ESM, pure CJS, or a dual build? Choice affects tsdown config, the `type` field in package.json, and how downstream consumers import the binary.
- Is there a need for plugin hooks (user-supplied code that runs before/after a command)? If yes, the architecture must define a stable plugin contract up front; if no, the simpler static command tree is fine.
- Are long-running commands (watch / daemon modes) in scope? They change Axis 3 (streaming lifecycle) and Axis 6 (signal/exit-code handling) materially.
- Which minimum Node version is the support floor — 20 LTS, 22 LTS, or current? Affects which native APIs (fs.glob, structured cloning, etc.) the stack can lean on without polyfills.
