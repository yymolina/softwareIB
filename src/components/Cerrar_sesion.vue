<template>
      <v-img
        class="mx-auto my-6"
        max-width="228"
        src=""
      ></v-img>
  
      <v-btn color="red" @click="cerrarSesion">Cerrar Sesión</v-btn>

  </template>


<script>
  export default {
    name: 'Login_1',
    data: () => ({
      visible: false,
    }),

    methods: {
    cerrarSesion() {
      // Limpia las credenciales de usuario (aquí suponemos que están en un store de vuex, pero puedes adaptarlo según tu necesidad)
      this.$store.dispatch('logout');  // Esta acción llama a la mutación LOGOUT

      // Redirecciona al usuario al componente de inicio de sesión
      this.$router.push('/login');
    }
  }
  }
</script>
