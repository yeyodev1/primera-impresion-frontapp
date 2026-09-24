<script setup lang="ts">
import { site, copy, fx, fxPages } from '@/config/site'
import { computed, ref, toRef } from 'vue'
import type { Post } from '@/types'
import { useReading } from '@/composables/useReading'
import { gsap, useGsapContext } from '@/composables/motion/useGsap'
import ImageSlot from '@/components/site/ImageSlot.vue'
import RegMark from '@/components/fx/RegMark.vue'
import ColorBar from '@/components/fx/ColorBar.vue'
import PostProse from './PostProse.vue'
import PostRail from './PostRail.vue'

// Cuerpo del artículo: portada en su hoja (entra con un recorte de abajo
// hacia arriba), riel de lectura y texto de revista; cierra con el colofón.
const props = defineProps<{ post: Post; html: string }>()

const prose = ref<InstanceType<typeof PostProse> | null>(null)
const proseEl = computed(() => (prose.value?.$el as HTMLElement | undefined) ?? null)
const { headings, progress, active } = useReading(proseEl, toRef(props, 'html'))

const root = ref<HTMLElement | null>(null)
useGsapContext(root, ({ reduced }) => {
  if (reduced) return
  gsap.fromTo(
    '.part__cover',
    { clipPath: 'inset(18% 6% 18% 6%)' },
    { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.out', delay: 0.2 },
  )
  gsap.from('.part__cover .slot__icon', { scale: 1.3, duration: 1.6, ease: 'expo.out', delay: 0.2 })
})
</script>

<template>
  <section ref="root" class="part">
    <div class="part__inner">
      <div class="part__cover">
        <ImageSlot :image="post.coverImage" :alt="post.title" icon="fa-solid fa-newspaper" ratio="21 / 9" :label="copy.imagePending" />
      </div>

      <div class="part__row">
        <PostRail class="part__rail" :headings="headings" :progress="progress" :active="active" />
        <div class="part__main">
          <PostProse ref="prose" :html="html" />
          <footer class="part__end">
            <p class="part__stamp" aria-hidden="true">
              <RegMark size="1.1rem" tone="accent" />
              <span>{{ fxPages.post.end }}</span>
              <span class="part__coords">{{ fx.coords }}</span>
            </p>
            <ColorBar compact />
            <div class="part__links">
              <RouterLink :to="{ path: '/blog', query: { tema: post.category } }" class="part__topic">
                <span>{{ fxPages.post.topic }}</span> {{ post.category }}
              </RouterLink>
              <RouterLink to="/blog" class="part__back">
                <i class="fa-solid fa-arrow-left" aria-hidden="true"></i> {{ site.blog.back }}
              </RouterLink>
            </div>
          </footer>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.part {
  background: $paper;
  padding-block: 2rem $space-section;

  @include from('md') {
    padding-top: 3rem;
  }

  &__inner {
    @include container(1320px);
  }

  &__cover {
    padding: 0.5rem;
    background: $surface;
    border-radius: 4px;
    box-shadow: 0 40px 80px -50px rgba($ink, 0.5);
  }

  &__row {
    @include flex(column, stretch, flex-start, 1.5rem);
    margin-top: $space-xl;

    @include from('lg') {
      flex-direction: row;
      align-items: stretch;
      gap: clamp(3rem, 6vw, 6rem);
    }
  }

  &__rail {
    @include from('lg') {
      flex: 0 0 15rem;
    }
  }

  &__main {
    flex: 1;
    min-width: 0;
    @include flex(column, flex-start, flex-start, 0);
  }

  &__end {
    width: 100%;
    max-width: 42rem;
    @include flex(column, stretch, flex-start, 1.25rem);
    margin-top: $space-xl;
    padding-top: 1.25rem;
    border-top: 1px solid $ink;
  }

  &__stamp {
    @include flex(row, center, flex-start, 0.6rem);
    @include mono-label(0.64rem, 0.18em);
    color: $ink-muted;
  }

  &__coords {
    margin-left: auto;
  }

  &__links {
    @include flex(row, center, space-between, 1rem);
    flex-wrap: wrap;
  }

  &__topic {
    @include flex(row, center, flex-start, 0.6rem);
    min-height: 44px;
    padding: 0.5rem 1rem;
    border-radius: 3px;
    background: $night;
    color: $surface;
    font-weight: 600;
    @include transition(background);
    @include focus-ring;

    span {
      @include mono-label(0.6rem, 0.16em);
      color: $accent;
    }

    &:hover {
      background: $accent-deep;

      span {
        color: $surface;
      }
    }
  }

  &__back {
    @include flex(row, center, flex-start, 0.5rem);
    min-height: 44px;
    font-weight: 600;
    color: $ink;
    @include focus-ring;

    i {
      color: $accent-deep;
      @include transition(transform);
    }

    &:hover i {
      transform: translateX(-4px);
    }
  }
}
</style>
