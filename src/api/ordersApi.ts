import { config } from '../config'
import type { Order, OrdersApi } from '../types/api'
import { httpClient } from './client'
import { mockOrdersApi } from './mock/mockHandlers'

const httpOrdersApi: OrdersApi = {
  createOrder: (request) => httpClient.post<Order>('/orders', request),
  getOrderById: (id) => httpClient.get<Order>(`/orders/${encodeURIComponent(id)}`),
}

export const ordersApi: OrdersApi = config.useMock ? mockOrdersApi : httpOrdersApi
