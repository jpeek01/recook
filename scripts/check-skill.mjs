#!/usr/bin/env node
// Structural checks for an agent skill folder. No dependencies.
// Usage: node check-skill.mjs <skill-folder>
// Exit code 0 = no errors (warnings allowed). 1 = errors. 2 = bad usage.

import { existsSync, readFileSync, statSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';

const dir = process.argv[2];
if (!dir || dir === '-h' || dir === '--help') {
  console.error('usage: node check-skill.mjs <skill-folder>');
  process.exit(2);
}

const root = resolve(dir);
const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

const skillPath = join(root, 'SKILL.md');
if (!existsSync(root) || !statSync(root).isDirectory()) {
  console.error(`not a folder: ${dir}`);
  process.exit(2);
}
if (!existsSync(skillPath)) {
  console.error('error: SKILL.md not found');
  process.exit(1);
}

const text = readFileSync(skillPath, 'utf8').replace(/\r\n/g, '\n');
const lines = text.split('\n');

// Frontmatter: first line "---", closing "---".
const fm = {};
if (lines[0] !== '---') {
  err('SKILL.md must start with a "---" frontmatter line');
} else {
  const end = lines.indexOf('---', 1);
  if (end === -1) err('frontmatter has no closing "---"');
  else {
    for (const l of lines.slice(1, end)) {
      const m = /^([A-Za-z_-]+):\s*(.*)$/.exec(l);
      if (m) fm[m[1]] = m[2].trim();
    }
  }
}

if (!fm.name) err('frontmatter is missing "name"');
else {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(fm.name)) err(`name "${fm.name}" should be lowercase letters, digits and hyphens`);
  if (fm.name !== basename(root)) warn(`name "${fm.name}" differs from folder "${basename(root)}"`);
}

if (!fm.description) err('frontmatter is missing "description"');
else {
  const words = fm.description.split(/\s+/).length;
  if (words > 80) warn(`description is ${words} words; it loads every session, aim for under 60`);
  if (/\[.*\]/.test(fm.description)) err('description still contains a [placeholder]');
  if (!/\bnot\b|\bdo not\b|\bdon't\b/i.test(fm.description)) warn('description does not say when NOT to use the skill');
}

if (/\[[^\]\n]*\]/.test(fm.name || '')) err('name still contains a [placeholder]');

if (lines.length > 120) warn(`SKILL.md is ${lines.length} lines; aim for under 120 and move detail to references/`);

if (!/^#{1,3}\s.*(stop|done)/im.test(text)) err('no "Stop" or "Done" section found');
if (!/^#{1,3}\s.*never/im.test(text)) warn('no "Never" section found');

// Files named in backticks that look like paths inside the skill must exist.
const seen = new Set();
for (const m of text.matchAll(/`((?:references|templates|scripts)\/[^`\s]+)`/g)) {
  const rel = m[1].replace(/[.,;:]+$/, '');
  if (seen.has(rel) || /[\[<*]/.test(rel)) continue;
  seen.add(rel);
  if (!existsSync(join(root, rel))) err(`mentioned file does not exist: ${rel}`);
}

for (const e of errors) console.log(`error:   ${e}`);
for (const w of warnings) console.log(`warning: ${w}`);
console.log(`${errors.length} error(s), ${warnings.length} warning(s), ${lines.length} lines in SKILL.md`);
process.exit(errors.length ? 1 : 0);
