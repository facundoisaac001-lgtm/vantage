import { Heart, Store, Truck } from 'lucide-react'

const HIGHLIGHTS = [
  { icon: Store, title: 'Nacimos en la feria', text: 'Todos los fines de semana armamos nuestro puesto con prendas nuevas.' },
  { icon: Heart, title: 'Elegidas una por una', text: 'Buscamos telas suaves, calces cómodos y colores que den ganas de usar.' },
  { icon: Truck, title: 'Te lo acercamos', text: 'Hacé tu pedido online y coordinamos la entrega o el retiro con vos.' },
]

export function AboutSection() {
  return (
    <section className="section about" aria-labelledby="about-title">
      <div className="container about__inner">
        <div className="about__media">
          <img
            src="/images/feria.png"
            alt="Puesto de Pamilu en una feria al aire libre con prendas rosas, crema y verdes en un perchero"
            width={720}
            height={720}
            loading="lazy"
          />
        </div>
        <div className="about__content">
          <p className="eyebrow">Quiénes somos</p>
          <h2 id="about-title" className="section__title">
            Conocé Pamilu
          </h2>
          <p className="section__lead">
            Somos un emprendimiento chiquito que vende remeras, buzos, pantalones y accesorios en ferias. Ahora también
            estamos online para que puedas comprar aunque no llegues al puesto.
          </p>
          <ul className="about__list">
            {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
              <li key={title} className="about__item">
                <span className="about__icon" aria-hidden="true">
                  <Icon size={20} />
                </span>
                <div>
                  <h3 className="about__item-title">{title}</h3>
                  <p>{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
