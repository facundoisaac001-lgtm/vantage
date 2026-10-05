import { Link } from 'react-router'
import { StatusMessage } from '../components/ui/StatusMessage'

export function NotFoundPage() {
  return (
    <div className="container page">
      <title>Página no encontrada | Pamilu</title>
      <StatusMessage title="Esta página no existe" message="Puede que el link esté mal o que la hayamos movido.">
        <Link to="/" className="btn btn--primary">
          Volver al inicio
        </Link>
        <Link to="/catalogo" className="btn btn--secondary">
          Ver catálogo
        </Link>
      </StatusMessage>
    </div>
  )
}
