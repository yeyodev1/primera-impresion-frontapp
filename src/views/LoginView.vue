<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BrandMark from '@/components/brand/BrandMark.vue'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'
import { site } from '@/config/site'
import type { ApiError } from '@/types'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const toast = useToastStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

// Solo rutas internas del panel: un ?next= externo no debe sacar al usuario del sitio.
function nextPath(): string {
  const next = route.query.next
  return typeof next === 'string' && next.startsWith('/admin') ? next : '/admin'
}

async function submit() {
  error.value = ''
  loading.value = true
  try {
    const user = await userStore.login(email.value.trim(), password.value)
    if (user.accountType !== 'admin') {
      userStore.clear()
      error.value = 'Esta cuenta no tiene acceso al panel. Si eres cliente, ingresa al Portal.'
      return
    }
    toast.success(`Hola, ${user.name || user.email}`)
    router.replace(nextPath())
  } catch (e) {
    error.value = (e as ApiError).message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="login">
    <BrandMark class="login__brand" />

    <form class="login__card" @submit.prevent="submit">
      <p class="login__eyebrow">Panel interno</p>
      <h1 class="login__title">Ingresar al panel</h1>
      <p class="login__lead">Blog, soluciones del sitio y solicitudes de clientes.</p>

      <div>
        <label for="email">Correo</label>
        <input id="email" v-model="email" type="email" autocomplete="username" required />
      </div>

      <div>
        <label for="password">Contraseña</label>
        <div class="login__password">
          <input
            id="password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="current-password"
            required
          />
          <button
            type="button"
            class="login__eye"
            :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
            @click="showPassword = !showPassword"
          >
            <i :class="showPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'"></i>
          </button>
        </div>
      </div>

      <Transition name="rise">
        <p v-if="error" class="login__error" role="alert">
          <i class="fa-solid fa-circle-exclamation"></i> {{ error }}
        </p>
      </Transition>

      <button class="btn btn--primary login__submit" type="submit" :disabled="loading">
        <i v-if="loading" class="fa-solid fa-spinner fa-spin"></i>
        {{ loading ? 'Ingresando…' : 'Ingresar' }}
      </button>
    </form>

    <p class="login__note">
      Este acceso es solo para el equipo de {{ site.name }}. ¿Eres cliente?
      <a :href="site.portalUrl" target="_blank" rel="noopener">Ingresa al Portal de Clientes</a>.
    </p>
    <RouterLink to="/" class="login__back"
      ><i class="fa-solid fa-arrow-left"></i> Volver al sitio</RouterLink
    >
  </section>
</template>

<style scoped lang="scss">
.login {
  @include flex(column, stretch, flex-start, 1.25rem);
  width: 100%;
  max-width: 420px;

  &__brand {
    align-self: center;
    font-size: 1.05rem;
  }

  &__card {
    @include card;
    @include flex(column, stretch, flex-start, 1rem);
    padding: 1.6rem 1.25rem;
    box-shadow: $shadow-sm;

    @include from('sm') {
      padding: 2.2rem 2rem;
    }
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($text-xl, 700);
  }

  &__lead {
    margin-top: -0.6rem;
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__password {
    position: relative;

    input {
      padding-right: 3rem;
    }
  }

  &__eye {
    position: absolute;
    top: 50%;
    right: 0.25rem;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    border-radius: $radius-sm;
    color: $ink-muted;

    &:hover {
      color: $ink;
    }
  }

  &__error {
    @include flex(row, flex-start, flex-start, 0.5rem);
    font-size: $text-sm;
    color: $danger;
    background: $danger-bg;
    padding: 0.7rem 0.9rem;
    border-radius: $radius-sm;

    i {
      margin-top: 0.3em;
    }
  }

  &__submit {
    margin-top: 0.3rem;
  }

  &__note {
    font-size: $text-xs;
    color: $ink-muted;
    text-align: center;

    a {
      color: $accent-deep;
      font-weight: 600;
      text-decoration: underline;
    }
  }

  &__back {
    align-self: center;
    font-size: $text-sm;
    color: $ink-soft;

    &:hover {
      color: $ink;
    }
  }
}
</style>
