import { useEffect, useState } from 'react'
import { apiGet, apiPost, apiDelete } from '../api'

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

function toDateString(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function Availability() {
  const [artistId, setArtistId] = useState(null)
  const [markedDates, setMarkedDates] = useState(new Set())
  const [selectedDates, setSelectedDates] = useState(new Set())
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const today = new Date()
    return new Date(today.getFullYear(), today.getMonth(), 1)
  })
  const [rangeFrom, setRangeFrom] = useState('')
  const [rangeTo, setRangeTo] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function loadAvailability() {
      try {
        const me = await apiGet('/me')
        setArtistId(me.artist.id)

        const data = await apiGet(`/artists/${me.artist.id}/availabilities`)
        setMarkedDates(new Set(data.availabilities.map((item) => item.date)))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadAvailability()
  }, [])

  function changeMonth(delta) {
    setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + delta, 1))
  }

  function toggleDate(dateString) {
    const next = new Set(selectedDates)
    if (next.has(dateString)) {
      next.delete(dateString)
    } else {
      next.add(dateString)
    }
    setSelectedDates(next)
  }

  function applyRange(from, to) {
    if (!from || !to) return

    const start = new Date(`${from}T00:00:00`)
    const end = new Date(`${to}T00:00:00`)
    if (start > end) return

    const next = new Set(selectedDates)
    const cursor = new Date(start)
    while (cursor <= end) {
      next.add(toDateString(cursor))
      cursor.setDate(cursor.getDate() + 1)
    }
    setSelectedDates(next)

    // Jump the calendar to the month where the range starts.
    setVisibleMonth(new Date(start.getFullYear(), start.getMonth(), 1))
  }

  function handleFromChange(event) {
    setRangeFrom(event.target.value)
    applyRange(event.target.value, rangeTo)
  }

  function handleToChange(event) {
    setRangeTo(event.target.value)
    applyRange(rangeFrom, event.target.value)
  }

  function clearSelection() {
    setSelectedDates(new Set())
    setRangeFrom('')
    setRangeTo('')
  }

  async function markSelected() {
    setError('')
    setSaving(true)

    try {
      await apiPost(`/artists/${artistId}/availabilities`, { dates: Array.from(selectedDates) })
      setMarkedDates(new Set([...markedDates, ...selectedDates]))
      clearSelection()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function removeSelected() {
    setError('')
    setSaving(true)

    try {
      await apiDelete(`/artists/${artistId}/availabilities`, { dates: Array.from(selectedDates) })
      const next = new Set(markedDates)
      selectedDates.forEach((date) => next.delete(date))
      setMarkedDates(next)
      clearSelection()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const year = visibleMonth.getFullYear()
  const month = visibleMonth.getMonth()
  const monthName = visibleMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7

  const cells = []
  for (let i = 0; i < firstWeekday; i++) {
    cells.push(<div key={`empty-${i}`} />)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dateString = toDateString(new Date(year, month, day))
    const isMarked = markedDates.has(dateString)
    const isSelected = selectedDates.has(dateString)

    cells.push(
      <button
        key={dateString}
        type="button"
        onClick={() => toggleDate(dateString)}
        style={{
          aspectRatio: '1',
          border: isSelected ? '2px solid var(--lavender-500)' : '2px solid transparent',
          borderRadius: '0.75rem',
          background: isMarked ? 'var(--lima-100)' : 'var(--gray-100)',
          color: isMarked ? 'var(--gray-900)' : 'var(--gray-500)',
          fontFamily: 'inherit',
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        {day}
      </button>,
    )
  }

  return (
    <>
      <header className="page-header">
        <h1>My Availability</h1>
        <p>Select a date range, or tap individual days.</p>
      </header>

      <main className="page-content" style={{ maxWidth: '480px' }}>
        {error && <div className="alert alert-error">{error}</div>}

        {loading && <div className="empty-state">Loading...</div>}

        {!loading && (
          <div className="card">
            <div className="card-body">
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <div className="field" style={{ flex: 1, marginBottom: 0 }}>
                  <label htmlFor="range-from">From</label>
                  <input id="range-from" type="date" value={rangeFrom} onChange={handleFromChange} />
                </div>
                <div className="field" style={{ flex: 1, marginBottom: 0 }}>
                  <label htmlFor="range-to">To</label>
                  <input id="range-to" type="date" value={rangeTo} onChange={handleToChange} />
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1rem',
                }}
              >
                <button className="btn btn-ghost" onClick={() => changeMonth(-1)}>
                  ←
                </button>
                <strong>{monthName}</strong>
                <button className="btn btn-ghost" onClick={() => changeMonth(1)}>
                  →
                </button>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  gap: '0.35rem',
                  marginBottom: '0.5rem',
                }}
              >
                {WEEKDAYS.map((weekday) => (
                  <div
                    key={weekday}
                    style={{
                      textAlign: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--gray-400)',
                    }}
                  >
                    {weekday}
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.35rem' }}>
                {cells}
              </div>

              <div
                style={{
                  marginTop: '1.25rem',
                  paddingTop: '1.25rem',
                  borderTop: '1px solid var(--gray-100)',
                }}
              >
                {selectedDates.size === 0 ? (
                  <p style={{ margin: 0, color: 'var(--gray-400)', fontSize: '0.85rem' }}>
                    Pick a range above or tap days to select them.
                  </p>
                ) : (
                  <>
                    <p style={{ fontWeight: 700, margin: '0 0 0.75rem' }}>
                      {selectedDates.size} day{selectedDates.size > 1 ? 's' : ''} selected
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button className="btn btn-lime" onClick={markSelected} disabled={saving}>
                        Mark as available
                      </button>
                      <button className="btn btn-danger" onClick={removeSelected} disabled={saving}>
                        Remove availability
                      </button>
                      <button className="btn btn-ghost" onClick={clearSelection} disabled={saving}>
                        Clear
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  )
}

export default Availability