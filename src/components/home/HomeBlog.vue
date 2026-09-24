<script setup lang="ts">
import type { Post } from '@/types'
import { site } from '@/config/site'
import SectionHead from '@/components/site/SectionHead.vue'
import PostCard from '@/components/site/PostCard.vue'

// Últimos artículos del blog. HomeView solo lo monta si hay publicados.
defineProps<{ index: string; posts: readonly Post[] }>()
</script>

<template>
  <section class="hblog">
    <div class="hblog__inner">
      <div class="hblog__top">
        <SectionHead :index="index" :eyebrow="site.home.blog.eyebrow" :title="site.home.blog.title" />
        <RouterLink to="/blog" class="hblog__all">
          {{ site.home.blog.cta }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
        </RouterLink>
      </div>
      <div class="hblog__cards">
        <PostCard v-for="post in posts" :key="post._id" :post="post" />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.hblog {
  padding-block: $space-section;
  background: $paper;

  &__inner {
    @include container(1320px);
  }

  &__top {
    @include flex(column, flex-start, space-between, 0 2rem);

    @include from('md') {
      flex-direction: row;
      align-items: flex-end;
    }
  }

  &__all {
    @include flex(row, center, flex-start, 0.5rem);
    margin-bottom: $space-lg;
    font-weight: 700;
    white-space: nowrap;
    border-bottom: 1px solid $ink;
    padding-block: 0.3rem;
    @include focus-ring;
  }

  &__cards {
    @include flex-cards(280px, 2rem 1.5rem);

    > * {
      @include from('lg') {
        max-width: calc(33.333% - 1rem);
      }
    }
  }
}
</style>
