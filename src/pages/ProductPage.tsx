import { useState } from 'react'
import { ArrowLeft, ShoppingBag } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router'
import { AvailabilityBadge } from '../components/product/AvailabilityBadge'
import { QuantitySelector } from '../components/product/QuantitySelector'
import { SizeSelector } from '../components/product/SizeSelector'
import { EmptyState, ErrorState } from '../components/ui/StatusMessage'
import { useProduct } from '../hooks/useProducts'
import type { Product } from '../types/api'
import { formatPrice } from '../utils/format'
import { ORDER_RULES } from '../utils/validators'

export function ProductPage() {
  const { id } = useParams()
  const { data: product, error, isLoading, retry } = useProduct(id)

  return (
    <div className="container page">
      <Link to="/catalogo" className="back-link">
        <ArrowLeft size={18} aria-hidden="true" />
        Volver al catálogo
      </Link>

      {isLoading ? (
        <p>Cargando producto...</p>
      ) : error?.code === 'NOT_FOUND' ? (
        <>
          <title>Prenda no encontrada | Pamilu</title>
          <EmptyState title="Prenda no encontrada" message="Puede que ya no esté disponible o que el link esté mal.">
            <Link to="/catalogo" className="btn btn--primary">
              Volver al catálogo
            </Link>
          </EmptyState>
        </>
      ) : error && !product ? (
        <ErrorState onRetry={retry} message={error.message} />
      ) : product ? (
        <ProductDetailContent key={product.id} product={product} />
      ) : null}
    </div>
  )
}

function ProductDetailContent({ product }: { product: Product }) {
  const navigate = useNavigate()
  console.log("Datos del producto:", product);

  // Protegemos con ? y || [] para evitar errores si 'sizes' no llega
  const sizes = product.sizes || []
  const sizesInStock = sizes.filter((s) => s.stock > 0)
  const [size, setSize] = useState(() => (sizesInStock.length === 1 ? sizesInStock[0].size : ''))
  const [quantity, setQuantity] = useState(1)

  const selected = sizes.find((s) => s.size === size)
  const maxQuantity = Math.min(selected?.stock ?? 1, ORDER_RULES.maxQuantityPerOrder)
  const canOrder = Boolean(selected && selected.stock > 0)

  function handleSizeChange(next: string) {
    setSize(next)
    const stock = sizes.find((s) => s.size === next)?.stock ?? 1
    setQuantity((q) => Math.min(q, Math.max(1, stock)))
  }

  function handleOrder() {
    if (!canOrder) return
    // startOrderDraft({ productId: product.id, size, quantity })
    navigate('/pedido')
  }

  const stockHint = selected
    ? selected.stock === 1
      ? '¡Queda la última!'
      : `Quedan ${selected.stock} en talle ${selected.size}`
    : undefined

  return (
    <article className="product-detail">
      <title>{`${product.name} | Pamilu`}</title>
      <div className="product-detail__media">
        <img src={product.imageUrl} alt={product.imageAlt} width={900} height={900} />
      </div>

      <div className="product-detail__info">
        <p className="eyebrow">{product.category?.name || 'Indumentaria'}</p>
        <h1 className="product-detail__title">{product.name}</h1>
        <p className="product-detail__price">{formatPrice(product.price)}</p>
        <AvailabilityBadge
          available={product.available}
          detail={product.available ? `${sizesInStock.length} de ${sizes.length} talles` : 'Pronto vuelve'}
        />
        <p className="product-detail__description">{product.description}</p>

        {product.available ? (
          <form
            className="product-detail__form"
            onSubmit={(e) => {
              e.preventDefault()
              handleOrder()
            }}
          >
            <SizeSelector name="size" sizes={sizes} value={size} onChange={handleSizeChange} legend="Elegí tu talle" />
            <QuantitySelector
              id="quantity"
              value={quantity}
              max={maxQuantity}
              onChange={setQuantity}
              disabled={!canOrder}
              hint={canOrder ? stockHint : 'Primero elegí un talle'}
            />
            <button type="submit" className="btn btn--primary btn--lg btn--block" disabled={!canOrder}>
              <ShoppingBag size={20} aria-hidden="true" />
              Realizar pedido
            </button>
          </form>
        ) : (
          <div className="notice">
            <p>
              Esta prenda está agotada en todos los talles. Mirá otras opciones en el catálogo o escribinos para saber
              cuándo vuelve.
            </p>
            <Link to="/catalogo" className="btn btn--secondary btn--block">
              Ver otras prendas
            </Link>
          </div>
        )}
      </div>
    </article>
  )
}
