//store Jose Pinia
// En tu archivo store.js o ventas.js
import { defineStore } from 'pinia';


export const useVentasStore = defineStore({
    id: 'ventas',
    state: () => ({
        productosVentas: [], // Arreglo para almacenar los productos en el apartado de ventas
        desserts: [], // Agregar desserts al store de ventas
    }),
    actions: {

        agregarProducto(producto) {
            this.productosVentas.push(producto);
        },
        limpiarProductos() {
            this.productosVentas = [];
        },
        // Puedes agregar más acciones según tus necesidades, como eliminar producto, limpiar ventas, etc.
    },
});