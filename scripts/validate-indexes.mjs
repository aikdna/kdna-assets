#!/usr/bin/env node

import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { argValue, failWith, readJson } from './lib.mjs';

const args = process.argv.slice(2);
const currentPath = argValue(args, '--current', 'index/current.json');
const archivePath = argValue(args, '--archive', 'archive/index.json');
const currentSchemaPath = argValue(args, '--current-schema', 'schemas/current-index.schema.json');
const archiveSchemaPath = argValue(args, '--archive-schema', 'schemas/archive-index.schema.json');
const expectedArchiveCount = Number(argValue(args, '--expected-archive-count', '52'));
const errors = [];

const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);

validateFile('current index', currentPath, currentSchemaPath);
validateFile('archive index', archivePath, archiveSchemaPath);

const current = readJson(currentPath);
const archive = readJson(archivePath);
const currentIds = [...(current.assets || []), ...(current.clusters || [])].map((entry) => entry.id);
if (new Set(currentIds).size !== currentIds.length) errors.push('current index contains duplicate ids');
const currentPaths = [
  ...(current.assets || []).map((entry) => entry.artifact?.path),
  ...(current.clusters || []).map((entry) => entry.manifest?.path),
].filter(Boolean);
if (new Set(currentPaths).size !== currentPaths.length) errors.push('current index contains duplicate paths');

if ((archive.assets || []).length !== expectedArchiveCount) {
  errors.push(`archive count expected ${expectedArchiveCount}, found ${(archive.assets || []).length}`);
}
const archiveKeys = (archive.assets || []).map((entry) => `${entry.tag}/${entry.file}`);
if (new Set(archiveKeys).size !== archiveKeys.length) errors.push('archive contains duplicate tag/file entries');

failWith(errors, 'Index validation');
console.log('Index validation: PASS');
console.log(`  current assets:   ${current.assets.length}`);
console.log(`  current clusters: ${current.clusters.length}`);
console.log(`  archive entries:  ${archive.assets.length}`);

function validateFile(label, dataPath, schemaPath) {
  const validate = ajv.compile(readJson(schemaPath));
  if (validate(readJson(dataPath))) return;
  for (const error of validate.errors || []) {
    errors.push(`${label}${error.instancePath || '/'} ${error.message}`);
  }
}
