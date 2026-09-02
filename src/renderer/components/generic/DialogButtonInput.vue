<script setup lang="ts">
import type { ButtonHTMLAttributes } from 'vue';

interface Props extends /* @vue-ignore */ ButtonHTMLAttributes {
  value: string | undefined;
  placeholder: string;
}

const props = defineProps<Props>();
</script>
<template>
  <button
    v-bind="$attrs"
    class="block appearance-none rounded-md border bg-surface-950 px-3 py-2 shadow-[0_1px_2px_0_rgba(18,18,23,0.05)] outline-hidden transition-colors duration-200 enabled:hover:border-surface-400 enabled:focus:border-primary dark:border-surface-700 dark:enabled:hover:border-surface-600"
  >
    {{ props.value }}
    <span v-if="!props.value" class="text-surface-400">{{ props.placeholder }}</span>
  </button>
</template>
