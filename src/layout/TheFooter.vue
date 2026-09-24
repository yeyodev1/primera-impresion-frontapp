<script setup lang="ts">
import { site, whatsappLink, copy } from '@/config/site'
import BrandMark from '@/components/brand/BrandMark.vue'
import CmykDots from '@/components/site/CmykDots.vue'
import HalftoneBg from '@/components/site/HalftoneBg.vue'
import WhatsAppFloat from '@/components/site/WhatsAppFloat.vue'

const year = new Date().getFullYear()

const socials = [
  { key: 'instagram', href: site.social.instagram, icon: 'fa-brands fa-instagram', label: copy.social.instagram },
  { key: 'messenger', href: site.social.messenger, icon: 'fa-brands fa-facebook-messenger', label: copy.social.messenger },
  { key: 'telegram', href: site.social.telegram, icon: 'fa-brands fa-telegram', label: copy.social.telegram },
].filter((item) => item.href)
</script>

<template>
  <footer class="footer">
    <HalftoneBg />
    <div class="footer__inner">
      <div class="footer__brand">
        <RouterLink to="/" class="footer__logo" :aria-label="copy.header.home">
          <BrandMark tone="light" tagline />
        </RouterLink>
        <p class="footer__tagline">{{ site.tagline }}</p>
        <p class="footer__text">{{ site.description }}</p>
        <ul v-if="socials.length" class="footer__social" :aria-label="copy.footer.social">
          <li v-for="item in socials" :key="item.key">
            <a :href="item.href" target="_blank" rel="noopener" class="footer__social-link">
              <i :class="item.icon" aria-hidden="true"></i>
              <span class="visually-hidden">{{ item.label }} {{ copy.header.newTab }}</span>
            </a>
          </li>
        </ul>
      </div>

      <nav class="footer__col" :aria-labelledby="'footer-explore'">
        <h2 id="footer-explore" class="footer__heading">{{ site.footer.explore }}</h2>
        <RouterLink v-for="link in site.nav" :key="link.to" :to="link.to" class="footer__link">
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="footer__col">
        <h2 class="footer__heading">{{ site.footer.contact }}</h2>
        <a :href="site.mapsUrl" target="_blank" rel="noopener" class="footer__link footer__link--icon">
          <i class="fa-solid fa-location-dot" aria-hidden="true"></i>
          <span><span class="visually-hidden">{{ copy.footer.address }}: </span>{{ site.address }}</span>
        </a>
        <a :href="site.phoneHref" class="footer__link footer__link--icon">
          <i class="fa-solid fa-phone" aria-hidden="true"></i>
          <span><span class="visually-hidden">{{ copy.footer.phone }}: </span>{{ site.phone }}</span>
        </a>
        <a :href="`mailto:${site.email}`" class="footer__link footer__link--icon">
          <i class="fa-solid fa-envelope" aria-hidden="true"></i>
          <span><span class="visually-hidden">{{ copy.footer.email }}: </span>{{ site.email }}</span>
        </a>
        <a v-if="site.whatsapp" :href="whatsappLink()" target="_blank" rel="noopener" class="footer__link footer__link--icon">
          <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
          <span>{{ copy.footer.whatsapp }}</span>
        </a>
      </div>

      <div class="footer__col">
        <h2 class="footer__heading">{{ site.footer.portal }}</h2>
        <p class="footer__small">{{ copy.footer.portalText }}</p>
        <a :href="site.portalUrl" target="_blank" rel="noopener" class="btn btn--light btn--sm">
          {{ copy.footer.portalCta }}
          <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
          <span class="visually-hidden">{{ copy.header.newTab }}</span>
        </a>
        <RouterLink to="/autogestion#solicitud" class="footer__link">{{ copy.footer.portalRequest }}</RouterLink>
      </div>
    </div>

    <div class="footer__bar">
      <span class="footer__copy">
        <CmykDots />
        © {{ year }} {{ site.name }}. {{ site.footer.rights }}
      </span>
      <span>
        {{ copy.footer.credit }}
        <a href="https://bakano.ec" target="_blank" rel="noopener" class="footer__link">Bakano</a>
      </span>
    </div>
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

  &__inner {
    @include container(1240px);
    position: relative;
    z-index: 1;
    @include flex-cards(200px, 2.5rem 2rem);
    padding-block: $space-xl 2.5rem;
  }

  &__brand {
    flex: 2 1 280px !important;
    @include flex(column, flex-start, flex-start, 0.85rem);
  }

  &__logo {
    font-size: 0.95rem;
    border-radius: 4px;
    @include focus-ring;
  }

  &__tagline {
    margin-top: 0.5rem;
    font-family: $font-display;
    font-size: $text-xl;
    font-weight: 700;
    line-height: 1.15;
    color: $surface;
    max-width: 20ch;
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
    margin-top: 0.4rem;
  }

  &__social-link {
    @include flex(row, center, center);
    width: 2.6rem;
    height: 2.6rem;
    border-radius: 50%;
    border: 1px solid rgba($surface, 0.2);
    color: $surface;
    font-size: 1.05rem;
    @include transition;
    @include focus-ring;

    &:hover {
      background: $accent;
      border-color: $accent;
      color: $night;
    }
  }

  &__col {
    @include flex(column, flex-start, flex-start, 0.7rem);
  }

  &__heading {
    @include eyebrow;
    color: $accent;
    margin-bottom: 0.3rem;
  }

  &__link {
    font-size: $text-sm;
    color: rgba($surface, 0.78);
    border-radius: 3px;
    @include transition(color);
    @include focus-ring;

    &:hover {
      color: $surface;
      text-decoration: underline;
      text-underline-offset: 3px;
    }

    &--icon {
      @include flex(row, flex-start, flex-start, 0.65rem);

      i {
        width: 1rem;
        margin-top: 0.3rem;
        color: $accent;
        text-align: center;
      }
    }
  }

  &__bar {
    @include container(1240px);
    position: relative;
    z-index: 1;
    @include flex(column, flex-start, space-between, 0.6rem);
    padding-block: 1.25rem 5.5rem;
    border-top: 1px solid rgba($surface, 0.1);
    font-size: $text-xs;
    color: rgba($surface, 0.6);

    @include from('md') {
      flex-direction: row;
      align-items: center;
      padding-bottom: 1.25rem;
    }
  }

  &__copy {
    @include flex(row, center, flex-start, 0.75rem);
    flex-wrap: wrap;
  }
}
</style>
