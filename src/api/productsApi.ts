import { config } from '../config'
import type { Category, Product, ProductsApi } from '../types/api'
import { httpClient } from './client'
import { mockProductsApi } from './mock/mockHandlers'

// Función auxiliar para normalizar un producto individual del backend
function normalizeProduct(p: any): Product {
  const precioVal = Number(p.precio ?? p.price ?? 1500);
  const nombreVal = p.nombre || p.name || "Prenda Pamilu";
  const catNombre = p.categoria?.nombre || p.category?.name || p.category || "Indumentaria";

  return {
    ...p,
    id: p.id ?? Math.random(),
    name: nombreVal,
    nombre: nombreVal,
    price: isNaN(precioVal) ? 1500 : precioVal,
    precio: isNaN(precioVal) ? 1500 : precioVal,
    category: { id: p.category?.id || p.categoria?.id || 1, name: catNombre, slug: catNombre.toLowerCase() },
    categoria: { id: p.categoria?.id || p.category?.id || 1, nombre: catNombre, slug: catNombre.toLowerCase() },
    available: p.available ?? p.disponible ?? true,
    imageUrl: p.imageUrl || p.imagenUrl || p.imagen || "https://via.placeholder.com/400",
    sizes: p.sizes || p.talles || [{ size: 'Único', stock: 10 }]
  };
}

const httpProductsApi: ProductsApi = {
  getCategories: () => httpClient.get<Category[]>('/categories'),
  
  getProducts: async (filters = {}) => {
    const json = await httpClient.get<any>('/products', {
      category: filters.category,
      q: filters.q,
      featured: filters.featured ? true : undefined,
    });
    
    // Maneja tanto si responde un array directo como un objeto paginado (.content)
    const lista = Array.isArray(json) ? json : (json.content || []);
    return lista.map(normalizeProduct);
  },

  getProductById: async (id) => {
    const p = await httpClient.get<any>(`/products/${encodeURIComponent(id)}`);
    return normalizeProduct(p);
  },
}

export const productsApi: ProductsApi = config.useMock ? mockProductsApi : httpProductsApi