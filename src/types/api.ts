/**
 * Types aligned 1:1 with docs/API_CONTRACT.md.
 * Both the mock and the real HTTP implementation must return these shapes.
 */

export interface Category {
  id: number
  slug: string
  name: string
}

export interface ProductSize {
  size: string
  stock: number
}

export interface Product {
  id: string
  name: string
  /** Integer amount in ARS, no decimals. */
  price: number
  category: Category
  description: string
  imageUrl: string
  imageAlt: string
  featured: boolean
  sizes: ProductSize[]
  /** Computed: true when any size has stock > 0. */
  available: boolean
}

export interface ProductFilters {
  category?: string
  q?: string
  featured?: boolean
}

export const PREFERRED_CONTACTS = ['WHATSAPP', 'INSTAGRAM', 'EMAIL'] as const
export type PreferredContact = (typeof PREFERRED_CONTACTS)[number]

export interface Customer {
  fullName: string
  phone: string
  email: string
}

export interface CreateOrderRequest {
  customer: Customer
  productId: string
  size: string
  quantity: number
  notes?: string
  preferredContact: PreferredContact
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'DELIVERED' | 'CANCELLED'

export interface Order {
  id: string
  customer: Customer
  product: { id: string; name: string }
  size: string
  quantity: number
  /** Price snapshot at the moment the order was created. */
  unitPrice: number
  total: number
  notes: string | null
  preferredContact: PreferredContact
  status: OrderStatus
  createdAt: string
}

/** `NETWORK_ERROR` is frontend-only: the request never reached the backend. */
export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'OUT_OF_STOCK'
  | 'INTERNAL_ERROR'
  | 'NETWORK_ERROR'

export interface ApiErrorBody {
  status: number
  code: ApiErrorCode
  message: string
  fieldErrors?: Record<string, string>
}

export interface ProductsApi {
  getCategories(): Promise<Category[]>
  getProducts(filters?: ProductFilters): Promise<Product[]>
  getProductById(id: string): Promise<Product>
}

export interface OrdersApi {
  createOrder(request: CreateOrderRequest): Promise<Order>
  getOrderById(id: string): Promise<Order>
}
