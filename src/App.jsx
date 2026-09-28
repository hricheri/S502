import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider, useAuth } from './AuthContext'
import Dock from './components/Dock'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Explore from './pages/Explore'
import Favorites from './pages/Favorites'
import Swaps from './pages/Swaps'

function ProtectedLayout() {
  const { isLoggedIn } = useAuth()

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  return (
    <>
      <Dock />
      <Outlet />
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedLayout />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/swaps" element={<Swaps />} />
        </Route>

        <Route path="*" element={<Navigate to="/explore" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App