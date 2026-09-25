<script setup lang="ts">
import { useRoute } from 'vue-router'
import { site, copy, fx, whatsappLink, portalLink, hasDirectContact } from '@/config/site'
import { gsap, prefersReducedMotion } from '@/composables/motion/useGsap'
import HalftoneBg from '@/components/site/HalftoneBg.vue'
import RegMark from '@/components/fx/RegMark.vue'
import ColorBar from '@/components/fx/ColorBar.vue'
import SmartLink from '@/components/site/SmartLink.vue'

// Menú móvil a pantalla completa. El header controla abrir/cerrar, el foco
// y Escape; este componente solo pinta y anima la entrada.
defineProps<{ open: boolean }>()

const route = useRoute()
function isActive(to: string) {
  return to === '/' ? route.path === '/' : route.path.startsWith(to)
}

function onEnter(el: Element, done: () => void) {
  if (prefersReducedMotion()) return done()
  gsap
    .timeline({ onComplete: done })
    .fromTo(el, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, ease: 'expo.inOut' })
    .from(el.querySelectorAll('.menu__word'), { yPercent: 110, duration: 0.8, ease: 'expo.out', stagger: 0.05 }, 0.3)
    // fromTo con destino explícito: el botón del portal (.btn con transición CSS)
    // quedaba con opacidad 0 al leer su valor final a mitad de transición.
    .fromTo(
      el.querySelectorAll('.menu__foot > *'),
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, clearProps: 'transform,opacity' },
      0.55,
    )
}

function onLeave(el: Element, done: () => void) {
  if (prefersReducedMotion()) return done()
  gsap.to(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.45, ease: 'expo.inOut', onComplete: done })
}
</script>

<template>
  <Transition :css="false" @enter="onEnter" @leave="onLeave">
    <div v-if="open" id="menu-movil" class="menu">
      <HalftoneBg />
      <RegMark class="menu__reg" size="9rem" tone="light" />
      <nav class="menu__nav" :aria-label="copy.header.navLabel">
        <RouterLink
          v-for="(link, index) in site.nav"
          :key="link.to"
          :to="link.to"
          class="menu__link"
          :class="{ 'menu__link--active': isActive(link.to) }"
          :aria-current="isActive(link.to) ? 'page' : undefined"
        >
          <span class="menu__mask">
            <span class="menu__word">
              <span class="menu__num" aria-hidden="true">{{ fx.index(index + 1) }}</span>
              {{ link.label }}
            </span>
          </span>
        </RouterLink>
      </nav>

      <div class="menu__foot">
        <!-- Datos directos solo cuando Primera Impresión los confirme en site.ts. -->
        <template v-if="hasDirectContact">
          <p class="menu__label">{{ fx.menu.contact }}</p>
          <a v-if="site.phone" :href="site.phoneHref" class="menu__contact">{{ site.phone }}</a>
          <a v-if="site.email" :href="`mailto:${site.email}`" class="menu__contact">{{ site.email }}</a>
          <SmartLink v-if="site.whatsapp" :to="whatsappLink()" class="menu__contact">
            <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> {{ copy.footer.whatsapp }}
          </SmartLink>
          <p v-if="site.address" class="menu__address">{{ site.address }}</p>
        </template>
        <SmartLink :to="portalLink()" class="btn btn--primary btn--press menu__portal">
          {{ site.footer.portal }}
          <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
        </SmartLink>
        <ColorBar tone="night" compact />
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.menu {
  position: fixed;
  inset: 0;
  z-index: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
  background: $night;
  color: $surface;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2.5rem;
  padding: calc(var(--header-h) + 1.5rem) 1.25rem 2rem;

  @include from('md') {
    padding-inline: 2rem;
  }

  @include from('lg') {
    display: none;
  }

  &__reg {
    position: absolute;
    right: -2.5rem;
    top: 38%;
    opacity: 0.35;
  }

  &__nav {
    position: relative;
    display: flex;
    flex-direction: column;
  }

  &__link {
    display: block;
    padding-block: 0.3rem;
    border-bottom: 1px solid rgba($surface, 0.08);
    font-family: $font-display;
    font-weight: 800;
    font-size: clamp(2.1rem, 1.2rem + 5vw, 3.8rem);
    line-height: 1.05;
    letter-spacing: -0.035em;
    color: $surface;
    @include focus-ring;

    &--active {
      color: $accent;
    }
  }

  &__mask {
    display: block;
    overflow: hidden;
    padding-block: 0.08em;
  }

  &__word {
    display: flex;
    align-items: baseline;
    gap: 0.9rem;
  }

  &__num {
    @include mono-label(0.68rem, 0.1em);
    color: rgba($surface, 0.5);
    transform: translateY(-0.9em);
  }

  &__foot {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.45rem;
  }

  &__label {
    @include mono-label(0.66rem, 0.22em);
    color: $accent;
    margin-bottom: 0.3rem;
  }

  &__contact {
    font-size: $text-lg;
    font-weight: 600;
    color: $surface;
    @include focus-ring;
  }

  &__address {
    font-size: $text-sm;
    color: rgba($surface, 0.6);
  }

  &__portal {
    margin-block: 1rem 1.25rem;
  }
}
</style>
