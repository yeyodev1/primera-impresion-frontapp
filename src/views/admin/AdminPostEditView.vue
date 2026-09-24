<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'
import ConfirmDialog from '@/components/admin/ConfirmDialog.vue'
import MarkdownEditor from '@/components/admin/MarkdownEditor.vue'
import PostEditorActions from '@/components/admin/PostEditorActions.vue'
import PostSeoPanel from '@/components/admin/PostSeoPanel.vue'
import PostSettingsCard from '@/components/admin/PostSettingsCard.vue'
import StatusPill from '@/components/admin/StatusPill.vue'
import { useAdminCategories } from '@/composables/admin/useAdminCategories'
import { useConfirm } from '@/composables/admin/useConfirm'
import { usePostEditor } from '@/composables/admin/usePostEditor'
import { formatDate } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const confirm = useConfirm()
const { categories, load: loadCategories } = useAdminCategories()
const editor = usePostEditor()
const { form, postId, isPublished, publishedAt, loading, saving, isDirty, effectiveSlug } = editor

watch(
  () => route.params.id,
  async (id) => {
    if (typeof id !== 'string') return editor.reset()
    if (!(await editor.load(id))) router.replace('/admin/blog')
  },
  { immediate: true },
)

async function save(publish: boolean) {
  const post = await editor.save(publish)
  // Un artículo recién creado pasa a su URL de edición para no duplicarlo.
  if (post && route.params.id !== post._id) router.replace(`/admin/blog/${post._id}`)
}

onBeforeRouteLeave(async () => {
  if (!isDirty.value) return true
  return confirm.ask({
    title: '¿Salir sin guardar?',
    message: 'Tienes cambios sin guardar en este artículo. Si sales ahora se pierden.',
    confirmLabel: 'Salir sin guardar',
    danger: true,
  })
})

onMounted(() => loadCategories(false))
</script>

<template>
  <div class="editor">
    <header class="editor__head">
      <RouterLink to="/admin/blog" class="editor__back">
        <i class="fa-solid fa-arrow-left"></i> Blog
      </RouterLink>
      <div class="editor__heading">
        <h1 class="editor__title">{{ postId ? 'Editar artículo' : 'Nuevo artículo' }}</h1>
        <StatusPill
          :label="isPublished ? 'Publicado' : 'Borrador'"
          :tone="isPublished ? 'success' : 'warning'"
        />
      </div>
      <p v-if="isPublished && publishedAt" class="editor__meta">
        Publicado el {{ formatDate(publishedAt) }} ·
        <a :href="`/blog/${effectiveSlug}`" target="_blank" rel="noopener">Ver en el sitio</a>
      </p>
    </header>

    <p v-if="loading" class="editor__loading">
      <i class="fa-solid fa-spinner fa-spin"></i> Cargando…
    </p>

    <div v-else class="editor__body">
      <div class="editor__main">
        <div>
          <label for="post-title">Título</label>
          <input
            id="post-title"
            v-model="form.title"
            class="editor__title-input"
            type="text"
            maxlength="160"
            placeholder="Ej: Cómo elegir el papel correcto para tus etiquetas"
          />
        </div>

        <div>
          <label for="post-slug">Dirección del artículo</label>
          <div class="editor__slug">
            <span>/blog/</span>
            <input
              id="post-slug"
              v-model="form.slug"
              type="text"
              :placeholder="effectiveSlug || 'se-genera-del-titulo'"
            />
          </div>
          <p class="editor__hint">
            Opcional: si lo dejas vacío se arma desde el título.
            <template v-if="isPublished"
              >Cambiarla rompe los enlaces que ya se hayan compartido.</template
            >
          </p>
        </div>

        <div>
          <label for="post-excerpt">Extracto</label>
          <textarea
            id="post-excerpt"
            v-model="form.excerpt"
            rows="3"
            maxlength="300"
            placeholder="Dos líneas que resumen el artículo; se ven en el listado del blog"
          ></textarea>
        </div>

        <MarkdownEditor v-model="form.content" />
      </div>

      <aside class="editor__aside">
        <PostSettingsCard
          v-model:category="form.category"
          v-model:related-category="form.relatedCategory"
          v-model:author="form.author"
          v-model:cover-image="form.coverImage"
          :categories="categories"
        />
        <PostSeoPanel
          v-model:seo-title="form.seoTitle"
          v-model:seo-description="form.seoDescription"
          :slug="effectiveSlug"
          :fallback-title="form.title"
          :fallback-description="form.excerpt"
        />
      </aside>
    </div>

    <PostEditorActions
      v-if="!loading"
      :is-published="isPublished"
      :is-dirty="isDirty"
      :saving="saving"
      @save="save"
    />

    <ConfirmDialog v-bind="confirm.state" @confirm="confirm.confirm" @cancel="confirm.cancel" />
  </div>
</template>

<style scoped lang="scss">
.editor {
  padding-bottom: 4.5rem;

  &__head {
    margin-bottom: $space-md;
  }

  &__back {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: $text-sm;
    color: $ink-soft;
    margin-bottom: 0.6rem;

    &:hover {
      color: $ink;
    }
  }

  &__heading {
    @include flex(row, center, flex-start, 0.75rem);
    flex-wrap: wrap;
  }

  &__title {
    @include display($text-xl, 700);
  }

  &__meta {
    margin-top: 0.4rem;
    font-size: $text-sm;
    color: $ink-soft;

    a {
      color: $accent-deep;
      text-decoration: underline;
    }
  }

  &__loading {
    color: $ink-muted;
    padding: 2rem 0;
  }

  &__body {
    @include flex(column, stretch, flex-start, $space-md);

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
    }
  }

  &__main {
    @include flex(column, stretch, flex-start, 1.2rem);
    flex: 1 1 0;
    min-width: 0;
  }

  &__aside {
    @include flex(column, stretch, flex-start, 1rem);

    @include from('lg') {
      flex: 0 0 340px;
    }
  }

  &__title-input {
    font-size: $text-lg;
    font-weight: 600;
  }

  &__slug {
    @include flex(row, center, flex-start);
    border: 1px solid $line;
    border-radius: $radius-sm;
    background: $surface;
    overflow: hidden;

    &:focus-within {
      border-color: $accent;
      box-shadow: 0 0 0 3px rgba($accent, 0.15);
    }

    span {
      padding-left: 0.9rem;
      font-size: 0.95rem;
      color: $ink-muted;
    }

    input {
      border: none;
      padding-left: 0.1rem;
      box-shadow: none;
    }
  }

  &__hint {
    margin-top: 0.35rem;
    font-size: $text-xs;
    color: $ink-muted;
  }
}
</style>
