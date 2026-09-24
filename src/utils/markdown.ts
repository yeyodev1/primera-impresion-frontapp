/**
 * Markdown mínimo para los artículos del blog: el equipo escribe en el panel
 * sin depender del desarrollador y sin meter una librería entera.
 *
 * Soporta: ## y ### títulos, párrafos, listas con "- " o "1. ", **negrita**,
 * *cursiva* y [enlaces](https://…). Se escapa el HTML antes de transformar,
 * así que lo que se escriba en el panel nunca se ejecuta en el sitio.
 */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function inline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(((?:https?:\/\/|\/)[^\s)]+)\)/g, (_m, label: string, href: string) => {
      const external = href.startsWith('http')
      const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : ''
      return `<a href="${href}"${attrs}>${label}</a>`
    })
}

export function renderMarkdown(source: string): string {
  const lines = escapeHtml(source.replace(/\r\n/g, '\n')).split('\n')
  const html: string[] = []
  let paragraph: string[] = []
  let list: { tag: 'ul' | 'ol'; items: string[] } | null = null

  const flushParagraph = () => {
    if (paragraph.length) html.push(`<p>${inline(paragraph.join(' '))}</p>`)
    paragraph = []
  }
  const flushList = () => {
    if (list) html.push(`<${list.tag}>${list.items.map((i) => `<li>${inline(i)}</li>`).join('')}</${list.tag}>`)
    list = null
  }

  for (const raw of lines) {
    const line = raw.trim()
    const heading = line.match(/^(#{2,3})\s+(.+)$/)
    const bullet = line.match(/^[-*]\s+(.+)$/)
    const ordered = line.match(/^\d+\.\s+(.+)$/)

    if (!line) {
      flushParagraph()
      flushList()
    } else if (heading) {
      flushParagraph()
      flushList()
      const tag = heading[1].length === 2 ? 'h2' : 'h3'
      html.push(`<${tag}>${inline(heading[2])}</${tag}>`)
    } else if (bullet || ordered) {
      flushParagraph()
      const tag = bullet ? 'ul' : 'ol'
      if (list && list.tag !== tag) flushList()
      if (!list) list = { tag, items: [] }
      list.items.push((bullet ?? ordered)![1])
    } else {
      flushList()
      paragraph.push(line)
    }
  }

  flushParagraph()
  flushList()
  return html.join('\n')
}
