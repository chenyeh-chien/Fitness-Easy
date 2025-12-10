import { ref, watchEffect } from "vue";
import { useLocalStorage } from "@vueuse/core";

export const state = useLocalStorage("themeMode", JSON.stringify(false));

export function useOverflowHidden(element?: HTMLElement | null) {
  const hidden = ref(false);
  
  function setHidden(value: boolean) {
    hidden.value = value;
  }

  watchEffect(() => {
    const target = element || document.documentElement;

    if (hidden.value) {
      target.classList.add("overflow-hidden");
    } else {
      target.classList.remove("overflow-hidden");
    }
  });

  return [hidden, setHidden] as const;
}
