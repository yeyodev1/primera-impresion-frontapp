<script setup lang="ts">
/**
 * RegisterTitle — titular con efecto de registro CMYK.
 *
 * Tres copias del texto en cian, magenta y amarillo entran desplazadas
 * ("desregistradas") y se alinean sobre la tinta final, como una prensa que
 * calibra. Las palabras suben desde una máscara. Sin JS o con reduced motion
 * se ve el titular normal: las copias de color empiezan invisibles por CSS.
 *
 * Props:
 *   text     texto a partir en palabras (si no, usa el slot sin partir)
 *   as       'h1' | 'h2' | 'h3' | 'p'           (default 'h2')
 *   size     'hero' | 'xl' | 'lg' | 'md'         (default 'lg')
 *   tone     'paper' | 'night' | 'accent'        fondo sobre el que va
 *   accent   fragmento del texto que va en naranja
 *   trigger  'scroll' | 'load'                   cuándo se alinea (default 'scroll')
 *   delay    segundos antes de empezar (solo 'load')
 *   drift    al salir de pantalla con el scroll las tintas se vuelven a separar
 *   hover    desregistro leve en hover (para titulares que son enlaces)
 *
 * Uso: <RegisterTitle as="h1" size="hero" tone="night" :text="site.home.title" :accent="fx.hero.accent" trigger="load" drift />
 */
import { computed, ref } from 'vue'
import { splitWords } from '@/composables/motion/split'
import { gsap, useGsapContext } from '@/composables/motion/useGsap'

const props = withDefaults(
  defineProps<{
    text?: string
    as?: 'h1' | 'h2' | 'h3' | 'p'
    size?: 'hero' | 'xl' | 'lg' | 'md'
    tone?: 'paper' | 'night' | 'accent'
    accent?: string
    trigger?: 'scroll' | 'load'
    delay?: number
    drift?: boolean
    hover?: boolean
  }>(),
  { as: 'h2', size: 'lg', tone: 'paper', trigger: 'scroll', delay: 0 },
)

const words = computed(() => (props.text ? splitWords(props.text, props.accent) : []))
const inks = ['c', 'm', 'y'] as const
// Desplazamiento inicial de cada tinta, en em para que escale con el titular.
const OFFSETS = { c: [-0.07, -0.03], m: [0.06, 0.025], y: [0.02, 0.07] } as const

const root = ref<HTMLElement | null>(null)

useGsapContext(root, ({ reduced, self, el }) => {
  if (reduced) return
  const fontSize = parseFloat(getComputedStyle(el).fontSize) || 48
  const layers = inks.map((ink) => el.querySelector<HTMLElement>(`.reg__ink--${ink}`)).filter(Boolean) as HTMLElement[]
  const allWords = el.querySelectorAll<HTMLElement>('.reg__word')

  const tl = gsap.timeline({
    delay: props.trigger === 'load' ? props.delay : 0,
    scrollTrigger: props.trigger === 'scroll' ? { trigger: el, start: 'top 85%', once: true } : undefined,
  })

  if (allWords.length) {
    tl.from(allWords, {
      yPercent: 115,
      rotate: 4,
      duration: 1,
      ease: 'expo.out',
      stagger: (_i, target: HTMLElement) => Number(target.dataset.i) * 0.07,
    })
  }

  layers.forEach((layer, i) => {
    const [x, y] = OFFSETS[inks[i]!]
    tl.fromTo(
      layer,
      { x: x * fontSize, y: y * fontSize, opacity: 0.9 },
      { x: 0, y: 0, duration: 1.3, ease: 'expo.inOut' },
      0.15,
    )
  })
  // Registradas, las tintas se funden en la tinta final y se retiran.
  tl.to(layers, { opacity: 0, duration: 0.5, ease: 'power1.out' }, '>-0.25')
  tl.set(layers, { clearProps: 'all' })

  if (props.drift) {
    tl.eventCallback('onComplete', () => {
      self.add(() => {
        layers.forEach((layer, i) => {
          const [x, y] = OFFSETS[inks[i]!]
          gsap.fromTo(
            layer,
            { x: 0, y: 0, opacity: 0 },
            {
              x: x * fontSize * 1.6,
              y: y * fontSize * 1.6,
              opacity: 0.85,
              ease: 'none',
              scrollTrigger: { trigger: el, start: 'top 20%', end: 'bottom top', scrub: 0.6 },
            },
          )
        })
      })
    })
  }
})
</script>

<template>
  <component
    :is="as"
    ref="root"
    class="reg"
    :class="[`reg--${size}`, `reg--${tone}`, { 'reg--hover': hover }]"
  >
    <span v-if="text" class="visually-hidden">{{ text }}</span>
    <span class="reg__base" :aria-hidden="text ? 'true' : undefined">
      <template v-if="text">
        <template v-for="word in words" :key="word.index">
          <span class="reg__mask"><span class="reg__word" :class="{ 'reg__word--accent': word.accent }" :data-i="word.index">{{ word.text }}</span></span>{{ ' ' }}
        </template>
      </template>
      <slot v-else />
    </span>
    <span v-for="ink in inks" :key="ink" class="reg__ink" :class="`reg__ink--${ink}`" aria-hidden="true">
      <template v-if="text">
        <template v-for="word in words" :key="word.index">
          <span class="reg__mask"><span class="reg__word" :data-i="word.index">{{ word.text }}</span></span>{{ ' ' }}
        </template>
      </template>
      <slot v-else />
    </span>
  </component>
</template>

<style scoped lang="scss">
.reg {
  position: relative;
  font-family: $font-display;
  font-weight: 800;
  line-height: 0.94;
  letter-spacing: -0.035em;
  text-wrap: balance;
  color: $ink;

  &--hero {
    font-size: $display-hero;
    line-height: 0.9;
    letter-spacing: -0.045em;
  }

  &--xl {
    font-size: $display-xl;
    letter-spacing: -0.04em;
  }

  &--lg {
    font-size: clamp(2.2rem, 1.1rem + 3.9vw, 4.6rem);
  }

  &--md {
    font-size: clamp(1.8rem, 1.2rem + 2.2vw, 3rem);
  }

  &--night {
    color: $surface;
  }

  &--accent {
    color: $night;
  }

  &__base {
    position: relative;
    display: block;
  }

  // La máscara deja aire para tildes y descendentes sin mover la caja.
  &__mask {
    display: inline-block;
    overflow: hidden;
    vertical-align: top;
    padding: 0.12em 0.04em 0.1em;
    margin: -0.12em -0.04em -0.1em;
  }

  &__word {
    display: inline-block;
    will-change: transform;

    &--accent {
      color: $accent-deep;
    }
  }

  &--night &__word--accent {
    color: $accent;
  }

  &--accent &__word--accent {
    color: $surface;
  }

  &__ink {
    position: absolute;
    inset: 0;
    display: block;
    pointer-events: none;
    opacity: 0;
    mix-blend-mode: multiply;
    transition:
      opacity 0.35s ease,
      transform 0.35s $ease;

    &--c {
      color: $cmyk-c;
    }

    &--m {
      color: $cmyk-m;
    }

    &--y {
      color: $cmyk-y;
    }
  }

  // Sobre fondo oscuro las tintas suman luz: se ven al separarse y dan blanco al alinearse.
  &--night &__ink {
    mix-blend-mode: screen;
  }

  &--hover:hover &__ink {
    opacity: 0.8;

    &--c {
      transform: translate(-0.03em, -0.012em);
    }

    &--m {
      transform: translate(0.025em, 0.01em);
    }

    &--y {
      transform: translate(0.01em, 0.03em);
    }
  }

  @include reduced-motion {
    &__ink {
      display: none;
    }
  }
}
</style>
