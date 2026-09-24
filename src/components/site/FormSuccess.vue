<script setup lang="ts">
import { onMounted, ref, useId } from 'vue'
import { copy } from '@/config/site'
import { fxCatalog } from '@/config/fx.catalog'
import { gsap, useGsapContext } from '@/composables/motion/useGsap'

// Reemplaza al formulario tras un envío correcto: un sello de goma
// "Recibido" cae sobre la hoja (con sus tintas C, M y Y corridas que se
// registran al asentarse), la fecha del registro y el mensaje. Toma el foco
// para que el lector de pantalla anuncie el mensaje.
defineProps<{ message: string }>()
defineEmits<{ again: [] }>()

const box = ref<HTMLElement | null>(null)
const ringId = `stamp-${useId()}`
const today = new Intl.DateTimeFormat('es-EC', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
}).format(new Date())
const inks = ['c', 'm', 'y', 'k'] as const
const OFFSETS = { c: [-7, -4], m: [6, 3], y: [3, 7], k: [0, 0] } as const

onMounted(() => box.value?.focus())

useGsapContext(box, ({ reduced, el }) => {
  if (reduced) return
  const stamp = el.querySelector('.success__stamp')
  const layers = el.querySelectorAll<HTMLElement>('.success__ink')
  const tl = gsap.timeline({ delay: 0.1 })
  tl.fromTo(
    stamp,
    { scale: 2.6, rotation: -32, autoAlpha: 0 },
    { scale: 1, rotation: -9, autoAlpha: 1, duration: 0.42, ease: 'power4.in' },
  )
    .fromTo(el, { y: 0 }, { y: 5, duration: 0.06, yoyo: true, repeat: 1, ease: 'power1.inOut' })
    .fromTo(
      layers,
      { x: (i: number) => OFFSETS[inks[i]!][0], y: (i: number) => OFFSETS[inks[i]!][1] },
      { x: 0, y: 0, duration: 0.9, ease: 'expo.out' },
      '<',
    )
    .fromTo(
      el.querySelectorAll('.success__spec, .success__text, .success__again'),
      { autoAlpha: 0, y: 16 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'expo.out',
        clearProps: 'opacity,visibility,transform',
      },
      '-=0.6',
    )
})
</script>

<template>
  <div ref="box" class="success" role="status" tabindex="-1">
    <div class="success__stamp" aria-hidden="true">
      <svg
        v-for="ink in inks"
        :key="ink"
        class="success__ink"
        :class="`success__ink--${ink}`"
        viewBox="0 0 200 200"
      >
        <defs v-if="ink === 'k'">
          <path :id="ringId" d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" />
        </defs>
        <circle cx="100" cy="100" r="94" class="success__ring" />
        <circle cx="100" cy="100" r="58" class="success__ring success__ring--thin" />
        <text class="success__arc">
          <textPath :href="`#${ringId}`" textLength="462" lengthAdjust="spacing">
            {{ fxCatalog.forms.stampRing }}
          </textPath>
        </text>
        <text x="100" y="109" text-anchor="middle" class="success__word">
          {{ fxCatalog.forms.stamp }}
        </text>
      </svg>
    </div>
    <p class="success__spec">{{ fxCatalog.forms.stampSpec(today) }}</p>
    <p class="success__text">{{ message }}</p>
    <button type="button" class="btn btn--ghost btn--sm success__again" @click="$emit('again')">
      {{ copy.forms.again }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.success {
  position: relative;
  @include flex(column, center, center, 1rem);
  min-height: 24rem;
  padding: 2.5rem 1.5rem;
  text-align: center;
  outline: none;

  &__stamp {
    position: relative;
    width: clamp(9rem, 7rem + 8vw, 12rem);
    aspect-ratio: 1;
    margin-bottom: 0.5rem;
    transform: rotate(-9deg);
  }

  // Cuatro copias del sello: tres tintas de proceso bajo la de marca.
  &__ink {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
    mix-blend-mode: multiply;

    &--c {
      color: rgba($cmyk-c, 0.55);
    }

    &--m {
      color: rgba($cmyk-m, 0.5);
    }

    &--y {
      color: rgba($cmyk-y, 0.7);
    }

    &--k {
      color: $accent-deep;
      mix-blend-mode: normal;
    }
  }

  &__ring {
    fill: none;
    stroke: currentColor;
    stroke-width: 5;

    &--thin {
      stroke-width: 2;
      stroke-dasharray: 3 4;
    }
  }

  &__arc {
    fill: currentColor;
    font-family: $font-mono;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
  }

  &__word {
    fill: currentColor;
    font-family: $font-display;
    font-size: 25px;
    font-weight: 800;
    letter-spacing: 0;
    text-transform: uppercase;
  }

  &__spec {
    @include mono-label(0.62rem, 0.18em);
    color: $ink-muted;
  }

  &__text {
    max-width: 38ch;
    font-family: $font-display;
    font-size: clamp(1.3rem, 1.1rem + 0.8vw, 1.7rem);
    font-weight: 700;
    line-height: 1.15;
    letter-spacing: -0.02em;
    color: $ink;
  }
}
</style>
