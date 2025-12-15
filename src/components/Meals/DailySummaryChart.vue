<script setup lang="ts">
import { toRefs, ref, computed, onMounted, watch } from 'vue'
import CanvasChart from '@/components/Utils/chart/CanvasChart.vue'
import { useAuth } from '@/composables/useAuth'
import { useRerenderWithLocalStorage } from '@/composables/index'
import { useDailyTarget } from '@/composables/useDailyTarget';
import { useDailyMeals } from '@/composables/useDailyMeals';
import { formatDateStr } from '@/components/Utils/utilFunctions';

const { user, isAuthReady } = useAuth();
const { getDailyTargetsByInterval } = useDailyTarget();
const { 
  getDailyMealsByInterval, 
  arrangeSummary 
} = useDailyMeals();
const showComponent = ref(true);
useRerenderWithLocalStorage(showComponent);
const startDate = ref<Date | null>(null);
const endDate = ref<Date | null>(null);
const targets = ref<any[]>([]);
const summary = ref<any[]>([]);
const targetChartData = computed(() => {
  return targets.value.map((target) => {
    return {
      x: new Date(target.date).getTime(),
      y: target.total,
    }
  })
})
const summaryChartData = computed(() => {
  return summary.value.map((progress) => {
    return {
      x: new Date(progress.date).getTime(),
      y: progress.total,
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

  checkUserTargetsByDate(startDate.value, endDate.value);
  checkUserSummaryByDate(startDate.value, endDate.value);
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

async function checkUserTargetsByDate(
  start: Date,
  end: Date
) {
  if (user.value === null) {
    console.error("User not logged in");
    return;
  }

  const querySnapshot = 
    await getDailyTargetsByInterval(
      user.value.uid,
      start,
      end
    );
  
  if (querySnapshot.empty) {
    console.log("No targets found for this user.");
    return;
  }

  targets.value = querySnapshot.docs
    .map(item => item.data())
    .map(item => ({
      date: item.date,
      total: item.protein * 4 + item.carbohydrate * 4 + item.fat * 9
    }));

  console.log(targets.value);
}

async function checkUserSummaryByDate(
  start: Date,
  end: Date
) {
  if (user.value === null) {
    console.error("User not logged in");
    return;
  }

  const querySnapshot = 
    await getDailyMealsByInterval(
      user.value.uid,
      start,
      end
    );
  
  if (querySnapshot.empty) {
    console.log("No meals found for this user.");
    return;
  }

  // 根據日期分類 再個別arrange

  const map = querySnapshot.docs
    .map(item => item.data())
    .reduce((acc, item) => {
      const date = formatDateStr(item.time, false);
      if (!acc[date]) {
        acc[date] = [];
      }
      
      acc[date].push(item);
      return acc;
    }, {});

  summary.value = Object.entries(map).map(([date, items]) => {
    const arrange = arrangeSummary(items);

    return {
      date,
      total: arrange.total
    }
  });
}

watch(
  isAuthReady,
  () => {
    if (startDate.value === null || endDate.value === null) {
      return;
    }

    checkUserTargetsByDate(startDate.value, endDate.value);
    checkUserSummaryByDate(startDate.value, endDate.value);
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
        unit: 'kcal',
      }"
      :dataset="[{
        label: 'Target',
        data: targetChartData,
        borderColor: '#FF0000',
        backgroundColor: '#FF0000',
        barThickness: 2,
      },{
        label: 'Summary',
        data: summaryChartData,
        borderColor: '#00FF00',
        backgroundColor: '#00FF00',
        barThickness: 2,
      }]"
      :round-to="0" />
  </div>
</template>