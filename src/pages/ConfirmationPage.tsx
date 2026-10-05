import { CheckCircle2, MessageCircle } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { EmptyState } from '../components/ui/StatusMessage'
import { getLastOrder } from '../services/orderSession'
import { buildOrderWhatsAppUrl } from '../services/whatsapp'
import type { Order } from '../types/api'
import { formatDate, formatPrice } from '../utils/format'

const CONTACT_LABELS = { WHATSAPP: 'WhatsApp', INSTAGRAM: 'Instagram', EMAIL: 'email' } as const

export function ConfirmationPage() {
  const location = useLocation()
  const order = (location.state as { order?: Order } | null)?.order ?? getLastOrder()

  if (!order) {
    return (
      <div className="container page">
        <title>Pedido | Pamilu</title>
        <EmptyState title="No encontramos un pedido reciente" message="Si ya hiciste uno, revisá tu email o escribinos.">
          <Link to="/catalogo" className="btn btn--primary">
            Ir al catálogo
          </Link>
        </EmptyState>
      </div>
    )
  }

  return (
    <div className="container page page--narrow">
      <title>{`Pedido ${order.id} confirmado | Pamilu`}</title>
      <section className="confirmation" aria-labelledby="confirmation-title">
        <span className="confirmation__icon" aria-hidden="true">
          <CheckCircle2 size={40} />
        </span>
        <h1 id="confirmation-title" className="page__title">
          ¡Recibimos tu pedido!
        </h1>
        <p className="page__lead">
          Gracias, {order.customer.fullName.split(' ')[0]}. Te vamos a escribir por{' '}
          {CONTACT_LABELS[order.preferredContact]} para coordinar el pago y la entrega.
        </p>

        <div className="confirmation__card">
          <p className="confirmation__number">
            Número de pedido <strong>{order.id}</strong>
          </p>
          <dl className="order-summary__rows">
            <div>
              <dt>Prenda</dt>
              <dd>{order.product.name}</dd>
            </div>
            <div>
              <dt>Talle</dt>
              <dd>{order.size}</dd>
            </div>
            <div>
              <dt>Cantidad</dt>
              <dd>{order.quantity}</dd>
            </div>
            <div>
              <dt>Fecha</dt>
              <dd>{formatDate(order.createdAt)}</dd>
            </div>
            <div className="order-summary__total">
              <dt>Total</dt>
              <dd>{formatPrice(order.total)}</dd>
            </div>
          </dl>
        </div>

        <div className="confirmation__actions">
          <a
            href={buildOrderWhatsAppUrl(order)}
            className="btn btn--whatsapp btn--lg btn--block"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={20} aria-hidden="true" />
            Contactar por WhatsApp
          </a>
          <Link to="/catalogo" className="btn btn--secondary btn--block">
            Seguir mirando
          </Link>
        </div>
      </section>
    </div>
  )
}
