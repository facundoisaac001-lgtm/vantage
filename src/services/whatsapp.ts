import { config } from '../config'
import type { Order } from '../types/api'

function buildUrl(message: string): string {
  return `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(message)}`
}

export function buildOrderWhatsAppUrl(order: Order): string {
  const message = [
    `¡Hola Pamilu! Soy ${order.customer.fullName}.`,
    `Te escribo por mi pedido ${order.id}:`,
    `• Prenda: ${order.product.name}`,
    `• Talle: ${order.size}`,
    `• Cantidad: ${order.quantity}`,
    '¿Coordinamos la entrega?',
  ].join('\n')
  return buildUrl(message)
}

export function buildGeneralWhatsAppUrl(): string {
  return buildUrl('¡Hola Pamilu! Quería hacerles una consulta.')
}
