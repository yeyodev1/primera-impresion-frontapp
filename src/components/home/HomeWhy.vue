<script setup lang="ts">
import { site, fx } from '@/config/site'
import SectionHead from '@/components/site/SectionHead.vue'
import TiltCard from '@/components/fx/TiltCard.vue'
import HalftoneBg from '@/components/site/HalftoneBg.vue'

// Por qué Primera Impresión: los tres argumentos del prototipo, sin cifras
// aparte que los repitan.
defineProps<{ index: string }>()
</script>

<template>
  <section class="why">
    <HalftoneBg fade="left" />
    <div class="why__inner">
      <SectionHead :index="index" tone="night" :title="site.home.why.title" />
      <ul class="why__cards">
        <TiltCard v-for="(item, i) in site.home.why.items" :key="item.title" as="li" tone="night" class="why__card">
          <p class="why__meta">
            <span>{{ fx.index(i + 1) }}</span>
            <i :class="item.icon" aria-hidden="true"></i>
          </p>
          <h3 class="why__title">{{ item.title }}</h3>
          <p class="why__text">{{ item.text }}</p>
        </TiltCard>
      </ul>
    </div>
  </section>
</template>

<style scoped lang="scss">
.why {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding-block: $space-section;
  background: $night;
  color: $surface;

  &__inner {
    @include container(1320px);
    position: relative;
    z-index: 1;
  }

  &__cards {
    list-style: none;
    @include flex-cards(260px, 1rem);
    margin-top: $space-xl;
  }

  &__card {
    @include flex(column, flex-start, flex-start, 0.8rem);
    padding: 1.75rem 1.6rem 2rem;
    border-radius: 4px;
    background: rgba($surface, 0.04);
    box-shadow: inset 0 0 0 1px rgba($surface, 0.1);
  }

  &__meta {
    @include flex(row, center, space-between, 1rem);
    width: 100%;
    margin-bottom: 2.5rem;
    @include mono-label(0.66rem, 0.16em);
    color: rgba($surface, 0.55);

    i {
      font-size: 1.5rem;
      color: $accent;
    }
  }

  &__title {
    font-size: clamp(1.35rem, 1.1rem + 0.8vw, 1.75rem);
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  &__text {
    color: rgba($surface, 0.7);
    line-height: 1.6;
  }
}
</style>
