<template>
  <!-- Contenedor principal con imagen de fondo -->
  <div style="position: relative; width=100%; height: auto;">

    <!-- Imagen de fondo -->
    <v-img width="100%" height="100%" object-fit="cover" style="background-size: cover; background-repeat: no-repeat; background-position: center;" src="../assets/fondop.png"></v-img>

    <!-- Tarjeta flotante en el centro -->
    <v-card style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); max-width: 450px; width: 80%; border-radius: 10px;">

      <!-- Lado derecho: Formulario de inicio de sesión -->
      <div style="flex: 1; padding: 50px;">
        <div style="background: linear-gradient(45deg, #6949EA, #DF4CF2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; justify-content: center; display: flex; font-size: 40px; margin-bottom: 20px; font-weight: 600;">Bienvenido I&B</div>
        <div style="justify-content: center; display: flex; color: #919290; font-size: 30px; margin-bottom: 20px; font-weight: 100; text-shadow: 1px 2px 1px #df4cf2;">Iniciar Sesión</div>
        <v-text-field v-model="username" density="compact" placeholder="Usuario" prepend-inner-icon="mdi-account" variant="outlined"></v-text-field>
        <v-text-field v-model="password" :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'" density="compact" placeholder="Contraseña" prepend-inner-icon="mdi-lock" variant="outlined" @click:append-inner="visible = !visible"></v-text-field>
        <v-btn block class="mb-8" color="#ffff" size="large" variant="tonal" @click="login" style="background: linear-gradient(45deg, #6949EA, #DF4CF2);">Entrar</v-btn>
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