import type { ProductSize } from '../../types/api'

interface SizeSelectorProps {
  name: string
  sizes: ProductSize[]
  value: string
  onChange: (size: string) => void
  error?: string
  legend?: string
}

export function SizeSelector({ name, sizes, value, onChange, error, legend = 'Talle' }: SizeSelectorProps) {
  const errorId = `${name}-error`

  return (
    <fieldset className="field" aria-describedby={error ? errorId : undefined}>
      <legend className="field__label">{legend}</legend>
      <div className="size-selector">
        {sizes.map((s) => {
          const soldOut = s.stock <= 0
          const id = `${name}-${s.size}`
          return (
            <div key={s.size} className="size-selector__option">
              <input
                type="radio"
                id={id}
                name={name}
                value={s.size}
                checked={value === s.size}
                disabled={soldOut}
                onChange={() => onChange(s.size)}
                aria-invalid={error ? true : undefined}
              />
              <label htmlFor={id}>
                {s.size}
                {soldOut && <span className="sr-only"> (agotado)</span>}
              </label>
            </div>
          )
        })}
      </div>
      {error && (
        <p id={errorId} className="field__error">
          {error}
        </p>
      )}
    </fieldset>
  )
}
