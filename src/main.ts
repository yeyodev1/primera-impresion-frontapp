import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { inject } from '@vercel/analytics'
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

// Vercel Web Analytics: sin cookies y sigue los cambios de ruta del SPA. Solo
// cuenta en producción. El panel no se mide: el equipo no debe inflar las visitas.
inject({
  beforeSend: (event) => (new URL(event.url).pathname.startsWith('/admin') ? null : event),
})

app.mount('#app')
