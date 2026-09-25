<script setup lang="ts">
import { site, whatsappLink, copy, fx } from '@/config/site'

// Acceso fijo a WhatsApp: botón redondo con un pulso sutil (se apaga con
// reduced motion) y un globo de ayuda que aparece en hover o con el foco.
// Oculto mientras no haya número confirmado en site.ts.
</script>

<template>
  <a
    v-if="site.whatsapp"
    :href="whatsappLink()"
    class="wa"
    target="_blank"
    rel="noopener"
    :aria-label="`${copy.whatsappFloat} ${copy.header.newTab}`"
  >
    <span class="wa__pulse" aria-hidden="true"></span>
    <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
    <span class="wa__tip" aria-hidden="true">
      <strong>{{ copy.whatsappFloat }}</strong>
      {{ fx.whatsapp.tooltip }}
    </span>
  </a>
</template>

<style scoped lang="scss">
$wa: #1f7a4d;

.wa {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  z-index: 80;
  @include flex(row, center, center);
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background: $wa;
  color: $surface;
  box-shadow:
    0 12px 30px -8px rgba(#000, 0.45),
    inset 0 0 0 1px rgba($surface, 0.15);
  transition: transform 0.5s $ease;
  @include focus-ring($accent);

  @include from('md') {
    right: 1.5rem;
    bottom: 1.5rem;
    width: 3.9rem;
    height: 3.9rem;
  }

  i {
    position: relative;
    font-size: 1.7rem;
  }

  &:hover {
    transform: scale(1.06) rotate(-6deg);
  }

  &__pulse {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    border: 2px solid $wa;
    animation: wa-pulse 2.8s $ease infinite;
    pointer-events: none;

    @include reduced-motion {
      display: none;
    }
  }

  &__tip {
    position: absolute;
    right: calc(100% + 0.85rem);
    bottom: 50%;
    width: max-content;
    max-width: 15rem;
    padding: 0.8rem 1rem;
    border-radius: 6px 6px 0 6px;
    background: $night;
    color: rgba($surface, 0.8);
    font-size: $text-sm;
    line-height: 1.4;
    text-align: left;
    box-shadow: 0 18px 40px -16px rgba(#000, 0.5);
    opacity: 0;
    transform: translate(8px, 50%);
    pointer-events: none;
    transition:
      opacity 0.3s ease,
      transform 0.45s $ease;

    strong {
      display: block;
      margin-bottom: 0.15rem;
      color: $surface;
      font-weight: 700;
    }
  }

  &:hover &__tip,
  &:focus-visible &__tip {
    opacity: 1;
    transform: translate(0, 50%);
  }

  @include until('md') {
    &__tip {
      display: none;
    }
  }
}

@keyframes wa-pulse {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  70%,
  100% {
    transform: scale(1.55);
    opacity: 0;
  }
}
</style>
