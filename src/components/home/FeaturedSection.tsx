import { Link } from 'react-router'
import { useProducts } from '../../hooks/useProducts'
import { ProductGrid } from '../product/ProductGrid'
import { ErrorState } from '../ui/StatusMessage'

export function FeaturedSection() {
  const { data: products, error, isLoading, retry } = useProducts({ featured: true })

  return (
    <section className="section" aria-labelledby="featured-title">
      <div className="container">
        <div className="section__header">
          <div>
            <p className="eyebrow">Las favoritas</p>
            <h2 id="featured-title" className="section__title">
              Prendas destacadas
            </h2>
          </div>
          <Link to="/catalogo" className="link-arrow">
            Ver todo el catálogo
          </Link>
        </div>

        {error && !products ? (
          <ErrorState onRetry={retry} />
        ) : (
          <ProductGrid products={products} isLoading={isLoading} skeletonCount={4} />
        )}
      </div>
    </section>
  )
}
