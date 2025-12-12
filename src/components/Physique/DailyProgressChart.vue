<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useDailyProgress } from '@/composables/useDailyProgress'
import CanvasChart from '@/components/Utils/chart/CanvasChart.vue'
import { useRerenderWithLocalStorage } from '@/composables/index'

const { user, isAuthReady } = useAuth();
const { getDailyProgress } = useDailyProgress();
const showComponent = ref(true);
useRerenderWithLocalStorage(showComponent);
const dailyProgress = ref<any[]>([]);
const chartData = computed(() => {
  return dailyProgress.value.map((progress) => {
    return {
      x: new Date(progress.date).getTime(),
      y: progress.weight,
    }
  })
})

onMounted(() => {
  checkDailyProgress();
})

async function checkDailyProgress() {
  if (user.value === null) {
    console.error("User not logged in");
    return;
  }

  try {
    const querySnapshot = 
      await getDailyProgress(user.value.uid);
    
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });

    if (querySnapshot.empty) {
      console.log("No meals found for this user.");
    }
    
    dailyProgress.value = querySnapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        ...data,
        id: doc.id,
      }
    });

    console.log(dailyProgress.value);
  } catch (error) {
    console.error("Error querying daily meals:", error);
  }
}

watch(
  isAuthReady,
  () => {
    checkDailyProgress();
  }
)
</script>

<template>
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
    :round-to="1" />
</template>