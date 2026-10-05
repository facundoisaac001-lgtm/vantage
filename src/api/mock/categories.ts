/** Mirrors the `categories` table in docs/schema.sql. */
export interface CategoryRow {
  id: number
  slug: string
  name: string
}

export const categoryRows: CategoryRow[] = [
  { id: 1, slug: 'remeras', name: 'Remeras' },
  { id: 2, slug: 'buzos', name: 'Buzos' },
  { id: 3, slug: 'pantalones', name: 'Pantalones' },
  { id: 4, slug: 'accesorios', name: 'Accesorios' },
]
