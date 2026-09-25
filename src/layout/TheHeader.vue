<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { site, copy, portalLink } from '@/config/site'
import { useBodyScroll } from '@/composables/useBodyScroll'
import { useHeaderScroll } from '@/composables/motion/useHeaderScroll'
import { useMenuFocus } from '@/composables/useMenuFocus'
import BrandMark from '@/components/brand/BrandMark.vue'
import SmartLink from '@/components/site/SmartLink.vue'
import TheMenu from './TheMenu.vue'

const route = useRoute()
const open = ref(false)
const root = ref<HTMLElement | null>(null)
const burger = ref<HTMLButtonElement | null>(null)
const bar = ref<HTMLElement | null>(null)

useBodyScroll(open)
const { scrolled, hidden, onDark } = useHeaderScroll(root, bar, open)

// Claro (texto blanco) sobre un bloque oscuro o con el menú abierto.
const light = computed(() => open.value || onDark.value)

// Al navegar se cierra el menú móvil.
watch(() => route.fullPath, () => (open.value = false))

useMenuFocus(open, root, burger, '#menu-movil')

// "Inicio" solo se marca activo en la portada, no en cada ruta que empieza con "/".
function isActive(to: string) {
  return to === '/' ? route.path === '/' : route.path.startsWith(to)
}
</script>

<template>
  <header
    ref="root"
    class="header"
    :class="{
      'header--open': open,
      'header--solid': scrolled && !open,
      'header--light': light,
      'header--hidden': hidden && !open,
    }"
  >
    <div class="header__inner">
      <RouterLink to="/" class="header__logo" :aria-label="copy.header.home">
        <BrandMark :tone="light ? 'light' : 'dark'" />
      </RouterLink>

      <nav class="header__nav" :aria-label="copy.header.navLabel">
        <RouterLink
          v-for="link in site.nav"
          :key="link.to"
          :to="link.to"
          class="header__link"
          :class="{ 'header__link--active': isActive(link.to) }"
          :aria-current="isActive(link.to) ? 'page' : undefined"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <!-- Sin URL del portal confirmada, «Ingresar» explica cómo pedir acceso. -->
      <SmartLink v-slot="{ external }" :to="portalLink()" class="header__portal">
        {{ site.portalCta }}
        <i class="fa-solid fa-arrow-right" :class="{ 'header__ext': external }" aria-hidden="true"></i>
      </SmartLink>

      <button
        ref="burger"
        type="button"
        class="header__burger"
        :aria-label="open ? copy.header.menuClose : copy.header.menuOpen"
        :aria-expanded="open"
        aria-controls="menu-movil"
        @click="open = !open"
      >
        <span class="header__bun" aria-hidden="true"></span>
        <span class="header__bun" aria-hidden="true"></span>
      </button>
    </div>

    <span ref="bar" class="header__progress" aria-hidden="true"></span>
    <TheMenu :open="open" />
  </header>
</template>

<style scoped lang="scss">
.header {
  position: fixed;
  inset: 0 0 auto;
  z-index: 100;
  color: $ink;
  transition:
    transform 0.45s $ease,
    background-color 0.35s ease,
    color 0.35s ease,
    box-shadow 0.35s ease;

  &--light {
    color: $surface;
  }

  // backdrop-filter y transform crean un bloque contenedor que atraparía al
  // menú fijo: solo se usan cuando el menú está cerrado.
  &--solid {
    background: rgba($paper, 0.84);
    backdrop-filter: blur(14px) saturate(1.4);
    box-shadow: 0 1px 0 rgba($ink, 0.08);
  }

  &--solid.header--light {
    background: rgba($night, 0.78);
    box-shadow: 0 1px 0 rgba($surface, 0.08);
  }

  &--hidden {
    transform: translateY(-100%);
  }

  &__inner {
    @include container(1320px);
    @include flex(row, center, space-between, 1rem);
    height: var(--header-h);
    position: relative;
    z-index: 2;
  }

  &__logo {
    font-size: 0.8rem;
    margin-right: auto;
    border-radius: 4px;
    @include focus-ring;
  }

  &__nav {
    display: none;

    @include from('lg') {
      @include flex(row, center, center, 0.15rem);
    }
  }

  &__link {
    position: relative;
    padding: 0.55rem 0.7rem;
    font-size: $text-sm;
    font-weight: 600;
    color: inherit;
    opacity: 0.78;
    border-radius: 6px;
    @include transition(opacity);
    @include focus-ring;

    &::after {
      content: '';
      position: absolute;
      left: 0.7rem;
      right: 0.7rem;
      bottom: 0.25rem;
      height: 2px;
      background: $accent;
      transform: scaleX(0);
      transform-origin: right;
      transition: transform 0.45s $ease;
    }

    &:hover {
      opacity: 1;

      &::after {
        transform: scaleX(1);
        transform-origin: left;
      }
    }

    &--active {
      opacity: 1;

      &::after {
        transform: scaleX(1);
      }
    }
  }

  &__portal {
    display: none;
    align-items: center;
    gap: 0.5rem;
    min-height: 2.6rem;
    padding: 0.5rem 1.1rem;
    border-radius: $radius-pill;
    background: $accent-deep;
    color: $surface;
    font-size: $text-sm;
    font-weight: 600;
    @include transition(background, transform);
    @include focus-ring;

    i {
      @include transition(transform);
    }

    // Flecha diagonal solo cuando sale al portal externo.
    .header__ext {
      transform: rotate(-45deg);
    }

    &:hover {
      background: $night;

      i {
        transform: translateX(2px);
      }

      .header__ext {
        transform: rotate(0);
      }
    }

    @include from('sm') {
      display: inline-flex;
    }
  }

  &--light &__portal:hover {
    background: $surface;
    color: $ink;
  }

  &--open &__portal {
    visibility: hidden;
  }

  &__burger {
    position: relative;
    width: 2.9rem;
    height: 2.9rem;
    border-radius: 50%;
    border: 1px solid currentColor;
    color: inherit;
    @include focus-ring;

    @include from('lg') {
      display: none;
    }
  }

  &__bun {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 1.1rem;
    height: 2px;
    margin-left: -0.55rem;
    background: currentColor;
    transition: transform 0.4s $ease;

    &:first-child {
      transform: translateY(-3.5px);
    }

    &:last-child {
      transform: translateY(3.5px);
    }
  }

  &--open &__bun:first-child {
    transform: rotate(45deg);
  }

  &--open &__bun:last-child {
    transform: rotate(-45deg);
  }

  &__progress {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 2px;
    background: $accent;
    transform: scaleX(0);
    transform-origin: left;
    z-index: 3;
  }

  &--open &__progress {
    opacity: 0;
  }
}
</style>
