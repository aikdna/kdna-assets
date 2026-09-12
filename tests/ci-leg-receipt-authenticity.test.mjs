import test from 'node:test';
import assert from 'node:assert/strict';
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { LEGS, REGISTRY_PATH } from '../scripts/ci-leg-definitions.mjs';

// The receipt mechanism is only worth as much as the gate that consumes it.
// These cases replace the receipt generator, its registration, or its index
// input, and require scripts/verify-ci-leg-receipts.mjs to go red; the
// authentic tree must stay green.

const root = resolve(import.meta.dirname, '..');
const consumer = join(root, 'scripts', 'verify-ci-leg-receipts.mjs');
const generator = join(root, 'scripts', 'ci-leg-receipt.mjs');
const INDEX = 'index/current.json';
const LEG = 'index-metadata';

function sandboxTree() {
  const sandbox = mkdtempSync(join(tmpdir(), 'assets-leg-receipts-'));
  cpSync(join(root, 'scripts'), join(sandbox, 'scripts'), { recursive: true });
  cpSync(join(root, 'index'), join(sandbox, 'index'), { recursive: true });
  cpSync(join(root, 'tests', 'current-fixtures'), join(sandbox, 'tests', 'current-fixtures'), { recursive: true });
  cpSync(join(root, 'references'), join(sandbox, 'references'), { recursive: true });
  mkdirSync(join(sandbox, 'fixtures'), { recursive: true });
  cpSync(join(root, REGISTRY_PATH), join(sandbox, REGISTRY_PATH));
  cpSync(join(root, 'package.json'), join(sandbox, 'package.json'));
  cpSync(join(root, 'package-lock.json'), join(sandbox, 'package-lock.json'));
  // The admission probe needs the installed vendored Core; reuse this
  // repository's node_modules instead of reinstalling it per case.
  symlinkSync(join(root, 'node_modules'), join(sandbox, 'node_modules'));
  return sandbox;
}

function runConsumer(tree, environment = {}) {
  return spawnSync(process.execPath, [consumer, '--root', tree], {
    encoding: 'utf8',
    env: {
      ...process.env,
      KDNA_ASSETS_METADATA_INDEX: INDEX,
      KDNA_ASSETS_METADATA_PACKAGE: 'package.json',
      ...environment,
    },
  });
}

function withSandbox(body) {
  const sandbox = sandboxTree();
  try {
    return body(sandbox);
  } finally {
    rmSync(sandbox, { recursive: true, force: true });
  }
}

function stubGenerator(tree, source) {
  writeFileSync(join(tree, 'scripts', 'ci-leg-receipt.mjs'), source);
}

test('the authentic generator satisfies the independent consumer', () => {
  withSandbox((sandbox) => {
    const result = runConsumer(sandbox);
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.match(result.stdout, /KDNA-CI-LEG-RECEIPTS: ok/);
  });
});

test('a generator that always prints success makes the gate red', () => {
  withSandbox((sandbox) => {
    stubGenerator(
      sandbox,
      "'use strict';\nconsole.log(`KDNA-CI-OK: ${process.argv[2]} success`);\n",
    );
    const result = runConsumer(sandbox);
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.match(result.stdout, /receipt_unreadable|not_run_line|not_run_class|config_missing_exit/);
  });
});

test('a generator that prints a fabricated not_run receipt makes the gate red', () => {
  withSandbox((sandbox) => {
    stubGenerator(
      sandbox,
      [
        "'use strict';",
        'const leg = process.argv[2];',
        "console.log(`KDNA-CI-NOT-RUN: ${leg} reason=retired_index_metadata_schema object=index published in the retired 1.0.0 metadata schema (technical_status + download) index=${process.env.KDNA_ASSETS_METADATA_INDEX} unavailable=index_schema_version`);",
        "console.log('KDNA-CI-RECEIPT: ' + JSON.stringify({ leg, class: 'not_run', reason: 'retired_index_metadata_schema', object: 'index published in the retired 1.0.0 metadata schema (technical_status + download)', unavailable_codes: ['index_schema_version'], inputs: {} }));",
        '',
      ].join('\n'),
    );
    const result = runConsumer(sandbox);
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.match(result.stdout, /receipt_input_digest|not_run_codes|receipt_unreadable/);
  });
});

test('a generator whose condition is inverted is caught once the registered conditions are gone', () => {
  withSandbox((sandbox) => {
    const source = readFileSync(generator, 'utf8');
    const mutated = source.replace(
      [
        '  const agrees =',
        "    registration?.class === 'not_run' &&",
        '    computed.size === registered.size &&',
        '    [...computed].every((code) => registered.has(code));',
      ].join('\n'),
      '  const agrees = true;',
    );
    assert.notEqual(mutated, source, 'the hostile mutation must actually change the generator');
    stubGenerator(sandbox, mutated);
    const result = runConsumer(sandbox);
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.match(result.stdout, /not_run_is_permanent|run_class|falsification/);
  });
});

test('a registered code that is no longer true makes the gate red', () => {
  withSandbox((sandbox) => {
    // Satisfy only the schema condition: the other registered codes are gone.
    const index = JSON.parse(readFileSync(join(sandbox, INDEX), 'utf8'));
    index.schema_version = '1.0.0';
    writeFileSync(join(sandbox, INDEX), `${JSON.stringify(index, null, 2)}\n`);
    const result = runConsumer(sandbox);
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.match(result.stdout, /registered_code_no_longer_true/);
  });
});

test('an unavailability code the registry does not name makes the gate red', () => {
  withSandbox((sandbox) => {
    const registryPath = join(sandbox, REGISTRY_PATH);
    const registry = JSON.parse(readFileSync(registryPath, 'utf8'));
    for (const entry of registry.entries) {
      if (entry.leg === LEG) {
        entry.unavailable_codes = entry.unavailable_codes.filter((code) => code !== 'index_schema_version');
      }
    }
    writeFileSync(registryPath, `${JSON.stringify(registry, null, 2)}\n`);
    const result = runConsumer(sandbox);
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.match(result.stdout, /unregistered_unavailability_code/);
  });
});

test('a leg that is not registered cannot be suppressed', () => {
  withSandbox((sandbox) => {
    const registryPath = join(sandbox, REGISTRY_PATH);
    const registry = JSON.parse(readFileSync(registryPath, 'utf8'));
    registry.entries = registry.entries.filter((entry) => entry.leg !== LEG);
    writeFileSync(registryPath, `${JSON.stringify(registry, null, 2)}\n`);
    const result = runConsumer(sandbox);
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.match(result.stdout, /leg_not_registered/);
    const generatorRun = spawnSync(process.execPath, [join(sandbox, 'scripts', 'ci-leg-receipt.mjs'), LEG], {
      cwd: sandbox,
      encoding: 'utf8',
      env: { ...process.env, KDNA_ASSETS_METADATA_INDEX: INDEX, KDNA_ASSETS_METADATA_PACKAGE: 'package.json' },
    });
    assert.doesNotMatch(generatorRun.stdout, /KDNA-CI-NOT-RUN/);
    assert.match(generatorRun.stdout, /KDNA-CI-RECEIPT: .*"class":"run"/);
  });
});

test('a registration without an expiry is rejected', () => {
  withSandbox((sandbox) => {
    const registryPath = join(sandbox, REGISTRY_PATH);
    const registry = JSON.parse(readFileSync(registryPath, 'utf8'));
    delete registry.entries[0].review_by;
    writeFileSync(registryPath, `${JSON.stringify(registry, null, 2)}\n`);
    const result = runConsumer(sandbox);
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.match(result.stdout, /registration_without_expiry/);
  });
});

test('the receipt generator still runs when it is reached through a symlinked path', () => {
  withSandbox((sandbox) => {
    const link = join(sandbox, 'symlinked');
    symlinkSync(sandbox, link);
    const result = spawnSync(process.execPath, [join(link, 'scripts', 'ci-leg-receipt.mjs'), LEG], {
      encoding: 'utf8',
      env: { ...process.env, KDNA_ASSETS_METADATA_INDEX: INDEX, KDNA_ASSETS_METADATA_PACKAGE: 'package.json' },
    });
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.match(result.stdout, /KDNA-CI-RECEIPT: /, 'a symlinked invocation must not silently no-op');
  });
});
