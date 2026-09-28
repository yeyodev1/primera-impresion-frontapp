<script setup lang="ts">
import { site, fx } from '@/config/site'
import PageIntro from '@/components/site/PageIntro.vue'
import VisitCard from '@/components/site/VisitCard.vue'
import ClosingBanner from '@/components/site/ClosingBanner.vue'
import ColorBar from '@/components/fx/ColorBar.vue'
import ContactChannels from '@/components/contact/ContactChannels.vue'
import ContactFormSection from '@/components/contact/ContactFormSection.vue'

// Contacto en tres pliegos: canales directos (papel), la planta en Guayaquil
// con su mapa (arena) y, al final, el formulario (noche).
const n = (i: number) => fx.section(i, 3)
</script>

<template>
  <div>
    <PageIntro :eyebrow="site.contact.eyebrow" :title="site.contact.title" :lead="site.contact.lead" />
    <ContactChannels :index="n(1)" />

    <section class="visit-block">
      <div class="visit-block__inner">
        <ColorBar class="visit-block__bar" />
        <VisitCard :index="n(2)" />
      </div>
    </section>

    <ContactFormSection :index="n(3)" />

    <ClosingBanner
      :title="site.contact.closingTitle"
      :text="site.contact.closingText"
      :cta="{ label: site.contact.closingCta, to: '#form-contacto' }"
    />
  </div>
</template>

<style scoped lang="scss">
.visit-block {
  padding-block: 2rem $space-section;
  background: $sand;

  &__inner {
    @include container(1320px);
  }

  &__bar {
    margin-bottom: $space-xl;
  }
}
</style>
