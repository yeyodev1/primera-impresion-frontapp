<script setup lang="ts">
import { site, copy, fx } from '@/config/site'
import { fxPages } from '@/config/fx.pages'
import PageIntro from '@/components/site/PageIntro.vue'
import SectionHead from '@/components/site/SectionHead.vue'
import PinnedSteps from '@/components/site/PinnedSteps.vue'
import ClosingBanner from '@/components/site/ClosingBanner.vue'
import ColorBar from '@/components/fx/ColorBar.vue'
import AboutHistory from '@/components/about/AboutHistory.vue'
import AboutCapacity from '@/components/about/AboutCapacity.vue'
import AboutGallery from '@/components/about/AboutGallery.vue'

// Nosotros como un pliego de cuatro secciones: trayectoria (papel), sala de
// producción (noche), método (pliegos por la prensa) y muestrario en abanico.
const ab = site.about
const n = (i: number) => fx.section(i, 4)
</script>

<template>
  <div class="about">
    <PageIntro :eyebrow="ab.eyebrow" :title="ab.title" :lead="ab.lead" />
    <AboutHistory :index="n(1)" />
    <AboutCapacity :index="n(2)" />

    <div class="about__how">
      <div class="about__strip">
        <ColorBar />
      </div>
      <PinnedSteps :steps="ab.process">
        <template #head>
          <SectionHead :index="n(3)" :eyebrow="fxPages.about.process.eyebrow" :title="ab.processTitle" />
        </template>
      </PinnedSteps>
    </div>

    <AboutGallery :index="n(4)" />

    <ClosingBanner :title="ab.closingTitle" :text="ab.closingText" :cta="{ label: copy.about.closingCta, to: '/contacto' }" />
  </div>
</template>

<style scoped lang="scss">
.about {
  &__how {
    background: $sand;
    padding-block: 2rem $space-section;
  }

  &__strip {
    @include container(1320px);
    margin-bottom: $space-xl;
  }
}
</style>
