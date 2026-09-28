import { useEffect, useState } from 'react'
import { apiGet, apiPut, apiDelete } from '../api'

const STATUS_BADGES = {
  pending: { className: 'badge-gray', label: 'Pending' },
  confirmed: { className: 'badge-lima', label: '✓ Confirmed' },
  rejected: { className: 'badge-gray', label: 'Rejected' },
  cancelled: { className: 'badge-gray', label: 'Cancelled' },
}

function Swaps() {
  const [swaps, setSwaps] = useState([])
  const [myArtistId, setMyArtistId] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    async function loadSwaps() {
      try {
        const me = await apiGet('/me')
        setMyArtistId(me.artist.id)

        const data = await apiGet('/swaps')
        setSwaps(data.swaps)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadSwaps()
  }, [refreshKey])

  async function handleConfirm(swapId) {
    setError('')
    setBusyId(swapId)

    try {
      await apiPut(`/swaps/${swapId}`)
      setRefreshKey((key) => key + 1)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  async function handleReject(swapId) {
    setError('')
    setBusyId(swapId)

    try {
      await apiDelete(`/swaps/${swapId}/reject`)
      setRefreshKey((key) => key + 1)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <>
      <header className="page-header">
        <h1>My Swaps</h1>
        <p>Track your studio and home swaps.</p>
      </header>

      <main className="page-content">
        {error && <div className="alert alert-error">{error}</div>}

        {loading && <div className="empty-state">Loading...</div>}

        {!loading && swaps.length === 0 && (
          <div className="card">
            <div className="empty-state">
              <p style={{ fontWeight: 700 }}>You don't have any swaps yet.</p>
              <p>Go to your favorites and start a swap with someone who matched you back.</p>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gap: '1.25rem' }}>
          {swaps.map((swap) => {
            const iAmA = swap.artist_a_id === myArtistId
            const other = iAmA ? swap.artist_b : swap.artist_a
            const myConfirmed = iAmA ? swap.confirmed_by_a : swap.confirmed_by_b
            const otherName = other?.user?.name || 'Unknown artist'
            const badge = STATUS_BADGES[swap.status]
            const busy = busyId === swap.id

            return (
              <div className="card" key={swap.id}>
                <div className="card-body">
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.5rem',
                    }}
                  >
                    <h2 style={{ fontSize: '1.1rem' }}>{otherName}</h2>
                    <span className={`badge ${badge.className}`}>{badge.label}</span>
                  </div>

                  <p style={{ margin: '0 0 0.25rem', color: 'var(--gray-700)' }}>
                    📅{' '}
                    {swap.start_date && swap.end_date
                      ? `${swap.start_date} → ${swap.end_date}`
                      : 'No overlapping dates found'}
                  </p>

                  {swap.status === 'pending' && (
                    <p style={{ margin: 0, color: 'var(--gray-400)', fontSize: '0.85rem' }}>
                      {myConfirmed
                        ? 'You confirmed. Waiting for the other artist.'
                        : 'Waiting for your confirmation.'}
                    </p>
                  )}

                  {swap.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                      {!myConfirmed && (
                        <button className="btn btn-lime" onClick={() => handleConfirm(swap.id)} disabled={busy}>
                          Confirm dates
                        </button>
                      )}
                      <button className="btn btn-danger" onClick={() => handleReject(swap.id)} disabled={busy}>
                        Reject
                      </button>
                    </div>
                  )}

                  {swap.status === 'confirmed' && (
                    <div style={{ marginTop: '1rem' }}>
                      <button className="btn btn-danger" onClick={() => handleReject(swap.id)} disabled={busy}>
                        Cancel swap
                      </button>
                    </div>
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

export default Swaps