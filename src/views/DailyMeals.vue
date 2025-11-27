<script setup lang="ts">
import { ref } from 'vue'
import MealContentForm from '@/components/Meals/MealContentForm.vue'
import DailyMealsForm from '@/components/Meals/DailyMealsForm.vue'
import DailyFoodIntake from '@/components/Home/DailyFoodIntake.vue'
import SectionContainer from '@/components/Utils/containers/SectionContainer.vue'
import DatetimeSelectorWithLabel from '@/components/Utils/dates/DatetimeSelectorWithLabel.vue'
import MealList from '@/components/Meals/MealList.vue'

const selectedDate = ref(new Date())

function changeTime(time: Date) {
  selectedDate.value = time;
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <SectionContainer
      :title="'Meal list'">
      <MealList/>
    </SectionContainer>
    <SectionContainer
      :title="'Daily food intake'">
      <DatetimeSelectorWithLabel 
        :label="'Date'"
        :time="selectedDate"
        :show-time="false"
        @change-time="changeTime"/>
      <DailyFoodIntake 
        :date="selectedDate"/>
    </SectionContainer>
    <MealContentForm/>
    <DailyMealsForm/>
  </div>
</template>