<script setup lang="ts">
import { ref } from 'vue';
import { useGame } from './composables/game';
import { useMods } from './composables/mod';
import SettingsForm from './components/SettingsForm.vue';
import DownloadMod from './components/DownloadMod.vue';
import ProfilesTab from './components/ProfilesTab.vue';

const { versions, loaders, syncData, settings, setSettings } = useGame();
const { mods, addModByLink, downloadMod } = useMods();

const tab = ref<'data' | 'mods' | 'profiles'>('mods');
const input = ref('');
</script>

<template>
  <div>
    <div class="flex flex-row gap-4">
      <button @click="tab = 'mods'">Mods</button>
      <button @click="tab = 'data'">Data</button>
      <button @click="tab = 'profiles'">Profiles</button>
    </div>
  </div>
	<template v-if="tab === 'profiles'">
		<ProfilesTab />
	</template>
  <template v-if="tab === 'mods'">
    <DownloadMod
      :handle-download="downloadMod"
      :mods="mods"
      :versions="versions"
      :loaders="loaders"
    />
    <div class="flex flex-col gap-2">
      <input v-model="input" type="text" placeholder="https://modrinth.com/mod/mod-name" />
      <button @click="addModByLink(input)">Add by link</button>
    </div>
    <div>
      <ul class="max-h-75 w-full overflow-y-auto">
        <li v-for="mod in mods" :key="mod.id" class="flex flex-col gap-2">
          <div>
            {{ mod.rawName }}
          </div>
          <div class="flex flex-row overflow-x-auto">
            <span v-for="version in mod.versions" :key="version.id" class="mx-2 block text-nowrap">
              {{ version.name }}
            </span>
          </div>
        </li>
      </ul>
    </div>
  </template>
  <template v-if="tab === 'data'">
    <SettingsForm
      :settings="settings"
      :set-settings="setSettings"
    />
    <div>
      <div class="flex flex-row gap-4">
        <button @click="syncData">Sync Data</button>
      </div>
      <div class="flex flex-row gap-4">
        <ul class="max-h-75 w-full overflow-y-auto">
          <li v-for="version in versions" :key="version.version">
            {{ version.version }}
          </li>
        </ul>
        <ul class="max-h-75 w-full overflow-y-auto">
          <li v-for="loader in loaders" :key="loader.name" class="flex flex-row items-center gap-4">
            {{ loader.name }}
            <div class="h-4 w-4" v-html="loader.icon"></div>
          </li>
        </ul>
      </div>
    </div>
  </template>
</template>
