const API_BASE_URL = 'http://127.0.0.1:8000/api'

export function getToken() {
  return localStorage.getItem('auth_token')
}

export function setToken(token) {
  localStorage.setItem('auth_token', token)
}

export function clearToken() {
  localStorage.removeItem('auth_token')
}

export async function apiRequest(endpoint, options = {}) {
  const token = getToken()

  const headers = {
    Accept: 'application/json',
    ...(options.headers || {}),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const isFormData = options.body instanceof FormData

  if (options.body && !isFormData) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const error = new Error(data.message || 'Something went wrong.')
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}

export const apiGet = (endpoint) => apiRequest(endpoint, { method: 'GET' })

export const apiPost = (endpoint, body) =>
  apiRequest(endpoint, {
    method: 'POST',
    body: body instanceof FormData ? body : JSON.stringify(body),
  })

export const apiPut = (endpoint, body) =>
  apiRequest(endpoint, {
    method: 'PUT',
    body: body instanceof FormData ? body : JSON.stringify(body),
  })

export const apiDelete = (endpoint, body) =>
  apiRequest(endpoint, {
    method: 'DELETE',
    body: body ? JSON.stringify(body) : undefined,
  })