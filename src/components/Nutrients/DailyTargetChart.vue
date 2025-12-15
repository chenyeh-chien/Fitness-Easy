<script setup lang="ts">
import { toRefs, ref, computed } from 'vue'
import CanvasChart from '@/components/Utils/chart/CanvasChart.vue'
import { useRerenderWithLocalStorage } from '@/composables/index'

interface Props {
  dailyTarget: any[];
}

const props = defineProps<Props>();
const { dailyTarget } = toRefs(props);
const showComponent = ref(true);
useRerenderWithLocalStorage(showComponent);
const chartData = computed(() => {
  return dailyTarget.value.map((target) => {
    return {
      x: new Date(target.date).getTime(),
      y: target.total,
    }
  })
})
</script>

<template>
  <div class="flex justify-center items-center">
    <CanvasChart 
      v-if="showComponent"
      :chart-type="'area'"
      :title="'Daily Target'"
      :xaxis-info="{
        type: 'datetime',
        unit: 'day',
      }"
      :yaxis-info="{
        unit: 'kcal',
      }"
      :dataset="[{
        label: 'Total',
        data: chartData,
        borderColor: '#FF0000',
        backgroundColor: '#FF0000',
        barThickness: 2,
      }]"
      :round-to="0" 
      :display-legend="false"/>
  </div>
</template>