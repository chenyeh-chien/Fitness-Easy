<script setup lang="ts">
import { toRefs, ref, computed, watch } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useBodyInfo } from '@/composables/useBodyInfo'
import RightAlignContainer from '@/components/Utils/containers/RightAlignContainer.vue'
import LabeledTextbox from '@/components/Utils/textboxes/LabeledTextbox.vue'
import LabeledSelect from '@/components/Utils/dropdowns/LabeledSelect.vue'
import DatetimeSelectorWithLabel from '@/components/Utils/dates/DatetimeSelectorWithLabel.vue'
import CommonButton from '@/components/Utils/buttons/CommonButton.vue'
import AddButton from '@/components/Utils/buttons/AddButton.vue'
import ConfirmButton from '@/components/Utils/buttons/ConfirmButton.vue'
import { 
  formatDateStr,
  useSweetAlertAddRecord,
  useSweetAlertUpdateRecord,
  useSweetAlertDeleteRecord
} from '@/components/Utils/utilFunctions/index'
import CommonDrawer from '@/components/Utils/drawer/CommonDrawer.vue'

interface Props {
  open: boolean;
  action?: "add" | "update";
  info?: Record<string, any>;
}

interface Emits {
  (e: 'cancelForm'): void;
}

const props = withDefaults(defineProps<Props>(), {
  action: "add",
  info: () => ({
    firstName: "",
    lastName: "",
    birthDate: formatDateStr(new Date(), false),
    gender: "M",
    height: 175,
  })
})
const { open, action, info } = toRefs(props);
const emits = defineEmits<Emits>();
const { user } = useAuth();
const { 
  addBodyInfo, 
  updateBodyInfo, 
  deleteBodyInfo 
} = useBodyInfo();
const bodyInfo = ref<Record<string, any> | null>(info.value);
const formTitle = computed(() => {
  return action.value === "add" ? "Add body info" : "Update body info";
})

function setBodyInfo(info: Record<string, any>) {
  bodyInfo.value = info;
}

function setGender(gender: string) {
  bodyInfo.value!.gender = gender;
}

function changeTime(time: Date) {
  bodyInfo.value!.birthDate = formatDateStr(time, false);
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

  if (bodyInfo.value === null) {
    console.error("Body info is null");
    return;
  }

  const isExecuted = await useSweetAlertAddRecord(
    [addBodyInfo],
    [
      [
        {
          userId: user.value.uid,
          firstName: bodyInfo.value.firstName,
          lastName: bodyInfo.value.lastName,
          birthDate: bodyInfo.value.birthDate,
          gender: bodyInfo.value.gender,
          height: bodyInfo.value.height,
        }
      ]
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

  if (bodyInfo.value === null) {
    console.error("Body info is null");
    return;
  }

  const isExecuted = await useSweetAlertUpdateRecord(
    [updateBodyInfo],
    [
      [
        {
          userId: user.value.uid,
          firstName: bodyInfo.value.firstName,
          lastName: bodyInfo.value.lastName,
          birthDate: bodyInfo.value.birthDate,
          gender: bodyInfo.value.gender,
          height: bodyInfo.value.height,
        }, info.value.id
      ]
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

  if (info.value === null) {
    console.error("Body info is null");
    return;
  }

  const isExecuted = await useSweetAlertDeleteRecord(
    [deleteBodyInfo],
    [
      [info.value.id]
    ]
  );

  if (!isExecuted) {
    return;
  }

  emits('cancelForm');
}

watch(
  info,
  (newValue) => {
    if (!newValue) {
      return;
    }

    setBodyInfo(newValue);
  },
  { immediate: true, deep: true }
)
</script>

<template>
  <CommonDrawer
    :open="open"
    :title="formTitle"
    @close-drawer="emits('cancelForm')">
    <form
      class="flex flex-col gap-6"
      @submit.prevent="handleSubmitForm">
      <div class="flex flex-col gap-4 md:flex-row md:flex-wrap">
        <LabeledTextbox 
          v-model:text="bodyInfo!.firstName"
          :label="'First name'"
          :name="'First name'"/>
        <LabeledTextbox 
          v-model:text="bodyInfo!.lastName"
          :label="'Last name'"
          :name="'Last name'"/>
        <DatetimeSelectorWithLabel 
          :label="'Birth date'"
          :time="new Date(bodyInfo!.birthDate)"
          :show-time="false"
          @change-time="changeTime"/>
        <LabeledSelect
          :label="'Gender'"
          :name="'Gender'"
          :value="bodyInfo!.gender"
          :options="['M', 'F']"
          @on-change-value="setGender"/>
        <LabeledTextbox 
          v-model:text="bodyInfo!.height"
          :label="'Height (cm)'"
          :name="'Height'"/>
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
  </CommonDrawer>
</template>
