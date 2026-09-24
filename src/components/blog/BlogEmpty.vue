<script setup lang="ts">
import { ref } from 'vue'
import { fxPages } from '@/config/fx.pages'
import { gsap, useGsapContext } from '@/composables/motion/useGsap'
import CropMarks from '@/components/site/CropMarks.vue'
import RegMark from '@/components/fx/RegMark.vue'
import ColorBar from '@/components/fx/ColorBar.vue'

// Estado vacío del blog: una hoja en blanco sale de entre dos rodillos, se
// "imprimen" las líneas de texto (barras que crecen) y queda el mensaje.
// Luego los rodillos siguen girando despacio. Con reduced motion la hoja ya
// está afuera y quieta.
defineProps<{ text: string }>()

const lines = [92, 78, 86, 54]
const root = ref<HTMLElement | null>(null)

useGsapContext(root, ({ reduced, el }) => {
  if (reduced) return
  const rolls = el.querySelectorAll('.bempty__roll')
  const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 80%', once: true } })
  tl.fromTo(rolls, { backgroundPositionY: '0px' }, { backgroundPositionY: '-240px', duration: 1.6, ease: 'power2.inOut' }, 0)
    .from('.bempty__sheet', { yPercent: -102, duration: 1.6, ease: 'power2.inOut' }, 0)
    .from('.bempty__line', { scaleX: 0, transformOrigin: 'left', duration: 0.5, stagger: 0.12, ease: 'power2.out' }, 1.1)
    .from('.bempty__text, .bempty__foot', { y: 16, opacity: 0, duration: 0.7, stagger: 0.1 }, 1.4)
    // La hoja termina de salir con un leve vaivén, como papel que cae.
    .to('.bempty__sheet', { rotation: -1.2, duration: 0.5, ease: 'sine.out' }, 1.5)
    .to('.bempty__sheet', { rotation: 0, duration: 1.2, ease: 'elastic.out(1, 0.4)' }, 2)
  // Los rodillos siguen girando despacio mientras la hoja está a la vista.
  gsap.to(rolls, {
    backgroundPositionY: '-=120px',
    duration: 6,
    ease: 'none',
    repeat: -1,
    scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', toggleActions: 'play pause resume pause' },
  })
})
</script>

<template>
  <div ref="root" class="bempty">
    <div class="bempty__press" aria-hidden="true">
      <span class="bempty__roll"></span>
      <span class="bempty__label">{{ fxPages.blog.empty.press }}</span>
      <span class="bempty__roll"></span>
    </div>
    <div class="bempty__slot">
      <div class="bempty__sheet">
        <CropMarks inset="0.8rem" />
        <p class="bempty__spec" aria-hidden="true">
          <span>{{ fxPages.blog.empty.spec }}</span>
          <RegMark size="1rem" tone="ink" />
        </p>
        <span class="bempty__lines" aria-hidden="true">
          <span v-for="(w, i) in lines" :key="i" class="bempty__line" :style="{ width: `${w}%` }"></span>
        </span>
        <p class="bempty__text">{{ text }}</p>
        <div class="bempty__foot">
          <RouterLink to="/soluciones" class="bempty__cta">
            {{ fxPages.blog.empty.cta }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </RouterLink>
          <ColorBar compact class="bempty__bar" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.bempty {
  @include flex(column, center, flex-start);
  padding-block: 1rem 0;

  // Par de rodillos horizontales: el pliego sale por la línea de contacto.
  &__press {
    position: relative;
    z-index: 2;
    @include flex(row, center, center, 0.75rem);
    width: min(100%, 40rem);
  }

  &__roll {
    flex: 1;
    height: 1.6rem;
    position: relative;
    border-radius: 999px;
    // Estrías finas: al desplazar el fondo en Y parece que el cilindro gira.
    background: repeating-linear-gradient(180deg, #2a2a29 0 3px, #3c3b39 3px 6px);
    box-shadow: 0 10px 20px -8px rgba(#000, 0.45);

    // Brillo fijo del metal, encima de las estrías que se mueven.
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: linear-gradient(180deg, rgba(#fff, 0.28) 0%, transparent 40%, rgba(#000, 0.4) 100%);
    }
  }

  &__label {
    @include mono-label(0.6rem, 0.28em);
    color: $accent-deep;
    white-space: nowrap;
  }

  // Recorta la hoja: parece que sale desde debajo de los rodillos.
  &__slot {
    width: min(100% - 1.5rem, 34rem);
    margin-top: -0.7rem;
    padding: 0 2rem 5rem;
    overflow: hidden;
  }

  &__sheet {
    position: relative;
    @include flex(column, stretch, flex-start, 1.4rem);
    padding: 2.6rem 1.6rem 1.6rem;
    background: $surface;
    border-radius: 0 0 3px 3px;
    box-shadow:
      0 1px 0 rgba($ink, 0.06),
      0 34px 50px -30px rgba($ink, 0.4);
    transform-origin: 50% 0;

    @include from('md') {
      padding: 3rem 2.5rem 2rem;
    }
  }

  &__spec {
    @include flex(row, center, space-between, 1rem);
    @include mono-label(0.62rem, 0.16em);
    color: $ink-muted;
  }

  &__lines {
    @include flex(column, flex-start, flex-start, 0.6rem);
  }

  &__line {
    display: block;
    height: 0.55rem;
    border-radius: 2px;
    background: $sand;
  }

  &__text {
    font-family: $font-display;
    font-size: clamp(1.5rem, 1.15rem + 1.3vw, 2.2rem);
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -0.025em;
    text-wrap: balance;
    color: $ink;
  }

  &__foot {
    @include flex(row, center, space-between, 1rem);
    flex-wrap: wrap;
    padding-top: 1rem;
    border-top: 1px dashed $line;
  }

  &__cta {
    @include flex(row, center, flex-start, 0.5rem);
    min-height: 44px;
    font-weight: 700;
    color: $ink;
    background: linear-gradient($accent, $accent) no-repeat 0 85% / 100% 2px;
    transition: background-size 0.45s $ease;
    @include focus-ring;

    i {
      color: $accent-deep;
      @include transition(transform);
    }

    &:hover {
      background-size: 0% 2px;
      background-position: 100% 85%;

      i {
        transform: translateX(4px);
      }
    }
  }

  &__bar {
    max-width: 7rem;
  }
}
</style>
