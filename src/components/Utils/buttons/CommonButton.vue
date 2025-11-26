<script setup lang="ts">
import { toRefs } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { clsx } from 'clsx' 

interface Props {
  buttonType?: "submit" | "button" | "reset";
  icon?: string;
  text?: string;
}

const props = withDefaults(defineProps<Props>(), {
  buttonType: "button",
  text: "Default",
});
const { buttonType, icon, text } = toRefs(props);
</script>

<template>
  <button 
    :class="clsx(
      'text-(--button-color) text-xs bg-(--button-bg) w-max px-5 py-1.5',
      'border border-(--button-border) rounded-md',
      'flex gap-2 shadow-(--button-box-shadow)',
      'hover:cursor-pointer hover:bg-(--button-hover-bg)',
      'focus:shadow-(--button-focus-box-shadow) focus:outline-none'
    )"
    :type="buttonType">
    <div v-if="icon !== undefined" >
      <FontAwesomeIcon 
        :icon="icon" />
    </div>
    <div>
      <span>{{ text }}</span>
    </div>
  </button>
</template>