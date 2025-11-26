<script setup lang="ts">
import { clsx } from 'clsx'
import { toRefs } from 'vue';
import CommonSelect from './CommonSelect.vue'

interface Props {
  label?: string;
  name: string;
  value?: string;
  options?: string[];
}

interface Emits {
  (e: "onChangeValue", value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  label: "Label"
})
const { label } = toRefs(props);
const emits = defineEmits<Emits>();
</script>

<template>
  <div 
    :class="clsx(
      'flex flex-col gap-1 text-(--dropdown-label-color) text-xs',
    )">
    <label 
      :for="name">{{ label }}</label>
    <CommonSelect 
      :value="value"
      :options="options"
      @on-change-value="(val) => emits('onChangeValue', val)"/>
  </div>
</template>