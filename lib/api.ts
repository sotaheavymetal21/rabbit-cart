export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

type FetchOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
};

export async function apiRequest<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { method = 'GET', headers = {}, body } = options;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials: 'include', // Cookie (JWT) を送受信するために必須
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API request failed: ${response.statusText}`);
  }

  // 204 No Content の場合はnullを返す
  if (response.status === 204) {
    return null as T;
  }

  return response.json();
}
