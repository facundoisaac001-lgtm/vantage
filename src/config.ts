const env = import.meta.env

export const config = {
  /** Mock is the default so the app works out of the box without a backend. */
  useMock: env.VITE_USE_MOCK !== 'false',
  apiBaseUrl: (env.VITE_API_BASE_URL ?? 'http://localhost:8080/api').replace(/\/+$/, ''),
  whatsappNumber: (env.VITE_WHATSAPP_NUMBER ?? '5491100000000').replace(/\D/g, ''),
} as const

export const brand = {
  name: 'Pamilu',
  instagramHandle: 'pamilu.ropa',
  instagramUrl: 'https://instagram.com/pamilu.ropa',
  email: 'hola@pamilu.com.ar',
  location: 'Ferias de Buenos Aires · sábados y domingos',
} as const
