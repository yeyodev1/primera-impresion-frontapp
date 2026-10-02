// El cliente tiene un banco de fotos cuadradas y el sitio las muestra todas
// 1:1. Recortar al centro antes de subir garantiza el formato aunque llegue
// una foto apaisada, y reducirla deja el archivo bajo el límite de 4.5 MB que
// Vercel impone al cuerpo de la petición.
const MAX_SIDE = 1600
const QUALITY = 0.9

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('No se pudo leer la imagen'))
    }
    img.src = url
  })
}

/** Devuelve la imagen recortada al centro en cuadrado, como WebP (o JPEG). */
export async function toSquareImage(file: File): Promise<File> {
  const img = await loadImage(file)
  const crop = Math.min(img.naturalWidth, img.naturalHeight)
  const side = Math.min(crop, MAX_SIDE)

  const canvas = document.createElement('canvas')
  canvas.width = side
  canvas.height = side
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('El navegador no permite procesar la imagen')

  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(
    img,
    (img.naturalWidth - crop) / 2,
    (img.naturalHeight - crop) / 2,
    crop,
    crop,
    0,
    0,
    side,
    side,
  )

  const encode = (type: string) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, QUALITY))

  // Safari viejo no codifica WebP y devuelve PNG, que pesa demasiado: JPEG.
  let blob = await encode('image/webp')
  if (blob?.type !== 'image/webp') blob = await encode('image/jpeg')
  if (!blob) throw new Error('No se pudo procesar la imagen')

  const ext = blob.type === 'image/webp' ? 'webp' : 'jpg'
  const name = file.name.replace(/\.[^.]+$/, '') || 'imagen'
  return new File([blob], `${name}.${ext}`, { type: blob.type })
}
