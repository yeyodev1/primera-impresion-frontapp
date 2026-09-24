<script setup lang="ts">
import type { Post } from '@/types'
import { formatDate } from '@/utils/format'
import { copy } from '@/config/site'
import ImageSlot from './ImageSlot.vue'

// Artículo del blog como una página de revista: portada, tema y fecha en
// mono, titular que se subraya al pasar. Toda la tarjeta es clicable.
defineProps<{ post: Post }>()
</script>

<template>
  <article class="pcard">
    <ImageSlot :image="post.coverImage" :alt="post.title" icon="fa-solid fa-newspaper" ratio="16 / 10" compact />
    <div class="pcard__body">
      <p class="pcard__meta">
        <span class="pcard__cat">{{ post.category }}</span>
        <time v-if="post.publishedAt" :datetime="post.publishedAt">{{ formatDate(post.publishedAt) }}</time>
      </p>
      <h3 class="pcard__title"><span>{{ post.title }}</span></h3>
      <p v-if="post.excerpt" class="pcard__text">{{ post.excerpt }}</p>
      <RouterLink :to="`/blog/${post.slug}`" class="pcard__link">
        {{ copy.blog.readMore }}
        <span class="visually-hidden">: {{ post.title }}</span>
        <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
      </RouterLink>
    </div>
  </article>
</template>

<style scoped lang="scss">
.pcard {
  position: relative;
  @include flex(column, stretch, flex-start, 0.4rem);

  :deep(.slot__icon),
  :deep(.slot__img) {
    transition: transform 0.9s $ease;
  }

  &:hover :deep(.slot__img),
  &:hover :deep(.slot__icon) {
    transform: scale(1.06);
  }

  &__body {
    flex: 1;
    @include flex(column, flex-start, flex-start, 0.55rem);
    padding: 0.9rem 0.1rem 0.25rem;
  }

  &__meta {
    @include flex(row, center, space-between, 0.75rem);
    width: 100%;
    flex-wrap: wrap;
    @include mono-label(0.62rem, 0.12em);
    color: $ink-muted;
  }

  &__cat {
    color: darken($accent-deep, 4%);
  }

  &__title {
    font-size: clamp(1.3rem, 1.05rem + 0.8vw, 1.65rem);
    font-weight: 800;
    letter-spacing: -0.02em;

    // Subrayado de resaltador que se dibuja en hover.
    span {
      background: linear-gradient(rgba($accent, 0.35), rgba($accent, 0.35)) no-repeat 0 88% / 0% 0.3em;
      transition: background-size 0.6s $ease;
    }
  }

  &:hover &__title span {
    background-size: 100% 0.3em;
  }

  &__text {
    font-size: $text-sm;
    color: $ink-soft;
    line-height: 1.55;
  }

  &__link {
    margin-top: auto;
    padding-top: 0.4rem;
    @include flex(row, center, flex-start, 0.45rem);
    font-weight: 600;
    font-size: $text-sm;
    color: $ink;
    @include focus-ring;

    i {
      color: $accent-deep;
      transition: transform 0.4s $ease;
    }

    &::after {
      content: '';
      position: absolute;
      inset: 0;
    }
  }

  &:hover &__link i {
    transform: translateX(4px);
  }
}
</style>
