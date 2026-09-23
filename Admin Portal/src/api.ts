const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
export const apiUrl = (path: string) => `${API_URL}/api${path}`;

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) { super(message); this.status = status; }
}

export async function api<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const headers = new Headers(options.headers);
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (options.body && !(options.body instanceof FormData)) headers.set('Content-Type', 'application/json');
  const response = await fetch(apiUrl(path), { ...options, headers });
  if (response.status === 401) window.dispatchEvent(new Event('admin-auth-expired'));
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(response.status, body.error || body.message || `Request failed (${response.status})`);
  }
  return response.status === 204 ? (undefined as T) : response.json();
}
