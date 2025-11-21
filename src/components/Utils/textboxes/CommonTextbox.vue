<script setup lang="ts">
import { clsx } from 'clsx';
import { toRefs } from 'vue';

interface Props {
  name?: string;
}

const props = withDefaults(defineProps<Props>(), {
  name: "Default Name"
})
const { name } = toRefs(props);
</script>

<template>
  <input 
    :class="clsx(
      'bg-(--textbox-bg) rounded-md outline-none text-xs px-3 py-1.5',
      'text-(--textbox-color) md:w-70',
      'focus:shadow-(--textbox-box-shadow)'
    )"
    :name="name"/>
</template>