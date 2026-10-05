import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'
import { OrderForm } from '../components/order/OrderForm'
import { OrderSummary } from '../components/order/OrderSummary'
import { EmptyState, ErrorState } from '../components/ui/StatusMessage'
import { useProduct } from '../hooks/useProducts'
import { getOrderDraft, type OrderDraft } from '../services/orderSession'

export function OrderPage() {
  const [draft, setDraft] = useState<OrderDraft | null>(() => getOrderDraft())
  const { data: product, error, isLoading, retry } = useProduct(draft?.productId)

  if (!draft) {
    return (
      <div className="container page">
        <title>Realizar pedido | Pamilu</title>
        <EmptyState title="Todavía no elegiste ninguna prenda" message="Buscá la que te guste en el catálogo y elegí tu talle.">
          <Link to="/catalogo" className="btn btn--primary">
            Ir al catálogo
          </Link>
        </EmptyState>
      </div>
    )
  }

  return (
    <div className="container page">
      <title>Realizar pedido | Pamilu</title>
      <Link to={`/producto/${draft.productId}`} className="back-link">
        <ArrowLeft size={18} aria-hidden="true" />
        Volver a la prenda
      </Link>
      <header className="page__header">
        <p className="eyebrow">Último paso</p>
        <h1 className="page__title">Realizar pedido</h1>
        <p className="page__lead">Completá tus datos y te contactamos para coordinar el pago y la entrega.</p>
      </header>

      {isLoading && !product ? (
        <p className="loading-line" role="status">
          Cargando tu pedido…
        </p>
      ) : error?.code === 'NOT_FOUND' ? (
        <EmptyState title="Esta prenda ya no está disponible" message="Elegí otra del catálogo.">
          <Link to="/catalogo" className="btn btn--primary">
            Ir al catálogo
          </Link>
        </EmptyState>
      ) : error && !product ? (
        <ErrorState onRetry={retry} message={error.message} />
      ) : product ? (
        <div className="order-layout">
          <OrderSummary product={product} size={draft.size} quantity={draft.quantity} />
          <OrderForm product={product} draft={draft} onDraftChange={setDraft} />
        </div>
      ) : null}
    </div>
  )
}
