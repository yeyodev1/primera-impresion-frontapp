import type { Ref } from 'vue'
import { gsap, MQ, ScrollTrigger, useGsapMedia } from './useGsap'

/**
 * Coreografía de PinnedSteps («la prensa»).
 *
 * Desde lg y con movimiento: la sección se fija y el scroll vertical desplaza
 * los pliegos en horizontal; al cruzar el rodillo cada pliego "se imprime"
 * (su número se rellena de tinta con clip-path) y se endereza. Una barra
 * marca el avance. Debajo de lg: línea de tiempo vertical cuyo filete se
 * dibuja con el scroll y pliegos que entran uno a uno.
 * Con reduced motion no se crea nada: queda el layout estático.
 */
export function usePressScroll(root: Ref<HTMLElement | null>) {
  return useGsapMedia(root, (mm, el) => {
    const track = el.querySelector<HTMLElement>('.press__track')
    const pin = el.querySelector<HTMLElement>('.press__pin')
    const fill = el.querySelector<HTMLElement>('.press__fill')
    const sheets = Array.from(el.querySelectorAll<HTMLElement>('.press__sheet'))
    if (!track || !pin) return

    mm.add(`${MQ.lg} and ${MQ.motion}`, () => {
      el.classList.add('press--pinned')
      const distance = () => Math.max(0, track.scrollWidth - track.clientWidth)

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: pin,
          pin: true,
          start: 'top top',
          end: () => `+=${distance()}`,
          scrub: 0.7,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      })

      if (fill) {
        gsap.fromTo(
          fill,
          { scaleX: 0 },
          { scaleX: 1, ease: 'none', scrollTrigger: { trigger: pin, start: 'top top', end: () => `+=${distance()}`, scrub: true } },
        )
      }

      // Posición real del rodillo en la ventana: ahí se "imprime" cada pliego.
      const roller = el.querySelector<HTMLElement>('.press__roller')
      const nip = () => {
        const r = roller?.getBoundingClientRect()
        return r ? Math.round(r.left + r.width / 2) : Math.round(window.innerWidth * 0.3)
      }

      sheets.forEach((sheet) => {
        const ink = sheet.querySelector('.press__ink')
        gsap.fromTo(
          sheet,
          { rotation: 4, yPercent: 6 },
          {
            rotation: 0,
            yPercent: 0,
            ease: 'none',
            scrollTrigger: { containerAnimation: tween, trigger: sheet, start: 'left 100%', end: 'left 45%', scrub: true },
          },
        )
        if (ink) {
          gsap.fromTo(
            ink,
            { clipPath: 'inset(0% 100% 0% 0%)' },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              ease: 'none',
              scrollTrigger: {
                containerAnimation: tween,
                // El número se entinta mientras él mismo cruza el rodillo.
                trigger: ink,
                start: () => `left ${nip()}px`,
                end: () => `right ${nip()}px`,
                scrub: true,
              },
            },
          )
        }
      })

      // Chequeo: si el pin se calculó con un layout viejo (vista lazy que
      // pintó tarde, cortina, fuentes), la sección pasa de largo sin fijarse y
      // los pliegos quedan quietos hasta un F5. Al terminar cada scroll se
      // compara dónde cree ScrollTrigger que empieza el pin con dónde está de
      // verdad (y su largo con el recorrido real de la pista); si no cuadran,
      // se recalcula todo.
      const st = tween.scrollTrigger
      const verify = () => {
        const spacer = pin.parentElement
        if (!st || !spacer) return
        const realStart = spacer.getBoundingClientRect().top + window.scrollY
        const realLength = distance()
        if (Math.abs(st.start - realStart) > 2 || Math.abs(st.end - st.start - realLength) > 2) ScrollTrigger.refresh()
      }
      ScrollTrigger.addEventListener('scrollEnd', verify)
      const timer = window.setTimeout(verify, 1200)

      return () => {
        ScrollTrigger.removeEventListener('scrollEnd', verify)
        window.clearTimeout(timer)
        el.classList.remove('press--pinned')
      }
    })

    mm.add(`(max-width: 1023px) and ${MQ.motion}`, () => {
      const line = el.querySelector('.press__line')
      if (line) {
        gsap.fromTo(
          line,
          { scaleY: 0 },
          { scaleY: 1, ease: 'none', scrollTrigger: { trigger: track, start: 'top 70%', end: 'bottom 60%', scrub: true } },
        )
      }
      sheets.forEach((sheet) => {
        gsap.from(sheet, {
          y: 50,
          opacity: 0,
          rotation: 2,
          duration: 0.9,
          scrollTrigger: { trigger: sheet, start: 'top 85%', once: true },
        })
      })
    })
  })
}
