<script setup lang="ts">
import { site } from '@/config/site'
import ClosingBanner from './ClosingBanner.vue'

// Invitación a la autogestión para quien compra con frecuencia.
</script>

<template>
  <ClosingBanner
    :title="site.recurrentBanner.title"
    :text="site.recurrentBanner.text"
    :cta="{ label: site.recurrentBanner.cta, to: '/autogestion' }"
  />
</template>
