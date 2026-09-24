/**
 * Textos de interfaz que todavía no existen en `src/config/site.ts`.
 *
 * Viven acá para no escribir copy dentro de los componentes; la idea es
 * moverlos tal cual a `site.ui` y cambiar el import. Nada de esto es
 * información de la marca: son rótulos, estados y ayudas de accesibilidad.
 */
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
