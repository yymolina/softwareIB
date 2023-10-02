<template>
  <div>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent width="auto">
        <template v-slot:activator="{ props }">
          <v-btn style="margin-left: 40px;margin-top: -10px;margin-right: 500px;position: fixed;" color="primary"
            v-bind="props">
            Venta
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="text-h5">
            Venta
          </v-card-title>
          <v-card-text>
            <v-alert v-if="stockInsuficiente" type="error" dense outlined>
              No hay suficiente stock disponible para uno o más productos.
            </v-alert>
            <v-table class="table">
              <thead>
                <tr>
                  <th>id</th>
                  <th>Nombre</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>

                <tr v-for="(producto, index) in productosVentas" :key="index">

                  <td>{{ producto.keyid }}</td>
                  <td>{{ producto.producto }}</td>
                  <td>
                    <input type="number" v-model="producto.cantidadVendida" @input="updateSubtotal(producto)" min="0" />
                  </td>
                  <td>{{ producto.precioventa }}</td>
                  <td>{{ producto.cantidadVendida * producto.precioventa }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green-darken-1" variant="text" @click="dialog = false">
              Cancelar Venta
            </v-btn>
            <v-btn color="green-darken-1" variant="text" @click="realizarVenta()">
              Realizar Venta
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>
<script>
import { useVentasStore } from "../stores/storer"
import db from '../firebase/init.js'
import { doc, updateDoc } from 'firebase/firestore'


export default {
  name: "Carrito_Ventas_1",
  data: () => ({
    dialog: false,
    stockInsuficiente: false,
  }),
  computed: {
    // Obtiene los productos de ventas desde el store
    productosVentas() {
      return useVentasStore().productosVentas;
    },
  },
  created() {
    const ventasStore = useVentasStore();
    this.desserts = ventasStore.desserts;
  },
  methods: {


    async realizarVenta() {
      for (const producto of this.productosVentas) {
        // Encuentra el producto correspondiente en la lista de productos
        const productoEnLista = this.desserts.find(item => item.id === producto.keyid);
        console.log("HOLAS", productoEnLista)
        if (productoEnLista) {
          // Verifica si la cantidad vendida es mayor que el stock disponible
          if (producto.cantidadVendida > productoEnLista.stock) {
            this.stockInsuficiente = true;
            return; // Detener la venta
          } else {
            // Actualiza el stock del producto restando la cantidad vendida
            productoEnLista.stock -= producto.cantidadVendida;
            const Ref = doc(db, "Producto", producto.keyid)
            console.log("KLSDLSJAK")
            try {
              await updateDoc(Ref, {
                stock: productoEnLista.stock
              });
              console.log("Producto actualizado con éxito");
            } catch (error) {
              console.error("Error al actualizar el producto:", error);
            }
          }
        }
      }
      console.log("Venta Realizada");
      useVentasStore().limpiarProductos();
    },
    updateSubtotal(producto) {
      producto.subtotal = producto.stock * producto.precioventa;
    },
  },
}
</script>
