export class ApiClient {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = { 'Content-Type': 'application/json' };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...(options.headers || {}),
      },
      credentials: 'include', // for cookies if using auth
    });

    if (!res.ok) {
      let errorMsg = `API error: ${res.status}`;
      try {
        const errData = await res.json();
        errorMsg = errData.message || errorMsg;
      } catch {
        // ignore if response is not JSON
      }
      throw new Error(errorMsg);
    }

    return res.json();
  }

  get<T>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T, B = unknown>(endpoint: string, body: B, options?: RequestInit) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put<T, B = unknown>(endpoint: string, body: B, options?: RequestInit) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  delete<T>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000');
