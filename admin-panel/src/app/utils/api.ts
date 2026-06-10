export async function authFetch(url: string, options: RequestInit = {}) {
  const raw = localStorage.getItem("admin_panel_auth");
  let token = "";
  if (raw) {
    try {
      const data = JSON.parse(raw);
      if (data.token) token = data.token;
    } catch (e) {}
  }

  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401 && window.location.pathname !== "/login") {
    localStorage.removeItem("admin_panel_auth");
    window.location.href = "/login";
  }

  return response;
}
