<script setup lang="ts">
import { site, copy, whatsappLink, contactForm, fx, fxPages } from '@/config/site'
import { ref } from 'vue'
import { gsap, useGsapContext } from '@/composables/motion/useGsap'
import SectionHead from '@/components/site/SectionHead.vue'
import SmartLink from '@/components/site/SmartLink.vue'

// Los canales directos como filas grandes: número mono, icono y canal. Al
// pasar, la tinta naranja cubre la fila y el icono se desregistra. El botón
// de cada fila es un enlace real que no cambia al hacer clic: WhatsApp abre
// el chat, «Llamar ahora» marca y el correo abre el cliente de correo. Un canal
// sin dato confirmado en site.ts lleva al formulario.
defineProps<{ index: string }>()

const targets: Record<string, { href: string }> = {
  whatsapp: { href: site.whatsapp ? whatsappLink() : contactForm },
  email: { href: site.email ? `mailto:${site.email}` : contactForm },
  phone: { href: site.phone ? site.phoneHref : contactForm },
}

const channels = copy.contact.channels.map((c) => {
  const target = targets[c.key]!
  // El rótulo del canal («Llamar ahora») solo tiene sentido con el dato real.
  const pending = target.href === contactForm
  return { ...c, ...target, cta: pending ? copy.contact.formCta : c.cta }
})
const root = ref<HTMLElement | null>(null)

useGsapContext(root, ({ reduced }) => {
  if (reduced) return
  gsap.from('.chan__row', {
    y: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.08,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.chan__list', start: 'top 85%', once: true },
  })
})
</script>

<template>
  <section ref="root" class="chan">
    <div class="chan__inner">
      <SectionHead :index="index" :eyebrow="fxPages.contact.channelsEyebrow" :title="fxPages.contact.channelsTitle" />
      <ul class="chan__list">
        <li v-for="(c, i) in channels" :key="c.key" class="chan__row">
          <span class="chan__num" aria-hidden="true">{{ fx.index(i + 1) }}</span>
          <i :class="c.icon" class="chan__icon" aria-hidden="true"></i>
          <div class="chan__copy">
            <h3 class="chan__title">{{ c.title }}</h3>
            <p class="chan__text">{{ c.text }}</p>
          </div>
          <SmartLink :to="c.href" class="chan__cta">
            {{ c.cta }}
            <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </SmartLink>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped lang="scss">
.chan {
  padding-block: $space-section;
  background: $paper;

  &__inner {
    @include container(1320px);
  }

  &__list {
    list-style: none;
    border-top: 1px solid $ink;
  }

  &__row {
    position: relative;
    isolation: isolate;
    @include flex(row, center, flex-start, 0.9rem 1.1rem);
    flex-wrap: wrap;
    padding: 1.5rem 0.25rem;
    border-bottom: 1px solid rgba($ink, 0.18);
    color: $ink;

    @include from('md') {
      gap: 1rem 2rem;
      padding: 2rem 1.5rem;
    }

    @include from('lg') {
      flex-wrap: nowrap;
    }

    // Tinta naranja que barre la fila.
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      z-index: -1;
      background: $accent;
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.6s $ease-press;
    }

    &:hover::before,
    &:focus-within::before {
      transform: scaleX(1);
    }
  }

  &__num {
    @include mono-label(0.66rem, 0.14em);
    color: $ink-muted;

    @include from('md') {
      flex: 0 0 2rem;
    }
  }

  &__icon {
    font-size: 1.6rem;
    color: $accent-deep;
    transition:
      text-shadow 0.35s $ease,
      transform 0.5s $ease,
      color 0.35s $ease;

    @include from('md') {
      flex: 0 0 3rem;
      font-size: 2.3rem;
      text-align: center;
    }
  }

  &__copy {
    flex: 1 1 100%;
    @include flex(column, flex-start, flex-start, 0.3rem);
    transition: transform 0.55s $ease;

    @include from('lg') {
      flex: 1 1 auto;
    }
  }

  &__title {
    font-family: $font-display;
    font-size: clamp(1.8rem, 1.2rem + 2.4vw, 3.4rem);
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.035em;
  }

  &__text {
    color: $ink-soft;
  }

  &__cta {
    @include flex(row, center, center, 0.55rem);
    position: relative;
    z-index: 1;
    margin-left: auto;
    @include focus-ring($night);
    padding: 0.6rem 1rem;
    border: 1px solid currentColor;
    border-radius: $radius-pill;
    font-size: $text-sm;
    font-weight: 600;
    white-space: nowrap;
    transition:
      background-color 0.4s $ease,
      color 0.4s $ease,
      border-color 0.4s $ease;

    i {
      transition: transform 0.4s $ease;
    }
  }

  // Estado entintado: todo pasa a negro sobre naranja (AA).
  &__row:hover &__num,
  &__row:focus-within &__num,
  &__row:hover &__text,
  &__row:focus-within &__text {
    color: $night;
  }

  &__row:hover &__icon,
  &__row:focus-within &__icon {
    color: $night;
    transform: scale(1.08) rotate(-6deg);
    text-shadow:
      -3px -1px 0 rgba($cmyk-c, 0.7),
      3px 1px 0 rgba($cmyk-m, 0.6);
  }

  &__row:hover &__cta,
  &__row:focus-within &__cta {
    background: $night;
    border-color: $night;
    color: $surface;

    i {
      transform: translateX(3px) rotate(-45deg);
    }
  }

  @include fine-pointer {
    &__row:hover &__copy {
      transform: translateX(0.75rem);
    }
  }
}
</style>
