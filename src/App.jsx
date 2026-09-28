function App() {
  return (
    <>
      <header className="page-header">
        <h1>Design system</h1>
        <p>Temporary style guide</p>
      </header>

      <main className="page-content">
        <div className="card">
          <div className="card-body">
            <h2>Artista Demo</h2>
            <p style={{ color: 'var(--lavender-700)', fontWeight: 700 }}>Barcelona</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', margin: '0.75rem 0' }}>
              <span className="badge badge-lima">Match</span>
              <span className="badge badge-lavender">Swap in progress</span>
              <span className="badge badge-gray">Liked</span>
              <span className="pill">Verified</span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-ghost">✕ Discard</button>
              <button className="btn btn-lime btn-block">💖 Like</button>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default App