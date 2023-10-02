<template>
  <v-layout>
    <v-app-bar color="#ffff" prominent>

      <router-link to="/home" style="display: block; margin-left: 20px;">
        <v-img class="hello" src="../src/assets/logoinicio.png" width="50px" height="50px" margin-left="10px"/>
      </router-link>

      <v-spacer></v-spacer>

      <v-btn variant="text" icon="mdi-magnify"></v-btn>

      <!-- Menu profile -->
      <div class="text-center" style="width: 120px;">
        <v-menu open-on-hover>
          <template v-slot:activator="{ props }">
            <v-btn color="#fff" v-bind="props" style="background: linear-gradient(45deg, #6949EA, #DF4CF2);"
              prepend-icon="mdi mdi-account"></v-btn>
          </template>

          <v-list>
            <v-list-subheader>REPORTS</v-list-subheader>
            <v-list-item v-for="(item, i) in filteredItems" :key="i" @click="handleAction(item.action)">
              <template v-slot:prepend>
                <v-icon>{{ item.icon }}</v-icon>
              </template>
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item>
          </v-list>

        </v-menu>
      </div>
    </v-app-bar>
  </v-layout>

  <v-app>

    <v-navigation-drawer v-if="isAuthenticated" color="#ffff" v-model="drawer" :rail="rail" permanent
      @click="rail = false">
      <v-list dense nav>

        <div @click.stop="rail = !rail" class="hello"
          style="margin-top: 28px; margin-bottom: 28px; width: 60%; margin-left: 18%;">
          <v-img src="../src/assets/logoIb.png" />
        </div>

        <v-divider></v-divider>

        <!--MENU-->
        <v-list-item prepend-icon="mdi mdi-home-account" title="Home" value="Home" router-link to="/home"
          style=""></v-list-item>

        <v-list-item prepend-icon="mdi mdi-account-group" title="Usuarios" value="Usuario" router-link to="/Usuario_C"
          style="" v-if="isAdmin"></v-list-item>

        <v-list-item prepend-icon="mdi-account-group-outline" title="Clientes" value="Cliente" router-link to="/Cliente"
          style=""></v-list-item>

        <!--SUB MENU-->
        <v-list-item-group>
          <v-list-item @click="toggleSubMenu('subMenu1')" prepend-icon="mdi mdi-tshirt-crew" value="Productos" router-link
            to="/Productos" style="margin-bottom: 1px;">
            <v-list-item-content>
              <v-list-item-title>Productos</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <!--<v-slide-y-transition>
            <v-list-item-group v-if="openSubMenus.includes('subMenu1')">
              <v-list-item prepend-icon="mdi mdi-shape-plus" style="margin-top: 0px; margin-left: 20px; font-size: 14px;"
                to="/Crear_categoria">
                <v-list-item-content>
                  <v-list-item-title>Categorias</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-slide-y-transition>-->
        </v-list-item-group>

        <!-- FINALIZA SUB MENU-->
        
      </v-list>
    </v-navigation-drawer>

    <v-main style="background-color: #E2E4E8; margin-top: 62px; ">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import { mapState } from 'vuex';
export default {

  name: 'App',
  computed: {
    ...mapState(['isAuthenticated', 'userData']),
    isAdmin() {
      return this.userData && this.userData.rol === 'admin';
    },
    itemsWithoutLogout() {
      return this.filteredItems.filter(item => item.action !== 'logout');
    },
    
    filteredItems() {
      if (this.isAuthenticated) {
        return this.items.filter(item => item.text !== 'Iniciar Sesión');
      } else {
        return this.items.filter(item => item.text !== 'Perfil' && item.text !== 'Cerrar Sesión');
      }
    }
  },
  components: {
  },

  data() {
    return {
      items: [
        { text: 'Iniciar Sesión', icon: 'mdi-login', action: 'goToLogin' },
        { text: 'Perfil', icon: 'mdi-account', action: 'goToProfile' },
        { text: 'Cerrar Sesión', icon: 'mdi-logout', action: 'logout' },
      ],
      drawer: true,
      rail: true,
      openSubMenus: [], // Almacena los submenús abiertos
    };
  },
  methods: {
    toggleSubMenu(subMenu) {
      if (this.openSubMenus.includes(subMenu)) {
        // Si el submenú ya está abierto, ciérralo
        const index = this.openSubMenus.indexOf(subMenu);
        this.openSubMenus.splice(index, 1);
      } else {
        // Si el submenú está cerrado, ábrelo
        this.openSubMenus.push(subMenu);
      }
    },
    handleAction(action) {
      switch (action) {
        case 'goToLogin':
          this.$router.push('/Login');
          break;
        case 'goToProfile':
          this.$router.push('/Perfil_usuario');
          break;
        case 'logout':
          this.logout();
          break;
      }
    },
    logout() {
      this.$store.dispatch('logout'); // Llama a la acción 'logout' del store para limpiar los datos del usuario y marcarlo como no autenticado
      this.$router.push('/home');   // Redirecciona al usuario a la página de inicio de sesión
    }
  },
};
</script>