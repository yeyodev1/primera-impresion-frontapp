<script setup lang="ts">
/**
 * PaperGrain — grano de papel sobre todo el sitio: ruido fractal en SVG
 * (data-URI en la custom property --grain-url de global.scss) a opacidad muy
 * baja. Capa fija, sin eventos de puntero y estática: no cuesta nada al
 * hacer scroll. Se monta una sola vez en App.vue.
 *
 * Para una sección concreta basta la clase global `.grain`.
 *
 * Uso: <PaperGrain />
 */
</script>

<template>
  <div class="paper-grain" aria-hidden="true"></div>
</template>

<style scoped lang="scss">
.paper-grain {
  position: fixed;
  inset: 0;
  z-index: 150;
  pointer-events: none;
  background-image: var(--grain-url);
  background-size: 180px 180px;
  opacity: 0.045;
}
</style>
