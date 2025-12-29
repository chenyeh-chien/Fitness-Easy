<script setup lang="ts">
import { ref } from 'vue'
import RightAlignContainer from '@/components/Utils/containers/RightAlignContainer.vue'
import CommonButton from '@/components/Utils/buttons/CommonButton.vue'
import SectionContainer from '@/components/Utils/containers/SectionContainer.vue'
import ExerciseList from '@/components/Training/ExerciseList.vue'
import DailyWorkoutList from '@/components/Training/DailyWorkoutList.vue'
import ExerciseForm from '@/components/Training/ExerciseForm.vue'
import DailyWorkoutForm from '@/components/Training/DailyWorkoutForm.vue'

const showAddExercise = ref(false);
const showAddDailyWorkout = ref(false);
const selectedExercise = ref<Record<string, any> | null>(null);
const selectedDailyWorkout = ref<Record<string, any> | null>(null);
const componentKey = ref(0)

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
}

async function handleShowAddDailyWorkout() {
  hideForms();
  setShowAddDailyWorkout(true);
}

async function handleSelectExercise(data: Record<string, any>) {
  hideForms();
  setSelectedExercise(data);
}

async function handleSelectDailyWorkout(data: Record<string, any>) {
  hideForms();
  setSelectedDailyWorkout(data);
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
    <SectionContainer
      :title="'Daily workout list'">
      <DailyWorkoutList
        :key="componentKey"
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
    </SectionContainer>
    <SectionContainer
      :title="'Exercise list'">
      <ExerciseList
        :key="componentKey"
        @select-record="handleSelectExercise"/>
      <RightAlignContainer>
        <div class="flex gap-2">
          <div>
            <CommonButton 
              :text="'Add exercise'"
              @click="handleShowAddExercise"/>
          </div>
        </div>
      </RightAlignContainer>
    </SectionContainer>
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
    <ExerciseForm
      v-if="showAddExercise"
      :open="showAddExercise"
      @cancel-form="handleCancelForm"/>
    <ExerciseForm
      v-if="selectedExercise !== null"
      :open="selectedExercise !== null"
      :action="'update'"
      :exercise="selectedExercise!"
      @cancel-form="handleCancelForm"/>
  </div>
</template>