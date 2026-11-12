export async function obtenerProductos() {
  try {
    const respuesta = await fetch('http://localhost:8080/api/products');
    const json = await respuesta.json();
    
    const lista = Array.isArray(json) ? json : (json.content || []);
    console.log("DATOS REALES DEL BACKEND:", lista);

    return lista.map((p: any) => {
      // Extraemos el precio de cualquier propiedad posible y nos aseguramos de que sea número
      const rawPrice = p.precio ?? p.price ?? p.valor ?? 1500;
      const numericPrice = Number(rawPrice);
      const finalPrice = isNaN(numericPrice) ? 1500 : numericPrice;

      // Extraemos el nombre y la categoría de forma segura
      const finalName = p.nombre || p.name || "Prenda Pamilu";
      const finalCat = p.categoria?.nombre || p.category?.name || p.category || "Indumentaria";

      return {
        ...p,
        id: p.id ?? Math.random(),
        name: finalName,
        nombre: finalName,
        price: finalPrice,
        precio: finalPrice,
        category: { name: finalCat },
        categoria: { nombre: finalCat },
        available: p.available ?? p.disponible ?? true,
        imageUrl: p.imageUrl || p.imagenUrl || p.imagen || "https://via.placeholder.com/400",
        sizes: p.sizes || p.talles || [{ size: 'Único', stock: 10 }]
      };
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return [];
  }
}