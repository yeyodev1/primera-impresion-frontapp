<script setup lang="ts">
import { site, fx, fxPages } from '@/config/site'
import { ref } from 'vue'
import { gsap, useGsapContext } from '@/composables/motion/useGsap'
import RegisterTitle from '@/components/fx/RegisterTitle.vue'
import SplitReveal from '@/components/fx/SplitReveal.vue'
import RegMark from '@/components/fx/RegMark.vue'
import ColorBar from '@/components/fx/ColorBar.vue'
import HalftoneBg from '@/components/site/HalftoneBg.vue'
import CropMarks from '@/components/site/CropMarks.vue'
import ContactForm from '@/components/site/ContactForm.vue'

// El formulario como una orden de trabajo: sección oscura con el titular en
// registro; el formulario va en una hoja de papel con marcas de corte que
// entra inclinada y se asienta sobre la mesa. Sin datos directos acá: ya
// están en los canales de arriba y en el botón de WhatsApp (el cliente lo
// pidió así, era redundante).
defineProps<{ index: string }>()

const root = ref<HTMLElement | null>(null)

useGsapContext(root, ({ reduced }) => {
  if (reduced) return
  gsap.from('.cform__sheet', {
    y: 120,
    rotation: 4,
    opacity: 0,
    duration: 1.4,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.cform__sheet', start: 'top 90%', once: true },
  })
})
</script>

<template>
  <section id="form-contacto" ref="root" class="cform">
    <HalftoneBg fade="right" />
    <div class="cform__inner">
      <div class="cform__copy">
        <p class="cform__eyebrow">
          <span class="cform__index">{{ index }}</span>
          {{ fxPages.contact.formEyebrow }}
        </p>
        <RegisterTitle :text="site.contact.formTitle" size="lg" tone="night" class="cform__title" />
        <SplitReveal :text="site.contact.formText" by="lines" class="cform__text" />

        <ColorBar tone="night" compact class="cform__bar" />
      </div>

      <div class="cform__sheet">
        <CropMarks inset="0.75rem" />
        <p class="cform__spec" aria-hidden="true">
          <span>{{ fxPages.contact.formSheet }}</span>
          <span class="cform__coords">{{ fx.coords }}</span>
          <RegMark size="1rem" tone="ink" />
        </p>
        <ContactForm />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.cform {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding-block: $space-section;
  background: $night;
  color: $surface;
  scroll-margin-top: 0;

  &__inner {
    @include container(1320px);
    position: relative;
    z-index: 1;
    @include flex(column, stretch, flex-start, 3rem);

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
      gap: 4rem;
    }
  }

  &__copy {
    @include flex(column, flex-start, flex-start, 1.4rem);

    @include from('lg') {
      position: sticky;
      top: 7rem;
      flex: 1 1 42%;
    }
  }

  &__eyebrow {
    @include flex(row, center, flex-start, 0.85rem);
    @include mono-label(0.7rem, 0.18em);
    color: $accent;
  }

  &__index {
    padding: 0.2rem 0.45rem;
    border: 1px solid currentColor;
    border-radius: 2px;
  }

  &__title {
    max-width: 12ch;
  }

  &__text {
    max-width: 40ch;
    font-size: $text-lg;
    line-height: 1.55;
    color: rgba($surface, 0.75);
  }

  &__bar {
    margin-top: 1rem;
    max-width: 10rem;
  }

  // La hoja de papel: el formulario (de otro módulo) se pinta sobre claro.
  &__sheet {
    position: relative;
    padding: 2.4rem 1.25rem 1.5rem;
    background: $paper;
    color: $ink;
    border-radius: 3px;
    @include floating-sheet;

    @include from('md') {
      padding: 3rem 2.5rem 2.25rem;
    }

    @include from('lg') {
      flex: 1 1 58%;
    }
  }

  &__spec {
    @include flex(row, center, space-between, 1rem);
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px dashed $line;
    @include mono-label(0.6rem, 0.16em);
    color: $ink-muted;
  }

  &__coords {
    display: none;
    margin-left: auto;

    @include from('md') {
      display: inline;
    }
  }
}
</style>
