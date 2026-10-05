import { Minus, Plus } from 'lucide-react'

interface QuantitySelectorProps {
  id: string
  value: number
  max: number
  onChange: (quantity: number) => void
  disabled?: boolean
  error?: string
  hint?: string
}

export function QuantitySelector({ id, value, max, onChange, disabled, error, hint }: QuantitySelectorProps) {
  const safeMax = Math.max(1, max)
  const clamp = (n: number) => Math.min(safeMax, Math.max(1, Math.round(n) || 1))
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined

  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        Cantidad
      </label>
      <div className="quantity">
        <button
          type="button"
          className="quantity__btn"
          onClick={() => onChange(clamp(value - 1))}
          disabled={disabled || value <= 1}
          aria-label="Restar una unidad"
          aria-controls={id}
        >
          <Minus size={18} aria-hidden="true" />
        </button>
        <input
          id={id}
          className="quantity__input"
          type="number"
          inputMode="numeric"
          min={1}
          max={safeMax}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(clamp(Number(e.target.value)))}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
        />
        <button
          type="button"
          className="quantity__btn"
          onClick={() => onChange(clamp(value + 1))}
          disabled={disabled || value >= safeMax}
          aria-label="Sumar una unidad"
          aria-controls={id}
        >
          <Plus size={18} aria-hidden="true" />
        </button>
      </div>
      {hint && (
        <p id={`${id}-hint`} className="field__hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="field__error">
          {error}
        </p>
      )}
    </div>
  )
}
