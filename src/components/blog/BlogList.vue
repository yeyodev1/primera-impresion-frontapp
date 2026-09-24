<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Post } from '@/types'
import { copy, fx } from '@/config/site'
import { formatDate } from '@/utils/format'
import { gsap, useGsapContext } from '@/composables/motion/useGsap'
import { pointerFollow } from '@/composables/motion/usePointerFollow'
import ImageSlot from '@/components/site/ImageSlot.vue'

// Índice editorial: una fila por artículo con número mono, tema, titular
// grande y fecha. Al pasar, la fila se entinta de negro y (puntero fino) una
// hoja con la portada sigue al cursor.
const props = defineProps<{ posts: readonly Post[]; start?: number }>()

const current = ref(0)
const hovered = computed(() => props.posts[current.value] ?? null)
const root = ref<HTMLElement | null>(null)
const follower = ref<HTMLElement | null>(null)

useGsapContext(root, ({ reduced, el }) => {
  if (reduced) return
  gsap.from('.blist__row', {
    y: 40,
    opacity: 0,
    duration: 0.9,
    stagger: 0.07,
    scrollTrigger: { trigger: el, start: 'top 85%', once: true },
  })
  return follower.value ? pointerFollow(el, follower.value) : undefined
})
</script>

<template>
  <div ref="root" class="blist">
    <ol class="blist__rows">
      <li v-for="(post, i) in posts" :key="post._id" class="blist__row" @pointerenter="current = i">
        <span class="blist__num" aria-hidden="true">{{ fx.index((start ?? 1) + i) }}</span>
        <span class="blist__cat">{{ post.category }}</span>
        <h3 class="blist__title">
          <RouterLink :to="`/blog/${post.slug}`" class="blist__link">
            {{ post.title }}
            <span class="visually-hidden">— {{ copy.blog.readMore }}</span>
          </RouterLink>
        </h3>
        <time v-if="post.publishedAt" class="blist__date" :datetime="post.publishedAt">{{ formatDate(post.publishedAt) }}</time>
        <span class="blist__arrow" aria-hidden="true"><i class="fa-solid fa-arrow-right"></i></span>
      </li>
    </ol>
    <div ref="follower" class="blist__follower" aria-hidden="true">
      <ImageSlot v-if="hovered" :image="hovered.coverImage" icon="fa-solid fa-newspaper" ratio="4 / 3" compact />
    </div>
  </div>
</template>

<style scoped lang="scss">
.blist {
  position: relative;

  &__rows {
    list-style: none;
    border-top: 1px solid $ink;
  }

  &__row {
    position: relative;
    isolation: isolate;
    @include flex(row, baseline, flex-start, 0.4rem 1rem);
    flex-wrap: wrap;
    padding: 1.4rem 0.25rem 1.5rem;
    border-bottom: 1px solid rgba($ink, 0.18);
    color: $ink;
    transition: color 0.4s $ease;

    @include from('md') {
      flex-wrap: nowrap;
      align-items: center;
      gap: 1.75rem;
      padding: 1.9rem 1.25rem;
    }

    // La tinta que cubre la fila en hover, de izquierda a derecha.
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      z-index: -1;
      background: $night;
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.55s $ease-press;
    }

    &:hover,
    &:focus-within {
      color: $surface;

      &::before {
        transform: scaleX(1);
      }
    }
  }

  &__num {
    @include mono-label(0.66rem, 0.14em);
    color: $ink-muted;

    @include from('md') {
      flex: 0 0 2.5rem;
    }
  }

  &__cat {
    @include mono-label(0.64rem, 0.14em);
    color: darken($accent-deep, 4%);

    @include from('md') {
      order: 3;
      flex: 0 0 9rem;
      text-align: right;
    }
  }

  &__row:hover &__num,
  &__row:focus-within &__num {
    color: rgba($surface, 0.6);
  }

  &__row:hover &__cat,
  &__row:focus-within &__cat {
    color: $accent;
  }

  &__title {
    flex: 1 1 100%;
    font-family: $font-display;
    font-size: clamp(1.45rem, 1.05rem + 1.5vw, 2.4rem);
    font-weight: 800;
    line-height: 1.02;
    letter-spacing: -0.03em;
    text-wrap: balance;
    transition: transform 0.55s $ease;

    @include from('md') {
      flex: 1 1 auto;
    }
  }

  @include fine-pointer {
    &__row:hover &__title {
      transform: translateX(0.75rem);
    }
  }

  &__link {
    @include focus-ring;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
    }
  }

  &__date {
    @include mono-label(0.62rem, 0.12em);
    opacity: 0.75;

    @include from('md') {
      order: 4;
      flex: 0 0 7.5rem;
      text-align: right;
    }
  }

  &__arrow {
    margin-left: auto;
    @include flex(row, center, center);
    width: 2.6rem;
    height: 2.6rem;
    border-radius: 50%;
    border: 1px solid currentColor;
    transition:
      background-color 0.4s $ease,
      border-color 0.4s $ease,
      transform 0.5s $ease;

    @include from('md') {
      order: 5;
      margin-left: 0;
    }
  }

  &__row:hover &__arrow {
    background: $accent;
    border-color: $accent;
    color: $night;
    transform: rotate(-45deg);
  }

  &__follower {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    width: 15rem;
    // Desplazada a la derecha del cursor para no tapar el titular.
    margin-left: 10rem;
    padding: 0.45rem;
    background: $surface;
    border-radius: 3px;
    box-shadow: 0 30px 60px -20px rgba(#000, 0.5);
    pointer-events: none;
    visibility: hidden;
    display: none;

    @include fine-pointer {
      display: block;
    }
  }
}
</style>
