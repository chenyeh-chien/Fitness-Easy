<script setup lang="ts">
import { toRefs } from 'vue'
import { clsx } from 'clsx'
import CommonTextbox from './CommonTextbox.vue'

interface Props {
  name?: string;
  label?: string;
  width?: string;
  readonly?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  label: "Label",
  name: "Default",
})
const { name, label, width, readonly } = toRefs(props);
const text = defineModel<string | number>("text", { required: true });
</script>

<template>
  <div 
    :class="clsx(
      'flex flex-col gap-1 text-(--textbox-label-color) text-xs',
    )">
    <label 
      :for="name">{{ label }}</label>
    <CommonTextbox 
      v-model:text="text"
      :name="name"
      :width="width"
      :readonly="readonly"/>
  </div>
</template>