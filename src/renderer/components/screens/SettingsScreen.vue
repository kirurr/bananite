<script setup lang="ts">
import { useGame } from '../../composables/game';
import SettingsForm from '../settings/SettingsForm.vue';

const { versions, loaders } = useGame();
</script>

<template>
  <div class="space-y-4">
    <SettingsForm />
    <div>
      <p v-if="versions.length > 0">Versions loaded: {{ versions.length }}</p>
      <p v-else>No versions loaded</p>
      <p v-if="loaders.length > 0">Loaders loaded: {{ loaders.length }}</p>
      <p v-else>No loaders loaded</p>
    </div>
  </div>
</template>
