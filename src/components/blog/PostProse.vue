<script setup lang="ts">
// Cuerpo del artículo con tipografía de revista: capitular entintada en el
// primer párrafo, h2 con numeración mono de sección (§ 01), viñetas con
// marca de registro, negritas con resaltador y citas grandes.
// renderMarkdown escapa el HTML antes de transformar: seguro para v-html.
defineProps<{ html: string }>()
</script>

<template>
  <div class="prose" v-html="html"></div>
</template>

<style scoped lang="scss">
.prose {
  counter-reset: sec;
  width: 100%;
  max-width: 42rem;
  font-size: clamp(1.05rem, 0.98rem + 0.3vw, 1.18rem);
  line-height: 1.78;
  color: $ink;

  :deep(* + *) {
    margin-top: 1.15em;
  }

  // Capitular: la primera letra del primer párrafo, grande y con desregistro.
  :deep(p:first-child::first-letter) {
    float: left;
    margin: 0.06em 0.12em 0 -0.02em;
    font-family: $font-display;
    font-size: 4.6em;
    font-weight: 800;
    line-height: 0.78;
    color: $accent-deep;
    text-shadow:
      -0.03em -0.01em 0 rgba($cmyk-c, 0.45),
      0.03em 0.012em 0 rgba($cmyk-m, 0.4);
  }

  :deep(p:first-child) {
    font-size: 1.12em;
    line-height: 1.7;
    color: $ink;
  }

  :deep(h2) {
    counter-increment: sec;
    position: relative;
    margin-top: 2.6em;
    padding-top: 1.1rem;
    border-top: 1px solid $ink;
    font-family: $font-display;
    font-size: clamp(1.7rem, 1.25rem + 1.6vw, 2.5rem);
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -0.03em;
    text-wrap: balance;
    scroll-margin-top: 6rem;

    // Número de sección en mono sobre el filete, como en una hoja técnica.
    &::before {
      content: '§ ' counter(sec, decimal-leading-zero);
      display: block;
      margin-bottom: 0.9rem;
      @include mono-label(0.66rem, 0.18em);
      color: darken($accent-deep, 4%);
    }
  }

  :deep(h2 + *) {
    margin-top: 0.9em;
  }

  :deep(h3) {
    margin-top: 1.9em;
    font-family: $font-display;
    font-size: $text-xl;
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  :deep(ul),
  :deep(ol) {
    list-style: none;
    padding-left: 0;
  }

  :deep(li) {
    position: relative;
    padding-left: 2rem;
  }

  :deep(li + li) {
    margin-top: 0.55em;
  }

  // Viñeta: marca de registro (⊕) en naranja profundo.
  :deep(ul > li::before) {
    content: '';
    position: absolute;
    left: 0.1rem;
    top: 0.42em;
    width: 1rem;
    height: 1rem;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40' fill='none' stroke='%23b8471a' stroke-width='3'%3E%3Ccircle cx='20' cy='20' r='11'/%3E%3Cpath d='M20 0v40M0 20h40'/%3E%3C/svg%3E")
      no-repeat center / contain;
  }

  :deep(ol) {
    counter-reset: item;
  }

  :deep(ol > li) {
    counter-increment: item;
  }

  :deep(ol > li::before) {
    content: counter(item, decimal-leading-zero);
    position: absolute;
    left: 0;
    top: 0.35em;
    @include mono-label(0.72rem, 0.06em);
    color: $accent-deep;
  }

  // Negrita con resaltador naranja en la parte baja de la línea.
  :deep(strong) {
    font-weight: 700;
    color: $ink;
    background: linear-gradient(transparent 62%, rgba($accent, 0.28) 62%);
  }

  :deep(a) {
    color: darken($accent-deep, 6%);
    font-weight: 600;
    text-decoration: underline;
    text-decoration-thickness: 1.5px;
    text-underline-offset: 3px;

    &:hover {
      color: $ink;
    }
  }

  :deep(blockquote) {
    position: relative;
    margin-block: 2em;
    padding: 0.4rem 0 0.4rem 1.6rem;
    border-left: 3px solid $accent;
    font-family: $font-display;
    font-size: 1.45em;
    font-weight: 700;
    line-height: 1.25;
    letter-spacing: -0.02em;
  }
}
</style>
