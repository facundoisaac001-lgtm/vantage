import { Link } from 'react-router'
import type { Product } from '../../types/api'
import { formatPrice } from '../../utils/format'
import { AvailabilityBadge } from './AvailabilityBadge'
import { SizeList } from './SizeList'

interface ProductCardProps {
  product: Product
  showAvailability?: boolean
  headingLevel?: 'h2' | 'h3'
}

export function ProductCard({ product, showAvailability = false, headingLevel: Heading = 'h3' }: ProductCardProps) {
  const titleId = `product-${product.id}-title`

  return (
    <article className={`product-card${product.available ? '' : ' product-card--sold-out'}`} aria-labelledby={titleId}>
      <div className="product-card__media">
        <img src={product.imageUrl} alt={product.imageAlt} loading="lazy" width={600} height={600} />
        {!product.available && <span className="product-card__ribbon">Sin stock</span>}
      </div>
      <div className="product-card__body">
        <p className="product-card__category">{product.category.name}</p>
        <Heading id={titleId} className="product-card__title">
          {product.name}
        </Heading>
        <p className="product-card__price">{formatPrice(product.price)}</p>
        <SizeList sizes={product.sizes} />
        {showAvailability && <AvailabilityBadge available={product.available} />}
        <Link
          to={`/producto/${product.id}`}
          className="btn btn--secondary btn--block product-card__cta"
          aria-label={`Ver producto: ${product.name}`}
        >
          Ver producto
        </Link>
      </div>
    </article>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="product-card product-card--skeleton" aria-hidden="true">
      <div className="product-card__media skeleton" />
      <div className="product-card__body">
        <span className="skeleton skeleton--text skeleton--short" />
        <span className="skeleton skeleton--text" />
        <span className="skeleton skeleton--text skeleton--short" />
        <span className="skeleton skeleton--chips" />
        <span className="skeleton skeleton--button" />
      </div>
    </div>
  )
}
