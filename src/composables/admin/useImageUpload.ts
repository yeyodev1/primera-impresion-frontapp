import { ref } from 'vue'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import type { MediaImage } from '@/types'
import { apiMessage } from './adminCopy'

const MAX_BYTES = 10 * 1024 * 1024

/**
 * Sube una imagen y devuelve { url, publicId } o null. Nunca lanza: si el API
 * responde 503 (Cloudinary sin configurar) o cualquier error, se avisa con un
 * toast y el campo queda sin imagen, que es un estado válido.
 */
export function useImageUpload() {
  const uploading = ref(false)
  const toast = useToastStore()

  async function upload(file: File): Promise<MediaImage | null> {
    if (!file.type.startsWith('image/')) {
      toast.error('El archivo debe ser una imagen (JPG, PNG o WebP)')
      return null
    }
    if (file.size > MAX_BYTES) {
      toast.error('La imagen pesa más de 10 MB; redúcela antes de subirla')
      return null
    }

    uploading.value = true
    try {
      const image = await adminService.uploadImage(file)
      toast.success('Imagen subida')
      return image
    } catch (error) {
      toast.error(apiMessage(error, 'No se pudo subir la imagen'))
      return null
    } finally {
      uploading.value = false
    }
  }

  return { uploading, upload }
}
