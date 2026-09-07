export const API_URL = import.meta.env.VITE_API_URL;

// On 400/401/404/409 the API returns {"detail": "message"}, but on 422
// detail is a list of objects, so we cannot show it directly.
function errorMessage(body) {
  if (typeof body.detail === "string") {
    return body.detail;
  }
  return "Solicitud inválida";
}

export async function apiFetch(path, token) {
  const res = await fetch(API_URL + path, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const body = await res.json();
    throw new Error(errorMessage(body));
  }
  return res.json();
}

export async function apiPost(path, body, token) {
  const res = await fetch(API_URL + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errorBody = await res.json();
    throw new Error(errorMessage(errorBody));
  }
  return res.json();
}

export async function login(username, password) {
  // /token takes an OAuth2 form, not JSON.
  const res = await fetch(`${API_URL}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ username, password }),
  });
  if (!res.ok) {
    const body = await res.json();
    throw new Error(errorMessage(body));
  }
  return res.json();
}
