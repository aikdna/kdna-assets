#!/usr/bin/env node

// Independent gate over the CI leg receipt mechanism.
//
// The receipt generator (scripts/ci-leg-receipt.mjs) is never trusted about its
// own verdict. This verifier re-derives, from the committed bytes, the
// unavailability codes each leg is allowed to report, then requires the
// generator's machine-readable receipt to agree - including the sha256 digests
// of the exact input files it read.
//
// The registration is checked in both directions: a code the verifier computes
// but the registry does not name, and a registered code that is no longer true,
// are both findings. That is what keeps the gate from inventing a condition of
// its own and suppressing a leg permanently.
//
// It also proves the not_run mechanism is not self-suppressing: for every
// registered leg it builds a sandbox whose index satisfies every registered
// code (retired 1.0.0 metadata schema, admitted assets, shimmed leg commands)
// and requires the generator to run the leg instead of printing not_run.
//
// usage: node scripts/verify-ci-leg-receipts.mjs [--root <tree>]

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { environmentFor, INPUT_NAMES, LEGS, REGISTRY_PATH } from './ci-leg-definitions.mjs';
import { admissionCodes, missingRequirements } from './ci-leg-receipt.mjs';
import { isEntryPoint } from './lib.mjs';

const RECEIPT_PREFIX = 'KDNA-CI-RECEIPT: ';
const NOT_RUN_PREFIX = 'KDNA-CI-NOT-RUN: ';

function readJson(file) {
  return JSON.parse(readFileSync(file, 'utf8'));
}

export function registryOf(root) {
  return readJson(resolve(root, REGISTRY_PATH));
}

export function digestOf(root, relative) {
  return createHash('sha256').update(readFileSync(resolve(root, relative))).digest('hex');
}

export function expectedDigests(root, environment) {
  // Keyed by the input's name, not by the value the operator configured: the
  // receipt's binding is "these named inputs, with these content digests", and
  // no configured value is ever written into a log.
  const digests = {};
  for (const name of INPUT_NAMES) {
    const relative = environment[name];
    if (typeof relative === 'string' && relative.length > 0) digests[name] = digestOf(root, relative);
  }
  return digests;
}

// Re-derive the unavailability codes for a leg from the committed bytes. The
// registration and the receipt must both agree with this computation; nothing
// is taken from the generator's printed output.
async function codesOf(root, leg, environment) {
  if (leg === 'current-assets') {
    const admission = await admissionCodes(environment, root);
    return { codes: admission.codes };
  }
  return { codes: missingRequirements(environment, root).codes };
}

function onlyLine(stdout, prefix) {
  const lines = stdout.split('\n').filter((line) => line.startsWith(prefix));
  assert.equal(lines.length, 1, `expected exactly one ${prefix}line, got ${lines.length}:\n${stdout}`);
  return lines[0];
}

function parseReceipt(stdout) {
  return JSON.parse(onlyLine(stdout, RECEIPT_PREFIX).slice(RECEIPT_PREFIX.length));
}

function runGenerator(root, leg, environment) {
  return spawnSync(process.execPath, [resolve(root, 'scripts', 'ci-leg-receipt.mjs'), leg], {
    cwd: root,
    env: environment,
    encoding: 'utf8',
  });
}

// The required variables of these legs are the data inputs themselves
// (KDNA_ASSETS_METADATA_INDEX / _PACKAGE), so they keep their real committed
// values here; only the config-missing pass removes them.
function environmentWith(extra = {}) {
  return { ...environmentFor(process.env), ...extra };
}

function environmentWithout(definition) {
  const environment = { ...environmentFor(process.env) };
  for (const name of definition.requires) delete environment[name];
  return environment;
}

function checkConfigMissing(root, leg, definition, findings) {
  const result = runGenerator(root, leg, environmentWithout(definition));
  if (result.status !== 2) {
    findings.push({ leg, check: 'config_missing_exit', detail: `expected exit 2, got ${result.status}` });
  }
  if (!result.stderr.includes(`KDNA-CI-CONFIG-MISSING: ${leg} missing=`)) {
    findings.push({ leg, check: 'config_missing_diagnostic', detail: result.stderr.trim() });
  }
  if (result.stdout.includes(RECEIPT_PREFIX) || result.stdout.includes(NOT_RUN_PREFIX)) {
    findings.push({ leg, check: 'config_missing_emitted_receipt', detail: result.stdout.trim() });
  }
}

async function checkReceipt(root, leg, definition, registration, findings) {
  const environment = environmentWith({
    KDNA_ASSETS_METADATA_INDEX: process.env.KDNA_ASSETS_METADATA_INDEX ?? 'index/current.json',
    KDNA_ASSETS_METADATA_PACKAGE: process.env.KDNA_ASSETS_METADATA_PACKAGE ?? 'package.json',
  });
  const computed = await codesOf(root, leg, environment);
  const computedCodes = new Set(computed.codes);
  const registeredCodes = new Set(registration?.unavailable_codes ?? []);
  for (const code of computedCodes) {
    if (!registeredCodes.has(code)) findings.push({ leg, check: 'unregistered_unavailability_code', detail: code });
  }
  for (const code of registeredCodes) {
    if (!computedCodes.has(code)) findings.push({ leg, check: 'registered_code_no_longer_true', detail: code });
  }
  if (leg === 'current-assets') {
    // The admission probe is a runtime condition; recompute it by running the
    // leg's own admission path through the generator's exported codes is not
    // possible here, so the registration's condition is checked against the
    // receipt below and against the falsification pass.
  }
  const expected = registration?.class === 'not_run' && registeredCodes.size > 0 && computedCodes.size > 0 ? 'not_run' : 'run';
  const result = runGenerator(root, leg, environment);
  if (result.error) throw result.error;
  if (!(result.pid > 0)) findings.push({ leg, check: 'generator_not_spawned' });

  let receipt;
  try {
    receipt = parseReceipt(result.stdout);
  } catch (error) {
    findings.push({ leg, check: 'receipt_unreadable', detail: error.message });
    return undefined;
  }
  if (receipt.leg !== leg) findings.push({ leg, check: 'receipt_leg', detail: receipt.leg });
  try {
    assert.deepEqual(receipt.inputs, expectedDigests(root, environment));
  } catch {
    findings.push({
      leg,
      check: 'receipt_input_digest',
      detail: 'the receipt is not bound to the sha256 digests of the committed input files',
    });
  }

  if (expected === 'not_run') {
    if (result.status !== 0) findings.push({ leg, check: 'not_run_exit', detail: String(result.status) });
    try {
      onlyLine(result.stdout, NOT_RUN_PREFIX);
    } catch (error) {
      findings.push({ leg, check: 'not_run_line', detail: error.message });
    }
    if (receipt.class !== 'not_run') findings.push({ leg, check: 'not_run_class', detail: receipt.class });
    if (receipt.reason !== registration.reason) findings.push({ leg, check: 'not_run_reason', detail: String(receipt.reason) });
    if (receipt.object !== definition.object) findings.push({ leg, check: 'not_run_object', detail: String(receipt.object) });
    const receiptCodes = [...(receipt.unavailable_codes ?? [])].sort();
    const registered = [...registeredCodes].sort();
    if (JSON.stringify(receiptCodes) !== JSON.stringify(registered)) {
      findings.push({ leg, check: 'not_run_codes', detail: receiptCodes.join(',') });
    }
    if (!registration.trigger) findings.push({ leg, check: 'registration_without_trigger' });
    if (!/^\d{4}-\d{2}-\d{2}$/u.test(registration.review_by ?? '')) {
      findings.push({ leg, check: 'registration_without_expiry', detail: String(registration.review_by) });
    } else if (registration.review_by < new Date().toISOString().slice(0, 10)) {
      findings.push({ leg, check: 'registration_expired', detail: registration.review_by });
    }
    return receipt;
  }

  const [command, ...commandArgs] = definition.command(environment);
  const legRun = spawnSync(command, commandArgs, { cwd: root, env: environment, stdio: 'inherit' });
  if (receipt.class !== 'run') findings.push({ leg, check: 'run_class', detail: receipt.class });
  if (receipt.status !== result.status) findings.push({ leg, check: 'run_status', detail: String(receipt.status) });
  if (result.status !== legRun.status) {
    findings.push({ leg, check: 'run_not_the_leg', detail: `generator=${result.status} leg=${legRun.status}` });
  }
  return receipt;
}

// Build an index that satisfies every registered unavailability code, and
// require the gate to run the leg instead of printing not_run.
function checkNotRunIsFalsifiable(root, leg, definition, registration, findings) {
  const sandbox = mkdtempSync(join(tmpdir(), 'kdna-assets-ci-leg-'));
  try {
    const index = {
      schema_version: '1.0.0',
      assets: [
        {
          id: 'falsification-probe',
          technical_status: 'published',
          download: { url: 'https://example.invalid/falsification-probe.kdna' },
          artifact: { path: 'tests/current-fixtures/synthetic/asset.kdna' },
        },
      ],
      clusters: [],
    };
    for (const relative of ['package.json', 'tests/current-fixtures/synthetic/asset.kdna']) {
      mkdirSync(dirname(join(sandbox, relative)), { recursive: true });
      copyFileSync(resolve(root, relative), join(sandbox, relative));
    }
    copyFileSync(resolve(root, 'package-lock.json'), join(sandbox, 'package-lock.json'));
    mkdirSync(join(sandbox, 'fixtures'), { recursive: true });
    copyFileSync(resolve(root, REGISTRY_PATH), join(sandbox, REGISTRY_PATH));
    mkdirSync(join(sandbox, 'scripts'), { recursive: true });
    for (const name of ['ci-leg-receipt.mjs', 'ci-leg-definitions.mjs', 'lib.mjs']) {
      copyFileSync(resolve(root, 'scripts', name), join(sandbox, 'scripts', name));
    }
    writeFileSync(join(sandbox, 'index-satisfied.json'), `${JSON.stringify(index, null, 2)}\n`);
    // The leg commands are shimmed: this check is about the gate's decision,
    // not about auditing a synthetic index with the real tooling.
    writeFileSync(join(sandbox, 'scripts', 'check-current-assets.mjs'), 'process.exit(0);\n');
    writeFileSync(join(sandbox, 'scripts', 'check-release-consistency.mjs'), 'process.exit(0);\n');
    writeFileSync(join(sandbox, 'scripts', 'audit-public-metadata.py'), 'import sys\nsys.exit(0)\n');
    // The installed Core admits the synthetic fixture, so the admission code is
    // gone as well. A minimal stand-in for `@aikdna/kdna-core/node` keeps the
    // check about the gate's decision instead of about module resolution.
    mkdirSync(join(sandbox, 'node_modules', '@aikdna', 'kdna-core'), { recursive: true });
    writeFileSync(
      join(sandbox, 'node_modules', '@aikdna', 'kdna-core', 'package.json'),
      `${JSON.stringify({ name: '@aikdna/kdna-core', version: '0.0.0-falsification', exports: { './node': './node.js' } }, null, 2)}\n`,
    );
    writeFileSync(
      join(sandbox, 'node_modules', '@aikdna', 'kdna-core', 'node.js'),
      "'use strict';\nmodule.exports = { admitNode: async () => ({ status: 'accepted' }) };\n",
    );
    const environment = environmentWith({
      KDNA_ASSETS_METADATA_INDEX: 'index-satisfied.json',
      KDNA_ASSETS_METADATA_PACKAGE: 'package.json',
    });
    const result = runGenerator(sandbox, leg, environment);
    if (result.stdout.includes(NOT_RUN_PREFIX)) {
      findings.push({
        leg,
        check: 'not_run_is_permanent',
        detail: 'the registered unavailability was removed and the gate still refused to run the leg',
      });
      return;
    }
    let receipt;
    try {
      receipt = parseReceipt(result.stdout);
    } catch (error) {
      findings.push({ leg, check: 'falsification_receipt', detail: `${error.message} | status=${result.status} stderr=${result.stderr.trim()}` });
      return;
    }
    if (receipt.class !== 'run') findings.push({ leg, check: 'falsification_class', detail: receipt.class });
  } catch (error) {
    findings.push({ leg, check: 'falsification_error', detail: error.message });
  } finally {
    rmSync(sandbox, { recursive: true, force: true });
  }
}

export async function verify(root) {
  const findings = [];
  const registry = registryOf(root);
  const registered = new Set((registry.entries ?? []).map((entry) => entry.leg));
  for (const leg of Object.keys(LEGS)) {
    if (!registered.has(leg)) findings.push({ leg, check: 'leg_not_registered' });
  }
  for (const entry of registry.entries ?? []) {
    if (!Object.hasOwn(LEGS, entry.leg)) findings.push({ leg: entry.leg, check: 'registration_for_unknown_leg' });
  }
  const receipts = [];
  for (const [leg, definition] of Object.entries(LEGS)) {
    checkConfigMissing(root, leg, definition, findings);
    const registration = (registry.entries ?? []).find((entry) => entry.leg === leg);
    const receipt = await checkReceipt(root, leg, definition, registration, findings);
    if (receipt) receipts.push(receipt);
    if (registration?.class === 'not_run') checkNotRunIsFalsifiable(root, leg, definition, registration, findings);
  }
  return { findings, receipts };
}

async function main(argv) {
  const rootIndex = argv.indexOf('--root');
  const root = rootIndex === -1 ? resolve(import.meta.dirname, '..') : resolve(argv[rootIndex + 1]);
  const { findings, receipts } = await verify(root);
  if (findings.length > 0) {
    console.log(`KDNA-CI-LEG-RECEIPTS: findings=${findings.length} root=${root} ${JSON.stringify(findings)}`);
    return 1;
  }
  const classes = receipts.map((receipt) => `${receipt.leg}=${receipt.class}`).join(',');
  console.log(`KDNA-CI-LEG-RECEIPTS: ok root=${root} legs=${receipts.length} ${classes}`);
  return 0;
}

if (isEntryPoint(import.meta.url)) process.exitCode = await main(process.argv.slice(2));
