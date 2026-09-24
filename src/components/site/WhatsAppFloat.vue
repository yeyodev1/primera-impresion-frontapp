<script setup lang="ts">
import { site, whatsappLink, copy } from '@/config/site'
</script>

<template>
  <a
    v-if="site.whatsapp"
    :href="whatsappLink()"
    class="wa-float"
    target="_blank"
    rel="noopener"
    :aria-label="`${copy.whatsappFloat} ${copy.header.newTab}`"
  >
    <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
    <span class="wa-float__label">{{ copy.whatsappFloat }}</span>
  </a>
</template>

<style scoped lang="scss">
.wa-float {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  z-index: 80;
  @include flex(row, center, center, 0.6rem);
  min-width: 3.4rem;
  height: 3.4rem;
  padding: 0 1rem;
  border-radius: $radius-pill;
  background: #1f7a4d;
  color: $surface;
  box-shadow: 0 10px 28px rgba(#000, 0.25);
  @include transition;
  @include focus-ring($ink);

  i {
    font-size: 1.6rem;
  }

  &__label {
    display: none;
    font-weight: 600;
    font-size: $text-sm;

    @include from('lg') {
      display: inline;
    }
  }

  &:hover {
    background: #17613c;
    transform: translateY(-2px);
  }

  @include from('md') {
    right: 1.5rem;
    bottom: 1.5rem;
  }
}
</style>
