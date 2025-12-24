<script setup lang="ts">
import { ref, watch, computed, onMounted, toRefs } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useDailyMeals } from '@/composables/useDailyMeals'
import { useMealOptions } from '@/composables/useMealOptions'
import SectionContainer from '@/components/Utils/containers/SectionContainer.vue'
import DatetimeSelectorWithLabel from '@/components/Utils/dates/DatetimeSelectorWithLabel.vue'
import LabeledSearchBoxWithResult from '@/components/Utils/textboxes/LabeledSearchBoxWithResult.vue'
import LabeledTextbox from '@/components/Utils/textboxes/LabeledTextbox.vue'
import RightAlignContainer from '@/components/Utils/containers/RightAlignContainer.vue'
import AddButton from '@/components/Utils/buttons/AddButton.vue'
import ConfirmButton from '@/components/Utils/buttons/ConfirmButton.vue'
import CommonButton from '@/components/Utils/buttons/CommonButton.vue'
import LabeledSelect from '../Utils/dropdowns/LabeledSelect.vue'
import {
  useSweetAlertAddRecord,
  useSweetAlertUpdateRecord,
  useSweetAlertDeleteRecord
} from '@/components/Utils/utilFunctions/index'
import { roundTo2 } from '@/components/Utils/utilFunctions/index'

interface Props {
  action?: "add" | "update";
  meal?: Record<string, any>;
}

interface Emits {
  (e: 'cancelForm'): void;
}

const props = withDefaults(defineProps<Props>(), {
  action: "add",
  meal: () => ({
    meal: "",
    time: new Date().getTime(),
    protein: 0,
    carbohydrate: 0,
    fat: 0,
    weight: 0,
    quantity: 1,
    unitCost: 0,
    totalCost: 0,
    note: "",
  })
})
const { action, meal } = toRefs(props);
const emits = defineEmits<Emits>();
const { user, isAuthReady } = useAuth();
const { 
  addDailyMeal, 
  updateDailyMeal, 
  deleteDailyMeal 
} = useDailyMeals();
const { getMealOptions } = useMealOptions();
const mealInfo = ref<Record<string, any> | null>(null)
const mealsInfo = ref<any[]>([])
const selectedMeal = ref<string | null>(null);

const formTitle = computed(() => {
  return action.value === "add" ? "Add daily meal" : "Update daily meal";
})

const mealOptions = computed(() => {
  return mealsInfo.value.map(item => item.meal);
})

const calculatedCost = computed(() => {
  if (!mealInfo.value || !mealInfo.value.unitCost) {
    return 0;
  }

  return roundTo2(mealInfo.value!.quantity * mealInfo.value!.unitCost);
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
  mealInfo.value!.time = time.getTime();
}

function setMealInfo(info: Record<string, any>) {
  mealInfo.value = info;
}

function setSelectedMeal(meal: string) {
  selectedMeal.value = meal;
}

async function handleSubmitForm() {
  try {
    action.value === "add" ? await addRecord() : await updateRecord();
  } catch (error) {
    console.error("Error writing document:", error);
  }
}

async function handleDeleteForm() {
  try {
    await deleteRecord();
  } catch (error) {
    console.error("Error deleting document:", error);
  }
}

async function addRecord() {
  if (user.value === null) {
    console.error("User not logged in");
    return;
  }

  if (mealInfo.value === null) {
    console.error("Meal info is null");
    return;
  }

  const isExecuted = await useSweetAlertAddRecord(
    addDailyMeal,
    [
      {
        userId: user.value.uid,
        time: mealInfo.value.time,
        meal: mealInfo.value.meal,
        protein: mealInfo.value.protein,
        carbohydrate: mealInfo.value.carbohydrate,
        fat: mealInfo.value.fat,
        weight: mealInfo.value.weight,
        quantity: mealInfo.value.quantity,
        unitCost: mealInfo.value.unitCost,
        totalCost: mealInfo.value.totalCost,
        note: mealInfo.value.note,
      }
    ]
  );

  if (!isExecuted) {
    return;
  }

  emits('cancelForm');
}

async function updateRecord() {
  if (user.value === null) {
    console.error("User not logged in");
    return;
  }

  if (mealInfo.value === null) {
    console.error("Meal info is null");
    return;
  }

  const isExecuted = await useSweetAlertUpdateRecord(
    updateDailyMeal,
    [
      {
        userId: user.value.uid,
        time: mealInfo.value.time,
        meal: mealInfo.value.meal,
        protein: mealInfo.value.protein,
        carbohydrate: mealInfo.value.carbohydrate,
        fat: mealInfo.value.fat,
        weight: mealInfo.value.weight,
        quantity: mealInfo.value.quantity,
        unitCost: mealInfo.value.unitCost,
        totalCost: mealInfo.value.totalCost,
        note: mealInfo.value.note,
      }, 
      meal.value.id
    ]
  )

  if (!isExecuted) {
    return;
  }

  emits('cancelForm');
}

async function deleteRecord() {
  if (user.value === null) {
    console.error("User not logged in");
    return;
  }

  if (meal.value === null) {
    console.error("Meal is null");
    return;
  }

  const isExecuted = await useSweetAlertDeleteRecord(
    deleteDailyMeal,
    [meal.value.id]
  )

  if (!isExecuted) {
    return;
  }

  emits('cancelForm');
}

watch(
  isAuthReady,
  () => {
    setMealOptions();
  }
)

watch(
  meal,
  (newValue) => {
    if (!newValue) {
      return;
    }

    setMealInfo({
      unitCost: 0,
      totalCost: 0,
      ...newValue,
    });
    setSelectedMeal(newValue.meal);
  },
  { immediate: true, deep: true }
)

watch(
  selectedMeal,
  (newValue) => {
    if (!newValue) {
      return
    }

    setMealInfo({
      ...mealInfo.value,
      ...mealsInfo.value.find((item) => item.meal === newValue),
    });
  }
)

watch(
  calculatedCost,
  (newValue) => {
    if (!mealInfo.value) {
      return;
    }

    mealInfo.value.totalCost = newValue;
  }
)
</script>

<template>
  <SectionContainer 
    :title="formTitle">
    <form 
      class="flex flex-col gap-6"
      @submit.prevent="handleSubmitForm">
      <div class="flex flex-col gap-4 md:flex-row md:flex-wrap">
        <DatetimeSelectorWithLabel 
          :label="'Time'"
          :time="new Date(mealInfo!.time)"
          @change-time="changeTime"/>
        <LabeledSearchBoxWithResult
          v-if="action === 'add'" 
          v-model:text="mealInfo!.meal"
          :name="'Meal'"
          :label="'Meal'"
          :results="mealOptions"
          @on-change-value="setSelectedMeal"/>
        <LabeledTextbox 
          v-else
          v-model:text="mealInfo!.meal"
          :label="'Meal'"
          :name="'Meal'"/>
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
          <LabeledTextbox 
            v-model:text.number="mealInfo.unitCost"
            :label="'Unit Cost (NTD)'"
            :name="'Unit Cost'"
            :readonly="true"/>
        </template>
        <LabeledTextbox 
          v-model:text.number="mealInfo!.quantity"
          :label="'Quantity'"
          :name="'Quantity'"/>
        <LabeledTextbox 
          v-model:text.number="mealInfo!.totalCost"
          :label="'Cost (NTD)'"
          :name="'Cost'"/>
        <LabeledTextbox 
          v-model:text="mealInfo!.note"
          :label="'Note'"
          :name="'Note'"/>
      </div>
      <RightAlignContainer>
        <div class="flex flex-wrap gap-2">
          <template v-if="action === 'update'">
            <ConfirmButton
              :text="'Update'"
              :button-type="'submit'"/>
            <ConfirmButton
              :text="'Delete'"
              @click="handleDeleteForm"/>
          </template>
          <AddButton 
            v-else
            :button-type="'submit'"/>
          <CommonButton
            :text="'Cancel'" 
            @click="emits('cancelForm')"/>
        </div>
      </RightAlignContainer>
    </form>
  </SectionContainer>
</template>