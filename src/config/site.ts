/**
 * El copy es configuración: todos los textos y datos de la marca viven acá.
 * Los componentes solo consumen y pintan.
 *
 * Fuente: prototipo aprobado por Primera Impresión (guía para la agencia) y
 * datos de contacto publicados hoy en primeraimpresion.com.ec.
 */
export const site = {
  name: 'Primera Impresión',
  tagline: 'Tu Ecosistema de Soluciones Gráficas.',
  slogan: '¡Es la que cuenta!',
  description:
    'Imprenta en Guayaquil desde 2006. Soluciones gráficas para empresas con asesor asignado y portal de compras para clientes recurrentes.',
  url: 'https://www.primeraimpresion.com.ec',
  since: 2006,
  city: 'Guayaquil, Ecuador',
  address: '6 de Marzo 3000 y General Gómez, Guayaquil',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=6+de+Marzo+3000+y+General+G%C3%B3mez+Guayaquil',
  email: 'ventas@primeraimpresion.com.ec',
  phone: '093 927 3993',
  phoneHref: 'tel:+593939273993',
  // Solo dígitos con código de país
  whatsapp: '593939273993',
  // Portal de Clientes existente: se enlaza, no se reconstruye.
  portalUrl: 'https://tienda.primeraimpresion.com.ec',
  social: {
    instagram: 'https://www.instagram.com/primeraimpresion.ec',
    messenger: 'http://m.me/1972668786086965',
    telegram: 'https://t.me/PrimeraImpresionBot',
  },
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
      platform: 'Conoce nuestra plataforma',
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
          link: { label: 'Hablar con un asesor', to: '/contacto' },
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

  // Cómo funciona la autogestión, tal como lo explica hoy su web.
  howItWorks: [
    { title: 'Cotiza', text: 'Reúnete con tu asesor, experto en impresos y diseño, para analizar tus necesidades.' },
    { title: 'Negocia', text: 'Tenemos excelentes precios; si crees que no es suficiente, conversemos.' },
    { title: 'Normaliza', text: 'Tras el acuerdo, subimos tus productos al portal respetando los términos pactados.' },
    { title: 'Compra en línea', text: 'Te damos acceso para comprar en línea. Si no tienes tiempo, tu asesor lo hace por ti.' },
  ],

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
    frequencies: ['Semanal', 'Mensual', 'Trimestral', 'Ocasional'],
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
    historyTitle: 'Calidad impresa desde el 2006.',
    historyText:
      'Nuestra experiencia nos permite acompañar a empresas de Guayaquil y todo el Ecuador en sus necesidades de impresión y comunicación visual, con impresión digital, offset y gran formato.',
    capacityTitle: 'Conoce nuestra capacidad de producción.',
    capacityText: 'Instalaciones, equipos y colaboradores que hacen posible cada pedido.',
    capacity: [
      { icon: 'fa-solid fa-print', title: 'Impresión digital' },
      { icon: 'fa-solid fa-layer-group', title: 'Offset' },
      { icon: 'fa-solid fa-ruler-combined', title: 'Gran formato' },
      { icon: 'fa-solid fa-scissors', title: 'Acabados' },
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
    closingTitle: '¿Tienes un proyecto en mente?',
    closingText: 'Conversemos sobre la solución gráfica que necesita tu empresa.',
  },

  blog: {
    eyebrow: 'Blog · Primera Impresión',
    title: 'Ideas y consejos para tus proyectos gráficos.',
    lead: 'Descubre materiales, acabados y recomendaciones para elegir la solución gráfica adecuada para tu empresa.',
    listTitle: 'Explora nuestros artículos.',
    empty: 'Estamos preparando nuestros primeros artículos. Vuelve pronto.',
    back: 'Volver al blog',
    ctaTitle: '¿Necesitas una solución para tu empresa?',
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
    explore: 'Explora',
    contact: 'Contacto',
    portal: 'Portal de Clientes',
    rights: 'Todos los derechos reservados.',
  },

  portalCta: 'Ingresar',
} as const

export function whatsappLink(message = 'Hola, quiero más información sobre sus soluciones gráficas'): string {
  if (!site.whatsapp) return '#'
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`
}

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
    portalRequest: 'Solicitar acceso',
    social: 'Síguenos',
    credit: 'Hecho por',
  },

  social: {
    instagram: 'Instagram',
    messenger: 'Messenger',
    telegram: 'Telegram',
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
    howEyebrow: 'Cómo funciona',
    howTitle: 'De la primera reunión a tu compra en línea.',
    closingTitle: '¿Listo para desarrollar tu próximo proyecto?',
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
    channels: [
      { key: 'whatsapp', icon: 'fa-brands fa-whatsapp', title: 'WhatsApp', text: 'Escríbenos para recibir atención.', cta: 'Chatear ahora' },
      { key: 'email', icon: 'fa-solid fa-envelope', title: 'Correo electrónico', text: 'Envíanos tu consulta o requerimiento.', cta: 'Escribir un correo' },
      { key: 'phone', icon: 'fa-solid fa-phone', title: 'Llámanos', text: 'Contacta a nuestro equipo.', cta: 'Llamar ahora' },
      { key: 'advisor', icon: 'fa-solid fa-headset', title: 'Habla con un asesor', text: 'Conversemos sobre tu proyecto.', cta: 'Enviar consulta' },
      { key: 'meeting', icon: 'fa-solid fa-calendar-check', title: 'Agenda una reunión', text: 'Coordinemos una visita o reunión virtual.', cta: 'Solicitar reunión' },
    ],
    mapTitle: 'Mapa con la ubicación de Primera Impresión en Guayaquil',
    mapCta: 'Abrir en Google Maps',
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
    error: 'No pudimos enviar tu solicitud. Intenta de nuevo o escríbenos por WhatsApp.',
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
 * Solo datos verdaderos (desde 2006, Guayaquil, envíos a todo Ecuador).
 */
export const fx = {
  // Coordenadas de Guayaquil, como en el pie de una hoja de prueba.
  coords: '2.1894° S · 79.8891° O',
  city: 'Guayaquil · Ecuador',
  since: 'Desde 2006',
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

  why: {
    eyebrow: 'Primera Impresión en cifras',
    yearsPrefix: '+',
    yearsLabel: 'años imprimiendo',
    yearsNote: 'Desde 2006',
    familiesLabel: 'familias de productos',
    familiesNote: 'De etiquetas a sellos',
    // Respaldo si el API aún no respondió: las familias publicadas hoy.
    familiesFallback: 13,
    coverageValue: 'Todo Ecuador',
    coverageLabel: 'envíos a nivel nacional',
    coverageNote: 'Desde Guayaquil',
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
    eyebrow: 'Siguiente pliego',
    title: '¿Imprimimos algo juntos?',
    text: 'Cuéntanos qué necesita tu empresa y un asesor te acompaña desde la idea hasta el producto terminado.',
    cta: 'Hablemos de tu proyecto',
    top: 'Volver arriba',
  },
} as const
