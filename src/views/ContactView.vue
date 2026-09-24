<script setup lang="ts">
import { site, whatsappLink } from '@/config/site'
import { copy } from '@/components/site/copy'
import { vReveal } from '@/composables/useReveal'
import PageIntro from '@/components/site/PageIntro.vue'
import IconCard from '@/components/site/IconCard.vue'
import ContactForm from '@/components/site/ContactForm.vue'
import VisitCard from '@/components/site/VisitCard.vue'
import ClosingBanner from '@/components/site/ClosingBanner.vue'

// Cada canal sabe a dónde lleva: los externos abren pestaña nueva, los de
// asesor y reunión bajan al formulario.
const targets: Record<string, { href?: string; to?: string; external?: boolean }> = {
  whatsapp: { href: whatsappLink(), external: true },
  email: { href: `mailto:${site.email}` },
  phone: { href: site.phoneHref },
  advisor: { to: '#form-contacto' },
  meeting: { to: '#form-contacto' },
}

const channels = copy.contact.channels.map((channel) => ({
  ...channel,
  link: { label: channel.cta, ...targets[channel.key] },
}))
</script>

<template>
  <div>
    <PageIntro :eyebrow="site.contact.eyebrow" :title="site.contact.title" :lead="site.contact.lead" />

    <section class="channels">
      <IconCard
        v-for="(channel, index) in channels"
        :key="channel.key"
        v-reveal="index"
        :icon="channel.icon"
        :title="channel.title"
        :text="channel.text"
        :link="channel.link"
      />
    </section>

    <section id="form-contacto" class="contact">
      <div class="contact__inner">
        <div v-reveal class="contact__form">
          <h2 class="contact__title">{{ site.contact.formTitle }}</h2>
          <p class="contact__text">{{ site.contact.formText }}</p>
          <ContactForm />
        </div>
        <VisitCard class="contact__visit" />
      </div>
    </section>

    <ClosingBanner
      :title="site.contact.closingTitle"
      :text="site.contact.closingText"
      :cta="{ label: site.contact.closingCta, to: '#form-contacto' }"
    />
  </div>
</template>

<style scoped lang="scss">
.channels {
  @include container;
  @include flex-cards(200px, 1rem);
  padding-block: $space-xl;
}

.contact {
  background: $sand;
  padding-block: $space-section;
  scroll-margin-top: 4.25rem;

  &__inner {
    @include container;
    @include flex(column, stretch, flex-start, 3rem);

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
      gap: 3.5rem;
    }
  }

  &__form {
    @include card;
    @include flex(column, stretch, flex-start, 0.6rem);
    padding: 1.75rem 1.25rem;
    border-radius: $radius-md;
    box-shadow: $shadow-sm;

    @include from('md') {
      padding: 2.5rem;
    }

    @include from('lg') {
      flex: 1 1 58%;
    }
  }

  &__title {
    @include display($display-sm, 800);
  }

  &__text {
    color: $ink-soft;
    margin-bottom: 1rem;
  }

  &__visit {
    @include from('lg') {
      flex: 1 1 42%;
    }
  }
}
</style>
