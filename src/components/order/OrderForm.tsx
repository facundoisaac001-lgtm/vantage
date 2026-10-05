import { useRef, useState, type FormEvent } from 'react'
import { AlertCircle, Send } from 'lucide-react'
import { useNavigate } from 'react-router'
import { isApiError } from '../../api/client'
import { useCreateOrder } from '../../hooks/useCreateOrder'
import { clearOrderDraft, saveLastOrder, saveOrderDraft, type OrderDraft } from '../../services/orderSession'
import { PREFERRED_CONTACTS, type CreateOrderRequest, type PreferredContact, type Product } from '../../types/api'
import {
  hasErrors,
  mapApiFieldErrors,
  ORDER_RULES,
  validateEmail,
  validateFullName,
  validateNotes,
  validatePhone,
  validateQuantity,
  validateSize,
  type OrderField,
  type OrderFieldErrors,
} from '../../utils/validators'
import { QuantitySelector } from '../product/QuantitySelector'
import { SizeSelector } from '../product/SizeSelector'
import { Spinner } from '../ui/Spinner'
import { TextField } from './TextField'

const CONTACT_LABELS: Record<PreferredContact, string> = {
  WHATSAPP: 'WhatsApp',
  INSTAGRAM: 'Instagram',
  EMAIL: 'Email',
}

const FIELD_ORDER: OrderField[] = ['size', 'quantity', 'fullName', 'phone', 'email', 'notes', 'preferredContact']

interface OrderFormProps {
  product: Product
  draft: OrderDraft
  onDraftChange: (draft: OrderDraft) => void
}

export function OrderForm({ product, draft, onDraftChange }: OrderFormProps) {
  const navigate = useNavigate()
  const formRef = useRef<HTMLFormElement>(null)
  const alertRef = useRef<HTMLDivElement>(null)
  const { createOrder, isSubmitting } = useCreateOrder()
  const [errors, setErrors] = useState<OrderFieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)

  const selectedSize = product.sizes.find((s) => s.size === draft.size)
  const maxQuantity = Math.min(selectedSize?.stock ?? 1, ORDER_RULES.maxQuantityPerOrder)

  function update(patch: Partial<OrderDraft>, clearField?: OrderField) {
    const next = { ...draft, ...patch, customer: { ...draft.customer, ...patch.customer } }
    onDraftChange(next)
    saveOrderDraft(next)
    if (clearField && errors[clearField]) setErrors(({ [clearField]: _removed, ...rest }) => rest)
  }

  function validateAll(): OrderFieldErrors {
    const result: OrderFieldErrors = {
      size: validateSize(draft.size) ?? (selectedSize && selectedSize.stock <= 0 ? 'Ese talle se agotó' : undefined),
      quantity: validateQuantity(draft.quantity, selectedSize?.stock ?? ORDER_RULES.maxQuantityPerOrder),
      fullName: validateFullName(draft.customer.fullName),
      phone: validatePhone(draft.customer.phone),
      email: validateEmail(draft.customer.email),
      notes: validateNotes(draft.notes),
    }
    return Object.fromEntries(Object.entries(result).filter(([, v]) => v)) as OrderFieldErrors
  }

  function focusFirstError(fieldErrors: OrderFieldErrors) {
    const first = FIELD_ORDER.find((f) => fieldErrors[f])
    if (!first) return
    const target =
      first === 'size' || first === 'preferredContact'
        ? formRef.current?.querySelector<HTMLInputElement>(`input[name="${first}"]:not(:disabled)`)
        : formRef.current?.querySelector<HTMLElement>(`#${first}`)
    target?.focus()
  }

  function validateOnBlur(field: OrderField, validator: () => string | undefined) {
    const message = validator()
    setErrors((prev) => {
      const { [field]: _removed, ...rest } = prev
      return message ? { ...rest, [field]: message } : rest
    })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting) return
    setFormError(null)

    const fieldErrors = validateAll()
    setErrors(fieldErrors)
    if (hasErrors(fieldErrors)) {
      focusFirstError(fieldErrors)
      return
    }

    const notes = draft.notes.trim()
    const request: CreateOrderRequest = {
      customer: {
        fullName: draft.customer.fullName.trim(),
        phone: draft.customer.phone.trim(),
        email: draft.customer.email.trim(),
      },
      productId: product.id,
      size: draft.size,
      quantity: draft.quantity,
      ...(notes ? { notes } : {}),
      preferredContact: draft.preferredContact,
    }

    try {
      const order = await createOrder(request)
      saveLastOrder(order)
      clearOrderDraft()
      navigate('/confirmacion', { replace: true, state: { order } })
    } catch (error) {
      if (isApiError(error) && error.code === 'VALIDATION_ERROR' && Object.keys(error.fieldErrors).length > 0) {
        const mapped = mapApiFieldErrors(error.fieldErrors)
        setErrors(mapped)
        focusFirstError(mapped)
        return
      }
      setFormError(
        isApiError(error)
          ? error.code === 'OUT_OF_STOCK'
            ? `${error.message} Actualizamos el stock disponible.`
            : error.message
          : 'Ocurrió un error inesperado. Probá de nuevo en un ratito.',
      )
      requestAnimationFrame(() => alertRef.current?.focus())
    }
  }

  return (
    <form ref={formRef} className="order-form" onSubmit={handleSubmit} noValidate aria-busy={isSubmitting}>
      {formError && (
        <div ref={alertRef} className="form-alert" role="alert" tabIndex={-1}>
          <AlertCircle size={20} aria-hidden="true" />
          <p>{formError}</p>
        </div>
      )}

      <fieldset className="order-form__section" disabled={isSubmitting}>
        <legend className="order-form__legend">Prenda</legend>
        <SizeSelector
          name="size"
          sizes={product.sizes}
          value={draft.size}
          error={errors.size}
          onChange={(size) => {
            const stock = product.sizes.find((s) => s.size === size)?.stock ?? 1
            update({ size, quantity: Math.min(draft.quantity, Math.max(1, stock)) }, 'size')
          }}
        />
        <QuantitySelector
          id="quantity"
          value={draft.quantity}
          max={maxQuantity}
          disabled={!selectedSize || selectedSize.stock <= 0}
          error={errors.quantity}
          hint={selectedSize && selectedSize.stock > 0 ? `Disponibles en talle ${draft.size}: ${selectedSize.stock}` : undefined}
          onChange={(quantity) => update({ quantity }, 'quantity')}
        />
      </fieldset>

      <fieldset className="order-form__section" disabled={isSubmitting}>
        <legend className="order-form__legend">Tus datos</legend>
        <TextField
          id="fullName"
          label="Nombre y apellido"
          required
          autoComplete="name"
          maxLength={ORDER_RULES.fullNameMax}
          value={draft.customer.fullName}
          error={errors.fullName}
          onChange={(e) => update({ customer: { ...draft.customer, fullName: e.target.value } }, 'fullName')}
          onBlur={() => draft.customer.fullName && validateOnBlur('fullName', () => validateFullName(draft.customer.fullName))}
        />
        <TextField
          id="phone"
          label="Teléfono"
          type="tel"
          required
          inputMode="tel"
          autoComplete="tel"
          placeholder="11 2345 6789"
          value={draft.customer.phone}
          error={errors.phone}
          onChange={(e) => update({ customer: { ...draft.customer, phone: e.target.value } }, 'phone')}
          onBlur={() => draft.customer.phone && validateOnBlur('phone', () => validatePhone(draft.customer.phone))}
        />
        <TextField
          id="email"
          label="Email"
          type="email"
          required
          inputMode="email"
          autoComplete="email"
          placeholder="tu@email.com"
          maxLength={ORDER_RULES.emailMax}
          value={draft.customer.email}
          error={errors.email}
          onChange={(e) => update({ customer: { ...draft.customer, email: e.target.value } }, 'email')}
          onBlur={() => draft.customer.email && validateOnBlur('email', () => validateEmail(draft.customer.email))}
        />
        <TextField
          id="notes"
          label="Comentarios"
          multiline
          rows={3}
          maxLength={ORDER_RULES.notesMax}
          placeholder="Ej: lo retiro en la feria del sábado"
          hint={`${draft.notes.length}/${ORDER_RULES.notesMax} caracteres`}
          value={draft.notes}
          error={errors.notes}
          onChange={(e) => update({ notes: e.target.value }, 'notes')}
        />
      </fieldset>

      <fieldset className="order-form__section" disabled={isSubmitting}>
        <legend className="order-form__legend">¿Cómo preferís que te contactemos?</legend>
        <div className="choice-group">
          {PREFERRED_CONTACTS.map((option) => (
            <div key={option} className="choice">
              <input
                type="radio"
                id={`contact-${option}`}
                name="preferredContact"
                value={option}
                checked={draft.preferredContact === option}
                onChange={() => update({ preferredContact: option }, 'preferredContact')}
              />
              <label htmlFor={`contact-${option}`}>{CONTACT_LABELS[option]}</label>
            </div>
          ))}
        </div>
        {errors.preferredContact && <p className="field__error">{errors.preferredContact}</p>}
      </fieldset>

      <button type="submit" className="btn btn--primary btn--lg btn--block" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Spinner size={20} />
            Enviando pedido…
          </>
        ) : (
          <>
            <Send size={20} aria-hidden="true" />
            Confirmar pedido
          </>
        )}
      </button>
    </form>
  )
}
