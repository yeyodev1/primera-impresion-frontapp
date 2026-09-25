import { onUnmounted, watchEffect } from 'vue'
import { site } from '@/config/site'

interface SeoInput {
  title?: string
  description?: string
  image?: string | null
  path?: string
}

/**
 * Metadatos por página en tiempo de ejecución (SPA sin SSR): título,
 * description, Open Graph y canonical. Al salir de la página se devuelven
 * los valores por defecto del sitio para no arrastrar los de un artículo.
 */

const DEFAULT_IMAGE = `${site.url}/og.png`

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function setCanonical(href: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.rel = 'canonical'
    document.head.appendChild(link)
  }
  link.href = href
}

function apply(input: SeoInput, keepTitle = false) {
  const fullTitle = input.title ? `${input.title} | ${site.name}` : site.title
  const description = input.description || site.description
  const url = `${site.url}${input.path ?? window.location.pathname}`

  if (!keepTitle) document.title = fullTitle
  setMeta('name', 'description', description)
  setMeta('property', 'og:title', keepTitle ? document.title : fullTitle)
  setMeta('property', 'og:description', description)
  setMeta('property', 'og:image', input.image || DEFAULT_IMAGE)
  setMeta('property', 'og:url', url)
  setCanonical(url)
}

export function useSeo(source: () => SeoInput | null) {
  watchEffect(() => {
    const input = source()
    if (input) apply(input)
  })

  // Al desmontar, el afterEach del router ya puso el título de la página
  // nueva: solo se devuelven description, imagen y canonical por defecto.
  onUnmounted(() => apply({ path: window.location.pathname }, true))
}
