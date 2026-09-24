<script setup lang="ts">
import { site, copy } from '@/config/site'
import { vReveal } from '@/composables/useReveal'
import PageIntro from '@/components/site/PageIntro.vue'
import SectionHead from '@/components/site/SectionHead.vue'
import ImageSlot from '@/components/site/ImageSlot.vue'
import StepList from '@/components/site/StepList.vue'
import ClosingBanner from '@/components/site/ClosingBanner.vue'

const ab = site.about
const galleryIcons = ['fa-solid fa-tags', 'fa-solid fa-box-open', 'fa-solid fa-sign-hanging']
</script>

<template>
  <div>
    <PageIntro :eyebrow="ab.eyebrow" :title="ab.title" :lead="ab.lead" />

    <section class="history">
      <div class="history__copy">
        <SectionHead :eyebrow="ab.historyEyebrow" :title="ab.historyTitle" :text="ab.historyText" />
        <p class="history__since" aria-hidden="true">{{ site.since }}</p>
      </div>
      <div v-reveal class="history__media">
        <ImageSlot icon="fa-solid fa-industry" ratio="4 / 3" :label="copy.imagePending" />
      </div>
    </section>

    <section class="block block--sand">
      <div class="block__inner">
        <SectionHead :title="ab.capacityTitle" :text="ab.capacityText" />
        <div class="capacity">
          <article v-for="(item, index) in ab.capacity" :key="item.title" v-reveal="index" class="capacity__item">
            <ImageSlot :icon="item.icon" ratio="1 / 1" compact />
            <h3 class="capacity__title">
              <i :class="item.icon" aria-hidden="true"></i>
              {{ item.title }}
            </h3>
          </article>
        </div>
      </div>
    </section>

    <section class="block">
      <div class="block__inner">
        <SectionHead :title="ab.processTitle" />
        <StepList :steps="ab.process" />
      </div>
    </section>

    <section class="block block--sand">
      <div class="block__inner">
        <SectionHead :title="ab.galleryTitle" :text="ab.galleryText" />
        <div class="gallery">
          <ImageSlot
            v-for="(icon, index) in galleryIcons"
            :key="icon"
            v-reveal="index"
            :icon="icon"
            ratio="4 / 5"
            :label="copy.imagePending"
          />
        </div>
      </div>
    </section>

    <ClosingBanner
      :title="ab.closingTitle"
      :text="ab.closingText"
      :cta="{ label: copy.about.closingCta, to: '/contacto' }"
    />
  </div>
</template>

<style scoped lang="scss">
.history {
  @include container;
  @include flex(column, stretch, flex-start, 2.5rem);
  padding-block: $space-section;

  @include from('lg') {
    flex-direction: row;
    align-items: center;
    gap: 4rem;
  }

  &__copy,
  &__media {
    @include from('lg') {
      flex: 1 1 50%;
    }
  }

  // El año como tipografía de pliego: grande, contorneado, de fondo.
  &__since {
    font-family: $font-display;
    font-weight: 800;
    font-size: clamp(4.5rem, 3rem + 7vw, 8.5rem);
    line-height: 0.85;
    letter-spacing: -0.05em;
    color: transparent;
    -webkit-text-stroke: 1.5px $accent;
  }
}

.block {
  padding-block: $space-section;

  &--sand {
    background: $sand;
  }

  &__inner {
    @include container;
  }
}

.capacity {
  @include flex-cards(200px, 1.25rem);

  &__item {
    @include card;
    padding: 0.6rem 0.6rem 1.1rem;
    border-radius: $radius-sm;
    @include flex(column, stretch, flex-start, 1rem);
  }

  &__title {
    @include flex(row, center, flex-start, 0.6rem);
    padding-inline: 0.5rem;
    font-size: $text-lg;
    font-weight: 700;

    i {
      color: $accent;
      font-size: 0.95em;
    }
  }
}

.gallery {
  @include flex-cards(240px, 1.25rem);
}
</style>
