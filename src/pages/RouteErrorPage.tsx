import { Link } from 'react-router'

/** Rendered outside Layout when something throws during render, so it must stand on its own. */
export function RouteErrorPage() {
  return (
    <main className="container page">
      <div className="status-message" role="alert">
        <h1 className="status-message__title">¡Uy! Algo se rompió</h1>
        <p className="status-message__text">Recargá la página o volvé al inicio.</p>
        <div className="status-message__actions">
          <button type="button" className="btn btn--primary" onClick={() => window.location.reload()}>
            Recargar
          </button>
          <Link to="/" className="btn btn--secondary">
            Ir al inicio
          </Link>
        </div>
      </div>
    </main>
  )
}
