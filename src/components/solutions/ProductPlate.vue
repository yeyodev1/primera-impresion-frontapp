<script setup lang="ts">
import { ref } from 'vue'
import type { MediaImage } from '@/types'
import { fxCatalog } from '@/config/site'
import { gsap, MQ, useGsapMedia } from '@/composables/motion/useGsap'
import ImageSlot from '@/components/site/ImageSlot.vue'
import RegMark from '@/components/fx/RegMark.vue'

// Lámina grande de la ficha: la foto (o su prueba de semitono) enmarcada con
// marcas de registro por fuera del área útil, como una hoja en la mesa de
// luz, y un pie técnico. Entra destapándose de abajo arriba y, desde md, la
// foto (o la trama) y el icono se deslizan a distinta velocidad con el
// scroll: parallax con profundidad dentro del marco.
defineProps<{ image: MediaImage | null; name: string; icon: string; family?: string }>()

const root = ref<HTMLElement | null>(null)

useGsapMedia(root, (mm, el) => {
  const frame = el.querySelector('.plate__frame')
  const ink = el.querySelectorAll('.slot__img, .slot__screen')
  const icon = el.querySelectorAll('.slot__icon, .slot__label')
  mm.add(MQ.motion, () => {
    gsap.fromTo(
      frame,
      { clipPath: 'inset(100% 0% 0% 0%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.3,
        ease: 'expo.inOut',
        delay: 0.25,
        clearProps: 'clipPath',
      },
    )
  })
  mm.add(`${MQ.md} and ${MQ.motion}`, () => {
    const scrollTrigger = { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6 }
    gsap.fromTo(
      ink,
      { yPercent: -5, scale: 1.12 },
      { yPercent: 5, scale: 1.12, ease: 'none', scrollTrigger },
    )
    if (icon.length)
      gsap.fromTo(icon, { y: -50 }, { y: 50, ease: 'none', scrollTrigger: { ...scrollTrigger } })
  })
})
</script>

<template>
  <figure ref="root" class="plate">
    <RegMark class="plate__reg plate__reg--t" size="1.1rem" tone="ink" />
    <RegMark class="plate__reg plate__reg--r" size="1.1rem" tone="ink" />
    <RegMark class="plate__reg plate__reg--b" size="1.1rem" tone="ink" />
    <div class="plate__frame">
      <div class="plate__inner">
        <ImageSlot :image="image" :alt="name" :icon="icon" />
      </div>
    </div>
    <figcaption class="plate__caption">
      <span>{{ fxCatalog.detail.photo(name) }}</span>
      <span v-if="family" class="plate__family">{{ family }}</span>
    </figcaption>
  </figure>
</template>

<style scoped lang="scss">
.plate {
  position: relative;
  padding: 1.4rem;

  @include from('md') {
    padding: 2rem;
  }

  &__reg {
    position: absolute;
    opacity: 0.55;

    &--t {
      top: 0;
      left: 50%;
      margin-left: -0.55rem;
    }

    &--r {
      right: 0;
      top: 45%;
    }

    &--b {
      bottom: 1.6rem;
      left: 0;
    }
  }

  &__frame {
    position: relative;
    overflow: hidden;
    border-radius: 4px;
    box-shadow: 0 40px 80px -40px rgba($ink, 0.45);
  }

  &__inner {
    :deep(.slot) {
      border-radius: 0;
      aspect-ratio: 1 / 1 !important;
    }

    :deep(.slot__icon) {
      font-size: clamp(4rem, 2.5rem + 6vw, 8rem);
    }
  }

  &__caption {
    @include flex(row, center, space-between, 1rem);
    flex-wrap: wrap;
    margin-top: 0.9rem;
    @include mono-label(0.6rem, 0.16em);
    color: $ink-muted;
  }

  &__family {
    color: darken($accent-deep, 4%);
  }
}
</style>
