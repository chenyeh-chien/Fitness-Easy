<script setup lang="ts">
import { toRefs, ref, computed } from 'vue'
import CanvasChart from '@/components/Utils/chart/CanvasChart.vue'
import { useRerenderWithLocalStorage } from '@/composables/index'

interface Props {
  dailyProgress: any[];
}

const props = defineProps<Props>();
const { dailyProgress } = toRefs(props);
const showComponent = ref(true);
useRerenderWithLocalStorage(showComponent);
const chartData = computed(() => {
  return dailyProgress.value.map((progress) => {
    return {
      x: new Date(progress.date).getTime(),
      y: progress.weight,
    }
  })
})
</script>

<template>
  <div class="flex justify-center items-center">
    <CanvasChart 
      v-if="showComponent"
      :chart-type="'area'"
      :title="'Body Progress'"
      :xaxis-info="{
        type: 'datetime',
        unit: 'day',
      }"
      :yaxis-info="{
        unit: 'kg',
      }"
      :dataset="[{
        label: 'Weight',
        data: chartData,
        borderColor: '#FF0000',
        backgroundColor: '#FF0000',
        barThickness: 2,
      }]"
      :round-to="1" 
      :display-legend="false"/>
  </div>
</template>