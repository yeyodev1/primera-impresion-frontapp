<script setup lang="ts">
import { computed } from 'vue'
import { site } from '@/config/site'
import { useCatalog } from '@/composables/useCatalog'
import MarqueeBand from '@/components/fx/MarqueeBand.vue'

// Dos cintas cruzadas con las familias reales del catálogo, en sentidos
// opuestos, como el papel entrando a la prensa. Mientras el API responde se
// usan los rubros de la tarjeta del hero.
const { categories } = useCatalog()
const names = computed(() =>
  categories.value.length ? categories.value.map((c) => c.name) : [...site.home.heroCard.items],
)
</script>

<template>
  <div class="hmarq">
    <MarqueeBand :items="names" tone="accent" direction="left" :tilt="-2.5" :speed="55" />
    <MarqueeBand :items="names" tone="night" direction="right" size="md" outline :tilt="1.5" :speed="40" class="hmarq__back" />
  </div>
</template>

<style scoped lang="scss">
.hmarq {
  position: relative;
  overflow: hidden;
  padding-block: 2.5rem 3rem;
  background: linear-gradient($night 0 55%, $paper 55% 100%);

  > :first-child {
    position: relative;
    z-index: 2;
    box-shadow: 0 20px 40px -20px rgba(#000, 0.5);
  }

  &__back {
    margin-top: -0.6rem;
    --marquee-stroke: #{$accent};
  }
}
</style>
