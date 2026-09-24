/**
 * Corte manual de texto en palabras (sin SplitText de pago). Cada palabra se
 * pinta dentro de una máscara para las entradas "desde abajo".
 *
 * `accent` marca en naranja la parte del texto que coincida (p. ej. el final
 * del titular del hero). Si no aparece, no se marca nada.
 */
export interface SplitWord {
  text: string
  accent: boolean
  index: number
}

export function splitWords(text: string, accent?: string): SplitWord[] {
  const start = accent ? text.indexOf(accent) : -1
  const end = start >= 0 && accent ? start + accent.length : -1
  const words: SplitWord[] = []
  const re = /\S+/g
  let match: RegExpExecArray | null
  while ((match = re.exec(text))) {
    const from = match.index
    const to = from + match[0].length
    words.push({ text: match[0], accent: start >= 0 && from < end && to > start, index: words.length })
  }
  return words
}

/**
 * Agrupa elementos en líneas según su posición vertical real (después del
 * layout). Devuelve el número de línea de cada elemento, en el mismo orden.
 */
export function lineIndexes(elements: HTMLElement[]): number[] {
  let line = -1
  let lastTop = Number.NEGATIVE_INFINITY
  return elements.map((el) => {
    const top = el.offsetTop
    if (Math.abs(top - lastTop) > 4) {
      line += 1
      lastTop = top
    }
    return line
  })
}
