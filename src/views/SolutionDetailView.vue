<script setup lang="ts">
import { site, copy, fxCatalog } from '@/config/site'
import { computed, watch } from 'vue'
import { useSolutionDetail } from '@/composables/useSolutionDetail'
import { refreshAfterData } from '@/composables/motion/useGsap'
import PageIntro from '@/components/site/PageIntro.vue'
import LoadState from '@/components/site/LoadState.vue'
import SplitReveal from '@/components/fx/SplitReveal.vue'
import MagneticButton from '@/components/fx/MagneticButton.vue'
import ProductPlate from '@/components/solutions/ProductPlate.vue'
import ProductionSheet from '@/components/solutions/ProductionSheet.vue'
import RecurrentNotice from '@/components/solutions/RecurrentNotice.vue'
import RelatedRail from '@/components/solutions/RelatedRail.vue'
import MisprintSheet from '@/components/solutions/MisprintSheet.vue'
import ClosingBanner from '@/components/site/ClosingBanner.vue'

const { solution, related, category, icon, whatsapp } = useSolutionDetail()
const { data, loading, error, notFound, retry } = solution
const back = { label: site.solutions.detail.back, to: '/soluciones' }

const familyLink = computed(() =>
  category.value
    ? {
        name: category.value.name,
        to: { path: '/soluciones', query: { categoria: category.value.slug } },
      }
    : null,
)

// La ficha cambia la altura de la página al llegar (y al llegar las relacionadas).
watch([data, () => related.value.length], refreshAfterData)
</script>

<template>
  <div>
    <template v-if="data">
      <PageIntro :key="`intro-${data._id}`" :title="data.name" :lead="data.summary" :back="back">
        <p class="tags">
          <RouterLink v-if="familyLink" :to="familyLink.to" class="tags__family">
            <i :class="icon" aria-hidden="true"></i>
            {{ familyLink.name }}
          </RouterLink>
          <span class="tags__ref">{{ fxCatalog.detail.ref(data.slug) }}</span>
        </p>
      </PageIntro>

      <section :key="data._id" class="detail">
        <div class="detail__media">
          <ProductPlate
            :image="data.image"
            :name="data.name"
            :icon="icon"
            :family="category?.name"
          />
        </div>

        <div class="detail__body">
          <div v-if="data.description" class="detail__about">
            <p class="detail__label">{{ fxCatalog.detail.about }}</p>
            <SplitReveal :text="data.description" by="lines" class="detail__desc" />
          </div>

          <ProductionSheet :slug="data.slug" :options="data.options" :family="familyLink" />

          <div class="detail__actions">
            <MagneticButton>
              <a
                :href="whatsapp"
                target="_blank"
                rel="noopener"
                class="btn btn--primary btn--press"
              >
                <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
                {{ site.solutions.detail.cta }}
                <span class="visually-hidden">{{ copy.header.newTab }}</span>
              </a>
            </MagneticButton>
            <RouterLink to="/contacto#form-contacto" class="detail__secondary">
              {{ copy.solutions.contactCta }}
              <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
            </RouterLink>
          </div>

          <RecurrentNotice />
        </div>
      </section>

      <RelatedRail v-if="related.length" :items="related" :icon="icon" :family="familyLink" />

      <!-- Cierre naranja: el riel de relacionadas es negro y sin esto se fundía con el footer. -->
      <ClosingBanner
        :title="site.contact.closingTitle"
        :text="site.contact.closingText"
        :cta="{ label: site.contact.closingCta, to: '/contacto#form-contacto' }"
      />
    </template>

    <template v-else-if="notFound">
      <PageIntro
        :title="copy.solutions.notFoundTitle"
        :lead="copy.solutions.notFoundText"
        :back="back"
      >
        <MagneticButton>
          <RouterLink to="/soluciones" class="btn btn--primary btn--press">
            {{ site.home.ctas.explore }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </RouterLink>
        </MagneticButton>
        <RouterLink to="/contacto" class="btn btn--outline-light">{{
          site.home.ctas.advisor
        }}</RouterLink>
      </PageIntro>
      <MisprintSheet />
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
.tags {
  @include flex(row, center, flex-start, 0.6rem 1.25rem);
  flex-wrap: wrap;

  &__family {
    @include flex(row, center, flex-start, 0.55rem);
    padding: 0.5rem 0.85rem;
    border-radius: 2px;
    background: $accent;
    color: $night;
    @include mono-label(0.66rem, 0.14em);
    @include transition(background-color);
    @include focus-ring($surface);

    &:hover {
      background: $surface;
    }
  }

  &__ref {
    @include mono-label(0.64rem, 0.16em);
    color: rgba($surface, 0.6);
  }
}

.detail {
  @include container(1320px);
  @include flex(column, stretch, flex-start, 2.5rem);
  padding-block: clamp(2.5rem, 6vw, 5rem) $space-section;

  @include from('lg') {
    flex-direction: row;
    align-items: flex-start;
    gap: clamp(2.5rem, 5vw, 5rem);
  }

  &__media {
    margin-inline: -1.25rem;

    @include from('md') {
      margin-inline: -2rem;
    }

    @include from('lg') {
      flex: 1 1 56%;
      min-width: 0;
      margin-inline: -2rem 0;
      position: sticky;
      top: calc(var(--header-h) + 1rem);
    }
  }

  &__body {
    @include flex(column, stretch, flex-start, 1.75rem);

    @include from('lg') {
      flex: 1 1 44%;
      min-width: 0;
      padding-top: 2rem;
    }
  }

  &__about {
    @include flex(column, flex-start, flex-start, 0.75rem);
  }

  &__label {
    @include mono-label(0.64rem, 0.18em);
    color: darken($accent-deep, 4%);
    @include flex(row, center, flex-start, 0.75rem);

    &::before {
      content: '';
      width: 2rem;
      height: 1px;
      background: currentColor;
    }
  }

  &__desc {
    font-size: clamp(1.15rem, 1rem + 0.6vw, 1.45rem);
    line-height: 1.5;
    color: $ink;
    white-space: pre-line;
  }

  &__actions {
    @include flex(column, stretch, flex-start, 1rem);

    @include from('sm') {
      flex-direction: row;
      align-items: center;
      flex-wrap: wrap;
      gap: 1.5rem;
    }

    :deep(.btn--press) {
      width: 100%;

      @include from('sm') {
        width: auto;
      }
    }
  }

  &__secondary {
    align-self: center;
    @include flex(row, center, flex-start, 0.6rem);
    padding-block: 0.4rem;
    font-weight: 700;
    border-bottom: 2px solid $ink;
    border-radius: 1px;
    @include focus-ring;

    i {
      @include transition(transform);
    }

    &:hover i {
      transform: translateX(4px);
    }
  }

  &__state {
    @include container;
    padding-block: $space-xl;
  }
}
</style>
