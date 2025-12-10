<script setup lang="ts">
import { toRefs, computed } from 'vue'
import { clsx } from 'clsx'

interface Props {
  name?: string;
  width?: string;
  readonly?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  name: "Default",
  readonly: false,
})
const { name, width, readonly } = toRefs(props);
const text = defineModel<string | number>("text", { required: true });

const computedWidth = computed(() => {
  if (width.value === undefined) return "";

  return `width: ${width.value}`;
})
</script>

<template>
  <input 
    v-model="text"
    :class="clsx(
      'bg-(--textbox-bg) rounded-md outline-none px-3 py-1.5',
      'text-base text-(--textbox-color) md:w-70',
      'focus:shadow-(--textbox-box-shadow) read-only:bg-(--textbox-readonly-bg)',
    )"
    :style="computedWidth"
    :name="name"
    :readonly="readonly"/>
</template>