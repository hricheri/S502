import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'

function ProfilePlaceholder() {
  const { logout } = useAuth()

  return (
    <div className="page-content">
      <h1>Sesión iniciada ✅</h1>
      <p>Pantalla temporal: el perfil real viene después.</p>
      <button className="btn btn-lime" onClick={logout}>
        Log out
      </button>
    </div>
  )
}

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth()
  return isLoggedIn ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePlaceholder />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App