<script setup lang="ts">
import { site, copy, fx, fxCatalog } from '@/config/site'
import { onMounted, ref, watch } from 'vue'
import { useSolutionsCatalog } from '@/composables/useSolutionsCatalog'
import PageIntro from '@/components/site/PageIntro.vue'
import SectionHead from '@/components/site/SectionHead.vue'
import LoadState from '@/components/site/LoadState.vue'
import RecurrentBanner from '@/components/site/RecurrentBanner.vue'
import CountUp from '@/components/fx/CountUp.vue'
import MagneticButton from '@/components/fx/MagneticButton.vue'
import InkSelector from '@/components/solutions/InkSelector.vue'
import ResultCount from '@/components/solutions/ResultCount.vue'
import CatalogGrid from '@/components/solutions/CatalogGrid.vue'
import EmptySheet from '@/components/solutions/EmptySheet.vue'

const {
  active,
  options,
  activeOption,
  solutions,
  visibleCount,
  isVisible,
  iconFor,
  loading,
  error,
  categoriesCount,
  load,
  retry,
} = useSolutionsCatalog()

onMounted(load)

// Si se cambia de familia con el catálogo ya recorrido, se vuelve al inicio
// del pliego (bajo la tira de tintas) para ver cómo se reacomoda.
const catalog = ref<HTMLElement | null>(null)
watch(active, () => {
  const el = catalog.value
  if (!el || el.getBoundingClientRect().top > 0) return
  const offset = (document.querySelector<HTMLElement>('.inks')?.offsetHeight ?? 0) + 16
  window.scrollTo({
    top: el.getBoundingClientRect().top + window.scrollY - offset,
    behavior: 'smooth',
  })
})
</script>

<template>
  <div>
    <PageIntro
      :eyebrow="site.solutions.eyebrow"
      :title="site.solutions.title"
      :lead="site.solutions.lead"
    >
      <dl v-if="solutions.length" class="stats">
        <div class="stats__item">
          <dt class="stats__label">{{ fxCatalog.solutions.stats.solutions }}</dt>
          <dd class="stats__value"><CountUp :to="solutions.length" :duration="1.4" /></dd>
        </div>
        <div v-if="categoriesCount" class="stats__item">
          <dt class="stats__label">{{ fxCatalog.solutions.stats.families }}</dt>
          <dd class="stats__value"><CountUp :to="categoriesCount" :duration="1.4" /></dd>
        </div>
      </dl>
    </PageIntro>

    <div class="shelf">
      <InkSelector
        v-if="options.length > 1"
        v-model="active"
        :options="options"
        :label="copy.solutions.filterLabel"
      >
        <template #aside>
          <span class="shelf__mini" aria-hidden="true">{{
            fxCatalog.solutions.showing(visibleCount, solutions.length)
          }}</span>
        </template>
      </InkSelector>

      <section id="catalogo" ref="catalog" class="catalog">
        <div class="catalog__top">
          <SectionHead
            :index="fx.section(1, 2)"
            :title="site.solutions.catalogTitle"
            :text="site.solutions.catalogText"
          />
          <ResultCount
            v-if="solutions.length"
            class="catalog__count"
            :value="visibleCount"
            :total="solutions.length"
            :family="activeOption.value ? activeOption.label : fxCatalog.solutions.all"
          />
        </div>

        <p class="visually-hidden" aria-live="polite">
          {{
            solutions.length
              ? fxCatalog.solutions.live(
                  visibleCount,
                  activeOption.value ? activeOption.label : fxCatalog.solutions.all,
                )
              : ''
          }}
        </p>

        <LoadState
          v-if="!solutions.length && (loading || error)"
          :loading="loading"
          :error="error"
          @retry="retry"
        />
        <template v-else-if="solutions.length">
          <EmptySheet v-if="!visibleCount" :text="site.solutions.empty" :icon="activeOption.icon">
            <MagneticButton>
              <RouterLink to="/contacto" class="btn btn--primary btn--press">
                {{ site.home.ctas.advisor }}
                <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
              </RouterLink>
            </MagneticButton>
          </EmptySheet>
          <CatalogGrid
            :solutions="solutions"
            :visible="isVisible"
            :icon-for="iconFor"
            :filter-key="active"
          />
        </template>
        <LoadState v-else :empty="site.solutions.empty" />
      </section>
    </div>

    <RecurrentBanner />
  </div>
</template>

<style scoped lang="scss">
.stats {
  @include flex(row, flex-start, flex-start, 1.5rem 2.5rem);
  flex-wrap: wrap;
  margin-top: 0.75rem;
  padding-top: 1.25rem;
  border-top: 1px solid rgba($surface, 0.14);

  &__item {
    @include flex(column-reverse, flex-start, flex-start, 0.35rem);
  }

  &__label {
    max-width: 14ch;
    @include mono-label(0.62rem, 0.18em);
    color: rgba($surface, 0.6);
  }

  &__value {
    font-family: $font-display;
    font-weight: 800;
    font-size: clamp(2.6rem, 2rem + 2.4vw, 4rem);
    line-height: 0.85;
    letter-spacing: -0.04em;
    color: $accent;
  }
}

.shelf {
  position: relative;
  background: $paper;

  &__mini {
    @include mono-label(0.64rem, 0.16em);
    color: $accent;
    white-space: nowrap;
  }
}

.catalog {
  @include container(1320px);
  padding-block: clamp(3rem, 6vw, 5rem) $space-section;
  scroll-margin-top: calc(var(--header-h) + 4rem);

  &__top {
    @include flex(column, flex-start, space-between, 0 2rem);

    @include from('md') {
      flex-direction: row;
      align-items: flex-end;
    }

    :deep(.head) {
      flex: 1 1 auto;
    }
  }

  &__count {
    margin-bottom: $space-lg;
    flex-shrink: 0;

    @include until('md') {
      margin-top: -1rem;
    }
  }
}
</style>
