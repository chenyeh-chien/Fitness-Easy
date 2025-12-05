<script setup lang="ts">
import { clsx } from 'clsx'
import { toRefs, watch } from 'vue';
import type { TableHeader } from '@/types/common';

interface Props {
  headers: TableHeader[];
  data: Record<string, any>[];
  clickable?: boolean;
  displayedDataCnt?: number;
}

interface Emits {
  (e: 'selectRow', index: number): void;
}

const props = withDefaults(defineProps<Props>(), {
  clickable: false,
  displayedDataCnt: 10,
});
const { headers, data, clickable, displayedDataCnt } = toRefs(props);
const emits = defineEmits<Emits>();

watch(
  data,
  () => {
    console.log(data.value)
  }
)
</script>

<template>
  <div 
    :class="clsx(
      'w-full overflow-x-auto scrollbar-thin'
    )">
    <table class="min-w-full max-w-max border-collapse">
      <thead class="text-(--table-label-color) text-xs pb-2 border-b">
        <tr>
          <th 
            v-for="header in headers"
            class="p-2 text-start font-medium"
            :key="header.key">
            {{ header.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="(item, index) of data"
          :class="clsx(
            'text-(--table-data-color) text-xs px-2 py-4',
            'even:bg-(--table-data-bg)',
            clickable && 'hover:bg-(--table-data-hover-bg) hover:cursor-pointer',
          )"
          :key="index"
          @click="clickable && emits('selectRow', index)">
          <td 
            v-for="header in headers"
            class="px-2 py-4 whitespace-nowrap">
            {{ item[header.key] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
</style>