export interface Producto {
  id: number;
  nombre: string;
  precio: string; // Coincide con el ToStringSerializer del DTO de Java
  stock: number;
}
