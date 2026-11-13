import { config } from '../config'
import type { Category, Product, ProductFilters, ProductsApi } from '../types/api'
import { normalizeText } from '../utils/format'
import { ApiError, httpClient } from './client'
import { mockProductsApi } from './mock/mockHandlers'

/**
 * Shape real que devuelve el backend Kotlin (entity `Producto`, GET /api/products).
 * `precio` es BigDecimal en Kotlin → Jackson lo serializa como número (ej: 12000.0).
 */
interface ProductoDto {
  id: number
  nombre: string
  precio: number | string
  stock: number
  imageUrl: string | null
}

const PLACEHOLDER_IMAGE = '/placeholder.jpg'
const FEATURED_LIMIT = 4

/** El backend todavía no relaciona productos con categorías: usamos una genérica. */
const DEFAULT_CATEGORY: Category = { id: 0, slug: 'indumentaria', name: 'Indumentaria' }

/** Adapter: traduce el DTO del backend al contrato `Product` que usa toda la UI. */
function toProduct(dto: ProductoDto): Product {
  return {
    id: String(dto.id),
    name: dto.nombre,
    price: Math.round(Number(dto.precio)),
    category: DEFAULT_CATEGORY,
    description: '',
    imageUrl: dto.imageUrl || PLACEHOLDER_IMAGE,
    imageAlt: dto.nombre,
    featured: false,
    // El backend maneja stock global, no por talle → un único talle con ese stock.
    sizes: [{ size: 'Único', stock: dto.stock }],
    available: dto.stock > 0,
  }
}

/** El backend ignora los query params, así que la búsqueda se resuelve acá. */
function applyFilters(products: Product[], filters: ProductFilters): Product[] {
  let result = products

  const query = normalizeText(filters.q ?? '')
  if (query) {
    result = result.filter((p) => {
      const haystack = normalizeText(p.name)
      return query.split(/\s+/).every((term) => haystack.includes(term))
    })
  }

  // Sin campo `featured` en el backend: la home muestra los primeros N.
  if (filters.featured) result = result.slice(0, FEATURED_LIMIT)

  return result
}

const httpProductsApi: ProductsApi = {
  getCategories: () => httpClient.get<Category[]>('/categories'),

  getProducts: async (filters = {}) => {
    const dtos = await httpClient.get<ProductoDto[]>('/products')
    return applyFilters(dtos.map(toProduct), filters)
  },

  getProductById: async (id) => {
    // Si no existe, el controller responde 200 con body vacío (Producto? = null), no un 404.
    const dto = await httpClient.get<ProductoDto | null>(`/products/${encodeURIComponent(id)}`)
    if (!dto) throw new ApiError({ status: 404, code: 'NOT_FOUND', message: 'Prenda no encontrada' })
    return toProduct(dto)
  },
}

export const productsApi: ProductsApi = config.useMock ? mockProductsApi : httpProductsApi
