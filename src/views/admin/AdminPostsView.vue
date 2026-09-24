<script setup lang="ts">
import { onMounted } from 'vue'
import AdminPageHead from '@/components/admin/AdminPageHead.vue'
import AdminPagination from '@/components/admin/AdminPagination.vue'
import AdminTable from '@/components/admin/AdminTable.vue'
import ConfirmDialog from '@/components/admin/ConfirmDialog.vue'
import StatusPill from '@/components/admin/StatusPill.vue'
import { useAdminPosts } from '@/composables/admin/useAdminPosts'
import { useConfirm } from '@/composables/admin/useConfirm'
import type { AdminColumn } from '@/composables/admin/adminCopy'
import { formatDate } from '@/utils/format'
import type { Post } from '@/types'

const { posts, page, pages, total, loading, load, remove } = useAdminPosts(20)
const confirm = useConfirm()

const columns: AdminColumn[] = [
  { key: 'title', label: 'Artículo', primary: true },
  { key: 'category', label: 'Tema', width: '170px' },
  { key: 'status', label: 'Estado', width: '120px' },
  { key: 'date', label: 'Fecha', width: '130px' },
  { key: 'actions', label: '', width: '140px', align: 'end' },
]

async function askRemove(post: Post) {
  const ok = await confirm.ask({
    title: `¿Eliminar "${post.title}"?`,
    message: post.isPublished
      ? 'Está publicado: el enlace dejará de funcionar para quien lo haya compartido.'
      : 'Se borra el borrador para siempre.',
    danger: true,
  })
  if (ok) remove(post)
}

onMounted(load)
</script>

<template>
  <div>
    <AdminPageHead
      title="Blog"
      description="Artículos para atraer clientes desde Google. Los borradores no se ven en el sitio."
    >
      <RouterLink to="/admin/blog/nuevo" class="btn btn--primary btn--sm">
        <i class="fa-solid fa-plus"></i> Nuevo artículo
      </RouterLink>
    </AdminPageHead>

    <AdminTable
      :columns="columns"
      :rows="posts"
      :loading="loading"
      empty="Todavía no hay artículos"
    >
      <template #title="{ row }">
        <RouterLink :to="`/admin/blog/${row._id}`" class="posts__title">
          <strong>{{ row.title }}</strong>
          <small>{{ row.excerpt || 'Sin extracto' }}</small>
        </RouterLink>
      </template>
      <template #category="{ row }">{{ row.category }}</template>
      <template #status="{ row }">
        <StatusPill
          :label="row.isPublished ? 'Publicado' : 'Borrador'"
          :tone="row.isPublished ? 'success' : 'warning'"
        />
      </template>
      <template #date="{ row }">
        <span :title="row.isPublished ? 'Fecha de publicación' : 'Última edición'">
          {{ formatDate(row.isPublished && row.publishedAt ? row.publishedAt : row.updatedAt) }}
        </span>
      </template>
      <template #actions="{ row }">
        <a
          v-if="row.isPublished"
          class="posts__action"
          :href="`/blog/${row.slug}`"
          target="_blank"
          rel="noopener"
          :aria-label="`Ver ${row.title} en el sitio`"
        >
          <i class="fa-solid fa-arrow-up-right-from-square"></i>
        </a>
        <RouterLink
          :to="`/admin/blog/${row._id}`"
          class="posts__action"
          :aria-label="`Editar ${row.title}`"
        >
          <i class="fa-solid fa-pen"></i>
        </RouterLink>
        <button
          class="posts__action posts__action--danger"
          type="button"
          :aria-label="`Eliminar ${row.title}`"
          @click="askRemove(row)"
        >
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </template>
    </AdminTable>

    <AdminPagination v-model:page="page" :pages="pages" :total="total" />
    <ConfirmDialog v-bind="confirm.state" @confirm="confirm.confirm" @cancel="confirm.cancel" />
  </div>
</template>

<style scoped lang="scss">
.posts {
  &__title {
    @include flex(column, flex-start, flex-start);
    min-width: 0;
    line-height: 1.35;

    strong {
      font-weight: 600;
    }

    small {
      font-size: $text-xs;
      color: $ink-muted;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    &:hover strong {
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
