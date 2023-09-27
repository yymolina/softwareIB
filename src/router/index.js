import { createWebHashHistory, createRouter, } from 'vue-router';


import store from '../stores/store';

import home from '../components/home.vue'
import Login from '../components/Login.vue'
import Perfil_usuario from '../components/Perfil_usuario.vue'
import Usuario_C from '../components/Usuario_C.vue'
import Productos from '../components/Productos.vue'
import CarritoVenta from '../components/CarritoVenta.vue'
import Cerrar_sesion from '../components/Cerrar_sesion.vue'
import Crear_categoria from '../components/Crear_categoria.vue'
import Cliente from '../components/Cliente.vue'

const routes = [
    { path: '/home', name: 'home', component: home, meta: { requiresAuth: false }},
    { path: '/Login', name: 'Login', component: Login, meta: { requiresAuth: false }},
    { path: '/Perfil_usuario', name: 'Perfil_usuario', component: Perfil_usuario, meta: {requiresAuth: true}},
    { path: '/Usuario_C', name: 'Usuario_C', component: Usuario_C, meta: {requiresAuth: true}},
    { path: '/Productos', name: 'Productos', component: Productos, meta: {requiresAuth: true}},
    { path: '/CarritoVenta', name: 'CarritoVenta', component: CarritoVenta, meta: {requiresAuth: true}},
    { path: '/Cerrar_sesion', name: 'Cerrar_sesion', component: Cerrar_sesion, meta: {requiresAuth: true}},
    { path: '/Crear_categoria', name: 'Crear_categoria', component: Crear_categoria, meta: {requiresAuth: true}},
    { path: '/Cliente', name: 'Cliente', component: Cliente, meta: {requiresAuth: true}}
];


const router = createRouter({ history: createWebHashHistory(),routes, 
});

router.beforeEach((to, from, next) => {
    // Comprobar si la ruta requiere autenticación y el usuario no está autenticado
    if (to.meta.requiresAuth && !store.state.isAuthenticated) {
        next('/home');  // Redirecciona al login
    } else {
        next();  // Continúa a la ruta solicitada
    }
});


export default router;