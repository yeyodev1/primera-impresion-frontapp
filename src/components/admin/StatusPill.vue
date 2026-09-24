<script setup lang="ts">
withDefaults(
  defineProps<{ label: string; tone?: 'accent' | 'success' | 'info' | 'muted' | 'warning' }>(),
  { tone: 'muted' },
)
</script>

<template>
  <span class="pill" :class="`pill--${tone}`">
    <span class="pill__dot" aria-hidden="true"></span>
    {{ label }}
  </span>
</template>

<style scoped lang="scss">
.pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: $text-xs;
  font-weight: 600;
  line-height: 1;
  padding: 0.35rem 0.65rem;
  border-radius: $radius-pill;
  white-space: nowrap;
  background: $sand;
  color: $ink-soft;

  &__dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
  }

  &--accent {
    background: $accent-soft;
    color: $accent-deep;
  }

  &--success {
    background: $success-bg;
    color: darken($success, 8%);
  }

  &--info {
    background: $info-bg;
    color: darken($info, 6%);
  }

  &--warning {
    background: $warning-bg;
    color: darken($warning, 22%);
  }
}
</style>
