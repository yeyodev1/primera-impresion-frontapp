<script setup lang="ts">
import { ref } from 'vue'
import { site, whatsappLink, portalLink, contactForm, copy, fx } from '@/config/site'
import { gsap, useGsapContext } from '@/composables/motion/useGsap'
import BrandMark from '@/components/brand/BrandMark.vue'
import ColorBar from '@/components/fx/ColorBar.vue'
import FooterCta from '@/components/site/FooterCta.vue'
import SmartLink from '@/components/site/SmartLink.vue'
import WhatsAppFloat from '@/components/site/WhatsAppFloat.vue'

const year = new Date().getFullYear()
const root = ref<HTMLElement | null>(null)

// Redes y datos directos aparecen solo cuando están confirmados en site.ts.
const socials = site.social.filter((item) => item.href)

// El wordmark gigante sube desde el borde inferior mientras se llega al final.
useGsapContext(root, ({ reduced, el }) => {
  if (reduced) return
  gsap.fromTo(
    '.footer__word',
    { yPercent: 45 },
    { yPercent: 12, ease: 'none', scrollTrigger: { trigger: el, start: 'bottom-=40% bottom', end: 'bottom bottom', scrub: 0.6 } },
  )
})

function toTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <footer ref="root" class="footer">
    <ColorBar tone="night" :labels="false" class="footer__strip" />
    <div class="footer__wrap">
      <FooterCta />

      <div class="footer__cols">
        <div class="footer__brand">
          <RouterLink to="/" class="footer__logo" :aria-label="copy.header.home">
            <BrandMark tone="light" tagline />
          </RouterLink>
          <p class="footer__text">{{ site.tagline }} {{ site.city }}.</p>
          <ul v-if="socials.length" class="footer__social" :aria-label="copy.footer.social">
            <li v-for="item in socials" :key="item.href">
              <a :href="item.href" target="_blank" rel="noopener" class="footer__social-link">
                <i :class="item.icon" aria-hidden="true"></i>
                <span class="visually-hidden">{{ item.label }} {{ copy.header.newTab }}</span>
              </a>
            </li>
          </ul>
        </div>

        <nav class="footer__col" aria-labelledby="footer-explore">
          <h2 id="footer-explore" class="footer__heading">{{ site.footer.explore }}</h2>
          <RouterLink v-for="link in site.nav" :key="link.to" :to="link.to" class="footer__link">{{ link.label }}</RouterLink>
        </nav>

        <div class="footer__col">
          <h2 class="footer__heading">{{ site.footer.contact }}</h2>
          <SmartLink v-if="site.address" :to="site.mapsUrl || contactForm" class="footer__link">
            <span class="visually-hidden">{{ copy.footer.address }}: </span>{{ site.address }}
          </SmartLink>
          <a v-if="site.phone" :href="site.phoneHref" class="footer__link">
            <span class="visually-hidden">{{ copy.footer.phone }}: </span>{{ site.phone }}
          </a>
          <a v-if="site.email" :href="`mailto:${site.email}`" class="footer__link">
            <span class="visually-hidden">{{ copy.footer.email }}: </span>{{ site.email }}
          </a>
          <SmartLink v-if="site.whatsapp" :to="whatsappLink()" class="footer__link">{{ copy.footer.whatsapp }}</SmartLink>
          <RouterLink to="/contacto" class="footer__link">{{ copy.footer.advisor }}</RouterLink>
          <RouterLink :to="contactForm" class="footer__link">{{ copy.footer.form }}</RouterLink>
        </div>

        <div class="footer__col">
          <h2 class="footer__heading">{{ site.footer.portal }}</h2>
          <p class="footer__small">{{ copy.footer.portalText }}</p>
          <SmartLink :to="portalLink()" class="footer__link footer__link--strong">
            {{ site.portalUrl ? copy.footer.portalCta : copy.footer.portalInfo }}
            <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </SmartLink>
          <RouterLink to="/autogestion#solicitud" class="footer__link">{{ copy.footer.portalRequest }}</RouterLink>
        </div>
      </div>

      <div class="footer__bar">
        <span>© {{ year }} {{ site.name }}. {{ site.footer.rights }}</span>
        <span class="footer__coords" aria-hidden="true">{{ fx.coords }}</span>
        <span>
          {{ copy.footer.credit }}
          <a href="https://bakano.ec" target="_blank" rel="noopener" class="footer__link">Bakano</a>
        </span>
        <button type="button" class="footer__top" @click="toTop">
          {{ fx.footer.top }} <i class="fa-solid fa-arrow-up" aria-hidden="true"></i>
        </button>
      </div>
    </div>
    <p class="footer__word" aria-hidden="true">{{ site.name }}</p>
  </footer>
  <!-- Fuera del footer: su stacking context no debe encerrar al botón fijo. -->
  <WhatsAppFloat />
</template>

<style scoped lang="scss">
.footer {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  margin-top: auto;
  background: $night;
  color: rgba($surface, 0.72);

  &__strip {
    max-width: none;
    gap: 0;

    :deep(.cbar__chip) {
      height: 0.5rem;
    }
  }

  &__wrap {
    @include container(1320px);
    position: relative;
    z-index: 1;
  }

  &__cols {
    @include flex-cards(190px, 2.5rem 2rem);
    padding-block: 3rem 2.5rem;
  }

  &__brand {
    flex: 2 1 280px !important;
    @include flex(column, flex-start, flex-start, 1rem);
  }

  &__logo {
    font-size: 0.95rem;
    border-radius: 4px;
    @include focus-ring;
  }

  &__text,
  &__small {
    font-size: $text-sm;
    line-height: 1.6;
    max-width: 40ch;
  }

  &__social {
    list-style: none;
    @include flex(row, center, flex-start, 0.5rem);
  }

  &__social-link {
    @include flex(row, center, center);
    width: 2.6rem;
    height: 2.6rem;
    border-radius: 50%;
    border: 1px solid rgba($surface, 0.2);
    color: $surface;
    font-size: 1.05rem;
    @include transition(background, border-color, color);
    @include focus-ring;

    &:hover {
      background: $accent;
      border-color: $accent;
      color: $night;
    }
  }

  &__col {
    @include flex(column, flex-start, flex-start, 0.6rem);
  }

  &__heading {
    @include mono-label(0.66rem, 0.2em);
    color: $accent;
    margin-bottom: 0.4rem;
  }

  &__link {
    font-size: $text-sm;
    color: rgba($surface, 0.8);
    border-radius: 3px;
    background: linear-gradient($accent, $accent) no-repeat 0 100% / 0% 1px;
    transition:
      background-size 0.45s $ease,
      color 0.3s ease;
    @include focus-ring;

    &:hover {
      color: $surface;
      background-size: 100% 1px;
    }

    &--strong {
      font-weight: 700;
      color: $surface;
    }
  }

  &__bar {
    @include flex(row, center, space-between, 0.75rem 1.5rem);
    flex-wrap: wrap;
    padding-block: 1.25rem;
    border-top: 1px solid rgba($surface, 0.1);
    font-size: $text-xs;
    color: rgba($surface, 0.6);
  }

  &__coords {
    @include mono-label(0.6rem, 0.18em);
  }

  &__top {
    @include flex(row, center, flex-start, 0.45rem);
    @include mono-label(0.62rem, 0.16em);
    color: $surface;
    border-radius: 3px;
    @include focus-ring;

    &:hover {
      color: $accent;
    }
  }

  // Wordmark gigante recortado por el borde inferior, relleno de semitono.
  &__word {
    position: relative;
    z-index: 0;
    // Se corta por el borde inferior del footer, como un pliego a sangre.
    margin-top: 1.5rem;
    margin-bottom: -0.3em;
    padding-top: 0.12em;
    font-family: $font-display;
    font-weight: 800;
    font-size: 10.2vw;
    line-height: 1;
    letter-spacing: -0.05em;
    text-transform: uppercase;
    text-align: center;
    white-space: nowrap;
    color: transparent;
    background-image:
      radial-gradient(rgba($accent, 0.9) 1.6px, transparent 2.2px),
      linear-gradient(rgba($surface, 0.06), rgba($surface, 0.06));
    background-size:
      8px 8px,
      100% 100%;
    background-clip: text;
    -webkit-background-clip: text;

    // En móvil la letra es chica: trama más fina para que se lea.
    @include until('md') {
      background-image:
        radial-gradient(rgba($accent, 0.95) 1px, transparent 1.4px),
        linear-gradient(rgba($surface, 0.08), rgba($surface, 0.08));
      background-size:
        4px 4px,
        100% 100%;
    }
    transform: translateY(12%);
    user-select: none;
  }
}
</style>
