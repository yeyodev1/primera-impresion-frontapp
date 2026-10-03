<script setup lang="ts" generic="T extends { _id: string }">
/**
 * Tabla del panel. En móvil cada fila es una tarjeta apilada con etiqueta por
 * dato; desde md se alinea en columnas. Todo con flexbox: el ancho de cada
 * columna viaja como custom property y solo se aplica en la vista de escritorio.
 */
import { ref, shallowRef, watch, type Ref } from 'vue'
import type { AdminColumn } from '@/composables/admin/adminCopy'

/*
 * Con `sortable` cada fila lleva una manija: se arrastra con mouse o dedo
 * (pointer events, así funciona también en táctil) o se mueve con las flechas
 * del teclado. Al soltar se emite `reorder` con los ids en el nuevo orden.
 */
const props = defineProps<{
  columns: AdminColumn[]
  rows: T[]
  loading?: boolean
  empty?: string
  sortable?: boolean
}>()
const emit = defineEmits<{ reorder: [ids: string[]] }>()

const list = shallowRef([]) as Ref<T[]>
const dragging = ref<string | null>(null)
const rowEls = new Map<string, HTMLElement>()
let startIds = ''

watch(
  () => props.rows,
  (rows) => {
    if (!dragging.value) list.value = [...rows]
  },
  { immediate: true, deep: true },
)

const ids = () => list.value.map((r) => r._id)

function setRowEl(id: string, el: unknown) {
  if (el instanceof HTMLElement) rowEls.set(id, el)
  else rowEls.delete(id)
}

function move(from: number, to: number) {
  const next = [...list.value]
  const [item] = next.splice(from, 1)
  if (item) next.splice(to, 0, item)
  list.value = next
}

function onPointerDown(event: PointerEvent, row: T) {
  if (event.button !== 0) return
  event.preventDefault()
  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
  dragging.value = row._id
  startIds = ids().join()
}

function onPointerMove(event: PointerEvent) {
  if (!dragging.value) return
  const from = list.value.findIndex((r) => r._id === dragging.value)
  // Destino: la primera fila cuya mitad queda por debajo del puntero.
  let to = list.value.length - 1
  for (let i = 0; i < list.value.length; i++) {
    const rect = rowEls.get(list.value[i]!._id)?.getBoundingClientRect()
    if (rect && event.clientY < rect.top + rect.height / 2) {
      to = i > from ? i - 1 : i
      break
    }
  }
  if (to !== from) move(from, to)
}

function onPointerUp() {
  if (!dragging.value) return
  dragging.value = null
  if (ids().join() !== startIds) emit('reorder', ids())
}

function onKey(event: KeyboardEvent, row: T) {
  const delta = event.key === 'ArrowUp' ? -1 : event.key === 'ArrowDown' ? 1 : 0
  if (!delta) return
  event.preventDefault()
  const from = list.value.findIndex((r) => r._id === row._id)
  const to = from + delta
  if (to < 0 || to >= list.value.length) return
  move(from, to)
  emit('reorder', ids())
  // La fila se movió en el DOM: el foco vuelve a su manija.
  requestAnimationFrame(() => rowEls.get(row._id)?.querySelector<HTMLElement>('.table__handle')?.focus())
}
</script>

<template>
  <div class="table" :class="{ 'table--loading': loading, 'table--sortable': sortable }">
    <div class="table__head" aria-hidden="true">
      <span v-if="sortable" class="table__grip-space"></span>
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

    <TransitionGroup name="table-row" tag="div" class="table__body">
    <article
      v-for="row in list"
      :key="row._id"
      :ref="(el) => setRowEl(row._id, el)"
      class="table__row"
      :class="{ 'table__row--dragging': dragging === row._id }"
    >
      <button
        v-if="sortable"
        type="button"
        class="table__handle"
        aria-label="Reordenar: arrastra o usa las flechas arriba y abajo"
        title="Arrastra para ordenar"
        @pointerdown="onPointerDown($event, row)"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
        @keydown="onKey($event, row)"
      >
        <i class="fa-solid fa-grip-vertical"></i>
      </button>
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
    </TransitionGroup>
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

  &__body {
    @include flex(column, stretch, flex-start, 0.75rem);

    @include from('md') {
      gap: 0;
    }
  }

  &__row {
    position: relative;
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

  &__row--dragging {
    z-index: 1;
    background: $surface;
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.12);
  }

  // En móvil la manija va en la esquina de la tarjeta; desde md es la primera columna.
  &__handle {
    position: absolute;
    top: 0.6rem;
    right: 0.6rem;
    @include flex(row, center, center);
    width: 36px;
    height: 36px;
    border-radius: $radius-sm;
    color: $ink-muted;
    cursor: grab;
    touch-action: none;

    &:hover {
      background: $sand;
      color: $ink;
    }

    @include from('md') {
      position: static;
      flex: 0 0 28px;
      width: 28px;
    }
  }

  &__row--dragging &__handle {
    cursor: grabbing;
  }

  // Deja lugar a la manija de la esquina en la tarjeta móvil.
  &--sortable &__cell--primary {
    padding-right: 2.75rem;

    @include from('md') {
      padding-right: 0;
    }
  }

  &__grip-space {
    flex: 0 0 28px;
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

.table-row-move {
  transition: transform 0.2s ease;
}

@media (prefers-reduced-motion: reduce) {
  .table-row-move {
    transition: none;
  }
}
</style>
