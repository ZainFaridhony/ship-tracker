import { PaginatedResponse, Ship, ShipActivity } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';

const jsonHeaders = (token?: string) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || response.statusText);
  }
  return response.json() as Promise<T>;
}

export async function loginRequest(username: string, password: string) {
  console.info('POST /login - authenticate user with username and password');
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({ username, password })
  });
  return handleResponse<{ token: string; expires_in: number }>(response);
}

export async function fetchShips(token: string, page: number, pageSize: number) {
  console.info('GET /ships - fetch paginated ship positions', { page, pageSize });
  const response = await fetch(
    `${API_BASE_URL}/ships?page=${page}&page_size=${pageSize}`,
    {
      method: 'GET',
      headers: jsonHeaders(token)
    }
  );
  return handleResponse<PaginatedResponse<Ship>>(response);
}

export async function fetchShipActivities(token: string, shipId: string, page: number, pageSize: number) {
  console.info(`GET /ships/${shipId}/activities - fetch paginated activity log`, {
    shipId,
    page,
    pageSize
  });
  const response = await fetch(
    `${API_BASE_URL}/ships/${shipId}/activities?page=${page}&page_size=${pageSize}`,
    {
      method: 'GET',
      headers: jsonHeaders(token)
    }
  );
  return handleResponse<PaginatedResponse<ShipActivity>>(response);
}
