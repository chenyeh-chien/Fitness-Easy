<script setup lang="ts">
import { ref } from 'vue'
import SectionContainer from '@/components/Utils/containers/SectionContainer.vue'
import DailyFoodIntake from '@/components/Home/DailyFoodIntake.vue'
import RightAlignContainer from '@/components/Utils/containers/RightAlignContainer.vue'
import CommonButton from '@/components/Utils/buttons/CommonButton.vue'
import DailyMealsForm from '@/components/Meals/DailyMealsForm.vue'

interface Emits {
  (e: "updateComponentKey"): void;
}

const emits = defineEmits<Emits>();
const showAddDailyMeal = ref(false);
const selectedDailyMeal = ref<Record<string, any> | null>(null);

function setShowAddDailyMeal(value: boolean) {
  showAddDailyMeal.value = value;
}

function setSelectedDailyMeal(value: Record<string, any> | null) {
  selectedDailyMeal.value = value;
}

function handleShowAddDailyMeal() {
  hideForms();
  setShowAddDailyMeal(true);
}

function handleSelectDailyMeal(data: Record<string, any>) {
  hideForms();
  setSelectedDailyMeal(data);
}

function handleCancelForm() {
  hideForms();
  emits("updateComponentKey");
}

function hideForms() {
  setShowAddDailyMeal(false);
  setSelectedDailyMeal(null);
}
</script>

<template>
  <SectionContainer
    :title="'Daily food intake'">
    <DailyFoodIntake
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
  </SectionContainer>
</template>