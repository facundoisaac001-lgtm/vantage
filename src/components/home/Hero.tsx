import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router'

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero__inner">
        <div className="hero__content">
          <p className="eyebrow">
            <Sparkles size={16} aria-hidden="true" />
            Nueva temporada en la feria
          </p>
          <h1 id="hero-title" className="hero__title">
            <span className="hero__brand">Pamilu</span>
            <span className="hero__tagline">Ropa linda para tus días lindos</span>
          </h1>
          <p className="hero__text">
            Prendas cómodas, tiernas y con mucha onda que traemos a cada feria. ¿No llegás a pasar? Elegí tu talle y
            hacé tu pedido desde acá.
          </p>
          <div className="hero__actions">
            <Link to="/catalogo" className="btn btn--primary btn--lg">
              Ver prendas
              <ArrowRight size={20} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="hero__media">
          <img
            src="/images/hero.png"
            alt="Chica sonriendo con remera crema, cárdigan verde salvia y una tote bag rosa de Pamilu"
            width={720}
            height={900}
            fetchPriority="high"
          />
          <span className="hero__sticker" aria-hidden="true">
            hecho
            <br />
            con amor
          </span>
        </div>
      </div>
    </section>
  )
}
