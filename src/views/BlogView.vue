<script setup lang="ts">
import { site, copy } from '@/config/site'
import { useBlogList } from '@/composables/useBlogList'
import { vReveal } from '@/composables/useReveal'
import PageIntro from '@/components/site/PageIntro.vue'
import SectionHead from '@/components/site/SectionHead.vue'
import FilterChips from '@/components/site/FilterChips.vue'
import PostCard from '@/components/site/PostCard.vue'
import PagerNav from '@/components/site/PagerNav.vue'
import LoadState from '@/components/site/LoadState.vue'
import ClosingBanner from '@/components/site/ClosingBanner.vue'

const { posts, category, page, options, goTo } = useBlogList()
const { data, loading, error, retry } = posts
</script>

<template>
  <div>
    <PageIntro :eyebrow="site.blog.eyebrow" :title="site.blog.title" :lead="site.blog.lead" />

    <section class="list">
      <SectionHead :title="site.blog.listTitle" />
      <FilterChips v-model="category" :options="options" :label="copy.blog.filterLabel" />

      <LoadState
        v-if="loading || error || !data?.items.length"
        :loading="loading"
        :error="error"
        :empty="site.blog.empty"
        icon="fa-solid fa-newspaper"
        @retry="retry"
      />
      <template v-else>
        <div class="list__grid">
          <PostCard v-for="(post, index) in data.items" :key="post._id" v-reveal="index % 3" :post="post" />
        </div>
        <PagerNav :page="page" :pages="data.pages" @go="goTo" />
      </template>
    </section>

    <ClosingBanner :title="site.blog.ctaTitle" :text="site.blog.ctaText">
      <template #actions>
        <RouterLink to="/soluciones" class="btn btn--primary">{{ copy.blog.exploreCta }}</RouterLink>
        <RouterLink to="/contacto" class="btn btn--outline-light">{{ copy.blog.advisorCta }}</RouterLink>
      </template>
    </ClosingBanner>
  </div>
</template>

<style scoped lang="scss">
.list {
  @include container;
  padding-block: $space-xl 0;

  &__grid {
    @include flex-cards(260px, 1.25rem);

    > * {
      @include from('md') {
        max-width: calc(50% - 0.625rem);
      }

      @include from('lg') {
        max-width: calc(33.333% - 0.834rem);
      }
    }
  }
}
</style>
