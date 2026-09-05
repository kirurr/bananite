<script setup lang="ts">
import { ref } from 'vue';
import { useMods } from '../../composables/mod';
import InputText from '../volt/InputText.vue';
import Button from '../volt/Button.vue';
import ModCard from '../mods/ModCard.vue';
import { handleErrorToast, TOAST_TIMEOUT_MS } from '../../composables/toast';
import { useToast } from 'primevue/usetoast';

const { mods, addModByLink } = useMods();

const input = ref('');

const toast = useToast();

async function handleAddByLink() {
  try {
    await addModByLink(input.value);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Mod added',
      life: TOAST_TIMEOUT_MS,
    });
  } catch (e) {
    handleErrorToast(toast, e);
  } finally {
    input.value = '';
  }
}
</script>

<template>
  <section class="flex h-full min-h-0 flex-col gap-4">
    <div class="flex flex-row items-center gap-4">
      <InputText
        id="mod-link"
        v-model="input"
        class="flex-1"
        placeholder="https://modrinth.com/mod/mod-name"
      />
      <Button @click="handleAddByLink">Add by link</Button>
    </div>
    <div class="grid min-h-0 flex-1 grid-cols-3 content-start gap-4 overflow-y-auto">
      <ModCard v-for="mod in mods" :key="mod.id" :mod="mod" />
    </div>
  </section>
</template>
