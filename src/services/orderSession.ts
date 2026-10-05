import type { Customer, Order, PreferredContact } from '../types/api'

/** Order in progress, persisted in sessionStorage so a reload does not lose it. */
export interface OrderDraft {
  productId: string
  size: string
  quantity: number
  customer: Customer
  notes: string
  preferredContact: PreferredContact
}

const DRAFT_KEY = 'pamilu:orderDraft'
const LAST_ORDER_KEY = 'pamilu:lastOrder'

function read<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function write(key: string, value: unknown) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore storage errors (private mode / quota); the flow still works in memory.
  }
}

export function getOrderDraft(): OrderDraft | null {
  const draft = read<OrderDraft>(DRAFT_KEY)
  return draft?.productId ? draft : null
}

export function saveOrderDraft(draft: OrderDraft) {
  write(DRAFT_KEY, draft)
}

/** Starts an order for a product, keeping customer data the user may have typed before. */
export function startOrderDraft(selection: Pick<OrderDraft, 'productId' | 'size' | 'quantity'>) {
  const previous = getOrderDraft()
  saveOrderDraft({
    customer: previous?.customer ?? { fullName: '', phone: '', email: '' },
    notes: previous?.notes ?? '',
    preferredContact: previous?.preferredContact ?? 'WHATSAPP',
    ...selection,
  })
}

export function clearOrderDraft() {
  sessionStorage.removeItem(DRAFT_KEY)
}

export function saveLastOrder(order: Order) {
  write(LAST_ORDER_KEY, order)
}

export function getLastOrder(): Order | null {
  return read<Order>(LAST_ORDER_KEY)
}
