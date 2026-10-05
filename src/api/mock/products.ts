/** Mirrors the `products` table in docs/schema.sql. */
export interface ProductRow {
  id: string
  name: string
  price: number
  categoryId: number
  description: string
  imageUrl: string
  imageAlt: string
  featured: boolean
  active: boolean
}

/** Mirrors the `product_sizes` table in docs/schema.sql. */
export interface ProductSizeRow {
  id: number
  productId: string
  size: string
  stock: number
}

export const productRows: ProductRow[] = [
  {
    id: 'remera-oversize',
    name: 'Remera Oversize',
    price: 12500,
    categoryId: 1,
    description:
      'Nuestra remera estrella: algodón peinado suave, calce amplio y hombros caídos. Combina con todo, del jean a la pollera.',
    imageUrl: '/images/products/remera-oversize.png',
    imageAlt: 'Remera oversize color crema extendida sobre fondo rosa claro',
    featured: true,
    active: true,
  },
  {
    id: 'remera-basica-rosa',
    name: 'Remera Básica Rosa',
    price: 9800,
    categoryId: 1,
    description: 'Remera al cuerpo en rosa pastel, de algodón con un toque de elastano. Ideal para usar sola o debajo de un buzo.',
    imageUrl: '/images/products/remera-basica-rosa.png',
    imageAlt: 'Remera básica rosa pastel colgada en una percha de madera',
    featured: false,
    active: true,
  },
  {
    id: 'remera-margaritas',
    name: 'Remera Margaritas',
    price: 13900,
    categoryId: 1,
    description: 'Remera blanca con margaritas bordadas a mano en el pecho. Cada bordado es único, ¡no hay dos iguales!',
    imageUrl: '/images/products/remera-flores.png',
    imageAlt: 'Remera blanca con pequeñas margaritas bordadas sobre fondo verde salvia',
    featured: true,
    active: true,
  },
  {
    id: 'buzo-hoodie-salvia',
    name: 'Hoodie Salvia',
    price: 28900,
    categoryId: 2,
    description: 'Buzo con capucha de frisa invisible, súper abrigado y con bolsillo canguro. Color verde salvia que enamora.',
    imageUrl: '/images/products/buzo-hoodie-salvia.png',
    imageAlt: 'Buzo con capucha verde salvia con bolsillo canguro sobre fondo crema',
    featured: true,
    active: true,
  },
  {
    id: 'buzo-crema',
    name: 'Buzo Cuello Redondo Crema',
    price: 24500,
    categoryId: 2,
    description: 'Buzo clásico de cuello redondo en tono crema. Abrigado, liviano y perfecto para el día a día.',
    imageUrl: '/images/products/buzo-crema.png',
    imageAlt: 'Buzo de cuello redondo color crema doblado sobre fondo rosa',
    featured: false,
    active: true,
  },
  {
    id: 'buzo-cropped-rosa',
    name: 'Buzo Cropped Rosa',
    price: 22900,
    categoryId: 2,
    description: 'Buzo corto en rosa pastel con puños elastizados. Se agotó en la última feria, ¡pronto vuelve!',
    imageUrl: '/images/products/buzo-cropped-rosa.png',
    imageAlt: 'Buzo cropped rosa pastel colgado frente a una pared crema',
    featured: false,
    active: true,
  },
  {
    id: 'jean-mom',
    name: 'Jean Mom',
    price: 32500,
    categoryId: 3,
    description: 'Jean tiro alto de calce mom en lavado claro. Rígido como los de antes, cómodo como los de ahora.',
    imageUrl: '/images/products/jean-mom.png',
    imageAlt: 'Jean mom tiro alto en lavado celeste claro extendido sobre fondo crema',
    featured: true,
    active: true,
  },
  {
    id: 'pantalon-cargo-beige',
    name: 'Pantalón Cargo Beige',
    price: 29900,
    categoryId: 3,
    description: 'Pantalón cargo de gabardina con bolsillos laterales y pierna ancha. Ajuste con cordón en la cintura.',
    imageUrl: '/images/products/pantalon-cargo.png',
    imageAlt: 'Pantalón cargo beige de pierna ancha con bolsillos laterales sobre fondo rosa',
    featured: false,
    active: true,
  },
  {
    id: 'jogger-gris',
    name: 'Jogger Gris Melange',
    price: 21500,
    categoryId: 3,
    description: 'Jogger de algodón rústico con puño en el tobillo. Para estar en casa o salir con zapatillas.',
    imageUrl: '/images/products/jogger-gris.png',
    imageAlt: 'Pantalón jogger gris melange doblado sobre fondo verde salvia',
    featured: false,
    active: true,
  },
  {
    id: 'tote-bag-pamilu',
    name: 'Tote Bag Pamilu',
    price: 8900,
    categoryId: 4,
    description: 'Bolsa de lienzo crudo con un corazoncito rosa bordado. Entra todo: la compu, el mate y la campera.',
    imageUrl: '/images/products/tote-bag.png',
    imageAlt: 'Bolsa tote de lienzo crudo con corazón rosa bordado colgada en una pared rosa',
    featured: true,
    active: true,
  },
  {
    id: 'piluso-corderoy',
    name: 'Piluso de Corderoy',
    price: 11500,
    categoryId: 4,
    description: 'Gorro piluso de corderoy verde salvia, forrado por dentro. Protege del sol con mucho estilo.',
    imageUrl: '/images/products/gorro-pescador.png',
    imageAlt: 'Gorro piluso de corderoy verde salvia sobre fondo crema',
    featured: false,
    active: true,
  },
  {
    id: 'scrunchies-pack',
    name: 'Pack de Scrunchies x3',
    price: 5500,
    categoryId: 4,
    description: 'Tres colitas de satén en rosa, crema y salvia. No marcan el pelo y quedan divinas en la muñeca.',
    imageUrl: '/images/products/scrunchies.png',
    imageAlt: 'Tres colitas para el pelo de satén en rosa, crema y verde salvia',
    featured: false,
    active: true,
  },
]

export const productSizeRows: ProductSizeRow[] = [
  { id: 1, productId: 'remera-oversize', size: 'S', stock: 3 },
  { id: 2, productId: 'remera-oversize', size: 'M', stock: 0 },
  { id: 3, productId: 'remera-oversize', size: 'L', stock: 5 },
  { id: 4, productId: 'remera-oversize', size: 'XL', stock: 2 },

  { id: 5, productId: 'remera-basica-rosa', size: 'S', stock: 4 },
  { id: 6, productId: 'remera-basica-rosa', size: 'M', stock: 6 },
  { id: 7, productId: 'remera-basica-rosa', size: 'L', stock: 0 },

  { id: 8, productId: 'remera-margaritas', size: 'S', stock: 1 },
  { id: 9, productId: 'remera-margaritas', size: 'M', stock: 2 },
  { id: 10, productId: 'remera-margaritas', size: 'L', stock: 1 },

  { id: 11, productId: 'buzo-hoodie-salvia', size: 'S', stock: 0 },
  { id: 12, productId: 'buzo-hoodie-salvia', size: 'M', stock: 4 },
  { id: 13, productId: 'buzo-hoodie-salvia', size: 'L', stock: 3 },
  { id: 14, productId: 'buzo-hoodie-salvia', size: 'XL', stock: 1 },

  { id: 15, productId: 'buzo-crema', size: 'M', stock: 2 },
  { id: 16, productId: 'buzo-crema', size: 'L', stock: 2 },

  { id: 17, productId: 'buzo-cropped-rosa', size: 'S', stock: 0 },
  { id: 18, productId: 'buzo-cropped-rosa', size: 'M', stock: 0 },
  { id: 19, productId: 'buzo-cropped-rosa', size: 'L', stock: 0 },

  { id: 20, productId: 'jean-mom', size: '36', stock: 2 },
  { id: 21, productId: 'jean-mom', size: '38', stock: 3 },
  { id: 22, productId: 'jean-mom', size: '40', stock: 0 },
  { id: 23, productId: 'jean-mom', size: '42', stock: 1 },

  { id: 24, productId: 'pantalon-cargo-beige', size: 'S', stock: 2 },
  { id: 25, productId: 'pantalon-cargo-beige', size: 'M', stock: 3 },
  { id: 26, productId: 'pantalon-cargo-beige', size: 'L', stock: 2 },

  { id: 27, productId: 'jogger-gris', size: 'S', stock: 5 },
  { id: 28, productId: 'jogger-gris', size: 'M', stock: 0 },
  { id: 29, productId: 'jogger-gris', size: 'L', stock: 4 },

  { id: 30, productId: 'tote-bag-pamilu', size: 'Único', stock: 10 },
  { id: 31, productId: 'piluso-corderoy', size: 'Único', stock: 4 },
  { id: 32, productId: 'scrunchies-pack', size: 'Único', stock: 15 },
]
