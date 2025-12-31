<script setup lang="ts">
import { ref } from 'vue'
import SectionContainer from '@/components/Utils/containers/SectionContainer.vue'
import DailyWorkoutList from '@/components/Training/DailyWorkoutList.vue'
import RightAlignContainer from '@/components/Utils/containers/RightAlignContainer.vue'
import CommonButton from '@/components/Utils/buttons/CommonButton.vue'
import DailyWorkoutForm from '@/components/Training/DailyWorkoutForm.vue'

interface Emits {
  (e: "updateComponentKey"): void;
}

const emits = defineEmits<Emits>();
const showAddDailyWorkout = ref(false);
const selectedDailyWorkout = ref<Record<string, any> | null>(null);

function setShowAddDailyWorkout(value: boolean) {
  showAddDailyWorkout.value = value;
}

function setSelectedDailyWorkout(value: Record<string, any> | null) {
  selectedDailyWorkout.value = value;
}

async function handleShowAddDailyWorkout() {
  hideForms();
  setShowAddDailyWorkout(true);
}

async function handleSelectDailyWorkout(data: Record<string, any>) {
  hideForms();
  setSelectedDailyWorkout(data)
}

function handleCancelForm() {
  hideForms();
  emits("updateComponentKey");
}

function hideForms() {
  setShowAddDailyWorkout(false);
  setSelectedDailyWorkout(null);
}
</script>

<template>
  <SectionContainer
    :title="'Daily workout list'">
    <DailyWorkoutList
      :editable="true"
      @select-record="handleSelectDailyWorkout"/>
    <RightAlignContainer>
      <div class="flex gap-2">
        <div>
          <CommonButton 
            :text="'Add daily workout'"
            @click="handleShowAddDailyWorkout"/>
        </div>
      </div>
    </RightAlignContainer>
    <DailyWorkoutForm
      v-if="showAddDailyWorkout"
      :open="showAddDailyWorkout"
      @cancel-form="handleCancelForm"/>
    <DailyWorkoutForm
      v-if="selectedDailyWorkout !== null"
      :open="selectedDailyWorkout !== null"
      :action="'update'"
      :workout="selectedDailyWorkout!"
      @cancel-form="handleCancelForm"/>
  </SectionContainer>
</template>