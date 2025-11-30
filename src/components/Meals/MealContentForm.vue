<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useMealOptions } from '@/composables/useMealOptions'
import SectionContainer from '@/components/Utils/containers/SectionContainer.vue'
import DatetimeSelectorWithLabel from '@/components/Utils/dates/DatetimeSelectorWithLabel.vue'
import LabeledTextbox from '@/components/Utils/textboxes/LabeledTextbox.vue'
import RightAlignContainer from '@/components/Utils/containers/RightAlignContainer.vue'
import AddButton from '@/components/Utils/buttons/AddButton.vue'
import CommonButton from '@/components/Utils/buttons/CommonButton.vue'

interface Emits {
  (e: 'cancelForm'): void;
}

const emits = defineEmits<Emits>();
const { user, isAuthReady } = useAuth();
const { getMealOptions, addMealOption } = useMealOptions();
const meal = ref("")
const protein = ref("")
const carbohydrate = ref("")
const fat = ref("")
const weight = ref("")
const note = ref("")

watch(
  isAuthReady,
  () => {
    checkUserMealOptions();
  }
)

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
  if (user.value === null) {
    console.error("User not logged in");
    return;
  }

  try {
    const docRef = await addMealOption({
      userId: user.value.uid,
      meal: meal.value,
      protein: protein.value,
      carbohydrate: carbohydrate.value,
      fat: fat.value,
      weight: weight.value,
      note: note.value,
    });
    console.log("Document written with ID: ", docRef.id);
    
    emits('cancelForm')
  } catch (error) {
    console.error("Error writing document:", error);
  }
}
</script>

<template>
  <SectionContainer 
    :title="'Add meal option'">
    <form 
      class="flex flex-col gap-6"
      @submit.prevent="handleSubmitForm">
      <div class="flex flex-col gap-4">
        <LabeledTextbox 
          v-model:text="meal"
          :label="'Meal'"
          :name="'Meal'"/>
        <LabeledTextbox 
          v-model:text.number="protein"
          :label="'Protein (g)'"
          :name="'Protein'"/>
        <LabeledTextbox 
          v-model:text.number="carbohydrate"
          :label="'Carbohydrate (g)'"
          :name="'Carbohydrate'"/>
        <LabeledTextbox 
          v-model:text.number="fat"
          :label="'Fat (g)'"
          :name="'Fat'"/>
        <LabeledTextbox 
          v-model:text.number="weight"
          :label="'Weight (g)'"
          :name="'Weight'"/>
      </div>
      <RightAlignContainer>
        <div class="flex flex-wrap gap-2">
          <AddButton 
            :button-type="'submit'"/>
          <CommonButton
            :text="'Cancel'" 
            @click="emits('cancelForm')"/>
        </div>
      </RightAlignContainer>
    </form>
  </SectionContainer>
</template>