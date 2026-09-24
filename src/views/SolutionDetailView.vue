<script setup lang="ts">
import { site, copy } from '@/config/site'
import { useSolutionDetail } from '@/composables/useSolutionDetail'
import { vReveal } from '@/composables/useReveal'
import PageIntro from '@/components/site/PageIntro.vue'
import ImageSlot from '@/components/site/ImageSlot.vue'
import SectionHead from '@/components/site/SectionHead.vue'
import SolutionCard from '@/components/site/SolutionCard.vue'
import LoadState from '@/components/site/LoadState.vue'
import CropMarks from '@/components/site/CropMarks.vue'

const { solution, related, category, icon, whatsapp } = useSolutionDetail()
const { data, loading, error, notFound, retry } = solution
const back = { label: site.solutions.detail.back, to: '/soluciones' }
</script>

<template>
  <div>
    <template v-if="data">
      <PageIntro :title="data.name" :lead="data.summary" :back="back" />

      <section class="detail">
        <div v-reveal class="detail__media">
          <ImageSlot :image="data.image" :alt="data.name" :icon="icon" />
        </div>

        <div class="detail__body">
          <RouterLink
            v-if="category"
            :to="{ path: '/soluciones', query: { categoria: category.slug } }"
            class="detail__pill"
          >
            {{ category.name }}
          </RouterLink>
          <h2 class="detail__name">{{ data.name }}</h2>
          <p v-if="data.description" class="detail__desc">{{ data.description }}</p>

          <div class="detail__options">
            <h3 class="detail__subtitle">{{ site.solutions.detail.optionsTitle }}</h3>
            <ul v-if="data.options.length" class="detail__chips">
              <li v-for="option in data.options" :key="option" class="detail__chip">{{ option }}</li>
            </ul>
            <p class="detail__note">{{ site.solutions.detail.optionsText }}</p>
          </div>

          <div class="detail__actions">
            <a :href="whatsapp" target="_blank" rel="noopener" class="btn btn--primary">
              <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
              {{ site.solutions.detail.cta }}
              <span class="visually-hidden">{{ copy.header.newTab }}</span>
            </a>
            <RouterLink to="/contacto#form-contacto" class="btn btn--ghost">{{ copy.solutions.contactCta }}</RouterLink>
          </div>

          <aside class="detail__notice">
            <CropMarks tone="accent" />
            <p class="detail__notice-title">{{ site.recurrentBanner.title }}</p>
            <p>{{ site.recurrentBanner.text }}</p>
            <RouterLink to="/autogestion" class="detail__notice-link">
              {{ site.recurrentBanner.cta }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
            </RouterLink>
          </aside>
        </div>
      </section>

      <section v-if="related.length" class="related">
        <SectionHead :eyebrow="category?.name" :title="copy.solutions.relatedTitle" />
        <div class="related__grid">
          <SolutionCard v-for="(item, index) in related" :key="item._id" v-reveal="index" :solution="item" :icon="icon" />
        </div>
      </section>
    </template>

    <template v-else-if="notFound">
      <PageIntro :title="copy.solutions.notFoundTitle" :lead="copy.solutions.notFoundText" :back="back">
        <RouterLink to="/soluciones" class="btn btn--primary">{{ site.home.ctas.explore }}</RouterLink>
        <RouterLink to="/contacto" class="btn btn--outline-light">{{ site.home.ctas.advisor }}</RouterLink>
      </PageIntro>
    </template>

    <template v-else>
      <PageIntro :title="site.solutions.title" :back="back" />
      <div class="detail__state">
        <LoadState :loading="loading" :error="error" @retry="retry" />
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.detail {
  @include container;
  @include flex(column, stretch, flex-start, 2.5rem);
  padding-block: $space-xl;

  @include from('lg') {
    flex-direction: row;
    align-items: flex-start;
    gap: 4rem;
  }

  &__media {
    @include from('lg') {
      flex: 1 1 50%;
      position: sticky;
      top: 6rem;
    }
  }

  &__body {
    @include flex(column, flex-start, flex-start, 1.1rem);

    @include from('lg') {
      flex: 1 1 50%;
    }
  }

  &__pill {
    padding: 0.3rem 0.8rem;
    border-radius: $radius-pill;
    background: $accent-soft;
    color: darken($accent-deep, 6%);
    font-size: $text-xs;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    @include focus-ring;
  }

  &__name {
    @include display($display-sm, 800);
  }

  &__desc {
    color: $ink-soft;
    font-size: $text-lg;
    line-height: 1.6;
    white-space: pre-line;
  }

  &__options {
    width: 100%;
    @include flex(column, flex-start, flex-start, 0.75rem);
    padding-block: 1.25rem;
    border-block: 1px solid $line;
  }

  &__subtitle {
    font-size: $text-xl;
  }

  &__chips {
    list-style: none;
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
  }

  &__chip {
    padding: 0.4rem 0.85rem;
    border: 1px solid $line;
    border-radius: $radius-pill;
    background: $surface;
    font-size: $text-sm;
    font-weight: 600;
  }

  &__note {
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__actions {
    @include flex(row, center, flex-start, 0.75rem);
    flex-wrap: wrap;
  }

  &__notice {
    position: relative;
    width: 100%;
    margin-top: 0.75rem;
    padding: 1.75rem 1.5rem;
    background: $sand;
    border-radius: $radius-sm;
    color: $ink-soft;
    @include flex(column, flex-start, flex-start, 0.4rem);
  }

  &__notice-title {
    font-family: $font-display;
    font-size: $text-lg;
    font-weight: 700;
    color: $ink;
  }

  &__notice-link {
    margin-top: 0.35rem;
    font-weight: 600;
    color: darken($accent-deep, 6%);
    @include focus-ring;

    &:hover {
      text-decoration: underline;
    }
  }

  &__state {
    @include container;
    padding-block: $space-xl;
  }
}

.related {
  @include container;
  padding-block: 0 $space-section;

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
