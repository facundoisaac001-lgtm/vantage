import { AboutSection } from '../components/home/AboutSection'
import { CategoriesSection } from '../components/home/CategoriesSection'
import { ContactSection } from '../components/home/ContactSection'
import { FeaturedSection } from '../components/home/FeaturedSection'
import { Hero } from '../components/home/Hero'

export function HomePage() {
  return (
    <>
      <title>Pamilu · Ropa de feria, ahora online</title>
      <Hero />
      <AboutSection />
      <CategoriesSection />
      <FeaturedSection />
      <ContactSection />
    </>
  )
}
