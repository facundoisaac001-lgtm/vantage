import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

interface BaseProps {
  id: string
  label: string
  error?: string
  hint?: string
}

type InputProps = BaseProps & { multiline?: false } & Omit<InputHTMLAttributes<HTMLInputElement>, 'id'>
type TextareaProps = BaseProps & { multiline: true } & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'>

export function TextField(props: InputProps | TextareaProps) {
  const { id, label, error, hint, required } = props
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined
  const shared = {
    id,
    className: `field__control${error ? ' field__control--invalid' : ''}`,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
  }

  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
        {!required && <span className="field__optional"> (opcional)</span>}
      </label>
      {props.multiline ? (
        <textarea {...omitBase(props)} {...shared} />
      ) : (
        <input {...omitBase(props)} {...shared} />
      )}
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

function omitBase<T extends BaseProps & { multiline?: boolean }>(props: T) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, label, error, hint, multiline, ...rest } = props
  return rest
}
