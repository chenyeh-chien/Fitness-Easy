<script setup lang="ts">
import { ref } from 'vue'
import DatetimeSelectorWithLabel from '@/components/Utils/dates/DatetimeSelectorWithLabel.vue'
import RightAlignContainer from '@/components/Utils/containers/RightAlignContainer.vue'
import CommonButton from '@/components/Utils/buttons/CommonButton.vue'
import SectionContainer from '@/components/Utils/containers/SectionContainer.vue'
import ExerciseList from '@/components/Training/ExerciseList.vue'
import DailyWorkoutList from '@/components/Training/DailyWorkoutList.vue'
import ExerciseForm from '@/components/Training/ExerciseForm.vue'
import DailyWorkoutForm from '@/components/Training/DailyWorkoutForm.vue'

const selectedDate = ref(new Date())
const showAddExercise = ref(false);
const showAddDailyWorkout = ref(false);
const selectedExercise = ref<Record<string, any> | null>(null);
const componentKey = ref(0)

function changeTime(time: Date) {
  selectedDate.value = time;
}

function setShowAddExercise(value: boolean) {
  showAddExercise.value = value;
}

function setShowAddDailyWorkout(value: boolean) {
  showAddDailyWorkout.value = value;
}

function setSelectedExercise(data: Record<string, any> | null) {
  selectedExercise.value = data;
}

function handleShowAddExercise() {
  hideForms();
  setShowAddExercise(true);
}

function handleShowAddDailyWorkout() {
  hideForms();
  setShowAddDailyWorkout(true);
}

function handleSelectExercise(data: Record<string, any>) {
  hideForms();
  setSelectedExercise(data);
}

function handleAddExercise() {
}

function handleAddDailyWorkout() {
}

function handleCancelForm() {
  hideForms();
  componentKey.value++;
}

function hideForms() {
  setShowAddExercise(false);
  setShowAddDailyWorkout(false);
  setSelectedExercise(null);
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <RightAlignContainer>
      <div class="flex gap-2">
        <div>
          <CommonButton 
            :text="'Add exercise'"
            @click="handleShowAddExercise"/>
        </div>
        <div>
          <CommonButton 
            :text="'Add daily workout'"
            @click="handleShowAddDailyWorkout"/>
        </div>
      </div>
    </RightAlignContainer>
    <SectionContainer
      :title="'Exercise list'">
      <ExerciseList
        :key="componentKey"
        @select-record="handleSelectExercise"/>
    </SectionContainer>
    <SectionContainer
      :title="'Daily workout list'">
      <DatetimeSelectorWithLabel 
        :label="'Date'"
        :time="selectedDate"
        :show-time="false"
        @change-time="changeTime"/>
      <DailyWorkoutList
        :key="componentKey"
        :date="selectedDate"
        @select-record="handleSelectExercise"/>
    </SectionContainer>
    <ExerciseForm
      v-if="showAddExercise"
      @cancel-form="handleCancelForm"/>
    <ExerciseForm
      v-if="selectedExercise !== null"
      :action="'update'"
      :exercise="selectedExercise"
      @cancel-form="handleCancelForm"/>
    <DailyWorkoutForm
      v-if="showAddDailyWorkout"
      @cancel-form="handleCancelForm"/>
    <DailyWorkoutForm
      v-if="selectedExercise !== null"
      :action="'update'"
      :exercise="selectedExercise"
      @cancel-form="handleCancelForm"/>
  </div>
</template>