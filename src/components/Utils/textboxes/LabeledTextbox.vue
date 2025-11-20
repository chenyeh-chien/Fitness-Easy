<script setup lang="ts">
import { toRefs } from 'vue';
import CommonTextbox from './CommonTextbox.vue';

interface Props {
  label?: string;
  name: string;
}

const props = withDefaults(defineProps<Props>(), {
  label: "Label"
})
const { label } = toRefs(props);
</script>

<template>
  <div class="flex flex-col gap-1 text-white text-xs">
    <label 
      :for="name">{{ label }}</label>
    <CommonTextbox 
      :name="name"/>
  </div>
</template>