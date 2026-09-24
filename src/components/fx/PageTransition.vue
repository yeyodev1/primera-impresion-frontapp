<script setup lang="ts">
/**
 * PageTransition — cortina entre rutas: un pliego naranja y otro negro suben
 * y cubren la pantalla (~260 ms), la ruta cambia debajo (con el salto de
 * scroll escondido) y la cortina se retira hacia arriba (~340 ms).
 *
 * Funciona con guardas del router: `beforeEach` espera a que la cortina
 * cubra y `afterEach` la retira. Nunca bloquea: si algo falla o la
 * navegación se cancela, la cortina se retira igual. No actúa en la primera
 * carga, en cambios de query/hash dentro de la misma página, en el panel
 * admin ni con reduced motion.
 *
 * Se monta una sola vez en App.vue: <PageTransition />
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { fx } from '@/config/site'
import { gsap, prefersReducedMotion, refreshScroll } from '@/composables/motion/useGsap'
import RegMark from './RegMark.vue'

const router = useRouter()
const root = ref<HTMLElement | null>(null)
let covered = false
let removers: Array<() => void> = []

function panels() {
  return root.value ? Array.from(root.value.querySelectorAll<HTMLElement>('.curtain__panel')) : []
}

function cover(): Promise<void> {
  return new Promise((resolve) => {
    const [accent, night] = panels()
    if (!accent || !night) return resolve()
    covered = true
    gsap.killTweensOf([accent, night])
    gsap.set(root.value, { visibility: 'visible' })
    gsap
      .timeline({ onComplete: resolve })
      .fromTo(accent, { yPercent: 100 }, { yPercent: 0, duration: 0.26, ease: 'power3.in' })
      .fromTo(night, { yPercent: 100 }, { yPercent: 0, duration: 0.26, ease: 'power3.in' }, 0.06)
      .fromTo('.curtain__mark', { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.2 }, 0.18)
    // Red de seguridad: si la timeline no termina (pestaña oculta), no se bloquea la navegación.
    window.setTimeout(resolve, 450)
  })
}

function uncover() {
  if (!covered) return
  covered = false
  const [accent, night] = panels()
  gsap
    .timeline({
      delay: 0.05,
      onComplete: () => {
        gsap.set(root.value, { visibility: 'hidden' })
        refreshScroll()
      },
    })
    .to('.curtain__mark', { opacity: 0, duration: 0.12 })
    .to(night!, { yPercent: -100, duration: 0.34, ease: 'power3.out' }, 0.04)
    .to(accent!, { yPercent: -100, duration: 0.34, ease: 'power3.out' }, 0.1)
}

onMounted(() => {
  removers = [
    router.beforeEach(async (to, from) => {
      const firstLoad = from.matched.length === 0
      const samePage = to.path === from.path
      const admin = to.meta.layout === 'admin' || from.meta.layout === 'admin'
      if (firstLoad || samePage || admin || prefersReducedMotion() || document.hidden) return
      await cover()
    }),
    router.afterEach(() => {
      // Espera al render de la vista nueva antes de retirar la cortina.
      requestAnimationFrame(() => requestAnimationFrame(uncover))
    }),
    router.onError(() => uncover()),
  ]
})

onBeforeUnmount(() => removers.forEach((remove) => remove()))
</script>

<template>
  <div ref="root" class="curtain" aria-hidden="true">
    <span class="curtain__panel curtain__panel--accent"></span>
    <span class="curtain__panel curtain__panel--night">
      <span class="curtain__mark">
        <RegMark size="2.25rem" tone="accent" />
        <span class="curtain__label">{{ fx.transition.label }}</span>
      </span>
    </span>
  </div>
</template>

<style scoped lang="scss">
.curtain {
  position: fixed;
  inset: 0;
  z-index: 300;
  pointer-events: none;
  visibility: hidden;
  overflow: hidden;

  &__panel {
    position: absolute;
    inset: 0;
    transform: translateY(100%);

    &--accent {
      background: $accent;
    }

    &--night {
      background: $night;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  &__mark {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.9rem;
    opacity: 0;
  }

  &__label {
    @include mono-label(0.68rem, 0.3em);
    color: rgba($surface, 0.7);
  }
}
</style>
