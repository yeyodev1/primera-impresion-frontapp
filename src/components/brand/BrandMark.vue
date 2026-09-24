<script setup lang="ts">
// Logo de Primera Impresión redibujado del manual de marca: el isotipo "P" con
// el pulgar arriba y el logotipo en dos líneas. En SVG + texto para que se vea
// nítido en cualquier tamaño y tenga versión clara para fondos oscuros.
withDefaults(defineProps<{ tone?: 'dark' | 'light'; tagline?: boolean }>(), {
  tone: 'dark',
  tagline: false,
})
</script>

<template>
  <span class="brand" :class="`brand--${tone}`">
    <svg class="brand__icon" viewBox="0 0 215 365" aria-hidden="true">
      <path
        fill-rule="evenodd"
        d="M0 0H122A121 121 0 0 1 139 240V212A12 12 0 0 0 127 200H115A12 12 0 0 0 103 212V363H0ZM122 90A30 30 0 1 0 122.01 90Z"
      />
      <rect x="144" y="260" width="61" height="20" rx="8" />
      <rect x="144" y="288" width="71" height="20" rx="8" />
      <rect x="144" y="315" width="63" height="20" rx="8" />
      <rect x="144" y="342" width="54" height="21" rx="8" />
    </svg>
    <span class="brand__text">
      <span class="brand__word">Primera</span>
      <span class="brand__word">Impresión</span>
      <span v-if="tagline" class="brand__tagline">¡Es la que cuenta!</span>
    </span>
  </span>
</template>

<style scoped lang="scss">
.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.55em;
  font-size: 1rem;

  &__icon {
    height: 2.35em;
    width: auto;
    fill: $accent;
    flex-shrink: 0;
  }

  &__text {
    display: flex;
    flex-direction: column;
  }

  &__word {
    font-family: $font-display;
    font-weight: 800;
    font-size: 1.08em;
    line-height: 0.95;
    letter-spacing: 0.01em;
    text-transform: uppercase;
    color: $graphite;
  }

  &__tagline {
    margin-top: 0.3em;
    font-family: $font-principal;
    font-style: italic;
    font-size: 0.72em;
    color: $accent;
  }

  &--light &__word {
    color: $surface;
  }
}
</style>
