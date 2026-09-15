<script setup lang="ts">
import type { ProfileFilledMod } from '../../../profile/schema';
import { useSystem } from '../../composables/system';
import Button from '../volt/Button.vue';
import DataTable from '../volt/DataTable.vue';
import Column from 'primevue/column';

defineProps<{
  profileMods: ProfileFilledMod[];
  handleRemoveModFromProfile: (modId: string) => Promise<void>;
}>();
const { openExternalLink } = useSystem();
</script>

<template>
  <template v-if="profileMods.length === 0"
    ><span class="block text-center text-text-muted">No mods</span></template
  >
  <template v-else>
    <DataTable :value="profileMods">
      <Column header="Title">
        <template #body="{ data }: { data: ProfileFilledMod }">
          <a href="#" class="link" @click="openExternalLink(data.url)">
            {{ data.info?.title }}
          </a>
        </template>
      </Column>
      <Column header="Version">
        <template #body="{ data }: { data: ProfileFilledMod }">
          {{ data.versions.find((v) => v.id === data.selectedVersionId)?.name }}
        </template>
      </Column>
      <Column>
        <template #body="{ data }: { data: ProfileFilledMod }">
          <Button label="Remove" @click="handleRemoveModFromProfile(data.id)" />
        </template>
      </Column>
    </DataTable>
  </template>
</template>
