<script setup lang="ts">
import { nextTick, ref, useTemplateRef } from 'vue'
import MealContentForm from '@/components/Meals/MealContentForm.vue'
import DailyMealsForm from '@/components/Meals/DailyMealsForm.vue'
import DailyFoodIntake from '@/components/Home/DailyFoodIntake.vue'
import SectionContainer from '@/components/Utils/containers/SectionContainer.vue'
import DatetimeSelectorWithLabel from '@/components/Utils/dates/DatetimeSelectorWithLabel.vue'
import MealList from '@/components/Meals/MealList.vue'
import RightAlignContainer from '@/components/Utils/containers/RightAlignContainer.vue'
import CommonButton from '@/components/Utils/buttons/CommonButton.vue'


const selectedDate = ref(new Date())
const showAddMealOption = ref(false)
const showAddDailyMeal = ref(false)
const componentKey = ref(0)
const mealContentFormRef = useTemplateRef('mealContentForm')
const dailyMealsFormRef = useTemplateRef('dailyMealsForm')
const selectedDailyMeal = ref<Record<string, any> | null>(null);

function changeTime(time: Date) {
  selectedDate.value = time;
}

function setShowAddMealOption(value: boolean) {
  showAddMealOption.value = value;
}

function setShowAddDailyMeal(value: boolean) {
  showAddDailyMeal.value = value;
}

function setSelectedDailyMeal(value: Record<string, any> | null) {
  selectedDailyMeal.value = value;
}

async function handleShowAddMealOption() {
  setShowAddMealOption(true);

  await nextTick();
  mealContentFormRef.value?.$el?.scrollIntoView({
    behavior: 'smooth',
  });
}

async function handleShowAddDailyMeal() {
  setShowAddDailyMeal(true);

  await nextTick();
  dailyMealsFormRef.value?.$el?.scrollIntoView({
    behavior: 'smooth',
  });
}

function handleSelectDailyMeal(data: Record<string, any>) {
  setSelectedDailyMeal(data);
}

function cancelMealOptionForm() {
  setShowAddMealOption(false);
  componentKey.value++;
}

function cancelDailyMealForm() {
  setShowAddDailyMeal(false);
  setSelectedDailyMeal(null);
  componentKey.value++;
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
      :title="'Meal list'">
      <MealList :key="componentKey"/>
    </SectionContainer>
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
    <MealContentForm
      v-if="showAddMealOption"
      ref="mealContentForm"
      @cancel-form="cancelMealOptionForm"/>
    <DailyMealsForm
      v-if="showAddDailyMeal"
      ref="dailyMealsForm"
      @cancel-form="cancelDailyMealForm"/>
    <DailyMealsForm
      v-if="selectedDailyMeal !== null"
      ref="dailyMealsForm"
      :action="'update'"
      :meal="selectedDailyMeal"
      @cancel-form="cancelDailyMealForm"/>
  </div>
</template>