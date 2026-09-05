<script setup lang="ts">
import AppShell from './components/app/AppShell.vue';
import AsideMenu from './components/app/AsideMenu.vue';
import { useAppState } from './composables/appState';
import ProfilesScreen from './components/screens/ProfilesScreen.vue';
import ModsScreen from './components/screens/ModsScreen.vue';
import SettingsScreen from './components/screens/SettingsScreen.vue';
import Toast from './components/volt/Toast.vue';

const { currentScreen } = useAppState();
</script>

<template>
  <AppShell>
    <AsideMenu />
    <main class="min-h-0 w-full overflow-y-auto p-4">
      <template v-if="currentScreen === 'profiles'">
        <ProfilesScreen />
      </template>
      <template v-if="currentScreen === 'mods'">
        <ModsScreen />
      </template>
      <template v-if="currentScreen === 'settings'">
        <SettingsScreen />
      </template>
    </main>
  </AppShell>
  <Toast />
</template>
