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

// A UTF-8 byte order mark is tolerated.
const text = readFileSync(skillPath, 'utf8').replace(/^﻿/, '').replace(/\r\n/g, '\n');
const lines = text.split('\n');
// Line count does not include the empty string after a trailing newline.
const counted = text.endsWith('\n') ? text.slice(0, -1) : text;
const lineCount = counted === '' ? 0 : counted.split('\n').length;

// Parse simple YAML frontmatter: "key: value", quoted values, plain values
// that continue on indented lines, and block scalars (>, |, >-, |- and similar).
// Returns the values and any keys that appear more than once.
function parseFrontmatter(fmLines) {
  const out = {};
  const dupes = [];
  let i = 0;
  while (i < fmLines.length) {
    const m = /^([A-Za-z_][A-Za-z0-9_-]*):(?:[ \t]+(.*))?$/.exec(fmLines[i]);
    if (!m) { i++; continue; }
    const key = m[1];
    const head = (m[2] ?? '').trim();
    const cont = [];
    let j = i + 1;
    while (j < fmLines.length && (fmLines[j].trim() === '' || /^[ \t]/.test(fmLines[j]))) {
      cont.push(fmLines[j]);
      j++;
    }
    let value;
    if (/^[>|][+-]?[1-9]?$/.test(head)) {
      const indents = cont.filter((l) => l.trim() !== '').map((l) => /^[ \t]*/.exec(l)[0].length);
      const strip = indents.length ? Math.min(...indents) : 0;
      const body = cont.map((l) => (l.trim() === '' ? '' : l.slice(strip)));
      if (head[0] === '|') {
        value = body.join('\n');
      } else {
        // Folded: lines join with a space, blank lines become line breaks.
        value = body.reduce((acc, l) => {
          if (l === '') return acc + '\n';
          return acc === '' || acc.endsWith('\n') ? acc + l : acc + ' ' + l;
        }, '');
      }
      value = value.trim();
    } else {
      value = [head, ...cont.map((l) => l.trim())].filter((s) => s !== '').join(' ');
      const q = value[0];
      if ((q === '"' || q === "'") && value.length >= 2 && value.endsWith(q)) value = value.slice(1, -1).trim();
    }
    if (Object.prototype.hasOwnProperty.call(out, key) && !dupes.includes(key)) dupes.push(key);
    out[key] = value;
    i = j;
  }
  return { out, dupes };
}

// Lines outside fenced code blocks (``` or ~~~); fence lines themselves are dropped.
function unfenced(ls) {
  const kept = [];
  let fence = null;
  for (const l of ls) {
    const f = /^\s*(`{3,}|~{3,})/.exec(l);
    if (f) {
      if (!fence) fence = f[1];
      else if (l.trim().startsWith(fence)) fence = null;
      continue;
    }
    if (!fence) kept.push(l);
  }
  return kept;
}

// Placeholders: text in single square brackets, outside inline code, such as
// [todo] or [What it does.]. Not placeholders: Markdown links and reference
// links, escaped brackets, task-list boxes, [[wikilinks]], and index brackets
// directly after a word character such as a[0].
function placeholders(s) {
  const found = [];
  const prose = s.replace(/`[^`\n]*`/g, '');
  for (const m of prose.matchAll(/(?<![\\\]\[\w])\[([^\[\]\n]+)\](?![(\[\]:])/g)) {
    if (/^\s*[xX]?\s*$/.test(m[1]) || m[1].endsWith('\\')) continue;
    found.push(m[0]);
  }
  return found;
}

// Frontmatter: first line "---", closing "---" (trailing whitespace allowed).
const isDelim = (l) => l.trimEnd() === '---';
let fm = {};
let fmEnd = -1;
if (!isDelim(lines[0])) {
  err('SKILL.md must start with a "---" frontmatter line');
} else {
  fmEnd = lines.findIndex((l, i) => i > 0 && isDelim(l));
  if (fmEnd === -1) err('frontmatter has no closing "---"');
  else {
    const parsed = parseFrontmatter(lines.slice(1, fmEnd));
    fm = parsed.out;
    for (const k of parsed.dupes) err(`frontmatter key "${k}" appears more than once`);
  }
}

if (fm.name === undefined) err('frontmatter is missing "name"');
else if (fm.name === '') err('frontmatter "name" is empty');
else {
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(fm.name)) {
    err(`name "${fm.name}" should be lowercase letters and digits in groups joined by single hyphens`);
  }
  if (placeholders(fm.name).length) err('name still contains a [placeholder]');
  if (fm.name !== basename(root)) warn(`name "${fm.name}" differs from folder "${basename(root)}"`);
}

if (fm.description === undefined) err('frontmatter is missing "description"');
else if (fm.description === '') err('frontmatter "description" is empty');
else {
  const words = fm.description.split(/\s+/).filter(Boolean).length;
  if (words > 80) warn(`description is ${words} words; it loads every session, keep it to 80 or fewer`);
  if (placeholders(fm.description).length) err('description still contains a [placeholder]');
  if (!/\bnot\b|\bdo not\b|\bdon't\b/i.test(fm.description)) warn('description does not say when NOT to use the skill');
}

if (lineCount > 120) warn(`SKILL.md is ${lineCount} lines; aim for under 120 and move detail to references/`);

// Headings (levels 1-3) outside fenced code, matched on whole words.
const bodyLines = unfenced(fmEnd > 0 ? lines.slice(fmEnd + 1) : lines);
const headings = bodyLines.filter((l) => /^#{1,3}\s/.test(l));
if (!headings.some((h) => /\b(stop|stops|stopping|done)\b/i.test(h))) err('no "Stop" or "Done" section found');
if (!headings.some((h) => /\bnever\b/i.test(h))) warn('no "Never" section found');

// Body placeholders outside fenced code blocks and inline code.
{
  const found = placeholders(bodyLines.join('\n'));
  if (found.length) {
    const shown = found.slice(0, 3).join(', ');
    warn(`SKILL.md body still contains ${found.length} [placeholder](s): ${shown}${found.length > 3 ? ', ...' : ''}`);
  }
}

// Backticked paths starting references/, templates/ or scripts/ (outside fenced
// code) must exist. A #anchor and trailing .,;: are ignored; paths with [ < * or .. are skipped.
const seen = new Set();
for (const m of unfenced(lines).join('\n').matchAll(/`((?:references|templates|scripts)\/[^`\s]+)`/g)) {
  const rel = m[1].replace(/#.*$/, '').replace(/[.,;:]+$/, '');
  if (seen.has(rel) || /[\[<*]|\.\./.test(rel)) continue;
  seen.add(rel);
  if (!existsSync(join(root, rel))) err(`mentioned file does not exist: ${rel}`);
}

for (const e of errors) console.log(`error:   ${e}`);
for (const w of warnings) console.log(`warning: ${w}`);
console.log(`${errors.length} error(s), ${warnings.length} warning(s), ${lineCount} lines in SKILL.md`);
process.exit(errors.length ? 1 : 0);
