import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import router from './router'
import { VDatePicker } from 'vuetify/labs/VDatePicker'
import store from './stores/store'
import { createPinia } from 'pinia'

store.dispatch('initializeStore');
const pinia = createPinia()


loadFonts()

createApp(App)
  .use(vuetify)
  .use(router)
  .component('VDatePicker', VDatePicker)
  .use(store)
  .use(pinia)
  .mount('#app')