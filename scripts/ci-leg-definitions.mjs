// Shared, committed definitions for the gated CI legs. The receipt generator
// (scripts/ci-leg-receipt.mjs) and the independent verifier
// (scripts/verify-ci-leg-receipts.mjs) both read these; the verifier never
// trusts the generator's own view of them.

export const REGISTRY_PATH = 'fixtures/ci-leg-registry.json';

export const LEGS = Object.freeze({
  'current-assets': {
    requires: Object.freeze(['KDNA_ASSETS_METADATA_INDEX']),
    object: 'indexed assets admitted by the committed public Core',
    command: () => ['node', 'scripts/check-current-assets.mjs'],
  },
  'index-metadata': {
    requires: Object.freeze(['KDNA_ASSETS_METADATA_INDEX']),
    object: 'index published in the retired 1.0.0 metadata schema (technical_status + download)',
    command: (environment) =>
      environment.KDNA_CI_ONLINE === '1'
        ? ['python3', 'scripts/audit-public-metadata.py', '--online-releases']
        : ['python3', 'scripts/audit-public-metadata.py'],
  },
  'online-release-consistency': {
    requires: Object.freeze(['KDNA_ASSETS_METADATA_INDEX']),
    object: 'index download coordinates for the online GitHub Release comparison',
    command: () => ['node', 'scripts/check-release-consistency.mjs', '--online'],
  },
});

export function environmentFor(source = process.env) {
  return {
    ...source,
    KDNA_ASSETS_METADATA_INDEX: source.KDNA_ASSETS_METADATA_INDEX ?? 'index/current.json',
    KDNA_ASSETS_METADATA_PACKAGE: source.KDNA_ASSETS_METADATA_PACKAGE ?? 'package.json',
  };
}
