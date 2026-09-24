<script setup lang="ts">
import { site } from '@/config/site'
import ClosingBanner from './ClosingBanner.vue'

// Invitación a la autogestión para quien compra con frecuencia. Naranja por
// defecto: suele ser el último bloque y en negro se fundía con el footer.
// `tone="night"` solo si en la página ya hay un cierre naranja.
withDefaults(defineProps<{ tone?: 'accent' | 'night' }>(), { tone: 'accent' })
</script>

<template>
  <ClosingBanner
    :tone="tone"
    :title="site.recurrentBanner.title"
    :text="site.recurrentBanner.text"
    :cta="{ label: site.recurrentBanner.cta, to: '/autogestion' }"
  />
</template>
