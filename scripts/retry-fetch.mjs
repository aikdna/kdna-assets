const DEFAULT_ATTEMPTS = 3;
const DEFAULT_BASE_DELAY_MS = 250;
const DEFAULT_TIMEOUT_MS = 15_000;
const MAX_DELAY_MS = 2_000;
const MAX_TIMEOUT_MS = 60_000;

export async function fetchWithRetry(url, options = {}, controls = {}) {
  const result = await fetchPayloadWithRetry(url, options, controls);
  return result.response;
}

export async function fetchPayloadWithRetry(url, options = {}, controls = {}) {
  const fetcher = controls.fetcher || globalThis.fetch;
  const sleep = controls.sleep || delay;
  const read = controls.read;
  const attempts = controls.attempts ?? DEFAULT_ATTEMPTS;
  const baseDelayMs = controls.baseDelayMs ?? DEFAULT_BASE_DELAY_MS;
  const timeoutMs = controls.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  if (typeof fetcher !== 'function') throw new TypeError('fetch implementation is required');
  if (!Number.isInteger(attempts) || attempts < 1 || attempts > DEFAULT_ATTEMPTS) {
    throw new TypeError(`retry attempts must be an integer between 1 and ${DEFAULT_ATTEMPTS}`);
  }
  if (!Number.isInteger(baseDelayMs) || baseDelayMs < 0 || baseDelayMs > MAX_DELAY_MS) {
    throw new TypeError(`retry base delay must be an integer between 0 and ${MAX_DELAY_MS}`);
  }
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > MAX_TIMEOUT_MS) {
    throw new TypeError(`request timeout must be an integer between 1 and ${MAX_TIMEOUT_MS}`);
  }

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    let response;
    const controller = options.signal ? null : new AbortController();
    const timeout = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
    try {
      response = await fetcher(url, controller ? { ...options, signal: controller.signal } : options);
      if (isTransientStatus(response.status)) {
        await cancelResponseBody(response);
        if (attempt === attempts) return { response, payload: undefined };
      } else {
        const payload = response.ok && typeof read === 'function' ? await read(response) : undefined;
        if (!response.ok) await cancelResponseBody(response);
        return { response, payload };
      }
    } catch (error) {
      await cancelResponseBody(response);
      if (attempt === attempts) throw error;
    } finally {
      if (timeout !== null) clearTimeout(timeout);
    }

    await sleep(Math.min(baseDelayMs * (2 ** (attempt - 1)), MAX_DELAY_MS));
  }

  throw new Error('release download retry loop ended unexpectedly');
}

export function isTransientStatus(status) {
  return status === 408 || status === 425 || status === 429 || (status >= 500 && status <= 599);
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function cancelResponseBody(response) {
  try {
    await response?.body?.cancel?.();
  } catch {
    // The response is already unusable; cancellation is best-effort cleanup.
  }
}
