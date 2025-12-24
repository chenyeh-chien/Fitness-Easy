<script setup lang="ts">
import { toRefs } from 'vue';
import LabelContainer from '../Labels/LabelContainer.vue'
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
  <LabelContainer 
    :name="name"
    :label="label">
    <CommonSelect 
      :value="value"
      :options="options"
      @on-change-value="(val) => emits('onChangeValue', val)"/>
  </LabelContainer>
</template>