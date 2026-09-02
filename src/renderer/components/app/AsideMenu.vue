<script setup lang="ts">
import { useAppState } from '../../composables/appState';
import Button from '../volt/Button.vue';

const { screens, currentScreen, setCurrentScreen } = useAppState();
</script>

<template>
  <aside class="h-full border-r-2 border-surface-800 px-2">
    <ul class="space-y-2">
      <li v-for="screen in screens" :key="screen">
        <Button
          class="w-full"
          :disabled="screen === currentScreen"
          :label="screen"
          @click="setCurrentScreen(screen)"
        />
      </li>
    </ul>
  </aside>
</template>
