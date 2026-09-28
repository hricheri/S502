import { useState } from 'react'
import { getToken, setToken, clearToken, apiPost } from './api'
import { AuthContext } from './authState'

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(getToken())

  function saveSession(newToken) {
    setToken(newToken)
    setTokenState(newToken)
  }

  async function logout() {
    try {
      await apiPost('/logout')
    } catch {
      // Even if the request fails, we still clear the local session.
    }
    clearToken()
    setTokenState(null)
  }

  return (
    <AuthContext.Provider value={{ token, isLoggedIn: !!token, saveSession, logout }}>
      {children}
    </AuthContext.Provider>
  )
}