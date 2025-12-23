<script setup lang="ts">
import { ref, watch, toRefs, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useMealOptions } from '@/composables/useMealOptions'
import SectionContainer from '@/components/Utils/containers/SectionContainer.vue'
import LabeledTextbox from '@/components/Utils/textboxes/LabeledTextbox.vue'
import RightAlignContainer from '@/components/Utils/containers/RightAlignContainer.vue'
import ConfirmButton from '@/components/Utils/buttons/ConfirmButton.vue'
import AddButton from '@/components/Utils/buttons/AddButton.vue'
import CommonButton from '@/components/Utils/buttons/CommonButton.vue'
import {
  useSweetAlertAddRecord,
  useSweetAlertUpdateRecord,
  useSweetAlertDeleteRecord
} from '@/components/Utils/utilFunctions/index'

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
    protein: 0,
    carbohydrate: 0,
    fat: 0,
    weight: 0,
    unitCost: 0,
  })
})
const { action, meal } = toRefs(props);
const emits = defineEmits<Emits>();
const { user, isAuthReady } = useAuth();
const { 
  getMealOptions, 
  addMealOption,
  updateMealOption,
  deleteMealOption,
} = useMealOptions();
const mealInfo = ref<Record<string, any> | null>(null)

const formTitle = computed(() => {
  return action.value === "add" ? "Add meal option" : "Update meal option";
})

onMounted(() => {
  checkUserMealOptions();
})

function setMealInfo(info: Record<string, any>) {
  mealInfo.value = info;
}

async function checkUserMealOptions() {
  if (user.value === null) {
    console.error("User not logged in");
    return;
  }

  try {
    const querySnapshot = 
      await getMealOptions(
        user.value.uid
      );
    
    if (querySnapshot.empty) {
      console.log("No meals found for this user.");
    }
  } catch (error) {
    console.error("Error querying daily meals:", error);
  }
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
    addMealOption,
    [
      {
        userId: user.value.uid,
        meal: mealInfo.value.meal,
        protein: mealInfo.value.protein,
        carbohydrate: mealInfo.value.carbohydrate,
        fat: mealInfo.value.fat,
        weight: mealInfo.value.weight,
        unitCost: mealInfo.value.unitCost,
      }
    ]
  )

  if (!isExecuted) {
    return;
  }

  emits('cancelForm')
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
    updateMealOption,
    [
      {
        userId: user.value.uid,
        meal: mealInfo.value.meal,
        protein: mealInfo.value.protein,
        carbohydrate: mealInfo.value.carbohydrate,
        fat: mealInfo.value.fat,
        weight: mealInfo.value.weight,
        unitCost: mealInfo.value.unitCost,
      }, meal.value.id
    ]
  )

  if (!isExecuted) {
    return;
  }

  emits('cancelForm')
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
    deleteMealOption,
    meal.value.id
  )

  if (!isExecuted) {
    return;
  }

  emits('cancelForm')
}

watch(
  isAuthReady,
  () => {
    checkUserMealOptions();
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
      ...newValue
    });
  },
  { immediate: true, deep: true }
)
</script>

<template>
  <SectionContainer 
    :title="formTitle">
    <form 
      class="flex flex-col gap-6"
      @submit.prevent="handleSubmitForm">
      <div class="flex flex-col gap-4 md:flex-row md:flex-wrap">
        <LabeledTextbox 
          v-model:text="mealInfo!.meal"
          :label="'Meal'"
          :name="'Meal'"/>
        <LabeledTextbox 
          v-model:text.number="mealInfo!.protein"
          :label="'Protein (g)'"
          :name="'Protein'"/>
        <LabeledTextbox 
          v-model:text.number="mealInfo!.carbohydrate"
          :label="'Carbohydrate (g)'"
          :name="'Carbohydrate'"/>
        <LabeledTextbox 
          v-model:text.number="mealInfo!.fat"
          :label="'Fat (g)'"
          :name="'Fat'"/>
        <LabeledTextbox 
          v-model:text.number="mealInfo!.weight"
          :label="'Weight (g)'"
          :name="'Weight'"/>
        <LabeledTextbox 
          v-model:text.number="mealInfo!.unitCost"
          :label="'Cost (NTD)'"
          :name="'Cost'"/>
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