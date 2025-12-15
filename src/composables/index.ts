import { useLocalStorage } from "@vueuse/core";
import { nextTick, watch, ref } from "vue";
import type { Ref } from "vue";

export const state = useLocalStorage("themeMode", JSON.stringify(false));
export const useRerender = (offset: Ref<boolean>, watchedState: any) => {
  const rerenderComponent = async () => {
    offset.value = false;
    await nextTick();
    offset.value = true;
  }

  watch(
    watchedState,
    async () => {
      await rerenderComponent();
    },
    { deep: true }
  )
}

export const useRerenderWithLocalStorage = (offset: Ref<boolean>) => {
  useRerender(offset, state);
}

export const useIsLoading = () => {
  const loadingEffect = async (
    callback: () => Promise<void>
  ) => {
    isLoading.value = true;
    await callback();
    isLoading.value = false;
  }

  const isLoading = ref(false);

  return {
    isLoading,
    loadingEffect,
  }
}