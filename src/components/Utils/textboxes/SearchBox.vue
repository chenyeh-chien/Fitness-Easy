<script setup lang="ts">
import { toRefs, ref, computed } from 'vue'
import { clsx } from 'clsx'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

interface Props {
  width?: string;
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Search here"
});
const { width, placeholder } = toRefs(props);
const searchBoxContainer = ref<HTMLElement | null>(null);
const searchBoxInput = ref<HTMLElement | null>(null);
const text = defineModel<string | number>("text", { required: true });

const containerStyle = computed(() => {
  if (width.value === undefined) return "";

  return `width: ${width.value}`;
})

defineExpose({
  searchBoxContainer,
  searchBoxInput
})
</script>

<template>
  <div 
    ref="searchBoxContainer"
    :class="clsx(
      'flex gap-1 px-3 py-1.5 text-base',
      'text-(--search-box-color) bg-(--search-box-bg) md:w-70',
      'rounded-md overflow-x-auto scrollbar-thin'
    )"
    :style="containerStyle">
    <slot></slot>
    <div class="w-full flex gap-2">
      <div class="text-(--search-box-placeholder-color)">
        <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" />
      </div>
      <div class="w-full">
        <input
          :class="clsx(
            'text-base w-full h-full bg-none border-none outline-none',
            'text-(--search-box-color)',
            'placeholder-(--search-box-placeholder-color)'
          )"
          type="text"
          ref="searchBoxInput"
          :placeholder="placeholder"
          v-model="text"/>
      </div>
    </div>
  </div>
</template>