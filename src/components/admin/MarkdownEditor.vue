<script setup lang="ts">
import { computed, ref } from 'vue'
import { renderMarkdown } from '@/utils/markdown'

const content = defineModel<string>({ required: true })
const tab = ref<'write' | 'preview'>('write')
const showHelp = ref(false)

// renderMarkdown escapa el HTML antes de transformar: seguro para v-html.
const html = computed(() => renderMarkdown(content.value))
const words = computed(() => content.value.trim().split(/\s+/).filter(Boolean).length)

const help = [
  { syntax: '## Subtítulo', result: 'Título de sección' },
  { syntax: '### Subtítulo menor', result: 'Título más pequeño' },
  { syntax: '**texto**', result: 'Negrita' },
  { syntax: '*texto*', result: 'Cursiva' },
  { syntax: '- elemento', result: 'Lista con viñetas' },
  { syntax: '1. elemento', result: 'Lista numerada' },
  { syntax: '[texto](https://…)', result: 'Enlace' },
  { syntax: 'Línea en blanco', result: 'Nuevo párrafo' },
]
</script>

<template>
  <section class="md">
    <div class="md__bar">
      <div class="md__tabs" role="tablist">
        <button
          type="button"
          role="tab"
          class="md__tab"
          :class="{ 'md__tab--active': tab === 'write' }"
          :aria-selected="tab === 'write'"
          @click="tab = 'write'"
        >
          <i class="fa-solid fa-pen"></i> Escribir
        </button>
        <button
          type="button"
          role="tab"
          class="md__tab"
          :class="{ 'md__tab--active': tab === 'preview' }"
          :aria-selected="tab === 'preview'"
          @click="tab = 'preview'"
        >
          <i class="fa-regular fa-eye"></i> Vista previa
        </button>
      </div>
      <button
        type="button"
        class="md__help-toggle"
        :aria-expanded="showHelp"
        @click="showHelp = !showHelp"
      >
        <i class="fa-regular fa-circle-question"></i> Ayuda de formato
      </button>
    </div>

    <Transition name="fade">
      <ul v-if="showHelp" class="md__help">
        <li v-for="item in help" :key="item.syntax">
          <code>{{ item.syntax }}</code>
          <span>{{ item.result }}</span>
        </li>
      </ul>
    </Transition>

    <label for="post-content" class="visually-hidden">Contenido del artículo</label>
    <textarea
      v-show="tab === 'write'"
      id="post-content"
      v-model="content"
      class="md__area"
      placeholder="Escribe el artículo. Usa ## para los subtítulos y deja una línea en blanco entre párrafos."
    ></textarea>
    <div
      v-show="tab === 'preview'"
      class="md__preview"
      v-html="html || '<p>Nada que mostrar todavía.</p>'"
    ></div>

    <p class="md__count">{{ words }} palabras</p>
  </section>
</template>

<style scoped lang="scss">
.md {
  @include flex(column, stretch, flex-start, 0.6rem);

  &__bar {
    @include flex(row, center, space-between, 0.5rem);
    flex-wrap: wrap;
  }

  &__tabs {
    @include flex(row, stretch, flex-start);
    background: $sand;
    border-radius: $radius-sm;
    padding: 3px;
  }

  &__tab {
    @include flex(row, center, center, 0.4rem);
    min-height: 38px;
    padding: 0 0.9rem;
    border-radius: 8px;
    font-size: $text-sm;
    font-weight: 600;
    color: $ink-soft;

    &--active {
      background: $surface;
      color: $ink;
      box-shadow: $shadow-sm;
    }
  }

  &__help-toggle {
    font-size: $text-sm;
    color: $ink-soft;
    min-height: 38px;

    &:hover {
      color: $ink;
    }
  }

  &__help {
    @include flex-cards(200px, 0.4rem 1rem);
    list-style: none;
    padding: 0.9rem 1rem;
    border-radius: $radius-sm;
    background: $sand;
    font-size: $text-sm;

    li {
      @include flex(row, center, space-between, 0.6rem);
    }

    code {
      font-size: 0.8rem;
      background: $surface;
      padding: 0.1rem 0.4rem;
      border-radius: 6px;
    }

    span {
      color: $ink-soft;
    }
  }

  &__area {
    min-height: 420px;
    resize: vertical;
    font-family: ui-monospace, 'SF Mono', Menlo, monospace;
    font-size: 0.9rem;
    line-height: 1.7;
  }

  &__preview {
    @include card;
    min-height: 420px;
    padding: 1.25rem 1.4rem;
    line-height: 1.75;

    :deep(h2) {
      font-size: $text-xl;
      margin: 1.4rem 0 0.6rem;
    }

    :deep(h3) {
      font-size: $text-lg;
      margin: 1.2rem 0 0.5rem;
    }

    :deep(p),
    :deep(ul),
    :deep(ol) {
      margin-bottom: 0.9rem;
    }

    :deep(ul),
    :deep(ol) {
      padding-left: 1.3rem;
    }

    :deep(a) {
      color: $accent-deep;
      text-decoration: underline;
    }

    :deep(> :first-child) {
      margin-top: 0;
    }
  }

  &__count {
    font-size: $text-xs;
    color: $ink-muted;
    text-align: right;
  }
}
</style>
