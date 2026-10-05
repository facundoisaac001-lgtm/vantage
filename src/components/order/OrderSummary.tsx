import type { Product } from '../../types/api'
import { formatPrice } from '../../utils/format'

interface OrderSummaryProps {
  product: Product
  size: string
  quantity: number
}

export function OrderSummary({ product, size, quantity }: OrderSummaryProps) {
  return (
    <aside className="order-summary" aria-labelledby="order-summary-title">
      <h2 id="order-summary-title" className="order-summary__title">
        Tu pedido
      </h2>
      <div className="order-summary__product">
        <img src={product.imageUrl} alt="" width={96} height={96} />
        <div>
          <p className="order-summary__name">{product.name}</p>
          <p className="order-summary__meta">{product.category.name}</p>
        </div>
      </div>
      <dl className="order-summary__rows">
        <div>
          <dt>Talle</dt>
          <dd>{size || '—'}</dd>
        </div>
        <div>
          <dt>Cantidad</dt>
          <dd>{quantity}</dd>
        </div>
        <div>
          <dt>Precio unitario</dt>
          <dd>{formatPrice(product.price)}</dd>
        </div>
        <div className="order-summary__total">
          <dt>Total estimado</dt>
          <dd>{formatPrice(product.price * quantity)}</dd>
        </div>
      </dl>
      <p className="order-summary__note">No pagás nada ahora. Te contactamos para coordinar el pago y la entrega.</p>
    </aside>
  )
}
