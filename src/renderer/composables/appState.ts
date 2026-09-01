import { ref } from 'vue';

const screens = ['home', 'settings', 'profiles', 'mods'] as const;
type Screens = (typeof screens)[number];

const currentScreen = ref<Screens>('home');

function setCurrentScreen(screen: Screens) {
  currentScreen.value = screen;
}

export function useAppState() {
  return {
    screens,
    currentScreen,
    setCurrentScreen,
  };
}
