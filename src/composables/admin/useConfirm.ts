import { reactive } from 'vue'

interface ConfirmOptions {
  title: string
  message?: string
  confirmLabel?: string
  danger?: boolean
}

/**
 * Confirmación como promesa: `if (await ask({...}))`. El estado se pasa tal
 * cual a <ConfirmDialog v-bind="confirm.state" @confirm @cancel>.
 */
export function useConfirm() {
  const state = reactive({
    open: false,
    title: '',
    message: '' as string | undefined,
    confirmLabel: '' as string | undefined,
    danger: false,
  })
  let resolver: ((value: boolean) => void) | null = null

  function ask(options: ConfirmOptions): Promise<boolean> {
    Object.assign(state, { danger: false, message: '', confirmLabel: '' }, options, { open: true })
    return new Promise((resolve) => {
      resolver = resolve
    })
  }

  function answer(value: boolean) {
    state.open = false
    resolver?.(value)
    resolver = null
  }

  return { state, ask, confirm: () => answer(true), cancel: () => answer(false) }
}
