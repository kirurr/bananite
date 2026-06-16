<script setup lang="ts">
import { ref } from 'vue';
import { useElectron, useMods } from './composables/mod';

const { isElectron } = useElectron();
const { mods, loading, error, add, toggle, remove } = useMods();

const name = ref('');

async function submit() {
  await add(name.value);
  name.value = '';
}
</script>

<template>
  <main>
    <h1>Minecraft Mods Manager</h1>

    <p
      v-if="!isElectron"
      class="warn"
    >
      Not running in Electron — the database API is unavailable.
    </p>

    <form
      class="add"
      @submit.prevent="submit"
    >
      <input
        v-model="name"
        placeholder="Mod name"
      >
      <button
        type="submit"
        :disabled="loading"
      >
        Add
      </button>
    </form>

    <p
      v-if="error"
      class="error"
    >
      {{ error }}
    </p>

    <p
      v-else-if="mods.length === 0"
      class="empty"
    >
      No mods yet — add one above.
    </p>

    <ul
      v-else
      class="mods"
    >
      <li
        v-for="mod in mods"
        :key="mod.id"
      >
        <label>
          <input
            type="checkbox"
            :checked="mod.enabled"
            @change="toggle(mod)"
          >
          <span :class="{ disabled: !mod.enabled }">{{ mod.name }}</span>
        </label>
        <button
          class="remove"
          @click="remove(mod)"
        >
          ✕
        </button>
      </li>
    </ul>
  </main>
</template>

<style scoped>
main {
  font-family: system-ui, sans-serif;
  max-width: 480px;
  margin: 0 auto;
  padding: 2rem;
}
.add {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.add input {
  flex: 1;
  padding: 0.4rem 0.6rem;
}
.warn {
  color: #b45309;
  background: #fffbeb;
  border: 1px solid #fde68a;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
}
.error {
  color: #c00;
}
.empty {
  color: #888;
}
.mods {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.mods li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.4rem 0.6rem;
  border: 1px solid #ddd;
  border-radius: 6px;
}
.mods label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.disabled {
  text-decoration: line-through;
  color: #aaa;
}
.remove {
  border: none;
  background: none;
  cursor: pointer;
  color: #c00;
}
</style>
