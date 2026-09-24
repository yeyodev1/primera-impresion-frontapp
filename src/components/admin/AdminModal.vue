<script setup lang="ts">
import { onBeforeUnmount, onMounted, toRef } from 'vue'
import { useBodyScroll } from '@/composables/useBodyScroll'

// Marco para formularios del panel. BaseModal es de confirmación (dos botones
// fijos); acá el contenido y los botones los pone quien lo usa.
const props = withDefaults(defineProps<{ open: boolean; title: string; wide?: boolean }>(), {
  wide: false,
})
const emit = defineEmits<{ close: [] }>()

useBodyScroll(toRef(props, 'open'))

function onKey(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.open) emit('close')
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <Teleport to="body">
    <Transition name="sheet">
      <div v-if="open" class="sheet" @click.self="emit('close')">
        <div
          class="sheet__box"
          :class="{ 'sheet__box--wide': wide }"
          role="dialog"
          aria-modal="true"
          :aria-label="title"
        >
          <header class="sheet__head">
            <h2 class="sheet__title">{{ title }}</h2>
            <button class="sheet__close" type="button" aria-label="Cerrar" @click="emit('close')">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </header>
          <div class="sheet__body">
            <slot />
          </div>
          <footer v-if="$slots.footer" class="sheet__foot">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.sheet {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: $overlay;
  @include flex(column, stretch, flex-end);

  @include from('md') {
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
  }

  &__box {
    @include flex(column, stretch, flex-start);
    background: $surface;
    width: 100%;
    max-height: 92vh;
    border-radius: $radius-md $radius-md 0 0;
    box-shadow: $shadow-lg;

    @include from('md') {
      max-width: 560px;
      border-radius: $radius-md;
    }

    &--wide {
      @include from('md') {
        max-width: 720px;
      }
    }
  }

  &__head {
    @include flex(row, center, space-between, 1rem);
    padding: 1.1rem 1.25rem;
    border-bottom: 1px solid $line;
  }

  &__title {
    font-size: $text-lg;
    font-weight: 600;
  }

  &__close {
    width: 40px;
    height: 40px;
    border-radius: $radius-sm;
    color: $ink-muted;

    &:hover {
      background: $sand;
      color: $ink;
    }
  }

  &__body {
    flex: 1;
    overflow-y: auto;
    padding: 1.25rem;
  }

  &__foot {
    @include flex(row, center, flex-end, 0.6rem);
    flex-wrap: wrap;
    padding: 1rem 1.25rem;
    border-top: 1px solid $line;
  }
}

.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.25s ease;

  .sheet__box {
    transition: transform 0.3s $ease;
  }
}

.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;

  .sheet__box {
    transform: translateY(24px);
  }
}
</style>
