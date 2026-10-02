<script setup lang="ts">
import { copy, fxPages } from '@/config/site'
import type { Post } from '@/types'
import { formatDate } from '@/utils/format'
import ImageSlot from '@/components/site/ImageSlot.vue'
import CropMarks from '@/components/site/CropMarks.vue'

// Artículo destacado: portada de revista a lo ancho, con la foto a sangre en
// su caja, rótulos mono y un titular grande que se subraya como resaltador.
// Toda la pieza es clicable (el enlace estira su área con ::after).
defineProps<{ post: Post }>()
</script>

<template>
  <article class="feat">
    <div class="feat__media">
      <ImageSlot :image="post.coverImage" :alt="post.title" icon="fa-solid fa-newspaper" :label="copy.imagePending" />
    </div>
    <div class="feat__body">
      <CropMarks inset="0" />
      <p class="feat__meta">
        <span class="feat__badge">{{ fxPages.blog.featured }}</span>
        <span class="feat__cat">{{ post.category }}</span>
        <time v-if="post.publishedAt" :datetime="post.publishedAt">{{ formatDate(post.publishedAt) }}</time>
      </p>
      <h3 class="feat__title"><span>{{ post.title }}</span></h3>
      <p v-if="post.excerpt" class="feat__text">{{ post.excerpt }}</p>
      <RouterLink :to="`/blog/${post.slug}`" class="feat__link">
        {{ copy.blog.readMore }}
        <span class="visually-hidden">: {{ post.title }}</span>
        <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
      </RouterLink>
    </div>
  </article>
</template>

<style scoped lang="scss">
.feat {
  position: relative;
  @include flex(column, stretch, flex-start, 1.5rem);

  @include from('lg') {
    flex-direction: row;
    align-items: stretch;
    gap: 3rem;
  }

  &__media {
    overflow: hidden;
    border-radius: 4px;

    @include from('lg') {
      flex: 1 1 58%;
    }

    :deep(.slot__img),
    :deep(.slot__icon),
    :deep(.slot__screen) {
      transition: transform 1s $ease;
    }
  }

  &:hover &__media :deep(.slot__img),
  &:hover &__media :deep(.slot__icon) {
    transform: scale(1.06);
  }

  &:hover &__media :deep(.slot__screen) {
    transform: scale(1.15);
  }

  &__body {
    position: relative;
    @include flex(column, flex-start, flex-start, 1rem);
    padding: 0.5rem 0;

    @include from('lg') {
      flex: 1 1 42%;
      justify-content: flex-end;
      padding: 1.75rem 1.75rem 1.5rem;
    }

    :deep(.crop) {
      display: none;

      @include from('lg') {
        display: block;
      }
    }
  }

  &__meta {
    @include flex(row, center, flex-start, 0.5rem 1rem);
    flex-wrap: wrap;
    @include mono-label(0.64rem, 0.14em);
    color: $ink-muted;
  }

  &__badge {
    padding: 0.3rem 0.55rem;
    background: $accent;
    color: $night;
    border-radius: 2px;
  }

  &__cat {
    color: darken($accent-deep, 4%);
  }

  &__title {
    font-family: $font-display;
    font-size: clamp(2rem, 1.3rem + 2.6vw, 3.6rem);
    font-weight: 800;
    line-height: 0.98;
    letter-spacing: -0.035em;
    text-wrap: balance;

    span {
      background: linear-gradient(rgba($accent, 0.4), rgba($accent, 0.4)) no-repeat 0 90% / 0% 0.28em;
      transition: background-size 0.7s $ease;
    }
  }

  &:hover &__title span {
    background-size: 100% 0.28em;
  }

  &__text {
    max-width: 48ch;
    font-size: $text-lg;
    line-height: 1.55;
    color: $ink-soft;
  }

  &__link {
    @include flex(row, center, flex-start, 0.6rem);
    margin-top: 0.5rem;
    padding: 0.85rem 1.4rem;
    border-radius: $radius-pill;
    background: $night;
    color: $surface;
    font-weight: 600;
    @include transition(background);
    @include focus-ring;

    i {
      @include transition(transform);
    }

    &::after {
      content: '';
      position: absolute;
      inset: 0;
    }
  }

  &:hover &__link {
    background: $accent-deep;

    i {
      transform: translateX(4px) rotate(-45deg);
    }
  }
}
</style>
