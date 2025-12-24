<script setup lang="ts">
import { toRefs } from 'vue'
import { clsx } from 'clsx'

interface Props {
  name?: string;
  label?: string;
}

const props = withDefaults(defineProps<Props>(), {
  label: "Label",
  name: "Default",
})
const { name, label } = toRefs(props);
</script>

<template>
  <div 
    :class="clsx(
      'flex flex-col gap-1 text-(--label-color) text-xs',
    )">
    <label 
      :for="name">{{ label }}</label>
    <slot></slot>
  </div>
</template>