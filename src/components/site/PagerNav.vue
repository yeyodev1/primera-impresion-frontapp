<script setup lang="ts">
import { copy, fx, fxPages } from '@/config/site'
import { computed } from 'vue'

// Paginación como la numeración de pliegos: flechas y números en mono sobre
// un filete; la página actual va entintada. Con muchas páginas se muestran
// la primera, la última y las vecinas de la actual.
const props = defineProps<{ page: number; pages: number }>()
defineEmits<{ go: [page: number] }>()

const items = computed<Array<number | null>>(() => {
  const { page, pages } = props
  const keep = new Set([1, pages, page - 1, page, page + 1].filter((n) => n >= 1 && n <= pages))
  const sorted = [...keep].sort((a, b) => a - b)
  const out: Array<number | null> = []
  sorted.forEach((n, i) => {
    const prev = sorted[i - 1]
    if (prev !== undefined && n - prev > 1) out.push(null)
    out.push(n)
  })
  return out
})
</script>

<template>
  <nav v-if="pages > 1" class="pager" :aria-label="fxPages.blog.pager.label">
    <button type="button" class="pager__step" :disabled="page <= 1" @click="$emit('go', page - 1)">
      <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
      <span>{{ copy.blog.prev }}</span>
    </button>

    <ol class="pager__list">
      <li v-for="(n, i) in items" :key="n ?? `gap-${i}`">
        <span v-if="n === null" class="pager__gap" aria-hidden="true">/</span>
        <button
          v-else
          type="button"
          class="pager__num"
          :class="{ 'pager__num--active': n === page }"
          :aria-current="n === page ? 'page' : undefined"
          :aria-label="fxPages.blog.pager.goTo(n)"
          @click="n !== page && $emit('go', n)"
        >
          {{ fx.index(n) }}
        </button>
      </li>
    </ol>
    <p class="visually-hidden" aria-live="polite">{{ copy.blog.page(page, pages) }}</p>

    <button type="button" class="pager__step" :disabled="page >= pages" @click="$emit('go', page + 1)">
      <span>{{ copy.blog.next }}</span>
      <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
    </button>
  </nav>
</template>

<style scoped lang="scss">
.pager {
  @include flex(row, center, space-between, 0.75rem);
  margin-top: $space-lg;
  padding-top: 1.25rem;
  border-top: 1px solid $ink;

  &__step {
    @include flex(row, center, center, 0.6rem);
    min-height: 44px;
    padding-inline: 0.25rem;
    @include mono-label(0.68rem, 0.14em);
    color: $ink;
    @include focus-ring;

    i {
      color: $accent-deep;
      @include transition(transform);
    }

    &:hover:not(:disabled) i:first-child {
      transform: translateX(-4px);
    }

    &:hover:not(:disabled) i:last-child {
      transform: translateX(4px);
    }

    &:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }

    // En móvil solo la flecha: los números ya dicen dónde estás.
    span {
      display: none;

      @include from('sm') {
        display: inline;
      }
    }
  }

  &__list {
    list-style: none;
    @include flex(row, center, center, 0.3rem);
  }

  &__num {
    min-width: 44px;
    min-height: 44px;
    border-radius: 3px;
    @include mono-label(0.78rem, 0.06em);
    color: $ink-soft;
    @include transition(background, color);
    @include focus-ring;

    &:hover {
      color: $ink;
      background: rgba($ink, 0.06);
    }

    &--active,
    &--active:hover {
      background: $night;
      color: $surface;
      box-shadow: inset 0 -3px 0 $accent;
    }
  }

  &__gap {
    @include mono-label(0.78rem, 0);
    color: $ink-muted;
    padding-inline: 0.2rem;
  }
}
</style>
