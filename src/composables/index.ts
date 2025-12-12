import { useLocalStorage } from "@vueuse/core";
import { nextTick, watch } from "vue";
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