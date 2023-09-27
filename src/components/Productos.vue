<template>
  <v-data-table :headers="headers" :items="desserts" :sort-by="[{ key: 'calories', order: 'asc' }]" class="elevation-1 ">
    <template v-slot:top>
      <v-toolbar flat style=" border: none; padding: 18px;">
        <v-container>
          <v-toolbar-title style="font-size: 24px; font-weight: bold; letter-spacing: 2px;">Productos</v-toolbar-title>
        </v-container>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ props }">
            <v-btn dark class="mb-2" v-bind="props"
              style="border-radius: 5px; border-width: 1px; color: #ffff ;background: linear-gradient(45deg, #6949EA, #DF4CF2);">+ Crear nuevo </v-btn>
            <CarritoVenta />

          </template>

          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.id" label="id"></v-text-field>

                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.producto" label="Producto"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.stock" type="number" @input="handleStockInput" label="Stock"
                      min="0"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.preciocosto" type="number" label="Precio Costo"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.precioventa" type="number" label="Precio Venta"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.fecharegistro" label="Fecha de Registro"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.descripcion" label="Descripcion"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="close">Cancelar</v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="save">Guardar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Estas seguro de liminar este producto?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>

    <template v-slot:[`item.actions`]="{ item }">
      <v-icon size="small" class="me-2" @click="editItem(item.raw)">
        mdi-pencil
      </v-icon>
      <!--  -->
      <v-icon size="small" class="me-2" @click="deleteItem(item.raw)">
        mdi-delete
      </v-icon>

      <v-icon size="small" class="me-2" @click="agregarProducto(item.raw)">
        mdi-plus
      </v-icon>

    </template>
    <template v-slot:no-data>
    </template>

  </v-data-table>
</template>

<script>
import { useVentasStore } from "../stores/storer"
import CarritoVenta from './CarritoVenta'
import db from '../firebase/init.js'
import { collection, getDocs, query, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore'

export default {
  name: 'Productos_1',
  components: { CarritoVenta },
  data: () => ({
    dialog: false,
    dialogDelete: false,
    mostrarVentas: false,
    headers: [
      {
        align: 'start',
        sortable: false,
        key: 'name',
      },
      { title: 'id', key: 'id' },
      { title: 'Producto', key: 'producto' },
      { title: 'Stock', key: 'stock', },
      { title: 'Precio Costo', key: 'preciocosto' },
      { title: 'Precio Venta', key: 'precioventa' },
      { title: 'Fecha Registro', key: 'fecharegistro' },
      { title: 'Descripcion', key: 'descripcion' },
      { title: 'Actions', key: 'actions', sortable: false },
    ],
    ventas: [],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      id: ' ',
      producto: ' ',
      stock: 0,
      preciocosto: ' ',
      precioventa: ' ',
      fecharegistro: ' ',
      descripcion: ' ',
    },
    defaultItem: {
      id: ' ',
      producto: ' ',
      stock: 0,
      preciocosto: ' ',
      precioventa: ' ',
      fecharegistro: ' ',
      descripcion: ' ',
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
  },

  created() {
    this.listarProducto();
    const ventasStore = useVentasStore();
    this.desserts = ventasStore.desserts;
  },

  methods: {
    agregarProducto(producto) {
      // Abrir un diálogo para seleccionar el producto existente
      // Una vez que el usuario seleccione el producto existente, agregar el producto a la tabla

      const confirmacion = confirm("¿Desea agregar el producto existente al Carrito ?");
      if (confirmacion) {
        const nuevoProducto = {
          keyid: producto.id,
          id: producto.id,
          producto: producto.producto,
          stock: producto.stock,
          preciocosto: producto.preciocosto,
          precioventa: producto.precioventa,
          fecharegistro: producto.fecharegistro,
          descripcion: producto.descripcion,
        };
        this.ventas.push(nuevoProducto);
        useVentasStore().agregarProducto(nuevoProducto);
        console.log("xd")

        this.close();
      }
    },

    toggleMostrarVentas() {
      this.mostrarVentas = !this.mostrarVentas;
    },
    /* Parsear la Stock */
    handleStockInput() {
      this.editedItem.stock = parseFloat(this.editedItem.stock);
    },

    async listarProducto() {
      const q = query(collection(db, "Producto"));
      const resul = await getDocs(q);
      resul.forEach((doc) => {
        console.log("id", doc.id);
        this.desserts.push({
          keyid: doc.id,
          id: doc.data().id,
          producto: doc.data().producto,
          stock: doc.data().stock,
          preciocosto: doc.data().preciocosto,
          precioventa: doc.data().precioventa,
          fecharegistro: doc.data().fecharegistro,
          descripcion: doc.data().descripcion,
        })
      })
    },

    async EliminarProductos() {
      console.log(this.editedItem.keyid)
      const Ref = doc(db, "Producto", this.editedItem.keyid);
      await deleteDoc(Ref, {
        producto: this.editedItem.producto,
        stock: this.editedItem.stock,
        preciocosto: this.editedItem.preciocosto,
        precioventa: this.editedItem.precioventa,
        fecharegistro: this.editedItem.fecharegistro,
        descripcion: this.editedItem.descripcion,
      })
        .then(console.log("Eliminado con exito"))
        .catch(function (error) {
          console.log(error)
        })
    },
    async ActualizarProductos() {
      const Ref = doc(db, "Producto", this.editedItem.keyid);
      const updatedData = {
        producto: this.editedItem.producto,
        stock: this.editedItem.stock,
        preciocosto: this.editedItem.preciocosto,
        precioventa: this.editedItem.precioventa,
        fecharegistro: this.editedItem.fecharegistro,
        descripcion: this.editedItem.descripcion,
      };

      try {
        await updateDoc(Ref, updatedData);
        console.log("Producto actualizado con éxito");
      } catch (error) {
        console.error("Error al actualizar el producto:", error);
      }
    },

    async createUser() {
      const colRef = collection(db, 'Producto');
      const dataObj = {
        id: this.editedItem.id,
        producto: this.editedItem.producto,
        stock: this.editedItem.stock,
        preciocosto: this.editedItem.preciocosto,
        precioventa: this.editedItem.precioventa,
        fecharegistro: this.editedItem.fecharegistro,
        descripcion: this.editedItem.descripcion,
      }
      const docRef = await addDoc(colRef, dataObj)
      console.log('El documento ha sido Creado con el siguiente: ID:', docRef.id)
      this.clear()
      this.listarProducto()
    },

    initialize() {
      this.desserts = [
        {
          id: '',
          producto: '',
          stock: 0,
          preciocosto: '',
          precioventa: '',
          fecharegistro: '',
          descripcion: '',
        },

      ]
    },

    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {

      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.desserts.splice(this.editedIndex, 1)
      this.closeDelete()
      this.EliminarProductos()
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem)
        this.ActualizarProductos()
      } else {
        this.desserts.push(this.editedItem),
          this.createUser()
      }
      this.close()
    },
    clear() {
      this.desserts = []
    },
  },

}
</script>