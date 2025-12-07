<script setup lang="ts">
import { toRefs, ref, watch, computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useDailyTarget } from '@/composables/useDailyTarget'
import SectionContainer from '@/components/Utils/containers/SectionContainer.vue'
import DatetimeSelectorWithLabel from '@/components/Utils/dates/DatetimeSelectorWithLabel.vue'
import LabeledTextbox from '@/components/Utils/textboxes/LabeledTextbox.vue'
import RightAlignContainer from '@/components/Utils/containers/RightAlignContainer.vue'
import AddButton from '@/components/Utils/buttons/AddButton.vue'
import ConfirmButton from '@/components/Utils/buttons/ConfirmButton.vue'
import CommonButton from '@/components/Utils/buttons/CommonButton.vue'
import { formatDateStr } from '@/components/Utils/utilFunctions'

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
const formTitle = computed(() => {
  return action.value === "add" ? "Add daily target" : "Update daily target";
})

function setTargetInfo(info: Record<string, any>) {
  targetInfo.value = info;
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

  if (targetInfo.value === null) {
    console.error("Target info is null");
    return;
  }

  await addDailyTarget({
    userId: user.value.uid,
    date: targetInfo.value.date,
    protein: targetInfo.value.protein,
    carbohydrate: targetInfo.value.carbohydrate,
    fat: targetInfo.value.fat,
  });
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

  await updateDailyTarget({
    userId: user.value.uid,
    date: targetInfo.value.date,
    protein: targetInfo.value.protein,
    carbohydrate: targetInfo.value.carbohydrate,
    fat: targetInfo.value.fat,
  }, targetInfo.value.id);
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

  await deleteDailyTarget(targetInfo.value.id);
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