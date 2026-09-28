import { onBeforeUnmount, onMounted, type Ref } from 'vue'
import { hasFinePointer, prefersReducedMotion } from './useGsap'

/**
 * Motor de la malla de semitono en <canvas>.
 *
 * Una trama hexagonal de puntos cuyo radio sale de un campo de tinta que se
 * mueve despacio (dos ondas cruzadas + degradado hacia una esquina). Cerca
 * del cursor los puntos crecen y se entintan de naranja, como una lupa sobre
 * una hoja impresa. En táctil la "lupa" respira sola siguiendo una curva.
 *
 * Rendimiento: solo pinta mientras el canvas está en pantalla
 * (IntersectionObserver) y la pestaña visible; devicePixelRatio máximo 2;
 * trama más abierta en móvil; los puntos se agrupan en 3 trazos por frame.
 * Con reduced motion se pinta un único frame estático.
 */
export interface HalftoneOptions {
  /** Separación entre puntos en px CSS (escritorio). En móvil se abre un 35 %. */
  spacing?: number
  /** Color base de la trama (rgba). */
  ink?: string
  /** Color de los puntos cercanos al cursor. */
  accent?: string
  /** Hacia dónde se carga la tinta: 'br' abajo-derecha, 'tr', 'bl', 'center'. */
  focus?: 'br' | 'tr' | 'bl' | 'center'
  /** Radio de influencia del cursor en px. */
  lens?: number
  /** Cuánto crecen los puntos bajo la lupa, 0–1. */
  intensity?: number
  interactive?: boolean
}

export function useHalftone(canvasRef: Ref<HTMLCanvasElement | null>, options: HalftoneOptions = {}) {
  const {
    spacing: baseSpacing = 15,
    ink = 'rgba(255,255,255,0.2)',
    accent = '#ec6a2b',
    focus = 'br',
    lens = 150,
    intensity = 0.72,
    interactive = true,
  } = options

  let ctx: CanvasRenderingContext2D | null = null
  let width = 0
  let height = 0
  let spacing = baseSpacing
  let raf = 0
  let visible = false
  let start = 0
  const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999, active: false }
  let io: IntersectionObserver | null = null
  let ro: ResizeObserver | null = null
  let fine = false
  let reduced = false

  function resize() {
    const canvas = canvasRef.value
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    width = rect.width
    height = rect.height
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    ctx = canvas.getContext('2d')
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
    spacing = width < 768 ? baseSpacing * 1.35 : baseSpacing
    if (reduced || !visible) draw(8000)
  }

  function focusWeight(x: number, y: number): number {
    const nx = x / width
    const ny = y / height
    switch (focus) {
      case 'tr':
        return Math.min(1, (nx + (1 - ny)) / 1.4)
      case 'bl':
        return Math.min(1, (1 - nx + ny) / 1.4)
      case 'center':
        return 1 - Math.min(1, Math.hypot(nx - 0.5, ny - 0.5) * 1.6)
      default:
        return Math.min(1, (nx + ny) / 1.5)
    }
  }

  function draw(time: number) {
    if (!ctx) return
    const t = time * 0.001
    ctx.clearRect(0, 0, width, height)

    // En móvil el texto ocupa todo el ancho: la lupa va más chica, más tenue
    // y pegada al borde inferior derecho para no tapar las letras.
    const small = width < 768
    // En táctil (o sin puntero) la lupa recorre una curva de Lissajous.
    if (!fine || !pointer.active) {
      // Recorre sobre todo la mitad derecha: a la izquierda va el texto.
      pointer.tx = small ? width * (0.84 + 0.12 * Math.sin(t * 0.35)) : width * (0.76 + 0.17 * Math.sin(t * 0.35))
      pointer.ty = small
        ? height * (0.74 + 0.18 * Math.sin(t * 0.52 + 1.2))
        : height * (0.55 + 0.3 * Math.sin(t * 0.52 + 1.2))
    }
    pointer.x += (pointer.tx - pointer.x) * 0.12
    pointer.y += (pointer.ty - pointer.y) * 0.12
    const breathe = reduced ? 1 : 1 + 0.18 * Math.sin(t * 1.6)
    const lensR = (small ? lens * 0.4 : lens) * breathe
    const boost = small ? intensity * 0.55 : intensity
    const maxR = spacing * 0.46

    const paths = [new Path2D(), new Path2D(), new Path2D()]
    const rowH = spacing * 0.866
    let row = 0
    for (let y = spacing * 0.5; y < height + spacing; y += rowH, row++) {
      const offset = row % 2 ? spacing * 0.5 : 0
      for (let x = offset; x < width + spacing; x += spacing) {
        const wave = 0.5 + 0.25 * Math.sin(x * 0.006 + t * 0.4) + 0.25 * Math.cos(y * 0.008 - t * 0.3)
        const base = focusWeight(x, y) * wave
        const d = Math.hypot(x - pointer.x, y - pointer.y)
        const bump = d < lensR * 1.6 ? Math.exp(-(d * d) / (2 * lensR * lensR * 0.45)) : 0
        const r = maxR * Math.min(1, base * 0.85 + bump * boost)
        if (r < 0.45) continue
        const bucket = bump > 0.45 ? 2 : bump > 0.12 ? 1 : 0
        paths[bucket]!.moveTo(x + r, y)
        paths[bucket]!.arc(x, y, r, 0, Math.PI * 2)
      }
    }
    ctx.fillStyle = ink
    ctx.fill(paths[0]!)
    ctx.globalAlpha = small ? 0.3 : 0.55
    ctx.fillStyle = accent
    ctx.fill(paths[1]!)
    ctx.globalAlpha = small ? 0.45 : 0.85
    ctx.fill(paths[2]!)
    ctx.globalAlpha = 1
  }

  function loop(time: number) {
    if (!start) start = time
    draw(time - start + 8000)
    raf = requestAnimationFrame(loop)
  }

  function play() {
    if (reduced || raf || !visible || document.hidden) return
    raf = requestAnimationFrame(loop)
  }

  function pause() {
    cancelAnimationFrame(raf)
    raf = 0
  }

  function onPointer(event: PointerEvent) {
    const canvas = canvasRef.value
    if (!canvas || !visible) return
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    pointer.active = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height
    if (pointer.active) {
      pointer.tx = x
      pointer.ty = y
    }
  }

  function onVisibility() {
    if (document.hidden) pause()
    else play()
  }

  onMounted(() => {
    const canvas = canvasRef.value
    if (!canvas) return
    reduced = prefersReducedMotion()
    fine = interactive && hasFinePointer()
    pointer.x = pointer.tx = canvas.clientWidth * 0.7
    pointer.y = pointer.ty = canvas.clientHeight * 0.6
    resize()
    draw(8000)

    ro = new ResizeObserver(resize)
    ro.observe(canvas)
    if (reduced) return

    io = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting
      if (visible) play()
      else pause()
    })
    io.observe(canvas)
    document.addEventListener('visibilitychange', onVisibility)
    if (fine) window.addEventListener('pointermove', onPointer, { passive: true })
  })

  onBeforeUnmount(() => {
    pause()
    io?.disconnect()
    ro?.disconnect()
    document.removeEventListener('visibilitychange', onVisibility)
    window.removeEventListener('pointermove', onPointer)
  })
}
