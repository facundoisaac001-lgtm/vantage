import { LoaderCircle } from 'lucide-react'

export function Spinner({ size = 18 }: { size?: number }) {
  return <LoaderCircle className="spinner" size={size} aria-hidden="true" />
}
