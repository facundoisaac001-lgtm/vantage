import { PREFERRED_CONTACTS, type CreateOrderRequest } from '../types/api'

/**
 * Validation rules shared by the order form and the mock backend.
 * Keep in sync with the Kotlin backend (see docs/API_CONTRACT.md → "Validaciones").
 */
export const ORDER_RULES = {
  fullNameMin: 3,
  fullNameMax: 120,
  phoneMinDigits: 8,
  phoneMaxDigits: 15,
  emailMax: 254,
  notesMax: 500,
  maxQuantityPerOrder: 10,
} as const

export type OrderField = 'fullName' | 'phone' | 'email' | 'size' | 'quantity' | 'notes' | 'preferredContact'
export type OrderFieldErrors = Partial<Record<OrderField, string>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_ALLOWED_CHARS = /^\+?[\d\s()-]+$/

export function validateFullName(value: string): string | undefined {
  const trimmed = value.trim()
  if (!trimmed) return 'Ingresá tu nombre y apellido'
  if (trimmed.length < ORDER_RULES.fullNameMin || !trimmed.includes(' ')) return 'Ingresá nombre y apellido'
  if (trimmed.length > ORDER_RULES.fullNameMax) return `Máximo ${ORDER_RULES.fullNameMax} caracteres`
  return undefined
}

export function validatePhone(value: string): string | undefined {
  const trimmed = value.trim()
  if (!trimmed) return 'Ingresá tu número de teléfono'
  const digits = trimmed.replace(/\D/g, '')
  if (
    !PHONE_ALLOWED_CHARS.test(trimmed) ||
    digits.length < ORDER_RULES.phoneMinDigits ||
    digits.length > ORDER_RULES.phoneMaxDigits
  ) {
    return 'Ingresá un teléfono válido, por ejemplo 11 2345 6789'
  }
  return undefined
}

export function validateEmail(value: string): string | undefined {
  const trimmed = value.trim()
  if (!trimmed) return 'Ingresá tu email'
  if (trimmed.length > ORDER_RULES.emailMax || !EMAIL_PATTERN.test(trimmed)) return 'Formato de email inválido'
  return undefined
}

export function validateSize(value: string): string | undefined {
  return value ? undefined : 'Elegí un talle'
}

export function validateQuantity(value: number, maxStock: number = ORDER_RULES.maxQuantityPerOrder): string | undefined {
  if (!Number.isInteger(value) || value < 1) return 'La cantidad mínima es 1'
  const max = Math.min(maxStock, ORDER_RULES.maxQuantityPerOrder)
  if (value > max) return `Podés pedir hasta ${max} ${max === 1 ? 'unidad' : 'unidades'}`
  return undefined
}

export function validateNotes(value: string | undefined): string | undefined {
  if (value && value.trim().length > ORDER_RULES.notesMax) return `Máximo ${ORDER_RULES.notesMax} caracteres`
  return undefined
}

export function validatePreferredContact(value: string): string | undefined {
  return (PREFERRED_CONTACTS as readonly string[]).includes(value) ? undefined : 'Elegí cómo preferís que te contactemos'
}

export function validateOrderRequest(request: CreateOrderRequest): OrderFieldErrors {
  const errors: OrderFieldErrors = {
    fullName: validateFullName(request.customer.fullName),
    phone: validatePhone(request.customer.phone),
    email: validateEmail(request.customer.email),
    size: validateSize(request.size),
    quantity: validateQuantity(request.quantity),
    notes: validateNotes(request.notes),
    preferredContact: validatePreferredContact(request.preferredContact),
  }
  return Object.fromEntries(Object.entries(errors).filter(([, message]) => message)) as OrderFieldErrors
}

export function hasErrors(errors: OrderFieldErrors): boolean {
  return Object.keys(errors).length > 0
}

/**
 * Backend field errors may come as nested paths ("customer.email").
 * We keep the last segment so they map to the form field names.
 */
export function mapApiFieldErrors(fieldErrors: Record<string, string>): OrderFieldErrors {
  const mapped: OrderFieldErrors = {}
  for (const [path, message] of Object.entries(fieldErrors)) {
    const field = path.split('.').pop() as OrderField
    mapped[field] = message
  }
  return mapped
}
