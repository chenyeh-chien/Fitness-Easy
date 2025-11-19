import { useLocalStorage } from "@vueuse/core";

export const state = useLocalStorage("themeMode", JSON.stringify(false));