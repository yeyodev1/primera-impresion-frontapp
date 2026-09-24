<script setup lang="ts">
import { site } from '@/config/site'
import { copy } from '@/components/site/copy'
import { useSolutionsFilter } from '@/composables/useSolutionsFilter'
import { vReveal } from '@/composables/useReveal'
import PageIntro from '@/components/site/PageIntro.vue'
import SectionHead from '@/components/site/SectionHead.vue'
import FilterChips from '@/components/site/FilterChips.vue'
import SolutionCard from '@/components/site/SolutionCard.vue'
import LoadState from '@/components/site/LoadState.vue'
import RecurrentBanner from '@/components/site/RecurrentBanner.vue'

const { active, options, solutions, iconFor, retry } = useSolutionsFilter()
const { data, loading, error } = solutions
</script>

<template>
  <div>
    <PageIntro :eyebrow="site.solutions.eyebrow" :title="site.solutions.title" :lead="site.solutions.lead" />

    <section class="catalog">
      <SectionHead :title="site.solutions.catalogTitle" :text="site.solutions.catalogText" />
      <FilterChips v-if="options.length > 1" v-model="active" :options="options" :label="copy.solutions.filterLabel" />

      <LoadState
        v-if="loading || error || !data?.length"
        :loading="loading"
        :error="error"
        :empty="site.solutions.empty"
        @retry="retry"
      >
        <RouterLink to="/contacto" class="btn btn--dark btn--sm">{{ site.home.ctas.advisor }}</RouterLink>
      </LoadState>
      <div v-else class="catalog__grid" aria-live="polite">
        <SolutionCard
          v-for="(solution, index) in data"
          :key="solution._id"
          v-reveal="index % 3"
          :solution="solution"
          :icon="iconFor(solution.category)"
        />
      </div>
    </section>

    <RecurrentBanner />
  </div>
</template>

<style scoped lang="scss">
.catalog {
  @include container;
  padding-block: $space-xl 0;

  &__grid {
    @include flex-cards(260px, 1.25rem);

    // Evita que la última tarjeta suelta se estire a todo el ancho.
    > * {
      max-width: 100%;

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
