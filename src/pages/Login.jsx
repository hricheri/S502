import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiPost } from '../api'
import { useAuth } from '../useAuth'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { saveSession } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await apiPost('/login', { email, password })
      saveSession(data.token)
      navigate('/profile')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-content" style={{ maxWidth: '460px' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--lavender-700)' }}>🎨 Tattoo Swap</h1>
        <p style={{ color: 'var(--gray-500)' }}>Log in to your account</p>
      </div>

      <div className="card">
        <div className="card-body">
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-lime btn-block" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
        </div>
      </div>

      <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        Don't have an account?{' '}
        <Link to="/register" style={{ color: 'var(--lavender-700)', fontWeight: 700 }}>
          Sign up
        </Link>
      </p>
    </div>
  )
}

export default Login