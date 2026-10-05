import type { ReactNode } from 'react'
import { CloudOff, RefreshCw, SearchX } from 'lucide-react'

interface StatusMessageProps {
  title: string
  message?: string
  icon?: ReactNode
  children?: ReactNode
  role?: 'alert' | 'status'
}

export function StatusMessage({ title, message, icon, children, role = 'status' }: StatusMessageProps) {
  return (
    <div className="status-message" role={role}>
      {icon && (
        <span className="status-message__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <h2 className="status-message__title">{title}</h2>
      {message && <p className="status-message__text">{message}</p>}
      {children && <div className="status-message__actions">{children}</div>}
    </div>
  )
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry: () => void }) {
  return (
    <StatusMessage
      role="alert"
      title="¡Uy! Algo no salió bien"
      message={message ?? 'No pudimos cargar la información. Probá de nuevo.'}
      icon={<CloudOff size={28} />}
    >
      <button type="button" className="btn btn--primary" onClick={onRetry}>
        <RefreshCw aria-hidden="true" size={18} />
        Reintentar
      </button>
    </StatusMessage>
  )
}

export function EmptyState({ title, message, children }: { title: string; message?: string; children?: ReactNode }) {
  return (
    <StatusMessage title={title} message={message} icon={<SearchX size={28} />}>
      {children}
    </StatusMessage>
  )
}
