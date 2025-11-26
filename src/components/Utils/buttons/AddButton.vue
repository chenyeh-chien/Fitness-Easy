<script setup lang="ts">
import { toRefs } from 'vue';
import CommonButton from './CommonButton.vue'

interface Props {
  buttonType?: "submit" | "button" | "reset"; 
}

const props = withDefaults(defineProps<Props>(), {
  buttonType: "button",
})
const { buttonType } = toRefs(props);
</script>

<template>
  <CommonButton 
    :button-type="buttonType"
    :icon="'fa-solid fa-plus'"
    :text="'Add'"/>
</template>