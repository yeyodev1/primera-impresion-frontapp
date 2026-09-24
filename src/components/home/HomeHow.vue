<script setup lang="ts">
import { site, copy } from '@/config/site'
import SectionHead from '@/components/site/SectionHead.vue'
import PinnedSteps from '@/components/site/PinnedSteps.vue'
import ColorBar from '@/components/fx/ColorBar.vue'

// Cómo funciona: Cotiza, Negocia, Normaliza, Compra como pliegos que cruzan
// la prensa (fijado horizontal desde lg, línea de tiempo en móvil).
defineProps<{ index: string }>()
</script>

<template>
  <div class="hhow">
    <div class="hhow__strip">
      <ColorBar />
    </div>
    <PinnedSteps :steps="site.howItWorks">
      <template #head>
        <SectionHead :index="index" :eyebrow="copy.home.howEyebrow" :title="copy.home.howTitle" />
      </template>
    </PinnedSteps>
  </div>
</template>

<style scoped lang="scss">
.hhow {
  background: $sand;
  padding-block: 2rem $space-section;

  &__strip {
    @include container(1320px);
    margin-bottom: $space-xl;
  }
}
</style>
