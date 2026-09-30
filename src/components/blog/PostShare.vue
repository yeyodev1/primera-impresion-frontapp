<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { fxPages } from '@/config/site'
import { useToastStore } from '@/stores/toast'

// Compartir el artículo en redes: enlaces directos a cada red (sin scripts de
// terceros) y «copiar enlace». En móvil con compartir nativo, ese botón abre
// la hoja del sistema (Instagram, TikTok y demás apps instaladas).
const props = defineProps<{ title: string }>()

const route = useRoute()
const toast = useToastStore()
const s = fxPages.post.share

const url = computed(() => `${window.location.origin}${route.path}`)
const canNative = typeof navigator !== 'undefined' && 'share' in navigator

const networks = computed(() => {
  const u = encodeURIComponent(url.value)
  const t = encodeURIComponent(props.title)
  return [
    { label: 'WhatsApp', icon: 'fa-brands fa-whatsapp', href: `https://wa.me/?text=${t}%20${u}` },
    { label: 'Facebook', icon: 'fa-brands fa-facebook-f', href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { label: 'LinkedIn', icon: 'fa-brands fa-linkedin-in', href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { label: 'X', icon: 'fa-brands fa-x-twitter', href: `https://x.com/intent/post?text=${t}&url=${u}` },
  ]
})

async function more() {
  if (canNative) {
    try {
      await navigator.share({ title: props.title, url: url.value })
    } catch {
      // La persona cerró la hoja de compartir: nada que hacer.
    }
    return
  }
  try {
    await navigator.clipboard.writeText(url.value)
    toast.success(s.copied)
  } catch {
    toast.error(s.copyError)
  }
}
</script>

<template>
  <div class="share">
    <p class="share__label">{{ s.label }}</p>
    <ul class="share__list">
      <li v-for="n in networks" :key="n.label">
        <a :href="n.href" target="_blank" rel="noopener" class="share__btn" :aria-label="s.on(n.label)">
          <i :class="n.icon" aria-hidden="true"></i>
        </a>
      </li>
      <li>
        <button type="button" class="share__btn" :aria-label="canNative ? s.more : s.copy" @click="more">
          <i :class="canNative ? 'fa-solid fa-share-nodes' : 'fa-solid fa-link'" aria-hidden="true"></i>
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.share {
  @include flex(row, center, flex-start, 0.6rem 1rem);
  flex-wrap: wrap;

  &__label {
    @include mono-label(0.62rem, 0.16em);
    color: $ink-muted;
  }

  &__list {
    list-style: none;
    @include flex(row, center, flex-start, 0.5rem);
  }

  &__btn {
    @include flex(row, center, center);
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
    border: 1px solid rgba($ink, 0.2);
    color: $ink;
    font-size: 1rem;
    @include transition(background, color, border-color, transform);
    @include focus-ring;

    &:hover {
      background: $accent;
      border-color: $accent;
      color: $surface;
      transform: translateY(-2px);
    }
  }
}
</style>
