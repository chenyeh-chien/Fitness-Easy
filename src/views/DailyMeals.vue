<script setup lang="ts">
import { ref } from 'vue'
import DailySummary from '@/components/Home/DailySummary.vue'
import MealContentForm from '@/components/Meals/MealContentForm.vue'
import DailyMealsForm from '@/components/Meals/DailyMealsForm.vue'
import DailyFoodIntake from '@/components/Home/DailyFoodIntake.vue'
import SectionContainer from '@/components/Utils/containers/SectionContainer.vue'
import CustomizedMealList from '@/components/Meals/CustomizedMealList.vue'
import RightAlignContainer from '@/components/Utils/containers/RightAlignContainer.vue'
import CommonButton from '@/components/Utils/buttons/CommonButton.vue'

const showAddMealOption = ref(false)
const showAddDailyMeal = ref(false)
const componentKey = ref(0)
const selectedMealOption = ref<Record<string, any> | null>(null)
const selectedDailyMeal = ref<Record<string, any> | null>(null)

function setShowAddMealOption(value: boolean) {
  showAddMealOption.value = value;
}

function setShowAddDailyMeal(value: boolean) {
  showAddDailyMeal.value = value;
}

function setSelectedMealOption(value: Record<string, any> | null) {
  selectedMealOption.value = value;
}

function setSelectedDailyMeal(value: Record<string, any> | null) {
  selectedDailyMeal.value = value;
}

async function handleShowAddMealOption() {
  hideForms();
  setShowAddMealOption(true);
}

async function handleShowAddDailyMeal() {
  hideForms();
  setShowAddDailyMeal(true);
}

async function handleSelectMealOption(data: Record<string, any>) {
  hideForms();
  setSelectedMealOption(data)
}

async function handleSelectDailyMeal(data: Record<string, any>) {
  hideForms();
  setSelectedDailyMeal(data);
}

function handleCancelForm() {
  hideForms();
  componentKey.value++;
}

function hideForms() {
  setShowAddMealOption(false);
  setShowAddDailyMeal(false);
  setSelectedMealOption(null);
  setSelectedDailyMeal(null);
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <SectionContainer 
      class="w-full"
      :title="'Daily summary'">
      <DailySummary 
        :key="componentKey"/>
    </SectionContainer>
    <SectionContainer
      :title="'Daily food intake'">
      <DailyFoodIntake 
        :key="componentKey"
        :editable="true"
        @select-record="handleSelectDailyMeal"/>
      <RightAlignContainer>
        <div class="flex gap-2">
          <div>
            <CommonButton 
              :text="'Add daily meal'"
              @click="handleShowAddDailyMeal"/>
          </div>
        </div>
      </RightAlignContainer>
    </SectionContainer>
    <SectionContainer
      :title="'Meal list'">
      <CustomizedMealList 
        :key="componentKey"
        @select-record="handleSelectMealOption"/>
      <RightAlignContainer>
        <div class="flex gap-2">
          <div>
            <CommonButton 
              :text="'Add meal option'"
              @click="handleShowAddMealOption"/>
          </div>
        </div>
      </RightAlignContainer>
    </SectionContainer>
    <DailyMealsForm
      v-if="showAddDailyMeal"
      :open="showAddDailyMeal"
      @cancel-form="handleCancelForm"/>
    <DailyMealsForm
      v-if="selectedDailyMeal !== null"
      :open="selectedDailyMeal !== null"
      :action="'update'"
      :meal="selectedDailyMeal!"
      @cancel-form="handleCancelForm"/>
    <MealContentForm
      v-if="showAddMealOption"
      :open="showAddMealOption"
      @cancel-form="handleCancelForm"/>
    <MealContentForm
      v-if="selectedMealOption !== null"
      :open="selectedMealOption !== null"
      :action="'update'"
      :meal="selectedMealOption!"
      @cancel-form="handleCancelForm"/>
  </div>
</template>