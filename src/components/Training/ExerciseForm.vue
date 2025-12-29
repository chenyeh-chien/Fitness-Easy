<script setup lang="ts">
import { ref, watch, toRefs, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useExercises } from '@/composables/useExercises'
import LabeledTextbox from '@/components/Utils/textboxes/LabeledTextbox.vue'
import RightAlignContainer from '@/components/Utils/containers/RightAlignContainer.vue'
import ConfirmButton from '@/components/Utils/buttons/ConfirmButton.vue'
import AddButton from '@/components/Utils/buttons/AddButton.vue'
import CommonButton from '@/components/Utils/buttons/CommonButton.vue'
import {
  useSweetAlertAddRecord,
  useSweetAlertUpdateRecord,
  useSweetAlertDeleteRecord,
} from '@/components/Utils/utilFunctions/sweetAlert'
import CommonDrawer from '@/components/Utils/drawer/CommonDrawer.vue'

interface Props {
  open: boolean;
  action?: "add" | "update";
  exercise?: Record<string, any>;
}

interface Emits {
  (e: 'cancelForm'): void;
}

const props = withDefaults(defineProps<Props>(), {
  action: "add",
  exercise: () => ({
    bodyPart: "",
    exercise: "",
  })
})
const { open, action, exercise } = toRefs(props);
const emits = defineEmits<Emits>();
const { user, isAuthReady } = useAuth();
const { 
  getExercises, 
  addExercise,
  updateExercise,
  deleteExercise,
} = useExercises();
const exerciseInfo = ref<Record<string, any> | null>(null)

const formTitle = computed(() => {
  return action.value === "add" ? "Add exercise" : "Update exercise";
})

onMounted(() => {
  checkExercises();
})

function setExerciseInfo(info: Record<string, any>) {
  exerciseInfo.value = info;
}

async function checkExercises() {
  if (user.value === null) {
    console.error("User not logged in");
    return;
  }

  try {
    const querySnapshot = 
      await getExercises(
        user.value.uid
      );

    if (querySnapshot.empty) {
      console.log("No exercises found for this user.");
    }
  } catch (error) {
    console.error("Error querying daily exercises:", error);
  }
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

  if (exerciseInfo.value === null) {
    console.error("Exercise info is null");
    return;
  }

  const isExecuted = await useSweetAlertAddRecord(
    addExercise,
    [
      {
        userId: user.value.uid,
        bodyPart: exerciseInfo.value.bodyPart,
        exercise: exerciseInfo.value.exercise,
      }
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

  if (exerciseInfo.value === null) {
    console.error("Exercise info is null");
    return;
  }

  const isExecuted = await useSweetAlertUpdateRecord(
    updateExercise,
    [
      {
        userId: user.value.uid,
        bodyPart: exerciseInfo.value.bodyPart,
        exercise: exerciseInfo.value.exercise,
      }, exercise.value.id
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

  if (exercise.value === null) {
    console.error("Exercise is null");
    return;
  }

  const isExecuted = await useSweetAlertDeleteRecord(
    deleteExercise,
    [exercise.value.id]
  );

  if (!isExecuted) {
    return;
  }

  emits('cancelForm');
}

watch(
  isAuthReady,
  () => {
    checkExercises();
  }
)

watch(
  exercise,
  (newValue) => {
    if (!newValue) {
      return;
    }

    setExerciseInfo(newValue);
  },
  { immediate: true, deep: true }
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
        <LabeledTextbox 
          v-model:text="exerciseInfo!.bodyPart"
          :label="'Body part'"
          :name="'Body part'"/>
        <LabeledTextbox 
          v-model:text="exerciseInfo!.exercise"
          :label="'Exercise'"
          :name="'Exercise'"/>
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