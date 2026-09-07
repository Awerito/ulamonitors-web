// API timestamps are Chile local time without timezone suffix,
// e.g. "2026-08-26T17:50:00.005000". Slicing the string avoids
// re-interpreting them in the browser's timezone.
export function formatDateTime(iso) {
  return iso.slice(0, 16).replace("T", " ");
}

export function formatTime(iso) {
  return iso.slice(11, 16);
}
