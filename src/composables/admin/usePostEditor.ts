import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { adminService, type PostInput } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import { POST_CATEGORIES, type MediaImage, type Post, type PostCategory } from '@/types'
import { apiMessage, refId } from './adminCopy'

export const DEFAULT_AUTHOR = 'Equipo Primera Impresión'

/** Mismo criterio que el backend: sin tildes, minúsculas y guiones. */
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function emptyForm() {
  return {
    title: '',
    slug: '',
    category: POST_CATEGORIES[0] as PostCategory,
    relatedCategory: '',
    excerpt: '',
    author: DEFAULT_AUTHOR,
    coverImage: null as MediaImage | null,
    content: '',
    seoTitle: '',
    seoDescription: '',
  }
}

export type PostForm = ReturnType<typeof emptyForm>

export function usePostEditor() {
  const toast = useToastStore()
  const form = reactive(emptyForm())
  const postId = ref('')
  const isPublished = ref(false)
  const publishedAt = ref<string | null>(null)
  const originalSlug = ref('')
  const snapshot = ref(JSON.stringify(form))
  const loading = ref(false)
  const saving = ref(false)

  const isDirty = computed(() => JSON.stringify(form) !== snapshot.value)
  const effectiveSlug = computed(() => slugify(form.slug) || slugify(form.title))

  function fill(post: Post) {
    postId.value = post._id
    isPublished.value = post.isPublished
    publishedAt.value = post.publishedAt
    originalSlug.value = post.slug
    Object.assign(form, {
      title: post.title,
      slug: post.slug,
      category: post.category,
      relatedCategory: refId(post.relatedCategory),
      excerpt: post.excerpt ?? '',
      author: post.author || DEFAULT_AUTHOR,
      coverImage: post.coverImage ?? null,
      content: post.content ?? '',
      seoTitle: post.seoTitle ?? '',
      seoDescription: post.seoDescription ?? '',
    })
    snapshot.value = JSON.stringify(form)
  }

  function reset() {
    postId.value = ''
    isPublished.value = false
    publishedAt.value = null
    originalSlug.value = ''
    Object.assign(form, emptyForm())
    snapshot.value = JSON.stringify(form)
  }

  async function load(id: string): Promise<boolean> {
    if (id === postId.value) return true
    loading.value = true
    try {
      fill(await adminService.getPost(id))
      return true
    } catch (error) {
      toast.error(apiMessage(error, 'No se encontró el artículo'))
      return false
    } finally {
      loading.value = false
    }
  }

  function buildBody(publish: boolean): PostInput {
    const body: PostInput = {
      title: form.title.trim(),
      excerpt: form.excerpt.trim(),
      content: form.content,
      category: form.category,
      coverImage: form.coverImage,
      author: form.author.trim() || DEFAULT_AUTHOR,
      seoTitle: form.seoTitle.trim(),
      seoDescription: form.seoDescription.trim(),
      relatedCategory: form.relatedCategory || null,
      isPublished: publish,
    }
    // El slug solo viaja si se escribió o cambió: renombrar no debe romper enlaces.
    const slug = slugify(form.slug)
    if (slug && slug !== originalSlug.value) body.slug = slug
    return body
  }

  function validate(publish: boolean): string {
    if (!form.title.trim()) return 'El artículo necesita un título'
    if (publish && !form.content.trim()) return 'Escribe el contenido antes de publicar'
    if (publish && !form.excerpt.trim())
      return 'Agrega un extracto: es lo que se ve en el listado del blog'
    return ''
  }

  /** Guarda con el estado de publicación indicado. Devuelve el post o null. */
  async function save(publish: boolean): Promise<Post | null> {
    const problem = validate(publish)
    if (problem) {
      toast.error(problem)
      return null
    }
    saving.value = true
    try {
      const body = buildBody(publish)
      const post = postId.value
        ? await adminService.updatePost(postId.value, body)
        : await adminService.createPost(body)
      const messages = publish
        ? isPublished.value
          ? 'Cambios publicados'
          : 'Artículo publicado'
        : isPublished.value
          ? 'Artículo despublicado: ahora es borrador'
          : 'Borrador guardado'
      fill(post)
      toast.success(messages)
      return post
    } catch (error) {
      toast.error(apiMessage(error))
      return null
    } finally {
      saving.value = false
    }
  }

  // Cerrar la pestaña con cambios sin guardar también debe avisar.
  function onBeforeUnload(event: BeforeUnloadEvent) {
    if (!isDirty.value) return
    event.preventDefault()
    event.returnValue = ''
  }
  onMounted(() => window.addEventListener('beforeunload', onBeforeUnload))
  onBeforeUnmount(() => window.removeEventListener('beforeunload', onBeforeUnload))

  return {
    form,
    postId,
    isPublished,
    publishedAt,
    loading,
    saving,
    isDirty,
    effectiveSlug,
    load,
    reset,
    save,
  }
}
