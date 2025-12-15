<script setup lang="ts">
import { toRefs, ref, watch, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useDailyProgress } from '@/composables/useDailyProgress'
import { useIsLoading } from '@/composables/index'
import DailyProgressChart from './DailyProgressChart.vue'
import TextTable from '../Utils/tables/TextTable.vue'

interface Props {
  displayChart?: boolean;
}

interface Emits {
  (e: 'selectRecord', data: Record<string, any>): void;
}

const props = withDefaults(defineProps<Props>(), {
  displayChart: true,
});
const { displayChart } = toRefs(props);
const emits = defineEmits<Emits>();

const LABELS = [{
  label: "Date",
  key: "date",
}, {
  label: "Weight (kg)",
  key: "weight",
}]
const { user, isAuthReady } = useAuth();
const { getDailyProgress } = useDailyProgress();
const { isLoading, loadingEffect } = useIsLoading();
const dailyProgress = ref<any[]>([]);


onMounted(() => {
  loadingEffect(checkDailyProgress);
})

async function checkDailyProgress() {
  if (user.value === null) {
    console.error("User not logged in");
    return;
  }

  try {
    const querySnapshot = 
      await getDailyProgress(user.value.uid);

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
  } catch (error) {
    console.error("Error querying daily meals:", error);
  }
}

function handleSelectRow(index: number) {
  const data = dailyProgress.value[index];
  emits('selectRecord', data);
}

watch(
  isAuthReady,
  () => {
    loadingEffect(checkDailyProgress);
  }
)

</script>

<template>
  <div class="flex flex-col gap-10 md:flex-row">
    <DailyProgressChart 
      v-if="displayChart"
      :daily-progress="dailyProgress"/>
    <TextTable 
      :headers="LABELS"
      :data="dailyProgress"
      :clickable="true"
      :is-loading="isLoading"
      @select-row="handleSelectRow"/>
  </div>
</template>