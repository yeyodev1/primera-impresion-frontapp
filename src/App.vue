<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TheHeader from '@/layout/TheHeader.vue'
import TheFooter from '@/layout/TheFooter.vue'
import AdminLayout from '@/layout/AdminLayout.vue'
import ToastList from '@/components/ui/ToastList.vue'

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
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <TheFooter />
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
