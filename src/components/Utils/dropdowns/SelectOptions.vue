<script setup lang="ts">
import { toRefs } from "vue"
import { clsx } from "clsx"

interface Props {
  minWidth?: string;
  isOpened: boolean;
  options: string[];
  selectedValue: string | number;
  textAlign?: "left" | "center" | "right";
}

interface Emits {
  (e: "onClickDropdown", option: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  textAlign: "left"
});
const { minWidth, isOpened, options, selectedValue, textAlign } = toRefs(props);
const emits = defineEmits<Emits>();
</script>

<template>
  <ul
    :class="clsx(
      'bg-(--dropdown-bg) rounded-md text-xs text-(--dropdown-color)',
      'flex flex-col shadow-(--dropdown-box-shadow)',
      'overflow-y-auto scrollbar-thin',
      !isOpened && 'hidden'
    )"
    :style="`min-width: ${minWidth};`">
    <li 
      v-for="option in options"
      tabindex="0"
      :class="clsx(
        `px-3 py-1.5 text-${textAlign}`,
        'hover:bg-(--dropdown-hover-bg)',
        'focus:outline-none',
        option === selectedValue && 'bg-(--dropdown-hover-bg)',
        
      )"
      @click="emits('onClickDropdown', option)">
      {{ option }}
    </li>
  </ul>
</template>
