<template>
  <div v-if="isAdmin">
  <v-data-table :headers="headers" :items="desserts" :sort-by="[{ key: 'calories', order: 'asc' }]" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat style=" border: none; padding: 18px;">
        <v-container>
          <v-toolbar-title style="font-size: 24px; font-weight: bold; letter-spacing: 2px;">Usuarios</v-toolbar-title>
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
                    <v-text-field v-model="editedItem.rol" label="Role"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.usuario" label="Usuario"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.clave" label="Clave"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.nombre" label="Nombre"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.apellido" label="Apellido"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.email" label="Email"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.direccion" label="Direccion"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.departamento" label="Departamento"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.pais" label="Pais"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="close">
                Cancel
              </v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="save">
                Save
              </v-btn>
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
      <v-icon size="small" @click="deleteItem(item.raw)">
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
    </template>
  </v-data-table>
</div>
</template>

<script>
import { mapState } from 'vuex';
import db from '../firebase/init.js'
import { collection, getDocs, query, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore'

export default {

  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        align: 'start',
        sortable: false,
        key: 'name',
      },
      { title: 'Id', key: 'id' },
      { title: 'Role', key: 'rol' },
      { title: 'Usuario', key: 'usuario' },
      { title: 'Clave', key: 'clave' },
      { title: 'Nombre', key: 'nombre' },
      { title: 'Apellido', key: 'apellido' },
      { title: 'Email', key: 'email' },
      { title: 'Direccion', key: 'direccion' },
      { title: 'Departamento', key: 'departamento' },
      { title: 'Pais', key: 'pais' },
      { title: 'Actions', key: 'actions', sortable: false },
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      keyid: '',
      id: '',
      rol: '',
      usuario: '',
      clave: '',
      nombre: '',
      apellido: '',
      email: '',
      direccion: '',
      departamento: '',
      pais: '',
    },
    defaultItem: {
      id: '',
      rol: '',
      usuario: '',
      clave: '',
      nombre: '',
      apellido: '',
      email: '',
      direccion: '',
      departamento: '',
      pais: '',
    },
  }),

  computed: {
    ...mapState(['userData']),
    isAdmin() {
      return this.userData && this.userData.rol === 'admin';
    },
  
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
    this.listarUsuario()
  },

  methods: {
    async listarUsuario() {
      const q = query(collection(db, "Usuario"));
      const resul = await getDocs(q);
      resul.forEach((doc) => {
        console.log("id", doc.id);
        this.desserts.push({
          keyid: doc.id,
          id: doc.data().id,
          usuario: doc.data().usuario,
          clave: doc.data().clave,
          rol: doc.data().rol,
          nombre: doc.data().nombre,
          apellido: doc.data().apellido,
          email: doc.data().email,
          direccion: doc.data().direccion,
          departamento: doc.data().departamento,
          pais: doc.data().pais,
        })
      })
    },

    async EliminarUsuarios() {
      console.log("hola", this.editedItem.keyid)
      const Ref = doc(db, "Usuario", this.editedItem.keyid);
      await deleteDoc(Ref, {
        id: this.editedItem.id,
        usuario: this.editedItem.usuario,
        clave: this.editedItem.clave,
        rol: this.editedItem.rol,
        nombre: this.editedItem.nombre,
        apellido: this.editedItem.apellido,
        email: this.editedItem.email,
        direccion: this.editedItem.direccion,
        departamento: this.editedItem.departamento,
        pais: this.editedItem.pais,
      })
        .then(console.log("Eliminado con exito"))
        .catch(function (error) {
          console.log(error)
        })
    },

    async ActualizarUsuarios() {
      console.log("hola", this.editedItem.keyid)
      const Ref = doc(db, "Usuario", this.editedItem.keyid);
      await updateDoc(Ref, {
        id: this.editedItem.id,
        usuario: this.editedItem.usuario,
        clave: this.editedItem.clave,
        rol: this.editedItem.rol,
        nombre: this.editedItem.nombre,
        apellido: this.editedItem.apellido,
        email: this.editedItem.email,
        direccion: this.editedItem.direccion,
        departamento: this.editedItem.departamento,
        pais: this.editedItem.pais,
      })
        .then(console.log("Termino update usuario"))
        .catch(function (error) {
          console.log(error)

        });

    },

    async createUser() {
      const colRef = collection(db, 'Usuario');
      const dataObj = {
        id: this.editedItem.id,
        usuario: this.editedItem.usuario,
        clave: this.editedItem.clave,
        rol: this.editedItem.rol,
        nombre: this.editedItem.nombre,
        apellido: this.editedItem.apellido,
        email: this.editedItem.email,
        direccion: this.editedItem.direccion,
        departamento: this.editedItem.departamento,
        pais: this.editedItem.pais,
      }
      const docRef = await addDoc(colRef, dataObj)
      console.log('Document was created with: ID:', docRef.id)
    },

    initialize() {
      this.desserts = [
        {
          id: '',
          rol: '',
          usuario: '',
          clave: '',
          nombre: '',
          apellido: '',
          email: '',
          direccion: '',
          departamento: '',
          pais: '',
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