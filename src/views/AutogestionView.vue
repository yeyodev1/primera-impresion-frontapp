<script setup lang="ts">
import { site } from '@/config/site'
import { copy } from '@/components/site/copy'
import { vReveal } from '@/composables/useReveal'
import DarkHero from '@/components/site/DarkHero.vue'
import ProofCard from '@/components/site/ProofCard.vue'
import SectionHead from '@/components/site/SectionHead.vue'
import IconCard from '@/components/site/IconCard.vue'
import StepList from '@/components/site/StepList.vue'
import AccessRequestForm from '@/components/site/AccessRequestForm.vue'
import ClosingBanner from '@/components/site/ClosingBanner.vue'

const a = site.autogestion
const portalIcons = ['fa-solid fa-lock', 'fa-solid fa-rotate', 'fa-solid fa-box']
</script>

<template>
  <div>
    <DarkHero :eyebrow="a.eyebrow" :title="a.title" :lead="a.lead">
      <template #actions>
        <RouterLink :to="{ hash: '#solicitud' }" class="btn btn--primary">
          {{ a.ctas.request }} <i class="fa-solid fa-arrow-down" aria-hidden="true"></i>
        </RouterLink>
        <RouterLink :to="{ hash: '#beneficios' }" class="btn btn--outline-light">{{ a.ctas.benefits }}</RouterLink>
      </template>
      <template #aside>
        <ProofCard :pill="a.heroCard.pill" :title="a.heroCard.title" :text="a.heroCard.text" :icons="portalIcons" />
      </template>
    </DarkHero>

    <section id="beneficios" class="block">
      <div class="block__inner">
        <SectionHead :eyebrow="a.benefitsEyebrow" :title="a.benefitsTitle" :text="a.benefitsText" />
        <div class="benefits">
          <IconCard
            v-for="(item, index) in a.benefits"
            :key="item.title"
            v-reveal="index % 4"
            :icon="item.icon"
            :title="item.title"
            :text="item.text"
          />
        </div>
      </div>
    </section>

    <section class="block block--sand">
      <div class="block__inner">
        <SectionHead :eyebrow="copy.autogestion.stepsEyebrow" :title="a.processTitle" :text="a.processText" />
        <StepList :steps="a.steps" basis="160px" />
      </div>
    </section>

    <section id="solicitud" class="block">
      <div class="request">
        <div class="request__intro">
          <SectionHead :eyebrow="a.formEyebrow" :title="a.formTitle" :text="a.formText" />
          <p class="request__notice">
            <i class="fa-solid fa-circle-info" aria-hidden="true"></i>
            {{ a.formNotice }}
          </p>
        </div>
        <div v-reveal class="request__card">
          <AccessRequestForm />
        </div>
      </div>
    </section>

    <ClosingBanner
      :title="a.closingTitle"
      :text="a.closingText"
      :cta="{ label: copy.autogestion.closingCta, to: '/contacto' }"
    />
  </div>
</template>

<style scoped lang="scss">
.block {
  padding-block: $space-section;
  scroll-margin-top: 4.5rem;

  &--sand {
    background: $sand;
  }

  &__inner {
    @include container;
  }
}

.benefits {
  @include flex-cards(240px, 1.25rem);
}

.request {
  @include container;
  @include flex(column, stretch, flex-start, 2rem);

  @include from('lg') {
    flex-direction: row;
    align-items: flex-start;
    gap: 4rem;
  }

  &__intro {
    @include from('lg') {
      flex: 1 1 40%;
      position: sticky;
      top: 6rem;
    }
  }

  &__notice {
    @include flex(row, flex-start, flex-start, 0.65rem);
    padding: 1rem 1.15rem;
    border-left: 3px solid $accent;
    background: $sand;
    border-radius: 0 $radius-sm $radius-sm 0;
    font-size: $text-sm;
    color: $ink-soft;

    i {
      margin-top: 0.25rem;
      color: $accent-deep;
    }
  }

  &__card {
    @include card;
    padding: 1.5rem 1.25rem;
    border-radius: $radius-md;
    box-shadow: $shadow-sm;

    @include from('md') {
      padding: 2.25rem;
    }

    @include from('lg') {
      flex: 1 1 60%;
    }
  }
}
</style>
