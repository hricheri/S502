import { useEffect, useState } from 'react'
import { apiGet, apiPost } from '../api'

const STORAGE_URL = 'http://127.0.0.1:8000/storage'

function Explore() {
  const [artists, setArtists] = useState([])
  const [dismissed, setDismissed] = useState([])
  const [filter, setFilter] = useState('all')
  const [cityInput, setCityInput] = useState('')
  const [city, setCity] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [liking, setLiking] = useState(false)

  useEffect(() => {
    async function loadArtists() {
      setLoading(true)
      setError('')

      const endpoint =
        filter === 'city' && city
          ? `/artists?filter=city&city=${encodeURIComponent(city)}`
          : '/artists'

      try {
        const data = await apiGet(endpoint)
        setArtists(data.artists)
        setDismissed([])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadArtists()
  }, [filter, city])

  const visibleArtists = artists.filter((artist) => !dismissed.includes(artist.id))
  const current = visibleArtists[0]

  function showEveryone() {
    setFilter('all')
    setCity('')
    setCityInput('')
  }

  function searchByCity(event) {
    event.preventDefault()
    setFilter('city')
    setCity(cityInput.trim())
  }

  function handleDiscard() {
    setDismissed([...dismissed, current.id])
  }

  async function handleLike() {
    setError('')
    setLiking(true)

    try {
      await apiPost('/likes', { liked_artist_id: current.id })
      setArtists(artists.filter((artist) => artist.id !== current.id))
    } catch (err) {
      setError(err.message)
    } finally {
      setLiking(false)
    }
  }

  return (
    <>
      <header className="page-header">
        <h1>Explore</h1>
        <p>Discover artists to swap with.</p>
      </header>

      <main className="page-content" style={{ maxWidth: '460px' }}>
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-body">
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <button
                className={`btn btn-block ${filter === 'all' ? 'btn-lime' : 'btn-ghost'}`}
                onClick={showEveryone}
              >
                See everyone
              </button>
              <button
                className={`btn btn-block ${filter === 'city' ? 'btn-lime' : 'btn-ghost'}`}
                onClick={() => setFilter('city')}
              >
                By city
              </button>
            </div>

            {filter === 'city' && (
              <form onSubmit={searchByCity} style={{ display: 'flex', gap: '0.5rem' }}>
                <div className="field" style={{ flex: 1, marginBottom: 0 }}>
                  <input
                    type="text"
                    placeholder="Enter a city..."
                    value={cityInput}
                    onChange={(e) => setCityInput(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-lavender">
                  Search
                </button>
              </form>
            )}
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading && <div className="empty-state">Loading...</div>}

        {!loading && !current && (
          <div className="card">
            <div className="empty-state">
              <p style={{ fontWeight: 700 }}>No more artists to explore right now.</p>
              <p>Check back later, or take a look at your favorites.</p>
            </div>
          </div>
        )}

        {!loading && current && (
          <>
            <div className="card">
              {current.profile_photo ? (
                <img
                  src={`${STORAGE_URL}/${current.profile_photo}`}
                  alt={current.user?.name}
                  style={{ width: '100%', height: '280px', objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <div
                  style={{
                    height: '280px',
                    background: 'linear-gradient(160deg, var(--lavender-300), var(--lavender-500))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '5rem',
                    fontWeight: 900,
                    color: 'white',
                  }}
                >
                  {current.user?.name?.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="card-body">
                <h2 style={{ fontSize: '1.4rem' }}>{current.user?.name}</h2>
                <p style={{ color: 'var(--lavender-700)', fontWeight: 700, margin: '0.25rem 0 0.75rem' }}>
                  {current.city || 'No city set'}
                </p>
                <p style={{ color: 'var(--gray-700)', margin: 0 }}>{current.bio || 'No bio yet.'}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button className="btn btn-ghost" onClick={handleDiscard}>
                ✕ Discard
              </button>
              <button className="btn btn-lime btn-block" onClick={handleLike} disabled={liking}>
                {liking ? 'Liking...' : '💖 Like'}
              </button>
            </div>
          </>
        )}
      </main>
    </>
  )
}

export default Explore