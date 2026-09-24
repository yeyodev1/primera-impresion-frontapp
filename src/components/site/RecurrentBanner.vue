<script setup lang="ts">
import { site } from '@/config/site'
import ClosingBanner from './ClosingBanner.vue'

// Invitación a la autogestión para quien compra con frecuencia. En negro para
// no competir con el cierre naranja cuando ambos aparecen en una página.
</script>

<template>
  <ClosingBanner
    tone="night"
    :title="site.recurrentBanner.title"
    :text="site.recurrentBanner.text"
    :cta="{ label: site.recurrentBanner.cta, to: '/autogestion' }"
  />
</template>
