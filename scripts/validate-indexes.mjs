#!/usr/bin/env node

import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { argValue, failWith, readJson } from './lib.mjs';

const args = process.argv.slice(2);
const currentPath = argValue(args, '--current', 'index/current.json');
const currentSchemaPath = argValue(args, '--current-schema', 'schemas/current-index.schema.json');
const errors = [];

const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);

validateFile('current index', currentPath, currentSchemaPath);

const current = readJson(currentPath);
const currentIds = [...(current.assets || []), ...(current.clusters || [])].map((entry) => entry.id);
if (new Set(currentIds).size !== currentIds.length) errors.push('current index contains duplicate ids');
const currentPaths = [
  ...(current.assets || []).map((entry) => entry.artifact?.path),
  ...(current.clusters || []).map((entry) => entry.manifest?.path),
].filter(Boolean);
if (new Set(currentPaths).size !== currentPaths.length) errors.push('current index contains duplicate paths');

failWith(errors, 'Index validation');
console.log('Index validation: PASS');
console.log(`  current assets:   ${current.assets.length}`);
console.log(`  current clusters: ${current.clusters.length}`);

function validateFile(label, dataPath, schemaPath) {
  const validate = ajv.compile(readJson(schemaPath));
  if (validate(readJson(dataPath))) return;
  for (const error of validate.errors || []) {
    errors.push(`${label}${error.instancePath || '/'} ${error.message}`);
  }
}
