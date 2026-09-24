<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BrandMark from '@/components/brand/BrandMark.vue'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import { useAdminStats } from '@/composables/admin/useAdminStats'
import { useBodyScroll } from '@/composables/useBodyScroll'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const toast = useToastStore()
const { refresh } = useAdminStats()

const isLogin = computed(() => route.name === 'Login')
const drawerOpen = ref(false)
useBodyScroll(drawerOpen)

// El badge de solicitudes nuevas se refresca en cada cambio de sección.
watch(
  () => route.path,
  () => {
    drawerOpen.value = false
    if (!isLogin.value && userStore.isAdmin) refresh()
  },
  { immediate: true },
)

function logout() {
  userStore.clear()
  router.replace({ name: 'Login' })
}

// main.ts solo redirige rutas con requiresAuth; el panel usa requiresAdmin,
// así que la sesión vencida se resuelve acá.
function onExpired() {
  if (isLogin.value) return
  toast.info('Tu sesión venció; vuelve a ingresar')
  router.replace({ name: 'Login', query: { next: route.fullPath } })
}

function onKey(event: KeyboardEvent) {
  if (event.key === 'Escape') drawerOpen.value = false
}

onMounted(() => {
  window.addEventListener('auth:token-expired', onExpired)
  window.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  window.removeEventListener('auth:token-expired', onExpired)
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <div v-if="isLogin" class="auth">
    <slot />
  </div>

  <div v-else class="admin">
    <header class="admin__topbar">
      <RouterLink to="/admin" class="admin__brand" aria-label="Ir al panel">
        <BrandMark tone="light" />
      </RouterLink>
      <button
        type="button"
        class="admin__menu"
        :aria-expanded="drawerOpen"
        aria-controls="admin-drawer"
        aria-label="Abrir menú"
        @click="drawerOpen = true"
      >
        <i class="fa-solid fa-bars"></i>
      </button>
    </header>

    <aside class="admin__aside">
      <AdminSidebar @logout="logout" />
    </aside>

    <Transition name="drawer">
      <div v-if="drawerOpen" class="admin__drawer" @click.self="drawerOpen = false">
        <div id="admin-drawer" class="admin__drawer-panel">
          <button
            type="button"
            class="admin__close"
            aria-label="Cerrar menú"
            @click="drawerOpen = false"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
          <AdminSidebar drawer @navigate="drawerOpen = false" @logout="logout" />
        </div>
      </div>
    </Transition>

    <main class="admin__main">
      <div class="admin__content">
        <slot />
      </div>
    </main>
  </div>
</template>

<style scoped lang="scss">
$sidebar: 248px;

.auth {
  @include flex(column, center, center);
  min-height: 100vh;
  padding: 1.5rem 1rem;
  background: $paper;
}

.admin {
  min-height: 100vh;
  background: $paper;

  &__topbar {
    position: sticky;
    top: 0;
    z-index: 50;
    @include flex(row, center, space-between, 1rem);
    height: 60px;
    padding: 0 0.75rem 0 1rem;
    background: $night;
    font-size: 0.78rem;

    @include from('lg') {
      display: none;
    }
  }

  &__menu,
  &__close {
    @include flex(row, center, center);
    width: 44px;
    height: 44px;
    border-radius: $radius-sm;
    color: $surface;
    font-size: 1.15rem;

    &:hover {
      background: $night-soft;
    }
  }

  &__aside {
    display: none;

    @include from('lg') {
      display: block;
      position: fixed;
      inset: 0 auto 0 0;
      width: $sidebar;
      z-index: 40;
    }
  }

  &__drawer {
    position: fixed;
    inset: 0;
    z-index: 150;
    background: $overlay;

    @include from('lg') {
      display: none;
    }
  }

  &__drawer-panel {
    position: relative;
    width: min(290px, 86vw);
    height: 100%;
  }

  &__close {
    position: absolute;
    top: 0.9rem;
    right: 0.6rem;
    z-index: 1;
  }

  &__main {
    @include from('lg') {
      margin-left: $sidebar;
    }
  }

  &__content {
    width: 100%;
    max-width: 1180px;
    margin-inline: auto;
    padding: 1.25rem 1rem 3rem;

    @include from('md') {
      padding: 2rem 2rem 4rem;
    }
  }
}

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.25s ease;

  .admin__drawer-panel {
    transition: transform 0.3s $ease;
  }
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;

  .admin__drawer-panel {
    transform: translateX(-100%);
  }
}
</style>
