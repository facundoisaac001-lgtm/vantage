import { config } from '../config'
import type { Category, Product, ProductsApi } from '../types/api'
import { httpClient } from './client'
import { mockProductsApi } from './mock/mockHandlers'

const httpProductsApi: ProductsApi = {
  getCategories: () => httpClient.get<Category[]>('/categories'),
  getProducts: (filters = {}) =>
    httpClient.get<Product[]>('/products', {
      category: filters.category,
      q: filters.q,
      featured: filters.featured ? true : undefined,
    }),
  getProductById: (id) => httpClient.get<Product>(`/products/${encodeURIComponent(id)}`),
}

export const productsApi: ProductsApi = config.useMock ? mockProductsApi : httpProductsApi
