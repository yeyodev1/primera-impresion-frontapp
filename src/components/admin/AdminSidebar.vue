<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import BrandMark from '@/components/brand/BrandMark.vue'
import { ADMIN_NAV } from '@/composables/admin/adminCopy'
import { useAdminStats } from '@/composables/admin/useAdminStats'
import { useUserStore } from '@/stores/user'

defineProps<{ drawer?: boolean }>()
const emit = defineEmits<{ navigate: []; logout: [] }>()

const route = useRoute()
const userStore = useUserStore()
const { stats } = useAdminStats()

const newLeads = computed(() => stats.value?.leads.new ?? 0)

// "Panel" solo se marca en /admin exacto; el resto también en sus subrutas.
function isActive(to: string, exact?: boolean) {
  return exact ? route.path === to : route.path === to || route.path.startsWith(`${to}/`)
}
</script>

<template>
  <nav class="side" :class="{ 'side--drawer': drawer }" aria-label="Menú del panel">
    <RouterLink to="/admin" class="side__brand" @click="emit('navigate')">
      <BrandMark tone="light" />
      <span class="side__tag">Panel interno</span>
    </RouterLink>

    <ul class="side__nav">
      <li v-for="item in ADMIN_NAV" :key="item.to">
        <RouterLink
          :to="item.to"
          class="side__link"
          :class="{ 'side__link--active': isActive(item.to, 'exact' in item) }"
          @click="emit('navigate')"
        >
          <i :class="item.icon" aria-hidden="true"></i>
          <span>{{ item.label }}</span>
          <span
            v-if="'badge' in item && newLeads > 0"
            class="side__badge"
            :aria-label="`${newLeads} solicitudes nuevas`"
          >
            {{ newLeads }}
          </span>
        </RouterLink>
      </li>
    </ul>

    <div class="side__foot">
      <a href="/" target="_blank" rel="noopener" class="side__link">
        <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
        <span>Ver sitio</span>
      </a>
      <div v-if="userStore.user" class="side__user">
        <span class="side__avatar" aria-hidden="true">
          {{ (userStore.user.name || userStore.user.email).charAt(0).toUpperCase() }}
        </span>
        <span class="side__who">
          <strong>{{ userStore.user.name || 'Administrador' }}</strong>
          <small>{{ userStore.user.email }}</small>
        </span>
      </div>
      <button type="button" class="side__link side__logout" @click="emit('logout')">
        <i class="fa-solid fa-right-from-bracket" aria-hidden="true"></i>
        <span>Cerrar sesión</span>
      </button>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.side {
  @include flex(column, stretch, flex-start, 1.5rem);
  height: 100%;
  padding: 1.4rem 1rem;
  background: $night;
  color: rgba($surface, 0.78);
  overflow-y: auto;

  &__brand {
    @include flex(column, flex-start, flex-start, 0.6rem);
    padding: 0 0.6rem;
    font-size: 0.9rem;
  }

  &__tag {
    font-size: $text-xs;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba($surface, 0.45);
  }

  &__nav {
    @include flex(column, stretch, flex-start, 0.2rem);
    list-style: none;
    flex: 1;
  }

  &__link {
    @include flex(row, center, flex-start, 0.8rem);
    width: 100%;
    min-height: 44px;
    padding: 0 0.8rem;
    border-radius: $radius-sm;
    font-size: $text-sm;
    font-weight: 500;
    text-align: left;
    color: inherit;
    transition:
      background 0.25s $ease,
      color 0.25s $ease;

    i {
      width: 1.1rem;
      text-align: center;
      color: rgba($surface, 0.5);
    }

    &:hover {
      background: $night-soft;
      color: $surface;
    }

    &--active {
      background: $night-soft;
      color: $surface;
      box-shadow: inset 3px 0 0 $accent;

      i {
        color: $accent;
      }
    }
  }

  &__badge {
    margin-left: auto;
    min-width: 22px;
    height: 22px;
    padding: 0 0.4rem;
    border-radius: $radius-pill;
    background: $accent;
    color: $surface;
    font-size: 0.72rem;
    font-weight: 700;
    line-height: 22px;
    text-align: center;
  }

  &__foot {
    @include flex(column, stretch, flex-start, 0.2rem);
    padding-top: 1rem;
    border-top: 1px solid rgba($surface, 0.1);
  }

  &__user {
    @include flex(row, center, flex-start, 0.7rem);
    padding: 0.7rem 0.8rem;
    min-width: 0;
  }

  &__avatar {
    @include flex(row, center, center);
    width: 34px;
    height: 34px;
    flex-shrink: 0;
    border-radius: 50%;
    background: $night-soft;
    color: $surface;
    font-weight: 700;
    font-size: 0.85rem;
  }

  &__who {
    @include flex(column, flex-start, flex-start);
    min-width: 0;
    line-height: 1.3;

    strong {
      font-size: $text-sm;
      color: $surface;
      font-weight: 600;
    }

    small {
      max-width: 100%;
      font-size: $text-xs;
      color: rgba($surface, 0.5);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  &__logout:hover i {
    color: $accent;
  }
}
</style>
