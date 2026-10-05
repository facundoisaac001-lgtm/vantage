import type { ProductSize } from '../../types/api'

export function SizeList({ sizes }: { sizes: ProductSize[] }) {
  const inStock = sizes.filter((s) => s.stock > 0).map((s) => s.size)
  const label = inStock.length > 0 ? `Talles disponibles: ${inStock.join(', ')}` : 'Sin talles disponibles'

  return (
    <ul className="size-list" aria-label={label}>
      {sizes.map((s) => (
        <li key={s.size} className={`size-list__item${s.stock > 0 ? '' : ' size-list__item--out'}`} aria-hidden="true">
          {s.size}
        </li>
      ))}
    </ul>
  )
}
