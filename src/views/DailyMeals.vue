<script setup lang="ts">
import { ref } from 'vue'
import DailySummary from '@/components/Home/DailySummary.vue'
import MealContentForm from '@/components/Meals/MealContentForm.vue'
import DailyMealsForm from '@/components/Meals/DailyMealsForm.vue'
import DailyFoodIntakeMain from '@/components/Meals/DailyFoodIntakeMain.vue'
import SectionContainer from '@/components/Utils/containers/SectionContainer.vue'
import CustomizedMealList from '@/components/Meals/CustomizedMealList.vue'
import RightAlignContainer from '@/components/Utils/containers/RightAlignContainer.vue'
import CommonButton from '@/components/Utils/buttons/CommonButton.vue'

const showAddMealOption = ref(false)
const componentKey = ref(0)
const selectedMealOption = ref<Record<string, any> | null>(null)

function setShowAddMealOption(value: boolean) {
  showAddMealOption.value = value;
}

function setSelectedMealOption(value: Record<string, any> | null) {
  selectedMealOption.value = value;
}

async function handleShowAddMealOption() {
  hideForms();
  setShowAddMealOption(true);
}

async function handleSelectMealOption(data: Record<string, any>) {
  hideForms();
  setSelectedMealOption(data)
}

function updateComponentKey() {
  componentKey.value++;
}

function handleCancelForm() {
  hideForms();
  updateComponentKey();
}

function hideForms() {
  setShowAddMealOption(false);
  setSelectedMealOption(null);
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <SectionContainer 
      class="w-full"
      :title="'Daily summary'">
      <DailySummary 
        :key="componentKey" />
    </SectionContainer>
    <DailyFoodIntakeMain 
      :key="componentKey"
      @update-component-key="updateComponentKey"/>
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