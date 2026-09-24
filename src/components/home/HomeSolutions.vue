<script setup lang="ts">
import { watch } from 'vue'
import { site, fx } from '@/config/site'
import { useCatalog } from '@/composables/useCatalog'
import { refreshAfterData } from '@/composables/motion/useGsap'
import SectionHead from '@/components/site/SectionHead.vue'
import CategoryHoverList from '@/components/site/CategoryHoverList.vue'
import CategoryCard from '@/components/site/CategoryCard.vue'
import LoadState from '@/components/site/LoadState.vue'
import MagneticButton from '@/components/fx/MagneticButton.vue'
import ColorBar from '@/components/fx/ColorBar.vue'

// Soluciones: índice editorial de las familias del API con previsualización
// que sigue al cursor (lg+) y, en pantallas chicas, carrusel con scroll-snap.
defineProps<{ index: string }>()

const { categories, categoriesLoading, categoriesError, loadCategories } = useCatalog()

// La lista cambia la altura de la página: las secciones de abajo (el pin)
// necesitan recalcular sus posiciones.
watch(() => categories.value.length, refreshAfterData)
</script>

<template>
  <section class="hsol">
    <div class="hsol__inner">
      <div class="hsol__top">
        <SectionHead
          :index="index"
          tone="night"
          :eyebrow="site.home.solutions.eyebrow"
          :title="site.home.solutions.title"
          :text="site.home.solutions.text"
        />
        <ColorBar tone="night" class="hsol__bar" />
      </div>

      <LoadState
        v-if="categoriesLoading || categoriesError || !categories.length"
        class="hsol__state"
        :loading="categoriesLoading"
        :error="categoriesError"
        :empty="site.solutions.empty"
        @retry="loadCategories(true)"
      />
      <template v-else>
        <CategoryHoverList :categories="categories" class="hsol__list" />
        <div class="hsol__rail">
          <ul class="hsol__track">
            <li v-for="(category, i) in categories" :key="category._id" class="hsol__slide">
              <CategoryCard :category="category" :index="i + 1" tone="night" />
            </li>
          </ul>
          <p class="hsol__hint" aria-hidden="true">
            {{ fx.solutions.swipe }} <i class="fa-solid fa-arrow-right-long"></i>
          </p>
        </div>
      </template>

      <MagneticButton class="hsol__cta">
        <RouterLink to="/soluciones" class="btn btn--primary btn--press">
          {{ site.home.solutions.cta }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
        </RouterLink>
      </MagneticButton>
    </div>
  </section>
</template>

<style scoped lang="scss">
.hsol {
  padding-block: $space-section;
  background: $night;
  color: $surface;

  &__inner {
    @include container(1320px);
    @include flex(column, stretch, flex-start);
  }

  &__top {
    @include flex(column, flex-start, space-between, 0 2rem);

    @include from('lg') {
      flex-direction: row;
      align-items: flex-end;
    }
  }

  &__bar {
    display: none;
    margin-bottom: $space-lg;

    @include from('lg') {
      display: flex;
      max-width: 22rem;
    }
  }

  &__state {
    color: $surface;
  }

  &__list {
    display: none;

    @include from('lg') {
      display: block;
    }
  }

  &__rail {
    @include from('lg') {
      display: none;
    }
  }

  // Carrusel: sale del contenedor a sangre y engancha cada tarjeta al borde.
  &__track {
    list-style: none;
    display: flex;
    gap: 0.9rem;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-padding-inline: 1.25rem;
    padding: 0.5rem 1.25rem 1.25rem;
    margin-inline: -1.25rem;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    @include from('md') {
      margin-inline: -2rem;
      padding-inline: 2rem;
      scroll-padding-inline: 2rem;
    }
  }

  &__slide {
    flex: 0 0 min(78vw, 20rem);
    scroll-snap-align: start;
    display: flex;

    > * {
      flex: 1;
    }
  }

  &__hint {
    @include mono-label(0.62rem, 0.18em);
    color: rgba($surface, 0.55);
    @include flex(row, center, flex-start, 0.6rem);
  }

  &__cta {
    align-self: flex-start;
    margin-top: $space-lg;
  }
}
</style>
