<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminPageHead from '@/components/admin/AdminPageHead.vue'
import AdminTable from '@/components/admin/AdminTable.vue'
import ConfirmDialog from '@/components/admin/ConfirmDialog.vue'
import SolutionFormModal from '@/components/admin/SolutionFormModal.vue'
import ToggleSwitch from '@/components/admin/ToggleSwitch.vue'
import { useAdminCategories } from '@/composables/admin/useAdminCategories'
import { useAdminSolutions } from '@/composables/admin/useAdminSolutions'
import { useConfirm } from '@/composables/admin/useConfirm'
import { categoryNames, type AdminColumn } from '@/composables/admin/adminCopy'
import type { Solution } from '@/types'

const route = useRoute()
const router = useRouter()
const { categories, load: loadCategories } = useAdminCategories()
// El filtro vive en la URL (?categoria=<id>) para poder enlazarlo desde Categorías.
const { solutions, loading, categoryFilter, load, save, toggle, remove, reorder } = useAdminSolutions(
  typeof route.query.categoria === 'string' ? route.query.categoria : '',
)
const confirm = useConfirm()

const editing = ref<Solution | null>(null)
const formOpen = ref(false)

const columns: AdminColumn[] = [
  { key: 'name', label: 'Solución', primary: true },
  { key: 'category', label: 'Categorías', width: '200px' },
  { key: 'published', label: 'Visible', width: '80px' },
  { key: 'featured', label: 'Destacada', width: '90px' },
  { key: 'actions', label: '', width: '100px', align: 'end' },
]

watch(categoryFilter, (value) => {
  router.replace({ query: value ? { categoria: value } : {} })
})

function openForm(solution: Solution | null) {
  editing.value = solution
  formOpen.value = true
}

async function askRemove(solution: Solution) {
  const ok = await confirm.ask({
    title: `¿Eliminar "${solution.name}"?`,
    message: 'Dejará de verse en el sitio. Esta acción no se puede deshacer.',
    danger: true,
  })
  if (ok) remove(solution)
}

async function saveAndRefresh(body: Parameters<typeof save>[0]) {
  const ok = await save(body, editing.value?._id)
  // El conteo de soluciones por categoría cambia al crear o mover una.
  if (ok) loadCategories()
  return ok
}

onMounted(() => {
  loadCategories(false)
  load()
})
</script>

<template>
  <div>
    <AdminPageHead
      title="Soluciones"
      description="Los productos del escaparate. No se venden en línea: cada uno lleva a una consulta con un asesor. Arrastra las filas para ordenarlos en el sitio."
    >
      <button
        class="btn btn--primary btn--sm"
        type="button"
        :disabled="!categories.length"
        @click="openForm(null)"
      >
        <i class="fa-solid fa-plus"></i> Nueva solución
      </button>
    </AdminPageHead>

    <div class="sol__filter">
      <label for="sol-filter">Categoría</label>
      <select id="sol-filter" v-model="categoryFilter">
        <option value="">Todas las categorías</option>
        <option v-for="cat in categories" :key="cat._id" :value="cat._id">
          {{ cat.name }} ({{ cat.solutionsCount ?? 0 }})
        </option>
      </select>
    </div>

    <AdminTable
      :columns="columns"
      :rows="solutions"
      :loading="loading"
      empty="No hay soluciones en esta categoría"
      sortable
      @reorder="reorder"
    >
      <template #name="{ row }">
        <span class="sol__thumb" aria-hidden="true">
          <img v-if="row.image?.url" :src="row.image.url" alt="" />
          <i v-else class="fa-regular fa-image"></i>
        </span>
        <span class="sol__text">
          <strong>{{ row.name }}</strong>
          <small>{{ row.summary || `${row.options?.length ?? 0} opciones` }}</small>
        </span>
      </template>
      <template #category="{ row }">{{ categoryNames(row.categories, categories) }}</template>
      <template #published="{ row }">
        <ToggleSwitch
          :model-value="row.isPublished"
          :label="`Visible en el sitio: ${row.name}`"
          @update:model-value="toggle(row, 'isPublished')"
        />
      </template>
      <template #featured="{ row }">
        <button
          type="button"
          class="sol__star"
          :class="{ 'sol__star--on': row.isFeatured }"
          :aria-pressed="row.isFeatured"
          :aria-label="`Destacada: ${row.name}`"
          @click="toggle(row, 'isFeatured')"
        >
          <i :class="row.isFeatured ? 'fa-solid fa-star' : 'fa-regular fa-star'"></i>
        </button>
      </template>
      <template #actions="{ row }">
        <button
          class="sol__action"
          type="button"
          :aria-label="`Editar ${row.name}`"
          @click="openForm(row)"
        >
          <i class="fa-solid fa-pen"></i>
        </button>
        <button
          class="sol__action sol__action--danger"
          type="button"
          :aria-label="`Eliminar ${row.name}`"
          @click="askRemove(row)"
        >
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </template>
    </AdminTable>

    <SolutionFormModal
      :open="formOpen"
      :solution="editing"
      :categories="categories"
      :default-category="categoryFilter"
      :save="saveAndRefresh"
      @close="formOpen = false"
    />
    <ConfirmDialog v-bind="confirm.state" @confirm="confirm.confirm" @cancel="confirm.cancel" />
  </div>
</template>

<style scoped lang="scss">
.sol {
  &__filter {
    margin-bottom: 1rem;

    @include from('md') {
      max-width: 320px;
    }
  }

  &__thumb {
    @include flex(row, center, center);
    width: 44px;
    height: 44px;
    flex-shrink: 0;
    border-radius: $radius-sm;
    background: $sand;
    color: $ink-muted;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__text {
    @include flex(column, flex-start, flex-start);
    min-width: 0;
    line-height: 1.35;

    small {
      font-size: $text-xs;
      color: $ink-muted;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }

  &__star {
    @include flex(row, center, center);
    width: 40px;
    height: 40px;
    border-radius: $radius-sm;
    color: $ink-muted;

    &:hover {
      background: $sand;
    }

    &--on {
      color: $warning;
    }
  }

  &__action {
    @include flex(row, center, center);
    width: 40px;
    height: 40px;
    border-radius: $radius-sm;
    color: $ink-soft;

    &:hover {
      background: $sand;
      color: $ink;
    }

    &--danger:hover {
      background: $danger-bg;
      color: $danger;
    }
  }
}
</style>
