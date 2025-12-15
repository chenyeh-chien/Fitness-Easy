<script setup lang="ts">
import { ref, watch, onMounted, toRefs } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useDailyWorkouts } from '@/composables/useDailyWorkouts'
import { useIsLoading } from '@/composables/index'
import TextTable from '../Utils/tables/TextTable.vue'
import { formatMinutesStr } from '@/components/Utils/utilFunctions/index'

interface Props {
  date?: Date;
  editable?: boolean;
}

interface Emits {
  (e: 'selectRecord', data: Record<string, any>): void;
}

const props = withDefaults(defineProps<Props>(), {
  date: () => new Date(),
  editable: false
});
const { date, editable } = toRefs(props);
const emits = defineEmits<Emits>();

const LABELS = [{
  label: "Body part",
  key: "bodyPart",
}, {
  label: "Exercise",
  key: "exercise",
}, {
  label: "Weight (kg)",
  key: "weight",
}, {
  label: "Growth",
  key: "growth",
  type: "progress"
}, {
  label: "Reps",
  key: "reps",
}, {
  label: "Sets",
  key: "sets",
}, {
  label: "Set time (m)",
  key: "setTime",
}, {
  label: "Note",
  key: "note",
}]
const { user, isAuthReady } = useAuth();
const { 
  getDailyWorkouts, 
  getLatestWeight 
} = useDailyWorkouts();
const originalDailyWorkouts = ref<any[]>([]);
const dailyWorkouts = ref<any[]>([]);
const { isLoading, loadingEffect } = useIsLoading();

onMounted(() => {
  loadingEffect(checkUserDailyWorkouts);
})

async function checkUserDailyWorkouts() {
  if (user.value === null) {
    console.error("User not logged in");
    return;
  }

  try {
    const querySnapshot = 
      await getDailyWorkouts(user.value.uid, date.value);
    
    if (querySnapshot.empty) {
      console.log("No workouts found for this user.");
    }
    
    originalDailyWorkouts.value = querySnapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          ...data,
          id: doc.id,
        }
      });
    
    const workouts = [];
    for (let workout of originalDailyWorkouts.value) {
      const latestWeight = 
        await getLatestWeight(
          user.value.uid, 
          date.value, 
          workout.bodyPart, 
          workout.exercise
        );

      const weight = latestWeight.docs.map((doc) => {
        const data = doc.data();
        return data.weight;
      });
      
      let growth = 0;
      if (weight.length > 0) {
        growth = workout.weight - weight[0];
      }

      workouts.push({
        ...workout,
        growth,
        setTime: formatMinutesStr(workout.setTime),
      })
    }

    dailyWorkouts.value = workouts;
  } catch (error) {
    console.error("Error querying daily workouts:", error);
  }
}

function handleSelectRow(index: number) {
  const data = originalDailyWorkouts.value[index];
  emits('selectRecord', data);
}

watch(
  [isAuthReady, date],
  () => {
    loadingEffect(checkUserDailyWorkouts);
  }
)

</script>

<template>
  <TextTable 
    :headers="LABELS"
    :data="dailyWorkouts"
    :clickable="editable"
    :is-loading="isLoading"
    @select-row="handleSelectRow"/>
</template>