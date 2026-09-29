/**
 * El copy es configuración: todos los textos y datos de la marca viven acá.
 * Los componentes solo consumen y pintan.
 *
 * Única fuente: el prototipo HTML aprobado por Primera Impresión y su guía para
 * la agencia. Nada sale de la web anterior (primeraimpresion.com.ec).
 *
 * Datos de contacto, redes y portal: la guía pide no publicar datos
 * ilustrativos y mostrar los canales solo cuando estén confirmados. Quedan
 * vacíos; al llenarlos acá el sitio los muestra solo (footer, menú, contacto,
 * WhatsApp, mapa y botón «Ingresar»).
 */
export const site = {
  name: 'Primera Impresión',
  tagline: 'Tu Ecosistema de Soluciones Gráficas.',
  // Título de la portada (pestaña y buscadores), tal cual el prototipo.
  title: 'Primera Impresión | Ecosistema de Soluciones Gráficas',
  description: 'Primera Impresión: tu ecosistema de soluciones gráficas para empresas.',
  url: 'https://www.primeraimpresion.com.ec',
  city: 'Guayaquil, Ecuador',
  // Confirmados por Primera Impresión (28/09/2026). El correo sigue pendiente.
  address: 'Bolivia 2200 y Tungurahua, Guayaquil',
  mapsUrl: 'https://maps.app.goo.gl/nG1LRmr4NRixS3CF6',
  email: '',
  phone: '+593 93 927 3993',
  phoneHref: 'tel:+593939273993',
  // Solo dígitos con código de país
  whatsapp: '593939273993',
  // Portal de Clientes existente (la tienda), confirmado por Primera Impresión.
  portalUrl: 'https://tienda.primeraimpresion.com.ec',
  // Calificación del perfil de Google Maps, confirmada por el cliente.
  googleRating: 4.9,
  // Enlace de reseñas de Google, entregado por el cliente.
  reviewsUrl: 'https://g.page/r/CYZh9xfqtr83EAE/review',
  // Redes confirmadas: { label: 'Nombre de la red', icon: 'fa-brands fa-…', href: 'https://…' }
  social: [] as ReadonlyArray<{ label: string; icon: string; href: string }>,
  nav: [
    { label: 'Inicio', to: '/' },
    { label: 'Soluciones', to: '/soluciones' },
    { label: 'Autogestión en línea', to: '/autogestion' },
    { label: 'Nosotros', to: '/nosotros' },
    { label: 'Blog', to: '/blog' },
    { label: 'Contacto', to: '/contacto' },
  ],

  home: {
    eyebrow: 'Primera Impresión · Guayaquil, Ecuador',
    title: 'Tu Ecosistema de Soluciones Gráficas.',
    lead: 'Una amplia variedad de soluciones para las necesidades gráficas de tu empresa, con experiencia, tecnología y atención personalizada.',
    ctas: {
      // Botón principal: lleva directo al formulario de acceso de autogestión.
      platform: 'Solicitar reunión de acceso',
      advisor: 'Hablar con un asesor',
      explore: 'Explorar soluciones',
    },
    heroCard: {
      pill: 'Ecosistema de soluciones',
      title: 'De tu idea al producto terminado.',
      items: ['Impresión', 'Etiquetas', 'Gran formato', 'Empaques', 'Promocionales'],
    },
    modes: {
      eyebrow: 'Dos formas de trabajar contigo',
      title: 'La atención que necesitas, a tu manera.',
      items: [
        {
          icon: 'fa-solid fa-laptop',
          title: 'Autogestión para empresas recurrentes',
          text: 'Accede al catálogo general y a «Mis productos», tu catálogo privado con productos desarrollados especialmente para tu empresa. Compra, repite pedidos y consulta su estado con el respaldo de tu asesor.',
          link: { label: 'Conocer cómo acceder', to: '/autogestion' },
        },
        {
          icon: 'fa-solid fa-handshake',
          title: 'Atención tradicional con asesor',
          text: 'Cuéntanos lo que necesitas. Tu asesor te orientará, preparará la propuesta y gestionará el pedido contigo.',
          // En Inicio, «Hablar con un asesor» abre el WhatsApp del asesor.
          link: { label: 'Hablar con un asesor', to: '/contacto', whatsapp: true },
        },
      ],
    },
    solutions: {
      eyebrow: 'Nuestras soluciones',
      title: 'Encuentra lo que necesita tu empresa.',
      text: 'Explora nuestras principales familias de productos y consulta las alternativas disponibles.',
      cta: 'Ver todas las soluciones',
    },
    why: {
      title: '¿Por qué Primera Impresión?',
      items: [
        {
          icon: 'fa-solid fa-industry',
          title: 'Experiencia y capacidad',
          text: 'Más de 20 años acompañando proyectos gráficos con procesos y equipamiento propios.',
        },
        {
          icon: 'fa-solid fa-puzzle-piece',
          title: 'Soluciones para tu empresa',
          text: 'Desarrollamos productos de acuerdo con los requerimientos de cada cliente.',
        },
        {
          icon: 'fa-solid fa-mobile-screen',
          title: 'Atención y seguimiento',
          text: 'Un asesor asignado y herramientas para facilitar tus pedidos recurrentes.',
        },
      ],
    },
    blog: {
      eyebrow: 'Blog',
      title: 'Ideas y consejos para tus proyectos gráficos.',
      cta: 'Ver todos los artículos',
    },
  },

  solutions: {
    eyebrow: 'Soluciones gráficas',
    title: 'Explora nuestras soluciones.',
    lead: 'Conoce nuestras familias, subcategorías y productos representativos. La compra y la gestión de pedidos se realizan en nuestro Portal de Clientes o con tu asesor.',
    catalogTitle: 'Catálogo de soluciones',
    catalogText: 'Selecciona una categoría para explorar sus productos.',
    allLabel: 'Todas',
    empty: 'Pronto publicaremos soluciones en esta categoría. Consulta con un asesor mientras tanto.',
    detail: {
      back: 'Volver a soluciones',
      optionsTitle: 'Opciones disponibles',
      optionsText: 'Materiales, formatos, acabados y cantidades según el requerimiento y la disponibilidad real.',
      cta: 'Consultar con un asesor',
      imagePending: 'Fotografía del producto en preparación',
      recurrentText:
        'Conoce cómo solicitar acceso a nuestro portal para realizar pedidos directamente y repetir tus productos exclusivos.',
    },
  },

  recurrentBanner: {
    title: '¿Compras con frecuencia para tu empresa?',
    text: 'Conoce cómo solicitar acceso al Portal de Clientes y a tu catálogo privado.',
    cta: 'Conocer cómo acceder',
  },

  autogestion: {
    eyebrow: 'Plataforma para clientes recurrentes',
    title: 'Tus compras gráficas, más simples.',
    lead: 'Compra desde nuestro catálogo general o desde «Mis productos», tu catálogo privado con soluciones que desarrollamos especialmente para tu empresa. Gestiona tus pedidos con el acompañamiento de tu asesor.',
    ctas: { request: 'Solicitar reunión de acceso', benefits: 'Conocer los beneficios' },
    heroCard: {
      pill: 'Portal de Clientes',
      title: 'Mis productos',
      text: 'Productos exclusivos de tu empresa, listos para volver a pedir.',
    },
    benefitsEyebrow: 'Beneficio principal',
    benefitsTitle: 'Un catálogo exclusivo para tu empresa.',
    benefitsText:
      'Primera Impresión desarrolla y configura productos a medida de tu organización y los incorpora a «Mis productos», un catálogo privado que otras empresas no pueden ver. Así puedes repetir tus compras con mayor facilidad.',
    benefits: [
      { icon: 'fa-solid fa-lock', title: 'Mis productos', text: 'Tu catálogo privado con productos previamente desarrollados para tu empresa.' },
      { icon: 'fa-solid fa-book-open', title: 'Dos catálogos', text: 'Acceso al catálogo general y al catálogo exclusivo de tu organización.' },
      { icon: 'fa-solid fa-rotate', title: 'Repite pedidos', text: 'Vuelve a solicitar productos que ya utilizas, sin empezar de cero.' },
      { icon: 'fa-solid fa-box', title: 'Seguimiento de pedidos', text: 'Consulta el estado actualizado de tus órdenes dentro de la plataforma.' },
      { icon: 'fa-solid fa-file-invoice', title: 'Gestión administrativa', text: 'Consulta facturas, órdenes y pagos realizados a Primera Impresión.' },
      { icon: 'fa-solid fa-truck', title: 'Envíos nacionales', text: 'Gestiona pedidos con opciones de entrega a nivel nacional.' },
      { icon: 'fa-solid fa-tag', title: 'Descuentos exclusivos', text: 'Accede a beneficios comerciales disponibles para tu cuenta, según condiciones aplicables.' },
      { icon: 'fa-solid fa-user-tie', title: 'Tu asesor te acompaña', text: 'Recibe capacitación y apoyo de un asesor asignado, incluso si compras directamente.' },
    ],
    processTitle: 'Una plataforma para empresas que compran con frecuencia.',
    processText:
      'El acceso es selectivo: evaluamos cada solicitud, coordinamos una reunión y capacitamos a los clientes aprobados. Completar el formulario no crea una cuenta automáticamente.',
    steps: [
      { title: 'Solicitud', text: 'Envíanos tus datos.' },
      { title: 'Reunión', text: 'Conocemos tu operación.' },
      { title: 'Evaluación', text: 'Revisamos tu perfil.' },
      { title: 'Capacitación', text: 'Tu asesor te guía.' },
      { title: 'Activación', text: 'Accedes si se aprueba.' },
    ],
    formEyebrow: 'Solicita acceso',
    formTitle: 'Conversemos sobre las compras de tu empresa.',
    formText: 'Completa el formulario y nuestro equipo comercial se comunicará contigo para coordinar una reunión.',
    formNotice: 'Enviar el formulario no crea un usuario ni garantiza la aprobación: primero conversamos contigo.',
    frequencies: ['Semanal', 'Mensual', 'Ocasional', 'Otra'],
    submit: 'Solicitar reunión',
    success: '¡Gracias! Recibimos tu solicitud. Un asesor te contactará para coordinar la reunión.',
    closingTitle: '¿Prefieres atención personalizada?',
    closingText: 'También puedes gestionar tus pedidos directamente con un asesor.',
  },

  about: {
    eyebrow: 'Conoce Primera Impresión',
    title: 'Mucho más que una imprenta.',
    lead: 'Somos tu Ecosistema de Soluciones Gráficas. Combinamos experiencia, tecnología y atención personalizada para desarrollar soluciones que acompañan las necesidades de tu empresa.',
    historyEyebrow: 'Nuestra trayectoria',
    historyTitle: 'Más de 20 años desarrollando soluciones gráficas.',
    historyText:
      'Nuestra experiencia nos permite acompañar a empresas en sus necesidades de impresión y comunicación visual.',
    // Reconocimientos del XX Congreso Nacional de la Industria Gráfica (CIGG),
    // con el texto fiel a cada placa.
    awardsEyebrow: 'Reconocimientos',
    awardsTitle: 'Respaldo del sector gráfico y de nuestros clientes.',
    awards: [
      {
        icon: 'fa-solid fa-trophy',
        title: 'Primer lugar · Lo Mejor del Impreso 2026',
        text: '18.° Concurso de la Cámara de la Industria Gráfica del Guayas. Categoría Agendas y cuadernos: agendas ejecutivas, temáticas o escolares.',
        meta: 'CIGG · Cuenca, septiembre de 2026',
        photo: 'trophy',
        photoAlt: 'Trofeo del primer lugar del 18.° Concurso Lo Mejor del Impreso 2026 de la CIGG',
      },
      {
        icon: 'fa-solid fa-award',
        title: 'Reconocimiento Empresarial',
        text: 'Otorgado por la Cámara de la Industria Gráfica del Guayas por nuestros 20 años de trayectoria, el compromiso con la excelencia y el aporte al sector gráfico ecuatoriano.',
        meta: 'XX Congreso Nacional de la Industria Gráfica · Cuenca, septiembre de 2026',
        // Foto de la placa con la cifra corregida a 20 años, autorizada por el
        // presidente de la CIGG (28/09/2026).
        photo: 'plaque',
        photoAlt: 'Placa de Reconocimiento Empresarial de la CIGG a Primera Impresión',
      },
    ],
    ratingTitle: 'Google Reviews',
    ratingText: 'La calificación que nos dan nuestros clientes.',
    ratingCta: 'Ver reseñas',
    capacityTitle: 'Conoce nuestra capacidad de producción.',
    capacityText: 'Fotografías auténticas de nuestras instalaciones, equipos y colaboradores.',
    capacity: [
      { icon: 'fa-solid fa-layer-group', title: 'Impresión offset' },
      { icon: 'fa-solid fa-print', title: 'Impresión digital' },
      { icon: 'fa-solid fa-ruler-combined', title: 'Gran formato' },
      { icon: 'fa-solid fa-scissors', title: 'Acabados' },
      { icon: 'fa-solid fa-users', title: 'Nuestro equipo' },
    ],
    processTitle: 'Así trabajamos contigo.',
    process: [
      { title: 'Escuchamos', text: 'Conocemos lo que necesita tu empresa.' },
      { title: 'Desarrollamos', text: 'Proponemos la solución gráfica adecuada.' },
      { title: 'Producimos', text: 'Elaboramos y damos seguimiento a tu pedido.' },
      { title: 'Acompañamos', text: 'Facilitamos tus próximas compras.' },
    ],
    galleryTitle: 'Algunos de nuestros trabajos.',
    galleryText: 'Una muestra breve de proyectos realizados para nuestros clientes.',
    closingTitle: '¿Tienes un proyecto gráfico en mente?',
    closingText: 'Conversemos sobre la solución gráfica que necesita tu empresa.',
  },

  blog: {
    eyebrow: 'Blog · Primera Impresión',
    title: 'Ideas y consejos para tus proyectos gráficos.',
    lead: 'Descubre materiales, acabados y recomendaciones para elegir la solución gráfica adecuada para tu empresa.',
    listTitle: 'Explora nuestros artículos.',
    empty: 'Estamos preparando nuestros primeros artículos. Vuelve pronto.',
    back: 'Volver al blog',
    ctaTitle: '¿Necesitas una solución impresa para tu empresa?',
    ctaText: 'Explora nuestras opciones o consulta con un asesor.',
  },

  contact: {
    eyebrow: 'Estamos para ayudarte',
    title: 'Hablemos de tu próximo proyecto.',
    lead: 'Cuéntanos qué necesitas y nuestro equipo se pondrá en contacto contigo para encontrar una solución gráfica para tu empresa.',
    formTitle: 'Cuéntanos tu proyecto.',
    formText: 'Completa el formulario y nuestro equipo se comunicará contigo.',
    submit: 'Enviar mensaje',
    success: '¡Gracias! Recibimos tu mensaje. Un asesor te responderá muy pronto.',
    visitTitle: 'Visítanos en Guayaquil.',
    visitText: 'Conoce nuestras instalaciones y conversemos sobre tu proyecto.',
    closingTitle: 'Más que una imprenta, somos tu aliado gráfico.',
    closingText: 'Estamos listos para asesorarte en cada etapa de tu proyecto.',
    closingCta: 'Cuéntanos tu idea',
  },

  forms: {
    consentContact: 'Autorizo que Primera Impresión me contacte para responder esta solicitud.',
    required: 'Completa los campos obligatorios.',
    sending: 'Enviando…',
  },

  footer: {
    // Texto bajo el logo, entregado por el cliente (28/09/2026).
    about:
      'Desde 2006 transformamos ideas en soluciones gráficas que generan impacto. Más de 20 años combinando experiencia, tecnología, calidad y atención personalizada en impresión digital, offset, gran formato, etiquetas, packaging y mucho más.',
    explore: 'Explora',
    contact: 'Contacto',
    portal: 'Portal de Clientes',
    rights: 'Todos los derechos reservados.',
  },

  portalCta: 'Ingresar',
} as const

/** Formulario de contacto: destino de todo canal que aún no está confirmado. */
export const contactForm = '/contacto#form-contacto'

/** Chat de WhatsApp; sin número confirmado, el formulario de contacto. */
export function whatsappLink(message = 'Hola, quiero más información sobre sus soluciones gráficas'): string {
  if (!site.whatsapp) return contactForm
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`
}

/** «Ingresar»: el portal real si ya hay URL; si no, cómo solicitar acceso. */
export function portalLink(): string {
  return site.portalUrl || '/autogestion'
}

/** Hay algún dato directo para mostrar (footer, menú móvil). */
export const hasDirectContact = Boolean(site.address || site.phone || site.email || site.whatsapp)

/** Rótulos de interfaz: formularios, estados, accesibilidad y textos auxiliares. */
export const copy = {
  header: {
    home: 'Primera Impresión, ir al inicio',
    navLabel: 'Navegación principal',
    menuOpen: 'Abrir menú',
    menuClose: 'Cerrar menú',
    newTab: '(se abre en una pestaña nueva)',
  },

  footer: {
    address: 'Dirección',
    phone: 'Teléfono',
    email: 'Correo',
    whatsapp: 'WhatsApp',
    portalText: 'Compra en línea, repite pedidos y consulta el estado de tus órdenes.',
    portalCta: 'Ingresar al portal',
    // Mientras no haya URL del portal confirmada.
    portalInfo: 'Conocer cómo acceder',
    portalRequest: 'Solicitar acceso',
    advisor: 'Hablar con un asesor',
    form: 'Formulario de contacto',
    social: 'Síguenos',
    credit: 'Hecho por',
  },

  // Rótulo de los espacios de foto que no son de producto (instalaciones, galería).
  imagePending: 'Fotografía en preparación',

  whatsappFloat: 'Escríbenos por WhatsApp',

  states: {
    loading: 'Cargando…',
    error: 'No pudimos cargar esta información.',
    retry: 'Reintentar',
  },

  home: {
    closingTitle: '¿Listo para desarrollar tu próximo proyecto de impresión?',
    closingText: 'Cuéntanos qué necesitas y te ayudaremos a encontrar una solución.',
    closingCta: 'Contactar a un asesor',
  },

  solutions: {
    filterLabel: 'Filtrar soluciones por categoría',
    cardCta: 'Ver detalle y consultar',
    categoryCta: 'Ver soluciones',
    count: (n: number) => (n === 1 ? '1 solución' : `${n} soluciones`),
    relatedTitle: 'Otras soluciones de esta categoría.',
    contactCta: 'Escribir al equipo',
    whatsappMessage: (name: string) => `Hola, quiero consultar por ${name}.`,
    notFoundTitle: 'No encontramos esta solución.',
    notFoundText: 'Puede que ya no esté publicada o que el enlace haya cambiado.',
  },

  autogestion: {
    stepsEyebrow: 'Proceso de acceso',
    closingCta: 'Hablar con un asesor',
  },

  about: {
    closingCta: 'Hablar con un asesor',
  },

  blog: {
    filterLabel: 'Filtrar artículos por tema',
    allLabel: 'Todos',
    readMore: 'Leer artículo',
    by: 'Por',
    prev: 'Anterior',
    next: 'Siguiente',
    page: (page: number, pages: number) => `Página ${page} de ${pages}`,
    relatedCta: (category: string) => `Ver soluciones de ${category}`,
    exploreCta: 'Explorar soluciones',
    advisorCta: 'Consultar con un asesor',
    notFoundTitle: 'No encontramos este artículo.',
    notFoundText: 'Puede que ya no esté publicado o que el enlace haya cambiado.',
  },

  contact: {
    // Solo los canales directos que pidió el cliente: WhatsApp, llamada y correo.
    channels: [
      { key: 'whatsapp', icon: 'fa-brands fa-whatsapp', title: 'WhatsApp', text: 'Escríbenos para recibir atención.', cta: 'Chatear ahora' },
      { key: 'phone', icon: 'fa-solid fa-phone', title: 'Llámanos', text: 'Contacta a nuestro equipo.', cta: 'Llamar ahora' },
      { key: 'email', icon: 'fa-solid fa-envelope', title: 'Correo electrónico', text: 'Envíanos tu consulta o requerimiento.', cta: 'Escribir correo' },
    ],
    // Canal sin dato confirmado: su botón lleva al formulario.
    formCta: 'Ir al formulario',
    mapTitle: 'Mapa con la ubicación de Primera Impresión en Guayaquil',
    mapCta: 'Abrir en Google Maps',
    mapPending: 'Mapa con ubicación verificada · en preparación',
  },

  forms: {
    name: 'Nombre y apellido',
    company: 'Empresa',
    role: 'Cargo',
    email: 'Correo electrónico',
    whatsapp: 'WhatsApp',
    phone: 'Teléfono / WhatsApp',
    products: 'Productos que compras habitualmente',
    frequency: 'Frecuencia de compra',
    message: '¿En qué podemos ayudarte?',
    select: 'Seleccionar',
    placeholders: {
      name: 'Tu nombre',
      company: 'Nombre de tu empresa',
      role: 'Tu cargo',
      email: 'nombre@empresa.com',
      phone: '09 9999 9999',
      products: 'Cuéntanos qué suele comprar tu empresa',
      message: 'Cuéntanos sobre tu proyecto',
    },
    honeypot: 'No completes este campo',
    requiredHint: 'Obligatorio',
    invalidEmail: 'Ingresa un correo válido.',
    consentRequired: 'Necesitamos tu autorización para contactarte.',
    error: 'No pudimos enviar tu solicitud. Intenta de nuevo en unos minutos.',
    again: 'Enviar otra solicitud',
  },

  notFound: {
    code: 'Error 404',
    title: 'Esta página no existe.',
    text: 'Puede que el enlace esté mal escrito o que la página se haya movido.',
    home: 'Volver al inicio',
    explore: 'Explorar soluciones',
  },
} as const

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Rótulos técnicos y decorativos del rediseño «La prensa»: numeración de
 * pliegos, tintas, coordenadas y textos de apoyo de los efectos. Son textura
 * gráfica, pero también copy: por eso viven acá y no en los componentes.
 * Solo datos del prototipo (más de 20 años, Guayaquil, líneas de producto).
 */
export const fx = {
  // Coordenadas de Guayaquil, como en el pie de una hoja de prueba.
  coords: '2.1894° S · 79.8891° O',
  city: 'Guayaquil · Ecuador',
  since: '+20 años',
  // Línea sobre el titular de los cierres: las líneas de producto del prototipo.
  closingLine: site.home.heroCard.items,
  // Fórmula aproximada del naranja de marca en cuatricromía.
  inks: 'C 0 M 60 Y 85 K 0',
  section: (n: number, total: number) => `${pad(n)} / ${pad(total)}`,
  sheet: (n: number, total?: number) => (total ? `Pliego ${pad(n)} / ${pad(total)}` : `Pliego ${pad(n)}`),
  index: (n: number) => pad(n),

  hero: {
    sheet: 'Pliego 01',
    // Parte del titular que se pinta en naranja.
    accent: 'Soluciones Gráficas.',
    scroll: 'Desliza',
    proofLabel: 'Prueba de color · A4',
  },

  marquee: {
    label: 'Familias de productos',
  },

  modes: {
    labels: ['Modo A · En línea', 'Modo B · Con asesor'],
  },

  solutions: {
    listLabel: 'Índice de familias',
    preview: 'Ver familia',
    swipe: 'Desliza para ver más',
  },

  how: {
    press: 'En prensa',
    progress: 'Avance del pliego',
  },


  slot: {
    photo: 'Foto',
    pending: 'En preparación',
  },

  colorBar: ['C', 'M', 'Y', 'K', 'CM', 'MY', 'CY', '75', '50', '25', '10', '0'],

  intro: {
    home: 'Inicio',
    breadcrumb: 'Ruta de navegación',
    page: (n: number, total: number) => `Pág. ${pad(n)} / ${pad(total)}`,
  },

  menu: {
    label: 'Menú',
    contact: 'Contacto directo',
  },

  transition: {
    label: 'Imprimiendo',
  },

  whatsapp: {
    tooltip: '¿Tienes una consulta? Te respondemos por WhatsApp.',
  },

  footer: {
    top: 'Volver arriba',
  },
} as const

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
    // Sin opciones cargadas: el prototipo solo dice «según el requerimiento».
    options: (n: number) => (n === 0 ? 'Según requerimiento' : n === 1 ? '1 opción' : `${n} opciones`),
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
    optionsCount: (n: number) =>
      n === 0 ? 'Según requerimiento' : n === 1 ? '1 opción disponible' : `${n} opciones disponibles`,
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
      url: 'Portal de Clientes · Representación',
      tabs: ['Catálogo general', 'Mis productos'],
      exclusive: 'Exclusivo',
      // Productos del catálogo público, a modo de ejemplo.
      items: [
        { name: 'Etiquetas de polipropileno', icon: 'fa-solid fa-tags' },
        { name: 'Cajas personalizadas', icon: 'fa-solid fa-box-open' },
        { name: 'Tarjetas de presentación', icon: 'fa-solid fa-envelope-open-text' },
        { name: 'Folletos y catálogos', icon: 'fa-solid fa-book-open' },
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

export const fxPages = {
  about: {
    awards: {
      plate: (n: number) => `Lámina ${String(n).padStart(2, '0')}`,
      place: 'Cuenca · 2026',
      rating: (value: number) => `${value.toFixed(1)} / 5`,
      ratingLabel: (value: number) => `Calificación de ${value.toFixed(1)} de 5 estrellas en Google Maps`,
    },
    history: {
      // El sello gigante: «+» aparte y la cifra que se entinta con el scroll.
      stampPrefix: '+',
      stamp: '20',
      stampLabel: 'años desarrollando soluciones gráficas',
      facts: [
        { label: 'Planta', value: 'Guayaquil, Ecuador' },
        { label: 'Procesos', value: 'Offset · Impresión digital · Gran formato · Acabados' },
        { label: 'Entregas', value: 'Envíos nacionales' },
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
      sheets: ['Pliego A · Etiquetas', 'Pliego B · Empaques', 'Pliego C · Señalética'],
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
    visitEyebrow: 'Planta',
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
