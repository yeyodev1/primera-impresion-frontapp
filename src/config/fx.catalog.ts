/**
 * Rótulos del rediseño «La prensa» para Soluciones, Detalle de solución,
 * Autogestión y los formularios compartidos. Complementan a `site`, `copy` y
 * `fx` de site.ts (que no se tocan desde acá): textos técnicos de apoyo,
 * etiquetas de efectos y accesibilidad. Solo datos verdaderos: la interfaz
 * simulada del portal usa productos del catálogo público, nunca datos de
 * clientes.
 */
const pad = (n: number) => String(n).padStart(2, '0')

export const fxCatalog = {
  solutions: {
    // Contadores bajo el titular del hero (datos reales del API).
    stats: { solutions: 'Soluciones publicadas', families: 'Familias de productos' },
    selector: 'Tintas',
    selectorHint: 'Elige una familia',
    all: 'Todas las familias',
    results: 'En el pliego',
    showing: (n: number, total: number) => `${pad(n)} de ${pad(total)}`,
    live: (n: number, family: string) =>
      `${n === 1 ? '1 solución' : `${n} soluciones`} en ${family}.`,
    number: (n: number) => `N° ${pad(n)}`,
    options: (n: number) => (n === 1 ? '1 opción' : `${n} opciones`),
    empty: {
      spec: 'Pliego en blanco · 0 soluciones',
      title: 'Esta familia aún no tiene soluciones publicadas.',
    },
  },

  detail: {
    sheet: 'Hoja de producción',
    ref: (slug: string) => `Ref. ${slug.toUpperCase()}`,
    family: 'Familia',
    options: 'Opciones',
    optionsCount: (n: number) => (n === 1 ? '1 opción disponible' : `${n} opciones disponibles`),
    note: 'Nota',
    about: 'Descripción',
    recurrent: 'Clientes recurrentes',
    relatedEyebrow: 'Misma familia',
    prev: 'Ver anteriores',
    next: 'Ver siguientes',
    photo: (name: string) => `Fotografía: ${name}`,
    loading: 'Preparando la ficha',
    notFound: {
      code: '404',
      spec: 'Error 404 · Pliego no encontrado',
    },
  },

  autogestion: {
    // Parte del titular del hero que se pinta en naranja.
    heroAccent: 'más simples.',
    portal: {
      label:
        'Ilustración del Portal de Clientes: catálogo privado, repetición de pedidos y seguimiento de estado.',
      url: 'tienda.primeraimpresion.com.ec',
      tabs: ['Catálogo general', 'Mis productos'],
      exclusive: 'Exclusivo',
      // Productos del catálogo público, a modo de ejemplo.
      items: [
        { name: 'Etiquetas de polipropileno', icon: 'fa-solid fa-tags' },
        { name: 'Cajas personalizadas', icon: 'fa-solid fa-box-open' },
        { name: 'Tarjetas de presentación', icon: 'fa-solid fa-envelope-open-text' },
        { name: 'Carpetas corporativas', icon: 'fa-solid fa-folder' },
      ],
      repeat: 'Repetir pedido',
      order: 'Pedido en curso',
      status: ['Recibido', 'En producción', 'Despachado', 'Entregado'],
    },
    benefits: {
      featured: '01 · Beneficio principal',
      more: 'Además, con tu cuenta',
      number: (n: number) => pad(n),
    },
    pipeline: {
      step: (n: number, total: number) => `Paso ${pad(n)} / ${pad(total)}`,
      start: 'Entrada',
      end: 'Salida',
      progress: 'Avance de la solicitud',
    },
    form: {
      sheet: 'Solicitud de acceso',
      spec: 'Formulario · Pliego 04',
      selective: 'Acceso selectivo',
    },
  },

  forms: {
    required: 'Campos obligatorios',
    stamp: 'Recibido',
    stampRing: 'Primera Impresión · Solicitud recibida · ',
    stampSpec: (date: string) => `Registrado · ${date}`,
  },
} as const
