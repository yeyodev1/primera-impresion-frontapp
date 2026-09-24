<script setup lang="ts">
import { site, copy, fx } from '@/config/site'
import { fxCatalog } from '@/config/fx.catalog'
import DarkHero from '@/components/site/DarkHero.vue'
import ClosingBanner from '@/components/site/ClosingBanner.vue'
import MagneticButton from '@/components/fx/MagneticButton.vue'
import PortalMock from '@/components/autogestion/PortalMock.vue'
import BenefitsBoard from '@/components/autogestion/BenefitsBoard.vue'
import AccessPipeline from '@/components/autogestion/AccessPipeline.vue'
import RequestSection from '@/components/autogestion/RequestSection.vue'

// Autogestión: hero oscuro con la interfaz simulada del portal, beneficios,
// proceso de acceso como línea de producción, solicitud y cierre naranja.
const a = site.autogestion
const n = (i: number) => fx.section(i, 3)
</script>

<template>
  <div>
    <DarkHero
      :eyebrow="a.eyebrow"
      :title="a.title"
      :lead="a.lead"
      :accent="fxCatalog.autogestion.heroAccent"
    >
      <template #actions>
        <MagneticButton>
          <RouterLink :to="{ hash: '#solicitud' }" class="btn btn--primary btn--press">
            {{ a.ctas.request }} <i class="fa-solid fa-arrow-down" aria-hidden="true"></i>
          </RouterLink>
        </MagneticButton>
        <RouterLink :to="{ hash: '#beneficios' }" class="btn btn--outline-light hero-link">{{
          a.ctas.benefits
        }}</RouterLink>
      </template>
      <template #aside>
        <PortalMock />
      </template>
    </DarkHero>

    <BenefitsBoard :index="n(1)" />
    <AccessPipeline :index="n(2)" />
    <RequestSection :index="n(3)" />

    <ClosingBanner
      :title="a.closingTitle"
      :text="a.closingText"
      :cta="{ label: copy.autogestion.closingCta, to: '/contacto' }"
    />
  </div>
</template>

<style scoped lang="scss">
.hero-link {
  min-height: 3.5rem;
  border-radius: $radius-pill;
  padding-inline: 1.6rem;
}
</style>
