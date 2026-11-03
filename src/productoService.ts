export async function obtenerProductos() {
  const respuesta = await fetch('http://localhost:8080/api/productos');
  return await respuesta.json();
}
