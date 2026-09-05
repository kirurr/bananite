<script setup lang="ts">
import type { FilledMod } from '../../../mod/schema';
import { useSystem } from '../../composables/system';
import Button from '../volt/Button.vue';
import DataTable from '../volt/DataTable.vue';
import Column from 'primevue/column';

defineProps<{
  mods: FilledMod[];
  handleRemoveModFromProfile: (modId: string) => Promise<void>;
}>();

const { openExternalLink } = useSystem();
</script>

<template>
  <template v-if="mods.length === 0"
    ><span class="block text-center text-text-muted">No mods</span></template
  >
  <template v-else>
    <DataTable :value="mods">
      <Column header="Title">
        <template #body="{ data }: { data: FilledMod }">
          <a href="#" class="link" @click="openExternalLink(data.url)">
            {{ data.info?.title }}
          </a>
        </template>
      </Column>
      <Column>
        <template #body="{ data }: { data: FilledMod }">
          <Button label="Remove" @click="handleRemoveModFromProfile(data.id)" />
        </template>
      </Column>
    </DataTable>
  </template>
</template>
