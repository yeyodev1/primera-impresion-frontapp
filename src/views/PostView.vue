<script setup lang="ts">
import { site, copy } from '@/config/site'
import { formatDate } from '@/utils/format'
import { usePost } from '@/composables/usePost'
import PageIntro from '@/components/site/PageIntro.vue'
import ImageSlot from '@/components/site/ImageSlot.vue'
import LoadState from '@/components/site/LoadState.vue'
import ClosingBanner from '@/components/site/ClosingBanner.vue'

const { post, html, related } = usePost()
const { data, loading, error, notFound, retry } = post
const back = { label: site.blog.back, to: '/blog' }
</script>

<template>
  <div>
    <template v-if="data">
      <PageIntro :title="data.title" :lead="data.excerpt" :back="back">
        <p class="meta">
          <RouterLink :to="{ path: '/blog', query: { tema: data.category } }" class="meta__cat">{{ data.category }}</RouterLink>
          <time v-if="data.publishedAt" :datetime="data.publishedAt">{{ formatDate(data.publishedAt) }}</time>
          <span v-if="data.author">{{ copy.blog.by }} {{ data.author }}</span>
        </p>
      </PageIntro>

      <article class="article">
        <ImageSlot :image="data.coverImage" :alt="data.title" icon="fa-solid fa-newspaper" ratio="16 / 9" />
        <!-- renderMarkdown escapa el HTML antes de transformar: seguro para v-html. -->
        <div class="prose" v-html="html"></div>
      </article>

      <ClosingBanner :title="site.blog.ctaTitle" :text="site.blog.ctaText">
        <template #actions>
          <RouterLink
            v-if="related"
            :to="{ path: '/soluciones', query: { categoria: related.slug } }"
            class="btn btn--primary"
          >
            {{ copy.blog.relatedCta(related.name) }}
          </RouterLink>
          <RouterLink v-else to="/soluciones" class="btn btn--primary">{{ copy.blog.exploreCta }}</RouterLink>
          <RouterLink to="/contacto" class="btn btn--outline-light">{{ copy.blog.advisorCta }}</RouterLink>
        </template>
      </ClosingBanner>
    </template>

    <PageIntro v-else-if="notFound" :title="copy.blog.notFoundTitle" :lead="copy.blog.notFoundText" :back="back">
      <RouterLink to="/blog" class="btn btn--primary">{{ site.blog.back }}</RouterLink>
    </PageIntro>

    <template v-else>
      <PageIntro :title="site.blog.title" :back="back" />
      <div class="article">
        <LoadState :loading="loading" :error="error" @retry="retry" />
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.meta {
  @include flex(row, center, flex-start, 0.5rem 1.25rem);
  flex-wrap: wrap;
  font-size: $text-sm;
  color: rgba($surface, 0.7);

  &__cat {
    padding: 0.25rem 0.75rem;
    border-radius: $radius-pill;
    background: $accent;
    color: $night;
    font-size: $text-xs;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    @include focus-ring($surface);
  }
}

.article {
  @include container(820px);
  @include flex(column, stretch, flex-start, 2.5rem);
  padding-block: $space-xl 0;
}

// Tipografía de lectura para el Markdown del panel.
.prose {
  max-width: 45rem;
  width: 100%;
  margin-inline: auto;
  font-size: clamp(1.02rem, 0.96rem + 0.3vw, 1.14rem);
  line-height: 1.75;
  color: $ink;

  :deep(* + *) {
    margin-top: 1.1em;
  }

  :deep(h2) {
    margin-top: 2em;
    font-size: $display-sm;
    font-weight: 800;
    line-height: 1.1;
  }

  :deep(h3) {
    margin-top: 1.6em;
    font-size: $text-xl;
    font-weight: 700;
  }

  :deep(ul),
  :deep(ol) {
    padding-left: 1.3em;
  }

  :deep(li + li) {
    margin-top: 0.4em;
  }

  :deep(li::marker) {
    color: $accent;
    font-weight: 700;
  }

  :deep(strong) {
    font-weight: 700;
    color: $ink;
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
}
</style>
