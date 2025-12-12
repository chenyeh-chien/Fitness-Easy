<script setup lang="ts">
import { ref, watch, onMounted, toRefs } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useDailyTarget } from '@/composables/useDailyTarget'
import DailyTargetChart from './DailyTargetChart.vue'
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
  label: "Total (Kcal)",
  key: "total",
}, {
  label: "Protein (g)",
  key: "protein",
}, {
  label: "Carbohydrate (g)",
  key: "carbohydrate",
}, {
  label: "Fat (g)",
  key: "fat",
}]
const { user, isAuthReady } = useAuth();
const { getDailyTargets } = useDailyTarget();
const originalDailyTargets = ref<any[]>([]);
const dailyTargets = ref<any[]>([]);

onMounted(() => {
  checkDailyTargets();
})

async function checkDailyTargets() {
  if (user.value === null) {
    console.error("User not logged in");
    return;
  }

  try {
    const querySnapshot = 
      await getDailyTargets(user.value.uid);
    
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });

    if (querySnapshot.empty) {
      console.log("No body info found for this user.");
    }
    
    originalDailyTargets.value = querySnapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        ...data,
        id: doc.id,
      }
    });

    dailyTargets.value = originalDailyTargets.value.map((item) => {
      return {
        ...item,
        total: item.protein * 4 + item.carbohydrate * 4 + item.fat * 9,
      }
    });
  } catch (error) {
    console.error("Error querying body info:", error);
  }
}

function handleSelectRow(index: number) {
  const data = originalDailyTargets.value[index];
  emits('selectRecord', data);
}

watch(
  isAuthReady,
  () => {
    checkDailyTargets();
  }
)

</script>

<template>
  <div class="flex flex-col gap-10 md:flex-row">
    <DailyTargetChart 
      v-if="displayChart"
      :daily-target="dailyTargets"/>
    <TextTable 
      :headers="LABELS"
      :data="dailyTargets"
      :clickable="true"
      @select-row="handleSelectRow"/>
  </div>
</template>