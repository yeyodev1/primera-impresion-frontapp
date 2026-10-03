<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AdminPageHead from '@/components/admin/AdminPageHead.vue'
import AdminTable from '@/components/admin/AdminTable.vue'
import CategoryFormModal from '@/components/admin/CategoryFormModal.vue'
import ConfirmDialog from '@/components/admin/ConfirmDialog.vue'
import ToggleSwitch from '@/components/admin/ToggleSwitch.vue'
import { useAdminCategories } from '@/composables/admin/useAdminCategories'
import { useConfirm } from '@/composables/admin/useConfirm'
import type { AdminColumn } from '@/composables/admin/adminCopy'
import type { Category } from '@/types'

const { categories, loading, load, save, togglePublished, remove, reorder } = useAdminCategories()
const confirm = useConfirm()

const editing = ref<Category | null>(null)
const formOpen = ref(false)

const columns: AdminColumn[] = [
  { key: 'name', label: 'Categoría', primary: true },
  { key: 'count', label: 'Soluciones', width: '110px' },
  { key: 'published', label: 'Visible', width: '90px' },
  { key: 'actions', label: '', width: '100px', align: 'end' },
]

function openForm(category: Category | null) {
  editing.value = category
  formOpen.value = true
}

async function askRemove(category: Category) {
  const count = category.solutionsCount ?? 0
  const ok = await confirm.ask({
    title: `¿Eliminar "${category.name}"?`,
    message: count
      ? `Tiene ${count} ${count === 1 ? 'solución' : 'soluciones'}. Las que también estén en otra categoría solo la pierden; si alguna está únicamente aquí, primero muévela o elimínala.`
      : 'Dejará de verse en el sitio. Esta acción no se puede deshacer.',
    danger: true,
  })
  if (ok) remove(category)
}

onMounted(() => load())
</script>

<template>
  <div>
    <AdminPageHead
      title="Categorías"
      description="Las familias de soluciones del escaparate. Arrastra las filas para definir el orden en que aparecen en el sitio."
    >
      <button class="btn btn--primary btn--sm" type="button" @click="openForm(null)">
        <i class="fa-solid fa-plus"></i> Nueva categoría
      </button>
    </AdminPageHead>

    <AdminTable
      :columns="columns"
      :rows="categories"
      :loading="loading"
      empty="Aún no hay categorías"
      sortable
      @reorder="reorder"
    >
      <template #name="{ row }">
        <span class="cat__icon" aria-hidden="true"
          ><i :class="row.icon || 'fa-solid fa-tag'"></i
        ></span>
        <span class="cat__text">
          <strong>{{ row.name }}</strong>
          <small>{{ row.description || row.slug }}</small>
        </span>
      </template>
      <template #count="{ row }">
        <RouterLink
          :to="{ path: '/admin/soluciones', query: { categoria: row._id } }"
          class="cat__count"
        >
          {{ row.solutionsCount ?? 0 }}
        </RouterLink>
      </template>
      <template #published="{ row }">
        <ToggleSwitch
          :model-value="row.isPublished"
          :label="`Visible en el sitio: ${row.name}`"
          @update:model-value="togglePublished(row)"
        />
      </template>
      <template #actions="{ row }">
        <button
          class="cat__action"
          type="button"
          :aria-label="`Editar ${row.name}`"
          @click="openForm(row)"
        >
          <i class="fa-solid fa-pen"></i>
        </button>
        <button
          class="cat__action cat__action--danger"
          type="button"
          :aria-label="`Eliminar ${row.name}`"
          @click="askRemove(row)"
        >
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </template>
    </AdminTable>

    <CategoryFormModal
      :open="formOpen"
      :category="editing"
      :save="(body) => save(body, editing?._id)"
      @close="formOpen = false"
    />
    <ConfirmDialog v-bind="confirm.state" @confirm="confirm.confirm" @cancel="confirm.cancel" />
  </div>
</template>

<style scoped lang="scss">
.cat {
  &__icon {
    @include flex(row, center, center);
    width: 38px;
    height: 38px;
    flex-shrink: 0;
    border-radius: $radius-sm;
    background: $accent-soft;
    color: $accent-deep;
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

  &__count {
    font-weight: 600;
    text-decoration: underline;
    text-decoration-color: $line;
    text-underline-offset: 3px;

    &:hover {
      color: $accent-deep;
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
