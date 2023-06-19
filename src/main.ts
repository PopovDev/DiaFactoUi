import { createApp } from 'vue'
import 'normalize.css'
import '@styles/global.scss'
import router from '@/router'
import App from './App.vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
createApp(App)
.use(pinia)
.use(router)
.mount('#app')

