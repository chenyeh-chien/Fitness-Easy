<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue"
import { clsx } from "clsx";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import { state } from "../Utils/hooks"

const offset = ref(false);

const roundStyle = computed(() => {
  return offset.value ? "" : "left: 1.55rem;"
})

onMounted(() => {
  if (localStorage.getItem("themeMode") != null) {
    const themeMode = localStorage.getItem("themeMode");
    if (typeof themeMode === "string") {
        offset.value = JSON.parse(themeMode);
    }
  }
})

const changeMode = () => {
  offset.value = !offset.value;
  state.value = JSON.stringify(offset.value);
}

watch(
  offset, 
  (newValue) => {
      document.documentElement.className = newValue ? "" : "dark";
  },
  { immediate: true }
)
</script>

<template>
  <button
    :class="clsx(
      'relative w-12 h-6 rounded-3xl duration-500',
      'bg-(--navbar-mode-button-bg) border border-(--navbar-mode-button-border-color)',
      'hover:cursor-pointer hover:border-(--navbar-mode-button-hover-border-color)'
    )" 
    @click="changeMode()">
    <div 
      :style="roundStyle"
      :class="clsx(
        'absolute top-px left-px w-5 h-5 rounded-full',
        'flex justify-center items-center text-sm duration-500',
        'text-(--navbar-mode-button-icon-color) bg-(--navbar-mode-button-round-bg)'
      )">
      <FontAwesomeIcon 
        v-if="offset" 
        data-test="mode-button__sun"
        :icon="['far', 'sun']" />
      <FontAwesomeIcon 
        v-else 
        class="dark-mode" 
        data-test="mode-button__moon"
        :icon="['far', 'moon']" />
    </div>
  </button>
</template>