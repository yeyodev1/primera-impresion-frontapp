<script setup lang="ts" generic="T extends { _id: string }">
/**
 * Tabla del panel. En móvil cada fila es una tarjeta apilada con etiqueta por
 * dato; desde md se alinea en columnas. Todo con flexbox: el ancho de cada
 * columna viaja como custom property y solo se aplica en la vista de escritorio.
 */
import type { AdminColumn } from '@/composables/admin/adminCopy'

defineProps<{ columns: AdminColumn[]; rows: T[]; loading?: boolean; empty?: string }>()
</script>

<template>
  <div class="table" :class="{ 'table--loading': loading }">
    <div class="table__head" aria-hidden="true">
      <span
        v-for="col in columns"
        :key="col.key"
        class="table__cell"
        :class="{ 'table__cell--end': col.align === 'end', 'table__cell--grow': !col.width }"
        :style="col.width ? { '--w': col.width } : undefined"
      >
        {{ col.label }}
      </span>
    </div>

    <p v-if="!rows.length && !loading" class="table__empty">
      <i class="fa-regular fa-folder-open"></i> {{ empty || 'No hay nada por aquí todavía' }}
    </p>
    <p v-else-if="!rows.length" class="table__empty">
      <i class="fa-solid fa-spinner fa-spin"></i> Cargando…
    </p>

    <article v-for="row in rows" :key="row._id" class="table__row">
      <div
        v-for="col in columns"
        :key="col.key"
        class="table__cell"
        :class="{
          'table__cell--end': col.align === 'end',
          'table__cell--grow': !col.width,
          'table__cell--primary': col.primary,
        }"
        :style="col.width ? { '--w': col.width } : undefined"
      >
        <span v-if="!col.primary && col.label" class="table__label">{{ col.label }}</span>
        <div class="table__value">
          <slot :name="col.key" :row="row" />
        </div>
      </div>
    </article>
  </div>
</template>

<style scoped lang="scss">
.table {
  @include flex(column, stretch, flex-start, 0.75rem);
  @include transition(opacity);

  @include from('md') {
    @include card;
    gap: 0;
    overflow: hidden;
  }

  &--loading {
    opacity: 0.6;
  }

  &__head {
    display: none;

    @include from('md') {
      @include flex(row, center, flex-start, 1rem);
      padding: 0.75rem 1.25rem;
      background: $sand;
      font-size: $text-xs;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: $ink-muted;
    }
  }

  &__row {
    @include card;
    @include flex(column, stretch, flex-start, 0.55rem);
    padding: 1rem 1.1rem;

    @include from('md') {
      flex-direction: row;
      align-items: center;
      gap: 1rem;
      border: none;
      border-radius: 0;
      border-top: 1px solid $line;
      padding: 0.85rem 1.25rem;

      &:hover {
        background: rgba($sand, 0.45);
      }
    }
  }

  &__cell {
    @include flex(row, center, space-between, 0.75rem);
    min-width: 0;
    font-size: $text-sm;

    @include from('md') {
      flex: 0 0 var(--w, auto);
      justify-content: flex-start;
    }

    &--grow {
      @include from('md') {
        flex: 1 1 0;
      }
    }

    &--end {
      @include from('md') {
        justify-content: flex-end;
        text-align: right;
      }
    }

    &--primary {
      font-size: $text-base;
      padding-bottom: 0.35rem;
      border-bottom: 1px solid $line;

      @include from('md') {
        padding-bottom: 0;
        border-bottom: none;
      }
    }
  }

  &__row &__cell--end:last-child {
    padding-top: 0.35rem;

    @include from('md') {
      padding-top: 0;
    }
  }

  &__label {
    flex-shrink: 0;
    font-size: $text-xs;
    color: $ink-muted;

    @include from('md') {
      display: none;
    }
  }

  &__value {
    min-width: 0;
    margin-left: auto;
    @include flex(row, center, flex-end, 0.5rem);
    flex-wrap: wrap;
    text-align: right;

    @include from('md') {
      margin-left: 0;
      justify-content: inherit;
      text-align: inherit;
    }
  }

  &__cell--primary &__value {
    flex-wrap: nowrap;
    width: 100%;
    justify-content: flex-start;
    text-align: left;
  }

  &__empty {
    @include flex(row, center, center, 0.5rem);
    padding: 2.5rem 1rem;
    color: $ink-muted;
    font-size: $text-sm;
    text-align: center;

    @include from('md') {
      border-top: 1px solid $line;
    }
  }
}
</style>
