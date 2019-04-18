export function jsonWithStatus(response) {
  return response.json().then(j => {
    return Promise.resolve({ ok: response.ok, json: j });
  });
}
