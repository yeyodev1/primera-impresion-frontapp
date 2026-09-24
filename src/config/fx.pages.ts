/**
 * Rótulos del rediseño «La prensa» para Nosotros, Blog, Artículo, Contacto y
 * 404. Complementan a `site`, `copy` y `fx` de site.ts (que no se tocan desde
 * acá): textos técnicos de apoyo, etiquetas de efectos y accesibilidad.
 * Solo datos verdaderos: desde 2006, Guayaquil, digital/offset/gran formato,
 * envíos a todo Ecuador.
 */
const pad = (n: number) => String(n).padStart(2, '0')

export const fxPages = {
  about: {
    history: {
      yearsPrefix: '+',
      yearsLabel: 'años imprimiendo para empresas',
      sinceLabel: 'Primera hoja',
      today: 'Hoy',
      ruler: 'Regla de trayectoria',
      rulerHint: (from: number, to: number) => `De ${from} a ${to}`,
      facts: [
        { label: 'Taller', value: 'Guayaquil, Ecuador' },
        { label: 'Procesos', value: 'Digital · Offset · Gran formato' },
        { label: 'Entregas', value: 'Envíos a todo Ecuador' },
      ],
    },
    capacity: {
      eyebrow: 'Sala de producción',
      process: (n: number, total: number) => `Proceso ${pad(n)} / ${pad(total)}`,
    },
    process: {
      eyebrow: 'Método de trabajo',
    },
    gallery: {
      eyebrow: 'Muestrario',
      sheets: ['Pliego A · Etiquetas', 'Pliego B · Empaques', 'Pliego C · Rotulación'],
    },
  },

  blog: {
    listEyebrow: 'Archivo editorial',
    featured: 'Destacado',
    topicsLabel: 'Tema',
    count: (n: number) => (n === 1 ? '1 artículo' : `${n} artículos`),
    empty: {
      spec: 'Pliego 00 · En blanco',
      press: 'En prensa',
      cta: 'Explorar soluciones',
    },
    pager: {
      label: 'Paginación del blog',
      goTo: (n: number) => `Ir a la página ${n}`,
    },
  },

  post: {
    readingTime: (min: number) => `${min} min de lectura`,
    progress: 'Leído',
    toc: 'En este artículo',
    section: (n: number) => `§ ${pad(n)}`,
    end: 'Fin del pliego',
    topic: 'Tema',
    ctaEyebrow: 'Siguiente paso',
  },

  contact: {
    channelsEyebrow: 'Canales directos',
    channelsTitle: 'Elige cómo prefieres hablar con nosotros.',
    formEyebrow: 'Orden de trabajo',
    formSheet: 'Formulario · Contacto',
    formDirect: 'O escríbenos directo',
    visitEyebrow: 'Taller',
    visitPin: 'Primera Impresión',
    mapSpec: 'Mapa · Guayaquil',
  },

  notFound: {
    spec: 'Prueba rechazada',
    tolerance: 'Registro fuera de tolerancia',
    hint: 'Mueve el cursor para calibrar',
    hintTouch: 'Calibrando la prensa',
  },
} as const
