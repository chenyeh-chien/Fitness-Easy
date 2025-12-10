<script setup lang="ts">
import { clsx } from 'clsx'
import type { TableHeader } from '@/types/common';

interface Props {
  headers: TableHeader[];
}

const props = defineProps<Props>();
</script>

<template>
  <tbody>
    <tr>
      <td 
        v-for="i in headers.length">
        <div 
          :class="clsx(
            'bg-(--table-data-shimmer-bg) animate-pulse text-transparent',
            'w-full h-24'
          )">
        </div>
      </td>
    </tr>
  </tbody>
</template> 