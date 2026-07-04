/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const BASE_URL =
  (import.meta as any).env?.VITE_API_URL || "http://localhost:4000/api/v1";

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem("ss_token");

  const headers: Record<string, string> = {};

  // Do not set Content-Type header if body is FormData (browser will set it with correct boundary)
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  // Prevent browser caching for GET requests by default
  if (!options.method || options.method.toUpperCase() === "GET") {
    headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
    headers["Pragma"] = "no-cache";
    headers["Expires"] = "0";
  }

  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = "An error occurred";
    try {
      const errBody = await response.json();
      errorMsg = Array.isArray(errBody.message)
        ? errBody.message.join(", ")
        : errBody.message || errBody.error || errorMsg;
    } catch (_) {}
    throw new Error(errorMsg);
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json() as Promise<T>;
  }

  return response.text() as unknown as T;
}
