import type { Product } from '../../types/api'
import { ProductCard, ProductCardSkeleton } from './ProductCard'

interface ProductGridProps {
  products?: Product[]
  isLoading?: boolean
  isRefreshing?: boolean
  skeletonCount?: number
  showAvailability?: boolean
}

export function ProductGrid({
  products,
  isLoading,
  isRefreshing,
  skeletonCount = 4,
  showAvailability,
}: ProductGridProps) {
  if (isLoading && !products) {
    return (
      <div className="product-grid" aria-busy="true">
        <span className="sr-only" role="status">
          Cargando prendas…
        </span>
        {Array.from({ length: skeletonCount }, (_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <ul className={`product-grid${isRefreshing ? ' is-refreshing' : ''}`} aria-busy={isRefreshing || undefined}>
      {products?.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} showAvailability={showAvailability} />
        </li>
      ))}
    </ul>
  )
}
