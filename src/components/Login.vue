<template>
  <!-- Contenedor principal con imagen de fondo -->
  <div
    style="background: linear-gradient(45deg, #ffff, #919290); background-size: cover; background-repeat: no-repeat; background-position: center; height: 100vh; display: flex; justify-content: center; align-items: center;">

    <!-- Tarjeta flotante en el centro -->
    <v-card style="display: flex; max-width: 900px; width: 80%; border-radius: 10px;">

      <!-- Lado izquierdo: Imagen -->
      <div style="flex: 1;">
        <v-img width="100%" height="100%" object-fit="cover" src="../assets/log1.jpg" />
      </div>

      <!-- Lado derecho: Formulario de inicio de sesión -->
      <div style="flex: 1;">
        <div class="text-subtitle-1 text-medium-emphasis">Hola !</div>
        <div style="color: #DF4CF2; padding-bottom: 30px;">Bienvenido</div>
        <div style=" padding-bottom: 50px; padding-left: 35%;" class="text-subtitle-1 text-medium-emphasis">Iniciar Sesión
        </div>
        <v-text-field v-model="username" density="compact" placeholder="Usuario" prepend-inner-icon="mdi-account"
          variant="outlined"></v-text-field>
        <v-text-field v-model="password" :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'" density="compact" placeholder="Contraseña" prepend-inner-icon="mdi-lock"
          variant="outlined" @click:append-inner="visible = !visible"></v-text-field>
        <v-btn block class="mb-8" color="#ffff" size="large" variant="tonal" @click="login"
          style="background: linear-gradient(45deg, #6949EA, #DF4CF2);">Entrar</v-btn>
      </div>
    </v-card>
  </div>
</template>

<script>
import db from '../firebase/init.js'
import { collection, query, where, getDocs } from 'firebase/firestore'

export default {
  name: 'Login_1',
  data: () => ({
    visible: false,
    username: '',
    password: ''
  }),

  methods: {
    async buscarUsuarioDesdeFirebase(usuario, clave) {
      const q = query(
        collection(db, "Usuario"),
        where("usuario", "==", usuario),
        where("clave", "==", clave)
      );
      const resul = await getDocs(q);
      console.log(resul.docs[0]);
      if (!resul.empty) {
        // Almacena el ID del usuario en localStorage
        localStorage.setItem('userId', resul.docs[0]);
        // Si hay algún resultado, entonces el usuario y la clave son correctos
        return resul.docs[0].data();
      }
      // Si no hay resultados, entonces no hay coincidencia
      return null;
    },

    async login() {
      const user = await this.buscarUsuarioDesdeFirebase(this.username, this.password);

      if (user) {
        alert('Inicio de sesión exitoso');
        // Almacena al usuario en el store
        this.$store.dispatch('setUser', user);
        this.$store.commit('setUserAuthenticated', true);  // Para marcar al usuario como autenticado
        this.$router.push('/home');// Redirección
      } else {
        alert('Credenciales incorrectas');
        /* this.$store.commit('setUserAuthenticated', false); */ // Para marcar al usuario como no autenticado
      }
    }
  },

}
</script>