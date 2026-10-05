const priceFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

const dateFormatter = new Intl.DateTimeFormat('es-AR', {
  dateStyle: 'long',
  timeStyle: 'short',
})

export function formatPrice(amount: number): string {
  return priceFormatter.format(amount)
}

export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso))
}

/** Case and accent insensitive, so "buzo" matches "Buzó" and "pantalon" matches "Pantalón". */
export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}
