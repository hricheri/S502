import { useEffect, useState } from 'react'
import { apiGet, apiPost } from '../api'

const STORAGE_URL = 'http://127.0.0.1:8000/storage'

function Profile() {
  const [user, setUser] = useState(null)
  const [artist, setArtist] = useState(null)
  const [form, setForm] = useState({ name: '', city: '', bio: '' })
  const [photo, setPhoto] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await apiGet('/me')
        setUser(data.user)
        setArtist(data.artist)
        setForm({
          name: data.user.name || '',
          city: data.artist.city || '',
          bio: data.artist.bio || '',
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSuccess('')
    setSaving(true)

    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('city', form.city)
    formData.append('bio', form.bio)
    if (photo) formData.append('profile_photo', photo)

    // Laravel can't parse multipart bodies sent with a real PUT,
    // so we send a POST and spoof the method.
    formData.append('_method', 'PUT')

    try {
      const data = await apiPost('/me', formData)
      setUser(data.user)
      setArtist(data.artist)
      setPhoto(null)
      setSuccess('Profile updated successfully!')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="empty-state">Loading...</div>
  }

  return (
    <>
      <header className="page-header">
        <h1>My Profile</h1>
        <p>This is how other artists see you.</p>
      </header>

      <main className="page-content">
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {artist && (
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div className="card-body" style={{ textAlign: 'center' }}>
              {artist.profile_photo ? (
                <img
                  src={`${STORAGE_URL}/${artist.profile_photo}`}
                  alt={user.name}
                  style={{
                    width: '88px',
                    height: '88px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginBottom: '0.75rem',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '88px',
                    height: '88px',
                    borderRadius: '50%',
                    background: 'var(--lavender-300)',
                    margin: '0 auto 0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    fontWeight: 900,
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}

              <h2>{user.name}</h2>
              <p style={{ color: 'var(--lavender-700)', fontWeight: 700, margin: '0.25rem 0 0.75rem' }}>
                {artist.city || 'No city set'}
              </p>

              <span className={`badge ${artist.is_verified ? 'badge-lima' : 'badge-gray'}`}>
                {artist.is_verified ? '✓ Verified' : 'Not verified'}
              </span>

              <p style={{ color: 'var(--gray-700)', marginTop: '1rem' }}>
                {artist.bio || 'No bio yet.'}
              </p>
            </div>
          </div>
        )}

        <div className="card">
          <div className="card-body">
            <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Edit profile</h2>

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="name">Name</label>
                <input id="name" name="name" type="text" value={form.name} onChange={handleChange} required />
              </div>

              <div className="field">
                <label htmlFor="city">City</label>
                <input id="city" name="city" type="text" value={form.city} onChange={handleChange} />
              </div>

              <div className="field">
                <label htmlFor="bio">Bio</label>
                <textarea id="bio" name="bio" rows={3} value={form.bio} onChange={handleChange} />
              </div>

              <div className="field">
                <label htmlFor="profile_photo">Profile photo</label>
                <input
                  id="profile_photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files[0])}
                />
              </div>

              <button type="submit" className="btn btn-lime btn-block" disabled={saving}>
                {saving ? 'Saving...' : 'Save changes'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  )
}

export default Profile