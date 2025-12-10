<script setup lang="ts">
import { toRefs, ref, computed, watch } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useDailyProgress } from '@/composables/useDailyProgress'
import SectionContainer from '@/components/Utils/containers/SectionContainer.vue'
import RightAlignContainer from '@/components/Utils/containers/RightAlignContainer.vue'
import LabeledTextbox from '@/components/Utils/textboxes/LabeledTextbox.vue'
import DatetimeSelectorWithLabel from '@/components/Utils/dates/DatetimeSelectorWithLabel.vue'
import CommonButton from '@/components/Utils/buttons/CommonButton.vue'
import AddButton from '@/components/Utils/buttons/AddButton.vue'
import ConfirmButton from '@/components/Utils/buttons/ConfirmButton.vue'
import { formatDateStr } from '@/components/Utils/utilFunctions/index';


interface Props {
  action?: "add" | "update";
  progress?: Record<string, any>;
}

interface Emits {
  (e: 'cancelForm'): void;
}

const props = withDefaults(defineProps<Props>(), {
  action: "add",
  progress: () => ({
    date: formatDateStr(new Date(), false),
    weight: 75,
  })
})
const { action, progress } = toRefs(props);
const emits = defineEmits<Emits>();
const { user, isAuthReady } = useAuth();
const { 
  addDailyProgress, 
  updateDailyProgress, 
  deleteDailyProgress 
} = useDailyProgress();
const dailyProgress = ref<Record<string, any> | null>(progress.value);
const formTitle = computed(() => {
  return action.value === "add" ? "Add daily progress" : "Update daily progress";
})

function setDailyProgress(progress: Record<string, any>) {
  dailyProgress.value = progress;
}

function changeTime(time: Date) {
  dailyProgress.value!.date = formatDateStr(time, false);
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

  if (dailyProgress.value === null) {
    console.error("Daily progress is null");
    return;
  }

  await addDailyProgress({
    userId: user.value!.uid,
    date: dailyProgress.value!.date,
    weight: dailyProgress.value!.weight,
  });
}

async function updateRecord() {
  if (user.value === null) {
    console.error("User not logged in");
    return;
  }

  if (dailyProgress.value === null) {
    console.error("Daily progress is null");
    return;
  }

  await updateDailyProgress({
    userId: user.value!.uid,
    date: dailyProgress.value!.date,
    weight: dailyProgress.value!.weight,
  }, progress.value!.id);
}

async function deleteRecord() {
  if (user.value === null) {
    console.error("User not logged in");
    return;
  }

  if (dailyProgress.value === null) {
    console.error("Daily progress is null");
    return;
  }

  await deleteDailyProgress(dailyProgress.value.id);
}

watch(
  progress,
  (newValue) => {
    if (!newValue) {
      return;
    }

    setDailyProgress(newValue);
  },
  { immediate: true, deep: true }
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
          :time="new Date(dailyProgress!.date)"
          :show-time="false"
          @change-time="changeTime"/>
        <LabeledTextbox 
          v-model:text.number="dailyProgress!.weight"
          :label="'Weight (kg)'"
          :name="'Weight'"/>
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
