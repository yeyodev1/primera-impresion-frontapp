<script setup lang="ts">
import { site, fx, copy, whatsappLink } from '@/config/site'
import RegisterTitle from '@/components/fx/RegisterTitle.vue'
import MagneticButton from '@/components/fx/MagneticButton.vue'
import RegMark from '@/components/fx/RegMark.vue'
import SmartLink from './SmartLink.vue'

// Invitación final del footer: "¿Imprimimos algo juntos?" enorme, con CTA
// magnético al contacto y, si hay número confirmado, acceso directo a WhatsApp.
</script>

<template>
  <div class="fcta">
    <p class="fcta__eyebrow">
      <RegMark size="0.9rem" tone="accent" />
      {{ fx.footer.eyebrow }}
    </p>
    <RegisterTitle :text="fx.footer.title" size="xl" tone="night" hover class="fcta__title" />
    <div class="fcta__row">
      <p class="fcta__text">{{ fx.footer.text }}</p>
      <div class="fcta__actions">
        <MagneticButton>
          <RouterLink to="/contacto" class="btn btn--primary btn--press">
            {{ fx.footer.cta }}
            <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </RouterLink>
        </MagneticButton>
        <SmartLink v-if="site.whatsapp" :to="whatsappLink()" class="fcta__wa">
          <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
          {{ copy.footer.whatsapp }}
        </SmartLink>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.fcta {
  @include flex(column, flex-start, flex-start, 1.5rem);
  padding-block: clamp(4rem, 9vw, 7.5rem) clamp(3rem, 6vw, 5rem);
  border-bottom: 1px solid rgba($surface, 0.1);

  &__eyebrow {
    @include flex(row, center, flex-start, 0.7rem);
    @include mono-label(0.68rem, 0.2em);
    color: $accent;
  }

  &__title {
    max-width: 12ch;
  }

  &__row {
    @include flex(column, flex-start, space-between, 1.75rem);
    width: 100%;

    @include from('lg') {
      flex-direction: row;
      align-items: flex-end;
    }
  }

  &__text {
    max-width: 44ch;
    font-size: $text-lg;
    line-height: 1.55;
    color: rgba($surface, 0.72);
  }

  &__actions {
    @include flex(row, center, flex-start, 1.5rem);
    flex-wrap: wrap;
  }

  &__wa {
    @include flex(row, center, flex-start, 0.5rem);
    font-weight: 600;
    color: $surface;
    border-bottom: 1px solid rgba($surface, 0.35);
    padding-block: 0.3rem;
    @include transition(color, border-color);
    @include focus-ring;

    &:hover {
      color: $accent;
      border-color: $accent;
    }
  }
}
</style>
