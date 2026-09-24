<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { site } from '@/config/site'
import { copy } from '@/components/site/copy'
import { useCatalog } from '@/composables/useCatalog'
import { useResource } from '@/composables/useResource'
import { vReveal } from '@/composables/useReveal'
import { blogService } from '@/services/blog.service'
import DarkHero from '@/components/site/DarkHero.vue'
import ProofCard from '@/components/site/ProofCard.vue'
import SectionHead from '@/components/site/SectionHead.vue'
import IconCard from '@/components/site/IconCard.vue'
import CategoryCard from '@/components/site/CategoryCard.vue'
import StepList from '@/components/site/StepList.vue'
import PostCard from '@/components/site/PostCard.vue'
import LoadState from '@/components/site/LoadState.vue'
import ClosingBanner from '@/components/site/ClosingBanner.vue'

const { categories, categoriesLoading, categoriesError, loadCategories } = useCatalog()
const featuredCategories = computed(() => categories.value.slice(0, 6))

// El bloque de blog solo existe si hay artículos publicados; si falla o
// viene vacío, simplemente no se pinta.
const posts = useResource(() => blogService.posts({ limit: 3 }))
const latestPosts = computed(() => posts.data.value?.items ?? [])

onMounted(() => {
  loadCategories()
  posts.load()
})
</script>

<template>
  <div class="home">
    <DarkHero :eyebrow="site.home.eyebrow" :title="site.home.title" :lead="site.home.lead">
      <template #actions>
        <RouterLink to="/autogestion" class="btn btn--primary">
          {{ site.home.ctas.platform }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
        </RouterLink>
        <RouterLink to="/contacto" class="btn btn--light">{{ site.home.ctas.advisor }}</RouterLink>
        <RouterLink to="/soluciones" class="btn btn--outline-light">{{ site.home.ctas.explore }}</RouterLink>
      </template>
      <template #aside>
        <ProofCard :pill="site.home.heroCard.pill" :title="site.home.heroCard.title" :items="site.home.heroCard.items" />
      </template>
    </DarkHero>

    <section class="block">
      <div class="block__inner">
        <SectionHead :eyebrow="site.home.modes.eyebrow" :title="site.home.modes.title" />
        <div class="cards cards--two">
          <IconCard
            v-for="(mode, index) in site.home.modes.items"
            :key="mode.title"
            v-reveal="index"
            :icon="mode.icon"
            :title="mode.title"
            :text="mode.text"
            :link="mode.link"
            featured
          />
        </div>
      </div>
    </section>

    <section class="block block--sand">
      <div class="block__inner">
        <SectionHead :eyebrow="site.home.solutions.eyebrow" :title="site.home.solutions.title" :text="site.home.solutions.text" />
        <LoadState
          v-if="categoriesLoading || categoriesError || !featuredCategories.length"
          :loading="categoriesLoading"
          :error="categoriesError"
          :empty="site.solutions.empty"
          @retry="loadCategories(true)"
        />
        <div v-else class="cards cards--three">
          <CategoryCard v-for="(category, index) in featuredCategories" :key="category._id" v-reveal="index" :category="category" />
        </div>
        <RouterLink to="/soluciones" class="btn btn--dark block__cta">
          {{ site.home.solutions.cta }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
        </RouterLink>
      </div>
    </section>

    <section class="block">
      <div class="block__inner">
        <SectionHead :eyebrow="copy.home.howEyebrow" :title="copy.home.howTitle" />
        <StepList :steps="site.howItWorks" />
      </div>
    </section>

    <section class="block block--sand">
      <div class="block__inner">
        <SectionHead :title="site.home.why.title" />
        <div class="cards cards--three">
          <IconCard
            v-for="(item, index) in site.home.why.items"
            :key="item.title"
            v-reveal="index"
            :icon="item.icon"
            :title="item.title"
            :text="item.text"
          />
        </div>
      </div>
    </section>

    <section v-if="latestPosts.length" class="block">
      <div class="block__inner">
        <SectionHead :eyebrow="site.home.blog.eyebrow" :title="site.home.blog.title" />
        <div class="cards cards--three">
          <PostCard v-for="(post, index) in latestPosts" :key="post._id" v-reveal="index" :post="post" />
        </div>
        <RouterLink to="/blog" class="btn btn--ghost block__cta">
          {{ site.home.blog.cta }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
        </RouterLink>
      </div>
    </section>

    <ClosingBanner
      :title="copy.home.closingTitle"
      :text="copy.home.closingText"
      :cta="{ label: copy.home.closingCta, to: '/contacto' }"
    />
  </div>
</template>

<style scoped lang="scss">
.block {
  padding-block: $space-section;

  &--sand {
    background: $sand;
  }

  &__inner {
    @include container;
    @include flex(column, stretch, flex-start);
  }

  &__cta {
    align-self: flex-start;
    margin-top: $space-lg;
  }
}

.cards {
  &--two {
    @include flex-cards(300px, 1.25rem);
  }

  &--three {
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
