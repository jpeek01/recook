// Tests for check-skill.mjs. Run: node --test scripts/*.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const script = join(dirname(fileURLToPath(import.meta.url)), 'check-skill.mjs');

const BODY = `
# Demo skill

Turn notes into a weekly status report.

## Steps

1. Read the notes listed in \`references/guide.md\`.
2. Write the report.

## Stop

Stop when the report exists.

## Never

- Put secrets in the report.
`;

const FRONT = `---
name: demo-skill
description: Writes a weekly status report from notes. Use when the user asks for a status report. Not for other reports.
---
`;

// Make a temp skill folder named demo-skill with the given files.
function makeSkill(t, files) {
  const base = mkdtempSync(join(tmpdir(), 'check-skill-'));
  t.after(() => rmSync(base, { recursive: true, force: true }));
  const dir = join(base, 'demo-skill');
  mkdirSync(dir);
  for (const [rel, content] of Object.entries(files)) {
    const p = join(dir, rel);
    mkdirSync(dirname(p), { recursive: true });
    writeFileSync(p, content);
  }
  return dir;
}

function lint(dir) {
  const r = spawnSync(process.execPath, [script, dir], { encoding: 'utf8' });
  return { code: r.status, out: r.stdout + r.stderr };
}

const guide = { 'references/guide.md': '# Guide\n' };

test('valid skill passes with no errors or warnings', (t) => {
  const dir = makeSkill(t, { 'SKILL.md': FRONT + BODY, ...guide });
  const r = lint(dir);
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /0 error\(s\), 0 warning\(s\)/);
});

test('missing frontmatter is an error', (t) => {
  const dir = makeSkill(t, { 'SKILL.md': BODY.trimStart(), ...guide });
  const r = lint(dir);
  assert.equal(r.code, 1);
  assert.match(r.out, /must start with a "---" frontmatter line/);
});

test('placeholder in description is an error', (t) => {
  const front = FRONT.replace('Writes a weekly', '[What it does.] Writes a weekly');
  const dir = makeSkill(t, { 'SKILL.md': front + BODY, ...guide });
  const r = lint(dir);
  assert.equal(r.code, 1);
  assert.match(r.out, /description still contains a \[placeholder\]/);
});

for (const indicator of ['>', '|', '>-', '|-']) {
  test(`block-scalar description "${indicator}" is parsed`, (t) => {
    const front = `---\nname: demo-skill\ndescription: ${indicator}\n  Writes a weekly status report from notes.\n  Use when asked for one. Not for other reports.\n---\n`;
    const dir = makeSkill(t, { 'SKILL.md': front + BODY, ...guide });
    const r = lint(dir);
    assert.equal(r.code, 0, r.out);
    assert.match(r.out, /0 error\(s\), 0 warning\(s\)/);
  });
}

test('plain multi-line description is parsed', (t) => {
  const front = `---\nname: demo-skill\ndescription: Writes a weekly status report from notes.\n  Use when asked for one. Not for other reports.\n---\n`;
  const dir = makeSkill(t, { 'SKILL.md': front + BODY, ...guide });
  const r = lint(dir);
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /0 error\(s\), 0 warning\(s\)/);
});

test('placeholder inside a block-scalar description is found', (t) => {
  const front = `---\nname: demo-skill\ndescription: >-\n  Writes a report.\n  [When not to use it.]\n---\n`;
  const dir = makeSkill(t, { 'SKILL.md': front + BODY, ...guide });
  const r = lint(dir);
  assert.equal(r.code, 1);
  assert.match(r.out, /description still contains a \[placeholder\]/);
});

test('description that is empty after parsing is an error', (t) => {
  const front = `---\nname: demo-skill\ndescription: >-\n---\n`;
  const dir = makeSkill(t, { 'SKILL.md': front + BODY, ...guide });
  const r = lint(dir);
  assert.equal(r.code, 1);
  assert.match(r.out, /"description" is empty/);
});

test('missing referenced file is an error', (t) => {
  const dir = makeSkill(t, { 'SKILL.md': FRONT + BODY });
  const r = lint(dir);
  assert.equal(r.code, 1);
  assert.match(r.out, /mentioned file does not exist: references\/guide\.md/);
});

test('line count excludes the trailing newline', (t) => {
  const head = (FRONT + BODY).split('\n').slice(0, -1);
  const pad = (n) => [...head, ...Array(n - head.length).fill('x')].join('\n');
  const at120 = makeSkill(t, { 'SKILL.md': pad(120) + '\n', ...guide });
  const r120 = lint(at120);
  assert.equal(r120.code, 0, r120.out);
  assert.match(r120.out, /0 warning\(s\), 120 lines in SKILL\.md/);

  const at121 = makeSkill(t, { 'SKILL.md': pad(121) + '\n', ...guide });
  const r121 = lint(at121);
  assert.equal(r121.code, 0, r121.out);
  assert.match(r121.out, /SKILL\.md is 121 lines/);
});

test('description brackets that are not placeholders pass', (t) => {
  const desc = 'Writes a report from [[weekly notes]] and a[0] or arr[i]. See [guide](references/guide.md), ' +
    '[ref][1], \\[literal\\] and [ ] boxes. Not for other reports.';
  const front = `---\nname: demo-skill\ndescription: ${desc}\n---\n`;
  const dir = makeSkill(t, { 'SKILL.md': front + BODY, ...guide });
  const r = lint(dir);
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /0 error\(s\), 0 warning\(s\)/);
});

for (const ph of ['[todo]', '[skill-name]', '[What it does.]']) {
  test(`description placeholder ${ph} is an error`, (t) => {
    const front = FRONT.replace('Writes a weekly', `${ph} Writes a weekly`);
    const dir = makeSkill(t, { 'SKILL.md': front + BODY, ...guide });
    const r = lint(dir);
    assert.equal(r.code, 1, r.out);
    assert.match(r.out, /description still contains a \[placeholder\]/);
  });
}

test('body brackets that are not placeholders do not warn', (t) => {
  const body = BODY + '\n- [ ] box\n- [x] done box\n\nSee [[wiki page]], a[0], arr[i], \\[escaped\\], [text][ref].\n\n[ref]: references/guide.md\n';
  const dir = makeSkill(t, { 'SKILL.md': FRONT + body, ...guide });
  const r = lint(dir);
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /0 error\(s\), 0 warning\(s\)/);
});

test('UTF-8 BOM and trailing spaces on --- lines are tolerated', (t) => {
  const front = '﻿' + FRONT.replace(/^---\n/, '---  \n').replace(/\n---\n$/, '\n--- \t\n');
  const dir = makeSkill(t, { 'SKILL.md': front + BODY, ...guide });
  const r = lint(dir);
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /0 error\(s\), 0 warning\(s\)/);
});

test('stop and never headings match whole words outside fenced code', (t) => {
  const body = BODY.replace('## Stop', '## Abandoned ideas').replace('## Never', '## Whenever') +
    '\n```markdown\n## Stop\n## Never\n```\n';
  const dir = makeSkill(t, { 'SKILL.md': FRONT + body, ...guide });
  const r = lint(dir);
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /no "Stop" or "Done" section found/);
  assert.match(r.out, /no "Never" section found/);
});

test('stopping and done headings count as the stop section', (t) => {
  for (const h of ['## When you are done', '## Stopping', '## Stops']) {
    const dir = makeSkill(t, { 'SKILL.md': FRONT + BODY.replace('## Stop', h), ...guide });
    const r = lint(dir);
    assert.equal(r.code, 0, `${h}: ${r.out}`);
  }
});

test('name with double, leading or trailing hyphen is an error', (t) => {
  for (const name of ['demo--x-', '-demo', 'demo-', 'demo--skill']) {
    const dir = makeSkill(t, { 'SKILL.md': FRONT.replace('name: demo-skill', `name: ${name}`) + BODY, ...guide });
    const r = lint(dir);
    assert.equal(r.code, 1, `${name}: ${r.out}`);
    assert.match(r.out, /groups joined by single hyphens/);
  }
});

test('path check skips fenced code and "..", ignores #anchor', (t) => {
  const body = BODY + '\nSee `references/guide.md#top` and `references/../x.md`.\n\n```text\n`references/missing.md`\n```\n';
  const dir = makeSkill(t, { 'SKILL.md': FRONT + body, ...guide });
  const r = lint(dir);
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /0 error\(s\), 0 warning\(s\)/);
});

test('duplicate frontmatter key is an error', (t) => {
  const front = FRONT.replace('---\n', '---\ndescription: [todo]\n');
  const dir = makeSkill(t, { 'SKILL.md': front + BODY, ...guide });
  const r = lint(dir);
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /frontmatter key "description" appears more than once/);
});

test('long description warning matches the 80-word threshold', (t) => {
  const desc = Array(81).fill('word').join(' ') + ' not';
  const front = `---\nname: demo-skill\ndescription: ${desc}\n---\n`;
  const dir = makeSkill(t, { 'SKILL.md': front + BODY, ...guide });
  const r = lint(dir);
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /description is 82 words; .*80 or fewer/);
  assert.doesNotMatch(r.out, /under 60/);
});

test('placeholder in body prose warns, but not in code or links', (t) => {
  const body = BODY +
    '\n[Step four.]\n\nSee [the guide](references/guide.md). Use `[name]` here.\n\n```text\n[inside code]\n```\n';
  const dir = makeSkill(t, { 'SKILL.md': FRONT + body, ...guide });
  const r = lint(dir);
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /1 \[placeholder\]\(s\): \[Step four\.\]/);
  assert.doesNotMatch(r.out, /inside code|\[name\]|\[the guide\]/);
});
