import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiGet, apiPost } from '../api'

const STORAGE_URL = 'http://127.0.0.1:8000/storage'

function Favorites() {
  const [favorites, setFavorites] = useState([])
  const [activeSwaps, setActiveSwaps] = useState({})
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)
  const [startingId, setStartingId] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    async function loadData() {
      try {
        const me = await apiGet('/me')
        const myArtistId = me.artist.id

        const favoritesData = await apiGet('/favorites')
        setFavorites(favoritesData.favorites)

        // Map of "other artist id" -> status, only for swaps still in play.
        const swapsData = await apiGet('/swaps')
        const active = {}
        swapsData.swaps.forEach((swap) => {
          if (swap.status === 'pending' || swap.status === 'confirmed') {
            const otherId = swap.artist_a_id === myArtistId ? swap.artist_b_id : swap.artist_a_id
            active[otherId] = swap.status
          }
        })
        setActiveSwaps(active)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [refreshKey])

  async function handleStartSwap(artistId) {
    setError('')
    setSuccess('')
    setStartingId(artistId)

    try {
      await apiPost('/swaps', { artist_id: artistId })
      setSuccess('Swap created! You can follow it in the Swaps section.')
      setRefreshKey((key) => key + 1)
    } catch (err) {
      setError(err.message)
    } finally {
      setStartingId(null)
    }
  }

  return (
    <>
      <header className="page-header">
        <h1>Favorites</h1>
        <p>Artists you're interested in swapping with.</p>
      </header>

      <main className="page-content">
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {loading && <div className="empty-state">Loading...</div>}

        {!loading && favorites.length === 0 && (
          <div className="card">
            <div className="empty-state">
              <p style={{ fontWeight: 700 }}>You haven't liked anyone yet.</p>
              <p>Head to Explore to find artists to swap with.</p>
            </div>
          </div>
        )}

        <div className="card-grid">
          {favorites.map((favorite) => {
            const artist = favorite.artist
            const name = artist.user?.name || 'Unknown'
            const swapStatus = activeSwaps[artist.id]

            return (
              <div className="card" key={favorite.id}>
                <div style={{ position: 'relative' }}>
                  {artist.profile_photo ? (
                    <img
                      src={`${STORAGE_URL}/${artist.profile_photo}`}
                      alt={name}
                      style={{ width: '100%', height: '150px', objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    <div
                      style={{
                        height: '150px',
                        background: 'linear-gradient(160deg, var(--lavender-300), var(--lavender-500))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '3rem',
                        fontWeight: 900,
                        color: 'white',
                      }}
                    >
                      {name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <span
                    className={`badge ${favorite.is_match ? 'badge-lavender' : 'badge-gray'}`}
                    style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}
                  >
                    {favorite.is_match ? '🎨 Match!' : '💖 Liked'}
                  </span>
                </div>

                <div className="card-body">
                  <h2 style={{ fontSize: '1.1rem' }}>{name}</h2>
                  <p style={{ color: 'var(--lavender-700)', fontWeight: 700, margin: '0.25rem 0 0.75rem' }}>
                    {artist.city || 'No city set'}
                  </p>

                  {!favorite.is_match && (
                    <p style={{ color: 'var(--gray-400)', fontSize: '0.85rem', margin: 0 }}>
                      Waiting for them to like you back.
                    </p>
                  )}

                  {favorite.is_match && !swapStatus && (
                    <button
                      className="btn btn-lime btn-block"
                      onClick={() => handleStartSwap(artist.id)}
                      disabled={startingId === artist.id}
                    >
                      {startingId === artist.id ? 'Starting...' : 'Start a swap'}
                    </button>
                  )}

                  {favorite.is_match && swapStatus === 'pending' && (
                    <Link
                      to="/swaps"
                      className="btn btn-lavender btn-block"
                      style={{ textAlign: 'center', textDecoration: 'none' }}
                    >
                      🤝 Swap in progress →
                    </Link>
                  )}

                  {favorite.is_match && swapStatus === 'confirmed' && (
                    <Link
                      to="/swaps"
                      className="btn btn-lavender btn-block"
                      style={{ textAlign: 'center', textDecoration: 'none' }}
                    >
                      ✓ Swap confirmed →
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </>
  )
}

export default Favorites