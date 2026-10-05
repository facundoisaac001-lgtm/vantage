export function AvailabilityBadge({ available, detail }: { available: boolean; detail?: string }) {
  return (
    <p className={`availability availability--${available ? 'in' : 'out'}`}>
      <span className="availability__dot" aria-hidden="true" />
      {available ? 'Disponible' : 'Sin stock'}
      {detail && <span className="availability__detail"> · {detail}</span>}
    </p>
  )
}
