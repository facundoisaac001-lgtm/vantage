import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { useCategories } from '../../hooks/useProducts'
import { ErrorState } from '../ui/StatusMessage'

export function CategoriesSection() {
  const { data: categories, error, isLoading, retry } = useCategories()

  return (
    <section className="section section--tinted" aria-labelledby="categories-title">
      <div className="container">
        <p className="eyebrow">Explorá</p>
        <h2 id="categories-title" className="section__title">
          ¿Qué estás buscando?
        </h2>

        {error && !categories ? (
          <ErrorState onRetry={retry} />
        ) : (
          <ul className="category-grid" aria-busy={isLoading || undefined}>
            {isLoading && !categories
              ? Array.from({ length: 4 }, (_, i) => (
                  <li key={i} aria-hidden="true">
                    <span className="category-card skeleton" />
                  </li>
                ))
              : categories?.map((category, index) => (
                  <li key={category.id}>
                    <Link
                      to={`/catalogo?category=${encodeURIComponent(category.slug)}`}
                      className={`category-card category-card--${index % 4}`}
                    >
                      <span className="category-card__name">{category.name}</span>
                      <ArrowRight size={20} aria-hidden="true" />
                    </Link>
                  </li>
                ))}
          </ul>
        )}
      </div>
    </section>
  )
}
