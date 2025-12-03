<script setup lang="ts">
import { ref, watch, onMounted, toRefs } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useDailyWorkouts } from '@/composables/useDailyWorkouts'
import TextTable from '../Utils/tables/TextTable.vue'

interface Props {
  date?: Date;
}

interface Emits {
  (e: 'selectRecord', data: Record<string, any>): void;
}

const props = withDefaults(defineProps<Props>(), {
  date: () => new Date(),
});
const { date } = toRefs(props);
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
  label: "Reps",
  key: "reps",
}, {
  label: "Sets",
  key: "sets",
}, {
  label: "Set time (s)",
  key: "setTime",
}, {
  label: "Note",
  key: "note",
}]
const { user, isAuthReady } = useAuth();
const { getDailyWorkouts } = useDailyWorkouts();
const dailyWorkouts = ref<any[]>([]);

onMounted(() => {
  checkUserDailyWorkouts();
})

async function checkUserDailyWorkouts() {
  if (user.value === null) {
    console.error("User not logged in");
    return;
  }

  try {
    const querySnapshot = 
      await getDailyWorkouts(user.value.uid, date.value);
    
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });

    if (querySnapshot.empty) {
      console.log("No workouts found for this user.");
    }
    
    dailyWorkouts.value = querySnapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          ...data,
          id: doc.id,
        }
      });
  } catch (error) {
    console.error("Error querying daily workouts:", error);
  }
}

function handleSelectRow(index: number) {
  const data = dailyWorkouts.value[index];
  emits('selectRecord', data);
}

watch(
  [isAuthReady, date],
  () => {
    checkUserDailyWorkouts();
  }
)

</script>

<template>
  <TextTable 
    :headers="LABELS"
    :data="dailyWorkouts"
    :clickable="true"
    @select-row="handleSelectRow"/>
</template>