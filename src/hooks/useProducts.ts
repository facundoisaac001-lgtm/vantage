import useSWR from 'swr'
import { productsApi } from '../api/productsApi'
import type { ApiError } from '../api/client'
import type { Category, Product, ProductFilters } from '../types/api'

export interface QueryState<T> {
  data: T | undefined
  error: ApiError | undefined
  isLoading: boolean
  /** True while refetching with previous data still on screen. */
  isRefreshing: boolean
  retry: () => void
}

function toQueryState<T>(result: {
  data: T | undefined
  error: ApiError | undefined
  isLoading: boolean
  isValidating: boolean
  mutate: () => unknown
}): QueryState<T> {
  return {
    data: result.data,
    error: result.error,
    isLoading: result.isLoading,
    isRefreshing: result.isValidating && result.data !== undefined,
    retry: () => void result.mutate(),
  }
}

export function useCategories(): QueryState<Category[]> {
  return toQueryState(useSWR<Category[], ApiError>('categories', () => productsApi.getCategories()))
}

export function useProducts(filters: ProductFilters = {}): QueryState<Product[]> {
  const key = ['products', filters.category ?? '', filters.q ?? '', Boolean(filters.featured)] as const
  return toQueryState(
    useSWR<Product[], ApiError>(key, () => productsApi.getProducts(filters), { keepPreviousData: true }),
  )
}

export function useProduct(id: string | undefined): QueryState<Product> {
  return toQueryState(useSWR<Product, ApiError>(id ? ['product', id] : null, () => productsApi.getProductById(id!)))
}
