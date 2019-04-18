/**
 * Unpacks the JSON from a response object and provides the ok status alongside it.
 * @param {Response} response
 * @returns {Promise<{json: T, ok: boolean} | never>}
 */
export function jsonWithStatus(response) {
  return response.json().then(j => {
    return Promise.resolve({ ok: response.ok, json: j });
  });
}

/**
 * Unpacks the JSON from a response object if response.ok is true. If not, an
 * error is thrown.
 * @param {Response} response
 * @returns {*|Promise<any>}
 */
export function jsonOkRequired(response) {
  if (!response.ok) throw new Error(`Failed to fetch ${response.url}!`);
  return response.json();
}
