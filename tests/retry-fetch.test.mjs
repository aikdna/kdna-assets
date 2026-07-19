import assert from 'node:assert/strict';
import test from 'node:test';

import {
  fetchPayloadWithRetry,
  fetchWithRetry,
  isTransientStatus,
} from '../scripts/retry-fetch.mjs';

test('retries bounded transient HTTP responses with exponential delays', async () => {
  const responses = [{ status: 503 }, { status: 429 }, { status: 200 }];
  const delays = [];
  let calls = 0;

  const response = await fetchWithRetry('https://example.test/release', {}, {
    fetcher: async () => responses[calls++],
    sleep: async (milliseconds) => delays.push(milliseconds),
    attempts: 3,
    baseDelayMs: 10,
  });

  assert.equal(response.status, 200);
  assert.equal(calls, 3);
  assert.deepEqual(delays, [10, 20]);
});

test('retries a thrown network failure but returns the next response', async () => {
  let calls = 0;
  const response = await fetchWithRetry('https://example.test/release', {}, {
    fetcher: async () => {
      calls += 1;
      if (calls === 1) throw new TypeError('temporary network failure');
      return { status: 200 };
    },
    sleep: async () => {},
  });

  assert.equal(response.status, 200);
  assert.equal(calls, 2);
});

test('retries a response body network failure by fetching the payload again', async () => {
  let calls = 0;
  let cancellations = 0;
  const result = await fetchPayloadWithRetry('https://example.test/release', {}, {
    fetcher: async () => ({
      ok: true,
      status: 200,
      body: { cancel: async () => { cancellations += 1; } },
      text: async () => {
        calls += 1;
        if (calls === 1) throw new TypeError('body stream ended');
        return 'verified payload';
      },
    }),
    read: (response) => response.text(),
    sleep: async () => {},
  });

  assert.equal(result.response.status, 200);
  assert.equal(result.payload, 'verified payload');
  assert.equal(calls, 2);
  assert.equal(cancellations, 1);
});

test('does not retry permanent HTTP failures', async () => {
  for (const status of [401, 403, 404]) {
    let calls = 0;
    const response = await fetchWithRetry('https://example.test/release', {}, {
      fetcher: async () => {
        calls += 1;
        return { ok: false, status };
      },
      sleep: async () => assert.fail('permanent failures must not sleep'),
    });

    assert.equal(response.status, status);
    assert.equal(calls, 1);
  }
});

test('cancels a transient response body before retrying', async () => {
  let calls = 0;
  let cancellations = 0;
  const response = await fetchWithRetry('https://example.test/release', {}, {
    fetcher: async () => {
      calls += 1;
      if (calls === 1) {
        return {
          status: 503,
          body: { cancel: async () => { cancellations += 1; } },
        };
      }
      return { status: 200 };
    },
    sleep: async () => {},
  });

  assert.equal(response.status, 200);
  assert.equal(calls, 2);
  assert.equal(cancellations, 1);
});

test('retries a timed-out request within the same bounded budget', async () => {
  let calls = 0;
  const response = await fetchWithRetry('https://example.test/release', {}, {
    fetcher: async (_url, options) => {
      calls += 1;
      if (calls === 1) {
        return new Promise((_resolve, reject) => {
          options.signal.addEventListener('abort', () => reject(new Error('request timed out')));
        });
      }
      return { status: 200 };
    },
    sleep: async () => {},
    timeoutMs: 1,
  });

  assert.equal(response.status, 200);
  assert.equal(calls, 2);
});

test('returns the final transient response after the retry budget is exhausted', async () => {
  let calls = 0;
  const response = await fetchWithRetry('https://example.test/release', {}, {
    fetcher: async () => {
      calls += 1;
      return { status: 502 };
    },
    sleep: async () => {},
    attempts: 3,
  });

  assert.equal(response.status, 502);
  assert.equal(calls, 3);
});

test('classifies only bounded network-style HTTP failures as transient', () => {
  for (const status of [408, 425, 429, 500, 502, 503, 599]) {
    assert.equal(isTransientStatus(status), true, `${status} should be transient`);
  }
  for (const status of [200, 301, 400, 401, 403, 404, 409, 422, 600]) {
    assert.equal(isTransientStatus(status), false, `${status} should fail without retry`);
  }
});
