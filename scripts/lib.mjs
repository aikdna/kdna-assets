import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export function argValue(args, flag, fallback = null) {
  const equals = args.find((arg) => arg.startsWith(`${flag}=`));
  if (equals) return equals.slice(flag.length + 1);
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : fallback;
}

export function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

export function requireFile(path, label = 'file') {
  if (!existsSync(path)) throw new Error(`${label} not found: ${path}`);
}

export function sha256(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

export function parseSidecar(text) {
  return text.trim().split(/\s+/)[0]?.toLowerCase() || '';
}

export function resolveFrom(root, path) {
  return resolve(root, path);
}

export function failWith(errors, label) {
  if (!errors.length) return;
  console.error(`${label}: FAIL (${errors.length} error(s))`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

export function loadIndexes(currentPath, archivePath) {
  return {
    current: readJson(currentPath),
    archive: readJson(archivePath),
  };
}

export function canonicalReleaseUrl(tag, file) {
  return `https://github.com/aikdna/kdna-assets/releases/download/${tag}/${file}`;
}

export function sidecarCandidates(file) {
  return [`${file}.sha256`, file.replace(/\.kdna$/, '.sha256')];
}
