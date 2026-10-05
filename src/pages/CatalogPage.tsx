import { Search, X } from 'lucide-react'
import { useSearchParams } from 'react-router'
import { ProductGrid } from '../components/product/ProductGrid'
import { EmptyState, ErrorState } from '../components/ui/StatusMessage'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { useCategories, useProducts } from '../hooks/useProducts'

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') ?? ''
  const q = searchParams.get('q') ?? ''
  const debouncedQ = useDebouncedValue(q.trim(), 300)

  const { data: categories } = useCategories()
  const { data: products, error, isLoading, isRefreshing, retry } = useProducts({ category, q: debouncedQ })

  const hasFilters = Boolean(category || q)
  const activeCategory = categories?.find((c) => c.slug === category)

  function setParam(name: 'category' | 'q', value: string) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(name, value)
    else next.delete(name)
    setSearchParams(next, { replace: name === 'q', preventScrollReset: true })
  }

  function clearFilters() {
    setSearchParams({}, { preventScrollReset: true })
  }

  return (
    <div className="container page">
      <title>{`${activeCategory ? activeCategory.name : 'Catálogo'} | Pamilu`}</title>
      <header className="page__header">
        <p className="eyebrow">Catálogo</p>
        <h1 className="page__title">{activeCategory ? activeCategory.name : 'Todas las prendas'}</h1>
      </header>

      <div className="catalog-filters">
        <form role="search" className="search-box" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="catalog-search" className="sr-only">
            Buscar prendas
          </label>
          <Search className="search-box__icon" size={20} aria-hidden="true" />
          <input
            id="catalog-search"
            type="search"
            className="search-box__input"
            placeholder="Buscar: remera, jean, buzo…"
            value={q}
            onChange={(e) => setParam('q', e.target.value)}
            autoComplete="off"
            enterKeyHint="search"
          />
          {q && (
            <button
              type="button"
              className="search-box__clear"
              onClick={() => setParam('q', '')}
              aria-label="Borrar búsqueda"
            >
              <X size={18} aria-hidden="true" />
            </button>
          )}
        </form>

        <div className="chip-row" role="group" aria-label="Filtrar por categoría">
          <button
            type="button"
            className="chip"
            aria-pressed={!category}
            onClick={() => setParam('category', '')}
          >
            Todas
          </button>
          {categories?.map((c) => (
            <button
              key={c.id}
              type="button"
              className="chip"
              aria-pressed={category === c.slug}
              onClick={() => setParam('category', c.slug)}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <p className="catalog-count" role="status" aria-live="polite">
        {products && !isLoading
          ? `${products.length} ${products.length === 1 ? 'prenda' : 'prendas'}${hasFilters ? ' encontradas' : ''}`
          : ''}
      </p>

      {error && !products ? (
        <ErrorState onRetry={retry} message={error.message} />
      ) : products && products.length === 0 && !isLoading ? (
        <EmptyState
          title="No encontramos prendas"
          message={
            q
              ? `No hay resultados para “${q}”${activeCategory ? ` en ${activeCategory.name}` : ''}. Probá con otra palabra.`
              : 'Por ahora no hay prendas en esta categoría.'
          }
        >
          <button type="button" className="btn btn--primary" onClick={clearFilters}>
            Limpiar filtros
          </button>
        </EmptyState>
      ) : (
        <ProductGrid
          products={products}
          isLoading={isLoading}
          isRefreshing={isRefreshing}
          skeletonCount={6}
          showAvailability
        />
      )}
    </div>
  )
}
