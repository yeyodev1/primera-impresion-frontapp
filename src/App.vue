<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import TheHeader from '@/layout/TheHeader.vue'
import TheFooter from '@/layout/TheFooter.vue'
import ToastList from '@/components/ui/ToastList.vue'
import PageTransition from '@/components/fx/PageTransition.vue'
import PaperGrain from '@/components/fx/PaperGrain.vue'

// Diferido: el panel no pesa en el sitio público y un error ahí no lo tumba.
const AdminLayout = defineAsyncComponent(() => import('@/layout/AdminLayout.vue'))

const route = useRoute()
// El panel tiene su propio marco: sin header ni footer del sitio público.
const isAdmin = computed(() => route.meta.layout === 'admin')
</script>

<template>
  <AdminLayout v-if="isAdmin">
    <RouterView />
  </AdminLayout>
  <div v-else class="app">
    <TheHeader />
    <main class="app__main">
      <!-- Sin <Transition> de Vue: la cortina de PageTransition tapa el cambio
           y un fade out-in retrasaría el montaje de la vista nueva. -->
      <RouterView />
    </main>
    <TheFooter />
    <PageTransition />
    <PaperGrain />
  </div>
  <ToastList />
</template>

<style scoped lang="scss">
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  &__main {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
}
</style>
