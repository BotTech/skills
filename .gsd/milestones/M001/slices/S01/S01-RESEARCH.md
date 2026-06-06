# S01 Research — Restructure: Rename, Merge, Submodule Wiring

## Summary

S01 is a pure repo-shape change with one real integration risk: how `npx skills add` (vercel-labs/skills CLI) interacts with a git submodule. Findings: submodule wiring is straightforward; the `npx skills add` flow clones **without** `--recurse-submodules`, so the submodule appears empty in installed copies — that is a **known and accepted** state for S01, documented for users in S06 and detected by the skill's verify sub-command in S04. No code executes from the skill in this slice; only directory layout, deletions, and `.gitmodules` land here.

The slice is "first proof" because every downstream slice (S02–S06) consumes the new layout or the submodule. Get the shape and the submodule URL right here and the rest is content authoring.

## Recommendation

Execute S01 as **four independent seams** that the planner can sequence in any order, plus a final verification step:

1. **Delete** `skills/gsd-new-cli-project/` and `skills/agent-dx-cli-eval/` (preserve content via S03, not via git moves — content is rewritten from scratch).
2. **Create** `skills/agent-first-cli/` with empty placeholder directories: `references/`, `assets/samples/` (note: `assets/samples/` is **inside** the skill per S01 contract — see Clarifying Note below).
3. **Add** the gitignorer submodule at `skills/agent-first-cli/assets/samples/gitignorer` → `git@github.com:BotTech/gitignore.git`, branch `main`.
4. **Verify** the layout with `git submodule status`, `git status`, and a fresh `git clone --recurse-submodules` (in a temp dir).

**Do not** modify README, skills-lock.json, or write SKILL.md / AGENTS.md / CLAUDE.md here — those belong to S02 and S06 per the roadmap.

### Clarifying Note: `assets/samples/` Location

The roadmap says S01 produces: "`skills/agent-first-cli/` directory exists with `references/` and `assets/samples/` subdirectories". The submodule path is consistently written as `assets/samples/gitignorer` (without a `skills/` prefix) elsewhere in the milestone context. **Resolution**: the canonical path is `skills/agent-first-cli/assets/samples/gitignorer/` — i.e., the assets live **inside the skill** so they install alongside it. This matches the milestone's stated invariant "no file in the skill writes to .gsd/" — assets must travel with the skill, not the repo root. The `.gitmodules` path therefore is `skills/agent-first-cli/assets/samples/gitignorer`. **The planner should confirm this resolution with the user before execution** if there is any doubt; flag it as an explicit decision in the slice plan.

## Implementation Landscape

### What Exists Today

```
skills/
├── agent-dx-cli-eval/
│   ├── SKILL.md              ← 9.4KB, the 8-axis scoring rubric; moves to references/eval.md in S03
│   └── references/
│       └── agent-dx-cli-scale.md  ← older 7-axis version; merges into eval.md in S03
├── gsd-new-cli-project/
│   ├── SKILL.md              ← 10.6KB; broken (invokes /gsd-new-project phantom command); content becomes S03 reference material
│   └── references/
│       └── rewrite-your-cli-for-ai-agents.md  ← 7KB blog post; primary source for S03 architecture.md + pitfalls.md
└── timesheet/                ← UNTOUCHED in M001
```

Repo root files:
- `README.md` — skills index lists both old skills; **updated in S06, not S01**.
- `skills-lock.json` — only contains EXTERNAL skills (anthropics, wshobson, etc.); local skills are NOT in it. **No S01 edit needed.**
- No `.gitmodules` yet.

### What S01 Must Produce

```
skills/
├── agent-first-cli/
│   ├── references/          ← empty dir, populated in S03/S04
│   └── assets/samples/      ← contains the submodule mount point
│       └── gitignorer/      ← git submodule → git@github.com:BotTech/gitignore.git, branch main
└── timesheet/                ← untouched
.gitmodules                   ← NEW file at repo root
```

### What S01 Must Delete

- `skills/gsd-new-cli-project/` (entire tree, 2 files)
- `skills/agent-dx-cli-eval/` (entire tree, 2 files)

**Content preservation**: The content from these files is referenced and quoted in `M001-CONTEXT.md` and will be re-authored in S03 from scratch with shape-matched templates. Do NOT `git mv` — the new files have different names, shapes, and locations. Deletion in S01 + authoring in S03 is cleaner than a move-and-edit.

## Constraints

### Hard Constraints (from milestone context)

1. **No `.gsd/` writes from anywhere in the skill** (R011, decision MEM006). This slice doesn't write anything to `.gsd/`, but the executor must not create `.gsd/` artifacts as a side effect.
2. **No gsd-pi coupling** (R012, decision MEM007). S01 doesn't touch this, but no SKILL.md content here either — so it's trivially satisfied.
3. **Submodule URL must be SSH form**: `git@github.com:BotTech/gitignore.git` (decision MEM005, milestone context). HTTPS would break the project's auth posture.
4. **Branch must be `main`** (decision MEM005, milestone context). Pin via `.gitmodules` `branch = main` so updates are pull-able.
5. **`git clone --recurse-submodules` must produce a populated submodule** (success criterion). This is the S01 verification anchor — anything else is secondary.

### Skill-Installer Constraints (verified via vercel-labs/skills docs)

The vercel-labs/skills `npx skills add` flow:
1. `cloneRepo(url, ref?)` → plain `git clone`, **no `--recurse-submodules`** flag, to `/tmp/skills-XXX/`.
2. `discoverSkills(tempDir)` → walks for `SKILL.md` files at limited depth.
3. `installSkillForAgent(skill, agent, scope, mode)` → mode is **symlink preferred, falls back to copy**. Empirical check on this machine shows installed skills are COPIED directories at `~/.agents/skills/<name>/` (not symlinks), so the symlink must be failing and copy is the actual code path for global installs.
4. `cleanupTempDir(tempDir)` → temp dir is deleted; symlinks would dangle if used.

**Implication for S01**: After `npx skills add bottech/skills`, the user's `~/.agents/skills/agent-first-cli/assets/samples/gitignorer/` will be **empty** (only the mount point dir exists). This is documented in milestone risks and handled by:
- S04's `verify` sub-command emits an explicit error if submodule dir is empty.
- S06's README update documents the `git submodule update --init --recursive` step for users who clone the repo directly (vs. install via `npx skills add`).

**S01 does NOT solve the empty-submodule-after-install problem** — that's the wrong slice. S01 only wires the submodule so a developer cloning the repo gets it populated.

### Submodule Wiring Mechanics

Standard git submodule commands (run from repo root, NOT inside the worktree's cwd-only restriction — but this is for execute-task, not research):

```bash
# From repo root, create the directory structure first
mkdir -p skills/agent-first-cli/assets/samples
# Add the submodule at the exact target path
git submodule add -b main git@github.com:BotTech/gitignore.git skills/agent-first-cli/assets/samples/gitignorer
git commit -m "feat(agent-first-cli): add gitignorer sample submodule"
```

This produces `.gitmodules`:
```ini
[submodule "skills/agent-first-cli/assets/samples/gitignorer"]
	path = skills/agent-first-cli/assets/samples/gitignorer
	url = git@github.com:BotTech/gitignore.git
	branch = main
```

Plus a `gitlink` entry in the tree at `skills/agent-first-cli/assets/samples/gitignorer` pointing to a specific commit SHA.

**Critical sequencing**: `git submodule add` requires the parent directory to exist but the target path to NOT exist. The empty placeholder `assets/samples/` directory must be created first; the submodule mount point is created by `git submodule add`.

### Verification Anchors

After S01, all of these must be true:

```bash
# 1. Submodule registered and initialized
git submodule status
# Expected: <SHA> skills/agent-first-cli/assets/samples/gitignorer (heads/main)

# 2. Working tree is clean (after commit)
git status
# Expected: nothing to commit, working tree clean

# 3. Submodule contents populated
ls skills/agent-first-cli/assets/samples/gitignorer/
# Expected: package.json, src/, README.md, etc. (real gitignorer files)

# 4. .gitmodules exists at repo root with correct content
cat .gitmodules
# Expected: single [submodule "..."] block with path, url, branch=main

# 5. Old skills are gone
test ! -d skills/gsd-new-cli-project && test ! -d skills/agent-dx-cli-eval
# Expected: exit 0

# 6. New skill dir exists with placeholder structure
test -d skills/agent-first-cli/references && test -d skills/agent-first-cli/assets/samples
# Expected: exit 0

# 7. Fresh clone with recursive submodules works (run in /tmp)
cd /tmp && rm -rf skills-verify && git clone --recurse-submodules <repo-url> skills-verify && ls skills-verify/skills/agent-first-cli/assets/samples/gitignorer/package.json
# Expected: package.json visible (submodule populated)
```

The clone test (#7) is the strongest single proof because it exercises the full submodule contract end-to-end. It can be skipped if the executor lacks network access, in which case #1-#6 are sufficient.

## Risks (Slice-Level)

### R1: Submodule SSH URL fails for read-only consumers (e.g. CI, installed copies)
**Likelihood**: Low. The BotTech org has the SSH key configured. Public consumers would also need to clone gitignore separately, but that's not S01's concern — the install flow (npx skills add) doesn't recurse anyway, and direct git clone users with HTTPS-only setups would need to override `git config --global url."https://github.com/".insteadOf git@github.com:`. This is standard git practice and not specific to our repo.

**Mitigation**: Document the SSH URL choice in the S01 commit message; consider adding a CONTRIBUTING note in S06 if friction surfaces.

### R2: Executor adds the submodule BEFORE creating the empty skill directory tree
**Likelihood**: Medium if the planner doesn't sequence. `git submodule add` fails if the parent path doesn't exist OR if the target path already exists as a non-empty dir. The correct sequence is: `mkdir -p skills/agent-first-cli/assets/samples` → `git submodule add ...` → then `mkdir -p skills/agent-first-cli/references`.

**Mitigation**: Make the slice plan's task ordering explicit: directory creation BEFORE `git submodule add`.

### R3: Worktree cwd interaction with `git submodule add`
**Likelihood**: Low. This research runs in a worktree (`.git/worktrees/M001`), but execute-task runs against the main checkout OR the worktree depending on configuration. `git submodule add` works correctly in either, but the executor must be at the repo root when running it. The planner should add an explicit `cd <repo-root>` (or use the worktree root path) as the first step of the submodule task.

**Mitigation**: Plan task description should say "run all git commands from the worktree root" (i.e., the cwd of this research unit).

### R4: Deleting the old skills removes the only reference material before S03 can use it
**Likelihood**: Zero. The research phase has already captured the relevant content in `M001-CONTEXT.md` (see "Existing Codebase / Prior Art" section, which quotes the blog post and lists the existing files). Git history also retains the deleted files for any lookback. S03 can re-author from the milestone context + `git show HEAD~1:skills/gsd-new-cli-project/references/rewrite-your-cli-for-ai-agents.md` if needed.

**Mitigation**: None needed. Note in the S03 slice context that the source material lives in git history and in `M001-CONTEXT.md`.

### R5: Path ambiguity — `assets/samples/` at repo root vs. inside the skill
**Likelihood**: Medium. The milestone context has both forms: roadmap says "inside the skill" (S01 contract), and some R### references and the context write `assets/samples/gitignorer` (without `skills/agent-first-cli/` prefix). The latter is shorthand; the former is the contract.

**Mitigation**: Resolve before execution. The recommendation in this research is **inside the skill** (`skills/agent-first-cli/assets/samples/gitignorer/`) because (a) the S01 roadmap says so, (b) assets must travel with the skill to be useful after install, (c) decision MEM005 references the asset as belonging to the skill. The planner should treat this as a resolved decision unless the user explicitly overrides.

## Don't Hand-Roll

Nothing to hand-roll in S01. The slice uses only:
- Standard `git` commands (`submodule add`, `mv`, `rm`)
- Standard filesystem operations (`mkdir`, `rmdir`)

No library docs or external tools needed.

## Sources

- vercel-labs/skills documentation (via Context7): `cloneRepo`, `discoverSkills`, `installSkillForAgent`, `cleanupTempDir` — confirms `npx skills add` does NOT use `--recurse-submodules`.
- Local empirical inspection of `~/.agents/skills/<name>/` directories — confirms installed skills are COPIED (not symlinked) directories.
- Local empirical inspection of `~/src/bottech/gitignore/` — confirms the submodule target repo exists, is on `main` branch, has expected content (`src/commands/`, `src/schema/`, `package.json`, etc.).
- M001-CONTEXT.md (inlined) — source for all architectural decisions and constraints.
- M001-ROADMAP.md (inlined) — source for S01 success criteria and boundary contract.

## Forward Intelligence (for downstream slices)

### For S02 (SKILL.md + AGENTS.md + CLAUDE.md)
- The skill directory `skills/agent-first-cli/` will exist with empty `references/` dir; SKILL.md goes at the skill root, AGENTS.md goes at the skill root, CLAUDE.md is a symlink to AGENTS.md (both inside the skill, not at repo root).
- Repo-root AGENTS.md is NOT touched in M001.

### For S03 (Reference content)
- Five reference files will land in `skills/agent-first-cli/references/`: `stack.md`, `features.md`, `architecture.md`, `pitfalls.md`, `requirements.md`.
- Source material is in git history (`git show <SHA>:skills/gsd-new-cli-project/references/rewrite-your-cli-for-ai-agents.md`) and inlined in `M001-CONTEXT.md`. No need to access the deleted files at runtime.

### For S04 (validate + verify)
- The submodule will appear empty in `npx skills add` installed copies. verify.md MUST handle this gracefully with an explicit error message and remediation command.
- The submodule WILL be populated when the skill is consumed from a `git clone --recurse-submodules` of the skills repo itself (developer workflow).

### For S05 (Asset verification: gitignorer axis mapping)
- gitignorer source layout (already verified): `src/commands/{examples,generate,list,schema,scan,search,update}.ts`, `src/formatters/{json,ndjson,human,dry-run}.ts`, `src/parsers/{flags,stdin}.ts`, `src/schema/{input,output,errors}.ts`.
- These map roughly to axes (preliminary, S05 will finalize):
  - Axis 1 (Machine-Readable Output) → `src/formatters/json.ts`, `ndjson.ts`
  - Axis 2 (Raw Payload Input) → `src/parsers/stdin.ts`, `src/commands/generate.ts`
  - Axis 3 (Schema Introspection) → `src/commands/schema.ts`, `src/commands/examples.ts`
  - Axis 4 (Context Window Discipline) → `src/commands/list.ts` (pagination), `src/cli/flags.ts` (`--fields`)
  - Axis 5 (Input Hardening) → `src/schema/input.ts`
  - Axis 6 (Safety Rails) → `src/formatters/dry-run.ts`, `src/commands/generate.ts`
  - Axis 7 (Agent Knowledge Packaging) → `CLAUDE.md` at submodule root (already exists)
  - Axis 8 (Multi-Surface Architecture) → no MCP server in gitignorer yet; S05 may flag this as out-of-scope or score the axis low.

### For S06 (Repo README + skills-lock.json + migration note)
- `skills-lock.json` does NOT track local skills; no edit needed there. Only update if it contains stale entries referencing old paths (it doesn't).
- README skills index has two entries to delete, one to add.
- Migration note: the old skill names (`gsd-new-cli-project`, `agent-dx-cli-eval`) are gone. Users with `npx skills add bottech/skills` installed copies at `~/.agents/skills/gsd-new-cli-project/` will NOT auto-update — they need to re-run `npx skills add bottech/skills` and optionally remove the old dirs. Document this in README.
