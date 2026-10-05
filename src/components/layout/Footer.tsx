import { AtSign, Mail, MessageCircle } from 'lucide-react'
import { Link } from 'react-router'
import { brand } from '../../config'
import { buildGeneralWhatsAppUrl } from '../../services/whatsapp'
import { Logo } from '../ui/Logo'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__brand">
          <Logo />
          <p>Ropa linda, cómoda y con onda. De la feria a tu casa.</p>
        </div>

        <nav aria-label="Redes y contacto">
          <ul className="site-footer__links">
            <li>
              <a href={brand.instagramUrl} target="_blank" rel="noopener noreferrer">
                <AtSign aria-hidden="true" size={18} />
                Instagram @{brand.instagramHandle}
              </a>
            </li>
            <li>
              <a href={buildGeneralWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
                <MessageCircle aria-hidden="true" size={18} />
                WhatsApp
              </a>
            </li>
            <li>
              <a href={`mailto:${brand.email}`}>
                <Mail aria-hidden="true" size={18} />
                {brand.email}
              </a>
            </li>
          </ul>
        </nav>

        <div className="site-footer__bottom">
          <p>
            © {new Date().getFullYear()} {brand.name}. Hecho con amor en cada feria.
          </p>
          <Link to="/catalogo">Ver catálogo</Link>
        </div>
      </div>
    </footer>
  )
}
