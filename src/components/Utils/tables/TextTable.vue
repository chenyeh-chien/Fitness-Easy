<script setup lang="ts">
import { clsx } from 'clsx'
import { toRefs, watch } from 'vue';

interface Props {
  labels: string[];
  data: (string | number)[][];
}

const props = defineProps<Props>();
const { labels, data } = toRefs(props);

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
      'w-full overflow-x-auto scrollbar-thin',
    )">
    <table class="min-w-full max-w-max border-collapse">
      <thead class="text-(--table-label-color) text-xs pb-2 border-b">
        <tr>
          <th 
            v-for="label in labels"
            class="p-2 text-start font-medium"
            :key="label">
            {{ label }}
          </th>
        </tr>
      </thead>
      <tbody class="overflow-y-auto">
        <tr 
          v-for="(item, index) of data"
          :class="clsx(
            'text-(--table-data-color) text-xs px-2 py-4',
            'even:bg-(--table-data-bg)',
        
          )"
          :key="index">
          <td 
            v-for="val of item"
            class="px-2 py-4 whitespace-nowrap">
            {{ val }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
</style>