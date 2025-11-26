<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useDailyMeals } from '@/composables/useDailyMeals'
import { useMealOptions } from '@/composables/useMealOptions'
import SectionContainer from '@/components/Utils/containers/SectionContainer.vue'
import DatetimeSelectorWithLabel from '@/components/Utils/dates/DatetimeSelectorWithLabel.vue'
import LabeledTextbox from '@/components/Utils/textboxes/LabeledTextbox.vue'
import RightAlignContainer from '@/components/Utils/containers/RightAlignContainer.vue'
import AddButton from '@/components/Utils/buttons/AddButton.vue'
import CommonButton from '@/components/Utils/buttons/CommonButton.vue'
import LabeledSelect from '../Utils/dropdowns/LabeledSelect.vue'


const { user, isAuthReady } = useAuth();
const { addDailyMeal } = useDailyMeals();
const { getMealOptions } = useMealOptions();
const selectedDate = ref(new Date())
const selectedMeal = ref("")
const mealsInfo = ref<any[]>([])
const quantity = ref("")
const note = ref("")

const mealOptions = computed(() => {
  return mealsInfo.value.map(item => item.meal);
})

const mealInfo = computed(() => {
  if (selectedMeal.value === "") {
    return null;
  }

  return mealsInfo.value.find(item => item.meal === selectedMeal.value);
})

onMounted(() => {
  setMealOptions();
})

async function setMealOptions() {
  if (user.value === null) {
    console.error("User not logged in");
    return;
  }

  try {
    const querySnapshot = 
      await getMealOptions(user.value.uid);
    
    mealsInfo.value = querySnapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error("Error querying daily meals:", error);
  }
}

function changeTime(time: Date) {
  selectedDate.value = time;
}

function setSelectedMeal(meal: string) {
  selectedMeal.value = meal;
}

async function handleSubmitForm() {
  if (user.value === null) {
    console.error("User not logged in");
    return;
  }

  try {
    const docRef = await addDailyMeal({
      userId: user.value.uid,
      time: selectedDate.value.getTime(),
      meal: selectedMeal.value,
      protein: mealInfo.value.protein,
      carbohydrate: mealInfo.value.carbohydrate,
      fat: mealInfo.value.fat,
      weight: mealInfo.value.weight,
      quantity: quantity.value,
      note: note.value,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error writing document:", error);
  }
}

watch(
  isAuthReady,
  () => {
    setMealOptions();
  }
)
</script>

<template>
  <SectionContainer 
    :title="'Add daily meal'">
    <form 
      class="flex flex-col gap-6"
      @submit.prevent="handleSubmitForm">
      <div class="flex flex-col gap-4">
        <DatetimeSelectorWithLabel 
          :label="'Time'"
          :time="selectedDate"
          @change-time="changeTime"/>
        <LabeledSelect 
          :name="'Meal'"
          :label="'Meal'"
          :value="selectedMeal"
          :options="mealOptions" 
          @on-change-value="setSelectedMeal"/>
        <template v-if="mealInfo">
          <LabeledTextbox 
            v-model:text.number="mealInfo.protein"
            :label="'Protein (g)'"
            :name="'Protein'"
            :readonly="true"/>
          <LabeledTextbox 
            v-model:text.number="mealInfo.carbohydrate"
            :label="'Carbohydrate (g)'"
            :name="'Carbohydrate'"
            :readonly="true"/>
          <LabeledTextbox 
            v-model:text.number="mealInfo.fat"
            :label="'Fat (g)'"
            :name="'Fat'"
            :readonly="true"/>
          <LabeledTextbox 
            v-model:text.number="mealInfo.weight"
            :label="'Weight (g)'"
            :name="'Weight'"
            :readonly="true"/>
        </template>
        <LabeledTextbox 
          v-model:text.number="quantity"
          :label="'Quantity'"
          :name="'Quantity'"/>
        <LabeledTextbox 
          v-model:text="note"
          :label="'Note'"
          :name="'Note'"/>
      </div>
      <RightAlignContainer>
        <div class="flex flex-wrap gap-2">
          <AddButton 
            :button-type="'submit'"/>
          <CommonButton
            :text="'Cancel'" />
        </div>
      </RightAlignContainer>
    </form>
  </SectionContainer>
</template>