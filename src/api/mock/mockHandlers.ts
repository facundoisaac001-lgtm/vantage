import type { Category, CreateOrderRequest, Order, OrdersApi, Product, ProductsApi } from '../../types/api'
import { normalizeText } from '../../utils/format'
import { hasErrors, validateOrderRequest } from '../../utils/validators'
import { ApiError } from '../client'
import { categoryRows } from './categories'
import { productRows, productSizeRows, type ProductRow } from './products'

/**
 * In-memory "backend" that implements the same ProductsApi / OrdersApi interface
 * as the HTTP client. Orders persist in sessionStorage during the browser session.
 */

const ORDERS_STORAGE_KEY = 'pamilu:mock:orders'
const ORDER_ID_OFFSET = 122

function simulateLatency(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 200))
}

function loadOrders(): Order[] {
  try {
    const raw = sessionStorage.getItem(ORDERS_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Order[]) : []
  } catch {
    return []
  }
}

const orders: Order[] = loadOrders()

function persistOrders() {
  try {
    sessionStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders))
  } catch {
    // Storage may be full or disabled; orders still live in memory for this tab.
  }
}

/** Stock = initial stock − units already ordered in this session, like a real DB decrement. */
function currentStock(productId: string, size: string): number {
  const row = productSizeRows.find((s) => s.productId === productId && s.size === size)
  if (!row) return 0
  const reserved = orders
    .filter((o) => o.product.id === productId && o.size === size)
    .reduce((sum, o) => sum + o.quantity, 0)
  return Math.max(0, row.stock - reserved)
}

function toCategory(categoryId: number): Category {
  const row = categoryRows.find((c) => c.id === categoryId)
  if (!row) throw new ApiError({ status: 500, code: 'INTERNAL_ERROR', message: 'Categoría inexistente' })
  return { ...row }
}

function toProduct(row: ProductRow): Product {
  const sizes = productSizeRows
    .filter((s) => s.productId === row.id)
    .sort((a, b) => a.id - b.id)
    .map((s) => ({ size: s.size, stock: currentStock(row.id, s.size) }))

  return {
    id: row.id,
    name: row.name,
    price: row.price,
    category: toCategory(row.categoryId),
    description: row.description,
    imageUrl: row.imageUrl,
    imageAlt: row.imageAlt,
    featured: row.featured,
    sizes,
    available: sizes.some((s) => s.stock > 0),
  }
}

function notFound(message: string): ApiError {
  return new ApiError({ status: 404, code: 'NOT_FOUND', message })
}

export const mockProductsApi: ProductsApi = {
  async getCategories() {
    await simulateLatency()
    return categoryRows.map((c) => ({ ...c }))
  },

  async getProducts(filters = {}) {
    await simulateLatency()
    let rows = productRows.filter((p) => p.active)

    if (filters.category) {
      const category = categoryRows.find((c) => c.slug === filters.category)
      if (!category) return []
      rows = rows.filter((p) => p.categoryId === category.id)
    }

    if (filters.featured) rows = rows.filter((p) => p.featured)

    const query = normalizeText(filters.q ?? '')
    if (query) {
      rows = rows.filter((p) => {
        const haystack = normalizeText(`${p.name} ${p.description} ${toCategory(p.categoryId).name}`)
        return query.split(/\s+/).every((term) => haystack.includes(term))
      })
    }

    return rows.map(toProduct)
  },

  async getProductById(id) {
    await simulateLatency()
    const row = productRows.find((p) => p.id === id && p.active)
    if (!row) throw notFound('Prenda no encontrada')
    return toProduct(row)
  },
}

export const mockOrdersApi: OrdersApi = {
  async createOrder(request: CreateOrderRequest) {
    await simulateLatency()

    const fieldErrors = validateOrderRequest(request)
    if (hasErrors(fieldErrors)) {
      throw new ApiError({
        status: 400,
        code: 'VALIDATION_ERROR',
        message: 'Datos inválidos',
        fieldErrors: fieldErrors as Record<string, string>,
      })
    }

    const product = productRows.find((p) => p.id === request.productId && p.active)
    if (!product) throw notFound('La prenda que elegiste ya no está disponible')

    const sizeExists = productSizeRows.some((s) => s.productId === product.id && s.size === request.size)
    if (!sizeExists) {
      throw new ApiError({
        status: 400,
        code: 'VALIDATION_ERROR',
        message: 'Datos inválidos',
        fieldErrors: { size: 'Ese talle no existe para esta prenda' },
      })
    }

    const stock = currentStock(product.id, request.size)
    if (request.quantity > stock) {
      throw new ApiError({
        status: 409,
        code: 'OUT_OF_STOCK',
        message:
          stock === 0
            ? `El talle ${request.size} se agotó recién. Elegí otro talle.`
            : `Solo quedan ${stock} ${stock === 1 ? 'unidad' : 'unidades'} en talle ${request.size}.`,
      })
    }

    const notes = request.notes?.trim()
    const order: Order = {
      id: `PAM-${String(ORDER_ID_OFFSET + orders.length + 1).padStart(6, '0')}`,
      customer: {
        fullName: request.customer.fullName.trim(),
        phone: request.customer.phone.trim(),
        email: request.customer.email.trim().toLowerCase(),
      },
      product: { id: product.id, name: product.name },
      size: request.size,
      quantity: request.quantity,
      unitPrice: product.price,
      total: product.price * request.quantity,
      notes: notes ? notes : null,
      preferredContact: request.preferredContact,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    }

    orders.push(order)
    persistOrders()
    return structuredClone(order)
  },

  async getOrderById(id) {
    await simulateLatency()
    const order = orders.find((o) => o.id === id)
    if (!order) throw notFound('Pedido no encontrado')
    return structuredClone(order)
  },
}
