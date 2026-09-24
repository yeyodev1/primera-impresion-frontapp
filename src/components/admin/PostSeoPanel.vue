<script setup lang="ts">
import { computed } from 'vue'
import { SEO_DESCRIPTION_MAX, SEO_TITLE_MAX } from '@/composables/admin/adminCopy'
import { site } from '@/config/site'

// Si el SEO queda vacío, el sitio usa el título y el extracto: la vista previa
// muestra exactamente eso para que el equipo vea lo que verá Google.
const props = defineProps<{ slug: string; fallbackTitle: string; fallbackDescription: string }>()
const seoTitle = defineModel<string>('seoTitle', { required: true })
const seoDescription = defineModel<string>('seoDescription', { required: true })

const previewTitle = computed(() => {
  const base = seoTitle.value.trim() || props.fallbackTitle.trim() || 'Título del artículo'
  return seoTitle.value.trim() ? base : `${base} | ${site.name}`
})
const previewDescription = computed(
  () =>
    seoDescription.value.trim() ||
    props.fallbackDescription.trim() ||
    'Aquí va la descripción que aparece bajo el título en Google.',
)
const url = computed(() => `${site.url}/blog/${props.slug || 'tu-articulo'}`)
const crumbs = computed(() =>
  url.value
    .replace(/^https?:\/\//, '')
    .split('/')
    .join(' › '),
)

function clip(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text
}
</script>

<template>
  <section class="seo">
    <header class="seo__head">
      <h2 class="seo__title"><i class="fa-brands fa-google"></i> Cómo se verá en Google</h2>
      <p class="seo__intro">
        Opcional. Si lo dejas vacío se usan el título y el extracto del artículo.
      </p>
    </header>

    <div class="seo__preview" aria-label="Vista previa del resultado de búsqueda">
      <span class="seo__url">{{ crumbs }}</span>
      <span class="seo__link">{{ clip(previewTitle, SEO_TITLE_MAX + 5) }}</span>
      <span class="seo__desc">{{ clip(previewDescription, SEO_DESCRIPTION_MAX + 5) }}</span>
    </div>

    <div class="seo__field">
      <div class="seo__label">
        <label for="seo-title">Título para Google</label>
        <span class="seo__count" :class="{ 'seo__count--over': seoTitle.length > SEO_TITLE_MAX }">
          {{ seoTitle.length }}/{{ SEO_TITLE_MAX }}
        </span>
      </div>
      <input
        id="seo-title"
        v-model="seoTitle"
        type="text"
        :placeholder="fallbackTitle || 'Título claro con la palabra clave'"
      />
    </div>

    <div class="seo__field">
      <div class="seo__label">
        <label for="seo-description">Descripción para Google</label>
        <span
          class="seo__count"
          :class="{ 'seo__count--over': seoDescription.length > SEO_DESCRIPTION_MAX }"
        >
          {{ seoDescription.length }}/{{ SEO_DESCRIPTION_MAX }}
        </span>
      </div>
      <textarea
        id="seo-description"
        v-model="seoDescription"
        rows="3"
        placeholder="Una o dos frases que inviten a hacer clic"
      ></textarea>
      <p v-if="seoDescription.length > SEO_DESCRIPTION_MAX" class="seo__warn">
        Google cortará el texto: intenta dejarlo en {{ SEO_DESCRIPTION_MAX }} caracteres o menos.
      </p>
    </div>
  </section>
</template>

<style scoped lang="scss">
.seo {
  @include card;
  @include flex(column, stretch, flex-start, 1rem);
  padding: 1.2rem;

  &__title {
    font-size: $text-base;
    font-weight: 600;
    @include flex(row, center, flex-start, 0.5rem);

    i {
      color: $ink-muted;
    }
  }

  &__intro {
    margin-top: 0.25rem;
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__preview {
    @include flex(column, stretch, flex-start, 0.2rem);
    padding: 0.9rem 1rem;
    border-radius: $radius-sm;
    background: $surface;
    border: 1px solid $line;
    font-family: Arial, sans-serif;
    overflow-wrap: anywhere;
  }

  &__url {
    font-size: 0.78rem;
    color: #4d5156;
  }

  &__link {
    font-size: 1.1rem;
    line-height: 1.3;
    color: #1a0dab;
  }

  &__desc {
    font-size: 0.85rem;
    line-height: 1.5;
    color: #4d5156;
  }

  &__label {
    @include flex(row, baseline, space-between, 0.5rem);

    label {
      margin-bottom: 0.35rem;
    }
  }

  &__count {
    font-size: $text-xs;
    font-variant-numeric: tabular-nums;
    color: $ink-muted;

    &--over {
      color: $danger;
      font-weight: 600;
    }
  }

  &__warn {
    margin-top: 0.35rem;
    font-size: $text-xs;
    color: $danger;
  }
}
</style>
