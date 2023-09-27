<template>

<v-layout>
      <v-app-bar color="#ffff" prominent>
        <v-spacer></v-spacer>
        <v-btn 
        v-if="!$route.meta.requiresAuth" 
        value="Login" 
        router-link to="/Login" 
        color="#ffff"  
        @click="login"
        style="background: linear-gradient(45deg, #6949EA, #DF4CF2);">Iniciar Sesion</v-btn>

        <v-btn variant="text" icon="mdi-magnify"></v-btn>
        <v-btn router-link to="/Perfil_usuario" variant="text" prepend-icon="mdi mdi-account " ></v-btn>
      </v-app-bar>    
    </v-layout>

  <v-app>

    <v-navigation-drawer color="#ffff" v-model="drawer" :rail="rail" permanent @click="rail = false">
      <v-list dense nav >

        <div @click.stop="rail = !rail" class="hello" style="margin-top: 28px; margin-bottom: 28px; width: 60%; margin-left: 18%;" >
        <v-img src="../src/assets/logoIb.png" />
    </div>  
        
        <v-divider></v-divider>

        <!--MENU-->
      <v-list-item
          prepend-icon="mdi mdi-home-account"
          title="Home"
          value="Home"
          router-link to="/home"
          style=""
        ></v-list-item>
        
          <v-list-item
          prepend-icon="mdi mdi-account-group"
          title="Usuarios"
          value="Usuario"
          router-link to="/Usuario_C"
          style=""
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-account-group-outline"
          title="Clientes"
          value="Cliente"
          router-link to="/Cliente"
          style=""
        ></v-list-item>

        <!--SUB MENU-->
        <v-list-item-group>
          <v-list-item  
          @click="toggleSubMenu('subMenu1')"
          prepend-icon="mdi mdi-tshirt-crew"
          value="Productos"
          router-link to="/Productos"
          style="margin-bottom: 1px;">
            <v-list-item-content>
              <v-list-item-title >Productos</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-slide-y-transition>
            <v-list-item-group v-if="openSubMenus.includes('subMenu1')">
              <!-- <v-list-item prepend-icon="mdi mdi-basket-plus" style="margin-top: 0px; margin-left: 20px; font-size: 14px;" to="/Crear_producto">
                <v-list-item-content>
                  <v-list-item-title>Crear producto</v-list-item-title>
                </v-list-item-content>
              </v-list-item>-->
              <v-list-item prepend-icon="mdi mdi-shape-plus" style="margin-top: 0px; margin-left: 20px; font-size: 14px;" to="/Crear_categoria">
                <v-list-item-content>
                  <v-list-item-title>Categorias</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-slide-y-transition>    
        </v-list-item-group>
        <!-- FINALIZA SUB MENU-->

        <!--<v-list-item
          prepend-icon="mdi mdi-cash"
          title="Ventas"
          value="Ventas"
          router-link to="/Ventas"
          style=""
        ></v-list-item> -->
        <v-list-item
          prepend-icon="mdi mdi-close-box"
          title="Cerrar Sesion"
          value="Cerrar_sesion"
          router-link to="/Cerrar_sesion"
          style=""
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>
    
    <v-main style="background-color: #E2E4E8; margin-top: 62px; ">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
//import home from "./components/home.vue"
export default {
  name: 'App',
  components: {
  },

  data() {
    return {
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
  },
};
</script>