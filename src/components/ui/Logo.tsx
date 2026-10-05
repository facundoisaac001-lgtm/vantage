import { Heart } from 'lucide-react'

export function Logo({ size = 'md' }: { size?: 'md' | 'lg' }) {
  return (
    <span className={`logo logo--${size}`}>
      <span className="logo__mark" aria-hidden="true">
        <Heart size={size === 'lg' ? 22 : 16} fill="currentColor" strokeWidth={0} />
      </span>
      <span className="logo__text">pamilu</span>
    </span>
  )
}
