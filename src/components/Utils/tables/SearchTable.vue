<script setup lang="ts">
import { toRefs, ref, computed } from 'vue'
import SearchBox from '@/components/Utils/textboxes/SearchBox.vue'
import TextTable from '@/components/Utils/tables/TextTable.vue'
import type { TableHeader } from '@/types/common';

interface Props {
  headers: TableHeader[];
  data: Record<string, any>[];
  clickable?: boolean;
  displayedDataCnt?: number;
  isLoading?: boolean;
}

interface Emits {
  (e: 'selectRecord', data: Record<string, any>): void
}

const props = defineProps<Props>();
const { 
  headers, 
  data, 
  clickable, 
  displayedDataCnt, 
  isLoading 
} = toRefs(props);
const emits = defineEmits<Emits>();
const text = ref('');

const filteredData = computed(() => {
  if (text.value === '') return data.value;

  return data.value.filter((item: Record<string, any>) => {
    return JSON.stringify(item)
      .toLowerCase()
      .includes(text.value.toLowerCase());
  });
})

function handleSelectRow(index: number) {
  const data = filteredData.value[index];
  if (data === undefined) return;

  emits('selectRecord', data);
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <SearchBox v-model:text="text"/>
    <TextTable 
      :headers="headers"
      :data="filteredData"
      :clickable="clickable"
      :displayed-data-cnt="displayedDataCnt"
      :is-loading="isLoading"
      @select-row="handleSelectRow"/>
  </div>
</template>