---
id: validate-gapped-fixture
verdict: fail
error_count: 1
warning_count: 0
validated_at: 2026-06-06T00:00:00Z
fixture: tests/fixtures/gapped-requirements.md
---

# Expected Validate Report — Gapped Requirements Fixture

This is the canonical expected output of running `references/validate.md`
against `tests/fixtures/gapped-requirements.md`. Any agent (or regression
test) executing validate against the fixture must produce a report whose
verdict and audit-table contents match this file byte-for-byte. The
Per-Axis Detail prose may vary in wording but must agree on Status and on
the error kind emitted.

## Verdict

**fail.** The fixture failed with 1 `uncovered-axis` error. Axis 5
(Errors) has no Active R### carrying an `Axis: 5` tag in its Notes, and
no out-of-scope declaration with a reason is present for Axis 5. Axis 7
(Idempotency) and Axis 8 (Examples) are declared out-of-scope by the
Coverage Table and are not errors.

## Axis Coverage Audit

| Axis | Name | Status | Source R### | Notes |
|------|------|--------|-------------|-------|
| 1 | Discoverability | Covered | R001 | — |
| 2 | Invocation | Covered | R002 | — |
| 3 | I/O | Covered | R003 | — |
| 4 | State | Covered | R004 | — |
| 5 | Errors | UNCOVERED | — | uncovered-axis (deliberate gap — test fixture) |
| 6 | Exit Codes | Covered | R005 | — |
| 7 | Idempotency | Out-of-scope | — | Out of scope (test fixture) |
| 8 | Examples | Out-of-scope | — | Out of scope (test fixture) |

## R### Audit

| R### | Axis tag | Status |
|------|----------|--------|
| R001 | 1 | Covered |
| R002 | 2 | Covered |
| R003 | 3 | Covered |
| R004 | 4 | Covered |
| R005 | 6 | Covered |

No ORPHAN rows. Every R### in the fixture carries at least one valid
`Axis: N` tag pointing at a real axis in `references/eval.md`.

## Per-Axis Detail

### Axis 1: Discoverability

- **Status:** Covered.
- **Evidence:** R001 Notes — `Axis: 1`. The Notes also point at the
  `cli --help --output json` and `cli schema <command>` introspection
  surfaces named in `references/eval.md` for this axis.
- **Errors:** none.

### Axis 2: Invocation

- **Status:** Covered.
- **Evidence:** R002 Notes — `Axis: 2`. Notes reference the shared Zod
  schema between the JSON parser, flag parser, and `schema <command>`.
- **Errors:** none.

### Axis 3: I/O

- **Status:** Covered.
- **Evidence:** R003 Notes — `Axis: 3`. Notes mention TTY-aware mode
  defaults and NDJSON streaming for large result sets.
- **Errors:** none.

### Axis 4: State

- **Status:** Covered.
- **Evidence:** R004 Notes — `Axis: 4`. Notes cite the
  `state.reads[]`, `state.writes[]`, `state.cache` schema fields and
  the `--no-cache` flag.
- **Errors:** none.

### Axis 5: Errors

- **Status:** UNCOVERED — no R### carries `Axis: 5` tag and no
  out-of-scope declaration exists.
- **Evidence:** Absence. The Coverage Table row for Axis 5 reads
  `UNCOVERED (deliberate gap — test fixture)` but does not declare the
  axis out-of-scope via an R### block, and no R### Notes contain
  `Axis: 5`. The `UNCOVERED (deliberate gap — test fixture)` text in
  the Coverage Table is informational, not an out-of-scope declaration.
- **Errors:** `[{kind: "uncovered-axis", detail: "Axis 5 (Errors) has no Active R### with Axis: 5 in Notes and no out-of-scope declaration"}]`.

### Axis 6: Exit Codes

- **Status:** Covered.
- **Evidence:** R005 Notes — `Axis: 6`. Notes cite the
  `readonly exitCode` field on each typed error class and the
  single top-level error handler.
- **Errors:** none.

### Axis 7: Idempotency

- **Status:** Out-of-scope.
- **Evidence:** Coverage Table row reads `Out of scope (test fixture)`.
- **Errors:** none.

### Axis 8: Examples

- **Status:** Out-of-scope.
- **Evidence:** Coverage Table row reads `Out of scope (test fixture)`.
- **Errors:** none.

## Regression Note

This report is the canonical expected output. Any agent running validate
against `tests/fixtures/gapped-requirements.md` must produce a
byte-identical verdict and audit-table content; Per-Axis Detail prose may
vary in wording so long as Status and error-kind names match exactly.
