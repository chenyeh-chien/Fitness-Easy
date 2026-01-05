<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import CanvasChart from '@/components/Utils/chart/CanvasChart.vue'
import { useAuth } from '@/composables/useAuth'
import { useRerenderWithLocalStorage } from '@/composables/index'
import { useDailyVolumeLoad } from '@/composables/useDailyVolumeLoad';
import { formatDateStr } from '@/components/Utils/utilFunctions';

const { user, isAuthReady } = useAuth();
const { 
  getVolumeLoadsByInterval 
} = useDailyVolumeLoad();
const showComponent = ref(true);
useRerenderWithLocalStorage(showComponent);
const startDate = ref<Date | null>(null);
const endDate = ref<Date | null>(null);
const targets = ref<any[]>([]);
const targetChartData = computed(() => {
  return targets.value.map((target) => {
    return {
      x: new Date(target.date).getTime(),
      y: target.volumeLoad,
    }
  })
})

onMounted(() => {
  const { start, end } = getQueryInterval();
  setStartDate(start);
  setEndDate(end);
  
  if (startDate.value === null || endDate.value === null) {
    return;
  }

  checkUserVolumeLoadsByDate(startDate.value, endDate.value);
})

function setStartDate(date: Date) {
  startDate.value = date;
}

function setEndDate(date: Date) {
  endDate.value = date;
}

function getQueryInterval(): { start: Date, end: Date } {
  const start = new Date();
  start.setDate(start.getDate() - 7);
  const end = new Date();

  return { start, end };
}

async function checkUserVolumeLoadsByDate(
  start: Date,
  end: Date
) {
  if (user.value === null) {
    console.error("User not logged in");
    return;
  }

  const querySnapshot = 
    await getVolumeLoadsByInterval(
      user.value.uid,
      start,
      end
    );
  
  if (querySnapshot.empty) {
    console.log("No targets found for this user.");
    return;
  }

  targets.value = querySnapshot.docs
    .map(item => item.data());
}

watch(
  isAuthReady,
  () => {
    if (startDate.value === null || endDate.value === null) {
      return;
    }

    checkUserVolumeLoadsByDate(startDate.value, endDate.value);
  }
)
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
        label: 'Volume Load',
        data: targetChartData,
        borderColor: '#FF0000',
        backgroundColor: '#FF0000',
        barThickness: 2,
      }]"
      :round-to="0" />
  </div>
</template>