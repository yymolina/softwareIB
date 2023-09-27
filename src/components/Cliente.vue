<template>
  <v-data-table :headers="headers" :items="desserts" :sort-by="[{ key: 'calories', order: 'asc' }]" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat style=" border: none; padding: 18px;">
        <v-container>
          <v-toolbar-title style="font-size: 24px; font-weight: bold; letter-spacing: 2px;">Clientes</v-toolbar-title>
        </v-container>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ props }">
            <v-btn dark class="mb-2" v-bind="props"
              style="border-radius: 5px; border-width: 1px; color: #ffff ;background: linear-gradient(45deg, #6949EA, #DF4CF2);">+ Crear nuevo </v-btn>
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
                    <v-text-field v-model="editedItem.nombre" label="Nombre"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.telefono" label="Telefono"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.direccion" label="Direccion"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="close">Cancel</v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
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
      <v-icon size="small" @click="deleteItem(item.raw)">
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
    </template>
  </v-data-table>
</template>
  
<script>
import db from '../firebase/init.js'
import { collection, getDocs, query, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore'

export default {
  name: 'Clientes_1',
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        align: 'start',
        sortable: false,
        key: 'name',
      },
      { title: 'id', key: 'id' },
      { title: 'Nombre', key: 'nombre' },
      { title: 'Telefono', key: 'telefono' },
      { title: 'Direccion', key: 'direccion' },
      { title: 'Actions', key: 'actions', sortable: false },
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      keyid: '',
      id: '',
      nombre: '',
      telefono: '',
      direccion: '',
    },
    defaultItem: {
      id: '',
      nombre: '',
      telefono: '',
      direccion: '',
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Nuevo Cliente' : 'Edit Item'
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
    this.listarNombre()
  },

  methods: {
    async listarNombre() {
      const q = query(collection(db, "Nombre"));
      const resul = await getDocs(q);
      resul.forEach((doc) => {
        console.log("id", doc.id);
        this.desserts.push({
          keyid: doc.id,
          id: doc.data().id,
          nombre: doc.data().nombre,
          telefono: doc.data().telefono,
          direccion: doc.data().direccion,

        })
      })
    },

    async EliminarUsuarios() {
      console.log(this.editedItem.keyid)
      const Ref = doc(db, "Nombre", this.editedItem.keyid);
      await deleteDoc(Ref, {
        nombre: this.editedItem.nombre,
        telefono: this.editedItem.telefono,
        direccion: this.editedItem.direccion,
      })
        .then(console.log("Eliminado con exito"))
        .catch(function (error) {
          console.log(error)
        })
    },

    async ActualizarUsuarios() {
      console.log("hola", this.editedItem.keyid)
      const Ref = doc(db, "Nombre", this.editedItem.keyid);
      await updateDoc(Ref, {
        nombre: this.editedItem.nombre,
        telefono: this.editedItem.telefono,
        direccion: this.editedItem.direccion,
      })
        .then(console.log("Termino update usuario"))
        .catch(function (error) {
          console.log(error)

        });

    },

    async createUser() {
      const colRef = collection(db, 'Nombre');
      const dataObj = {
        id: this.editedItem.id,
        nombre: this.editedItem.nombre,
        telefono: this.editedItem.telefono,
        direccion: this.editedItem.direccion,
      }
      const docRef = await addDoc(colRef, dataObj)
      console.log('Document was created with: ID:', docRef.id)
    },

    initialize() {
      this.desserts = [
        {
          id: '',
          nombre: '',
          telefono: '',
          direccion: '',

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
      this.EliminarUsuarios()
    },

    deleteItemConfirm() {
      this.desserts.splice(this.editedIndex, 1)
      this.closeDelete()
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
        this.ActualizarUsuarios()

      } else {
        this.desserts.push(this.editedItem),
          this.createUser()

      }
      this.close()
    },
  },
}
</script>