// S01/T05: Closure battery for the setup sub-command and initialization logic.
//
// Asserts that:
//   (1) SKILL.md contains a `## Initialization` heading, and that heading
//       appears BEFORE the first `<essential_principles>` tag (line-order).
//   (2) SKILL.md routing table contains 8 rows of the form
//       `| \`agent-first-cli <name>\``, and the 8th name is `setup`.
//   (3) references/setup.md exists, has an H1 line, has at least 2 H2
//       headings including one whose text contains `Universal` and one
//       containing `GSD`.
//   (4) The YAML block inside setup.md's GSD section parses, and contains
//       `always_use_skills` including `agent-first-cli` and at least one
//       `skill_rules` entry.
//   (5) The stable marker pattern (`<!-- agent-first-cli `) appears at least
//       twice in setup.md — once in the Universal cue template and once in
//       the init-check / Force re-init instruction.
//   (6) Simulated idempotency: in a tmpdir, create a fake AGENTS.md without
//       the marker, run a JS function that mirrors setup.md's Universal
//       check-write logic, confirm file now has marker + cues; run the
//       check again, confirm file is unchanged.
//   (7) R019 in .gsd/REQUIREMENTS.md has status `active`.
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
// tests/ lives inside skills/agent-first-cli/tests/ — three levels below the repo root.
const repoRoot = resolve(here, '..', '..', '..');
const skillRoot = resolve(repoRoot, 'skills', 'agent-first-cli');
const skillPath = resolve(skillRoot, 'SKILL.md');
const setupPath = resolve(skillRoot, 'references', 'setup.md');
const requirementsPath = resolve(repoRoot, '.gsd', 'REQUIREMENTS.md');

// The stable marker form per references/setup.md is
//   <!-- agent-first-cli begin --> ... <!-- agent-first-cli end -->
// The plan's bare `<!-- agent-first-cli -->` is the stable *prefix family*;
// we match the real marker form via the leading comment opener + skill name.
const MARKER_PATTERN = /<!-- agent-first-cli /g;

// Optional YAML parser. The plan permits a regex fallback when `yaml` is
// unavailable. createRequire lets us call require('yaml') from ESM.
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

// Mirror of the Universal cue snippet from references/setup.md. The single
// source of truth is the reference file, but the idempotency simulation
// needs a literal cue string to write. We pull it from setup.md at runtime
// by extracting between the `<!-- agent-first-cli begin -->` and
// `<!-- agent-first-cli end -->` markers of the Universal section.
function extractUniversalSnippet(setupText) {
  const beginIdx = setupText.indexOf('<!-- agent-first-cli begin -->');
  assert.ok(beginIdx !== -1, 'setup.md must contain begin marker');
  const endIdx = setupText.indexOf('<!-- agent-first-cli end -->', beginIdx);
  assert.ok(endIdx !== -1, 'setup.md must contain end marker after begin');
  return setupText.slice(beginIdx, endIdx + '<!-- agent-first-cli end -->'.length);
}

// JS implementation of the check-write logic described in setup.md's
// Universal section. If the AGENTS.md target file already contains the
// marker, this is a no-op; otherwise it appends the snippet.
async function applyUniversalInit(agentsPath, snippet) {
  let existing = '';
  if (existsSync(agentsPath)) {
    existing = await readFile(agentsPath, 'utf8');
  }
  if (existing.includes('<!-- agent-first-cli begin -->')) {
    return false; // already initialized
  }
  const next = existing.endsWith('\n') || existing.length === 0
    ? existing + snippet + '\n'
    : existing + '\n' + snippet + '\n';
  await writeFile(agentsPath, next, 'utf8');
  return true; // wrote
}

describe('S01 closure battery: setup & initialization', () => {
  it('(1) SKILL.md has `## Initialization` heading before <essential_principles>', async () => {
    const text = await readFile(skillPath, 'utf8');
    const lines = text.split(/\r?\n/);
    const initLineNo = lines.findIndex((l) => /^## Initialization\s*$/.test(l));
    assert.notEqual(initLineNo, -1, 'SKILL.md must contain `## Initialization` heading');
    const epLineNo = lines.findIndex((l) => l.includes('<essential_principles>'));
    assert.notEqual(epLineNo, -1, 'SKILL.md must contain `<essential_principles>` tag');
    assert.ok(
      initLineNo < epLineNo,
      `Initialization (line ${initLineNo + 1}) must precede <essential_principles> (line ${epLineNo + 1})`,
    );
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

  it('(3) setup.md exists with H1 + Universal/GSD H2 headings', async () => {
    const text = await readFile(setupPath, 'utf8');
    assert.ok(text.trim().length > 0, 'setup.md must be non-empty');
    // H1 line (any non-empty H1 heading)
    const h1 = text.match(/^# .+/m);
    assert.ok(h1, 'setup.md must have an H1 line');
    // H2 headings
    const h2s = (text.match(/^## .+/gm) || []).map((l) => l.replace(/^## /, ''));
    assert.ok(h2s.length >= 2, `setup.md must have at least 2 H2 headings, found ${h2s.length}`);
    assert.ok(
      h2s.some((h) => h.includes('Universal')),
      `setup.md must have an H2 containing 'Universal'; got: ${h2s.join(', ')}`,
    );
    assert.ok(
      h2s.some((h) => h.includes('GSD')),
      `setup.md must have an H2 containing 'GSD'; got: ${h2s.join(', ')}`,
    );
  });

  it('(4) GSD YAML block parses and includes always_use_skills + skill_rules', async () => {
    const text = await readFile(setupPath, 'utf8');
    // Locate the GSD H2 section
    const gsdIdx = text.search(/^## GSD/m);
    assert.ok(gsdIdx !== -1, 'setup.md must have a `## GSD` heading');
    const gsdTail = text.slice(gsdIdx);
    // Extract the fenced YAML block: ```yaml ... ```
    const fence = gsdTail.match(/```yaml\s*\n([\s\S]*?)\n```/);
    assert.ok(fence, 'setup.md GSD section must contain a ```yaml fenced block');
    const yamlBody = fence[1];

    let parsed = null;
    if (yamlParse) {
      parsed = yamlParse(yamlBody);
    } else {
      // Manual regex fallback: verify the structural fields we care about
      // are present. We do not fully parse — we assert substring presence.
      assert.ok(
        /always_use_skills:\s*\n\s*-\s+agent-first-cli/.test(yamlBody),
        'yaml block must list agent-first-cli under always_use_skills',
      );
      assert.ok(
        /skill_rules:\s*\n\s*-\s+when:/.test(yamlBody),
        'yaml block must contain at least one skill_rules entry',
      );
      parsed = { _fallback: true };
    }

    if (parsed && !parsed._fallback) {
      assert.ok(parsed, 'yaml block must parse');
      assert.ok(
        Array.isArray(parsed.always_use_skills),
        'parsed yaml must have always_use_skills array',
      );
      assert.ok(
        parsed.always_use_skills.includes('agent-first-cli'),
        `always_use_skills must include 'agent-first-cli'; got: ${JSON.stringify(parsed.always_use_skills)}`,
      );
      assert.ok(
        Array.isArray(parsed.skill_rules) && parsed.skill_rules.length >= 1,
        `parsed yaml must have at least one skill_rules entry; got: ${JSON.stringify(parsed.skill_rules)}`,
      );
    }
  });

  it('(5) stable marker pattern appears at least twice in setup.md', async () => {
    const text = await readFile(setupPath, 'utf8');
    const matches = text.match(MARKER_PATTERN) || [];
    // 4 expected: begin+end in Universal (markdown comment), begin+end in
    // the GSD YAML block (as `# <!-- ... -->` lines). The Force re-init
    // prose line may add 2 more inside backticks. The plan asks for >=2.
    assert.ok(
      matches.length >= 2,
      `setup.md must contain the stable marker pattern at least twice; found ${matches.length}`,
    );
  });

  it('(6) simulated idempotency: check-write is no-op on second run', async (t) => {
    const setupText = await readFile(setupPath, 'utf8');
    const snippet = extractUniversalSnippet(setupText);

    const dir = await mkdtemp(resolve(tmpdir(), 'afc-s01-init-'));
    t.after(async () => {
      await rm(dir, { recursive: true, force: true });
    });
    const agentsPath = resolve(dir, 'AGENTS.md');

    // Pre-existing AGENTS.md content without the marker.
    const original = '# Project Agents\n\nSome pre-existing content.\n';
    await mkdir(dir, { recursive: true });
    await writeFile(agentsPath, original, 'utf8');

    // First run: should write the marker + snippet.
    const wrote1 = await applyUniversalInit(agentsPath, snippet);
    assert.equal(wrote1, true, 'first run must report a write');
    const after1 = await readFile(agentsPath, 'utf8');
    assert.ok(
      after1.includes('<!-- agent-first-cli begin -->'),
      'after first run, AGENTS.md must contain the begin marker',
    );
    assert.ok(
      after1.includes('<!-- agent-first-cli end -->'),
      'after first run, AGENTS.md must contain the end marker',
    );
    assert.ok(
      after1.includes(original.trim()),
      'after first run, the original AGENTS.md content must be preserved',
    );

    // Second run: must be a no-op. File byte-for-byte unchanged.
    const wrote2 = await applyUniversalInit(agentsPath, snippet);
    assert.equal(wrote2, false, 'second run must report no write');
    const after2 = await readFile(agentsPath, 'utf8');
    assert.equal(
      after2,
      after1,
      'second run must leave AGENTS.md byte-for-byte unchanged',
    );
  });

  it('(7) R019 in REQUIREMENTS.md has status `active`', async () => {
    const text = await readFile(requirementsPath, 'utf8');
    // Locate the R019 block (paragraph + bullet list) and pull the Status line.
    const block = text.match(
      /### R019[\s\S]*?(?=\n### |\n## )/,
    );
    assert.ok(block, 'R019 block must exist in REQUIREMENTS.md');
    const statusLine = block[0].match(/^- Status:\s*(\S+)/m);
    assert.ok(statusLine, 'R019 block must have a `- Status:` line');
    assert.equal(
      statusLine[1].toLowerCase(),
      'active',
      `R019 status must be 'active', got '${statusLine[1]}'`,
    );
  });
});
