<script setup lang="ts">
import { site, fxCatalog } from '@/config/site'
import { ref } from 'vue'
import CropMarks from '@/components/site/CropMarks.vue'
import RegMark from '@/components/fx/RegMark.vue'
import PortalOrder from './PortalOrder.vue'
import { usePortalDemo } from './usePortalDemo'

// Interfaz simulada de «Mis productos» en el Portal de Clientes, hecha con
// CSS y animada con GSAP: pestañas de los dos catálogos, productos que se
// reordenan, "Repetir pedido" que se pulsa solo y el estado del pedido que
// avanza. Es una ilustración (role="img"): usa productos del catálogo
// público, nunca datos de clientes.
const p = fxCatalog.autogestion.portal
const card = site.autogestion.heroCard
const root = ref<HTMLElement | null>(null)
const { order, step, pressed } = usePortalDemo(root, p.items.length, p.status.length)
</script>

<template>
  <div ref="root" class="portal" role="img" :aria-label="p.label">
    <CropMarks tone="light" inset="0" />
    <RegMark class="portal__reg" size="1.1rem" tone="light" />
    <div class="portal__window" aria-hidden="true">
      <div class="portal__bar">
        <span class="portal__dots"><i></i><i></i><i></i></span>
        <span class="portal__url"><i class="fa-solid fa-lock"></i> {{ p.url }}</span>
      </div>

      <div class="portal__tabs">
        <span class="portal__tab">{{ p.tabs[0] }}</span>
        <span class="portal__tab portal__tab--on">{{ p.tabs[1] }}</span>
        <span class="portal__pill">{{ card.pill }}</span>
      </div>

      <div class="portal__head">
        <p class="portal__title">
          {{ card.title }} <span class="portal__badge">{{ p.exclusive }}</span>
        </p>
        <p class="portal__text">{{ card.text }}</p>
      </div>

      <ul class="portal__list">
        <li v-for="(idx, pos) in order" :key="idx" class="portal__row" :data-flip-id="`row-${idx}`">
          <span class="portal__thumb"><i :class="p.items[idx]!.icon"></i></span>
          <span class="portal__name">{{ p.items[idx]!.name }}</span>
          <span v-if="pos === 0" class="portal__repeat" :class="{ 'portal__repeat--on': pressed }">
            <i class="fa-solid fa-rotate"></i> {{ p.repeat }}
          </span>
          <span v-else class="portal__ghost"><i class="fa-solid fa-rotate"></i></span>
        </li>
        <span class="portal__cursor"><i class="fa-solid fa-arrow-pointer"></i></span>
      </ul>

      <PortalOrder :step="step" :status="p.status" :label="p.order" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.portal {
  position: relative;
  width: 100%;
  max-width: 29rem;
  padding: 1.4rem;

  &__reg {
    position: absolute;
    top: -0.1rem;
    left: 50%;
    margin-left: -0.55rem;
  }

  &__window {
    overflow: hidden;
    border-radius: 6px;
    background: $surface;
    color: $ink;
    box-shadow:
      0 1px 0 rgba(#000, 0.1),
      0 40px 80px -20px rgba(#000, 0.6);
    transform: rotate(-1.5deg);

    @include reduced-motion {
      transform: none;
    }
  }

  &__bar {
    @include flex(row, center, flex-start, 0.9rem);
    padding: 0.6rem 0.9rem;
    background: $sand;
    border-bottom: 1px solid $line;
  }

  &__dots {
    @include flex(row, center, flex-start, 0.3rem);

    i {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      background: rgba($ink, 0.2);
    }
  }

  &__url {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    padding: 0.25rem 0.6rem;
    border-radius: 3px;
    background: $surface;
    white-space: nowrap;
    text-overflow: ellipsis;
    @include mono-label(0.56rem, 0.06em);
    text-transform: none;
    color: $ink-soft;

    i {
      margin-right: 0.3rem;
      color: $success;
    }
  }

  &__tabs {
    @include flex(row, flex-end, flex-start, 1rem);
    padding: 0.8rem 1rem 0;
    border-bottom: 1px solid $line;
  }

  &__tab {
    white-space: nowrap;
    padding-bottom: 0.55rem;
    font-size: 0.74rem;
    font-weight: 600;
    color: $ink-muted;
    border-bottom: 2px solid transparent;

    &--on {
      color: $ink;
      border-bottom-color: $accent;
    }
  }

  &__pill {
    display: none;
    margin: 0 0 0.5rem auto;
    @include mono-label(0.5rem, 0.12em);
    color: darken($accent-deep, 4%);

    @include from('sm') {
      display: block;
    }
  }

  &__head {
    padding: 0.9rem 1rem 0.4rem;
  }

  &__title {
    @include flex(row, center, flex-start, 0.5rem);
    font-family: $font-display;
    font-weight: 800;
    font-size: 1.3rem;
    letter-spacing: -0.02em;
  }

  &__badge {
    padding: 0.15rem 0.4rem;
    border-radius: 2px;
    background: $night;
    color: $surface;
    @include mono-label(0.5rem, 0.12em);
  }

  &__text {
    font-size: 0.74rem;
    line-height: 1.45;
    color: $ink-soft;
  }

  &__list {
    position: relative;
    list-style: none;
    @include flex(column, stretch, flex-start, 0.4rem);
    padding: 0.5rem 1rem 0.8rem;
  }

  &__row {
    @include flex(row, center, flex-start, 0.65rem);
    padding: 0.45rem 0.5rem;
    border-radius: 4px;
    background: $paper;
    box-shadow: 0 0 0 1px rgba($ink, 0.06);

    &:first-child {
      box-shadow: 0 0 0 1px rgba($accent, 0.55);
    }
  }

  &__thumb {
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 1.9rem;
    height: 1.9rem;
    border-radius: 3px;
    @include halftone-pattern(rgba($ink, 0.14), 5px, 0.8px);
    background-color: $sand;
    color: $accent-deep;
    font-size: 0.8rem;
  }

  &__name {
    flex: 1;
    min-width: 0;
    font-size: 0.76rem;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__repeat {
    flex-shrink: 0;
    @include flex(row, center, center, 0.3rem);
    padding: 0.35rem 0.55rem;
    border-radius: 999px;
    background: $accent-deep;
    color: $surface;
    font-size: 0.64rem;
    font-weight: 700;
    white-space: nowrap;
    transition: box-shadow 0.4s ease;

    &--on {
      box-shadow: 0 0 0 5px rgba($accent, 0.25);
    }
  }

  &__ghost {
    flex-shrink: 0;
    font-size: 0.65rem;
    color: $ink-muted;
    padding-right: 0.45rem;
  }

  // El cursor descansa sobre el botón de la primera fila; la animación lo trae.
  &__cursor {
    position: absolute;
    top: 1.55rem;
    right: 1.6rem;
    font-size: 1.05rem;
    color: $night;
    filter: drop-shadow(0 2px 2px rgba(#000, 0.3));
    opacity: 0;
    pointer-events: none;
  }
}
</style>
