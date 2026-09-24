<script setup lang="ts">
import { computed, watch } from 'vue'
import { site, copy } from '@/config/site'
import { fxPages } from '@/config/fx.pages'
import { formatDate } from '@/utils/format'
import { usePost } from '@/composables/usePost'
import { readingMinutes } from '@/composables/useReading'
import { refreshAfterData } from '@/composables/motion/useGsap'
import PageIntro from '@/components/site/PageIntro.vue'
import LoadState from '@/components/site/LoadState.vue'
import ClosingBanner from '@/components/site/ClosingBanner.vue'
import MagneticButton from '@/components/fx/MagneticButton.vue'
import PostArticle from '@/components/blog/PostArticle.vue'

// Artículo: cabecera editorial (tema, fecha, minutos de lectura y autor en
// mono), cuerpo con riel de lectura y cierre naranja con el CTA del tema
// relacionado si el artículo lo tiene.
const { post, html, related } = usePost()
const { data, loading, error, notFound, retry } = post
const back = { label: site.blog.back, to: '/blog' }
const minutes = computed(() => readingMinutes(data.value?.content ?? ''))

watch(data, () => refreshAfterData())
</script>

<template>
  <div>
    <template v-if="data">
      <PageIntro :key="data._id" :title="data.title" :lead="data.excerpt" :back="back">
        <p class="meta">
          <RouterLink :to="{ path: '/blog', query: { tema: data.category } }" class="meta__cat">{{ data.category }}</RouterLink>
          <time v-if="data.publishedAt" :datetime="data.publishedAt">{{ formatDate(data.publishedAt) }}</time>
          <span>{{ fxPages.post.readingTime(minutes) }}</span>
          <span v-if="data.author">{{ copy.blog.by }} {{ data.author }}</span>
        </p>
      </PageIntro>

      <PostArticle :key="`a-${data._id}`" :post="data" :html="html" />

      <ClosingBanner :title="site.blog.ctaTitle" :text="site.blog.ctaText">
        <template #actions>
          <MagneticButton>
            <RouterLink
              v-if="related"
              :to="{ path: '/soluciones', query: { categoria: related.slug } }"
              class="btn btn--ink btn--press"
            >
              {{ copy.blog.relatedCta(related.name) }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
            </RouterLink>
            <RouterLink v-else to="/soluciones" class="btn btn--ink btn--press">
              {{ copy.blog.exploreCta }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
            </RouterLink>
          </MagneticButton>
          <RouterLink to="/contacto" class="btn btn--outline-light btn--press">{{ copy.blog.advisorCta }}</RouterLink>
        </template>
      </ClosingBanner>
    </template>

    <PageIntro v-else-if="notFound" :title="copy.blog.notFoundTitle" :lead="copy.blog.notFoundText" :back="back">
      <RouterLink to="/blog" class="btn btn--primary btn--press">{{ site.blog.back }}</RouterLink>
    </PageIntro>

    <template v-else>
      <PageIntro :title="site.blog.title" :back="back" />
      <div class="wait">
        <LoadState :loading="loading" :error="error" @retry="retry" />
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.meta {
  @include flex(row, center, flex-start, 0.6rem 1.4rem);
  flex-wrap: wrap;
  @include mono-label(0.66rem, 0.14em);
  color: rgba($surface, 0.72);

  &__cat {
    padding: 0.4rem 0.7rem;
    border-radius: 2px;
    background: $accent;
    color: $night;
    @include transition(background);
    @include focus-ring($surface);

    &:hover {
      background: $surface;
    }
  }
}

.wait {
  @include container(820px);
  padding-block: $space-xl;
}
</style>
