import { useCallback, useRef, useState } from 'react'
import { useSWRConfig } from 'swr'
import { ordersApi } from '../api/ordersApi'
import type { CreateOrderRequest, Order } from '../types/api'

export function useCreateOrder() {
  const { mutate } = useSWRConfig()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const inFlight = useRef(false)

  const createOrder = useCallback(
    async (request: CreateOrderRequest): Promise<Order> => {
      if (inFlight.current) throw new Error('Order already being submitted')
      inFlight.current = true
      setIsSubmitting(true)
      try {
        return await ordersApi.createOrder(request)
      } finally {
        inFlight.current = false
        setIsSubmitting(false)
        // Stock changed (or we learned it changed): refresh any cached product data.
        void mutate((key) => Array.isArray(key) && (key[0] === 'products' || key[0] === 'product'))
      }
    },
    [mutate],
  )

  return { createOrder, isSubmitting }
}
