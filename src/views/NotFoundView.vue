<script setup lang="ts">
import { copy } from '@/components/site/copy'
import HalftoneBg from '@/components/site/HalftoneBg.vue'
import CropMarks from '@/components/site/CropMarks.vue'
import CmykDots from '@/components/site/CmykDots.vue'
import BrandMark from '@/components/brand/BrandMark.vue'
</script>

<template>
  <section class="nf">
    <HalftoneBg />
    <div class="nf__sheet">
      <CropMarks tone="light" />
      <BrandMark tone="light" class="nf__brand" />
      <p class="nf__code"><CmykDots /> {{ copy.notFound.code }}</p>
      <h1 class="nf__title">{{ copy.notFound.title }}</h1>
      <p class="nf__text">{{ copy.notFound.text }}</p>
      <div class="nf__actions">
        <RouterLink to="/" class="btn btn--primary">{{ copy.notFound.home }}</RouterLink>
        <RouterLink to="/soluciones" class="btn btn--outline-light">{{ copy.notFound.explore }}</RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.nf {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  flex: 1;
  @include flex(column, center, center);
  padding: $space-xl 1.25rem;
  background: $night;
  color: $surface;

  &__sheet {
    position: relative;
    z-index: 1;
    @include flex(column, center, center, 1rem);
    max-width: 36rem;
    padding: 3rem 1.75rem;
    text-align: center;
  }

  &__brand {
    font-size: 0.85rem;
    margin-bottom: 1rem;
  }

  &__code {
    @include eyebrow;
    @include flex(row, center, center, 0.75rem);
    color: $accent;
  }

  &__title {
    @include display($display-md, 800);
  }

  &__text {
    color: rgba($surface, 0.75);
  }

  &__actions {
    @include flex(row, center, center, 0.75rem);
    flex-wrap: wrap;
    margin-top: 0.75rem;
  }
}
</style>
