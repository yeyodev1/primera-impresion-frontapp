import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { site } from '@/config/site'

const publicRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: site.name },
  },
  {
    path: '/soluciones',
    name: 'Solutions',
    component: () => import('@/views/SolutionsView.vue'),
    meta: { title: 'Soluciones' },
  },
  {
    path: '/soluciones/:slug',
    name: 'SolutionDetail',
    component: () => import('@/views/SolutionDetailView.vue'),
    meta: { title: 'Soluciones' },
  },
  {
    path: '/autogestion',
    name: 'Autogestion',
    component: () => import('@/views/AutogestionView.vue'),
    meta: { title: 'Autogestión en línea' },
  },
  {
    path: '/nosotros',
    name: 'About',
    component: () => import('@/views/AboutView.vue'),
    meta: { title: 'Nosotros' },
  },
  {
    path: '/blog',
    name: 'Blog',
    component: () => import('@/views/BlogView.vue'),
    meta: { title: 'Blog' },
  },
  {
    path: '/blog/:slug',
    name: 'Post',
    component: () => import('@/views/PostView.vue'),
    meta: { title: 'Blog' },
  },
  {
    path: '/contacto',
    name: 'Contact',
    component: () => import('@/views/ContactView.vue'),
    meta: { title: 'Contacto' },
  },
]

// Panel interno del equipo de Primera Impresión: blog, soluciones y solicitudes.
// No es el Portal de Clientes: ese ya existe aparte y se enlaza con site.portalUrl.
const adminRoutes: Array<RouteRecordRaw> = [
  {
    path: '/admin/ingresar',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: 'Ingresar al panel', guestOnly: true, layout: 'admin' },
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('@/views/admin/AdminDashboardView.vue'),
    meta: { title: 'Panel', requiresAdmin: true, layout: 'admin' },
  },
  {
    path: '/admin/solicitudes',
    name: 'AdminLeads',
    component: () => import('@/views/admin/AdminLeadsView.vue'),
    meta: { title: 'Solicitudes', requiresAdmin: true, layout: 'admin' },
  },
  {
    path: '/admin/categorias',
    name: 'AdminCategories',
    component: () => import('@/views/admin/AdminCategoriesView.vue'),
    meta: { title: 'Categorías', requiresAdmin: true, layout: 'admin' },
  },
  {
    path: '/admin/soluciones',
    name: 'AdminSolutions',
    component: () => import('@/views/admin/AdminSolutionsView.vue'),
    meta: { title: 'Soluciones', requiresAdmin: true, layout: 'admin' },
  },
  {
    path: '/admin/blog',
    name: 'AdminPosts',
    component: () => import('@/views/admin/AdminPostsView.vue'),
    meta: { title: 'Blog', requiresAdmin: true, layout: 'admin' },
  },
  {
    path: '/admin/blog/nuevo',
    name: 'AdminPostNew',
    component: () => import('@/views/admin/AdminPostEditView.vue'),
    meta: { title: 'Nuevo artículo', requiresAdmin: true, layout: 'admin' },
  },
  {
    path: '/admin/blog/:id',
    name: 'AdminPostEdit',
    component: () => import('@/views/admin/AdminPostEditView.vue'),
    meta: { title: 'Editar artículo', requiresAdmin: true, layout: 'admin' },
  },
]

const routes: Array<RouteRecordRaw> = [
  ...publicRoutes,
  ...adminRoutes,
  { path: '/login', redirect: '/admin/ingresar' },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: 'Página no encontrada' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // Con "atrás" el navegador devuelve la posición guardada; con un hash se
  // baja a la sección; si no, arriba.
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    // Misma página con otro filtro o paginación (?tema=, ?categoria=,
    // ?pagina=): no se mueve el scroll; la vista decide si acomodarlo.
    if (!to.hash && to.path === from.path) return false
    if (!to.hash) return { left: 0, top: 0 }
    // Misma página: bajar ya. Otra página: esperar a que la transición pinte la
    // sección (la vista es lazy y entra con animación), si no, se queda arriba.
    if (to.path === from.path) return { el: to.hash, behavior: 'smooth', top: 90 }
    return new Promise((resolve) => {
      const started = Date.now()
      const find = () => {
        // Salto instantáneo: la cortina aún tapa y un scroll suave lo cortaría
        // el recálculo de ScrollTrigger al retirarse.
        if (document.querySelector(to.hash)) return resolve({ el: to.hash, top: 90 })
        if (Date.now() - started > 4000) return resolve({ left: 0, top: 0 })
        window.setTimeout(find, 60)
      }
      find()
    })
  },
})

router.beforeEach(async (to) => {
  const userStore = useUserStore()

  if (to.meta.requiresAdmin || to.meta.guestOnly) {
    // La sesión se verifica contra el API una sola vez por carga.
    await userStore.restore()
  }

  if (to.meta.requiresAdmin && !userStore.isAdmin) {
    return { name: 'Login', query: { next: to.fullPath }, replace: true }
  }

  if (to.meta.guestOnly && userStore.isAdmin) {
    return { name: 'AdminDashboard', replace: true }
  }
})

router.afterEach((to) => {
  const title = to.meta.title as string | undefined
  document.title = title && title !== site.name ? `${title} | ${site.name}` : site.title
})

export default router
