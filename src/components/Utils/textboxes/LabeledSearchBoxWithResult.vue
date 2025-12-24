<script setup lang="ts">
import { toRefs } from 'vue'
import LabelContainer from '../Labels/LabelContainer.vue'
import SearchBoxWithResult from './SearchBoxWithResult.vue'

interface Props {
  name?: string;
  label?: string;
  results?: string[];
}

interface Emits {
  (e: 'onChangeValue', value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  label: "Label",
  name: "Default",
  results: () => []
})
const { name, label } = toRefs(props);
const emits = defineEmits<Emits>();
const text = defineModel<string>("text", { required: true });
</script>

<template>
  <LabelContainer 
    :name="name"
    :label="label">
    <SearchBoxWithResult
      v-model:text="text"
      :results="results"
      @on-change-value="emits('onChangeValue', $event)"/>
  </LabelContainer>
</template>