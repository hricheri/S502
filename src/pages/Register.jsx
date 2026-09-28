import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiPost } from '../api'
import { useAuth } from '../useAuth'

function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    city: '',
    bio: '',
  })
  const [photo, setPhoto] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { saveSession } = useAuth()
  const navigate = useNavigate()

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData()
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value)
    })
    if (photo) formData.append('profile_photo', photo)

    try {
      const data = await apiPost('/register', formData)
      saveSession(data.token)
      navigate('/profile')
    } catch (err) {
      const messages = err.data?.errors
        ? Object.values(err.data.errors).flat().join(' ')
        : err.message
      setError(messages)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-content" style={{ maxWidth: '460px' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--lavender-700)' }}>🎨 Tattoo Swap</h1>
        <p style={{ color: 'var(--gray-500)' }}>Create your artist account</p>
      </div>

      <div className="card">
        <div className="card-body">
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" type="text" value={form.name} onChange={handleChange} required />
            </div>

            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                minLength={8}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="password_confirmation">Confirm password</label>
              <input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                value={form.password_confirmation}
                onChange={handleChange}
                minLength={8}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="city">City (optional)</label>
              <input id="city" name="city" type="text" value={form.city} onChange={handleChange} />
            </div>

            <div className="field">
              <label htmlFor="bio">Bio (optional)</label>
              <textarea id="bio" name="bio" rows={3} value={form.bio} onChange={handleChange} />
            </div>

            <div className="field">
              <label htmlFor="profile_photo">Profile photo (optional)</label>
              <input
                id="profile_photo"
                type="file"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files[0])}
              />
            </div>

            <button type="submit" className="btn btn-lime btn-block" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>

      <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: 'var(--lavender-700)', fontWeight: 700 }}>
          Log in
        </Link>
      </p>
    </div>
  )
}

export default Register