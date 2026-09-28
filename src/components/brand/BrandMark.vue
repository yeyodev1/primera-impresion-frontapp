<script setup lang="ts">
import { site } from '@/config/site'
import logoColor from '@/assets/brand/logo-color.svg'
import logoLight from '@/assets/brand/logo-light.svg'

// Logo oficial de Primera Impresión, con los trazos exactos del manual de marca
// (versión horizontal con eslogan). `light` es la variante del manual para
// fondos de color: mismo isotipo y eslogan en naranja, logotipo en blanco.
withDefaults(defineProps<{ tone?: 'dark' | 'light' }>(), { tone: 'dark' })
</script>

<template>
  <img
    class="brand"
    :src="tone === 'light' ? logoLight : logoColor"
    :alt="site.name"
    width="478"
    height="165"
  />
</template>

<style scoped lang="scss">
// Alto base de 3.2em: el tamaño se controla con el font-size del contenedor.
.brand {
  display: block;
  height: 3.2em;
  width: auto;
}
</style>
