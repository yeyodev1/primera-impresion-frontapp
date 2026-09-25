<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { copy, fx } from '@/config/site'
import { useCatalog } from '@/composables/useCatalog'
import { useResource } from '@/composables/useResource'
import { blogService } from '@/services/blog.service'
import HomeHero from '@/components/home/HomeHero.vue'
import HomeMarquee from '@/components/home/HomeMarquee.vue'
import HomeModes from '@/components/home/HomeModes.vue'
import HomeSolutions from '@/components/home/HomeSolutions.vue'
import HomeWhy from '@/components/home/HomeWhy.vue'
import HomeBlog from '@/components/home/HomeBlog.vue'
import ClosingBanner from '@/components/site/ClosingBanner.vue'

const { loadCategories } = useCatalog()

// El bloque de blog solo existe si hay artículos publicados; si falla o
// viene vacío, simplemente no se pinta.
const posts = useResource(() => blogService.posts({ limit: 3 }))
const latestPosts = computed(() => posts.data.value?.items ?? [])

// Portada del prototipo: hero, dos formas de trabajar, soluciones, por qué
// Primera Impresión y cierre; el blog se suma solo si hay artículos.
// Numeración mono de las secciones: 01 / 03, o 01 / 04 si hay blog.
const total = computed(() => (latestPosts.value.length ? 4 : 3))
const n = (i: number) => fx.section(i, total.value)

onMounted(() => {
  loadCategories()
  posts.load()
})
</script>

<template>
  <div class="home">
    <HomeHero />
    <HomeMarquee />
    <HomeModes :index="n(1)" />
    <HomeSolutions :index="n(2)" />
    <HomeWhy :index="n(3)" />
    <HomeBlog v-if="latestPosts.length" :index="n(4)" :posts="latestPosts" />
    <ClosingBanner
      :title="copy.home.closingTitle"
      :text="copy.home.closingText"
      :cta="{ label: copy.home.closingCta, to: '/contacto' }"
    />
  </div>
</template>
