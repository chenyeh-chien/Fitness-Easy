<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import TextTable from '../Utils/tables/TextTable.vue'
import { useAuth } from '@/composables/useAuth'
import { useMealOptions } from '@/composables/useMealOptions'
import { roundTo2 } from '@/components/Utils/utilFunctions'

interface Emits {
  (e: 'selectRecord', data: Record<string, any>): void
}

const emits = defineEmits<Emits>();
const { user, isAuthReady } = useAuth();
const { getMealOptions } = useMealOptions();

const LABELS = [{
  label: "Name",
  key: "meal",
}, {
  label: "Protein (g)",
  key: "protein",
}, {  
  label: "Carbohydrate (g)",
  key: "carbohydrate",
}, {
  label: "Fat (g)",
  key: "fat",
}, {
  label: "Weight (g)",
  key: "weight",
}]
const mealsInfo = ref<any[]>([]);

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
    
    mealsInfo.value =
       querySnapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          ...data,
          protein: roundTo2(data.protein),
          carbohydrate: roundTo2(data.carbohydrate),
          fat: roundTo2(data.fat),
          id: doc.id,
        }
       });

    console.log(mealsInfo.value);
  } catch (error) {
    console.error("Error querying daily meals:", error);
  }
}

function handleSelectRow(index: number) {
  const data = mealsInfo.value[index];
  emits('selectRecord', data);
}

watch(
  [isAuthReady],
  () => {
    setMealOptions();
  }
)
</script>

<template>
  <TextTable 
    :headers="LABELS"
    :data="mealsInfo"
    :clickable="true"
    @select-row="handleSelectRow"/>
</template> 