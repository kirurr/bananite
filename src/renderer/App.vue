<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0);
</script>

<template>
  <main>
    <h1>💖 Minecraft Mods Manager</h1>
    <p>Vue {{ count }}</p>
    <button @click="count++">
      Click me
    </button>
  </main>
</template>

<style scoped>
main {
  font-family: system-ui, sans-serif;
  text-align: center;
  padding: 2rem;
}
</style>
