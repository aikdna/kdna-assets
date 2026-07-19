'use strict';

const { appendFileSync } = require('node:fs');

const logPath = process.env.KDNA_TEST_FETCH_LOG;
const digest = process.env.KDNA_TEST_FETCH_DIGEST || 'a'.repeat(64);
const artifactBody = process.env.KDNA_TEST_FETCH_ARTIFACT || 'digest-mismatch';

if (!logPath) throw new Error('KDNA_TEST_FETCH_LOG is required');

globalThis.fetch = async (url, options = {}) => {
  const headers = new Headers(options.headers || {});
  appendFileSync(logPath, `${JSON.stringify({
    url: String(url),
    authorization: headers.has('authorization'),
  })}\n`);

  return {
    ok: true,
    status: 200,
    body: { cancel: async () => {} },
    text: async () => `${digest}  fixture.kdna\n`,
    arrayBuffer: async () => Buffer.from(artifactBody),
  };
};
