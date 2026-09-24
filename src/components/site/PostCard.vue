<script setup lang="ts">
import type { Post } from '@/types'
import { formatDate } from '@/utils/format'
import ImageSlot from './ImageSlot.vue'
import { copy } from './copy'

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
      <h3 class="pcard__title">{{ post.title }}</h3>
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
  @include card;
  position: relative;
  @include flex(column, stretch, flex-start);
  padding: 0.6rem;
  border-radius: $radius-sm;
  @include transition;

  &:hover {
    border-color: rgba($accent, 0.45);
    box-shadow: $shadow-md;
    transform: translateY(-2px);
  }

  &__body {
    flex: 1;
    @include flex(column, flex-start, flex-start, 0.5rem);
    padding: 1rem 0.9rem 0.9rem;
  }

  &__meta {
    @include flex(row, center, flex-start, 0.75rem);
    flex-wrap: wrap;
    font-size: $text-xs;
    color: $ink-soft;
  }

  &__cat {
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: darken($accent-deep, 4%);
  }

  &__title {
    font-size: $text-xl;
    font-weight: 700;
  }

  &__text {
    font-size: $text-sm;
    color: $ink-soft;
    line-height: 1.55;
  }

  &__link {
    margin-top: auto;
    padding-top: 0.5rem;
    @include flex(row, center, flex-start, 0.45rem);
    font-weight: 600;
    font-size: $text-sm;
    color: $ink;
    @include focus-ring;

    i {
      color: $accent;
    }

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
    }
  }
}
</style>
