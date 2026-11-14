const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export function getAccessToken() {
  return localStorage.getItem("access_token");
}

function getRefreshToken() {
  return localStorage.getItem("refresh_token");
}

export function setTokens(access, refresh) {
  if (access) localStorage.setItem("access_token", access);
  if (refresh) localStorage.setItem("refresh_token", refresh);
}

export function clearTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
}

export function setStoredUser(user) {
  if (user) localStorage.setItem("user", JSON.stringify(user));
  else localStorage.removeItem("user");
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function formatError(err, fallback) {
  if (!err) return fallback;
  if (typeof err === "string") return err;
  if (err.detail) return String(err.detail);
  const parts = [];
  for (const [field, value] of Object.entries(err)) {
    const msg = Array.isArray(value) ? value.join(" ") : String(value);
    parts.push(field === "non_field_errors" ? msg : `${field}: ${msg}`);
  }
  return parts.length ? parts.join(" | ") : fallback;
}

// Login / register must never carry a (possibly expired) token,
// otherwise DRF answers 401 even though those endpoints are public.
function isPublicAuthEndpoint(endpoint) {
  return (
    endpoint.startsWith("/api/auth/login/") ||
    endpoint.startsWith("/api/auth/register/")
  );
}

async function refreshAccessToken() {
  const refresh = getRefreshToken();
  if (!refresh) throw new Error("No refresh token");

  const res = await fetch(`${API_BASE_URL.replace(/\/+$/, "")}/api/auth/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) {
    clearTokens();
    throw new Error("Session expired. Please login again.");
  }

  const data = await res.json();
  setTokens(data.access, data.refresh || refresh);
  return data.access;
}

async function request(endpoint, options = {}, retry = true) {
  const baseUrl = API_BASE_URL.replace(/\/+$/, "");
  const headers = { ...options.headers };

  const publicAuth = isPublicAuthEndpoint(endpoint);
  const token = publicAuth ? null : getAccessToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error("تعذر الاتصال بالسيرفر. تأكد من تشغيل الـ Backend.");
  }

  // Try refresh once on 401
  if (response.status === 401 && retry && !publicAuth && getRefreshToken()) {
    try {
      await refreshAccessToken();
      return request(endpoint, options, false);
    } catch {
      clearTokens();
      throw new Error("انتهت الجلسة. سجّل الدخول مرة أخرى.");
    }
  }

  if (!response.ok) {
    let detail = `${response.status} ${response.statusText}`;
    try {
      const err = await response.json();
      detail = formatError(err, detail);
    } catch {
      // ignore
    }
    const error = new Error(detail);
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) return null;

  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return response.json();
  }
  return null;
}

export function apiGet(endpoint) {
  return request(endpoint);
}

export function apiPost(endpoint, body) {
  return request(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function apiPut(endpoint, body) {
  return request(endpoint, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function apiPatch(endpoint, body) {
  return request(endpoint, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function apiDelete(endpoint) {
  return request(endpoint, { method: "DELETE" });
}
