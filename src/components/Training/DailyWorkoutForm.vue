<script setup lang="ts">
import { ref, watch, computed, onMounted, toRefs, nextTick } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useDailyWorkouts } from '@/composables/useDailyWorkouts'
import { useExercises } from '@/composables/useExercises'
import { formatDateStr } from '../Utils/utilFunctions'
import SectionContainer from '@/components/Utils/containers/SectionContainer.vue'
import DatetimeSelectorWithLabel from '@/components/Utils/dates/DatetimeSelectorWithLabel.vue'
import LabeledTextbox from '@/components/Utils/textboxes/LabeledTextbox.vue'
import RightAlignContainer from '@/components/Utils/containers/RightAlignContainer.vue'
import AddButton from '@/components/Utils/buttons/AddButton.vue'
import ConfirmButton from '@/components/Utils/buttons/ConfirmButton.vue'
import CommonButton from '@/components/Utils/buttons/CommonButton.vue'
import LabeledSelect from '../Utils/dropdowns/LabeledSelect.vue'


interface Props {
  action?: "add" | "update";
  workout?: Record<string, any>;
}

interface Emits {
  (e: 'cancelForm'): void;
}

const props = withDefaults(defineProps<Props>(), {
  action: "add",
  workout: () => ({
    bodyPart: "",
    date: formatDateStr(new Date(), false),
    exercise: "",
    weight: 0,
    reps: 8,
    sets: 4,
    setTime: 4,
    note: "",
  })
})
const { action, workout } = toRefs(props);
const emits = defineEmits<Emits>();
const { user, isAuthReady } = useAuth();
const { 
  addDailyWorkout, 
  updateDailyWorkout, 
  deleteDailyWorkout 
} = useDailyWorkouts();
const { getExercises } = useExercises();
const workoutInfo = ref<Record<string, any> | null>(null)
const workoutsInfo = ref<any[]>([])
const selectedBodyPart = ref<string | null>(null);
const selectedWorkout = ref<string | null>(null);

const formTitle = computed(() => {
  return action.value === "add" ? "Add daily workout" : "Update daily workout";
})

const bodyPartOptions = computed(() => {
  return Array.from(new Set(workoutsInfo.value.map(item => item.bodyPart)));
})

const workoutOptions = computed(() => {
  return workoutsInfo.value
    .filter(item => item.bodyPart === selectedBodyPart.value)
    .map(item => item.exercise);
})

onMounted(() => {
  setWorkoutOptions();
})

async function setWorkoutOptions() {
  if (user.value === null) {
    console.error("User not logged in");
    return;
  }

  try {
    const querySnapshot = 
      await getExercises(user.value.uid);
    
    workoutsInfo.value = querySnapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error("Error querying daily workouts:", error);
  }
}

function changeDate(time: Date) {
  workoutInfo.value!.date = formatDateStr(time, false);
}

function setWorkoutInfo(info: Record<string, any>) {
  workoutInfo.value = info;
}

function setSelectedBodyPart(bodyPart: string) {
  selectedBodyPart.value = bodyPart;
}

function setSelectedWorkout(workout: string) {
  selectedWorkout.value = workout;
}

async function handleSubmitForm() {
  try {
    action.value === "add" ? await addRecord() : await updateRecord();

    emits('cancelForm')
  } catch (error) {
    console.error("Error writing document:", error);
  }
}

async function handleDeleteForm() {
  try {
    await deleteRecord();

    emits('cancelForm')
  } catch (error) {
    console.error("Error deleting document:", error);
  }
}

async function addRecord() {
  if (user.value === null) {
    console.error("User not logged in");
    return;
  }

  if (workoutInfo.value === null) {
    console.error("Workout info is null");
    return;
  }

  await addDailyWorkout({
    userId: user.value.uid,
    date: workoutInfo.value.date,
    exercise: workoutInfo.value.exercise,
    bodyPart: workoutInfo.value.bodyPart,
    weight: workoutInfo.value.weight,
    reps: workoutInfo.value.reps,
    sets: workoutInfo.value.sets,
    setTime: workoutInfo.value.setTime,
    note: workoutInfo.value.note,
  });
}

async function updateRecord() {
  if (user.value === null) {
    console.error("User not logged in");
    return;
  }

  if (workoutInfo.value === null) {
    console.error("Workout info is null");
    return;
  }

  await updateDailyWorkout({
    userId: user.value.uid,
    date: workoutInfo.value.date,
    exercise: workoutInfo.value.exercise,
    bodyPart: workoutInfo.value.bodyPart,
    weight: workoutInfo.value.weight,
    reps: workoutInfo.value.reps,
    sets: workoutInfo.value.sets,
    setTime: workoutInfo.value.setTime,
    note: workoutInfo.value.note,
  }, workout.value.id);
}

async function deleteRecord() {
  if (user.value === null) {
    console.error("User not logged in");
    return;
  }

  if (workout.value === null) {
    console.error("Workout is null");
    return;
  }

  await deleteDailyWorkout(workout.value.id);
}

watch(
  isAuthReady,
  () => {
    setWorkoutOptions();
  }
)

watch(
  workout,
  (newValue) => {
    if (!newValue) {
      return;
    }

    setWorkoutInfo(newValue);
    setSelectedWorkout(newValue.exercise);
  },
  { immediate: true, deep: true }
)

watch(
  workoutsInfo,
  async (newValue) => {
    if (!newValue || bodyPartOptions.value.length === 0) {
      return;
    }

    await nextTick();

    setSelectedBodyPart(bodyPartOptions.value[0]);
  },
  { immediate: true, deep: true }
)

watch(
  selectedBodyPart,
  (newValue) => {
    if (!newValue || workoutOptions.value.length === 0) {
      return;
    }

    setSelectedWorkout(workoutOptions.value[0]);
  }
)

watch(
  selectedWorkout,
  (newValue) => {
    if (!newValue) {
      return
    }

    setWorkoutInfo({
      ...workoutInfo.value,
      bodyPart: selectedBodyPart.value,
      exercise: newValue,
    });
  }
)
</script>

<template>
  <SectionContainer 
    :title="formTitle">
    <form 
      class="flex flex-col gap-6"
      @submit.prevent="handleSubmitForm">
      <div class="flex flex-col gap-4">
        <DatetimeSelectorWithLabel 
          :label="'Date'"
          :time="new Date(workoutInfo!.date)"
          :show-time="false"
          @change-time="changeDate"/>
        <LabeledSelect 
          v-if="action === 'add'"
          :name="'Body part'"
          :label="'Body part'"
          :value="workoutInfo!.bodyPart"
          :options="bodyPartOptions" 
          @on-change-value="setSelectedBodyPart"/>
        <LabeledTextbox 
          v-else
          v-model:text="workoutInfo!.exercise"
          :label="'Exercise'"
          :name="'Exercise'"/>
        <LabeledSelect 
          v-if="action === 'add'"
          :name="'Exercise'"
          :label="'Exercise'"
          :value="workoutInfo!.exercise"
          :options="workoutOptions" 
          @on-change-value="setSelectedWorkout"/>
        <LabeledTextbox 
          v-else
          v-model:text="workoutInfo!.exercise"
          :label="'Exercise'"
          :name="'Exercise'"/>
        <LabeledTextbox 
          v-model:text.number="workoutInfo!.weight"
          :label="'Weight (kg)'"
          :name="'Weight'"/>
        <LabeledTextbox 
          v-model:text.number="workoutInfo!.reps"
          :label="'Reps'"
          :name="'Reps'"/>
        <LabeledTextbox 
          v-model:text.number="workoutInfo!.sets"
          :label="'Sets'"
          :name="'Sets'"/>
        <LabeledTextbox 
          v-model:text.number="workoutInfo!.setTime"
          :label="'Set time (m)'"
          :name="'Set time'"/>
        <LabeledTextbox 
          v-model:text="workoutInfo!.note"
          :label="'Note'"
          :name="'Note'"/>
      </div>
      <RightAlignContainer>
        <div class="flex flex-wrap gap-2">
          <template v-if="action === 'update'">
            <ConfirmButton
              :text="'Update'"
              :button-type="'submit'"/>
            <ConfirmButton
              :text="'Delete'"
              @click="handleDeleteForm"/>
          </template>
          <AddButton 
            v-else
            :button-type="'submit'"/>
          <CommonButton
            :text="'Cancel'" 
            @click="emits('cancelForm')"/>
        </div>
      </RightAlignContainer>
    </form>
  </SectionContainer>
</template>