// store.js
import { createStore } from 'vuex'

export default createStore({
    state: {
        isAuthenticated: false,
        userData: null
    },

    mutations: {
        SET_USER(state, user) {
            state.isAuthenticated = true;
            state.userData = user;
            localStorage.setItem('user', JSON.stringify(user));
        },
        LOGOUT(state) {
            state.isAuthenticated = false;
            state.userData = null;
            localStorage.removeItem('user');
            localStorage.removeItem('userId');
        },
        limpiarCredenciales(state) {
            // Lógica para limpiar las credenciales
            state.isAuthenticated = false;
            state.userData = null;
            localStorage.removeItem('user');
        },
        setUserAuthenticated(state, value) {
            state.isAuthenticated = value;
        },
    },

    actions: {
        setUser({ commit }, user) {
            commit('SET_USER', user);
        },
        logout({ commit }) {
            commit('LOGOUT');
        },
        initializeStore({ state }) {
            if (localStorage.getItem('user')) {
                state.userData = JSON.parse(localStorage.getItem('user'));
                state.isAuthenticated = true;
            } else {
                state.userData = null;
                state.isAuthenticated = false;
            }
        }
    }
});




