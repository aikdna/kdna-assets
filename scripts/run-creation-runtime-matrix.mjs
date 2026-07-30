#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import {
  existsSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  realpathSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
  mkdirSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import {
  basename,
  dirname,
  isAbsolute,
  join,
  relative,
  resolve,
  sep,
} from 'node:path';
import { spawnSync } from 'node:child_process';

import {
  buildRoleWorkspace,
  loadCreationEngine,
} from './run-creation-acceptance.mjs';

const repoRoot = resolve(import.meta.dirname, '..');

function run() {
  const args = process.argv.slice(2);
  const catalogPath = resolveInput(
    argValue(args, '--catalog', join(repoRoot, 'fixtures/creation-acceptance/catalog.json')),
  );
  const receiptArgument = argValue(args, '--receipt');
  if (args.includes('--no-receipt') && receiptArgument !== null) {
    throw new Error('--receipt and --no-receipt cannot be used together');
  }
  const receiptPath = receiptArgument === null
    ? null
    : resolveExternalReceiptPath(receiptArgument);
  const studioCliPath = resolveStudioCli(argValue(args, '--studio-cli'));
  const swiftCorePath = resolveSwiftCore(argValue(args, '--swift-core'));
  const catalog = readJson(catalogPath);
  const studio = loadCreationEngine(argValue(args, '--studio-core'));
  const studioRequire = createRequire(studio.entry);
  const jsCorePackagePath = studioRequire.resolve('@aikdna/kdna-core/package.json');
  const jsCoreRoot = dirname(jsCorePackagePath);
  const jsCore = studioRequire('@aikdna/kdna-core');
  const tempRoot = mkdtempSync(join(tmpdir(), 'kdna-creation-runtime-matrix-'));

  try {
    const fixture = catalog.roles.find((entry) => entry.role === 'agent-authored-non-human');
    if (!fixture) throw new Error('agent-authored-non-human fixture is missing');
    let workspace = buildRoleWorkspace(studio.engine, catalog, fixture);
    const creationReadiness = studio.engine.assessReadiness(workspace);
    if (!creationReadiness.creation_accepted) {
      throw new Error('agent-authored fixture is not Creation Accepted');
    }
    studio.engine.compileProject(workspace);
    const workspacePath = join(tempRoot, 'accepted-engine-workspace');
    workspace = studio.engine.saveWorkspace(workspacePath, workspace);
    const assetPath = join(tempRoot, 'creation-runtime-matrix.kdna');
    const cli = runStudioCli(studioCliPath, workspacePath, assetPath);
    const assetBytes = readFileSync(assetPath);
    const inspection = jsCore.inspect(assetPath);
    const receiptedWorkspace = studio.engine.loadWorkspace(workspacePath);
    const buildReceipt = receiptedWorkspace.buildReceipt;
    if (
      buildReceipt?.status !== 'verified' ||
      buildReceipt.asset_digest !== `sha256:${sha256(assetBytes)}`
    ) {
      throw new Error('Studio CLI did not persist a verified receipt for the exact asset');
    }

    const js = verifyJavaScriptRuntime(jsCore, assetPath);
    const swift = verifySwiftRuntime(swiftCorePath, assetPath, tempRoot);
    const semanticAgreement = compareRuntimeSemantics(js.capsules, swift.capsules);
    const result = {
      status: 'PASS',
      contract: 'creation-runtime-studio-cli-javascript-swift-source-candidate-matrix',
      authority: 'synthetic_fixture_authority',
      external_claim_permitted: false,
      generated_at: new Date().toISOString(),
      matrix_scope: {
        javascript_runtime: 'studio-core-resolved-package',
        swift_runtime: 'explicit-source-checkout',
        studio_cli: 'explicit-source-checkout-export-agent',
        clean_install: 'not-evaluated-release-gate',
      },
      fixture_id: fixture.id,
      catalog_sha256: `sha256:${sha256(readFileSync(catalogPath))}`,
      artifact: {
        sha256: sha256(assetBytes),
        bytes: assetBytes.length,
        asset_id: inspection.asset_id,
        asset_uid: inspection.asset_uid,
        version: inspection.version,
        judgment_version: inspection.judgment_version,
      },
      creation_engine: {
        schema_version: studio.engine.SCHEMA_VERSION,
        semantic_digest: workspace.state.semantic_digest,
        semantic_revision: workspace.state.semantic_revision,
        creation_accepted: true,
      },
      source_coordinates: {
        studio_core: sourceCoordinate(dirname(dirname(studio.entry)), [
          'package.json',
          'src',
          'schemas',
        ]),
        javascript_core: {
          package: readJson(jsCorePackagePath).name,
          version: readJson(jsCorePackagePath).version,
          source_digest: sourceDigest(jsCoreRoot, ['package.json', 'src', 'schema']),
        },
        swift_core: sourceCoordinate(swiftCorePath, [
          'Package.swift',
          'Package.resolved',
          'Sources',
        ]),
        studio_cli: {
          package: readJson(join(studioCliPath, 'package.json')).name,
          version: readJson(join(studioCliPath, 'package.json')).version,
          ...sourceCoordinate(studioCliPath, [
            'package.json',
            'bin',
            'src',
          ]),
        },
      },
      studio_cli: cliReceipt(cli, buildReceipt),
      semantic_agreement: semanticAgreement,
      javascript_runtime: js.receipt,
      swift_runtime: swift.receipt,
    };
    if (receiptPath) writeReceipt(receiptPath, result);
    if (args.includes('--json')) {
      console.log(JSON.stringify(result, null, 2));
      return;
    }
    console.log('Creation independent Runtime matrix: PASS');
    console.log(`  artifact:      sha256:${result.artifact.sha256}`);
    console.log(`  Studio Core:   ${coordinateLabel(result.source_coordinates.studio_core)}`);
    console.log(
      `  JS Core:       ${result.source_coordinates.javascript_core.package}` +
      `@${result.source_coordinates.javascript_core.version} ` +
      `${result.source_coordinates.javascript_core.source_digest}`,
    );
    console.log(`  Swift Core:    ${coordinateLabel(result.source_coordinates.swift_core)}`);
    console.log(`  Studio CLI:    ${coordinateLabel(result.source_coordinates.studio_cli)}`);
    console.log('  JS Runtime:    LoadPlan ready; compact/full Capsules verified');
    console.log('  Swift Runtime: LoadPlan ready; compact/full Capsules verified');
    console.log('  semantics:     compact/full semantic fields matched');
    console.log('  Studio CLI:    export-agent verified and receipted the exact asset');
    console.log('  clean install: not evaluated; remains a release gate');
    if (receiptPath) console.log('  receipt:       written to explicit external path');
    console.log('  authority:     synthetic_fixture_authority only');
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
}

function verifyJavaScriptRuntime(core, assetPath) {
  const validation = core.validate(assetPath);
  if (validation.overall_valid !== true) {
    throw new Error(`JavaScript Core validation failed: ${issueCodes(validation)}`);
  }
  const plan = core.planLoad(assetPath);
  if (plan.state !== 'ready' || plan.can_load_now !== true) {
    throw new Error(`JavaScript Core LoadPlan is not ready: ${issueCodes(plan)}`);
  }
  const compact = core.loadAsset(assetPath, {
    profile: 'compact',
    as: 'json',
    loadedAt: '2026-07-28T00:00:00.000Z',
  });
  const full = core.loadAsset(assetPath, {
    profile: 'full',
    as: 'json',
    loadedAt: '2026-07-28T00:00:00.000Z',
  });
  assertCapsule(compact, 'compact', 'JavaScript');
  assertCapsule(full, 'full', 'JavaScript');
  const capsules = {
    compact: semanticCapsule(compact),
    full: semanticCapsule(full),
  };
  return {
    capsules,
    receipt: {
      validation: 'valid',
      load_plan: plan.state,
      compact_capsule: capsuleReceipt(capsules.compact),
      full_capsule: capsuleReceipt(capsules.full),
    },
  };
}

function runStudioCli(studioCliPath, workspacePath, assetPath) {
  const entry = join(studioCliPath, 'bin', 'kdna-studio.js');
  const args = [
    entry,
    'export-agent',
    workspacePath,
    '--out',
    assetPath,
    '--operation-id',
    'creation-runtime-matrix:export',
    '--json',
  ];
  const execution = spawnSync(process.execPath, args, {
    cwd: studioCliPath,
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
  });
  if (execution.status !== 0) {
    throw new Error(
      `Studio CLI export-agent failed:\n${execution.stdout || ''}\n${execution.stderr || ''}`,
    );
  }
  let response;
  try {
    response = JSON.parse(execution.stdout);
  } catch {
    throw new Error('Studio CLI export-agent emitted a non-JSON result');
  }
  if (
    response.export?.format_valid !== true ||
    response.export?.creation_accepted !== true ||
    !existsSync(assetPath)
  ) {
    throw new Error('Studio CLI export-agent did not produce an accepted Runtime asset');
  }
  return {
    exit_code: execution.status,
    response,
  };
}

function cliReceipt(cli, buildReceipt) {
  return {
    command_contract:
      'kdna-studio export-agent <accepted-engine-workspace> --out <asset.kdna> ' +
      '--operation-id <private-operation-id> --json',
    exit_code: cli.exit_code,
    result: {
      format_valid: cli.response.export.format_valid,
      creation_accepted: cli.response.export.creation_accepted,
      verification: cli.response.export.verification,
    },
    persisted_build_receipt: {
      status: buildReceipt.status,
      asset_digest: buildReceipt.asset_digest,
      semantic_revision: buildReceipt.semantic_revision,
      semantic_digest: buildReceipt.semantic_digest,
      tool_coordinates: buildReceipt.tool_coordinates,
      results: buildReceipt.results,
    },
  };
}

function verifySwiftRuntime(swiftCorePath, assetPath, tempRoot) {
  const swiftVersion = spawnSync('swift', ['--version'], { encoding: 'utf8' });
  if (swiftVersion.error?.code === 'ENOENT') {
    throw new Error(
      'Swift is unavailable. The independent Runtime matrix is an explicit optional gate; ' +
      'install Swift before running it.',
    );
  }
  if (swiftVersion.status !== 0) {
    throw new Error(`swift --version failed: ${swiftVersion.stderr || swiftVersion.stdout}`);
  }
  const packageRoot = join(tempRoot, 'swift-runtime-probe');
  const sourceRoot = join(packageRoot, 'Sources', 'RuntimeProbe');
  mkdirSync(sourceRoot, { recursive: true });
  writeFileSync(
    join(packageRoot, 'Package.swift'),
    swiftPackage(swiftCorePath),
  );
  writeFileSync(join(sourceRoot, 'main.swift'), swiftProbeSource());
  const execution = spawnSync(
    'swift',
    [
      'run',
      '--package-path', packageRoot,
      '--scratch-path', join(packageRoot, '.build'),
      'RuntimeProbe',
      assetPath,
    ],
    {
      encoding: 'utf8',
      maxBuffer: 20 * 1024 * 1024,
    },
  );
  if (execution.status !== 0) {
    throw new Error(
      `Swift Runtime probe failed:\n${execution.stdout || ''}\n${execution.stderr || ''}`,
    );
  }
  const outputLine = execution.stdout
    .trim()
    .split('\n')
    .reverse()
    .find((line) => line.trim().startsWith('{'));
  if (!outputLine) throw new Error('Swift Runtime probe emitted no JSON result');
  const result = JSON.parse(outputLine);
  if (
    result.load_plan !== 'ready' ||
    result.compact_capsule?.profile !== 'compact' ||
    result.full_capsule?.profile !== 'full' ||
    result.compact_capsule?.type !== 'kdna.runtime-capsule' ||
    result.full_capsule?.type !== 'kdna.runtime-capsule'
  ) {
    throw new Error(`Swift Runtime probe returned an unexpected result: ${outputLine}`);
  }
  const capsules = {
    compact: semanticCapsule(result.compact_capsule),
    full: semanticCapsule(result.full_capsule),
  };
  return {
    capsules,
    receipt: {
      swift_version: firstLine(swiftVersion.stdout || swiftVersion.stderr),
      validation: 'valid',
      load_plan: result.load_plan,
      compact_capsule: capsuleReceipt(capsules.compact),
      full_capsule: capsuleReceipt(capsules.full),
    },
  };
}

function swiftPackage(swiftCorePath) {
  return `// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "CreationRuntimeProbe",
    platforms: [.macOS(.v13)],
    dependencies: [
        .package(path: "${escapeSwift(swiftCorePath)}")
    ],
    targets: [
        .executableTarget(
            name: "RuntimeProbe",
            dependencies: [
                .product(name: "KDNACore", package: "kdna-core-swift")
            ]
        )
    ]
)
`;
}

function swiftProbeSource() {
  return `import Foundation
import KDNACore

guard CommandLine.arguments.count == 2 else {
    fputs("expected one .kdna path\\n", stderr)
    exit(2)
}

let assetURL = URL(fileURLWithPath: CommandLine.arguments[1])
let plan = KDNARuntime.planLoad(assetURL: assetURL)
guard plan.state == "ready", plan.can_load_now, plan.checks.overall_valid else {
    fputs("Swift LoadPlan did not become ready\\n", stderr)
    exit(3)
}

let compact = try KDNARuntime.load(
    assetURL: assetURL,
    profile: "compact",
    loadedAt: "2026-07-28T00:00:00.000Z"
)
let full = try KDNARuntime.load(
    assetURL: assetURL,
    profile: "full",
    loadedAt: "2026-07-28T00:00:00.000Z"
)

guard compact.type == "kdna.runtime-capsule",
      compact.profile == "compact",
      full.type == "kdna.runtime-capsule",
      full.profile == "full" else {
    fputs("Swift Runtime Capsule profile mismatch\\n", stderr)
    exit(4)
}

let encoder = JSONEncoder()
let compactObject = try JSONSerialization.jsonObject(with: encoder.encode(compact))
let fullObject = try JSONSerialization.jsonObject(with: encoder.encode(full))
let result: [String: Any] = [
    "load_plan": plan.state,
    "compact_capsule": compactObject,
    "full_capsule": fullObject
]
let data = try JSONSerialization.data(withJSONObject: result, options: [.sortedKeys])
print(String(decoding: data, as: UTF8.self))
`;
}

function assertCapsule(capsule, profile, runtime) {
  if (
    capsule?.type !== 'kdna.runtime-capsule' ||
    capsule?.contract_version !== '0.1.0' ||
    capsule?.profile !== profile
  ) {
    throw new Error(`${runtime} ${profile} Runtime Capsule is invalid`);
  }
}

function semanticCapsule(capsule) {
  return {
    type: capsule.type,
    contract_version: capsule.contract_version,
    asset: capsule.asset,
    digests: capsule.digests,
    signature: capsule.signature,
    access: capsule.access,
    profile: capsule.profile,
    context: capsule.context,
    trace: {
      payload_encoding: capsule.trace.payload_encoding,
      loaded_by: capsule.trace.loaded_by,
      input_kind: capsule.trace.input_kind,
      runtime_eligible: capsule.trace.runtime_eligible,
      schema_valid: capsule.trace.schema_valid,
      signature_state: capsule.trace.signature_state,
      profile: capsule.trace.profile,
      ...(capsule.trace.projection_report === undefined
        ? {}
        : { projection_report: capsule.trace.projection_report }),
    },
  };
}

function capsuleReceipt(capsule) {
  return {
    type: capsule.type,
    contract_version: capsule.contract_version,
    profile: capsule.profile,
    semantic_digest: prefixedSha256(canonicalJson(capsule)),
    context_digest: prefixedSha256(canonicalJson(capsule.context)),
    context_top_level_fields: Object.keys(capsule.context).sort(),
  };
}

function compareRuntimeSemantics(javascript, swift) {
  const fields = [
    'asset',
    'digests',
    'signature',
    'access',
    'profile',
    'context',
    'trace-without-loaded-at',
  ];
  const profiles = {};
  for (const profile of ['compact', 'full']) {
    const javascriptCanonical = canonicalJson(javascript[profile]);
    const swiftCanonical = canonicalJson(swift[profile]);
    if (javascriptCanonical !== swiftCanonical) {
      throw new Error(
        `${profile} Runtime Capsule semantic fields differ between JavaScript and Swift`,
      );
    }
    profiles[profile] = {
      status: 'matched',
      semantic_digest: prefixedSha256(javascriptCanonical),
    };
  }
  return {
    status: 'matched',
    fields_compared: fields,
    profiles,
  };
}

function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`)
      .join(',')}}`;
  }
  return JSON.stringify(value);
}

function prefixedSha256(value) {
  return `sha256:${sha256(value)}`;
}

function writeReceipt(path, value) {
  const externalPath = resolveExternalReceiptPath(path);
  mkdirSync(dirname(externalPath), { recursive: true });
  const temporary = `${externalPath}.tmp-${process.pid}`;
  try {
    writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`);
    renameSync(temporary, externalPath);
  } finally {
    rmSync(temporary, { force: true });
  }
}

function resolveExternalReceiptPath(input) {
  if (typeof input !== 'string' || input.length === 0 || input.startsWith('--')) {
    throw new Error('--receipt requires an explicit path outside this public repository');
  }
  const target = resolveInput(input);
  const resolvedRepoRoot = resolve(repoRoot);
  if (isWithin(resolvedRepoRoot, target)) {
    throw new Error(
      '--receipt must target private coordination outside this public repository',
    );
  }
  const canonicalRepoRoot = realpathSync(resolvedRepoRoot);
  const canonicalTarget = canonicalizePotentialPath(target);
  if (isWithin(canonicalRepoRoot, canonicalTarget)) {
    throw new Error(
      '--receipt must target private coordination outside this public repository',
    );
  }
  return target;
}

function isWithin(root, target) {
  const targetFromRoot = relative(root, target);
  return (
    targetFromRoot === '' ||
    (
      targetFromRoot !== '..' &&
      !targetFromRoot.startsWith(`..${sep}`) &&
      !isAbsolute(targetFromRoot)
    )
  );
}

function canonicalizePotentialPath(target) {
  let existingAncestor = target;
  while (!existsSync(existingAncestor)) {
    const parent = dirname(existingAncestor);
    if (parent === existingAncestor) break;
    existingAncestor = parent;
  }
  const canonicalAncestor = realpathSync(existingAncestor);
  return resolve(canonicalAncestor, relative(existingAncestor, target));
}

function sourceCoordinate(root, includePaths) {
  const commit = git(root, ['rev-parse', 'HEAD']);
  const dirty = git(root, ['status', '--short'], { allowFailure: true });
  return {
    git_commit: commit || null,
    worktree: dirty ? 'dirty' : 'clean',
    source_digest: sourceDigest(root, includePaths),
  };
}

function sourceDigest(root, includePaths) {
  const files = [];
  for (const include of includePaths) {
    const target = join(root, include);
    if (!existsSync(target)) continue;
    collectFiles(target, files);
  }
  files.sort();
  const hash = createHash('sha256');
  for (const file of files) {
    hash.update(relative(root, file));
    hash.update('\0');
    hash.update(readFileSync(file));
    hash.update('\0');
  }
  return `sha256:${hash.digest('hex')}`;
}

function collectFiles(target, files) {
  const stat = statSync(target);
  if (stat.isFile()) {
    files.push(target);
    return;
  }
  if (!stat.isDirectory()) return;
  for (const name of readdirSync(target)) {
    if (name === '.build' || name === 'node_modules' || name === '.git') continue;
    collectFiles(join(target, name), files);
  }
}

function git(root, args, options = {}) {
  const result = spawnSync('git', ['-C', root, ...args], { encoding: 'utf8' });
  if (result.status === 0) return result.stdout.trim();
  if (options.allowFailure) return '';
  throw new Error(`git ${args.join(' ')} failed for ${basename(root)}`);
}

function resolveSwiftCore(input) {
  const candidates = input
    ? [resolveInput(input)]
    : [resolve(repoRoot, '../kdna-core-swift')];
  const target = candidates.find((candidate) => existsSync(join(candidate, 'Package.swift')));
  if (!target) {
    throw new Error(
      'Swift Core was not found. Pass --swift-core <kdna-core-swift checkout>.',
    );
  }
  return target;
}

function resolveStudioCli(input) {
  const candidates = input
    ? [resolveInput(input)]
    : [resolve(repoRoot, '../kdna-studio-cli')];
  const target = candidates.find(
    (candidate) => existsSync(join(candidate, 'bin', 'kdna-studio.js')),
  );
  if (!target) {
    throw new Error(
      'Studio CLI was not found. Pass --studio-cli <kdna-studio-cli checkout>.',
    );
  }
  return target;
}

function resolveInput(input) {
  return isAbsolute(input) ? input : resolve(process.cwd(), input);
}

function argValue(args, flag, fallback = null) {
  const equals = args.find((arg) => arg.startsWith(`${flag}=`));
  if (equals) return equals.slice(flag.length + 1);
  const index = args.indexOf(flag);
  if (index < 0) return fallback;
  return args[index + 1] ?? '';
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function issueCodes(value) {
  return (value?.issues || []).map((issue) => issue.code).join(', ') || 'unknown';
}

function coordinateLabel(coordinate) {
  return `${coordinate.git_commit || 'no-git'}+${coordinate.worktree} ${coordinate.source_digest}`;
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function escapeSwift(value) {
  return value.replaceAll('\\', '\\\\').replaceAll('"', '\\"');
}

function firstLine(value) {
  return String(value || '').trim().split('\n')[0] || 'unknown';
}

try {
  run();
} catch (error) {
  console.error(`Creation independent Runtime matrix: FAIL\n  ${error.message}`);
  process.exit(1);
}
