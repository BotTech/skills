# AGENTS.md — agent-first-cli

This is the skill's enforcement contract. Mechanics live in `references/validate.md` and `references/verify.md`; the axis list lives in `references/eval.md`; the setup branching model lives in `references/setup.md`.

## Setup Branching Contract

`setup` writes re-invocation cues into **exactly one** target file per invocation. The two branches are mutually exclusive:

- **GSD branch** (`.gsd/PREFERENCES.md` exists at the project root OR `~/.gsd/PREFERENCES.md` exists): write the GSD snippet into the discovered `.gsd/PREFERENCES.md`. Do **not** touch `AGENTS.md`.
- **Universal branch** (neither GSD preferences file exists): write the Universal snippet into `AGENTS.md` at the project root. Do **not** touch `.gsd/` at all.

If you feel an urge to write both `AGENTS.md` AND `.gsd/PREFERENCES.md`, stop — you are about to violate the branching rule. The branches are additive in **no** case.

The canonical snippets, the probe order, the idempotency algorithm, and the rationale for each rule live in `references/setup.md`; that file is the source of truth — this section only documents the contract.

### Regression guard

Previous versions of this skill described setup as "Universal only, or Universal + GSD" — implying both files get written in GSD projects — in the same breath as "do not write under `.gsd/`" — forbidding the GSD branch entirely. Both phrasings were bugs. The first caused agents to think they had to add `AGENTS.md` to GSD projects that did not want one; the second contradicted the first and confused agents into thinking they had to write both. The branching model above makes the mutual exclusion explicit. Do not reintroduce either phrasing.

## Strict Bidirectional Coverage Rule

The authoritative statement of the axis↔R### coverage rule lives in `references/eval.md` (alongside the axes it operates over). The rule is enforced by `references/validate.md` (plan-mode) and `references/verify.md` (impl-mode). This file does not restate the rule.

## Pointers

- Coverage rule and axis list: `references/eval.md`.
- Starter R###s with `Axis: N` tags: `references/requirements.md`.
- How to enforce in plan-mode: `references/validate.md`.
- How to enforce against a built CLI: `references/verify.md`.
- Setup contract (branching model, snippets, idempotency): `references/setup.md`.
