import { AtSign, Mail, MapPin, MessageCircle } from 'lucide-react'
import { brand } from '../../config'
import { buildGeneralWhatsAppUrl } from '../../services/whatsapp'

export function ContactSection() {
  const channels = [
    { icon: MessageCircle, label: 'WhatsApp', value: 'Escribinos', href: buildGeneralWhatsAppUrl(), external: true },
    { icon: AtSign, label: 'Instagram', value: `@${brand.instagramHandle}`, href: brand.instagramUrl, external: true },
    { icon: Mail, label: 'Email', value: brand.email, href: `mailto:${brand.email}`, external: false },
  ]

  return (
    <section className="section contact" aria-labelledby="contact-title">
      <div className="container contact__inner">
        <div>
          <p className="eyebrow">Hablemos</p>
          <h2 id="contact-title" className="section__title">
            ¿Tenés dudas con un talle?
          </h2>
          <p className="section__lead">Escribinos por donde te quede más cómodo y te respondemos lo antes posible.</p>
          <p className="contact__location">
            <MapPin size={18} aria-hidden="true" />
            {brand.location}
          </p>
        </div>
        <ul className="contact__list">
          {channels.map(({ icon: Icon, label, value, href, external }) => (
            <li key={label}>
              <a
                className="contact-card"
                href={href}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                <span className="contact-card__icon" aria-hidden="true">
                  <Icon size={22} />
                </span>
                <span>
                  <span className="contact-card__label">{label}</span>
                  <span className="contact-card__value">{value}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
