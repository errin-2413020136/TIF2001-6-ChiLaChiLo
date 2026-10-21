const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api').replace(/\/$/, '')

async function sendRequest(path, data) {
  let response

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  } catch {
    throw new Error('Tidak dapat terhubung ke server. Periksa apakah backend sudah berjalan.')
  }

  const result = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(result.message || result.error || 'Permintaan gagal. Silakan coba lagi.')
  }

  return result
}

export function loginUser(email, password) {
  return sendRequest('/auth/login', { email, password })
}

export function registerUser(name, email, password) {
  return sendRequest('/auth/register', { name, email, password })
}
