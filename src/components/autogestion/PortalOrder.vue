<script setup lang="ts">
// Seguimiento del pedido dentro de la interfaz simulada del portal: filete
// que se llena de tinta y paradas que se encienden hasta el paso actual.
defineProps<{ step: number; status: readonly string[]; label: string }>()
</script>

<template>
  <div class="order">
    <p class="order__head">
      <span>{{ label }}</span>
      <span class="order__state">{{ status[Math.max(step, 0)] }}</span>
    </p>
    <div class="order__track">
      <span
        class="order__fill"
        :style="{ transform: `scaleX(${Math.max(step, 0) / (status.length - 1)})` }"
      ></span>
      <span
        v-for="(name, i) in status"
        :key="name"
        class="order__stop"
        :class="{ 'order__stop--done': i <= step, 'order__stop--now': i === step }"
      ></span>
    </div>
    <div class="order__labels">
      <span v-for="(name, i) in status" :key="name" :class="{ 'order__label--on': i <= step }">{{
        name
      }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.order {
  margin: 0 1rem 1rem;
  padding: 0.75rem 0.85rem 0.7rem;
  border-radius: 4px;
  background: $night;
  color: $surface;

  &__head {
    @include flex(row, center, space-between, 0.5rem);
    margin-bottom: 0.65rem;
    @include mono-label(0.52rem, 0.14em);
    color: rgba($surface, 0.7);
  }

  &__state {
    color: $accent;
  }

  &__track {
    position: relative;
    @include flex(row, center, space-between);
    height: 0.75rem;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      height: 2px;
      background: rgba($surface, 0.18);
    }
  }

  &__fill {
    position: absolute;
    left: 0;
    right: 0;
    height: 2px;
    background: $accent;
    transform-origin: left;
    transition: transform 0.7s $ease;
  }

  &__stop {
    position: relative;
    width: 0.7rem;
    height: 0.7rem;
    border-radius: 50%;
    background: $night;
    box-shadow: inset 0 0 0 2px rgba($surface, 0.35);
    transition:
      background-color 0.4s ease,
      box-shadow 0.4s ease;

    &--done {
      background: $accent;
      box-shadow: inset 0 0 0 2px $accent;
    }

    &--now {
      box-shadow: 0 0 0 4px rgba($accent, 0.3);
    }
  }

  &__labels {
    @include flex(row, flex-start, space-between, 0.25rem);
    margin-top: 0.45rem;
    font-size: 0.56rem;
    color: rgba($surface, 0.55);

    > span:last-child {
      text-align: right;
    }
  }

  &__label--on {
    color: $surface;
  }
}
</style>
