import { Link, NavLink } from 'react-router'
import { Logo } from '../ui/Logo'

export function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" className="site-header__brand" aria-label="Pamilu, ir al inicio">
          <Logo />
        </Link>
        <nav aria-label="Principal">
          <ul className="site-nav">
            <li>
              <NavLink to="/" end className="site-nav__link">
                Inicio
              </NavLink>
            </li>
            <li>
              <NavLink to="/catalogo" className="site-nav__link">
                Catálogo
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
