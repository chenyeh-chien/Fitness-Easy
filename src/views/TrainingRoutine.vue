<script setup lang="ts">
import { ref, nextTick, useTemplateRef } from 'vue'
import DatetimeSelectorWithLabel from '@/components/Utils/dates/DatetimeSelectorWithLabel.vue'
import RightAlignContainer from '@/components/Utils/containers/RightAlignContainer.vue'
import CommonButton from '@/components/Utils/buttons/CommonButton.vue'
import SectionContainer from '@/components/Utils/containers/SectionContainer.vue'
import ExerciseList from '@/components/Training/ExerciseList.vue'
import DailyWorkoutList from '@/components/Training/DailyWorkoutList.vue'
import ExerciseForm from '@/components/Training/ExerciseForm.vue'
import DailyWorkoutForm from '@/components/Training/DailyWorkoutForm.vue'

const SCROLL_OPTIONS = {
  behavior: 'smooth',
}
const selectedDate = ref(new Date())
const showAddExercise = ref(false);
const showAddDailyWorkout = ref(false);
const selectedExercise = ref<Record<string, any> | null>(null);
const selectedDailyWorkout = ref<Record<string, any> | null>(null);
const componentKey = ref(0)
const exerciseFormRef = useTemplateRef('exerciseFormRef') 
const dailyWorkoutFormRef = useTemplateRef('dailyWorkoutFormRef')

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

function setSelectedDailyWorkout(data: Record<string, any> | null) {
  selectedDailyWorkout.value = data;
}

async function handleShowAddExercise() {
  hideForms();
  setShowAddExercise(true);

  await nextTick();
  scrollToExerciseForm();
}

async function handleShowAddDailyWorkout() {
  hideForms();
  setShowAddDailyWorkout(true);

  await nextTick();
  scrollToDailyWorkoutForm();
}

async function handleSelectExercise(data: Record<string, any>) {
  hideForms();
  setSelectedExercise(data);

  await nextTick();
  scrollToExerciseForm();
}

async function handleSelectDailyWorkout(data: Record<string, any>) {
  console.log(data);
  hideForms();
  setSelectedDailyWorkout(data);

  await nextTick();
  scrollToDailyWorkoutForm();
}

function scrollToExerciseForm() {
  exerciseFormRef.value?.$el?.scrollIntoView(SCROLL_OPTIONS);
}

function scrollToDailyWorkoutForm() {
  dailyWorkoutFormRef.value?.$el?.scrollIntoView(SCROLL_OPTIONS);
}

function handleCancelForm() {
  hideForms();
  componentKey.value++;
}

function hideForms() {
  setShowAddExercise(false);
  setShowAddDailyWorkout(false);
  setSelectedExercise(null);
  setSelectedDailyWorkout(null);
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
      :title="'Daily workout list'">
      <DatetimeSelectorWithLabel 
        :label="'Date'"
        :time="selectedDate"
        :show-time="false"
        @change-time="changeTime"/>
      <DailyWorkoutList
        :key="componentKey"
        :date="selectedDate"
        @select-record="handleSelectDailyWorkout"/>
    </SectionContainer>
    <SectionContainer
      :title="'Exercise list'">
      <ExerciseList
        :key="componentKey"
        @select-record="handleSelectExercise"/>
    </SectionContainer>
    <ExerciseForm
      v-if="showAddExercise"
      ref="exerciseFormRef"
      @cancel-form="handleCancelForm"/>
    <ExerciseForm
      v-if="selectedExercise !== null"
      ref="exerciseFormRef"
      :action="'update'"
      :exercise="selectedExercise"
      @cancel-form="handleCancelForm"/>
    <DailyWorkoutForm
      v-if="showAddDailyWorkout"
      ref="dailyWorkoutFormRef"
      @cancel-form="handleCancelForm"/>
    <DailyWorkoutForm
      v-if="selectedDailyWorkout !== null"
      ref="dailyWorkoutFormRef"
      :action="'update'"
      :workout="selectedDailyWorkout"
      @cancel-form="handleCancelForm"/>
  </div>
</template>