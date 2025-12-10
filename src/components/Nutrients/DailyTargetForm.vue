<script setup lang="ts">
import { toRefs, ref, watch, computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useDailyTarget } from '@/composables/useDailyTarget'
import SectionContainer from '@/components/Utils/containers/SectionContainer.vue'
import DatetimeSelectorWithLabel from '@/components/Utils/dates/DatetimeSelectorWithLabel.vue'
import LabeledSelect from '@/components/Utils/dropdowns/LabeledSelect.vue'
import LabeledTextbox from '@/components/Utils/textboxes/LabeledTextbox.vue'
import RightAlignContainer from '@/components/Utils/containers/RightAlignContainer.vue'
import AddButton from '@/components/Utils/buttons/AddButton.vue'
import ConfirmButton from '@/components/Utils/buttons/ConfirmButton.vue'
import CommonButton from '@/components/Utils/buttons/CommonButton.vue'
import { 
  formatDateStr, 
  useSweetAlert,
  useSweetAlertAddRecord,
  useSweetAlertUpdateRecord,
  useSweetAlertDeleteRecord
} from '@/components/Utils/utilFunctions/index'

interface Props {
  action?: "add" | "update";
  target?: Record<string, any>;
}

interface Emits {
  (e: 'cancelForm'): void;
}

const props = withDefaults(defineProps<Props>(), {
  action: "add",
  target: () => ({
    date: formatDateStr(new Date(), false),
    protein: 0,
    carbohydrate: 0,
    fat: 0,
  })
})
const { action, target } = toRefs(props);
const emits = defineEmits<Emits>();
const { user, isAuthReady } = useAuth();
const { 
  getDailyTargets, 
  addDailyTarget,
  updateDailyTarget,
  deleteDailyTarget,
} = useDailyTarget();
const targetInfo = ref<Record<string, any> | null>(props.target);
const calorieGoal = ref<'Bulk' | 'Cut'>("Bulk");
const totalCalories = ref(2500);
const formTitle = computed(() => {
  return action.value === "add" ? "Add daily target" : "Update daily target";
})

function setTargetInfo(info: Record<string, any>) {
  targetInfo.value = info;
}

function setCalorieGoal(goal: string) {
  if (goal !== 'Bulk' && goal !== 'Cut') {
    return;
  }

  calorieGoal.value = goal;
}

function setCalculatedNutrients(
  calories: number, 
  goal: 'Bulk' | 'Cut'
) {
  if (
    action.value === "update" ||
    typeof calories !== 'number' ||
    targetInfo.value === null
  ) {
    return;
  }

  switch(goal) {
    case "Bulk":
      targetInfo.value.protein = Math.round(calories * 0.12 / 4);
      targetInfo.value.carbohydrate = Math.round(calories * 0.68 / 4);
      targetInfo.value.fat = Math.round(calories * 0.2 / 9);
      break;
    case "Cut":
      targetInfo.value.protein = Math.round(calories * 0.3 / 4);
      targetInfo.value.carbohydrate = Math.round(calories * 0.3 / 4);
      targetInfo.value.fat = Math.round(calories * 0.4 / 9);
      break;
    default:
      return;
  }
}

async function checkUserDailyTarget() {
  if (user.value === null) {
    console.error("User not logged in");
    return;
  }

  try {
    const querySnapshot = 
      await getDailyTargets(user.value.uid);
    
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });

    if (querySnapshot.empty) {
      console.log("No targets found for this user.");
    }
  } catch (error) {
    console.error("Error querying daily targets:", error);
  }
}

function changeTime(time: Date) {
  targetInfo.value!.date = formatDateStr(time, false);
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

  if (targetInfo.value === null) {
    console.error("Target info is null");
    return;
  }

  const isExecuted = await useSweetAlertAddRecord(
    addDailyTarget,
    [
      {
        userId: user.value.uid,
        date: targetInfo.value.date,
        protein: targetInfo.value.protein,
        carbohydrate: targetInfo.value.carbohydrate,
        fat: targetInfo.value.fat,
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

  if (targetInfo.value === null) {
    console.error("Target info is null");
    return;
  }

  const isExecuted = await useSweetAlertUpdateRecord(
    updateDailyTarget,
    [
      {
        userId: user.value.uid,
        date: targetInfo.value.date,
        protein: targetInfo.value.protein,
        carbohydrate: targetInfo.value.carbohydrate,
        fat: targetInfo.value.fat,
      },
      targetInfo.value.id
    ]
  );

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

  if (targetInfo.value === null) {
    console.error("Target info is null");
    return;
  }

  const isExecuted = await useSweetAlertDeleteRecord(
    deleteDailyTarget,
    [targetInfo.value.id]
  );

  if (!isExecuted) {
    return;
  }

  emits('cancelForm');
}

watch(
  isAuthReady,
  () => {
    checkUserDailyTarget();
  }
)

watch(
  target,
  (newValue) => {
    if (!newValue) {
      return;
    }

    setTargetInfo(newValue);
  },
  { immediate: true, deep: true }
)

watch(
  [calorieGoal, totalCalories],
  (newValue) => {
    if (!newValue) {
      return;
    }

    setCalculatedNutrients(totalCalories.value, calorieGoal.value);
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
        <DatetimeSelectorWithLabel 
          :label="'Date'"
          :time="new Date(targetInfo!.date)"
          :show-time="false"
          @change-time="changeTime"/>
        <template v-if="action === 'add'">
          <LabeledSelect 
            :label="'Calorie goal'"
            :name="'Calorie goal'"
            :value="calorieGoal"
            :options="['Bulk', 'Cut']"
            @on-change-value="setCalorieGoal"/>
          <LabeledTextbox 
            v-model:text.number="totalCalories"
            :label="'Total calories'"
            :name="'Total calories'"/>
        </template>
        <LabeledTextbox 
          v-model:text.number="targetInfo!.protein"
          :label="'Protein'"
          :name="'Protein'"/>
        <LabeledTextbox 
          v-model:text.number="targetInfo!.carbohydrate"
          :label="'Carbohydrate'"
          :name="'Carbohydrate'"/>
        <LabeledTextbox 
          v-model:text.number="targetInfo!.fat"
          :label="'Fat'"
          :name="'Fat'"/>
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