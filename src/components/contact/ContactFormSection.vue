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
// registro y los datos directos; el formulario va en una hoja de papel con
// marcas de corte que entra inclinada y se asienta sobre la mesa. Los datos
// directos (correo, teléfono) solo aparecen cuando están confirmados.
defineProps<{ index: string }>()

const direct = Boolean(site.email || site.phone)

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
  if (!direct) return
  gsap.from('.cform__direct > *', {
    y: 20,
    opacity: 0,
    stagger: 0.08,
    scrollTrigger: { trigger: '.cform__direct', start: 'top 90%', once: true },
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

        <div v-if="direct" class="cform__direct">
          <p class="cform__label">{{ fxPages.contact.formDirect }}</p>
          <a v-if="site.email" :href="`mailto:${site.email}`" class="cform__line">
            <i class="fa-solid fa-envelope" aria-hidden="true"></i> {{ site.email }}
          </a>
          <a v-if="site.phone" :href="site.phoneHref" class="cform__line">
            <i class="fa-solid fa-phone" aria-hidden="true"></i> {{ site.phone }}
          </a>
          <ColorBar tone="night" compact class="cform__bar" />
        </div>
        <ColorBar v-else tone="night" compact class="cform__bar" />
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

  &__direct {
    @include flex(column, flex-start, flex-start, 0.4rem);
    width: 100%;
    margin-top: 1rem;
    padding-top: 1.25rem;
    border-top: 1px solid rgba($surface, 0.15);
  }

  &__label {
    @include mono-label(0.62rem, 0.18em);
    color: rgba($surface, 0.6);
    margin-bottom: 0.3rem;
  }

  &__line {
    @include flex(row, center, flex-start, 0.7rem);
    min-height: 44px;
    font-size: $text-lg;
    font-weight: 600;
    word-break: break-all;
    color: $surface;
    background: linear-gradient($accent, $accent) no-repeat 0 85% / 0% 1px;
    transition: background-size 0.45s $ease;
    @include focus-ring;

    i {
      color: $accent;
      font-size: 0.9em;
    }

    &:hover {
      background-size: 100% 1px;
    }
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
    box-shadow:
      0 2px 0 rgba(#000, 0.2),
      0 60px 90px -40px rgba(#000, 0.7);

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
