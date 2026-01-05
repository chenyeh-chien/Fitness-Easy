<script setup lang="ts">
import { ref, watch, computed, onMounted, toRefs, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useDatetimeStore } from '@/stores'
import { useAuth } from '@/composables/useAuth'
import { useDailyWorkouts } from '@/composables/useDailyWorkouts'
import { useExercises } from '@/composables/useExercises'
import LabeledTextbox from '@/components/Utils/textboxes/LabeledTextbox.vue'
import RightAlignContainer from '@/components/Utils/containers/RightAlignContainer.vue'
import AddButton from '@/components/Utils/buttons/AddButton.vue'
import ConfirmButton from '@/components/Utils/buttons/ConfirmButton.vue'
import CommonButton from '@/components/Utils/buttons/CommonButton.vue'
import LabeledSelect from '@/components/Utils/dropdowns/LabeledSelect.vue'
import { 
  formatDateStr,
  useSweetAlertAddRecord,
  useSweetAlertUpdateRecord,
  useSweetAlertDeleteRecord
} from '@/components/Utils/utilFunctions/index'
import CommonDrawer from '@/components/Utils/drawer/CommonDrawer.vue'


interface Props {
  open: boolean;
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
    rpe: "9",
    note: "",
  })
})
const { open, action, workout } = toRefs(props);
const emits = defineEmits<Emits>();
const { user, isAuthReady } = useAuth();
const { 
  addDailyWorkout, 
  updateDailyWorkout, 
  deleteDailyWorkout 
} = useDailyWorkouts();
const { getExercises } = useExercises();
const { currTime } = storeToRefs(useDatetimeStore());
const workoutInfo = ref<Record<string, any> | null>(null)
const workoutsInfo = ref<any[]>([])
const selectedBodyPart = ref<string | null>(null);
const selectedWorkout = ref<string | null>(null);
const selectedRPE = ref<string>("9");

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

const calculatedE1RM = computed(() => {
  if (!workoutInfo.value?.weight || !workoutInfo.value?.reps) return 0;

  // 如果使用者輸入的 RPE 小於 10，代表他還有保留體力 (RIR)
  // 我們將次數做一個轉換，例如 RPE 9 代表還能做 1 下，所以有效次數 = reps + 1
  const effectiveReps = workoutInfo.value.reps + (10 - workoutInfo.value.rpe);
  
  // 使用 Brzycki 公式
  const e1RM = workoutInfo.value.weight / (1.0278 - 0.0278 * effectiveReps);
  
  return Math.round(e1RM * 10) / 10;
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

function setWorkoutInfo(info: Record<string, any>) {
  workoutInfo.value = info;
}

function setSelectedBodyPart(bodyPart: string) {
  selectedBodyPart.value = bodyPart;
}

function setSelectedWorkout(workout: string) {
  selectedWorkout.value = workout;
}

function setSelectedRPE(rpe: string) {
  selectedRPE.value = rpe;
}

async function handleSubmitForm() {
  try {
    action.value === "add" ? await addRecord() : await updateRecord();
  } catch (error) {
    console.error("Error writing document:", error);
  }
}

async function handleDeleteForm() {
  try {
    await deleteRecord();
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

  const isExecuted = await useSweetAlertAddRecord(
    [addDailyWorkout],
    [
      [
        {
          userId: user.value.uid,
          date: workoutInfo.value.date,
          exercise: workoutInfo.value.exercise,
          bodyPart: workoutInfo.value.bodyPart,
          weight: workoutInfo.value.weight,
          reps: workoutInfo.value.reps,
          sets: workoutInfo.value.sets,
          setTime: workoutInfo.value.setTime,
          rpe: workoutInfo.value.rpe,
          e1RM: calculatedE1RM.value,
          note: workoutInfo.value.note,
        }
      ]
    ]
  );

  if (!isExecuted) {
    return;
  }

  emits('cancelForm');
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

  const isExecuted = await useSweetAlertUpdateRecord(
    [updateDailyWorkout],
    [
      [
        {
          userId: user.value.uid,
          date: workoutInfo.value.date,
          exercise: workoutInfo.value.exercise,
          bodyPart: workoutInfo.value.bodyPart,
          weight: workoutInfo.value.weight,
          reps: workoutInfo.value.reps,
          sets: workoutInfo.value.sets,
          setTime: workoutInfo.value.setTime,
          rpe: workoutInfo.value.rpe,
          e1RM: calculatedE1RM.value,
          note: workoutInfo.value.note,
        }, workout.value.id
      ]
    ]
  );

  if (!isExecuted) {
    return;
  }

  emits('cancelForm');
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

  const isExecuted = await useSweetAlertDeleteRecord(
    [deleteDailyWorkout],
    [
      [workout.value.id]
    ]
  );

  if (!isExecuted) {
    return;
  }

  emits('cancelForm');
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

    let updatedData = newValue;
    if (action.value === "add") {
      updatedData = {
        ...updatedData,
        date: formatDateStr(currTime.value, false),
      }
    }

    setWorkoutInfo(updatedData);

    if (action.value === 'update') {
      setSelectedBodyPart(newValue.bodyPart);
      setSelectedWorkout(newValue.exercise);
    }
  },
  { immediate: true, deep: true }
)

watch(
  workoutsInfo,
  async (newValue) => {
    if (!newValue || bodyPartOptions.value.length === 0) {
      return;
    }

    if (action.value === 'add') {
      await nextTick();
      setSelectedBodyPart(bodyPartOptions.value[0]);
    }
  },
  { immediate: true, deep: true }
)

watch(
  selectedBodyPart,
  async (newValue) => {
    if (!newValue || workoutOptions.value.length === 0) {
      return;
    }

    if (action.value === 'add') {
      setSelectedWorkout(workoutOptions.value[0]);
    }
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

watch(
  selectedRPE,
  (newValue) => {
    if (!newValue) {
      return
    }

    setWorkoutInfo({
      ...workoutInfo.value,
      rpe: newValue,
    });
  }
)
</script>

<template>
  <CommonDrawer
    :open="open"
    :title="formTitle"
    @close-drawer="emits('cancelForm')">
    <form 
      class="flex flex-col gap-6"
      @submit.prevent="handleSubmitForm">
      <div class="flex flex-col gap-4 md:flex-row md:flex-wrap">
        <LabeledSelect
          v-if="selectedBodyPart !== null"
          :name="'Body part'"
          :label="'Body part'"
          :value="selectedBodyPart"
          :options="bodyPartOptions" 
          @on-change-value="setSelectedBodyPart"/>
        <LabeledSelect
          v-if="selectedWorkout !== null"
          :name="'Exercise'"
          :label="'Exercise'"
          :value="selectedWorkout"
          :options="workoutOptions" 
          @on-change-value="setSelectedWorkout"/>
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
        <LabeledSelect
          :name="'RPE'"
          :label="'RPE (Rate of Perceived Exertion)'"
          :value="selectedRPE"
          :options="['10', '9', '8', '7', '6', '5', '4', '3', '2', '1']" 
          @on-change-value="setSelectedRPE"/>
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
  </CommonDrawer>
</template>