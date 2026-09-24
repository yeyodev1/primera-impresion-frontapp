<script setup lang="ts">
import { site, fx, fxCatalog } from '@/config/site'
import { ref } from 'vue'
import { gsap, useGsapContext } from '@/composables/motion/useGsap'
import SectionHead from '@/components/site/SectionHead.vue'
import AccessRequestForm from '@/components/site/AccessRequestForm.vue'
import CropMarks from '@/components/site/CropMarks.vue'
import CmykDots from '@/components/site/CmykDots.vue'
import RegMark from '@/components/fx/RegMark.vue'
import ColorBar from '@/components/fx/ColorBar.vue'

// Solicitud de acceso: a la izquierda el encabezado y el aviso de que el
// acceso es selectivo; a la derecha el formulario sobre un pliego blanco con
// cabecera técnica, marcas de corte y tira de control, que entra girando
// levemente como una hoja que se apoya en la mesa.
defineProps<{ index: string }>()

const a = site.autogestion
const f = fxCatalog.autogestion.form
const root = ref<HTMLElement | null>(null)

useGsapContext(root, ({ reduced, el }) => {
  if (reduced) return
  gsap.fromTo(
    el.querySelector('.req__sheet'),
    { y: 90, rotation: 3, autoAlpha: 0 },
    {
      y: 0,
      rotation: 0,
      autoAlpha: 1,
      duration: 1.2,
      ease: 'expo.out',
      clearProps: 'transform,opacity,visibility',
      scrollTrigger: { trigger: el, start: 'top 70%', once: true },
    },
  )
})
</script>

<template>
  <section id="solicitud" ref="root" class="req">
    <RegMark class="req__giant" size="min(90vw, 44rem)" tone="ink" spin />
    <div class="req__inner">
      <div class="req__intro">
        <SectionHead
          :index="index"
          :eyebrow="a.formEyebrow"
          :title="a.formTitle"
          :text="a.formText"
        />
        <p class="req__notice">
          <span class="req__notice-tag"
            ><i class="fa-solid fa-circle-info" aria-hidden="true"></i> {{ f.selective }}</span
          >
          {{ a.formNotice }}
        </p>
      </div>

      <div class="req__sheet">
        <CropMarks inset="0.6rem" />
        <header class="req__head" aria-hidden="true">
          <span><CmykDots /> {{ f.sheet }}</span>
          <span>{{ f.spec }}</span>
        </header>
        <AccessRequestForm />
        <footer class="req__foot" aria-hidden="true">
          <span>{{ fx.coords }}</span>
          <ColorBar compact class="req__bar" />
        </footer>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.req {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding-block: $space-section;
  background: $sand;
  scroll-margin-top: var(--header-h);

  &__giant {
    position: absolute;
    left: -18%;
    bottom: -20%;
    z-index: -1;
    opacity: 0.06;
  }

  &__inner {
    @include container(1320px);
    @include flex(column, stretch, flex-start, 2.5rem);

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
      gap: clamp(3rem, 6vw, 6rem);
    }
  }

  &__intro {
    @include from('lg') {
      flex: 0 0 38%;
      position: sticky;
      top: calc(var(--header-h) + 1.5rem);
    }
  }

  &__notice {
    position: relative;
    @include flex(column, flex-start, flex-start, 0.6rem);
    padding: 1.25rem 1.25rem 1.25rem 1.4rem;
    border-left: 3px solid $accent;
    background: $surface;
    border-radius: 0 3px 3px 0;
    color: $ink-soft;
    font-size: $text-sm;
    line-height: 1.55;
  }

  &__notice-tag {
    @include flex(row, center, flex-start, 0.45rem);
    @include mono-label(0.62rem, 0.16em);
    color: darken($accent-deep, 4%);
  }

  &__sheet {
    position: relative;
    padding: 1.5rem 1.25rem 1.25rem;
    border-radius: 3px;
    background: $surface;
    box-shadow:
      0 0 0 1px rgba($ink, 0.06),
      0 50px 90px -50px rgba($ink, 0.5);

    @include from('md') {
      padding: 2.25rem 2.25rem 1.5rem;
    }

    @include from('lg') {
      flex: 1 1 auto;
      min-width: 0;
    }
  }

  &__head,
  &__foot {
    @include flex(row, center, space-between, 0.5rem 1rem);
    flex-wrap: wrap;
    @include mono-label(0.58rem, 0.16em);
    color: $ink-muted;

    > span {
      @include flex(row, center, flex-start, 0.6rem);
    }
  }

  &__head {
    padding-bottom: 0.9rem;
    margin-bottom: 1.75rem;
    border-bottom: 2px solid $ink;
  }

  &__foot {
    margin-top: 1.75rem;
    padding-top: 0.9rem;
    border-top: 1px solid $line;
  }

  &__bar {
    max-width: 7rem;
  }
}
</style>
