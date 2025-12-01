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
    
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });

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

    emits('cancelForm')
  } catch (error) {
    console.error("Error writing document:", error);
  }
}

async function handleDeleteForm() {
  try {
    await deleteRecord();

    emits('cancelForm')
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

  await addMealOption({
    userId: user.value.uid,
    meal: mealInfo.value.meal,
    protein: mealInfo.value.protein,
    carbohydrate: mealInfo.value.carbohydrate,
    fat: mealInfo.value.fat,
    weight: mealInfo.value.weight,
  });
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

  await updateMealOption({
    userId: user.value.uid,
    meal: mealInfo.value.meal,
    protein: mealInfo.value.protein,
    carbohydrate: mealInfo.value.carbohydrate,
    fat: mealInfo.value.fat,
    weight: mealInfo.value.weight,
  }, meal.value.id);
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

  await deleteMealOption(meal.value.id);
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

    setMealInfo(newValue);
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
      <div class="flex flex-col gap-4">
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