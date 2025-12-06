<script setup lang="ts">
import { nextTick, ref, useTemplateRef } from 'vue'
import MealContentForm from '@/components/Meals/MealContentForm.vue'
import DailyMealsForm from '@/components/Meals/DailyMealsForm.vue'
import DailyFoodIntake from '@/components/Home/DailyFoodIntake.vue'
import SectionContainer from '@/components/Utils/containers/SectionContainer.vue'
import DatetimeSelectorWithLabel from '@/components/Utils/dates/DatetimeSelectorWithLabel.vue'
import CustomizedMealList from '@/components/Meals/CustomizedMealList.vue'
import RightAlignContainer from '@/components/Utils/containers/RightAlignContainer.vue'
import CommonButton from '@/components/Utils/buttons/CommonButton.vue'

const SCROLL_OPTIONS = {
  behavior: 'smooth',
}
const selectedDate = ref(new Date())
const showAddMealOption = ref(false)
const showAddDailyMeal = ref(false)
const componentKey = ref(0)
const mealContentFormRef = useTemplateRef('mealContentForm')
const dailyMealsFormRef = useTemplateRef('dailyMealsForm')
const selectedMealOption = ref<Record<string, any> | null>(null)
const selectedDailyMeal = ref<Record<string, any> | null>(null)

function changeTime(time: Date) {
  selectedDate.value = time;
}

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

  await nextTick();
  scrollToMealOptionForm();
}

async function handleShowAddDailyMeal() {
  hideForms();
  setShowAddDailyMeal(true);

  await nextTick();
  scrollToDailyMealForm();
}

function scrollToMealOptionForm() {
  mealContentFormRef.value?.$el?.scrollIntoView(SCROLL_OPTIONS);
}

function scrollToDailyMealForm() {
  dailyMealsFormRef.value?.$el?.scrollIntoView(SCROLL_OPTIONS);
}

async function handleSelectMealOption(data: Record<string, any>) {
  hideForms();
  setSelectedMealOption(data);

  await nextTick();
  scrollToMealOptionForm();
}

async function handleSelectDailyMeal(data: Record<string, any>) {
  hideForms();
  setSelectedDailyMeal(data);
  
  await nextTick();
  scrollToDailyMealForm();
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
    <RightAlignContainer>
      <div class="flex gap-2">
        <div>
          <CommonButton 
            :text="'Add meal option'"
            @click="handleShowAddMealOption"/>
        </div>
        <div>
          <CommonButton 
            :text="'Add daily meal'"
            @click="handleShowAddDailyMeal"/>
        </div>
      </div>
    </RightAlignContainer>
    <SectionContainer
      :title="'Daily food intake'">
      <DatetimeSelectorWithLabel 
        :label="'Date'"
        :time="selectedDate"
        :show-time="false"
        @change-time="changeTime"/>
      <DailyFoodIntake 
        :date="selectedDate"
        :key="componentKey"
        @select-record="handleSelectDailyMeal"/>
    </SectionContainer>
    <SectionContainer
      :title="'Meal list'">
      <CustomizedMealList 
        :key="componentKey"
        @select-record="handleSelectMealOption"/>
    </SectionContainer>
    <MealContentForm
      v-if="showAddMealOption"
      ref="mealContentForm"
      @cancel-form="handleCancelForm"/>
    <MealContentForm
      v-if="selectedMealOption !== null"
      ref="mealContentForm"
      :action="'update'"
      :meal="selectedMealOption"
      @cancel-form="handleCancelForm"/>
    <DailyMealsForm
      v-if="showAddDailyMeal"
      ref="dailyMealsForm"
      @cancel-form="handleCancelForm"/>
    <DailyMealsForm
      v-if="selectedDailyMeal !== null"
      ref="dailyMealsForm"
      :action="'update'"
      :meal="selectedDailyMeal"
      @cancel-form="handleCancelForm"/>
  </div>
</template>