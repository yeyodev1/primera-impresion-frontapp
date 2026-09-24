<script setup lang="ts">
import { computed, watch } from 'vue'
import { site, copy } from '@/config/site'
import { fxPages } from '@/config/fx.pages'
import { useBlogList } from '@/composables/useBlogList'
import { refreshAfterData } from '@/composables/motion/useGsap'
import PageIntro from '@/components/site/PageIntro.vue'
import SectionHead from '@/components/site/SectionHead.vue'
import PagerNav from '@/components/site/PagerNav.vue'
import LoadState from '@/components/site/LoadState.vue'
import ClosingBanner from '@/components/site/ClosingBanner.vue'
import MagneticButton from '@/components/fx/MagneticButton.vue'
import BlogTopics from '@/components/blog/BlogTopics.vue'
import BlogFeatured from '@/components/blog/BlogFeatured.vue'
import BlogList from '@/components/blog/BlogList.vue'
import BlogEmpty from '@/components/blog/BlogEmpty.vue'

// Blog como archivo editorial: temas con bloque de tinta deslizante, el
// primer artículo de la primera página como portada y el resto en índice.
// Sin publicados, la hoja en blanco sale de la prensa.
const { posts, category, page, options, goTo } = useBlogList()
const { data, loading, error, retry } = posts

const PER_PAGE = 9
const items = computed(() => data.value?.items ?? [])
const featured = computed(() => (page.value === 1 ? items.value[0] ?? null : null))
const rest = computed(() => (featured.value ? items.value.slice(1) : items.value))
const start = computed(() => (page.value - 1) * PER_PAGE + (featured.value ? 2 : 1))

watch(data, () => refreshAfterData())
</script>

<template>
  <div>
    <PageIntro :eyebrow="site.blog.eyebrow" :title="site.blog.title" :lead="site.blog.lead" />

    <section class="blog">
      <div class="blog__inner">
        <div class="blog__top">
          <SectionHead :eyebrow="fxPages.blog.listEyebrow" :title="site.blog.listTitle" />
          <p v-if="data?.total" class="blog__count">{{ fxPages.blog.count(data.total) }}</p>
        </div>
        <BlogTopics v-model="category" :options="options" :label="copy.blog.filterLabel" class="blog__topics" />

        <LoadState v-if="loading || error" :loading="loading" :error="error" @retry="retry" />
        <BlogEmpty v-else-if="!items.length" :text="site.blog.empty" />
        <template v-else>
          <BlogFeatured v-if="featured" :post="featured" class="blog__featured" />
          <BlogList v-if="rest.length" :key="`${category}-${page}`" :posts="rest" :start="start" />
          <PagerNav :page="page" :pages="data?.pages ?? 1" @go="goTo" />
        </template>
      </div>
    </section>

    <ClosingBanner :title="site.blog.ctaTitle" :text="site.blog.ctaText">
      <template #actions>
        <MagneticButton>
          <RouterLink to="/soluciones" class="btn btn--ink btn--press">
            {{ copy.blog.exploreCta }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </RouterLink>
        </MagneticButton>
        <RouterLink to="/contacto" class="btn btn--outline-light btn--press">{{ copy.blog.advisorCta }}</RouterLink>
      </template>
    </ClosingBanner>
  </div>
</template>

<style scoped lang="scss">
.blog {
  padding-block: $space-section;
  background: $paper;

  &__inner {
    @include container(1320px);
  }

  &__top {
    @include flex(column, flex-start, space-between, 0);

    @include from('md') {
      flex-direction: row;
      align-items: flex-end;
      gap: 2rem;
    }
  }

  &__count {
    @include mono-label(0.66rem, 0.16em);
    color: $ink-muted;
    margin-bottom: 1rem;

    @include from('md') {
      margin-bottom: $space-lg;
      white-space: nowrap;
    }
  }

  &__topics {
    margin-bottom: $space-xl;
  }

  &__featured {
    margin-bottom: $space-xl;
  }
}
</style>
