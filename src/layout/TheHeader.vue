<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { site, copy } from '@/config/site'
import { useBodyScroll } from '@/composables/useBodyScroll'
import BrandMark from '@/components/brand/BrandMark.vue'
import CmykDots from '@/components/site/CmykDots.vue'

const route = useRoute()
const open = ref(false)
const burger = ref<HTMLButtonElement | null>(null)
const panel = ref<HTMLElement | null>(null)

useBodyScroll(open)

// Al navegar se cierra el menú móvil.
watch(() => route.fullPath, () => (open.value = false))

watch(open, async (value) => {
  await nextTick()
  if (value) panel.value?.querySelector<HTMLElement>('a')?.focus()
  else burger.value?.focus({ preventScroll: true })
})

// "Inicio" solo se marca activo en la portada, no en cada ruta que empieza con "/".
function isActive(to: string) {
  return to === '/' ? route.path === '/' : route.path.startsWith(to)
}

function onKey(event: KeyboardEvent) {
  if (!open.value) return
  if (event.key === 'Escape') open.value = false
  // Mantiene el foco dentro del menú abierto.
  if (event.key === 'Tab' && panel.value) {
    const items = [burger.value, ...panel.value.querySelectorAll<HTMLElement>('a')].filter(Boolean) as HTMLElement[]
    const first = items[0]
    const last = items[items.length - 1]
    if (!first || !last) return
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <header class="header" :class="{ 'header--open': open }">
    <div class="header__inner">
      <RouterLink to="/" class="header__logo" :aria-label="copy.header.home">
        <BrandMark :tone="open ? 'light' : 'dark'" />
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

      <a :href="site.portalUrl" target="_blank" rel="noopener" class="btn btn--dark btn--sm header__portal">
        {{ site.portalCta }}
        <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
        <span class="visually-hidden">{{ copy.header.newTab }}</span>
      </a>

      <button
        ref="burger"
        type="button"
        class="header__burger"
        :aria-label="open ? copy.header.menuClose : copy.header.menuOpen"
        :aria-expanded="open"
        aria-controls="menu-movil"
        @click="open = !open"
      >
        <i :class="open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'" aria-hidden="true"></i>
      </button>
    </div>

    <Transition name="fade">
      <div v-show="open" id="menu-movil" ref="panel" class="header__panel">
        <nav class="header__mobile" :aria-label="copy.header.navLabel">
          <RouterLink
            v-for="(link, index) in site.nav"
            :key="link.to"
            :to="link.to"
            class="header__mlink"
            :class="{ 'header__mlink--active': isActive(link.to) }"
            :aria-current="isActive(link.to) ? 'page' : undefined"
          >
            <span class="header__mnum" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
            {{ link.label }}
          </RouterLink>
        </nav>
        <a :href="site.portalUrl" target="_blank" rel="noopener" class="btn btn--primary header__mportal">
          {{ site.portalCta }}
          <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
          <span class="visually-hidden">{{ copy.header.newTab }}</span>
        </a>
        <CmykDots size="md" />
      </div>
    </Transition>
  </header>
</template>

<style scoped lang="scss">
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba($paper, 0.92);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid $line;

  // backdrop-filter crea un bloque contenedor y el panel fijo quedaría
  // atrapado dentro del header: se apaga mientras el menú está abierto.
  &--open {
    background: $night;
    border-color: $night;
    backdrop-filter: none;
  }

  &__inner {
    @include container(1240px);
    @include flex(row, center, space-between, 1rem);
    min-height: 4.25rem;
    position: relative;
    z-index: 2;
  }

  &__logo {
    font-size: 0.82rem;
    margin-right: auto;
    border-radius: 4px;
    @include focus-ring;
  }

  &__nav {
    display: none;

    @include from('lg') {
      @include flex(row, center, center, 0.25rem);
    }
  }

  &__link {
    position: relative;
    padding: 0.55rem 0.7rem;
    font-size: $text-sm;
    font-weight: 600;
    color: $ink-soft;
    border-radius: 6px;
    @include transition(color);
    @include focus-ring;

    &::after {
      content: '';
      position: absolute;
      left: 0.7rem;
      right: 0.7rem;
      bottom: 0.2rem;
      height: 2px;
      background: $accent;
      transform: scaleX(0);
      transform-origin: left;
      @include transition(transform);
    }

    &:hover {
      color: $ink;
    }

    &--active {
      color: $ink;

      &::after {
        transform: scaleX(1);
      }
    }
  }

  &__portal {
    display: none;

    @include from('sm') {
      display: inline-flex;
    }
  }

  &--open &__portal {
    visibility: hidden;
  }

  &__burger {
    @include flex(row, center, center);
    width: 2.75rem;
    height: 2.75rem;
    border-radius: $radius-sm;
    font-size: 1.25rem;
    color: $ink;
    @include focus-ring;

    @include from('lg') {
      display: none;
    }
  }

  &--open &__burger {
    color: $surface;
  }

  &__panel {
    position: fixed;
    inset: 0;
    z-index: 1;
    padding: 6rem 1.25rem 2rem;
    background: $night;
    @include flex(column, stretch, flex-start, 2rem);
    overflow-y: auto;

    @include from('lg') {
      display: none !important;
    }
  }

  &__mobile {
    @include flex(column, stretch, flex-start);
  }

  &__mlink {
    @include flex(row, baseline, flex-start, 1rem);
    padding: 0.85rem 0;
    border-bottom: 1px solid rgba($surface, 0.1);
    font-family: $font-display;
    font-size: clamp(1.5rem, 1.2rem + 1.5vw, 2rem);
    font-weight: 700;
    letter-spacing: -0.01em;
    color: $surface;
    @include focus-ring;

    &--active {
      color: $accent;
    }
  }

  &__mnum {
    font-family: $font-principal;
    font-size: $text-xs;
    font-weight: 600;
    letter-spacing: 0.1em;
    color: rgba($surface, 0.55);
  }

  &__mportal {
    align-self: flex-start;
  }
}
</style>
