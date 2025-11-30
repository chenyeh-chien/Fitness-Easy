<script setup lang="ts">
import { toRefs } from 'vue';
import CommonButton from './CommonButton.vue'

interface Props {
  text?: string;
  buttonType?: "submit" | "button" | "reset"; 
}

const props = withDefaults(defineProps<Props>(), {
  text: "Confirm",
  buttonType: "button",
})
const { buttonType } = toRefs(props);
</script>

<template>
  <CommonButton 
    :button-type="buttonType"
    :icon="'fa-solid fa-check'"
    :text="text"/>
</template>