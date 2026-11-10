import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useUserStore } from './stores/user'
import '@/styles/global.scss'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

const userStore = useUserStore(pinia)

// httpBase emite este evento al recibir un 401: la sesión caducó.
window.addEventListener('auth:token-expired', () => {
  userStore.clear()
  const { meta } = router.currentRoute.value
  if (meta.requiresAuth || meta.requiresAdmin) {
    router.replace({ name: 'Login', query: { next: router.currentRoute.value.fullPath } })
  }
})

// Cloudflare Web Analytics: sin cookies y sigue los cambios de ruta del SPA.
// El token del beacon es público; sin él no se carga nada.
const beaconToken = import.meta.env.VITE_CF_BEACON_TOKEN
// El panel no se mide: el equipo entra directo a /admin y no debe inflar las visitas.
if (beaconToken && !location.pathname.startsWith('/admin')) {
  const script = document.createElement('script')
  script.defer = true
  script.src = 'https://static.cloudflareinsights.com/beacon.min.js'
  script.dataset.cfBeacon = JSON.stringify({ token: beaconToken, spa: true })
  document.head.appendChild(script)
}

app.mount('#app')
