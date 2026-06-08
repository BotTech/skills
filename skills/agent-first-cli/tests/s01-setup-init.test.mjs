// S01: closure battery for the setup sub-command and branching model.
//
// Asserts that:
//   (1) SKILL.md contains a <setup skip-iff="${agent-first-cli:setup-complete}">
//       XML block (no <setup_logic>, no <detect_harness> — those belong in
//       setup.md, not SKILL.md). The block must contain a markdown link to
//       references/setup.md, the exactly-one-target mutual-exclusion rule,
//       and the `setup --force` re-run entry. SKILL.md must NOT contain
//       <essential_principles> or <success_criteria> blocks; those were
//       removed (principles live where the work happens, setup criteria
//       live inside <setup>).
//   (2) SKILL.md routing table contains 8 rows of the form
//       `| \`agent-first-cli <name>\``, and the 8th name is `setup`.
//   (3) references/setup.md exists, has an H1 line, has at least 3 H2
//       headings including `### Universal branch` and `### GSD branch`
//       (under H3), and contains a <detect_harness> XML block.
//   (4) The GSD branch contains a YAML code fence whose content (a)
//       parses cleanly as YAML and (b) when treated as a list item under
//       custom_instructions, contains the literal strings
//       `<agent-first-cli>`, `${agent-first-cli:setup-complete} = true`,
//       and at least one `agent-first-cli` sub-command reference.
//   (5) The Universal branch contains a markdown code fence with the
//       same `<agent-first-cli>` and `${agent-first-cli:setup-complete}`
//       strings, and at least one `agent-first-cli` sub-command reference.
//   (6) Simulated Universal-branch idempotency: in a tmpdir with no
//       .gsd/PREFERENCES.md, run setup against AGENTS.md, confirm
//       `<agent-first-cli>` block + skip-signal are written; second run
//       is a no-op (skip-signal present).
//   (7) Simulated GSD-branch routing: in a tmpdir with a fake
//       .gsd/PREFERENCES.md, run setup; cues go into the preferences
//       file's custom_instructions list and AGENTS.md is NOT created.
//   (8) Mutual exclusion guard: GSD branch writes ONLY to .gsd/PREFERENCES.md
//       and never touches AGENTS.md; Universal branch writes ONLY to
//       AGENTS.md and never creates .gsd/.
//   (9) setup.md explicitly states the branches are mutually exclusive
//       and contains the regression-history note explaining why the
//       earlier "Universal + GSD" phrasing was a bug.
//
// Run from the repo root:
//   node --test skills/agent-first-cli/tests/s01-setup-init.test.mjs

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, mkdtemp, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { createRequire } from 'node:module';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..', '..', '..');
const skillRoot = resolve(repoRoot, 'skills', 'agent-first-cli');
const skillPath = resolve(skillRoot, 'SKILL.md');
const agentsPath = resolve(skillRoot, 'AGENTS.md');
const setupPath = resolve(skillRoot, 'references', 'setup.md');

const SKIP_SIGNAL = '${agent-first-cli:setup-complete} = true';
const XML_OPEN = '<agent-first-cli>';
const XML_CLOSE = '</agent-first-cli>';

const require = createRequire(import.meta.url);
let yamlParse = null;
try {
  const yaml = require('yaml');
  if (yaml && typeof yaml.parse === 'function') {
    yamlParse = yaml.parse;
  }
} catch {
  yamlParse = null;
}

// Extract the Universal markdown snippet from setup.md (between the
// ```markdown fence in the Universal branch section).
function extractUniversalSnippet(setupText) {
  const idx = setupText.search(/^### Universal branch/m);
  assert.ok(idx !== -1, 'setup.md must contain a `### Universal branch` heading');
  const tail = setupText.slice(idx);
  const fence = tail.match(/```markdown\s*\n([\s\S]*?)\n```/);
  assert.ok(fence, 'Universal branch section must contain a ```markdown fenced block');
  return fence[1];
}

// Extract the GSD YAML snippet from setup.md (between the ```yaml fence
// in the GSD branch section). The fence content is one YAML list item
// (starts with `  - |-`).
function extractGsdSnippet(setupText) {
  const idx = setupText.search(/^### GSD branch/m);
  assert.ok(idx !== -1, 'setup.md must contain a `### GSD branch` heading');
  const tail = setupText.slice(idx);
  const fence = tail.match(/```yaml\s*\n([\s\S]*?)\n```/);
  assert.ok(fence, 'GSD branch section must contain a ```yaml fenced block');
  return fence[1];
}

// Branching-model implementation that mirrors setup.md. Probes for
// .gsd/PREFERENCES.md at project root, then home, else Universal. Writes
// to exactly one target; never both.
//
// Universal target: append the markdown snippet directly to AGENTS.md.
// GSD target: merge into the existing .gsd/PREFERENCES.md by adding
//   `agent-first-cli` to always_use_skills (if absent) and appending the
//   YAML snippet as a new custom_instructions list item (if no item
//   already contains <agent-first-cli>).
async function applySetup(projectRoot, homeDir, universalSnippet, gsdSnippet, force = false) {
  const projectPrefs = resolve(projectRoot, '.gsd', 'PREFERENCES.md');
  const homePrefs = resolve(homeDir, '.gsd', 'PREFERENCES.md');
  const agentsTarget = resolve(projectRoot, 'AGENTS.md');

  // Step 1: identify the branch.
  let target;
  let branch;
  if (existsSync(projectPrefs)) {
    target = projectPrefs;
    branch = 'gsd';
  } else if (existsSync(homePrefs)) {
    target = homePrefs;
    branch = 'gsd';
  } else {
    target = agentsTarget;
    branch = 'universal';
  }

  // Step 2 + 3: idempotency check, then write/merge.
  let existing = '';
  if (existsSync(target)) {
    existing = await readFile(target, 'utf8');
  }
  if (existing.includes(SKIP_SIGNAL) && !force) {
    return { target, wrote: false, branch };
  }

  if (branch === 'universal') {
    // Append the markdown snippet directly. The snippet already contains
    // the <agent-first-cli> wrapper and skip-signal.
    const next = existing.length === 0
      ? universalSnippet + '\n'
      : (existing.endsWith('\n') ? existing : existing + '\n') + '\n' + universalSnippet + '\n';
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, next, 'utf8');
    return { target, wrote: true, branch };
  }

  // GSD branch: merge. The snippet we extracted is one YAML list item
  // (begins with `  - |-`). We do a simple textual merge:
  //   - always_use_skills: ensure `  - agent-first-cli` line exists
  //   - custom_instructions: append the snippet if no <agent-first-cli>
  //     block is already present in the file
  let next = existing;
  if (!/^- agent-first-cli\s*$/m.test(next) && !/^-\s+agent-first-cli\s*$/m.test(next)) {
    if (/^always_use_skills:\s*$/m.test(next)) {
      // Insert `- agent-first-cli` immediately after the key line.
      next = next.replace(/(^^always_use_skills:\s*\n)/m, `$1  - agent-first-cli\n`);
    } else {
      // Key doesn't exist; append it.
      next = (next.endsWith('\n') || next.length === 0 ? next : next + '\n')
        + 'always_use_skills:\n  - agent-first-cli\n';
    }
  }
  if (!next.includes(XML_OPEN) || force) {
    // If force, drop the existing block first (simple replace between
    // <agent-first-cli> and </agent-first-cli> inclusive).
    if (force && next.includes(XML_OPEN)) {
      next = next.replace(/<agent-first-cli>[\s\S]*?<\/agent-first-cli>/g, '').trimEnd() + '\n';
    }
    if (!/^custom_instructions:\s*$/m.test(next)) {
      next = (next.endsWith('\n') || next.length === 0 ? next : next + '\n')
        + 'custom_instructions:\n';
    }
    next = (next.endsWith('\n') ? next : next + '\n') + gsdSnippet + '\n';
  }
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, next, 'utf8');
  return { target, wrote: true, branch };
}

describe('S01 closure battery: setup branching model', () => {
  it('(1) SKILL.md has <setup skip-iff=...> XML block with markdown link and self-contained branching contract', async () => {
    const text = await readFile(skillPath, 'utf8');

    // The setup block must use the agreed XML form with the namespaced
    // skip-signal variable.
    assert.ok(
      /<setup\s+skip-iff="\$\{agent-first-cli:setup-complete\}">/.test(text),
      'SKILL.md must contain <setup skip-iff="${agent-first-cli:setup-complete}"> block',
    );
    // The detection logic lives in setup.md, NOT in SKILL.md.
    assert.ok(!text.includes('<setup_logic>'), 'SKILL.md must NOT contain <setup_logic> (detection lives in setup.md)');
    assert.ok(!text.includes('<detect_harness>'), 'SKILL.md must NOT contain <detect_harness> (detection lives in setup.md)');
    assert.ok(!/<if\s+condition=/.test(text), 'SKILL.md must NOT contain <if condition=...> (branching lives in setup.md)');

    // Body of the <setup> block must contain a markdown link to references/setup.md.
    const setupOpenIdx = text.indexOf('<setup ');
    assert.ok(setupOpenIdx !== -1, '<setup> opening tag must exist');
    const setupCloseIdx = text.indexOf('</setup>', setupOpenIdx);
    assert.ok(setupCloseIdx !== -1, '<setup> closing tag must exist');
    const setupBody = text.slice(setupOpenIdx, setupCloseIdx);
    assert.ok(
      /\[setup\.md\]\(references\/setup\.md\)/.test(setupBody),
      '<setup> body must link to references/setup.md via markdown link',
    );

    // The setup block must self-contain the branching contract that
    // previously lived in <success_criteria> and <essential_principles>:
    // exactly-one-target mutual exclusion, and the availability of
    // `setup` / `setup --force` as a normal sub-command.
    assert.ok(
      /exactly one/i.test(setupBody),
      '<setup> body must state the exactly-one-target mutual-exclusion rule',
    );
    assert.ok(
      /setup\s+--force/.test(setupBody),
      '<setup> body must mention `setup --force` as a normal sub-command',
    );

    // The now-removed blocks must NOT be present.
    assert.ok(!text.includes('<essential_principles>'), 'SKILL.md must NOT contain <essential_principles> (removed; principles live where the work happens)');
    assert.ok(!text.includes('<success_criteria>'), 'SKILL.md must NOT contain <success_criteria> (removed; setup criteria moved into <setup>)');
  });

  it('(2) SKILL.md routing table has 8 rows; 8th name is `setup`', async () => {
    const text = await readFile(skillPath, 'utf8');
    const re = /^\| `agent-first-cli ([a-z]+)`/gm;
    const names = [];
    let m;
    while ((m = re.exec(text)) !== null) {
      names.push(m[1]);
    }
    assert.equal(
      names.length,
      8,
      `expected 8 routing rows, found ${names.length}: ${names.join(', ')}`,
    );
    assert.equal(names[7], 'setup', `8th routing-row name must be 'setup', got '${names[7]}'`);
  });

  it('(3) setup.md has H1, H2 headings, Universal/GSD H3 headings, and a <detect_harness> block', async () => {
    const text = await readFile(setupPath, 'utf8');
    assert.ok(text.trim().length > 0, 'setup.md must be non-empty');
    assert.ok(/^# .+/m.test(text), 'setup.md must have an H1 line');
    const h2s = (text.match(/^## .+/gm) || []).map((l) => l.replace(/^## /, ''));
    assert.ok(h2s.length >= 3, `setup.md must have at least 3 H2 headings, found ${h2s.length}`);
    const h3s = (text.match(/^### .+/gm) || []).map((l) => l.replace(/^### /, ''));
    assert.ok(
      h3s.some((h) => h.includes('Universal branch')),
      `setup.md must have an H3 containing 'Universal branch'; got: ${h3s.join(', ')}`,
    );
    assert.ok(
      h3s.some((h) => h.includes('GSD branch')),
      `setup.md must have an H3 containing 'GSD branch'; got: ${h3s.join(', ')}`,
    );
    assert.ok(
      text.includes('<detect_harness>') && text.includes('</detect_harness>'),
      'setup.md must contain a <detect_harness> XML block with opening and closing tags',
    );
  });

  it('(4) GSD YAML snippet parses as YAML and contains <agent-first-cli> + skip-signal + sub-command refs', async () => {
    const text = await readFile(setupPath, 'utf8');
    const snippet = extractGsdSnippet(text);

    // The snippet represents ONE custom_instructions list item. Wrap it
    // under a `custom_instructions:` key so it parses as a standalone
    // YAML document.
    const wrapped = `custom_instructions:\n${snippet}\n`;
    let parsed = null;
    if (yamlParse) {
      try {
        parsed = yamlParse(wrapped);
      } catch (e) {
        assert.fail(`GSD YAML snippet must parse cleanly when wrapped under custom_instructions: ${e.message}`);
      }
    }

    if (parsed) {
      assert.ok(parsed.custom_instructions, 'parsed YAML must have custom_instructions');
      assert.ok(
        Array.isArray(parsed.custom_instructions) && parsed.custom_instructions.length === 1,
        `custom_instructions must have exactly one list item; got ${JSON.stringify(parsed.custom_instructions)}`,
      );
      const item = parsed.custom_instructions[0];
      assert.equal(typeof item, 'string', 'custom_instructions item must be a string (literal block scalar)');
      assert.ok(item.includes(XML_OPEN), `item must contain ${XML_OPEN}`);
      assert.ok(item.includes(XML_CLOSE), `item must contain ${XML_CLOSE}`);
      assert.ok(item.includes(SKIP_SIGNAL), `item must contain skip-signal ${SKIP_SIGNAL}`);
      // At least three sub-command references (`agent-first-cli <name>`)
      // in the cue table inside the block.
      const subCmdMatches = item.match(/`agent-first-cli [a-z]+`/g) || [];
      assert.ok(
        subCmdMatches.length >= 3,
        `item must reference at least 3 sub-commands; found ${subCmdMatches.length}: ${subCmdMatches.join(', ')}`,
      );
    } else {
      // Fallback: substring checks when yaml module is unavailable.
      assert.ok(snippet.includes(XML_OPEN), `snippet must contain ${XML_OPEN}`);
      assert.ok(snippet.includes(SKIP_SIGNAL), `snippet must contain skip-signal`);
      const subCmdMatches = snippet.match(/`agent-first-cli [a-z]+`/g) || [];
      assert.ok(subCmdMatches.length >= 3, `snippet must reference at least 3 sub-commands`);
    }
  });

  it('(5) Universal markdown snippet contains <agent-first-cli> + skip-signal + sub-command refs', async () => {
    const text = await readFile(setupPath, 'utf8');
    const snippet = extractUniversalSnippet(text);
    assert.ok(snippet.includes(XML_OPEN), `Universal snippet must contain ${XML_OPEN}`);
    assert.ok(snippet.includes(XML_CLOSE), `Universal snippet must contain ${XML_CLOSE}`);
    assert.ok(snippet.includes(SKIP_SIGNAL), `Universal snippet must contain skip-signal ${SKIP_SIGNAL}`);
    const subCmdMatches = snippet.match(/`agent-first-cli [a-z]+`/g) || [];
    assert.ok(
      subCmdMatches.length >= 3,
      `Universal snippet must reference at least 3 sub-commands; found ${subCmdMatches.length}: ${subCmdMatches.join(', ')}`,
    );
  });

  it('(6) simulated Universal-branch idempotency: writes once, then no-op', async (t) => {
    const setupText = await readFile(setupPath, 'utf8');
    const universalSnippet = extractUniversalSnippet(setupText);
    const gsdSnippet = extractGsdSnippet(setupText);

    const projectDir = await mkdtemp(resolve(tmpdir(), 'afc-s01-univ-proj-'));
    const homeDir = await mkdtemp(resolve(tmpdir(), 'afc-s01-univ-home-'));
    t.after(async () => {
      await rm(projectDir, { recursive: true, force: true });
      await rm(homeDir, { recursive: true, force: true });
    });

    const r1 = await applySetup(projectDir, homeDir, universalSnippet, gsdSnippet);
    assert.equal(r1.branch, 'universal', 'first run must detect Universal branch');
    assert.equal(r1.wrote, true, 'first run must report a write');
    assert.equal(r1.target, resolve(projectDir, 'AGENTS.md'), 'target must be AGENTS.md');
    const after1 = await readFile(resolve(projectDir, 'AGENTS.md'), 'utf8');
    assert.ok(after1.includes(XML_OPEN), 'AGENTS.md must contain <agent-first-cli> after first run');
    assert.ok(after1.includes(SKIP_SIGNAL), 'AGENTS.md must contain skip-signal after first run');

    const r2 = await applySetup(projectDir, homeDir, universalSnippet, gsdSnippet);
    assert.equal(r2.wrote, false, 'second run must skip (skip-signal already present)');
    const after2 = await readFile(resolve(projectDir, 'AGENTS.md'), 'utf8');
    assert.equal(after2, after1, 'second run must leave AGENTS.md byte-for-byte unchanged');

    // Mutual exclusion: .gsd/ must not have been created anywhere.
    assert.equal(
      existsSync(resolve(projectDir, '.gsd', 'PREFERENCES.md')),
      false,
      'Universal branch must NOT create .gsd/PREFERENCES.md at the project root',
    );
    assert.equal(
      existsSync(resolve(homeDir, '.gsd', 'PREFERENCES.md')),
      false,
      'Universal branch must NOT create .gsd/PREFERENCES.md in the home dir',
    );
  });

  it('(7) simulated GSD-branch routing: cues merged into .gsd/PREFERENCES.md, not AGENTS.md', async (t) => {
    const setupText = await readFile(setupPath, 'utf8');
    const universalSnippet = extractUniversalSnippet(setupText);
    const gsdSnippet = extractGsdSnippet(setupText);

    const projectDir = await mkdtemp(resolve(tmpdir(), 'afc-s01-gsd-proj-'));
    const homeDir = await mkdtemp(resolve(tmpdir(), 'afc-s01-gsd-home-'));
    t.after(async () => {
      await rm(projectDir, { recursive: true, force: true });
      await rm(homeDir, { recursive: true, force: true });
    });

    // Seed project-root .gsd/PREFERENCES.md so the probe picks GSD branch.
    await mkdir(resolve(projectDir, '.gsd'), { recursive: true });
    const prefsPath = resolve(projectDir, '.gsd', 'PREFERENCES.md');
    await writeFile(prefsPath, '# pre-existing preferences\nversion: 1\n', 'utf8');

    const r = await applySetup(projectDir, homeDir, universalSnippet, gsdSnippet);
    assert.equal(r.branch, 'gsd', 'must detect GSD branch');
    assert.equal(r.wrote, true, 'GSD branch must write');
    assert.equal(r.target, prefsPath, 'GSD branch must target project-root .gsd/PREFERENCES.md');

    const prefs = await readFile(prefsPath, 'utf8');
    assert.ok(prefs.includes('# pre-existing preferences'), 'pre-existing content must be preserved');
    assert.ok(prefs.includes('always_use_skills:'), 'merged file must include always_use_skills key');
    assert.ok(/^- agent-first-cli\s*$/m.test(prefs) || /^\s+- agent-first-cli\s*$/m.test(prefs), 'merged file must list agent-first-cli under always_use_skills');
    assert.ok(prefs.includes('custom_instructions:'), 'merged file must include custom_instructions key');
    assert.ok(prefs.includes(XML_OPEN), `merged file must contain ${XML_OPEN} block`);
    assert.ok(prefs.includes(SKIP_SIGNAL), 'merged file must contain skip-signal');

    // Mutual exclusion: AGENTS.md must NOT have been created.
    assert.equal(
      existsSync(resolve(projectDir, 'AGENTS.md')),
      false,
      'GSD branch must NOT create AGENTS.md',
    );
  });

  it('(8) mutual exclusion guard: each branch touches exactly one target', async (t) => {
    const setupText = await readFile(setupPath, 'utf8');
    const universalSnippet = extractUniversalSnippet(setupText);
    const gsdSnippet = extractGsdSnippet(setupText);

    // Case A: home-only .gsd/PREFERENCES.md. GSD branch must target home
    // prefs; project AGENTS.md and project .gsd/ must be untouched.
    const projectA = await mkdtemp(resolve(tmpdir(), 'afc-s01-home-A-'));
    const homeA = await mkdtemp(resolve(tmpdir(), 'afc-s01-home-B-'));
    t.after(async () => {
      await rm(projectA, { recursive: true, force: true });
      await rm(homeA, { recursive: true, force: true });
    });
    await mkdir(resolve(homeA, '.gsd'), { recursive: true });
    const homePrefsA = resolve(homeA, '.gsd', 'PREFERENCES.md');
    await writeFile(homePrefsA, '# home prefs\n', 'utf8');

    const rA = await applySetup(projectA, homeA, universalSnippet, gsdSnippet);
    assert.equal(rA.branch, 'gsd', 'home-only prefs must route to GSD branch');
    assert.equal(rA.target, homePrefsA, 'home-only prefs must target home prefs file');
    assert.equal(
      existsSync(resolve(projectA, 'AGENTS.md')),
      false,
      'GSD branch (home-only) must NOT create project AGENTS.md',
    );
    assert.equal(
      existsSync(resolve(projectA, '.gsd', 'PREFERENCES.md')),
      false,
      'GSD branch (home-only) must NOT create project .gsd/PREFERENCES.md',
    );

    // Case B: no prefs anywhere. Universal branch must write AGENTS.md
    // and not create .gsd/ anywhere.
    const projectB = await mkdtemp(resolve(tmpdir(), 'afc-s01-univ2-'));
    const homeB = await mkdtemp(resolve(tmpdir(), 'afc-s01-univ2home-'));
    t.after(async () => {
      await rm(projectB, { recursive: true, force: true });
      await rm(homeB, { recursive: true, force: true });
    });

    const rB = await applySetup(projectB, homeB, universalSnippet, gsdSnippet);
    assert.equal(rB.branch, 'universal', 'absent prefs must route to Universal branch');
    assert.equal(rB.target, resolve(projectB, 'AGENTS.md'), 'Universal branch must target AGENTS.md');
    assert.equal(
      existsSync(resolve(projectB, '.gsd', 'PREFERENCES.md')),
      false,
      'Universal branch must NOT create project .gsd/PREFERENCES.md',
    );
    assert.equal(
      existsSync(resolve(homeB, '.gsd', 'PREFERENCES.md')),
      false,
      'Universal branch must NOT create home .gsd/PREFERENCES.md',
    );
  });

  it('(9) setup.md states mutual exclusion + regression history', async () => {
    const text = await readFile(setupPath, 'utf8');
    assert.ok(
      /mutually\s+exclusive/i.test(text),
      'setup.md must explicitly state that the branches are mutually exclusive',
    );
    assert.ok(
      /Universal\s*\+\s*GSD/i.test(text),
      'setup.md must mention the old "Universal + GSD" phrasing as the regression being fixed',
    );
  });
});
