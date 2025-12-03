<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useDailyTarget } from '@/composables/useDailyTarget'
import SectionContainer from '@/components/Utils/containers/SectionContainer.vue'
import DatetimeSelectorWithLabel from '@/components/Utils/dates/DatetimeSelectorWithLabel.vue'
import LabeledTextbox from '@/components/Utils/textboxes/LabeledTextbox.vue'
import RightAlignContainer from '@/components/Utils/containers/RightAlignContainer.vue'
import AddButton from '@/components/Utils/buttons/AddButton.vue'
import CommonButton from '@/components/Utils/buttons/CommonButton.vue'
import { formatDateStr } from '@/components/Utils/utilFunctions'


const { user, isAuthReady } = useAuth();
const { getDailyTargets, addDailyTarget } = useDailyTarget();
const selectedDate = ref(new Date())
const protein = ref("")
const carbohydrate = ref("")
const fat = ref("")

watch(
  isAuthReady,
  () => {
    checkUserDailyTarget();
  }
)

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
  selectedDate.value = time;
}

async function handleSubmitForm() {
  if (user.value === null) {
    console.error("User not logged in");
    return;
  }

  try {
    const docRef = await addDailyTarget({
      userId: user.value.uid,
      date: formatDateStr(selectedDate.value, false),
      protein: protein.value,
      carbohydrate: carbohydrate.value,
      fat: fat.value,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error writing document:", error);
  }
} 
</script>

<template>
  <SectionContainer 
    :title="'Add daily target'">
    <form 
      class="flex flex-col gap-6"
      @submit.prevent="handleSubmitForm">
      <div class="flex flex-col gap-4">
        <DatetimeSelectorWithLabel 
          :label="'Date'"
          :time="selectedDate"
          :show-time="false"
          @change-time="changeTime"/>
        <LabeledTextbox 
          v-model:text.number="protein"
          :label="'Protein'"
          :name="'Protein'"/>
        <LabeledTextbox 
          v-model:text.number="carbohydrate"
          :label="'Carbohydrate'"
          :name="'Carbohydrate'"/>
        <LabeledTextbox 
          v-model:text.number="fat"
          :label="'Fat'"
          :name="'Fat'"/>
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