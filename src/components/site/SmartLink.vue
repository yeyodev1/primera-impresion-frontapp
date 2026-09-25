<script setup lang="ts">
import { computed } from 'vue'
import { copy } from '@/config/site'

// Enlace que decide solo cómo abrirse según su destino. Los canales y el portal
// pueden estar sin confirmar en site.ts: entonces apuntan a una ruta interna
// (RouterLink) y, al llenarse, pasan a ser externos (pestaña nueva) sin tocar
// las vistas. `mailto:` y `tel:` se abren en la misma pestaña.
const props = defineProps<{ to: string }>()

const external = computed(() => /^https?:\/\//.test(props.to))
const native = computed(() => external.value || /^(mailto|tel):/.test(props.to))
</script>

<template>
  <a v-if="native" :href="to" :target="external ? '_blank' : undefined" :rel="external ? 'noopener' : undefined">
    <slot :external="external" />
    <span v-if="external" class="visually-hidden">{{ copy.header.newTab }}</span>
  </a>
  <RouterLink v-else :to="to">
    <slot :external="false" />
  </RouterLink>
</template>
