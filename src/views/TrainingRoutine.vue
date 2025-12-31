<script setup lang="ts">
import { ref } from 'vue'
import RightAlignContainer from '@/components/Utils/containers/RightAlignContainer.vue'
import CommonButton from '@/components/Utils/buttons/CommonButton.vue'
import SectionContainer from '@/components/Utils/containers/SectionContainer.vue'
import ExerciseList from '@/components/Training/ExerciseList.vue'
import DailyWorkout from '@/components/Training/DailyWorkout.vue'
import ExerciseForm from '@/components/Training/ExerciseForm.vue'

const showAddExercise = ref(false);
const selectedExercise = ref<Record<string, any> | null>(null);
const componentKey = ref(0)

function setShowAddExercise(value: boolean) {
  showAddExercise.value = value;
}

function setSelectedExercise(data: Record<string, any> | null) {
  selectedExercise.value = data;
}

async function handleShowAddExercise() {
  hideForms();
  setShowAddExercise(true);
}

async function handleSelectExercise(data: Record<string, any>) {
  hideForms();
  setSelectedExercise(data);
}

function updateComponentKey() {
  componentKey.value++;
}

function handleCancelForm() {
  hideForms();
  updateComponentKey();
}

function hideForms() {
  setShowAddExercise(false);
  setSelectedExercise(null);
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <DailyWorkout 
      :key="componentKey"
      @update-component-key="updateComponentKey"/>
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