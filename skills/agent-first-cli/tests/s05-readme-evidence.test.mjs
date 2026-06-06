// S05/T02: README evidence-table verification.
//
// Asserts that skills/agent-first-cli/README.md:
//   - exists and is non-empty
//   - has exactly 8 axis rows (Axis: 1..8) in axis-aligned order
//   - every cited assets/samples/gitignorer/ path resolves to an existing file
//   - cited line ranges contain at least one match of the claimed pattern
//   - has zero #axis-N anchor forms (N=1..8)
//   - has zero real references/<file>.md# deep-link forms (placeholder prose is allowed)
//   - has zero harness-coupling tokens (gsd_*, /gsd, imperative .gsd/ writes)
//   - contains the submodule init snippet, an AGENTS.md back-pointer, and an eval.md back-pointer
//
// Run from the repo root:
//   node --test skills/agent-first-cli/tests/s05-readme-evidence.test.mjs

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
// tests/ lives inside skills/agent-first-cli/tests/ — three levels below the repo root.
const repoRoot = resolve(here, '..', '..', '..');
const skillRoot = resolve(repoRoot, 'skills', 'agent-first-cli');
const readmePath = resolve(skillRoot, 'README.md');

const REFERENCE_FILES = [
  'architecture',
  'eval',
  'features',
  'pitfalls',
  'requirements',
  'stack',
  'validate',
  'verify',
];

// Pattern: references/<file>.md# where <file> is one of the real reference files.
// Placeholders like `references/<file>.md#section` (literal angle brackets) are allowed.
function countRealReferenceDeepLinks(text) {
  const re = new RegExp(
    `references/(?:${REFERENCE_FILES.join('|')})\\.md#`,
    'g',
  );
  return (text.match(re) || []).length;
}

async function readText(rel) {
  const base = rel.startsWith('skills/') ? repoRoot : skillRoot;
  const full = resolve(base, rel);
  return { full, text: await readFile(full, 'utf8') };
}

async function pathExists(rel) {
  // Repo-relative paths (skills/agent-first-cli/...) resolve against repoRoot;
  // skill-relative paths (assets/...) resolve against skillRoot.
  const base = rel.startsWith('skills/') ? repoRoot : skillRoot;
  const full = resolve(base, rel);
  try {
    await access(full);
    return true;
  } catch {
    return false;
  }
}

async function linesOfFile(rel) {
  const { text } = await readText(rel);
  return text.split(/\r?\n/);
}

async function sliceLines(rel, startOneIndexed, endOneIndexed) {
  const lines = await linesOfFile(rel);
  if (lines.length < endOneIndexed) {
    return { lines, slice: null };
  }
  return { lines, slice: lines.slice(startOneIndexed - 1, endOneIndexed).join('\n') };
}

// Extract every gitignorer asset path that appears in the README. The README cites
// paths in two forms:
//   * repo-relative: `skills/agent-first-cli/assets/samples/gitignorer/...`
//   * skill-relative: `assets/samples/gitignorer/...`
// Both must resolve to the same file when checked against the repo root.
function extractCitedGitignorerPaths(text) {
  const out = new Set();
  // Quoted form (backticks).
  const quoted = text.matchAll(/`([^`]*assets\/samples\/gitignorer\/[^`]+)`/g);
  for (const m of quoted) {
    for (const piece of m[1].split(/,\s*/)) {
      const trimmed = piece.trim();
      if (trimmed.includes('assets/samples/gitignorer/')) {
        out.add(stripLineRange(trimmed));
      }
    }
  }
  // Unquoted form inside table cells.
  const unquoted = text.matchAll(
    /(^|[\s|`(])((?:skills\/agent-first-cli\/)?assets\/samples\/gitignorer\/[^\s`|),]+)/g,
  );
  for (const m of unquoted) {
    out.add(stripLineRange(m[2]));
  }
  return [...out];
}

function stripLineRange(p) {
  // Citations like `errors.ts:16-103` need the `:N-M` suffix dropped for fs.access.
  return p.replace(/:\d+(-\d+)?$/, '');
}

describe('S05 README evidence table', () => {
  it('README exists and is non-empty', async () => {
    const text = await readFile(readmePath, 'utf8');
    assert.ok(text.trim().length > 0, 'README must be non-empty');
  });

  it('evidence table has exactly 8 axis rows in axis-aligned order', async () => {
    const text = await readFile(readmePath, 'utf8');
    const rows = text.match(/^\| Axis: \d+ \|/gm) || [];
    assert.equal(
      rows.length,
      8,
      `expected 8 'Axis: N' rows, found ${rows.length}`,
    );
    const ids = rows.map((r) => Number(r.match(/\d+/)[0]));
    assert.deepEqual(ids, [1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('every cited gitignorer path resolves to an existing file', async () => {
    const text = await readFile(readmePath, 'utf8');
    const paths = extractCitedGitignorerPaths(text);
    assert.ok(
      paths.length >= 8,
      `expected at least 8 cited paths, found ${paths.length}`,
    );
    const missing = [];
    for (const rel of paths) {
      if (!(await pathExists(rel))) {
        missing.push(rel);
      }
    }
    assert.deepEqual(missing, [], `missing cited files: ${missing.join(', ')}`);
  });

  it('Axis 5 cited line range (errors.ts:16-103) contains all 4 error classes', async () => {
    const { slice } = await sliceLines(
      'assets/samples/gitignorer/src/schema/errors.ts',
      16,
      103,
    );
    assert.ok(slice, 'errors.ts must have at least 103 lines');
    for (const cls of [
      'export class ValidationError',
      'export class GitError',
      'export class FsError',
      'export class BusinessError',
    ]) {
      assert.ok(
        slice.includes(cls),
        `errors.ts:16-103 must contain '${cls}'`,
      );
    }
  });

  it('no #axis-N anchor form appears anywhere in the README', async () => {
    const text = await readFile(readmePath, 'utf8');
    for (let n = 1; n <= 8; n++) {
      const anchor = `#axis-${n}`;
      assert.ok(
        !text.includes(anchor),
        `README must not contain '${anchor}'`,
      );
    }
  });

  it('no real references/<file>.md# deep-link appears in the README', async () => {
    const text = await readFile(readmePath, 'utf8');
    const count = countRealReferenceDeepLinks(text);
    assert.equal(count, 0, 'README must not deep-link references files');
  });

  it('no harness-coupling tokens (gsd_*, /gsd, imperative .gsd/ writes)', async () => {
    const text = await readFile(readmePath, 'utf8');
    // Forbidden: gsd_ tool names (any identifier starting with gsd_).
    const gsdUnderscore = text.match(/\bgsd_[a-z]+\b/g) || [];
    assert.deepEqual(
      gsdUnderscore,
      [],
      `README must not name gsd_ tools: ${gsdUnderscore.join(', ')}`,
    );
    // Forbidden: /gsd slash commands (space after).
    const slashGsd = text.match(/\/gsd \w/g) || [];
    assert.deepEqual(
      slashGsd,
      [],
      `README must not invoke /gsd slash commands: ${slashGsd.join(', ')}`,
    );
    // Forbidden: imperative write instructions targeting .gsd/.
    // Pattern matches phrases like 'write to .gsd/' or 'create .gsd/' but allows
    // prohibition phrasings like 'Do not write to .gsd/' (MEM018 carve-out).
    const imperativeGsdWrite = text.match(
      /(^|[^.!?]*(?:^|[.!?]\s+))\s*(?:write|create)\s+(?:to|in|under)\s+\.gsd\//im,
    );
    assert.equal(
      imperativeGsdWrite,
      null,
      'README must not contain imperative write instructions targeting .gsd/',
    );
  });

  it('submodule init snippet is present', async () => {
    const text = await readFile(readmePath, 'utf8');
    assert.ok(
      text.includes('git submodule update --init --recursive'),
      'README must contain the submodule init snippet',
    );
  });

  it('README mentions AGENTS.md at least once (strict-rule back-pointer)', async () => {
    const text = await readFile(readmePath, 'utf8');
    assert.ok(
      /AGENTS\.md/.test(text),
      'README must mention AGENTS.md',
    );
  });

  it('README mentions eval.md at least once (canonical axis list back-pointer)', async () => {
    const text = await readFile(readmePath, 'utf8');
    assert.ok(
      /eval\.md/.test(text),
      'README must mention eval.md',
    );
  });
});
