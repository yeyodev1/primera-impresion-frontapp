<script setup lang="ts">
import StatusPill from './StatusPill.vue'
import {
  LEAD_STATUS,
  LEAD_STATUS_TONE,
  LEAD_TYPE,
  formatDateTime,
} from '@/composables/admin/adminCopy'
import type { Lead } from '@/types'

defineProps<{ lead: Lead; compact?: boolean }>()
const emit = defineEmits<{ open: [lead: Lead] }>()
</script>

<template>
  <button
    type="button"
    class="lead"
    :class="{ 'lead--new': lead.status === 'new', 'lead--compact': compact }"
    @click="emit('open', lead)"
  >
    <span class="lead__top">
      <span class="lead__who">
        <strong class="lead__name">{{ lead.name }}</strong>
        <span class="lead__company">{{ lead.company }}</span>
      </span>
      <StatusPill :label="LEAD_STATUS[lead.status]" :tone="LEAD_STATUS_TONE[lead.status]" />
    </span>
    <span v-if="!compact" class="lead__excerpt">
      {{ lead.type === 'access' ? lead.products : lead.message }}
    </span>
    <span class="lead__meta">
      <span>
        <i :class="lead.type === 'access' ? 'fa-solid fa-key' : 'fa-regular fa-envelope'"></i>
        {{ LEAD_TYPE[lead.type] }}
      </span>
      <span><i class="fa-regular fa-clock"></i> {{ formatDateTime(lead.createdAt) }}</span>
    </span>
  </button>
</template>

<style scoped lang="scss">
.lead {
  @include card;
  @include flex(column, stretch, flex-start, 0.55rem);
  width: 100%;
  text-align: left;
  padding: 1rem 1.1rem;
  border-left: 3px solid transparent;
  transition:
    border-color 0.25s $ease,
    box-shadow 0.25s $ease;

  &:hover {
    box-shadow: $shadow-sm;
    border-color: $ink-muted;
  }

  &--new {
    border-left-color: $accent;

    &:hover {
      border-left-color: $accent;
    }
  }

  &__top {
    @include flex(row, flex-start, space-between, 0.75rem);
  }

  &__who {
    @include flex(column, flex-start, flex-start);
    min-width: 0;
  }

  &__name {
    font-weight: 600;
    line-height: 1.3;
  }

  &__company {
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__excerpt {
    font-size: $text-sm;
    color: $ink-soft;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__meta {
    @include flex(row, center, flex-start, 1rem);
    flex-wrap: wrap;
    font-size: $text-xs;
    color: $ink-muted;

    i {
      margin-right: 0.25rem;
    }
  }
}
</style>
