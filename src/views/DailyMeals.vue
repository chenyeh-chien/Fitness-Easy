<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import MealContentForm from '@/components/Meals/MealContentForm.vue'
import DailyMealsForm from '@/components/Meals/DailyMealsForm.vue'
import DailyFoodIntake from '@/components/Home/DailyFoodIntake.vue'
import SectionContainer from '@/components/Utils/containers/SectionContainer.vue'
import DatetimeSelectorWithLabel from '@/components/Utils/dates/DatetimeSelectorWithLabel.vue'
import MealList from '@/components/Meals/MealList.vue'
import RightAlignContainer from '@/components/Utils/containers/RightAlignContainer.vue'
import CommonButton from '@/components/Utils/buttons/CommonButton.vue'


const router = useRouter()
const selectedDate = ref(new Date())
const showAddMealOption = ref(false)
const showAddDailyMeal = ref(false)

function changeTime(time: Date) {
  selectedDate.value = time;
}

function setShowAddMealOption(value: boolean) {
  showAddMealOption.value = value;
}

function setShowAddDailyMeal(value: boolean) {
  showAddDailyMeal.value = value;
}

function cancelMealOptionForm() {
  setShowAddMealOption(false);
  router.go(0);
}

function cancelDailyMealForm() {
  setShowAddDailyMeal(false);
  router.go(0);
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <RightAlignContainer>
      <div class="flex gap-2">
        <div>
          <CommonButton 
            :text="'Add meal option'"
            @click="showAddMealOption = true"/>
        </div>
        <div>
          <CommonButton 
            :text="'Add daily meal'"
            @click="showAddDailyMeal = true"/>
        </div>
      </div>
    </RightAlignContainer>
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
    <MealContentForm
      v-if="showAddMealOption"
      @cancel-form="cancelMealOptionForm"/>
    <DailyMealsForm
      v-if="showAddDailyMeal"
      @cancel-form="cancelDailyMealForm"/>
  </div>
</template>