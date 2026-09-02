<script setup lang="ts">
import type { FilledMod } from '../../../mod/schema';
import { useSystem } from '../../composables/system';

defineProps<{
  mod: FilledMod;
}>();

const { openExternalLink } = useSystem();
</script>

<template>
  <div class="relative z-0 rounded-xl bg-surface-900 p-5 shadow-md">
    <div class="absolute top-4 right-4 -z-10">
      <img height="64" width="64" :src="mod.info?.iconUrl ?? ''" alt="Mod icon" />
      <div class="absolute top-0 left-0 size-full bg-surface-900/70"></div>
    </div>
    <div class="flex size-full flex-col gap-4">
      <h2 class="text-2xl font-bold">
        <a href="#" class="link" @click="openExternalLink(mod.url)">
          {{ mod.info?.title }}
        </a>
      </h2>
      <div>
        {{ mod.info?.description }}
      </div>
    </div>
  </div>
</template>
